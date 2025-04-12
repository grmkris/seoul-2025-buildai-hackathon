"use client";

import { ChatInterface } from "@/app/_lib/ChatInterface";
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const workspaceId = searchParams.get('workspaceId');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Render the client component, passing workspaceId from URL */}
      {workspaceId ? (
        <ChatInterface workspaceId={workspaceId} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>Please provide a workspaceId in the URL (e.g., ?workspaceId=...)</p>
        </div>
      )}
      {/* Remove the previous chat container and input bar JSX */}
    </div>
  );
}
