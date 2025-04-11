import type { db } from "@/db/db";
import { workspaces } from "@/db/schema/orgs/orgs.db";
import {
  InsertCustomerSchema,
  SelectCustomerSchema,
  customersTable,
} from "@/db/schema/schema.db";
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { Logger } from "logger";
import { type Result, err, ok } from "neverthrow";
import type { CustomerId, MemberId, OrganizationId, WorkspaceId } from "typeid";
import { z } from "zod";

// Define basic OrganizationRole locally (adjust roles as needed for your simplified app)
export const OrganizationRoleSchema = z.enum([
  "owner",
  "admin",
  "member",
  "viewer",
]);
export type OrganizationRole = z.infer<typeof OrganizationRoleSchema>;

// Define base order fields locally
export const ORDER_BY_FIELDS = ["createdAt", "updatedAt"] as const;

// Define basic ListParamsSchema locally
export const ListParamsSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().optional().default(10),
  search: z.string().optional(),
  orderBy: z.enum(ORDER_BY_FIELDS).optional().default("createdAt"),
  orderDirection: z.enum(["asc", "desc"]).optional().default("desc"),
});
export type ListParamsSchema = z.infer<typeof ListParamsSchema>;

// Define basic PaginationSchema locally
export const PaginationSchema = z.object({
  currentPage: z.number().int().positive(),
  totalPages: z.number().int().positive(),
  pageSize: z.number().int().positive(),
  totalCount: z.number().int().nonnegative(),
});
export type PaginationSchema = z.infer<typeof PaginationSchema>;

// Define custom error types
export type CustomerServiceError =
  | { type: "CUSTOMER_NOT_FOUND"; message: string }
  | { type: "WORKSPACE_NOT_FOUND"; message: string }
  | { type: "CREATE_CUSTOMER_ERROR"; message: string; cause?: unknown }
  | { type: "UPDATE_CUSTOMER_ERROR"; message: string; cause?: unknown }
  | { type: "DELETE_CUSTOMER_ERROR"; message: string; cause?: unknown }
  | { type: "LIST_CUSTOMERS_ERROR"; message: string; cause?: unknown }
  | { type: "GET_CUSTOMER_ERROR"; message: string; cause?: unknown }
  | { type: "PERMISSION_ERROR"; message: string };

// Constants and types for ordering - Combine local ORDER_BY_FIELDS
export const CUSTOMER_ORDER_BY_FIELDS = [
  ...ORDER_BY_FIELDS,
  "firstName",
  "lastName",
  "email",
  "phoneNumber", // Corrected field name if it's 'phoneNumber' in schema
] as const;

// Correct usage of z.enum
export const CustomerOrderByField = z.enum(CUSTOMER_ORDER_BY_FIELDS);
export type CustomerOrderByField = z.infer<typeof CustomerOrderByField>;

// List customers schema extending local ListParamsSchema
export const ListCustomersSchema = ListParamsSchema.extend({
  orderBy: CustomerOrderByField.optional().default("createdAt"),
});
export type ListCustomersSchema = z.infer<typeof ListCustomersSchema>;

// List customers response schema
export const ListCustomersResponseSchema = z.object({
  data: SelectCustomerSchema.array(),
  pagination: PaginationSchema, // Use local PaginationSchema
});
export type ListCustomersResponseSchema = z.infer<
  typeof ListCustomersResponseSchema
>;

// Create customer schema
export const CreateCustomerSchema = InsertCustomerSchema;
export type CreateCustomerSchema = z.infer<typeof CreateCustomerSchema>;

// Get customer schema - simplified (removed notes and auditHistory)
export const GetCustomerSchema = SelectCustomerSchema;
export type GetCustomerSchema = z.infer<typeof GetCustomerSchema>;

