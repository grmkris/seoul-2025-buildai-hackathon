"use client";

import { AutoForm, AutoFormSubmit } from "@/components/ui/auto-form";
import { useTranslations } from "next-intl";
import { z } from "zod";
import type { InsertCustomerSchema } from "../hooks/customerActions";

// Create a form schema based on InsertCustomerSchema type
export const customerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type CustomerFormProps = {
  onSubmit: (data: InsertCustomerSchema) => Promise<void>;
  submitButtonText?: string;
};

export const CustomerForm = ({
  onSubmit,
  submitButtonText,
}: CustomerFormProps) => {
  const t = useTranslations("Workspace.Customers");

  return (
    <AutoForm
      formSchema={customerFormSchema}
      onSubmit={onSubmit}
      values={{
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
      }}
    >
      <AutoFormSubmit className="w-full">
        {submitButtonText || t("createCustomer")}
      </AutoFormSubmit>
    </AutoForm>
  );
};
