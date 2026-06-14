<script lang="ts">
	import { t } from "$lib/i18n";
	let { data } = $props();
	let Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title || $t('page.docsTitle')}</title>
</svelte:head>

<Content />
