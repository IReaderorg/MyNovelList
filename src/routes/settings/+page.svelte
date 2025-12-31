<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import { novels } from '$lib/stores/novels';
	import { exportService } from '$lib/services/exportService';
	import Button from '$lib/components/ui/Button.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	let importing = false;
	let exporting = false;
	let fileInput: HTMLInputElement;
	
	onMount(() => {
		const unsubscribe = auth.subscribe((state) => {
			if (!state.loading && !state.user) {
				goto('/auth/login');
			}
		});
		return unsubscribe;
	});
	
	async function handleExport() {
		exporting = true;
		try {
			const data = await exportService.exportAll();
			exportService.downloadJson(data);
			toast('Export complete!', 'success');
		} catch (err) {
			toast('Export failed', 'error');
			console.error(err);
		} finally {
			exporting = false;
		}
	}
	
	async function handleImport(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		
		importing = true;
		try {
			const text = await file.text();
			const data = exportService.parseImport(text);
			const result = await exportService.importData(data, 'merge');
			await novels.load();
			toast(`Imported ${result.novelsImported} novels, ${result.tierListsImported} tier lists!`, 'success');
		} catch (err) {
			toast('Import failed - invalid file format', 'error');
			console.error(err);
		} finally {
			importing = false;
			target.value = '';
		}
	}
</script>

<svelte:head>
	<title>Settings - MyNovelList</title>
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
		<h1 class="text-2xl font-bold text-gray-100 mb-6">Settings</h1>
		
		<!-- Data Management -->
		<div class="card mb-6">
			<h2 class="text-lg font-semibold text-gray-100 mb-4">Data Management</h2>
			
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium text-gray-300 mb-2">Export Data</h3>
					<p class="text-sm text-gray-400 mb-3">
						Download all your novels and tier lists as a JSON file for backup.
					</p>
					<Button on:click={handleExport} disabled={exporting}>
						{exporting ? 'Exporting...' : 'Export JSON'}
					</Button>
				</div>
				
				<hr class="border-gray-700" />
				
				<div>
					<h3 class="text-sm font-medium text-gray-300 mb-2">Import Data</h3>
					<p class="text-sm text-gray-400 mb-3">
						Import novels from a previously exported JSON file. Data will be merged with existing.
					</p>
					<input 
						type="file" 
						accept=".json"
						bind:this={fileInput}
						on:change={handleImport}
						class="hidden"
					/>
					<Button 
						variant="secondary" 
						on:click={() => fileInput.click()}
						disabled={importing}
					>
						{importing ? 'Importing...' : 'Import JSON'}
					</Button>
				</div>
			</div>
		</div>
		
		<!-- API Access -->
		<div class="card mb-6">
			<h2 class="text-lg font-semibold text-gray-100 mb-4">API Access</h2>
			<p class="text-sm text-gray-400 mb-4">
				Connect your novel reader app or build integrations with the MyNovelList API.
			</p>
			<div class="flex gap-3">
				<a href="/settings/api">
					<Button>Manage API Keys</Button>
				</a>
				<a href="/docs/api">
					<Button variant="secondary">View API Docs</Button>
				</a>
			</div>
		</div>
		
		<!-- Account -->
		<div class="card">
			<h2 class="text-lg font-semibold text-gray-100 mb-4">Account</h2>
			<p class="text-sm text-gray-400 mb-4">
				Signed in as <span class="text-gray-200">{$auth.user?.email}</span>
			</p>
			<Button variant="secondary" on:click={() => auth.signOut()}>
				Sign Out
			</Button>
		</div>
	</div>
{/if}
