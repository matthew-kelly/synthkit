<script lang="ts">
	import { db, type Melody } from '$db/db';
	import { current_id } from '$db/stores';
	import { createEventDispatcher, onMount } from 'svelte';
	import type * as Tone from 'tone';

	// props
	export let current_octave: number;
	export let current_beat: number;
	export let melody: Melody;
	export let notes_by_octave: Melody;

	// constants
	const dispatch = createEventDispatcher();

	// variables
	let keyboard: HTMLDivElement;
	let is_ready = false;

	$: current_octave ? scroll_to_current_octave() : scroll_to_current_octave(); // scroll every time octave updates

	// functions
	function scroll_to_current_octave(smooth = true) {
		if (!is_ready) return;

		const new_octave = keyboard.children[current_octave] as HTMLElement;
		let scroll: number;
		if (current_octave === notes_by_octave.length - 1) {
			scroll = new_octave.offsetLeft + new_octave.offsetWidth;
		} else {
			scroll = new_octave.offsetLeft;
		}

		if (!smooth) {
			// skip smooth scroll, jump directly to octave
			// 'instant' is a valid option even though it isn't in the official spec
			keyboard.scrollTo({
				left: scroll,
				// @ts-ignore
				behavior: 'instant',
			});
		} else {
			keyboard.scrollLeft = scroll;
		}
	}

	function handle_key_up(note: Tone.Unit.Frequency) {
		dispatch('key_up', { note });
	}

	function handle_click(note: Tone.Unit.Frequency) {
		if (melody[current_beat].includes(note)) {
			handle_key_up(note);
			melody[current_beat] = melody[current_beat].filter((n) => n !== note);
		} else if (melody[current_beat].length < 8) {
			// max 8 notes per beat
			dispatch('key_down', { note });
			melody[current_beat] = [...melody[current_beat], note];
		}
		// @ts-ignore
		db.songs.update($current_id, { melody });

		setTimeout(() => {
			keyboard.scrollIntoView({ behavior: 'smooth' });
		}, 150);
	}

	onMount(() => {
		is_ready = true;
		scroll_to_current_octave(false);
	});
</script>

<div bind:this={keyboard} class="keyboard">
	{#each notes_by_octave as octave, i}
		<ol class="octave">
			{#each octave as note, j}
				<li
					class="note note-{j % 12}"
					class:sharp={note.toString().charAt(1) === '#'}
					class:active={melody[current_beat].includes(note)}
				>
					<button
						on:click={() => handle_click(note)}
						tabindex={current_octave === i ||
						(current_octave === i - 1 && j < 2) ||
						(current_octave === notes_by_octave.length - 1 && i === notes_by_octave.length - 2 && j > 9)
							? 0
							: -1}
					>
						<span>{note}</span>
					</button>
				</li>
			{/each}
		</ol>
	{/each}
</div>

<style lang="scss">
	.keyboard {
		--octave_width: 87.5%;
		--white_notes: 7;
		--border_width: 2px;
		--border_radius: 7px;
		--label_width: 4ch;

		display: flex;
		flex-flow: row nowrap;
		position: relative;
		overflow: hidden;
		scroll-behavior: smooth;
		user-select: none;
		border: calc(var(--border_width) * 2) solid var(--clr-350);
		border-radius: calc(var(--border_radius) * 1.5);
	}

	.octave {
		flex-shrink: 0;
		display: flex;
		flex-flow: row nowrap;
		list-style: none;
		padding: 0;
		margin: 0;

		width: calc(var(--white_notes) / 7 * var(--octave_width));
		background-color: var(--clr-250);

		&:first-of-type {
			border-radius: var(--border_radius) 0 0 var(--border_radius);

			.note:first-child button {
				border-top-left-radius: var(--border_radius);
			}
		}

		&:last-of-type {
			border-radius: 0 var(--border_radius) var(--border_radius) 0;

			.note:first-child button {
				border-top-right-radius: var(--border_radius);
			}
		}
	}

	.note {
		flex-shrink: 0;
		position: relative;
		width: calc(100% / var(--white_notes));

		button {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			width: calc(100% + var(--border_width));
			height: 100%;
			color: var(--clr-600);
			padding: 10px 10px 8px 10px;
			background-color: var(--clr-100);
			border: solid var(--border_width) var(--clr-250);
			border-radius: 0 0 var(--border_radius) var(--border_radius);
			cursor: pointer;

			transition: color 0.1s ease, background-color 0.1s ease;

			span {
				display: flex;
				justify-content: center;
				width: var(--label_width);
				color: var(--clr-1000);
				font-size: 1rem;
				font-weight: 600;
				padding: var(--pad-sm);
				margin-bottom: 12px;
				background-color: var(--clr-note);
				border: var(--border_width) solid var(--clr-note);
				border-radius: var(--borderRadius-sm);
			}
		}

		&.sharp {
			margin: 0 calc(-100% / (2 * var(--white_notes)));
			height: 55%;

			button {
				position: absolute;
				top: 0;
				left: 50%;
				z-index: 1;
				color: var(--clr-250);
				background-color: var(--clr-800);
				border-color: var(--clr-900);
				transform: translateX(-50%);
			}
		}

		&.active button {
			background-color: var(--clr-note);

			span {
				border-color: var(--clr-100);
			}
		}

		@for $i from 0 through 11 {
			&.note-#{$i} {
				--clr-note: var(--clr-note-#{$i});
			}
		}
	}

	@media (max-width: $breakpoint-mobile) {
		.keyboard {
			--octave_width: 100%;

			height: 100%;
		}
	}
</style>
