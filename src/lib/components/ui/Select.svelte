<script lang="ts">
	export let value: string = '';
	export let label = '';
	export let id = '';
	export let options: { value: string; label: string }[] = [];
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-300 mb-1">{label}</label>
	{/if}
	<select
		{id}
		bind:value
		class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
		on:change
	>
		{#each options as opt}
			<option value={opt.value}>{opt.label}</option>
		{/each}
	</select>
</div>
