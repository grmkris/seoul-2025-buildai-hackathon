import { app } from "@/server/server";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const server = new Hono().basePath("/api").route("/", app);

export const maxDuration = 60; // This function can run for a maximum of 60 seconds

export const OPTIONS = handle(server);
export const GET = handle(server);
export const POST = handle(server);
export const PUT = handle(server);
export const PATCH = handle(server);
export const DELETE = handle(server);
