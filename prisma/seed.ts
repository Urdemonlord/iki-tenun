import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({
	url: 'file:./dev.db'
})
const prisma = new PrismaClient({ adapter })

async function main() {
	const [dress, blazer, set, premium] = await Promise.all([
		prisma.category.upsert({
			where: { slug: 'dress' },
			update: {},
			create: { name: 'Dress', slug: 'dress', sortOrder: 1 }
		}),
		prisma.category.upsert({
			where: { slug: 'blazer' },
			update: {},
			create: { name: 'Blazer', slug: 'blazer', sortOrder: 2 }
		}),
		prisma.category.upsert({
			where: { slug: 'set' },
			update: {},
			create: { name: 'Set Tenun', slug: 'set', sortOrder: 3 }
		}),
		prisma.category.upsert({
			where: { slug: 'premium' },
			update: {},
			create: { name: 'Premium Collection', slug: 'premium', sortOrder: 4 }
		})
	])

	const products = [
		{ name: 'Anna Dress', slug: 'anna-dress', desc: 'Dress tenun ikat dengan motif tradisional Jepara. Potongan modern yang elegan, cocok untuk acara formal maupun kasual.', price: 430000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98z-lspug7zq2ix24c-600x783.webp', tags: 'dress,tenun,ikat,jepara', featured: true },
		{ name: 'Arum Dress', slug: 'arum-dress', desc: 'Dress tenun ikat Arum dengan perpaduan warna cerah dan motif eksklusif.', price: 449000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk7-mb1xj5dc4co41d-600x783.webp', tags: 'dress,tenun,ikat,jepara', newArrival: true },
		{ name: 'Becca Dress', slug: 'becca-dress', desc: 'Dress tenun ikat Becca dengan desain simpel namun berkelas.', price: 405000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98y-lsptngi3f7zb01-600x783.webp', tags: 'dress,tenun,ikat,jepara' },
		{ name: 'Berlin Dress Black', slug: 'berlin-dress-black', desc: 'Berlin Dress - IKATAN SERIES. Tenun ikat premium dengan sentuhan kontemporer.', price: 428000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/10/9-600x783.png', tags: 'dress,tenun,ikat,jepara,ikatan-series', newArrival: true },
		{ name: 'Berlin Dress Red', slug: 'berlin-dress-red', desc: 'Berlin Dress - IKATAN SERIES warna merah. Tenun ikat premium dengan warna berani.', price: 428000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/10/10-600x783.png', tags: 'dress,tenun,ikat,jepara,ikatan-series', newArrival: true },
		{ name: 'Claudia Dress', slug: 'claudia-dress', desc: 'Dress tenun ikat Claudia dengan potongan A-line yang flattering.', price: 375000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-23010-c4umr6iim8lv75-600x783.webp', tags: 'dress,tenun,ikat,jepara' },
		{ name: 'Dara Dress', slug: 'dara-dress', desc: 'Dress tenun ikat Dara dengan motif modern yang ringan dan nyaman.', price: 390000, cat: dress.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98y-lw8um1ncpi6zc7-600x783.webp', tags: 'dress,tenun,ikat,jepara', newArrival: true },
		{ name: 'Aura Blazer', slug: 'aura-blazer', desc: 'Blazer tenun ikat Aura. Potongan tailored yang memberikan kesan profesional.', price: 485000, cat: blazer.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7r98s-lw8tx77vlk3hda-600x783.webp', tags: 'blazer,tenun,ikat,jepara', featured: true },
		{ name: 'Bamma Blazer', slug: 'bamma-blazer', desc: 'Blazer tenun ikat Bamma dengan motif klasik.', price: 438000, cat: blazer.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk9-mb1vit2d7d3y86-600x783.webp', tags: 'blazer,tenun,ikat,jepara' },
		{ name: 'Dirgayu Blazer', slug: 'dirgayu-blazer', desc: 'Blazer tenun ikat Dirgayu dengan desain elegan.', price: 495000, cat: blazer.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/6-600x783.png', tags: 'blazer,tenun,ikat,jepara' },
		{ name: 'Callin Set Tenun', slug: 'callin-set-tenun', desc: 'Set tenun ikat Callin - atasan dan bawahan senada.', price: 530000, cat: set.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rask-m1i1xsqnyytrad-600x783.webp', tags: 'set,tenun,ikat,jepara', featured: true },
		{ name: 'Corra Set Tenun', slug: 'corra-set-tenun', desc: 'Set tenun ikat Corra dengan kombinasi motif modern dan tradisional.', price: 485000, cat: set.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7ras8-m2lvylvqb7x1e6@resize_w900_nl-600x783.webp', tags: 'set,tenun,ikat,jepara' },
		{ name: 'Dinara Set Tenun', slug: 'dinara-set-tenun', desc: 'Set tenun ikat Dinara - perpaduan warna earthy tone dengan motif Rajawali.', price: 625000, cat: set.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7rbk5-m71r6l0vt2t8c4-600x783.webp', tags: 'set,tenun,ikat,jepara' },
		{ name: 'Cempaka Black', slug: 'cempaka-black', desc: 'Premium collection - Tenun ikat eksklusif dengan finishing premium.', price: 728000, cat: premium.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7ra0t-mcwb9v90pd7r77-600x783.webp', tags: 'premium,tenun,ikat,jepara', featured: true },
		{ name: 'Cempaka White', slug: 'cempaka-white', desc: 'Premium collection - Tenun ikat eksklusif warna putih gading.', price: 728000, cat: premium.id, img: 'https://ikitenun.com/wp-content/uploads/2025/08/id-11134207-7ra0m-mcwc3axc1c54bd-600x783.webp', tags: 'premium,tenun,ikat,jepara' }
	]

	for (const p of products) {
		const product = await prisma.product.upsert({
			where: { slug: p.slug },
			update: {
				name: p.name,
				description: p.desc,
				price: p.price,
				categoryId: p.cat,
				tags: p.tags,
				isFeatured: p.featured ?? false,
				isNewArrival: p.newArrival ?? false,
				stock: 50,
				isActive: true
			},
			create: {
				name: p.name,
				slug: p.slug,
				description: p.desc,
				price: p.price,
				categoryId: p.cat,
				tags: p.tags,
				isFeatured: p.featured ?? false,
				isNewArrival: p.newArrival ?? false,
				stock: 50,
				isActive: true
			}
		})

		// Delete existing images and recreate
		await prisma.productImage.deleteMany({ where: { productId: product.id } })
		await prisma.productImage.create({
			data: { url: p.img, alt: p.name, sortOrder: 0, productId: product.id }
		})
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

	console.log(`Seeded ${products.length} products, 4 categories, 1 user`)
}

main()
	.catch(console.error)
	.finally(() => prisma.$disconnect())
