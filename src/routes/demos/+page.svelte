<script>
	import { fade, fly } from 'svelte/transition';

	export let data;
</script>

<div in:fly={{ y: -20, duration: 200, delay: 200 }} out:fly={{ y: -20, duration: 200 }}>
	<ul>
		{#each data.demos as demo, i}
			<a
				href="/demos/{demo.slug}"
				data-sveltekit-preload-data="off"
				in:fly={{ x: -40, duration: 150, delay: 150 + 50 * (i + 1) }}
				out:fade={{ duration: 150 }}
			>
				{demo.title}
			</a>
		{/each}
	</ul>
</div>

<style lang="scss">
	ul {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		a {
			display: flex;
			gap: 0.25rem;
			padding: var(--pad-sm);
			line-height: 1.3;
			border-bottom: var(--border-width-thick) solid var(--clr-highlight-muted);
			transition: all ease-out var(--trans-faster);

			&:hover {
				border-bottom-color: var(--clr-highlight);
				margin-left: 0.5rem;
			}
		}
	}
</style>
