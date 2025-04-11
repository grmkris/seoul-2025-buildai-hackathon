import { setRequestLocale } from "next-intl/server";

export default async function TermsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  setRequestLocale(locale);
  return <div>Terms</div>;
}
