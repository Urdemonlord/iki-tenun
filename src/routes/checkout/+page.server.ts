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

		const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
		const userId = locals.user?.id

		// Atomic: validate stock + create order + decrement stock + clear cart
		let orderId: string
		try {
			orderId = await prisma.$transaction(async (tx) => {
				// Validate stock inside transaction (atomic read)
				for (const item of items) {
					const product = await tx.product.findUnique({
						where: { id: item.productId },
						select: { stock: true, name: true }
					})
					if (!product || product.stock < item.quantity) {
						throw new Error(
							`Stok tidak cukup: ${product?.name ?? item.productId} ` +
							`(tersedia ${product?.stock ?? 0}, diminta ${item.quantity})`
						)
					}
				}

				// Create order + items
				const order = await tx.order.create({
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
					await tx.product.update({
						where: { id: item.productId },
						data: { stock: { decrement: item.quantity } }
					})
				}

				// Clear cart
				await tx.cartItem.deleteMany({ where: { sessionId: locals.cartId } })

				return order.id
			}, {
				timeout: 5000
			})
		} catch (e: any) {
			const message = e instanceof Error ? e.message : 'Gagal membuat pesanan'
			return fail(400, { error: message })
		}

		throw redirect(302, `/order/${orderId}`)
	}
}