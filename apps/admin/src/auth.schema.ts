import { z } from "zod";

export const sendRegistrationCodeSchema = z.object({
	agree: z.boolean(),
	email: z.string().email(),
	organizationName: z.string().optional(),
});

export type SendRegistrationCode = z.infer<typeof sendRegistrationCodeSchema>;

export const verifySchema = z.object({
	confirmationCode: z.string(),
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters." })
		.max(64, { message: "Password must be at most 64 characters." }),
});

export type Verify = z.infer<typeof verifySchema>;

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1, { message: "Password can not be empty." }),
});

export type Login = z.infer<typeof loginSchema>;

export const ORGANIZATION_ROLES = ["owner", "admin", "member"] as const;
export const OrganizationRole = z.enum(ORGANIZATION_ROLES);
export type OrganizationRole = z.infer<typeof OrganizationRole>;

export const SYSTEM_ROLES = ["admin", "user"] as const;
export const SystemRole = z.enum(SYSTEM_ROLES);
export type SystemRole = z.infer<typeof SystemRole>;
