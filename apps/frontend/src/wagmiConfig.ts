// config/index.tsx

import { cookieStorage, createStorage } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  flowMainnet,
  citreaTestnet,
  rootstockTestnet,
} from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "f79c0744d4d8e18650537565886b52ab";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [flowMainnet, citreaTestnet, rootstockTestnet];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
