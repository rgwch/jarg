import { Z as attr_class, a1 as ensure_array_like, Y as attr, a3 as escape_html } from './renderer-Dunaighs.js';

function StatusBar($$renderer, $$props) {
  let { type = null, message = null } = $$props;
  if (message) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div${attr_class("status-bar svelte-1piydef", void 0, {
      "success": type === "success",
      "error": type === "error",
      "info": type === "info" || !type
    })}><span class="icon svelte-1piydef">`);
    if (type === "success") {
      $$renderer.push("<!--[0-->");
      $$renderer.push(`✓`);
    } else if (type === "error") {
      $$renderer.push("<!--[1-->");
      $$renderer.push(`✗`);
    } else {
      $$renderer.push("<!--[-1-->");
      $$renderer.push(`ℹ`);
    }
    $$renderer.push(`<!--]--></span> <span class="msg svelte-1piydef">${escape_html(message)}</span></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]-->`);
}
function RepoSetup($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let mode = "open";
    let repoUrl = "";
    let password = "";
    let rememberPassword = false;
    let loading = false;
    let recentRepos = [];
    $$renderer2.push(`<div class="repo-setup svelte-mqunch"><div class="card setup-card svelte-mqunch"><h2 class="card-title">🗂️ Restic Repository</h2> <div class="tabs svelte-mqunch"><button${attr_class("tab svelte-mqunch", void 0, { "active": mode === "open" })}>Open</button> <button${attr_class("tab svelte-mqunch", void 0, { "active": mode === "create" })}>Create</button></div> <div class="form svelte-mqunch"><div class="field"><label for="repo-url">Repository URL</label> <datalist id="recent-repos-list"><!--[-->`);
    const each_array = ensure_array_like(recentRepos);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let r = each_array[$$index];
      $$renderer2.option({ value: r }, ($$renderer3) => {
      });
    }
    $$renderer2.push(`<!--]--></datalist> <input id="repo-url" type="text"${attr("value", repoUrl)} list="recent-repos-list" placeholder="e.g. /backups/myrepo  or  sftp:user@host:/path" autocomplete="off" spellcheck="false"/> <span class="field-hint">Local path or remote URL (sftp:, s3:, b2:, gs:, …)</span></div> <div class="field"><label for="password">Password</label> <input id="password" type="password"${attr("value", password)} placeholder="Repository password"${attr("autocomplete", "current-password")}/></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="field-inline"><input type="checkbox" id="remember-pw"${attr("checked", rememberPassword, true)}/> <label for="remember-pw">Remember password for this repository</label></div> `);
    StatusBar($$renderer2, { type: null, message: null });
    $$renderer2.push(`<!----> <button class="btn-primary submit-btn svelte-mqunch"${attr("disabled", loading, true)}>`);
    {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`Open Repository`);
    }
    $$renderer2.push(`<!--]--></button></div></div></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[0-->");
      RepoSetup($$renderer2);
    }
    $$renderer2.push(`<!--]-->`);
  });
}

export { _page as default };
//# sourceMappingURL=_page.svelte-DzAFgZU4.js.map
