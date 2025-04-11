ALTER TABLE "error_logs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "query_flow_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP VIEW "public"."query_flows_view";--> statement-breakpoint
DROP TABLE "error_logs" CASCADE;--> statement-breakpoint
DROP POLICY "workspace_access_policy" ON "query_flow_events" CASCADE;--> statement-breakpoint
DROP POLICY "organization_access_policy" ON "query_flow_events" CASCADE;--> statement-breakpoint
DROP TABLE "query_flow_events" CASCADE;--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_discount_code_discount_codes_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "discount_code";