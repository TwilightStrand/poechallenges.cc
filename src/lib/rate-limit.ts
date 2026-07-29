// Deliberately generous: this exists to stop a script hammering the write
// endpoints or using the price proxy as a poe.ninja relay, not to police normal
// use. A person clicking around will never see it.
//
// In-memory and per-process, which is honest for a single-replica deployment.
// If this ever scales past one pod, each pod gets its own allowance and the
// real limiter belongs in the WAF, which already sits in front of every request.
interface Window {
	count: number;
	resetAt: number;
}

const windows = new Map<string, Window>();

// Bound the map so a flood of distinct keys cannot grow it without limit.
const MAX_KEYS = 10_000;

export interface RateLimit {
	limit: number;
	windowMs: number;
}

export const LIMITS = {
	// Proxying poe.ninja. Unauthenticated, so keyed by IP.
	prices: { limit: 600, windowMs: 60_000 },
	// Writes. Keyed by session, so one account cannot spend another's budget.
	write: { limit: 120, windowMs: 60_000 },
} satisfies Record<string, RateLimit>;

export interface RateLimitResult {
	allowed: boolean;
	remaining: number;
	retryAfterSeconds: number;
}

export function checkRateLimit(
	key: string,
	{ limit, windowMs }: RateLimit,
	now = Date.now(),
): RateLimitResult {
	const existing = windows.get(key);

	if (!existing || existing.resetAt <= now) {
		if (windows.size >= MAX_KEYS) {
			for (const [k, w] of windows) {
				if (w.resetAt <= now) windows.delete(k);
			}
			// Still full of live windows: fail open rather than lock everyone out.
			if (windows.size >= MAX_KEYS) {
				return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
			}
		}
		windows.set(key, { count: 1, resetAt: now + windowMs });
		return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
	}

	existing.count += 1;

	if (existing.count > limit) {
		return {
			allowed: false,
			remaining: 0,
			retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
		};
	}

	return {
		allowed: true,
		remaining: limit - existing.count,
		retryAfterSeconds: 0,
	};
}

// Behind Cloudflare, then the gateway, then the WAF, so the client address only
// arrives in a header. It is spoofable, which is why authenticated routes key on
// the session instead and this is reserved for anonymous ones.
export function clientKey(request: Request, scope: string) {
	const forwarded = request.headers.get("x-forwarded-for");
	const ip = forwarded?.split(",")[0]?.trim() || "unknown";
	return `${scope}:${ip}`;
}

export function tooManyRequests(result: RateLimitResult) {
	return Response.json(
		{ error: "Too many requests" },
		{
			status: 429,
			headers: { "Retry-After": String(result.retryAfterSeconds) },
		},
	);
}

// Exported for tests: lets a case start from a clean slate.
export function resetRateLimits() {
	windows.clear();
}
