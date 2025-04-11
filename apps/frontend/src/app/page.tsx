"use client";

import { ChatInterface } from "@/app/_lib/ChatInterface";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Render the client component */}
      <ChatInterface />
      {/* Remove the previous chat container and input bar JSX */}
    </div>
  );
}
