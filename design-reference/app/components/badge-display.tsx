import { badges, type BadgeType } from "../data/community-data";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const badgeColors: Record<BadgeType, string> = {
  "early-adopter": "bg-purple-50 text-purple-700 border-purple-200",
  "contributor": "bg-blue-50 text-blue-700 border-blue-200",
  "active-community": "bg-green-50 text-green-700 border-green-200",
  "mr-popular": "bg-amber-50 text-amber-700 border-amber-200",
  "curator": "bg-pink-50 text-pink-700 border-pink-200",
  "helper": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "verified-expert": "bg-indigo-50 text-indigo-700 border-indigo-200",
};

interface BadgeDisplayProps {
  badgeId: BadgeType;
  showLabel?: boolean;
}

export function BadgeDisplay({ badgeId, showLabel = false }: BadgeDisplayProps) {
  const badge = badges[badgeId];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs cursor-help ${badgeColors[badgeId]}`}>
            <span>{badge.icon}</span>
            {showLabel && <span>{badge.name}</span>}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <div className="font-medium mb-1">{badge.name}</div>
            <div className="text-foreground/70">{badge.description}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

interface BadgeShelfProps {
  badgeIds: BadgeType[];
}

export function BadgeShelf({ badgeIds }: BadgeShelfProps) {
  if (badgeIds.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {badgeIds.map((badgeId) => (
        <BadgeDisplay key={badgeId} badgeId={badgeId} showLabel />
      ))}
    </div>
  );
}