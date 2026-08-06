// Injected at build time by the Dockerfile. "dev" locally, since there is no
// .git in the image and nothing stamps a local `next dev`.
const gitSha = process.env.NEXT_PUBLIC_GIT_SHA ?? "dev";
const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME ?? "";

const shortSha = gitSha === "dev" ? "dev" : gitSha.slice(0, 7);

function formatBuildTime(raw: string) {
	if (!raw) return null;

	const parsed = new Date(raw);
	if (Number.isNaN(parsed.getTime())) return null;

	// Deliberately UTC and labelled as such: a deploy time that silently shifts
	// with the reader's timezone is worse than no deploy time.
	return `${parsed.toISOString().slice(0, 16).replace("T", " ")} UTC`;
}

export function Footer() {
	const built = formatBuildTime(buildTime);

	return (
		<footer className="space-y-1 px-6 py-4 text-center text-poe-text-dim text-xs">
			<p>
				This product is not affiliated with or endorsed by Grinding Gear Games.
			</p>
			<p>
				Copyright &copy; 2026 &middot; Made by{" "}
				<a
					href="https://akj.io"
					target="_blank"
					rel="noopener noreferrer"
					className="text-poe-gold transition-colors hover:text-poe-gold-bright"
				>
					AKJ.IO
				</a>
			</p>
			<p className="text-poe-text-muted">
				{shortSha === "dev" ? (
					<span>dev build</span>
				) : (
					<a
						href={`https://github.com/TwilightStrand/poechallenges.cc/commit/${gitSha}`}
						target="_blank"
						rel="noopener noreferrer"
						className="transition-colors hover:text-poe-gold"
					>
						{shortSha}
					</a>
				)}
				{built ? ` · deployed ${built}` : null}
			</p>
		</footer>
	);
}
