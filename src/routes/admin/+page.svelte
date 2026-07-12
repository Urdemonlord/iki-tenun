<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	let { data } = $props();
</script>

<svelte:head><title>Admin - IKI TENUN</title></svelte:head>

<h1 class="text-2xl font-bold mb-8">Dashboard</h1>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
	{#each [
		['Produk', data.stats.totalProducts],
		['Pesanan', data.stats.totalOrders],
		['Users', data.stats.totalUsers],
		['Revenue', formatPrice(data.stats.revenue)]
	] as [label, value]}
		<div class="bg-white border border-sand/50 rounded-lg p-4">
			<p class="text-sm text-stone">{label}</p>
			<p class="text-2xl font-bold mt-1">{value}</p>
		</div>
	{/each}
</div>

<h2 class="font-medium mb-4">Pesanan Terbaru</h2>
<div class="bg-white border border-sand/50 rounded-lg overflow-hidden">
	{#if data.recentOrders.length === 0}
		<p class="p-6 text-sm text-stone">Belum ada pesanan.</p>
	{:else}
		<div class="divide-y divide-sand/50">
			{#each data.recentOrders as order}
				<a href="/admin/orders/{order.id}" class="flex items-center justify-between p-4 hover:bg-ivory transition">
					<div>
						<p class="text-sm font-medium">#{order.id.slice(0, 8)}</p>
						<p class="text-xs text-stone">{order.user?.name || order.user?.email}</p>
					</div>
					<div class="text-right">
						<p class="text-sm font-medium">{formatPrice(order.total)}</p>
						<p class="text-xs text-stone capitalize">{order.status}</p>
					</div>
				</a>
			{/each}
		</div>
	{/if}
</div>
