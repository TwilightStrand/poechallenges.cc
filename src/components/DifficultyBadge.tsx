"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Difficulty, TimeInvestment } from "@/schemas";

interface DifficultyBadgeProps {
	difficulty: Difficulty;
	timeInvestment?: TimeInvestment;
}

const labels: Record<Difficulty, string> = {
	"very-easy": "Very Easy",
	easy: "Easy",
	normal: "Normal",
	hard: "Hard",
	"very-hard": "Very Hard",
};

const descriptions: Record<Difficulty, string> = {
	"very-easy": "Completes during normal play",
	easy: "Minimal effort needed",
	normal: "Some deliberate work",
	hard: "Needs a plan and investment",
	"very-hard": "Build-dependent, high investment",
};

const timeLabels: Record<TimeInvestment, string> = {
	minimal: "Quick",
	short: "Short",
	moderate: "Moderate",
	long: "Long",
	extreme: "Extreme",
};

const timeDescriptions: Record<TimeInvestment, string> = {
	minimal: "Barely any time needed",
	short: "Quick to finish",
	moderate: "Takes some sessions",
	long: "Significant time commitment",
	extreme: "Major grind",
};

const colorClasses: Record<Difficulty, string> = {
	"very-easy":
		"bg-diff-very-easy/20 text-diff-very-easy border-diff-very-easy/40",
	easy: "bg-diff-easy/20 text-diff-easy border-diff-easy/40",
	normal: "bg-diff-normal/20 text-diff-normal border-diff-normal/40",
	hard: "bg-diff-hard/20 text-diff-hard border-diff-hard/40",
	"very-hard":
		"bg-diff-very-hard/20 text-diff-very-hard border-diff-very-hard/40",
};

const diffDotColor: Record<Difficulty, string> = {
	"very-easy": "bg-diff-very-easy",
	easy: "bg-diff-easy",
	normal: "bg-diff-normal",
	hard: "bg-diff-hard",
	"very-hard": "bg-diff-very-hard",
};

const timeDotColor: Record<TimeInvestment, string> = {
	minimal: "bg-diff-very-easy",
	short: "bg-diff-easy",
	moderate: "bg-diff-normal",
	long: "bg-diff-hard",
	extreme: "bg-diff-very-hard",
};

const timeColorClasses: Record<TimeInvestment, string> = {
	minimal: "bg-diff-very-easy/20 text-diff-very-easy border-diff-very-easy/40",
	short: "bg-diff-easy/20 text-diff-easy border-diff-easy/40",
	moderate: "bg-diff-normal/20 text-diff-normal border-diff-normal/40",
	long: "bg-diff-hard/20 text-diff-hard border-diff-hard/40",
	extreme:
		"bg-diff-very-hard/20 text-diff-very-hard border-diff-very-hard/40",
};

const diffTextColor: Record<Difficulty, string> = {
	"very-easy": "text-diff-very-easy",
	easy: "text-diff-easy",
	normal: "text-diff-normal",
	hard: "text-diff-hard",
	"very-hard": "text-diff-very-hard",
};

const timeTextColor: Record<TimeInvestment, string> = {
	minimal: "text-diff-very-easy",
	short: "text-diff-easy",
	moderate: "text-diff-normal",
	long: "text-diff-hard",
	extreme: "text-diff-very-hard",
};

const equivalentTime: Record<Difficulty, TimeInvestment> = {
	"very-easy": "minimal",
	easy: "short",
	normal: "moderate",
	hard: "long",
	"very-hard": "extreme",
};

function PopoverContent({
	difficulty,
	timeInvestment,
	anchorRect,
}: {
	difficulty: Difficulty;
	timeInvestment: TimeInvestment;
	anchorRect: DOMRect;
}) {
	const left = anchorRect.left + anchorRect.width / 2;
	const top = anchorRect.top - 8;

	return createPortal(
		<div
			className="fixed z-[9999] pointer-events-none"
			style={{ left, top, transform: "translate(-50%, -100%)" }}
		>
			<div className="bg-poe-bg-dark border border-poe-border rounded-lg px-3 py-2 shadow-lg text-xs whitespace-nowrap">
				<div className="flex items-center gap-2 mb-0.5">
					<span className={`inline-block w-2 h-2 rounded-full ${diffDotColor[difficulty]}`} />
					<span className={`font-medium ${diffTextColor[difficulty]}`}>
						Difficulty: {labels[difficulty]}
					</span>
				</div>
				<div className="text-poe-text-dim ml-4 mb-1.5">{descriptions[difficulty]}</div>
				<div className="flex items-center gap-2 mb-0.5">
					<span className={`inline-block w-2 h-2 rounded-full ${timeDotColor[timeInvestment]}`} />
					<span className={`font-medium ${timeTextColor[timeInvestment]}`}>
						Time: {timeLabels[timeInvestment]}
					</span>
				</div>
				<div className="text-poe-text-dim ml-4">{timeDescriptions[timeInvestment]}</div>
			</div>
		</div>,
		document.body,
	);
}

export function DifficultyBadge({
	difficulty,
	timeInvestment,
}: DifficultyBadgeProps) {
	const [showPopover, setShowPopover] = useState(false);
	const [sticky, setSticky] = useState(false);
	const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
	const ref = useRef<HTMLSpanElement>(null);
	const hideTimeout = useRef<ReturnType<typeof setTimeout>>(null);

	const effectiveTime = timeInvestment ?? equivalentTime[difficulty];
	const isDivergent = effectiveTime !== equivalentTime[difficulty];

	const updateRect = useCallback(() => {
		if (ref.current) setAnchorRect(ref.current.getBoundingClientRect());
	}, []);

	const show = useCallback(() => {
		if (hideTimeout.current) clearTimeout(hideTimeout.current);
		updateRect();
		setShowPopover(true);
	}, [updateRect]);

	const hide = useCallback(() => {
		if (sticky) return;
		hideTimeout.current = setTimeout(() => setShowPopover(false), 150);
	}, [sticky]);

	const toggle = useCallback((e: React.MouseEvent) => {
		e.stopPropagation();
		updateRect();
		setSticky((prev) => {
			if (prev) {
				setShowPopover(false);
				return false;
			}
			setShowPopover(true);
			return true;
		});
	}, [updateRect]);

	useEffect(() => {
		if (!sticky) return;
		const close = () => {
			setSticky(false);
			setShowPopover(false);
		};
		document.addEventListener("click", close);
		return () => document.removeEventListener("click", close);
	}, [sticky]);

	const pill = isDivergent ? (
		<span className="inline-flex items-center text-xs font-medium">
			<span
				className={`px-2 py-0.5 rounded-l-full border border-r-0 ${colorClasses[difficulty]}`}
			>
				{labels[difficulty]}
			</span>
			<span
				className={`px-2 py-0.5 rounded-r-full border ${timeColorClasses[effectiveTime]}`}
			>
				{timeLabels[effectiveTime]}
			</span>
		</span>
	) : (
		<span
			className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses[difficulty]}`}
		>
			{labels[difficulty]}
		</span>
	);

	return (
		<span
			ref={ref}
			className="relative inline-flex cursor-default"
			onMouseEnter={show}
			onMouseLeave={hide}
			onClick={toggle}
		>
			{pill}
			{showPopover && anchorRect && (
				<PopoverContent
					difficulty={difficulty}
					timeInvestment={effectiveTime}
					anchorRect={anchorRect}
				/>
			)}
		</span>
	);
}
