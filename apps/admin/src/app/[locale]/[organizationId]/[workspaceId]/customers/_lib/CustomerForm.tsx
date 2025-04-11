"use client";

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
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import type { CustomerId } from "typeid";
import { toast } from "sonner";
import { z } from "zod";
import type { InsertCustomerSchema } from "./hooks/customerActions";
import { useCustomer, useEditCustomer } from "./hooks/customerHooks";

// Create a form schema based on InsertCustomerSchema type
const customerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
});

export function CustomerForm({ customerId }: { customerId: CustomerId }) {
  const t = useTranslations("Workspace.Customers");
  const { customer, isLoading } = useCustomer(customerId);

  // Initialize react-hook-form with empty defaults first
  const form = useForm<z.infer<typeof customerFormSchema>>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: customer?.firstName || "",
      lastName: customer?.lastName || "",
      email: customer?.email || "",
      phone: customer?.phoneNumber || "",
    },
  });

  const editCustomerMutation = useEditCustomer({
    onSuccess: () => {
      toast.success(t("customerUpdated"));
    },
    onError: (error) => {
      toast.error(`${t("failedToUpdateCustomer")}: ${error.message}`);
    },
  });

  const handleSubmit = async (data: InsertCustomerSchema) => {
    await editCustomerMutation.mutateAsync({
      id: customerId,
      data,
    });
  };

  if (isLoading) {
    return <div className="py-4">{t("loading")}</div>;
  }

  if (!customer) {
    return <div className="py-4">{t("customerNotFound")}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("firstName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("lastName")}</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phone")}</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="text-right">
          <Button type="submit" disabled={editCustomerMutation.isPending}>
            {editCustomerMutation.isPending ? t("saving") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
