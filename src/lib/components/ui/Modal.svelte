<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	export let open = false;
	export let title = '';
	
	const dispatch = createEventDispatcher();
	
	function close() {
		open = false;
		dispatch('close');
	}
	
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
	<div class="fixed inset-0 z-50 overflow-y-auto">
		<div class="flex min-h-full items-center justify-center p-4">
			<!-- Backdrop -->
			<div 
				class="fixed inset-0 bg-black/70 transition-opacity" 
				on:click={close}
				on:keypress={close}
				role="button"
				tabindex="-1"
			></div>
			
			<!-- Modal -->
			<div class="relative bg-gray-800 rounded-xl border border-gray-700 shadow-xl w-full max-w-lg p-6">
				{#if title}
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-xl font-semibold text-gray-100">{title}</h2>
						<button 
							on:click={close}
							class="text-gray-400 hover:text-gray-200 transition-colors"
						>
							<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				{/if}
				<slot />
			</div>
		</div>
	</div>
{/if}
