import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Command as CommandPrimitive } from "cmdk";
import React, { useState } from "react";
import type { z } from "zod";

import { X } from "lucide-react";
import type { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";

export const AutoFormMultiselector = ({
  field,
  fieldConfigItem,
  zodItem,
}: AutoFormInputComponentProps) => {
  const [open, setOpen] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>,@typescript-eslint/no-unsafe-assignment
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values;

  let values: [string, string][] = [];
  if (Array.isArray(baseValues)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    values = baseValues.map((value) => [value, value]);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    values = Object.entries(baseValues);
  }

  return (
    <FormItem>
      <FormControl className={"overflow-y-scroll"}>
        <Command className="overflow-visible bg-transparent">
          <div className="group border-input ring-offset-background rounded-lg border-2 p-4 text-sm focus-within:border-gray-300">
            <div className="flex flex-wrap gap-1">
              {Array.isArray(field.value) &&
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                field.value.map((option: any) => {
                  return (
                    <Badge
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                      key={option}
                      variant="secondary"
                      className="flex h-7 flex-row gap-1"
                    >
                      <p>{option}</p>
                      <button
                        title="Remove"
                        type="button"
                        className="ring-offset-background ml-1 rounded-full outline-hidden"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => {
                          if (
                            Array.isArray(field.value) &&
                            field.value.includes(option)
                          ) {
                            const newValue = field.value.filter(
                              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                              (s: any) => s !== option,
                            );
                            field.onChange([...newValue]);
                          }

                          if (
                            !Array.isArray(field.value) &&
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                            field.value === option?.[0]
                          )
                            field.onChange([]);
                          setOpen(false);
                        }}
                      >
                        <X className="text-muted-foreground hover:text-foreground size-3" />
                      </button>
                    </Badge>
                  );
                })}
              <CommandPrimitive.Input
                ref={field.ref}
                value={undefined}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
                onClick={() => setOpen(true)}
                placeholder="Select options..."
                className="placeholder:text-muted-foreground ml-2 h-7 flex-1 bg-transparent px-3 py-4 outline-hidden"
              />
            </div>
          </div>
          <div className="relative mt-2">
            {open && values.length > 0 ? (
              <div className="bg-popover text-popover-foreground animate-in absolute top-0 z-50 contents w-full overflow-auto rounded-md border shadow-md outline-hidden">
                <CommandGroup className="overflow scrollable-sm flex h-full max-h-[240px] flex-col overflow-auto">
                  {values.map((option) => {
                    return (
                      <CommandItem
                        key={option[0]}
                        className={"cursor-pointer"}
                        onSelect={() => {
                          if (
                            Array.isArray(field.value) &&
                            !field.value.includes(option[0])
                          )
                            field.onChange([...field.value, option[0]]);

                          if (!Array.isArray(field.value))
                            field.onChange([option[0]]);
                          setOpen(false);
                        }}
                      >
                        <p>{option[1]}</p>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </div>
            ) : null}
          </div>
        </Command>
      </FormControl>
      {fieldConfigItem.description && (
        <FormDescription>{fieldConfigItem.description}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
};
