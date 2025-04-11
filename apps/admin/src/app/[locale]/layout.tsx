import "stop-runaway-react-effects/hijack";
import { Providers } from "@/components/providers";
import { env } from "@/env/serverEnvs";
import { authClient } from "@/lib/authClient";
import { Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";
import "stop-runaway-react-effects/hijack";
import { ClientCommandProvider } from "@/app/_lib/ClientCommandProvider";
import { ClientSidebar } from "@/app/_lib/ClientSidebar";
import { DashboardLoader } from "@/app/_lib/DashboardLoader";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { locales } from "@/config";
import { headers } from "next/headers";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jb = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return { title: t("title") };
}

export default async function RootLayout(props: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  setRequestLocale(locale);
  const user = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  });
  const messages = await getMessages();

  const isAuthenticated = !!user?.data?.session?.id;
  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icon-192x192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* Add the following meta tag to prevent zoom on input focus */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>

      <body
        className={`${inter.variable} ${jb.variable} ${env.NODE_ENV === "development" ? "debug-screens" : ""}`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <NuqsAdapter>
              {isAuthenticated ? (
                <SidebarProvider>
                  <ClientCommandProvider>
                    <DashboardLoader>
                      <ClientSidebar />
                      <SidebarInset className="relative">
                        <SidebarTrigger className="absolute left-5 top-5 lg:hidden" />
                        {children}
                      </SidebarInset>
                    </DashboardLoader>
                  </ClientCommandProvider>
                </SidebarProvider>
              ) : (
                children
              )}
            </NuqsAdapter>
          </Providers>
          <Toaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
