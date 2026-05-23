<script lang="ts">
  import { get } from 'svelte/store';
  import { currentRepo } from '$lib/stores/repository';
  import StatusBar from './StatusBar.svelte';

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();

  const repo = get(currentRepo);

  let readData = $state(false);
  let loading = $state(false);
  let unlocking = $state(false);
  let output = $state<string | null>(null);
  let status = $state<{ type: 'success' | 'error'; message: string } | null>(null);
  let isLocked = $state(false);

  async function runCheck() {
    loading = true;
    status = null;
    output = null;
    isLocked = false;
    try {
      const res = await fetch('/api/restic/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo?.url, password: repo?.password, readData })
      });
      const data = await res.json();
      output = [data.stdout, data.stderr].filter(Boolean).join('\n').trim();
      if (data.success) {
        status = { type: 'success', message: 'Repository integrity check passed.' };
      } else {
        const combined = output ?? '';
        isLocked = combined.includes('repo already locked') || combined.includes('unable to create lock');
        status = {
          type: 'error',
          message: isLocked
            ? 'Repository is locked. Unlock it and try again.'
            : 'Repository check found errors — see output below.'
        };
      }
    } catch (e) {
      status = { type: 'error', message: String(e) };
    } finally {
      loading = false;
    }
  }

  async function runUnlock() {
    unlocking = true;
    status = null;
    try {
      const res = await fetch('/api/restic/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo?.url, password: repo?.password })
      });
      const data = await res.json();
      const unlockOutput = [data.stdout, data.stderr].filter(Boolean).join('\n').trim();
      if (data.success) {
        isLocked = false;
        output = unlockOutput;
        status = { type: 'success', message: 'Repository unlocked. You can now run the check again.' };
      } else {
        status = { type: 'error', message: unlockOutput || 'Unlock failed.' };
      }
    } catch (e) {
      status = { type: 'error', message: String(e) };
    } finally {
      unlocking = false;
    }
  }
</script>

<div class="check-repo">
  <div class="page-header">
    <button class="btn-secondary back-btn" onclick={onBack}>← Back</button>
    <h2>Check Repository</h2>
  </div>

  <div class="card">
    <p class="card-desc">
      Verify the integrity and consistency of the repository. This checks all pack files and
      the index for corruption.
    </p>

    <div class="field-inline" style="margin-top: 1rem;">
      <input type="checkbox" id="read-data" bind:checked={readData} />
      <label for="read-data">Read and verify all data blobs (<code>--read-data</code>)</label>
    </div>
    <p class="option-hint">Without this option only metadata is checked (faster). Enable to fully verify all backup data.</p>

    <StatusBar type={status?.type ?? null} message={status?.message ?? null} />

    <div class="form-footer">
      <button class="btn-primary" onclick={runCheck} disabled={loading || unlocking}>
        {#if loading}
          <span class="spinner"></span>
          Checking…
        {:else}
          🔍 Run Check
        {/if}
      </button>

      {#if isLocked}
        <button class="btn-danger" onclick={runUnlock} disabled={unlocking || loading}>
          {#if unlocking}
            <span class="spinner"></span>
            Unlocking…
          {:else}
            🔓 Unlock Repository
          {/if}
        </button>
      {/if}
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
  .check-repo {
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
    line-height: 1.5;
  }

  .option-hint {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
    line-height: 1.4;
  }

  code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1px 4px;
  }

  .form-footer {
    margin-top: 1.25rem;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .btn-primary, .btn-danger {
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
