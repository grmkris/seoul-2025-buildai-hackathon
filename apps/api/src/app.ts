import { migrateDb, type db } from "@/db/db";
import { env } from "@/env";
import type { ContextVariables } from "@/types";
import { OpenAPIHono } from "@hono/zod-openapi";
import { apiReference } from "@scalar/hono-api-reference";
import { APIError } from "better-auth/api";
import { PgliteDatabase } from "drizzle-orm/pglite";
import { migrate as migratePgLite } from "drizzle-orm/pglite/migrator";
import { migrate as migrateNeonHttp } from "drizzle-orm/neon-http/migrator";
import type { Context, ErrorHandler } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { requestId } from "hono/request-id";
import type { Logger } from "logger";
import { SERVICE_URLS } from "service-registry";
import { typeIdGenerator } from "typeid";
import { apiRoutes } from "./api";
import { createAuth } from "./auth";
import { createRequestMiddleware } from "./requestMiddleware";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";

const createAppOnErrorHandler = (deps: {
  logger: Logger;
}): ErrorHandler<{ Variables: ContextVariables }> => {
  return (error: Error, c: Context<{ Variables: ContextVariables }>) => {
    const logger = c.get("logger") ?? deps.logger;
    const requestId = c.get("requestId");
    logger.error({
      msg: "app.onError captured an error",
      path: c.req.path,
      url: c.req.url,
      requestId,
      error,
    });

    if (error instanceof HTTPException) {
      return c.json(
        {
          message: error.message,
          requestId,
        },
        error.status,
      );
    }
    if (error instanceof APIError) {
      return c.json(
        {
          message: error.message,
          requestId,
        },
        mapBetterAuthErrorToHttpStatus({
          error,
          logger,
        }),
      );
    }

    return c.json(
      {
        message: "Internal Server Error",
        requestId,
      },
      500,
    );
  };
};

const mapBetterAuthErrorToHttpStatus = (props: {
  error: APIError;
  logger: Logger;
}) => {
  switch (props.error.status) {
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "BAD_REQUEST":
      return 400;
    default:
      props.logger.warn({
        msg: "☢️ Not mapped better-auth error status",
        error: props.error,
      });
      return 500;
  }
};

export const createApp = async (props: {
  db: db;
  logger: Logger;
}) => {
  migrateDb();
  const auth = createAuth({
    db: props.db,
    logger: props.logger,
  });
  props.logger.info("Creating app");
  props.logger.info("Running migrations");
  if (props.db instanceof NeonHttpDatabase) {
    await migrateNeonHttp(props.db, { migrationsFolder: "./drizzle" });
  } else if (props.db instanceof PgliteDatabase) {
    await migratePgLite(props.db, { migrationsFolder: "./drizzle" });
  } else {
    throw new Error("Unsupported database type");
  }
  props.logger.info("Migrations done");
  const app = new OpenAPIHono()
    .doc31("/api/swagger.json", {
      openapi: "3.1.0",
      info: { title: "Zdrava kosara", version: "1.0.0" },
    })
    .use(requestId({ generator: () => typeIdGenerator("request") }))
    .get(
      "",
      apiReference({
        url: "/api/swagger.json",
      }),
    )
    .get("/auth-swagger.json", async (c: Context) => {
      const schema = await auth.api.generateOpenAPISchema();
      return c.json(schema);
    })
    .get(
      "/auth-swagger",
      apiReference({
        servers: [
          {
            url: "http://localhost:3001/api/auth",
            description: "Local",
          },
        ],
        url: "/auth-swagger.json",
      }),
    )
    .use(
      "*", // or replace with "*" to enable cors for all routes
      cors({
        origin: SERVICE_URLS[env.APP_ENV].frontend,
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE"],
        exposeHeaders: ["Content-Length"],
        maxAge: 600,
        credentials: true,
      }),
    )
    .use(
      "*",
      createRequestMiddleware({
        db: props.db,
        logger: props.logger,
      }),
    )
    .route("/api/admin", apiRoutes)
    .on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))

    .onError(createAppOnErrorHandler({ logger: props.logger }));

  return app;
};
