"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AuthState = {
  error?: string;
  success?: string;
};

async function getRedirectBase() {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

function sanitizeValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function signInAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = sanitizeValue(formData.get("email"));
  const password = sanitizeValue(formData.get("password"));

  if (!email || !password) {
    return { error: "Enter your email and password to continue." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return { error: "Unable to verify your session. Please try again." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, anime_class")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    return { error: profileError.message };
  }

  if (!profile?.username || !profile?.anime_class) {
    redirect("/onboarding");
  }

  redirect("/profile");
}

export async function signUpAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = sanitizeValue(formData.get("email"));
  const password = sanitizeValue(formData.get("password"));

  if (!email || !password) {
    return { error: "Enter your email and password to begin your journey." };
  }

  const supabase = await createSupabaseServerClient();
  const redirectBase = await getRedirectBase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${redirectBase}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    // If user already exists, redirect to login with email prefilled
    if (
      error.code === "user_already_exists" ||
      error.message?.includes("already registered")
    ) {
      redirect(`/login?email=${encodeURIComponent(email)}`);
    }
    return { error: error.message };
  }

  if (data.session) {
    redirect("/onboarding");
  }

  return {
    success:
      "Check your email to finish opening the gate. Your Yozara journey begins there.",
  };
}

export async function completeOnboardingAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const username = sanitizeValue(formData.get("username"));
  const animeClass = sanitizeValue(formData.get("anime_class"));

  if (!username || !animeClass) {
    return { error: "Choose a username and anime class to claim your AniPoints." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;

  if (!user) {
    return { error: "Your session expired. Please log in again." };
  }

  // Use UPDATE instead of UPSERT since the profile row is auto-created by trigger
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      anime_class: animeClass,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return { error: "That username is already taken. Try another one." };
    }

    return { error: error.message };
  }

  return {
    success: "Claimed 500 AniPoints. Your Yozara profile is now live.",
  };
}