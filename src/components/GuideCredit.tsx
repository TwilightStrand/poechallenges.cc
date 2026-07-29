interface GuideCreditProps {
	contributors: string[];
}

export function GuideCredit({ contributors }: GuideCreditProps) {
	if (contributors.length === 0) return null;

	return (
		<p className="px-6 pb-3 text-center text-poe-text-dim text-xs">
			Guide by{" "}
			{contributors.map((handle, i) => (
				<span key={handle}>
					{i > 0 && ", "}
					<a
						href={`https://github.com/${handle}`}
						target="_blank"
						rel="noopener noreferrer"
						className="text-poe-gold transition-colors hover:text-poe-gold-bright"
					>
						@{handle}
					</a>
				</span>
			))}
		</p>
	);
}
