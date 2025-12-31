import { writable, derived } from 'svelte/store';
import type { Novel, NovelInput, FilterOptions, SortOptions } from '$lib/types';
import { novelService } from '$lib/services/novelService';

interface NovelsState {
	novels: Novel[];
	loading: boolean;
	error: string | null;
}

function createNovelsStore() {
	const { subscribe, set, update } = writable<NovelsState>({
		novels: [],
		loading: false,
		error: null
	});

	return {
		subscribe,
		load: async () => {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const novels = await novelService.getAll();
				set({ novels, loading: false, error: null });
			} catch (e) {
				set({ novels: [], loading: false, error: (e as Error).message });
			}
		},
		add: async (input: NovelInput) => {
			const novel = await novelService.create(input);
			update((s) => ({ ...s, novels: [...s.novels, novel] }));
			return novel;
		},
		update: async (id: string, input: Partial<NovelInput>) => {
			const updated = await novelService.update(id, input);
			update((s) => ({
				...s,
				novels: s.novels.map((n) => (n.id === id ? updated : n))
			}));
		},
		delete: async (id: string) => {
			await novelService.delete(id);
			update((s) => ({ ...s, novels: s.novels.filter((n) => n.id !== id) }));
		},
		updateChapter: async (id: string, chapter: number) => {
			await novelService.update(id, { current_chapter: chapter });
			update((s) => ({
				...s,
				novels: s.novels.map((n) =>
					n.id === id
						? { ...n, current_chapter: chapter, updated_at: new Date().toISOString() }
						: n
				)
			}));
		}
	};
}

export const novels = createNovelsStore();

// Filter and sort stores
export const filterOptions = writable<FilterOptions>({ status: 'all' });
export const sortOptions = writable<SortOptions>({ field: 'updated_at', direction: 'desc' });

// Derived filtered and sorted novels
export const filteredNovels = derived(
	[novels, filterOptions, sortOptions],
	([$novels, $filter, $sort]) => {
		let result = [...$novels.novels];

		// Filter
		if ($filter.status && $filter.status !== 'all') {
			result = result.filter((n) => n.status === $filter.status);
		}
		if ($filter.scoreMin !== undefined) {
			result = result.filter((n) => (n.score ?? 0) >= $filter.scoreMin!);
		}
		if ($filter.scoreMax !== undefined) {
			result = result.filter((n) => (n.score ?? 100) <= $filter.scoreMax!);
		}
		if ($filter.tags && $filter.tags.length > 0) {
			result = result.filter((n) => $filter.tags!.some((t) => n.tags.includes(t)));
		}
		if ($filter.search) {
			const search = $filter.search.toLowerCase();
			result = result.filter(
				(n) =>
					n.title.toLowerCase().includes(search) ||
					n.author?.toLowerCase().includes(search)
			);
		}

		// Sort
		result.sort((a, b) => {
			let aVal: string | number = a[$sort.field] ?? '';
			let bVal: string | number = b[$sort.field] ?? '';

			if (typeof aVal === 'string') {
				aVal = aVal.toLowerCase();
				bVal = (bVal as string).toLowerCase();
			}

			if (aVal < bVal) return $sort.direction === 'asc' ? -1 : 1;
			if (aVal > bVal) return $sort.direction === 'asc' ? 1 : -1;
			return 0;
		});

		return result;
	}
);
