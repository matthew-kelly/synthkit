<script lang="ts">
	import { browser } from '$app/environment';
	import { fade, fly } from 'svelte/transition';
	import { tweened } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { onDestroy, onMount, tick } from 'svelte';
	import * as Tone from 'tone';
	import { drumkits, sample_sets } from '$lib/sample_sets';
	import { synth, players, players_volume, current_id, synth_options } from '$db/stores';
	import { db, type Drums, type Melody, type TrackName, type Id } from '$db/db';
	import Keyboard from './Keyboard.svelte';
	import { beforeNavigate, goto } from '$app/navigation';
	import KeyboardControls from './KeyboardControls.svelte';
	import DrumPad from './DrumPad.svelte';
	import Controls from './Controls.svelte';
	import Chart from './Chart.svelte';
	import SynthOptions from './SynthOptions.svelte';
	import DrumkitOptions from './DrumkitOptions.svelte';

	// FIXME: audio is distorted on android
	// FIXME: audio doesn't play on iOS?

	const initial_length = 16;
	export let melody: Melody = Array(initial_length).fill([]);
	export let drums: Drums = Array(initial_length).fill([]);
	export let bpm: Tone.Unit.BPM = 80;
	export let title = '';
	export let id: Id; // song id
	$: $current_id = id;

	const beat_width = 44;
	const notes_by_octave: Melody = [
		['C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1'],
		['C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2'],
		['C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3'],
		['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
		['C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5'],
		['C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6'],
		['C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7'],
	];
	const tween_progress = tweened(0, {
		duration: (from, to) => {
			// 100ms, plus 0.1ms * distance
			return 100 + 0.1 * Math.max(0, Math.abs(to - from) - beat_width);
		},
		easing: cubicOut,
	});

	let is_tweening = false;
	let song_is_loaded = false;
	let setup_has_finished = false;
	let playback_state: Tone.PlaybackState = 'stopped';

	let melody_part: Tone.Part;
	let notes_to_play: {
		index: number;
		note: Tone.Unit.Frequency[];
		time: Tone.Unit.Time;
	}[] = [];
	let drums_part: Tone.Part;
	let drums_to_play: {
		samples: string[];
		time: Tone.Unit.Time;
	}[] = [];

	let current_track_name: TrackName = 'melody';
	let current_drumkit = 'TR808';
	let current_beat = 0;
	let current_octave = 2; // index of notes_by_octave, start in C3
	let volume = -6;
	let synth_options_is_open = false;
	let drumkit_options_is_open = false;

	$: drumkit = drumkits[current_drumkit];
	$: samples = sample_sets[current_drumkit];
	$: track_length = melody.length;
	$: is_ready = song_is_loaded && setup_has_finished;

	async function get_song() {
		try {
			const song = await db.songs.get($current_id);

			if (!song) {
				console.log('no song found');
				return goto('/songs', { replaceState: true, invalidateAll: true });
			}

			current_drumkit = song.options.drumkit;
			melody = song.melody;
			drums = song.drums;
			bpm = song.options.bpm;
			$synth_options = song.options.synth;
			title = song.title;
		} catch (error) {
			console.log('get_song error', error);
			return goto('/songs', { replaceState: true, invalidateAll: true });
		}
	}

	// FIXME: notes/drums added during playback do not play until pausing and restarting track
	function prepare_to_play() {
		Tone.Transport.loopEnd = `0:0:${track_length}`;
		melody.forEach((note, index) => {
			const time = `0:0:${index}`;
			notes_to_play[index] = {
				time,
				note,
				index,
			};
		});
		drums.forEach((samples, i) => {
			const time = `0:0:${i}`;
			drums_to_play[i] = {
				time,
				samples,
			};
		});
		if (melody_part) melody_part.dispose();
		if (drums_part) drums_part.dispose();

		drums_part = new Tone.Part((time, details) => {
			details.samples.forEach((sample) => {
				$players?.player(sample).start(time);
			});
		}, drums_to_play).start(0);

		melody_part = new Tone.Part((time, details) => {
			current_beat = details.index;
			$synth?.triggerAttackRelease(details.note, '16n', time);

			// call at end of loop to prepare next loop with any new notes added
			if (details.index === notes_to_play.length - 1) prepare_to_play();
		}, notes_to_play).start(0);
	}

	async function play_track() {
		await Tone.loaded();
		await Tone.start();
		prepare_to_play();
		playback_state = 'started';
		is_tweening = true;
		Tone.Transport.start('+0', `0:0:${current_beat}`);
	}
	function pause_track() {
		playback_state = 'paused';
		is_tweening = false;
		Tone.Transport.pause();
	}

	async function jump_to_beat(beat: number) {
		is_tweening = true;
		current_beat = beat;
		await tween_progress.set(current_beat * beat_width);
		await tick();
		is_tweening = false;
	}
	async function prev_beat() {
		if (current_beat === 0) {
			await jump_to_beat(track_length - 1);
			return;
		}
		await jump_to_beat(current_beat - 1);
	}
	async function next_beat() {
		if (current_beat === track_length - 1) {
			await jump_to_beat(0);
			return;
		}
		await jump_to_beat(current_beat + 1);
	}
	async function add_beat(beats: number) {
		if (beats <= 0) return;
		const prev_length = track_length;
		const beats_to_add = Array(beats).fill([]);
		melody = [...melody, ...beats_to_add];
		drums = [...drums, ...beats_to_add];
		// @ts-ignore
		db.songs.update($current_id, { melody, drums });

		await jump_to_beat(prev_length);
	}
	async function remove_beat(beats: number) {
		if (beats <= 0 || melody.length <= 4) return;
		let timeout = 0;
		// only delay bar removal if there are notes to be removed
		for (let i = melody.length - 4; i < melody.length; i++) {
			if (melody[i].length || drums[i].length) {
				melody[i] = [];
				drums[i] = [];
				timeout = 200; // delay while note/drum exit animation plays
			}
		}
		setTimeout(async () => {
			const old_length = melody.length;
			melody.splice(melody.length - beats, beats);
			drums.splice(drums.length - beats, beats);
			melody = [...melody];
			drums = [...drums];
			// @ts-ignore
			db.songs.update($current_id, { melody, drums });

			if (current_beat >= old_length - 1 - beats) {
				await jump_to_beat(melody.length - 1);
			}
		}, timeout);
	}

	async function switch_drumkits() {
		drums = Array(drums.length).fill([]);
		// @ts-ignore
		await db.songs.update($current_id, { drums, 'options.drumkit': current_drumkit });
		$players = new Tone.Players({ urls: sample_sets[current_drumkit] });
		if ($players_volume !== null) $players.connect($players_volume);
		drumkit_options_is_open = false;
	}

	onMount(async () => {
		setup_has_finished = true;

		await get_song();

		song_is_loaded = true;

		// initialize synth
		if ($synth === null) {
			$synth = new Tone.PolySynth(Tone.Synth).toDestination();
		}
		$synth?.set($synth_options);

		// initialize players
		if ($players === null) $players = new Tone.Players({ urls: samples });
		if ($players_volume === null) $players_volume = new Tone.Volume(volume).toDestination(); // -6
		$players.connect($players_volume);

		// set up transporter properties
		Tone.Transport.bpm.value = bpm;
		Tone.Transport.loop = true;
		Tone.Transport.loopEnd = `0:0:${track_length}`;
	});

	beforeNavigate(() => {
		// reset setup
		setup_has_finished = false;

		Tone.Transport.stop();
		Tone.Transport.cancel();
		if (melody_part) melody_part.dispose();
		if (drums_part) drums_part.dispose();
	});

	onDestroy(() => {
		// don't run on server
		if (!browser) return;

		Tone.Transport.stop();
		Tone.Transport.cancel();
		if (melody_part) melody_part.dispose();
		if (drums_part) drums_part.dispose();
	});
</script>

<svelte:head>
	<title>{title} | SynthKit</title>
</svelte:head>

<div class="container" in:fade={{ duration: 200, delay: 200 }} out:fly={{ y: 20, duration: 200 }}>
	<!-- <button
		class="button"
		on:click={() => console.log('MELODY: \n', JSON.stringify(melody), '\n', 'DRUMS: \n', JSON.stringify(drums))}
	>
		print
	</button> -->
	<Controls
		{current_beat}
		{track_length}
		{playback_state}
		{is_ready}
		bind:bpm
		on:prev_beat={prev_beat}
		on:next_beat={next_beat}
		on:jump_to_start={() => jump_to_beat(0)}
		on:jump_to_end={() => jump_to_beat(track_length - 1)}
		on:play={play_track}
		on:pause={pause_track}
		on:bpm_adjust={() => {
			Tone.Transport.bpm.value = bpm;
			// @ts-ignore
			db.songs.update($current_id, { 'options.bpm': bpm });
		}}
	/>

	<Chart
		{notes_by_octave}
		{samples}
		{melody}
		{drums}
		{playback_state}
		{is_ready}
		{tween_progress}
		{is_tweening}
		{beat_width}
		bind:current_beat
		bind:current_track_name
		on:switch_track={(e) => (current_track_name = e.detail)}
		on:pause={pause_track}
		on:select_beat={(e) => (current_beat = e.detail)}
		on:add_beats={() => add_beat(4)}
		on:remove_beats={() => remove_beat(4)}
	/>

	{#if is_ready && current_track_name === 'melody'}
		<div class="inputs inputs-melody" in:fly={{ y: 20, duration: 200, delay: 200 }} out:fly={{ y: 20, duration: 200 }}>
			<KeyboardControls
				bind:current_octave
				{notes_by_octave}
				{melody}
				{current_beat}
				{playback_state}
				bind:synth_options_is_open
				on:clear_notes={() => {
					melody[current_beat] = [];
					// @ts-ignore
					db.songs.update($current_id, { melody });
				}}
			/>
			<Keyboard
				bind:melody
				{notes_by_octave}
				{current_octave}
				{current_beat}
				on:key_down={(e) => $synth?.triggerAttackRelease(e.detail.note, '32n')}
				on:key_up={(e) => $synth?.triggerRelease(e.detail.note)}
			/>
		</div>
		{#if synth_options_is_open}
			<SynthOptions bind:synth_options_is_open />
		{/if}
	{:else if is_ready && current_track_name === 'drums'}
		<div class="inputs" in:fly={{ y: -20, duration: 200, delay: 200 }} out:fly={{ y: -20, duration: 200 }}>
			<div class="drum-title">
				<button
					class="svg"
					class:active={drumkit_options_is_open}
					on:click={() => (drumkit_options_is_open = !drumkit_options_is_open)}
					aria-label="drumkit options"
					title="Drumkit options"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path
							d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
						/>
					</svg>
				</button>
				<h2>{drumkit.name}</h2>
			</div>

			<DrumPad bind:drums {current_beat} {drumkit} on:key_down={(e) => $players?.player(e.detail.sample).start()} />
		</div>
		{#if drumkit_options_is_open}
			<DrumkitOptions
				bind:drumkit_options_is_open
				bind:current_drumkit
				{drumkits}
				on:switch_drumkits={switch_drumkits}
			/>
		{/if}
	{/if}
</div>

<style lang="scss">
	.container {
		padding-top: var(--pad-xl);
	}

	.inputs {
		--inputs-height-max: 400px;

		display: flex;
		gap: var(--pad-2xl);
		max-width: 800px;
		width: 90vw;
		margin: var(--pad-3xl) auto;
		position: relative;

		&.inputs-melody {
			flex-flow: row nowrap;
			min-height: 130px;
			height: 100vh;
			max-height: var(--inputs-height-max);
			padding: 0 0 0 var(--pad-2xl);
		}

		.drum-title {
			display: flex;
			align-items: center;
			flex-direction: column;
			gap: 1rem;
			padding-top: var(--pad-sm);

			h2 {
				/* position: absolute;
			left: -2rem;
			top: 0; */
				writing-mode: tb;
				font-weight: 600;
				text-transform: uppercase;
				font-size: 1.5rem;
				user-select: none;
			}

			button {
				--button_width: 2.75rem;

				display: flex;
				align-items: center;
				justify-content: center;
				gap: var(--pad-sm);
				white-space: nowrap;
				background-color: var(--clr-100);
				padding: 10px;
				border: solid 2px var(--clr-250);
				border-radius: var(--borderRadius-xl);
				cursor: pointer;
				font-size: 0.9rem;
				font-weight: 600;
				width: var(--button_width);
				transform: rotate(90deg);

				transition: all var(--trans-fast) ease;

				&.active {
					border-color: var(--clr-800);
				}

				&.svg {
					padding: 5px 0px;

					svg {
						--svg_size: 24px;
						height: var(--svg_size);
						width: var(--svg_size);
						transition: all var(--trans-fast) ease;
					}

					&.active {
						border-color: var(--clr-highlight);

						svg {
							fill: var(--clr-highlight);
						}
					}
				}
			}
		}
	}

	@media (max-width: $breakpoint-mobile) {
		.inputs {
			--inputs-height-max: 325px;

			flex-direction: column;

			&.inputs-melody {
				flex-flow: column;
				padding: 0;
			}

			.drum-title {
				flex-direction: row;
				padding-top: 0;

				button {
					transform: none;
				}

				h2 {
					position: static;
					writing-mode: lr;
					font-size: 1.3rem;
				}
			}
		}
	}
</style>
