import { SignUp } from "@/app/[locale]/(auth)/get-started/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/navigation";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your account",
};

export default function GetStartedPage(props: {
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
          <CardTitle>{t("createAccount")}</CardTitle>
          <CardDescription>{t("joinOurCommunity")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUp />
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div>
            <span>{t("alreadyHaveAccount")} </span>
            <Link className="text-teal-600 underline" href={"/login"}>
              {t("signIn")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
