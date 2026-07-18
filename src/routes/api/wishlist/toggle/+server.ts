import { prisma } from '$lib/server/db'
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * POST /api/wishlist/toggle
 * Body: { productId: string }
 * Toggles wishlist state for logged-in user.
 * Returns: { wishlisted: boolean }
 */
export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) throw error(401, 'Login required')

	const { productId } = await request.json()
	if (!productId) throw error(400, 'productId required')

	const existing = await prisma.wishlistItem.findUnique({
		where: { userId_productId: { userId: locals.user.id, productId } }
	})

	if (existing) {
		await prisma.wishlistItem.delete({ where: { id: existing.id } })
		return json({ wishlisted: false })
	} else {
		await prisma.wishlistItem.create({
			data: { userId: locals.user.id, productId }
		})
		return json({ wishlisted: true })
	}
}
