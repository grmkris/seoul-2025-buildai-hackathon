import {
	createPublicClient,
	http,
	type PublicClient,
	type WalletClient,
	type Chain,
	type Address,
	type Hex,
	keccak256,
	encodePacked,
	hashMessage,
} from "viem";
import { type Result, err, ok } from "neverthrow";
import { COMMERCE_ABI } from "./abi"; // Assuming ABI is stored here

// --- Types corresponding to Solidity structs ---

// Mirroring the TransferIntent struct from Transfers.sol
export type TransferIntent = {
	recipientAmount: bigint;
	deadline: bigint; // Unix timestamp
	recipient: Address;
	recipientCurrency: Address; // Use address(0) for native currency
	refundDestination: Address; // Where excess funds go if applicable (swaps)
	feeAmount: bigint;
	id: Hex; // bytes16, represented as 0x... (34 chars long)
	operator: Address;
	prefix?: Hex; // <--- Changed from string? to Hex?
	signature?: Hex; // Added by the SDK after signing
};

export type SignedTransferIntent = TransferIntent & {
	signature: Hex;
	prefix: Hex;
};

// --- SDK Configuration ---

export type OperatorClientConfig = {
	chain: Chain;
	transportUrl: string;
	transfersContractAddress: Address;
	operatorSigner: WalletClient;
};

// --- Error Types ---

export type OperatorClientError =
	| { type: "CONTRACT_READ_ERROR"; message: string; cause?: unknown }
	| { type: "CONTRACT_WRITE_ERROR"; message: string; cause?: unknown }
	| { type: "SIGNATURE_ERROR"; message: string; cause?: unknown }
	| { type: "INVALID_CONFIG"; message: string; cause?: unknown }
	| { type: "INVALID_INTENT"; message: string; cause?: unknown }
	| { type: "INTENT_ALREADY_PROCESSED"; message: string; id: Hex }
	| { type: "FETCH_ERROR"; message: string; cause?: unknown }; // General/network errors

// --- Operator SDK ---

