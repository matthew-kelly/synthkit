<script lang="ts">
	import { page } from '$app/stores';
	import '../styles/index.scss';
	import Header from './Header.svelte';
</script>

<svelte:head>
	<title>{$page.data.title ? `${$page.data.title} | SynthKit` : 'SynthKit'}</title>
</svelte:head>

<Header />
<slot />
