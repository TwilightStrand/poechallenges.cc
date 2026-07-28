"use client";

import { useCallback, useEffect, useState } from "react";

interface User {
	id: number;
	displayName: string;
	providers: string[];
}

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch("/api/auth/me")
			.then((r) => r.json())
			.then((data) => {
				setUser(data.user ?? null);
				setLoading(false);
			})
			.catch(() => {
				setLoading(false);
			});
	}, []);

	const loginGithub = useCallback(() => {
		window.location.href = "/api/auth/github";
	}, []);

	const loginPoe = useCallback(() => {
		window.location.href = "/api/auth/poe";
	}, []);

	const loginDev = useCallback((account?: string) => {
		window.location.href = `/api/auth/dev-login?account=${encodeURIComponent(account ?? "DevUser#1234")}`;
	}, []);

	const logout = useCallback(async () => {
		await fetch("/api/auth/logout", { method: "POST" });
		setUser(null);
	}, []);

	const isLoggedIn = user !== null;
	const hasPoeLinked = user?.providers.includes("pathofexile") ?? false;

	return {
		user,
		loading,
		isLoggedIn,
		hasPoeLinked,
		loginGithub,
		loginPoe,
		loginDev,
		logout,
	};
}
