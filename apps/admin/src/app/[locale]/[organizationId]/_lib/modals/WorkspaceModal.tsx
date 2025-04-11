"use client";
import {
  useCreateWorkspace,
  useUpdateWorkspace,
} from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/hooks/workspaceHooks";
import {
  type OrgModalData,
  useOrgModals,
} from "@/app/[locale]/[organizationId]/_lib/modals/useOrgModals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { WorkspaceId } from "typeid";

export const WorkspaceModal = () => {
  const modal = useOrgModals((state) => state);
  const data = modal.data as OrgModalData;
  const [name, setName] = useState(data?.name ?? "");

  const createWorkspaceMutation = useCreateWorkspace({
    onSuccess: () => {
      setName("");
      modal.close();
    },
    onError: (error) => console.error(error),
  });

  const updateWorkspace = useUpdateWorkspace({
    onSuccess: () => {
      setName("");
      modal.close();
    },
  });

  return (
    <Dialog open={modal.isOpen} onOpenChange={modal.close}>
      <DialogContent className="scrollable flex max-h-[85vh] max-w-[581px] flex-col justify-between gap-4 overflow-auto rounded-2xl bg-gray-100 p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="font-outfit-bold text-[22px] text-primary-900">
              {data?.name ? "Edit " : "Create New "} Workspace
            </div>
          </DialogTitle>
          <DialogDescription>
            {data?.name
              ? "Edit the workspace name below"
              : "Enter a name for your new workspace below"}
          </DialogDescription>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-12"
          placeholder="New workspace name"
        />
        <DialogFooter className="mt-8 flex flex-col gap-2">
          <Button
            className="w-full"
            disabled={!name}
            isPending={createWorkspaceMutation.isPending}
            onClick={() => {
              if (name.trim()) {
                data?.name
                  ? updateWorkspace.mutate({
                      data: { name: name.trim() },
                      workspaceId: data.workspaceId as WorkspaceId,
                    })
                  : createWorkspaceMutation.mutate({ name: name.trim() });
              }
            }}
          >
            {data?.name ? "Edit " : "Create "} workspace
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
