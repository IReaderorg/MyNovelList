<script lang="ts">
	import type { Novel } from '$lib/types';
	import { novels } from '$lib/stores/novels';
	import { toast } from './ui/Toast.svelte';
	
	export let novel: Novel;
	
	let chapterInput = novel.current_chapter;
	let debounceTimer: ReturnType<typeof setTimeout>;
	let imgError = false;
	
	const statusColors: Record<string, string> = {
		planning: 'bg-gray-600',
		reading: 'bg-blue-600',
		completed: 'bg-green-600',
		on_hold: 'bg-yellow-600',
		dropped: 'bg-red-600'
	};
	
	function handleChapterChange() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(async () => {
			if (chapterInput !== novel.current_chapter) {
				await novels.updateChapter(novel.id, chapterInput);
				toast('Chapter updated', 'success');
			}
		}, 500);
	}
	
	function handleImgError() {
		imgError = true;
	}
</script>

<div class="card hover:border-gray-600 transition-colors group relative">
	<a href="/novel/{novel.id}" class="block">
		<!-- Cover -->
		<div class="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden mb-3">
			{#if novel.cover_url && !imgError}
				<img 
					src={novel.cover_url} 
					alt={novel.title}
					class="w-full h-full object-cover"
					loading="lazy"
					on:error={handleImgError}
				/>
			{:else}
				<div class="w-full h-full flex items-center justify-center text-gray-500 p-2 text-center">
					<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
			{/if}
		</div>
		
		<!-- Title -->
		<h3 class="font-semibold text-gray-100 text-sm truncate hover:text-primary-400 transition-colors">
			{novel.title}
		</h3>
	</a>
	
	<!-- Status Badge -->
	<span class="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full text-white {statusColors[novel.status]}">
		{novel.status.replace('_', ' ')}
	</span>
	
	<!-- Score -->
	{#if novel.score !== undefined && novel.score !== null}
		<div class="absolute top-2 left-2 flex items-center gap-1 bg-black/70 rounded px-1.5 py-0.5">
			<svg class="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
			<span class="text-xs text-white">{novel.score}</span>
		</div>
	{/if}
	
	<!-- Chapter Input -->
	<div class="mt-2 flex items-center gap-1" on:click|stopPropagation on:keydown|stopPropagation>
		<span class="text-xs text-gray-400">Ch.</span>
		<input
			type="number"
			bind:value={chapterInput}
			on:input={handleChapterChange}
			min="0"
			class="w-12 px-1 py-0.5 text-xs bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
		/>
		{#if novel.total_chapters}
			<span class="text-xs text-gray-400">/ {novel.total_chapters}</span>
		{/if}
	</div>
</div>
