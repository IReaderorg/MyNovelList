<script lang="ts">
	import { filterOptions, sortOptions, novels } from '$lib/stores/novels';
	import { derived } from 'svelte/store';
	import Select from './ui/Select.svelte';
	import Input from './ui/Input.svelte';
	
	export let viewMode: 'list' | 'grid' = 'list';
	
	const statusOptions = [
		{ value: 'all', label: 'All Status' },
		{ value: 'planning', label: 'Planning' },
		{ value: 'reading', label: 'Reading' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'on_hold', label: 'On Hold' },
		{ value: 'dropped', label: 'Dropped' }
	];
	
	const sortFieldOptions = [
		{ value: 'updated_at', label: 'Last Updated' },
		{ value: 'created_at', label: 'Date Added' },
		{ value: 'title', label: 'Title' },
		{ value: 'score', label: 'Score' },
		{ value: 'current_chapter', label: 'Chapter' }
	];
	
	const sortDirOptions = [
		{ value: 'desc', label: 'Descending' },
		{ value: 'asc', label: 'Ascending' }
	];
	
	// Get all unique tags from novels
	const allTags = derived(novels, ($novels) => {
		const tags = new Set<string>();
		$novels.novels.forEach(n => n.tags?.forEach(t => tags.add(t)));
		return Array.from(tags).sort();
	});
	
	let searchValue = '';
	let searchTimer: ReturnType<typeof setTimeout>;
	let showTagFilter = false;
	let selectedTags: string[] = [];
	
	function handleSearch() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			filterOptions.update(f => ({ ...f, search: searchValue || undefined }));
		}, 300);
	}
	
	function toggleTag(tag: string) {
		if (selectedTags.includes(tag)) {
			selectedTags = selectedTags.filter(t => t !== tag);
		} else {
			selectedTags = [...selectedTags, tag];
		}
		filterOptions.update(f => ({ ...f, tags: selectedTags.length > 0 ? selectedTags : undefined }));
	}
	
	function clearTags() {
		selectedTags = [];
		filterOptions.update(f => ({ ...f, tags: undefined }));
	}
</script>

<div class="space-y-3">
	<div class="flex flex-wrap gap-3 items-end">
		<div class="flex-1 min-w-[200px]">
			<Input 
				placeholder="Search novels..."
				bind:value={searchValue}
				on:input={handleSearch}
			/>
		</div>
		
		<div class="w-36">
			<Select 
				options={statusOptions}
				bind:value={$filterOptions.status}
			/>
		</div>
		
		<div class="w-36">
			<Select 
				options={sortFieldOptions}
				bind:value={$sortOptions.field}
			/>
		</div>
		
		<div class="w-32">
			<Select 
				options={sortDirOptions}
				bind:value={$sortOptions.direction}
			/>
		</div>
		
		<!-- Tag Filter Toggle -->
		{#if $allTags.length > 0}
			<button
				on:click={() => showTagFilter = !showTagFilter}
				class="px-3 py-2 rounded-lg text-sm transition-colors {selectedTags.length > 0 ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
			>
				Tags {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}
			</button>
		{/if}
		
		<!-- View Toggle -->
		<div class="flex rounded-lg overflow-hidden border border-gray-700">
			<button
				on:click={() => viewMode = 'list'}
				class="p-2 transition-colors {viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}"
				title="List view"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
				</svg>
			</button>
			<button
				on:click={() => viewMode = 'grid'}
				class="p-2 transition-colors {viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}"
				title="Grid view"
			>
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
				</svg>
			</button>
		</div>
	</div>
	
	<!-- Tag Filter Panel -->
	{#if showTagFilter && $allTags.length > 0}
		<div class="bg-gray-800 rounded-lg p-3 border border-gray-700">
			<div class="flex items-center justify-between mb-2">
				<span class="text-sm text-gray-300">Filter by tags</span>
				{#if selectedTags.length > 0}
					<button on:click={clearTags} class="text-xs text-primary-400 hover:text-primary-300">
						Clear all
					</button>
				{/if}
			</div>
			<div class="flex flex-wrap gap-2">
				{#each $allTags as tag}
					<button
						on:click={() => toggleTag(tag)}
						class="px-2 py-1 text-sm rounded transition-colors {selectedTags.includes(tag) ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}"
					>
						{tag}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
