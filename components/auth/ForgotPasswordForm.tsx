"use client";

import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setPending(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess("Password reset email sent. Check your inbox and open the link to continue.");
      }
    } catch {
      setError("Unable to send reset email right now. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-white/80">
          Email address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-pink/80" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="hunter@yozara.world"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/35 backdrop-blur-md focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
          />
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="h-12 w-full rounded-xl bg-brand-pink text-[#0B0F19] shadow-[0_0_20px_rgba(255,133,187,0.25)] transition-all hover:bg-brand-lightpink hover:shadow-[0_0_30px_rgba(255,133,187,0.38)]"
      >
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Send reset link
      </Button>
    </form>
  );
}
