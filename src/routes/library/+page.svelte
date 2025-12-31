<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { novels, filteredNovels } from '$lib/stores/novels';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import NovelCard from '$lib/components/NovelCard.svelte';
	import NovelForm from '$lib/components/NovelForm.svelte';
	import FilterBar from '$lib/components/FilterBar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { NovelInput } from '$lib/types';
	
	let showAddModal = false;
	let addLoading = false;
	
	onMount(() => {
		// Wait for auth to initialize
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
	<div class="flex items-center justify-center min-h-[50vh]">
		<p class="text-gray-400">Loading...</p>
	</div>
{:else if !$isAuthenticated}
	<div class="flex items-center justify-center min-h-[50vh]">
		<p class="text-gray-400">Redirecting to login...</p>
	</div>
{:else}
	<div class="max-w-6xl mx-auto px-4 py-8">
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-2xl font-bold text-gray-100">My Library</h1>
			<Button on:click={() => showAddModal = true}>
				<svg class="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				Add Novel
			</Button>
		</div>
		
		<div class="mb-6">
			<FilterBar />
		</div>
		
		{#if $novels.loading}
			<div class="text-center py-12 text-gray-400">Loading your library...</div>
		{:else if $novels.error}
			<div class="text-center py-12">
				<p class="text-red-400 mb-4">{$novels.error}</p>
				<Button on:click={() => novels.load()}>Retry</Button>
			</div>
		{:else if $filteredNovels.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-400 mb-4">
					{$novels.novels.length === 0 
						? "Your library is empty. Add your first novel!" 
						: "No novels match your filters."}
				</p>
				{#if $novels.novels.length === 0}
					<Button on:click={() => showAddModal = true}>Add Novel</Button>
				{/if}
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2">
				{#each $filteredNovels as novel (novel.id)}
					<NovelCard {novel} />
				{/each}
			</div>
			
			<div class="mt-6 text-center text-sm text-gray-500">
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
