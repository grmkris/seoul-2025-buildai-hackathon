import type { Message } from "@ai-sdk/react";
import { useProgression, useUserInfo } from "@/lib/chatHooks";
import { useAccount, useChainId } from "wagmi";
import Image from "next/image";
import {
  ToolName2LevelMap,
  type Level1SheetSchema,
  type LevelSchema,
} from "@/server/db/chat/chat.db";
import { AgentLevel } from "@/server/db/chat/chat.zod";
import { flowMainnet, citreaTestnet, rootstockTestnet } from "viem/chains";

// Helper function to get explorer URL based on chain ID
const getExplorerUrl = (chainId: number, hash: string, type: 'tx' | 'address'): string => {
  if (chainId === flowMainnet.id) {
    return `https://evm.flowscan.io/${type}/${hash}`;
  }
  if (chainId === citreaTestnet.id) {
    return `https://explorer.testnet.citrea.xyz/${type}/${hash}`;
  }
  if (chainId === rootstockTestnet.id) {
    return `https://explorer.testnet.rsk.co/${type}/${hash}`;
  }
  // Default fallback
  return `https://evm.flowscan.io/${type}/${hash}`;
};

export const LevelCompletedToolRenderer = (props: {
  toolInvocation: Extract<
    NonNullable<Message["parts"]>[number],
    { type: "tool-invocation" }
  >;
}) => {
  const account = useAccount();
  const chainId = useChainId();
  const { data: userInfo } = useUserInfo({ address: account.address });
  const gameLevel = AgentLevel.optional().parse(
    props.toolInvocation?.toolInvocation?.state === "result"
      ? props.toolInvocation?.toolInvocation?.result?.level
      : undefined,
  );
  const level = gameLevel ? ToolName2LevelMap[gameLevel] : undefined;
  const levelIndex =
    props.toolInvocation?.toolInvocation?.state === "result"
      ? props.toolInvocation?.toolInvocation?.result?.levelIndex
      : undefined;
  console.log("qweqweqwe levelIndex", { levelIndex, level });
  const { data: progression } = useProgression({
    address: account.address,
    level: level,
    index: levelIndex,
  });
  console.log("qweqweqwe", { tool: props.toolInvocation, progression });
  const state = props.toolInvocation.toolInvocation.state;

  console.log("qweqweqwe state toolName: ", {
    toolName: props.toolInvocation.toolInvocation.toolName,
    state,
  });

  // Handle different states of the tool invocation
  if (state === "call") {
    return (
      <div className="mt-2 p-4 border rounded-md bg-muted/50 shadow">
        Initializing...
      </div>
    );
  }

  if (state === "partial-call") {
    return (
      <div className="mt-2 p-4 border rounded-md bg-muted/50 shadow">
        Processing...
      </div>
    );
  }

  // Only proceed with full rendering when state is "result"
  if (state === "result") {
    console.log("qqqqqq", props.toolInvocation);

    switch (progression?.[0]?.data.level) {
      case "pic":
        return (
          <Level1PictureRenderer
            imagebase64={progression?.[0]?.data.image}
            tokenId={progression?.[0]?.data.tokenId}
            nftContractAddress={userInfo?.nftContractAddress ?? null}
            chainId={chainId}
          />
        );
      case "sheet":
        return <Level1SheetRenderer sheet={progression?.[0]?.data} />;
      case "level":
        return (
          <LevelRenderer level={progression?.[0]?.data} chainId={chainId} />
        );
    }
  }

  // Fallback for any unexpected state
  console.log("qweqweqwe state toolName fallback: ", {
    toolName: props.toolInvocation.toolInvocation.toolName,
    state,
  });
  return (
    <div className="mt-2 p-4 border rounded-md bg-muted/50 shadow">
      Waiting for result...
    </div>
  );
};

/**
 * base64 image renderer
 * @param props
 * @returns
 */
