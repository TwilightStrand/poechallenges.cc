import type { NextConfig } from "next";

// script-src and style-src need 'unsafe-inline' because Next inlines its
// hydration bootstrap and the RSC payload into the document. Removing it needs
// per-request nonces from middleware, which would make every page dynamic and
// give up the static prerender. The tradeoff is acceptable here: no page
// renders user-supplied HTML (guide prose goes through react-markdown without
// rehype-raw), so the value of the policy is blocking *external* script and
// connection origins, which it still does.
//
// poe.ninja and web.poecdn.com are in img-src because price lookups carry icon
// URLs from those hosts. Nothing renders them today, but the data layer
// produces them and a tighter policy would fail silently later.

const csp = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: https://poe.ninja https://web.poecdn.com",
	"font-src 'self' data:",
	"connect-src 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	"base-uri 'self'",
	"object-src 'none'",
	"upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
	{ key: "Content-Security-Policy", value: csp },
	// Two years, subdomains included. Deliberately no `preload`: that is a
	// hard-to-reverse commitment on the apex and every future subdomain.
	{
		key: "Strict-Transport-Security",
		value: "max-age=63072000; includeSubDomains",
	},
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	// Redundant with frame-ancestors for modern browsers, kept for old ones.
	{ key: "X-Frame-Options", value: "DENY" },
	{
		key: "Permissions-Policy",
		value: "camera=(), microphone=(), geolocation=(), payment=()",
	},
	{ key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
	// The Dockerfile deploy needs a standalone build; Netlify's Next runtime
	// supplies its own server and serves 404s if it finds one, so skip it there.
	...(process.env.NETLIFY ? {} : { output: "standalone" as const }),

	async headers() {
		if (process.env.NODE_ENV === "development") return [];
		return [{ source: "/:path*", headers: securityHeaders }];
	},
};

export default nextConfig;
