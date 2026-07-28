import type { FilteredChallenge } from "@/hooks/useFilters";
import { ChallengeCard } from "./ChallengeCard";

interface ChallengeListProps {
	items: FilteredChallenge[];
	onToggleSubtask: (challengeId: number, subtaskId: string) => void;
	leagueName?: string;
	leagueId?: string;
	isLoggedIn?: boolean;
}

export function ChallengeList({
	items,
	onToggleSubtask,
	leagueName,
	leagueId,
	isLoggedIn,
}: ChallengeListProps) {
	if (items.length === 0) {
		return (
			<div className="text-center py-12 text-poe-text-dim">
				<p className="text-lg">No challenges found.</p>
			</div>
		);
	}

	return (
		<div className="space-y-0.5">
			{items.map((item) => (
				<ChallengeCard
					key={item.challenge.id}
					challenge={item.challenge}
					guide={item.guide}
					progress={item.progress}
					onToggleSubtask={(subtaskId) =>
						onToggleSubtask(item.challenge.id, subtaskId)
					}
					leagueName={leagueName}
					leagueId={leagueId}
					isLoggedIn={isLoggedIn}
				/>
			))}
		</div>
	);
}
