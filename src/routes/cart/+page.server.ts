import { prisma } from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const items = await prisma.cartItem.findMany({
		where: { sessionId: locals.cartId },
		include: { product: { include: { images: { take: 1 } } } }
	})
	return { items }
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		const form = await request.formData()
		const productId = form.get('productId') as string
		const qty = parseInt(form.get('quantity') as string) || 1

		const product = await prisma.product.findUnique({ where: { id: productId } })
		if (!product || !product.isActive) return fail(400, { error: 'Produk tidak ditemukan' })

		// ponytail: use '' sentinel for products without variants, null causes Prisma upsert error
		const variantId = (form.get('variantId') as string) || ''
		const existing = await prisma.cartItem.findFirst({
			where: { sessionId: locals.cartId, productId, variantId }
		})
		if (existing) {
			await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: { increment: qty } } })
		} else {
			await prisma.cartItem.create({ data: { sessionId: locals.cartId, productId, variantId, quantity: qty } })
		}
		return { success: true }
	},

	update: async ({ request, locals }) => {
		const form = await request.formData()
		const id = form.get('id') as string
		const qty = parseInt(form.get('quantity') as string)

		const item = await prisma.cartItem.findUnique({ where: { id } })
		if (!item || item.sessionId !== locals.cartId) return fail(403)

		if (qty < 1) {
			await prisma.cartItem.delete({ where: { id } })
		} else {
			await prisma.cartItem.update({ where: { id }, data: { quantity: qty } })
		}
		return { success: true }
	},

	remove: async ({ request, locals }) => {
		const form = await request.formData()
		const id = form.get('id') as string

		const item = await prisma.cartItem.findUnique({ where: { id } })
		if (!item || item.sessionId !== locals.cartId) return fail(403)

		await prisma.cartItem.delete({ where: { id } })
		return { success: true }
	}
}
