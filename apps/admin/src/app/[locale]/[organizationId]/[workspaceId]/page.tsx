"use client";

import {
  useActiveOrganization,
  useActiveWorkspace,
} from "@/app/_lib/useActiveUrlParams";
import { PageContainer } from "@/components/PageContainer";
import { useRouter } from "@/navigation";


// Helper function to extract text content from a message

const WorkspacePage = () => {
  const router = useRouter();

  const activeOrganization = useActiveOrganization();
  const activeWorkspace = useActiveWorkspace();

  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  // Format conversation date

  const baseUrl = `/${activeOrganization}/${activeWorkspace}` as const;

  return (
    <PageContainer
      title={`Good ${getTimeOfDay()}!`}
      description="Welcome to your workspace. What would you like to accomplish today?"
    >
      <div className="space-y-4">
      </div>
    </PageContainer>
  );
};

export default WorkspacePage;
