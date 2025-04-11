import type * as React from "react";
import { MessageBubble } from "./MessageBubble";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type UserMessageProps = Omit<
  React.ComponentProps<typeof MessageBubble>,
  "variant"
>;

function UserMessage({ message, ...props }: UserMessageProps) {
  // Format message content if it's a string to use markdown rendering
  const formattedMessage =
    typeof message === "string" ? (
      <div className="whitespace-pre-wrap break-words text-primary-foreground">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {message}
        </ReactMarkdown>
      </div>
    ) : (
      message
    );

  return <MessageBubble variant="user" message={formattedMessage} {...props} />;
}

export { UserMessage };
