<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { enhance } from '$app/forms';
	let { data } = $props();

	let total = $derived(data.items.reduce((sum, it) => sum + it.product.price * it.quantity, 0));
</script>

<svelte:head>
	<title>Keranjang - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-8 md:py-12">
	<h1 class="font-display text-2xl md:text-3xl font-bold mb-6 md:mb-8">Keranjang</h1>

	{#if data.items.length === 0}
		<div class="text-center py-16">
			<p class="text-stone mb-6">Keranjang masih kosong</p>
			<a href="/products" class="bg-charcoal text-white px-6 py-3 rounded-lg inline-block hover:bg-stone transition">Belanja Sekarang</a>
		</div>
	{:else}
		<div class="space-y-3 md:space-y-4 mb-8">
			{#each data.items as item}
				<div class="flex gap-3 md:gap-4 items-center p-3 md:p-4 border border-sand/50 rounded-lg">
					{#if item.product.images[0]}
						<a href="/products/{item.product.slug}">
							<img src={item.product.images[0].url} alt={item.product.name} class="w-16 h-20 md:w-20 md:h-24 object-cover rounded flex-shrink-0" />
						</a>
					{/if}
					<div class="flex-1 min-w-0">
						<a href="/products/{item.product.slug}" class="font-medium text-sm md:text-base hover:text-terracotta transition line-clamp-1">{item.product.name}</a>
						<p class="text-sm text-stone">{formatPrice(item.product.price)}</p>
					</div>
					<div class="flex items-center gap-2 md:gap-3 flex-shrink-0">
						<form method="POST" action="?/update" use:enhance>
							<input type="hidden" name="id" value={item.id} />
							<div class="flex items-center border border-sand rounded-lg">
								<button type="submit" name="quantity" value={item.quantity - 1} class="px-2 py-1 text-sm hover:bg-ivory transition rounded-l-lg">−</button>
								<span class="px-2.5 text-sm font-medium">{item.quantity}</span>
								<button type="submit" name="quantity" value={item.quantity + 1} class="px-2 py-1 text-sm hover:bg-ivory transition rounded-r-lg">+</button>
							</div>
						</form>
						<p class="font-medium text-sm w-16 text-right hidden md:block">{formatPrice(item.product.price * item.quantity)}</p>
						<form method="POST" action="?/remove" use:enhance>
							<input type="hidden" name="id" value={item.id} />
							<button class="text-stone hover:text-red-500 text-xs md:text-sm p-1" aria-label="Hapus">✕</button>
						</form>
					</div>
				</div>
			{/each}
		</div>

		<!-- Mobile total -->
		<div class="md:hidden border-t border-sand/50 pt-4 mb-4">
			<div class="flex justify-between text-base font-bold">
				<span>Total</span>
				<span>{formatPrice(total)}</span>
			</div>
		</div>

		<div class="border-t border-sand/50 pt-6 hidden md:block">
			<div class="flex justify-between text-lg font-bold mb-6">
				<span>Total</span>
				<span>{formatPrice(total)}</span>
			</div>
		</div>
		<a href="/checkout" class="block w-full bg-charcoal text-white py-3 rounded-lg text-center font-medium hover:bg-stone transition">
			Lanjut ke Pembayaran
		</a>
	{/if}
</div>
