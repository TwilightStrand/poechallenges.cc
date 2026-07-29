"use client";

import { useMemo } from "react";

interface ImportModalProps {
	data: string;
	onConfirm: () => void;
	onCancel: () => void;
}

export function ImportModal({ data, onConfirm, onCancel }: ImportModalProps) {
	const summary = useMemo(() => {
		try {
			const parsed = JSON.parse(data);
			const completedCount =
				parsed.challenges?.filter((c: { isComplete?: boolean }) => c.isComplete)
					.length ?? 0;
			const totalCount = parsed.challenges?.length ?? 0;
			const accountName = parsed.accountName ?? "Unknown";
			return { completedCount, totalCount, accountName, valid: true };
		} catch {
			return {
				completedCount: 0,
				totalCount: 0,
				accountName: "",
				valid: false,
			};
		}
	}, [data]);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
			<div className="w-96 rounded border border-poe-border bg-poe-bg-card p-6 shadow-2xl">
				<h2 className="font-heading text-poe-gold-light text-lg mb-4">
					Import Progress
				</h2>

				{summary.valid ? (
					<>
						<div className="space-y-2 text-sm text-poe-text">
							<p>
								Account:{" "}
								<span className="text-poe-text-bright">
									{summary.accountName}
								</span>
							</p>
							<p>
								Challenges:{" "}
								<span className="text-poe-text-bright">
									{summary.completedCount} / {summary.totalCount} completed
								</span>
							</p>
						</div>

						<div className="mt-6 flex gap-3">
							<button
								type="button"
								onClick={onConfirm}
								className="flex-1 rounded bg-poe-gold/20 border border-poe-gold/40 px-4 py-2 text-poe-gold-light font-medium hover:bg-poe-gold/30 transition-colors"
							>
								Import
							</button>
							<button
								type="button"
								onClick={onCancel}
								className="flex-1 rounded border border-poe-border px-4 py-2 text-poe-text-dim hover:text-poe-text hover:border-poe-border-highlight transition-colors"
							>
								Cancel
							</button>
						</div>
					</>
				) : (
					<>
						<p className="text-poe-red text-sm">
							Invalid import data. The bookmarklet may need to be updated.
						</p>
						<button
							type="button"
							onClick={onCancel}
							className="mt-4 rounded border border-poe-border px-4 py-2 text-poe-text-dim hover:text-poe-text"
						>
							Close
						</button>
					</>
				)}
			</div>
		</div>
	);
}
