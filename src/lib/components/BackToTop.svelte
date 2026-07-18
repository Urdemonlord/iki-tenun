<script lang="ts">
	let show = $state(false);
	let scrollY = $state(0);

	$effect(() => {
		function onScroll() { scrollY = window.scrollY; show = scrollY > 400; }
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

{#if show}
	<button onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
		class="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-charcoal text-white shadow-lg
			flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95
			opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
		aria-label="Kembali ke atas">
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
	</button>
{/if}

<style>
	@keyframes fadeIn {
		from { opacity: 0; transform: translateY(8px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
