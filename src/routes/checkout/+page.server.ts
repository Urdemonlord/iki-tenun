import { prisma } from '$lib/server/db'
import { redirect, fail } from '@sveltejs/kit'
import { lucia } from '$lib/server/auth'
import type { Actions, PageServerLoad } from './$types'
import { hashSync } from 'bcryptjs'
import { randomUUID } from 'crypto'

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

		// Auto-create guest user if not logged in
		let userId = locals.user?.id
		if (!userId) {
			const guestEmail = `guest-${randomUUID().slice(0, 8)}@ikitenu.demo`
			const guest = await prisma.user.create({
				data: {
					email: guestEmail,
					name: name,
					passwordHash: hashSync(randomUUID(), 10),
					role: 'customer'
				}
			})
			userId = guest.id

			// Auto-login as guest
			const session = await lucia.createSession(userId, {})
			const sessionCookie = lucia.createSessionCookie(session.id)
			cookies.set(sessionCookie.name, sessionCookie.value, { path: '/', ...sessionCookie.attributes })
		}

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

		// Clear cart
		await prisma.cartItem.deleteMany({ where: { sessionId: locals.cartId } })

		throw redirect(302, `/order/${order.id}`)
	}
}
