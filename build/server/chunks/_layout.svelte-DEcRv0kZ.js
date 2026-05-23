function _layout($$renderer, $$props) {
  let { children } = $$props;
  $$renderer.push(`<div class="app svelte-12qhfyh"><header class="app-header svelte-12qhfyh"><span class="app-logo svelte-12qhfyh">🗂️</span> <span class="app-name svelte-12qhfyh">Restic GUI</span></header> <main class="app-main svelte-12qhfyh">`);
  children($$renderer);
  $$renderer.push(`<!----></main></div>`);
}

export { _layout as default };
//# sourceMappingURL=_layout.svelte-DEcRv0kZ.js.map
