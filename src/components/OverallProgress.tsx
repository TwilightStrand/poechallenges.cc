import type { Reward } from "@/schemas";
import { ProgressBar } from "./ProgressBar";

interface OverallProgressProps {
  completedCount: number;
  totalCount: number;
  rewards: Reward[];
}

const rewardTypeLabels: Record<Reward["type"], string> = {
  armor: "MTX",
  trophy: "Trophy",
};

export function OverallProgress({
  completedCount,
  totalCount,
  rewards,
}: OverallProgressProps) {
  return (
    <div className="px-6 py-4">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-heading text-poe-text-dim text-sm tracking-widest uppercase">
          Challenges Completed
        </h2>
        <span className="font-heading">
          <span className="text-poe-gold-bright text-2xl">{completedCount}</span>
          <span className="text-poe-text-dim text-lg"> / {totalCount}</span>
        </span>
      </div>

      <div className="relative">
        <ProgressBar
          current={completedCount}
          total={totalCount}
          size="lg"
        />

        {/* Reward milestone markers */}
        <div className="relative h-5 mt-1.5">
          {rewards.map((reward) => {
            const position =
              totalCount > 0 ? (reward.at / totalCount) * 100 : 0;
            const reached = completedCount >= reward.at;

            return (
              <div
                key={reward.at}
                className="absolute -translate-x-1/2 flex flex-col items-center group"
                style={{ left: `${position}%` }}
              >
                {/* Diamond marker */}
                <div
                  className={`w-2.5 h-2.5 rotate-45 border transition-colors ${
                    reached
                      ? "bg-poe-green border-poe-green-dim"
                      : "bg-poe-bg-panel border-poe-border"
                  }`}
                  style={reached ? { boxShadow: "0 0 6px rgba(72,168,66,0.4)" } : {}}
                />
                {/* Count label */}
                <span className={`text-[10px] mt-0.5 ${reached ? "text-poe-green" : "text-poe-text-dim"}`}>
                  {reward.at}
                </span>

                {/* Tooltip on hover */}
                <div className="absolute top-8 hidden group-hover:block z-10 whitespace-nowrap">
                  <div className="bg-poe-bg-darkest border border-poe-border rounded px-2 py-1 text-xs text-poe-text shadow-lg">
                    <span className="text-poe-gold mr-1">[{rewardTypeLabels[reward.type]}]</span>
                    {reward.reward}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
