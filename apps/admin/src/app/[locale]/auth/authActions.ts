import { authClient } from "@/lib/authClient";
// Auth API endpoints
// Using authClient for authentication-related operations

// Export types for consistent request/response handling
export type CurrentUser = typeof authClient.$Infer.Session;
export type ChangePasswordSchema = Parameters<
  typeof authClient.changePassword
>[0];

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const response = await authClient.getSession();

  if (response.error) {
    throw new Error("Failed to fetch current user");
  }

  return response.data;
};

export const changeUserPassword = async (props: {
  data: ChangePasswordSchema;
}) => {
  const response = await authClient.changePassword({
    currentPassword: props.data.currentPassword,
    newPassword: props.data.newPassword,
  });

  if (response.error) {
    throw new Error("Failed to change user password");
  }

  return response.data;
};

// Email authentication
export const loginWithEmail = async (props: {
  email: string;
  password: string;
}) => {
  try {
    const response = await authClient.signIn.email({
      email: props.email,
      password: props.password,
    });

    if (response?.error) {
      throw new Error(response.error.message || "Failed to sign in with email");
    }

    return response?.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign in with email",
    );
  }
};

// Username authentication
export const loginWithUsername = async (props: {
  username: string;
  password: string;
}) => {
  try {
    const response = await authClient.signIn.username({
      username: props.username,
      password: props.password,
    });

    if (response?.error) {
      throw new Error(
        response.error.message || "Failed to sign in with username",
      );
    }

    return response?.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to sign in with username",
    );
  }
};

// Register with email
export const registerWithEmail = async (props: {
  email: string;
  password: string;
  name: string;
  username?: string; // Make username optional for email registration
}) => {
  try {
    const response = await authClient.signUp.email({
      email: props.email,
      password: props.password,
      name: props.name,
      username: props.username, // Pass username if provided
    });

    if (response?.error) {
      throw new Error(
        response.error.message || "Failed to register with email",
      );
    }

    return response?.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to register with email",
    );
  }
};

// Register with username
export const registerWithUsername = async (props: {
  username: string;
  password: string;
  name: string;
  email?: string; // Make email optional for username registration
}) => {
  try {
    // Use email flow with a generated email based on username
    const generatedEmail = props.email || `${props.username}@generated.user`;

    const response = await authClient.signUp.email({
      email: generatedEmail,
      password: props.password,
      name: props.name,
      username: props.username, // Pass username
    });

    if (response?.error) {
      throw new Error(
        response.error.message || "Failed to register with username",
      );
    }

    return response?.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to register with username",
    );
  }
};

// Logout
export const logoutUser = async () => {
  try {
    const response = await authClient.signOut();

    if (response?.error) {
      throw new Error("Failed to sign out");
    }

    return response?.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Failed to sign out",
    );
  }
};

export const signOut = async () => {
  const response = await authClient.signOut();

  if (response?.error) {
    throw new Error("Failed to sign out");
  }
};
