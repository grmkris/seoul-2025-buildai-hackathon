import { OrganizationId, WorkspaceId } from "typeid";

const STORAGE_KEYS = {
  lastOrganization: "lastOrganizationId",
  lastWorkspace: (organizationId: OrganizationId) =>
    `lastWorkspaceId-${organizationId}`,
} as const;

export const organizationStorage = {
  save: (organizationId: OrganizationId) => {
    const parsedOrganizationId = OrganizationId.parse(organizationId);
    localStorage.setItem(STORAGE_KEYS.lastOrganization, parsedOrganizationId);
  },

  get: (): OrganizationId | null => {
    return (
      OrganizationId.nullish().parse(
        localStorage.getItem(STORAGE_KEYS.lastOrganization),
      ) ?? null
    );
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.lastOrganization);
  },
};

export const workspaceStorage = {
  save: (organizationId: OrganizationId, workspaceId: WorkspaceId) => {
    WorkspaceId.parse(workspaceId);
    localStorage.setItem(
      STORAGE_KEYS.lastWorkspace(organizationId),
      workspaceId,
    );
  },

  get: (organizationId: OrganizationId): WorkspaceId | null => {
    const storedValue = localStorage.getItem(
      STORAGE_KEYS.lastWorkspace(organizationId),
    );
    if (!storedValue) return null;

    try {
      return WorkspaceId.parse(storedValue);
    } catch {
      return null;
    }
  },

  clear: (organizationId: OrganizationId) => {
    localStorage.removeItem(STORAGE_KEYS.lastWorkspace(organizationId));
  },
};
