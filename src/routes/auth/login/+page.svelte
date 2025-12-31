<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	let email = '';
	let password = '';
	let loading = false;
	let error = '';
	
	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}
		
		loading = true;
		error = '';
		
		try {
			await auth.signIn(email, password);
			toast('Welcome back!', 'success');
			goto('/library');
		} catch (err: any) {
			error = err.message || 'Failed to sign in';
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Sign In - MyNovelList</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="card">
		<h1 class="text-2xl font-bold text-gray-100 mb-6 text-center">Sign In</h1>
		
		<form on:submit|preventDefault={handleLogin} class="space-y-4">
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
			
			{#if error}
				<p class="text-red-400 text-sm">{error}</p>
			{/if}
			
			<Button type="submit" disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</Button>
		</form>
		
		<p class="mt-6 text-center text-sm text-gray-400">
			Don't have an account? 
			<a href="/auth/signup" class="text-primary-400 hover:text-primary-300">Sign up</a>
		</p>
		
		<p class="mt-2 text-center text-sm text-gray-400">
			<a href="/auth/forgot-password" class="text-primary-400 hover:text-primary-300">Forgot password?</a>
		</p>
	</div>
</div>
