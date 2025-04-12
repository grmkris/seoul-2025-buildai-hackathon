import { z } from "zod";
import { createSelectSchema, createInsertSchema } from "drizzle-zod";
import {
	paymentIntents,
	paymentIntentStatusEnum,
} from "./payments.db";
import {
	PaymentIntentId,
	ConversationId,
	UserId,
} from "typeid"; // Assuming typeid package exports these

// Base schema for selecting data, infers types from the table
export const SelectPaymentIntentSchema = createSelectSchema(paymentIntents, {
	id: PaymentIntentId,
	conversationId: ConversationId,
	userId: UserId,
	status: z.enum(paymentIntentStatusEnum.enumValues),
	amount: z.bigint(),
	currencyAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
	intentId: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid Intent ID format"),
	signedIntentData: z.record(z.string(), z.unknown()), // Basic validation for JSONB, refine if specific structure is known
	deadline: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type SelectPaymentIntent = z.infer<typeof SelectPaymentIntentSchema>;

// Base schema for inserting data
export const InsertPaymentIntentSchema = createInsertSchema(paymentIntents, {
	id: PaymentIntentId.optional(), // Often generated by DB or before insert
	conversationId: ConversationId,
	userId: UserId,
	status: z.enum(paymentIntentStatusEnum.enumValues).optional(), // Handled by DB default
	amount: z.bigint(),
	currencyAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address"),
	intentId: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid Intent ID format"),
	signedIntentData: z.record(z.string(), z.unknown()),
	deadline: z.date(),
	createdAt: z.date().optional(), // Handled by DB default
	updatedAt: z.date().optional(), // Handled by DB default
});

export type InsertPaymentIntent = z.infer<typeof InsertPaymentIntentSchema>;

// You might want a specific schema for updating
export const UpdatePaymentIntentSchema = InsertPaymentIntentSchema.pick({
	status: true,
}).extend({
	updatedAt: z.date().optional(), // Allow updating updatedAt
});

export type UpdatePaymentIntent = z.infer<typeof UpdatePaymentIntentSchema>;
