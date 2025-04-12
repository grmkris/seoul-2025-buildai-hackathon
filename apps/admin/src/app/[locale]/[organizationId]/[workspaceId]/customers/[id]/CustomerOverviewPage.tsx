"use client";

import { CustomerForm } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/CustomerForm";
import { useCustomer } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/hooks/customerHooks";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";

import { PageContainer } from "@/components/PageContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/navigation";
import {
  ArrowLeft,
  Copy,
  FileEdit,
  PackageOpen,
  PlusCircle,
  Shield,
  StickyNote,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import type { KeyboardEvent } from "react";
import type { CustomerId } from "typeid";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerChatHistory } from "./CustomerChatHistory";
import { format } from "date-fns";

export default function CustomerOverviewPage({
  params,
}: { params: { id: CustomerId } }) {
  const t = useTranslations("Workspace.Customers");
  const { customer, isLoading } = useCustomer(params.id);
  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();

  // Refs for scrolling to sections
  const notesRef = useRef<HTMLDivElement>(null);
  const ordersRef = useRef<HTMLDivElement>(null);
  const auditRef = useRef<HTMLDivElement>(null);

  const scrollToNotes = () => {
    notesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const _scrollToOrders = () => {
    ordersRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const _copyCustomerLink = () => {
    const url = `${window.location.origin}/${activeOrganization}/${activeWorkspace}/customers/${params.id}`;
    navigator.clipboard.writeText(url);
    toast.success(t("customerUrlCopied"));
  };

  const copyCustomerId = () => {
    navigator.clipboard.writeText(params.id);
    toast.success(t("copyID"));
  };

  const _handleKeyDown = (e: KeyboardEvent, callback: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      callback();
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="">
        <Skeleton className="h-10 w-2/3 max-w-md" />
        <Skeleton className="h-5 w-1/3 max-w-xs" />
        <div className="space-y-12 mt-12">
          <div>
            <Skeleton className="h-8 w-40 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-8 w-40 mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (!customer) {
    toast.error(t("customerNotFound"));
    return <div className="text-center py-4">{t("customerNotFound")}</div>;
  }

  return (
    <PageContainer
      title={`${customer.firstName} ${customer.lastName}`}
      description={
        <p className="text-sm text-muted-foreground flex items-center">
          <span>{t("customerId")}:</span>
          <Button
            onClick={copyCustomerId}
            title={t("copyID")}
            variant="ghost"
            aria-label={`${t("copyID")}: ${params.id}`}
          >
            <span>{params.id}</span>
            <Copy className="h-3 w-3 ml-1" />
          </Button>
        </p>
      }
    >
      <div>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link
              href={`/${activeOrganization}/${activeWorkspace}/orders/new?customerId=${params.id}`}
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              {t("createNewOrder")}
            </Link>
          </Button>
          <Button onClick={scrollToNotes} className="flex items-center gap-1">
            <FileEdit className="h-4 w-4 mr-1" />
            {t("addNewNote")}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 my-6">
        <Card className="py-1 px-2">
          <Accordion type="multiple" defaultValue={["item-1"]}>
            <AccordionItem
              value="item-1"
              className="border-none cursor-pointer"
            >
              <AccordionTrigger className="cursor-pointer">
                <div className="flex items-center gap-1">
                  <User size={20} />
                  <h2 className="text-xl font-medium">
                    {t("customerInformation")}
                  </h2>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CustomerForm customerId={params.id} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">{t("overviewTab")}</TabsTrigger>
          <TabsTrigger value="chatHistory">{t("chatHistoryTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>{t("customerDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>{t("email")}:</strong> {customer.email || "N/A"}</p>
                <p><strong>{t("phone")}:</strong> {customer.phoneNumber || "N/A"}</p>
                <p><strong>{t("walletAddress")}:</strong> {customer.walletAddress || "N/A"}</p>
                <p><strong>{t("createdAt")}:</strong> {format(new Date(customer.createdAt), "PPPpp")}</p>
                {/* Add other details here */}
              </div>
            </CardContent>
          </Card>
          {/* Other overview components can go here */}
        </TabsContent>
        <TabsContent value="chatHistory">
          <CustomerChatHistory customerId={customer.id} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}
