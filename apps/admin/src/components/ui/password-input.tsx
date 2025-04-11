"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<PasswordInputProps, "type">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="flex gap-2">
      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground/50 flex h-10 w-full flex-1 rounded-md border px-3 py-2 text-base file:border-0 file:bg-transparent file:text-base file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "text-sm",
          "text-muted-foreground",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </Button>
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
