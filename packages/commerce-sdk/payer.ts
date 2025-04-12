import {
	createPublicClient,
	http,
	type PublicClient,
	type WalletClient,
	type Chain,
	type Address,
	type Hex,
	type WriteContractParameters,
	erc20Abi,
} from "viem";
import { type Result, err, ok } from "neverthrow";
import { COMMERCE_ABI } from "./abi"; // Using the shared ABI
import type { SignedTransferIntent } from "./operator"; // Import the TransferIntent type

// --- SDK Configuration ---

export type PayerClientConfig = {
	chain: Chain;
	transportUrl: string;
	transfersContractAddress: Address;
	payerSigner: WalletClient;
};

// --- Error Types ---

export type PayerClientError =
	| { type: "CONTRACT_READ_ERROR"; message: string; cause?: unknown }
	| { type: "CONTRACT_WRITE_ERROR"; message: string; cause?: unknown }
	| { type: "INVALID_CONFIG"; message: string; cause?: unknown }
	| { type: "INVALID_INTENT"; message: string; cause?: unknown }
	| {
			type: "INSUFFICIENT_ALLOWANCE";
			message: string;
			required: bigint;
			current: bigint;
			token: Address;
	  }
	| { type: "FETCH_ERROR"; message: string; cause?: unknown }; // General/network errors

// --- Payer SDK ---

