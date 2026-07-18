import { env } from '$env/dynamic/private'

const BASE_URL = 'https://rajaongkir.komerce.id/api/v1'
const API_KEY = env.RAJAONGKIR_API_KEY || ''

function auth(): Record<string, string> {
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
	zip_code: string
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
	raw: Array<Record<string, unknown>>
}

/**
 * Helper: build form-encoded body string
 */
function formEncode(data: Record<string, string | number>): string {
	return Object.entries(data)
		.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
		.join('&')
}

/**
 * Search for a domestic destination (city/district) by name.
 * Used for autocomplete/search in checkout.
 * V2 API returns subdistrict-level results.
 */
export async function searchDestination(query: string): Promise<RajaOngkirDestination[]> {
	const res = await fetch(
		`${BASE_URL}/destination/domestic-destination?search=${encodeURIComponent(query)}&limit=10&offset=0`,
		{ headers: auth() }
	)
	const data = await res.json()
	if (!res.ok) throw new Error(`RajaOngkir search error: ${data.meta?.message || data.message || res.status}`)

	const items = data.data || []
	return items.map((item: any) => ({
		id: String(item.id || ''),
		name: item.label || item.name || '',
		type: item.type || 'subdistrict',
		province: item.province_name || item.province || '',
		city: item.city_name || item.city || '',
		district: item.district_name || item.district || '',
		subdistrict: item.subdistrict_name || item.subdistrict || '',
		zip_code: item.zip_code || ''
	}))
}

/**
 * Calculate domestic shipping cost.
 * V2 API uses form-encoded POST body and returns a flat array.
 */
export async function calculateCost(
	originId: string,
	destinationId: string,
	weight: number,
	courier: string
): Promise<RajaOngkirCostResult> {
	const body = formEncode({
		origin: originId,
		destination: destinationId,
		weight,
		courier
	})

	const res = await fetch(`${BASE_URL}/calculate/domestic-cost`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			...auth()
		},
		body
	})

	const data = await res.json()
	if (!res.ok) throw new Error(`RajaOngkir cost error: ${data.meta?.message || data.message || res.status}`)

	const items: any[] = data.data || []
	const costs: RajaOngkirCostOption[] = items.map((item: any) => ({
		courier: item.code || item.courier || '',
		courierName: item.name || item.courierName || '',
		service: item.service || '',
		description: item.description || '',
		cost: Number(item.cost) || 0,
		etd: item.etd ? String(item.etd).replace(' day', '').replace(' days', '') + ' hari' : ''
	}))

	return {
		origin: {} as RajaOngkirDestination, // V2 doesn't return origin/destination in cost response
		destination: {} as RajaOngkirDestination,
		costs,
		raw: items
	}
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
