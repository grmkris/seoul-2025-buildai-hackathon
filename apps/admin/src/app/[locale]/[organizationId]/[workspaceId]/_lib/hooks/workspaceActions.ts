import { workspaceClient } from "@/lib/api/apiClient";
import type { InferRequestType, InferResponseType } from "hono/client";
import type { OrganizationId, WorkspaceId } from "typeid";

// Workspace API endpoints
const workspacePostEndpoint =
  workspaceClient.api.organizations[":organizationId"].workspaces.$post;
const workspacePutEndpoint =
  workspaceClient.api.organizations[":organizationId"].workspaces[":workspaceId"]
    .$put;
const workspacesGetEndpoint =
  workspaceClient.api.organizations[":organizationId"].workspaces.$get;

// Export types inferred from API client
export type InsertWorkspaceSchema = InferRequestType<
  typeof workspacePostEndpoint
>["json"];
export type UpdateWorkspaceSchema = InferRequestType<
  typeof workspacePutEndpoint
>["json"];

// Response types
export type WorkspaceResponse = InferResponseType<
  typeof workspacePutEndpoint,
  200
>;
export type WorkspacesResponse = InferResponseType<
  typeof workspacesGetEndpoint,
  200
>;

export type Workspace = WorkspacesResponse;

// Create a new workspace
export const createWorkspace = async (props: {
  organizationId: OrganizationId;
  data: InsertWorkspaceSchema;
}) => {
  const response = await workspaceClient.api.organizations[
    ":organizationId"
  ].workspaces.$post({
    param: { organizationId: props.organizationId },
    json: props.data,
    header: {},
  });

  if (!response.ok) {
    throw new Error("Failed to create workspace");
  }

  return response.json();
};

// Update an existing workspace
export const updateWorkspace = async (props: {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  data: UpdateWorkspaceSchema;
}) => {
  const response = await workspaceClient.api.organizations[
    ":organizationId"
  ].workspaces[":workspaceId"].$put({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
    },
    json: props.data,
    header: {},
  });

  if (!response.ok) {
    throw new Error("Failed to update workspace");
  }

  return response.json();
};

// Get all workspaces for an organization
export const getWorkspaces = async (props: {
  organizationId: OrganizationId;
}) => {
  const response = await workspaceClient.api.organizations[
    ":organizationId"
  ].workspaces.$get({
    param: { organizationId: props.organizationId },
    header: {},
  });

  if (!response.ok) {
    throw new Error("Failed to get workspaces");
  }

  return response.json();
};