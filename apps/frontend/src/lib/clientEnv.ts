import { ENVIRONMENTS } from "service-registry";
import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_ELEVEN_LABS_API_KEY: z.string(),
  NEXT_PUBLIC_ENV: z.enum(ENVIRONMENTS),
  NEXT_PUBLIC_TRANSFERS_CONTRACT_ADDRESS: z.string(),
  NEXT_PUBLIC_RPC_URL: z.string(),
});

// Build an object explicitly with the expected client variables
const envData = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ELEVEN_LABS_API_KEY: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY,
  NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  NEXT_PUBLIC_TRANSFERS_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_TRANSFERS_CONTRACT_ADDRESS,
  NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
};

// Parse the explicitly constructed object
export const clientEnv = clientEnvSchema.parse(envData);