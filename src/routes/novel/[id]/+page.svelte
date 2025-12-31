<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { novels } from '$lib/stores/novels';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import { get } from 'svelte/store';
	import NovelForm from '$lib/components/NovelForm.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { Novel, NovelInput } from '$lib/types';
	
	let novel: Novel | null = null;
	let loading = true;
	let saving = false;
	let confirmDelete = false;
	
	$: novelId = $page.params.id;
	
	onMount(() => {
		const unsubscribe = auth.subscribe(async (state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					await loadNovel();
				}
			}
		});
		return unsubscribe;
	});
	
	async function loadNovel() {
		loading = true;
		await novels.load();
		const state = get(novels);
		novel = state.novels.find(n => n.id === novelId) || null;
		loading = false;
	}
	
	async function handleUpdate(e: CustomEvent<NovelInput>) {
		if (!novel) return;
		saving = true;
		try {
			await novels.update(novel.id, e.detail);
			toast('Novel updated!', 'success');
			goto('/library');
		} catch (err) {
			toast('Failed to update', 'error');
		} finally {
			saving = false;
		}
	}
	
	async function handleDelete() {
		if (!novel) return;
		try {
			await novels.delete(novel.id);
			toast('Novel deleted', 'success');
			goto('/library');
		} catch (err) {
			toast('Failed to delete', 'error');
		}
	}
</script>

<svelte:head>
	<title>{novel?.title || 'Novel'} - MyNovelList</title>
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
	<div class="max-w-2xl mx-auto px-4 py-8">
		<a href="/library" class="text-primary-400 hover:text-primary-300 mb-4 inline-flex items-center gap-1">
			<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			Back to Library
		</a>
		
		{#if loading}
			<div class="text-center py-12 text-gray-400">Loading...</div>
		{:else if !novel}
			<div class="text-center py-12">
				<p class="text-gray-400 mb-4">Novel not found</p>
				<a href="/library">
					<Button>Go to Library</Button>
				</a>
			</div>
		{:else}
			<div class="card">
				<div class="flex items-center justify-between mb-6">
					<h1 class="text-2xl font-bold text-gray-100">Edit Novel</h1>
					<Button 
						variant="danger" 
						size="sm"
						on:click={() => confirmDelete = true}
					>
						Delete
					</Button>
				</div>
				
				<NovelForm 
					{novel}
					loading={saving}
					on:submit={handleUpdate}
					on:cancel={() => goto('/library')}
				/>
			</div>
			
			{#if confirmDelete}
				<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
					<div class="card max-w-sm">
						<h3 class="text-lg font-semibold text-gray-100 mb-2">Delete Novel?</h3>
						<p class="text-gray-400 mb-4">
							Are you sure you want to delete "{novel.title}"? This cannot be undone.
						</p>
						<div class="flex justify-end gap-3">
							<Button variant="secondary" on:click={() => confirmDelete = false}>
								Cancel
							</Button>
							<Button variant="danger" on:click={handleDelete}>
								Delete
							</Button>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	</div>
{/if}
