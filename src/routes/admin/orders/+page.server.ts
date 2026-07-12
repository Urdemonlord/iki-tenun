import { prisma } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

const PAGE_SIZE = 20

export const load: PageServerLoad = async ({ url }) => {
	const page = Math.max(1, parseInt(url.searchParams.get('page') || '1'))
	const total = await prisma.order.count()

	const orders = await prisma.order.findMany({
		include: { user: true, items: true },
		orderBy: { createdAt: 'desc' },
		skip: (page - 1) * PAGE_SIZE,
		take: PAGE_SIZE
	})

	return { orders, page, totalPages: Math.ceil(total / PAGE_SIZE) }
}
