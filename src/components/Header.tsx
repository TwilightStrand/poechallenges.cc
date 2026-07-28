"use client";

import { useState } from "react";
import styles from "./Header.module.css";

interface User {
	id: number;
	displayName: string;
	providers: string[];
}

interface HeaderProps {
	currentLeagueId: string;
	leagues: { id: string; name: string }[];
	onLeagueChange: (id: string) => void;
	user: User | null;
	onLoginGithub: () => void;
	onLoginDev: (account?: string) => void;
	onLinkPoe: () => void;
	onLogout: () => void;
}

export function Header({
	currentLeagueId,
	leagues,
	onLeagueChange,
	user,
	onLoginGithub,
	onLoginDev,
	onLinkPoe,
	onLogout,
}: HeaderProps) {
	const [showMenu, setShowMenu] = useState(false);
	const isDev = process.env.NODE_ENV === "development";
	const hasPoe = user?.providers.includes("pathofexile") ?? false;

	return (
		<header className={`${styles.header} px-6 py-5 rounded-t-lg`}>
			<div className="flex items-center justify-between gap-4">
				<h1
					className={`${styles.titleGlow} font-heading text-2xl tracking-wider text-poe-gold-light uppercase`}
				>
					Challenge Tracker
				</h1>

				<div className="flex items-center gap-3">
					{/* League selector */}
					<select
						value={currentLeagueId}
						onChange={(e) => onLeagueChange(e.target.value)}
						className="
              appearance-none cursor-pointer
              bg-poe-bg-input border border-poe-border rounded
              px-3 py-1.5 pr-8 text-sm
              text-poe-gold-light font-heading tracking-wide
              focus:outline-none focus:border-poe-gold-dim
              transition-colors
            "
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%237a5a30'/%3E%3C/svg%3E")`,
							backgroundRepeat: "no-repeat",
							backgroundPosition: "right 8px center",
						}}
					>
						{leagues.map((league) => (
							<option key={league.id} value={league.id}>
								{league.name}
							</option>
						))}
					</select>

					{/* Auth section */}
					{user ? (
						<div className="relative">
							<button
								onClick={() => setShowMenu((p) => !p)}
								className="flex items-center gap-2 px-3 py-1.5 rounded border border-poe-border-subtle text-sm text-poe-text hover:border-poe-border transition-colors"
							>
								<span className="text-poe-gold-light">{user.displayName}</span>
								<svg
									width="10"
									height="6"
									viewBox="0 0 10 6"
									fill="currentColor"
									className="text-poe-text-dim"
								>
									<path d="M0 0l5 6 5-6z" />
								</svg>
							</button>

							{showMenu && (
								<div className="absolute right-0 top-full mt-1 z-30 w-48 rounded border border-poe-border bg-poe-bg-panel shadow-lg">
									<div className="px-3 py-2 border-b border-poe-border-subtle">
										<p className="text-xs text-poe-text-dim">Signed in as</p>
										<p className="text-sm text-poe-text-bright truncate">
											{user.displayName}
										</p>
										<div className="flex gap-1 mt-1">
											{user.providers.map((p) => (
												<span
													key={p}
													className="text-[10px] px-1.5 py-0.5 rounded bg-poe-bg-input text-poe-text-dim border border-poe-border-subtle"
												>
													{p}
												</span>
											))}
										</div>
									</div>

									{!hasPoe && (
										<button
											onClick={() => {
												setShowMenu(false);
												onLinkPoe();
											}}
											className="w-full text-left px-3 py-2 text-sm text-poe-gold hover:bg-poe-bg-card-hover transition-colors"
										>
											Link PoE Account
										</button>
									)}

									<button
										onClick={() => {
											setShowMenu(false);
											onLogout();
										}}
										className="w-full text-left px-3 py-2 text-sm text-poe-text-dim hover:text-poe-text hover:bg-poe-bg-card-hover transition-colors"
									>
										Sign out
									</button>
								</div>
							)}
						</div>
					) : (
						<div className="flex items-center gap-2">
							<button
								onClick={onLoginGithub}
								className="px-3 py-1.5 rounded border border-poe-border text-sm text-poe-text hover:text-poe-gold-light hover:border-poe-border-highlight transition-colors"
							>
								Sign in
							</button>
							{isDev && (
								<button
									onClick={() => onLoginDev()}
									className="px-2 py-1.5 rounded text-xs text-poe-text-dim hover:text-poe-text transition-colors"
									title="Dev login"
								>
									DEV
								</button>
							)}
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
