"use client";

import { useEffect, useState } from "react";
import styles from "./CounterInput.module.css";

interface CounterInputProps {
	value: number;
	target: number;
	/** Names the control for screen readers; never rendered. */
	label: string;
	/** Stable form-field name. Without one the browser cannot tell these
	 *  hundreds of number fields apart for autofill or restore-on-back. */
	name: string;
	onChange: (value: number) => void;
	showMax?: boolean;
}

function clamp(value: number, target: number): number {
	if (!Number.isFinite(value)) return 0;
	return Math.min(target, Math.max(0, Math.trunc(value)));
}

const stepClasses =
	"w-5 h-5 shrink-0 flex items-center justify-center rounded border border-poe-border-subtle text-poe-text-dim transition-colors hover:text-poe-gold-light hover:border-poe-border disabled:opacity-40 disabled:hover:text-poe-text-dim disabled:hover:border-poe-border-subtle";

export function CounterInput({
	value,
	target,
	label,
	name,
	onChange,
	showMax = false,
}: CounterInputProps) {
	// A bare controlled input fights the user mid-keystroke: clearing the field
	// to retype would immediately snap back to the clamped value.
	const [draft, setDraft] = useState(() => String(value));

	// An import or a league switch replaces the value underneath us, so the
	// draft has to follow or the field keeps showing a stale number.
	useEffect(() => {
		setDraft(String(value));
	}, [value]);

	const handleDraft = (raw: string) => {
		setDraft(raw);
		if (raw.trim() === "") return;
		const parsed = Number.parseInt(raw, 10);
		if (Number.isNaN(parsed)) return;
		const next = clamp(parsed, target);
		if (next !== value) onChange(next);
	};

	return (
		<div className="flex items-center gap-1 shrink-0">
			<button
				type="button"
				onClick={() => onChange(clamp(value - 1, target))}
				disabled={value <= 0}
				aria-label={`Decrease ${label}`}
				className={stepClasses}
			>
				&minus;
			</button>

			<input
				type="number"
				name={name}
				id={name}
				inputMode="numeric"
				min={0}
				max={target}
				value={draft}
				onChange={(e) => handleDraft(e.target.value)}
				onBlur={() => setDraft(String(value))}
				aria-label={`${label} progress`}
				// Sized to the target's digit count so 50000 fits without a
				// field wide enough to look empty on a target of 3.
				style={{ width: `calc(${String(target).length}ch + 0.9rem)` }}
				className={`${styles.input} px-1 py-0.5 text-xs text-center bg-poe-bg-input border border-poe-border-subtle rounded text-poe-text focus:outline-none focus:border-poe-border-highlight`}
			/>

			<span className="text-xs text-poe-text-dim whitespace-nowrap">
				/ {target.toLocaleString()}
			</span>

			<button
				type="button"
				onClick={() => onChange(clamp(value + 1, target))}
				disabled={value >= target}
				aria-label={`Increase ${label}`}
				className={stepClasses}
			>
				+
			</button>

			{showMax && (
				<button
					type="button"
					onClick={() => onChange(target)}
					disabled={value >= target}
					className="ml-0.5 text-[10px] px-1.5 py-0.5 rounded border border-poe-border-subtle text-poe-text-dim transition-colors hover:text-poe-gold-light hover:border-poe-border disabled:opacity-40 disabled:hover:text-poe-text-dim disabled:hover:border-poe-border-subtle"
				>
					Max
				</button>
			)}
		</div>
	);
}
