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
  const confirmPassword = sanitizeValue(formData.get("confirm_password"));

  if (!email || !password) {
    return { error: "Enter your email and password to begin your journey." };
  }

  if (password.length < 8) {
    return { error: "Use a password with at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
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

  // Supabase can return no error but empty identities for already-existing users.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    redirect(`/login?email=${encodeURIComponent(email)}`);
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

export async function changePasswordAction(
  _previousState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const currentPassword = sanitizeValue(formData.get("current_password"));
  const newPassword = sanitizeValue(formData.get("new_password"));
  const confirmPassword = sanitizeValue(formData.get("confirm_password"));

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Fill in all password fields." };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "New password and confirmation do not match." };
  }

  if (currentPassword === newPassword) {
    return { error: "New password must be different from current password." };
  }

  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user?.email) {
    return { error: "Session expired. Please log in again." };
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: currentPassword,
  });

  if (verifyError) {
    return { error: "Current password is incorrect." };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: "Password updated successfully." };
}