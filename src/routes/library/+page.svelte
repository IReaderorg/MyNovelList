<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { novels, filteredNovels } from '$lib/stores/novels';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import NovelCard from '$lib/components/NovelCard.svelte';
	import NovelGrid from '$lib/components/NovelGrid.svelte';
	import NovelForm from '$lib/components/NovelForm.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import EmptyState from '$lib/components/EmptyState.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { NovelInput } from '$lib/types';
	
	let showAddModal = false;
	let addLoading = false;
	let viewMode: 'list' | 'grid' = 'list';
	
	onMount(() => {
		const unsubscribe = auth.subscribe((state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					novels.load();
				}
			}
		});
		return unsubscribe;
	});
	
	async function handleAddNovel(e: CustomEvent<NovelInput>) {
		addLoading = true;
		try {
			await novels.add(e.detail);
			showAddModal = false;
			toast('Novel added!', 'success');
		} catch (err) {
			toast('Failed to add novel', 'error');
		} finally {
			addLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Library - MyNovelList</title>
</svelte:head>

{#if $auth.loading}
	<div class="max-w-6xl mx-auto px-4 py-8">
		<div class="flex items-center justify-between mb-6">
			<Skeleton width="150px" height="2rem" rounded="rounded-lg" />
			<Skeleton width="120px" height="2.5rem" rounded="rounded-lg" />
		</div>
		<div class="mb-6">
			<Skeleton height="2.5rem" rounded="rounded-lg" />
		</div>
		<div class="grid gap-4 md:grid-cols-2">
			{#each Array(4) as _}
				<div class="card">
					<div class="flex gap-4">
						<Skeleton width="80px" height="112px" rounded="rounded-lg" />
						<div class="flex-1 space-y-2">
							<Skeleton width="70%" height="1.25rem" />
							<Skeleton width="40%" height="1rem" />
							<Skeleton width="50%" height="1rem" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else if !$isAuthenticated}
	<div class="flex items-center justify-center min-h-[50vh]">
		<p class="text-gray-400">Redirecting to login...</p>
	</div>
{:else}
	<div class="max-w-6xl mx-auto px-4 py-8">
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-2xl font-bold">My Library</h1>
			<Button on:click={() => showAddModal = true}>
				<svg class="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Add Novel
			</Button>
		</div>
		
		<div class="mb-6">
			<FilterBar bind:viewMode />
		</div>
		
		{#if $novels.loading}
			<div class="grid gap-4 {viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' : 'md:grid-cols-2'}">
				{#each Array(viewMode === 'grid' ? 10 : 4) as _}
					{#if viewMode === 'grid'}
						<div class="card">
							<Skeleton height="180px" rounded="rounded-lg" />
							<div class="mt-2">
								<Skeleton width="80%" height="1rem" />
							</div>
						</div>
					{:else}
						<div class="card">
							<div class="flex gap-4">
								<Skeleton width="80px" height="112px" rounded="rounded-lg" />
								<div class="flex-1 space-y-2">
									<Skeleton width="70%" height="1.25rem" />
									<Skeleton width="40%" height="1rem" />
									<Skeleton width="50%" height="1rem" />
								</div>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		{:else if $novels.error}
			<EmptyState icon="book" title="Failed to load library" description={$novels.error}>
				<Button on:click={() => novels.load()}>Retry</Button>
			</EmptyState>
		{:else if $filteredNovels.length === 0}
			{#if $novels.novels.length === 0}
				<EmptyState icon="book" title="Your library is empty" description="Add your first novel to start tracking your reading progress.">
					<Button on:click={() => showAddModal = true}>Add Novel</Button>
				</EmptyState>
			{:else}
				<EmptyState icon="search" title="No novels found" description="Try adjusting your filters or search query." />
			{/if}
		{:else}
			{#if viewMode === 'grid'}
				<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{#each $filteredNovels as novel (novel.id)}
						<NovelGrid {novel} />
					{/each}
				</div>
			{:else}
				<div class="grid gap-4 md:grid-cols-2">
					{#each $filteredNovels as novel (novel.id)}
						<NovelCard {novel} />
					{/each}
				</div>
			{/if}
			
			<div class="mt-6 text-center text-sm text-muted">
				Showing {$filteredNovels.length} of {$novels.novels.length} novels
			</div>
		{/if}
	</div>

	<Modal bind:open={showAddModal} title="Add Novel">
		<NovelForm 
			loading={addLoading}
			on:submit={handleAddNovel}
			on:cancel={() => showAddModal = false}
		/>
	</Modal>
{/if}
