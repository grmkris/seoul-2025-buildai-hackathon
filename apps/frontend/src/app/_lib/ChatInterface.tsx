"use client";

import type React from "react";
import { useChat, type Message } from "@ai-sdk/react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";

import { ChatContainer } from "@/components/chat/ChatContainer";
import { AIMessage } from "@/components/chat/AIMessage";
import { UserMessage } from "@/components/chat/UserMessage";
import { ChatInputBar } from "@/components/chat/ChatInputBar";
import { typeIdGenerator, type ConversationId, type WorkspaceId } from "typeid";
import { useAccount, useChainId } from "wagmi";
import ConnectButton from "@/components/web3/connect-button";
import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";
import { useConversation, useInitializeWidget } from "@/lib/hooks";
import { clientEnv } from "@/lib/clientEnv";
import { SERVICE_URLS } from "service-registry";

export function ChatInterface(props: { workspaceId: WorkspaceId }) {
  const { address } = useAccount();
  const chainId = useChainId();

  // State to hold the resolved conversationId
  const [conversationId, setConversationId] = useState<ConversationId | undefined>(undefined);

  // Initialization hook
  const { initializeAsync, isInitializing, error: initError, data: initData } = useInitializeWidget();

  // Effect to initialize when address and workspaceId are available
  useEffect(() => {
    // Reset conversationId when address or workspaceId changes
    setConversationId(undefined);
    if (address && props.workspaceId) {
      initializeAsync({ walletAddress: address, workspaceId: props.workspaceId })
        .then(data => {
          if (data?.id) {
            setConversationId(data.id);
          }
        })
        .catch(err => {
          console.error("Initialization failed:", err);
          // Error is already tracked by initError state
        });
    }
  }, [address, props.workspaceId, initializeAsync]);

  // Conversation hook to fetch initial/existing messages
  const conversation = useConversation({
    conversationId: conversationId as ConversationId, // Use state variable
    enabled: !!conversationId && !isInitializing, // Enable only when id is resolved and not initializing
  });

  // Prepare initial messages for useChat once conversation data is loaded
  const initialMessages: Message[] = conversation.data?.messages?.map(m => ({
    ...m.message,
    createdAt: m.message.createdAt ? new Date(m.message.createdAt) : undefined,
  })) ?? [];

  // useChat hook for managing chat interactions
  const chat = useChat({
    // Construct the full API path dynamically including conversationId and /messages suffix
    // This ensures the request hits the correct backend endpoint: /api/public/conversations/:conversationId/messages
    api: conversationId
      ? `${SERVICE_URLS[clientEnv.NEXT_PUBLIC_ENV].api}/api/public/conversations/${conversationId}/messages`
      : undefined, // Let useChat handle the undefined case; calls should be prevented by UI logic until ID is set
    id: conversationId, // Continue passing ID for potential internal use by the hook
    initialMessages: initialMessages, // Pass fetched initial messages
    // Only initialize useChat when conversationId is available and initial messages are loaded
    // Note: useChat doesn't have an 'enabled' prop, so we rely on passing a valid 'id' and 'initialMessages'
    // when they become available. Re-renders will update useChat.
    onToolCall: (toolCall) => {
      console.log("useChat onToolCall", toolCall);
    },
    onFinish: async (message) => {
      console.log("useChat onFinish", message);
    },
    generateId: () => typeIdGenerator("message"),
    credentials: "include",
    onResponse: (response) => {
      console.log("useChat onResponse", response);
    },
    sendExtraMessageFields: true,
    experimental_prepareRequestBody({ messages }) {
      // Remove 'id' as it's now part of the URL path defined in the 'api' property.
      return { message: messages[messages.length - 1], address, chainId };
    },
  });

  // Add loading state indicators based on chat.status
  const isLoadingChat = chat.status === "submitted";
  const isStreaming = chat.status === "streaming";
  const isErrorChat = chat.status === "error";

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
    // Depend on chat messages length and loading/streaming states, plus conversation loading
  }, [chat.messages.length, isLoadingChat, isStreaming, isErrorChat, conversation.isLoading, isInitializing]);

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
      {/* Show connect button if wallet not connected */}
      {!address && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Please connect your wallet to start chatting.</p>
            <ConnectButton />
          </div>
        </div>
      )}

      {/* Show initialization states if wallet is connected */}
      {address && isInitializing && (
        <div className="flex h-full items-center justify-center">
          <p className="text-muted-foreground">Initializing chat...</p>
          {/* Consider adding a spinner here */}
        </div>
      )}
      {address && initError && (
        <div className="flex h-full items-center justify-center p-4 rounded-lg bg-destructive/10 text-destructive flex-col gap-2">
          <p>Failed to initialize chat: {initError.message}</p>
          <Button
            variant="outline"
            size="sm"
            className="self-center"
            onClick={() => {
              if (address && props.workspaceId) {
                 initializeAsync({ walletAddress: address, workspaceId: props.workspaceId })
                   .then(data => { if (data?.id) setConversationId(data.id); })
                   .catch(err => console.error("Retry Initialization failed:", err));
              }
            }}
          >
            <RefreshCwIcon className="size-4 mr-2" />
            Retry Initialization
          </Button>
        </div>
      )}

      {/* Render chat UI only after successful initialization and conversationId is available */}
      {address && !isInitializing && !initError && conversationId && (
         <>
            {/* Chat container */}
            <ChatContainer className="flex-1 overflow-y-auto">
               {/* Show loading state for conversation fetch */}
               {conversation.isLoading && (
                  <div className="flex h-full items-center justify-center">
                     <p className="text-muted-foreground">Loading conversation...</p>
                  </div>
               )}
               {/* Show error state for conversation fetch */}
               {!conversation.isLoading && conversation.error && (
                 <div className="flex h-full items-center justify-center p-4 rounded-lg bg-destructive/10 text-destructive flex-col gap-2">
                   <p>Failed to load conversation: {conversation.error.message}</p>
                   <Button
                     variant="outline"
                     size="sm"
                     className="self-center"
                     // Ensure refetch is only called if conversationId exists
                     onClick={() => conversationId && conversation.refetch()}
                   >
                     <RefreshCwIcon className="size-4 mr-2" />
                     Retry Load
                   </Button>
                 </div>
               )}
              {/* Render messages only when conversation is loaded and not errored */}
              {!conversation.isLoading && !conversation.error && (
                 chat.messages.length === 0 ? (
                     <div className="flex h-full items-center justify-center">
                       <p className="text-muted-foreground">
                         Send a message to start the chat.
                       </p>
                     </div>
                   ) : (
                     /* Render message list */
                     <div className="flex flex-col gap-4">
                       {chat.messages.map((message) => {
                         switch (message.role) {
                           case "user":
                             return (
                               <UserMessage
                                 key={message.id}
                                 message={message.content}
                                 avatarFallback="U"
                               />
                             );
                           case "assistant":
                             return (
                               <AIMessage
                                addUserMessage={handleSendMessage}                          
                                 key={message.id}
                                 fullMessage={message}
                                 avatarFallback="AI"
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
                       {/* Loading/Streaming/Error indicators for chat actions */}
                       {isLoadingChat && (
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
                       {isErrorChat && (
                         <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex flex-col gap-2">
                           <p>
                             There was an error generating the response. Please try again.
                           </p>
                           <Button
                             variant="outline"
                             size="sm"
                             className="self-start"
                             onClick={() => chat.reload()} // Use chat.reload for retrying last message
                           >
                             <RefreshCwIcon className="size-4 mr-2" />
                             Retry
                           </Button>
                         </div>
                       )}
                       {/* Div for auto-scrolling */}
                       <div ref={bottomRef} />
                     </div>
                   )
               )}
            </ChatContainer>
            {/* Chat Input Bar */}
            <ChatInputBar
              onSendMessage={handleSendMessage}
              // Disable input during initialization, conversation loading, or active chat operations
              disabled={isInitializing || conversation.isLoading || isLoadingChat || isStreaming}
              buttonProps={{
                className: cn(
                  "rounded-md",
                  (isInitializing || conversation.isLoading || isLoadingChat || isStreaming) && "opacity-50",
                ),
              }}
              inputProps={{
                placeholder: isInitializing
                  ? "Initializing..."
                  : conversation.isLoading
                  ? "Loading conversation..."
                  : isLoadingChat
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
                    (isInitializing || conversation.isLoading) && "bg-yellow-500", // Yellow for init/load
                    isStreaming && "bg-blue-500 animate-pulse", // Blue for streaming
                    (initError || conversation.error || isErrorChat) && "bg-red-500", // Red for any error
                    !isInitializing && !conversation.isLoading && !isStreaming && !initError && !conversation.error && !isErrorChat && "bg-green-500", // Green only when truly ready
                  )}
                />
                <span>
                  {/* Provide more specific status text */}
                  {isInitializing
                    ? "Initializing..."
                    : initError
                    ? "Initialization Error"
                    : conversation.isLoading
                    ? "Loading conversation..."
                    : conversation.error
                    ? "Conversation Load Error"
                    : isLoadingChat
                    ? "Processing..."
                    : isStreaming
                    ? "Streaming response"
                    : isErrorChat
                    ? "Chat Error"
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
          </>
       )}
    </div>
  );
}
