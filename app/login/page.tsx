"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Sparkles, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [view, setView] = useState<"sign-in" | "sign-up" | "magic-link">("sign-in");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const supabase = createClient();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents page reload
    console.log("Button clicked! Attempting:", view); // THIS SHOULD SHOW IN CONSOLE
    
    setLoading(true);
    setMessage(null);

    try {
      if (view === "sign-up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Check your email for the link!" });
      } else if (view === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Magic link sent!" });
      }
    } catch (error: any) {
      console.error("Auth Error:", error.message);
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-blue flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl relative z-10">
        
        <h1 className="text-2xl font-bold text-brand-white text-center mb-8">
          {view === "sign-in" ? "Sign In" : view === "sign-up" ? "Sign Up" : "Magic Link"}
        </h1>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="bg-white/5 border-white/10 text-white"
          />
          
          {view !== "magic-link" && (
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="bg-white/5 border-white/10 text-white"
            />
          )}

          {message && (
            <div className={`p-3 rounded text-sm ${message.type === "error" ? "text-red-400 bg-red-400/10" : "text-emerald-400 bg-emerald-400/10"}`}>
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full bg-brand-pink text-brand-blue font-bold">
            {loading ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <button onClick={() => setView(view === "sign-in" ? "sign-up" : "sign-in")} className="text-brand-pink hover:underline">
            {view === "sign-in" ? "Need an account? Sign Up" : "Have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}