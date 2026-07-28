import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// The Dockerfile deploy needs a standalone build; Netlify's Next runtime
	// supplies its own server and serves 404s if it finds one, so skip it there.
	...(process.env.NETLIFY ? {} : { output: "standalone" as const }),
};

export default nextConfig;
