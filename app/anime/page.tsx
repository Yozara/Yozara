import { Metadata } from "next";
import { AnimeSearchClient } from "@/components/media/AnimeSearchClient";

export const metadata: Metadata = {
  title: "Discover Anime | Yozara",
  description: "Search and discover thousands of anime series. Filter by genre, status, and more.",
};

export default function AnimePage() {
  return <AnimeSearchClient />;
}
