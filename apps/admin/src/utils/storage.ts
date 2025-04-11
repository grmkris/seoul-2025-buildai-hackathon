import type { OrganizationId, WorkspaceId } from "typeid";

const STORAGE_KEYS = {
  lastOrganization: "lastOrganizationId",
  lastWorkspace: (organizationId: OrganizationId) =>
    `lastWorkspaceId-${organizationId}`,
} as const;

export const organizationStorage = {
  save: (organizationId: OrganizationId) => {
    const parsedOrganizationId = organizationId as OrganizationId;
    localStorage.setItem(STORAGE_KEYS.lastOrganization, parsedOrganizationId);
  },

  get: (): OrganizationId | null => {
    return (
      localStorage.getItem(STORAGE_KEYS.lastOrganization) as OrganizationId | null
    );
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.lastOrganization);
  },
};

export const workspaceStorage = {
  save: (organizationId: OrganizationId, workspaceId: WorkspaceId) => {
    const parsedWorkspaceId = workspaceId as WorkspaceId;
    localStorage.setItem(
      STORAGE_KEYS.lastWorkspace(organizationId),
      parsedWorkspaceId,
    );
  },

  get: (organizationId: OrganizationId): WorkspaceId | null => {
    const storedValue = localStorage.getItem(
      STORAGE_KEYS.lastWorkspace(organizationId),
    );
    if (!storedValue) return null;

    try {
      return storedValue as WorkspaceId;
    } catch {
      return null;
    }
  },

  clear: (organizationId: OrganizationId) => {
    localStorage.removeItem(STORAGE_KEYS.lastWorkspace(organizationId));
  },
};
