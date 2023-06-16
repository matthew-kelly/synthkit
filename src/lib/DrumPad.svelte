<script lang="ts">
	import { db, type Drums } from '$db/db';
	import { current_id } from '$db/stores';
	import { createEventDispatcher } from 'svelte';
	import type { DrumKit } from '$lib/sample_sets';

	// props
	export let current_beat: number;
	export let drums: Drums;
	export let drumkit: DrumKit;

	// constants
	const dispatch = createEventDispatcher();

	// functions
	function handle_key_up(sample: string) {
		dispatch('key_up', { sample });
	}

	function handle_click(sample: string) {
		if (drums[current_beat].includes(sample)) {
			handle_key_up(sample);
			drums[current_beat] = drums[current_beat].filter((n) => n !== sample);
		} else if (drums[current_beat].length < 8) {
			// max 8 per beat
			dispatch('key_down', { sample });
			drums[current_beat] = [...drums[current_beat], sample];
		}
		// @ts-ignore
		db.songs.update($current_id, { drums });
	}
</script>

<div class="drumpad">
	{#each drumkit.samples as sample, i}
		<button
			class="drum drum-{i % 12}"
			class:active={drums[current_beat].includes(sample.short)}
			on:click={() => handle_click(sample.short)}
		>
			<span>{sample.name}</span>
		</button>
	{/each}
</div>

<style lang="scss">
	.drumpad {
		--border_width: 2px;
		--border_radius: 7px;
		--button_height: 130px;

		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(var(--button_height), 1fr));
		gap: var(--pad-md);
		width: 100%;
		user-select: none;

		button {
			display: flex;
			align-items: center;
			justify-content: center;
			height: var(--button_height);
			width: 100%;
			min-width: var(--button_height);
			background-color: var(--clr-100);
			border: solid var(--border_width) var(--clr-250);
			border-radius: var(--border_radius);

			transition: background-color var(--trans-fast) ease, border-color var(--trans-fast) ease;

			@for $i from 0 through 11 {
				&.drum-#{$i} {
					--clr-drum: var(--clr-note-#{$i});
				}
			}

			span {
				color: var(--clr-1000);
				font-size: 0.9rem;
				font-weight: 600;
				padding: var(--pad-md);
				background-color: var(--clr-drum);
				border: var(--border_width) solid var(--clr-drum);
				border-radius: var(--borderRadius-sm);
				text-transform: uppercase;
			}

			&.active {
				background-color: var(--clr-drum);
				border-color: var(--clr-600);

				/* span {
					border-color: var(--clr-100);
				} */
			}
		}
	}

	@media (max-width: $breakpoint-mobile) {
		.drumpad {
			--button_height: 85px;

			gap: var(--pad-sm);

			button {
				span {
					font-size: 0.75rem;
				}
			}
		}
	}
</style>
