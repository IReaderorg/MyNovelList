<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { tierListService } from '$lib/services/tierListService';
	import { novels } from '$lib/stores/novels';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { TierListWithItems, TierListItem } from '$lib/types';
	
	let tierList: TierListWithItems | null = null;
	let loading = true;
	let showAddModal = false;
	let addTitle = '';
	let addCoverUrl = '';
	let selectedTier = 'S';
	let selectedNovelId = '';
	
	$: tierListId = $page.params.id;
	$: shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/share/${tierListId}` : '';
	
	onMount(() => {
		const unsubscribe = auth.subscribe(async (state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					await loadTierList();
					await novels.load();
				}
			}
		});
		return unsubscribe;
	});
	
	async function loadTierList() {
		loading = true;
		try {
			tierList = await tierListService.getById(tierListId);
		} catch (err) {
			console.error(err);
		} finally {
			loading = false;
		}
	}
	
	function getItemsForTier(tierName: string): TierListItem[] {
		if (!tierList) return [];
		return tierList.items
			.filter(item => item.tier_name === tierName)
			.sort((a, b) => a.position - b.position);
	}
	
	function getItemTitle(item: TierListItem): string {
		return item.novel?.title || item.title || 'Unknown';
	}
	
	function getItemCover(item: TierListItem): string | undefined {
		return item.novel?.cover_url || item.cover_url;
	}
	
	async function handleAddItem() {
		if (!tierList) return;
		if (!selectedNovelId && !addTitle.trim()) return;
		
		try {
			await tierListService.addItem(
				tierList.id,
				selectedTier,
				selectedNovelId || undefined,
				selectedNovelId ? undefined : addTitle.trim(),
				selectedNovelId ? undefined : addCoverUrl.trim() || undefined
			);
			await loadTierList();
			
			showAddModal = false;
			addTitle = '';
			addCoverUrl = '';
			selectedNovelId = '';
			toast('Item added!', 'success');
		} catch (err) {
			toast('Failed to add item', 'error');
		}
	}
	
	async function handleRemoveItem(itemId: string) {
		if (!tierList) return;
		
		try {
			await tierListService.removeItem(itemId);
			await loadTierList();
			toast('Item removed', 'success');
		} catch (err) {
			toast('Failed to remove item', 'error');
		}
	}
	
	async function togglePublic() {
		if (!tierList) return;
		
		try {
			await tierListService.update(tierList.id, { is_public: !tierList.is_public });
			tierList.is_public = !tierList.is_public;
			toast(tierList.is_public ? 'Tier list is now public!' : 'Tier list is now private', 'success');
		} catch (err) {
			toast('Failed to update', 'error');
		}
	}
	
	function copyShareLink() {
		navigator.clipboard.writeText(shareUrl);
		toast('Link copied!', 'success');
	}
</script>

<svelte:head>
	<title>{tierList?.title || 'Tier List'} - MyNovelList</title>
</svelte:head>

{#if $auth.loading}
	<div class="flex items-center justify-center min-h-[50vh]">
		<p class="text-gray-400">Loading...</p>
	</div>
{:else if !$isAuthenticated}
	<div class="flex items-center justify-center min-h-[50vh]">
		<p class="text-gray-400">Redirecting to login...</p>
	</div>
{:else}
	<div class="max-w-4xl mx-auto px-4 py-8">
		<a href="/tier-lists" class="text-primary-400 hover:text-primary-300 mb-4 inline-flex items-center gap-1">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Tier Lists
		</a>
		
		{#if loading}
			<div class="text-center py-12 text-gray-400">Loading...</div>
		{:else if !tierList}
			<div class="text-center py-12">
				<p class="text-gray-400 mb-4">Tier list not found</p>
				<a href="/tier-lists">
					<Button>Go to Tier Lists</Button>
				</a>
			</div>
		{:else}
			<div class="flex items-start justify-between mb-6">
				<div>
					<h1 class="text-2xl font-bold text-gray-100">{tierList.title}</h1>
					{#if tierList.description}
						<p class="text-gray-400 mt-1">{tierList.description}</p>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<Button variant="secondary" size="sm" on:click={togglePublic}>
						{tierList.is_public ? 'Make Private' : 'Make Public'}
					</Button>
					{#if tierList.is_public}
						<Button variant="ghost" size="sm" on:click={copyShareLink}>
							Copy Link
						</Button>
					{/if}
					<Button size="sm" on:click={() => showAddModal = true}>
						Add Item
					</Button>
				</div>
			</div>
			
			<!-- Tiers -->
			<div class="space-y-2">
				{#each tierList.tiers as tier}
					<div class="flex">
						<div 
							class="w-16 flex-shrink-0 flex items-center justify-center font-bold text-xl text-gray-900 rounded-l-lg"
							style="background-color: {tier.color}"
						>
							{tier.name}
						</div>
						<div class="flex-1 min-h-[80px] bg-gray-800 border border-gray-700 border-l-0 rounded-r-lg p-2 flex flex-wrap gap-2">
							{#each getItemsForTier(tier.name) as item (item.id)}
								<div class="relative group">
									<div class="w-16 h-20 bg-gray-700 rounded overflow-hidden">
										{#if getItemCover(item)}
											<img 
												src={getItemCover(item)} 
												alt={getItemTitle(item)}
												class="w-full h-full object-cover"
											/>
										{:else}
											<div class="w-full h-full flex items-center justify-center text-xs text-gray-400 p-1 text-center">
												{getItemTitle(item)}
											</div>
										{/if}
									</div>
									<button
										on:click={() => handleRemoveItem(item.id)}
										class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
									>
										<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
									<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-xs text-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
										{getItemTitle(item)}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<Modal bind:open={showAddModal} title="Add to Tier List">
		<form on:submit|preventDefault={handleAddItem} class="space-y-4">
			<div>
				<label class="block text-sm font-medium text-gray-300 mb-1">Select Tier</label>
				<div class="flex gap-2">
					{#each tierList?.tiers || [] as tier}
						<button
							type="button"
							on:click={() => selectedTier = tier.name}
							class="w-10 h-10 rounded font-bold text-gray-900 transition-transform {selectedTier === tier.name ? 'ring-2 ring-white scale-110' : ''}"
							style="background-color: {tier.color}"
						>
							{tier.name}
						</button>
					{/each}
				</div>
			</div>
			
			{#if $novels.novels.length > 0}
				<div>
					<label for="novel" class="block text-sm font-medium text-gray-300 mb-1">From Library</label>
					<select
						id="novel"
						bind:value={selectedNovelId}
						class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
					>
						<option value="">-- Select from library --</option>
						{#each $novels.novels as novel}
							<option value={novel.id}>{novel.title}</option>
						{/each}
					</select>
				</div>
				
				<div class="text-center text-gray-500 text-sm">or add manually</div>
			{/if}
			
			<Input 
				id="title"
				label="Title"
				bind:value={addTitle}
				placeholder="Novel title"
				disabled={!!selectedNovelId}
			/>
			
			<Input 
				id="cover"
				label="Cover URL (optional)"
				type="url"
				bind:value={addCoverUrl}
				placeholder="https://..."
				disabled={!!selectedNovelId}
			/>
			
			<div class="flex justify-end gap-3 pt-2">
				<Button variant="secondary" on:click={() => showAddModal = false}>
					Cancel
				</Button>
				<Button type="submit" disabled={!selectedNovelId && !addTitle.trim()}>
					Add
				</Button>
			</div>
		</form>
	</Modal>
{/if}
