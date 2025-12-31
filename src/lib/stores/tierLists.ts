import { writable } from 'svelte/store';
import type { TierList } from '$lib/types';
import { tierListService } from '$lib/services/tierListService';

interface TierListsState {
	tierLists: TierList[];
	loading: boolean;
	error: string | null;
}

function createTierListsStore() {
	const { subscribe, set, update } = writable<TierListsState>({
		tierLists: [],
		loading: false,
		error: null
	});

	return {
		subscribe,
		load: async () => {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const tierLists = await tierListService.getAll();
				set({ tierLists, loading: false, error: null });
			} catch (e) {
				set({ tierLists: [], loading: false, error: (e as Error).message });
			}
		},
		create: async (title: string, description?: string) => {
			const tierList = await tierListService.create(title, description);
			update((s) => ({ ...s, tierLists: [...s.tierLists, tierList] }));
			return tierList;
		},
		update: async (id: string, updates: Partial<Pick<TierList, 'title' | 'description' | 'is_public' | 'tiers'>>) => {
			const updated = await tierListService.update(id, updates);
			update((s) => ({
				...s,
				tierLists: s.tierLists.map((t) => (t.id === id ? updated : t))
			}));
			return updated;
		},
		delete: async (id: string) => {
			await tierListService.delete(id);
			update((s) => ({ ...s, tierLists: s.tierLists.filter((t) => t.id !== id) }));
		}
	};
}

export const tierLists = createTierListsStore();
