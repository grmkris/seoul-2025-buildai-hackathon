"use client";

import type React from "react";
import { useChat, type Message } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { AIMessage } from "@/components/chat/AIMessage";
import { UserMessage } from "@/components/chat/UserMessage";
import { ChatInputBar } from "@/components/chat/ChatInputBar";
import { typeIdGenerator } from "@/server/db/typeid";
import { useAccount, useChainId } from "wagmi";
import { useConversation } from "@/lib/chatHooks";
import ConnectButton from "@/components/web3/connect-button";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

export function ChatInterface() {
  const { address } = useAccount();
  const chainId = useChainId();
  const conversation = useConversation({
    address: address,
  });
  const initalMessages: Message[] = [];
  for (const m of conversation.data ?? []) {
    initalMessages.push({
      ...m.message,
      createdAt: m.message.createdAt
        ? new Date(m.message.createdAt)
        : undefined,
    });
  }

  const chat = useChat({
    api: "/api/conversation",
    id: conversation.data?.[0].conversationId,
    onToolCall: (toolCall) => {
      console.log("useChat onToolCall", toolCall);
    },
    onFinish: async (message) => {
      console.log("useChat onFinish", message);
    },
    generateId: () => typeIdGenerator("message"),
    credentials: "include",
    initialMessages: initalMessages,
    onResponse: (response) => {
      console.log("useChat onResponse", response);
    },
    sendExtraMessageFields: true,
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id, address, chainId };
    },
  });

  // Add loading state indicators based on chat.status
  const isLoading = chat.status === "submitted";
  const isStreaming = chat.status === "streaming";
  const isError = chat.status === "error";

  // Reference to the bottom div for auto-scrolling
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages or loading states change
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Scroll to bottom with a small delay to ensure rendering is complete
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    return () => clearTimeout(timer);
  }, [isLoading, isStreaming, isError]);

  const handleSendMessage = async (content: string) => {
    console.log("handleSendMessage", content);
    if (!content.trim()) return;
    chat.append({
      content,
      role: "user",
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat container */}
      <ChatContainer className="flex-1 overflow-y-auto">
        {chat.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              Send a message to start the chat.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {" "}
            {chat.messages.map((message) => {
              switch (message.role) {
                case "user":
                  return (
                    <UserMessage
                      key={message.id}
                      message={message.content}
                      avatarFallback="U" // Add default fallback
                    />
                  );
                case "assistant":
                  return (
                    <AIMessage
                      key={message.id}
                      fullMessage={message}
                      avatarFallback="AI" // Add default fallback
                    />
                  );
                default:
                  return (
                    <div key={message.id}>
                      <pre>{JSON.stringify(message, null, 2)}</pre>
                    </div>
                  );
              }
            })}
            {isLoading && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
                <p className="text-sm text-muted-foreground">Thinking...</p>
              </div>
            )}
            {isStreaming && (
              <div className="flex items-center gap-2 p-4 rounded-lg bg-muted/50">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-75" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-150" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce delay-300" />
                </div>
                <p className="text-sm text-muted-foreground">Responding...</p>
              </div>
            )}
            {isError && (
              <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex flex-col gap-2">
                <p>
                  There was an error generating the response. Please try again.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => chat.reload()}
                >
                  <RefreshCwIcon className="size-4 mr-2" />
                  Retry
                </Button>
              </div>
            )}
            {/* This div is used for auto-scrolling */}
            <div ref={bottomRef} />
          </div>
        )}
      </ChatContainer>
      {/* Use your ChatInputBar component with loading state */}
      <ChatInputBar
        onSendMessage={handleSendMessage}
        disabled={isLoading || isStreaming}
        buttonProps={{
          className: cn(
            "rounded-md",
            (isLoading || isStreaming) && "opacity-50",
          ),
        }}
        inputProps={{
          placeholder: isLoading
            ? "Waiting for response..."
            : isStreaming
            ? "AI is responding..."
            : "Type your message...",
        }}
      />

      {/* Status indicator */}
      <div className="px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              isLoading && "bg-yellow-500",
              isStreaming && "bg-blue-500 animate-pulse",
              isError && "bg-red-500",
              !isLoading && !isStreaming && !isError && "bg-green-500",
            )}
          />
          <span>
            {isLoading
              ? "Processing..."
              : isStreaming
              ? "Streaming response"
              : isError
              ? "Error"
              : "Ready"}
          </span>
        </div>
        <span>
          {chat.messages.length > 0
            ? `${chat.messages.length} messages`
            : "No messages"}
        </span>
      </div>

      <ConnectButton />
    </div>
  );
}
