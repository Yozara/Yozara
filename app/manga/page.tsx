import { Metadata } from "next";
import { MangaSearchClient } from "@/components/media/MangaSearchClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Discover Manga | Yozara",
  description: "Search and discover thousands of manga series. Filter by genre, status, and more.",
};

export default function MangaPage() {
  return <MangaSearchClient />;
}
