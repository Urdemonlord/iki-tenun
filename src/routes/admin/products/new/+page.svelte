<script lang="ts">
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let loading = $state(false);
</script>

<svelte:head><title>Tambah Produk - Admin</title></svelte:head>

<h1 class="text-2xl font-bold mb-8">Tambah Produk</h1>

{#if form?.error}
	<div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">{form.error}</div>
{/if}

<form method="POST" use:enhance={() => { loading = true; return async ({ update }) => { loading = false; await update(); } }}>
	<div class="max-w-2xl bg-white border border-sand/50 rounded-lg p-6 space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-1">Nama *</label>
				<input name="name" required class="w-full px-3 py-2 border border-sand rounded" />
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Slug *</label>
				<input name="slug" required class="w-full px-3 py-2 border border-sand rounded" />
			</div>
		</div>
		<div>
			<label class="block text-sm font-medium mb-1">Deskripsi</label>
			<textarea name="description" rows="3" class="w-full px-3 py-2 border border-sand rounded"></textarea>
		</div>
		<div class="grid grid-cols-3 gap-4">
			<div>
				<label class="block text-sm font-medium mb-1">Harga *</label>
				<input name="price" type="number" required class="w-full px-3 py-2 border border-sand rounded" />
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Harga Compare</label>
				<input name="compareAtPrice" type="number" class="w-full px-3 py-2 border border-sand rounded" />
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Stok</label>
				<input name="stock" type="number" value="50" class="w-full px-3 py-2 border border-sand rounded" />
			</div>
		</div>
		<div>
			<label class="block text-sm font-medium mb-1">Kategori *</label>
			<select name="categoryId" required class="w-full px-3 py-2 border border-sand rounded">
				{#each data.categories as cat}
					<option value={cat.id}>{cat.name}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class="block text-sm font-medium mb-1">Tags (comma separated)</label>
			<input name="tags" class="w-full px-3 py-2 border border-sand rounded" />
		</div>
		<div>
			<label class="block text-sm font-medium mb-1">Image URL</label>
			<input name="imageUrl" type="url" class="w-full px-3 py-2 border border-sand rounded" />
		</div>
		<div class="flex gap-3 pt-4">
			<button type="submit" disabled={loading}
				class="bg-charcoal text-white px-6 py-2 rounded-lg text-sm hover:bg-stone transition disabled:opacity-50">
				{loading ? 'Menyimpan...' : 'Simpan Produk'}
			</button>
			<a href="/admin/products" class="px-6 py-2 border border-sand rounded-lg text-sm hover:bg-ivory">Batal</a>
		</div>
	</div>
</form>
