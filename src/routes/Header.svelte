<script lang="ts">
	import { page } from '$app/stores';

	$: current_page = $page.url.pathname;
</script>

<nav>
	<a class="logo" href="/" class:active={current_page === '/'}>
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<title>piano</title>
			<path
				d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M14.74 14H15V20H9V14H9.31C9.86 14 10.3 13.56 10.3 13V4H13.75V13C13.75 13.56 14.19 14 14.74 14M4 4H6.8V13C6.8 13.56 7.24 14 7.79 14H8V20H4V4M20 20H16V14H16.26C16.81 14 17.25 13.56 17.25 13V4H20V20Z"
			/>
		</svg>
		SynthKit
	</a>
	<div class="links">
		<a href="/songs" class:active={current_page.includes('/songs')}>Songs</a>
		<a href="/demos" class:active={current_page.includes('/demos')}>Demos</a>
	</div>
</nav>

<style lang="scss">
	nav {
		--nav-pad: var(--pad-md);
		display: flex;
		align-items: center;
		padding: var(--nav-pad) 0;
		margin-bottom: var(--nav-pad);
		border-bottom: var(--border-width-thick) solid var(--clr-highlight-muted);

		.links {
			display: flex;
			align-items: center;
		}

		a {
			display: flex;
			align-items: center;
			gap: var(--pad-sm);
			padding: var(--nav-pad);
			padding-top: 0;
			margin-bottom: calc(-1 * (var(--nav-pad) + var(--border-width-thick)));
			border-bottom: var(--border-width-thick) solid transparent;
			text-transform: uppercase;
			font-weight: 700;
			transition: var(--trans-fast) all ease-out;

			&:hover,
			&.active {
				border-bottom-color: var(--clr-highlight);
			}

			&.logo {
				--gap-x: calc(var(--nav-pad) * 2);
				margin-right: var(--gap-x);

				svg {
					height: 1rem;
					fill: black;
				}
			}
		}
	}

	@media (max-width: $breakpoint-mobile) {
		nav {
			justify-content: space-between;
		}
	}
</style>
