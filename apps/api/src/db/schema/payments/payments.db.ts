import {
	bigint,
	pgEnum,
	pgTable,
	text,
	timestamp,
	varchar,
	jsonb,
} from "drizzle-orm/pg-core";
import { user } from "../auth/auth.db";
import { conversations } from "../chat/chat.db";
import { typeId } from "../utils.db";

export const paymentIntentStatusEnum = pgEnum("payment_intent_status", [
	"pending",
	"completed",
	"failed",
	"expired",
]);

export const paymentIntents = pgTable("payment_intents", {
	id: typeId("paymentIntent", "id").primaryKey(),
	intentId: varchar("intent_id", { length: 66 }).unique().notNull(),
	conversationId: typeId("conversation", "conversation_id")
		.references(() => conversations.id, { onDelete: "cascade" })
		.notNull(),
	userId: typeId("user", "user_id")
		.references(() => user.id, { onDelete: "cascade" })
		.notNull(),
	status: paymentIntentStatusEnum("status").default("pending").notNull(),
	amount: bigint("amount", { mode: "bigint" }).notNull(),
	currencyAddress: varchar("currency_address", { length: 42 }).notNull(),
	reason: text("reason"),
	signedIntentData: jsonb("signed_intent_data").notNull(),
	deadline: timestamp("deadline", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
}); 