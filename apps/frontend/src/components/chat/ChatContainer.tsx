import type * as React from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Direction = "ltr" | "rtl";
type ChatContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  dir?: Direction;
};

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ScrollArea
        ref={ref}
        className={cn("h-full w-full flex-1", className)}
        {...props}
      >
        <div className="p-4">{children}</div>
      </ScrollArea>
    );
  },
);

ChatContainer.displayName = "ChatContainer";

export { ChatContainer };
