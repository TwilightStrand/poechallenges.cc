import { leagues, defaultLeagueId } from "@/data/leagues";
import { guides } from "@/data/guides";
import { ChallengeTracker } from "@/components/ChallengeTracker";

export default function HomePage() {
  return (
    <ChallengeTracker
      leagues={leagues}
      guides={guides}
      defaultLeagueId={defaultLeagueId}
    />
  );
}
