import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const ORGANIZATION_ROLES = ["owner", "admin", "member"] as const;
export const OrganizationRole = z.enum(ORGANIZATION_ROLES);
export type OrganizationRole = z.infer<typeof OrganizationRole>;

export const SYSTEM_ROLES = ["admin", "user"] as const;
export const SystemRole = z.enum(SYSTEM_ROLES);
export type SystemRole = z.infer<typeof SystemRole>;
