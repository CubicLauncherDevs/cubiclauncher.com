<script lang="ts">
  import { getCanonicalUrl } from "$lib/utils/site.js";
  import { SECURITY_ARTICLES, type SecurityArticle, type SecurityArticleText } from "$lib/data/security";
  import { currentLocale, json, t } from "$lib/i18n";
  import SecurityArticleCard from "$lib/components/security/SecurityArticleCard.svelte";
  import IconRss from "~icons/ph/rss";

  type Entry = { article: SecurityArticle; text: SecurityArticleText };

  // Read once per locale change instead of inside the derived, which would re-read stored arrays.
  const entries = $derived.by<Entry[]>(() => {
    void $currentLocale;
    return [...SECURITY_ARTICLES]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      // Only render articles whose texts are translated in the active locale.
      .map((article): Entry | null => {
        const text = $json<SecurityArticleText>(`security.articles.${article.key}`);
        return text?.title && text?.body ? { article, text } : null;
      })
      .filter((entry) => entry !== null);
  });

</script>

<svelte:head>
  <title>{$t("page.securityTitle")}</title>
  <meta name="description" content={$t("page.securityDesc")} />
  <link rel="canonical" href={getCanonicalUrl("/security")} />
</svelte:head>

<main class="bg-cl-base pb-16 pt-6">
  <div class="mx-auto px-4 lg:px-6" style="max-width: var(--discord-max-width);">
    <div class="mx-auto max-w-3xl">
      <header class="mb-6">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-lg font-semibold text-cl-text sm:text-xl">{$t("security.title")}</h1>
          <span
            class="inline-flex items-center gap-1 rounded border border-cl-border bg-cl-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cl-muted"
          >
            <IconRss class="h-3 w-3" />
            {$t("security.badge")}
          </span>
          {#if entries.length > 0}
            <span class="text-[11px] text-cl-dim">
              {$t("security.articleCount", { values: { count: entries.length } })}
            </span>
          {/if}
        </div>
        <p class="mt-2 max-w-xl text-xs leading-relaxed text-cl-muted">{$t("security.subtitle")}</p>
      </header>

      {#if entries.length === 0}
        <p class="rounded-lg border border-cl-border bg-cl-surface p-8 text-center text-xs text-cl-muted">
          {$t("security.empty")}
        </p>
      {:else}
        <div class="flex flex-col gap-4">
          {#each entries as entry (entry.article.slug)}
            <SecurityArticleCard article={entry.article} text={entry.text} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</main>
