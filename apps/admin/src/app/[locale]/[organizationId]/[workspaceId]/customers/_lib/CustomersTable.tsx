"use client";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/components/data-table/hooks/use-data-table";
import type { DataTableFilterField } from "@/components/data-table/types";
import { Link } from "@/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { AtSign, ExternalLinkIcon, Phone, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import React from "react";
import { z } from "zod";
import type { Customer, ListCustomersSchema } from "./hooks/customerActions";
import { useCustomers } from "./hooks/customerHooks";

const UrlParamsSchema = z.object({
  page: z.coerce.number().optional(),
  per_page: z.coerce.number().optional(),
  sort: z.string().optional(),
  search: z.string().optional(),
  firstName: z.string().optional(),
});


export function CustomersTable() {
  const t = useTranslations("Workspace.Customers");
  const searchParams = useSearchParams();
  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();

  const getColumns = React.useCallback(
    (): ColumnDef<Customer>[] => [
      {
        id: "name",
        accessorFn: (row) => `${row.firstName} ${row.lastName || ""}`.trim(),
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Full Name" />
        ),
        enableSorting: true,
        cell: ({ row }) => {
          const customer = row.original;
          return (
            <Link
              href={`/${activeOrganization}/${activeWorkspace}/customers/${customer.id}`}
              className="flex items-center gap-1 text-teal-500 hover:underline font-semibold"
              onClick={(e) => e.stopPropagation()}
            >
              <User size={16} />
              {customer.firstName} {customer.lastName}
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          );
        },
      },
      {
        accessorKey: "firstName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("firstName")} />
        ),
        enableSorting: true,
        enableHiding: true,
      },
      {
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("email")} />
        ),
        enableSorting: true,
        cell: ({ row }) => (
          <a
            href={`mailto:${row.getValue("email")}`}
            className="flex items-center gap-1 hover:underline text-teal-500"
            onClick={(e) => e.stopPropagation()}
          >
            <AtSign size={16} />
            {row.getValue("email")}
          </a>
        ),
      },
      {
        accessorKey: "phone",
        header: t("phone"),
        cell: ({ row }) => (
          <a
            href={`tel:${row.getValue("phone")}`}
            className="flex items-center gap-1 hover:underline text-teal-500"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone size={16} />
            {row.getValue("phone")}
          </a>
        ),
      },
      {
        accessorKey: "address",
        header: t("address"),
        cell: ({ row }) => (
          <div className="max-w-[200px] truncate">
            {row.getValue("address")}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("createdAt")} />
        ),
        enableSorting: true,
        cell: ({ row }) =>
          format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm"),
      },
    ],
    [t, activeOrganization, activeWorkspace],
  );

  const params = React.useMemo(() => {
    if (!searchParams) return {};
    const parsedParams = Object.fromEntries(searchParams.entries());
    const validatedParams = UrlParamsSchema.parse(parsedParams);

    console.log(validatedParams);

    const processedParams: Partial<ListCustomersSchema> = {
      page: validatedParams.page,
      limit: validatedParams.per_page,
      search: validatedParams.firstName,
    };

    if (validatedParams.sort) {
      const [orderBy, orderDirection] = validatedParams.sort.split(".");
      processedParams.orderBy = orderBy as
        | "firstName"
        | "lastName"
        | "email"
        | "phoneNumber"
        | "createdAt"
        | "updatedAt"
        | undefined;
      processedParams.orderDirection = orderDirection as "asc" | "desc";
    }

    return processedParams;
  }, [searchParams]);

  const data = useCustomers(params);

  const columns = React.useMemo(() => getColumns(), [getColumns]);

  const filterFields: DataTableFilterField<Customer>[] = [
    {
      value: "firstName",
      label: t("firstName"),
      placeholder: "Search customers...",
    },
    {
      value: "email",
      label: t("email"),
      placeholder: "Search by email...",
    },
  ];

  // Initialize table with empty data first
  const customers = data.data?.data || [];

  const { table } = useDataTable({
    data: customers,
    columns,
    filterFields,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    pageCount: data.data?.pagination?.totalPages || 1,
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  // Handle loading and error states after calling hooks
  if (data.isLoading) {
    return (
      <DataTableSkeleton
        columnCount={7}
        rowCount={10}
        searchableColumnCount={3}
        filterableColumnCount={3}
      />
    );
  }

  if (data.error) {
    return (
      <div>
        {t("error")}: {data.error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <DataTable table={table}>
        <DataTableToolbar table={table} filterFields={filterFields} />
      </DataTable>
    </div>
  );
}
