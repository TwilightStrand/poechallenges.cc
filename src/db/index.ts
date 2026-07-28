import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Next imports every route module while collecting page data at build time.
// Connecting on first query instead of at import keeps a missing DATABASE_URL
// a request-time failure, so a deploy build needs no database credentials.
let instance: ReturnType<typeof connect> | undefined;

function connect() {
	const connectionString = process.env.DATABASE_URL;

	if (!connectionString) {
		throw new Error("DATABASE_URL environment variable is not set");
	}

	return drizzle(postgres(connectionString), { schema });
}

export function getDb() {
	instance ??= connect();
	return instance;
}
