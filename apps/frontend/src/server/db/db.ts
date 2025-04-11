import * as schema from "./schema";
import type { Logger as DrizzleLogger } from "drizzle-orm";
import { type NeonHttpDatabase, drizzle } from "drizzle-orm/neon-http";
import type { PgliteDatabase } from "drizzle-orm/pglite";

export const DB_SCHEMA = schema;
export type db =
  | NeonHttpDatabase<typeof schema>
  | PgliteDatabase<typeof schema>;

export function createDb(props: { logger: DrizzleLogger; dbUrl: string }) {
  const { logger, dbUrl } = props;

  if (!dbUrl) throw new Error("DATABASE_URL is not set");
  const db = drizzle(dbUrl, { schema, logger });

  return db;
}
