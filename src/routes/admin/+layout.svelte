<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen bg-ivory">
	<!-- Sidebar -->
	<aside class="w-60 bg-charcoal text-white p-6 hidden md:block">
		<a href="/admin" class="font-display text-xl font-bold block mb-8">IKI TENUN</a>
		<nav class="space-y-1 text-sm">
			<a href="/admin" class="block px-3 py-2 rounded hover:bg-white/10 transition">Dashboard</a>
			<a href="/admin/products" class="block px-3 py-2 rounded hover:bg-white/10 transition">Produk</a>
			<a href="/admin/orders" class="block px-3 py-2 rounded hover:bg-white/10 transition">Pesanan</a>
			<a href="/" class="block px-3 py-2 rounded hover:bg-white/10 transition mt-8 text-stone">← Kembali ke Store</a>
		</nav>
	</aside>

	<!-- Main content -->
	<div class="flex-1">
		<header class="bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between md:hidden">
			<span class="font-display font-bold">Admin</span>
		</header>
		<div class="p-6">
			{@render children()}
		</div>
	</div>
</div>
