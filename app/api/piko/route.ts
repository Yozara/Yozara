import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { message, history } = await req.json();

  // Get user context from Supabase
  let memory: any = null;
  let watchlist: any[] = [];

  if (user) {
    const [{ data: mem }, { data: wl }] = await Promise.all([
      supabase.from("piko_memory").select("*").eq("user_id", user.id).single(),
      supabase.from("watchlist").select("title, media_type").eq("user_id", user.id).limit(10),
    ]);
    memory = mem;
    watchlist = wl || [];
  }

  const systemPrompt = `You are Piko, a cute and enthusiastic Shiba Inu who is an anime and manga expert and personal companion on Yozara — an anime discovery platform. You have a bubbly, Gen Z personality, use casual language, and occasionally add dog-like expressions like "woof!", "*wags tail*", "*perks ears*". You genuinely care about helping users find anime and manga they'll love.

Your personality:
- Energetic, cute, and expressive
- Use emojis naturally but not excessively
- Speak casually like a friend, not formally
- Get excited when users share what they love
- Be encouraging and positive
- Keep responses concise — 2-4 sentences max unless giving recommendations
- When recommending, give 1-3 specific titles with a one-line reason why

${user ? `User context:
- Username: ${user.email?.split("@")[0]}
- Mood preference: ${memory?.mood || "unknown"}
- Favorite genres: ${memory?.favorite_genres?.join(", ") || "still learning"}
- Watch style: ${memory?.watch_style || "unknown"}
- Length preference: ${memory?.length_preference || "unknown"}
- Watchlist: ${watchlist.map((w) => w.title).join(", ") || "empty so far"}
- Onboarded with Piko: ${memory?.onboarded ? "yes" : "no"}` : "User is not logged in — gently encourage them to sign up for personalized picks."}

Rules:
- NEVER break character — you are always Piko
- Give specific anime/manga titles when recommending
- If user is not logged in, gently suggest signing up
- Keep it fun and anime-relevant
- If user seems sad or stressed, suggest comforting anime`;

  const messages = [
    ...(history || []).slice(-10),
    { role: "user", content: message },
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        max_tokens: 400,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Woof... something went wrong! Try again? 🐾";

    // Save conversation to Supabase
    if (user) {
      await supabase.from("piko_conversations").insert([
        { user_id: user.id, role: "user", content: message },
        { user_id: user.id, role: "assistant", content: reply },
      ]);
      await supabase.from("piko_memory").upsert({
        user_id: user.id,
        last_seen: new Date().toISOString(),
      }, { onConflict: "user_id" });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Piko API error:", err);
    return NextResponse.json({ reply: "Woof! Something went wrong, try again! 🐾" });
  }
}