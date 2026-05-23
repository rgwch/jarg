
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	type MatcherParam<M> = M extends (param : string) => param is (infer U extends string) ? U : string;

	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/restic" | "/api/restic/backup" | "/api/restic/check" | "/api/restic/exec" | "/api/restic/init" | "/api/restic/ls" | "/api/restic/restore" | "/api/restic/snapshots" | "/api/restic/unlock";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/api": Record<string, never>;
			"/api/restic": Record<string, never>;
			"/api/restic/backup": Record<string, never>;
			"/api/restic/check": Record<string, never>;
			"/api/restic/exec": Record<string, never>;
			"/api/restic/init": Record<string, never>;
			"/api/restic/ls": Record<string, never>;
			"/api/restic/restore": Record<string, never>;
			"/api/restic/snapshots": Record<string, never>;
			"/api/restic/unlock": Record<string, never>
		};
		Pathname(): "/" | "/api/restic/backup" | "/api/restic/check" | "/api/restic/exec" | "/api/restic/init" | "/api/restic/ls" | "/api/restic/restore" | "/api/restic/snapshots" | "/api/restic/unlock";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}