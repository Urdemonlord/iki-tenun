<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	let { data } = $props();
	let { order } = data;
</script>

<svelte:head>
	<title>Pesanan #{order.id.slice(0,8)} - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12">
	<div class="text-center mb-10">
		<div class="text-4xl mb-4">✓</div>
		<h1 class="font-display text-3xl font-bold">Pesanan Dibuat!</h1>
		<p class="text-stone mt-2">Terima kasih, pesanan Anda sedang diproses.</p>
	</div>

	<div class="border border-sand/50 rounded-lg p-6 space-y-4 mb-8">
		<div class="flex justify-between">
			<span class="text-sm text-stone">No. Pesanan</span>
			<span class="text-sm font-medium">#{order.id.slice(0, 8)}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-sm text-stone">Status</span>
			<span class="text-sm capitalize px-2 py-0.5 bg-sand/30 rounded">{order.status}</span>
		</div>
		<div class="flex justify-between">
			<span class="text-sm text-stone">Pembayaran</span>
			<span class="text-sm capitalize">{order.paymentStatus === 'pending' ? 'Menunggu Pembayaran' : order.paymentStatus}</span>
		</div>
	</div>

	<div class="border border-sand/50 rounded-lg p-6 mb-8">
		<h2 class="font-medium mb-4">Detail Pesanan</h2>
		<div class="space-y-2 text-sm">
			{#each order.items as item}
				<div class="flex justify-between">
					<span>{item.productName} × {item.quantity}</span>
					<span>{formatPrice(item.price * item.quantity)}</span>
				</div>
			{/each}
		</div>
		<div class="border-t border-sand/50 mt-4 pt-4 flex justify-between font-bold">
			<span>Total</span>
			<span>{formatPrice(order.total)}</span>
		</div>
	</div>

	<div class="border border-sand/50 rounded-lg p-6 mb-8 text-sm">
		<h2 class="font-medium mb-3">Alamat Pengiriman</h2>
		<p class="text-stone">{order.shippingName}</p>
		<p class="text-stone">{order.shippingPhone}</p>
		<p class="text-stone">{order.shippingAddress}</p>
		<p class="text-stone">{order.shippingCity}, {order.shippingProvince} {order.shippingZip}</p>
	</div>

	<div class="border border-sand/50 rounded-lg p-6 mb-8 text-sm">
		<h2 class="font-medium mb-3">Simulasi Pembayaran</h2>
		<p class="text-stone mb-2">Transfer ke:</p>
		<p class="font-medium">Bank Simulasi</p>
		<p class="text-stone">No. Rekening: 1234-5678-9012</p>
		<p class="text-stone">a.n. IKI TENUN</p>
		<p class="text-sm text-stone mt-3">Silakan transfer {formatPrice(order.total)} ke rekening di atas. Kami akan memverifikasi pembayaran secara manual.</p>
	</div>

	<div class="text-center">
		<a href="/account/orders" class="text-terracotta hover:underline text-sm">Lihat Pesanan Saya</a>
	</div>
</div>
