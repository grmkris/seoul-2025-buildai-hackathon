import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash } from "lucide-react";
import { useFieldArray, type useForm } from "react-hook-form";
import * as z from "zod";
import { beautifyObjectName } from "../utils";
import AutoFormObject from "./object";

function isZodArray(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  item: z.ZodArray<any> | z.ZodDefault<any>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): item is z.ZodArray<any> {
  return item instanceof z.ZodArray;
}

function isZodDefault(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  item: z.ZodArray<any> | z.ZodDefault<any>,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
): item is z.ZodDefault<any> {
  return item instanceof z.ZodDefault;
}

export default function AutoFormArray({
  name,
  item,
  form,
  path = [],
  fieldConfig,
}: {
  name: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  item: z.ZodArray<any> | z.ZodDefault<any>;
  form: ReturnType<typeof useForm>;
  path?: string[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  fieldConfig?: any;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });
  const title = item._def.description ?? beautifyObjectName(name);

  const itemDefType = isZodArray(item)
    ? item._def.type
    : isZodDefault(item)
      ? item._def.innerType._def.type
      : null;

  return (
    <AccordionItem value={name} className="border-none">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>
        {fields.map((_field, index) => {
          const key = _field.id;
          return (
            <div className="mt-4 flex flex-col" key={`${key}`}>
              <AutoFormObject
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                schema={itemDefType as z.ZodObject<any, any>}
                form={form}
                fieldConfig={fieldConfig}
                path={[...path, index.toString()]}
              />
              <div className="my-4 flex justify-end">
                <Button
                  variant="secondary"
                  size="icon"
                  className="hover:bg-zinc-300 hover:text-black focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-white dark:text-black dark:hover:bg-zinc-300 dark:hover:text-black dark:hover:ring-0 dark:hover:ring-offset-0 dark:focus-visible:ring-0 dark:focus-visible:ring-offset-0"
                  onClick={() => remove(index)}
                >
                  <Trash className="size-4" />
                </Button>
              </div>

              <Separator />
            </div>
          );
        })}
        <Button
          variant="secondary"
          onClick={() => append({})}
          className="mt-4 flex items-center"
        >
          <Plus className="mr-2" size={16} />
          Add
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
