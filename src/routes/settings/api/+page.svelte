<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import { apiKeyService } from '$lib/services/apiKeyService';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { ApiKey, ApiScope } from '$lib/types';
	
	let apiKeys: ApiKey[] = [];
	let loading = true;
	let showCreateModal = false;
	let showSecretModal = false;
	let newKeyName = '';
	let newKeyScopes: ApiScope[] = ['read'];
	let creating = false;
	let newKeySecret = '';
	
	onMount(() => {
		const unsubscribe = auth.subscribe(async (state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					await loadKeys();
				}
			}
		});
		return unsubscribe;
	});
	
	async function loadKeys() {
		loading = true;
		try {
			apiKeys = await apiKeyService.getAll();
		} catch (err) {
			toast('Failed to load API keys', 'error');
		} finally {
			loading = false;
		}
	}
	
	function toggleScope(scope: ApiScope) {
		if (newKeyScopes.includes(scope)) {
			newKeyScopes = newKeyScopes.filter(s => s !== scope);
		} else {
			newKeyScopes = [...newKeyScopes, scope];
		}
	}
	
	async function handleCreate() {
		if (!newKeyName.trim()) return;
		if (newKeyScopes.length === 0) {
			toast('Select at least one permission', 'error');
			return;
		}
		
		creating = true;
		try {
			const result = await apiKeyService.create(newKeyName.trim(), newKeyScopes);
			newKeySecret = result.secret;
			showCreateModal = false;
			showSecretModal = true;
			newKeyName = '';
			newKeyScopes = ['read'];
			await loadKeys();
		} catch (err) {
			toast('Failed to create API key', 'error');
		} finally {
			creating = false;
		}
	}
	
	async function handleDelete(id: string, name: string) {
		if (!confirm(`Delete API key "${name}"? This cannot be undone.`)) return;
		
		try {
			await apiKeyService.delete(id);
			apiKeys = apiKeys.filter(k => k.id !== id);
			toast('API key deleted', 'success');
		} catch (err) {
			toast('Failed to delete', 'error');
		}
	}
	
	async function handleToggle(id: string, isActive: boolean) {
		try {
			await apiKeyService.toggleActive(id, !isActive);
			apiKeys = apiKeys.map(k => k.id === id ? { ...k, is_active: !isActive } : k);
			toast(isActive ? 'API key disabled' : 'API key enabled', 'success');
		} catch (err) {
			toast('Failed to update', 'error');
		}
	}
	
	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		toast('Copied to clipboard!', 'success');
	}
	
	function formatDate(date: string | undefined): string {
		if (!date) return 'Never';
		return new Date(date).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>API Keys - MyNovelList</title>
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
		<div class="flex items-center gap-4 mb-6">
			<a href="/settings" class="text-primary-400 hover:text-primary-300">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
				</svg>
			</a>
			<h1 class="text-2xl font-bold text-gray-100">API Keys</h1>
		</div>
		
		<div class="card mb-6">
			<div class="flex items-center justify-between mb-4">
				<div>
					<h2 class="text-lg font-semibold text-gray-100">Your API Keys</h2>
					<p class="text-sm text-gray-400">Use these keys to integrate MyNovelList with your apps</p>
				</div>
				<Button on:click={() => showCreateModal = true}>
					Create Key
				</Button>
			</div>
			
			{#if loading}
				<p class="text-gray-400 py-4">Loading...</p>
			{:else if apiKeys.length === 0}
				<p class="text-gray-400 py-4">No API keys yet. Create one to get started.</p>
			{:else}
				<div class="space-y-3">
					{#each apiKeys as key (key.id)}
						<div class="bg-gray-700/50 rounded-lg p-4">
							<div class="flex items-start justify-between">
								<div>
									<div class="flex items-center gap-2">
										<span class="font-medium text-gray-100">{key.name}</span>
										{#if !key.is_active}
											<span class="px-2 py-0.5 text-xs rounded bg-red-600 text-white">Disabled</span>
										{/if}
									</div>
									<code class="text-sm text-gray-400 font-mono">{key.key_prefix}...</code>
								</div>
								<div class="flex items-center gap-2">
									<button
										on:click={() => handleToggle(key.id, key.is_active)}
										class="text-sm text-gray-400 hover:text-gray-200"
									>
										{key.is_active ? 'Disable' : 'Enable'}
									</button>
									<button
										on:click={() => handleDelete(key.id, key.name)}
										class="text-sm text-red-400 hover:text-red-300"
									>
										Delete
									</button>
								</div>
							</div>
							<div class="mt-2 flex flex-wrap gap-2">
								{#each key.scopes as scope}
									<span class="px-2 py-0.5 text-xs rounded bg-gray-600 text-gray-300">{scope}</span>
								{/each}
							</div>
							<div class="mt-2 text-xs text-gray-500">
								Created: {formatDate(key.created_at)} · 
								Last used: {formatDate(key.last_used_at)} · 
								Requests: {key.request_count}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
		
		<div class="card">
			<h2 class="text-lg font-semibold text-gray-100 mb-2">API Documentation</h2>
			<p class="text-sm text-gray-400 mb-4">
				View the full API documentation to integrate MyNovelList with your app.
			</p>
			<a href="/docs/api">
				<Button variant="secondary">View API Docs</Button>
			</a>
		</div>
	</div>

	<!-- Create Modal -->
	<Modal bind:open={showCreateModal} title="Create API Key">
		<form on:submit|preventDefault={handleCreate} class="space-y-4">
			<Input 
				id="name"
				label="Key Name"
				bind:value={newKeyName}
				placeholder="My App"
			/>
			
			<div>
				<label class="block text-sm font-medium text-gray-300 mb-2">Permissions</label>
				<div class="flex flex-wrap gap-2">
					<button
						type="button"
						on:click={() => toggleScope('read')}
						class="px-3 py-1.5 rounded-lg text-sm transition-colors {newKeyScopes.includes('read') ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'}"
					>
						Read
					</button>
					<button
						type="button"
						on:click={() => toggleScope('write')}
						class="px-3 py-1.5 rounded-lg text-sm transition-colors {newKeyScopes.includes('write') ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300'}"
					>
						Write
					</button>
					<button
						type="button"
						on:click={() => toggleScope('delete')}
						class="px-3 py-1.5 rounded-lg text-sm transition-colors {newKeyScopes.includes('delete') ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}"
					>
						Delete
					</button>
				</div>
				<p class="text-xs text-gray-500 mt-1">
					Read: View novels · Write: Create/update · Delete: Remove novels
				</p>
			</div>
			
			<div class="flex justify-end gap-3 pt-2">
				<Button variant="secondary" on:click={() => showCreateModal = false}>
					Cancel
				</Button>
				<Button type="submit" disabled={!newKeyName.trim() || creating}>
					{creating ? 'Creating...' : 'Create'}
				</Button>
			</div>
		</form>
	</Modal>

	<!-- Secret Modal -->
	<Modal bind:open={showSecretModal} title="API Key Created">
		<div class="space-y-4">
			<div class="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3">
				<p class="text-yellow-200 text-sm">
					Copy this key now. You won't be able to see it again!
				</p>
			</div>
			
			<div class="bg-gray-700 rounded-lg p-3">
				<code class="text-sm text-gray-100 break-all font-mono">{newKeySecret}</code>
			</div>
			
			<div class="flex justify-end gap-3">
				<Button variant="secondary" on:click={() => copyToClipboard(newKeySecret)}>
					Copy
				</Button>
				<Button on:click={() => { showSecretModal = false; newKeySecret = ''; }}>
					Done
				</Button>
			</div>
		</div>
	</Modal>
{/if}
