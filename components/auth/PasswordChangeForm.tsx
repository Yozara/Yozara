"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { changePasswordAction, type AuthState } from "@/app/actions/auth";

const initialState: AuthState = {};

function SaveButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-xl bg-brand-pink text-[#0B0F19] shadow-[0_0_20px_rgba(255,133,187,0.25)] transition-all hover:bg-brand-lightpink"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
      Update Password
    </Button>
  );
}

export default function PasswordChangeForm() {
  const [state, formAction] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="current_password" className="text-sm font-medium text-white/80">
          Current password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
          <Input
            id="current_password"
            name="current_password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="new_password" className="text-sm font-medium text-white/80">
          New password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
          <Input
            id="new_password"
            name="new_password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={8}
            required
            className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm_password" className="text-sm font-medium text-white/80">
          Confirm new password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
          <Input
            id="confirm_password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            minLength={8}
            required
            className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35"
          />
        </div>
      </div>

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

      <SaveButton />

      <p className="text-xs text-white/50 flex items-center gap-2">
        <ArrowRight className="h-3.5 w-3.5" />
        Use at least 8 characters with a mix of letters, numbers, and symbols.
      </p>
    </form>
  );
}
