import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) return NextResponse.json({ url: null });

  try {
    // Step 1: Search for the manga
    const searchRes = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=1&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`,
      { headers: { Accept: "application/json" } }
    );
    const searchData = await searchRes.json();
    const manga = searchData?.data?.[0];
    if (!manga) return NextResponse.json({ url: null });

    const mangaId = manga.id;

    // Step 2: Get the first English chapter
    const chapterRes = await fetch(
      `https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc&limit=1&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`,
      { headers: { Accept: "application/json" } }
    );
    const chapterData = await chapterRes.json();
    const chapter = chapterData?.data?.[0];

    if (chapter) {
      // Direct link to reading the first chapter
      return NextResponse.json({
        url: `https://mangadex.org/chapter/${chapter.id}`,
      });
    }

    // Fallback to manga page if no chapter found
    const slug = (
      manga.attributes?.title?.en ||
      Object.values(manga.attributes?.title || {})[0] ||
      "manga"
    )
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    return NextResponse.json({
      url: `https://mangadex.org/title/${mangaId}/${slug}`,
    });
  } catch (err) {
    console.error("MangaDex API error:", err);
    return NextResponse.json({ url: null });
  }
}
