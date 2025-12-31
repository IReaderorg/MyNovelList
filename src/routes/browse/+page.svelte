<script lang="ts">
	import { onMount } from 'svelte';
	import { novelService } from '$lib/services/novelService';
	import { novels } from '$lib/stores/novels';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { Novel, NovelStatus } from '$lib/types';
	
	let allNovels: Novel[] = [];
	let loading = true;
	let searchQuery = '';
	let searchTimer: ReturnType<typeof setTimeout>;
	
	// Add to library modal
	let showAddModal = false;
	let selectedNovel: Novel | null = null;
	let addStatus: NovelStatus = 'planning';
	let addChapter = 0;
	let adding = false;
	
	// Track which novels are in user's library
	let libraryNovelIds = new Set<string>();
	
	onMount(async () => {
		await loadNovels();
		
		// Get user's library to know which novels they already have
		if ($isAuthenticated) {
			await novels.load();
			libraryNovelIds = new Set($novels.novels.map(n => n.id));
		}
	});
	
	// Update library IDs when novels store changes
	$: libraryNovelIds = new Set($novels.novels.map(n => n.id));
	
	async function loadNovels() {
		loading = true;
		try {
			allNovels = await novelService.getAll();
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}
	
	async function handleSearch() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(async () => {
			if (searchQuery.trim()) {
				loading = true;
				try {
					allNovels = await novelService.search(searchQuery);
				} catch (err) {
					console.error(err);
				} finally {
					loading = false;
				}
			} else {
				await loadNovels();
			}
		}, 300);
	}
	
	function openAddModal(novel: Novel) {
		selectedNovel = novel;
		addStatus = 'planning';
		addChapter = 0;
		showAddModal = true;
	}
	
	async function handleAddToLibrary() {
		if (!selectedNovel) return;
		
		adding = true;
		try {
			await novels.addToLibrary(selectedNovel.id, {
				status: addStatus,
				current_chapter: addChapter
			});
			showAddModal = false;
			toast('Added to library!', 'success');
		} catch (err) {
			toast('Failed to add to library', 'error');
		} finally {
			adding = false;
		}
	}
	
	const statusOptions = [
		{ value: 'planning', label: 'Planning to Read' },
		{ value: 'reading', label: 'Currently Reading' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'on_hold', label: 'On Hold' },
		{ value: 'dropped', label: 'Dropped' }
	];
</script>

<svelte:head>
	<title>Browse Novels - MyNovelList</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
	<div class="flex items-center justify-between mb-6">
		<h1 class="text-2xl font-bold">Browse Novels</h1>
		<p class="text-muted text-sm">{allNovels.length} novels in database</p>
	</div>
	
	<div class="mb-6">
		<Input 
			placeholder="Search novels by title or author..."
			bind:value={searchQuery}
			on:input={handleSearch}
		/>
	</div>
	
	{#if loading}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<div class="card">
					<div class="flex gap-4">
						<Skeleton width="64px" height="96px" rounded="rounded-lg" />
						<div class="flex-1 space-y-2">
							<Skeleton width="80%" height="1.25rem" />
							<Skeleton width="50%" height="1rem" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if allNovels.length === 0}
		<EmptyState 
			icon="search" 
			title={searchQuery ? 'No novels found' : 'No novels yet'} 
			description={searchQuery ? 'Try a different search term.' : 'Be the first to add a novel!'} 
		/>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each allNovels as novel (novel.id)}
				<div class="card hover:border-gray-600 transition-colors">
					<div class="flex gap-4">
						<!-- Cover -->
						<div class="flex-shrink-0 w-16 h-24 bg-gray-700 rounded-lg overflow-hidden">
							{#if novel.cover_url}
								<img 
									src={novel.cover_url} 
									alt={novel.title}
									class="w-full h-full object-cover"
									loading="lazy"
								/>
							{:else}
								<div class="w-full h-full flex items-center justify-center text-gray-500">
									<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
									</svg>
								</div>
							{/if}
						</div>
						
						<!-- Info -->
						<div class="flex-1 min-w-0">
							<a href="/novel/{novel.id}" class="block">
								<h3 class="font-semibold truncate hover:text-primary-400 transition-colors">
									{novel.title}
								</h3>
							</a>
							{#if novel.author}
								<p class="text-sm text-muted truncate">{novel.author}</p>
							{/if}
							
							{#if novel.tags && novel.tags.length > 0}
								<div class="mt-1 flex flex-wrap gap-1">
									{#each novel.tags.slice(0, 2) as tag}
										<span class="px-1.5 py-0.5 text-xs bg-gray-700 text-gray-400 rounded">{tag}</span>
									{/each}
								</div>
							{/if}
							
							<div class="mt-2">
								{#if libraryNovelIds.has(novel.id)}
									<span class="text-sm text-green-400 flex items-center gap-1">
										<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
										</svg>
										In Library
									</span>
								{:else if $isAuthenticated}
									<Button size="sm" variant="secondary" on:click={() => openAddModal(novel)}>
										+ Add to Library
									</Button>
								{:else}
									<a href="/auth/login" class="text-sm text-primary-400 hover:text-primary-300">
										Sign in to track
									</a>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<!-- Add to Library Modal -->
<Modal bind:open={showAddModal} title="Add to Library">
	{#if selectedNovel}
		<div class="space-y-4">
			<div class="flex gap-4 items-start">
				{#if selectedNovel.cover_url}
					<img 
						src={selectedNovel.cover_url} 
						alt={selectedNovel.title}
						class="w-16 h-24 object-cover rounded-lg"
					/>
				{/if}
				<div>
					<h3 class="font-semibold">{selectedNovel.title}</h3>
					{#if selectedNovel.author}
						<p class="text-sm text-muted">{selectedNovel.author}</p>
					{/if}
				</div>
			</div>
			
			<div>
				<label for="status" class="block text-sm font-medium text-gray-300 mb-1">Status</label>
				<select
					id="status"
					bind:value={addStatus}
					class="input"
				>
					{#each statusOptions as opt}
						<option value={opt.value}>{opt.label}</option>
					{/each}
				</select>
			</div>
			
			<Input 
				id="chapter"
				label="Current Chapter"
				type="number"
				bind:value={addChapter}
				min={0}
			/>
			
			<div class="flex justify-end gap-3 pt-2">
				<Button variant="secondary" on:click={() => showAddModal = false}>
					Cancel
				</Button>
				<Button on:click={handleAddToLibrary} disabled={adding}>
					{adding ? 'Adding...' : 'Add to Library'}
				</Button>
			</div>
		</div>
	{/if}
</Modal>
