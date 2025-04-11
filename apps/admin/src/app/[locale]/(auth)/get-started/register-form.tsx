"use client";

import {
  useRegisterWithEmail,
  useRegisterWithUsername,
} from "@/app/[locale]/auth/authHooks";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, { message: "Username must be at least 3 characters." })
      .regex(/^[a-zA-Z0-9_-]+$/, {
        message:
          "Username can only contain letters, numbers, underscores, and hyphens.",
      }),
    email: z.union([z.string().email(), z.string().length(0)]),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function SignUp() {
  const t = useTranslations("Auth");
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: registerWithEmail, isPending: isEmailRegistering } =
    useRegisterWithEmail({
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("registrationFailed"),
        );
      },
      onSuccess: () => {
        toast.success(t("registrationSuccess"));
      },
    });

  const { mutate: registerWithUsername, isPending: isUsernameRegistering } =
    useRegisterWithUsername({
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("registrationFailed"),
        );
      },
      onSuccess: () => {
        toast.success(t("registrationSuccess"));
      },
    });

  const isPending = isEmailRegistering || isUsernameRegistering;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.username) {
      toast.error(t("provideUsernameAndPassword"));
      return;
    }

    if (values.email && values.email.length > 0) {
      registerWithEmail({
        name: values.username, // Use username as name
        email: values.email,
        password: values.password,
        username: values.username,
      });
    } else {
      registerWithUsername({
        name: values.username, // Use username as name
        username: values.username,
        password: values.password,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("username")}</FormLabel>
              <FormControl>
                <Input type="text" placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel>{t("email")}</FormLabel>
                <span className="text-muted-foreground ml-1 text-sm">
                  (optional)
                </span>
              </div>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("password")}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input type={showPassword ? "text" : "password"} {...field} />
                  <Button
                    className="text-muted-foreground hover:text-foreground absolute top-0 right-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? t("hide") : t("show")}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <Input type={showPassword ? "text" : "password"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t("createAccount")}
        </Button>
      </form>
    </Form>
  );
}
