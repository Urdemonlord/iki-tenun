<script lang="ts">
	let name = $state('');
	let email = $state('');
	let message = $state('');
</script>

<svelte:head>
	<title>Kontak - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-16">
	<p class="text-sm font-medium tracking-widest text-stone uppercase mb-4 text-center">Hubungi Kami</p>
	<h1 class="font-display text-4xl font-bold text-center mb-4">Kontak</h1>
	<p class="text-stone text-center mb-12 max-w-md mx-auto">
		Ada pertanyaan? Tim kami siap membantu.
	</p>

	<div class="grid md:grid-cols-2 gap-12">
		<div>
			<form class="space-y-4" onsubmit={(e) => { e.preventDefault(); alert('Pesan terkirim! (demo)'); }}>
				<div>
					<label for="name" class="block text-sm font-medium text-stone mb-1">Nama</label>
					<input id="name" type="text" bind:value={name} required
						class="w-full px-4 py-2.5 rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition" />
				</div>
				<div>
					<label for="email" class="block text-sm font-medium text-stone mb-1">Email</label>
					<input id="email" type="email" bind:value={email} required
						class="w-full px-4 py-2.5 rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition" />
				</div>
				<div>
					<label for="message" class="block text-sm font-medium text-stone mb-1">Pesan</label>
					<textarea id="message" rows="4" bind:value={message} required
						class="w-full px-4 py-2.5 rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-charcoal/20 focus:border-charcoal transition resize-none"></textarea>
				</div>
				<button type="submit"
					class="w-full bg-charcoal text-white py-2.5 rounded-lg font-medium hover:bg-stone transition">Kirim Pesan</button>
			</form>
		</div>
		<div class="space-y-6 pt-1">
			<div>
				<p class="text-sm font-medium text-charcoal mb-1">Alamat</p>
				<p class="text-sm text-stone">Pecangaan, Kab. Jepara<br/>Jawa Tengah 59462</p>
			</div>
			<div>
				<p class="text-sm font-medium text-charcoal mb-1">Email</p>
				<p class="text-sm text-stone">ikitenun.store@gmail.com</p>
			</div>
			<div>
				<p class="text-sm font-medium text-charcoal mb-1">Media Sosial</p>
				<div class="flex gap-3">
					<a href="https://www.instagram.com/iki.tenun/" target="_blank" rel="noopener"
						class="text-sm text-stone hover:text-charcoal transition underline underline-offset-2">Instagram</a>
					<a href="https://www.tokopedia.com/rennysalim" target="_blank" rel="noopener"
						class="text-sm text-stone hover:text-charcoal transition underline underline-offset-2">Tokopedia</a>
				</div>
			</div>
		</div>
	</div>
</div>
