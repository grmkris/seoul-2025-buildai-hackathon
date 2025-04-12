import { createOperatorClient, type TransferIntent } from "commerce-sdk";
import { rootstockTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { env } from "@/env";
import { http, parseUnits, type Address, type Hex } from "viem";
import { createWalletClient } from "viem";
import type { Logger } from "logger";
import type { db } from "@/db/db";
import { tool } from "ai";
import { z } from "zod";
import type { ConversationId, CustomerId, PaymentIntentId } from "typeid";
import { DB_SCHEMA } from "@/db/db";
import { eq } from "drizzle-orm";
import { customersTable } from "@/db/schema/customers/customers.db";

// --- Tool Parameter Schema ---
const RequestPaymentParamsSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .describe("The amount of currency to request (e.g., 0.01)"),
  currencySymbol: z
    .string()
    .default("XUSD")
    .describe("The symbol of the currency (e.g., tRBTC, MTK)"), // Assuming a default or lookup
  reason: z
    .string()
    .min(1, "A reason for the payment is required.")
    .describe("A brief explanation for why the payment is required."),
});

// Mock token address and decimals (replace with actual lookup if needed)
// TODO: Fetch this dynamically based on currencySymbol or have a config map
const CURRENCY_MAP: Record<string, { address: Address; decimals: number }> = {
  // Assuming MockToken from your test setup
  XUSD: { address: env.MOCK_TOKEN_ADDRESS as Address, decimals: 18 },
};

