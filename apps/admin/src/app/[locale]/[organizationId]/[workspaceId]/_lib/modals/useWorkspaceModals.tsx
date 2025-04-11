import { create } from "zustand";

export type WorkspaceModalData = { id?: string };

type IWorkspaceModalStore = {
  isOpen: boolean;
  view?: "AddNewOrder" | "CustomerModal" | "ItemModal";
  data?: WorkspaceModalData;
  open: (view: IWorkspaceModalStore["view"], data?: WorkspaceModalData) => void;
  close: () => void;
};
export const useWorkspaceModals = create<IWorkspaceModalStore>((set) => ({
  isOpen: false,
  view: undefined,
  data: undefined,
  open: (view: IWorkspaceModalStore["view"], data?: WorkspaceModalData) => {
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
