import type { Table } from "drizzle-orm";
import { customType, timestamp } from "drizzle-orm/pg-core";
import {
  type IdTypePrefixNames,
  type TypeId,
  typeIdFromUUID,
  typeIdToUUID,
} from "typeid";

// --- TypeID column type generator (Adding this back) ---
export const typeId = <const T extends IdTypePrefixNames>(
  prefix: T,
  columnName: string,
) =>
  customType<{
    data: TypeId<T>;
    driverData: string; // Stored as UUID string in DB
  }>({
    dataType() {
      // Use 'uuid' type in PostgreSQL
      return "uuid";
    },
    fromDriver(input: string): TypeId<T> {
      // Input is a UUID string from DB, convert back to full TypeID string
      return typeIdFromUUID(prefix, input);
    },
    toDriver(input: TypeId<T>): string {
      // Input is a full TypeID string, extract UUID part for DB
      return typeIdToUUID(input).uuid;
    },
  })(columnName);

/**
 * Standard timestamp field with timezone support
 * @param name The column name
 * @returns A configured timestamp field
 *
 * @example
 * // For a required timestamp with default value
 * createTimestampField("created_at").defaultNow().notNull()
 *
 * // For a nullable timestamp field
 * createTimestampField("deleted_at")
 */
export const createTimestampField = (name?: string) => {
  if (!name) {
    return timestamp({ withTimezone: true, mode: "date" });
  }
  return timestamp(name, { withTimezone: true, mode: "date" });
};

/**
 * Base timestamp fields that should be included in most entity tables
 */
export const baseEntityFields = {
  createdAt: createTimestampField("created_at").defaultNow().notNull(),
  updatedAt: createTimestampField("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/**
 * Create a standard user reference field for created_by
 * @param targetTable The members table to reference
 * @returns A configured created_by field with reference
 */
export const createCreatedByField = (targetTable?: Table) => {
  const field = typeId("customer", "created_by").notNull();

  if (targetTable) {
    // @ts-expect-error id is a column in the members table
    return field.references(() => targetTable.id);
  }

  return field;
};

export const createMemberCreatedByField = (targetTable?: Table) => {
  const field = typeId("member", "created_by");

  if (targetTable) {
    // @ts-expect-error id is a column in the members table
    return field.references(() => targetTable.id);
  }

  return field;
};

/**
 * Create a standard user reference field for updated_by
 * @param targetTable The members table to reference
 * @returns A configured updated_by field with reference
 */
export const createUpdatedByField = (targetTable?: Table) => {
  const field = typeId("customer", "updated_by").notNull();

  if (targetTable) {
    // @ts-expect-error id is a column in the members table
    return field.references(() => targetTable.id);
  }

  return field;
};

/**
 * Create a standard workspace reference field
 * @param workspacesTable The workspaces table to reference
 * @returns A configured workspace_id field with reference
 */
export const createWorkspaceIdField = (workspacesTable?: Table) => {
  const field = typeId("workspace", "workspace_id").notNull();

  if (workspacesTable) {
    // @ts-expect-error id is a column in the workspaces table
    return field.references(() => workspacesTable.id);
  }

  return field;
};

/**
 * Create auditable entity fields (created_by, updated_by)
 * @param membersTable The members table to reference
 * @returns Object with created_by and updated_by fields
 */
export const createAuditableEntityFields = (membersTable?: Table) => ({
  ...baseEntityFields,
  createdBy: createCreatedByField(membersTable),
  updatedBy: createUpdatedByField(membersTable),
});

/**
 * Create workspace entity fields (workspace_id)
 * @param workspacesTable The workspaces table to reference
 * @returns Object with workspace_id field
 */
export const createWorkspaceEntityFields = (workspacesTable?: Table) => ({
  ...baseEntityFields,
  workspaceId: createWorkspaceIdField(workspacesTable),
});

/**
 * Create fully auditable workspace entity fields
 * @param membersTable The user table to reference
 * @param workspacesTable The workspaces table to reference
 * @returns Object with created_by, updated_by, and workspace_id fields
 */
export const createFullEntityFields = (
  targetTable?: Table,
  workspacesTable?: Table,
) => ({
  ...baseEntityFields,
  createdBy: createCreatedByField(targetTable),
  updatedBy: createUpdatedByField(targetTable),
  workspaceId: createWorkspaceIdField(workspacesTable),
});

export const createMemberUpdatedByField = (targetTable?: Table) => {
  const field = typeId("member", "updated_by");

  if (targetTable) {
    // @ts-expect-error id is a column in the members table
    return field.references(() => targetTable.id);
  }

  return field;
};

export const createFullEntityFieldsWithMember = (
  targetTable?: Table,
  workspacesTable?: Table,
) => ({
  ...createFullEntityFields(targetTable, workspacesTable),
  createdBy: createMemberCreatedByField(targetTable),
  updatedBy: createMemberUpdatedByField(targetTable),
});
