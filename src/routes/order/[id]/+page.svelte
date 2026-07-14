<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { onMount } from 'svelte';
	let { data } = $props();
	let order = $state(data.order);
	let paymentError = data.paymentError;

	// Poll for payment status updates (every 10s for 5 min)
	onMount(() => {
		let pollCount = 0;
		if (order.paymentStatus === 'pending') {
			const interval = setInterval(async () => {
				pollCount++;
				if (pollCount > 30) {
					clearInterval(interval);
					return;
				}
				try {
					const res = await fetch(`/api/order/${order.id}/status`);
					if (res.ok) {
						const d = await res.json();
						if (d.paymentStatus !== 'pending') {
							order.paymentStatus = d.paymentStatus;
							order.status = d.status;
							clearInterval(interval);
						}
					}
				} catch (e) { /* ignore poll errors */ }
			}, 10000);
			return () => clearInterval(interval);
		}
	});
</script>

<svelte:head>
	<title>Pesanan #{order.id.slice(0,8)} - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-2xl px-4 py-12">
	<div class="text-center mb-10">
		{#if order.paymentStatus === 'paid'}
			<div class="text-4xl mb-4">✓</div>
			<h1 class="font-display text-3xl font-bold">Pembayaran Diterima!</h1>
			<p class="text-stone mt-2">Terima kasih, pesanan Anda sedang diproses.</p>
		{:else if order.paymentStatus === 'failed'}
			<div class="text-4xl mb-4">✗</div>
			<h1 class="font-display text-3xl font-bold">Pembayaran Gagal</h1>
			<p class="text-stone mt-2">Pesanan dibatalkan. Silakan coba lagi.</p>
		{:else}
			<div class="text-4xl mb-4 animate-pulse">⏳</div>
			<h1 class="font-display text-3xl font-bold">Menunggu Pembayaran</h1>
			<p class="text-stone mt-2">Selesaikan pembayaran untuk melanjutkan pesanan.</p>
		{/if}
	</div>

	{#if paymentError}
		<div class="bg-yellow-50 text-yellow-800 px-4 py-3 rounded mb-6 text-sm">
			Sistem pembayaran sedang bermasalah. Pesanan Anda telah dibuat — silakan coba bayar lagi nanti.
		</div>
	{/if}

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
			<span class="text-sm capitalize">
				{#if order.paymentStatus === 'pending'}
					<span class="text-yellow-600">Menunggu Pembayaran</span>
				{:else if order.paymentStatus === 'paid'}
					<span class="text-green-600">Lunas</span>
				{:else if order.paymentStatus === 'failed'}
					<span class="text-red-600">Gagal</span>
				{:else}
					{order.paymentStatus}
				{/if}
			</span>
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

	{#if order.paymentStatus === 'pending'}
		<div class="border border-yellow-200 bg-yellow-50 rounded-lg p-6 mb-8 text-sm">
			<h2 class="font-medium mb-3 text-yellow-800">Pembayaran Tertunda</h2>
			<p class="text-yellow-700 mb-2">Total: <strong>{formatPrice(order.total)}</strong></p>
			<p class="text-yellow-700">Pembayaran akan otomatis terverifikasi setelah Anda menyelesaikan pembayaran via Midtrans.</p>
			<p class="text-yellow-600 text-xs mt-3">Status diperbarui otomatis setiap 10 detik.</p>
		</div>
	{:else if order.paymentStatus === 'paid'}
		<div class="border border-green-200 bg-green-50 rounded-lg p-6 mb-8 text-sm">
			<h2 class="font-medium mb-3 text-green-800">Pembayaran Lunas</h2>
			<p class="text-green-700">Pembayaran telah diterima. Pesanan Anda akan segera diproses dan dikirim.</p>
		</div>
	{:else if order.paymentStatus === 'failed'}
		<div class="border border-red-200 bg-red-50 rounded-lg p-6 mb-8 text-sm">
			<h2 class="font-medium mb-3 text-red-800">Pembayaran Gagal/Dibatalkan</h2>
			<p class="text-red-700">Pesanan dibatalkan. Stok produk telah dikembalikan. Silakan buat pesanan baru.</p>
		</div>
	{/if}

	<div class="text-center">
		<a href="/products" class="text-terracotta hover:underline text-sm">← Belanja Lagi</a>
	</div>
</div>