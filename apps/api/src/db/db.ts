import * as schema from "@/db/schema/schema.db";
import type { Logger as DrizzleLogger } from "drizzle-orm";
import { type BunSQLDatabase, drizzle } from "drizzle-orm/bun-sql";
import type { PgliteDatabase } from "drizzle-orm/pglite";

export const DB_SCHEMA = schema;
export type db = BunSQLDatabase<typeof schema> | PgliteDatabase<typeof schema>;

export function createDb(props: {
  logger: DrizzleLogger;
  dbUrl: string;
}) {
  console.log("dbUrl", props.dbUrl);
  const { logger, dbUrl } = props;

  if (!dbUrl) throw new Error("DATABASE_URL is not set");
  const db = drizzle(dbUrl, { schema, logger });

  return db;
}
