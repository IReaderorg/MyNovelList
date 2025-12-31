<script lang="ts">
	import { isAuthenticated } from '$lib/stores/auth';
	import Button from '$lib/components/ui/Button.svelte';
</script>

<svelte:head>
	<title>MyNovelList - Track Any Novel</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-16">
	<!-- Hero -->
	<div class="text-center mb-16">
		<h1 class="text-5xl font-bold text-gray-100 mb-4">
			Track <span class="text-primary-400">Any</span> Novel
		</h1>
		<p class="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
			No limits. No restrictions. Track web novels, light novels, fan translations, 
			original fiction, or even the Bible. Your reading list, your way.
		</p>
		<div class="flex justify-center gap-4">
			{#if $isAuthenticated}
				<a href="/library">
					<Button size="lg">Go to Library</Button>
				</a>
			{:else}
				<a href="/auth/signup">
					<Button size="lg">Get Started</Button>
				</a>
				<a href="/auth/login">
					<Button variant="secondary" size="lg">Sign In</Button>
				</a>
			{/if}
		</div>
	</div>
	
	<!-- Features -->
	<div class="grid md:grid-cols-3 gap-8 mb-16">
		<div class="card text-center">
			<div class="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
				<svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-100 mb-2">Add Anything</h3>
			<p class="text-gray-400 text-sm">
				No database limitations. Add any novel manually with title, cover, and source.
			</p>
		</div>
		
		<div class="card text-center">
			<div class="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
				<svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-100 mb-2">Track Progress</h3>
			<p class="text-gray-400 text-sm">
				Manual chapter tracking with scores from 1-100. Simple and effective.
			</p>
		</div>
		
		<div class="card text-center">
			<div class="w-12 h-12 bg-primary-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
				<svg class="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
				</svg>
			</div>
			<h3 class="text-lg font-semibold text-gray-100 mb-2">Share Tier Lists</h3>
			<p class="text-gray-400 text-sm">
				Create and share tier lists with the community. Perfect for recommendations.
			</p>
		</div>
	</div>
	
	<!-- Why -->
	<div class="card">
		<h2 class="text-2xl font-bold text-gray-100 mb-4">Why MyNovelList?</h2>
		<div class="space-y-3 text-gray-300">
			<p>
				<strong class="text-primary-400">NovelUpdates</strong> only accepts Asian novels. 
				No RoyalRoad, no western fiction.
			</p>
			<p>
				<strong class="text-primary-400">MyAnimeList</strong> has a limited archive. 
				Many web novels aren't even addable.
			</p>
			<p>
				<strong class="text-primary-400">Goodreads</strong> isn't built for chapter tracking 
				or web novels.
			</p>
			<p class="pt-2 text-gray-100">
				MyNovelList lets you track <em>anything</em> you read. No approval process, 
				no database limitations. Just add it and start tracking.
			</p>
		</div>
	</div>
</div>
