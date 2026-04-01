"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Fetch the logged-in user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm("Are you absolutely sure? This cannot be undone.");
    if (!confirmDelete || !user) return;

    setLoading(true);

    try {
      // Call our secure API route
      const res = await fetch("/api/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });

      if (res.ok) {
        // Sign them out of the browser completely
        await supabase.auth.signOut();
        window.location.href = "/"; // Send back to home
      } else {
        alert("Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (!user) return <div className="min-h-screen bg-brand-blue p-8 text-brand-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-brand-blue p-8 pt-24">
      <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-brand-white mb-8">Account Settings</h1>
        
        <div className="mb-8 p-4 bg-black/20 rounded-lg border border-white/5">
          <p className="text-brand-white/60 text-sm">Logged in as</p>
          <p className="text-brand-white font-medium text-lg">{user.email}</p>
        </div>

        <div className="border-t border-red-500/20 pt-8 mt-8">
          <h2 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h2>
          <p className="text-brand-white/60 mb-6 text-sm">
            Once you delete your account, there is no going back. All of your watchlists and data will be permanently wiped.
          </p>
          <Button 
            onClick={handleDeleteAccount} 
            disabled={loading}
            variant="destructive"
            className="bg-red-500 hover:bg-red-600 text-white font-bold"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
            Permanently Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}