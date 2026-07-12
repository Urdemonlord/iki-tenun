<script lang="ts">
	let { children }: { children: import('svelte').Snippet } = $props();
	let el = $state<HTMLElement>();
	let visible = $state(false);

	$effect(() => {
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) { visible = true; observer.disconnect(); } },
			{ threshold: 0.05, rootMargin: '0px 0px -40px 0px' }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div bind:this={el} class="scroll-reveal {visible ? 'revealed' : ''}">
	{@render children()}
</div>

<style>
	.scroll-reveal {
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.6s ease-out, transform 0.6s ease-out;
	}
	.scroll-reveal.revealed {
		opacity: 1;
		transform: translateY(0);
	}
</style>
