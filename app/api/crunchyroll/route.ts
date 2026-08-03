import { NextRequest, NextResponse } from "next/server";

function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) return NextResponse.json({ url: null });

  try {
    const res = await fetch(
      `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
        },
      }
    );

    const html = await res.text();
    const normalizedQuery = normalize(title);

    // Extract all series links from search results
    const matches = [...html.matchAll(/href="(\/series\/[^"]+)"/g)];
    
    for (const match of matches) {
      const path = match[1];
      const slug = path.split("/").pop() || "";
      if (normalize(slug).includes(normalizedQuery.slice(0, 6))) {
        return NextResponse.json({ url: `https://www.crunchyroll.com${path}` });
      }
    }

    // Fallback: direct search URL
    return NextResponse.json({
      url: `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
    });
  } catch (err) {
    console.error("Crunchyroll fetch error:", err);
    return NextResponse.json({
      url: `https://www.crunchyroll.com/search?q=${encodeURIComponent(title)}`,
    });
  }
}