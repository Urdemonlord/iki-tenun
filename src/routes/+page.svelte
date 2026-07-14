<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	let { data } = $props();

	let heroSlide = $state(0);
	const heroItems = $derived(data.featured.filter(p => p.images?.length).slice(0, 5));

	// Auto-slide
	$effect(() => {
		if (heroItems.length <= 1) return;
		const id = setInterval(() => { heroSlide = (heroSlide + 1) % heroItems.length; }, 5000);
		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>IKI TENUN - Tenun Ikat Rajawali Jepara</title>
</svelte:head>

<!-- Hero Carousel -->
<section class="relative min-h-[60vh] md:h-[80vh] overflow-hidden">
	<!-- Slides background -->
	{#each heroItems as item, i}
		<div class="absolute inset-0 transition-opacity duration-1000 {i === heroSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}">
			<img src={item.images[0]?.url} alt={item.name} class="w-full h-full object-cover object-top" loading={i === 0 ? 'eager' : 'lazy'} />
			<div class="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
		</div>
	{/each}

	<div class="mx-auto max-w-7xl px-4 py-12 md:py-0 flex flex-col md:flex-row items-center h-full relative z-10 min-h-[60vh] md:min-h-[80vh]">
		<div class="flex-1 text-center md:text-left">
			<p class="text-xs md:text-sm font-medium tracking-widest text-white/70 uppercase mb-4 animate-[fadeInUp_0.6s_ease-out]">
				Tenun Ikat Rajawali
			</p>
			<h1 class="font-display text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 text-white
				animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
				Warisan Budaya,<br/>Sentuhan Modern
			</h1>
			<p class="text-base md:text-lg text-white/80 mb-6 md:mb-8 max-w-md mx-auto md:mx-0
				animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
				Tenun ikat asli Jepara, dirajut dengan penuh cinta. Koleksi dress, blazer, dan set tenun premium.
			</p>
			<a href="/products" class="inline-block bg-white text-charcoal px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-cream transition hover:scale-105 active:scale-95
				animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
				Lihat Koleksi
			</a>
		</div>

		<!-- Slide indicator dots -->
		{#if heroItems.length > 1}
			<div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
				{#each heroItems as _, i}
					<button onclick={() => heroSlide = i}
						class="w-2 h-2 rounded-full transition-all duration-300 {i === heroSlide ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/70'}"
						aria-label="Slide {i + 1}" />
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Marquee ticker -->
<div class="bg-charcoal text-white py-3 overflow-hidden">
	<div class="flex animate-marquee whitespace-nowrap gap-8 text-xs md:text-sm">
		{#each Array(3) as _}
			<span>✦ FREE SHIPPING MIN. RP 500K</span>
			<span>✦ TENUN IKAT RAJAWALI</span>
			<span>✦ HANDMADE IN JEPARA</span>
			<span>✦ PREMIUM QUALITY</span>
			<span>✦ 100% ASLI INDONESIA</span>
		{/each}
	</div>
</div>

<!-- Features bar -->
<ScrollReveal>
<div class="bg-ivory py-8 border-b border-sand/30">
	<div class="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
		<div class="flex items-center gap-3 text-center md:text-left justify-center md:justify-start">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-terracotta flex-shrink-0"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
			<div><p class="text-xs font-medium">Free Shipping</p><p class="text-[10px] text-stone/60">Min. Rp 500.000</p></div>
		</div>
		<div class="flex items-center gap-3 text-center md:text-left justify-center md:justify-start">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-terracotta flex-shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
			<div><p class="text-xs font-medium">100% Handmade</p><p class="text-[10px] text-stone/60">Handmade in Jepara</p></div>
		</div>
		<div class="flex items-center gap-3 text-center md:text-left justify-center md:justify-start">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-terracotta flex-shrink-0"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
			<div><p class="text-xs font-medium">Premium Quality</p><p class="text-[10px] text-stone/60">Bahan pilihan terbaik</p></div>
		</div>
		<div class="flex items-center gap-3 text-center md:text-left justify-center md:justify-start">
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="text-terracotta flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
			<div><p class="text-xs font-medium">Dari Jepara</p><p class="text-[10px] text-stone/60">Pengrajin lokal</p></div>
		</div>
	</div>
</div>
</ScrollReveal>

<!-- Featured Products -->
<ScrollReveal>
<section class="mx-auto max-w-7xl px-4 py-12 md:py-16">
	<div class="text-center mb-8 md:mb-12">
		<p class="text-xs md:text-sm font-medium tracking-widest text-stone uppercase mb-2">Koleksi Pilihan</p>
		<h2 class="font-display text-2xl md:text-3xl font-bold">Best Sellers</h2>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
		{#each data.featured as product, i}
			<div style="transition-delay: {i * 0.05}s">
				<ProductCard {product} priority={i < 4} />
			</div>
		{/each}
	</div>
	<div class="text-center mt-8">
		<a href="/products" class="inline-block border border-charcoal text-charcoal px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-charcoal hover:text-white transition hover:scale-105 active:scale-95">
			Lihat Semua Koleksi
		</a>
	</div>
</section>
</ScrollReveal>

<!-- Categories -->
<ScrollReveal>
<section class="bg-ivory py-12 md:py-16">
	<div class="mx-auto max-w-7xl px-4">
		<div class="text-center mb-8 md:mb-12">
			<p class="text-xs md:text-sm font-medium tracking-widest text-stone uppercase mb-2">Jelajahi</p>
			<h2 class="font-display text-2xl md:text-3xl font-bold">Kategori</h2>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
			{#each data.categories as cat}
				<a href="/products?category={cat.slug}" class="group">
					<div class="aspect-square bg-sand/30 rounded-lg flex flex-col items-center justify-center gap-2
						group-hover:bg-sand/50 group-hover:scale-105 transition duration-300">
						<span class="font-display text-base md:text-xl font-bold text-stone group-hover:text-charcoal">{cat.name}</span>
						<span class="text-[10px] text-stone/50 group-hover:text-stone/70 transition">Lihat Koleksi →</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
</ScrollReveal>

<!-- New Arrivals -->
{#if data.newArrivals.length > 0}
<ScrollReveal>
	<section class="mx-auto max-w-7xl px-4 py-12 md:py-16">
		<div class="text-center mb-8 md:mb-12">
			<p class="text-xs md:text-sm font-medium tracking-widest text-stone uppercase mb-2">Baru</p>
			<h2 class="font-display text-2xl md:text-3xl font-bold">New Arrivals</h2>
		</div>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
			{#each data.newArrivals as product}
				<ProductCard {product} />
			{/each}
		</div>
	</section>
</ScrollReveal>
{/if}

<!-- About teaser -->
<ScrollReveal>
<section class="mx-auto max-w-7xl px-4 py-16">
	<div class="bg-charcoal text-white rounded-2xl p-8 md:p-12 text-center overflow-hidden relative group">
		<div class="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition duration-500"
			style="background-image: radial-gradient(circle at 50% 50%, white 1px, transparent 1px); background-size: 30px 30px;"></div>
		<p class="text-sm font-medium tracking-widest text-white/50 uppercase mb-3 relative">Tentang Kami</p>
		<h2 class="font-display text-2xl md:text-3xl font-bold mb-4 relative">Tenun Ikat Asli Jepara</h2>
		<p class="text-white/70 text-sm md:text-base max-w-lg mx-auto mb-6 leading-relaxed relative">
			Setiap kain tenun dibuat oleh pengrajin berpengalaman di Jepara dengan penuh 
			perhatian terhadap detail dan kualitas. Warisan budaya yang dipersembahkan 
			untuk fashion modern.
		</p>
		<a href="/about" class="inline-block border border-white/30 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-white/10 transition hover:scale-105 active:scale-95 relative">
			Pelajari Lebih Lanjut
		</a>
	</div>
</section>
</ScrollReveal>

<style>
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
