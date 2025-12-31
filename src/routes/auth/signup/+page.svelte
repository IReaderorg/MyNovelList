<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	let email = '';
	let password = '';
	let confirmPassword = '';
	let loading = false;
	let error = '';
	
	async function handleSignup() {
		if (!email || !password || !confirmPassword) {
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
		
		try {
			await auth.signUp(email, password);
			toast('Account created! Check your email to confirm.', 'success');
			goto('/auth/login');
		} catch (err: any) {
			error = err.message || 'Failed to create account';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign Up - MyNovelList</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="card">
		<h1 class="text-2xl font-bold text-gray-100 mb-6 text-center">Create Account</h1>
		
		<form on:submit|preventDefault={handleSignup} class="space-y-4">
			<Input 
				id="email"
				type="email"
				label="Email"
				bind:value={email}
				placeholder="you@example.com"
			/>
			
			<Input 
				id="password"
				type="password"
				label="Password"
				bind:value={password}
				placeholder="••••••••"
			/>
			
			<Input 
				id="confirmPassword"
				type="password"
				label="Confirm Password"
				bind:value={confirmPassword}
				placeholder="••••••••"
			/>
			
			{#if error}
				<p class="text-red-400 text-sm">{error}</p>
			{/if}
			
			<Button type="submit" disabled={loading}>
				{loading ? 'Creating account...' : 'Sign Up'}
			</Button>
		</form>
		
		<p class="mt-6 text-center text-sm text-gray-400">
			Already have an account? 
			<a href="/auth/login" class="text-primary-400 hover:text-primary-300">Sign in</a>
		</p>
	</div>
</div>
