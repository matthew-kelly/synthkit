<script lang="ts">
	import type { Drums, Melody, TrackName } from '$db/db';
	import { createEventDispatcher } from 'svelte';
	import type { Tweened } from 'svelte/motion';
	import type * as Tone from 'tone';
	import type { DrumKitSampleSet } from './sample_sets';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	export let notes_by_octave: Melody;
	export let samples: DrumKitSampleSet;
	export let melody: Melody;
	export let drums: Drums;
	export let playback_state: Tone.PlaybackState;
	export let is_ready: boolean;
	export let current_beat: number;
	export let current_track_name: TrackName;
	export let tween_progress: Tweened<number>;
	export let is_tweening: boolean;
	export let beat_width: number;

	const dispatch = createEventDispatcher();
	const [send, receive] = crossfade({
		duration: 150,
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 150,
				// delay: 150,
				easing: cubicOut,
				css: (t) => `
					transform: ${transform} translateY(${t});
					opacity: ${t};
				`,
			};
		},
	});

	let chart: HTMLDivElement;
	let melody_row: HTMLDivElement;
	let dragging = false;
	let has_scrolled = false;

	tween_progress.subscribe(() => {
		if (is_tweening && chart) {
			chart.scrollLeft = $tween_progress;
		}
	});

	$: is_playing = playback_state === 'started';
	$: notes_arr = notes_by_octave.flat();
	$: current_beat ? scroll_to_current_beat() : scroll_to_current_beat();
	$: is_ready ? scroll_to_current_beat() : scroll_to_current_beat();

	$: tallest_melody = Math.max(...melody.map((i) => i.length));
	$: tallest_drums = Math.max(...drums.map((i) => i.length));

	function scroll_to_current_beat() {
		if (!is_ready) return;
		if (!chart) return;

		const { offsetWidth } = chart;
		const visible_width = offsetWidth - 44; // 44px track change buttons
		const first_middle_beat = Math.floor(visible_width / 2 / beat_width);

		if (current_beat > first_middle_beat) {
			const left_beat = current_beat - first_middle_beat;
			tween_progress.set(left_beat * beat_width);
		} else {
			tween_progress.set(0);
		}
	}
</script>

