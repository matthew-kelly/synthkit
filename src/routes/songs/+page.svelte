<script lang="ts">
	import { db, type Song } from '$db/db';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import SongTitle from './SongTitle.svelte';
	import { flip } from 'svelte/animate';
	import { cubicOut } from 'svelte/easing';

	let songs: Song[] = [];

	async function get_songs() {
		try {
			songs = await db.songs.toArray();
		} catch (error) {
			console.log(error);
		}
	}

	async function update_title(id: number, title: string) {
		try {
			// @ts-ignore
			await db.songs.update(id, { title });
		} catch (error) {
			console.log(error);
		}
	}

	async function delete_song(id: number) {
		try {
			await db.songs.delete(id);
			await get_songs();
		} catch (error) {
			console.log(error);
		}
	}

	onMount(async () => {
		await get_songs();
	});
</script>

<div in:fly={{ y: -20, duration: 200, delay: 200 }} out:fly={{ y: -20, duration: 200 }}>
	<ul>
		<li style="--border-color: #ccc;">
			<a href="/songs/new" data-sveltekit-preload-data="off">
				New Song <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
					<title>plus</title>
					<path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
				</svg>
			</a>
		</li>
		{#each songs as song, i (song.id)}
			<div animate:flip={{ duration: 150, easing: cubicOut, delay: 150 }}>
				<SongTitle
					{song}
					{i}
					on:update_title={(e) => update_title(e.detail.id, e.detail.title)}
					on:delete_song={(e) => delete_song(e.detail.id)}
				/>
			</div>
		{/each}
	</ul>
</div>

<style lang="scss">
	ul {
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;

		li {
			display: flex;
			align-items: center;
			border-bottom: var(--border-width-thick) solid var(--border-color);
			transition: all ease-out var(--trans-faster);

			&:hover {
				border-bottom-color: var(--clr-highlight);
				margin-left: 0.5rem;
			}

			a {
				display: flex;
				gap: 0.25rem;
				padding: var(--pad-sm);
				width: 100%;
				line-height: 1.3;

				svg {
					height: 20px;
				}
			}
		}
	}
</style>
