import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) return NextResponse.json({ url: null });

  try {
    const res = await fetch(
      `https://weebcentral.com/search/simple?q=${encodeURIComponent(title)}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://weebcentral.com/",
        },
      }
    );

    const html = await res.text();

    // Extract first manga series URL from search results
    const match = html.match(
      /href="(https:\/\/weebcentral\.com\/series\/[^"]+)"/
    );
    const url = match ? match[1] : null;

    return NextResponse.json({ url });
  } catch (err) {
    console.error("WeebCentral fetch error:", err);
    return NextResponse.json({ url: null });
  }
}