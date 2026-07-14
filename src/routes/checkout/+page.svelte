<script lang="ts">
	import { formatPrice } from '$lib/utils/format';
	import { enhance } from '$app/forms';
	import { debounce } from '$lib/utils';

	let { data, form } = $props();
	let loading = $state(false);

	// City search
	let cityQuery = $state('');
	let cityResults = $state<Array<{ id: string; name: string; province: string; type: string }>>([]);
	let cityDropdownOpen = $state(false);
	let selectedCity = $state<string | null>(null);
	let selectedCityName = $state('');
	let selectedProvince = $state('');
	let selectedSubdistrictId = $state('');

	// Courier selection
	let shippingOptions = $state<Array<{ courier: string; service: string; description: string; cost: number; etd: string }>>([]);
	let selectedCourier = $state('');
	let selectedService = $state('');
	let selectedShippingCost = $state(0);
	let loadingCosts = $state(false);
	let couriersFetched = $state(false);

	// Total
	let subtotal = $state(data.subtotal);
	let total = $derived(subtotal + selectedShippingCost);

	const searchCities = debounce(async (q: string) => {
		if (q.length < 3) { cityResults = []; return; }
		try {
			const res = await fetch(`/api/ongkir/search?q=${encodeURIComponent(q)}`);
			if (res.ok) {
				const d = await res.json();
				cityResults = (d.data || []).map((item: any) => ({
					id: item.id,
					name: `${item.type} ${item.name}`,
					province: item.province || '',
					type: item.type
				}));
				cityDropdownOpen = cityResults.length > 0;
			}
		} catch (e) { /* ignore */ }
	}, 400);

	function selectCity(city: typeof cityResults[0]) {
		selectedCity = city.id;
		selectedCityName = city.name;
		selectedProvince = city.province;
		selectedSubdistrictId = city.id;
		cityDropdownOpen = false;
		cityQuery = city.name;
		selectedCourier = '';
		selectedService = '';
		selectedShippingCost = 0;
		fetchCosts(city.id);
	}

	async function fetchCosts(destinationId: string) {
		loadingCosts = true;
		shippingOptions = [];
		couriersFetched = false;
		try {
			const res = await fetch('/api/ongkir/cost', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					originId: '11000',  // Jakarta default (Toko location)
					destinationId,
					weight: 500 // default 500g, Svelte can compute later
				})
			});
			if (res.ok) {
				const d = await res.json();
				shippingOptions = (d.data || []).map((item: any) => ({
					courier: item.courier || '',
					service: item.service || '',
					description: item.description || '',
					cost: item.cost || 0,
					etd: item.etd || ''
				}));
			}
		} catch (e) { /* ignore */ }
		loadingCosts = false;
		couriersFetched = true;
	}

	function selectCourier(opt: typeof shippingOptions[0]) {
		selectedCourier = opt.courier;
		selectedService = opt.service;
		selectedShippingCost = opt.cost;
	}

	function handleCityInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		cityQuery = val;
		searchCities(val);
	}
</script>

