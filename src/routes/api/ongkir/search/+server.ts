import { searchDestination } from '$lib/server/rajaongkir'
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * GET /api/ongkir/search?q=jakarta
 * Proxy for RajaOngkir destination search. Keeps API key server-side.
 */
export const GET: RequestHandler = async ({ url }) => {
	const q = url.searchParams.get('q')
	if (!q || q.length < 3) throw error(400, 'Search query must be at least 3 characters')

	try {
		const results = await searchDestination(q)
		return json({ data: results })
	} catch (e: any) {
		const msg = e?.message || 'Search failed'
		if (msg.includes('not configured')) throw error(503, 'Shipping service not configured')
		throw error(502, msg)
	}
}