import styles from "./ProgressBar.module.css";

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
      <div className={`${styles.frame} ${size === "lg" ? styles.frameLg : ""} ${sizeClasses[size]}`}>
        <div
          className={`${styles.bar} ${isComplete ? styles.barComplete : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
