<script lang="ts">
	import Synth from '$lib/Synth.svelte';

	export let data;
	$: ({ id } = data);
</script>

<Synth {id} />
