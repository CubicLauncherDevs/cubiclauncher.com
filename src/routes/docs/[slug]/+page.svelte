<script lang="ts">
	import { currentLocale } from "$lib/i18n";
	let { data } = $props();
	let mod = $derived(data.localeContent[$currentLocale] || data.localeContent['es']);
	let Content = $derived(mod?.default);
	let title = $derived(mod?.metadata?.title || 'Documentación');
</script>

<svelte:head>
	<title>{title} | CubicLauncher</title>
</svelte:head>

{#if Content}
	<Content />
{/if}
