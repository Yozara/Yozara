import { redirect } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import OnboardingForm from "@/components/auth/OnboardingForm";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function OnboardingPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, anime_class")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (profile?.username && profile?.anime_class) {
    redirect("/profile");
  }

  return (
    <AuthShell
      title="Claim your Yozara identity"
      subtitle="Choose how the community knows you, assign your anime class, and unlock your 500 AniPoints starter reward."
      accentLabel="Profile onboarding"
    >
      <OnboardingForm />
    </AuthShell>
  );
}