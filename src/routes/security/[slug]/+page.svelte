<script lang="ts">
  import { currentLocale, getDateLocale, json, t } from "$lib/i18n";
  import { getCanonicalUrl } from "$lib/utils/site.js";
  import { getSecurityArticle, type SecurityArticleText } from "$lib/data/security";
  import SecurityArticleView from "$lib/components/security/SecurityArticleView.svelte";

  let { data } = $props();

  const article = $derived(getSecurityArticle(data.slug));
  const text = $derived(
    article ? $json<SecurityArticleText>(`security.articles.${article.key}`) ?? null : null,
  );

  const date = $derived(
    article
      ? new Intl.DateTimeFormat(getDateLocale($currentLocale), {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(article.publishedAt))
      : "",
  );

  const canonicalUrl = $derived(getCanonicalUrl(`/security/${data.slug}`));
</script>

<svelte:head>
  {#if article && text?.title}
    <title>{text.title} | CubicLauncher</title>
    <meta name="description" content={text.summary} />
    <link rel="canonical" href={canonicalUrl} />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content={article.publishedAt} />
    <meta property="og:title" content={text.title} />
    <meta property="og:description" content={text.summary} />
    <meta property="og:url" content={canonicalUrl} />
  {:else}
    <title>{$t("error.title")}</title>
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<main class="bg-cl-base">
  <section class="py-8 sm:py-12">
    <div class="mx-auto max-w-3xl px-4 lg:px-6">
      {#if article && text?.title}
        <SecurityArticleView {article} {text} />
      {:else}
        <div class="py-12 text-center">
          <p class="mb-4 text-sm text-cl-muted">{$t("security.notFound")}</p>
          <a
            href="/security"
            class="inline-flex items-center rounded bg-cl-text px-4 py-2.5 text-xs font-medium text-cl-accent-inverse transition-opacity hover:opacity-90"
          >
            {$t("security.backToList")}
          </a>
        </div>
      {/if}
    </div>
  </section>
</main>
