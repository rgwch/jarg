<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { currentRepo } from '$lib/stores/repository';
  import StatusBar from './StatusBar.svelte';
  import type { FileEntry } from '$lib/types';

  interface Props {
    snapshotId: string;
    snapshotTime: string;
    onBack: () => void;
  }

  let { snapshotId, snapshotTime, onBack }: Props = $props();

  const repo = get(currentRepo);

  let allFiles = $state<FileEntry[]>([]);
  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let filter = $state('');

  // Copy dialog state
  let copyFile = $state<FileEntry | null>(null);
  let copyTarget = $state('');
  let copying = $state(false);
  let copyStatus = $state<{ type: 'success' | 'error'; message: string } | null>(null);

  let filteredFiles = $derived(
    filter
      ? allFiles.filter((f) => f.path.toLowerCase().includes(filter.toLowerCase()))
      : allFiles
  );

  onMount(loadFiles);

  async function loadFiles() {
    loading = true;
    loadError = null;
    try {
      const res = await fetch('/api/restic/ls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo?.url, password: repo?.password, snapshotId })
      });
      const data = await res.json();
      if (data.success) {
        allFiles = data.files ?? [];
      } else {
        loadError = data.stderr || data.error || 'Failed to list files.';
      }
    } catch (e) {
      loadError = String(e);
    } finally {
      loading = false;
    }
  }

  function openCopy(file: FileEntry) {
    copyFile = file;
    copyTarget = '';
    copyStatus = null;
  }

  function closeCopy() {
    copyFile = null;
    copyStatus = null;
  }

  async function doCopy() {
    if (!copyFile || !copyTarget.trim()) return;
    copying = true;
    copyStatus = null;
    try {
      const res = await fetch('/api/restic/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repo: repo?.url,
          password: repo?.password,
          snapshotId,
          target: copyTarget.trim(),
          include: copyFile.path
        })
      });
      const data = await res.json();
      if (data.success) {
        copyStatus = {
          type: 'success',
          message: `Restored to ${copyTarget}\nNote: file appears at ${copyTarget}${copyFile.path}`
        };
      } else {
        copyStatus = { type: 'error', message: data.stderr || data.error || 'Restore failed.' };
      }
    } catch (e) {
      copyStatus = { type: 'error', message: String(e) };
    } finally {
      copying = false;
    }
  }

  function formatSize(bytes?: number): string {
    if (bytes == null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }

  function typeIcon(type: string): string {
    if (type === 'dir') return '📁';
    if (type === 'symlink') return '🔗';
    return '📄';
  }
</script>

<div class="file-list">
  <div class="page-header">
    <button class="btn-secondary back-btn" onclick={onBack}>← Back</button>
    <div class="header-info">
      <h2>Files in Snapshot</h2>
      <span class="snap-id mono">{snapshotId.slice(0, 8)}</span>
      <span class="snap-time">{new Date(snapshotTime).toLocaleString()}</span>
    </div>
  </div>

  {#if loading}
    <div class="loading-state">
      <span class="spinner"></span>
      Loading files…
    </div>
  {:else if loadError}
    <StatusBar type="error" message={loadError} />
  {:else}
    <div class="filter-row">
      <input
        type="text"
        bind:value={filter}
        placeholder="Filter by path…"
        spellcheck="false"
      />
      <span class="file-count">{filteredFiles.length} of {allFiles.length} entries</span>
    </div>

    {#if filteredFiles.length === 0}
      <div class="empty-state">No entries match your filter.</div>
    {:else}
      <div class="file-table-wrap">
        <table class="file-table">
          <thead>
            <tr>
              <th>Path</th>
              <th>Type</th>
              <th>Size</th>
              <th>Modified</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {#each filteredFiles as file}
              <tr class="file-row">
                <td class="path-cell mono">
                  <span class="type-icon">{typeIcon(file.type)}</span>
                  {file.path}
                </td>
                <td class="muted">{file.type}</td>
                <td class="nowrap muted">{formatSize(file.size)}</td>
                <td class="nowrap muted">
                  {file.mtime ? new Date(file.mtime).toLocaleString() : ''}
                </td>
                <td>
                  {#if file.type !== 'dir'}
                    <button class="btn-secondary copy-btn" onclick={() => openCopy(file)}>
                      Copy…
                    </button>
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</div>

<!-- Copy dialog modal -->
{#if copyFile}
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal">
      <p class="modal-title">Copy file to filesystem</p>
      <div class="copy-file-path mono">{copyFile.path}</div>

      <div class="field">
        <label for="copy-target">Target directory</label>
        <input
          id="copy-target"
          type="text"
          bind:value={copyTarget}
          placeholder="/path/to/target"
          spellcheck="false"
        />
        <span class="field-hint">
          The file will be restored at <code>{copyTarget || '/target'}{copyFile.path}</code>
        </span>
      </div>

      <StatusBar type={copyStatus?.type ?? null} message={copyStatus?.message ?? null} />

      <div class="modal-actions">
        <button class="btn-secondary" onclick={closeCopy}>Cancel</button>
        <button
          class="btn-primary"
          onclick={doCopy}
          disabled={copying || !copyTarget.trim()}
        >
          {#if copying}
            <span class="spinner"></span>
            Restoring…
          {:else}
            Restore File
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .file-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .page-header {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .back-btn { font-size: 13px; padding: 5px 12px; flex-shrink: 0; }

  .header-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .header-info h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .snap-id {
    font-size: 12px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 2px 6px;
    color: var(--accent);
  }

  .snap-time {
    font-size: 12px;
    color: var(--text-muted);
  }

  .filter-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .filter-row input { max-width: 360px; }

  .file-count {
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
  }

  .loading-state {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted);
    font-size: 13px;
    padding: 2rem 0;
    justify-content: center;
  }

  .empty-state {
    color: var(--text-muted);
    font-size: 13px;
    padding: 1rem 0;
  }

  .file-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .file-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }

  .file-table th {
    background: var(--surface);
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .file-row td {
    padding: 7px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    vertical-align: middle;
  }

  .file-row:last-child td { border-bottom: none; }
  .file-row:hover td { background: var(--surface-2); }

  .path-cell {
    max-width: 380px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
  }

  .type-icon { margin-right: 4px; }

  .mono {
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  .nowrap { white-space: nowrap; }
  .muted { color: var(--text-muted); font-size: 12px; }

  .copy-btn {
    font-size: 12px;
    padding: 3px 8px;
  }

  /* Modal */
  .copy-file-path {
    font-size: 12px;
    color: var(--accent);
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 6px 10px;
    word-break: break-all;
  }

  code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    color: var(--text-muted);
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
