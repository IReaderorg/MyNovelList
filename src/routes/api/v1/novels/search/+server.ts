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

// GET /api/v1/novels/search - Search novels in the public database
export const GET: RequestHandler = async ({ request, url }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('read')) {
		return json({ success: false, error: 'API key does not have read permission' }, { status: 403 });
	}

	const q = url.searchParams.get('q');
	const title = url.searchParams.get('title');
	const sourceUrl = url.searchParams.get('source_url');
	const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);

	const searchTerm = q || title;

	if (!searchTerm && !sourceUrl) {
		return json({ success: false, error: 'Provide q, title, or source_url parameter' }, { status: 400 });
	}

	// Search in public novels database
	let query = supabaseAdmin
		.from('novels')
		.select('*');

	if (searchTerm) {
		query = query.or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`);
	}

	if (sourceUrl) {
		query = query.eq('source_url', sourceUrl);
	}

	const { data, error } = await query
		.order('title')
		.limit(limit);

	if (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}

	// Get user's progress for these novels
	const novelIds = (data || []).map(n => n.id);
	const { data: progressData } = await supabaseAdmin
		.from('novel_progress')
		.select('*')
		.eq('user_id', auth.userId)
		.in('novel_id', novelIds);

	const progressMap = new Map((progressData || []).map(p => [p.novel_id, p]));

	// Combine novels with user's progress
	const novels = (data || []).map(novel => ({
		...novel,
		progress: progressMap.get(novel.id) || null,
		in_library: progressMap.has(novel.id)
	}));

	return json({ success: true, data: { novels } });
};
