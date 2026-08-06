// GGG require an identifiable User-Agent on every request to their API, in the
// form `OAuth {clientId}/{version} (contact: {contact})`. Requests that do not
// identify themselves risk being rate-limited or blocked, so this is the single
// place that builds it.
const VERSION = "1.0.0";

// Falls back to the repository rather than a personal address, so the default
// is a real contact point even if POE_CONTACT_EMAIL is unset.
const FALLBACK_CONTACT = "https://github.com/TwilightStrand/poechallenges.cc";

export function poeUserAgent() {
	const clientId = process.env.POE_CLIENT_ID || "poechallenges";
	const contact = process.env.POE_CONTACT_EMAIL || FALLBACK_CONTACT;

	return `OAuth ${clientId}/${VERSION} (contact: ${contact})`;
}
