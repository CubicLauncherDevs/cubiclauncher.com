<script lang="ts">
  import { t } from "$lib/i18n";
  import { renderMarkdown } from "$lib/utils/markdown";
  import { splitArticleSections } from "$lib/utils/security-article";
  import type { SecurityArticleBody } from "$lib/data/security";
  import { severityStyles } from "./SeverityBadge.svelte";
  import IconCheck from "~icons/ph/check";
  import IconX from "~icons/ph/x";

  let { body }: { body: SecurityArticleBody } = $props();

  const sections = $derived(splitArticleSections(body.sections));
  const paragraphHtml = $derived(body.paragraphs.map((paragraph) => renderMarkdown(paragraph)));

  const tableHeaders = ["versions", "status", "notes"] as const;
</script>

<div class="space-y-7">
  {#each paragraphHtml as html}
    <div class="security-article prose min-w-0 text-sm [overflow-wrap:anywhere]">
      {@html html}
    </div>
  {/each}

  {#if body.details.length > 0}
    <dl class="grid gap-x-6 gap-y-3 rounded-lg border border-cl-border bg-cl-surface p-4 text-xs sm:grid-cols-2">
      {#each body.details as detail}
        <div>
          <dt class="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-cl-dim">{detail.label}</dt>
          <dd class="leading-relaxed text-cl-text [overflow-wrap:anywhere]">{detail.value}</dd>
        </div>
      {/each}
    </dl>
  {/if}

  {#if body.versions.length > 0}
    <div class="overflow-x-auto rounded-lg border border-cl-border bg-cl-surface">
      <table class="w-full border-collapse text-left text-xs">
        <thead>
          <tr class="border-b border-cl-border">
            <th class="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-cl-dim">{$t(`security.versions.${tableHeaders[0]}`)}</th>
            {#each tableHeaders.slice(1) as key}
              <th class="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-cl-dim">{$t(`security.versions.${key}`)}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each body.versions as row}
            <tr class="border-b border-cl-border last:border-b-0">
              <td class="whitespace-nowrap px-3 py-2 font-mono text-[11px] text-cl-text">{row.versions}</td>
              <td class="px-3 py-2">
                <span
                  class="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider {severityStyles[
                    row.status
                  ]}"
                >
                  
                  {$t(`security.status.${row.status}`)}
                </span>
              </td>
              <td class="px-3 py-2 leading-relaxed text-cl-muted [overflow-wrap:anywhere]">{row.notes}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if sections.length > 0}
    <div class="space-y-6">
      {#each sections as section}
        <section>
          <h2 class="mb-2 text-base font-semibold text-cl-text">{section.heading}</h2>
          <div class="security-article prose min-w-0 text-sm [overflow-wrap:anywhere]">
            {@html renderMarkdown(section.markdown)}
          </div>
        </section>
      {/each}
    </div>
  {/if}

  <div class="grid gap-4 sm:grid-cols-2">
    <section class="rounded-lg border border-cl-border bg-cl-surface p-4">
      <h2 class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-cl-text">
        <IconCheck class="h-4 w-4 text-emerald-400" />
        {body.mitigationTitle}
      </h2>
      <div class="security-article prose min-w-0 text-xs [overflow-wrap:anywhere]">
        {@html renderMarkdown(body.mitigation)}
      </div>
    </section>
    <section class="rounded-lg border border-cl-border bg-cl-surface p-4">
      <h2 class="mb-2 flex items-center gap-1.5 text-sm font-semibold text-cl-text">
        <IconX class="h-4 w-4 text-red-400" />
        {body.riskTitle}
      </h2>
      <div class="security-article prose min-w-0 text-xs [overflow-wrap:anywhere]">
        {@html renderMarkdown(body.risk)}
      </div>
    </section>
  </div>

  {#if body.caveat}
    <aside class="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <h2 class="mb-1.5 text-sm font-semibold text-cl-text">{body.caveatTitle}</h2>
      <div class="security-article prose min-w-0 text-xs text-cl-muted [overflow-wrap:anywhere]">
        {@html renderMarkdown(body.caveat)}
      </div>
    </aside>
  {/if}
</div>

<style>
  .security-article :global(> :first-child) { margin-top: 0; }
  .security-article :global(> :last-child) { margin-bottom: 0; }
  .security-article :global(a) { color: var(--cl-text); text-decoration: underline; text-underline-offset: 3px; }
  .security-article :global(code) { font-size: 0.95em; }
  .security-article :global(ul) { list-style: none; }
  .security-article :global(ol) { list-style: decimal; padding-left: 1.25rem; }
  .security-article :global(ol > li::before) { content: none; }
  .security-article :global(pre) { max-width: 100%; overflow-x: auto; }
</style>
