import { prisma } from '$lib/server/db'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) throw redirect(302, '/login')

	const [orders, addresses] = await Promise.all([
		prisma.order.findMany({
			where: { userId: locals.user.id },
			include: { items: true },
			orderBy: { createdAt: 'desc' }
		}),
		prisma.address.findMany({ where: { userId: locals.user.id } })
	])

	return { orders, addresses }
}
