<script lang="ts">
  import { t, currentLocale, getDateLocale } from "$lib/i18n";
  import type { SecurityArticle, SecurityArticleText } from "$lib/data/security";
  import SeverityBadge from "./SeverityBadge.svelte";
  import IconArrowUpRight from "~icons/ph/arrow-up-right";

  let { article, text }: { article: SecurityArticle; text: SecurityArticleText } = $props();

  const date = $derived(new Intl.DateTimeFormat(getDateLocale($currentLocale), {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(article.publishedAt)));
</script>

<article class="group rounded-lg border border-cl-border bg-cl-surface transition-colors hover:border-cl-border-hover">
  <a href={`/security/${article.slug}`} class="block p-4 sm:p-5" data-sveltekit-prefetch>
    <div class="flex flex-wrap items-center gap-2 text-[11px]">
      <SeverityBadge severity={article.severity} />
      <span class="rounded border border-cl-border bg-cl-elevated px-1.5 py-0.5 text-[10px] font-medium text-cl-muted">
        {$t(`security.category.${article.category}`)}
      </span>
      {#if article.cve}
        <span class="rounded border border-cl-border bg-cl-elevated px-1.5 py-0.5 font-mono text-[10px] text-cl-text">{article.cve}</span>
      {/if}
      <time datetime={article.publishedAt} class="ml-auto text-cl-dim">{date}</time>
    </div>
    <h2 class="mt-3 text-base font-semibold text-cl-text [overflow-wrap:anywhere]">{text.title}</h2>
    <p class="mt-2 text-xs leading-relaxed text-cl-muted [overflow-wrap:anywhere]">{text.summary}</p>
    <span class="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-cl-muted transition-colors group-hover:text-cl-text">
      {$t('security.readArticle')}
      <IconArrowUpRight class="h-3.5 w-3.5" />
    </span>
  </a>
</article>
