import { prisma } from '$lib/server/db'
import { redirect, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const items = await prisma.cartItem.findMany({
		where: { sessionId: locals.cartId },
		include: { product: true }
	})
	if (items.length === 0) throw redirect(302, '/cart')

	const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
	return { items, total }
}

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const form = await request.formData()
		const name = form.get('name') as string
		const phone = form.get('phone') as string
		const address = form.get('address') as string
		const city = form.get('city') as string
		const province = form.get('province') as string
		const zip = form.get('zip') as string
		const notes = form.get('notes') as string

		if (!name || !phone || !address || !city || !province || !zip) {
			return fail(400, { error: 'Semua field alamat harus diisi' })
		}

		const items = await prisma.cartItem.findMany({
			where: { sessionId: locals.cartId },
			include: { product: true }
		})
		if (items.length === 0) throw redirect(302, '/cart')

		// Validate stock before creating order
		const stockErrors = items
			.map(i => ({ name: i.product.name, available: i.product.stock, requested: i.quantity }))
			.filter(i => i.requested > i.available)
		if (stockErrors.length > 0) {
			return fail(400, {
				error: `Stok tidak cukup: ${stockErrors.map(s => `${s.name} (tersedia ${s.available}, diminta ${s.requested})`).join(', ')}`
			})
		}

		const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
		const userId = locals.user?.id

		const order = await prisma.order.create({
			data: {
				userId,
				status: 'pending',
				total,
				shippingName: name,
				shippingPhone: phone,
				shippingAddress: address,
				shippingCity: city,
				shippingProvince: province,
				shippingZip: zip,
				notes: notes || null,
				paymentMethod: 'bank_transfer',
				paymentStatus: 'pending',
				items: {
					create: items.map(i => ({
						productName: i.product.name,
						price: i.product.price,
						quantity: i.quantity
					}))
				}
			}
		})

		// Decrement stock
		for (const item of items) {
			await prisma.product.update({
				where: { id: item.productId },
				data: { stock: { decrement: item.quantity } }
			})
		}

		// Clear cart
		await prisma.cartItem.deleteMany({ where: { sessionId: locals.cartId } })

		throw redirect(302, `/order/${order.id}`)
	}
}
