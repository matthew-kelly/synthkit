<script lang="ts">
	import type { Song } from '$db/db';
	import { createEventDispatcher, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	export let song: Song;
	export let i: number;

	let title_input: HTMLInputElement;
	let title = song.title;
	let edit_title = false;

	const dispatch = createEventDispatcher();

	function submit_title() {
		dispatch('update_title', { id: song.id, title });
		song.title = title; // visually update title until next load
		edit_title = false;
	}
</script>

<li in:fly={{ x: -40, duration: 150, delay: 150 + 50 * i }} out:fade={{ duration: 150 }}>
	{#if edit_title}
		<form on:submit|preventDefault={submit_title}>
			<input bind:this={title_input} type="text" bind:value={title} />
		</form>
		<div class="buttons">
			<button aria-label="confirm song title" on:click={submit_title}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z"
					/>
				</svg>
			</button>
		</div>
	{:else}
		<a href="/songs/{song.id}">{song.title}</a>
		<div class="buttons">
			<button
				aria-label="edit song title"
				title="Edit song title"
				on:click={async () => {
					edit_title = true;
					await tick();
					title_input.focus();
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						d="M6 20H11V22H6C4.89 22 4 21.11 4 20V4C4 2.9 4.89 2 6 2H18C19.11 2 20 2.9 20 4V10.3C19.78 10.42 19.57 10.56 19.39 10.74L18 12.13V4H13V12L10.5 9.75L8 12V4H6V20M22.85 13.47L21.53 12.15C21.33 11.95 21 11.95 20.81 12.15L19.83 13.13L21.87 15.17L22.85 14.19C23.05 14 23.05 13.67 22.85 13.47M13 19.96V22H15.04L21.17 15.88L19.13 13.83L13 19.96Z"
					/>
				</svg>
			</button>
			<button
				class="delete"
				aria-label="delete song"
				title="Delete song"
				on:click={() => dispatch('delete_song', { id: song.id })}
			>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<path
						d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
					/>
				</svg>
			</button>
		</div>
	{/if}
</li>

<style lang="scss">
	li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-bottom: var(--border-width-thick) solid var(--clr-highlight-muted);
		transition: all ease-out var(--trans-faster);

		&:hover {
			/* background: var(--clr-0); */
			border-bottom-color: var(--clr-highlight);
			margin-left: 0.5rem;
		}

		form {
			flex-grow: 1;
		}

		input {
			width: 100%;
			background: var(--clr-0);
			padding: var(--pad-sm);
			border: none;
		}

		a {
			display: flex;
			padding: var(--pad-sm);
			width: 100%;
			line-height: 1.3;
		}
	}

	div.buttons {
		display: flex;
		gap: 1rem;

		button {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: var(--pad-sm);

			svg {
				fill: black;
				height: 24px;
			}
			&.delete {
				svg {
					fill: red;
				}
			}
		}
	}
</style>
