import { routing } from "@/navigation";
import { getRequestConfig } from "next-intl/server";
import { z } from "zod";

const _localeSchema = z.enum(["en", "sl", "ge"] as const);

export default getRequestConfig(async ({ requestLocale }) => {
  // Get and validate the locale from the request
  let locale = (await requestLocale) as "en" | "sl" | "ge";

  // Ensure we have a valid locale, falling back to default if needed
  if (!(locale && routing.locales.includes(locale))) {
    locale = routing.defaultLocale;
  }

  try {
    // Load messages for the locale using a more reliable import path
    const messages = (await import(`@/messages/${locale}.json`)).default;

    return {
      locale,
      messages,
      // Now is a good time to set timeZone if needed
      timeZone: "Europe/Ljubljana",
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);

    // If messages fail to load, fall back to default locale
    locale = routing.defaultLocale;
    try {
      const messages = (await import(`@/messages/${locale}.json`)).default;
      return {
        locale,
        messages,
        timeZone: "Europe/Ljubljana",
      };
    } catch (fallbackError) {
      console.error(
        `Failed to load fallback messages for locale ${routing.defaultLocale}:`,
        fallbackError,
      );
      throw new Error(
        `Failed to load messages for both ${locale} and ${routing.defaultLocale}`,
      );
    }
  }
});
