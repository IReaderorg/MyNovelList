<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { profileService } from '$lib/services/profileService';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Novel, Profile } from '$lib/types';
	
	let novel: Novel | null = null;
	let owner: Profile | null = null;
	let loading = true;
	
	$: novelId = $page.params.id;
	
	onMount(async () => {
		loading = true;
		novel = await profileService.getPublicNovelById(novelId);
		if (novel) {
			owner = await profileService.getProfile(novel.user_id);
		}
		loading = false;
	});
	
	const statusColors: Record<string, string> = {
		planning: 'bg-gray-500',
		reading: 'bg-blue-500',
		completed: 'bg-green-500',
		on_hold: 'bg-yellow-500',
		dropped: 'bg-red-500'
	};
	
	const statusLabels: Record<string, string> = {
		planning: 'Planning to Read',
		reading: 'Currently Reading',
		completed: 'Completed',
		on_hold: 'On Hold',
		dropped: 'Dropped'
	};
</script>

<svelte:head>
	<title>{novel?.title || 'Novel'} - MyNovelList</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
	{#if loading}
		<div class="card">
			<div class="flex gap-6">
				<Skeleton width="160px" height="240px" rounded="rounded-lg" />
				<div class="flex-1 space-y-3">
					<Skeleton width="80%" height="2rem" />
					<Skeleton width="50%" height="1rem" />
					<Skeleton width="30%" height="1.5rem" />
				</div>
			</div>
		</div>
	{:else if !novel}
		<EmptyState icon="book" title="Novel not found" description="This novel doesn't exist or isn't public." />
	{:else}
		<div class="card">
			<div class="flex flex-col sm:flex-row gap-6">
				<!-- Cover -->
				<div class="flex-shrink-0">
					{#if novel.cover_url}
						<img 
							src={novel.cover_url} 
							alt={novel.title}
							class="w-40 h-60 object-cover rounded-lg mx-auto sm:mx-0"
						/>
					{:else}
						<div class="w-40 h-60 bg-gray-700 rounded-lg flex items-center justify-center mx-auto sm:mx-0">
							<svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
							</svg>
						</div>
					{/if}
				</div>
				
				<!-- Details -->
				<div class="flex-1">
					<h1 class="text-2xl font-bold">{novel.title}</h1>
					
					{#if novel.author}
						<p class="text-muted mt-1">by {novel.author}</p>
					{/if}
					
					<div class="flex flex-wrap items-center gap-3 mt-4">
						<span class="px-3 py-1 rounded-full text-white text-sm {statusColors[novel.status]}">
							{statusLabels[novel.status]}
						</span>
						
						{#if novel.score}
							<div class="flex items-center gap-1">
								<svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
								</svg>
								<span class="font-semibold">{novel.score}</span>
								<span class="text-muted">/ 100</span>
							</div>
						{/if}
					</div>
					
					<div class="mt-4 space-y-2 text-sm">
						<p>
							<span class="text-muted">Progress:</span>
							<span class="font-medium">Chapter {novel.current_chapter}</span>
							{#if novel.total_chapters}
								<span class="text-muted">/ {novel.total_chapters}</span>
							{/if}
						</p>
						
						{#if novel.started_at}
							<p>
								<span class="text-muted">Started:</span>
								<span>{new Date(novel.started_at).toLocaleDateString()}</span>
							</p>
						{/if}
						
						{#if novel.completed_at}
							<p>
								<span class="text-muted">Completed:</span>
								<span>{new Date(novel.completed_at).toLocaleDateString()}</span>
							</p>
						{/if}
					</div>
					
					{#if novel.tags && novel.tags.length > 0}
						<div class="flex flex-wrap gap-2 mt-4">
							{#each novel.tags as tag}
								<span class="px-2 py-1 bg-gray-700 rounded text-sm">{tag}</span>
							{/each}
						</div>
					{/if}
					
					{#if novel.source_url}
						<div class="mt-4">
							<a 
								href={novel.source_url} 
								target="_blank" 
								rel="noopener noreferrer"
								class="text-primary-400 hover:text-primary-300 text-sm inline-flex items-center gap-1"
							>
								Read on source
								<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
								</svg>
							</a>
						</div>
					{/if}
				</div>
			</div>
			
			{#if novel.notes}
				<div class="mt-6 pt-6 border-t border-gray-700">
					<h2 class="font-semibold mb-2">Notes</h2>
					<p class="text-muted whitespace-pre-wrap">{novel.notes}</p>
				</div>
			{/if}
			
			<!-- Owner info -->
			{#if owner}
				<div class="mt-6 pt-6 border-t border-gray-700">
					<p class="text-sm text-muted">
						Shared by 
						<a href="/user/{owner.id}" class="text-primary-400 hover:text-primary-300">
							{owner.display_name || owner.username || 'Anonymous'}
						</a>
					</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
