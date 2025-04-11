import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/authClient";
import { Link } from "@/navigation";
import { LogIn, UserPlus } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { headers } from "next/headers";
// Define a local LoadingSkeleton for the Suspense fallback
const _LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-32" />
    <div className="flex items-center gap-6">
      <Skeleton className="h-10 w-24" />
      <Skeleton className="h-10 w-32" />
    </div>
  </div>
);

// Server Component as the main page
export default async function Page(props: {
  params: { locale: string };
}) {
  const { locale } = await props.params;

  setRequestLocale(locale);
  const t = await getTranslations("Auth");
  const user = await authClient.getSession({
    fetchOptions: { headers: await headers() },
  }); // TODOO this is quite a hack. just temporary to get UI working, we should fix before this goes to production

  console.log("user", user);
  const isAuthenticated = !!user?.data?.session?.id;
  if (!user.data?.session.activeOrganizationId && isAuthenticated) {
    console.warn("hack in root page to get UI working - auth orgs active fix");
    const orgs = await authClient.organization.list({
      fetchOptions: { headers: await headers() },
    });
    console.log("orgs", orgs);
    if (orgs.data && orgs.data.length > 0) {
      const org = orgs.data[0];
      if (org) {
        console.log("setting org", org);
        await authClient.organization.setActive({
          organizationId: org.id,
          fetchOptions: { headers: await headers() },
        });
        console.log("set org", org);
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex flex-col items-center gap-8 text-center">
        {isAuthenticated ? (
          <div>{t("welcome")}</div>
        ) : (
          <div className="flex items-center gap-6">
            <Button asChild>
              <Link href={"/login"}>
                <LogIn className="mr-2 size-5" />
                {t("login")}
              </Link>
            </Button>
            <Button asChild>
              <Link href={"/get-started"}>
                <UserPlus className="mr-2 size-5" />
                {t("getStarted")}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
