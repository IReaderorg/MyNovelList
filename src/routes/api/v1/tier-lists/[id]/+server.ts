import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/services/supabaseAdmin';
import { validateApiKey } from '$lib/services/apiKeyValidator.server';

async function validateRequest(request: Request): Promise<{ userId: string; scopes: string[] } | Response> {
	const authHeader = request.headers.get('Authorization');
	
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return json({ success: false, error: 'Missing or invalid Authorization header' }, { status: 401 });
	}

	const apiKey = authHeader.substring(7);
	const validation = await validateApiKey(apiKey);

	if (!validation) {
		return json({ success: false, error: 'Invalid or expired API key' }, { status: 401 });
	}

	return validation;
}

// GET /api/v1/tier-lists/:id - Get a tier list with items
export const GET: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('read')) {
		return json({ success: false, error: 'API key does not have read permission' }, { status: 403 });
	}

	const { data: tierList, error: tlError } = await supabaseAdmin
		.from('tier_lists')
		.select('*')
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.single();

	if (tlError || !tierList) {
		return json({ success: false, error: 'Tier list not found' }, { status: 404 });
	}

	const { data: items, error: itemsError } = await supabaseAdmin
		.from('tier_list_items')
		.select('*, novel:novels(id, title, cover_url, author)')
		.eq('tier_list_id', params.id)
		.order('position');

	if (itemsError) {
		return json({ success: false, error: itemsError.message }, { status: 500 });
	}

	return json({ success: true, data: { ...tierList, items: items || [] } });
};

// PUT /api/v1/tier-lists/:id - Update a tier list
export const PUT: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('write')) {
		return json({ success: false, error: 'API key does not have write permission' }, { status: 403 });
	}

	let body: { title?: string; description?: string; is_public?: boolean };
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	const { data, error } = await supabaseAdmin
		.from('tier_lists')
		.update({
			...body,
			updated_at: new Date().toISOString()
		})
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.select()
		.single();

	if (error) {
		return json({ success: false, error: 'Tier list not found or update failed' }, { status: 404 });
	}

	return json({ success: true, data });
};

// DELETE /api/v1/tier-lists/:id - Delete a tier list
export const DELETE: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('delete')) {
		return json({ success: false, error: 'API key does not have delete permission' }, { status: 403 });
	}

	const { error } = await supabaseAdmin
		.from('tier_lists')
		.delete()
		.eq('id', params.id)
		.eq('user_id', auth.userId);

	if (error) {
		return json({ success: false, error: 'Tier list not found or delete failed' }, { status: 404 });
	}

	return json({ success: true, data: { deleted: true } });
};
