"use client";

import { useCreateCustomer } from "@/app/[locale]/[organizationId]/[workspaceId]/customers/_lib/hooks/customerHooks";
import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { PageContainer } from "@/components/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useRouter } from "@/navigation";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  type LucideIcon,
  MessageCircle,
  Mic,
  Plus,
  ShoppingCart,
  SparklesIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

type ActionItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  isPrimary?: boolean;
};

// Helper function to extract text content from a message
const getMessageTextContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content.reduce((text, part) => {
      if (typeof part === "string") {
        return text + part;
      }

      if (
        part &&
        typeof part === "object" &&
        "type" in part &&
        part.type === "text" &&
        "text" in part
      ) {
        return text + String(part.text);
      }

      return text;
    }, "");
  }

  return "";
};

const WorkspacePage = () => {
  const router = useRouter();
  const _t = useTranslations("Workspace.Page");
  const [_isItemDrawerOpen, setIsItemDrawerOpen] = useState(false);
  const [_, setIsCustomerDrawerOpen] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  const createCustomer = useCreateCustomer({
    onSuccess: () => setIsCustomerDrawerOpen(false),
  });

  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();

  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  // Format conversation date
  const formatConversationDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return `Today, ${format(date, "h:mm a")}`;
    if (isYesterday(date)) return `Yesterday, ${format(date, "h:mm a")}`;
    if (isThisWeek(date)) return format(date, "EEEE, h:mm a");
    return format(date, "MMM d, yyyy");
  };

  const baseUrl = `/${activeOrganization}/${activeWorkspace}` as const;

  // Define quick action items - Reduced to the most important ones
  const _quickActions: ActionItem[] = [
    {
      label: "Add Order",
      icon: Plus,
      onClick: () => router.push(`${baseUrl}/orders/new`),
      isPrimary: true,
    },
    {
      label: "Add Timesheet",
      icon: CalendarDays,
      onClick: () => router.push(`${baseUrl}/taskforce/new/time-entry`),
      isPrimary: true,
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      onClick: () => router.push(`${baseUrl}/orders`),
    },
  ];

  // AI suggestion prompts
  const aiSuggestions = ["Sales report", "Find customers", "Inventory status"];

  // Dashboard stats
  const dashboardStats = [
    { label: "Orders Today", value: "24", change: "+3" },
    { label: "Active Customers", value: "128", change: "+12" },
    { label: "Revenue MTD", value: "$24,521", change: "+8%" },
  ];

  return (
    <PageContainer
      title={`Good ${getTimeOfDay()}!`}
      description="Welcome to your workspace. What would you like to accomplish today?"
    >
      <div className="space-y-4">
        <Card>
          {/* Stats in a single row - horizontal scrolling on mobile */}
          <div className="flex flex-nowrap overflow-x-auto gap-6 py-2">
            {dashboardStats.map((stat) => (
              <div key={stat.label} className="flex-shrink-0">
                <p className="text-xs text-muted-foreground mb-1">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-medium">{stat.value}</span>
                  <span
                    className={cn(
                      "text-xs",
                      stat.change.startsWith("+")
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Primary action buttons - more compact width */}
          <div className="flex gap-3 mb-3 w-full">
            <Button onClick={() => router.push(`${baseUrl}/orders/new`)}>
              <Plus className="h-5 w-5 text-teal-500 dark:text-teal-400" />
              <span>Add Order</span>
            </Button>
            <Button
              onClick={() => router.push(`${baseUrl}/taskforce/new/time-entry`)}
            >
              <CalendarDays className="h-5 w-5 text-teal-500 dark:text-teal-400" />
              <span>Add Timesheet</span>
            </Button>
          </div>

          {/* Orders button */}
          <div className="mb-4">
            <Button onClick={() => router.push(`${baseUrl}/orders`)}>
              <ShoppingCart className="h-4 w-4" />
              <span>Orders</span>
            </Button>
          </div>
        </Card>

        <Card>
          {/* AI suggestions in a single row */}
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="text-xs text-muted-foreground flex items-center">
              <SparklesIcon className="mr-1 h-3 w-3" />
              Try:
            </span>
            {aiSuggestions.map((suggestion) => (
              <Button key={suggestion} onClick={() => setAiInput(suggestion)}>
                {suggestion}
              </Button>
            ))}
            <div className="ml-auto">
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          {/* Recent Conversations */}
          <div className="pt-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Recent AI Conversations</h2>
              <Button asChild className="text-xs gap-1">
                <Link
                  href={`/${activeOrganization}/${activeWorkspace}/chat/new`}
                >
                  View All
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
};

export default WorkspacePage;
