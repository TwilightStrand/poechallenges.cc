import { ChallengeTracker } from "@/components/ChallengeTracker";
import { guides as staticGuides } from "@/data/guides";
import { defaultLeagueId, leagues } from "@/data/leagues";
import { loadGuides } from "@/lib/guides-content";

export default function HomePage() {
	// Server component, so the markdown in content/guides is read at build time
	// and handed to the client tracker as plain data, exactly as before.
	const guides = loadGuides(leagues, staticGuides);

	return (
		<ChallengeTracker
			leagues={leagues}
			guides={guides}
			defaultLeagueId={defaultLeagueId}
		/>
	);
}
