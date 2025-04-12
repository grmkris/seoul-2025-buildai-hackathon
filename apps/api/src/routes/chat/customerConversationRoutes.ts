import { createRoute } from "@hono/zod-openapi";
import { eq, and, desc, asc, type AnyColumn, count } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

import { conversations } from "../../db/schema/chat/chat.db";
import { CustomerConversationParamsSchema, ListCustomerConversationsResponseSchema } from "./customerConversationRoutes.types";
import { createOpenAPIRoute } from "../helpers";
import { z } from "zod";

const PaginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  orderBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  orderDirection: z.enum(["asc", "desc"]).default("desc"),
});
// Route definition
const route = createRoute({
  method: "get",
  path: "/admin/workspaces/{workspaceId}/customers/{customerId}/conversations",
  tags: ["Admin Customers", "Admin Chat"],
  summary: "List conversations for a specific customer in a workspace",
  security: [{ BearerAuth: [] }],
  request: {
    params: CustomerConversationParamsSchema,
    query: PaginationQuerySchema, // Use common pagination query schema
  },
  responses: {
    200: {
      description: "List of customer conversations with pagination",
      content: {
        "application/json": {
          schema: ListCustomerConversationsResponseSchema,
        },
      },
    },
    400: { description: "Bad Request (validation error)" },
    403: { description: "Forbidden (permission denied)" },
    404: { description: "Not Found (workspace or customer not found)" },
  },
});

export const customerConversationRoutes = createOpenAPIRoute()
  .openapi(route, async (c) => {
    const { workspaceId, customerId } = c.req.valid("param");
    const { page, limit, orderBy = 'createdAt', orderDirection = 'desc' } = c.req.valid("query");
    const db = c.get("db");

    const offset = (page - 1) * limit;
    const direction = orderDirection === 'asc' ? asc : desc;

    // Determine the column to order by - Use AnyColumn for broader compatibility
    let orderByColumn: AnyColumn = conversations.createdAt; // Default
    if (orderBy === 'title') {
      orderByColumn = conversations.title;
    } else if (orderBy === 'updatedAt') {
      orderByColumn = conversations.updatedAt;
    }

    // Define the where clause once to reuse
    const whereClause = and(
      eq(conversations.workspaceId, workspaceId),
      eq(conversations.createdBy, customerId)
    );

    try {
      // Query for conversations linked to the customer and workspace
      const [customerConversations, totalCountResult] = await Promise.all([
        db
          .select()
          .from(conversations)
          .where(whereClause) // Use defined where clause
          .orderBy(direction(orderByColumn))
          .limit(limit)
          .offset(offset),
        // Separate query to count total matching records
        db
          .select({ value: count() })
          .from(conversations)
          .where(whereClause), // Use defined where clause
      ]);

      const totalCount = totalCountResult[0]?.value ?? 0;
      const totalPages = Math.ceil(totalCount / limit);

      // Construct the response manually following the pattern in conversationRoutes
      return c.json({
        data: customerConversations,
        pagination: {
          currentPage: page,
          totalPages,
          pageSize: limit,
          totalCount,
        },
      });
    } catch (error) {
      console.error("Failed to fetch customer conversations:", error);
      // Consider specific error handling (e.g., database errors)
      throw new HTTPException(500, { message: "Failed to fetch conversations" });
    }
  }); 