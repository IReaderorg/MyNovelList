import { supabase } from './supabase';
import type { Novel, NovelInput, NovelProgress, ProgressInput, NovelWithProgress } from '$lib/types';

export const novelService = {
	// Get all novels (public database)
	async getAll(): Promise<Novel[]> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.order('updated_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	// Get novels with user's progress (for library view)
	async getMyLibrary(): Promise<NovelWithProgress[]> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		// Get user's progress entries
		const { data: progressData, error: progressError } = await supabase
			.from('novel_progress')
			.select('*, novel:novels(*)')
			.eq('user_id', user.id)
			.order('updated_at', { ascending: false });

		if (progressError) throw progressError;

		// Transform to NovelWithProgress
		return (progressData || []).map(p => ({
			...p.novel,
			progress: {
				id: p.id,
				user_id: p.user_id,
				novel_id: p.novel_id,
				status: p.status,
				current_chapter: p.current_chapter,
				score: p.score,
				notes: p.notes,
				started_at: p.started_at,
				completed_at: p.completed_at,
				created_at: p.created_at,
				updated_at: p.updated_at
			}
		}));
	},

	// Search novels in the public database
	async search(query: string): Promise<Novel[]> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.or(`title.ilike.%${query}%,author.ilike.%${query}%`)
			.order('title')
			.limit(20);

		if (error) throw error;
		return data || [];
	},

	async getById(id: string): Promise<Novel | null> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.eq('id', id)
			.single();

		if (error) return null;
		return data;
	},

	// Get novel with user's progress
	async getByIdWithProgress(id: string): Promise<NovelWithProgress | null> {
		const { data: { user } } = await supabase.auth.getUser();
		
		const { data: novel, error } = await supabase
			.from('novels')
			.select('*')
			.eq('id', id)
			.single();

		if (error || !novel) return null;

		// Get user's progress if logged in
		let progress: NovelProgress | undefined;
		if (user) {
			const { data: progressData } = await supabase
				.from('novel_progress')
				.select('*')
				.eq('novel_id', id)
				.eq('user_id', user.id)
				.single();
			
			if (progressData) progress = progressData;
		}

		return { ...novel, progress };
	},

	// Add a new novel to the database
	async create(input: NovelInput): Promise<Novel> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const { data, error } = await supabase
			.from('novels')
			.insert({
				user_id: user.id,
				title: input.title,
				author: input.author,
				cover_url: input.cover_url,
				source_url: input.source_url,
				total_chapters: input.total_chapters,
				tags: input.tags || []
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Update novel metadata (only creator can do this)
	async update(id: string, input: Partial<NovelInput>): Promise<Novel> {
		const { data, error } = await supabase
			.from('novels')
			.update({
				...input,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async delete(id: string): Promise<void> {
		const { error } = await supabase.from('novels').delete().eq('id', id);
		if (error) throw error;
	},

	// === Progress Management (private per user) ===

	// Add novel to user's library with initial progress
	async addToLibrary(novelId: string, progress?: ProgressInput): Promise<NovelProgress> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const { data, error } = await supabase
			.from('novel_progress')
			.insert({
				user_id: user.id,
				novel_id: novelId,
				status: progress?.status || 'planning',
				current_chapter: progress?.current_chapter || 0,
				score: progress?.score,
				notes: progress?.notes,
				started_at: progress?.started_at,
				completed_at: progress?.completed_at
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Update user's progress on a novel
	async updateProgress(novelId: string, input: Partial<ProgressInput>): Promise<NovelProgress> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const { data, error } = await supabase
			.from('novel_progress')
			.update({
				...input,
				updated_at: new Date().toISOString()
			})
			.eq('novel_id', novelId)
			.eq('user_id', user.id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	// Remove novel from user's library
	async removeFromLibrary(novelId: string): Promise<void> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const { error } = await supabase
			.from('novel_progress')
			.delete()
			.eq('novel_id', novelId)
			.eq('user_id', user.id);

		if (error) throw error;
	},

	// Check if novel is in user's library
	async isInLibrary(novelId: string): Promise<boolean> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) return false;

		const { data } = await supabase
			.from('novel_progress')
			.select('id')
			.eq('novel_id', novelId)
			.eq('user_id', user.id)
			.single();

		return !!data;
	}
};
