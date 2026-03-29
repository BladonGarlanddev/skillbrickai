import { Coins } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";
import { currentUser } from "../data/community-data";

export function TokenPanel() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Coins className="w-4 h-4" />
          <span>{currentUser.tokens}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div>
          <div className="mb-4">
            <div className="text-sm text-foreground/50 mb-1">Token Balance</div>
            <div className="text-3xl font-medium">{currentUser.tokens}</div>
          </div>

          <div className="mb-4 pb-4 border-b border-black/5">
            <div className="text-sm font-medium mb-3">How to Earn More</div>
            <div className="space-y-2 text-sm text-foreground/70">
              <div className="flex items-center justify-between">
                <span>Post a skill</span>
                <span className="text-foreground/50">+10</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Create an account</span>
                <span className="text-foreground/50">+30</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-3">Recent Activity</div>
            <div className="space-y-2">
              {currentUser.tokenHistory.slice(0, 3).map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between gap-3 text-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-foreground/70 truncate">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-foreground/40">
                      {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div
                    className={`flex-shrink-0 ${
                      transaction.type === "earn"
                        ? "text-green-600"
                        : "text-foreground/40"
                    }`}
                  >
                    {transaction.type === "earn" ? "+" : "−"}
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
