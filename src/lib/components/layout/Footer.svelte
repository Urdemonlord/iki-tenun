<footer class="bg-charcoal text-white mt-20">
	<div class="mx-auto max-w-7xl px-4 py-12">
		<div class="grid grid-cols-1 md:grid-cols-4 gap-8">
			<!-- Brand -->
			<div>
				<div class="font-display text-xl font-bold mb-3">IKI TENUN</div>
				<p class="text-white/60 text-sm leading-relaxed max-w-sm">
					Tenun ikat rajawali asli Jepara, dirajut dengan penuh cinta. 
					Setiap kain adalah warisan budaya yang dipersembahkan untuk fashion modern.
				</p>
				<div class="flex gap-4 mt-4">
					<a href="https://www.instagram.com/iki.tenun/" target="_blank" rel="noopener" class="text-white/50 hover:text-white transition text-sm">Instagram</a>
					<a href="https://www.tokopedia.com/rennysalim" target="_blank" rel="noopener" class="text-white/50 hover:text-white transition text-sm">Tokopedia</a>
					<a href="https://wa.me/6281225158035" target="_blank" rel="noopener" class="text-white/50 hover:text-white transition text-sm">WhatsApp</a>
				</div>
			</div>

			<!-- Newsletter -->
			<div>
				<p class="text-xs font-medium tracking-wider uppercase text-white/40 mb-3">Newsletter</p>
				<p class="text-xs text-white/50 mb-3">Dapatkan info koleksi terbaru & promo spesial.</p>
				<form method="POST" action="/api/newsletter" class="flex gap-2">
					<input type="email" name="email" placeholder="Email kamu" required
						class="flex-1 text-xs bg-white/10 border border-white/20 rounded-lg px-3 py-2 placeholder:text-white/30 focus:outline-none focus:border-white/50 transition" />
					<button type="submit" class="bg-white/10 text-xs px-3 py-2 rounded-lg hover:bg-white/20 transition whitespace-nowrap">Kirim</button>
				</form>
			</div>

			<!-- Links -->
			<div>
				<p class="text-xs font-medium tracking-wider uppercase text-white/40 mb-3">Navigasi</p>
				<div class="flex flex-col gap-2 text-sm text-white/70">
					<a href="/products" class="hover:text-white transition">Koleksi</a>
					<a href="/about" class="hover:text-white transition">Tentang Kami</a>
					<a href="/contact" class="hover:text-white transition">Kontak</a>
				</div>
			</div>

			<!-- Info -->
			<div>
				<p class="text-xs font-medium tracking-wider uppercase text-white/40 mb-3">Info</p>
				<div class="flex flex-col gap-2 text-sm text-white/70">
					<span>Pecangaan, Kab. Jepara</span>
					<span>Jawa Tengah 59462</span>
					<a href="mailto:ikitenun.store@gmail.com" class="hover:text-white transition">ikitenun.store@gmail.com</a>
					<a href="tel:6281225158035" class="hover:text-white transition">+62 812-2515-8035</a>
				</div>
			</div>
		</div>

		<div class="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
			<p class="text-xs text-white/40">&copy; 2026 IKI TENUN. All rights reserved.</p>
			<p class="text-xs text-white/40">Tenun Ikat Rajawali — Jepara</p>
		</div>
	</div>
</footer>
