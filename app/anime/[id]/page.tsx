import { Metadata } from "next";
import { AnimeDetailClient } from "@/components/media/AnimeDetailClient";

interface AnimeDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: AnimeDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Anime #${id} | Yozara`,
    description: "Discover detailed information about this anime on Yozara",
  };
}

export default async function AnimeDetailPage({
  params,
}: AnimeDetailPageProps) {
  const { id } = await params;
  const animeId = parseInt(id, 10);

  if (isNaN(animeId)) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
        <p className="text-white/60">Invalid anime ID</p>
      </div>
    );
  }

  return <AnimeDetailClient id={animeId} />;
}
