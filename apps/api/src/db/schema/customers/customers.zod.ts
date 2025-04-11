import { createSelectSchema } from "drizzle-zod";
import { CustomerId, MemberId, WorkspaceId } from "typeid";
import { z } from "zod";
import { customersTable } from "./customers.db";

// Customer Schemas
export const SelectCustomerSchema = createSelectSchema(customersTable, {
  id: CustomerId,
  updatedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  createdBy: MemberId,
  updatedBy: MemberId,
  workspaceId: WorkspaceId,
});
export const InsertCustomerSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().max(50).optional(),
  email: z.string().email().max(100).optional(),
  phoneNumber: z.string().max(50).optional(),
});
export type SelectCustomerSchema = z.infer<typeof SelectCustomerSchema>;
export type InsertCustomerSchema = z.infer<typeof InsertCustomerSchema>;
