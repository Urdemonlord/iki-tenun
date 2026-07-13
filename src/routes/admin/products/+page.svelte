<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { enhance } from '$app/forms';
	import Pagination from '$lib/components/Pagination.svelte';
	let { data } = $props();
</script>

<svelte:head><title>Produk - Admin IKI TENUN</title></svelte:head>

<div class="flex items-center justify-between mb-8">
	<h1 class="text-2xl font-bold">Produk</h1>
	<a href="/admin/products/new" class="bg-charcoal text-white px-4 py-2 rounded-lg text-sm hover:bg-stone transition">+ Tambah Produk</a>
</div>

<div class="bg-white border border-sand/50 rounded-lg overflow-hidden">
	<table class="w-full text-sm">
		<thead class="bg-ivory text-left">
			<tr>
				<th class="px-4 py-3 font-medium">Produk</th>
				<th class="px-4 py-3 font-medium">Kategori</th>
				<th class="px-4 py-3 font-medium">Harga</th>
				<th class="px-4 py-3 font-medium">Stok</th>
				<th class="px-4 py-3 font-medium">Status</th>
				<th class="px-4 py-3 font-medium">Aksi</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-sand/50">
			{#each data.products as product}
				<tr>
					<td class="px-4 py-3 flex items-center gap-3">
						{#if product.images[0]}
							<img src={product.images[0].url} alt="" class="w-10 h-12 rounded object-cover" />
						{/if}
						<div>
							<p class="font-medium">{product.name}</p>
							<p class="text-xs text-stone">{product.slug}</p>
						</div>
					</td>
					<td class="px-4 py-3 text-stone">{product.category?.name}</td>
					<td class="px-4 py-3">{formatPrice(product.price)}</td>
					<td class="px-4 py-3">{product.stock}</td>
					<td class="px-4 py-3">
						<span class="px-2 py-0.5 rounded text-xs {product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
							{product.isActive ? 'Active' : 'Inactive'}
						</span>
					</td>
					<td class="px-4 py-3">
						<form method="POST" action="?/toggleActive" use:enhance>
							<input type="hidden" name="id" value={product.id} />
							<button class="text-xs text-stone hover:text-charcoal">
								{product.isActive ? 'Disable' : 'Enable'}
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Pagination basePath="/admin/products" page={data.page} totalPages={data.totalPages} />