export const createOperatorClient = (config: OperatorClientConfig) => {
	// Validate config basic structure (more specific checks can be added)
	if (
		!config.chain ||
		!config.transportUrl ||
		!config.transfersContractAddress ||
		!config.operatorSigner
	) {
		// Using a synchronous throw here as it's a configuration issue before async ops
		throw new Error("OperatorClientError: Invalid configuration provided.");
		// Or return a factory function that always returns err(...) if preferred
	}

	const publicClient: PublicClient = createPublicClient({
		chain: config.chain,
		transport: http(config.transportUrl),
	});

	// Helper to get the fee destination address for the configured operator
	const getFeeDestination = async (): Promise<
		Result<Address, OperatorClientError>
	> => {
		try {
			if (!config.operatorSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Operator account is not set.",
				});
			}
			const destination = await publicClient.readContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "getFeeDestination",
				args: [config.operatorSigner.account.address],
			});
			return ok(destination);
		} catch (error) {
			return err({
				type: "CONTRACT_READ_ERROR",
				message: "Failed to get fee destination",
				cause: error,
			});
		}
	};

	// Helper to check if the configured operator is registered
	const isOperatorRegistered = async (): Promise<
		Result<boolean, OperatorClientError>
	> => {
		try {
			if (!config.operatorSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Operator account is not set.",
				});
			}
			const isRegistered = await publicClient.readContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "isOperatorRegistered",
				args: [config.operatorSigner.account.address],
			});
			return ok(isRegistered);
		} catch (error) {
			return err({
				type: "CONTRACT_READ_ERROR",
				message: "Failed to check operator registration status",
				cause: error,
			});
		}
	};

	// Helper to check if a specific intent ID has been processed for the operator
	const isIntentProcessed = async (
		intentId: Hex,
	): Promise<Result<boolean, OperatorClientError>> => {
		if (!intentId || intentId.length !== 34) {
			// Basic validation for bytes16 hex
			return err({
				type: "INVALID_INTENT",
				message: "Invalid intent ID format.",
			});
		}
		try {
			if (!config.operatorSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Operator account is not set.",
				});
			}
			const isProcessed = await publicClient.readContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "isIntentProcessed",
				args: [config.operatorSigner.account.address, intentId],
			});
			if (isProcessed) {
				// Optionally return a specific error if already processed
				return err({
					type: "INTENT_ALREADY_PROCESSED",
					message: "Intent already processed",
					id: intentId,
				});
			}
			return ok(false); // Return false if not processed
		} catch (error) {
			return err({
				type: "CONTRACT_READ_ERROR",
				message: "Failed to check if intent is processed",
				cause: error,
			});
		}
	};

	// Creates the hash that needs to be signed by the operator
	const createTransferIntentHash = (
		intent: Omit<TransferIntent, "signature">,
		payerAddress: Address,
	): Hex => {
		const packedData = encodePacked(
			[
				"uint256",
				"uint256",
				"address",
				"address",
				"address",
				"uint256",
				"bytes16",
				"address",
				"uint256",
				"address",
				"address",
			],
			[
				intent.recipientAmount,
				intent.deadline,
				intent.recipient,
				intent.recipientCurrency,
				intent.refundDestination,
				intent.feeAmount,
				intent.id,
				intent.operator,
				BigInt(config.chain.id), // block.chainid
				payerAddress, // sender (_msgSender() in the contract context)
				config.transfersContractAddress, // address(this)
			],
		);

		const hash = keccak256(packedData);

		if (intent.prefix) {
			// Custom prefix: keccak256(abi.encodePacked(_intent.prefix, hash))
			const prefixedHash = keccak256(
				encodePacked(["string", "bytes32"], [intent.prefix, hash]),
			);
			return prefixedHash;
		}
		// Default EIP-191 prefix: "\\x19Ethereum Signed Message:\\n32" + hash
		// viem's hashMessage handles this automatically
		return hashMessage({ raw: hash }); // Let viem handle EIP-191
	};

	// Creates and signs the TransferIntent
	const createAndSignTransferIntent = async (
		intentData: Omit<TransferIntent, "operator" | "signature">,
		payerAddress: Address, // The address of the user who will *execute* the transfer
	): Promise<Result<SignedTransferIntent, OperatorClientError>> => {
		if (!config.operatorSigner.account) {
			return err({
				type: "INVALID_CONFIG",
				message: "Operator account is not set.",
			});
		}
		// Construct the full intent with the operator address
		const intent: Omit<TransferIntent, "signature"> = {
			...intentData,
			operator: config.operatorSigner.account.address,
		};

		// TODO: Add validation logic for intentData fields (amounts >= 0, valid addresses, deadline > now, etc.)
		if (intent.deadline <= BigInt(Math.floor(Date.now() / 1000))) {
			return err({
				type: "INVALID_INTENT",
				message: "Intent deadline is in the past.",
			});
		}
		if (!intent.id || intent.id.length !== 34) {
			// Basic validation for bytes16 hex
			return err({
				type: "INVALID_INTENT",
				message: "Invalid intent ID format.",
			});
		}
		if (!payerAddress || !payerAddress.startsWith("0x")) {
			return err({
				type: "INVALID_INTENT",
				message: "Invalid payer address provided.",
			});
		}

		if (!config.operatorSigner.account) {
			return err({
				type: "INVALID_CONFIG",
				message: "Operator account is not set.",
			});
		}

		// 1. Create the hash
		const messageHash = createTransferIntentHash(intent, payerAddress);

		// 2. Sign the hash
		try {
			// Assuming config.signer is a WalletClient correctly configured
			// with the operator's account
			const signature = await config.operatorSigner.signMessage({
				account: config.operatorSigner.account,
				message: { raw: messageHash }, // Sign the raw hash directly if using hashMessage EIP-191 style, or just messageHash if custom prefix
			});

			// 3. Return the full intent with the signature
			const signedIntent: SignedTransferIntent = {
				...intent,
				signature,
				prefix: intent.prefix || "0x",
			};
			return ok(signedIntent);
		} catch (error) {
			return err({
				type: "SIGNATURE_ERROR",
				message: "Failed to sign the transfer intent",
				cause: error,
			});
		}
	};

	// --- Functions to interact with the contract (Registration) ---
	// These require a WalletClient capable of sending transactions

	const registerOperator = async (): Promise<
		Result<Hex, OperatorClientError>
	> => {
		try {
			if (!config.operatorSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Operator account is not set.",
				});
			}
			const txHash = await config.operatorSigner.writeContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "registerOperator",
				account: config.operatorSigner.account, // Make sure account is linked to signer
				chain: config.chain,
			});
			// Optionally wait for transaction receipt here
			return ok(txHash);
		} catch (error) {
			return err({
				type: "CONTRACT_WRITE_ERROR",
				message: "Failed to register operator",
				cause: error,
			});
		}
	};

	const registerOperatorWithFeeDestination = async (
		feeDestination: Address,
	): Promise<Result<Hex, OperatorClientError>> => {
		if (!feeDestination || !feeDestination.startsWith("0x")) {
			// Basic validation
			return err({
				type: "INVALID_INTENT",
				message: "Invalid fee destination address.",
			});
		}
		if (!config.operatorSigner.account) {
			return err({
				type: "INVALID_CONFIG",
				message: "Operator account is not set.",
			});
		}
		try {
			const txHash = await config.operatorSigner.writeContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "registerOperatorWithFeeDestination",
				args: [feeDestination],
				account: config.operatorSigner.account,
				chain: config.chain,
			});
			return ok(txHash);
		} catch (error) {
			return err({
				type: "CONTRACT_WRITE_ERROR",
				message: "Failed to register operator with fee destination",
				cause: error,
			});
		}
	};

	const unregisterOperator = async (): Promise<
		Result<Hex, OperatorClientError>
	> => {
		try {
			if (!config.operatorSigner.account) {
				return err({
					type: "INVALID_CONFIG",
					message: "Operator account is not set.",
				});
			}
			const txHash = await config.operatorSigner.writeContract({
				address: config.transfersContractAddress,
				abi: COMMERCE_ABI,
				functionName: "unregisterOperator",
				account: config.operatorSigner.account,
				chain: config.chain,
			});
			return ok(txHash);
		} catch (error) {
			return err({
				type: "CONTRACT_WRITE_ERROR",
				message: "Failed to unregister operator",
				cause: error,
			});
		}
	};

	// Return the public interface of the SDK
	return {
		// Read-only operations
		getFeeDestination,
		isOperatorRegistered,
		isIntentProcessed,

		// Signing operation (off-chain)
		createAndSignTransferIntent,

		// Write operations (on-chain)
		registerOperator,
		registerOperatorWithFeeDestination,
		unregisterOperator,

		// Expose config and clients if needed for advanced use
		// config,
		// publicClient,
	};
};

