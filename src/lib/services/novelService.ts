import { supabase } from './supabase';
import type { Novel, NovelInput } from '$lib/types';

export const novelService = {
	async getAll(): Promise<Novel[]> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.order('updated_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	async getById(id: string): Promise<Novel | null> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.eq('id', id)
			.single();

		if (error) throw error;
		return data;
	},

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
				status: input.status || 'planning',
				current_chapter: input.current_chapter || 0,
				total_chapters: input.total_chapters,
				score: input.score,
				notes: input.notes,
				tags: input.tags || [],
				started_at: input.started_at,
				completed_at: input.completed_at
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

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
	}
};
