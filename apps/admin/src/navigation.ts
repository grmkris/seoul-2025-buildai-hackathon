import { localePrefix, locales, pathnames } from "@/config";
import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales,
  pathnames,
  localePrefix,
  defaultLocale: "en",
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createNavigation(routing);
