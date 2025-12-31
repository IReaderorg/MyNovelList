import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/services/supabase';
import { apiKeyService } from '$lib/services/apiKeyService';
import type { NovelInput } from '$lib/types';

async function validateRequest(request: Request): Promise<{ userId: string; scopes: string[] } | Response> {
	const authHeader = request.headers.get('Authorization');
	
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return json({ success: false, error: 'Missing or invalid Authorization header' }, { status: 401 });
	}

	const apiKey = authHeader.substring(7);
	const validation = await apiKeyService.validateKey(apiKey);

	if (!validation) {
		return json({ success: false, error: 'Invalid or expired API key' }, { status: 401 });
	}

	return validation;
}

// GET /api/v1/novels/:id - Get a single novel
export const GET: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('read')) {
		return json({ success: false, error: 'API key does not have read permission' }, { status: 403 });
	}

	const { data, error } = await supabase
		.from('novels')
		.select('*')
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.single();

	if (error) {
		return json({ success: false, error: 'Novel not found' }, { status: 404 });
	}

	return json({ success: true, data });
};

// PUT /api/v1/novels/:id - Update a novel
export const PUT: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('write')) {
		return json({ success: false, error: 'API key does not have write permission' }, { status: 403 });
	}

	let body: Partial<NovelInput>;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('novels')
		.update({
			...body,
			updated_at: new Date().toISOString()
		})
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.select()
		.single();

	if (error) {
		return json({ success: false, error: 'Novel not found or update failed' }, { status: 404 });
	}

	return json({ success: true, data });
};

// PATCH /api/v1/novels/:id - Partial update (useful for chapter updates)
export const PATCH: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('write')) {
		return json({ success: false, error: 'API key does not have write permission' }, { status: 403 });
	}

	let body: Partial<NovelInput>;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('novels')
		.update({
			...body,
			updated_at: new Date().toISOString()
		})
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.select()
		.single();

	if (error) {
		return json({ success: false, error: 'Novel not found or update failed' }, { status: 404 });
	}

	return json({ success: true, data });
};

// DELETE /api/v1/novels/:id - Delete a novel
export const DELETE: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('delete')) {
		return json({ success: false, error: 'API key does not have delete permission' }, { status: 403 });
	}

	const { error } = await supabase
		.from('novels')
		.delete()
		.eq('id', params.id)
		.eq('user_id', auth.userId);

	if (error) {
		return json({ success: false, error: 'Novel not found or delete failed' }, { status: 404 });
	}

	return json({ success: true, data: { deleted: true } });
};
