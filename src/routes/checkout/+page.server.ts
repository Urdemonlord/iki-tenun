import { prisma } from '$lib/server/db'
import { redirect, fail } from '@sveltejs/kit'
import { createTransaction } from '$lib/server/midtrans'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const items = await prisma.cartItem.findMany({
		where: { sessionId: locals.cartId },
		include: { product: true }
	})
	if (items.length === 0) throw redirect(302, '/cart')

	const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
	return { items, subtotal }
}

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData()
		const name = form.get('name') as string
		const phone = form.get('phone') as string
		const address = form.get('address') as string
		const city = form.get('city') as string
		const province = form.get('province') as string
		const zip = form.get('zip') as string
		const notes = form.get('notes') as string
		const email = (form.get('email') as string) || undefined
		const shippingCourier = form.get('shipping_courier') as string || ''
		const shippingService = form.get('shipping_service') as string || ''
		const shippingCost = parseInt(form.get('shipping_cost') as string) || 0

		if (!name || !phone || !address || !city || !province || !zip) {
			return fail(400, { error: 'Semua field alamat harus diisi' })
		}

		const items = await prisma.cartItem.findMany({
			where: { sessionId: locals.cartId },
			include: { product: true }
		})
		if (items.length === 0) throw redirect(302, '/cart')

		const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
		const total = subtotal + shippingCost
		const userId = locals.user?.id

		let orderId: string
		try {
			orderId = await prisma.$transaction(async (tx) => {
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
						shippingCourier: shippingCourier || null,
						shippingService: shippingService || null,
						shippingCost,
						notes: notes || null,
						paymentMethod: 'midtrans',
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

				for (const item of items) {
					await tx.product.update({
						where: { id: item.productId },
						data: { stock: { decrement: item.quantity } }
					})
				}

				await tx.cartItem.deleteMany({ where: { sessionId: locals.cartId } })
				return order.id
			}, { timeout: 5000 })
		} catch (e: any) {
			return fail(400, { error: e instanceof Error ? e.message : 'Gagal membuat pesanan' })
		}

		// Create Midtrans Snap transaction
		try {
			const snapResult = await createTransaction({
				orderId,
				amount: total,
				items: items.map(i => ({
					id: i.productId,
					name: i.product.name,
					price: i.product.price,
					quantity: i.quantity
				})),
				customer: {
					name,
					phone,
					email,
					address,
					city,
					postalCode: zip
				}
			})
			throw redirect(303, snapResult.redirectUrl)
		} catch (e: any) {
			if (e instanceof Response) throw e
			console.error('[checkout] Midtrans error:', e?.message || e)
			throw redirect(302, `/order/${orderId}?payment_error=1`)
		}
	}
}