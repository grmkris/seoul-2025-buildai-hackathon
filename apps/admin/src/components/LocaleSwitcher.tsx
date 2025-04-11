"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { locales } from "@/config";
import { usePathname, useRouter } from "@/navigation";
import { ChevronDown, Earth } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import React, { useTransition } from "react";

export const LocaleSwitcher = () => {
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");
  const [, starTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();
  const locale = useLocale();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex w-full items-center justify-between">
          <Earth className="size-4" />
          <span>{t("locale", { locale: locale })}</span>
          <ChevronDown className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.length > 0 ? (
          locales.map((loc) => (
            <DropdownMenuItem
              key={loc}
              onSelect={() =>
                starTransition(() =>
                  // @ts-expect-error todo params should be the same
                  router.replace({ pathname, params }, { locale: loc }),
                )
              }
            >
              {t("locale", { locale: loc })}
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem disabled>No locale found</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
