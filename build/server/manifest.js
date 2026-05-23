const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set([]),
	mimeTypes: {},
	_: {
		client: {start:"_app/immutable/entry/start.BncQ5o0P.js",app:"_app/immutable/entry/app.DdEVPzKa.js",imports:["_app/immutable/entry/start.BncQ5o0P.js","_app/immutable/chunks/DzU18TDj.js","_app/immutable/chunks/CM4ER8Vs.js","_app/immutable/chunks/D3Z-hH9B.js","_app/immutable/chunks/BtOvOIpC.js","_app/immutable/entry/app.DdEVPzKa.js","_app/immutable/chunks/CM4ER8Vs.js","_app/immutable/chunks/BZYOG5L8.js","_app/immutable/chunks/Cuvso2Uc.js","_app/immutable/chunks/BtOvOIpC.js","_app/immutable/chunks/BpCV0uRN.js","_app/immutable/chunks/DPNdIkwL.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CnIIwoAf.js')),
			__memo(() => import('./chunks/1-rpx9J84_.js')),
			__memo(() => import('./chunks/2-Cq-XANe6.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/restic/backup",
				pattern: /^\/api\/restic\/backup\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BlSKA16F.js'))
			},
			{
				id: "/api/restic/check",
				pattern: /^\/api\/restic\/check\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DPpxHymx.js'))
			},
			{
				id: "/api/restic/exec",
				pattern: /^\/api\/restic\/exec\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CYhbDoRN.js'))
			},
			{
				id: "/api/restic/init",
				pattern: /^\/api\/restic\/init\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BOjRQOjG.js'))
			},
			{
				id: "/api/restic/ls",
				pattern: /^\/api\/restic\/ls\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DUC9fLs0.js'))
			},
			{
				id: "/api/restic/restore",
				pattern: /^\/api\/restic\/restore\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-BEEWY8Ej.js'))
			},
			{
				id: "/api/restic/snapshots",
				pattern: /^\/api\/restic\/snapshots\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-DocjzpZG.js'))
			},
			{
				id: "/api/restic/unlock",
				pattern: /^\/api\/restic\/unlock\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./chunks/_server.ts-CkbED1q7.js'))
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
