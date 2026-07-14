import { prisma } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
		include: { items: true }
	})

	if (!order) throw error(404, 'Pesanan tidak ditemukan')

	// Ownership check
	if (order.userId && locals.user && order.userId !== locals.user.id) {
		throw error(403, 'Akses ditolak')
	}

	const paymentError = url.searchParams.has('payment_error')

	return { order, paymentError }
}