<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import type * as Tone from 'tone';

	// props
	export let current_beat: number;
	export let track_length: number;
	export let playback_state: Tone.PlaybackState;
	export let is_ready: boolean;
	export let bpm: number;

	// constants
	const dispatch = createEventDispatcher();
	const bpm_min = 30;
	const bpm_max = 150;

	let is_expanded = false;

	$: is_playing = playback_state === 'started';

	function lower_bpm() {
		if (bpm === bpm_min) return;
		bpm = bpm - 1;
		dispatch('bpm_adjust');
	}
	function raise_bpm() {
		if (bpm === bpm_max) return;
		bpm = bpm + 1;
		dispatch('bpm_adjust');
	}
</script>

<div
	class="controls"
	class:is-playing={playback_state === 'started'}
	class:is-ready={is_ready}
	style="--controls_rows: {is_expanded ? 3 : 1};"
>
	<div class="row">
		<button
			class="button play"
			disabled={!is_ready}
			on:click={() => (playback_state === 'started' ? dispatch('pause') : dispatch('play'))}
			aria-label={is_playing ? 'Pause' : 'Play'}
			title={is_playing ? 'Pause' : 'Play'}
		>
			{#if playback_state === 'started'}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M14,19H18V5H14M6,19H10V5H6V19Z" />
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
				</svg>
			{/if}
		</button>
		<button
			class="button dropdown-button"
			on:click={() => (is_expanded = !is_expanded)}
			aria-label={is_expanded ? 'collapse track controls' : 'expand track controls'}
			title={is_expanded ? 'Collapse track controls' : 'Expand track controls'}
		>
			{#if is_expanded}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
					/>
				</svg>
			{:else}
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />
				</svg>
			{/if}
		</button>
	</div>
	{#if is_expanded}
		<div class="row" transition:fly={{ y: -20, duration: 150 }}>
			<button
				class="button"
				disabled={current_beat === 0 || is_playing}
				on:click={() => dispatch('jump_to_start')}
				aria-label="start of track"
				title="Jump to start"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12" />
				</svg>
			</button>
			<button
				class="button"
				disabled={is_playing}
				on:click={() => dispatch('prev_beat')}
				aria-label="previous beat"
				title="Previous beat"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
				</svg>
			</button>
			<div class="time">
				<span>
					{Math.floor(current_beat / 16) + 1}:{(Math.floor(current_beat / 4) % 4) + 1}:{(current_beat % 4) + 1}
				</span>
			</div>
			<button
				class="button"
				disabled={is_playing}
				on:click={() => dispatch('next_beat')}
				aria-label="next beat"
				title="Next beat"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
				</svg>
			</button>
			<button
				class="button"
				disabled={current_beat === track_length - 1 || is_playing}
				on:click={() => dispatch('jump_to_end')}
				aria-label="end of track"
				title="Jump to end"
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path d="M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12" />
				</svg>
			</button>
		</div>
		<div class="row col bpm-slider" transition:fly={{ y: -20, duration: 150 }}>
			<!-- <span class="bpm">BPM:{bpm}</span> -->
			<div class="row">
				<div class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<title>tortoise</title>
						<path
							d="M19.31,5.6C18.09,5.56 16.88,6.5 16.5,8C16,10 16,10 15,11C13,13 10,14 4,15C3,15.16 2.5,15.5 2,16C4,16 6,16 4.5,17.5L3,19H6L8,17C10,18 11.33,18 13.33,17L14,19H17L16,16C16,16 17,12 18,11C19,10 19,11 20,11C21,11 22,10 22,8.5C22,8 22,7 20.5,6C20.15,5.76 19.74,5.62 19.31,5.6M9,6A6,6 0 0,0 3,12C3,12.6 3.13,13.08 3.23,13.6C9.15,12.62 12.29,11.59 13.93,9.94L14.43,9.44C13.44,7.34 11.32,6 9,6Z"
						/>
					</svg>
				</div>

				<button class="button" disabled={bpm <= bpm_min} on:click={lower_bpm} aria-label="lower bpm" title="Lower BPM">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M20 14H4V10H20" />
					</svg>
				</button>
				<input
					on:input={() => dispatch('bpm_adjust')}
					type="range"
					id="bpm"
					name="BPM slider"
					title="BPM"
					bind:value={bpm}
					min={bpm_min}
					max={bpm_max}
				/>
				<button class="button" disabled={bpm >= bpm_max} on:click={raise_bpm} aria-label="raise bpm" title="Raise BPM">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<path d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" />
					</svg>
				</button>

				<div class="icon">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
						<title>rabbit</title>
						<path
							d="M18.05,21L15.32,16.26C15.32,14.53 14.25,13.42 12.95,13.42C12.05,13.42 11.27,13.92 10.87,14.66C11.2,14.47 11.59,14.37 12,14.37C13.3,14.37 14.36,15.43 14.36,16.73C14.36,18.04 13.31,19.11 12,19.11H15.3V21H6.79C6.55,21 6.3,20.91 6.12,20.72C5.75,20.35 5.75,19.75 6.12,19.38V19.38L6.62,18.88C6.28,18.73 6,18.5 5.72,18.26C5.5,18.76 5,19.11 4.42,19.11C3.64,19.11 3,18.47 3,17.68C3,16.9 3.64,16.26 4.42,16.26L4.89,16.34V14.37C4.89,11.75 7,9.63 9.63,9.63H9.65C11.77,9.64 13.42,10.47 13.42,9.16C13.42,8.23 13.62,7.86 13.96,7.34C13.23,7 12.4,6.79 11.53,6.79C11,6.79 10.58,6.37 10.58,5.84C10.58,5.41 10.86,5.05 11.25,4.93L10.58,4.89C10.06,4.89 9.63,4.47 9.63,3.95C9.63,3.42 10.06,3 10.58,3H11.53C13.63,3 15.47,4.15 16.46,5.85L16.74,5.84C17.45,5.84 18.11,6.07 18.65,6.45L19.1,6.83C21.27,8.78 21,10.1 21,10.11C21,11.39 19.94,12.44 18.65,12.44L18.16,12.39V12.47C18.16,13.58 17.68,14.57 16.93,15.27L20.24,21H18.05M18.16,7.74C17.63,7.74 17.21,8.16 17.21,8.68C17.21,9.21 17.63,9.63 18.16,9.63C18.68,9.63 19.11,9.21 19.11,8.68C19.11,8.16 18.68,7.74 18.16,7.74Z"
						/>
					</svg>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.controls {
		--icon_size: 24px;
		--controls_row_height: 44px;

		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--pad-sm);
		margin-bottom: var(--pad-lg);
		position: relative;
		min-height: var(--controls_row_height);
		height: calc(
			(var(--controls_row_height) * var(--controls_rows)) + 4px + (var(--pad-sm) * (var(--controls_rows) - 1))
		);
		transition: all 0.2s ease-out;
	}

	.row {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--pad-sm);

		&.col {
			flex-direction: column;
		}
	}

	.time {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;

		span {
			color: var(--clr-1000);
			font-size: 1.4rem;
			font-weight: 600;
			font-family: 'Courier New', Courier, monospace;
		}
	}

	.button {
		&.play {
			width: calc(var(--icon_size) * 4);

			svg {
				height: calc(var(--icon_size) * 1.25);
				width: calc(var(--icon_size) * 1.25);
				fill: var(--clr-highlight);
			}
		}

		&.dropdown-button {
			position: absolute;
			/* right: 0; */
			transform: translateX(calc(var(--icon_size) * 3.2));
		}
	}

	.bpm-slider {
		margin-top: var(--pad-sm);
		gap: 0;

		.bpm {
			color: var(--clr-1000);
			font-size: 1.4rem;
			font-weight: 600;
			font-family: 'Courier New', Courier, monospace;
		}

		input {
			display: block;
			width: 100%;
			min-width: 176px;

			&::-webkit-slider-runnable-track {
				background: var(--clr-150);
				height: 2px;
			}
			&::-moz-range-track {
				background: var(--clr-150);
				height: 2px;
			}
			&::-webkit-slider-thumb {
				-webkit-appearance: none; /* Override default look */
				appearance: none;
				margin-top: -11px; /* Centers thumb on the track */
				background-color: var(--clr-highlight);
				height: 1.5rem;
				width: 0.65rem;
				cursor: pointer;
			}
			&::-moz-range-thumb {
				border: none; /*Removes extra border that FF applies*/
				border-radius: 0; /*Removes default border-radius that FF applies*/
				background-color: var(--clr-highlight);
				height: 2rem;
				width: 0.65rem;
				cursor: pointer;
			}
		}

		.button {
			display: flex;
			align-items: center;
			justify-content: center;

			svg {
				height: var(--icon_size);
				width: var(--icon_size);
				fill: inherit;
			}

			&:disabled {
				svg {
					fill: var(--clr-400);
				}
			}
		}
	}

	.icon {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 var(--pad-sm);

		svg {
			width: 2rem;
			height: 2rem;
		}
	}
</style>
