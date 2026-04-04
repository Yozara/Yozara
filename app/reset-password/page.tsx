import AuthShell from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a strong password to secure your Yozara account."
      accentLabel="Account recovery"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">Create new password</h2>
          <p className="text-sm leading-6 text-white/60">
            Enter and confirm your new password. You will be redirected to login after success.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </AuthShell>
  );
}
