import { env } from '$env/dynamic/private'

const API_KEY = env.KOMMERCE_PAYMENT_KEY || ''
const IS_PRODUCTION = env.KOMMERCE_PAYMENT_PRODUCTION === 'true'

const BASE_URL = IS_PRODUCTION
	? 'https://api.collaborator.komerce.id/user'
	: 'https://api-sandbox.collaborator.komerce.id/user'

const API = `${BASE_URL}/api/v1/user/payment`

function headers(): Record<string, string> {
	if (!API_KEY) throw new Error('KOMMERCE_PAYMENT_KEY not configured')
	return {
		'x-api-key': API_KEY,
		'Content-Type': 'application/json'
	}
}

export interface PaymentChannel {
	code: string
	name: string
	type: 'bank_transfer' | 'qris' | 'ewallet'
}

/** Supported payment channels (Komerce Payment) */
export const CHANNELS: PaymentChannel[] = [
	{ code: 'BCA', name: 'BCA Virtual Account', type: 'bank_transfer' },
	{ code: 'BNI', name: 'BNI Virtual Account', type: 'bank_transfer' },
	{ code: 'BRI', name: 'BRI Virtual Account', type: 'bank_transfer' },
	{ code: 'MANDIRI', name: 'Mandiri Virtual Account', type: 'bank_transfer' },
	{ code: 'QRIS', name: 'QRIS', type: 'qris' },
]

export interface PaymentItem {
	name: string
	price: number
	quantity: number
}

export interface PaymentCustomer {
	name: string
	email: string
	phone: string
}

export interface CreatePaymentParams {
	orderId: string
	amount: number
	channelCode: string
	paymentType: 'bank_transfer' | 'qris'
	customer: PaymentCustomer
	items: PaymentItem[]
}

export interface CreatePaymentResult {
	paymentId: string
	externalId: string
	paymentUrl: string
	vaNumber: string
	qrString: string
	bankCode: string
	bankName: string
	amount: number
	status: string
	expiredAt: string
	createdAt: string
}

export interface PaymentStatus {
	paymentId: string
	orderId: string
	bankCode: string
	vaNumber: string
	amount: number
	merchantReceives: number
	paymentType: string
	status: 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELED' | 'FAILED'
	senderName: string
	expiredAt: string
	createdAt: string
	paidAt: string
	cancelReason: string
	canceledAt: string
}

/**
 * Create a new payment (VA or QRIS).
 */
export async function createPayment(params: CreatePaymentParams): Promise<CreatePaymentResult> {
	if (!API_KEY) throw new Error('KOMMERCE_PAYMENT_KEY not configured')

	const body = {
		order_id: params.orderId,
		payment_type: params.paymentType,
		channel_code: params.channelCode,
		amount: params.amount,
		customer: {
			name: params.customer.name,
			email: params.customer.email,
			phone: params.customer.phone
		},
		items: params.items.map(i => ({
			name: i.name,
			price: i.price,
			quantity: i.quantity
		}))
	}

	const res = await fetch(`${API}/create`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify(body)
	})

	const data = await res.json()
	if (!res.ok || data.meta?.code !== 200) {
		throw new Error(`Komerce payment error: ${data.meta?.message || data.message || res.status}`)
	}

	const d = data.data
	return {
		paymentId: d.payment_id,
		externalId: d.external_id,
		paymentUrl: d.payment_url,
		vaNumber: d.va_number || '',
		qrString: d.qr_string || '',
		bankCode: d.bank_code || '',
		bankName: d.bank_name || '',
		amount: d.amount,
		status: d.status,
		expiredAt: d.expired_at,
		createdAt: d.created_at
	}
}

/**
 * Get payment status by payment ID.
 */
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
	if (!API_KEY) throw new Error('KOMMERCE_PAYMENT_KEY not configured')

	const res = await fetch(`${API}/status/${encodeURIComponent(paymentId)}`, {
		headers: headers()
	})

	const data = await res.json()
	if (!res.ok || data.meta?.code !== 200) {
		throw new Error(`Komerce status error: ${data.meta?.message || data.message || res.status}`)
	}

	const d = data.data
	return {
		paymentId: d.payment_id,
		orderId: d.order_id,
		bankCode: d.bank_code || '',
		vaNumber: d.va_number || '',
		amount: d.amount,
		merchantReceives: d.merchant_receives || d.amount,
		paymentType: d.payment_type || '',
		status: d.status as PaymentStatus['status'],
		senderName: d.sender_name || '',
		expiredAt: d.expired_at || '',
		createdAt: d.created_at || '',
		paidAt: d.paid_at || '',
		cancelReason: d.cancel_reason || '',
		canceledAt: d.canceled_at || ''
	}
}

/**
 * Cancel a pending payment.
 */
export async function cancelPayment(paymentId: string): Promise<{ status: string; reason: string }> {
	if (!API_KEY) throw new Error('KOMMERCE_PAYMENT_KEY not configured')

	const res = await fetch(`${API}/cancel`, {
		method: 'POST',
		headers: headers(),
		body: JSON.stringify({ payment_id: paymentId })
	})

	const data = await res.json()
	if (!res.ok || data.meta?.code !== 200) {
		throw new Error(`Komerce cancel error: ${data.meta?.message || data.message || res.status}`)
	}

	return {
		status: data.data.status,
		reason: data.data.reason || ''
	}
}

/**
 * Find a channel by code.
 */
export function findChannel(code: string): PaymentChannel | undefined {
	return CHANNELS.find(c => c.code === code.toUpperCase())
}
