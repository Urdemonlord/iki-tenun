import { env } from '$env/dynamic/private'

const BASE_URL = 'https://rajaongkir.komerce.id/api/v1'
const API_KEY = env.RAJAONGKIR_API_KEY || ''

function auth() {
	if (!API_KEY) throw new Error('RAJAONGKIR_API_KEY not configured')
	return { key: API_KEY }
}

export interface RajaOngkirDestination {
	id: string
	name: string
	type: string
	province: string
	city: string
	district: string
	subdistrict: string
}

export interface RajaOngkirCostOption {
	courier: string
	courierName: string
	service: string
	description: string
	cost: number
	etd: string
}

export interface RajaOngkirCostResult {
	origin: RajaOngkirDestination
	destination: RajaOngkirDestination
	costs: RajaOngkirCostOption[]
}

/**
 * Search for a domestic destination (city/district) by name.
 * Used for autocomplete/search in checkout.
 */
export async function searchDestination(query: string): Promise<RajaOngkirDestination[]> {
	const res = await fetch(
		`${BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(query)}&limit=10&offset=0`,
		{ headers: auth() }
	)
	const data = await res.json()
	if (!res.ok) throw new Error(`RajaOngkir search error: ${data.message || res.status}`)
	return data.data || []
}

/**
 * Calculate domestic shipping cost.
 * Uses direct-search method (subdistrict IDs).
 */
export async function calculateCost(
	originId: string,
	destinationId: string,
	weight: number,
	courier: string
): Promise<RajaOngkirCostResult> {
	const body = {
		origin: originId,
		destination: destinationId,
		weight,
		courier
	}

	const res = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			...auth()
		},
		body: JSON.stringify(body)
	})

	const data = await res.json()
	if (!res.ok) throw new Error(`RajaOngkir cost error: ${data.message || res.status}`)
	return data.data
}

/**
 * Get available couriers for cost calculation.
 */
export const COURIERS = [
	{ id: 'jne', name: 'JNE' },
	{ id: 'tiki', name: 'TIKI' },
	{ id: 'pos', name: 'Pos Indonesia' },
	{ id: 'sicepat', name: 'SiCepat' },
	{ id: 'jnt', name: 'J&T' },
	{ id: 'anteraja', name: 'AnterAja' },
	{ id: 'wahana', name: 'Wahana' },
	{ id: 'lion', name: 'Lion Parcel' },
	{ id: 'grab', name: 'Grab Instant' },
	{ id: 'gosend', name: 'GoSend' },
]