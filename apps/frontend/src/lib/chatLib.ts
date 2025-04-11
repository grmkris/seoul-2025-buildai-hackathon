import type { Message } from "ai";
import { apiClient } from "./apiClient";
import { z } from "zod";
import type { Level } from "@/server/db/chat/chat.db";

export const MessageSchema = z.custom<Omit<Message, "data" | "annotations">>();
export type MessageSchema = z.infer<typeof MessageSchema>;

export const getConversation = async (address: string) => {
  const convo = await apiClient.conversation.$get({
    query: { address },
  });
  if (convo.status !== 200) {
    throw new Error("Failed to get conversation");
  }
  const data = await convo.json();
  return data;
};

export const getProgression = async (
  address: string,
  level: Level,
  index?: number,
) => {
  const progression = await apiClient.progression.$get({
    query: { address, level, levelIndex: index?.toString() },
  });
  if (progression.status !== 200) {
    throw new Error("Failed to get progression");
  }
  const data = await progression.json();
  return data;
};

export const getUserInfo = async (address: string) => {
  const userInfo = await apiClient["user-info"].$get({
    query: { address },
  });
  if (userInfo.status !== 200) {
    throw new Error("Failed to get user info");
  }
  const data = await userInfo.json();
  return data;
};
