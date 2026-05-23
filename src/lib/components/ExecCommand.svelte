<script lang="ts">
  import { get } from 'svelte/store';
  import { currentRepo } from '$lib/stores/repository';
  import StatusBar from './StatusBar.svelte';

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();

  const repo = get(currentRepo);

  let command = $state('');
  let loading = $state(false);
  let output = $state<string | null>(null);
  let outputType = $state<'success' | 'error'>('success');
  let status = $state<{ type: 'success' | 'error'; message: string } | null>(null);
  let history = $state<string[]>([]);
  let historyIndex = $state(-1);

  function addToHistory(cmd: string) {
    history = [cmd, ...history.filter((h) => h !== cmd)].slice(0, 50);
    historyIndex = -1;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      historyIndex = next;
      if (history[next] != null) command = history[next];
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIndex - 1, -1);
      historyIndex = next;
      command = next === -1 ? '' : history[next];
    }
  }

  async function runCommand() {
    const cmd = command.trim();
    if (!cmd || loading) return;
    loading = true;
    status = null;
    output = null;
    try {
      const res = await fetch('/api/restic/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repo?.url, password: repo?.password, command: cmd })
      });
      const data = await res.json();
      output = [data.stdout, data.stderr].filter(Boolean).join('\n').trim();
      outputType = data.success ? 'success' : 'error';
      addToHistory(cmd);
      if (!data.success) {
        status = { type: 'error', message: `Command exited with error.` };
      }
    } catch (e) {
      status = { type: 'error', message: String(e) };
    } finally {
      loading = false;
    }
  }
</script>

<div class="exec-command">
  <div class="page-header">
    <button class="btn-secondary back-btn" onclick={onBack}>← Back</button>
    <h2>Run Command</h2>
  </div>

  <div class="card">
    <p class="card-desc">
      Run any <code>restic</code> command against this repository.
      The <code>-r &lt;repo&gt;</code> flag and password are added automatically.
    </p>

    <div class="terminal-row">
      <span class="prompt" title="restic -r {repo?.url}">restic -r …</span>
      <input
        class="cmd-input"
        type="text"
        bind:value={command}
        onkeydown={handleKeydown}
        placeholder="e.g.  stats   or   forget --keep-last 7 --prune"
        spellcheck="false"
        autocomplete="off"
        disabled={loading}
      />
      <button class="btn-primary run-btn" onclick={runCommand} disabled={loading || !command.trim()}>
        {#if loading}
          <span class="spinner"></span>
        {:else}
          ▶
        {/if}
      </button>
    </div>

    {#if history.length > 0}
      <div class="history-hint">↑ / ↓ to navigate command history ({history.length} entries)</div>
    {/if}

    <StatusBar type={status?.type ?? null} message={status?.message ?? null} />

    {#if output}
      <div class="output-box" class:output-error={outputType === 'error'}>
        <span class="output-label">Output</span>
        <pre>{output}</pre>
      </div>
    {/if}
  </div>
</div>

<style>
  .exec-command {
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
    margin-bottom: 1rem;
  }

  code {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
    background: var(--surface-2);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 1px 4px;
  }

  .terminal-row {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #0d1117;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 6px 10px;
    transition: border-color 0.15s;
  }

  .terminal-row:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(56, 139, 253, 0.12);
  }

  .prompt {
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    flex-shrink: 0;
  }

  .cmd-input {
    flex: 1;
    background: transparent;
    border: none;
    box-shadow: none;
    color: var(--text-primary);
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 13px;
    padding: 0;
    outline: none;
  }

  .cmd-input:focus {
    border: none;
    box-shadow: none;
  }

  .run-btn {
    background: transparent;
    border: none;
    color: var(--accent);
    font-size: 14px;
    padding: 2px 6px;
    border-radius: 4px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    transition: background 0.15s;
  }

  .run-btn:hover:not(:disabled) { background: rgba(56, 139, 253, 0.12); }
  .run-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .history-hint {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .output-box {
    margin-top: 1.25rem;
    background: #0d1117;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
  }

  .output-box.output-error {
    border-color: rgba(248, 81, 73, 0.4);
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
