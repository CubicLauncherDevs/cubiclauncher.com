<script lang="ts">
  import { t, currentLocale, getDateLocale } from "$lib/i18n";
  import type { SecurityArticle, SecurityArticleText } from "$lib/data/security";
  import SeverityBadge from "./SeverityBadge.svelte";
  import SecurityArticleBody from "./SecurityArticleBody.svelte";
  import IconArrowLeft from "~icons/ph/arrow-left";
  import IconArrowSquareOut from "~icons/ph/arrow-square-out";

  let { article, text }: { article: SecurityArticle; text: SecurityArticleText } = $props();

  const date = $derived(new Intl.DateTimeFormat(getDateLocale($currentLocale), {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(article.publishedAt)));
</script>

<article>
  <a
    href="/security"
    class="mb-6 inline-flex items-center gap-1.5 text-xs text-cl-muted transition-colors hover:text-cl-text"
  >
    <IconArrowLeft class="h-3.5 w-3.5" />
    {$t("security.backToList")}
  </a>

  <header class="mb-6 border-b border-cl-border pb-6">
    <div class="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
      <SeverityBadge severity={article.severity} />
      <span class="rounded border border-cl-border bg-cl-elevated px-1.5 py-0.5 text-[10px] font-medium text-cl-muted">
        {$t(`security.category.${article.category}`)}
      </span>
      {#if article.cve}
        <span class="rounded border border-cl-border bg-cl-elevated px-1.5 py-0.5 font-mono text-[10px] text-cl-text">{article.cve}</span>
      {/if}
      <time datetime={article.publishedAt} class="text-cl-dim">{date}</time>
    </div>
    <h1 class="text-2xl font-semibold tracking-tight text-cl-text sm:text-3xl [overflow-wrap:anywhere]">{text.title}</h1>
    <p class="mt-3 text-sm leading-relaxed text-cl-muted">{text.summary}</p>
  </header>

  <SecurityArticleBody body={text.body} />

  <footer class="mt-8 border-t border-cl-border pt-4">
    <p class="mb-2 text-xs text-cl-muted">{$t("security.source")}</p>
    <a
      href={article.source}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-start gap-2 text-xs font-medium text-cl-text underline decoration-cl-border underline-offset-4 hover:decoration-cl-text"
    >
      <span class="min-w-0 break-all">{article.source}</span>
      <IconArrowSquareOut class="mt-0.5 h-3.5 w-3.5 shrink-0" />
    </a>
  </footer>
</article>
