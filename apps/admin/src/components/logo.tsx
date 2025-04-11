"use client";

import { MessageCircle } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

export function Logo({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div className="flex items-center gap-3" {...props}>
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
        <MessageCircle className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="text-lg font-semibold">AI Assistant</span>
    </div>
  );
}
