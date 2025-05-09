import { clientEnvs } from "@/env/clientEnvs";
import { hc } from "hono/client";
import { SERVICE_URLS } from "service-registry";
import type { workspaceRouter } from "./workspaceRoute";
import type { customerRouter } from "./customerRouter";
import type { messageRoutes } from "./messageRoutes";
import type { conversationRoutes } from "./conversationRoutes";
import type { customerConversationRoutes } from "./customerConversationRoutes";

export const workspaceClient = hc<typeof workspaceRouter>(
  `${SERVICE_URLS[clientEnvs.NEXT_PUBLIC_ENV].api}/api`,
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

export const customerClient = hc<typeof customerRouter>(
  `${SERVICE_URLS[clientEnvs.NEXT_PUBLIC_ENV].api}/api`,
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

export const messageClient = hc<typeof messageRoutes>(
  `${SERVICE_URLS[clientEnvs.NEXT_PUBLIC_ENV].api}/api`,
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
  

export const conversationClient = hc<typeof conversationRoutes>(
  `${SERVICE_URLS[clientEnvs.NEXT_PUBLIC_ENV].api}/api`,
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

export const customerConversationClient = hc<typeof customerConversationRoutes>(
  `${SERVICE_URLS[clientEnvs.NEXT_PUBLIC_ENV].api}/api`,
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
