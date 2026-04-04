"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Sever your connection to Yozara? This will permanently erase your account and profile."
    );

    if (!confirmed) {
      return;
    }

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
    <Button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="h-12 rounded-xl border border-red-500/20 bg-red-500/10 text-red-100 shadow-[0_0_18px_rgba(248,113,113,0.14)] transition-all hover:bg-red-500/20 hover:text-white"
    >
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
      Sever Connection to Yozara
    </Button>
  );
}