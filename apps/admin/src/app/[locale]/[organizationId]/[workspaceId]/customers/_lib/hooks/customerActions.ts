import { customerClient } from "@/lib/api/apiClient";
import type { InferRequestType, InferResponseType } from "hono/client";
import type {
  CustomerId,
  NoteId,
  OrganizationId,
  WorkspaceId,
} from "typeid";

// Customer API endpoints
const customerPostEndpoint =
  customerClient.admin.organizations[":organizationId"].workspaces[":workspaceId"]
    .customers.$post;
const _customerPutEndpoint =
  customerClient.admin.organizations[":organizationId"].workspaces[":workspaceId"]
    .customers[":customerId"].$put;
const customerDeleteEndpoint =
  customerClient.admin.organizations[":organizationId"].workspaces[":workspaceId"]
    .customers[":customerId"].$delete;
const customersGetEndpoint =
  customerClient.admin.organizations[":organizationId"].workspaces[":workspaceId"]
    .customers.$get;
const customerGetEndpoint =
  customerClient.admin.organizations[":organizationId"].workspaces[":workspaceId"]
    .customers[":customerId"].$get;


// Export types inferred from API client
export type InsertCustomerSchema = InferRequestType<
  typeof customerPostEndpoint
>["json"];
export type ListCustomersSchema = InferRequestType<
  typeof customersGetEndpoint
>["query"];

// Response types inferred from API endpoints
export type CustomerResponse = InferResponseType<
  typeof customerGetEndpoint,
  200
>;
export type CustomersResponse = InferResponseType<
  typeof customersGetEndpoint,
  200
>;

export type Customer = CustomersResponse["data"][number];


export interface OrderItem {
  id: string;
  totalAmount: number;
  status: string;
  orderDate: string | Date;
}

export const createCustomer = async (props: {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  data: InsertCustomerSchema;
}) => {
  const response = await customerClient.admin.organizations[
    ":organizationId"
  ].workspaces[":workspaceId"].customers.$post({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
    },
    json: props.data,
    header: {},
  });
  if (!response.ok) {
    throw new Error("Failed to create customer");
  }
  return response.json();
};

export const editCustomer = async (props: {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  id: CustomerId;
  data: InsertCustomerSchema;
}) => {
  const response = await customerClient.admin.organizations[
    ":organizationId"
  ].workspaces[":workspaceId"].customers[":customerId"].$put({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
      customerId: props.id,
    },
    json: props.data,
    header: {},
  });
  if (!response.ok) {
    throw new Error("Failed to edit customer");
  }
  return response.json();
};

export const deleteCustomer = async (props: {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  id: CustomerId;
}) => {
  const response = await customerClient.admin.organizations[
    ":organizationId"
  ].workspaces[":workspaceId"].customers[":customerId"].$delete({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
      customerId: props.id,
    },
    header: {},
  });
  if (!response.ok) {
    throw new Error("Failed to delete customer");
  }
  return response.json();
};

export const getCustomers = async (props: {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  params?: ListCustomersSchema;
}) => {
  const response = await customerClient.admin.organizations[
    ":organizationId"
  ].workspaces[":workspaceId"].customers.$get({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
    },
    query: props.params ?? {},
    header: {},
  });
  if (!response.ok) {
    throw new Error("Failed to get customers");
  }
  return response.json();
};

export const getCustomer = async (props: {
  organizationId: OrganizationId;
  workspaceId: WorkspaceId;
  id: CustomerId;
}) => {
  const response = await customerClient.admin.organizations[
    ":organizationId"
  ].workspaces[":workspaceId"].customers[":customerId"].$get({
    param: {
      organizationId: props.organizationId,
      workspaceId: props.workspaceId,
      customerId: props.id,
    },
    header: {},
  });
  if (!response.ok) {
    throw new Error("Failed to get customer");
  }
  return response.json();
};
