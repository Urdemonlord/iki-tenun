<script lang="ts">
	const articles = [
		{
			title: 'Cara Merawat Kain Tenun agar Tetap Awet',
			slug: 'cara-merawat-tenun',
			date: '15 Juli 2026',
			body: `Kain tenun ikat adalah warisan budaya yang berharga. Agar tetap awet dan warnanya tetap cerah, ikuti tips berikut:

**1. Cuci dengan Tangan**
Gunakan air dingin dan deterjen lembut. Jangan gunakan pemutih atau deterjen keras yang bisa merusak serat alami kain tenun.

**2. Jangan Diperas**
Setelah dicuci, jangan memeras kain tenun. Cukup tekan perlahan untuk mengeluarkan air berlebih, lalu jemur di tempat teduh.

**3. Hindari Sinar Matahari Langsung**
Sinar matahari langsung bisa membuat warna kain cepat pudar. Jemur di tempat yang teduh dan berangin.

**4. Setrika dengan Suhu Rendah**
Gunakan setrika dengan suhu rendah hingga sedang. Sebaiknya setrika dari bagian dalam kain untuk melindungi permukaan tenun.

**5. Simpan dengan Baik**
Lipat kain tenun dengan rapi dan simpan di tempat kering. Tambahkan silica gel untuk mencegah kelembaban. Hindari menggantung terlalu lama karena bisa merusak bentuk kain.

Dengan perawatan yang tepat, kain tenun IKI TENUN bisa bertahan bertahun-tahun dan tetap terlihat indah.`,
		},
		{
			title: 'Sejarah Tenun Ikat Jepara: Warisan Nusantara',
			slug: 'sejarah-tenun-jepara',
			date: '2 Juli 2026',
			body: `Tenun ikat merupakan salah satu warisan budaya Indonesia yang telah ada sejak ratusan tahun lalu. Di Jepara, tradisi menenun sudah menjadi bagian dari kehidupan masyarakat pesisir.

**Asal Usul Tenun Ikat Jepara**
Jepara, selain dikenal dengan ukiran kayunya, juga memiliki tradisi tenun yang kaya. Tenun ikat Jepara terpengaruh oleh budaya maritim — motif-motifnya sering menggambarkan ombak, ikan, dan kehidupan laut.

**Teknik Pembuatan**
Proses pembuatan kain tenun ikat membutuhkan ketelitian tinggi. Benang diikat dan dicelup berulang kali untuk menciptakan motif yang diinginkan. Satu kain bisa memakan waktu berminggu-minggu hingga berbulan-bulan.

**Filosofi Motif**
Setiap motif tenun Jepara memiliki makna tersendiri — dari motif burung merak yang melambangkan keindahan, hingga motif geometris yang melambangkan keseimbangan hidup.

**Tenun di Era Modern**
Kini, IKI TENUN membawa tenun ikat Jepara ke era modern dengan desain kontemporer yang cocok untuk fashion sehari-hari. Warisan budaya tetap hidup, beradaptasi dengan zaman.`,
		},
		{
			title: 'Mix & Match: Outfit Tenun untuk Acara Formal',
			slug: 'mix-match-tenun-formal',
			date: '20 Juni 2026',
			body: `Outfit tenun tidak hanya untuk acara budaya — dengan mix and match yang tepat, kamu bisa tampil stunning di acara formal sekalipun.

**Look 1: Dress Tenun + Heels Minimal**
Padukan dress tenun IKI TENUN dengan heels nude dan clutch simpel. Tambahkan anting minimalis untuk kesan elegan tanpa berlebihan.

**Look 2: Blazer Tenun + Celana Kulot**
Untuk acara semi-formal, blazer tenun dipadukan dengan celana kulot polos menciptakan siluet modern yang chic.

**Look 3: Outer Tenun + Inner Basic**
Layer outer tenun di atas inner dress atau atasan basic warna netral. Cocok untuk kondangan atau dinner formal.

**Tips Aksesori**
- Pilih aksesori sederhana — biarkan kain tenun menjadi statement utama
- Hindari motif yang bertabrakan
- Warna netral seperti emas, perak, atau nude paling cocok

Dengan padu padan yang tepat, outfit tenun bisa jadi andalan untuk berbagai acara formal. Temukan koleksi lengkap di IKI TENUN!`,
		},
	]
</script>

<svelte:head>
	<title>Blog - IKI TENUN</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-16">
	<p class="text-sm font-medium tracking-widest text-stone uppercase mb-4 text-center">Artikel</p>
	<h1 class="font-display text-4xl font-bold text-center mb-12">Blog & Tips</h1>

	<div class="space-y-6">
		{#each articles as article}
			<a href="/blog/{article.slug}" class="block bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition">
				<p class="text-xs text-stone/50 mb-1">{article.date}</p>
				<h2 class="font-display text-xl font-bold mb-2 hover:text-terracotta transition-colors">{article.title}</h2>
				<p class="text-sm text-stone/60">Baca selengkapnya →</p>
			</a>
		{/each}
	</div>
</div>
