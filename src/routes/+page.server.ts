import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const [featured, newArrivals, categories] = await Promise.all([
		prisma.product.findMany({
			where: { isActive: true, isFeatured: true },
			include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, category: true },
			take: 8
		}),
		prisma.product.findMany({
			where: { isActive: true, isNewArrival: true },
			include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, category: true },
			take: 4
		}),
		prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })
	])

	// Load one product image per category for visual category cards
	const categoryImages = new Map<string, string>()
	await Promise.all(
		categories.map(async (cat) => {
			const product = await prisma.product.findFirst({
				where: { categoryId: cat.id, isActive: true },
				include: { images: { take: 1, orderBy: { sortOrder: 'asc' } } },
			})
			if (product?.images?.[0]) {
				categoryImages.set(cat.id, product.images[0].url)
			}
		})
	)

	// Blog articles (static)
	const blogArticles = [
		{
			title: 'Cara Merawat Kain Tenun agar Tetap Awet',
			slug: 'cara-merawat-tenun',
			excerpt: 'Tips praktis merawat kain tenun ikat agar warna tetap cerah dan serat tidak rusak.',
			date: '15 Juli 2026',
			image: null,
		},
		{
			title: 'Sejarah Tenun Ikat Jepara: Warisan Nusantara',
			slug: 'sejarah-tenun-jepara',
			excerpt: 'Mengenal sejarah panjang tenun ikat di Jepara dan filosofi di balik setiap motif.',
			date: '2 Juli 2026',
			image: null,
		},
		{
			title: 'Mix & Match: Outfit Tenun untuk Acara Formal',
			slug: 'mix-match-tenun-formal',
			excerpt: 'Inspirasi padu padan outfit tenun ikat untuk menghadiri pesta dan acara formal.',
			date: '20 Juni 2026',
			image: null,
		},
	]

	return { featured, newArrivals, categories, categoryImages, blogArticles }
}
