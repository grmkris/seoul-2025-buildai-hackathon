CREATE TYPE "public"."conversation_item_content_type" AS ENUM('json');--> statement-breakpoint
CREATE TYPE "public"."conversation_item_creator" AS ENUM('user', 'assistant');--> statement-breakpoint
CREATE TABLE "conversation_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"content_type" "conversation_item_content_type" NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversation_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conversation_items" ADD CONSTRAINT "conversation_items_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_items" ADD CONSTRAINT "conversation_items_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_items" ADD CONSTRAINT "conversation_items_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_items" ADD CONSTRAINT "conversation_items_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "storage_item_content_type_idx" ON "conversation_items" USING btree ("content_type");--> statement-breakpoint
CREATE INDEX "storage_item_name_idx" ON "conversation_items" USING btree ("name");--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "conversation_items" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "conversation_items" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));