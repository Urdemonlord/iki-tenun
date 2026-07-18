import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'
import type { Product } from '$lib/utils/types'

const PAGE_SIZE = 8

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category')
	const q = url.searchParams.get('q')
	const sort = url.searchParams.get('sort') || 'newest'
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))

	const categories = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } })

	// Resolve category slug → id
	let categoryId: string | null = null
	if (category) {
		const cat = categories.find(c => c.slug === category)
		if (cat) categoryId = cat.id
	}

	const sortField = (() => {
		switch (sort) {
			case 'price_asc': return 'p.price ASC'
			case 'price_desc': return 'p.price DESC'
			case 'oldest': return 'p.created_at ASC'
			default: return 'p.created_at DESC'
		}
	})()

	if (q) {
		const like = `%${q}%`
		const rawSort = `CASE WHEN p.name LIKE ? THEN 0 ELSE 1 END, ${sortField}`
		const offset = (page - 1) * PAGE_SIZE

		const catFilter = categoryId ? 'AND p.category_id = ?' : ''
		const catParam = categoryId ? [categoryId] : []

		const rows = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
			`SELECT p.* FROM Product p
			 WHERE p.is_active = 1
			   ${catFilter}
			   AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)
			 ORDER BY ${rawSort}
			 LIMIT ? OFFSET ?`,
			...catParam, like, like, like, PAGE_SIZE, offset
		)

		const countResult = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
			`SELECT COUNT(*) as cnt FROM Product p
			 WHERE p.is_active = 1
			   ${catFilter}
			   AND (p.name LIKE ? OR p.description LIKE ? OR p.tags LIKE ?)`,
			...catParam, like, like, like
		)
		const total = Number(countResult[0]?.cnt || 0)

		const ids = rows.map(r => String(r.id))
		const imgs = await prisma.productImage.findMany({
			where: { productId: { in: ids } },
			orderBy: { sortOrder: 'asc' }
		})
		const imgMap = new Map<string, typeof imgs>()
		for (const img of imgs) {
			const arr = imgMap.get(img.productId) || []
			arr.push(img)
			imgMap.set(img.productId, arr)
		}
		const catMap = new Map(categories.map(c => [c.id, c]))

		const products = rows.map(r => ({
			...r,
			images: (imgMap.get(String(r.id)) || []).slice(0, 1),
			category: catMap.get(String(r.category_id || r.categoryId)) || null
		})) as unknown as Product[]

		const totalPages = Math.ceil(total / PAGE_SIZE)
		return { products, categories, activeCategory: category, query: q, sort, page, totalPages, total }
	}

	const where: Record<string, unknown> = { isActive: true }
	if (categoryId) where.categoryId = categoryId
	const orderBy = (() => {
		switch (sort) {
			case 'price_asc': return { price: 'asc' as const }
			case 'price_desc': return { price: 'desc' as const }
			case 'oldest': return { createdAt: 'asc' as const }
			default: return { createdAt: 'desc' as const }
		}
	})()

	const [products, count] = await Promise.all([
		prisma.product.findMany({
			where,
			include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, category: true },
			orderBy,
			skip: (page - 1) * PAGE_SIZE,
			take: PAGE_SIZE
		}),
		prisma.product.count({ where })
	])

	const totalPages = Math.ceil(count / PAGE_SIZE)
	return { products: products as unknown as Product[], categories, activeCategory: category, query: q, sort, page, totalPages, total: count }
}
