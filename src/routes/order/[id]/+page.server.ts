import { prisma } from '$lib/server/db'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const order = await prisma.order.findUnique({
		where: { id: params.id },
		include: { items: true }
	})

	if (!order) throw error(404, 'Pesanan tidak ditemukan')

	return { order }
}
