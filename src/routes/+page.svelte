<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div class="container" in:fly={{ y: -20, duration: 200, delay: 200 }} out:fly={{ y: -20, duration: 200 }}>
	<h1>SynthKit</h1>
	<p>
		SynthKit is a step sequencer and drum machine built using <a
			href="https://tonejs.github.io/"
			target="_blank"
			rel="noreferrer">Tone.js</a
		>
		in <a href="https://kit.svelte.dev/" target="_blank" rel="noreferrer">SvelteKit</a>. Users' songs are saved in the
		browser with IndexedDB using <a href="https://dexie.org/" target="_blank" rel="noreferrer">Dexie.js</a>. All drum
		samples are sourced from <a href="https://www.drumkito.com/" target="_blank" rel="noreferrer">drumkito</a>.
	</p>
	<p>
		SynthKit is created by <a href="https://matthewkelly.ca/" target="_blank" rel="noreferrer">Matt Kelly</a>, a full
		stack web developer and sourdough bread baker from Vancouver, BC.
	</p>

	<div class="logo">
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<title>piano</title>
			<path
				d="M20 2H4C2.9 2 2 2.9 2 4V20C2 21.11 2.9 22 4 22H20C21.11 22 22 21.11 22 20V4C22 2.9 21.11 2 20 2M14.74 14H15V20H9V14H9.31C9.86 14 10.3 13.56 10.3 13V4H13.75V13C13.75 13.56 14.19 14 14.74 14M4 4H6.8V13C6.8 13.56 7.24 14 7.79 14H8V20H4V4M20 20H16V14H16.26C16.81 14 17.25 13.56 17.25 13V4H20V20Z"
			/>
		</svg>
		<div class="blob" />
	</div>
</div>

<style lang="scss">
	.container {
		--logo-size: 300px;

		position: relative;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 600px;
		margin: 0 auto;
		padding-top: var(--logo-size);

		.logo {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			top: 10px;
			left: 50%;
			transform: translateX(-50%);
			width: 100%;
			max-width: var(--logo-size);
			z-index: -1;

			svg {
				fill: var(--clr-highlight);
				width: 70%;
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translate(-50%, -50%);
			}

			.blob {
				border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
				width: var(--logo-size);
				height: var(--logo-size);
				background-image: radial-gradient(circle, var(--clr-highlight-muted) 0%, var(--clr-highlight-minimum) 100%);
				/* background-image: linear-gradient(45deg, var(--clr-highlight-minimum) 0%, var(--clr-highlight-muted) 100%); */
				background-size: 400% 400%;
				box-shadow: -10vmin 10vmin 0 rgba(255, 255, 255, 0.07);
				animation: animate_blob 20s linear infinite alternate;
			}
		}
	}

	@keyframes animate_blob {
		0% {
			border-radius: 40% 60% 60% 40% / 70% 30% 70% 30%;
			background-position: 0% 50%;
		}
		20% {
			border-radius: 30% 50% 40% 50% / 60% 40% 60% 40%;
		}
		40% {
			border-radius: 40% 50% 50% 40% / 60% 50% 70% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		60% {
			border-radius: 60% 60% 60% 40% / 70% 30% 70% 30%;
		}
		80% {
			border-radius: 55% 40% 50% 50% / 60% 30% 75% 30%;
		}
		100% {
			border-radius: 50% 30% 40% 60% / 50% 40% 60% 50%;
			background-position: 0% 50%;
		}
	}

	h1 {
		margin-bottom: 1.5rem;
		font-weight: 700;
		font-size: 1.5rem;
	}

	p {
		margin-bottom: 1rem;
		line-height: 1.3;
	}

	a {
		font-weight: 700;
		text-decoration: underline var(--border-width-thin) var(--clr-highlight) solid;

		&:hover {
			text-decoration: none;
			color: var(--clr-highlight);
		}
	}

	@media (max-width: $breakpoint-mobile) {
		.container {
			--logo-size: 200px;

			.logo .blob {
				animation-duration: 15s;
			}
		}
	}
</style>
