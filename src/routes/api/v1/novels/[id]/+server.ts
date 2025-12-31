import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseAdmin } from '$lib/services/supabaseAdmin';
import { validateApiKey } from '$lib/services/apiKeyValidator.server';
import type { NovelInput } from '$lib/types';

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

// GET /api/v1/novels/:id - Get a single novel with user's progress
export const GET: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('read')) {
		return json({ success: false, error: 'API key does not have read permission' }, { status: 403 });
	}

	// Get novel (public)
	const { data: novel, error } = await supabaseAdmin
		.from('novels')
		.select('*')
		.eq('id', params.id)
		.single();

	if (error || !novel) {
		return json({ success: false, error: 'Novel not found' }, { status: 404 });
	}

	// Get user's progress (private)
	const { data: progress } = await supabaseAdmin
		.from('novel_progress')
		.select('*')
		.eq('novel_id', params.id)
		.eq('user_id', auth.userId)
		.single();

	return json({ success: true, data: { ...novel, progress } });
};

// PUT /api/v1/novels/:id - Update novel metadata (only creator can update)
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

	// Only update novel metadata fields
	const novelUpdates: Record<string, any> = {
		updated_at: new Date().toISOString()
	};

	if (body.title !== undefined) novelUpdates.title = body.title;
	if (body.author !== undefined) novelUpdates.author = body.author;
	if (body.cover_url !== undefined) novelUpdates.cover_url = body.cover_url;
	if (body.source_url !== undefined) novelUpdates.source_url = body.source_url;
	if (body.total_chapters !== undefined) novelUpdates.total_chapters = body.total_chapters;
	if (body.tags !== undefined) novelUpdates.tags = body.tags;

	const { data: novel, error } = await supabaseAdmin
		.from('novels')
		.update(novelUpdates)
		.eq('id', params.id)
		.eq('user_id', auth.userId) // Only creator can update
		.select()
		.single();

	if (error || !novel) {
		return json({ success: false, error: 'Novel not found or you are not the creator' }, { status: 404 });
	}

	// Get user's progress
	const { data: progress } = await supabaseAdmin
		.from('novel_progress')
		.select('*')
		.eq('novel_id', params.id)
		.eq('user_id', auth.userId)
		.single();

	return json({ success: true, data: { ...novel, progress } });
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

	// Get novel first
	const { data: existingNovel } = await supabaseAdmin
		.from('novels')
		.select('*')
		.eq('id', params.id)
		.single();

	if (!existingNovel) {
		return json({ success: false, error: 'Novel not found' }, { status: 404 });
	}

	// Update novel metadata if user is creator
	let novel = existingNovel;
	if (existingNovel.user_id === auth.userId) {
		const novelUpdates: Record<string, any> = {
			updated_at: new Date().toISOString()
		};

		if (body.title !== undefined) novelUpdates.title = body.title;
		if (body.author !== undefined) novelUpdates.author = body.author;
		if (body.cover_url !== undefined) novelUpdates.cover_url = body.cover_url;
		if (body.source_url !== undefined) novelUpdates.source_url = body.source_url;
		if (body.total_chapters !== undefined) novelUpdates.total_chapters = body.total_chapters;
		if (body.tags !== undefined) novelUpdates.tags = body.tags;

		if (Object.keys(novelUpdates).length > 1) {
			const { data } = await supabaseAdmin
				.from('novels')
				.update(novelUpdates)
				.eq('id', params.id)
				.select()
				.single();
			if (data) novel = data;
		}
	}

	// Get user's progress
	const { data: progress } = await supabaseAdmin
		.from('novel_progress')
		.select('*')
		.eq('novel_id', params.id)
		.eq('user_id', auth.userId)
		.single();

	return json({ success: true, data: { ...novel, progress } });
};

// DELETE /api/v1/novels/:id - Remove from user's library (not delete novel)
export const DELETE: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('delete')) {
		return json({ success: false, error: 'API key does not have delete permission' }, { status: 403 });
	}

	// Remove from user's library (delete progress)
	const { error } = await supabaseAdmin
		.from('novel_progress')
		.delete()
		.eq('novel_id', params.id)
		.eq('user_id', auth.userId);

	if (error) {
		return json({ success: false, error: 'Failed to remove from library' }, { status: 500 });
	}

	return json({ success: true, data: { removed: true } });
};
