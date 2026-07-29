"use client";

import { useEffect, useRef, useState } from "react";
import type { Challenge, ChallengeGuide, ChallengeProgress } from "@/schemas";
import { CategoryBadge } from "./CategoryBadge";
import styles from "./ChallengeCard.module.css";
import { ChallengeDetail } from "./ChallengeDetail";
import { CompletionIcon } from "./CompletionIcon";
import { DifficultyBadge } from "./DifficultyBadge";
import { ProgressBar } from "./ProgressBar";

interface ChallengeCardProps {
	challenge: Challenge;
	guide?: ChallengeGuide;
	progress: ChallengeProgress;
	onToggleSubtask: (subtaskId: string) => void;
	leagueName?: string;
	ninjaLeague?: string;
	leagueId?: string;
	isLoggedIn?: boolean;
}

export function ChallengeCard({
	challenge,
	guide,
	progress,
	onToggleSubtask,
	leagueName,
	ninjaLeague,
	leagueId,
	isLoggedIn,
}: ChallengeCardProps) {
	const [expanded, setExpanded] = useState(false);
	const [contentHeight, setContentHeight] = useState(0);
	const contentRef = useRef<HTMLDivElement>(null);

	// The panel animates via max-height, so it needs the content's real height.
	// Measuring once is not enough: prices load in asynchronously and change it,
	// which left the expanded panel clipped. Observing the element re-measures on
	// any change without guessing at effect dependencies.
	useEffect(() => {
		const element = contentRef.current;
		if (!element) return;

		const measure = () => setContentHeight(element.scrollHeight);
		measure();

		const observer = new ResizeObserver(measure);
		observer.observe(element);
		return () => observer.disconnect();
	}, []);

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
					<svg
						width="16"
						height="16"
						viewBox="0 0 14 14"
						fill="none"
						className="shrink-0 text-[#5a9e58]"
					>
						<title>Complete</title>
						<path
							d="M2 7.5L5.5 11L12 3.5"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				) : (
					<svg
						width="16"
						height="16"
						viewBox="0 0 14 14"
						fill="none"
						className="shrink-0 text-[#c04040]"
					>
						<title>Incomplete</title>
						<path
							d="M3 3L11 11M11 3L3 11"
							stroke="currentColor"
							strokeWidth="2.5"
							strokeLinecap="round"
						/>
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
						ninjaLeague={ninjaLeague}
						leagueId={leagueId}
						isLoggedIn={isLoggedIn}
					/>
				</div>
			</div>
		</div>
	);
}
