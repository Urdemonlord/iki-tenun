<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children }: { children: Snippet } = $props();
</script>

<div class="flex min-h-screen bg-ivory">
	<!-- Sidebar -->
	<aside class="w-60 bg-charcoal text-white p-6 hidden md:block flex-shrink-0">
		<a href="/admin" class="font-display text-xl font-bold block mb-8">IKI TENUN</a>
		<nav class="space-y-1 text-sm">
			<a href="/admin" class="block px-3 py-2 rounded hover:bg-white/10 transition">Dashboard</a>
			<a href="/admin/products" class="block px-3 py-2 rounded hover:bg-white/10 transition">Produk</a>
			<a href="/admin/orders" class="block px-3 py-2 rounded hover:bg-white/10 transition">Pesanan</a>
			<a href="/" class="block px-3 py-2 rounded hover:bg-white/10 transition mt-8 text-stone">← Kembali ke Store</a>
		</nav>
	</aside>

	<!-- Mobile nav bar -->
	<nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-charcoal text-white border-t border-white/10">
		<div class="flex justify-around py-2.5 text-xs font-medium">
			<a href="/admin" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded hover:bg-white/10 transition">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
				Dashboard
			</a>
			<a href="/admin/products" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded hover:bg-white/10 transition">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
				Produk
			</a>
			<a href="/admin/orders" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded hover:bg-white/10 transition">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
				Pesanan
			</a>
			<a href="/" class="flex flex-col items-center gap-1 px-2 py-1.5 rounded hover:bg-white/10 transition text-stone">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
				Store
			</a>
		</div>
	</nav>

	<!-- Main content -->
	<div class="flex-1 pb-16 md:pb-0">
		<header class="bg-white border-b border-sand/50 px-6 py-4 flex items-center justify-between md:hidden">
			<span class="font-display font-bold">Admin</span>
		</header>
		<div class="p-6">
			{@render children()}
		</div>
	</div>
</div>
