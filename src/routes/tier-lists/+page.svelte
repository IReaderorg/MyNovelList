<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { tierLists } from '$lib/stores/tierLists';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	let showCreateModal = false;
	let newTitle = '';
	let newDescription = '';
	let creating = false;
	
	onMount(() => {
		const unsubscribe = auth.subscribe((state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					tierLists.load();
				}
			}
		});
		return unsubscribe;
	});
	
	async function handleCreate() {
		if (!newTitle.trim()) return;
		
		creating = true;
		try {
			await tierLists.create(newTitle.trim(), newDescription.trim() || undefined);
			showCreateModal = false;
			newTitle = '';
			newDescription = '';
			toast('Tier list created!', 'success');
		} catch (err) {
			toast('Failed to create tier list', 'error');
		} finally {
			creating = false;
		}
	}
	
	async function handleDelete(id: string, title: string) {
		if (!confirm(`Delete "${title}"?`)) return;
		
		try {
			await tierLists.delete(id);
			toast('Tier list deleted', 'success');
		} catch (err) {
			toast('Failed to delete', 'error');
		}
	}
	
	async function handleClone(id: string) {
		try {
			await tierLists.clone(id);
			toast('Tier list cloned!', 'success');
		} catch (err) {
			toast('Failed to clone tier list', 'error');
		}
	}
</script>

<svelte:head>
	<title>Tier Lists - MyNovelList</title>
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
		<div class="flex items-center justify-between mb-6">
			<h1 class="text-2xl font-bold">Tier Lists</h1>
			<Button on:click={() => showCreateModal = true}>
				<svg class="w-5 h-5 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
				New Tier List
			</Button>
		</div>
		
		{#if $tierLists.loading}
			<div class="text-center py-12 text-gray-400">Loading...</div>
		{:else if $tierLists.error}
			<div class="text-center py-12">
				<p class="text-red-400 mb-4">{$tierLists.error}</p>
				<Button on:click={() => tierLists.load()}>Retry</Button>
			</div>
		{:else if $tierLists.tierLists.length === 0}
			<div class="text-center py-12">
				<p class="text-gray-400 mb-4">No tier lists yet. Create one to rank your novels!</p>
				<Button on:click={() => showCreateModal = true}>Create Tier List</Button>
			</div>
		{:else}
			<div class="grid gap-4 md:grid-cols-2">
				{#each $tierLists.tierLists as tierList (tierList.id)}
					<div class="card hover:border-gray-600 transition-colors">
						<div class="flex items-start justify-between">
							<div class="flex-1 min-w-0">
								<a href="/tier-lists/{tierList.id}" class="block">
									<h3 class="font-semibold truncate hover:text-primary-400 transition-colors">
										{tierList.title}
									</h3>
								</a>
								{#if tierList.description}
									<p class="text-sm text-gray-400 mt-1 line-clamp-2">{tierList.description}</p>
								{/if}
							</div>
							<div class="flex items-center gap-2 ml-4">
								{#if tierList.is_public}
									<span class="px-2 py-0.5 text-xs rounded-full bg-green-600 text-white">Public</span>
								{/if}
								<button
									on:click={() => handleClone(tierList.id)}
									class="text-gray-500 hover:text-primary-400 transition-colors"
									title="Clone tier list"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
									</svg>
								</button>
								<button
									on:click={() => handleDelete(tierList.id, tierList.title)}
									class="text-gray-500 hover:text-red-400 transition-colors"
									title="Delete tier list"
								>
									<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
									</svg>
								</button>
							</div>
						</div>
						
						<!-- Tier preview -->
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
					</div>
				{/each}
			</div>
		{/if}
	</div>

	<Modal bind:open={showCreateModal} title="Create Tier List">
		<form on:submit|preventDefault={handleCreate} class="space-y-4">
			<Input 
				id="title"
				label="Title"
				bind:value={newTitle}
				placeholder="My Novel Rankings"
			/>
			
			<div>
				<label for="description" class="block text-sm font-medium text-gray-300 mb-1">Description (optional)</label>
				<textarea
					id="description"
					bind:value={newDescription}
					rows="2"
					class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
					placeholder="What's this tier list about?"
				></textarea>
			</div>
			
			<div class="flex justify-end gap-3 pt-2">
				<Button variant="secondary" on:click={() => showCreateModal = false}>
					Cancel
				</Button>
				<Button type="submit" disabled={!newTitle.trim() || creating}>
					{creating ? 'Creating...' : 'Create'}
				</Button>
			</div>
		</form>
	</Modal>
{/if}
