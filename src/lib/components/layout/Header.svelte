<script lang="ts">
	interface User {
		id: string; name: string | null; email: string; role: string;
	}
	let { user }: { user: User | null } = $props();
	let mobileOpen = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		function onScroll() { scrolled = window.scrollY > 10; }
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function close() { mobileOpen = false; }
</script>

<header class="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow duration-300
	{scrolled ? 'shadow-sm shadow-sand/30' : 'border-b border-sand/50'}">
	<div class="mx-auto max-w-7xl px-4">
		<div class="flex h-14 md:h-16 items-center justify-between">
			<a href="/" class="font-display text-lg md:text-xl font-bold tracking-tight" onclick={close}>IKI TENUN</a>

			<!-- Desktop nav -->
			<nav class="hidden md:flex items-center gap-8 text-sm font-medium text-stone">
				<a href="/products" class="hover:text-charcoal transition py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-charcoal after:transition-all hover:after:w-full">Koleksi</a>
				<a href="/products?category=dress" class="hover:text-charcoal transition py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-charcoal after:transition-all hover:after:w-full">Dress</a>
				<a href="/products?category=blazer" class="hover:text-charcoal transition py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-charcoal after:transition-all hover:after:w-full">Blazer</a>
				<a href="/products?category=set" class="hover:text-charcoal transition py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-charcoal after:transition-all hover:after:w-full">Set</a>
				<a href="/products?category=kimono" class="hover:text-charcoal transition py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1.5px] after:bg-charcoal after:transition-all hover:after:w-full">Kimono</a>
			</nav>

			<div class="flex items-center gap-3 md:gap-4">
				<a href="/cart" class="text-stone hover:text-charcoal transition relative group" aria-label="Cart">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
						class="group-hover:scale-110 transition-transform">
						<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
						<path d="m1 1 4 0 2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
					</svg>
				</a>
				{#if user}
					<a href="/account" class="hidden md:inline text-sm text-stone hover:text-charcoal transition">{user.name || 'Akun'}</a>
				{:else}
					<a href="/login" class="hidden md:inline text-sm bg-charcoal text-white px-4 py-2 rounded-lg hover:bg-stone transition hover:scale-105 active:scale-95">Masuk</a>
				{/if}

				<!-- Mobile hamburger -->
				<button class="md:hidden text-stone hover:text-charcoal p-1 transition-transform {mobileOpen ? 'rotate-90' : ''}" onclick={() => mobileOpen = !mobileOpen} aria-label="Menu">
					{#if mobileOpen}
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if mobileOpen}
		<div class="md:hidden border-t border-sand/30 bg-cream/95 backdrop-blur-sm animate-[slideDown_0.2s_ease-out]">
			<nav class="mx-auto max-w-7xl px-4 py-4 flex flex-col gap-1 text-sm font-medium text-stone">
				<a href="/products" class="py-2.5 px-3 rounded-lg hover:bg-sand/20 hover:text-charcoal transition" onclick={close}>Semua Koleksi</a>
				<a href="/products?category=dress" class="py-2.5 px-3 rounded-lg hover:bg-sand/20 hover:text-charcoal transition" onclick={close}>Dress</a>
				<a href="/products?category=blazer" class="py-2.5 px-3 rounded-lg hover:bg-sand/20 hover:text-charcoal transition" onclick={close}>Blazer</a>
				<a href="/products?category=set" class="py-2.5 px-3 rounded-lg hover:bg-sand/20 hover:text-charcoal transition" onclick={close}>Set</a>
				<a href="/products?category=kimono" class="py-2.5 px-3 rounded-lg hover:bg-sand/20 hover:text-charcoal transition" onclick={close}>Kimono</a>
				<div class="border-t border-sand/30 mt-2 pt-2"></div>
				{#if user}
					<a href="/account" class="py-2.5 px-3 rounded-lg hover:bg-sand/20 hover:text-charcoal transition" onclick={close}>{user.name || 'Akun Saya'}</a>
				{:else}
					<a href="/login" class="py-2.5 bg-charcoal text-white text-center rounded-lg hover:bg-stone transition" onclick={close}>Masuk / Daftar</a>
				{/if}
			</nav>
		</div>
	{/if}
</header>

<style>
	@keyframes slideDown {
		from { opacity: 0; transform: translateY(-8px); }
		to { opacity: 1; transform: translateY(0); }
	}
</style>
