import type { Novel, TierListWithItems, ExportData } from '$lib/types';
import { novelService } from './novelService';
import { tierListService } from './tierListService';

const EXPORT_VERSION = '1.0';

export const exportService = {
	async exportAll(): Promise<ExportData> {
		const novels = await novelService.getAll();
		const tierLists = await tierListService.getAll();
		
		// Fetch items for each tier list
		const tierListsWithItems: TierListWithItems[] = await Promise.all(
			tierLists.map(async (tl) => {
				const full = await tierListService.getById(tl.id);
				return full!;
			})
		);

		return {
			version: EXPORT_VERSION,
			exported_at: new Date().toISOString(),
			novels,
			tier_lists: tierListsWithItems
		};
	},

	exportToJson(data: ExportData): string {
		return JSON.stringify(data, null, 2);
	},

	downloadJson(data: ExportData, filename = 'mynovellist-backup.json'): void {
		const json = this.exportToJson(data);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	},

	parseImport(json: string): ExportData {
		const data = JSON.parse(json);
		
		// Validate structure
		if (!data.version || !data.novels) {
			throw new Error('Invalid backup file format');
		}
		
		return data as ExportData;
	},

	async importData(data: ExportData, mode: 'replace' | 'merge' = 'merge'): Promise<{ novelsImported: number; tierListsImported: number }> {
		let novelsImported = 0;
		let tierListsImported = 0;

		if (mode === 'replace') {
			// Delete all existing data first
			const existing = await novelService.getAll();
			for (const novel of existing) {
				await novelService.delete(novel.id);
			}
			const existingTl = await tierListService.getAll();
			for (const tl of existingTl) {
				await tierListService.delete(tl.id);
			}
		}

		// Import novels
		for (const novel of data.novels) {
			try {
				await novelService.create({
					title: novel.title,
					author: novel.author,
					cover_url: novel.cover_url,
					source_url: novel.source_url,
					status: novel.status,
					current_chapter: novel.current_chapter,
					total_chapters: novel.total_chapters,
					score: novel.score,
					notes: novel.notes,
					tags: novel.tags,
					started_at: novel.started_at,
					completed_at: novel.completed_at
				});
				novelsImported++;
			} catch (e) {
				console.error('Failed to import novel:', novel.title, e);
			}
		}

		// Import tier lists
		for (const tierList of data.tier_lists || []) {
			try {
				const created = await tierListService.create(tierList.title, tierList.description);
				await tierListService.update(created.id, {
					is_public: tierList.is_public,
					tiers: tierList.tiers
				});
				
				// Import items (without novel references since IDs changed)
				for (const item of tierList.items || []) {
					const title = item.novel?.title || item.title;
					const coverUrl = item.novel?.cover_url || item.cover_url;
					if (title) {
						await tierListService.addItem(created.id, item.tier_name, undefined, title, coverUrl);
					}
				}
				tierListsImported++;
			} catch (e) {
				console.error('Failed to import tier list:', tierList.title, e);
			}
		}

		return { novelsImported, tierListsImported };
	}
};
