import { ChallengeTracker } from "@/components/ChallengeTracker";
import { guides } from "@/data/guides";
import { defaultLeagueId, leagues } from "@/data/leagues";

export default function HomePage() {
	return (
		<ChallengeTracker
			leagues={leagues}
			guides={guides}
			defaultLeagueId={defaultLeagueId}
		/>
	);
}
