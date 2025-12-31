import { writable, derived } from 'svelte/store';
import type { Novel, NovelInput, NovelWithProgress, ProgressInput, FilterOptions, SortOptions } from '$lib/types';
import { novelService } from '$lib/services/novelService';

interface NovelsState {
	novels: NovelWithProgress[]; // User's library with progress
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
		
		// Load user's library (novels they're tracking)
		load: async () => {
			update((s) => ({ ...s, loading: true, error: null }));
			try {
				const novels = await novelService.getMyLibrary();
				set({ novels, loading: false, error: null });
			} catch (e) {
				set({ novels: [], loading: false, error: (e as Error).message });
			}
		},

		// Add a new novel to the database AND to user's library
		add: async (input: NovelInput, progress?: ProgressInput) => {
			// First create the novel
			const novel = await novelService.create(input);
			// Then add to user's library with progress
			const progressData = await novelService.addToLibrary(novel.id, progress);
			
			const novelWithProgress: NovelWithProgress = {
				...novel,
				progress: progressData
			};
			
			update((s) => ({ ...s, novels: [novelWithProgress, ...s.novels] }));
			return novelWithProgress;
		},

		// Add existing novel to user's library
		addToLibrary: async (novelId: string, progress?: ProgressInput) => {
			const progressData = await novelService.addToLibrary(novelId, progress);
			const novel = await novelService.getById(novelId);
			
			if (novel) {
				const novelWithProgress: NovelWithProgress = {
					...novel,
					progress: progressData
				};
				update((s) => ({ ...s, novels: [novelWithProgress, ...s.novels] }));
				return novelWithProgress;
			}
		},

		// Update novel metadata (title, author, etc)
		updateNovel: async (id: string, input: Partial<NovelInput>) => {
			const updated = await novelService.update(id, input);
			update((s) => ({
				...s,
				novels: s.novels.map((n) => (n.id === id ? { ...n, ...updated } : n))
			}));
		},

		// Update user's progress on a novel
		updateProgress: async (novelId: string, input: Partial<ProgressInput>) => {
			const progress = await novelService.updateProgress(novelId, input);
			update((s) => ({
				...s,
				novels: s.novels.map((n) =>
					n.id === novelId ? { ...n, progress } : n
				)
			}));
		},

		// Quick chapter update
		updateChapter: async (novelId: string, chapter: number) => {
			await novelService.updateProgress(novelId, { current_chapter: chapter });
			update((s) => ({
				...s,
				novels: s.novels.map((n) =>
					n.id === novelId && n.progress
						? { ...n, progress: { ...n.progress, current_chapter: chapter, updated_at: new Date().toISOString() } }
						: n
				)
			}));
		},

		// Remove from user's library (doesn't delete the novel)
		removeFromLibrary: async (novelId: string) => {
			await novelService.removeFromLibrary(novelId);
			update((s) => ({ ...s, novels: s.novels.filter((n) => n.id !== novelId) }));
		},

		// Delete novel from database (only if you created it)
		delete: async (id: string) => {
			await novelService.delete(id);
			update((s) => ({ ...s, novels: s.novels.filter((n) => n.id !== id) }));
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

		// Filter by progress status
		if ($filter.status && $filter.status !== 'all') {
			result = result.filter((n) => n.progress?.status === $filter.status);
		}
		if ($filter.scoreMin !== undefined) {
			result = result.filter((n) => (n.progress?.score ?? 0) >= $filter.scoreMin!);
		}
		if ($filter.scoreMax !== undefined) {
			result = result.filter((n) => (n.progress?.score ?? 100) <= $filter.scoreMax!);
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
			let aVal: string | number;
			let bVal: string | number;

			// Handle progress-specific fields
			if ($sort.field === 'current_chapter') {
				aVal = a.progress?.current_chapter ?? 0;
				bVal = b.progress?.current_chapter ?? 0;
			} else if ($sort.field === 'score') {
				aVal = a.progress?.score ?? 0;
				bVal = b.progress?.score ?? 0;
			} else if ($sort.field === 'updated_at') {
				aVal = a.progress?.updated_at ?? a.updated_at;
				bVal = b.progress?.updated_at ?? b.updated_at;
			} else {
				aVal = (a as Record<string, unknown>)[$sort.field] as string ?? '';
				bVal = (b as Record<string, unknown>)[$sort.field] as string ?? '';
			}

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
