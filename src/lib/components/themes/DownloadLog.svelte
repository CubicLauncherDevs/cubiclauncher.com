<script lang="ts">
  import { t } from "$lib/i18n";
  import { downloadSource, type DownloadLogEntry } from "$lib/utils/download-log";

  let { entries, attempt }: { entries: DownloadLogEntry[]; attempt: number } = $props();
</script>

{#if entries.length > 0}
  {#key attempt}
    <details open class="min-w-0 rounded border border-cl-border bg-cl-elevated text-cl-text">
      <summary class="cursor-pointer px-3 py-2 text-xs font-medium">
        {$t('downloadLog.title')}
      </summary>
      <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the download history.) -->
      <div
        role="log"
        aria-label={$t('downloadLog.title')}
        aria-live="polite"
        aria-relevant="additions"
        tabindex="0"
        class="max-h-56 overflow-y-auto border-t border-cl-border p-3 font-mono text-[11px] leading-relaxed focus-visible:outline focus-visible:outline-cl-text"
      >
        <ol class="space-y-2">
          {#each entries as entry}
            {@const source = downloadSource(entry.url)}
            <li class="break-words [overflow-wrap:anywhere]" class:text-cl-danger={entry.kind === 'error'}>
              <span aria-hidden="true">{entry.kind === 'error' ? '×' : entry.kind === 'received' || entry.kind === 'ready' ? '✓' : '›'}</span>
              {$t(`downloadLog.${entry.kind}`, { values: { name: entry.name ?? '' } })}
              {#if source}
                <a
                  href={source.href}
                  title={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline underline-offset-2 hover:opacity-80"
                >{source.host}</a>
              {:else if entry.url}
                <span>{entry.url}</span>
              {/if}
              {#if entry.detail}
                <span> — {entry.detail}</span>
              {/if}
            </li>
          {/each}
        </ol>
      </div>
    </details>
  {/key}
{/if}
