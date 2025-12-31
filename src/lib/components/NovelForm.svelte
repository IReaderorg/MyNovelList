<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Novel, NovelInput, NovelStatus, ProgressInput, NovelWithProgress } from '$lib/types';
	import Button from './ui/Button.svelte';
	import Input from './ui/Input.svelte';
	import Select from './ui/Select.svelte';
	
	export let novel: NovelWithProgress | null = null;
	export let loading = false;
	export let mode: 'add' | 'edit' = 'add';
	
	const dispatch = createEventDispatcher<{ 
		submit: { novel: NovelInput; progress: ProgressInput }; 
		cancel: void 
	}>();
	
	// Novel metadata
	let title = novel?.title ?? '';
	let author = novel?.author ?? '';
	let cover_url = novel?.cover_url ?? '';
	let source_url = novel?.source_url ?? '';
	let total_chapters: number | undefined = novel?.total_chapters ?? undefined;
	let tags = novel?.tags?.join(', ') ?? '';
	
	// User progress (private)
	let status: NovelStatus = novel?.progress?.status ?? 'planning';
	let current_chapter = novel?.progress?.current_chapter ?? 0;
	let score: number | undefined = novel?.progress?.score ?? undefined;
	let notes = novel?.progress?.notes ?? '';
	let started_at = novel?.progress?.started_at ?? '';
	let completed_at = novel?.progress?.completed_at ?? '';
	
	const statusOptions = [
		{ value: 'planning', label: 'Planning' },
		{ value: 'reading', label: 'Reading' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'on_hold', label: 'On Hold' },
		{ value: 'dropped', label: 'Dropped' }
	];
	
	function handleSubmit() {
		if (!title.trim()) return;
		
		const novelInput: NovelInput = {
			title: title.trim(),
			author: author.trim() || undefined,
			cover_url: cover_url.trim() || undefined,
			source_url: source_url.trim() || undefined,
			total_chapters: total_chapters || undefined,
			tags: tags.split(',').map(t => t.trim()).filter(Boolean)
		};
		
		const progressInput: ProgressInput = {
			status,
			current_chapter,
			score: score !== undefined ? Math.min(100, Math.max(0, score)) : undefined,
			notes: notes.trim() || undefined,
			started_at: started_at || undefined,
			completed_at: completed_at || undefined
		};
		
		dispatch('submit', { novel: novelInput, progress: progressInput });
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
	<!-- Novel Metadata Section -->
	<div class="space-y-4">
		<h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Novel Info</h3>
		
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
		
		<div class="grid grid-cols-2 gap-4">
			<Input 
				id="total_chapters"
				label="Total Chapters"
				type="number"
				bind:value={total_chapters}
				min={0}
				placeholder="Optional"
			/>
			
			<Input 
				id="tags"
				label="Tags (comma separated)"
				bind:value={tags}
				placeholder="fantasy, isekai"
			/>
		</div>
	</div>
	
	<hr class="border-gray-700" />
	
	<!-- Progress Section (Private) -->
	<div class="space-y-4">
		<h3 class="text-sm font-medium text-gray-400 uppercase tracking-wide">Your Progress</h3>
		
		<Select 
			id="status"
			label="Status"
			bind:value={status}
			options={statusOptions}
		/>
		
		<div class="grid grid-cols-2 gap-4">
			<Input 
				id="current_chapter"
				label="Current Chapter"
				type="number"
				bind:value={current_chapter}
				min={0}
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
					class="input"
				/>
			</div>
			
			<div>
				<label for="completed_at" class="block text-sm font-medium text-gray-300 mb-1">Completed Date</label>
				<input
					id="completed_at"
					type="date"
					bind:value={completed_at}
					class="input"
				/>
			</div>
		</div>
		
		<div>
			<label for="notes" class="block text-sm font-medium text-gray-300 mb-1">Notes</label>
			<textarea
				id="notes"
				bind:value={notes}
				rows="3"
				class="input resize-none"
				placeholder="Personal notes (only visible to you)..."
			></textarea>
		</div>
	</div>
	
	<div class="flex justify-end gap-3 pt-2">
		<Button variant="secondary" on:click={() => dispatch('cancel')}>
			Cancel
		</Button>
		<Button type="submit" disabled={!title.trim() || loading}>
			{loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Add to Library'}
		</Button>
	</div>
</form>
