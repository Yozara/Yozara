import { Metadata } from "next";
import { MangaDetailClient } from "@/components/media/MangaDetailClient";

interface MangaDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: MangaDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Manga #${id} | Yozara`,
    description: "Discover detailed information about this manga on Yozara",
  };
}

export default async function MangaDetailPage({
  params,
}: MangaDetailPageProps) {
  const { id } = await params;
  const mangaId = parseInt(id, 10);

  if (isNaN(mangaId)) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <p className="text-white/60">Invalid manga ID</p>
      </div>
    );
  }

  return <MangaDetailClient id={mangaId} />;
}
