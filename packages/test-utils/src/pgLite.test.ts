import {
	afterAll,
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
} from "bun:test";
import { env } from "bun";
import { sql } from "drizzle-orm";
import { drizzle as drizzleBunSql } from "drizzle-orm/bun-sql";
import { drizzle as drizzlePgLite } from "drizzle-orm/pglite";
import { LOGGER_LEVELS, createLogger } from "logger";
import { z } from "zod";
import { type PgGatewayServer, createPgGatewayServer } from "./pgGatewayServer";
import { type PGlite, createPgLite } from "./pgLite";

// Define a type for document results
interface DocumentRow {
	id: number;
	title: string;
	content: string;
	workspace_id: number;
	organization_id: number;
	created_at: Date;
}

// Test port for PGlite server
const TEST_PORT = 45375;
// Test database name
const TEST_DB_NAME = "pglite_test";
// Test credentials
const TEST_USER = "postgres";
const TEST_PASSWORD = "postgres";

// Role-based test credentials
const WORKSPACE_VIEWER_USER = "workspace_viewer_user";
const WORKSPACE_VIEWER_PASSWORD = "workspace_viewer_user";

// Define test credentials for organization viewer
const ORG_VIEWER_USER = "organization_viewer_user";
const ORG_VIEWER_PASSWORD = "organization_viewer_user";

const testEnvSchema = z.object({
	LOG_LEVEL: z.enum(LOGGER_LEVELS).default("info"),
});

const testEnv = testEnvSchema.parse(env);

