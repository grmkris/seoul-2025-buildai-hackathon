"use client";

import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/navigation";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { useTranslations } from "next-intl";

import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import type { Order } from "../../../orders/_lib/orderActions";

interface CustomerOrdersListProps {
  orders: Order[];
}

export function CustomerOrdersList({ orders }: CustomerOrdersListProps) {
  const t = useTranslations("Workspace.Customers");
  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderDate", desc: true },
  ]);

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: t("orderId"),
      cell: ({ row }) => (
        <span className="font-medium">{row.original.id.slice(0, 8)}...</span>
      ),
    },
    {
      accessorKey: "orderDate",
      header: t("orderDate"),
      cell: ({ row }) => format(new Date(row.original.orderDate), "PPP"),
      sortingFn: "datetime",
    },
    {
      accessorKey: "status",
      header: t("status"),
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "delivered"
              ? "default"
              : row.original.status === "in progress"
                ? "secondary"
                : row.original.status === "cancelled"
                  ? "destructive"
                  : "outline"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: t("totalAmount"),
      cell: ({ row }) => (
        <span className="font-medium">
          {Number.parseFloat(row.original.totalAmount).toFixed(2)}€
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button asChild>
            <Link
              href={`/${activeOrganization}/${activeWorkspace}/orders/${row.original.id}`}
              aria-label={t("viewOrder")}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-8 text-center">
        <p className="text-muted-foreground">{t("noOrdersFound")}</p>
        <Button asChild className="mt-4">
          <Link
            href={`/${activeOrganization}/${activeWorkspace}/orders/new?customerId=${orders[0]?.customerId}`}
          >
            {t("createFirstOrder")}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
