import { describe, it, expect } from "bun:test"; // Or import from 'jest'
import {
	parseEther,
	type Address,
	type Hex,
	erc20Abi,
	createPublicClient,
	http,
	createWalletClient,
} from "viem";
import { rootstockTestnet } from "viem/chains"; // Or your preferred test chain
import { privateKeyToAccount } from "viem/accounts";

import { createOperatorClient, type TransferIntent } from "./operator";
import { createPayerClient } from "./payer";
import { z } from "zod";

const testEnvSchema = z.object({
	TEST_RPC_URL: z.string(),
	OPERATOR_PRIVATE_KEY: z.string(),
	PAYER_PRIVATE_KEY: z.string(),
	RECIPIENT_PRIVATE_KEY: z.string(),
	TRANSFERS_CONTRACT_ADDRESS: z.string(),
	MOCK_TOKEN_ADDRESS: z.string(),
});

const env = testEnvSchema.parse(Bun.env);

// --- Test Configuration ---
const TEST_RPC_URL = env.TEST_RPC_URL; // Default Anvil/Hardhat node URL
const testChain = rootstockTestnet; // Or hardhat

// --- Test Accounts (Using Anvil default private keys) ---
// WARNING: Do NOT use these keys for anything other than local testing
const operatorSk = env.OPERATOR_PRIVATE_KEY;
const payerSk = env.PAYER_PRIVATE_KEY;
const recipientSk = env.RECIPIENT_PRIVATE_KEY; // Just another account for receiving

const operatorAccount = privateKeyToAccount(operatorSk as `0x${string}`);
const payerAccount = privateKeyToAccount(payerSk as `0x${string}`);
const recipientAccount = privateKeyToAccount(recipientSk as `0x${string}`); // The final recipient of funds

// --- Contract Variables ---
const transfersContractAddress = env.TRANSFERS_CONTRACT_ADDRESS as Address;
const mockTokenAddress = env.MOCK_TOKEN_ADDRESS as Address;

describe("Commerce SDK: transferTokenPreApproved Flow", () => {
	const publicClient = createPublicClient({
		chain: testChain,
		transport: http(TEST_RPC_URL),
	});

	const operatorSigner = createWalletClient({
		account: operatorAccount,
		chain: testChain,
		transport: http(TEST_RPC_URL),
	});

	const payerSigner = createWalletClient({
		account: payerAccount,
		chain: testChain,
		transport: http(TEST_RPC_URL),
	});

	it("should execute transferTokenPreApproved successfully", async () => {
		// --- Instantiate SDK Clients ---
		const operatorSdk = createOperatorClient({
			chain: testChain,
			transportUrl: TEST_RPC_URL,
			transfersContractAddress: transfersContractAddress,
			operatorSigner: operatorSigner,
		});

		const payerSdk = createPayerClient({
			chain: testChain,
			transportUrl: TEST_RPC_URL,
			transfersContractAddress: transfersContractAddress,
			payerSigner: payerSigner,
		});

		// --- Test Parameters ---
		const recipientAmount = parseEther("1"); // Transfer 1 MTK
		const feeAmount = parseEther("0.01"); // Operator fee 0.01 MTK
		const totalAmount = recipientAmount + feeAmount;
		const intentId: Hex = `0x${Buffer.from(crypto.randomUUID()).toString("hex").substring(0, 32)}`; // Random bytes16 ID
		const deadline = BigInt(Math.floor(Date.now() / 1000) + 7200); // 2 hour expiry

		// --- Assert Initial Balances ---
		const initialPayerBalance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [payerAccount.address],
		});
		console.log(`Initial payer balance: ${initialPayerBalance}`);
		const initialRecipientBalance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [recipientAccount.address],
		});
		console.log(`Initial recipient balance: ${initialRecipientBalance}`);
		const initialOperatorBalance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [operatorAccount.address],
		}); // Fee destination
		console.log(`Initial operator balance: ${initialOperatorBalance}`);

		// --- Step 1: Check Operator Registration (Should be pre-registered by constructor) ---
		const isRegisteredResult = await operatorSdk.isOperatorRegistered();
		expect(isRegisteredResult.isOk()).toBe(true);
		if (isRegisteredResult.isOk()) expect(isRegisteredResult.value).toBe(true);

		// --- Step 2: Payer Approves the Transfers Contract (if needed) ---
		console.log("Checking current allowance...");
		const currentAllowance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "allowance",
			args: [payerAccount.address, transfersContractAddress],
		});
		console.log(`Current allowance: ${currentAllowance}`);

		if (currentAllowance < totalAmount) {
			console.log(
				`Allowance insufficient (${currentAllowance}). Payer approving ${totalAmount} tokens for Transfers contract...`,
			);
			const approveResult = await payerSdk.approveToken(
				mockTokenAddress,
				totalAmount,
			);
			expect(approveResult.isOk()).toBe(true);
			if (approveResult.isErr()) throw approveResult.error; // Fail test if error
			console.log("Approval transaction sent:", approveResult.value);
			await publicClient.waitForTransactionReceipt({
				hash: approveResult.value,
			});
			console.log("Approval confirmed.");
		} else {
			console.log("Sufficient allowance already granted.");
		}

		// --- Step 3: Operator Creates and Signs the Intent ---
		console.log("Operator creating signed intent...");
		const intentToSign: Omit<TransferIntent, "operator" | "signature"> = {
			recipientAmount: recipientAmount,
			deadline: deadline,
			recipient: recipientAccount.address,
			recipientCurrency: mockTokenAddress,
			refundDestination: payerAccount.address, // Not used in this flow, but required
			feeAmount: feeAmount,
			id: intentId,
		};
		const signedIntentResult = await operatorSdk.createAndSignTransferIntent(
			intentToSign,
			payerAccount.address,
		);
		if (signedIntentResult.isErr()) throw signedIntentResult.error; // Fail test
		expect(signedIntentResult.isOk()).toBe(true);
		const signedIntent = signedIntentResult.value;
		console.log("Intent signed:", signedIntent);

		// --- Step 4: Payer Executes the Transfer ---
		console.log("Payer executing transferTokenPreApproved...");
		const transferResult =
			await payerSdk.transferTokenPreApproved(signedIntent);
		if (transferResult.isErr()) throw transferResult.error; // Fail test
		expect(transferResult.isOk()).toBe(true);

		console.log("Transfer transaction sent:", transferResult.value);
		await publicClient.waitForTransactionReceipt({
			hash: transferResult.value,
		});
		console.log("Transfer confirmed.");

		// --- Step 5: Assert Final Balances ---
		const finalPayerBalance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [payerAccount.address],
		});
		const finalRecipientBalance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [recipientAccount.address],
		});
		const finalOperatorBalance = await publicClient.readContract({
			address: mockTokenAddress,
			abi: erc20Abi,
			functionName: "balanceOf",
			args: [operatorAccount.address],
		}); // Fee destination

		expect(finalPayerBalance).toBe(initialPayerBalance - totalAmount);
		expect(finalRecipientBalance).toBe(
			initialRecipientBalance + recipientAmount,
		);
		expect(finalOperatorBalance).toBe(initialOperatorBalance + feeAmount);

		console.log(
			"Final Balances - Payer:",
			finalPayerBalance,
			"Recipient:",
			finalRecipientBalance,
			"Operator:",
			finalOperatorBalance,
		);
	}, 1000000000); // Timeout for this specific test
});
