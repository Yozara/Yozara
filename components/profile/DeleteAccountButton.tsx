"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to delete the account right now.");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete the account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!showConfirm ? (
        <Button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="h-12 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.14)] transition-all hover:bg-red-500/20 hover:text-white"
        >
          <AlertTriangle className="mr-2 h-4 w-4" />
          Delete Account
        </Button>
      ) : (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm leading-6 text-red-100/90">
            Sever your connection to Yozara? This permanently erases your account and profile.
          </p>
          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="h-10 rounded-lg border border-red-500/30 bg-red-500/20 text-red-100 hover:bg-red-500/30"
            >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
              Confirm Delete
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              className="h-10 rounded-lg border border-white/10 text-white/80 hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}