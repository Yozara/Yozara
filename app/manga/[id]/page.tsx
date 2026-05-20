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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://wallpaperaccess.com/full/14374140.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <p className="relative text-white/80 text-lg font-medium">
        Invalid manga ID
      </p>
    </div>
  );
}

  return <MangaDetailClient id={mangaId} />;
}
