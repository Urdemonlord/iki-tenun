<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import BackToTop from '$lib/components/BackToTop.svelte';
	let { children, data } = $props();
</script>

<div class="min-h-screen flex flex-col bg-cream text-charcoal">
	<Header user={data.user} />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>

<BackToTop />

<!-- Page transition fade -->
<svelte:head>
	<style>
		::view-transition-old(root),
		::view-transition-new(root) {
			animation-duration: 0.3s;
		}
	</style>
</svelte:head>
