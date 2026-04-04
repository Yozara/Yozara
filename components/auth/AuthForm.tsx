"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2, Lock, Mail, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInAction, signUpAction, type AuthState } from "@/app/actions/auth";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "login" | "signup";

const initialState: AuthState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-xl bg-brand-pink text-[#0B0F19] shadow-[0_0_20px_rgba(255,133,187,0.25)] transition-all hover:bg-brand-lightpink hover:shadow-[0_0_30px_rgba(255,133,187,0.38)]"
      disabled={pending}
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}

export default function AuthForm({
  mode,
  initialEmail = "",
  initialMessage = "",
}: {
  mode: AuthMode;
  initialEmail?: string;
  initialMessage?: string;
}) {
  const [state, formAction] = useActionState(
    mode === "login" ? signInAction : signUpAction,
    initialState
  );
  const [oauthError, setOauthError] = useState("");
  const [oauthPending, setOauthPending] = useState(false);

  const isLogin = mode === "login";

  const handleGoogleAuth = async () => {
    try {
      setOauthError("");
      setOauthPending(true);
      const supabase = createClient();

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/profile`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });

      if (error) {
        setOauthError(error.message);
      }
    } catch {
      setOauthError("Google sign-in failed. Please try again.");
    } finally {
      setOauthPending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-brand-pink">
          <Sparkles className="h-3.5 w-3.5" />
          {isLogin ? "Return to the archive" : "Begin your journey"}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">
            {isLogin ? "Sign in" : "Create your account"}
          </h2>
          <p className="text-sm leading-6 text-white/60">
            {isLogin
              ? "Sign in after verifying your email to resume your recommendations and profile."
              : "Create your Yozara identity and verify your email before your first login."}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={oauthPending}
          className="h-12 w-full rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
        >
          {oauthPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M21.35 11.1H12v2.98h5.34c-.23 1.51-1.9 4.45-5.34 4.45-3.21 0-5.83-2.66-5.83-5.93S8.79 6.67 12 6.67c1.83 0 3.05.78 3.75 1.45l2.56-2.48C16.68 4.13 14.55 3.2 12 3.2 7.03 3.2 3 7.27 3 12.3s4.03 9.1 9 9.1c5.2 0 8.65-3.65 8.65-8.8 0-.59-.07-1.04-.15-1.5Z"
            />
          </svg>
          {isLogin ? "Continue with Google" : "Sign up with Google"}
        </Button>

        {oauthError ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {oauthError}
          </div>
        ) : null}
      </div>

      {initialMessage ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {initialMessage}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-white/80">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={initialEmail}
              placeholder="hunter@yozara.world"
              required
              className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35 backdrop-blur-md focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-white/80">
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder="••••••••"
              required
              className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35 backdrop-blur-md focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
            />
          </div>
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label htmlFor="confirm_password" className="text-sm font-medium text-white/80">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                placeholder="••••••••"
                required
                className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35 backdrop-blur-md focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
              />
            </div>
          </div>
        )}

        {state.error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {state.error}
          </div>
        ) : null}

        {state.success ? (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
            {state.success}
          </div>
        ) : null}

        <SubmitButton label={isLogin ? "Enter Yozara" : "Begin Your Journey"} />
      </form>

      {isLogin ? (
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-brand-pink transition-colors hover:text-brand-lightpink"
          >
            Forgot password?
          </Link>
        </div>
      ) : null}

      <div className="flex items-center justify-between text-sm text-white/55">
        <span>{isLogin ? "New to Yozara?" : "Already have a portal?"}</span>
        <Link
          href={isLogin ? "/signup" : "/login"}
          className="font-medium text-brand-pink transition-colors hover:text-brand-lightpink"
        >
          {isLogin ? "Create account" : "Sign in"}
        </Link>
      </div>
    </div>
  );
}