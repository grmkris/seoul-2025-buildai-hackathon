"use client";

import {
  useLoginWithEmail,
  useLoginWithUsername,
} from "@/app/[locale]/auth/authHooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/authClient";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { Key, Loader2, Mail, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const LoginForm = () => {
  const t = useTranslations("Auth");
  const [activeTab, setActiveTab] = useState<"email" | "username">("email");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { data: passkeys } = authClient.useListPasskeys();
  const passkeyEnabled = (passkeys?.length ?? 0) > 0;

  const { mutate: loginWithEmail, isPending: isEmailLoading } =
    useLoginWithEmail({
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : t("loginFailed"));
      },
    });

  const { mutate: loginWithUsername, isPending: isUsernameLoading } =
    useLoginWithUsername({
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : t("loginFailed"));
      },
    });

  const handleEmailLogin = () => {
    if (!(email && password)) {
      toast.error(t("provideEmailAndPassword"));
      return;
    }
    loginWithEmail({ email, password });
  };

  const handleUsernameLogin = () => {
    if (!(username && password)) {
      toast.error(t("provideUsernameAndPassword"));
      return;
    }
    loginWithUsername({ username, password });
  };

  const handlePasskeyLogin = async () => {
    try {
      await authClient.signIn.passkey();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("passkeyLoginFailed"),
      );
    }
  };

  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">{t("signIn")}</CardTitle>
        <CardDescription className="text-xs md:text-sm">
          {t("enterCredentials")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Tabs
            defaultValue="email"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "email" | "username")
            }
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {t("email")}
              </TabsTrigger>
              <TabsTrigger value="username" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {t("username")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <div className="mt-4 grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="username">
              <div className="mt-4 grid gap-2">
                <Label htmlFor="username">{t("username")}</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">{t("password")}</Label>
              <Link
                href="/forgot-password"
                className="ml-auto inline-block text-sm underline"
              >
                {t("forgotPassword")}
              </Link>
            </div>

            <Input
              id="password"
              type="password"
              placeholder="********"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => {
                setRememberMe(checked === true);
              }}
            />
            <Label htmlFor="remember">{t("rememberMe")}</Label>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isEmailLoading || isUsernameLoading}
            onClick={
              activeTab === "email" ? handleEmailLogin : handleUsernameLogin
            }
          >
            {isEmailLoading || isUsernameLoading ? (
              <Loader2 size={16} className="mr-2 animate-spin" />
            ) : null}
            {t("login")}
          </Button>

          {passkeyEnabled && (
            <Button className="gap-2" onClick={handlePasskeyLogin}>
              <Key size={16} />
              {t("signInWithPasskey")}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
