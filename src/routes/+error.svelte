<script lang="ts">
	import { page } from '$app/stores';
	let { status } = $props();
</script>

<svelte:head>
	<title>Halaman Tidak Ditemukan - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-7xl px-4 py-24 text-center">
	<div class="max-w-md mx-auto">
		<p class="text-6xl font-display font-bold text-sand mb-4">404</p>
		<h1 class="font-display text-2xl font-bold mb-4">Halaman Tidak Ditemukan</h1>
		<p class="text-stone mb-8 leading-relaxed">
			Maaf, halaman yang kamu cari tidak tersedia atau telah dipindahkan.
		</p>
		<div class="flex justify-center gap-4">
			<a href="/" class="inline-block bg-charcoal text-white px-6 py-3 rounded-lg font-medium hover:bg-stone transition">
				Kembali ke Beranda
			</a>
			<a href="/products" class="inline-block border border-charcoal text-charcoal px-6 py-3 rounded-lg font-medium hover:bg-ivory transition">
				Lihat Koleksi
			</a>
		</div>
	</div>
</div>
