import { supabaseAdmin } from './supabaseAdmin';
import { hashApiKey } from './apiKeyService';
import type { ApiScope } from '$lib/types';

// Server-side only API key validation
export async function validateApiKey(apiKey: string): Promise<{ userId: string; scopes: ApiScope[] } | null> {
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
