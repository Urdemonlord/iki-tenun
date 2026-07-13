import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
	url: 'file:./dev.db'
})
const prisma = new PrismaClient({ adapter })

async function main() {
	const [dress, kemejaCat] = await Promise.all([
		prisma.category.upsert({
			where: { slug: 'dress' },
			update: { name: 'Dress' },
			create: { name: 'Dress', slug: 'dress', sortOrder: 1 }
		}),
		prisma.category.upsert({
			where: { slug: 'kemeja' },
			update: { name: 'Kemeja' },
			create: { name: 'Kemeja', slug: 'kemeja', sortOrder: 2 }
		})
	])

	const img = (f: string) => `/images/products/${f}`

	const products = [
		{
			name: 'Arum Dress', slug: 'arum-dress',
			desc: 'Dress tenun ikat dengan motif tradisional Jepara. Potongan modern yang elegan.',
			price: 449000, cat: dress.id, featured: true,
			images: ['arum_arum_ecommers.png', 'arum_3.png', 'arum_4.png', 'arum_7.png', 'arum_8.png', 'arum_11.png', 'arum_12.png']
		},
		{
			name: 'Bianca Lime', slug: 'bianca-lime',
			desc: 'Dress tenun ikat Bianca dengan warna lime segar dan motif kontemporer.',
			price: 430000, cat: dress.id, newArrival: true,
			images: ['bianca_lime_1.png', 'bianca_lime_2.png', 'bianca_lime_3.png', 'bianca_lime_4.png', 'bianca_lime_5.png', 'bianca_lime_6.png', 'bianca_lime_7.png', 'bianca_lime_8.png']
		},
		{
			name: 'Bianca Violet', slug: 'bianca-violet',
			desc: 'Dress tenun ikat Bianca varian violet dengan motif elegan.',
			price: 430000, cat: dress.id, newArrival: true,
			images: ['bianca_violet_1.png', 'bianca_violet_2.png', 'bianca_violet_3.png', 'bianca_violet_4.png', 'bianca_violet_5.png', 'bianca_violet_6.png', 'bianca_violet_7.png', 'bianca_violet_8.png']
		},
		{
			name: 'Dharma Lime', slug: 'dharma-lime',
			desc: 'Dress tenun ikat Dharma dengan warna lime yang cerah dan modern.',
			price: 438000, cat: dress.id,
			images: ['dharma_lime_1.png', 'dharma_lime_2.png', 'dharma_lime_3.png', 'dharma_lime_4.png', 'dharma_lime_5.png', 'dharma_lime_6.png', 'dharma_lime_7.png', 'dharma_lime_8.png']
		},
		{
			name: 'Dharma Violet', slug: 'dharma-violet',
			desc: 'Dress tenun ikat Dharma varian violet dengan sentuhan premium.',
			price: 438000, cat: dress.id,
			images: ['dharma_violet_1.png', 'dharma_violet_2.png', 'dharma_violet_3.png', 'dharma_violet_4.png', 'dharma_violet_5.png', 'dharma_violet_6.png', 'dharma_violet_7.png', 'dharma_violet_8.png']
		},
		{
			name: 'Hazel Lime', slug: 'hazel-lime',
			desc: 'Dress tenun ikat Hazel dengan warna lime yang youthful.',
			price: 428000, cat: dress.id,
			images: ['foto_web_hazel_1.png', 'foto_web_hazel_2.png', 'foto_web_hazel_3.png', 'foto_web_hazel_4.png', 'foto_web_hazel_5.png']
		},
		{
			name: 'Hazel Violet', slug: 'hazel-violet',
			desc: 'Dress tenun ikat Hazel varian violet dengan motif eksklusif.',
			price: 428000, cat: dress.id,
			images: ['foto_web_lime_1.png', 'foto_web_lime_2.png', 'foto_web_lime_3.png', 'foto_web_lime_4.png', 'foto_web_lime_5.png']
		},
		{
			name: 'Jena Burgundy', slug: 'jena-burgundy',
			desc: 'Dress tenun ikat Jena dengan warna burgundy elegan.',
			price: 449000, cat: dress.id, newArrival: true,
			images: ['foto_web_jena_ungu_2.png', 'foto_web_jena_ungu_3.png', 'foto_web_jena_ungu_4.png', 'foto_web_jena_ungu_5.png']
		},
		{
			name: 'Jena White', slug: 'jena-white',
			desc: 'Dress tenun ikat Jena varian putih bersih nan anggun.',
			price: 449000, cat: dress.id,
			images: ['foto_web_jena_ij_2.png', 'foto_web_jena_ij_3.png', 'foto_web_jena_ij_4.png', 'foto_web_jena_ij_5.png']
		},
		{
			name: 'Kaluna Dress', slug: 'kaluna-dress',
			desc: 'Dress tenun ikat Kaluna dengan motif modern dan nyaman dipakai.',
			price: 405000, cat: dress.id,
			images: ['kaluna_1.png', 'kaluna_2.png', 'kaluna_3.png', 'kaluna_4.png', 'kaluna_5.png']
		},
		{
			name: 'Kenya Dress', slug: 'kenya-dress',
			desc: 'Dress tenun ikat Kenya dengan desain simpel namun berkelas.',
			price: 428000, cat: dress.id, featured: true,
			images: ['kenya_5.png', 'kenya_6.png', 'kenya_10.png']
		},
		{
			name: 'Kusuma Dress', slug: 'kusuma-dress',
			desc: 'Dress tenun ikat Kusuma dengan motif tradisional yang timeless.',
			price: 449000, cat: dress.id,
			images: ['kusuma_2.png', 'kusuma_3.png', 'kusuma_4.png', 'kusuma_5.png']
		},
		{
			name: 'Lara Burgundy', slug: 'lara-burgundy',
			desc: 'Dress tenun ikat Lara dengan warna burgundy yang memukau.',
			price: 438000, cat: dress.id, newArrival: true,
			images: ['lara_ungu_2.png', 'lara_ungu_3.png', 'lara_ungu_4.png', 'lara_ungu_5.png']
		},
		{
			name: 'Lara White', slug: 'lara-white',
			desc: 'Dress tenun ikat Lara varian putih dengan motif eksklusif.',
			price: 438000, cat: dress.id,
			images: ['lara_ij2.png', 'lara_ij_3.png', 'lara_ij_4.png', 'lara_ij_5.png']
		},
		{
			name: 'Monic Dress', slug: 'monic-dress',
			desc: 'Dress tenun ikat Monic dengan potongan modern yang elegan.',
			price: 405000, cat: dress.id,
			images: ['monic_1.png', 'monic_2.png', 'monic_3.png', 'monic_4.png', 'monic_5.png']
		},
		{
			name: 'Natali Dress', slug: 'natali-dress',
			desc: 'Dress tenun ikat Natali dengan desain kontemporer.',
			price: 428000, cat: dress.id, featured: true,
			images: ['natali_ecommers.png', 'natali_1.png', 'natali_2.png', 'natali_9.png']
		},
		{
			name: 'Puspa Dress', slug: 'puspa-dress',
			desc: 'Dress tenun ikat Puspa dengan motif bunga tradisional Jepara.',
			price: 449000, cat: dress.id,
			images: ['puspa_2.png', 'puspa_3.png', 'puspa_4.png', 'puspa_5.png']
		},
		{
			name: 'Kemeja Tenun', slug: 'kemeja-tenun',
			desc: 'Kemeja tenun ikat premium, cocok untuk acara formal maupun kasual.',
			price: 375000, cat: kemejaCat.id,
			images: ['kemeja_ecommers.png', 'kemeja_1.png', 'kemeja_2.png', 'kemeja_3.png', 'kemeja_4.png', 'kemeja_5.png', 'kemeja_7.png']
		},
		{
			name: 'Kemeja Cakra Lime', slug: 'kemeja-cakra-lime',
			desc: 'Kemeja cakra tenun ikat dengan warna lime yang cerah.',
			price: 375000, cat: kemejaCat.id,
			images: ['kemeja_lime_1.png', 'kemeja_lime_2.png', 'kemeja_lime_3.png']
		},
		{
			name: 'Kemeja Cakra Violet', slug: 'kemeja-cakra-violet',
			desc: 'Kemeja cakra tenun ikat varian violet dengan motif elegan.',
			price: 375000, cat: kemejaCat.id,
			images: ['kemeja_violet_1.png', 'kemeja_violet_2.png', 'kemeja_violet_3.png']
		}
	]

	// Delete old products & images first
	await prisma.productImage.deleteMany()
	await prisma.product.deleteMany()

	for (const p of products) {
		const product = await prisma.product.create({
			data: {
				name: p.name,
				slug: p.slug,
				description: p.desc,
				price: p.price,
				categoryId: p.cat,
				tags: 'tenun,ikat,jepara',
				isFeatured: p.featured ?? false,
				isNewArrival: p.newArrival ?? false,
				stock: 50,
				isActive: true
			}
		})

		for (let i = 0; i < p.images.length; i++) {
			await prisma.productImage.create({
				data: {
					url: img(p.images[i]),
					alt: `${p.name} ${i === 0 ? '' : `- Foto ${i + 1}`}`.trim(),
					sortOrder: i,
					productId: product.id
				}
			})
		}
	}

	const { hashSync } = await import('bcryptjs')
	await prisma.user.upsert({
		where: { email: 'admin@ikitenun.com' },
		update: {},
		create: {
			email: 'admin@ikitenun.com',
			name: 'Admin IKI TENUN',
			passwordHash: hashSync('admin123', 10),
			role: 'admin'
		}
	})

	console.log(`Seeded ${products.length} products, ${products.reduce((s, p) => s + p.images.length, 0)} images`)
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect())
