<script lang="ts">
	import { enhance, applyAction } from '$app/forms';
	let { data } = $props();

	let images = $state(data.product.images || []);
	let newImageUrl = $state('');
	let addingImage = $state(false);

	function addImage() {
		if (newImageUrl.trim()) {
			images = [...images, { id: '', url: newImageUrl.trim(), alt: '', sortOrder: images.length }];
			newImageUrl = '';
		}
	}

	function removeImage(idx: number) {
		images = images.filter((_, i) => i !== idx);
	}
</script>

<svelte:head><title>Edit {data.product.name} - Admin IKI TENUN</title></svelte:head>

<div class="max-w-2xl">
	<div class="flex items-center gap-4 mb-8">
		<a href="/admin/products" class="text-sm text-stone hover:text-charcoal">← Kembali</a>
		<h1 class="text-2xl font-bold">Edit: {data.product.name}</h1>
	</div>

	<form method="POST" action="?/update" use:enhance={() => {
		return async ({ result }) => { await applyAction(result); };
	}} class="space-y-6">

		<div>
			<label class="block text-sm font-medium mb-1">Nama Produk</label>
			<input type="text" name="name" value={data.product.name} required
				class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20" />
		</div>

		<div>
			<label class="block text-sm font-medium mb-1">Slug</label>
			<input type="text" name="slug" value={data.product.slug} required
				class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20" />
		</div>

		<div>
			<label class="block text-sm font-medium mb-1">Deskripsi</label>
			<textarea name="description" rows="4"
				class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 resize-none">{data.product.description || ''}</textarea>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-1">Harga (Rp)</label>
				<input type="number" name="price" value={data.product.price} required min="0"
					class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20" />
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Harga Sebelum Diskon (Rp)</label>
				<input type="number" name="compareAtPrice" value={data.product.compareAtPrice || ''} min="0"
					placeholder="Opsional"
					class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20" />
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="block text-sm font-medium mb-1">Kategori</label>
				<select name="categoryId" class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20">
					{#each data.categories as cat}
						<option value={cat.id} selected={cat.id === data.product.categoryId}>{cat.name}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="block text-sm font-medium mb-1">Stok</label>
				<input type="number" name="stock" value={data.product.stock} min="0"
					class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20" />
			</div>
		</div>

		<div>
			<label class="block text-sm font-medium mb-1">Tags (koma)</label>
			<input type="text" name="tags" value={data.product.tags || ''}
				class="w-full px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20" />
		</div>

		<div class="flex gap-2">
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" name="isActive" checked={data.product.isActive}
					class="rounded border-sand focus:ring-charcoal/20" />
				Aktif
			</label>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" name="isFeatured" checked={data.product.isFeatured}
					class="rounded border-sand focus:ring-charcoal/20" />
				Featured
			</label>
			<label class="flex items-center gap-2 text-sm">
				<input type="checkbox" name="isNewArrival" checked={data.product.isNewArrival}
					class="rounded border-sand focus:ring-charcoal/20" />
				New Arrival
			</label>
		</div>

		<!-- Images -->
		<div>
			<label class="block text-sm font-medium mb-2">Gambar Produk</label>

			<div class="grid grid-cols-4 gap-3 mb-3">
				{#each images as img, i}
					<div class="relative aspect-square border border-sand rounded-lg overflow-hidden group">
						<img src={img.url} alt={img.alt || ''} class="w-full h-full object-cover" />
						<button type="button" onclick={() => removeImage(i)}
							class="absolute top-1 right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
							×
						</button>
						<input type="hidden" name="imageUrls" value={img.url} />
					</div>
				{/each}
			</div>

			<div class="flex gap-2">
				<input type="text" bind:value={newImageUrl} placeholder="URL gambar baru..." 
					class="flex-1 px-4 py-2.5 border border-sand rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 text-sm" />
				<button type="button" onclick={addImage}
					class="bg-charcoal text-white px-4 py-2.5 rounded-lg text-sm hover:bg-stone transition">
					Tambah
				</button>
			</div>
			<p class="text-xs text-stone mt-1">Upload ke /static/images/products/ dulu, lalu masukkan URL (contoh: /images/products/foto.png)</p>
		</div>

		<div class="flex gap-3">
			<button type="submit"
				class="bg-charcoal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-stone transition">
				Simpan Perubahan
			</button>
			<a href="/admin/products" class="px-6 py-2.5 border border-sand rounded-lg text-sm text-stone hover:text-charcoal transition">
				Batal
			</a>
		</div>
	</form>
</div>
