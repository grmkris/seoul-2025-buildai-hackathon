import {
  createWalletClient,
  getContract,
  http,
  decodeEventLog,
  parseAbiItem,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { serverEnv } from "../serverEnv";
import { contractAddresses } from "./contract_addresses";
import { factoryABI } from "./factoryABI";
import { flowMainnet, citreaTestnet, rootstockTestnet } from "viem/chains";
import { waitForTransactionReceipt } from "viem/actions";
import { forehead721ABI } from "./forehead721ABI";
import { encodeEventTopics } from "viem";

export const deployProfileNFTCollection = async (props: {
  name: string;
  symbol: string;
  chainId: number;
}) => {
  const { name, symbol, chainId } = props;

  const chain =
    chainId === flowMainnet.id
      ? flowMainnet
      : chainId === citreaTestnet.id
      ? citreaTestnet
      : rootstockTestnet;

  const contractAddress =
    chainId === flowMainnet.id
      ? contractAddresses.flowMainnet
      : chainId === citreaTestnet.id
      ? contractAddresses.citreaTestnet
      : contractAddresses.rootstockTestnet;

  const walletClient = createWalletClient({
    account: privateKeyToAccount(serverEnv.PRIVATE_KEY as `0x${string}`),
    transport: http(),
    chain,
  });

  const contract = getContract({
    address: contractAddress,
    abi: factoryABI,
    client: walletClient,
  });

  const tx = await contract.write.deployNFTContract([name, symbol], {
    account: walletClient.account,
    chain,
  });
  const receipt = await waitForTransactionReceipt(walletClient, { hash: tx });

  console.log("Deployment Receipt:", receipt);

  // Find and decode the NFTContractDeployed event log
  const deployEventSignature = parseAbiItem(
    "event NFTContractDeployed(address indexed contractAddress, address indexed deployer, string name, string symbol)",
  );
  // Pre-calculate the signature hash (topic0)
  const deployEventTopic = encodeEventTopics({
    abi: [deployEventSignature],
  })[0];

  let deployedContractAddress: `0x${string}` | null = null;

  for (const log of receipt.logs) {
    // Check if the log's topic0 matches the event signature BEFORE trying to decode
    if (log.topics[0] === deployEventTopic) {
      try {
        const decodedLog = decodeEventLog({
          abi: [deployEventSignature],
          data: log.data,
          topics: log.topics,
        });

        // Since we matched the topic, we can be more confident it's our event
        // Although checking eventName is still good practice if the ABI had multiple events
        if (decodedLog.eventName === "NFTContractDeployed") {
          deployedContractAddress = (
            decodedLog.args as { contractAddress: `0x${string}` }
          ).contractAddress;
          console.log(
            "Deployed Contract Address from event:",
            deployedContractAddress,
          );
          break; // Exit loop once found
        }
      } catch (e: unknown) {
        // Handle potential decoding errors even if topic matches (e.g., corrupted data)
        console.error(
          "Error decoding NFTContractDeployed event log:",
          log,
          "Error:",
          e instanceof Error ? e.message : e,
        );
      }
    }
    // No 'else' or 'catch' needed here for non-matching logs, silencing the warning
  }

  if (!deployedContractAddress) {
    console.error(
      "Could not find NFTContractDeployed event in transaction logs.",
      receipt,
    );
    throw new Error(
      "Failed to extract deployed contract address from transaction receipt.",
    );
  }

  return deployedContractAddress;
};

export const mintProfileNFT = async (props: {
  contractAddress: `0x${string}`; // Expecting 0x prefixed address
  to: `0x${string}`; // Expecting 0x prefixed address
  uri: string; // Changed from tokenId to uri
  chainId: number;
}) => {
  const { contractAddress, to, uri, chainId } = props; // Updated props

  const chain =
    chainId === flowMainnet.id
      ? flowMainnet
      : chainId === citreaTestnet.id
      ? citreaTestnet
      : rootstockTestnet;

  const walletClient = createWalletClient({
    account: privateKeyToAccount(serverEnv.PRIVATE_KEY as `0x${string}`),
    transport: http(),
    chain,
  });

  const contract = getContract({
    address: contractAddress, // Already 0x${string} from props
    abi: forehead721ABI, // Use the specific contract ABI
    client: walletClient,
  });

  // Call the correct safeMint function with uri
  const tx = await contract.write.safeMint([to, uri], {
    account: walletClient.account,
    chain,
  });

  const txResult = await waitForTransactionReceipt(walletClient, { hash: tx });

  console.log("Minting Result:", txResult);

  // Find and decode the Transfer event to get the tokenId
  const transferEventSignature = parseAbiItem(
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  );
  // Pre-calculate the signature hash (topic0)
  const transferEventTopic = encodeEventTopics({
    abi: [transferEventSignature],
  })[0];

  let tokenId: number | null = null;

  for (const log of txResult.logs) {
    // Check if the log's topic0 matches the Transfer event signature
    if (log.topics[0] === transferEventTopic) {
      try {
        const decodedLog = decodeEventLog({
          abi: [transferEventSignature],
          data: log.data,
          topics: log.topics,
        });

        if (decodedLog.eventName === "Transfer") {
          // For indexed parameters, we need to get them from topics
          // In ERC-721 Transfer, tokenId is the 3rd topic (index 2 after topic0)
          const tokenIdRaw = log.topics[3];
          if (!tokenIdRaw) {
            throw new Error("Token ID not found in Transfer event log.");
          }
          tokenId = Number(BigInt(tokenIdRaw));
          console.log("Token ID from Transfer event:", tokenId);
          break;
        }
      } catch (e: unknown) {
        console.error(
          "Error decoding Transfer event log:",
          log,
          "Error:",
          e instanceof Error ? e.message : e,
        );
      }
    }
  }

  if (tokenId === null) {
    console.error(
      "Could not find Transfer event in transaction logs.",
      txResult,
    );
    throw new Error("Failed to extract token ID from transaction receipt.");
  }

  return {
    tokenId,
    transactionHash: tx,
  };
};

export const mintItemNft = async (props: {
  contractAddress: `0x${string}`; // Expecting 0x prefixed address
  to: `0x${string}`; // Expecting 0x prefixed address
  uri: string; // Changed from tokenId to uri
  chainId: number;
}) => {
  const { contractAddress, to, uri, chainId } = props; // Updated props

  const chain =
    chainId === flowMainnet.id
      ? flowMainnet
      : chainId === citreaTestnet.id
      ? citreaTestnet
      : rootstockTestnet;

  const walletClient = createWalletClient({
    account: privateKeyToAccount(serverEnv.PRIVATE_KEY as `0x${string}`),
    transport: http(),
    chain,
  });

  const contract = getContract({
    address: contractAddress, // Already 0x${string} from props
    abi: forehead721ABI, // Use the specific contract ABI
    client: walletClient,
  });

  const tx = await contract.write.safeMint([to, uri], {
    account: walletClient.account,
    chain,
  });

  const txResult = await waitForTransactionReceipt(walletClient, { hash: tx });

  console.log("Minting Result:", txResult);

  // Find and decode the Transfer event to get the tokenId
  const transferEventSignature = parseAbiItem(
    "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
  );
  // Pre-calculate the signature hash (topic0)
  const transferEventTopic = encodeEventTopics({
    abi: [transferEventSignature],
  })[0];

  let tokenId: number | null = null;

  for (const log of txResult.logs) {
    // Check if the log's topic0 matches the Transfer event signature
    if (log.topics[0] === transferEventTopic) {
      try {
        const decodedLog = decodeEventLog({
          abi: [transferEventSignature],
          data: log.data,
          topics: log.topics,
        });

        if (decodedLog.eventName === "Transfer") {
          // For indexed parameters, we need to get them from topics
          // In ERC-721 Transfer, tokenId is the 3rd topic (index 2 after topic0)
          const tokenIdRaw = log.topics[3];
          if (!tokenIdRaw) {
            throw new Error("Token ID not found in Transfer event log.");
          }
          tokenId = Number(BigInt(tokenIdRaw));
          console.log("Token ID from Transfer event:", tokenId);
          break;
        }
      } catch (e: unknown) {
        console.error(
          "Error decoding Transfer event log:",
          log,
          "Error:",
          e instanceof Error ? e.message : e,
        );
      }
    }
  }

  if (tokenId === null) {
    console.error(
      "Could not find Transfer event in transaction logs.",
      txResult,
    );
    throw new Error("Failed to extract token ID from transaction receipt.");
  }

  return {
    tokenId,
    transactionHash: tx,
  };
};

export const deployItemNFTCollection = async (props: {
  address: `0x${string}`;
  chainId: number;
}) => {
  const { address, chainId } = props;

  const chain =
    chainId === flowMainnet.id
      ? flowMainnet
      : chainId === citreaTestnet.id
      ? citreaTestnet
      : rootstockTestnet;

  const contractAddress =
    chainId === flowMainnet.id
      ? contractAddresses.flowMainnet
      : chainId === citreaTestnet.id
      ? contractAddresses.citreaTestnet
      : contractAddresses.rootstockTestnet;

  const walletClient = createWalletClient({
    account: privateKeyToAccount(serverEnv.PRIVATE_KEY as `0x${string}`),
    transport: http(),
    chain,
  });

  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const name = `Forehead Items ${shortAddress}`;
  const symbol = `FHI${shortAddress.replace(/\.|0x/g, "")}`;

  const contract = getContract({
    address: contractAddress,
    abi: factoryABI,
    client: walletClient,
  });

  const tx = await contract.write.deployNFTContract([name, symbol], {
    account: walletClient.account,
    chain,
  });
  const receipt = await waitForTransactionReceipt(walletClient, { hash: tx });

  console.log("Item Collection Deployment Receipt:", receipt);

  // Find and decode the NFTContractDeployed event log
  const deployEventSignature = parseAbiItem(
    "event NFTContractDeployed(address indexed contractAddress, address indexed deployer, string name, string symbol)",
  );
  // Pre-calculate the signature hash (topic0)
  const deployEventTopic = encodeEventTopics({
    abi: [deployEventSignature],
  })[0];

  let deployedContractAddress: `0x${string}` | null = null;

  for (const log of receipt.logs) {
    // Check if the log's topic0 matches the event signature BEFORE trying to decode
    if (log.topics[0] === deployEventTopic) {
      try {
        const decodedLog = decodeEventLog({
          abi: [deployEventSignature],
          data: log.data,
          topics: log.topics,
        });

        // Since we matched the topic, we can be more confident it's our event
        if (decodedLog.eventName === "NFTContractDeployed") {
          deployedContractAddress = (
            decodedLog.args as { contractAddress: `0x${string}` }
          ).contractAddress;
          console.log(
            "Deployed Item Contract Address from event:",
            deployedContractAddress,
          );
          break; // Exit loop once found
        }
      } catch (e: unknown) {
        console.error(
          "Error decoding NFTContractDeployed event log:",
          log,
          "Error:",
          e instanceof Error ? e.message : e,
        );
      }
    }
  }

  if (!deployedContractAddress) {
    console.error(
      "Could not find NFTContractDeployed event in transaction logs.",
      receipt,
    );
    throw new Error(
      "Failed to extract deployed item contract address from transaction receipt.",
    );
  }

  return deployedContractAddress;
};
