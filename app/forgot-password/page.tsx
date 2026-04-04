import AuthShell from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your account email and we will send a secure reset link."
      accentLabel="Password recovery"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-white">Forgot password</h2>
          <p className="text-sm leading-6 text-white/60">
            We will send a reset link to your inbox. Use that link to set a new password.
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </AuthShell>
  );
}
