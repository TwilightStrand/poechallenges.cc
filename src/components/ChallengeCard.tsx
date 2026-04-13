"use client";

import { useState, useRef, useEffect } from "react";
import type { Challenge, ChallengeGuide, ChallengeProgress } from "@/schemas";
import { CompletionIcon } from "./CompletionIcon";
import { DifficultyBadge } from "./DifficultyBadge";
import { CategoryBadge } from "./CategoryBadge";
import { ProgressBar } from "./ProgressBar";
import { ChallengeDetail } from "./ChallengeDetail";
import styles from "./ChallengeCard.module.css";

interface ChallengeCardProps {
  challenge: Challenge;
  guide?: ChallengeGuide;
  progress: ChallengeProgress;
  onToggleSubtask: (subtaskId: string) => void;
  leagueName?: string;
  leagueId?: string;
  isLoggedIn?: boolean;
}

export function ChallengeCard({
  challenge,
  guide,
  progress,
  onToggleSubtask,
  leagueName,
  leagueId,
  isLoggedIn,
}: ChallengeCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, progress]);

  const isComplete = progress.isComplete;
  const cardClasses = `${styles.card} rounded-lg overflow-hidden ${isComplete ? styles.complete : ""}`;

  return (
    <div className={cardClasses}>
      {/* Header row */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer"
      >
        <CompletionIcon complete={isComplete} size="md" />

        <span className="flex-1 min-w-0">
          <span className="font-heading text-poe-gold-light font-semibold text-sm truncate block">
            {challenge.name}
          </span>
        </span>

        {guide && (
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <DifficultyBadge difficulty={guide.difficulty} />
            <CategoryBadge category={guide.category} />
          </div>
        )}

        <span
          className={`text-sm font-medium whitespace-nowrap shrink-0 ${isComplete ? "text-[#5a9e58]" : "text-[#c04040]"}`}
        >
          {progress.completed}/{challenge.required}
        </span>

        {/* Status icon — green ✓ if complete, red × if incomplete */}
        {isComplete ? (
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#5a9e58]">
            <path d="M2 7.5L5.5 11L12 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 14 14" fill="none" className="shrink-0 text-[#c04040]">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <ProgressBar
          current={progress.completed}
          total={challenge.required}
          size="sm"
        />
      </div>

      {/* Animated expand/collapse */}
      <div
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? `${contentHeight + 50}px` : "0px" }}
      >
        <div ref={contentRef}>
          {/* Mobile badges */}
          {guide && (
            <div className="flex items-center gap-1.5 px-4 pb-2 sm:hidden">
              <DifficultyBadge difficulty={guide.difficulty} />
              <CategoryBadge category={guide.category} />
            </div>
          )}

          <ChallengeDetail
            challenge={challenge}
            guide={guide}
            progress={progress}
            onToggleSubtask={onToggleSubtask}
            leagueName={leagueName}
            leagueId={leagueId}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </div>
    </div>
  );
}
