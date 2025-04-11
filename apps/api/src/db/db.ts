import * as schema from "@/db/schema/schema.db";
import { env } from "@/env";
import type { Logger as DrizzleLogger } from "drizzle-orm";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { migrate } from "drizzle-orm/neon-http/migrator";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import { createLogger, type Logger } from "logger";

export const DB_SCHEMA = schema;
export type db =
  | NeonHttpDatabase<typeof schema>
  | PgliteDatabase<typeof schema>;

export function createDb(props: {
  logger: DrizzleLogger;
  dbUrl: string;
}) {
  console.log("dbUrl", props.dbUrl);
  const { logger, dbUrl } = props;

  if (!dbUrl) throw new Error("DATABASE_URL is not set");
  const sql = neon(dbUrl);
  const db = drizzle({ schema, logger, client: sql });

  return db;
}

export const drizzleLoggerAdapter = (logger: Logger): DrizzleLogger => {
  return {
    logQuery: (query, params) => {
      logger.info({ msg: "Query", query, params });
    },
  };
};

export const migrateDb = async () => {
  const logger = createLogger({
    level: env.LOG_LEVEL,
    name: "api",
  });
  const db = createDb({
    logger: drizzleLoggerAdapter(logger),
    dbUrl: env.DATABASE_URL,
  });

  await migrate(db, { migrationsFolder: "./drizzle" });
};
