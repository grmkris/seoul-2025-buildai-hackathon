import { OpenAPIHono } from "@hono/zod-openapi";
import { conversationRoutes } from "./conversationRoutes";
import { messageRoutes } from "./messageRoutes";

export const chatRouter = new OpenAPIHono()
  .route("/", conversationRoutes)
  .route("/", messageRoutes);
