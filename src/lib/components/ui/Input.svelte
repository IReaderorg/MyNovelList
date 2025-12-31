<script lang="ts">
	export let value: string | number = '';
	export let type: 'text' | 'number' | 'email' | 'password' | 'url' = 'text';
	export let placeholder = '';
	export let label = '';
	export let error = '';
	export let id = '';
	export let min: number | undefined = undefined;
	export let max: number | undefined = undefined;
	export let disabled = false;
	
	const inputClass = "w-full px-3 py-2 bg-gray-800 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
</script>

<div class="w-full">
	{#if label}
		<label for={id} class="block text-sm font-medium text-gray-300 mb-1">{label}</label>
	{/if}
	{#if type === 'number'}
		<input
			{id}
			type="number"
			{placeholder}
			{min}
			{max}
			{disabled}
			bind:value
			class="{inputClass} {error ? 'border-red-500' : 'border-gray-700'}"
			on:input
			on:change
			on:blur
		/>
	{:else if type === 'email'}
		<input
			{id}
			type="email"
			{placeholder}
			{disabled}
			bind:value
			class="{inputClass} {error ? 'border-red-500' : 'border-gray-700'}"
			on:input
			on:change
			on:blur
		/>
	{:else if type === 'password'}
		<input
			{id}
			type="password"
			{placeholder}
			{disabled}
			bind:value
			class="{inputClass} {error ? 'border-red-500' : 'border-gray-700'}"
			on:input
			on:change
			on:blur
		/>
	{:else if type === 'url'}
		<input
			{id}
			type="url"
			{placeholder}
			{disabled}
			bind:value
			class="{inputClass} {error ? 'border-red-500' : 'border-gray-700'}"
			on:input
			on:change
			on:blur
		/>
	{:else}
		<input
			{id}
			type="text"
			{placeholder}
			{disabled}
			bind:value
			class="{inputClass} {error ? 'border-red-500' : 'border-gray-700'}"
			on:input
			on:change
			on:blur
		/>
	{/if}
	{#if error}
		<p class="mt-1 text-sm text-red-400">{error}</p>
	{/if}
</div>
