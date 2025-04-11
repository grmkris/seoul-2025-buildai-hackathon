"use client";
import { use } from "react";
import type { CustomerId } from "typeid";
import CustomerOverviewPage from "./CustomerOverviewPage";

interface CustomerDetailsPageProps {
  params: Promise<{ id: CustomerId }>;
}

export default function CustomerDetailsPage(props: CustomerDetailsPageProps) {
  const params = use(props.params);

  return <CustomerOverviewPage params={params} />;
}
