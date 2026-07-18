import { prisma } from '$lib/server/db'
import { getPaymentStatus } from '$lib/server/kommerce-payment'
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

	// Fetch Komerce payment details if we have a ref
	let paymentDetails = null
	if (order.paymentRef && order.paymentStatus === 'pending') {
		try {
			paymentDetails = await getPaymentStatus(order.paymentRef)
			// Sync status if payment is already completed
			if (paymentDetails.status !== 'PENDING' && order.paymentStatus === 'pending') {
				const newStatus = mapKommerceStatus(paymentDetails.status)
				await prisma.order.update({
					where: { id: order.id },
					data: {
						paymentStatus: newStatus.paymentStatus,
						status: newStatus.orderStatus
					}
				})
				order.paymentStatus = newStatus.paymentStatus
				order.status = newStatus.orderStatus
			}
		} catch (e) {
			// Payment not found yet or API error — ignore, user may have just created order
		}
	}

	return { order: { ...order, total: order.total }, paymentError, paymentDetails }
}

function mapKommerceStatus(status: string): { paymentStatus: string; orderStatus: string } {
	switch (status) {
		case 'PAID':
			return { paymentStatus: 'paid', orderStatus: 'processing' }
		case 'EXPIRED':
		case 'CANCELED':
		case 'FAILED':
			return { paymentStatus: 'failed', orderStatus: 'cancelled' }
		default:
			return { paymentStatus: 'pending', orderStatus: 'pending' }
	}
}
