import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputWithAddonsProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  containerClassName?: string;
}

const InputWithAddons = React.forwardRef<
  HTMLInputElement,
  InputWithAddonsProps
>(({ leading, trailing, containerClassName, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        "group border-input ring-offset-background focus-within:ring-ring flex h-10 w-full overflow-hidden rounded-md border bg-transparent text-base focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-hidden",
        containerClassName,
      )}
    >
      {leading ? (
        <div className="border-input bg-muted border-r px-3 py-2 text-base">
          {leading}
        </div>
      ) : null}
      <input
        className={cn(
          "bg-background placeholder:text-muted-foreground w-full rounded-md px-3 py-2 text-base focus:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
      {trailing ? (
        <div className="border-input bg-muted border-l px-3 py-2 text-base">
          {trailing}
        </div>
      ) : null}
    </div>
  );
});
InputWithAddons.displayName = "InputWithAddons";

export { InputWithAddons };
