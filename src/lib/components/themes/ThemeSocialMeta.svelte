<script lang="ts">
  let { title, description, author, url, image, imageAlt }: {
    title: string;
    description: string;
    author: string;
    url: string;
    image: string | null;
    imageAlt: string;
  } = $props();
</script>

<!-- Rendered into the static HTML: link-preview crawlers do not run JavaScript. -->
<svelte:head>
  <meta name="description" content={description} />
  <meta name="author" content={author} />
  <link rel="canonical" href={url} />
  <meta property="og:site_name" content="CubicLauncher" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  {#if image}
    <meta property="og:image" content={image} />
    <meta property="og:image:alt" content={imageAlt} />
    <meta name="twitter:image" content={image} />
    <meta name="twitter:image:alt" content={imageAlt} />
  {/if}
</svelte:head>