export const createPayerClient = (config: PayerClientConfig) => {
	// Basic config validation
	if (
		!config.chain ||
		!config.transportUrl ||
		!config.transfersContractAddress ||
		!config.payerSigner
	) {
		throw new Error("PayerClientError: Invalid configuration provided.");
	}

	const publicClient: PublicClient = createPublicClient({
		chain: config.chain,
		transport: http(config.transportUrl),
	});

	// Helper to check ERC20 allowance for the Transfers contract
	const checkAllowance = async (
		tokenAddress: Address,
		amountNeeded: bigint,
	): Promise<Result<bigint, PayerClientError>> => {
		try {
			if (!config.payerSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Payer account is not set.",
				});
			}
			const payerAddress = config.payerSigner.account.address;
			// Explicitly type the readContract call
			const currentAllowance = (await publicClient.readContract({
				address: tokenAddress,
				abi: erc20Abi,
				functionName: "allowance",
				args: [payerAddress, config.transfersContractAddress],
			})) as bigint; // Assert type here since erc20Abi ensures bigint

			if (currentAllowance < amountNeeded) {
				return err({
					type: "INSUFFICIENT_ALLOWANCE",
					message: `Insufficient allowance for token ${tokenAddress}. Required: ${amountNeeded}, Current: ${currentAllowance}`,
					required: amountNeeded,
					current: currentAllowance, // Now correctly typed as bigint
					token: tokenAddress,
				});
			}
			return ok(currentAllowance);
		} catch (error) {
			return err({
				type: "CONTRACT_READ_ERROR",
				message: `Failed to check allowance for token ${tokenAddress}`,
				cause: error,
			});
		}
	};

	// Helper to approve spending an ERC20 token for the Transfers contract
	const approveToken = async (
		tokenAddress: Address,
		amount: bigint,
	): Promise<Result<Hex, PayerClientError>> => {
		if (amount <= 0n) {
			return err({
				type: "INVALID_INTENT",
				message: "Approval amount must be positive.",
			});
		}
		try {
			if (!config.payerSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Payer account is not set.",
				});
			}
			const approveParams: WriteContractParameters<typeof erc20Abi, "approve"> =
				{
					address: tokenAddress,
					abi: erc20Abi,
					functionName: "approve",
					args: [config.transfersContractAddress, amount],
					account: config.payerSigner.account,
					chain: config.chain,
				};
			const txHash = await config.payerSigner.writeContract(approveParams);
			// Consider adding logic to wait for transaction confirmation
			return ok(txHash);
		} catch (error) {
			return err({
				type: "CONTRACT_WRITE_ERROR",
				message: `Failed to send approval transaction for token ${tokenAddress}`,
				cause: error,
			});
		}
	};

	// Executes the transferTokenPreApproved function using a signed intent
	const transferTokenPreApproved = async (
		signedIntent: SignedTransferIntent,
	): Promise<Result<Hex, PayerClientError>> => {
		// --- Basic Intent Validation ---
		if (!signedIntent || !signedIntent.signature) {
			return err({
				type: "INVALID_INTENT",
				message: "Signed intent is missing or lacks a signature.",
			});
		}
		if (
			signedIntent.recipientCurrency ===
			"0x0000000000000000000000000000000000000000"
		) {
			return err({
				type: "INVALID_INTENT",
				message:
					"transferTokenPreApproved requires a token, not native currency.",
			});
		}
		if (signedIntent.deadline <= BigInt(Math.floor(Date.now() / 1000))) {
			return err({
				type: "INVALID_INTENT",
				message: "Intent deadline is in the past.",
			});
		}
		// TODO: Potentially add more validation checks on the intent fields

		const neededAmount = signedIntent.recipientAmount + signedIntent.feeAmount;
		const tokenAddress = signedIntent.recipientCurrency;

		// --- Check Allowance ---
		const allowanceResult = await checkAllowance(tokenAddress, neededAmount);

		// --- Handle Insufficient Allowance ---
		if (allowanceResult.isErr() && allowanceResult.error.type === 'INSUFFICIENT_ALLOWANCE') {
			const requiredAmount = allowanceResult.error.required;
			console.log(`Insufficient allowance. Required: ${requiredAmount}. Attempting to approve...`);

			const approveResult = await approveToken(tokenAddress, requiredAmount);
			if (approveResult.isErr()) {
				// Propagate approval error
				return err(approveResult.error);
			}

			// --- Wait for Approval Confirmation ---
			try {
				console.log(`Approval transaction sent: ${approveResult.value}. Waiting for confirmation...`);
				const receipt = await publicClient.waitForTransactionReceipt({ hash: approveResult.value });
				if (receipt.status !== 'success') {
					return err({
						type: "CONTRACT_WRITE_ERROR",
						message: `Approval transaction failed with status: ${receipt.status}`,
						cause: receipt,
					});
				}
				console.log("Approval confirmed.");
				// Re-check allowance after successful approval (optional but good practice)
                // allowanceResult = await checkAllowance(tokenAddress, neededAmount);
                // if (allowanceResult.isErr()) {
                //     // This shouldn't happen if approval succeeded, but handle just in case
                //     console.error("Allowance check failed even after approval:", allowanceResult.error);
                //     return err(allowanceResult.error);
                // }
			} catch (error) {
				const message = error instanceof Error ? error.message : "Unknown error";
				return err({
					type: "CONTRACT_WRITE_ERROR",
					message: `Failed to confirm approval transaction: ${message}`,
					cause: error,
				});
			}
		} else if (allowanceResult.isErr()) {
			// Handle other checkAllowance errors (e.g., CONTRACT_READ_ERROR)
			return err(allowanceResult.error);
		}


		// --- Execute Transaction ---
		try {
			// We already validated signedIntent.signature exists above
			// Cast to satisfy viem's writeContract type which expects signature based on ABI

			if (!config.payerSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Payer account is not set.",
				});
			}

			const txHash = await config.payerSigner.writeContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "transferTokenPreApproved",
				args: [signedIntent],
				account: config.payerSigner.account,
				chain: config.chain,
			});

			// Optionally wait for transaction receipt here before returning ok
			return ok(txHash);
		} catch (error: unknown) {
			// Use unknown instead of any
			// Catch potential viem/contract errors
			// Basic error handling, can be expanded to check error types
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error";
			return err({
				type: "CONTRACT_WRITE_ERROR",
				message: `Failed to execute transferTokenPreApproved: ${errorMessage}`,
				cause: error, // Include the original error
			});
		}
	};

	// Return the public interface of the Payer SDK
	return {
		checkAllowance,
		approveToken,
		transferTokenPreApproved,
		// Expose config and clients if needed
		// config,
		// publicClient,
	};
};

