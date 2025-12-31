import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/services/supabase';
import { apiKeyService } from '$lib/services/apiKeyService';
import type { NovelInput, ProgressInput } from '$lib/types';

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

// GET /api/v1/novels - List user's library (novels with progress)
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

	// Get user's progress entries with joined novel data
	let query = supabase
		.from('novel_progress')
		.select('*, novel:novels(*)', { count: 'exact' })
		.eq('user_id', auth.userId)
		.order('updated_at', { ascending: false });

	if (status && status !== 'all') {
		query = query.eq('status', status);
	}

	const from = (page - 1) * perPage;
	const to = from + perPage - 1;
	query = query.range(from, to);

	const { data, error, count } = await query;

	if (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}

	// Transform to combined format
	let novels = (data || []).map(p => ({
		...p.novel,
		progress: {
			id: p.id,
			user_id: p.user_id,
			novel_id: p.novel_id,
			status: p.status,
			current_chapter: p.current_chapter,
			score: p.score,
			notes: p.notes,
			started_at: p.started_at,
			completed_at: p.completed_at,
			created_at: p.created_at,
			updated_at: p.updated_at
		}
	}));

	// Filter by search if provided (client-side since we need to search novel fields)
	if (search) {
		const searchLower = search.toLowerCase();
		novels = novels.filter(n => 
			n.title?.toLowerCase().includes(searchLower) ||
			n.author?.toLowerCase().includes(searchLower)
		);
	}

	return json({
		success: true,
		data: {
			novels,
			total: count || 0,
			page,
			per_page: perPage
		}
	});
};

// POST /api/v1/novels - Create a novel and optionally add to library
export const POST: RequestHandler = async ({ request }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('write')) {
		return json({ success: false, error: 'API key does not have write permission' }, { status: 403 });
	}

	let body: NovelInput & ProgressInput & { add_to_library?: boolean };
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	if (!body.title || typeof body.title !== 'string') {
		return json({ success: false, error: 'Title is required' }, { status: 400 });
	}

	// Check if novel already exists by source_url or exact title match
	let existingNovel = null;
	if (body.source_url) {
		const { data } = await supabase
			.from('novels')
			.select('*')
			.eq('source_url', body.source_url)
			.single();
		existingNovel = data;
	}

	if (!existingNovel) {
		// Check by exact title
		const { data } = await supabase
			.from('novels')
			.select('*')
			.ilike('title', body.title)
			.limit(1)
			.single();
		existingNovel = data;
	}

	let novel;
	if (existingNovel) {
		novel = existingNovel;
	} else {
		// Create new novel
		const { data, error } = await supabase
			.from('novels')
			.insert({
				user_id: auth.userId,
				title: body.title,
				author: body.author,
				cover_url: body.cover_url,
				source_url: body.source_url,
				total_chapters: body.total_chapters,
				tags: body.tags || []
			})
			.select()
			.single();

		if (error) {
			return json({ success: false, error: error.message }, { status: 500 });
		}
		novel = data;
	}

	// Add to user's library if requested (default true)
	const addToLibrary = body.add_to_library !== false;
	let progress = null;

	if (addToLibrary) {
		// Check if already in library
		const { data: existingProgress } = await supabase
			.from('novel_progress')
			.select('*')
			.eq('novel_id', novel.id)
			.eq('user_id', auth.userId)
			.single();

		if (existingProgress) {
			progress = existingProgress;
		} else {
			const { data: newProgress, error: progressError } = await supabase
				.from('novel_progress')
				.insert({
					user_id: auth.userId,
					novel_id: novel.id,
					status: body.status || 'planning',
					current_chapter: body.current_chapter || 0,
					score: body.score,
					notes: body.notes,
					started_at: body.started_at,
					completed_at: body.completed_at
				})
				.select()
				.single();

			if (progressError) {
				return json({ success: false, error: progressError.message }, { status: 500 });
			}
			progress = newProgress;
		}
	}

	return json({ 
		success: true, 
		data: { ...novel, progress } 
	}, { status: 201 });
};
