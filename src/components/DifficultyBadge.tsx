import type { Difficulty } from "@/schemas";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

const labels: Record<Difficulty, string> = {
  "very-easy": "Very Easy",
  easy: "Easy",
  normal: "Normal",
  hard: "Hard",
  "very-hard": "Very Hard",
};

const colorClasses: Record<Difficulty, string> = {
  "very-easy": "bg-diff-very-easy/20 text-diff-very-easy border-diff-very-easy/40",
  easy: "bg-diff-easy/20 text-diff-easy border-diff-easy/40",
  normal: "bg-diff-normal/20 text-diff-normal border-diff-normal/40",
  hard: "bg-diff-hard/20 text-diff-hard border-diff-hard/40",
  "very-hard": "bg-diff-very-hard/20 text-diff-very-hard border-diff-very-hard/40",
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[difficulty]}`}
    >
      {labels[difficulty]}
    </span>
  );
}
