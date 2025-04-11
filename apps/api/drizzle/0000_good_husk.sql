CREATE SCHEMA "audit";
--> statement-breakpoint
CREATE TYPE "public"."document_status" AS ENUM('CREATED', 'UPLOADED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('taskforce_time_entry');--> statement-breakpoint
CREATE ROLE "organization_viewer" WITH CREATEROLE;--> statement-breakpoint
CREATE ROLE "workspace_viewer" WITH CREATEROLE;--> statement-breakpoint
CREATE TABLE "audit"."record_version" (
	"id" serial PRIMARY KEY NOT NULL,
	"record_id" text,
	"old_record_id" text,
	"op" text,
	"ts" timestamp with time zone DEFAULT now() NOT NULL,
	"table_oid" integer NOT NULL,
	"table_schema" text NOT NULL,
	"table_name" text NOT NULL,
	"record" jsonb,
	"old_record" jsonb
);
--> statement-breakpoint
CREATE TABLE "error_logs" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" varchar(255) NOT NULL,
	"error" jsonb NOT NULL,
	"error_type" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50),
	"email" varchar(100),
	"phone" varchar(50),
	"address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "discount_codes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"code" varchar(50) NOT NULL,
	"discount_type" text NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"expires_at" timestamp with time zone,
	"max_uses" integer,
	"current_uses" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL,
	CONSTRAINT "discount_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "discount_codes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"item_id" varchar(255) NOT NULL,
	"available_quantity" numeric(10, 2) NOT NULL,
	"reserved_quantity" numeric(10, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "inventory_movement" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"inventory_id" varchar(255) NOT NULL,
	"item_id" varchar(255) NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"type" text NOT NULL,
	"reference_id" varchar(255),
	"note" text,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_movement" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"unit_of_measure" varchar(20) NOT NULL,
	"price_per_unit" numeric(10, 2) NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"image_url" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "notes" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"order_id" varchar(255),
	"customer_id" varchar(255),
	"content" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"order_id" varchar(255) NOT NULL,
	"item_id" varchar(255) NOT NULL,
	"quantity" numeric(10, 2) NOT NULL,
	"price_per_unit" numeric(10, 2) NOT NULL,
	"discount_type" text,
	"discount_value" numeric(10, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "order_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"customer_id" varchar(255) NOT NULL,
	"order_date" timestamp with time zone DEFAULT now() NOT NULL,
	"status" text NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"calculated_discount_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"discount_type" text,
	"discount_code" varchar(50),
	"assignee_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "workspaces" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "workspaces" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "account" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "apikey" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text,
	"start" text,
	"prefix" text,
	"key" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"refill_interval" integer,
	"refill_amount" integer,
	"last_refill_at" timestamp with time zone,
	"enabled" boolean,
	"rate_limit_enabled" boolean,
	"rate_limit_time_window" integer,
	"rate_limit_max" integer,
	"request_count" integer,
	"remaining" integer,
	"last_request" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"permissions" text,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "invitation" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"inviter_id" varchar(255) NOT NULL,
	"team_id" text
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"role" text NOT NULL,
	"team_id" text,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp with time zone NOT NULL,
	"metadata" text,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text,
	"public_key" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"credential_i_d" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" varchar(255) NOT NULL,
	"impersonated_by" varchar(255),
	"active_organization_id" varchar(255),
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_anonymous" boolean,
	"username" text,
	"display_username" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "documents_to_time_entries" (
	"documentId" varchar(255),
	"timeEntryId" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents_to_time_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "task_assignments" (
	"taskId" varchar(255) NOT NULL,
	"memberId" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL,
	CONSTRAINT "task_assignments_taskId_memberId_pk" PRIMARY KEY("taskId","memberId")
);
--> statement-breakpoint
ALTER TABLE "task_assignments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" text DEFAULT 'CREATED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "time_entries" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"taskId" varchar(255) NOT NULL,
	"description" text,
	"start_time" timestamp with time zone,
	"end_time" timestamp with time zone,
	"status" text DEFAULT 'DRAFT' NOT NULL,
	"approvedBy" varchar(255),
	"memberId" varchar(255) NOT NULL,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "time_entries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "documents" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"type" "document_type" NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"s3Key" varchar(1024) NOT NULL,
	"s3Bucket" varchar(255) NOT NULL,
	"mimeType" varchar(255) NOT NULL,
	"sizeBytes" varchar(255) NOT NULL,
	"status" "document_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "conversations" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(255) NOT NULL,
	"message" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar(255) NOT NULL,
	"updated_by" varchar(255) NOT NULL,
	"workspace_id" varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "query_flow_events" (
	"id" text PRIMARY KEY NOT NULL,
	"execution_id" text NOT NULL,
	"workspace_id" varchar(255) NOT NULL,
	"organization_id" varchar(255) NOT NULL,
	"event_type" text NOT NULL,
	"timestamp" timestamp with time zone DEFAULT now() NOT NULL,
	"event_data" jsonb NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "query_flow_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customers" ADD CONSTRAINT "customers_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discount_codes" ADD CONSTRAINT "discount_codes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_inventory_id_inventory_id_fk" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_movement" ADD CONSTRAINT "inventory_movement_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "items" ADD CONSTRAINT "items_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notes" ADD CONSTRAINT "notes_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_discount_code_discount_codes_id_fk" FOREIGN KEY ("discount_code") REFERENCES "public"."discount_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_assignee_id_member_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apikey" ADD CONSTRAINT "apikey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents_to_time_entries" ADD CONSTRAINT "documents_to_time_entries_documentId_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents_to_time_entries" ADD CONSTRAINT "documents_to_time_entries_timeEntryId_time_entries_id_fk" FOREIGN KEY ("timeEntryId") REFERENCES "public"."time_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents_to_time_entries" ADD CONSTRAINT "documents_to_time_entries_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents_to_time_entries" ADD CONSTRAINT "documents_to_time_entries_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents_to_time_entries" ADD CONSTRAINT "documents_to_time_entries_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_taskId_tasks_id_fk" FOREIGN KEY ("taskId") REFERENCES "public"."tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_approvedBy_member_id_fk" FOREIGN KEY ("approvedBy") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_memberId_member_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_entries" ADD CONSTRAINT "time_entries_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_created_by_member_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_updated_by_member_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "query_flow_events" ADD CONSTRAINT "query_flow_events_workspace_id_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "query_flow_events" ADD CONSTRAINT "query_flow_events_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "record_version_ts" ON "audit"."record_version" USING brin ("ts");--> statement-breakpoint
CREATE INDEX "record_version_table_oid" ON "audit"."record_version" USING btree ("table_oid");--> statement-breakpoint
CREATE INDEX "record_version_record_id" ON "audit"."record_version" USING btree ("record_id");--> statement-breakpoint
CREATE INDEX "record_version_old_record_id" ON "audit"."record_version" USING btree ("old_record_id");--> statement-breakpoint
CREATE INDEX "workspaces_organization_id_index" ON "workspaces" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "documents_to_time_entries_workspace_id_index" ON "documents_to_time_entries" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "task_assignments_workspace_id_index" ON "task_assignments" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "tasks_workspace_id_index" ON "tasks" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "time_entries_workspace_id_index" ON "time_entries" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "message_conversation_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "query_flow_events_execution_id_idx" ON "query_flow_events" USING btree ("execution_id");--> statement-breakpoint
CREATE INDEX "query_flow_events_workspace_id_idx" ON "query_flow_events" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "query_flow_events_event_type_idx" ON "query_flow_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "query_flow_events_timestamp_idx" ON "query_flow_events" USING btree ("timestamp");--> statement-breakpoint
CREATE VIEW "public"."query_flows_view" AS (select "execution_id", "workspace_id", "organization_id", 
        CASE 
          WHEN bool_or("event_type" = 'flow_completed') THEN 'completed'
          WHEN bool_or("event_type" = 'flow_failed') THEN 'failed'
          ELSE 'in_progress'
        END
       as "status", MAX(CASE WHEN "event_type" = 'flow_started' THEN ("event_data"->>'userQuery')::text END) as "user_query", MAX(CASE WHEN "event_type" = 'flow_completed' THEN ("event_data"->>'generatedSql')::text END) as "generated_sql", MAX(CASE WHEN "event_type" = 'flow_completed' THEN ("event_data"->>'returnSchema')::text END) as "return_schema", MIN(CASE WHEN "event_type" = 'flow_started' THEN "timestamp" END) as "started_at", MAX(CASE WHEN "event_type" IN ('flow_completed', 'flow_failed') THEN "timestamp" END) as "completed_at", SUM(("event_data"->>'tokensUsed')::integer) as "total_tokens_used", SUM(("event_data"->>'durationMs')::integer) as "total_duration_ms", (array_agg("metadata" ORDER BY "timestamp" DESC))[1] as "metadata", (array_agg(
          CASE WHEN "event_type" = 'flow_failed' 
          THEN "event_data" 
          ELSE NULL 
          END
          ORDER BY "timestamp" DESC
        ))[1] as "error", MIN("created_at") as "created_at" from "query_flow_events" group by "query_flow_events"."execution_id", "query_flow_events"."workspace_id", "query_flow_events"."organization_id");--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "customers" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "customers" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "discount_codes" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "discount_codes" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "inventory" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "inventory" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "inventory_movement" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "inventory_movement" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "items" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "items" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "notes" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "notes" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "order_items" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "order_items" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "orders" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "orders" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "workspaces" AS PERMISSIVE FOR ALL TO "organization_viewer" USING (current_setting('app.organization_id')::varchar = "organization_id");--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "documents_to_time_entries" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "documents_to_time_entries" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "task_assignments" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "task_assignments" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "tasks" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "tasks" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "time_entries" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "time_entries" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "documents" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "documents" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "conversations" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "conversations" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "messages" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "messages" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "workspace_access_policy" ON "query_flow_events" AS PERMISSIVE FOR SELECT TO "workspace_viewer" USING (current_setting('app.workspace_id')::varchar = "workspace_id" AND EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));--> statement-breakpoint
CREATE POLICY "organization_access_policy" ON "query_flow_events" AS PERMISSIVE FOR SELECT TO "organization_viewer" USING (EXISTS (
        SELECT 1 
        FROM "workspaces" w
        WHERE w."id" = "workspace_id" 
        AND w."organization_id" = current_setting('app.organization_id')::varchar
        LIMIT 1
      ));