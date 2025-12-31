<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { tierListService } from '$lib/services/tierListService';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { TierListWithItems, TierListItem } from '$lib/types';
	
	let tierList: TierListWithItems | null = null;
	let loading = true;
	let cloning = false;
	let error = '';
	
	$: tierListId = $page.params.id;
	
	onMount(async () => {
		loading = true;
		try {
			tierList = await tierListService.getPublicById(tierListId);
			if (!tierList) {
				error = 'Tier list not found or is private';
			}
		} catch (err) {
			error = 'Failed to load tier list';
			console.error(err);
		} finally {
			loading = false;
		}
	});
	
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
	
	async function cloneTierList() {
		if (!tierList || !$isAuthenticated) return;
		
		cloning = true;
		try {
			// Create new tier list
			const newList = await tierListService.create(
				`${tierList.title} (Copy)`,
				tierList.description
			);
			
			// Update with same tiers
			await tierListService.update(newList.id, { tiers: tierList.tiers });
			
			// Add all items
			for (const item of tierList.items) {
				const title = item.novel?.title || item.title;
				const coverUrl = item.novel?.cover_url || item.cover_url;
				if (title) {
					await tierListService.addItem(newList.id, item.tier_name, undefined, title, coverUrl);
				}
			}
			
			toast('Tier list cloned to your library!', 'success');
			goto(`/tier-lists/${newList.id}`);
		} catch (err) {
			toast('Failed to clone tier list', 'error');
			console.error(err);
		} finally {
			cloning = false;
		}
	}
</script>

<svelte:head>
	<title>{tierList?.title || 'Shared Tier List'} - MyNovelList</title>
	{#if tierList}
		<meta property="og:title" content="{tierList.title} - MyNovelList" />
		<meta property="og:description" content={tierList.description || 'A novel tier list on MyNovelList'} />
	{/if}
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	{#if loading}
		<Skeleton width="200px" height="2rem" rounded="rounded-lg" />
		<div class="mt-4 space-y-2">
			{#each Array(6) as _}
				<div class="flex">
					<Skeleton width="64px" height="80px" rounded="rounded-l-lg" />
					<Skeleton height="80px" rounded="rounded-r-lg" />
				</div>
			{/each}
		</div>
	{:else if error}
		<div class="text-center py-12">
			<p class="text-gray-400 mb-4">{error}</p>
			<a href="/">
				<Button>Go Home</Button>
			</a>
		</div>
	{:else if tierList}
		<div class="flex items-start justify-between mb-6 flex-wrap gap-4">
			<div>
				<h1 class="text-2xl font-bold text-gray-100">{tierList.title}</h1>
				{#if tierList.description}
					<p class="text-gray-400 mt-1">{tierList.description}</p>
				{/if}
				<p class="text-sm text-gray-500 mt-2">Shared tier list on MyNovelList</p>
			</div>
			
			{#if $isAuthenticated}
				<Button on:click={cloneTierList} disabled={cloning}>
					{cloning ? 'Cloning...' : 'Clone to My Library'}
				</Button>
			{/if}
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
								<div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-xs text-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
									{getItemTitle(item)}
								</div>
							</div>
						{/each}
						{#if getItemsForTier(tier.name).length === 0}
							<div class="text-gray-600 text-sm flex items-center">Empty</div>
						{/if}
					</div>
				</div>
			{/each}
		</div>
		
		<div class="mt-8 text-center">
			{#if !$isAuthenticated}
				<p class="text-gray-400 mb-4">Sign in to clone this tier list to your library</p>
				<div class="flex justify-center gap-4">
					<a href="/auth/login">
						<Button variant="secondary">Sign In</Button>
					</a>
					<a href="/auth/signup">
						<Button>Sign Up</Button>
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
