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

  // Clean text for TTS to prevent reading out punctuation marks
  const cleanTextForTTS = (text: string): string => {
    // Step 1: Handle special cases first
    let cleanText = text
      // Replace common code symbols that might be read out
      .replace(/\(/g, " opening parenthesis ")
      .replace(/\)/g, " closing parenthesis ")
      .replace(/\[/g, " opening bracket ")
      .replace(/\]/g, " closing bracket ")
      .replace(/\{/g, " opening brace ")
      .replace(/\}/g, " closing brace ")
      .replace(/</g, " less than ")
      .replace(/>/g, " greater than ")

      // Replace URLs with a readable version
      .replace(/https?:\/\/[^\s]+/g, " URL link ")

      // Replace email addresses
      .replace(/[\w.-]+@[\w.-]+\.\w+/g, " email address ")

      // Handle common programming/math symbols
      .replace(/\+/g, " plus ")
      .replace(/\-/g, " minus ")
      .replace(/\*/g, " times ")
      .replace(/\//g, " divided by ")
      .replace(/=/g, " equals ")
      .replace(/%/g, " percent ")
      .replace(/\$/g, " dollars ")
      .replace(/&/g, " and ")
      .replace(/\|/g, " pipe ")
      .replace(/\\/g, " backslash ")
      .replace(/~/g, " tilde ")
      .replace(/`/g, " backtick ")
      .replace(/^/g, " caret ")
      .replace(/#/g, " hash ");

    // Step 2: Remove punctuation that should not be spoken and shouldn't be replaced with words
    cleanText = cleanText
      // Replace common sentence punctuation with pauses
      .replace(/\./g, ", ")
      .replace(/,/g, ", ")
      .replace(/;/g, ", ")
      .replace(/:/g, ", ")

      // Replace question and exclamation marks with slightly longer pauses
      .replace(/\?/g, ", ")
      .replace(/!/g, ", ")

      // Replace quotes and other paired marks
      .replace(/"/g, " ")
      .replace(/'/g, " ")
      .replace(/"/g, " ")
      .replace(/"/g, " ")
      .replace(/'/g, " ")
      .replace(/'/g, " ")
      .replace(/«/g, " ")
      .replace(/»/g, " ")

      // Normalize dashes and hyphens
      .replace(/—/g, ", ")
      .replace(/–/g, ", ")
      .replace(/-/g, " ")

      // Remove any other special characters
      .replace(/[^\w\s,]/g, " ");

    // Step 3: Clean up the whitespace
    cleanText = cleanText
      // Replace multiple spaces/commas with a single instance
      .replace(/\s+/g, " ")
      .replace(/,\s*,/g, ",")
      // Trim any leading/trailing whitespace
      .trim();

    return cleanText;
  };

  const playTTS = async () => {
    try {
      // Use the extracted text from the rendered DOM and clean it for TTS
      const rawMessageText = extractedText || "No text available";
      const messageText = cleanTextForTTS(rawMessageText);
      console.log("TTS text:", messageText); // Debug the extracted text

      setIsTtsLoading(true);

      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }

      // Call Eleven Labs API for TTS
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/tTZ0TVc9Q1bbWngiduLK",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": clientEnv.NEXT_PUBLIC_ELEVEN_LABS_API_KEY,
          },
          body: JSON.stringify({
            text: messageText,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error(
          "Eleven Labs API error:",
          errorData || response.statusText,
        );
        throw new Error(`Failed to generate speech: ${response.status}`);
      }

      // Convert the response to an audio blob
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      setAudioElement(audio);

      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(audioUrl); // Clean up the URL object
      });

      await audio.play();
    } catch (error) {
      console.error("TTS Error:", error);
      // You might want to show a toast or other notification here
    } finally {
      setIsTtsLoading(false);
    }
  };

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
            {variant === "ai" && (
              <div className="flex justify-end mt-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full"
                        onClick={playTTS}
                        disabled={isTtsLoading}
                      >
                        {isTtsLoading ? (
                          <Loader2Icon className="h-3 w-3 animate-spin" />
                        ) : (
                          <VolumeIcon className="h-3 w-3" />
                        )}
                        <span className="sr-only">Listen to message</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Listen with Eleven Labs TTS</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
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
