import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Runs as an initContainer before the app starts, so the schema is applied by
// the deploy rather than by someone with a port-forward. Drizzle records what
// it has applied in __drizzle_migrations, so re-running on every pod start is
// a no-op.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	console.error("DATABASE_URL is not set");
	process.exit(1);
}

// max: 1 because migrations must run on a single connection, and the process
// exits straight after, so there is no pool to reuse. onnotice is silenced
// because a repeat run logs "already exists, skipping" for drizzle's own
// bookkeeping tables, which reads like a failure in pod logs but is not.
const client = postgres(connectionString, { max: 1, onnotice: () => {} });

try {
	await migrate(drizzle(client), { migrationsFolder: "./drizzle" });
	console.log("migrations applied");
} catch (error) {
	console.error("migration failed:", error);
	process.exit(1);
} finally {
	await client.end();
}
