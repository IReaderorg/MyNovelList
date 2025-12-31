<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { novels } from '$lib/stores/novels';
	import { auth, isAuthenticated } from '$lib/stores/auth';
	import { derived } from 'svelte/store';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	
	onMount(() => {
		const unsubscribe = auth.subscribe((state) => {
			if (!state.loading) {
				if (!state.user) {
					goto('/auth/login');
				} else {
					novels.load();
				}
			}
		});
		return unsubscribe;
	});
	
	const stats = derived(novels, ($novels) => {
		const all = $novels.novels;
		
		const byStatus = {
			planning: all.filter(n => n.progress?.status === 'planning').length,
			reading: all.filter(n => n.progress?.status === 'reading').length,
			completed: all.filter(n => n.progress?.status === 'completed').length,
			on_hold: all.filter(n => n.progress?.status === 'on_hold').length,
			dropped: all.filter(n => n.progress?.status === 'dropped').length
		};
		
		const totalChapters = all.reduce((sum, n) => sum + (n.progress?.current_chapter || 0), 0);
		
		const scored = all.filter(n => n.progress?.score !== null && n.progress?.score !== undefined);
		const avgScore = scored.length > 0 
			? Math.round(scored.reduce((sum, n) => sum + (n.progress?.score || 0), 0) / scored.length)
			: 0;
		
		const completionRate = all.length > 0
			? Math.round((byStatus.completed / all.length) * 100)
			: 0;
		
		// Tags distribution
		const tagCounts: Record<string, number> = {};
		all.forEach(n => {
			n.tags?.forEach(tag => {
				tagCounts[tag] = (tagCounts[tag] || 0) + 1;
			});
		});
		const topTags = Object.entries(tagCounts)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
		
		// Score distribution
		const scoreRanges = [
			{ label: '90-100', min: 90, max: 100, count: 0 },
			{ label: '80-89', min: 80, max: 89, count: 0 },
			{ label: '70-79', min: 70, max: 79, count: 0 },
			{ label: '60-69', min: 60, max: 69, count: 0 },
			{ label: '50-59', min: 50, max: 59, count: 0 },
			{ label: '<50', min: 0, max: 49, count: 0 }
		];
		scored.forEach(n => {
			const score = n.progress?.score || 0;
			const range = scoreRanges.find(r => score >= r.min && score <= r.max);
			if (range) range.count++;
		});
		
		// Recent activity (novels updated in last 30 days)
		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const recentlyActive = all.filter(n => n.progress && new Date(n.progress.updated_at) > thirtyDaysAgo).length;
		
		return {
			total: all.length,
			byStatus,
			totalChapters,
			avgScore,
			completionRate,
			topTags,
			scoreRanges,
			recentlyActive,
			scored: scored.length
		};
	});
	
	const statusColors: Record<string, string> = {
		planning: 'bg-gray-500',
		reading: 'bg-blue-500',
		completed: 'bg-green-500',
		on_hold: 'bg-yellow-500',
		dropped: 'bg-red-500'
	};
	
	const statusLabels: Record<string, string> = {
		planning: 'Planning',
		reading: 'Reading',
		completed: 'Completed',
		on_hold: 'On Hold',
		dropped: 'Dropped'
	};
</script>

<svelte:head>
	<title>Statistics - MyNovelList</title>
</svelte:head>

{#if $auth.loading || $novels.loading}
	<div class="max-w-4xl mx-auto px-4 py-8">
		<Skeleton width="200px" height="2rem" rounded="rounded-lg" />
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
			{#each Array(4) as _}
				<div class="card">
					<Skeleton width="60%" height="1rem" />
					<Skeleton width="40%" height="2rem" />
				</div>
			{/each}
		</div>
	</div>
{:else if !$isAuthenticated}
	<div class="flex items-center justify-center min-h-[50vh]">
		<p class="text-gray-400">Redirecting to login...</p>
	</div>
{:else}
	<div class="max-w-4xl mx-auto px-4 py-8">
		<h1 class="text-2xl font-bold mb-6">Statistics</h1>
		
		<!-- Overview Cards -->
		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
			<div class="card text-center">
				<p class="text-gray-400 text-sm">Total Novels</p>
				<p class="text-3xl font-bold text-gray-100">{$stats.total}</p>
			</div>
			<div class="card text-center">
				<p class="text-gray-400 text-sm">Chapters Read</p>
				<p class="text-3xl font-bold text-gray-100">{$stats.totalChapters.toLocaleString()}</p>
			</div>
			<div class="card text-center">
				<p class="text-gray-400 text-sm">Average Score</p>
				<p class="text-3xl font-bold text-primary-400">{$stats.avgScore}</p>
			</div>
			<div class="card text-center">
				<p class="text-gray-400 text-sm">Completion Rate</p>
				<p class="text-3xl font-bold text-green-400">{$stats.completionRate}%</p>
			</div>
		</div>
		
		<div class="grid md:grid-cols-2 gap-6">
			<!-- Status Distribution -->
			<div class="card">
				<h2 class="text-lg font-semibold text-gray-100 mb-4">By Status</h2>
				<div class="space-y-3">
					{#each Object.entries($stats.byStatus) as [status, count]}
						<div>
							<div class="flex justify-between text-sm mb-1">
								<span class="text-gray-300">{statusLabels[status]}</span>
								<span class="text-gray-400">{count}</span>
							</div>
							<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
								<div 
									class="h-full {statusColors[status]} transition-all duration-500"
									style="width: {$stats.total > 0 ? (count / $stats.total) * 100 : 0}%"
								></div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Score Distribution -->
			<div class="card">
				<h2 class="text-lg font-semibold text-gray-100 mb-4">Score Distribution</h2>
				{#if $stats.scored === 0}
					<p class="text-gray-500 text-sm">No scored novels yet</p>
				{:else}
					<div class="space-y-3">
						{#each $stats.scoreRanges as range}
							<div>
								<div class="flex justify-between text-sm mb-1">
									<span class="text-gray-300">{range.label}</span>
									<span class="text-gray-400">{range.count}</span>
								</div>
								<div class="h-2 bg-gray-700 rounded-full overflow-hidden">
									<div 
										class="h-full bg-primary-500 transition-all duration-500"
										style="width: {$stats.scored > 0 ? (range.count / $stats.scored) * 100 : 0}%"
									></div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			
			<!-- Top Tags -->
			<div class="card">
				<h2 class="text-lg font-semibold text-gray-100 mb-4">Top Tags</h2>
				{#if $stats.topTags.length === 0}
					<p class="text-gray-500 text-sm">No tags yet</p>
				{:else}
					<div class="flex flex-wrap gap-2">
						{#each $stats.topTags as [tag, count]}
							<span class="px-3 py-1 bg-gray-700 rounded-full text-sm">
								<span class="text-gray-300">{tag}</span>
								<span class="text-gray-500 ml-1">({count})</span>
							</span>
						{/each}
					</div>
				{/if}
			</div>
			
			<!-- Activity -->
			<div class="card">
				<h2 class="text-lg font-semibold text-gray-100 mb-4">Activity</h2>
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<span class="text-gray-300">Active in last 30 days</span>
						<span class="text-2xl font-bold text-primary-400">{$stats.recentlyActive}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-300">Novels with scores</span>
						<span class="text-2xl font-bold text-gray-100">{$stats.scored}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="text-gray-300">Currently reading</span>
						<span class="text-2xl font-bold text-blue-400">{$stats.byStatus.reading}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}
