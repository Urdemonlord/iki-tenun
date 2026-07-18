<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
	let { data } = $props();

	const heroSlides = $derived(data.featured.filter(p => p.images?.length).slice(0, 5));
	let swiperEl: HTMLElement;

	onMount(() => {
		if (!swiperEl || heroSlides.length < 2) return;
		new Swiper(swiperEl, {
			modules: [Autoplay, Pagination, EffectFade],
			effect: 'fade',
			fadeEffect: { crossFade: true },
			autoplay: { delay: 5000, disableOnInteraction: false },
			pagination: { el: '.swiper-pagination', clickable: true },
			loop: true,
			speed: 800,
		});
	});
</script>

<svelte:head>
	<title>IKI TENUN - Tenun Ikat Rajawali Jepara</title>
</svelte:head>

<!-- Hero Swiper Carousel -->
<section class="relative min-h-[60vh] md:h-[85vh] overflow-hidden">
	<div class="swiper h-full" bind:this={swiperEl}>
		<div class="swiper-wrapper">
			{#each heroSlides as slide}
				<div class="swiper-slide relative">
					<img src={slide.images[0]?.url} alt={slide.name} class="w-full h-full object-cover object-top absolute inset-0" />
					<div class="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
					<div class="relative z-20 h-full flex items-center">
						<div class="mx-auto max-w-7xl px-4 w-full">
							<div class="max-w-lg">
								<p class="text-xs md:text-sm font-medium tracking-[0.2em] text-white/60 uppercase mb-4">Tenun Ikat Rajawali</p>
								<h1 class="font-display text-3xl md:text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-white">
									{slide.name}
								</h1>
								<div class="flex gap-3">
									<a href="/products/{slide.slug}" class="inline-block bg-white text-charcoal px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-cream transition hover:scale-105 active:scale-95">
										Lihat Produk
									</a>
									<a href="/products" class="inline-block border border-white/30 text-white px-6 md:px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition hover:scale-105 active:scale-95">
										Semua Koleksi
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<div class="swiper-pagination !bottom-8"></div>
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

<!-- Categories — full-width banners -->
<ScrollReveal>
<section class="mx-auto max-w-7xl px-4 py-12 md:py-16">
	<div class="text-center mb-8 md:mb-12">
		<p class="text-xs md:text-sm font-medium tracking-[0.2em] text-stone uppercase mb-3">Jelajahi</p>
		<h2 class="font-display text-2xl md:text-4xl font-bold">Kategori</h2>
	</div>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
		{#each data.categories as cat}
			<a href="/products?category={cat.slug}" class="group relative overflow-hidden rounded-xl md:rounded-2xl
				aspect-[16/10] md:aspect-[4/5] bg-sand/20">
				{#if data.categoryImages?.get(cat.id)}
					<img src={data.categoryImages.get(cat.id)} alt={cat.name}
						class="w-full h-full object-cover object-top transition duration-700
							group-hover:scale-105" loading="lazy" />
				{/if}
				<div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent
					group-hover:from-black/80 transition-colors duration-500"></div>
				<div class="absolute bottom-0 left-0 right-0 p-5 md:p-7">
					<h3 class="font-display text-xl md:text-2xl font-bold text-white mb-1">{cat.name}</h3>
					<span class="text-xs md:text-sm text-white/70 group-hover:text-white/90 transition-colors
						inline-flex items-center gap-1">
						Lihat Koleksi
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1.5" class="group-hover:translate-x-1 transition-transform">
							<path d="M5 12h14M12 5l7 7-7 7"/>
						</svg>
					</span>
				</div>
			</a>
		{/each}
	</div>
</section>
</ScrollReveal>

<!-- Featured Products Carousel -->
{#if data.featured.length > 0}
<ScrollReveal>
<section class="mx-auto max-w-7xl px-4 py-12 md:py-16">
	<div class="text-center mb-8 md:mb-12">
		<p class="text-xs md:text-sm font-medium tracking-[0.2em] text-stone uppercase mb-3">Koleksi Pilihan</p>
		<h2 class="font-display text-2xl md:text-4xl font-bold">Best Sellers</h2>
	</div>
	<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
		{#each data.featured.slice(0, 8) as product, i}
			<div style="transition-delay: {i * 0.05}s">
				<ProductCard {product} priority={i < 4} />
			</div>
		{/each}
	</div>
	<div class="text-center mt-8">
		<a href="/products" class="inline-flex items-center gap-2 border border-charcoal text-charcoal px-6 py-3
			rounded-full text-sm font-medium hover:bg-charcoal hover:text-white transition-all duration-300
			hover:scale-105 active:scale-95">
			Lihat Semua Koleksi
			<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
				stroke="currentColor" stroke-width="1.5">
				<path d="M5 12h14M12 5l7 7-7 7"/>
			</svg>
		</a>
	</div>
</section>
</ScrollReveal>
{/if}

<!-- New Arrivals -->
{#if data.newArrivals.length > 0}
<ScrollReveal>
	<section class="mx-auto max-w-7xl px-4 py-12 md:py-16">
		<div class="text-center mb-8 md:mb-12">
			<p class="text-xs md:text-sm font-medium tracking-[0.2em] text-stone uppercase mb-3">Baru</p>
			<h2 class="font-display text-2xl md:text-4xl font-bold">New Arrivals</h2>
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

<!-- Social Proof — Dikenakan oleh -->
<ScrollReveal>
<section class="mx-auto max-w-7xl px-4 py-12 md:py-16">
	<div class="text-center mb-8 md:mb-12">
		<p class="text-xs md:text-sm font-medium tracking-[0.2em] text-stone uppercase mb-3">Social Proof</p>
		<h2 class="font-display text-2xl md:text-4xl font-bold">Dikenakan Oleh</h2>
		<p class="text-stone text-sm mt-2 max-w-md mx-auto">Dipercaya oleh ratusan pelanggan di seluruh Indonesia</p>
	</div>
	<div class="grid grid-cols-3 md:grid-cols-5 gap-3 md:gap-5">
		{#each data.featured.slice(0, 5) as product}
			<div class="text-center group">
				<div class="aspect-square rounded-full overflow-hidden bg-sand/20 mb-3
					ring-2 ring-white shadow-md group-hover:ring-terracotta transition-all duration-300">
					<img src={product.images[0]?.url} alt={product.name}
						class="w-full h-full object-cover object-top" loading="lazy" />
				</div>
				<p class="text-xs font-medium text-charcoal group-hover:text-terracotta transition-colors">
					{product.name}
				</p>
				<p class="text-[10px] text-stone/60">Pemakai Setia</p>
			</div>
		{/each}
	</div>
</section>
</ScrollReveal>

<!-- Blog Mini -->
<ScrollReveal>
<section class="bg-ivory py-12 md:py-16">
	<div class="mx-auto max-w-7xl px-4">
		<div class="text-center mb-8 md:mb-12">
			<p class="text-xs md:text-sm font-medium tracking-[0.2em] text-stone uppercase mb-3">Artikel</p>
			<h2 class="font-display text-2xl md:text-4xl font-bold">Blog & Tips</h2>
		</div>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
			{#each data.blogArticles as article}
				<a href="/blog/{article.slug}" class="group bg-white rounded-xl overflow-hidden shadow-sm
					hover:shadow-md transition-all duration-300 hover:-translate-y-1">
					<div class="h-36 bg-gradient-to-br from-charcoal/10 to-charcoal/5 flex items-center justify-center">
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
							stroke="currentColor" stroke-width="1" class="text-charcoal/20">
							<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
							<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
						</svg>
					</div>
					<div class="p-4">
						<p class="text-[10px] text-stone/50 mb-1">{article.date}</p>
						<h3 class="font-medium text-sm mb-1.5 group-hover:text-terracotta transition-colors line-clamp-2">
							{article.title}
						</h3>
						<p class="text-xs text-stone/60 line-clamp-2">{article.excerpt}</p>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
</ScrollReveal>
