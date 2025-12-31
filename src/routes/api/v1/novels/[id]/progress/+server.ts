import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabase } from '$lib/services/supabase';
import { apiKeyService } from '$lib/services/apiKeyService';

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

// POST /api/v1/novels/:id/progress - Quick chapter update
export const POST: RequestHandler = async ({ request, params }) => {
	const auth = await validateRequest(request);
	if (auth instanceof Response) return auth;

	if (!auth.scopes.includes('write')) {
		return json({ success: false, error: 'API key does not have write permission' }, { status: 403 });
	}

	let body: { chapter?: number; increment?: number; status?: string };
	try {
		body = await request.json();
	} catch {
		return json({ success: false, error: 'Invalid JSON body' }, { status: 400 });
	}

	// Get current novel
	const { data: novel, error: fetchError } = await supabase
		.from('novels')
		.select('current_chapter, status')
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.single();

	if (fetchError || !novel) {
		return json({ success: false, error: 'Novel not found' }, { status: 404 });
	}

	let newChapter = novel.current_chapter;
	
	if (body.chapter !== undefined) {
		newChapter = body.chapter;
	} else if (body.increment !== undefined) {
		newChapter = novel.current_chapter + body.increment;
	}

	const updates: Record<string, any> = {
		current_chapter: Math.max(0, newChapter),
		updated_at: new Date().toISOString()
	};

	if (body.status) {
		updates.status = body.status;
	}

	// Auto-set to reading if was planning
	if (novel.status === 'planning' && newChapter > 0 && !body.status) {
		updates.status = 'reading';
	}

	const { data, error } = await supabase
		.from('novels')
		.update(updates)
		.eq('id', params.id)
		.eq('user_id', auth.userId)
		.select()
		.single();

	if (error) {
		return json({ success: false, error: error.message }, { status: 500 });
	}

	return json({ success: true, data });
};
