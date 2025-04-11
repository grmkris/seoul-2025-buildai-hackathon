import { clientEnvs } from "@/env/clientEnvs";
import { apiKeyClient, usernameClient } from "better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins";
import { anonymousClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { SERVICE_URLS } from "service-registry";

export const authClient = createAuthClient({
  baseURL: SERVICE_URLS[clientEnvs.NEXT_PUBLIC_ENV].auth,
  plugins: [
    organizationClient(),
    passkeyClient(),
    anonymousClient(),
    usernameClient(),
    apiKeyClient(),
  ],
});
