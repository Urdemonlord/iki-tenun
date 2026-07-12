import { prisma } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const orders = await prisma.order.findMany({
		include: { user: true, items: true },
		orderBy: { createdAt: 'desc' }
	})
	return { orders }
}
