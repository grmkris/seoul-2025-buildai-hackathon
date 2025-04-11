import { createServer } from "node:net";
import type { Server } from "node:net";
import type { PGlite } from "@electric-sql/pglite";
import type { Logger } from "logger";
// Note: This import requires 'moduleResolution' to be set to 'node16', 'nodenext', or 'bundler' in tsconfig.json
// Current workaround is to use a direct import path or suppress the error
import { fromNodeSocket } from "pg-gateway/node";

// Define basic auth credential type
interface PasswordCredentials {
	username: string;
	password?: string;
}

export interface PgGatewayServerConfig {
	port: number;
	pgLite: PGlite;
	logger: Logger;
	users: {
		username: string;
		password: string;
	}[];
}

export interface PgGatewayServer {
	server: Server;
	start: () => Promise<void>;
	stop: () => Promise<void>;
}

/**
 * Creates a PG Gateway Server that connects to PGlite
 */
export function createPgGatewayServer(
	config: PgGatewayServerConfig,
): PgGatewayServer {
	const { port, pgLite, logger, users } = config;

	// Create the server
	const server = createServer((socket) => {
		// Handle the Promise properly without returning it directly
		void (async () => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call
			await fromNodeSocket(socket, {
				serverVersion: "16.3 (PGlite 0.2.0)",
				auth: {
					method: "password",
					getClearTextPassword(credentials: PasswordCredentials) {
						// Find matching user by username and return their password
						const foundUser = users.find(
							(u) => u.username === credentials.username,
						);
						return foundUser?.password ?? "invalid-password";
					},
				},
				async onStartup() {
					// Wait for PGlite to be ready before further processing
					await pgLite.waitReady;
				},
				async onMessage(
					data: Uint8Array,
					{ isAuthenticated }: { isAuthenticated: boolean },
				) {
					// Only forward messages to PGlite after authentication
					if (!isAuthenticated) {
						return;
					}

					// Forward raw message to PGlite and send response to client
					try {
						return await pgLite.execProtocolRaw(data);
					} catch (err) {
						logger.error({
							msg: "Error processing PG message",
							error: err,
						});
						// Let the pg-gateway handle the error response
						throw err;
					}
				},
			});
		})();

		socket.on("end", () => {
			logger.debug({ msg: "Client disconnected" });
		});
	});

	return {
		server,

		// Start listening on the specified port
		start: async () => {
			return new Promise<void>((resolve) => {
				server.listen(port, () => {
					logger.debug({ msg: `PGlite server listening on port ${port}` });
					resolve();
				});
			});
		},

		// Stop the server
		stop: async () => {
			return new Promise<void>((resolve) => {
				server
					.close()
					.on("close", () => {
						logger.info({ msg: "PGlite server closed" });
						resolve();
					})
					.on("error", (err) => {
						logger.error({
							msg: "Error closing PGlite server",
							error: err,
						});
						resolve();
					});
			});
		},
	};
}
