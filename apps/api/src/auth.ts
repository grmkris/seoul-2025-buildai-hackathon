import type { db } from "@/db/db"; // your drizzle instance
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  admin,
  anonymous,
  apiKey,
  bearer,
  openAPI,
  organization,
  username,
} from "better-auth/plugins";

import { passkey } from "better-auth/plugins/passkey";
import type { Logger } from "logger";
import { SERVICE_URLS } from "service-registry";
import { env } from "./env";

export const createAuth = (props: {
  db: db;
  logger?: Logger;
}) => {
  return betterAuth({
    baseURL: SERVICE_URLS[env.APP_ENV].auth,
    basePath: "/api/auth",
    trustedOrigins: [
      SERVICE_URLS[env.APP_ENV].frontend,
      SERVICE_URLS[env.APP_ENV].admin,
    ],
    database: drizzleAdapter(props.db, {
      provider: "pg", // or "mysql", "sqlite"
    }),
    plugins: [
      openAPI(),
      anonymous(),
      username(),
      passkey(),
      admin(),
      organization(),
      bearer(),
      apiKey(),
    ],
    emailAndPassword: {
      enabled: true,
    },
    logger: {
      level: env.LOG_LEVEL === "trace" ? "debug" : env.LOG_LEVEL,
      log(level, message, ...args) {
        props.logger?.[level](message, ...args);
      },
    },
    advanced: {
      generateId: false, // ids are generated by drizzle automatically and follow the format defined in typeid
    },
  });
};
