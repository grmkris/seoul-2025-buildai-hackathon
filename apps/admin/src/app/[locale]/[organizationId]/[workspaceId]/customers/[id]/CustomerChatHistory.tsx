"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import React from "react";
import type { ConversationId, CustomerId } from "typeid";
import {
  useCustomerConversations,
  useConversationMessages,
} from "../_lib/hooks/chatHooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomerChatHistoryProps {
  customerId: CustomerId;
}

function MessageDisplay({ conversationId }: { conversationId: ConversationId }) {
  const t = useTranslations("Workspace.Customers.ChatHistory.Messages");
  const { data: messages, isLoading, error } = useConversationMessages(conversationId);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-10 w-1/2 self-end" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>{t("errorTitle")}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!messages || messages.length === 0) {
    return <p className="p-4 text-muted-foreground">{t("noMessages")}</p>;
  }

  return (
    <ScrollArea className="h-[50vh] p-4">
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "p-3 rounded-lg max-w-[80%]",
              msg.message.role === "user"
                ? "bg-primary text-primary-foreground self-end ml-auto"
                : "bg-muted",
              msg.message.role === "assistant" ? "mr-auto" : "",
            )}
          >
            <p className="text-xs font-semibold mb-1 capitalize">{msg.message.role}</p>
            <p className="whitespace-pre-wrap">{msg.message.content}</p>
            <p className="text-xs text-muted-foreground/80 mt-1 text-right">
              {format(new Date(msg.createdAt), "Pp")}
            </p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

export function CustomerChatHistory({ customerId }: CustomerChatHistoryProps) {
  const t = useTranslations("Workspace.Customers.ChatHistory");
  const { data, isLoading, error } = useCustomerConversations(customerId);
  const [selectedConversationId, setSelectedConversationId] =
    React.useState<ConversationId | null>(null);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedConversationId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-[80%]" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>{t("errorTitle")}</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  const conversations = data?.data ?? [];
  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {conversations.length === 0 ? (
          <p>{t("noConversations")}</p>
        ) : (
          <Dialog open={!!selectedConversationId} onOpenChange={handleOpenChange}>
            <ul className="space-y-2">
              {conversations.map((convo) => (
                <DialogTrigger asChild key={convo.id}>
                  <li
                    className="border p-3 rounded-md hover:bg-muted/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onClick={() => setSelectedConversationId(convo.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedConversationId(convo.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <p className="font-medium">{convo.title || t("untitled")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("createdDate", {
                        date: format(new Date(convo.createdAt), "PPPpp"),
                      })}
                    </p>
                  </li>
                </DialogTrigger>
              ))}
            </ul>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedConversation?.title || t("untitled")}
                </DialogTitle>
              </DialogHeader>
              {selectedConversationId && (
                <MessageDisplay conversationId={selectedConversationId} />
              )}
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  {t("closeDialog")}
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
} 