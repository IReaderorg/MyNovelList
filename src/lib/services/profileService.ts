import { supabase } from './supabase';
import type { Profile, Novel } from '$lib/types';

export const profileService = {
	async getProfile(userId: string): Promise<Profile | null> {
		const { data, error } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', userId)
			.single();

		if (error) return null;
		return data;
	},

	async updateProfile(updates: Partial<Pick<Profile, 'username' | 'display_name'>>): Promise<Profile> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const { data, error } = await supabase
			.from('profiles')
			.update(updates)
			.eq('id', user.id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async getPublicNovels(userId: string): Promise<Novel[]> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.eq('user_id', userId)
			.eq('is_public', true)
			.order('updated_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	async getPublicNovelById(novelId: string): Promise<Novel | null> {
		const { data, error } = await supabase
			.from('novels')
			.select('*')
			.eq('id', novelId)
			.eq('is_public', true)
			.single();

		if (error) return null;
		return data;
	}
};