export const createCustomersService = (props: {
  workspaceId: WorkspaceId;
  memberId: MemberId;
  organizationId: OrganizationId;
  role: OrganizationRole; // Using locally defined type
  deps: {
    db: db;
    logger: Logger;
  };
}) => {
  const { workspaceId, memberId, organizationId, deps } = props;
  const { db, logger } = deps;

  // Helper function to verify workspace
  const verifyWorkspace = async (): Promise<
    Result<void, CustomerServiceError>
  > => {
    const workspace = await db.query.workspaces.findFirst({
      where: and(
        eq(workspaces.id, workspaceId),
        eq(workspaces.organizationId, organizationId),
      ),
    });

    if (!workspace) {
      return err({
        type: "WORKSPACE_NOT_FOUND",
        message: "Workspace not found",
      });
    }

    return ok(undefined);
  };

  return {
    deleteCustomer: async (
      customerId: CustomerId,
    ): Promise<
      Result<{ message: string; status: number }, CustomerServiceError>
    > => {
      const workspaceResult = await verifyWorkspace();
      if (workspaceResult.isErr()) {
        return err(workspaceResult.error);
      }

      try {
        // Simplified transaction - no notes to delete
        const deletedCustomer = await db
          .delete(customersTable)
          .where(
            and(
              eq(customersTable.id, customerId),
              eq(customersTable.workspaceId, workspaceId),
            ),
          )
          .returning();

        if (!deletedCustomer.length) {
          return err({
            type: "CUSTOMER_NOT_FOUND" as const,
            message: "Customer not found",
          });
        }

        return ok({
          message: "Customer deleted successfully" as const,
          status: 200,
        });
      } catch (error) {
        logger.error({
          msg: "Error deleting customer",
          error,
        });
        return err({
          type: "DELETE_CUSTOMER_ERROR",
          message: "Failed to delete customer",
          cause: error,
        });
      }
    },

    createCustomer: async (
      customer: CreateCustomerSchema,
    ): Promise<Result<SelectCustomerSchema, CustomerServiceError>> => {
      const workspaceResult = await verifyWorkspace();
      if (workspaceResult.isErr()) {
        return err(workspaceResult.error);
      }

      try {
        // Simplified insert - no transaction needed if only inserting one record
        const result = await db
          .insert(customersTable)
          .values({
            ...customer,
            createdBy: memberId,
            updatedBy: memberId,
            workspaceId: workspaceId,
          })
          .returning();

        if (!result[0]?.id) {
          return err({
            type: "CREATE_CUSTOMER_ERROR" as const,
            message: "Customer not created",
          });
        }

        return ok(result[0]);
      } catch (error) {
        logger.error({
          msg: "Error creating customer",
          error,
        });
        return err({
          type: "CREATE_CUSTOMER_ERROR",
          message: "Failed to create customer",
          cause: error,
        });
      }
    },

    updateCustomer: async (
      customerId: CustomerId,
      data: Partial<CreateCustomerSchema>,
    ): Promise<Result<SelectCustomerSchema, CustomerServiceError>> => {
      const workspaceResult = await verifyWorkspace();
      if (workspaceResult.isErr()) {
        return err(workspaceResult.error);
      }

      try {
        const updatedCustomer = await db
          .update(customersTable)
          .set({ ...data, updatedBy: memberId, updatedAt: new Date() })
          .where(
            and(
              eq(customersTable.id, customerId),
              eq(customersTable.workspaceId, workspaceId),
            ),
          )
          .returning();

        if (!updatedCustomer.length) {
          return err({
            type: "CUSTOMER_NOT_FOUND",
            message: "Customer not found",
          });
        }

        return ok(updatedCustomer[0]);
      } catch (error) {
        logger.error({
          msg: "Error updating customer",
          error,
        });
        return err({
          type: "UPDATE_CUSTOMER_ERROR",
          message: "Failed to update customer",
          cause: error,
        });
      }
    },

    getCustomer: async (
      customerId: CustomerId,
    ): Promise<Result<GetCustomerSchema, CustomerServiceError>> => {
      // Return simplified GetCustomerSchema
      const workspaceResult = await verifyWorkspace();
      if (workspaceResult.isErr()) {
        return err(workspaceResult.error);
      }

      try {
        // Simplified query - no audit history or notes needed
        const customer = await db.query.customersTable.findFirst({
          where: and(
            eq(customersTable.id, customerId),
            eq(customersTable.workspaceId, workspaceId),
          ),
          // Removed 'with' clause for notes
        });

        if (!customer) {
          return err({
            type: "CUSTOMER_NOT_FOUND",
            message: "Customer not found",
          });
        }

        // No need to combine with audit history
        return ok(customer);
      } catch (error) {
        logger.error({
          msg: "Error getting customer",
          error,
        });
        return err({
          type: "GET_CUSTOMER_ERROR",
          message: "Failed to retrieve customer",
          cause: error,
        });
      }
    },

    listCustomers: async (
      query: ListCustomersSchema,
    ): Promise<Result<ListCustomersResponseSchema, CustomerServiceError>> => {
      try {
        // Use defaults from locally defined ListCustomersSchema
        const { page, limit, search, orderBy, orderDirection } = query;

        const workspaceResult = await verifyWorkspace();
        if (workspaceResult.isErr()) {
          return err(workspaceResult.error);
        }

        const offset = (page - 1) * limit;

        const filters = [eq(customersTable.workspaceId, workspaceId)];

        if (search) {
          const searchFilter = or(
            ilike(customersTable.firstName, `%${search}%`),
            ilike(customersTable.lastName, `%${search}%`),
            ilike(customersTable.email, `%${search}%`),
            ilike(customersTable.phoneNumber, `%${search}%`),
          );
          if (searchFilter) {
            filters.push(searchFilter);
          }
        }

        // Ensure orderBy field exists in the schema
        const orderByColumn =
          {
            firstName: customersTable.firstName,
            lastName: customersTable.lastName,
            email: customersTable.email,
            phoneNumber: customersTable.phoneNumber,
            createdAt: customersTable.createdAt,
            updatedAt: customersTable.updatedAt,
          }[orderBy] ?? customersTable.createdAt; // Default to createdAt

        const whereClause = and(...filters);

        // Simplified query - no 'with' clause for notes
        const [customerList, totalCountResult] = await Promise.all([
          db.query.customersTable.findMany({
            limit: limit,
            offset,
            orderBy:
              orderDirection === "desc"
                ? desc(orderByColumn)
                : asc(orderByColumn),
            where: whereClause,
          }),
          db
            .select({ count: sql<number>`count(*)` })
            .from(customersTable)
            .where(whereClause),
        ]);

        const totalCount = Number(totalCountResult[0]?.count ?? 0);
        const totalPages = Math.ceil(totalCount / limit);

        return ok({
          data: SelectCustomerSchema.array().parse(customerList),
          pagination: {
            // Use local PaginationSchema structure
            currentPage: page,
            totalPages,
            pageSize: limit,
            totalCount,
          },
        });
      } catch (error) {
        logger.error({
          msg: "Error listing customers",
          error,
        });
        return err({
          type: "LIST_CUSTOMERS_ERROR",
          message: "Failed to list customers",
          cause: error,
        });
      }
    },
  };
};

export type CustomersService = ReturnType<typeof createCustomersService>;
