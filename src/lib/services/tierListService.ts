import { supabase } from './supabase';
import type { TierList, TierListItem, TierListWithItems, TierConfig } from '$lib/types';

const DEFAULT_TIERS: TierConfig[] = [
	{ name: 'S', color: '#ff7f7f' },
	{ name: 'A', color: '#ffbf7f' },
	{ name: 'B', color: '#ffff7f' },
	{ name: 'C', color: '#7fff7f' },
	{ name: 'D', color: '#7fbfff' },
	{ name: 'F', color: '#bf7fff' }
];

export const tierListService = {
	async getAll(): Promise<TierList[]> {
		const { data, error } = await supabase
			.from('tier_lists')
			.select('*')
			.order('updated_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	async getById(id: string): Promise<TierListWithItems | null> {
		const { data: tierList, error: tlError } = await supabase
			.from('tier_lists')
			.select('*')
			.eq('id', id)
			.single();

		if (tlError) throw tlError;
		if (!tierList) return null;

		const { data: items, error: itemsError } = await supabase
			.from('tier_list_items')
			.select('*, novel:novels(*)')
			.eq('tier_list_id', id)
			.order('position');

		if (itemsError) throw itemsError;

		return { ...tierList, items: items || [] };
	},

	async getPublicById(id: string): Promise<TierListWithItems | null> {
		const { data: tierList, error: tlError } = await supabase
			.from('tier_lists')
			.select('*')
			.eq('id', id)
			.eq('is_public', true)
			.single();

		if (tlError) throw tlError;
		if (!tierList) return null;

		const { data: items, error: itemsError } = await supabase
			.from('tier_list_items')
			.select('*, novel:novels(id, title, cover_url, author)')
			.eq('tier_list_id', id)
			.order('position');

		if (itemsError) throw itemsError;

		return { ...tierList, items: items || [] };
	},

	async create(title: string, description?: string): Promise<TierList> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const { data, error } = await supabase
			.from('tier_lists')
			.insert({
				user_id: user.id,
				title,
				description,
				tiers: DEFAULT_TIERS,
				is_public: false
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async update(id: string, updates: Partial<Pick<TierList, 'title' | 'description' | 'is_public' | 'tiers'>>): Promise<TierList> {
		const { data, error } = await supabase
			.from('tier_lists')
			.update({
				...updates,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async delete(id: string): Promise<void> {
		const { error } = await supabase.from('tier_lists').delete().eq('id', id);
		if (error) throw error;
	},

	async addItem(tierListId: string, tierName: string, novelId?: string, title?: string, coverUrl?: string): Promise<TierListItem> {
		// Get max position in tier
		const { data: existing } = await supabase
			.from('tier_list_items')
			.select('position')
			.eq('tier_list_id', tierListId)
			.eq('tier_name', tierName)
			.order('position', { ascending: false })
			.limit(1);

		const position = existing && existing.length > 0 ? existing[0].position + 1 : 0;

		const { data, error } = await supabase
			.from('tier_list_items')
			.insert({
				tier_list_id: tierListId,
				tier_name: tierName,
				novel_id: novelId,
				title: novelId ? null : title,
				cover_url: novelId ? null : coverUrl,
				position
			})
			.select()
			.single();

		if (error) throw error;
		return data;
	},

	async updateItem(itemId: string, tierName: string, position: number): Promise<void> {
		const { error } = await supabase
			.from('tier_list_items')
			.update({ tier_name: tierName, position })
			.eq('id', itemId);

		if (error) throw error;
	},

	async removeItem(itemId: string): Promise<void> {
		const { error } = await supabase.from('tier_list_items').delete().eq('id', itemId);
		if (error) throw error;
	}
};