const Level1PictureRenderer = (props: {
  imagebase64: string;
  tokenId: number | null;
  nftContractAddress: string | null;
  chainId: number;
}) => {
  const imageSrc = `data:image/png;base64,${props.imagebase64}`;
  console.log("props.nftContractAddress", props);

  const openSeaUrl =
    props.nftContractAddress && props.tokenId !== null
      ? `https://opensea.io/item/flow/${props.nftContractAddress}/${props.tokenId}`
      : null;

  return (
    <div className="mt-2 p-4 border rounded-md bg-muted/50 shadow flex flex-col items-center gap-2">
      {openSeaUrl ? (
        <a
          href={openSeaUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="View on OpenSea"
        >
          <Image
            src={imageSrc}
            alt="Level 1 Picture NFT"
            width={100}
            height={100}
            className="rounded"
          />
        </a>
      ) : (
        <Image
          src={imageSrc}
          alt="Level 1 Picture"
          width={100}
          height={100}
          className="rounded"
        />
      )}
      {props.tokenId !== null && (
        <p className="text-xs">Token ID: {props.tokenId}</p>
      )}
      {props.nftContractAddress && (
        <a
          href={getExplorerUrl(props.chainId, props.nftContractAddress, 'address')}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs truncate max-w-[150px] text-primary hover:underline"
          title={props.nftContractAddress}
        >
          Contract: {props.nftContractAddress.slice(0, 10)}...
        </a>
      )}
    </div>
  );
};

/**
 * level 1 sheet renderer
 * @param props
 * @returns
 */
const Level1SheetRenderer = (props: { sheet: Level1SheetSchema }) => {
  const { character, attributes } = props.sheet.characterSheet;
  const attributeEntries = Object.entries(attributes);

  return (
    <div className="mt-2 p-4 border rounded-md bg-muted/50 shadow">
      <h3 className="text-lg font-semibold mb-2 border-b pb-1">
        {character.name} - {character.race} {character.class} (Level{" "}
        {character.level})
      </h3>
      <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
        {attributeEntries.map(([key, value]) => (
          <div key={key} className="flex justify-between">
            <span className="font-medium capitalize">
              {key.substring(0, 3)}:
            </span>
            <span>{value}</span>
          </div>
        ))}
      </div>
      {/* Add more sections for status, proficiencies, etc. as needed */}
    </div>
  );
};

const LevelRenderer = (props: { level: LevelSchema; chainId: number }) => {
  const { characterSheet, items, levelSummary, levelIndex } = props.level;
  const { character, attributes } = characterSheet;
  const attributeEntries = Object.entries(attributes);

  return (
    <div className="mt-2 p-4 border rounded-md bg-muted/50 shadow">
      {/* Level Summary */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">
          Level {levelIndex} Completed
        </h3>
        <p className="text-sm">{levelSummary}</p>
      </div>

      {/* Character Stats */}
      <div className="mb-4">
        <h4 className="text-md font-medium mb-2 border-b pb-1">
          {character.name} - {character.race} {character.class} (Level{" "}
          {character.level})
        </h4>
        <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
          {attributeEntries.map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium capitalize">
                {key.substring(0, 3)}:
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items */}
      {items && items.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-medium mb-2 border-b pb-1">
            Items Earned
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.name}
                className="border rounded-md p-3 bg-background/50 flex flex-col items-center"
              >
                {item.image && (
                  <Image
                    src={`data:image/png;base64,${item.image}`}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded mb-2"
                  />
                )}
                <h5 className="font-medium text-sm">{item.name}</h5>
                <p className="text-xs text-center text-muted-foreground">
                  {item.description}
                </p>
                {item.tokenId !== null && (
                  <p className="text-xs mt-1">Token ID: {item.tokenId}</p>
                )}
                {item.contractAddress && item.tokenId !== null && (
                  <a
                    href={`https://opensea.io/item/flow/${item.contractAddress}/${item.tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary mt-1 hover:underline"
                    title="View on OpenSea"
                  >
                    View on OpenSea
                  </a>
                )}
                {item.transactionHash && (
                  <a
                    href={getExplorerUrl(props.chainId, item.transactionHash, 'tx')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary mt-1 hover:underline"
                    title="View transaction on block explorer"
                  >
                    View Transaction
                  </a>
                )}
                {item.contractAddress && (
                  <a
                    href={getExplorerUrl(props.chainId, item.contractAddress, 'address')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary mt-1 hover:underline"
                    title="View contract on block explorer"
                  >
                    View Contract
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
