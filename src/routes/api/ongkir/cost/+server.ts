import { calculateCost, COURIERS } from '$lib/server/rajaongkir'
import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * POST /api/ongkir/cost
 * Calculate domestic shipping cost.
 * Body: { originId, destinationId, weight, courier? }
 * If courier omitted, returns costs for all couriers.
 */
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json()
	const { originId, destinationId, weight, courier } = body

	if (!originId || !destinationId || !weight) {
		throw error(400, 'originId, destinationId, and weight are required')
	}

	if (weight <= 0) throw error(400, 'Weight must be positive')

	try {
		if (courier) {
			// Single courier
			const result = await calculateCost(originId, destinationId, weight, courier)
			return json({ data: result.costs })
		}

		// All couriers — fetch in parallel
		const results = await Promise.allSettled(
			COURIERS.map(c => calculateCost(originId, destinationId, weight, c.id))
		)

		const costs: Array<{ courier: string; courierName: string; service: string; description: string; cost: number; etd: string }> = []
		for (const result of results) {
			if (result.status === 'fulfilled') {
				costs.push(...result.value.costs)
			}
		}

		// Sort by cost ascending
		costs.sort((a, b) => a.cost - b.cost)

		return json({ data: costs })
	} catch (e: any) {
		const msg = e?.message || 'Cost calculation failed'
		if (msg.includes('not configured')) throw error(503, 'Shipping service not configured')
		throw error(502, msg)
	}
}