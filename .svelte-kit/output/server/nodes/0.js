

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.KMH2r5lW.js","_app/immutable/chunks/Cuvso2Uc.js","_app/immutable/chunks/CM4ER8Vs.js","_app/immutable/chunks/DPNdIkwL.js"];
export const stylesheets = ["_app/immutable/assets/0.CGvZ4D35.css"];
export const fonts = [];
