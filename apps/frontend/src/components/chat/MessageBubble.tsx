import type * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { useState, useRef, useEffect } from "react";
import { VolumeIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { clientEnv } from "@/lib/clientEnv";

const messageVariants = cva("flex items-start gap-3", {
  variants: {
    variant: {
      user: "justify-end",
      ai: "justify-start",
    },
  },
  defaultVariants: {
    variant: "ai",
  },
});

const bubbleVariants = cva(
  "relative rounded-lg px-3 py-2 text-sm shadow-sm border",
  {
    variants: {
      variant: {
        user: "bg-primary text-primary-foreground border-primary-border min-w-[120px]",
        ai: "bg-card text-card-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "ai",
    },
  },
);

interface MessageBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageVariants> {
  avatarSrc?: string;
  avatarFallback?: string;
  message: React.ReactNode;
  timestamp?: string; // Optional timestamp
}

function MessageBubble({
  className,
  variant,
  avatarSrc,
  avatarFallback,
  message,
  timestamp,
  ...props
}: MessageBubbleProps) {
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  );
  const messageRef = useRef<HTMLDivElement>(null);
  const [extractedText, setExtractedText] = useState<string>("");

  const bubbleClassName = cn(bubbleVariants({ variant }));
  const avatar = (
    <Avatar className="size-8 border-2 border-border">
      {" "}
      <AvatarImage src={avatarSrc} alt="Sender avatar" />
      <AvatarFallback>
        {avatarFallback?.slice(0, 2).toUpperCase() || "???"}
      </AvatarFallback>
    </Avatar>
  );

  // Extract text content after the component renders
  useEffect(() => {
    if (messageRef.current) {
      const text = messageRef.current.textContent || "";
      setExtractedText(text.trim());
    }
  }, []);

  return (
    <div className={cn(messageVariants({ variant }), className)} {...props}>
      {variant === "ai" && avatar}
      <div
        className={cn(
          "flex flex-col gap-1",
          variant === "user" ? "items-end max-w-[75%]" : "max-w-[75%]",
        )}
      >
        <div className={bubbleClassName}>
          <div className="flex flex-col">
            <div ref={messageRef}>{message}</div>
          </div>
        </div>
        {timestamp && (
          <p
            className={cn(
              "text-xs text-muted-foreground",
              variant === "user" ? "text-right" : "text-left",
            )}
          >
            {timestamp}
          </p>
        )}
      </div>
      {variant === "user" && avatar}
    </div>
  );
}

export { MessageBubble };
