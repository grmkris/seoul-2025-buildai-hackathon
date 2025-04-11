import { LoginForm } from "@/app/[locale]/(auth)/login/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { use } from "react";

import { Link } from "@/navigation";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Welcome back to your account",
};

export default function LoginPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);

  const { locale } = params;

  setRequestLocale(locale);
  const t = useTranslations("Auth");
  return (
    <div className="flex h-full items-center">
      <Card className="mx-auto w-[32rem] max-w-lg">
        <CardHeader>
          <CardTitle>{t("signIn")}</CardTitle>
          <CardDescription>{t("welcomeBack")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div>
            <span>{t("dontHaveAnAccount")} </span>
            <Link className="text-teal-600 underline" href={"/get-started"}>
              {t("createAccount")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
