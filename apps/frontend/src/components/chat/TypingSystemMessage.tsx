"use client";

import type React from "react"; // Import only the type
import { useState, useEffect } from "react";

interface TypingSystemMessageProps {
  message: string;
  typingSpeed?: number; // Milliseconds per character
  onComplete?: () => void; // Optional callback when typing finishes
}

export const TypingSystemMessage: React.FC<TypingSystemMessageProps> = ({
  message,
  typingSpeed = 50, // Default typing speed
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < message.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + message[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, typingSpeed);

      // Cleanup function to clear timeout if component unmounts or rerenders
      return () => clearTimeout(timeoutId);
    }
    if (currentIndex === message.length && onComplete) {
      // Call onComplete callback once typing is finished
      onComplete();
    }
  }, [currentIndex, message, typingSpeed, onComplete]);

  return (
    <div className="flex justify-center items-center my-2">
      <div className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm shadow-sm">
        {displayedText}
        {/* Optional: Add a blinking cursor effect here */}
        {currentIndex < message.length && (
          <span className="animate-pulse">_</span>
        )}
      </div>
    </div>
  );
};
