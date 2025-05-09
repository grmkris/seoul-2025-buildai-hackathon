import { OpenAPIHono } from "@hono/zod-openapi";
import { chatRouter } from "./routes/chat/chatRouter";
import { customerRouter } from "./routes/customers/customerRouter";
import { workspaceRouter } from "./routes/orgs/workspaceRoute";
import { publicRoutes } from "./routes/public-routes/publicRoutes";
import { customerConversationRoutes } from "./routes/chat/customerConversationRoutes";

export const apiRoutes = new OpenAPIHono();
apiRoutes.route("/", customerRouter);
apiRoutes.route("/", workspaceRouter);
apiRoutes.route("/", chatRouter);
apiRoutes.route("/", publicRoutes);
apiRoutes.route("/", customerConversationRoutes);
