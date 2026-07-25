<script lang="ts">
  import { t } from "$lib/i18n";
  import DonateContent from "$lib/components/donate/DonateContent.svelte";
</script>

<svelte:head>
  <title>{$t('page.donateTitle')}</title>
  <meta name="description" content={$t('page.donateDesc')} />
</svelte:head>

<DonateContent />
