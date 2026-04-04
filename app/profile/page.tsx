import { redirect } from "next/navigation";
import { BadgeCheck, Crown, Sparkles } from "lucide-react";
import DeleteAccountButton from "@/components/profile/DeleteAccountButton";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, anime_class, anipoints_balance, avatar_url")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (!profile?.username || !profile?.anime_class) {
    redirect("/onboarding");
  }

  const balance = profile.anipoints_balance ?? 500;

  return (
    <section className="min-h-screen bg-[#0B0F19] px-4 py-28 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_0_40px_rgba(255,133,187,0.12)] backdrop-blur-xl">
          <div className="relative border-b border-white/10 px-6 py-8 sm:px-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,133,187,0.18),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_55%)]" />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-brand-pink backdrop-blur-md">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Guild card
                </div>
                <div className="space-y-2">
                  <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    {profile.username}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
                    Your Yozara profile is active. Use this space to track your anime class, AniPoints,
                    and future community resonance.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-brand-pink/20 bg-brand-pink/10 px-5 py-4 shadow-[0_0_22px_rgba(255,133,187,0.18)] backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-white/60">AniPoints balance</p>
                <div className="mt-2 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-brand-pink" />
                  <span className="text-3xl font-semibold text-white">{balance}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-8 sm:px-8 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-white/45">Username</p>
                <p className="mt-3 text-2xl font-semibold text-white">{profile.username}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-white/45">Anime class</p>
                <p className="mt-3 text-xl font-semibold text-brand-pink">{profile.anime_class}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:col-span-2">
                <p className="text-xs uppercase tracking-[0.3em] text-brand-white/45">Status</p>
                <div className="mt-3 flex items-center gap-3 text-sm text-white/75">
                  <Crown className="h-4 w-4 text-brand-pink" />
                  Welcome back, pilot. Your next recommendations will be tuned to your taste profile.
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-red-500/15 bg-red-500/5 p-5 backdrop-blur-md">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-red-200/70">Danger Zone</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Account Management</h2>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  Sensitive account actions are hidden by default. Click delete to reveal the final confirmation step.
                </p>
              </div>

              <DeleteAccountButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}