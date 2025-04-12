import { hc } from "hono/client";
import { SERVICE_URLS } from "service-registry";
import { clientEnv } from "./clientEnv";
import type { publicRoutes } from "./publicRoutes";

export const apiClient = hc<typeof publicRoutes>(
  `${SERVICE_URLS[clientEnv.NEXT_PUBLIC_ENV].api}/api`,
);


export type ApiClient = typeof apiClient;