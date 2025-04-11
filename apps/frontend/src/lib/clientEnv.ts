import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_ELEVEN_LABS_API_KEY: z.string(),
});

// Build an object explicitly with the expected client variables
const envData = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_ELEVEN_LABS_API_KEY: process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY,
};

// Parse the explicitly constructed object
export const clientEnv = clientEnvSchema.parse(envData);

// Optional check (can be useful for debugging)
// if (typeof window === 'undefined') {
//   console.warn("Attempting to parse clientEnv server-side. Ensure NEXT_PUBLIC_ variables are available if needed during SSR/build.");
// }
