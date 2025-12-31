import { supabase } from './supabase';
import { supabaseAdmin } from './supabaseAdmin';
import type { ApiKey, ApiKeyWithSecret, ApiScope } from '$lib/types';

// Generate a secure random API key
function generateApiKey(): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const prefix = 'mnl_'; // mynovellist prefix
	let key = prefix;
	for (let i = 0; i < 32; i++) {
		key += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return key;
}

// Simple hash function for API key storage
async function hashApiKey(key: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(key);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const apiKeyService = {
	async getAll(): Promise<ApiKey[]> {
		const { data, error } = await supabase
			.from('api_keys')
			.select('id, user_id, name, key_prefix, scopes, last_used_at, request_count, is_active, created_at, expires_at')
			.order('created_at', { ascending: false });

		if (error) throw error;
		return data || [];
	},

	async create(name: string, scopes: ApiScope[] = ['read']): Promise<ApiKeyWithSecret> {
		const { data: { user } } = await supabase.auth.getUser();
		if (!user) throw new Error('Not authenticated');

		const secret = generateApiKey();
		const keyHash = await hashApiKey(secret);
		const keyPrefix = secret.substring(0, 12); // mnl_ + 8 chars

		const { data, error } = await supabase
			.from('api_keys')
			.insert({
				user_id: user.id,
				name,
				key_hash: keyHash,
				key_prefix: keyPrefix,
				scopes
			})
			.select('id, user_id, name, key_prefix, scopes, last_used_at, request_count, is_active, created_at, expires_at')
			.single();

		if (error) throw error;
		
		return { ...data, secret };
	},

	async delete(id: string): Promise<void> {
		const { error } = await supabase.from('api_keys').delete().eq('id', id);
		if (error) throw error;
	},

	async toggleActive(id: string, isActive: boolean): Promise<void> {
		const { error } = await supabase
			.from('api_keys')
			.update({ is_active: isActive })
			.eq('id', id);
		if (error) throw error;
	},

	// Validate API key and return user_id if valid
	async validateKey(apiKey: string): Promise<{ userId: string; scopes: ApiScope[] } | null> {
		const keyHash = await hashApiKey(apiKey);
		
		const { data, error } = await supabaseAdmin
			.from('api_keys')
			.select('id, user_id, scopes, is_active, expires_at, request_count')
			.eq('key_hash', keyHash)
			.single();

		if (error || !data) return null;
		if (!data.is_active) return null;
		if (data.expires_at && new Date(data.expires_at) < new Date()) return null;

		// Update usage stats
		await supabaseAdmin
			.from('api_keys')
			.update({ 
				last_used_at: new Date().toISOString(),
				request_count: data.request_count + 1
			})
			.eq('id', data.id);

		return { userId: data.user_id, scopes: data.scopes };
	}
};
