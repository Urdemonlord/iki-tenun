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
				<p class="text-sm font-medium text-charcoal mb-1">Telepon / WhatsApp</p>
				<a href="tel:6281225158035" class="text-sm text-stone hover:text-charcoal transition">+62 812-2515-8035</a>
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

	<!-- Google Maps -->
	<div class="mt-12">
		<iframe
			src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3963.0!2d110.6958000!3d-6.6854200!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwNDEnMDcuNSJTIDExMMKwNDEnNDQuOSJF!5e0!3m2!1sen!2sid!4v1690000000000"
			width="100%" height="320" style="border:0; border-radius: 12px;" allowfullscreen="" loading="lazy"
			referrerpolicy="no-referrer-when-downgrade" title="IKI TENUN - Pecangaan, Jepara">
		</iframe>
	</div>
</div>
