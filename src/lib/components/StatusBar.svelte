<script lang="ts">
  interface Props {
    type?: 'success' | 'error' | 'info' | null;
    message?: string | null;
  }

  let { type = null, message = null }: Props = $props();
</script>

{#if message}
  <div class="status-bar" class:success={type === 'success'} class:error={type === 'error'} class:info={type === 'info' || !type}>
    <span class="icon">
      {#if type === 'success'}✓{:else if type === 'error'}✗{:else}ℹ{/if}
    </span>
    <span class="msg">{message}</span>
  </div>
{/if}

<style>
  .status-bar {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px 12px;
    border-radius: 6px;
    font-size: 13px;
    border: 1px solid transparent;
  }

  .success {
    background: rgba(35, 134, 54, 0.15);
    border-color: rgba(63, 185, 80, 0.3);
    color: #3fb950;
  }

  .error {
    background: rgba(218, 54, 51, 0.15);
    border-color: rgba(248, 81, 73, 0.3);
    color: #f85149;
  }

  .info {
    background: rgba(56, 139, 253, 0.12);
    border-color: rgba(56, 139, 253, 0.3);
    color: #79c0ff;
  }

  .icon {
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .msg {
    white-space: pre-wrap;
    word-break: break-word;
    flex: 1;
  }
</style>
