<script lang="ts" context="module">
	import { writable } from 'svelte/store';
	
	interface ToastMessage {
		id: number;
		message: string;
		type: 'success' | 'error' | 'info';
	}
	
	let nextId = 0;
	export const toasts = writable<ToastMessage[]>([]);
	
	export function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
		const id = nextId++;
		toasts.update((t) => [...t, { id, message, type }]);
		setTimeout(() => {
			toasts.update((t) => t.filter((toast) => toast.id !== id));
		}, 3000);
	}
</script>

<script lang="ts">
	const typeStyles = {
		success: 'bg-green-600 border-green-500',
		error: 'bg-red-600 border-red-500',
		info: 'bg-primary-600 border-primary-500'
	};
</script>

<div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
	{#each $toasts as t (t.id)}
		<div 
			class="px-4 py-3 rounded-lg border text-white shadow-lg animate-slide-in {typeStyles[t.type]}"
		>
			{t.message}
		</div>
	{/each}
</div>

<style>
	@keyframes slide-in {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}
	.animate-slide-in {
		animation: slide-in 0.2s ease-out;
	}
</style>
