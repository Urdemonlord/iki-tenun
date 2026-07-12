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

	return { featured, newArrivals, categories }
}
