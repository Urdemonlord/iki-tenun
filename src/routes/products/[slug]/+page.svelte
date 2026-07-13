<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { enhance, applyAction } from '$app/forms';
	import WhatsAppButton from '$lib/components/WhatsAppButton.svelte';
	import ProductCard from '$lib/components/products/ProductCard.svelte';
	import ScrollReveal from '$lib/components/ScrollReveal.svelte';
	let { data } = $props();

	let selectedImg = $state(0);
	let quantity = $state(1);
	let adding = $state(false);
	let added = $state(false);
	let reviewRating = $state(5);
	let submittingReview = $state(false);
	let activeTab = $state<'desc' | 'review'>('desc');
	let reviewSort = $state('newest');
	let selectedSize = $state('');
	let wishlistOn = $state(false);
	let voucherCode = $state('');
	let voucherApplied = $state(false);
	let viewers = $state(Math.floor(Math.random() * 30) + 5);
	let imgZoom = $state(false);

	let stars = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

	let sortedReviews = $derived((() => {
		const r = [...(data.product.reviews || [])];
		switch (reviewSort) {
			case 'oldest': r.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()); break;
			case 'highest': r.sort((a,b) => b.rating - a.rating); break;
			case 'lowest': r.sort((a,b) => a.rating - b.rating); break;
			default: r.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		}
		return r;
	})());

	// Simulated viewer countdown
	$effect(() => {
		const id = setInterval(() => {
			viewers = Math.max(1, viewers + Math.floor(Math.random() * 3) - 1);
		}, 8000);
		return () => clearInterval(id);
	});
</script>

<svelte:head>
	<title>{data.product.name} - IKI TENUN</title>
</svelte:head>

