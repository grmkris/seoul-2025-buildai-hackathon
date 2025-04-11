"use client";

import { CommandButton } from "@/app/_lib/components/command-palette";
import type { ReactNode } from "react";

export function ClientCommandProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <CommandButton />
    </>
  );
}
