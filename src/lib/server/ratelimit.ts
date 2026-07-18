/**
 * Simple in-memory rate limiter.
 * Tracks attempts per key within a time window.
 */

interface RateLimitEntry {
	count: number
	resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
	const now = Date.now()
	for (const [key, entry] of store) {
		if (entry.resetAt < now) store.delete(key)
	}
}, 5 * 60 * 1000)

/**
 * Check if a key has exceeded the rate limit.
 * Returns true if the request is allowed, false if rate limited.
 */
export function checkRateLimit(
	key: string,
	maxAttempts: number,
	windowMs: number
): boolean {
	const now = Date.now()
	const entry = store.get(key)

	if (!entry || entry.resetAt < now) {
		store.set(key, { count: 1, resetAt: now + windowMs })
		return true
	}

	if (entry.count >= maxAttempts) {
		return false
	}

	entry.count++
	return true
}

/**
 * Get remaining attempts and reset time for a key.
 */
export function getRateLimitInfo(key: string): { remaining: number; resetAt: number } | null {
	const entry = store.get(key)
	if (!entry || entry.resetAt < Date.now()) return null
	return { remaining: Math.max(0, 5 - entry.count), resetAt: entry.resetAt }
}
