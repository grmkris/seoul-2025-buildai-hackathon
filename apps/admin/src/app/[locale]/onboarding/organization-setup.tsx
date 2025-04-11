"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateOrganization } from "../../[locale]/[organizationId]/_lib/hooks/organizationsHooks";
import {
  useAcceptInvitation,
  useInvitation,
} from "../../[locale]/[organizationId]/_lib/hooks/organizationsHooks";
import type { CurrentUser } from "../../[locale]/auth/authActions";
import { useCreateWorkspace } from "../[organizationId]/[workspaceId]/_lib/hooks/workspaceHooks";

// Define schema for organization creation
const createOrgSchema = z.object({
  name: z.string().min(3, "Organization name must be at least 3 characters"),
});

// Define schema for invitation code
const joinOrgSchema = z.object({
  invitationId: z.string().min(1, "Invitation code is required"),
});

// Define schema for workspace creation
const createWorkspaceSchema = z.object({
  name: z.string().min(2, "Workspace name must be at least 2 characters"),
});

// Define invitation type
interface Invitation {
  id: string;
  organizationName: string;
  organizationSlug: string;
  organizationId: string;
  role: string;
  status: "pending" | "accepted" | "rejected" | "canceled";
  // Add other properties that might be in your invitation object
}

export function OrganizationSetup({ user }: { user: CurrentUser }) {
  const [activeTab, setActiveTab] = useState("create");
  const [isPending, setIsPending] = useState(false);
  const [currentStep, setCurrentStep] = useState<"organization" | "workspace">(
    "organization",
  );
  const [createdOrganizationId, setCreatedOrganizationId] = useState<
    string | null
  >(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationIdFromUrl = searchParams.get("invitationId");
  const workspaceInputRef = useRef<HTMLInputElement>(null);

  // Get pending invitations
  const { data: invitationsData = [], isLoading: isLoadingInvitations } = {
    data: [],
    isLoading: false,
  }; // TODO: Re-implement useInvitations hook

  // Fetch invitation details if an invitation ID is provided in the URL
  const invitationEnabled =
    !!invitationIdFromUrl && invitationIdFromUrl.startsWith("ivt");

  // Always call the hook, but we'll use a dummy ID "ivt_disabled" when not enabled
  // The actual invitationId will start with "ivt" as per the type requirement
  const dummyInvitationId = "ivt_disabled" as `ivt${string}`;
  const { data: invitationData, isLoading: isLoadingInvitation } =
    useInvitation(
      invitationEnabled
        ? (invitationIdFromUrl as `ivt${string}`)
        : dummyInvitationId,
    );

  const { mutate: createOrganization } = useCreateOrganization({
    onSuccess: (data) => {
      toast.success("Organization created successfully!");
      // After creating organization, move to workspace setup step
      setCreatedOrganizationId(data.id);
      setCurrentStep("workspace");
      setIsPending(false); // Reset pending state after success
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create organization",
      );
      setIsPending(false);
    },
  });

  const { mutate: acceptInvitation } = useAcceptInvitation({
    onSuccess: () => {
      toast.success("Joined organization successfully!");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to join organization",
      );
      setIsPending(false);
    },
  });

  // Hook for creating workspace
  const { mutate: createWorkspaceMutation } = useCreateWorkspace({
    onSuccess: () => {
      toast.success("Workspace created successfully!");
      // Redirect to the organization/workspace page after creating workspace
      if (createdOrganizationId) {
        // We'll need to get the workspace ID from somewhere else
        router.push(`/${createdOrganizationId}`);
      }
      setIsPending(false);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to create workspace",
      );
      setIsPending(false);
    },
  });

  // Form for creating new organization
  const createOrgForm = useForm({
    resolver: zodResolver(createOrgSchema),
    defaultValues: {
      name: `${user.user.name}'s Organization`,
    },
  });

  // Form for joining existing organization
  const joinOrgForm = useForm({
    resolver: zodResolver(joinOrgSchema),
    defaultValues: {
      invitationId: invitationIdFromUrl || "",
    },
  });

  // Form for creating new workspace
  const createWorkspaceForm = useForm({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "Main Workspace",
    },
  });

  // Handle create organization
  const handleCreateOrg = (values: z.infer<typeof createOrgSchema>) => {
    setIsPending(true);
    createOrganization(values);
  };

  // Handle join organization with invitation code
  const handleJoinOrg = (values: z.infer<typeof joinOrgSchema>) => {
    setIsPending(true);
    acceptInvitation({ invitationId: values.invitationId });
  };

  // Handle create workspace
  const handleCreateWorkspace = (
    values: z.infer<typeof createWorkspaceSchema>,
  ) => {
    setIsPending(true);
    createWorkspaceMutation({ name: values.name });
  };

  // Handle skipping workspace creation
  const handleSkipWorkspace = () => {
    if (createdOrganizationId) {
      router.push(`/${createdOrganizationId}`);
    }
  };

  // Handle accepting an invitation directly
  const handleAcceptInvitation = useCallback(
    (invitationId: string) => {
      setIsPending(true);
      acceptInvitation({ invitationId });
    },
    [acceptInvitation],
  );

  // Set active tab based on invitations or URL parameter
  useEffect(() => {
    if (invitationIdFromUrl) {
      setActiveTab("join");
      if (!isLoadingInvitation && invitationData) {
        // Auto-fill the invitation code if provided via URL
        joinOrgForm.setValue("invitationId", invitationIdFromUrl);
      }
    } else if (invitationsData.length > 0) {
      setActiveTab("join");
    }
  }, [invitationIdFromUrl, invitationData, isLoadingInvitation, joinOrgForm]);

  // If there's an invitation ID in the URL and we're not already processing, handle it automatically
  useEffect(() => {
    if (
      invitationIdFromUrl &&
      invitationData &&
      !isPending &&
      activeTab === "join"
    ) {
      handleAcceptInvitation(invitationIdFromUrl);
    }
  }, [
    invitationIdFromUrl,
    invitationData,
    isPending,
    activeTab,
    handleAcceptInvitation,
  ]);

  // Focus workspace input when step changes to workspace
  useEffect(() => {
    if (currentStep === "workspace") {
      workspaceInputRef.current?.focus();
    }
  }, [currentStep]);

  // Stepper component
  const stepper = (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center">
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === "organization" ? "bg-primary text-primary-foreground" : "bg-gray-300 text-gray-600"}`}
        >
          1
        </div>
        <span className="ml-2">Organization</span>
      </div>
      <div className="mx-4 text-gray-400">→</div>
      <div className="flex items-center">
        <div
          className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === "workspace" ? "bg-primary text-primary-foreground" : "bg-gray-300 text-gray-600"}`}
        >
          2
        </div>
        <span className="ml-2">Workspace</span>
      </div>
    </div>
  );

  if (currentStep === "workspace") {
    return (
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Create Workspace</CardTitle>
          <CardDescription>
            Set up your first workspace to organize your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stepper}
          <Form {...createWorkspaceForm}>
            <form
              onSubmit={createWorkspaceForm.handleSubmit(handleCreateWorkspace)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={createWorkspaceForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Workspace Name</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            A workspace is a specific area for your projects and
                            data.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="My Workspace"
                        {...field}
                        ref={workspaceInputRef}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 pt-2">
                <Button className="w-1/2" onClick={handleSkipWorkspace}>
                  Skip for now
                </Button>
                <Button type="submit" className="w-1/2" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Create Workspace
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Organization Setup</CardTitle>
        <CardDescription>
          Create a new organization to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        {stepper}
        {activeTab === "create" ? (
          <Form {...createOrgForm}>
            <form
              onSubmit={createOrgForm.handleSubmit(handleCreateOrg)}
              className="mt-4 space-y-4"
            >
              <FormField
                control={createOrgForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2">
                      <FormLabel>Organization Name</FormLabel>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-gray-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            An organization groups your workspaces and team
                            members.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <FormControl>
                      <Input placeholder="My Organization" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Create Organization
              </Button>
            </form>
          </Form>
        ) : (
          <>
            {isLoadingInvitations ||
            (invitationIdFromUrl && isLoadingInvitation) ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : invitationsData && invitationsData.length > 0 ? (
              <div className="mt-4 space-y-4">
                <h3 className="text-sm font-medium">
                  You have pending invitations:
                </h3>
                <div className="space-y-2">
                  {invitationsData.map((invitation: Invitation) => (
                    <Card key={invitation.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {invitation.organizationName || "Organization"}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Role: {invitation.role}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleAcceptInvitation(invitation.id)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Accept
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : invitationIdFromUrl && invitationData ? (
              <div className="mt-4 space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {invitationData.organizationName || "Organization"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Role: {invitationData.role}
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        handleAcceptInvitation(invitationIdFromUrl)
                      }
                      disabled={isPending}
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Accept
                    </Button>
                  </div>
                </Card>
              </div>
            ) : (
              <Form {...joinOrgForm}>
                <form
                  onSubmit={joinOrgForm.handleSubmit(handleJoinOrg)}
                  className="mt-4 space-y-4"
                >
                  <FormField
                    control={joinOrgForm.control}
                    name="invitationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invitation Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter invitation code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Join Organization
                  </Button>
                </form>
              </Form>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