// Example Usage (Conceptual - requires setting up config):
/*
import { privateKeyToAccount } from 'viem/accounts';
import { sepolia } from 'viem/chains';

const operatorPrivateKey = '0x...'; // Keep private keys secure!
const operatorAccount = privateKeyToAccount(operatorPrivateKey);

const walletClient = createWalletClient({
  account: operatorAccount,
  chain: sepolia,
  transport: http(process.env.SEPOLIA_RPC_URL),
});

const operatorSdk = createOperatorClient({
    chain: sepolia,
    transportUrl: process.env.SEPOLIA_RPC_URL!,
    transfersContractAddress: '0xYourContractAddress',
    operatorAccount: operatorAccount.address,
    signer: walletClient // Pass the configured WalletClient
});

async function main() {
    const registered = await operatorSdk.isOperatorRegistered();
    if (registered.isOk() && !registered.value) {
        console.log("Registering operator...");
        const regResult = await operatorSdk.registerOperator();
        if (regResult.isErr()) {
            console.error("Registration failed:", regResult.error);
            return;
        }
        console.log("Registration tx:", regResult.value);
        // Need to wait for tx confirmation usually
    }

    const intentToSign: Omit<TransferIntent, 'operator' | 'signature'> = {
        recipientAmount: 1000000000000000000n, // 1 Token (assuming 18 decimals)
        deadline: BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
        recipient: '0xRecipientAddress',
        recipientCurrency: '0xTokenAddress', // Address of the ERC20 token
        refundDestination: '0xPayerAddress', // Usually the payer
        feeAmount: 100000000000000000n, // 0.1 Token fee
        id: '0x' + require('crypto').randomBytes(16).toString('hex'), // Generate random bytes16 ID
    };
    const payer = '0xPayerAddress';

    const signedIntentResult = await operatorSdk.createAndSignTransferIntent(intentToSign, payer);

    if (signedIntentResult.isOk()) {
        console.log("Signed Intent:", signedIntentResult.value);
        // Now the payer can use this signedIntentResult.value to call
        // transferTokenPreApproved, transferNative, etc. on the contract
    } else {
        console.error("Failed to sign intent:", signedIntentResult.error);
    }
}

main();
*/
