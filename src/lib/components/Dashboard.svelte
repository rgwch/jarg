<script lang="ts">
  import { get } from 'svelte/store';
  import { currentRepo } from '$lib/stores/repository';

  interface Props {
    onSnapshotCreate: () => void;
    onSnapshotShow: () => void;
    onCheck: () => void;
    onExec: () => void;
    onClose: () => void;
  }

  let { onSnapshotCreate, onSnapshotShow, onCheck, onExec, onClose }: Props = $props();

  const repo = get(currentRepo);
</script>

<div class="dashboard">
  <div class="repo-badge">
    <span class="repo-icon">🗂️</span>
    <div class="repo-info">
      <span class="repo-label">Open repository</span>
      <span class="repo-url">{repo?.url}</span>
    </div>
  </div>

  <div class="actions-grid">
    <button class="action-card" onclick={onSnapshotCreate}>
      <span class="action-icon">📸</span>
      <span class="action-title">Snapshot</span>
      <span class="action-desc">Create a new backup snapshot</span>
    </button>

    <button class="action-card" onclick={onSnapshotShow}>
      <span class="action-icon">📋</span>
      <span class="action-title">Show</span>
      <span class="action-desc">Browse snapshots &amp; restore files</span>
    </button>

    <button class="action-card" onclick={onExec}>
      <span class="action-icon">⌨️</span>
      <span class="action-title">Command</span>
      <span class="action-desc">Run an arbitrary restic command</span>
    </button>

    <button class="action-card" onclick={onCheck}>
      <span class="action-icon">🔍</span>
      <span class="action-title">Check</span>
      <span class="action-desc">Verify repository integrity</span>
    </button>

    <button class="action-card action-card--close" onclick={onClose}>
      <span class="action-icon">🔒</span>
      <span class="action-title">Close</span>
      <span class="action-desc">Close this repository</span>
    </button>
  </div>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .repo-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 1rem 1.25rem;
  }

  .repo-icon { font-size: 1.5rem; }

  .repo-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .repo-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .repo-url {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-primary);
    word-break: break-all;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .action-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text-secondary);
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 1.25rem;
    text-align: left;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
  }

  .action-card:hover {
    border-color: var(--accent);
    background: var(--surface-2);
    transform: translateY(-1px);
  }

  .action-card--close:hover {
    border-color: #da3633;
    background: rgba(218, 54, 51, 0.08);
  }

  .action-icon { font-size: 1.75rem; }

  .action-title {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .action-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.4;
  }
</style>
