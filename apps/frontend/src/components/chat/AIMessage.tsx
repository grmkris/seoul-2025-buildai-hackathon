import { useState } from "react";
import type { Message } from "@ai-sdk/react";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

// Component for rendering a single, inline, expandable tool invocation
function InlineToolInvocation({
  part,
}: {
  part: Extract<
    NonNullable<Message["parts"]>[number],
    { type: "tool-invocation" }
  >;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className="my-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleExpand}
        className="flex items-center justify-start p-1 h-auto text-left w-full bg-muted/30 hover:bg-muted/60 rounded"
      >
        {isExpanded ? (
          <ChevronUp size={14} className="mr-1" />
        ) : (
          <ChevronDown size={14} className="mr-1" />
        )}
      </Button>
      {isExpanded && (
        <div className="mt-1 p-2 text-xs border rounded bg-background">
          {part.toolInvocation.args && (
            <>
              <p className="font-medium">Args:</p>
              <pre className="whitespace-pre-wrap break-all bg-muted/20 p-1 rounded text-[0.7rem]">
                {JSON.stringify(part.toolInvocation.args, null, 2)}
              </pre>
            </>
          )}
          {part.toolInvocation.state === "result" &&
            part.toolInvocation.result && (
              <>
                <p className="mt-1 font-medium">Result:</p>
                <pre className="whitespace-pre-wrap break-all bg-muted/20 p-1 rounded text-[0.7rem]">
                  {JSON.stringify(part.toolInvocation.result, null, 2)}
                </pre>
              </>
            )}
        </div>
      )}
    </div>
  );
}

type AIMessageProps = Omit<
  React.ComponentProps<typeof MessageBubble>,
  "variant" | "message"
> & {
  fullMessage: Message;
};

function AIMessage({ fullMessage, ...props }: AIMessageProps) {
  console.log("AIMessage", fullMessage.content);
  // Separate text and tool parts
  const textParts =
    fullMessage.parts?.filter((part) => part?.type === "text") || [];
  const toolInvocationParts =
    fullMessage.parts?.filter(
      (
        part,
      ): part is Extract<
        NonNullable<Message["parts"]>[number],
        { type: "tool-invocation" }
      > => part?.type === "tool-invocation",
    ) || [];

  console.log("toolInvocationParts", toolInvocationParts);
  // Render message content with text first, then tool calls
  const messageContent = (
    <div>
      {/* Render Text Parts with Markdown */}
      {textParts.map((part, index) => {
        if (!part || part.type !== "text") return null;
        return (
          <div
            key={`${fullMessage.id || "msg"}-text-${index}`}
            className="whitespace-pre-wrap break-words text-card-foreground"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
            >
              {part.text}
            </ReactMarkdown>
          </div>
        );
      })}

      {/* Render Tool Invocation Parts */}
      {toolInvocationParts.map((part, index) => {
        // Render InlineToolInvocation for other tool calls
        return (
          <InlineToolInvocation
            key={`${fullMessage.id}-tool-${index}`}
            part={part}
          />
        );
      })}

      {/* Fallback if parts is empty/missing, but content exists */}
      {!fullMessage.parts?.length && fullMessage.content && (
        <div className="whitespace-pre-wrap break-words text-card-foreground">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {fullMessage.content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );

  return <MessageBubble variant="ai" message={messageContent} {...props} />;
}

export { AIMessage };
