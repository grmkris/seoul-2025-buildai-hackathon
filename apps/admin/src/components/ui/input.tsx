import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  value,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      value={value ?? ""}
      className={cn(
        "!border-gray-300 bg-base-background file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-teal-500 focus-visible:ring-teal-500/30 focus-visible:ring-[3px]",
        "aria-invalid:ring-teal-500/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
