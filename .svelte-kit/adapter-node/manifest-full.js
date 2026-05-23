export const manifest = (() => {
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
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
				endpoint: __memo(() => import('./entries/endpoints/api/restic/backup/_server.ts.js'))
			},
			{
				id: "/api/restic/check",
				pattern: /^\/api\/restic\/check\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/check/_server.ts.js'))
			},
			{
				id: "/api/restic/exec",
				pattern: /^\/api\/restic\/exec\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/exec/_server.ts.js'))
			},
			{
				id: "/api/restic/init",
				pattern: /^\/api\/restic\/init\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/init/_server.ts.js'))
			},
			{
				id: "/api/restic/ls",
				pattern: /^\/api\/restic\/ls\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/ls/_server.ts.js'))
			},
			{
				id: "/api/restic/restore",
				pattern: /^\/api\/restic\/restore\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/restore/_server.ts.js'))
			},
			{
				id: "/api/restic/snapshots",
				pattern: /^\/api\/restic\/snapshots\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/snapshots/_server.ts.js'))
			},
			{
				id: "/api/restic/unlock",
				pattern: /^\/api\/restic\/unlock\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('./entries/endpoints/api/restic/unlock/_server.ts.js'))
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
