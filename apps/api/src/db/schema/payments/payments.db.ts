import {
  bigint,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { conversations } from "../chat/chat.db";
import { typeId } from "../utils.db";
import { typeIdGenerator, type PaymentIntentId } from "typeid";
import type { SignedTransferIntent } from "commerce-sdk";
import { customersTable } from "../customers/customers.db";

// @ts-expect-error BigInt is not serializable by default, so we need to override the toJSON method
BigInt.prototype.toJSON = function () {
  return this.toString();
};

export const paymentIntentStatusEnum = pgEnum("payment_intent_status", [
  "pending",
  "completed",
  "failed",
  "expired",
]);

export const paymentIntents = pgTable("payment_intents", {
  id: typeId("paymentIntent", "id")
    .primaryKey()
    .$defaultFn(() => typeIdGenerator("paymentIntent"))
    .$type<PaymentIntentId>(),
  intentId: varchar("intent_id", { length: 66 }).unique().notNull(),
  conversationId: typeId("conversation", "conversation_id")
    .references(() => conversations.id, { onDelete: "cascade" })
    .notNull(),
  customerId: typeId("customer", "customer_id")
    .references(() => customersTable.id, { onDelete: "cascade" })
    .notNull(),
  status: paymentIntentStatusEnum("status").default("pending").notNull(),
  amount: bigint("amount", { mode: "bigint" }).notNull(),
  currencyAddress: varchar("currency_address", { length: 42 }).notNull(),
  reason: text("reason"),
  signedIntentData: jsonb("signed_intent_data")
    .notNull()
    .$type<SignedTransferIntent>(),
  deadline: timestamp("deadline", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
