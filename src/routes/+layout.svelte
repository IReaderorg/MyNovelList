<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib/stores/auth';
	import { theme } from '$lib/stores/theme';
	import Nav from '$lib/components/Nav.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import '../app.css';
	
	onMount(() => {
		auth.init();
		theme.init();
	});
</script>

<div class="min-h-screen flex flex-col">
	<Nav />
	<main class="flex-1">
		<slot />
	</main>
	<footer class="py-4 text-center text-sm text-gray-500 border-t border-gray-800">
		MyNovelList - Track any novel, anywhere
	</footer>
</div>

<Toast />
