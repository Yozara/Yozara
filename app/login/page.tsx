import { redirect } from "next/navigation";
import AuthForm from "@/components/auth/AuthForm";
import AuthShell from "@/components/auth/AuthShell";
import { createSupabaseServerClient } from "@/utils/supabase/server";

function getInitialEmail(searchParams?: { email?: string | string[] }) {
  const value = searchParams?.email;
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function getInitialMessage(searchParams?: { reset?: string | string[] }) {
  const value = searchParams?.reset;
  const resetStatus = Array.isArray(value) ? value[0] ?? "" : value ?? "";
  return resetStatus === "success"
    ? "Password updated successfully. You can sign in now."
    : "";
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { email?: string | string[]; reset?: string | string[] };
}) {
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
      title="Return to the archive"
      subtitle="Sign in to continue your watchlist, unlock AI recommendations, and resume the cinematic journey through Yozara."
      accentLabel="Yozara Access Gate"
    >
      <AuthForm
        mode="login"
        initialEmail={getInitialEmail(searchParams)}
        initialMessage={getInitialMessage(searchParams)}
      />
    </AuthShell>
  );
}