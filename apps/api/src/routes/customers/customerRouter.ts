import {
  InsertCustomerSchema,
  SelectCustomerSchema,
} from "@/db/schema/customers/customers.zod";
import { WORKSPACE_PATH, getRole } from "@/utils";
import { createRoute } from "@hono/zod-openapi";
import { OpenAPIHono } from "@hono/zod-openapi";
import { CustomerId, OrganizationId, WorkspaceId } from "typeid";
import { z } from "zod";
import {
  commonHeaderSchema,
  createCommonErrorSchema,
  createJsonSchema,
  createOpenAPIRoute,
  validateAuth,
} from "../helpers";
import { checkOrganizationAccess, checkWorkspaceAccess } from "../helpers";
import {
  GetCustomerSchema,
  ListCustomersResponseSchema,
  ListCustomersSchema,
  createCustomersService,
} from "./customerService";

const updateCustomerRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "put",
    description: "Update a customer",
    path: "",
    tags: ["Customers"],
    summary: "Update",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        customerId: CustomerId,
      }),
      body: createJsonSchema(InsertCustomerSchema.partial()),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Customer updated successfully",
        content: {
          "application/json": {
            schema: SelectCustomerSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const logger = c.get("logger");
    try {
      const { customerId, workspaceId, organizationId } = c.req.valid("param");
      const data = c.req.valid("json");
      const db = c.get("db");
      const session = validateAuth(c);
      const role = getRole(c);

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      const customerService = createCustomersService({
        workspaceId,
        memberId: session.memberId,
        organizationId,
        role,
        deps: {
          db,
          logger,
        },
      });

      const result = await customerService.updateCustomer(customerId, data);

      if (result.isErr()) {
        if (result.error.type === "CUSTOMER_NOT_FOUND") {
          return c.json(
            {
              message: result.error.message,
              requestId: c.get("requestId"),
            },
            404,
          );
        }
        throw new Error(result.error.message);
      }

      return c.json(result.value, 200);
    } catch (error) {
      logger.error({
        msg: "Error updating customer",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

const deleteCustomerRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "delete",
    path: "",
    tags: ["Customers"],
    summary: "Delete",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        customerId: CustomerId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Customer deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              message: z.string(),
            }),
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const logger = c.get("logger");
    try {
      const { customerId, workspaceId, organizationId } = c.req.valid("param");
      const db = c.get("db");
      const session = validateAuth(c);
      const role = getRole(c);

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      const customerService = createCustomersService({
        workspaceId,
        memberId: session.memberId,
        organizationId,
        role,
        deps: {
          db,
          logger,
        },
      });

      const result = await customerService.deleteCustomer(customerId);

      if (result.isErr()) {
        if (result.error.type === "CUSTOMER_NOT_FOUND") {
          return c.json(
            {
              message: result.error.message,
              requestId: c.get("requestId"),
            },
            404,
          );
        }
        throw new Error(result.error.message);
      }

      return c.json({ message: "Customer deleted successfully" }, 200);
    } catch (error) {
      logger.error({
        msg: "Error deleting customer",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

const createCustomerRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "post",
    path: "",
    tags: ["Customers"],
    summary: "Create",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      body: createJsonSchema(InsertCustomerSchema),
      headers: commonHeaderSchema,
    },
    responses: {
      201: {
        description: "Customer created successfully",
        content: {
          "application/json": {
            schema: SelectCustomerSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const data = c.req.valid("json");
      const db = c.get("db");
      const session = validateAuth(c);
      const { workspaceId, organizationId } = c.req.valid("param");
      const logger = c.get("logger");
      const role = getRole(c);

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      const customerService = createCustomersService({
        workspaceId,
        memberId: session.memberId,
        organizationId,
        role,
        deps: {
          db,
          logger,
        },
      });

      const result = await customerService.createCustomer(data);

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      return c.json(result.value, 201);
    } catch (error) {
      const logger = c.get("logger");
      logger.error({
        msg: "Error creating customer",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

const getCustomerRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "",
    tags: ["Customers"],
    summary: "Get",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
        customerId: CustomerId,
      }),
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "Customer retrieved successfully",
        content: {
          "application/json": {
            schema: GetCustomerSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    try {
      const { customerId, workspaceId, organizationId } = c.req.valid("param");
      const db = c.get("db");
      const session = validateAuth(c);
      const logger = c.get("logger");
      const role = getRole(c);

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      const customerService = createCustomersService({
        workspaceId,
        memberId: session.memberId,
        organizationId,
        role,
        deps: {
          db,
          logger,
        },
      });

      const result = await customerService.getCustomer(customerId);

      if (result.isErr()) {
        if (result.error.type === "CUSTOMER_NOT_FOUND") {
          return c.json(
            { message: "Customer not found", requestId: c.get("requestId") },
            404,
          );
        }
        throw new Error(result.error.message);
      }

      return c.json(result.value, 200);
    } catch (error) {
      const logger = c.get("logger");
      logger.error({
        msg: "Error getting customer",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: c.get("requestId"),
        },
        500,
      );
    }
  },
);

const listCustomersRoute = createOpenAPIRoute().openapi(
  createRoute({
    method: "get",
    path: "",
    tags: ["Customers"],
    summary: "List",
    request: {
      params: z.object({
        organizationId: OrganizationId,
        workspaceId: WorkspaceId,
      }),
      query: ListCustomersSchema,
      headers: commonHeaderSchema,
    },
    responses: {
      200: {
        description: "List of customers retrieved successfully",
        content: {
          "application/json": {
            schema: ListCustomersResponseSchema,
          },
        },
      },
      ...createCommonErrorSchema(),
    },
  }),
  async (c) => {
    const logger = c.get("logger");
    const session = validateAuth(c);
    logger.debug({
      msg: "Listing customers",
      requestId: c.get("requestId"),
      session,
    });
    const requestId = c.get("requestId");
    try {
      const db = c.get("db");
      const queryParams = c.req.valid("query");
      const { workspaceId, organizationId } = c.req.valid("param");
      const role = getRole(c);

      if (!session.memberId) {
        return c.json(
          { message: "Unauthorized", requestId: c.get("requestId") },
          401,
        );
      }

      const customerService = createCustomersService({
        workspaceId,
        memberId: session.memberId,
        organizationId,
        role,
        deps: {
          db,
          logger,
        },
      });

      const result = await customerService.listCustomers(queryParams);

      if (result.isErr()) {
        throw new Error(result.error.message);
      }

      return c.json(result.value, 200);
    } catch (error) {
      logger.error({
        msg: "Error listing customers",
        error,
      });
      return c.json(
        {
          message: "Internal server error",
          requestId: requestId,
        },
        500,
      );
    }
  },
);

export const customerRouter = new OpenAPIHono()
  .use(`${WORKSPACE_PATH}/customers`, checkOrganizationAccess)
  .use(`${WORKSPACE_PATH}/customers`, checkWorkspaceAccess)
  .basePath(`${WORKSPACE_PATH}/customers`)
  .route("/", createCustomerRoute)
  .route("/", listCustomersRoute)
  .route("/:customerId", deleteCustomerRoute)
  .route("/:customerId", updateCustomerRoute)
  .route("/:customerId", getCustomerRoute);
