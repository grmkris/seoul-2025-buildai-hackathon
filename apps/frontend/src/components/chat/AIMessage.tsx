import { useState } from "react";
import type { Message } from "@ai-sdk/react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
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
import { erc20Abi, type Hash } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';

type PaymentRequestToolInvocationPart = Extract<
  NonNullable<Message["parts"]>[number],
  { type: "tool-invocation"; toolInvocation: { toolName: "requestPaymentTool" } }
>;

// TODO: Define the expected structure of the result object more accurately
// It needs to contain enough info to fetch the SignedTransferIntent if not included directly
type PaymentRequestResult = {
  success: boolean;
  paymentIntentId: PaymentIntentId; // Used to fetch the SignedTransferIntent
  message: string;
  // Potentially other fields needed to reconstruct/fetch the intent
};

// Define types for the payment validation tool
type PaymentValidationToolInvocationPart = Extract<
  NonNullable<Message["parts"]>[number],
  { type: "tool-invocation"; toolInvocation: { toolName: "validatePaymentTool" } }
>;

type PaymentValidationResult = {
  success: boolean;
  paymentIntentId: string; // Corresponds to the DB ID
  message: string;
};


export function PaymentRequestToolRenderer(props: {
  toolInvocation: PaymentRequestToolInvocationPart;
  addUserMessage: (message: string) => void;  
}) {
  const toolInvocation = props.toolInvocation;
  const args = props.toolInvocation.toolInvocation.args as { amount: number; currencySymbol: string; reason: string; } | undefined;
  const result = props.toolInvocation.toolInvocation.result as PaymentRequestResult | undefined;

  // --- Wallet and Chain Hooks ---
  const { data: walletClient } = useWalletClient();
  const { address: payerAddress } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<Hash | null>(null);

  // --- Configuration (TODO: Move to environment variables/config) ---
  const transfersContractAddress = clientEnv.NEXT_PUBLIC_TRANSFERS_CONTRACT_ADDRESS as Address | undefined;
  const transportUrl = clientEnv.NEXT_PUBLIC_RPC_URL;
  const targetChain = rootstockTestnet; // Example: Use your target chain

  // --- Fetch SignedTransferIntent ---
  // !! CRITICAL TODO: Replace/Adapt usePaymentIntent !!
  // This hook needs to fetch the *SignedTransferIntent* object associated
  // with result.paymentIntentId from your backend/storage, not Stripe data.
  const { data: signedIntent, isLoading: isLoadingIntent, error: intentError } = usePaymentIntent({
    paymentIntentId: result?.paymentIntentId,
  });

  

  if (!args || !result) {
    // Handle cases where args or result might be missing or malformed
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
        // Consider adding a 'Switch Network' button/logic here
        return;
    }
    if (!publicClient) {
      toast.error("Network client not available. Please refresh.");
      console.error("Public client not available");
      setIsPaying(false);
      toast.dismiss(loadingToastId);
      return;
    }

    setIsPaying(true);
    

    try {
        // --- Initialize Payer SDK ---
        const payerSdk = createPayerClient({
            chain: targetChain,
            transportUrl: transportUrl,
            transfersContractAddress: transfersContractAddress,
            payerSigner: walletClient,
        });

        console.log("Attempting payment with intent:", signedIntent);

        if(!signedIntent) {
          toast.error("Could not retrieve valid payment details. Please try again later.");
          return;
        }

        // --- Execute Pre-Approved Transfer ---
        // Assumes allowance check/approval happened elsewhere or is handled by the intent type
        const transferResult = await payerSdk.transferTokenPreApproved(signedIntent?.signedIntentData);

        toast.dismiss(loadingToastId);

        if (transferResult.isOk()) {
            const currentTxHash = transferResult.value;
            setTxHash(currentTxHash); // Set tx hash immediately
            console.log("Payment Tx Hash:", currentTxHash);

            // --- Add User Message Immediately ---
            const explorerUrl = targetChain.blockExplorers?.default.url;
            const explorerLink = explorerUrl ? `${explorerUrl}/tx/${currentTxHash}` : null;
            if (explorerLink) {
                // Use Markdown link format
                props.addUserMessage(`Payment transaction sent! [View status](${explorerLink})`);

                // Simple success toast indicating submission
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
            // Provide specific feedback based on error type
            if (transferResult.error.type === 'INSUFFICIENT_ALLOWANCE') {
                 toast.error("Payment Failed: Token Allowance", {
                     description: `The contract needs permission to spend ${args.amount} ${args.currencySymbol}. Please grant approval.`
                     // TODO: Potentially trigger an approval flow here
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
        // Consider disabling the button permanently after success/failure?
    }
  };

  // --- Render Logic ---
  const canPay = !!walletClient && !!payerAddress && chainId === targetChain.id && !!signedIntent && !isLoadingIntent;
  // Use status from the fetched intent
  const isPaymentCompleted = signedIntent?.status === 'completed';
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
          disabled={isPaying || isLoadingIntent || !canPay || isPaymentCompleted} // Disable if paying, loading, can't pay, or already completed
          variant={isPaymentCompleted ? "ghost" : "default"} // Change variant visually for completed state
          aria-label={`Pay ${args.amount} ${args.currencySymbol} for ${args.reason}`}
          className={isPaymentCompleted ? "text-green-600 hover:bg-green-50 hover:text-green-700 cursor-default" : ""} // Add green color and disable hover effect when completed
        >
          {isPaymentCompleted ? (
            <><Check size={16} className="mr-1" /> Paid</>
          ) : isPaying ? (
            "Processing..."
          ) : isLoadingIntent ? (
            "Loading Details..."
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
       {intentError && (
            <p className="text-xs text-destructive mt-1">Error loading payment details.</p>
       )}
       {/* Display Transaction Info if Confirmed or Pending Confirmation */}
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
                   {signedIntent?.status === 'completed' ? " (Completed)" : signedIntent?.status ? ` (${signedIntent.status})` : " (Pending)"}
              </p>
          </div>
       )}
       <p className="text-xs text-muted-foreground mt-1">{result.message}</p>
       {!transfersContractAddress && <p className="text-xs text-destructive mt-1">Payment Button Disabled: Missing Configuration.</p> }
    </div>
  );
}

// Renderer for Payment Validation Tool
export function PaymentValidationToolRenderer(props: {
  toolInvocation: PaymentValidationToolInvocationPart;
}) {
  const result = props.toolInvocation.toolInvocation.result as PaymentValidationResult | undefined;
  const args = props.toolInvocation.toolInvocation.args as { paymentIntentId: string } | undefined;

  if (!result || !args) {
    return (
      <div className="my-1 p-2 text-xs border rounded bg-destructive/10 text-destructive">
        Error rendering payment validation: Missing arguments or result.
      </div>
    );
  }

  return (
    <div className={`my-2 p-3 border rounded-md shadow-sm ${result.success ? 'bg-card border-secondary' : 'bg-destructive/10 border-destructive/30'}`}>
      <p className={`font-medium text-sm mb-1 ${result.success ? 'text-primary' : 'text-destructive'}`}>
        {result.success ? 'Payment Validation Successful' : 'Payment Validation Failed'}
      </p>
      <p className="text-xs text-muted-foreground">{result.message}</p>
      <p className="text-xs text-muted-foreground mt-1">Intent ID: {args.paymentIntentId}</p>
    </div>
  );
}

// Component for rendering a single, inline, expandable tool invocation
function InlineToolInvocation({
  part,
}: {
  part: Extract<
    NonNullable<Message["parts"]>[number],
    { type: "tool-invocation" }
  >;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

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
      </Button>
      {isExpanded && (
        <div className="mt-1 p-2 text-xs border rounded bg-background">
          {part.toolInvocation.args && (
            <>
              <p className="font-medium">Args:</p>
              <pre className="whitespace-pre-wrap break-all bg-muted/20 p-1 rounded text-[0.7rem]">
                {JSON.stringify(part.toolInvocation.args, null, 2)}
              </pre>
            </>
          )}
          {part.toolInvocation.state === "result" &&
            part.toolInvocation.result && (
              <>
                <p className="mt-1 font-medium">Result:</p>
                <pre className="whitespace-pre-wrap break-all bg-muted/20 p-1 rounded text-[0.7rem]">
                  {JSON.stringify(part.toolInvocation.result, null, 2)}
                </pre>
              </>
            )}
        </div>
      )}
    </div>
  );
}

type AIMessageProps = Omit<
  React.ComponentProps<typeof MessageBubble>,
  "variant" | "message"
> & {
  fullMessage: Message;
  addUserMessage: (message: string) => void;
};

function AIMessage({ fullMessage, addUserMessage, ...props }: AIMessageProps) {
  console.log("AIMessage123", fullMessage);
  // Separate text and tool parts
  const textParts =
    fullMessage.parts?.filter((part) => part?.type === "text") || [];
  const toolInvocationParts =
    fullMessage.parts?.filter(
      (
        part,
      ): part is Extract<
        NonNullable<Message["parts"]>[number],
        { type: "tool-invocation" }
      > => part?.type === "tool-invocation",
    ) || [];

  console.log("toolInvocationParts", toolInvocationParts);
  // Render message content with text first, then tool calls
  const messageContent = (
    <div>
      {/* Render Text Parts with Markdown */}
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
        switch (part.toolInvocation.toolName) {
          case "requestPaymentTool": {
            // Use the specific type defined earlier
          const paymentRequestPart = part as PaymentRequestToolInvocationPart;
          return (
            <PaymentRequestToolRenderer
              key={`${fullMessage.id || "msg"}-tool-${index}`}
              toolInvocation={paymentRequestPart}
              addUserMessage={addUserMessage}
            />
          );
          }
          case "validatePaymentTool": {
            // Use the specific type for validation
            const paymentValidationPart = part as PaymentValidationToolInvocationPart;
            return (
                <PaymentValidationToolRenderer
                    key={`${fullMessage.id || "msg"}-tool-${index}`}
                    toolInvocation={paymentValidationPart}
                />
            );
          }
          default:
            // Render InlineToolInvocation for other tool calls
            return (
              <InlineToolInvocation
                key={`${fullMessage.id}-tool-${index}`}
                part={part}
              />
            );
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
