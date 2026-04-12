interface ProgressBarProps {
  current: number;
  total: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-5",
} as const;

export function ProgressBar({
  current,
  total,
  size = "md",
  showLabel = false,
  className = "",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  const isComplete = current >= total;

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-xs text-poe-text-dim mb-1">
          <span>
            {current} / {total}
          </span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`poe-progress-frame ${size === "lg" ? "poe-progress-frame-lg" : ""} ${sizeClasses[size]}`}>
        <div
          className={`poe-progress-bar ${isComplete ? "poe-progress-bar-complete" : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
