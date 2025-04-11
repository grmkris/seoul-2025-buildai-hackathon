import type { AppType } from "@/server/server";
import { hc } from "hono/client";
import { clientEnv } from "./clientEnv";

export const apiClient = hc<AppType>(clientEnv.NEXT_PUBLIC_API_URL);
