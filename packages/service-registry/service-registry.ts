import { z } from "zod";

export const ENVIRONMENTS = ["dev", "prod"] as const;

export const Environment = z.enum(ENVIRONMENTS);
export type Environment = z.infer<typeof Environment>;

export const SERVICE_URLS: Record<
	Environment,
	{
		auth: string;
		api: string;
		frontend: string;
		cookieDomain: string;
		ollama: string;
		admin: string;
	}
> = {
	dev: {
		auth: "http://localhost:3001",
		api: "http://localhost:3001",
		admin: "http://localhost:3002",
		frontend: "http://localhost:3000",
		cookieDomain: "localhost",
		ollama: "http://localhost:11434/api",
	},
	prod: {
		auth: "https://zdrava-kosara-backend-production.up.railway.app",
		api: "https://zdrava-kosara-backend-production.up.railway.app",
		frontend: "https://zdrava-kosara-frontend-production.up.railway.app",
		admin: "https://zdrava-kosara-admin-production.up.railway.app",
		cookieDomain: ".zdrava-kosara-backend-production.up.railway.app",
		ollama: "http://localhost:11434/api",
	},
} as const;
