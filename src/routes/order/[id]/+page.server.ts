import { prisma } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
		include: { items: true }
	})

	if (!order) throw error(404, 'Pesanan tidak ditemukan')

	// Ownership check: logged-in users can only see their own orders;
	// guest orders (userId null) are accessible to anyone (no session binding)
	if (order.userId && locals.user && order.userId !== locals.user.id) {
		throw error(403, 'Akses ditolak')
	}

	return { order }
}