<script lang="ts">
	import { supabase } from '$lib/services/supabase';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { toast } from '$lib/components/ui/Toast.svelte';
	
	let email = '';
	let loading = false;
	let sent = false;
	let error = '';
	
	async function handleSubmit() {
		if (!email) {
			error = 'Please enter your email';
			return;
		}
		
		loading = true;
		error = '';
		
		const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${window.location.origin}/auth/reset-password`
		});
		
		if (resetError) {
			error = resetError.message;
			loading = false;
			return;
		}
		
		sent = true;
		loading = false;
		toast('Password reset email sent!', 'success');
	}
</script>

<svelte:head>
	<title>Forgot Password - MyNovelList</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-16">
	<div class="card">
		<h1 class="text-2xl font-bold text-gray-100 mb-2 text-center">Forgot Password</h1>
		<p class="text-gray-400 text-center mb-6">
			Enter your email and we'll send you a reset link.
		</p>
		
		{#if sent}
			<div class="text-center">
				<div class="w-16 h-16 mx-auto mb-4 bg-green-600/20 rounded-full flex items-center justify-center">
					<svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
					</svg>
				</div>
				<p class="text-gray-300 mb-4">
					Check your email for a password reset link.
				</p>
				<a href="/auth/login" class="text-primary-400 hover:text-primary-300">
					Back to Sign In
				</a>
			</div>
		{:else}
			<form on:submit|preventDefault={handleSubmit} class="space-y-4">
				<Input 
					id="email"
					type="email"
					label="Email"
					bind:value={email}
					placeholder="you@example.com"
				/>
				
				{#if error}
					<p class="text-red-400 text-sm">{error}</p>
				{/if}
				
				<Button type="submit" disabled={loading}>
					{loading ? 'Sending...' : 'Send Reset Link'}
				</Button>
			</form>
			
			<p class="mt-6 text-center text-sm text-gray-400">
				Remember your password? 
				<a href="/auth/login" class="text-primary-400 hover:text-primary-300">Sign in</a>
			</p>
		{/if}
	</div>
</div>
