<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import { novels } from '$lib/stores/novels';
	import { exportService } from '$lib/services/exportService';
	import { profileService } from '$lib/services/profileService';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	import type { Profile } from '$lib/types';
	
	let importing = false;
	let exporting = false;
	let savingProfile = false;
	let fileInput: HTMLInputElement;
	let profile: Profile | null = null;
	let displayName = '';
	let publicNovelCount = 0;
	
	$: profileUrl = $auth.user ? `${typeof window !== 'undefined' ? window.location.origin : ''}/user/${$auth.user.id}` : '';
	
	onMount(() => {
		const unsubscribe = auth.subscribe(async (state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					await loadProfile();
				}
			}
		});
		return unsubscribe;
	});
	
	async function loadProfile() {
		if (!$auth.user) return;
		profile = await profileService.getProfile($auth.user.id);
		displayName = profile?.display_name || '';
		
		// Count public novels
		const publicNovels = await profileService.getPublicNovels($auth.user.id);
		publicNovelCount = publicNovels.length;
	}
	
	async function saveProfile() {
		savingProfile = true;
		try {
			await profileService.updateProfile({ display_name: displayName.trim() || undefined });
			toast('Profile updated!', 'success');
		} catch (err) {
			toast('Failed to update profile', 'error');
		} finally {
			savingProfile = false;
		}
	}
	
	function copyProfileLink() {
		navigator.clipboard.writeText(profileUrl);
		toast('Profile link copied!', 'success');
	}
	
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
		<h1 class="text-2xl font-bold mb-6">Settings</h1>
		
		<!-- Public Profile -->
		<div class="card mb-6">
			<h2 class="text-lg font-semibold mb-4">Public Profile</h2>
			
			<div class="space-y-4">
				<Input 
					id="displayName"
					label="Display Name"
					bind:value={displayName}
					placeholder="Your public display name"
				/>
				
				<div class="flex gap-3">
					<Button on:click={saveProfile} disabled={savingProfile}>
						{savingProfile ? 'Saving...' : 'Save Profile'}
					</Button>
				</div>
				
				<hr class="border-gray-700" />
				
				<div>
					<h3 class="text-sm font-medium mb-2">Your Public Profile</h3>
					<p class="text-sm text-muted mb-3">
						You have {publicNovelCount} public novel{publicNovelCount !== 1 ? 's' : ''}. 
						Share your profile link with others to show your reading list.
					</p>
					<div class="flex gap-2">
						<a href="/user/{$auth.user?.id}" class="flex-1">
							<Button variant="secondary" class="w-full">View Profile</Button>
						</a>
						<Button on:click={copyProfileLink}>Copy Link</Button>
					</div>
				</div>
			</div>
		</div>
		
		<!-- Data Management -->
		<div class="card mb-6">
			<h2 class="text-lg font-semibold mb-4">Data Management</h2>
			
			<div class="space-y-4">
				<div>
					<h3 class="text-sm font-medium mb-2">Export Data</h3>
					<p class="text-sm text-muted mb-3">
						Download all your novels and tier lists as a JSON file for backup.
					</p>
					<Button on:click={handleExport} disabled={exporting}>
						{exporting ? 'Exporting...' : 'Export JSON'}
					</Button>
				</div>
				
				<hr class="border-gray-700" />
				
				<div>
					<h3 class="text-sm font-medium mb-2">Import Data</h3>
					<p class="text-sm text-muted mb-3">
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
			<h2 class="text-lg font-semibold mb-4">API Access</h2>
			<p class="text-sm text-muted mb-4">
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
			<h2 class="text-lg font-semibold mb-4">Account</h2>
			<p class="text-sm text-muted mb-4">
				Signed in as <span class="font-medium">{$auth.user?.email}</span>
			</p>
			<Button variant="secondary" on:click={() => auth.signOut()}>
				Sign Out
			</Button>
		</div>
	</div>
{/if}
