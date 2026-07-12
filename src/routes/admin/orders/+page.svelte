<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import Pagination from '$lib/components/Pagination.svelte';
	let { data } = $props();
</script>

<svelte:head><title>Pesanan - Admin IKI TENUN</title></svelte:head>

<h1 class="text-2xl font-bold mb-8">Pesanan</h1>

<div class="bg-white border border-sand/50 rounded-lg overflow-hidden">
	<div class="divide-y divide-sand/50">
		{#each data.orders as order}
			<a href="/admin/orders/{order.id}" class="flex items-center justify-between p-4 hover:bg-ivory transition">
				<div>
					<p class="text-sm font-medium">#{order.id.slice(0, 8)}</p>
					<p class="text-xs text-stone">{order.user?.name || 'N/A'} — {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
				</div>
				<div class="text-right">
					<p class="text-sm font-medium">{formatPrice(order.total)}</p>
					<span class="text-xs capitalize px-2 py-0.5 rounded
						{order.status === 'delivered' ? 'bg-green-100 text-green-700' :
						 order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
						 'bg-sand/30 text-stone'}">{order.status}</span>
				</div>
			</a>
		{/each}
	</div>
</div>

<Pagination {basePath="/admin/orders"} page={data.page} totalPages={data.totalPages} />
