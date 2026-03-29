import { useState } from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "./ui/utils";

interface UpvoteProps {
  initialCount: number;
  className?: string;
  size?: "sm" | "md";
}

export function Upvote({ initialCount, className, size = "md" }: UpvoteProps) {
  const [upvoted, setUpvoted] = useState(false);
  const [count, setCount] = useState(initialCount);

  const handleUpvote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (upvoted) {
      setUpvoted(false);
      setCount(count - 1);
    } else {
      setUpvoted(true);
      setCount(count + 1);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      className={cn(
        "inline-flex items-center gap-1 rounded-md transition-colors",
        size === "sm" && "text-xs px-1.5 py-0.5",
        size === "md" && "text-sm px-2 py-1",
        upvoted
          ? "bg-foreground/10 text-foreground"
          : "hover:bg-foreground/5 text-foreground/50",
        className
      )}
    >
      <ChevronUp
        className={cn(
          size === "sm" && "w-3 h-3",
          size === "md" && "w-4 h-4"
        )}
      />
      <span>{count}</span>
    </button>
  );
}
