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

// GET /api/v1/novels - List all novels
export const GET: RequestHandler = async ({ request, url }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('read')) {
		return json({ success: false, error: 'API key does not have read permission' }, { status: 403 });
	}

	const page = parseInt(url.searchParams.get('page') || '1');
	const perPage = Math.min(parseInt(url.searchParams.get('per_page') || '50'), 100);
	const status = url.searchParams.get('status');
	const search = url.searchParams.get('search');

	let query = supabase
		.from('novels')
		.select('*', { count: 'exact' })
		.eq('user_id', auth.userId)
		.order('updated_at', { ascending: false });

	if (status && status !== 'all') {
		query = query.eq('status', status);
	}

	if (search) {
		query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
	}

	const from = (page - 1) * perPage;
	const to = from + perPage - 1;
	query = query.range(from, to);

	const { data, error, count } = await query;

	if (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}

	return json({
		success: true,
		data: {
			novels: data || [],
			total: count || 0,
			page,
			per_page: perPage
		}
	});
};

// POST /api/v1/novels - Create a novel
export const POST: RequestHandler = async ({ request }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('write')) {
		return json({ success: false, error: 'API key does not have write permission' }, { status: 403 });
	}

	let body: NovelInput;
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	if (!body.title || typeof body.title !== 'string') {
		return json({ success: false, error: 'Title is required' }, { status: 400 });
	}

	const { data, error } = await supabase
		.from('novels')
		.insert({
			user_id: auth.userId,
			title: body.title,
			author: body.author,
			cover_url: body.cover_url,
			source_url: body.source_url,
			status: body.status || 'planning',
			current_chapter: body.current_chapter || 0,
			total_chapters: body.total_chapters,
			score: body.score,
			notes: body.notes,
			tags: body.tags || []
		})
		.select()
		.single();

	if (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}

	return json({ success: true, data }, { status: 201 });
};