<svelte:head>
	<title>Checkout - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-12">
	<h1 class="font-display text-3xl font-bold mb-8">Checkout</h1>

	<form method="POST" use:enhance={() => {
		loading = true;
		return async () => { loading = false; };
	}}>
		<div class="grid md:grid-cols-2 gap-12">
			<!-- Shipping address -->
			<div>
				<h2 class="font-display text-xl font-bold mb-6">Alamat Pengiriman</h2>

				{#if form?.error}
					<div class="bg-red-50 text-red-700 px-4 py-3 rounded mb-4 text-sm">{form.error}</div>
				{/if}

				<div class="space-y-3">
					{#each ['name', 'phone'] as field}
						<div>
							<label class="block text-sm font-medium mb-1">{field === 'name' ? 'Nama Penerima' : 'No. HP'}</label>
							<input type="text" name={field} required
								class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
						</div>
					{/each}
					<div>
						<label class="block text-sm font-medium mb-1">Email (opsional, untuk invoice)</label>
						<input type="email" name="email"
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
					</div>
					<div>
						<label class="block text-sm font-medium mb-1">Alamat</label>
						<textarea name="address" required rows="3"
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta"></textarea>
					</div>

					<!-- City search with autocomplete -->
					<div class="relative">
						<label class="block text-sm font-medium mb-1">Kota/Kabupaten</label>
						<input type="text" name="city" required placeholder="Ketik nama kota..."
							value={selectedCityName}
							oninput={handleCityInput}
							onfocus={() => { if (cityResults.length) cityDropdownOpen = true; }}
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
						<input type="hidden" name="province" value={selectedProvince} />
						{#if cityDropdownOpen && cityResults.length > 0}
							<div class="absolute z-50 w-full bg-white border border-sand rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
								{#each cityResults as city}
									<button type="button" onclick={() => selectCity(city)}
										class="w-full text-left px-4 py-2 hover:bg-sand/20 text-sm border-b border-sand/30 last:border-0">
										{city.name}
										<span class="text-stone text-xs ml-1">({city.province})</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Kode Pos</label>
						<input type="text" name="zip" required
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta" />
					</div>

					<div>
						<label class="block text-sm font-medium mb-1">Catatan (opsional)</label>
						<textarea name="notes" rows="2"
							class="w-full px-4 py-3 border border-sand rounded-lg focus:outline-none focus:border-terracotta"></textarea>
					</div>
				</div>

				<!-- Courier selection -->
				{#if selectedCity}
					<div class="mt-6">
						<h3 class="text-sm font-medium mb-3">Pilih Pengiriman</h3>
						{#if loadingCosts}
							<p class="text-sm text-stone animate-pulse">Menghitung ongkos kirim...</p>
						{:else if couriersFetched && shippingOptions.length === 0}
							<p class="text-sm text-stone">Tidak ada opsi pengiriman tersedia untuk kota ini.</p>
						{:else if shippingOptions.length > 0}
							<div class="space-y-2 max-h-60 overflow-y-auto">
								{#each shippingOptions as opt}
									<label class="flex items-start gap-3 p-3 border border-sand/50 rounded-lg cursor-pointer text-sm
										{selectedCourier === opt.courier && selectedService === opt.service ? 'border-terracotta bg-terracotta/5' : ''}">
										<input type="radio" name="courier_option"
											checked={selectedCourier === opt.courier && selectedService === opt.service}
											onchange={() => selectCourier(opt)}
											class="mt-0.5" />
										<div class="flex-1">
											<div class="flex justify-between">
												<span class="font-medium">{opt.courier.toUpperCase()} — {opt.service}</span>
												<span class="font-medium">{formatPrice(opt.cost)}</span>
											</div>
											{#if opt.description}
												<p class="text-xs text-stone mt-0.5">{opt.description}</p>
											{/if}
											{#if opt.etd}
												<p class="text-xs text-stone">Estimasi: {opt.etd} hari</p>
											{/if}
										</div>
									</label>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Order summary -->
			<div>
				<h2 class="font-display text-xl font-bold mb-6">Ringkasan Pesanan</h2>
				<div class="space-y-3 mb-6">
					{#each data.items as item}
						<div class="flex justify-between text-sm">
							<span>{item.product.name} × {item.quantity}</span>
							<span>{formatPrice(item.product.price * item.quantity)}</span>
						</div>
					{/each}
				</div>
				<div class="border-t border-sand/50 pt-4 space-y-2 text-sm">
					<div class="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
					<div class="flex justify-between">
						<span>Ongkir ({selectedCourier ? selectedCourier.toUpperCase() : '-'})</span>
						{#if selectedShippingCost > 0}
							<span>{formatPrice(selectedShippingCost)}</span>
						{:else}
							<span class="text-green-600">FREE</span>
						{/if}
					</div>
				</div>
				<div class="border-t border-sand/50 pt-4 flex justify-between font-bold text-lg mb-8">
					<span>Total</span>
					<span>{formatPrice(total)}</span>
				</div>

				<div class="border border-sand/50 rounded-lg p-4 mb-6">
					<p class="text-sm font-medium mb-2">Metode Pembayaran</p>
					<p class="text-sm text-stone">Midtrans Snap — Virtual Account, QRIS, GoPay, ShopeePay, Kartu Kredit</p>
				</div>

				<!-- Hidden fields for shipping -->
				<input type="hidden" name="shipping_courier" value={selectedCourier} />
				<input type="hidden" name="shipping_service" value={selectedService} />
				<input type="hidden" name="shipping_cost" value={selectedShippingCost} />

				<button type="submit" disabled={loading}
					class="w-full bg-charcoal text-white py-3 rounded-lg font-medium hover:bg-stone transition disabled:opacity-50">
					{loading ? 'Memproses...' : 'Buat Pesanan'}
				</button>
			</div>
		</div>
	</form>
</div>