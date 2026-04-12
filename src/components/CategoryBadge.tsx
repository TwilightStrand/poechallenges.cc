"use client";

import type { Category } from "@/schemas";

interface CategoryBadgeProps {
  category: string;
  onClick?: () => void;
  active?: boolean;
}

const labels: Record<Category, string> = {
  "early-game": "Early Game",
  "league-mechanics": "League Mechanics",
  mapping: "Mapping",
  crafting: "Crafting",
  bossing: "Bossing",
  endgame: "Endgame",
  grind: "Grind",
};

const colorClasses: Record<Category, string> = {
  "early-game": "bg-cat-early-game/20 text-cat-early-game border-cat-early-game/40",
  "league-mechanics": "bg-cat-league-mechanics/20 text-cat-league-mechanics border-cat-league-mechanics/40",
  mapping: "bg-cat-mapping/20 text-cat-mapping border-cat-mapping/40",
  crafting: "bg-cat-crafting/20 text-cat-crafting border-cat-crafting/40",
  bossing: "bg-cat-bossing/20 text-cat-bossing border-cat-bossing/40",
  endgame: "bg-cat-endgame/20 text-cat-endgame border-cat-endgame/40",
  grind: "bg-cat-grind/20 text-cat-grind border-cat-grind/40",
};

function isCategory(value: string): value is Category {
  return value in labels;
}

export function CategoryBadge({ category, onClick, active }: CategoryBadgeProps) {
  const colors = isCategory(category)
    ? colorClasses[category]
    : "bg-poe-border/20 text-poe-text-dim border-poe-border/40";

  const label = isCategory(category) ? labels[category] : category;

  const activeRing = active ? "ring-1 ring-poe-gold-light" : "";

  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors} ${activeRing} ${onClick ? "cursor-pointer hover:brightness-125 transition-all" : ""}`}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      {label}
    </Tag>
  );
}
