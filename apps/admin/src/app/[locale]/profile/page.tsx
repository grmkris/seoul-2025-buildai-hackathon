"use client";

import {
  type Organization,
  useCurrentUser,
  useOrganizations,
} from "@/app/[locale]/auth/authHooks";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import type * as React from "react";
import type { CurrentUser } from "../auth/authActions";

function OrganizationList({
  organizations,
}: {
  organizations: Organization[];
}) {
  const t = useTranslations("Profile");
  const router = useRouter();
  const handleEnterOrganization = (organizationId: string) => {
    router.push(`${organizationId}?tab=workspaces`);
  };

  return (
    <div className="space-y-4">
      {organizations.map((org) => (
        <Card key={org.id}>
          <CardHeader>
            <CardTitle>{org.name}</CardTitle>
            <CardDescription>
              {t("organizationId")}: {org.id}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p>
                {t("memberSince")}:{" "}
                {new Date(org.createdAt).toLocaleDateString()}
              </p>
              <Button onClick={() => handleEnterOrganization(org.id)}>
                {t("enter")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProfileForm({ user }: { user: CurrentUser }) {
  const t = useTranslations("Profile");

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          name="name"
          defaultValue={user.user.name || ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          defaultValue={user.user.email || ""}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t("newPassword")}</Label>
        <Input id="password" name="password" type="password" />
      </div>
      <Button type="submit">{t("updateProfile")}</Button>
    </form>
  );
}

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const { user } = useCurrentUser();
  const organizations = useOrganizations();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get active tab from URL or default to 'info'
  const activeTab = searchParams.get("tab") || "info";

  if (!user) {
    return <div>Loading...</div>;
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{t("title")}</h1>
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>{t("info")}</CardTitle>
              <CardDescription>{t("editProfileDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organizations">
          <Card>
            <CardHeader>
              <CardTitle>{t("yourOrganizations")}</CardTitle>
              <CardDescription>{t("organizationsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizationList organizations={organizations.data || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>{t("recentActivity")}</CardTitle>
              <CardDescription>{t("activityDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("comingSoon")}</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>{t("accountSettings")}</CardTitle>
              <CardDescription>{t("settingsDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("language")}</h3>
                  <div className="w-40 border border-gray-200 p-1 rounded-lg">
                    <LocaleSwitcher />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t("theme")}</h3>
                  <div className="border border-gray-200 rounded-lg w-fit">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
