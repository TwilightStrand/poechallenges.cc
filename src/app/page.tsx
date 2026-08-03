import { ChallengeTracker } from "@/components/ChallengeTracker";
import { ShaderBackground } from "@/components/ShaderBackground";
import { guides as staticGuides } from "@/data/guides";
import { defaultLeagueId, leagues } from "@/data/leagues";
import { loadGuides } from "@/lib/guides-content";

export default function HomePage() {
	const guides = loadGuides(leagues, staticGuides);

	return (
		<>
			<ShaderBackground />
			<ChallengeTracker
				leagues={leagues}
				guides={guides}
				defaultLeagueId={defaultLeagueId}
			/>
		</>
	);
}
