import { prisma } from '$lib/server/db'
import type { Prisma } from '@prisma/client'

/**
 * Merge anonymous cart into logged-in user's cart.
 * Anonymous items keyed by `anonId` are moved to `userId`.
 * Duplicates (same productId+variantId) get quantity summed.
 */
export async function mergeCarts(anonId: string, userId: string): Promise<void> {
	const anonItems = await prisma.cartItem.findMany({
		where: { sessionId: anonId }
	})
	if (anonItems.length === 0) return

	const userItems = await prisma.cartItem.findMany({
		where: { sessionId: userId }
	})
	const userMap = new Map(
		userItems.map(i => [`${i.productId}:${i.variantId}`, i])
	)

	const ops: Prisma.PrismaPromise<unknown>[] = []

	for (const item of anonItems) {
		const key = `${item.productId}:${item.variantId}`
		const existing = userMap.get(key)
		if (existing) {
			// Sum quantity, delete anonymous row
			ops.push(
				prisma.cartItem.update({
					where: { id: existing.id },
					data: { quantity: existing.quantity + item.quantity }
				}),
				prisma.cartItem.delete({ where: { id: item.id } })
			)
		} else {
			// Reassign anonymous row to user
			ops.push(
				prisma.cartItem.update({
					where: { id: item.id },
					data: { sessionId: userId }
				})
			)
		}
	}

	if (ops.length > 0) {
		await prisma.$transaction(ops)
	}
}
