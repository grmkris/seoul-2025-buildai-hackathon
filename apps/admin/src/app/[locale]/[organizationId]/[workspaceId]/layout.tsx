import { WorkspaceModals } from "@/app/[locale]/[organizationId]/[workspaceId]/_lib/modals/WorkspaceModals";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

async function WorkspaceLayout({ children }: Props) {
  return (
    <div className="">
      {children}
      <WorkspaceModals />
    </div>
  );
}

export default WorkspaceLayout;
