import Image from "next/image";
import { MoonStar, ShieldCheck, Sparkles } from "lucide-react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  accentLabel: string;
  children: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  accentLabel,
  children,
}: AuthShellProps) {
  return (
    <section className="min-h-screen bg-[#0B0F19] text-brand-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative isolate overflow-hidden border-b border-white/10 lg:border-b-0 lg:border-r lg:border-white/10">
          <div className="absolute inset-0">
            <Image
              src="/hero-image.jpg"
              alt="Cinematic anime backdrop"
              fill
              priority
              className="object-cover object-center scale-110 blur-[1px] opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/10 via-[#0B0F19]/55 to-[#0B0F19]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,133,187,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />
          </div>

          <div className="relative flex min-h-[40vh] flex-col justify-end px-6 py-12 sm:px-10 lg:min-h-screen lg:px-14 lg:py-16">
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-brand-pink backdrop-blur-md">
                <Sparkles className="h-4 w-4" />
                {accentLabel}
              </div>

              <div className="space-y-4">
                <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-white/75 sm:text-lg">
                  {subtitle}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: MoonStar,
                    title: "Dark Cinematic UI",
                    description: "Glass panels, glowing accents, and immersive contrast.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Secure Sessions",
                    description: "Auth powered by Supabase SSR and server actions.",
                  },
                  {
                    icon: Sparkles,
                    title: "500 AniPoints",
                    description: "Every new explorer starts with a welcome stash.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-white/8 p-4 backdrop-blur-md shadow-[0_0_25px_rgba(255,133,187,0.08)]"
                  >
                    <item.icon className="mb-3 h-5 w-5 text-brand-pink" />
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-white/65">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_50px_rgba(255,133,187,0.12)] backdrop-blur-xl sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}