<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRepo } from '$lib/stores/repository';
  import RepoSetup from '$lib/components/RepoSetup.svelte';
  import Dashboard from '$lib/components/Dashboard.svelte';
  import SnapshotCreate from '$lib/components/SnapshotCreate.svelte';
  import SnapshotList from '$lib/components/SnapshotList.svelte';
  import FileList from '$lib/components/FileList.svelte';

  import CheckRepo from '$lib/components/CheckRepo.svelte';
  import ExecCommand from '$lib/components/ExecCommand.svelte';

  type View = 'setup' | 'dashboard' | 'snapshot-create' | 'snapshot-list' | 'file-list' | 'check' | 'exec';

  let view = $state<View>('setup');
  let selectedSnapshotId = $state<string>('');
  let selectedSnapshotTime = $state<string>('');

  // Track whether a repo is open
  let repoOpen = $state(false);

  onMount(() => {
    const unsub = currentRepo.subscribe((repo) => {
      if (repo) {
        repoOpen = true;
        if (view === 'setup') view = 'dashboard';
      } else {
        repoOpen = false;
        view = 'setup';
      }
    });
    return unsub;
  });

  function handleClose() {
    currentRepo.set(null);
    view = 'setup';
  }

  function handleSelectSnapshot(id: string, time: string) {
    selectedSnapshotId = id;
    selectedSnapshotTime = time;
    view = 'file-list';
  }
</script>

{#if view === 'setup'}
  <RepoSetup />

{:else if view === 'dashboard'}
  <Dashboard
    onSnapshotCreate={() => (view = 'snapshot-create')}
    onSnapshotShow={() => (view = 'snapshot-list')}
    onCheck={() => (view = 'check')}
    onExec={() => (view = 'exec')}
    onClose={handleClose}
  />

{:else if view === 'snapshot-create'}
  <SnapshotCreate onBack={() => (view = 'dashboard')} />

{:else if view === 'snapshot-list'}
  <SnapshotList
    onBack={() => (view = 'dashboard')}
    onSelectSnapshot={handleSelectSnapshot}
  />

{:else if view === 'file-list'}
  <FileList
    snapshotId={selectedSnapshotId}
    snapshotTime={selectedSnapshotTime}
    onBack={() => (view = 'snapshot-list')}
  />
{:else if view === 'check'}
  <CheckRepo onBack={() => (view = 'dashboard')} />

{:else if view === 'exec'}
  <ExecCommand onBack={() => (view = 'dashboard')} />
{/if}
