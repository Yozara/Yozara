import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) return NextResponse.json({ url: null });

  try {
    const res = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`,
      {
        headers: {
          "Accept": "application/json",
        },
        next: { revalidate: 3600 },
      }
    );

    const data = await res.json();
    const manga = data?.data?.[0];

    if (!manga) return NextResponse.json({ url: null });

    const id = manga.id;
    const slug =
      manga.attributes?.title?.en ||
      Object.values(manga.attributes?.title || {})[0] ||
      "manga";

    const slugified = (slug as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const url = `https://mangadex.org/title/${id}/${slugified}`;
    return NextResponse.json({ url });
  } catch (err) {
    console.error("MangaDex API error:", err);
    return NextResponse.json({ url: null });
  }
}