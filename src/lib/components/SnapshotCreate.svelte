<script lang="ts">
  import { get } from 'svelte/store';
  import { currentRepo } from '$lib/stores/repository';
  import StatusBar from './StatusBar.svelte';

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();

  const repo = get(currentRepo);

  let dirs = $state<string[]>(repo?.dirs ?? ['']);
  let loading = $state(false);
  let output = $state<string | null>(null);
  let status = $state<{ type: 'success' | 'error'; message: string } | null>(null);

  function addDir() {
    dirs = [...dirs, ''];
  }

  function removeDir(i: number) {
    dirs = dirs.filter((_, idx) => idx !== i);
  }

  function updateDir(i: number, val: string) {
    dirs = dirs.map((d, idx) => (idx === i ? val : d));
  }

  async function runBackup() {
    const validDirs = dirs.filter((d) => d.trim());
    if (validDirs.length === 0) {
      status = { type: 'error', message: 'Add at least one directory to back up.' };
      return;
    }
    loading = true;
    status = null;
    output = null;
    try {
      const res = await fetch('/api/restic/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo?.url, password: repo?.password, dirs: validDirs })
      });
      const data = await res.json();
      output = data.stdout || data.stderr || '';
      if (data.success) {
        status = { type: 'success', message: 'Snapshot created successfully.' };
        // persist dirs back into store
        currentRepo.update((r) => (r ? { ...r, dirs: validDirs } : r));
      } else {
        status = { type: 'error', message: data.stderr || data.error || 'Backup failed.' };
      }
    } catch (e) {
      status = { type: 'error', message: String(e) };
    } finally {
      loading = false;
    }
  }
</script>

<div class="snapshot-create">
  <div class="page-header">
    <button class="btn-secondary back-btn" onclick={onBack}>← Back</button>
    <h2>Create Snapshot</h2>
  </div>

  <div class="card">
    <p class="card-desc">
      Select the directories to include in this backup snapshot.
    </p>

    <div class="field" style="margin-top: 1rem;" role="group" aria-labelledby="dirs-label">
      <span id="dirs-label" class="field-label">Directories to back up</span>
      {#each dirs as dir, i}
        <div class="dir-row">
          <input
            type="text"
            value={dir}
            oninput={(e) => updateDir(i, (e.target as HTMLInputElement).value)}
            placeholder="/path/to/directory"
            spellcheck="false"
          />
          {#if dirs.length > 1}
            <button class="btn-icon remove-btn" onclick={() => removeDir(i)} title="Remove">✕</button>
          {/if}
        </div>
      {/each}
      <button class="btn-secondary add-btn" onclick={addDir}>+ Add directory</button>
    </div>

    <StatusBar type={status?.type ?? null} message={status?.message ?? null} />

    <div class="form-footer">
      <button class="btn-primary" onclick={runBackup} disabled={loading}>
        {#if loading}
          <span class="spinner"></span>
          Running backup…
        {:else}
          📸 Create Snapshot
        {/if}
      </button>
    </div>

    {#if output}
      <div class="output-box">
        <span class="output-label">Output</span>
        <pre>{output}</pre>
      </div>
    {/if}
  </div>
</div>

<style>
  .snapshot-create {
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
  }

  .back-btn { font-size: 13px; padding: 5px 12px; }

  .card-desc {
    font-size: 13px;
    color: var(--text-muted);
  }

  .dir-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .remove-btn:hover { color: var(--danger) !important; }

  .field-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .add-btn {
    align-self: flex-start;
    font-size: 12px;
    padding: 4px 10px;
    margin-top: 2px;
  }

  .form-footer {
    margin-top: 1.25rem;
    display: flex;
    gap: 8px;
  }

  .btn-primary {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .output-box {
    margin-top: 1.25rem;
    background: #0d1117;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
  }

  .output-label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 6px;
  }

  pre {
    font-size: 12px;
    color: var(--text-secondary);
    white-space: pre-wrap;
    word-break: break-word;
    font-family: 'SF Mono', 'Fira Code', monospace;
    line-height: 1.5;
  }
</style>
