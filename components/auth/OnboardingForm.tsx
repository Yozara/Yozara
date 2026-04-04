"use client";

import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Loader2, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { completeOnboardingAction, type AuthState } from "@/app/actions/auth";

const animeClasses = [
  "Shonen Protagonist",
  "Slice-of-Life Enjoyer",
  "Mecha Pilot",
  "Isekai Wanderer",
  "Dark Fantasy Survivor",
];

const initialState: AuthState = {};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="h-12 w-full rounded-xl bg-brand-pink text-[#0B0F19] shadow-[0_0_20px_rgba(255,133,187,0.25)] transition-all hover:bg-brand-lightpink hover:shadow-[0_0_30px_rgba(255,133,187,0.38)]"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Claiming...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Claim 500 AniPoints
        </>
      )}
    </Button>
  );
}

export default function OnboardingForm() {
  const router = useRouter();
  const [state, formAction] = useActionState(completeOnboardingAction, initialState);

  useEffect(() => {
    if (!state.success) {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.push("/profile");
      router.refresh();
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [state.success, router]);

  const handleSkip = () => {
    router.push("/profile");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.32em] text-brand-pink">
          <Sparkles className="h-3.5 w-3.5" />
          Profile initialization
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">Choose your identity</h2>
          <p className="text-sm leading-6 text-white/60">
            Select a username and anime class to unlock your starter 500 AniPoints. Or skip to set it up later.
          </p>
        </div>
      </div>

      {state.success ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-200 shadow-[0_0_25px_rgba(74,222,128,0.12)]">
          {state.success}
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium text-white/80">
            Username
          </label>
          <Input
            id="username"
            name="username"
            placeholder="shadowpilot"
            minLength={3}
            maxLength={24}
            required
            className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/35 backdrop-blur-md focus-visible:border-brand-pink focus-visible:ring-brand-pink/30"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="anime_class" className="text-sm font-medium text-white/80">
            Anime class
          </label>
          <select
            id="anime_class"
            name="anime_class"
            required
            defaultValue=""
            className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none backdrop-blur-md transition-colors focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/30"
          >
            <option value="" disabled className="bg-[#0B0F19]">
              Select your archetype
            </option>
            {animeClasses.map((animeClass) => (
              <option key={animeClass} value={animeClass} className="bg-[#0B0F19]">
                {animeClass}
              </option>
            ))}
          </select>
        </div>

        {state.error ? (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {state.error}
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            onClick={handleSkip}
            variant="ghost"
            className="h-12 rounded-xl border border-white/10 text-white/80 hover:bg-white/10"
          >
            <X className="mr-2 h-4 w-4" />
            Skip
          </Button>
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
