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

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Your FlowPilot Account" },
      {
        name: "description",
        content: "Start automating your work today with a free FlowPilot account.",
      },
      { property: "og:title", content: "Sign up for FlowPilot" },
      { property: "og:description", content: "Create your free account and start automating." },
    ],
  }),
  component: Signup,
});

function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user) void navigate({ to: "/", replace: true });
  }, [user, navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const email = String(form.get("email"));
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: String(form.get("name")) },
      },
    });

    if (signUpError) {
      setLoading(false);
      setError(friendlyAuthError(signUpError.message));
      return;
    }

    // Email confirmation is disabled, so sign in immediately to guarantee a session.
    if (!data.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (signInError) {
        setSent(true);
        toast.success("Account created — please sign in.");
        return;
      }
    } else {
      setLoading(false);
    }

    toast.success("Account created!");
    void navigate({ to: "/", replace: true });
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-up failed. Please try again.");
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
        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold">Confirm your email</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              We sent you a confirmation link. Click it to activate your FlowPilot account, then
              sign in.
            </p>
            <Button asChild className="mt-6 w-full">
              <Link to="/login">Go to login</Link>
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Start automating your work today.</p>

            <Button variant="outline" className="mt-6 w-full" onClick={() => void handleGoogle()}>
              Continue with Google
            </Button>

            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or{" "}
              <span className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" maxLength={100} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" minLength={6} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm password</Label>
                <Input id="confirm" name="confirm" type="password" required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary">
                Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