describe("PGLite tests with Bun and Drizzle and PG Gateway Server", () => {
	const logger = createLogger({
		name: "pgLiteRowLevelSecurity",
		level: testEnv.LOG_LEVEL,
	});

	// Helper function to create and populate secure documents table
	async function createSecureDocumentsTable(db: PGlite) {
		logger.info("Creating secure_documents table...");

		// Create our test table for secure documents with RLS
		await db.query(`
			CREATE TABLE IF NOT EXISTS secure_documents (
				id SERIAL PRIMARY KEY,
				title TEXT NOT NULL,
				content TEXT NOT NULL,
				workspace_id INTEGER NOT NULL,
				organization_id INTEGER NOT NULL,
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)
		`);

		// Insert test data
		await db.query(`
			INSERT INTO secure_documents (title, content, workspace_id, organization_id) VALUES
			('Public Doc', 'This is public content', 1, 1),
			('Private Doc', 'This is private content', 1, 1),
			('Top Secret', 'This is top secret content', 1, 1),
			('Workspace 2 Doc', 'This is for workspace 2', 2, 1)
		`);
	}

	// Helper functions for RLS configuration
	async function configureWorkspaceRLS(db: PGlite) {
		logger.info("Configuring Workspace Row Level Security...");

		// Create roles and permissions
		await db.query("CREATE ROLE workspace_viewer WITH CREATEROLE;");

		// Enable RLS on the table
		await db.query("ALTER TABLE secure_documents ENABLE ROW LEVEL SECURITY;");

		// Create a permissive policy for workspace filtering
		await db.query(`
			CREATE POLICY workspace_filter ON secure_documents
			AS PERMISSIVE FOR SELECT
			TO workspace_viewer
			USING (workspace_id = current_setting('app.workspace_id')::integer);
		`);

		// Grant permissions
		await db.query("GRANT SELECT ON secure_documents TO workspace_viewer;");

		// Create user with role
		await db.query(
			"CREATE USER workspace_viewer_user WITH PASSWORD 'workspace_viewer_user';",
		);
		await db.query("GRANT workspace_viewer TO workspace_viewer_user;");
	}

	async function configureOrganizationRLS(db: PGlite) {
		logger.info("Configuring Organization Row Level Security...");

		// Create organization_viewer role if not exists
		await db.query(`
			DO $$
			BEGIN
				IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'organization_viewer') THEN
					CREATE ROLE organization_viewer WITH CREATEROLE;
				END IF;
			END
			$$;
		`);

		// Create user with role
		await db.query(`
			DO $$
			BEGIN
				IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'organization_viewer_user') THEN
					CREATE USER organization_viewer_user WITH PASSWORD 'organization_viewer_user';
					GRANT organization_viewer TO organization_viewer_user;
				END IF;
			END
			$$;
		`);

		// Set role to postgres to ensure we have ownership permissions
		await db.query("SET ROLE postgres;");

		// Grant permissions
		await db.query("GRANT SELECT ON secure_documents TO organization_viewer;");

		// Add organization policy to secure_documents
		await db.query(`
			DO $$
			BEGIN
				IF NOT EXISTS (
					SELECT FROM pg_policies 
					WHERE tablename = 'secure_documents' AND policyname = 'organization_filter'
				) THEN
					CREATE POLICY organization_filter ON secure_documents
					AS PERMISSIVE FOR SELECT
					TO organization_viewer
					USING (organization_id = current_setting('app.organization_id')::integer);
				END IF;
			END
			$$;
		`);
	}

	let db: PGlite;
	let pgGatewayServer: PgGatewayServer;

	// Set up the PGlite server before all tests
	beforeEach(async () => {
		// Initialize PGlite
		db = createPgLite({ fresh: true });

		// Wait for PGlite to be ready
		await db.waitReady;

		// Create and start the PG Gateway server
		pgGatewayServer = createPgGatewayServer({
			port: TEST_PORT,
			pgLite: db,
			logger,
			users: [
				{ username: TEST_USER, password: TEST_PASSWORD },
				{
					username: WORKSPACE_VIEWER_USER,
					password: WORKSPACE_VIEWER_PASSWORD,
				},
				{
					username: ORG_VIEWER_USER,
					password: ORG_VIEWER_PASSWORD,
				},
			],
		});

		// Start the server
		await pgGatewayServer.start();
		logger.info("PGlite server listening");
	});

	afterEach(() => {
		if (pgGatewayServer) {
			pgGatewayServer.stop();
		}
		if (db) {
			db.close();
		}
	});

	// Clean up after all tests
	afterAll(() => {
		if (pgGatewayServer) {
			pgGatewayServer.stop();
		}
	});

	it("should enforce workspace isolation", async () => {
		// Create and populate the secure documents table
		await createSecureDocumentsTable(db);

		// Configure Workspace RLS
		await configureWorkspaceRLS(db);

		// Check users with BYPASSRLS privilege
		const bypassRlsUsersResult = await db.exec(`
			BEGIN;
			-- Need to be a superuser to check role attributes
			SET ROLE postgres; -- or another superuser role you have
		
			-- Query for all roles with BYPASSRLS attribute
			SELECT rolname, rolbypassrls 
			FROM pg_roles 
			WHERE rolbypassrls = true;
		
			COMMIT;
		`);
		logger.debug({
			msg: "Users with BYPASSRLS privilege",
			bypassRlsUsersResult,
		});

		// First, verify we can see all documents from superuser context
		const allDocsResultRaw = await db.exec(`
			BEGIN;
			SET ROLE postgres; -- Superuser has BYPASSRLS by default
			SELECT * FROM secure_documents ORDER BY id;
			COMMIT;
		`);

		logger.debug({ msg: "allDocsResultRaw", allDocsResultRaw });

		// Cast result to proper array type, get the 3rd row (index 2)
		const allDocsResult = allDocsResultRaw[2].rows as unknown as DocumentRow[];

		// Should see all documents from all workspaces
		expect(allDocsResult).toBeTruthy();
		expect(Array.isArray(allDocsResult)).toBe(true);
		expect(allDocsResult.length).toBe(4); // All documents should be visible to superuser

		// Test changing roles within a transaction for workspace 1
		const workspace1ResultRaw = await db.exec(`
			BEGIN;
			SET ROLE workspace_viewer;
			SET app.workspace_id = '1';
			SELECT * FROM secure_documents ORDER BY id;
			COMMIT;
		`);

		// Cast result to proper array type, get the 4th row (index 3)
		const workspace1Result = workspace1ResultRaw[3]
			.rows as unknown as DocumentRow[];

		// Should only see documents from workspace 1
		expect(workspace1Result).toBeTruthy();
		expect(Array.isArray(workspace1Result)).toBe(true);
		expect(workspace1Result.length).toBe(3); // All 3 docs from workspace 1

		// Test seeing documents from workspace 2
		const workspace2ResultRaw = await db.exec(`
			BEGIN;
			SET ROLE workspace_viewer;
			SET app.workspace_id = '2';
			SELECT * FROM secure_documents ORDER BY id;
			COMMIT;
		`);

		// Cast result to proper array type, get the 4th row (index 3)
		const workspace2Result = workspace2ResultRaw[3]
			.rows as unknown as DocumentRow[];

		// Should only see documents from workspace 2
		expect(workspace2Result).toBeTruthy();
		expect(Array.isArray(workspace2Result)).toBe(true);
		expect(workspace2Result.length).toBe(1); // single doc from workspace 2
		logger.debug({ msg: "workspace2Result", workspace2Result });

		// Test attempting to access without setting workspace_id (should return empty set)
		const noWorkspaceResultRaw = await db.exec(`
			BEGIN;
			SET ROLE workspace_viewer;
			-- Intentionally not setting app.workspace_id
			SELECT * FROM secure_documents;
			COMMIT;
		`);

		// Cast result to proper array type, get the 4th row (index 3)
		const noWorkspaceResult = noWorkspaceResultRaw[3]
			.rows as unknown as DocumentRow[];

		// Should get empty result since no workspace is set
		expect(noWorkspaceResult).toBeTruthy();
		expect(Array.isArray(noWorkspaceResult)).toBe(true);
		expect(noWorkspaceResult.length).toBe(0); // No documents should be visible without workspace_id
	});

	it("should enforce organization isolation", async () => {
		// Create and populate the secure documents table
		await createSecureDocumentsTable(db);

		// Create Workspace RLS
		await configureWorkspaceRLS(db);

		// Create Organization RLS
		await configureOrganizationRLS(db);

		// Add another document with a different organization_id
		await db.query(`
			INSERT INTO secure_documents (title, content, workspace_id, organization_id) 
			VALUES ('Org 2 Doc', 'This is for organization 2', 3, 2)
			ON CONFLICT (id) DO NOTHING;
		`);

		// Test organization_id = 1
		const org1ResultRaw = await db.exec(`
			BEGIN;
			SET ROLE organization_viewer;
			SET app.organization_id = '1';
			SELECT * FROM secure_documents ORDER BY id;
			COMMIT;
		`);

		// Cast result to proper array type, get the 4th row (index 3)
		const org1Result = org1ResultRaw[3].rows as unknown as DocumentRow[];

		// Should see only documents from organization 1
		expect(org1Result).toBeTruthy();
		expect(Array.isArray(org1Result)).toBe(true);
		expect(org1Result.length).toBe(4); // All 4 docs from organizationId=1
		logger.debug({ msg: "org1Result", org1Result });

		// Test organization_id = 2
		const org2ResultRaw = await db.exec(`
			BEGIN;
			SET ROLE organization_viewer;
			SET app.organization_id = '2';
			SELECT * FROM secure_documents ORDER BY id;
      SET app.organization_id = '919919191';
			COMMIT;
		`);

		// Cast result to proper array type, get the 4th row (index 3)
		const org2Result = org2ResultRaw[3].rows as unknown as DocumentRow[];

		// Should only see documents from organization 2
		expect(org2Result).toBeTruthy();
		expect(Array.isArray(org2Result)).toBe(true);
		expect(org2Result.length).toBe(1); // Only 1 doc from organization 2
		expect(org2Result[0].title).toBe("Org 2 Doc");

		// Test without setting organization_id
		const noOrgResultRaw = await db.exec(`
			BEGIN;
			SET ROLE organization_viewer;
			-- Intentionally not setting app.organization_id
			SELECT * FROM secure_documents;
			COMMIT;
		`);

		// Cast result to proper array type, get the 4th row (index 3)
		const noOrgResult = noOrgResultRaw[2].rows as unknown as DocumentRow[];

		// Should get empty result since no organization is set
		expect(noOrgResult).toBeTruthy();
		expect(Array.isArray(noOrgResult)).toBe(true);
		logger.debug({ msg: "noOrgResult", noOrgResult });
		expect(noOrgResult.length).toBe(0); // No documents should be visible without organization_id
		logger.info("✅ Organization isolation test completed successfully");
	});

	it("should allow connecting to PG Lite using Drizzle", async () => {
		const logger = createLogger({
			name: "drizzleConnectionTest",
			level: "info",
		});
		logger.info("🧪 Testing connection to PG Lite using Drizzle...");

		// Create a drizzle instance connected to our PG Lite database
		const drizzleDb = drizzlePgLite(db);

		// Execute a simple query to verify connection
		const result = await drizzleDb.execute(sql`SELECT 1 AS test`);

		// Verify that we got a result back
		expect(result).toBeTruthy();
		// Results might be structured differently, so we check the content safely
		if (Array.isArray(result)) {
			expect(result.length).toBeGreaterThan(0);
			expect(result[0]?.test).toBe(1);
		} else {
			expect(result).toHaveProperty("rows");
			expect((result as { rows: unknown[] }).rows).toBeTruthy();
		}

		logger.info("✅ Successfully connected to PG Lite using Drizzle");
	});

	it("should allow connecting to PG Gateway Server using BUN SQL", async () => {
		const logger = createLogger({
			name: "bunPgConnectionTest",
			level: "info",
		});
		logger.info("🧪 Testing connection to PG Gateway Server using BUN SQL...");

		// Connection string for PG Gateway Server
		const connectionString = `postgres://${WORKSPACE_VIEWER_USER}:${WORKSPACE_VIEWER_PASSWORD}@localhost:${TEST_PORT}/${TEST_DB_NAME}`;

		// Create a drizzle instance connected to PG Gateway Server
		const bunPgDb = drizzleBunSql(connectionString);

		// Execute a simple query to verify connection
		const result = await bunPgDb.execute(sql`SELECT 1 AS test`);

		// Verify that we got a result back
		expect(result).toBeTruthy();
		// Results might be structured differently, so we check the content safely
		if (Array.isArray(result)) {
			expect(result.length).toBeGreaterThan(0);
			expect(result[0]?.test).toBe(1);
		} else {
			expect(result).toHaveProperty("rows");
			expect((result as { rows: unknown[] }).rows).toBeTruthy();
		}

		logger.info("✅ Successfully connected to PG Gateway Server using BUN SQL");
	});
});
