<script lang="ts">
	import { filterOptions, sortOptions } from '$lib/stores/novels';
	import Select from './ui/Select.svelte';
	import Input from './ui/Input.svelte';
	
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
	
	let searchValue = '';
	let searchTimer: ReturnType<typeof setTimeout>;
	
	function handleSearch() {
		clearTimeout(searchTimer);
		searchTimer = setTimeout(() => {
			filterOptions.update(f => ({ ...f, search: searchValue || undefined }));
		}, 300);
	}
</script>

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
</div>
