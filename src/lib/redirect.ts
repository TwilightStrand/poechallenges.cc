import { NextResponse } from "next/server";

// Absolute redirects built from request.url are wrong behind a proxy: the
// container sets HOSTNAME=0.0.0.0 so it can bind every interface, and Next's
// standalone server derives request.url from that, producing
// https://0.0.0.0:3000/... A relative Location is resolved by the browser
// against the address it actually connected to, so it works in dev, in the
// container, and behind the WAF without any base-URL config.
export function redirectTo(path: string) {
	return new NextResponse(null, {
		status: 307,
		headers: { Location: path },
	});
}
