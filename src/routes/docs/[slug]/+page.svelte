<script lang="ts">
	let { data } = $props();
	let Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title || 'Documentación'} | CubicLauncher</title>
</svelte:head>

<Content />
