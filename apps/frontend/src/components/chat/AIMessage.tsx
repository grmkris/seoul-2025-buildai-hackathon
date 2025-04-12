import { useState } from "react";
import type { Message } from "@ai-sdk/react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check, Info, AlertTriangle, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { usePaymentIntent } from "@/lib/hooks";
import type { PaymentIntentId } from "typeid";
import { useAccount, useWalletClient, useChainId, usePublicClient } from 'wagmi';
import type { Address } from 'viem';
import { rootstockTestnet } from 'viem/chains';
import { toast } from "sonner";
import { createPayerClient, type SignedTransferIntent } from "commerce-sdk";
import { clientEnv } from "@/lib/clientEnv";
import type { Hash } from 'viem';

// --- Payment Tool Types ---
// Base type for tool invocation parts
type ToolInvocationPart<ToolName extends string, Args = any, Result = any> = Extract<
  NonNullable<Message["parts"]>[number],
  { type: "tool-invocation"; toolInvocation: { toolName: ToolName; args: Args; result?: Result, state?: "call" | "partial-call" | "result" } }
>;

type PaymentRequestArgs = { amount: number; currencySymbol: string; reason: string; };
type PaymentRequestResult = {
  success: boolean;
  paymentIntentId: PaymentIntentId;
  message: string;
};
type PaymentRequestToolInvocationPart = ToolInvocationPart<"requestPaymentTool", PaymentRequestArgs, PaymentRequestResult>;

type PaymentValidationArgs = { paymentIntentId: string };
type PaymentValidationResult = {
  success: boolean;
  paymentIntentId: string;
  message: string;
};
type PaymentValidationToolInvocationPart = ToolInvocationPart<"validatePaymentTool", PaymentValidationArgs, PaymentValidationResult>;

// --- Ogrodje Tool Types ---
type OgrodjeResult<T> = T[] | { error: string };

type OgrodjeEvent = {
  id: string;
  title: string;
  startDateTime: string;
  meetupID: string;
  source: string;
  locationName?: string | null;
  eventURL?: string | null;
  description?: string | null;
};

type OgrodjeMeetup = {
  id: string;
  name: string;
  meetupUrl?: string | null;
  homepageUrl?: string | null;
};

type OgrodjeTimelineEvent = {
  id: string;
  title: string;
  startDateTime: string;
  meetupID: string;
  meetupName: string;
  source: string;
  locationName?: string | null;
  eventURL?: string | null;
};

// Ogrodje Tool Invocation Part Types
type OgrodjeEventsArgs = { limit?: number; offset?: number };
type OgrodjeEventsResult = OgrodjeResult<OgrodjeEvent>;
type OgrodjeEventsToolInvocationPart = ToolInvocationPart<"eventsTool", OgrodjeEventsArgs, OgrodjeEventsResult>;

type OgrodjeMeetupsArgs = { limit?: number; offset?: number };
type OgrodjeMeetupsResult = OgrodjeResult<OgrodjeMeetup>;
type OgrodjeMeetupsToolInvocationPart = ToolInvocationPart<"meetupsTool", OgrodjeMeetupsArgs, OgrodjeMeetupsResult>;

type OgrodjeMeetupEventsArgs = { path: { meetup_id: string }; query?: { limit?: number; offset?: number } };
type OgrodjeMeetupEventsResult = OgrodjeResult<OgrodjeEvent>;
type OgrodjeMeetupEventsToolInvocationPart = ToolInvocationPart<"meetupEventsTool", OgrodjeMeetupEventsArgs, OgrodjeMeetupEventsResult>;

type OgrodjeTimelineArgs = {}; // No args
type OgrodjeTimelineResult = OgrodjeResult<OgrodjeTimelineEvent>;
type OgrodjeTimelineToolInvocationPart = ToolInvocationPart<"timelineTool", OgrodjeTimelineArgs, OgrodjeTimelineResult>;

// Helper type for any tool invocation part
type AnyToolInvocationPart = Extract<NonNullable<Message["parts"]>[number], { type: "tool-invocation" }>;

