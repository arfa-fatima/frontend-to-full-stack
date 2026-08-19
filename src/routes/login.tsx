import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";
import { friendlyAuthError } from "@/lib/auth-errors";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — FlowPilot" },
      { name: "description", content: "Sign in to your FlowPilot account to manage your workflows." },
      { property: "og:title", content: "Login to FlowPilot" },
      { property: "og:description", content: "Welcome back to your automation workspace." },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) void navigate({ to: "/", replace: true });
  }, [user, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    setLoading(false);

    if (signInError) {
      setError(friendlyAuthError(signInError.message));
      return;
    }
    toast.success("Welcome back!");
    void navigate({ to: "/", replace: true });
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/", replace: true });
  }

  return (
    <div className="hero-surface flex min-h-screen flex-col items-center justify-center px-5 py-14">
      <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
        <span className="brand-surface grid size-9 place-items-center rounded-lg text-xs font-bold text-primary-foreground">
          FP
        </span>
        FlowPilot
      </Link>

      <div className="mt-8 w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lift">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your FlowPilot account.</p>

        <Button variant="outline" className="mt-6 w-full" onClick={() => void handleGoogle()}>
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/signup" className="font-medium text-primary">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
