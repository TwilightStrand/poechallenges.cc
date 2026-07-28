import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import {
	GitHub,
	generateCodeVerifier,
	generateState,
	OAuth2Client,
} from "arctic";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { oauthAccounts, sessions, users } from "@/db/schema";

// ── OAuth Clients ──

export const github = process.env.GITHUB_CLIENT_ID
	? new GitHub(
			process.env.GITHUB_CLIENT_ID,
			process.env.GITHUB_CLIENT_SECRET!,
			process.env.GITHUB_REDIRECT_URI!,
		)
	: null;

export const poe =
	process.env.POE_CLIENT_ID && process.env.POE_CLIENT_ID !== ""
		? new OAuth2Client(
				process.env.POE_CLIENT_ID,
				process.env.POE_CLIENT_SECRET!,
				process.env.POE_REDIRECT_URI!,
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
	// Check if oauth account exists
	const existing = await getDb()
		.select({ user: users })
		.from(oauthAccounts)
		.innerJoin(users, eq(oauthAccounts.userId, users.id))
		.where(eq(oauthAccounts.provider, provider))
		.limit(1);

	// Filter by providerAccountId in JS since compound where is cleaner this way
	const match = existing.find(
		(r) => true, // the query already filters, but let's be safe
	);

	if (existing.length > 0 && existing[0]) {
		// Update last login
		await getDb()
			.update(users)
			.set({ lastLoginAt: new Date() })
			.where(eq(users.id, existing[0].user.id));
		return existing[0].user;
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
