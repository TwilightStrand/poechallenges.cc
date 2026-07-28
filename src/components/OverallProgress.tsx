import type { Reward } from "@/schemas";

interface OverallProgressProps {
	completedCount: number;
	totalCount: number;
	rewards: Reward[];
}

const rewardTypeLabel: Record<Reward["type"], string> = {
	armor: "MTX",
	trophy: "Trophy",
};

function RewardIcon({ type }: { type: Reward["type"] }) {
	if (type === "trophy") {
		// Trophy / crown
		return (
			<svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
				<path d="M3 2h10v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V2zm3 8h4v2H6v-2zm-2 3h8v1H4v-1z" />
			</svg>
		);
	}
	// MTX / armor chest
	return (
		<svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
			<path d="M2 7h12v7H2V7zm1-4h10l1 3H2l1-3zm5 5h2v2H8V8z" />
		</svg>
	);
}

export function OverallProgress({
	completedCount,
	totalCount,
	rewards,
}: OverallProgressProps) {
	const rewardMap = new Map<number, Reward>();
	for (const r of rewards) rewardMap.set(r.at, r);

	const nextReward = rewards.find((r) => r.at > completedCount);

	return (
		<div className="px-6 py-4">
			<div className="flex items-baseline justify-between mb-1">
				<h2 className="font-heading text-poe-text-dim text-sm tracking-widest uppercase">
					Challenges Completed
				</h2>
				<span className="font-heading">
					<span className="text-poe-gold-bright text-2xl">
						{completedCount}
					</span>
					<span className="text-poe-text-dim text-lg"> / {totalCount}</span>
				</span>
			</div>

			{nextReward && (
				<p className="text-xs text-poe-text-dim mb-3">
					Next reward at{" "}
					<span className="text-poe-gold-light">{nextReward.at}</span>:{" "}
					<span className="text-poe-text">{nextReward.reward}</span>
					<span className="text-poe-text-dim">
						{" "}
						({nextReward.at - completedCount} to go)
					</span>
				</p>
			)}

			{/* 40-tick progress bar */}
			<div className="relative flex items-stretch gap-[2px] h-8 bg-poe-bg-darkest border border-poe-border rounded-sm p-1">
				{Array.from({ length: totalCount }).map((_, i) => {
					const position = i + 1;
					const completed = position <= completedCount;
					const reward = rewardMap.get(position);
					const isReward = reward !== undefined;

					return (
						<div
							key={position}
							className="relative flex-1 group"
							title={
								isReward
									? `${position}: ${reward.reward}`
									: `Challenge ${position}`
							}
						>
							{/* Tick background */}
							<div
								className={`
                  h-full rounded-[2px] flex items-center justify-center transition-colors
                  ${
										isReward
											? completed
												? "bg-gradient-to-b from-[#5aa858] to-[#2a6a28] text-poe-bg-darkest shadow-[0_0_6px_rgba(72,168,66,0.5)]"
												: "bg-gradient-to-b from-[#3a3226] to-[#1e1a14] text-poe-gold-light"
											: completed
												? "bg-gradient-to-b from-[#c07028] to-[#6a3410]"
												: "bg-[#15120e]"
									}
                `}
							>
								{isReward && <RewardIcon type={reward.type} />}
							</div>

							{/* Hover tooltip */}
							<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-20 whitespace-nowrap pointer-events-none">
								<div className="bg-poe-bg-darkest border border-poe-border rounded px-2 py-1 text-xs shadow-lg">
									{isReward ? (
										<>
											<div className="text-poe-gold mb-0.5">
												[{rewardTypeLabel[reward.type]}] at {position}
											</div>
											<div className="text-poe-text-bright">
												{reward.reward}
											</div>
										</>
									) : (
										<span className="text-poe-text-dim">
											Challenge {position}
										</span>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
