<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { profileService } from '$lib/services/profileService';
	import { tierListService } from '$lib/services/tierListService';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import type { Profile, Novel, TierList } from '$lib/types';
	
	let profile: Profile | null = null;
	let novels: Novel[] = [];
	let tierLists: TierList[] = [];
	let loading = true;
	let error = '';
	let activeTab: 'novels' | 'tierlists' = 'novels';
	
	$: userId = $page.params.id;
	
	onMount(async () => {
		await loadProfile();
	});
	
	async function loadProfile() {
		loading = true;
		error = '';
		try {
			const [profileData, novelsData, tierListsData] = await Promise.all([
				profileService.getProfile(userId),
				profileService.getPublicNovels(userId),
				loadPublicTierLists()
			]);
			
			profile = profileData;
			novels = novelsData;
			tierLists = tierListsData;
			
			if (!profile && novels.length === 0 && tierLists.length === 0) {
				error = 'User not found or has no public content';
			}
		} catch (err) {
			error = 'Failed to load profile';
		} finally {
			loading = false;
		}
	}
	
	async function loadPublicTierLists(): Promise<TierList[]> {
		// Get public tier lists for this user
		const { data } = await (await import('$lib/services/supabase')).supabase
			.from('tier_lists')
			.select('*')
			.eq('user_id', userId)
			.eq('is_public', true)
			.order('updated_at', { ascending: false });
		return data || [];
	}
	
	const statusColors: Record<string, string> = {
		planning: 'bg-gray-500',
		reading: 'bg-blue-500',
		completed: 'bg-green-500',
		on_hold: 'bg-yellow-500',
		dropped: 'bg-red-500'
	};
</script>

<svelte:head>
	<title>{profile?.display_name || profile?.username || 'User'}'s Profile - MyNovelList</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	{#if loading}
		<div class="text-center mb-8">
			<Skeleton width="120px" height="120px" rounded="rounded-full" />
			<Skeleton width="200px" height="1.5rem" rounded="rounded" />
		</div>
		<div class="grid gap-4 md:grid-cols-2">
			{#each Array(4) as _}
				<div class="card">
					<Skeleton height="100px" rounded="rounded-lg" />
				</div>
			{/each}
		</div>
	{:else if error}
		<EmptyState icon="search" title="Not Found" description={error} />
	{:else}
		<!-- Profile Header -->
		<div class="text-center mb-8">
			<div class="w-24 h-24 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4">
				{(profile?.display_name || profile?.username || 'U')[0].toUpperCase()}
			</div>
			<h1 class="text-2xl font-bold">{profile?.display_name || profile?.username || 'Anonymous User'}</h1>
			<p class="text-muted mt-1">
				{novels.length} public novel{novels.length !== 1 ? 's' : ''} · {tierLists.length} public tier list{tierLists.length !== 1 ? 's' : ''}
			</p>
		</div>
		
		<!-- Tabs -->
		<div class="flex gap-4 border-b border-gray-700 mb-6">
			<button
				on:click={() => activeTab = 'novels'}
				class="pb-3 px-1 font-medium transition-colors {activeTab === 'novels' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-gray-200'}"
			>
				Novels ({novels.length})
			</button>
			<button
				on:click={() => activeTab = 'tierlists'}
				class="pb-3 px-1 font-medium transition-colors {activeTab === 'tierlists' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-gray-400 hover:text-gray-200'}"
			>
				Tier Lists ({tierLists.length})
			</button>
		</div>
		
		<!-- Content -->
		{#if activeTab === 'novels'}
			{#if novels.length === 0}
				<EmptyState icon="book" title="No public novels" description="This user hasn't shared any novels yet." />
			{:else}
				<div class="grid gap-4 md:grid-cols-2">
					{#each novels as novel (novel.id)}
						<a href="/novel/public/{novel.id}" class="card hover:border-gray-600 transition-colors block">
							<div class="flex gap-4">
								{#if novel.cover_url}
									<img 
										src={novel.cover_url} 
										alt={novel.title}
										class="w-16 h-24 object-cover rounded-lg flex-shrink-0"
									/>
								{:else}
									<div class="w-16 h-24 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
										<svg class="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
										</svg>
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<h3 class="font-semibold truncate">{novel.title}</h3>
									{#if novel.author}
										<p class="text-sm text-muted truncate">{novel.author}</p>
									{/if}
									<div class="flex items-center gap-2 mt-2">
										<span class="px-2 py-0.5 text-xs rounded-full text-white {statusColors[novel.status]}">
											{novel.status.replace('_', ' ')}
										</span>
										{#if novel.score}
											<span class="text-sm text-yellow-500">★ {novel.score}</span>
										{/if}
									</div>
									<p class="text-sm text-muted mt-1">
										Ch. {novel.current_chapter}{novel.total_chapters ? ` / ${novel.total_chapters}` : ''}
									</p>
								</div>
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{:else}
			{#if tierLists.length === 0}
				<EmptyState icon="book" title="No public tier lists" description="This user hasn't shared any tier lists yet." />
			{:else}
				<div class="grid gap-4 md:grid-cols-2">
					{#each tierLists as tierList (tierList.id)}
						<a href="/share/{tierList.id}" class="card hover:border-gray-600 transition-colors block">
							<h3 class="font-semibold">{tierList.title}</h3>
							{#if tierList.description}
								<p class="text-sm text-muted mt-1 line-clamp-2">{tierList.description}</p>
							{/if}
							<div class="flex gap-1 mt-3">
								{#each tierList.tiers as tier}
									<div 
										class="w-6 h-6 rounded text-xs font-bold flex items-center justify-center text-gray-900"
										style="background-color: {tier.color}"
									>
										{tier.name}
									</div>
								{/each}
							</div>
						</a>
					{/each}
				</div>
			{/if}
		{/if}
	{/if}
</div>
