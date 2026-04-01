import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// We use the service_role key here to bypass RLS and securely delete the auth user
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { userId, email } = await request.json();

    if (!userId || !email) {
      return NextResponse.json({ error: "Missing user data" }, { status: 400 });
    }

    // 1. Send the Goodbye Email via Resend
    await resend.emails.send({
      from: "Yozara <no-reply@yozara.in>",
      to: email,
      subject: "Your Yozara account has been deleted",
      html: `
        <div style="font-family: sans-serif; padding: 20px; background-color: #021A54; color: #F5F5F5;">
          <h1 style="color: #FF85BB;">Yozara.</h1>
          <p>Your account has been successfully deleted along with all your data.</p>
          <p>We are sad to see you go. If you ever want to return to the anime universe, you are always welcome back.</p>
        </div>
      `,
    });

    // 2. Delete the user from Supabase Auth completely
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) throw error;

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Deletion error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}