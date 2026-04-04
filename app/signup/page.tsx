import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function SignupPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (userData.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, anime_class")
      .eq("id", userData.user.id)
      .maybeSingle();

    if (!profile?.username || !profile?.anime_class) {
      redirect("/onboarding");
    }

    redirect("/profile");
  }

  return (
    <AuthShell
      title="Begin your journey"
      subtitle="Create your Yozara account, claim your starter AniPoints, and set your anime identity before stepping into the recommendation engine."
      accentLabel="New user initiation"
    >
      <AuthForm mode="signup" />
    </AuthShell>
  );
}