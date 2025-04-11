import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema/schema.db.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/postgres",
  },
} satisfies Config;
