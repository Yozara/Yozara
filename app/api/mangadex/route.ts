import { NextRequest, NextResponse } from "next/server";

function normalize(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) return NextResponse.json({ url: null });

  try {
    // Step 1: Search with higher limit to find best match
    const searchRes = await fetch(
      `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=10&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`,
      { headers: { Accept: "application/json" } }
    );
    const searchData = await searchRes.json();
    const results = searchData?.data || [];
    if (!results.length) return NextResponse.json({ url: null });

    const normalizedQuery = normalize(title);

    // Step 2: Find the best matching manga by comparing titles
    let bestMatch = results[0];
    for (const item of results) {
      const titles = [
        item.attributes?.title?.en,
        item.attributes?.title?.ja,
        item.attributes?.title?.["ja-ro"],
        ...Object.values(item.attributes?.title || {}),
        ...(item.attributes?.altTitles || []).flatMap((t: any) => Object.values(t)),
      ].filter(Boolean) as string[];

      const isExactMatch = titles.some(
        (t) => normalize(t) === normalizedQuery
      );

      if (isExactMatch) {
        bestMatch = item;
        break;
      }
    }

    const mangaId = bestMatch.id;

    // Step 3: Get first English chapter
    const chapterRes = await fetch(
      `https://api.mangadex.org/chapter?manga=${mangaId}&translatedLanguage[]=en&order[chapter]=asc&limit=1&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica`,
      { headers: { Accept: "application/json" } }
    );
    const chapterData = await chapterRes.json();
    const chapter = chapterData?.data?.[0];

    if (chapter) {
      return NextResponse.json({
        url: `https://mangadex.org/chapter/${chapter.id}`,
      });
    }

    // Fallback to manga page
    const slug = (
      bestMatch.attributes?.title?.en ||
      Object.values(bestMatch.attributes?.title || {})[0] ||
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
