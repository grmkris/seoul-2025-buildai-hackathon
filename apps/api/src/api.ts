import { OpenAPIHono } from "@hono/zod-openapi";
import { chatRouter } from "./routes/chat/chatRouter";
import { customerRouter } from "./routes/customers/customerRouter";
import { workspaceRouter } from "./routes/orgs/workspaceRoute";

export const apiRoutes = new OpenAPIHono();
apiRoutes.route("/", customerRouter);
apiRoutes.route("/", workspaceRouter);
apiRoutes.route("/", chatRouter);