// --- Example Usage (Conceptual) ---
/*
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';
import { createOperatorClient, type TransferIntent } from './operator'; // Assuming operator SDK is in the same dir

async function runPayerFlow() {
    // --- CONFIGURATION (Replace with actual values) ---
    const payerPrivateKey = '0x...'; // Keep private keys secure!
    const payerAccount = privateKeyToAccount(payerPrivateKey);
    const rpcUrl = process.env.SEPOLIA_RPC_URL!;
    const contractAddress = '0xYourTransfersContractAddress';
    const tokenAddress = '0xYourTokenAddress'; // The ERC20 token being transferred

    const payerSigner = createWalletClient({
        account: payerAccount,
        chain: sepolia,
        transport: http(rpcUrl),
    });

    const payerSdk = createPayerClient({
        chain: sepolia,
        transportUrl: rpcUrl,
        transfersContractAddress: contractAddress,
        payerAccount: payerAccount.address,
        signer: payerSigner,
    });

    // --- Simulate getting a signed intent from an operator ---
    // This would typically come from an API call or message queue
    const signedIntentFromOperator: TransferIntent = {
         // ... (populate with actual signed intent data from operator)
         recipientAmount: 1000000000000000000n, // 1 Token
         deadline: BigInt(Math.floor(Date.now() / 1000) + 3600),
         recipient: '0xRecipientAddress',
         recipientCurrency: tokenAddress,
         refundDestination: payerAccount.address,
         feeAmount: 100000000000000000n, // 0.1 Token fee
         id: '0x...', // The unique ID used by the operator
         operator: '0xOperatorAddress',
         signature: '0x...' // The signature generated by the operator
    };

    const neededAmount = signedIntentFromOperator.recipientAmount + signedIntentFromOperator.feeAmount;

    // --- Check and Set Allowance ---
    console.log(`Checking allowance for ${neededAmount} tokens...`);
    let allowanceResult = await payerSdk.checkAllowance(tokenAddress, neededAmount);

    if (allowanceResult.isErr() && allowanceResult.error.type === 'INSUFFICIENT_ALLOWANCE') {
        console.log(`Insufficient allowance. Required: ${allowanceResult.error.required}, Have: ${allowanceResult.error.current}. Approving...`);
        const approveResult = await payerSdk.approveToken(tokenAddress, neededAmount);
        if (approveResult.isErr()) {
            console.error("Failed to approve token:", approveResult.error);
            return;
        }
        console.log("Approval transaction sent:", approveResult.value);
        // IMPORTANT: Wait for approval transaction to confirm before proceeding!
        // Add publicClient.waitForTransactionReceipt(...) logic here.
        console.log("Approval confirmed (assuming). Re-checking allowance...");
        allowanceResult = await payerSdk.checkAllowance(tokenAddress, neededAmount); // Re-check
    }

    if (allowanceResult.isErr()) {
         console.error("Failed to ensure sufficient allowance:", allowanceResult.error);
         return;
    }

    console.log("Allowance sufficient. Proceeding with transfer...");

    // --- Execute the Transfer ---
    const transferResult = await payerSdk.transferTokenPreApproved(signedIntentFromOperator);

    if (transferResult.isOk()) {
        console.log("transferTokenPreApproved transaction sent! Hash:", transferResult.value);
        // Add logic to wait for receipt if needed
    } else {
        console.error("Failed to execute transferTokenPreApproved:", transferResult.error);
         if (transferResult.error.type === 'CONTRACT_WRITE_ERROR' && transferResult.error.cause) {
            // Log the underlying contract revert reason if available
             console.error("Underlying cause:", transferResult.error.cause);
         }
    }
}

runPayerFlow();
*/
