import type { Reward } from "@/schemas";

interface OverallProgressProps {
  completedCount: number;
  totalCount: number;
  rewards: Reward[];
}

export function OverallProgress({
  completedCount,
  totalCount,
  rewards,
}: OverallProgressProps) {
  // Find the next reward to earn
  const nextReward = rewards.find((r) => r.at > completedCount);
  const bannerText = nextReward
    ? `You will earn ${nextReward.reward} as you complete challenges.`
    : "All challenge rewards earned — congratulations!";

  const percentage = totalCount > 0 ? Math.min((completedCount / totalCount) * 100, 100) : 0;

  return (
    <div className="px-6 py-4">
      <div className="flex items-start gap-3">
        {/* Reward icon placeholder — small chest/trophy-style SVG */}
        <div className="shrink-0 mt-0.5">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="chest-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d8a850" />
                <stop offset="100%" stopColor="#8b6a28" />
              </linearGradient>
            </defs>
            <rect x="4" y="12" width="24" height="16" rx="1" fill="url(#chest-gold)" stroke="#3a2a10" strokeWidth="1" />
            <path d="M4 16 Q16 6, 28 16" fill="url(#chest-gold)" stroke="#3a2a10" strokeWidth="1" />
            <rect x="14" y="18" width="4" height="3" fill="#3a2a10" />
            <circle cx="16" cy="19.5" r="0.8" fill="#d8a850" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-poe-text-bright leading-tight mb-2">
            {bannerText}
          </p>

          {/* Inline progress bar with reward tick markers */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <div className="poe-progress-frame poe-progress-frame-lg h-4">
                <div
                  className="poe-progress-bar h-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Reward milestone tick marks */}
              {rewards.map((reward) => {
                const position = (reward.at / totalCount) * 100;
                const reached = completedCount >= reward.at;
                return (
                  <div
                    key={reward.at}
                    className="absolute top-0 bottom-0 w-0.5 group"
                    style={{ left: `${position}%` }}
                    title={`${reward.at} — ${reward.reward}`}
                  >
                    <div
                      className={`h-full w-full ${reached ? "bg-poe-green" : "bg-poe-gold-bright/60"}`}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute top-full mt-1 left-1/2 -translate-x-1/2 hidden group-hover:block z-10 whitespace-nowrap">
                      <div className="bg-poe-bg-darkest border border-poe-border rounded px-2 py-1 text-xs text-poe-text shadow-lg">
                        <span className="text-poe-gold mr-1">{reward.at}</span>
                        {reward.reward}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <span className="shrink-0 font-heading text-poe-gold-bright text-lg">
              {completedCount}
              <span className="text-poe-text-dim text-sm">/{totalCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
