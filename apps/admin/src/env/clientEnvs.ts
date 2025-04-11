import { createEnv } from "@t3-oss/env-nextjs";
import { Environment } from "service-registry";
import { z } from "zod";

export const clientEnvs = createEnv({
  client: {
    NEXT_PUBLIC_DOMAIN: z.string(),
    NEXT_PUBLIC_ENV: Environment,
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
  emptyStringAsUndefined: true,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});

export type ClientEnvs = typeof clientEnvs;
