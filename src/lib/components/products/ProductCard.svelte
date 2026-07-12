<script lang="ts">
	import type { Product } from '$lib/utils/types';
	import { formatPrice } from '$lib/utils/format';
	let { product, priority = false }: { product: Product; priority?: boolean } = $props();
	let imgLoaded = $state(false);
	let imgError = $state(false);
	let wishlistOn = $state(false);
</script>

<div class="group block relative">
	<a href="/products/{product.slug}">
		<div class="aspect-[4/5] bg-ivory rounded-lg overflow-hidden mb-3 relative">
			{#if product.images?.[0] && !imgError}
				<img src={product.images[0].url} alt={product.images[0].alt || product.name}
					loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'auto'}
					class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
					class:opacity-0={!imgLoaded} onload={() => imgLoaded = true}
					onerror={() => { imgError = true; imgLoaded = true; }} />
			{:else}
				<div class="w-full h-full flex items-center justify-center bg-sand/20 text-sand text-xs">No Image</div>
			{/if}

			<div class="absolute top-2 left-2 flex flex-col gap-1">
				{#if product.isNewArrival}
					<span class="bg-terracotta text-white text-[10px] font-medium px-2 py-0.5 rounded">Baru</span>
				{/if}
				{#if product.compareAtPrice && product.compareAtPrice > product.price}
					<span class="bg-green-600 text-white text-[10px] font-medium px-2 py-0.5 rounded">
						-{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
					</span>
				{/if}
			</div>

			{#if product.stock === 0}
				<div class="absolute inset-0 bg-black/20 flex items-center justify-center">
					<span class="bg-white text-charcoal text-xs font-medium px-3 py-1 rounded-full">Habis</span>
				</div>
			{:else if product.stock <= 5}
				<span class="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
					Sisa {product.stock}
				</span>
			{/if}
		</div>
	</a>

	<!-- Wishlist button floating -->
	<button onclick={() => wishlistOn = !wishlistOn}
		class="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center
			hover:bg-white transition shadow-sm {wishlistOn ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}"
		aria-label="Wishlist">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
			fill={wishlistOn ? '#c2410c' : 'none'} stroke={wishlistOn ? '#c2410c' : '#555'} stroke-width="1.5"
			class="transition-all {wishlistOn ? 'scale-110' : ''}">
			<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
		</svg>
	</button>

	<a href="/products/{product.slug}">
		<h3 class="text-sm font-medium group-hover:text-terracotta transition-colors duration-200">{product.name}</h3>
		<div class="flex items-center gap-2 mt-1">
			<p class="text-sm font-semibold text-charcoal">{formatPrice(product.price)}</p>
			{#if product.compareAtPrice && product.compareAtPrice > product.price}
				<p class="text-[11px] text-stone line-through">{formatPrice(product.compareAtPrice)}</p>
			{/if}
		</div>
		{#if product.category}
			<p class="text-[11px] text-stone/60 mt-0.5">{product.category.name}</p>
		{/if}
	</a>
</div>
