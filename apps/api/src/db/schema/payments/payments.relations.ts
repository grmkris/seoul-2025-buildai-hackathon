import { relations } from "drizzle-orm";
import { paymentIntents } from "./payments.db";
import { user } from "../auth/auth.db";
import { conversations } from "../chat/chat.db";

export const paymentIntentsRelations = relations(paymentIntents, ({ one }) => ({
	user: one(user, {
		fields: [paymentIntents.userId],
		references: [user.id],
	}),
	conversation: one(conversations, {
		fields: [paymentIntents.conversationId],
		references: [conversations.id],
	}),
})); 