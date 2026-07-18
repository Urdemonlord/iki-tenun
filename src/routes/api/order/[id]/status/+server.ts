import { prisma } from '$lib/server/db'
import { getPaymentStatus } from '$lib/server/kommerce-payment'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Lightweight status poll endpoint for order payment status.
 * Used by the order page to auto-refresh payment status.
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
		select: { id: true, status: true, paymentStatus: true, paymentRef: true, userId: true }
	})

	if (!order) throw error(404, 'Order not found')

	// Ownership check
	if (order.userId && locals.user && order.userId !== locals.user.id) {
		throw error(403, 'Access denied')
	}

	// If payment is pending and we have a ref, check Kommerce status
	let paymentDetails = null
	if (order.paymentRef && order.paymentStatus === 'pending') {
		try {
			const status = await getPaymentStatus(order.paymentRef)
			paymentDetails = {
				vaNumber: status.vaNumber,
				bankCode: status.bankCode,
				amount: status.merchantReceives || status.amount,
				expiredAt: status.expiredAt,
				qrString: status.paymentType === 'qris' ? status.vaNumber : ''
			}

			// Sync status if payment is already completed
			if (status.status !== 'PENDING') {
				const newStatus = mapKommerceStatus(status.status)
				await prisma.order.update({
					where: { id: order.id },
					data: {
						paymentStatus: newStatus.paymentStatus,
						status: newStatus.orderStatus
					}
				})
				return json({
					status: newStatus.orderStatus,
					paymentStatus: newStatus.paymentStatus,
					paymentDetails
				})
			}
		} catch (e) {
			// Ignore — payment may not be created yet
		}
	}

	return json({
		status: order.status,
		paymentStatus: order.paymentStatus,
		paymentDetails
	})
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
