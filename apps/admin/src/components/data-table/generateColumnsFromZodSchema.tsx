import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  beautifyObjectName,
  getBaseSchema,
  getBaseType,
} from "@/components/ui/auto-form/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckIcon, DotsHorizontalIcon, PlusIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import type React from "react";
import { useEffect } from "react";
import { type HTMLProps, useRef } from "react";
import type { z } from "zod";

type ExtractKeys<T> = T extends z.ZodObject<infer U> ? keyof U : never;

export function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof indeterminate === "boolean" && ref.current) {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [indeterminate, rest.checked]);

  return (
    <div
      className={cn(
        "flex h-full items-center",
        rest.checked && "opacity-100",
        !rest.checked && "opacity-0 hover:opacity-100",
      )}
    >
      <label
        htmlFor="default-checkbox"
        className={cn(
          className,
          "border-primary-500 relative z-10 h-[14px]! w-[14px] rounded border",
          rest.checked ? "bg-primary-500" : "bg-primary-100",
        )}
      >
        {rest.checked && (
          <CheckIcon className="absolute top-0.5 left-0.5 z-10 size-4" />
        )}
        <input
          ref={ref}
          {...rest}
          id="default-checkbox"
          type="checkbox"
          value=""
          className="hidden"
        />
      </label>
    </div>
  );
}

type Config<RowData> = {
  name?: string;
  type?: string;
  enableOrdering?: boolean;
  enableSearch?: boolean;
  enableFiltering?: boolean;
  enableSorting?: boolean;
  header?: string | React.ReactNode;
  render?: ((value: RowData) => React.ReactNode) | false; // T represents the type of the value for the specific column
};

export type ExtractShape<T> = T extends z.ZodObject<infer U> ? U : never;

/**
 * This tells TypeScript that a ConfigType object can have any string as a key,
 * and the value for that key will be of type Config or undefined.
 */
export type RowConfig<T, RowData> = {
  [K in ExtractKeys<T>]?: Config<RowData>;
};

export type TableActions<RowData> = {
  onEdit?: (props: { id: string; input: RowData }) => void;
  onDelete?: (id: string) => void;
  onRowClick?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => boolean;
  onAdd?: () => void;
  onDuplicate?: () => void;
};

export function generateColumnsFromZodSchema<
  // We use z.ZodRawShape instead of any to be more specific
  T extends z.ZodObject<z.ZodRawShape>,
  RowData extends z.infer<T>,
>(props: {
  schema: T;
  config?: RowConfig<T, RowData>;
  actions?: TableActions<RowData>;
}): ColumnDef<RowData>[] {
  const { schema, config, actions } = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  // @ts-expect-error TODO: fix this types
  const { shape } = getBaseSchema<T>(schema);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const columns: ColumnDef<RowData>[] = Object.keys(shape).map((name) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const item = shape[name] as z.ZodAny;
    const zodBaseType = getBaseType(item);
    const itemName = item._def.description ?? beautifyObjectName(name);
    // const key = [...path, name].join(".");
    console.log("itemName", itemName);
    const key = [name].join(".");
    return {
      id: key,
      accessorKey: key,
      header: (column) => {
        // render DataTableColumnHeader if ordering is enabled otherwise render just basic header
        // @ts-expect-error TODO: fix this types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (config?.[key]?.enableOrdering) {
          return (
            <DataTableColumnHeader
              column={column.column}
              // @ts-expect-error TODO: fix this types
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
              title={config?.[key]?.header ? config?.[key]?.header : itemName}
            />
          );
        }
        return <div className="text-sm opacity-70">{itemName}</div>;
      },
      cell: (row) => {
        // render nice looking value for date
        if (zodBaseType === "ZodDate") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return new Date(row.row.original[key]).toLocaleDateString();
        }
        // render regular value for other types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return row.row.original[key];
      },
    };
  });

  // remove columns with render=false
  for (const column of columns) {
    const columnConfig = config?.[column.id as keyof typeof config];
    if (columnConfig?.render === false) {
      columns.splice(columns.indexOf(column), 1);
    }
  }

  // Update the cell rendering logic
  for (const column of columns) {
    const columnConfig = config?.[column.id as keyof typeof config];
    if (columnConfig?.render) {
      column.cell = (info) =>
        // @ts-expect-error TODO: fix this types
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        columnConfig.render?.(schema.parse(info.row.original));
    }

    if (columnConfig?.header && !columnConfig.enableOrdering) {
      column.header = () => (
        <span className="text-sm text-black opacity-70">
          {columnConfig.header}
        </span>
      );
    }
  }

  if (actions?.onDelete ?? actions?.onEdit ?? actions?.onDuplicate) {
    columns.push({
      id: "actions",
      accessorKey: "actions",
      header: () => {
        return (
          <>
            {actions?.onAdd && (
              <div>
                <Button variant="ghost" onClick={actions?.onAdd}>
                  <PlusIcon className="size-4" />
                </Button>
              </div>
            )}
          </>
        );
      },
      cell: (row) => {
        return (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="mr-2 h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions?.onEdit && (
                <DropdownMenuItem
                  onClick={() =>
                    actions?.onEdit?.({
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      input: schema.parse(row.row.original),
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore TODO we should be able to fix this by requiring an id on the input object
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      id: row.row.original.id,
                    })
                  }
                >
                  Edit
                </DropdownMenuItem>
              )}
              {actions?.onDuplicate && (
                <DropdownMenuItem onClick={() => actions?.onDuplicate?.()}>
                  Duplicate
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore TODO we should be able to fix this by requiring an id on the input object
                onClick={() =>
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore TODO we should be able to fix this by requiring an id on the input object
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                  actions?.onDelete?.(row.row.original.id)
                }
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    });
  }

  // if onSelect is enabled add checkbox column as first column
  if (actions?.onSelect) {
    columns.unshift({
      id: "selected",
      accessorKey: "selected",
      header: () => <></>,
      cell: (row) => (
        <div className="flex h-[88px]! cursor-pointer flex-col gap-1">
          <IndeterminateCheckbox
            className="bg-primary-100 my-4 ml-[10px] h-full cursor-pointer"
            {...{
              checked: row.row.getIsSelected(),
              disabled: !row.row.getCanSelect(),
              indeterminate: row.row.getIsSomeSelected(),
              onChange: () => {
                if (actions?.onSelect) {
                  actions.onSelect(row.row.id, !row.row.getIsSelected());
                }
                row.row.toggleSelected(!row.row.getIsSelected());
              },
            }}
          />
        </div>
      ),
    });
  }

  return columns;
}
