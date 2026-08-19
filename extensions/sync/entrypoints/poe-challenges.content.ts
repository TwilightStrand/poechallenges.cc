import { sendMessage } from "@/lib/messages";
import { parseChallenges } from "@/lib/parse-challenges";

export default defineContentScript({
	matches: ["*://*.pathofexile.com/account/view-profile/*/challenges*"],
	runAt: "document_idle",
	main() {
		const result = parseChallenges(document, window.location.href);
		sendMessage("challengesParsed", result);
	},
});
