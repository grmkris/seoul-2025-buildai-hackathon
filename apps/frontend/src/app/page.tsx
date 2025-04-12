"use client";

import { ChatInterface } from "@/app/_lib/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Render the client component */}
      <ChatInterface workspaceId="wsp_01jrk502z6esnrtqb3nj1c8snr" />
      {/* Remove the previous chat container and input bar JSX */}
    </div>
  );
}
