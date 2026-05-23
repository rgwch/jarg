<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRepo } from '$lib/stores/repository';
  import StatusBar from './StatusBar.svelte';

  let mode = $state<'open' | 'create'>('open');
  let repoUrl = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let rememberPassword = $state(false);
  let dirs = $state<string[]>(['']);
  let loading = $state(false);
  let status = $state<{ type: 'success' | 'error'; message: string } | null>(null);
  let recentRepos = $state<string[]>([]);

  onMount(() => {
    const saved = localStorage.getItem('restic-recent-repos');
    if (saved) {
      try { recentRepos = JSON.parse(saved); } catch { /* ignore */ }
    }
  });

  function onUrlBlur() {
    if (!repoUrl) return;
    const pw = localStorage.getItem(`restic-pw:${repoUrl}`);
    if (pw) {
      password = pw;
      rememberPassword = true;
    }
  }

  function addDir() {
    dirs = [...dirs, ''];
  }

  function removeDir(i: number) {
    dirs = dirs.filter((_, idx) => idx !== i);
  }

  function updateDir(i: number, val: string) {
    dirs = dirs.map((d, idx) => (idx === i ? val : d));
  }

  function saveRecent(url: string) {
    const updated = [url, ...recentRepos.filter((r) => r !== url)].slice(0, 10);
    recentRepos = updated;
    localStorage.setItem('restic-recent-repos', JSON.stringify(updated));
  }

  function maybeSavePassword() {
    if (rememberPassword && repoUrl) {
      localStorage.setItem(`restic-pw:${repoUrl}`, password);
    }
  }

  async function handleOpen() {
    if (!repoUrl || !password) {
      status = { type: 'error', message: 'Repository URL and password are required.' };
      return;
    }
    loading = true;
    status = null;
    try {
      const res = await fetch('/api/restic/snapshots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoUrl, password })
      });
      const data = await res.json();
      if (data.success) {
        maybeSavePassword();
        saveRecent(repoUrl);
        currentRepo.set({ url: repoUrl, password });
      } else {
        status = {
          type: 'error',
          message: data.stderr || data.error || 'Failed to open repository.'
        };
      }
    } catch (e) {
      status = { type: 'error', message: String(e) };
    } finally {
      loading = false;
    }
  }

  async function handleCreate() {
    if (!repoUrl || !password) {
      status = { type: 'error', message: 'Repository URL and password are required.' };
      return;
    }
    if (password !== confirmPassword) {
      status = { type: 'error', message: 'Passwords do not match.' };
      return;
    }
    const validDirs = dirs.filter((d) => d.trim());
    if (validDirs.length === 0) {
      status = { type: 'error', message: 'At least one backup directory is required.' };
      return;
    }
    loading = true;
    status = null;
    try {
      const res = await fetch('/api/restic/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo: repoUrl, password })
      });
      const data = await res.json();
      if (data.success) {
        maybeSavePassword();
        saveRecent(repoUrl);
        currentRepo.set({ url: repoUrl, password, dirs: validDirs });
      } else {
        status = {
          type: 'error',
          message: data.stderr || data.error || 'Failed to create repository.'
        };
      }
    } catch (e) {
      status = { type: 'error', message: String(e) };
    } finally {
      loading = false;
    }
  }
</script>

<div class="repo-setup">
  <div class="card setup-card">
    <h2 class="card-title">🗂️ Restic Repository</h2>

    <div class="tabs">
      <button class="tab" class:active={mode === 'open'} onclick={() => { mode = 'open'; status = null; }}>
        Open
      </button>
      <button class="tab" class:active={mode === 'create'} onclick={() => { mode = 'create'; status = null; }}>
        Create
      </button>
    </div>

    <div class="form">
      <div class="field">
        <label for="repo-url">Repository URL</label>
        <datalist id="recent-repos-list">
          {#each recentRepos as r}
            <option value={r}></option>
          {/each}
        </datalist>
        <input
          id="repo-url"
          type="text"
          bind:value={repoUrl}
          list="recent-repos-list"
          onblur={onUrlBlur}
          placeholder="e.g. /backups/myrepo  or  sftp:user@host:/path"
          autocomplete="off"
          spellcheck="false"
        />
        <span class="field-hint">Local path or remote URL (sftp:, s3:, b2:, gs:, …)</span>
      </div>

      <div class="field">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          placeholder="Repository password"
          autocomplete={mode === 'create' ? 'new-password' : 'current-password'}
        />
      </div>

      {#if mode === 'create'}
        <div class="field">
          <label for="confirm-pw">Confirm Password</label>
          <input
            id="confirm-pw"
            type="password"
            bind:value={confirmPassword}
            placeholder="Repeat password"
            autocomplete="new-password"
          />
        </div>

        <div class="field" role="group" aria-labelledby="dirs-label-setup">
          <span id="dirs-label-setup" class="field-label">Directories to back up</span>
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
          <button class="btn-secondary add-dir-btn" onclick={addDir}>+ Add directory</button>
        </div>
      {/if}

      <div class="field-inline">
        <input type="checkbox" id="remember-pw" bind:checked={rememberPassword} />
        <label for="remember-pw">Remember password for this repository</label>
      </div>

      <StatusBar type={status?.type ?? null} message={status?.message ?? null} />

      <button
        class="btn-primary submit-btn"
        onclick={mode === 'open' ? handleOpen : handleCreate}
        disabled={loading}
      >
        {#if loading}
          <span class="spinner"></span>
          Working…
        {:else if mode === 'open'}
          Open Repository
        {:else}
          Create &amp; Open Repository
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .repo-setup {
    display: flex;
    justify-content: center;
    padding-top: 3rem;
  }

  .setup-card {
    width: 100%;
    max-width: 480px;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.25rem;
  }

  .tab {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 13px;
    padding: 6px 14px;
    margin-bottom: -1px;
    transition: color 0.15s, border-color 0.15s;
  }

  .tab:hover { color: var(--text-secondary); }

  .tab.active {
    color: var(--text-primary);
    border-bottom-color: var(--accent);
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 14px;
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

  .add-dir-btn {
    align-self: flex-start;
    font-size: 12px;
    padding: 4px 10px;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 4px;
  }
</style>
