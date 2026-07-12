<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	let { data } = $props();
</script>

<svelte:head>
	<title>Akun Saya - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<h1 class="font-display text-3xl font-bold mb-8">Akun Saya</h1>

	<div class="grid md:grid-cols-3 gap-8">
		<!-- Profile -->
		<div class="border border-sand/50 rounded-lg p-6">
			<h2 class="font-medium mb-4">Profil</h2>
			<div class="text-sm text-stone space-y-1">
				<p>{data.user?.name}</p>
				<p>{data.user?.email}</p>
			</div>
			<form method="POST" action="/logout" class="mt-4">
				<button class="text-sm text-stone hover:text-charcoal">Keluar</button>
			</form>
		</div>

		<!-- Orders -->
		<div class="md:col-span-2">
			<h2 class="font-medium mb-4">Pesanan Saya</h2>
			{#if data.orders.length === 0}
				<p class="text-sm text-stone">Belum ada pesanan.</p>
			{:else}
				<div class="space-y-3">
					{#each data.orders as order}
						<a href="/order/{order.id}" class="block border border-sand/50 rounded-lg p-4 hover:bg-ivory transition">
							<div class="flex justify-between items-center mb-1">
								<span class="text-sm font-medium">#{order.id.slice(0, 8)}</span>
								<span class="text-xs capitalize px-2 py-0.5 bg-sand/30 rounded">{order.status}</span>
							</div>
							<div class="flex justify-between text-sm text-stone">
								<span>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
								<span>{formatPrice(order.total)}</span>
							</div>
							<p class="text-xs text-stone mt-1">{order.items.length} item</p>
						</a>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
