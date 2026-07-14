import { prisma } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Lightweight status poll endpoint for order payment status.
 * Used by the order page to auto-refresh payment status.
 */
export const GET: RequestHandler = async ({ params, locals }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
		select: { id: true, status: true, paymentStatus: true, userId: true }
	})

	if (!order) throw error(404, 'Order not found')

	// Ownership check
	if (order.userId && locals.user && order.userId !== locals.user.id) {
		throw error(403, 'Access denied')
	}

	return json({
		status: order.status,
		paymentStatus: order.paymentStatus
	})
}