<!-- Breadcrumb -->
<ScrollReveal>
<div class="mx-auto max-w-7xl px-4 py-4">
	<nav class="text-xs text-stone flex items-center gap-1.5">
		<a href="/" class="hover:text-charcoal transition">Beranda</a><span>/</span>
		<a href="/products" class="hover:text-charcoal transition">Koleksi</a><span>/</span>
		{#if data.product.category}
			<a href="/products?category={data.product.category.slug}" class="hover:text-charcoal transition">{data.product.category.name}</a><span>/</span>
		{/if}
		<span class="text-charcoal">{data.product.name}</span>
	</nav>
</div>
</ScrollReveal>

<div class="mx-auto max-w-7xl px-4 pb-16">
	<div class="grid md:grid-cols-2 gap-6 md:gap-12">
		<!-- Images -->
		<ScrollReveal>
		<div>
			{#if data.product.images[selectedImg]}
				<div class="aspect-[4/5] bg-ivory rounded-lg overflow-hidden mb-4 relative flex items-center justify-center"
					onmouseenter={() => imgZoom = true} onmouseleave={() => imgZoom = false}>
					<img src={data.product.images[selectedImg].url}
						alt={data.product.images[selectedImg].alt || data.product.name}
						loading="eager"
						class="w-full h-full object-contain p-0 transition-transform duration-700 {imgZoom ? 'scale-[1.15] cursor-zoom-out' : 'cursor-zoom-in'}" />
					{#if data.product.stock <= 5 && data.product.stock > 0}
						<div class="absolute bottom-3 left-3 bg-terracotta text-white text-[10px] font-medium px-2 py-1 rounded">
							⚡ Hanya {data.product.stock} lagi!
						</div>
					{/if}
				</div>
			{/if}
			{#if data.product.images.length > 1}
				<div class="flex gap-2 overflow-x-auto pb-2 snap-x">
					{#each data.product.images as img, i}
						<button class="w-14 h-18 md:w-16 md:h-20 rounded overflow-hidden border-2 flex-shrink-0 snap-start transition
							{selectedImg === i ? 'border-charcoal' : 'border-transparent hover:border-sand'}"
							onclick={() => { selectedImg = i; }}>
							<img src={img.url} alt={img.alt || ''} class="w-full h-full object-cover" loading="lazy" />
						</button>
					{/each}
				</div>
			{/if}
		</div>
		</ScrollReveal>

		<!-- Info -->
		<ScrollReveal>
		<div class="md:pt-4">
			{#if data.product.category}
				<p class="text-xs text-stone mb-2 uppercase tracking-wider">{data.product.category.name}</p>
			{/if}
			<h1 class="font-display text-2xl md:text-3xl font-bold mb-2">{data.product.name}</h1>

			<!-- Rating + viewers -->
			<div class="flex items-center justify-between mb-3 text-sm">
				<div class="flex items-center gap-1.5">
					{#if data.avgRating !== null}
						<span class="text-amber-500">{stars(Math.round(data.avgRating))}</span>
						<span class="text-stone">{data.avgRating.toFixed(1)} ({data.product.reviews.length} ulasan)</span>
					{:else}
						<span class="text-stone/40">Belum ada ulasan</span>
					{/if}
				</div>
				<span class="text-[11px] text-stone/50">{viewers} orang melihat</span>
			</div>

			<!-- Price -->
			<div class="flex items-center gap-3 mb-4">
				<p class="text-xl md:text-2xl font-bold text-terracotta">{formatPrice(data.product.price)}</p>
				{#if data.product.compareAtPrice}
					<p class="text-sm text-stone line-through">{formatPrice(data.product.compareAtPrice)}</p>
					<span class="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
						-{Math.round((1 - data.product.price / data.product.compareAtPrice) * 100)}%
					</span>
				{/if}
			</div>

			<!-- Voucher code -->
			<div class="mb-4 p-3 bg-ivory rounded-lg border border-dashed border-terracotta/30">
				<p class="text-[11px] text-stone mb-2">Gunakan kode voucher:</p>
				<div class="flex gap-2">
					<input type="text" bind:value={voucherCode} placeholder="Masukkan kode"
						class="flex-1 text-xs px-3 py-1.5 border border-sand rounded bg-white focus:outline-none focus:border-charcoal" />
					<button onclick={() => { if (voucherCode) voucherApplied = true; }}
						class="text-xs bg-terracotta text-white px-3 py-1.5 rounded hover:bg-terracotta-light transition">
						Pakai
					</button>
				</div>
				{#if voucherApplied}
					<p class="text-[11px] text-green-600 mt-1">✓ Voucher "{voucherCode}" berhasil diterapkan!</p>
				{/if}
			</div>

			<!-- Stock -->
			<div class="flex items-center gap-2 mb-4 text-sm">
				<span class={data.product.stock > 0 ? 'text-green-600' : 'text-terracotta'}>
					{data.product.stock > 0 ? `✓ Stok: ${data.product.stock} tersedia` : '✕ Habis'}
				</span>
			</div>

			<!-- Size selector -->
			{#if data.product.variants.length > 0}
				<div class="mb-4">
					<p class="text-sm font-medium mb-2">Ukuran:</p>
					<div class="flex flex-wrap gap-2">
						{#each data.product.variants as variant}
							<button onclick={() => { selectedSize = variant.name; }}
								class="px-3 py-1.5 border rounded text-sm transition
									{selectedSize === variant.name ? 'border-charcoal bg-charcoal text-white' : 'border-sand hover:border-charcoal'}">
								{variant.name}
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Quantity + Add to cart + Wishlist -->
			<div class="flex items-center gap-3 mb-4">
				<div class="flex items-center border border-sand rounded-lg">
					<button class="px-3 py-2.5 text-lg hover:bg-ivory transition rounded-l-lg" onclick={() => quantity = Math.max(1, quantity - 1)}>−</button>
					<span class="px-4 py-2.5 text-sm font-medium min-w-[2.5rem] text-center">{quantity}</span>
					<button class="px-3 py-2.5 text-lg hover:bg-ivory transition rounded-r-lg" onclick={() => quantity++}>+</button>
				</div>
				<button onclick={() => wishlistOn = !wishlistOn}
					class="w-10 h-10 flex items-center justify-center border border-sand rounded-lg transition hover:border-terracotta {wishlistOn ? 'bg-red-50 border-terracotta' : ''}"
					aria-label="Wishlist">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
						fill="{wishlistOn ? '#c2410c' : 'none'}" stroke="{wishlistOn ? '#c2410c' : 'currentColor'}" stroke-width="1.5"
						class="transition-all {wishlistOn ? 'scale-110' : ''}">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
					</svg>
				</button>
			</div>

			<form method="POST" action="/cart?/add" use:enhance={() => {
				adding = true;
				return async ({ result }) => {
					adding = false;
					if (result.type === 'success') { added = true; setTimeout(() => added = false, 2000); }
					await applyAction(result);
				};
			}}>
				<input type="hidden" name="productId" value={data.product.id} />
				<input type="hidden" name="quantity" value={quantity} />
				<button type="submit" disabled={adding || data.product.stock === 0}
					class="w-full py-3.5 rounded-lg font-medium transition disabled:opacity-50 text-sm md:text-base
					{added ? 'bg-green-600 text-white' : 'bg-charcoal text-white hover:bg-stone hover:scale-[1.01] active:scale-[0.99]'}">
					{adding ? 'Menambahkan...' : added ? '✓ Ditambahkan' : 'Tambah ke Keranjang'}
				</button>
			</form>

			<WhatsAppButton productName={data.product.name} price={data.product.price} />

			<!-- Delivery estimate -->
			<div class="mt-4 p-3 bg-ivory rounded-lg">
				<div class="flex items-center gap-2 text-xs text-stone mb-1.5">
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
					Estimasi Pengiriman: <strong>3-7 hari kerja</strong>
				</div>
				<p class="text-[11px] text-stone/60">Pengiriman dari Jepara, Jawa Tengah</p>
			</div>

			<!-- Payment methods -->
			<div class="mt-4">
				<p class="text-[11px] text-stone/60 mb-2">Metode Pembayaran:</p>
				<div class="flex flex-wrap gap-2">
					{#each ['BCA', 'Mandiri', 'BNI', 'GoPay', 'OVO', 'COD'] as pm}
						<span class="text-[10px] bg-ivory text-stone/70 px-2 py-1 rounded border border-sand/50">{pm}</span>
					{/each}
				</div>
			</div>

			<!-- Exchange policy -->
			<div class="mt-4 text-[11px] text-stone/50 leading-relaxed">
				<p>📦 Pengembalian maks. 7 hari setelah barang diterima, kondisi baru dengan label utuh.</p>
				<p class="mt-1">🔄 Gratis layanan penyesuaian ukuran. Hubungi kami untuk bantuan.</p>
			</div>

			<!-- Tags -->
			{#if data.product.tags}
				<div class="mt-4 flex flex-wrap gap-2">
					{#each data.product.tags.split(',').map(t => t.trim()) as tag}
						<a href="/products?q={tag}" class="text-[11px] bg-ivory text-stone px-2.5 py-1 rounded-full hover:bg-sand/50 transition">#{tag}</a>
					{/each}
				</div>
			{/if}
		</div>
		</ScrollReveal>
	</div>

	<!-- Tabs: Description / Reviews -->
	<ScrollReveal>
	<section class="mt-16 max-w-3xl">
		<div class="flex border-b border-sand/50 mb-6">
			<button onclick={() => activeTab = 'desc'}
				class="px-6 py-3 text-sm font-medium transition border-b-2 {activeTab === 'desc' ? 'border-charcoal text-charcoal' : 'border-transparent text-stone hover:text-charcoal'}">
				Deskripsi
			</button>
			<button onclick={() => activeTab = 'review'}
				class="px-6 py-3 text-sm font-medium transition border-b-2 {activeTab === 'review' ? 'border-charcoal text-charcoal' : 'border-transparent text-stone hover:text-charcoal'}">
				Ulasan ({data.product.reviews.length})
			</button>
		</div>

		{#if activeTab === 'desc'}
			<div class="prose prose-sm text-stone leading-relaxed">
				<p>{data.product.description || 'Belum ada deskripsi.'}</p>
			</div>
		{:else}
			<!-- Review sort -->
			<div class="flex items-center gap-2 mb-4">
				<span class="text-xs text-stone/60">Urutkan:</span>
				<select bind:value={reviewSort} class="text-xs border border-sand rounded px-2 py-1 bg-white focus:outline-none">
					<option value="newest">Terbaru</option>
					<option value="oldest">Terlama</option>
					<option value="highest">Rating Tertinggi</option>
					<option value="lowest">Rating Terendah</option>
				</select>
			</div>

			{#if data.avgRating !== null}
				<div class="flex items-center gap-3 mb-6 p-4 bg-ivory rounded-lg">
					<span class="text-3xl font-bold">{data.avgRating.toFixed(1)}</span>
					<div>
						<span class="text-amber-500 text-lg">{stars(Math.round(data.avgRating))}</span>
						<p class="text-xs text-stone/60">{data.product.reviews.length} ulasan</p>
					</div>
				</div>
			{/if}

			{#each sortedReviews as review}
				<div class="border-b border-sand/30 py-4 last:border-0">
					<div class="flex items-center justify-between mb-1">
						<div class="flex items-center gap-2">
							<span class="text-amber-500 text-sm">{stars(review.rating)}</span>
							<span class="text-sm font-medium">{review.user.name || 'Anonymous'}</span>
						</div>
						<span class="text-[11px] text-stone/40">{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
					</div>
					{#if review.comment}
						<p class="text-sm text-stone mt-1">{review.comment}</p>
					{/if}
				</div>
			{:else}
				<p class="text-sm text-stone/50 py-4">Belum ada ulasan. Jadilah yang pertama!</p>
			{/each}

			<!-- Review form -->
			{#if data.user && !data.product.reviews.some(r => r.userId === data.user?.id)}
				<form method="POST" action="?/review" use:enhance={() => { submittingReview = true; return async () => submittingReview = false; }}
					class="mt-6 p-4 bg-ivory rounded-lg">
					<h3 class="text-sm font-medium mb-3">Tulis Ulasan</h3>
					<div class="flex items-center gap-1 mb-3">
						{#each [1,2,3,4,5] as n}
							<button type="button" onclick={() => reviewRating = n}
								class="text-2xl transition hover:scale-110 {n <= reviewRating ? 'text-amber-500' : 'text-sand'}">
								{n <= reviewRating ? '★' : '☆'}
							</button>
						{/each}
					</div>
					<input type="hidden" name="productId" value={data.product.id} />
					<input type="hidden" name="rating" value={reviewRating} />
					<textarea name="comment" placeholder="Bagaimana pendapatmu tentang produk ini?" rows="3"
						class="w-full text-sm border border-sand rounded-lg p-2.5 bg-white focus:outline-none focus:border-charcoal transition mb-3"></textarea>
					<button type="submit" disabled={submittingReview}
						class="bg-charcoal text-white text-sm px-5 py-2 rounded-lg hover:bg-stone transition disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]">
						{submittingReview ? 'Mengirim...' : 'Kirim Ulasan'}
					</button>
				</form>
			{:else if !data.user}
				<a href="/login" class="inline-block mt-4 text-sm text-terracotta hover:underline">Login untuk menulis ulasan</a>
			{/if}
		{/if}
	</section>
	</ScrollReveal>

	<!-- Related Products -->
	{#if data.related.length > 0}
	<ScrollReveal>
	<section class="mt-16">
		<h2 class="font-display text-xl font-bold mb-6">Produk Terkait</h2>
		<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
			{#each data.related as product (product.id)}
				<ProductCard {product} />
			{/each}
		</div>
	</section>
	</ScrollReveal>
	{/if}
</div>
