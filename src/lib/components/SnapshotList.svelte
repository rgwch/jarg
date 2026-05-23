<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { currentRepo } from '$lib/stores/repository';
  import StatusBar from './StatusBar.svelte';
  import type { Snapshot } from '$lib/types';

  interface Props {
    onBack: () => void;
    onSelectSnapshot: (id: string, time: string) => void;
  }

  let { onBack, onSelectSnapshot }: Props = $props();

  const repo = get(currentRepo);

  let snapshots = $state<Snapshot[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(loadSnapshots);

  async function loadSnapshots() {
    loading = true;
    error = null;
    try {
      const res = await fetch('/api/restic/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo?.url, password: repo?.password })
      });
      const data = await res.json();
      if (data.success) {
        snapshots = (data.snapshots ?? []).slice().reverse();
      } else {
        error = data.stderr || data.error || 'Failed to load snapshots.';
      }
    } catch (e) {
      error = String(e);
    } finally {
      loading = false;
    }
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString();
  }

  function formatBytes(bytes?: number): string {
    if (bytes == null) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
    return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  }
</script>

<div class="snapshot-list">
  <div class="page-header">
    <button class="btn-secondary back-btn" onclick={onBack}>← Back</button>
    <h2>Snapshots</h2>
    <button class="btn-secondary refresh-btn" onclick={loadSnapshots} disabled={loading} title="Refresh">
      {loading ? '…' : '↺'}
    </button>
  </div>

  {#if loading}
    <div class="loading-state">
      <span class="spinner"></span>
      Loading snapshots…
    </div>
  {:else if error}
    <StatusBar type="error" message={error} />
  {:else if snapshots.length === 0}
    <div class="empty-state">
      <span class="empty-icon">📭</span>
      <p>No snapshots yet. Create one from the dashboard.</p>
    </div>
  {:else}
    <div class="snap-table-wrap">
      <table class="snap-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Host</th>
            <th>Paths</th>
            <th>Size</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each snapshots as snap}
            <tr class="snap-row">
              <td class="mono short-id">{snap.short_id}</td>
              <td class="nowrap">{formatDate(snap.time)}</td>
              <td>{snap.hostname}</td>
              <td class="paths-cell">{snap.paths.join(', ')}</td>
              <td class="nowrap muted">
                {snap.summary ? formatBytes(snap.summary.total_bytes_processed) : ''}
              </td>
              <td>
                <button
                  class="btn-secondary browse-btn"
                  onclick={() => onSelectSnapshot(snap.id, snap.time)}
                >
                  Browse →
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  .snapshot-list {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .page-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .page-header h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    flex: 1;
  }

  .back-btn { font-size: 13px; padding: 5px 12px; }

  .refresh-btn {
    font-size: 16px;
    padding: 4px 10px;
    line-height: 1;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 3rem 0;
    color: var(--text-muted);
    font-size: 13px;
  }

  .empty-icon { font-size: 2rem; }

  .snap-table-wrap {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .snap-table {
    border-collapse: collapse;
    width: 100%;
    font-size: 13px;
  }

  .snap-table th {
    background: var(--surface);
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 8px 12px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }

  .snap-row td {
    padding: 10px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-secondary);
    vertical-align: middle;
  }

  .snap-row:last-child td { border-bottom: none; }

  .snap-row:hover td { background: var(--surface-2); }

  .mono {
    font-family: 'SF Mono', 'Fira Code', monospace;
    color: var(--accent);
  }

  .nowrap { white-space: nowrap; }

  .muted { color: var(--text-muted); }

  .paths-cell {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 12px;
  }

  .browse-btn {
    font-size: 12px;
    padding: 4px 10px;
    white-space: nowrap;
  }
</style>
