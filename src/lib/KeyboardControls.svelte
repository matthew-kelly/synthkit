<script lang="ts">
	import type { Melody } from '$db/db';
	import { createEventDispatcher } from 'svelte';
	import type * as Tone from 'tone';

	export let current_octave: number;
	export let current_beat: number;
	export let notes_by_octave: Melody;
	export let melody: Melody;
	export let synth_options_is_open: boolean;
	export let playback_state: Tone.PlaybackState = 'stopped';

	const dispatch = createEventDispatcher();
</script>

<div class="controls">
	{#each notes_by_octave as octave, i}
		<button
			class:active={current_octave === i}
			class:has-notes={melody[current_beat].some((beat) => octave.includes(beat))}
			on:click={() => (current_octave = i)}
		>
			<span>C{i + 1}</span>
		</button>
	{/each}
	<button
		class="svg desktop-order-first trash"
		on:click={() => dispatch('clear_notes')}
		disabled={!melody[current_beat].length || playback_state === 'started'}
		aria-label="clear current bar's notes"
		title="Clear current bar's notes"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
			/>
		</svg>
	</button>
	<button
		class="svg"
		class:active={synth_options_is_open}
		on:click={() => (synth_options_is_open = !synth_options_is_open)}
		aria-label="synth options"
		title="Synth options"
	>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"
			/>
		</svg>
	</button>
</div>

<style lang="scss">
	.controls {
		--button_width: 2.75rem;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--pad-sm);

		button {
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

			transition: all var(--trans-fast) ease;

			span {
				font-weight: inherit;
			}

			&.has-notes {
				border-color: var(--clr-highlight);
				color: var(--clr-highlight);
			}

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

			&.trash {
				order: -1;

				svg {
					fill: red;
				}

				&:disabled {
					cursor: not-allowed;
					svg {
						fill: var(--clr-400);
					}
				}
			}
		}
	}

	@media (max-width: $breakpoint-mobile) {
		.controls {
			--button_width: 2.25rem;

			/* display: grid;
			grid-template-columns: repeat(8, 1fr); */
			flex-direction: row;
			flex-wrap: wrap;

			button {
				/* width: 100% !important; */
				/* width: 100%; */
				flex-grow: 1;

				&.trash {
					order: initial;
				}
			}
		}
	}
</style>
