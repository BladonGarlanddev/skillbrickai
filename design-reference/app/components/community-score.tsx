import { cn } from "./ui/utils";

interface CommunityScoreProps {
  score: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CommunityScore({ score, className, size = "md" }: CommunityScoreProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-foreground/50",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        size === "lg" && "text-base",
        className
      )}
    >
      <span className="text-foreground/30">◆</span>
      <span>{score.toLocaleString()}</span>
    </div>
  );
}
