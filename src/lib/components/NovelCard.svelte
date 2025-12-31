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
	
	const statusLabels: Record<string, string> = {
		planning: 'Planning',
		reading: 'Reading',
		completed: 'Completed',
		on_hold: 'On Hold',
		dropped: 'Dropped'
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
	
	function getProgressPercent(): number {
		if (!novel.total_chapters || novel.total_chapters === 0) return 0;
		return Math.min(100, (novel.current_chapter / novel.total_chapters) * 100);
	}
	
	function handleImgError() {
		imgError = true;
	}
</script>

<div class="card hover:border-gray-600 transition-colors group">
	<div class="flex gap-4">
		<!-- Cover -->
		<div class="flex-shrink-0 w-20 h-28 bg-gray-700 rounded-lg overflow-hidden">
			{#if novel.cover_url && !imgError}
				<img 
					src={novel.cover_url} 
					alt={novel.title}
					class="w-full h-full object-cover"
					loading="lazy"
					on:error={handleImgError}
				/>
			{:else}
				<div class="w-full h-full flex items-center justify-center text-gray-500">
					<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
					</svg>
				</div>
			{/if}
		</div>
		
		<!-- Info -->
		<div class="flex-1 min-w-0">
			<div class="flex items-start justify-between gap-2">
				<div class="min-w-0">
					<a href="/novel/{novel.id}" class="block">
						<h3 class="font-semibold text-gray-100 truncate hover:text-primary-400 transition-colors">
							{novel.title}
						</h3>
					</a>
					{#if novel.author}
						<p class="text-sm text-gray-400 truncate">{novel.author}</p>
					{/if}
				</div>
				<span class="flex-shrink-0 px-2 py-0.5 text-xs rounded-full text-white {statusColors[novel.status]}">
					{statusLabels[novel.status]}
				</span>
			</div>
			
			<!-- Tags -->
			{#if novel.tags && novel.tags.length > 0}
				<div class="mt-1 flex flex-wrap gap-1">
					{#each novel.tags.slice(0, 3) as tag}
						<span class="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">{tag}</span>
					{/each}
					{#if novel.tags.length > 3}
						<span class="text-xs text-gray-500">+{novel.tags.length - 3}</span>
					{/if}
				</div>
			{/if}
			
			<!-- Chapter Progress -->
			<div class="mt-2 flex items-center gap-2">
				<label class="text-sm text-gray-400">Ch.</label>
				<input
					type="number"
					bind:value={chapterInput}
					on:input={handleChapterChange}
					min="0"
					class="w-16 px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
				/>
				{#if novel.total_chapters}
					<span class="text-sm text-gray-400">/ {novel.total_chapters}</span>
				{/if}
			</div>
			
			<!-- Progress Bar -->
			{#if novel.total_chapters}
				<div class="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
					<div 
						class="h-full bg-primary-500 transition-all duration-300"
						style="width: {getProgressPercent()}%"
					></div>
				</div>
			{/if}
			
			<!-- Score -->
			{#if novel.score !== undefined && novel.score !== null}
				<div class="mt-2 flex items-center gap-1">
					<svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
						<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
					</svg>
					<span class="text-sm text-gray-300">{novel.score}</span>
				</div>
			{/if}
		</div>
	</div>
</div>
