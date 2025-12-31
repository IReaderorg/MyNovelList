<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { supabase } from '$lib/services/supabase';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	let ready = false;
	
	onMount(async () => {
		// Check if we have a valid session from the reset link
		const { data: { session } } = await supabase.auth.getSession();
		if (session) {
			ready = true;
		} else {
			error = 'Invalid or expired reset link. Please request a new one.';
		}
	});
	
	async function handleSubmit() {
		if (!password || !confirmPassword) {
			error = 'Please fill in all fields';
			return;
		}
		
		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}
		
		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}
		
		loading = true;
		error = '';
		
		const { error: updateError } = await supabase.auth.updateUser({
			password
		});
		
		if (updateError) {
			error = updateError.message;
			loading = false;
			return;
		}
		
		toast('Password updated successfully!', 'success');
		goto('/library');
	}
</script>

<svelte:head>
	<title>Reset Password - MyNovelList</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="card">
		<h1 class="text-2xl font-bold text-gray-100 mb-6 text-center">Reset Password</h1>
		
		{#if !ready && error}
			<div class="text-center">
				<p class="text-red-400 mb-4">{error}</p>
				<a href="/auth/forgot-password">
					<Button>Request New Link</Button>
				</a>
			</div>
		{:else if ready}
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<Input 
					id="password"
					type="password"
					label="New Password"
					bind:value={password}
					placeholder="••••••••"
				/>
				
				<Input 
					id="confirmPassword"
					type="password"
					label="Confirm New Password"
					bind:value={confirmPassword}
					placeholder="••••••••"
				/>
				
				{#if error}
					<p class="text-red-400 text-sm">{error}</p>
				{/if}
				
				<Button type="submit" disabled={loading}>
					{loading ? 'Updating...' : 'Update Password'}
				</Button>
			</form>
		{:else}
			<p class="text-gray-400 text-center">Verifying reset link...</p>
		{/if}
	</div>
</div>
