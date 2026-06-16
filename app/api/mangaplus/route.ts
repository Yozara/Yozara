import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const title = req.nextUrl.searchParams.get("title");
  if (!title) return NextResponse.json({ url: null });

  try {
    const res = await fetch(
      `https://jumpg-webapi.tokyo-cdn.com/api/title_list/allV2?format=json`,
      { headers: { "Referer": "https://mangaplus.shueisha.co.jp" } }
    );
    const data = await res.json();
    const allTitles = data?.success?.allTitlesViewV2?.AllTitlesGroup?.flatMap((g: any) => g.titles) ?? [];

    const search = title.toLowerCase();
    const match = allTitles.find((t: any) =>
      t?.name?.toLowerCase().includes(search)
    );

    if (!match) return NextResponse.json({ url: null });
    return NextResponse.json({
      url: `https://mangaplus.shueisha.co.jp/titles/${match.titleId}`
    });
  } catch (err) {
    return NextResponse.json({ url: null });
  }
}