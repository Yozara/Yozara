import { redirect } from "next/navigation";
import PasswordChangeForm from "@/components/auth/PasswordChangeForm";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export default async function SettingsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    redirect("/login");
  }

  return (
    <section className="min-h-screen bg-[#0B0F19] px-4 py-28 text-brand-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-[0_0_40px_rgba(255,133,187,0.1)] backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Security Settings</h1>
          <p className="mt-2 text-sm text-white/60">
            Update your account password to keep your Yozara access secure.
          </p>

          <div className="mt-8">
            <PasswordChangeForm />
          </div>
        </div>
      </div>
    </section>
  );
}