<div class="chart-container" style="--bars: {melody.length + 1}; --beat_width: {beat_width}px;">
	<div
		class="chart"
		class:dragging
		bind:this={chart}
		on:pointerdown={() => {
			if (playback_state === 'started') dispatch('pause'); // pause if playing
		}}
		on:mousedown={() => {
			// only happens on desktop
			dragging = true;
		}}
		on:mouseup={() => {
			// only happens on desktop
			dragging = false;
		}}
		on:mousemove={(e) => {
			// only happens on desktop
			if (!is_ready) return;
			if (e.buttons === 1) {
				has_scrolled = true;
				let scroll = chart.scrollLeft - e.movementX;
				chart.scrollLeft = scroll;
			} else {
				has_scrolled = false;
			}
		}}
	>
		<div class="chart-row" style="--most_notes: {tallest_melody};" bind:this={melody_row}>
			<button
				class="track-select"
				class:active={current_track_name === 'melody'}
				on:click={() => dispatch('switch_track', 'melody')}
				aria-label="switch to melody"
				title="Switch to melody"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M14.74 14H15V20H9V14H9.31C9.86 14 10.3 13.56 10.3 13V4H13.75V13C13.75 13.56 14.19 14 14.74 14M4 4H6.8V13C6.8 13.56 7.24 14 7.79 14H8V20H4V4M20 20H16V14H16.26C16.81 14 17.25 13.56 17.25 13V4H20V20Z"
					/>
				</svg>
			</button>
			{#each melody as notes, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="beat"
					class:active={current_beat === i}
					on:click={() => {
						if (!has_scrolled) {
							dispatch('select_beat', i);
							dispatch('switch_track', 'melody');
						}
					}}
				>
					{#each notes as note (note)}
						<div
							class="note note-{notes_arr.indexOf(note) % 12}"
							in:receive={{ key: note }}
							out:send={{ key: note }}
							animate:flip={{ duration: 100, easing: cubicOut }}
						>
							<span>{note}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>

		<div class="chart-row" style="--most_notes: {tallest_drums};">
			<button
				class="track-select last"
				class:active={current_track_name === 'drums'}
				on:click={() => dispatch('switch_track', 'drums')}
				aria-label="switch to drums"
				title="Switch to drums"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						d="M11.5 2H10.5V6.2C10.4 6.3 10.3 6.3 10.2 6.5L2.1 20.7C1.8 21.3 2.2 22 2.9 22H16V20H4.8L11 9.2L16.7 19.2L18.4 18.2L11.8 6.4L11.5 6.1V2M21 6H20V18L19.5 22H21.5L21 18V6Z"
					/>
				</svg>
			</button>
			{#each drums as beats, i}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div
					class="beat"
					class:active={current_beat === i}
					on:click={() => {
						if (!has_scrolled) {
							dispatch('select_beat', i);
							dispatch('switch_track', 'drums');
						}
					}}
				>
					{#each beats as beat (beat)}
						<div
							class="note note-{Object.keys(samples).indexOf(beat) % 12}"
							in:receive={{ key: beat }}
							out:send={{ key: beat }}
							animate:flip={{ duration: 125 }}
						>
							<span>{beat}</span>
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>
	<div class="track-controls">
		<button
			class="button"
			disabled={is_playing}
			aria-label="make track longer"
			title="Make track longer"
			on:click={() => dispatch('add_beats')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" />
			</svg>
		</button>
		<button
			class="button"
			disabled={is_playing || melody.length <= 4}
			aria-label="make track shorter"
			title="Make track shorter"
			on:click={() => dispatch('remove_beats')}
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				<path d="M20 14H4V10H20" />
			</svg>
		</button>
	</div>
</div>

<style lang="scss">
	.chart-container {
		display: flex;
		justify-content: center;
		width: 90vw;
		max-width: 1000px;
		margin: var(--pad-2xl) auto;

		transition: all 0.2s ease-out;

		div,
		button {
			transition: all 0.2s ease-out;
		}

		.chart {
			display: flex;
			flex-direction: column;
			overflow-x: auto;
			overflow-y: hidden;
			border: var(--border-width-thick) solid var(--clr-400);
			cursor: grab;
			user-select: none;
			overscroll-behavior-x: none;

			&.dragging {
				cursor: grabbing;
			}

			.chart-row {
				--note_height: 24px;
				--note_gap: 2px;
				--beat_padding: var(--pad-sm);

				width: 100%;
				min-width: fit-content;
				display: grid;
				grid-template-columns: repeat(var(--bars), var(--beat_width));
				justify-content: center;
				min-height: calc((3 * var(--note_height)) + (var(--note_gap) * 2) + (var(--beat_padding) * 2));
				height: calc(
					(var(--most_notes) * var(--note_height)) + (var(--note_gap) * (var(--most_notes) - 1)) +
						(var(--beat_padding) * 2)
				);
				background-color: var(--clr-highlight-muted);
				border-right: var(--pad-sm) solid var(--clr-highlight);

				&:last-of-type {
					.beat {
						border-top: var(--border-width-thick) solid var(--clr-400);
					}
				}

				.beat {
					display: flex;
					flex-direction: column;
					justify-content: flex-start;
					align-items: center;
					gap: var(--note_gap);
					min-width: var(--beat_width);
					padding: var(--beat_padding);
					border-left: var(--border-width-thin) solid var(--clr-100);
					background-color: var(--clr-0);
					position: relative;

					&:nth-of-type(4n) {
						border-right: var(--border-width-thin) solid var(--clr-200);
					}

					&.active {
						background-color: var(--clr-50);
					}

					.note {
						span {
							height: var(--note_height);
							display: flex;
							justify-content: center;
							align-items: center;
							width: 4ch;
							color: var(--clr-1000);
							font-size: 0.9rem;
							font-weight: 600;
							padding: var(--pad-sm);
							background-color: var(--clr-note);
							border-radius: var(--borderRadius-sm);
							text-transform: uppercase;
						}

						@for $i from 0 through 11 {
							&.note-#{$i} {
								--clr-note: var(--clr-note-#{$i});
							}
						}
					}
				}

				.track-select {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					background-color: var(--clr-200);
					position: sticky;
					left: 0;
					border-right: var(--border-width-thick) solid var(--clr-400);
					z-index: 1;

					svg {
						--icon_size: 24px;

						height: var(--icon_size);
						width: var(--icon_size);
						fill: var(--clr-900);

						transition: fill var(--trans-fast) ease;
					}

					&.active {
						background-color: var(--clr-highlight-muted);
						cursor: default;
						svg {
							fill: var(--clr-highlight);
						}
						&:hover {
							background-color: var(--clr-highlight-muted);
						}
					}

					&.last {
						border-top: var(--border-width-thick) solid var(--clr-400);
					}

					&:hover {
						background-color: var(--clr-300);
					}
				}
			}
		}

		.track-controls {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			gap: var(--pad-sm);
			margin-left: var(--pad-xl);

			button {
				max-height: 100px;
				height: 100%;

				&:first-of-type {
					border-top-right-radius: var(--borderRadius-round);
					border-top-left-radius: var(--borderRadius-round);

					svg {
						margin-top: 60%;
					}
				}
				&:last-of-type {
					border-bottom-right-radius: var(--borderRadius-round);
					border-bottom-left-radius: var(--borderRadius-round);

					svg {
						margin-bottom: 60%;
					}
				}

				svg {
					height: 24px;
					fill: var(--clr-900);
				}
			}
		}
	}

	@media (max-width: $breakpoint-mobile) {
		.chart-container {
			.track-controls {
				margin-left: 4px;

				button {
					width: 28px;
					min-width: 28px;
					padding: 0;

					svg {
						height: 16px;
						width: 16px;
					}
				}
			}
		}
	}
</style>
