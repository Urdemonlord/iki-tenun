import { prisma } from '$lib/server/db'
import { getPaymentStatus } from '$lib/server/kommerce-payment'
import { env } from '$env/dynamic/private'
import { createHmac } from 'crypto'
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const WEBHOOK_SECRET = env.KOMMERCE_WEBHOOK_SECRET || ''

/**
 * Komerce Payment webhook / callback handler.
 * Komerce sends POST when payment status changes.
 */
export const POST: RequestHandler = async ({ request }) => {
	const rawBody = await request.text()
	let body: any
	try {
		body = JSON.parse(rawBody)
	} catch {
		throw error(400, 'Invalid JSON body')
	}

	// Verify webhook signature if secret is configured
	if (WEBHOOK_SECRET) {
		const signature = request.headers.get('x-kmerce-signature')
			|| request.headers.get('x-callback-signature')
			|| request.headers.get('signature')
			|| body.signature

		if (signature) {
			const expected = createHmac('sha256', WEBHOOK_SECRET)
				.update(rawBody)
				.digest('hex')

			if (signature !== expected) {
				console.error('[kommerce-webhook] Invalid signature')
				throw error(403, 'Invalid signature')
			}
		} else {
			console.warn('[kommerce-webhook] No signature header found — accepting unverified')
		}
	}

	const { payment_id: paymentId, status, order_id: orderId } = body

	if (!paymentId) {
		throw error(400, 'Missing payment_id in webhook body')
	}

	console.log(`[kommerce-webhook] Received: payment=${paymentId}, status=${status}, order=${orderId}`)

	// Double-check status from Kommerce API
	let verifiedStatus: string
	try {
		const apiStatus = await getPaymentStatus(paymentId)
		verifiedStatus = apiStatus.status
	} catch (e) {
		console.error('[kommerce-webhook] Failed to verify payment status:', e)
		throw error(400, 'Could not verify payment status')
	}

	// Find the order by paymentRef
	const order = await prisma.order.findFirst({
		where: { paymentRef: paymentId }
	})

	if (!order) {
		console.error('[kommerce-webhook] Order not found for payment:', paymentId)
		throw error(404, 'Order not found for this payment')
	}

	// Map status
	const newStatus = mapKommerceStatus(verifiedStatus)

	await prisma.order.update({
		where: { id: order.id },
		data: {
			paymentStatus: newStatus.paymentStatus,
			status: newStatus.orderStatus
		}
	})

	// If payment failed/cancelled, restore stock
	if (newStatus.paymentStatus === 'failed') {
		const items = await prisma.orderItem.findMany({ where: { orderId: order.id } })
		for (const item of items) {
			const product = await prisma.product.findFirst({
				where: { name: item.productName }
			})
			if (product) {
				await prisma.product.update({
					where: { id: product.id },
					data: { stock: { increment: item.quantity } }
				})
			}
		}
	}

	console.log(`[kommerce-webhook] Order ${order.id}: ${newStatus.paymentStatus} / ${newStatus.orderStatus}`)

	return json({ status: 'ok' })
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
