<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { enhance } from '$app/forms';
	let { data } = $props();
	let { order } = data;
</script>

<svelte:head><title>Pesanan #{order.id.slice(0,8)} - Admin</title></svelte:head>

<div class="max-w-2xl">
	<h1 class="text-2xl font-bold mb-2">Pesanan #{order.id.slice(0, 8)}</h1>
	<p class="text-sm text-stone mb-8">{new Date(order.createdAt).toLocaleString('id-ID')}</p>

	<div class="bg-white border border-sand/50 rounded-lg p-6 mb-6">
		<h2 class="font-medium mb-4">Info Pelanggan</h2>
		<div class="text-sm text-stone space-y-1">
			<p>{order.user?.name || 'N/A'} ({order.user?.email})</p>
			<p>{order.shippingName} — {order.shippingPhone}</p>
			<p>{order.shippingAddress}</p>
			<p>{order.shippingCity}, {order.shippingProvince} {order.shippingZip}</p>
			{#if order.notes}
				<p class="italic mt-2">Catatan: {order.notes}</p>
			{/if}
		</div>
	</div>

	<div class="bg-white border border-sand/50 rounded-lg p-6 mb-6">
		<h2 class="font-medium mb-4">Item Pesanan</h2>
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

	<div class="bg-white border border-sand/50 rounded-lg p-6">
		<h2 class="font-medium mb-4">Update Status</h2>
		<form method="POST" action="?/updateStatus" use:enhance class="flex items-end gap-3">
			<div class="flex-1">
				<label class="block text-sm font-medium mb-1">Status Pesanan</label>
				<select name="status" class="w-full px-3 py-2 border border-sand rounded text-sm">
					{#each ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'] as s}
						<option value={s} selected={order.status === s}>{s}</option>
					{/each}
				</select>
			</div>
			<button class="bg-charcoal text-white px-4 py-2 rounded text-sm hover:bg-stone transition">Update</button>
		</form>
	</div>
</div>
