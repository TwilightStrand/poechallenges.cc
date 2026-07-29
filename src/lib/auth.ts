import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import {
	GitHub,
	generateCodeVerifier,
	generateState,
	OAuth2Client,
} from "arctic";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { oauthAccounts, sessions, users } from "@/db/schema";

// ── OAuth Clients ──

// All three values or nothing: a provider configured with an id but no secret
// used to build a client that failed later, at the token exchange, with a
// confusing error. Now it stays null and the route reports 503.
function oauthCredentials(prefix: "GITHUB" | "POE") {
	const clientId = process.env[`${prefix}_CLIENT_ID`];
	const clientSecret = process.env[`${prefix}_CLIENT_SECRET`];
	const redirectUri = process.env[`${prefix}_REDIRECT_URI`];

	if (!clientId || !clientSecret || !redirectUri) return null;

	return { clientId, clientSecret, redirectUri };
}

const githubCredentials = oauthCredentials("GITHUB");
export const github = githubCredentials
	? new GitHub(
			githubCredentials.clientId,
			githubCredentials.clientSecret,
			githubCredentials.redirectUri,
		)
	: null;

const poeCredentials = oauthCredentials("POE");
export const poe = poeCredentials
	? new OAuth2Client(
			poeCredentials.clientId,
			poeCredentials.clientSecret,
			poeCredentials.redirectUri,
		)
	: null;

export { generateCodeVerifier, generateState };

// ── Session Management (Oslo) ──

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateSessionToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(32));
	return encodeHexLowerCase(bytes);
}

export function hashSessionToken(token: string): string {
	const encoded = new TextEncoder().encode(token);
	const hash = sha256(encoded);
	return encodeHexLowerCase(hash);
}

export async function createSession(userId: number) {
	const token = generateSessionToken();
	const sessionId = hashSessionToken(token);
	const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

	await getDb().insert(sessions).values({
		id: sessionId,
		userId,
		expiresAt,
	});

	return { token, sessionId, expiresAt };
}

export async function validateSession(token: string) {
	const sessionId = hashSessionToken(token);

	const result = await getDb()
		.select({
			session: sessions,
			user: users,
		})
		.from(sessions)
		.innerJoin(users, eq(sessions.userId, users.id))
		.where(eq(sessions.id, sessionId))
		.limit(1);

	const row = result[0];
	if (!row) return null;

	// Check expiry
	if (row.session.expiresAt < new Date()) {
		await getDb().delete(sessions).where(eq(sessions.id, sessionId));
		return null;
	}

	// Extend session if more than halfway through
	const halfLife = SESSION_DURATION_MS / 2;
	if (row.session.expiresAt.getTime() - Date.now() < halfLife) {
		const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
		await getDb()
			.update(sessions)
			.set({ expiresAt: newExpiry })
			.where(eq(sessions.id, sessionId));
	}

	return { user: row.user, session: row.session };
}

export async function invalidateSession(sessionId: string) {
	await getDb().delete(sessions).where(eq(sessions.id, sessionId));
}

// ── User Management ──

export async function findOrCreateUser(
	provider: string,
	providerAccountId: string,
	displayName: string,
) {
	// Both columns have to match. Matching on provider alone returns whichever
	// row comes back first, which means every GitHub sign-in resolves to the
	// same account regardless of who authenticated.
	const [existing] = await getDb()
		.select({ user: users })
		.from(oauthAccounts)
		.innerJoin(users, eq(oauthAccounts.userId, users.id))
		.where(
			and(
				eq(oauthAccounts.provider, provider),
				eq(oauthAccounts.providerAccountId, providerAccountId),
			),
		)
		.limit(1);

	if (existing) {
		await getDb()
			.update(users)
			.set({ lastLoginAt: new Date() })
			.where(eq(users.id, existing.user.id));
		return existing.user;
	}

	// Create new user + link oauth account
	const [newUser] = await getDb()
		.insert(users)
		.values({ displayName, lastLoginAt: new Date() })
		.returning();

	if (!newUser) throw new Error("Failed to create user");

	await getDb().insert(oauthAccounts).values({
		provider,
		providerAccountId,
		userId: newUser.id,
	});

	return newUser;
}

export async function linkOAuthAccount(
	userId: number,
	provider: string,
	providerAccountId: string,
) {
	await getDb()
		.insert(oauthAccounts)
		.values({ provider, providerAccountId, userId })
		.onConflictDoNothing();
}

// ── Cookie Helpers ──

export const SESSION_COOKIE_NAME = "poe_session";

export function sessionCookieOptions(expiresAt: Date) {
	return {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax" as const,
		path: "/",
		expires: expiresAt,
	};
}