export const createPaymentAgentTools = (props: {
  logger: Logger;
  db: db;
  customerId: CustomerId; // Assuming CustomerId is passed down or available
  conversationId: ConversationId; // Assuming ConversationId is passed down or available
}) => {
  const { logger, db, customerId, conversationId } = props;

  const operatorClient = createOperatorClient({
    chain: rootstockTestnet,
    transportUrl: env.TEST_RPC_URL,
    transfersContractAddress: env.TRANSFERS_CONTRACT_ADDRESS as Address,
    operatorSigner: createWalletClient({
      account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as Hex),
      chain: rootstockTestnet,
      transport: http(),
    }),
  });

  const requestPaymentTool = tool({
    id: "payment.requestPayment" as const,
    description:
      "Request a payment from the user to access gated features or services.",
    parameters: RequestPaymentParamsSchema,
    execute: async ({ amount, currencySymbol, reason }) => {
      try {
        logger.info({
          msg: "Executing requestPayment tool",
          amount,
          currencySymbol,
          reason,
          customerId,
          conversationId,
        });

        const currencyInfo = CURRENCY_MAP[currencySymbol.toUpperCase()];
        if (!currencyInfo) {
          logger.error({
            msg: "Unsupported currency symbol",
            currencySymbol,
          });
          return {
            error: `Unsupported currency symbol: ${currencySymbol}. Supported: ${Object.keys(CURRENCY_MAP).join(", ")}`,
          };
        }

        const amountInSmallestUnit = parseUnits(
          String(amount),
          currencyInfo.decimals,
        );

        // TODO: Determine fee logic. Hardcoding for now.
        const feeAmount = parseUnits("0.001", currencyInfo.decimals);

        const intentIdHex: Hex = `0x${Buffer.from(crypto.randomUUID())
          .toString("hex")
          .substring(0, 32)}`;
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour expiry

        // Fetch user details if needed (e.g., their wallet address for refund)
        // For now, we might not have the user's *payer* address here.
        // The 'payerAddress' for createAndSignTransferIntent might be more about *who* the intent is for,
        // rather than the actual signer needed for transferTokenPreApproved.
        // Let's use a placeholder or operator's address for refund for now.
        // A real implementation might need the user's address beforehand.
        const payer = await db.query.customersTable.findFirst({
          where: eq(customersTable.id, customerId),
        });
        const payerAddress = payer?.walletAddress;
        if (!payerAddress) {
          logger.error({
            msg: "User has no wallet address",
            customerId,
          });
          return { error: "User has no wallet address" };
        }

        const intentToSign: Omit<TransferIntent, "operator" | "signature"> = {
          recipientAmount: amountInSmallestUnit,
          deadline: deadline,
          recipient: env.RECIPIENT_ADDRESS as Address, // Operator receives payment
          recipientCurrency: currencyInfo.address,
          refundDestination: payerAddress as Address, // Needs user's address ideally
          feeAmount: feeAmount,
          id: intentIdHex,
        };

        logger.info({ msg: "Creating and signing intent", intentToSign });

        const signedIntentResult =
          await operatorClient.createAndSignTransferIntent(
            intentToSign,
            payerAddress as Address, // The intended payer (might not be validated on-chain here)
          );

        if (signedIntentResult.isErr()) {
          logger.error({
            msg: "Failed to create/sign payment intent",
            error: signedIntentResult.error,
          });
          return {
            error: "Failed to create payment request. Please try again later.",
          };
        }

        const signedIntent = signedIntentResult.value;

        logger.info({ msg: "Signed intent created", signedIntent });

        // Store the intent in the database
        const paymentIntent = await db
          .insert(DB_SCHEMA.paymentIntents)
          .values({
            intentId: signedIntent.id,
            conversationId: conversationId, // Passed in props
            customerId,
            status: "pending",
            amount: amountInSmallestUnit, // Store as bigint
            currencyAddress: currencyInfo.address,
            reason: reason,
            signedIntentData: signedIntent, // Store the whole signed object
            deadline: new Date(Number(deadline) * 1000), // Convert bigint seconds to Date
          })
          .returning();

        const paymentIntentDbId = paymentIntent[0].id;
        if (!paymentIntentDbId) {
          logger.error({
            msg: "Failed to store payment intent",
            signedIntent,
          });
          return { error: "Failed to store payment intent" };
        }
        logger.info({
          msg: "Payment intent stored in DB",
          paymentIntentDbId,
          intentId: signedIntent.id,
        });

        // Return confirmation to the agent
        return {
          success: true,
          paymentIntentId: paymentIntentDbId, // Return DB ID
          message: `Payment request initiated for ${amount} ${currencySymbol}. Please use the payment UI to complete the transaction.`,
        };
      } catch (error) {
        logger.error({
          msg: "Error in requestPayment tool execute",
          error: error instanceof Error ? error.message : JSON.stringify(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        return {
          error:
            "An unexpected error occurred while processing the payment request.",
        };
      }
    },
  });

  const validatePaymentTool = tool({
    id: "payment.validatePayment" as const,
    description: "Validate a payment",
    parameters: z.object({
      paymentIntentId: z
        .string()
        .describe("The ID of the payment intent to validate"),
    }),
    execute: async ({ paymentIntentId }) => {
      try {
        const paymentIntent = await db.query.paymentIntents.findFirst({
          where: eq(
            DB_SCHEMA.paymentIntents.id,
            paymentIntentId as PaymentIntentId,
          ),
        });
        if (!paymentIntent) {
          logger.error({
            msg: "Payment intent not found",
            paymentIntentId,
          });
        }

        // let's mark the payment intent as completed
        await db
          .update(DB_SCHEMA.paymentIntents)
          .set({
            status: "completed",
          })
          .where(
            eq(DB_SCHEMA.paymentIntents.id, paymentIntentId as PaymentIntentId),
          );

        return {
          success: true,
          paymentIntentId,
          message: "Payment intent validated",
        };
      } catch (error) {
        logger.error({
          msg: "Error in validatePayment tool execute",
          error: error instanceof Error ? error.message : JSON.stringify(error),
          stack: error instanceof Error ? error.stack : undefined,
        });
        return {
          error:
            "An unexpected error occurred while processing the payment validation.",
        };
      }
    },
  });

  return {
    requestPaymentTool,
    validatePaymentTool,
  };
};
