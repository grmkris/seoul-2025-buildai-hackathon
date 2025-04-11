import { cn } from "@/lib/utils";
import type React from "react";

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTitle({ children, className }: PageTitleProps) {
  return (
    <h1 className={cn("text-2xl font-bold tracking-tight", className)}>
      {children}
    </h1>
  );
}
