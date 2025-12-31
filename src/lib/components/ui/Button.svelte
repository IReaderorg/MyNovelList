<script lang="ts">
	export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export let disabled = false;
	export let type: 'button' | 'submit' = 'button';

	const variants = {
		primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
		secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100 focus:ring-gray-500',
		danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
		ghost: 'bg-transparent hover:bg-gray-700 text-gray-300 focus:ring-gray-500'
	};

	const sizes = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2',
		lg: 'px-6 py-3 text-lg'
	};
</script>

<button
	{type}
	{disabled}
	class="rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed {variants[variant]} {sizes[size]}"
	on:click
>
	<slot />
</button>
