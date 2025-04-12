import { hc } from "hono/client";
import { SERVICE_URLS } from "service-registry";
import { clientEnv } from "./clientEnv";
import type { publicRoutes } from "./publicRoutes";

export const publicClient = hc<typeof publicRoutes>(
  `${SERVICE_URLS[clientEnv.NEXT_PUBLIC_ENV].api}/api`,
  {
    init: {
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
);


export type PublicClient = typeof publicClient;