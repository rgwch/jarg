import { writable } from 'svelte/store';
import type { RepoConfig } from '$lib/types';

export const currentRepo = writable<RepoConfig | null>(null);
