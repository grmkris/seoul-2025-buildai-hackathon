import { sql } from "drizzle-orm";
import { type BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql";
import type { Logger } from "logger";

export async function createTestPgDrizzle(props: {
	testName: string;
	connectionString: string;
	logger: Logger;
}) {
	const { testName, connectionString, logger } = props;
	const dbName = `test_db_${testName}_${Date.now()}`.toLowerCase();
	logger.debug({ msg: "Creating test database...", dbName, connectionString });
	if (!connectionString) throw new Error("DATABASE_URL is not set");

	// Extract the database user from the connection string
	const url = new URL(connectionString);
	const dbUser = url.username;
	if (!dbUser) throw new Error("Database user not found in connection string");

	logger.debug({ msg: "connectionString", connectionString });
	const adminDrizzle = drizzle({ connection: connectionString });
	logger.debug({ msg: "adminDrizzledone" });
	try {
		logger.debug("Creating database", { dbName });
		await adminDrizzle.execute(sql`CREATE DATABASE ${sql.raw(dbName)}`);

		logger.debug("Database created", { dbName });
		// grant all privileges to the user
		await adminDrizzle.execute(
			sql`GRANT ALL PRIVILEGES ON DATABASE ${sql.raw(dbName)} TO ${sql.raw(dbUser)}`,
		);

		// Create new connection string with the new database name
		url.pathname = `/${dbName}`;
		const newConnectionString = url.toString();

		const testDb = drizzle(newConnectionString, {
			logger: {
				logQuery: (query) => {
					logger.debug({ msg: "query", query });
				},
			},
		});
		const cleanupDb = async () => {
			await adminDrizzle.execute(
				sql`DROP DATABASE IF EXISTS ${sql.raw(dbName)}`,
			);
		};
		return {
			testDb,
			newConnectionString,
			dbName,
			cleanupDb,
		};
	} catch (error) {
		logger.error({ msg: "Error creating test database:", error });
		throw error;
	}
}

export type TestPgDrizzle = BunSQLDatabase;
