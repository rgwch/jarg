<script lang="ts">
  import '../app.css';

  let { children } = $props();
</script>

<div class="app">
  <header class="app-header">
    <span class="app-logo">🗂️</span>
    <span class="app-name">Restic GUI</span>
  </header>
  <main class="app-main">
    {@render children()}
  </main>
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 0 1.5rem;
    height: 48px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
  }

  .app-logo { font-size: 1.25rem; }

  .app-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .app-main {
    flex: 1;
    padding: 2rem;
    max-width: 1100px;
    margin: 0 auto;
    width: 100%;
  }
</style>
