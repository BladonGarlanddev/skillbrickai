import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Github } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would authenticate
    alert(`${mode === "login" ? "Logged in" : "Signed up"} successfully! (Demo only)`);
    navigate("/");
  };

  const handleOAuth = (provider: string) => {
    alert(`${provider} OAuth would trigger here (Demo only)`);
    navigate("/");
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Subtle constellation background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          <g stroke="currentColor" strokeWidth="0.5" fill="none">
            <line x1="100" y1="100" x2="200" y2="150" />
            <line x1="200" y1="150" x2="300" y2="120" />
            <line x1="300" y1="120" x2="400" y2="180" />
            <line x1="200" y1="150" x2="250" y2="250" />
            <line x1="250" y1="250" x2="350" y2="280" />
            <line x1="350" y1="280" x2="400" y2="180" />
            <line x1="500" y1="200" x2="600" y2="180" />
            <line x1="600" y1="180" x2="650" y2="250" />
            <line x1="500" y1="200" x2="550" y2="300" />
            <line x1="550" y1="300" x2="650" y2="250" />
          </g>
          <g fill="currentColor">
            <circle cx="100" cy="100" r="2" />
            <circle cx="200" cy="150" r="2.5" />
            <circle cx="300" cy="120" r="2" />
            <circle cx="400" cy="180" r="2.5" />
            <circle cx="250" cy="250" r="2" />
            <circle cx="350" cy="280" r="2" />
            <circle cx="500" cy="200" r="2.5" />
            <circle cx="600" cy="180" r="2" />
            <circle cx="650" cy="250" r="2" />
            <circle cx="550" cy="300" r="2" />
          </g>
        </svg>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-12">
          <div className="relative w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-full h-full">
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <line x1="8" y1="16" x2="16" y2="8" />
                <line x1="16" y1="8" x2="24" y2="16" />
                <line x1="8" y1="16" x2="16" y2="24" />
                <line x1="16" y1="24" x2="24" y2="16" />
              </g>
              <g fill="currentColor">
                <circle cx="8" cy="16" r="2" />
                <circle cx="24" cy="16" r="2" />
                <circle cx="16" cy="8" r="2" />
                <circle cx="16" cy="24" r="2" />
              </g>
            </svg>
          </div>
          <span className="text-xl">Collective</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl mb-2">
            {mode === "signup" ? "Join Collective" : "Welcome back"}
          </h1>
          <p className="text-foreground/60 leading-relaxed">
            {mode === "signup" 
              ? "Start building and sharing AI skills with the community" 
              : "Continue your journey in the knowledge collective"}
          </p>
        </div>

        {/* Incentive for Sign Up */}
        {mode === "signup" && (
          <div className="mb-8 p-4 rounded-lg bg-foreground/[0.02] border border-black/5">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border bg-purple-50 text-purple-700 border-purple-200 text-xs">
                <span>✦</span>
                <span>Early Adopter</span>
              </div>
              <div className="text-sm text-foreground/70">
                Start with 30 free installs
              </div>
            </div>
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 h-11"
            onClick={() => handleOAuth("GitHub")}
          >
            <Github className="w-4 h-4" />
            Continue with GitHub
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 h-11"
            onClick={() => handleOAuth("Google")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/5" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-foreground/50">or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border-black/10 h-11"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-black/10 h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-black/10 h-11"
            />
            {mode === "signup" && (
              <p className="text-xs text-foreground/50">
                At least 8 characters
              </p>
            )}
          </div>

          {mode === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-foreground/50 hover:text-foreground/70 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <Button type="submit" className="w-full h-11">
            {mode === "login" ? "Log In" : "Create Account"}
          </Button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-6 text-center text-sm text-foreground/60">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-foreground hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-foreground hover:underline"
              >
                Log in
              </button>
            </>
          )}
        </div>

        {/* Terms */}
        {mode === "signup" && (
          <p className="mt-6 text-xs text-center text-foreground/50 leading-relaxed">
            By creating an account, you agree to our{" "}
            <a href="#" className="underline hover:text-foreground/70">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-foreground/70">
              Privacy Policy
            </a>
          </p>
        )}
      </div>
    </div>
  );
}