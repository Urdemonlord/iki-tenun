<script lang="ts">
	import type { Product } from '$lib/utils/types';
	import { formatPrice } from '$lib/utils/format';
	let { product, priority = false }: { product: Product; priority?: boolean } = $props();
	let imgLoaded = $state(false);
	let imgError = $state(false);
	let hovered = $state(false);
	const showSecond = $derived(product.images?.length > 1);
</script>

<a href="/products/{product.slug}" class="group block relative"
	onmouseenter={() => hovered = true}
	onmouseleave={() => hovered = false}>
	<div class="aspect-[4/5] bg-ivory rounded-xl overflow-hidden mb-3 relative shadow-sm
		group-hover:shadow-lg transition-shadow duration-500">
		{#if product.images?.[0] && !imgError}
			<!-- Primary image -->
			<img src={product.images[0].url} alt={product.images[0].alt || product.name}
				loading={priority ? 'eager' : 'lazy'} fetchpriority={priority ? 'high' : 'auto'}
				class="w-full h-full object-cover object-top transition-all duration-700 ease-out {hovered && showSecond ? 'opacity-0 scale-105' : hovered ? 'scale-105' : ''}"
				class:opacity-0={!imgLoaded}
				onload={() => imgLoaded = true}
				onerror={() => { imgError = true; imgLoaded = true; }} />

			<!-- Second image (hover swap) -->
			{#if showSecond}
				<img src={product.images[1].url} alt={product.images[1].alt || product.name}
					loading="lazy"
					class="absolute inset-0 w-full h-full object-cover object-top transition-all duration-700 ease-out
						{hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}" />
			{/if}
		{:else}
			<div class="w-full h-full flex items-center justify-center bg-sand/20 text-sand text-xs font-medium">No Image</div>
		{/if}

		<!-- Badges -->
		<div class="absolute top-3 left-3 flex flex-col gap-1.5">
			{#if product.isNewArrival}
				<span class="bg-terracotta text-white text-[10px] font-medium px-2.5 py-1 rounded-full tracking-wide">Baru</span>
			{/if}
			{#if product.compareAtPrice && product.compareAtPrice > product.price}
				<span class="bg-green-600 text-white text-[10px] font-medium px-2.5 py-1 rounded-full tracking-wide">
					-{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
				</span>
			{/if}
		</div>

		<!-- Stock badge -->
		{#if product.stock === 0}
			<div class="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center">
				<span class="bg-white/90 text-charcoal text-xs font-medium px-4 py-1.5 rounded-full">Habis</span>
			</div>
		{:else if product.stock <= 5}
			<span class="absolute top-3 right-3 bg-amber-500 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
				Sisa {product.stock}
			</span>
		{/if}
	</div>

	<h3 class="text-sm font-medium font-display group-hover:text-terracotta transition-colors duration-300">{product.name}</h3>
	<div class="flex items-center gap-2 mt-1.5">
		<p class="text-sm font-semibold text-charcoal">{formatPrice(product.price)}</p>
		{#if product.compareAtPrice && product.compareAtPrice > product.price}
			<p class="text-[11px] text-stone line-through">{formatPrice(product.compareAtPrice)}</p>
		{/if}
	</div>
	{#if product.category}
		<p class="text-[11px] text-stone/50 mt-0.5">{product.category.name}</p>
	{/if}
</a>
