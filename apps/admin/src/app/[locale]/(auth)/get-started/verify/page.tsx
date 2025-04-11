import { VerificationForm } from "@/app/[locale]/(auth)/get-started/verify/verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "@/navigation";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export const metadata: Metadata = {
  title: "Verify Your Email",
  description: "Almost there!",
};

export default function VerifyPage(props: {
  searchParams: Promise<{ email: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const params = use(props.params);

  const { locale } = params;

  const searchParams = use(props.searchParams);

  const { email } = searchParams;

  setRequestLocale(locale);
  const t = useTranslations("Auth");
  if (!email || Array.isArray(email)) {
    return redirect({
      href: "/get-started",
      locale: locale || "en",
    });
  }

  return (
    <div className="flex h-full items-center">
      <Card className="mx-auto w-[32rem] max-w-lg">
        <CardHeader>
          <CardTitle>{t("verifyYourEmail")}</CardTitle>
          <CardDescription>{t("almostThere")}</CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