// Type for the signed intent data expected from the hook (adjust based on actual hook implementation)
// Let's assume usePaymentIntent returns something like this:
type FetchedPaymentIntent = {
  signedIntentData?: SignedTransferIntent;
  status?: string;
  // ... other potential fields from your DB model
};

// --- Payment Tool Renderers ---

export function PaymentRequestToolRenderer(props: {
  toolInvocation: PaymentRequestToolInvocationPart;
  addUserMessage: (message: string) => void;
}) {
  const args = props.toolInvocation.toolInvocation.args;
  const result = props.toolInvocation.toolInvocation.result;

  // --- Wallet and Chain Hooks ---
  const { data: walletClient } = useWalletClient();
  const { address: payerAddress } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<Hash | null>(null);

  // --- Configuration ---
  const transfersContractAddress = clientEnv.NEXT_PUBLIC_TRANSFERS_CONTRACT_ADDRESS as Address | undefined;
  const transportUrl = clientEnv.NEXT_PUBLIC_RPC_URL;
  const targetChain = rootstockTestnet;

  // --- Fetch SignedTransferIntent --- Adjusted typing here
  const { data: fetchedIntent, isLoading: isLoadingIntent, error: intentError } = usePaymentIntent({
    paymentIntentId: result?.paymentIntentId,
  });

  const signedIntentData = (fetchedIntent as FetchedPaymentIntent | null)?.signedIntentData;
  const intentStatus = (fetchedIntent as FetchedPaymentIntent | null)?.status;

  if (!args || !result) {
    return (
      <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive">
        Error rendering payment request: Missing arguments or result.
      </div>
    );
  }

  if (!result.success) {
     return (
      <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive">
        Payment request failed: {result.message || 'Unknown error'}
      </div>
    );
  }

  // --- Payment Handler ---
  const handlePayment = async () => {
    const loadingToastId = toast.loading("Processing payment...");
    // --- Pre-flight Checks ---
    if (!transfersContractAddress || !transportUrl) {
        toast.error("Payment configuration is missing.");
        console.error("Missing transfersContractAddress or transportUrl");
        return;
    }
     if (!walletClient || !payerAddress) {
        toast.error("Please connect your wallet.");
        return;
    }
    if (chainId !== targetChain.id) {
        toast.error(`Please switch your wallet to the ${targetChain.name} network.`);
        return;
    }
    if (!publicClient) {
      toast.error("Network client not available. Please refresh.");
      console.error("Public client not available");
      setIsPaying(false);
      toast.dismiss(loadingToastId);
      return;
    }
    if (!signedIntentData) { // Check if data exists before proceeding
        toast.error("Could not retrieve valid payment details. Please try again later or contact support.");
        console.error("signedIntentData is missing from fetchedIntent", fetchedIntent);
        setIsPaying(false); // Ensure button is re-enabled
        toast.dismiss(loadingToastId);
        return;
    }

    setIsPaying(true);

    try {
        const payerSdk = createPayerClient({
            chain: targetChain,
            transportUrl: transportUrl,
            transfersContractAddress: transfersContractAddress,
            payerSigner: walletClient,
        });

        console.log("Attempting payment with intent data:", signedIntentData);

        // --- Execute Pre-Approved Transfer ---
        const transferResult = await payerSdk.transferTokenPreApproved(signedIntentData);

        toast.dismiss(loadingToastId);

        if (transferResult.isOk()) {
            const currentTxHash = transferResult.value;
            setTxHash(currentTxHash); // Set tx hash immediately
            console.log("Payment Tx Hash:", currentTxHash);

            const explorerUrl = targetChain.blockExplorers?.default.url;
            const explorerLink = explorerUrl ? `${explorerUrl}/tx/${currentTxHash}` : null;
            if (explorerLink) {
                props.addUserMessage(`Payment transaction sent! [View status](${explorerLink})`);
                toast.success("Transaction Submitted!", {
                    description: `Tx: ${currentTxHash.slice(0, 10)}...${currentTxHash.slice(-8)}`,
                    action: {
                        label: "View on Explorer",
                        onClick: () => window.open(explorerLink, '_blank'),
                    },
                });
            } else {
                props.addUserMessage(`Payment transaction sent! Transaction hash: ${currentTxHash}`);
                toast.success("Transaction Submitted!");
            }

        } else {
            console.error("Payer SDK Error:", transferResult.error);
            if (transferResult.error.type === 'INSUFFICIENT_ALLOWANCE') {
                 toast.error("Payment Failed: Token Allowance", {
                     description: `The contract needs permission to spend ${args.amount} ${args.currencySymbol}. Please grant approval.`
                 });
            } else if (transferResult.error.type === 'CONTRACT_WRITE_ERROR') {
                 toast.error("Payment Failed: Blockchain Error", {
                     description: transferResult.error.message || "The transaction could not be completed."
                 });
            } else {
                 toast.error("Payment Failed", {
                     description: transferResult.error.message || "An unknown error occurred."
                 });
            }
        }
    } catch (error) {
        console.error("Payment execution failed:", error);
        toast.dismiss(loadingToastId);
        toast.error("An unexpected error occurred during payment.");
    } finally {
        setIsPaying(false);
    }
  };

  // --- Render Logic ---
  const canPay = !!walletClient && !!payerAddress && chainId === targetChain.id && !!signedIntentData && !isLoadingIntent;
  const isPaymentCompleted = intentStatus === 'completed'; // Use fetched status
  const blockExplorerUrl = targetChain.blockExplorers?.default?.url;

  return (
    <div className="my-2 p-3 border rounded-md bg-card shadow-sm">
      <p className="font-medium text-sm mb-1 text-primary">Payment Request</p>
      <p className="text-xs text-muted-foreground mb-2">{args.reason}</p>
      <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-base">
            {args.amount} {args.currencySymbol}
          </span>
        <Button
          size="sm"
          onClick={handlePayment}
          disabled={isPaying || isLoadingIntent || !canPay || isPaymentCompleted}
          variant={isPaymentCompleted ? "ghost" : "default"}
          aria-label={`Pay ${args.amount} ${args.currencySymbol} for ${args.reason}`}
          className={isPaymentCompleted ? "text-green-600 hover:bg-green-50 hover:text-green-700 cursor-default" : ""}
        >
          {isPaymentCompleted ? (
            <><Check size={16} className="mr-1" /> Paid</>
          ) : isPaying ? (
            <><Loader2 size={16} className="mr-1 animate-spin" /> Processing...</>
          ) : isLoadingIntent ? (
            <><Loader2 size={16} className="mr-1 animate-spin" /> Loading Details...</>
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
       {intentError && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertTriangle size={14}/> Error loading payment details.</p>
       )}
       {txHash && (
          <div className="mt-2 text-xs">
              <p className="text-muted-foreground">
                  Transaction:{" "}
                  {blockExplorerUrl ? (
                      <a
                        href={`${blockExplorerUrl}/tx/${txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline break-all"
                      >
                          {txHash}
                      </a>
                  ) : (
                      <span className="break-all">{txHash}</span>
                  )}
                   {/* Display status based on fetched intent data */}
                   {isPaymentCompleted ? " (Completed)" : intentStatus ? ` (${intentStatus})` : txHash ? " (Submitted)" : ""}
              </p>
          </div>
       )}
       <p className="text-xs text-muted-foreground mt-1">{result.message}</p>
       {!transfersContractAddress && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertTriangle size={14}/> Payment Button Disabled: Missing Configuration.</p> }
    </div>
  );
}

export function PaymentValidationToolRenderer(props: {
  toolInvocation: PaymentValidationToolInvocationPart;
}) {
  const args = props.toolInvocation.toolInvocation.args;
  const result = props.toolInvocation.toolInvocation.result;

  if (!result || !args) {
    return (
      <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1">
        <AlertTriangle size={14}/> Error rendering payment validation: Missing arguments or result.
      </div>
    );
  }

  return (
    <div className={`my-2 p-3 border rounded-md shadow-sm ${result.success ? 'bg-card border-secondary' : 'bg-destructive/10 border-destructive/30'}`}>
      <p className={`font-medium text-sm mb-1 ${result.success ? 'text-primary' : 'text-destructive'} flex items-center gap-1`}>
         {result.success ? <Check size={16}/> : <AlertTriangle size={16}/> }
        {result.success ? 'Payment Validation Successful' : 'Payment Validation Failed'}
      </p>
      <p className="text-xs text-muted-foreground">{result.message}</p>
      <p className="text-xs text-muted-foreground mt-1">Intent ID: {args.paymentIntentId}</p>
    </div>
  );
}

// --- Ogrodje Tool Renderers ---

function OgrodjeEventsRenderer({ toolInvocation }: { toolInvocation: OgrodjeEventsToolInvocationPart }) {
  const result = toolInvocation.toolInvocation.result;

  if (!result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error rendering events: Missing result.</div>;
  }

  if ('error' in result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error fetching events: {result.error}</div>;
  }

  if (!Array.isArray(result) || !result.length) {
     return <div className="my-1 p-2 text-xs border rounded bg-muted/50 text-muted-foreground flex items-center gap-1"><Info size={14}/> No events found.</div>;
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-card shadow-sm">
      <p className="font-medium text-sm mb-2 text-primary">Events Found ({result.length})</p>
      <ul className="space-y-2 text-xs max-h-60 overflow-y-auto pr-2">
        {result.map((event: OgrodjeEvent) => (
          <li key={event.id} className="border-b pb-1 last:border-b-0">
            <strong className="font-medium">{event.title}</strong>
            <p className="text-muted-foreground">{new Date(event.startDateTime).toLocaleString()}</p>
            {event.locationName && <p className="text-muted-foreground">Location: {event.locationName}</p>}
            {event.eventURL && <a href={event.eventURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">Event Link</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OgrodjeMeetupsRenderer({ toolInvocation }: { toolInvocation: OgrodjeMeetupsToolInvocationPart }) {
  const result = toolInvocation.toolInvocation.result;

  if (!result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error rendering meetups: Missing result.</div>;
  }

  if ('error' in result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error fetching meetups: {result.error}</div>;
  }

   if (!Array.isArray(result) || !result.length) {
     return <div className="my-1 p-2 text-xs border rounded bg-muted/50 text-muted-foreground flex items-center gap-1"><Info size={14}/> No meetups found.</div>;
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-card shadow-sm">
      <p className="font-medium text-sm mb-2 text-primary">Meetups Found ({result.length})</p>
      <ul className="space-y-2 text-xs max-h-60 overflow-y-auto pr-2">
        {result.map((meetup: OgrodjeMeetup) => (
          <li key={meetup.id} className="border-b pb-1 last:border-b-0">
            <strong className="font-medium">{meetup.name}</strong>
            {meetup.meetupUrl && <a href={meetup.meetupUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block break-all">Meetup Page</a>}
            {meetup.homepageUrl && <a href={meetup.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block break-all">Homepage</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OgrodjeMeetupEventsRenderer({ toolInvocation }: { toolInvocation: OgrodjeMeetupEventsToolInvocationPart }) {
  const result = toolInvocation.toolInvocation.result;
  const args = toolInvocation.toolInvocation.args;
  const meetupId = args?.path?.meetup_id;

  if (!result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error rendering meetup events: Missing result.</div>;
  }

  if ('error' in result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error fetching events for meetup {meetupId || ''}: {result.error}</div>;
  }

   if (!Array.isArray(result) || !result.length) {
     return <div className="my-1 p-2 text-xs border rounded bg-muted/50 text-muted-foreground flex items-center gap-1"><Info size={14}/> No events found for this meetup {meetupId ? `(${meetupId})` : ''}.</div>;
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-card shadow-sm">
      <p className="font-medium text-sm mb-2 text-primary">Meetup Events Found ({result.length}) {meetupId ? `for ${meetupId}`: ''}</p>
      <ul className="space-y-2 text-xs max-h-60 overflow-y-auto pr-2">
        {result.map((event: OgrodjeEvent) => (
          <li key={event.id} className="border-b pb-1 last:border-b-0">
            <strong className="font-medium">{event.title}</strong>
            <p className="text-muted-foreground">{new Date(event.startDateTime).toLocaleString()}</p>
            {event.locationName && <p className="text-muted-foreground">Location: {event.locationName}</p>}
            {event.description && (
                <div className="text-muted-foreground mt-1 text-pretty text-xs prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {event.description}
                    </ReactMarkdown>
                </div>
            )}
            {event.eventURL && <a href={event.eventURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">Event Link</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function OgrodjeTimelineRenderer({ toolInvocation }: { toolInvocation: OgrodjeTimelineToolInvocationPart }) {
  const result = toolInvocation.toolInvocation.result;

  if (!result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error rendering timeline: Missing result.</div>;
  }

  if ('error' in result) {
    return <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive flex items-center gap-1"><AlertTriangle size={14}/> Error fetching timeline: {result.error}</div>;
  }

   if (!Array.isArray(result) || !result.length) {
     return <div className="my-1 p-2 text-xs border rounded bg-muted/50 text-muted-foreground flex items-center gap-1"><Info size={14}/> Timeline is empty.</div>;
  }

  return (
    <div className="my-2 p-3 border rounded-md bg-card shadow-sm">
      <p className="font-medium text-sm mb-2 text-primary">Timeline Events ({result.length})</p>
      <ul className="space-y-2 text-xs max-h-60 overflow-y-auto pr-2">
        {result.map((event: OgrodjeTimelineEvent) => (
          <li key={event.id} className="border-b pb-1 last:border-b-0">
            <strong className="font-medium">{event.title}</strong> ({event.meetupName})
            <p className="text-muted-foreground">{new Date(event.startDateTime).toLocaleString()}</p>
            {event.locationName && <p className="text-muted-foreground">Location: {event.locationName}</p>}
            {event.eventURL && <a href={event.eventURL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">Event Link</a>}
          </li>
        ))}
      </ul>
    </div>
  );
}


// --- Generic Tool Invocation Renderer (Fallback) ---

function InlineToolInvocation({
  part,
}: {
  part: AnyToolInvocationPart; // Use the helper type
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  const { toolName, args, result, state } = part.toolInvocation;

  // Determine status icon/text
  let statusIndicator: React.ReactNode = null;
  if (state === 'call' || state === 'partial-call') {
    statusIndicator = <Loader2 size={14} className="mr-1 animate-spin text-muted-foreground" />;
  } else if (state === 'result' && result && typeof result === 'object' && 'error' in result) {
    statusIndicator = <AlertTriangle size={14} className="mr-1 text-destructive" />;
  }

  return (
    <div className="my-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpand}
        className="flex items-center justify-start p-1 h-auto text-left w-full bg-muted/30 hover:bg-muted/60 rounded"
      >
        {isExpanded ? (
          <ChevronUp size={14} className="mr-1" />
        ) : (
          <ChevronDown size={14} className="mr-1" />
        )}
        {statusIndicator}
         <span className="text-xs font-mono truncate">{toolName}</span>
      </Button>
      {isExpanded && (
        <div className="mt-1 p-2 text-xs border rounded bg-background">
          {args && Object.keys(args).length > 0 && (
            <>
              <p className="font-medium">Args:</p>
              <pre className="whitespace-pre-wrap break-all bg-muted/20 p-1 rounded text-[0.7rem]">
                {JSON.stringify(args, null, 2)}
              </pre>
            </>
          )}
          {state === "result" && result && (
              <>
                <p className="mt-1 font-medium">Result:</p>
                <pre className={`whitespace-pre-wrap break-all bg-muted/20 p-1 rounded text-[0.7rem] ${typeof result === 'object' && 'error' in result ? 'text-destructive' : ''}`}>
                  {typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}
                </pre>
              </>
            )}
        </div>
      )}
    </div>
  );
}

// --- Main AI Message Component ---

type AIMessageProps = Omit<
  React.ComponentProps<typeof MessageBubble>,
  "variant" | "message"
> & {
  fullMessage: Message;
  addUserMessage: (message: string) => void;
};

function AIMessage({ fullMessage, addUserMessage, ...props }: AIMessageProps) {
  // Separate text and tool parts
  const textParts =
    fullMessage.parts?.filter((part) => part?.type === "text") || [];
  const toolInvocationParts: AnyToolInvocationPart[] =
    fullMessage.parts?.filter(
      (part): part is AnyToolInvocationPart => part?.type === "tool-invocation",
    ) || [];

  // Render message content with text first, then tool calls
  const messageContent = (
    <div>
      {/* Render Text Parts */}
      {textParts.map((part, index) => {
        if (!part || part.type !== "text") return null;
        return (
          <div
            key={`${fullMessage.id || "msg"}-text-${index}`}
            className="whitespace-pre-wrap break-words text-card-foreground"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {part.text}
            </ReactMarkdown>
          </div>
        );
      })}

      {/* Render Tool Invocation Parts */}
      {toolInvocationParts.map((part, index) => {
         const key = `${fullMessage.id || "msg"}-tool-${index}`;
         const { state, result, toolName } = part.toolInvocation;
         const showSpecificRenderer = state === 'result' && !!result; // Only show specific renderers when we have a result

        switch (toolName) {
          // --- Payment Tools ---
          case "requestPaymentTool": {
            if (showSpecificRenderer) {
              return (
                <PaymentRequestToolRenderer
                  key={key}
                  toolInvocation={part as PaymentRequestToolInvocationPart} // Safe assertion due to switch case
                  addUserMessage={addUserMessage}
                />
              );
            }
            return <InlineToolInvocation key={key} part={part} />;
          }
          case "validatePaymentTool": {
            if (showSpecificRenderer) {
              return (
                <PaymentValidationToolRenderer
                    key={key}
                    toolInvocation={part as PaymentValidationToolInvocationPart} // Safe assertion
                />
              );
            }
            return <InlineToolInvocation key={key} part={part} />;
          }
          // --- Ogrodje Tools --- Corrected Names
          case "eventsTool": {
             if (showSpecificRenderer) {
                return <OgrodjeEventsRenderer key={key} toolInvocation={part as OgrodjeEventsToolInvocationPart} />;
             }
             return <InlineToolInvocation key={key} part={part} />;
          }
          case "meetupsTool": {
             if (showSpecificRenderer) {
                return <OgrodjeMeetupsRenderer key={key} toolInvocation={part as OgrodjeMeetupsToolInvocationPart} />;
             }
             return <InlineToolInvocation key={key} part={part} />;
          }
          case "meetupEventsTool": {
             if (showSpecificRenderer) {
                return <OgrodjeMeetupEventsRenderer key={key} toolInvocation={part as OgrodjeMeetupEventsToolInvocationPart} />;
             }
             return <InlineToolInvocation key={key} part={part} />;
          }
          case "timelineTool": {
             if (showSpecificRenderer) {
                return <OgrodjeTimelineRenderer key={key} toolInvocation={part as OgrodjeTimelineToolInvocationPart} />;
             }
             return <InlineToolInvocation key={key} part={part} />;
          }
          // --- Fallback ---
          default:
            // Render InlineToolInvocation for any unrecognized tool calls
            return <InlineToolInvocation key={key} part={part} />;
        }
      })}

      {/* Fallback if parts is empty/missing, but content exists */}
      {!fullMessage.parts?.length && fullMessage.content && (
        <div className="whitespace-pre-wrap break-words text-card-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {fullMessage.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );

  return <MessageBubble variant="ai" message={messageContent} {...props} />;
}

export { AIMessage };
