import * as React from "react";
import { ArrowRightIcon } from "lucide-react"; // Changed from SendHorizonalIcon

import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChatInputBarProps extends React.HTMLAttributes<HTMLFormElement> {
  inputProps?: React.ComponentProps<typeof Textarea>;
  buttonProps?: React.ComponentProps<typeof Button>;
  onSendMessage: (message: string) => void; // Callback when message is sent
  disabled?: boolean; // Add disabled prop
}

function ChatInputBar({
  className,
  inputProps,
  buttonProps,
  onSendMessage,
  disabled = false, // Default to false
  ...props
}: ChatInputBarProps) {
  const [message, setMessage] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const previousDisabledRef = React.useRef(disabled);

  // Track when disabled changes from true to false and refocus
  React.useEffect(() => {
    if (previousDisabledRef.current === true && disabled === false) {
      // Focus the textarea when it transitions from disabled to enabled
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
    previousDisabledRef.current = disabled;
  }, [disabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = (
    event?:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage(""); // Clear input after sending
      textareaRef.current?.focus(); // Keep focus on textarea
    }
  };

  // Allow sending with Enter, but Shift+Enter for new line
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <form
      onSubmit={handleSend}
      className={cn(
        "flex w-full items-end gap-2 bg-muted p-4", // Removed border-t, changed bg-background to bg-muted
        className,
      )}
      {...props}
    >
      <Textarea
        ref={textareaRef}
        placeholder="Type your message..."
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        rows={1} // Start with 1 row, auto-expands due to field-sizing-content
        className="min-h-10 max-h-48 flex-1 resize-none rounded-md" // Added rounded-md
        disabled={disabled}
        {...inputProps}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="submit"
              size="icon"
              variant="ghost" // Added variant="ghost"
              disabled={!message.trim() || disabled} // Disable if no message or if component is disabled
              aria-label="Send message"
              className="rounded-md" // Added rounded-md
              {...buttonProps}
            >
              <ArrowRightIcon className="size-5" /> {/* Changed icon */}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Send message</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </form>
  );
}

export { ChatInputBar };
