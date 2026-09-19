<script lang="ts">
  import { tick } from "svelte";
  import { t, locale, getDateLocale } from "$lib/i18n";
  import { downloadSource, type DownloadLogEntry } from "$lib/utils/download-log";
  import IconCheck from "~icons/ph/check";
  import IconWarning from "~icons/ph/warning";
  import IconDownload from "~icons/ph/download-simple";
  import IconPackage from "~icons/ph/package";
  import IconCopy from "~icons/ph/copy";
  import IconArrowDown from "~icons/ph/arrow-down";
  import IconCaretDown from "~icons/ph/caret-down";
  import IconSpinner from "~icons/ph/spinner";

  let { entries, attempt, total = 0, packingProgress = null }: {
    entries: DownloadLogEntry[];
    attempt: number;
    total?: number;
    packingProgress?: number | null;
  } = $props();

  let errorsOnly = $state(false);
  let copyState = $state<'idle' | 'copied' | 'failed'>('idle');
  let following = $state(true);
  let viewport = $state<HTMLDivElement>();
  let latest = $derived(entries.at(-1));
  let status = $derived(latest?.kind === 'error' ? 'failed' : latest?.kind === 'ready' ? 'complete' : latest?.kind === 'packing' ? 'packaging' : 'downloading');
  let received = $derived(entries.filter((entry) => entry.kind === 'received'));
  let errors = $derived(entries.filter((entry) => entry.kind === 'error'));
  let bytes = $derived(received.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0));
  let visibleEntries = $derived(errorsOnly ? errors : entries);
  let percent = $derived(total > 0 ? Math.min(100, Math.round(received.length / total * 100)) : 0);
  let elapsed = $derived(latest?.timestamp !== undefined && entries[0]?.timestamp !== undefined ? latest.timestamp - entries[0].timestamp : 0);

  $effect(() => {
    attempt;
    errorsOnly = false;
    copyState = 'idle';
    following = true;
  });

  $effect(() => {
    visibleEntries.length;
    const element = viewport;
    if (following && element) {
      void tick().then(() => { if (following) element.scrollTop = element.scrollHeight; });
    }
  });

  function size(value: number) {
    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.min(3, Math.max(0, Math.floor(Math.log(value || 1) / Math.log(1024))));
    return `${(value / 1024 ** index).toLocaleString(getDateLocale($locale), { maximumFractionDigits: index === 0 ? 0 : 1 })} ${units[index]}`;
  }

  function duration(value: number) {
    return `${(value / 1000).toLocaleString(getDateLocale($locale), { maximumFractionDigits: 1 })} s`;
  }

  function time(value: number) {
    return new Date(value).toLocaleTimeString(getDateLocale($locale), { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  }

  async function copyLog() {
    const currentAttempt = attempt;
    const text = entries.map((entry) => [
      entry.timestamp !== undefined ? `[${new Date(entry.timestamp).toISOString()}]` : '',
      $t(`downloadLog.${entry.kind}`, { values: { name: entry.name ?? '' } }),
      entry.url, entry.detail,
      entry.bytes !== undefined ? size(entry.bytes) : '',
      entry.durationMs !== undefined ? duration(entry.durationMs) : '',
    ].filter(Boolean).join(' ')).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      if (currentAttempt === attempt) copyState = 'copied';
    } catch {
      if (currentAttempt === attempt) copyState = 'failed';
    }
  }
</script>

{#if entries.length > 0}
  {#key attempt}
    <details class="download-log group min-w-0 overflow-hidden rounded border border-cl-border bg-cl-base text-cl-text" ontoggle={(event) => { if (event.currentTarget.open && following && viewport) viewport.scrollTop = viewport.scrollHeight; }}>
      <summary title={$t(`downloadLog.${status}`)} class="relative flex cursor-pointer list-none items-center gap-1.5 px-2 py-2 text-[10px] font-medium [&::-webkit-details-marker]:hidden">
        {#if status === 'failed'}<IconWarning class="size-3 shrink-0 text-cl-danger" />{:else if status === 'complete'}<IconCheck class="size-3 shrink-0 text-cl-success" />{:else}<IconSpinner class="size-3 shrink-0 animate-spin motion-reduce:animate-none text-cl-dim" />{/if}
        <span class="min-w-0 flex-1 truncate">{$t('downloadLog.title')}</span>
        <span class="sr-only" role="status">{$t(`downloadLog.${status}`)}</span>
        <span class="shrink-0 font-normal tabular-nums text-cl-dim">{status === 'packaging' ? `${packingProgress ?? 0}%` : `${received.length}/${total}`}</span>
        <IconCaretDown class="size-3 shrink-0 text-cl-dim transition-transform group-open:rotate-180" />
        <span class="absolute inset-x-0 bottom-0 h-px bg-cl-elevated" aria-hidden="true"><span class="block h-full {status === 'failed' ? 'bg-cl-danger' : 'bg-cl-success'}" style={`width: ${percent}%`}></span></span>
      </summary>

      <div class="border-t border-cl-border px-2 py-2">
        <div class="flex flex-wrap justify-between gap-x-2 gap-y-1 text-[9px] text-cl-dim">
          <span class="text-cl-muted" class:text-cl-danger={status === 'failed'}>{$t(`downloadLog.${status}`)}</span>
          <span class="tabular-nums">{size(bytes)}{status === 'complete' || status === 'failed' ? ` · ${duration(elapsed)}` : ''}</span>
        </div>
        <progress value={percent} max="100" aria-label={$t('downloadLog.transferProgress')} class="sr-only"></progress>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-1 border-y border-cl-border px-2 py-1">
        <div class="flex gap-1" role="group" aria-label={$t('downloadLog.filter')}>
          <button onclick={() => { errorsOnly = false; following = true; }} aria-pressed={!errorsOnly} class="rounded px-1.5 py-1 text-[9px] {!errorsOnly ? 'bg-cl-elevated text-cl-text' : 'text-cl-dim hover:text-cl-text'}">{$t('downloadLog.all')} <span class="tabular-nums">{entries.length}</span></button>
          <button onclick={() => { errorsOnly = true; following = true; }} aria-pressed={errorsOnly} class="rounded px-1.5 py-1 text-[9px] {errorsOnly ? 'bg-cl-elevated text-cl-text' : 'text-cl-dim hover:text-cl-text'}">{$t('downloadLog.errors')} <span class:text-cl-danger={errors.length > 0} class="tabular-nums">{errors.length}</span></button>
        </div>
        <button onclick={copyLog} class="inline-flex items-center gap-1 text-[9px] text-cl-dim hover:text-cl-text"><IconCopy class="size-3" />{$t(copyState === 'copied' ? 'downloadLog.copied' : 'downloadLog.copy')}</button>
      </div>
      {#if copyState === 'failed'}<p role="status" class="px-3 pt-2 text-[10px] text-cl-danger">{$t('downloadLog.copyFailed')}</p>{/if}

      <!-- svelte-ignore a11y_no_noninteractive_tabindex (The event history must be keyboard-scrollable.) -->
      <div bind:this={viewport} role="log" aria-label={$t('downloadLog.title')} aria-live="polite" aria-relevant="additions" tabindex="0" onscroll={(event) => { const el = event.currentTarget; following = el.scrollHeight - el.scrollTop - el.clientHeight < 24; }} class="max-h-40 overflow-y-auto px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cl-text">
        <ol class="divide-y divide-cl-border">
          {#each visibleEntries as entry}
            {@const source = downloadSource(entry.url)}
            <li class="flex items-start gap-1.5 py-1.5" class:text-cl-danger={entry.kind === 'error'} title={entry.timestamp !== undefined ? `${time(entry.timestamp)}${entry.bytes !== undefined ? ` · ${size(entry.bytes)}` : ''}${entry.durationMs !== undefined ? ` · ${duration(entry.durationMs)}` : ''}` : undefined}>
              <span class="mt-0.5 shrink-0" aria-hidden="true">
                {#if entry.kind === 'error'}<IconWarning class="size-3" />{:else if entry.kind === 'received' || entry.kind === 'ready'}<IconCheck class="size-3 text-cl-success" />{:else if entry.kind === 'packing'}<IconPackage class="size-3 text-cl-dim" />{:else}<IconDownload class="size-3 text-cl-dim" />{/if}
              </span>
              <div class="min-w-0 flex-1">
                <p class="break-words text-[10px] leading-snug [overflow-wrap:anywhere]">
                  {$t(`downloadLog.${entry.kind}`, { values: { name: entry.name ?? '' } })}
                  {#if source}<a href={source.href} title={source.href} target="_blank" rel="noopener noreferrer" class="underline decoration-cl-border-hover underline-offset-2 hover:decoration-current">{source.host}</a>{:else if entry.url}<span>{entry.url}</span>{/if}
                </p>
                {#if entry.detail}<p class="mt-1 break-words rounded bg-cl-danger/10 px-2 py-1 font-mono text-[10px] [overflow-wrap:anywhere]">{entry.detail}</p>{/if}
              </div>
            </li>
          {:else}
            <li class="py-3 text-center text-[10px] text-cl-dim">{$t('downloadLog.noErrors')}</li>
          {/each}
        </ol>
      </div>
      {#if !following}<button onclick={() => following = true} class="flex w-full items-center justify-center gap-1 border-t border-cl-border px-2 py-1.5 text-[9px] text-cl-muted hover:text-cl-text"><IconArrowDown class="size-3" />{$t('downloadLog.latest')}</button>{/if}
    </details>
  {/key}
{/if}
