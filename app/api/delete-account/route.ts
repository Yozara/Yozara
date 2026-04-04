import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DELETION_EMAIL_HTML = `<div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0B0F19; color: #ffffff; padding: 40px 20px; text-align: center; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1a202c;">
  <img src="https://yozara.in/logo.png" alt="Yozara" width="60" style="display: block; margin: 0 auto 20px auto; opacity: 0.5; filter: grayscale(100%);">
  <h1 style="color: #ffffff; font-size: 24px; margin-bottom: 10px;">The Journey Ends Here.</h1>
  <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin-bottom: 30px; padding: 0 20px;">
    As requested, your Guild Card has been destroyed. Your watch history has been wiped, and your <strong>AniPoints</strong> have been scattered back into the void. Your account has been permanently deleted.
  </p>
  <p style="color: #a0aec0; font-size: 16px; line-height: 1.6; margin-bottom: 40px; padding: 0 20px;">
    It was an honor having you in the guild. If you ever wish to reincarnate and start anew, the gates of Yozara will always be open to you.
  </p>
  <a href="https://yozara.in" style="background-color: transparent; color: #FFCEE3; border: 1px solid #FFCEE3; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block; transition: all 0.3s ease;">
    Return to the Void (Homepage)
  </a>
</div>`;

async function sendDeletionEmail(email: string) {
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "noreply@yozara.in",
        to: email,
        subject: "Your Yozara Guild Card Has Been Retired",
        html: DELETION_EMAIL_HTML,
      }),
    });
  } catch (error) {
    console.error("Failed to send deletion email:", error);
    // Don't throw - deletion was successful, email is just a courtesy
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options);
              });
            } catch {
              // The route only needs to read the active session here.
            }
          },
        },
      }
    );

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userEmail = userData.user.email;

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

    if (error) throw error;

    // Send deletion confirmation email
    if (userEmail) {
      await sendDeletionEmail(userEmail);
    }

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Deletion error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
