<script lang="ts">
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import Pagination from '$lib/components/Pagination.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	let { data } = $props();

	let params = $derived(() => {
		const p: Record<string, string> = {};
		if (data.activeCategory) p.category = data.activeCategory;
		if (data.query) p.q = data.query;
		if (data.sort && data.sort !== 'newest') p.sort = data.sort;
		return p;
	});
</script>

<svelte:head>
	<title>Koleksi Tenun - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-8 md:py-12">
	<h1 class="font-display text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
		Koleksi Tenun
	</h1>

	<!-- Search bar -->
	<form method="GET" action="/products" class="max-w-md mx-auto mb-6 relative">
		<input type="text" name="q" placeholder="Cari produk..."
			value={data.query || ''}
			class="w-full pl-4 pr-10 py-2.5 text-sm border border-sand rounded-lg bg-white focus:outline-none focus:border-charcoal transition"
		/>
		<button type="submit" class="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal">
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
		</button>
	</form>

	<!-- Sort + Category row -->
	<div class="flex flex-wrap items-center justify-between gap-3 mb-6">
		<div class="flex flex-wrap gap-2">
			<a href={data.activeCategory ? `/products?category=${data.activeCategory}` : '/products'}
				class="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition
					{!data.activeCategory && !data.query ? 'bg-charcoal text-white' : 'bg-sand/30 text-stone hover:bg-sand/50'}">
				Semua
			</a>
			{#each data.categories as cat}
				<a href="/products?category={cat.slug}{data.query ? `&q=${data.query}` : ''}"
					class="px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm transition whitespace-nowrap
						{data.activeCategory === cat.slug ? 'bg-charcoal text-white' : 'bg-sand/30 text-stone hover:bg-sand/50'}">
					{cat.name}
				</a>
			{/each}
		</div>

		<select name="sort" onchange={(e) => {
			const v = e.currentTarget.value;
			const s = new URLSearchParams(location.search);
			v === 'newest' ? s.delete('sort') : s.set('sort', v);
			s.delete('page');
			window.location.search = s.toString();
		}}
			class="text-xs md:text-sm border border-sand rounded-lg px-3 py-1.5 bg-white text-stone focus:outline-none">
			<option value="newest" selected={data.sort === 'newest' || !data.sort}>Terbaru</option>
			<option value="oldest" selected={data.sort === 'oldest'}>Terlama</option>
			<option value="price_asc" selected={data.sort === 'price_asc'}>Termurah</option>
			<option value="price_desc" selected={data.sort === 'price_desc'}>Termahal</option>
		</select>
	</div>

	<!-- Results count -->
	<p class="text-xs text-stone/60 mb-4">{data.total} produk ditemukan</p>

	{#if data.products.length === 0}
		<p class="text-center text-stone py-12">Produk tidak ditemukan.</p>
	{/if}

	<!-- Products grid with stagger -->
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
		{#each data.products as product, i (product.id)}
			<ScrollReveal>
				<ProductCard {product} priority={i < 4} />
			</ScrollReveal>
		{/each}
	</div>

	<Pagination page={data.page} totalPages={data.totalPages} params={params()} />
</div>
