import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

const PAGE_SIZE = 8

export const load: PageServerLoad = async ({ url }) => {
	const category = url.searchParams.get('category')
	const q = url.searchParams.get('q')
	const sort = url.searchParams.get('sort') || 'newest'
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))

	const where: Record<string, unknown> = { isActive: true }
	if (category) where.category = { slug: category }
	if (q) where.OR = [
		{ name: { contains: q } },
		{ description: { contains: q } },
		{ tags: { contains: q } }
	]

	const orderBy: Record<string, string> = (() => {
		switch (sort) {
			case 'price_asc': return { price: 'asc' }
			case 'price_desc': return { price: 'desc' }
			case 'oldest': return { createdAt: 'asc' }
			default: return { createdAt: 'desc' }
		}
	})()

	const [products, categories, total] = await Promise.all([
		prisma.product.findMany({
			where,
			include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, category: true },
			orderBy,
			skip: (page - 1) * PAGE_SIZE,
			take: PAGE_SIZE
		}),
		prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
		prisma.product.count({ where })
	])

	const totalPages = Math.ceil(total / PAGE_SIZE)

	return {
		products,
		categories,
		activeCategory: category,
		query: q,
		sort,
		page,
		totalPages,
		total
	}
}
