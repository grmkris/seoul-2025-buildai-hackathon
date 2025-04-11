import type { WorkspaceId } from "typeid";
import { create } from "zustand";

export type OrgModalData = { workspaceId?: WorkspaceId; name?: string };

type IOrgModalStore = {
  isOpen: boolean;
  view?: "WorkspaceModal";
  data?: OrgModalData;
  open: (view: IOrgModalStore["view"], data?: OrgModalData) => void;
  close: () => void;
};
export const useOrgModals = create<IOrgModalStore>((set) => ({
  isOpen: false,
  view: undefined,
  data: undefined,
  open: (view: IOrgModalStore["view"], data?: OrgModalData) => {
    set({
      isOpen: true,
      view,
      data,
    });
  },
  close: () => {
    set({
      isOpen: false,
      view: undefined,
      data: undefined,
    });
  },
}));
