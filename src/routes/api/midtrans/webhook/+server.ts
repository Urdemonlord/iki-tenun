import { prisma } from '$lib/server/db'
import { verifySignature, getTransactionStatus } from '$lib/server/midtrans'
import { env } from '$env/dynamic/private'
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Midtrans webhook notification handler.
 * Midtrans sends POST with transaction status updates.
 * We verify the signature, then update our Order accordingly.
 */
export const POST: RequestHandler = async ({ request }) => {
	const SERVER_KEY = env.MIDTRANS_SERVER_KEY || ''

	if (!SERVER_KEY) {
		console.error('[midtrans-webhook] MIDTRANS_SERVER_KEY not set')
		throw error(500, 'Server key not configured')
	}

	const body = await request.json()
	const {
		order_id: orderId,
		status_code: statusCode,
		gross_amount: grossAmount,
		signature_key: signatureKey,
		transaction_status: txStatus,
		payment_type: paymentType,
		fraud_status: fraudStatus
	} = body

	// Verify signature
	const valid = verifySignature(
		orderId,
		statusCode,
		grossAmount,
		SERVER_KEY,
		signatureKey
	)
	if (!valid) {
		console.error('[midtrans-webhook] Invalid signature for order', orderId)
		throw error(403, 'Invalid signature')
	}

	// Map Midtrans status to our internal status
	let paymentStatus = 'pending'
	let orderStatus = 'pending'

	switch (txStatus) {
		case 'capture':
		case 'settlement':
			paymentStatus = 'paid'
			orderStatus = 'processing'
			break
		case 'pending':
			paymentStatus = 'pending'
			orderStatus = 'pending'
			break
		case 'deny':
		case 'expire':
		case 'cancel':
			paymentStatus = 'failed'
			orderStatus = 'cancelled'
			break
		case 'refund':
			paymentStatus = 'refunded'
			orderStatus = 'cancelled'
			break
		default:
			paymentStatus = 'pending'
	}

	// For credit card, check fraud status
	if (fraudStatus === 'fraud') {
		paymentStatus = 'failed'
		orderStatus = 'cancelled'
	}

	// Double-check by fetching status from Midtrans API
	try {
		const apiStatus = await getTransactionStatus(orderId)
		if (apiStatus.transaction_status !== txStatus) {
			console.warn('[midtrans-webhook] Status mismatch: webhook=%s, API=%s', txStatus, apiStatus.transaction_status)
		}
	} catch (e) {
		console.warn('[midtrans-webhook] Failed to verify via API:', e)
	}

	// Update order in DB
	const order = await prisma.order.findUnique({ where: { id: orderId } })
	if (!order) {
		console.error('[midtrans-webhook] Order not found:', orderId)
		throw error(404, 'Order not found')
	}

	await prisma.order.update({
		where: { id: orderId },
		data: {
			paymentStatus,
			status: orderStatus,
			paymentMethod: paymentType || order.paymentMethod
		}
	})

	// If payment failed/cancelled, restore stock
	if (paymentStatus === 'failed' || paymentStatus === 'refunded') {
		const items = await prisma.orderItem.findMany({ where: { orderId } })
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

	console.log(`[midtrans-webhook] Order ${orderId}: ${paymentStatus} / ${orderStatus}`)

	return json({ status: 'ok' })
}