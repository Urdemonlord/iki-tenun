<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Checkout - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<h1 class="font-display text-3xl font-bold mb-8">Checkout</h1>

	<form method="POST" use:enhance={() => {
		loading = true;
		return async () => { loading = false; };
	}}>
		<div class="grid md:grid-cols-2 gap-12">
			<!-- Shipping address -->
			<div>
				<h2 class="font-display text-xl font-bold mb-6">Alamat Pengiriman</h2>

				{#if form?.error}
					<div class="bg-red-50 text-red-700 px-4 py-3 rounded mb-4 text-sm">{form.error}</div>
				{/if}

				<div class="space-y-3">
					{#each ['name', 'phone'] as field}
						<div>
							<label class="block text-sm font-medium mb-1">{field === 'name' ? 'Nama Penerima' : 'No. HP'}</label>
							<input type="text" name={field} required
								class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
						</div>
					{/each}
					<div>
						<label class="block text-sm font-medium mb-1">Email (opsional, untuk invoice)</label>
						<input type="email" name="email"
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Alamat</label>
						<textarea name="address" required rows="3"
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta"></textarea>
					</div>
					<div class="grid grid-cols-2 gap-3">
						{#each [['city', 'Kota'], ['province', 'Provinsi'], ['zip', 'Kode Pos']] as [name, label]}
							<div>
								<label class="block text-sm font-medium mb-1">{label}</label>
								<input type="text" {name} required
									class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
							</div>
						{/each}
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Catatan (opsional)</label>
						<textarea name="notes" rows="2"
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta"></textarea>
					</div>
				</div>
			</div>

			<!-- Order summary -->
			<div>
				<h2 class="font-display text-xl font-bold mb-6">Ringkasan Pesanan</h2>
				<div class="space-y-3 mb-6">
					{#each data.items as item}
						<div class="flex justify-between text-sm">
							<span>{item.product.name} × {item.quantity}</span>
							<span>{formatPrice(item.product.price * item.quantity)}</span>
						</div>
					{/each}
				</div>
				<div class="border-t border-sand/50 pt-4 space-y-2 text-sm">
					<div class="flex justify-between"><span>Subtotal</span><span>{formatPrice(data.total)}</span></div>
					<div class="flex justify-between"><span>Ongkir</span><span class="text-green-600">FREE</span></div>
				</div>
				<div class="border-t border-sand/50 pt-4 flex justify-between font-bold text-lg mb-8">
					<span>Total</span>
					<span>{formatPrice(data.total)}</span>
				</div>

				<div class="border border-sand/50 rounded-lg p-4 mb-6">
					<p class="text-sm font-medium mb-2">Metode Pembayaran</p>
					<p class="text-sm text-stone">Midtrans Snap — Virtual Account, QRIS, GoPay, ShopeePay, Kartu Kredit</p>
				</div>

				<button type="submit" disabled={loading}
					class="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-stone transition disabled:opacity-50">
					{loading ? 'Memproses...' : 'Buat Pesanan'}
				</button>
			</div>
		</div>
	</form>
</div>
