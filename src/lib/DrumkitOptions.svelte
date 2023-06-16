<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { Drumkits } from './sample_sets';

	export let drumkit_options_is_open: boolean;
	export let current_drumkit: string;
	export let drumkits: Drumkits;

	const dispatch = createEventDispatcher();

	// TODO: add drumkit volume through $players_volume?
</script>

<div class="options-container" in:fly={{ x: -20, duration: 200 }} out:fly={{ x: -20, duration: 200 }}>
	<span class="span-2 title">Drumkit Options</span>
	<button class="close" aria-label="close drumkit options" on:click={() => (drumkit_options_is_open = false)}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<path
				d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z"
			/>
		</svg>
	</button>

	<label for="drumkit_select" class="span-2">Drumkit sample set:</label>
	<select
		id="drumkit_select"
		class="span-2"
		name="drumkit_select"
		bind:value={current_drumkit}
		on:change={() => dispatch('switch_drumkits')}
	>
		{#each Object.keys(drumkits) as kit}
			<option value={kit}>{drumkits[kit].name}</option>
		{/each}
	</select>
	<p class="span-2 warning">Warning! Changing your drumkit will clear all samples on the drum track.</p>
</div>

<style lang="scss">
	.options-container {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: grid;
		grid-template-columns: 3fr 2fr;
		gap: 1rem;
		align-items: center;
		padding: var(--pad-xl);
		padding-left: var(--pad-3xl);
		max-width: 350px;
		background-color: var(--clr-50);
		border: var(--border-width-thick) solid var(--clr-400);
		border-top-right-radius: var(--borderRadius-xl);
		border-bottom-right-radius: var(--borderRadius-xl);
		border-left: none;
		box-shadow: 2px 4px 8px 0px rgb(0 0 0 / 20%);

		.span-2 {
			grid-column: span 2;
		}

		.close {
			position: absolute;
			top: 0;
			right: 0;
			padding: var(--pad-sm);

			svg {
				width: 24px;
			}
		}

		.title {
			font-weight: 800;
			margin-bottom: var(--pad-sm);
			text-transform: uppercase;
			font-size: 0.9rem;
			margin-left: -10px;
		}

		.warning {
			color: red;
			font-weight: 600;
			font-size: 0.8rem;
		}
	}
</style>
