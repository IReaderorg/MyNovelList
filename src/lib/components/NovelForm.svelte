<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Novel, NovelInput, NovelStatus } from '$lib/types';
	import Button from './ui/Button.svelte';
	import Input from './ui/Input.svelte';
	import Select from './ui/Select.svelte';
	
	export let novel: Novel | null = null;
	export let loading = false;
	
	const dispatch = createEventDispatcher<{ submit: NovelInput; cancel: void }>();
	
	let title = novel?.title ?? '';
	let author = novel?.author ?? '';
	let cover_url = novel?.cover_url ?? '';
	let source_url = novel?.source_url ?? '';
	let status: NovelStatus = novel?.status ?? 'planning';
	let current_chapter = novel?.current_chapter ?? 0;
	let total_chapters: number | undefined = novel?.total_chapters ?? undefined;
	let score: number | undefined = novel?.score ?? undefined;
	let notes = novel?.notes ?? '';
	let tags = novel?.tags?.join(', ') ?? '';
	let started_at = novel?.started_at ?? '';
	let completed_at = novel?.completed_at ?? '';
	
	const statusOptions = [
		{ value: 'planning', label: 'Planning' },
		{ value: 'reading', label: 'Reading' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'on_hold', label: 'On Hold' },
		{ value: 'dropped', label: 'Dropped' }
	];
	
	function handleSubmit() {
		if (!title.trim()) return;
		
		const input: NovelInput = {
			title: title.trim(),
			author: author.trim() || undefined,
			cover_url: cover_url.trim() || undefined,
			source_url: source_url.trim() || undefined,
			status,
			current_chapter,
			total_chapters: total_chapters || undefined,
			score: score !== undefined ? Math.min(100, Math.max(0, score)) : undefined,
			notes: notes.trim() || undefined,
			tags: tags.split(',').map(t => t.trim()).filter(Boolean),
			started_at: started_at || undefined,
			completed_at: completed_at || undefined
		};
		
		dispatch('submit', input);
	}
	
	// Auto-set dates based on status
	$: if (status === 'reading' && !started_at) {
		started_at = new Date().toISOString().split('T')[0];
	}
	$: if (status === 'completed' && !completed_at) {
		completed_at = new Date().toISOString().split('T')[0];
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
	<Input 
		id="title"
		label="Title *"
		bind:value={title}
		placeholder="Enter novel title"
	/>
	
	<Input 
		id="author"
		label="Author"
		bind:value={author}
		placeholder="Author name"
	/>
	
	<div class="grid grid-cols-2 gap-4">
		<Input 
			id="cover_url"
			label="Cover URL"
			type="url"
			bind:value={cover_url}
			placeholder="https://..."
		/>
		
		<Input 
			id="source_url"
			label="Source URL"
			type="url"
			bind:value={source_url}
			placeholder="https://..."
		/>
	</div>
	
	<Select 
		id="status"
		label="Status"
		bind:value={status}
		options={statusOptions}
	/>
	
	<div class="grid grid-cols-3 gap-4">
		<Input 
			id="current_chapter"
			label="Current Chapter"
			type="number"
			bind:value={current_chapter}
			min={0}
		/>
		
		<Input 
			id="total_chapters"
			label="Total Chapters"
			type="number"
			bind:value={total_chapters}
			min={0}
			placeholder="Optional"
		/>
		
		<Input 
			id="score"
			label="Score (0-100)"
			type="number"
			bind:value={score}
			min={0}
			max={100}
			placeholder="Optional"
		/>
	</div>
	
	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="started_at" class="block text-sm font-medium text-gray-300 mb-1">Started Date</label>
			<input
				id="started_at"
				type="date"
				bind:value={started_at}
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			/>
		</div>
		
		<div>
			<label for="completed_at" class="block text-sm font-medium text-gray-300 mb-1">Completed Date</label>
			<input
				id="completed_at"
				type="date"
				bind:value={completed_at}
				class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			/>
		</div>
	</div>
	
	<Input 
		id="tags"
		label="Tags (comma separated)"
		bind:value={tags}
		placeholder="fantasy, isekai, romance"
	/>
	
	<div>
		<label for="notes" class="block text-sm font-medium text-gray-300 mb-1">Notes</label>
		<textarea
			id="notes"
			bind:value={notes}
			rows="3"
			class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
			placeholder="Personal notes..."
		></textarea>
	</div>
	
	<div class="flex justify-end gap-3 pt-2">
		<Button variant="secondary" on:click={() => dispatch('cancel')}>
			Cancel
		</Button>
		<Button type="submit" disabled={!title.trim() || loading}>
			{loading ? 'Saving...' : novel ? 'Update' : 'Add Novel'}
		</Button>
	</div>
</form>
