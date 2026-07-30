"use client";

import { useMemo } from "react";
import Markdown from "react-markdown";
import { usePrices } from "@/hooks/usePrices";
import { getTradeLink } from "@/lib/trade-links";
import type {
	Challenge,
	ChallengeGuide,
	ChallengeProgress,
	SubtaskProgress,
} from "@/schemas";
import styles from "./ChallengeDetail.module.css";
import { CounterInput } from "./CounterInput";
import { SubtaskItem } from "./SubtaskItem";

interface ChallengeDetailProps {
	challenge: Challenge;
	guide?: ChallengeGuide;
	progress: ChallengeProgress;
	onToggleSubtask: (subtaskId: string) => void;
	onSetCounter: (value: number) => void;
	onSetSubtaskCounter: (subtaskId: string, value: number) => void;
	leagueName?: string;
	ninjaLeague?: string;
	leagueId?: string;
	isLoggedIn?: boolean;
}

function findSubtaskProgress(
	subtasks: SubtaskProgress[],
	subtaskId: string,
): SubtaskProgress {
	return (
		subtasks.find((sp) => sp.id === subtaskId) ?? {
			id: subtaskId,
			completed: false,
		}
	);
}

export function ChallengeDetail({
	challenge,
	guide,
	progress,
	onToggleSubtask,
	onSetCounter,
	onSetSubtaskCounter,
	leagueName = "Mirage",
	ninjaLeague,
	leagueId = "mirage",
	isLoggedIn = false,
}: ChallengeDetailProps) {
	const subtaskIds = challenge.subtasks.map((s) => s.id);
	const completedIds = useMemo(
		() =>
			new Set(progress.subtasks.filter((s) => s.completed).map((s) => s.id)),
		[progress.subtasks],
	);

	const { prices, loading, hasPrices, cheapest, totalCostForCheapest } =
		usePrices(
			ninjaLeague ?? leagueName,
			leagueId,
			challenge.id,
			subtaskIds,
			completedIds,
			challenge.required,
		);

	// Generate trade links for all subtasks
	const tradeLinks = useMemo(() => {
		const links = new Map<string, ReturnType<typeof getTradeLink>>();
		for (const subtask of challenge.subtasks) {
			const link = getTradeLink(subtask.name, leagueName);
			if (link) {
				links.set(subtask.id, link);
			}
		}
		return links;
	}, [challenge.subtasks, leagueName]);

	return (
		<div className="px-4 pb-4 pt-2 space-y-4">
			{/* Description */}
			{challenge.description && (
				<p className={`${styles.description} text-sm leading-relaxed`}>
					{challenge.description}
				</p>
			)}

			{/* Counter challenges have no subtasks to tick, so the tally itself is
			    the only thing a player can edit */}
			{challenge.type === "counter" && (
				<div className="flex items-center justify-between gap-3 rounded border border-poe-border bg-poe-bg-panel px-3 py-2">
					<span className="text-xs font-semibold uppercase tracking-wider text-poe-gold-light">
						Progress
					</span>
					<CounterInput
						value={progress.completed}
						target={challenge.required}
						label={challenge.name}
						name={`challenge-${leagueId}-${challenge.id}`}
						onChange={onSetCounter}
						showMax
					/>
				</div>
			)}

			{/* Calculator breakdown for counter challenges */}
			{guide?.calculator &&
				challenge.type === "counter" &&
				progress.completed < challenge.required &&
				(() => {
					const remaining = challenge.required - progress.completed;
					return (
						<div className="rounded border border-poe-border bg-poe-bg-panel px-3 py-2">
							<p className="text-xs text-poe-text-bright mb-1">
								<span className="text-poe-gold-bright font-semibold">
									{remaining.toLocaleString()}
								</span>
								<span className="text-poe-text-dim"> remaining</span>
							</p>
							<div className="flex flex-wrap gap-x-4 gap-y-0.5">
								{guide.calculator.map((calc) => (
									<span key={calc.label} className="text-xs text-poe-text-dim">
										~
										<span className="text-poe-text">
											{Math.ceil(remaining / calc.divisor).toLocaleString()}
										</span>{" "}
										{calc.label}
									</span>
								))}
							</div>
						</div>
					);
				})()}

			{/* Price summary for pick challenges */}
			{hasPrices && !loading && cheapest.size > 0 && (
				<div className="rounded border border-poe-gold/30 bg-poe-gold/5 px-3 py-2">
					<p className="text-xs text-poe-gold-light">
						Cheapest path to completion:{" "}
						<span className="font-semibold text-poe-gold-bright">
							~{Math.round(totalCostForCheapest)} chaos
						</span>
						<span className="text-poe-text-dim ml-1">
							({cheapest.size} remaining)
						</span>
					</p>
				</div>
			)}
			{hasPrices && loading && (
				<p className="text-xs text-poe-text-dim">Fetching prices...</p>
			)}

			{/* Subtasks — 2-col grid matching in-game panel */}
			{challenge.subtasks.length > 0 && (
				<div>
					<h4 className="text-xs font-semibold uppercase tracking-wider text-poe-gold-light mb-2">
						Subtasks ({progress.completed}/{challenge.required})
					</h4>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0.5">
						{challenge.subtasks.map((subtask) => {
							const price = prices.get(subtask.id);
							const isRecommended = cheapest.has(subtask.id);
							const tradeLink = tradeLinks.get(subtask.id) ?? undefined;
							return (
								<SubtaskItem
									key={subtask.id}
									subtask={subtask}
									progress={findSubtaskProgress(progress.subtasks, subtask.id)}
									onToggle={() => onToggleSubtask(subtask.id)}
									onSetCounter={(value) =>
										onSetSubtaskCounter(subtask.id, value)
									}
									price={price}
									recommended={isRecommended}
									tradeLink={tradeLink}
									isLoggedIn={isLoggedIn}
									leagueId={leagueId}
								/>
							);
						})}
					</div>
				</div>
			)}

			{/* Guide tips */}
			{guide?.tips && (
				<div className="border-t border-poe-border-subtle pt-3">
					<h4 className="text-xs font-semibold uppercase tracking-wider text-poe-gold-light mb-2">
						Guide
					</h4>
					{guide.estimatedHours !== undefined && (
						<p className="text-xs text-poe-text-dim mb-2">
							Estimated time: ~{guide.estimatedHours}h
						</p>
					)}
					<div className={`${styles.guideContent} text-sm text-poe-text`}>
						<Markdown>{guide.tips}</Markdown>
					</div>
					{guide.videoUrl && (
						<a
							href={guide.videoUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1.5 mt-2 text-xs text-poe-gold hover:text-poe-gold-bright transition-colors"
						>
							<svg
								aria-hidden="true"
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="currentColor"
							>
								<path d="M8 5v14l11-7z" />
							</svg>
							Video Guide
						</a>
					)}
				</div>
			)}
		</div>
	);
}
