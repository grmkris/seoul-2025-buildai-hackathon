import { createOperatorClient, createPayerClient } from "commerce-sdk";
import { rootstockTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { env } from "@/env";
import { http } from "viem";
import { createWalletClient } from "viem";
import type { Logger } from "logger";
import type { db } from "@/db/db";

export const createPaymentAgentTools = (props: {
  logger: Logger
  db: db
}) => {
  const operatorClient = createOperatorClient({
    chain: rootstockTestnet,
    transportUrl: env.TEST_RPC_URL,
    transfersContractAddress: env.TRANSFERS_CONTRACT_ADDRESS as `0x${string}`,
    operatorSigner: createWalletClient({
      account: privateKeyToAccount(env.OPERATOR_PRIVATE_KEY as `0x${string}`),
      chain: rootstockTestnet,
      transport: http(),
    }),
  });
};
