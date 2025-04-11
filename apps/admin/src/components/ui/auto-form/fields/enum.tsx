import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type * as z from "zod";
import AutoFormLabel from "../common/label";
import AutoFormTooltip from "../common/tooltip";
import type { AutoFormInputComponentProps } from "../types";
import { getBaseSchema } from "../utils";

export default function AutoFormEnum({
  label,
  isRequired,
  field,
  fieldConfigItem,
  zodItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const baseValues = (getBaseSchema(zodItem) as unknown as z.ZodEnum<any>)._def
    .values;

  let values: [string, string][] = [];
  if (Array.isArray(baseValues)) {
    values = baseValues.map((value) => [String(value), String(value)]);
  } else {
    values = Object.entries(baseValues);
  }

  return (
    <FormItem>
      <AutoFormLabel
        label={fieldConfigItem?.label || label}
        isRequired={isRequired}
      />
      <FormControl>
        <Select
          onValueChange={field.onChange}
          value={field.value}
          {...fieldProps}
        >
          <SelectTrigger className={fieldProps.className}>
            <SelectValue
              placeholder={
                fieldConfigItem.inputProps?.placeholder ?? "Select an option"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {values.map(([value, label]) => (
              <SelectItem value={value} key={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormControl>
      <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
      <FormMessage />
    </FormItem>
  );
}
