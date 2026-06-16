<script lang="ts">
	import { currentLocale, t } from "$lib/i18n";
	let { data } = $props();
	let mod = $derived(data.localeContent[$currentLocale] || data.localeContent['es']);
	let Content = $derived(mod?.default);
	let title = $derived(mod?.metadata?.title || $t('page.docsTitle'));
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

{#if Content}
	<Content />
{/if}
