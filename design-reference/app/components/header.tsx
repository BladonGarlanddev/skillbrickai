import { Link, useLocation } from "react-router";
import { Search, User } from "lucide-react";
import { Button } from "./ui/button";
import { TokenPanel } from "./token-panel";

export function Header() {
  const location = useLocation();
  const isLoggedIn = true; // In a real app, this would come from auth context

  return (
    <header className="border-b border-black/5 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-foreground/20" />
          </div>
          <span className="font-medium">Collective</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link to="/browse">
            <Button 
              variant={location.pathname === "/browse" ? "secondary" : "ghost"} 
              size="sm"
            >
              Browse
            </Button>
          </Link>
          <Link to="/community">
            <Button 
              variant={location.pathname.startsWith("/community") ? "secondary" : "ghost"} 
              size="sm"
            >
              Community
            </Button>
          </Link>
          <Link to="/submit">
            <Button 
              variant={location.pathname === "/submit" ? "secondary" : "ghost"} 
              size="sm"
            >
              Contribute
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2 ml-auto md:ml-0">
          <Link to="/browse">
            <Button variant="ghost" size="icon">
              <Search className="w-4 h-4" />
            </Button>
          </Link>

          {isLoggedIn ? (
            <>
              <TokenPanel />
              <Link to="/profile/1">
                <Button variant="ghost" size="icon">
                  <User className="w-4 h-4" />
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/auth">
              <Button size="sm">Log In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}