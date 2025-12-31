<script lang="ts">
	import { page } from '$app/stores';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import Button from './ui/Button.svelte';
	import ThemeToggle from './ThemeToggle.svelte';
	
	let menuOpen = false;
	
	// Close menu on route change
	$: $page.url.pathname, menuOpen = false;
</script>

<nav class="border-b bg-gray-800 border-gray-700 dark:bg-gray-800 dark:border-gray-700">
	<div class="max-w-6xl mx-auto px-4">
		<div class="flex items-center justify-between h-16">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 text-xl font-bold text-primary-400">
				<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
				</svg>
				MyNovelList
			</a>
			
			<!-- Desktop Nav -->
			<div class="hidden md:flex items-center gap-6">
				{#if $isAuthenticated}
					<a 
						href="/library" 
						class="transition-colors {$page.url.pathname === '/library' ? 'text-primary-400' : 'text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white'}"
					>
						Library
					</a>
					<a 
						href="/tier-lists" 
						class="transition-colors {$page.url.pathname.startsWith('/tier-lists') ? 'text-primary-400' : 'text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white'}"
					>
						Tier Lists
					</a>
					<a 
						href="/stats" 
						class="transition-colors {$page.url.pathname === '/stats' ? 'text-primary-400' : 'text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white'}"
					>
						Stats
					</a>
					<a 
						href="/settings" 
						class="transition-colors {$page.url.pathname.startsWith('/settings') ? 'text-primary-400' : 'text-gray-300 hover:text-white dark:text-gray-300 dark:hover:text-white'}"
					>
						Settings
					</a>
					<ThemeToggle />
					<Button variant="ghost" size="sm" on:click={() => auth.signOut()}>
						Sign Out
					</Button>
				{:else}
					<ThemeToggle />
					<a href="/auth/login">
						<Button variant="secondary" size="sm">Sign In</Button>
					</a>
					<a href="/auth/signup">
						<Button variant="primary" size="sm">Sign Up</Button>
					</a>
				{/if}
			</div>
			
			<!-- Mobile Menu Button -->
			<button 
				class="md:hidden text-gray-300 hover:text-white"
				on:click={() => menuOpen = !menuOpen}
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					{#if menuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
		
		<!-- Mobile Menu -->
		{#if menuOpen}
			<div class="md:hidden py-4 border-t border-gray-700">
				<div class="flex flex-col gap-3">
					{#if $isAuthenticated}
						<a href="/library" class="text-gray-300 hover:text-white transition-colors py-2">Library</a>
						<a href="/tier-lists" class="text-gray-300 hover:text-white transition-colors py-2">Tier Lists</a>
						<a href="/stats" class="text-gray-300 hover:text-white transition-colors py-2">Stats</a>
						<a href="/settings" class="text-gray-300 hover:text-white transition-colors py-2">Settings</a>
						<div class="py-2">
							<ThemeToggle />
						</div>
						<button 
							class="text-left text-gray-300 hover:text-white transition-colors py-2"
							on:click={() => auth.signOut()}
						>
							Sign Out
						</button>
					{:else}
						<div class="py-2">
							<ThemeToggle />
						</div>
						<a href="/auth/login" class="text-gray-300 hover:text-white transition-colors py-2">Sign In</a>
						<a href="/auth/signup" class="text-gray-300 hover:text-white transition-colors py-2">Sign Up</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</nav>
