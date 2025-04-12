ALTER TABLE "payment_intents" DROP CONSTRAINT "payment_intents_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "payment_intents" ADD CONSTRAINT "payment_intents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;