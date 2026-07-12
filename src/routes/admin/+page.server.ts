import { prisma } from '$lib/server/db'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const [totalProducts, totalOrders, totalUsers, recentOrders, totalRevenue] = await Promise.all([
		prisma.product.count(),
		prisma.order.count(),
		prisma.user.count(),
		prisma.order.findMany({
			include: { user: true, items: true },
			orderBy: { createdAt: 'desc' },
			take: 5
		}),
		prisma.order.aggregate({ _sum: { total: true } })
	])

	return {
		stats: { totalProducts, totalOrders, totalUsers, revenue: totalRevenue._sum.total || 0 },
		recentOrders
	}
}
