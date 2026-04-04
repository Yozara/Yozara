import {
  SEARCH_MEDIA_QUERY,
  MEDIA_DETAILS_QUERY,
  TRENDING_MEDIA_QUERY,
  GENRES_AND_TAGS_QUERY,
} from "./queries";

const ANILIST_API_URL = "https://graphql.anilist.co";

// Cache for media details (1 hour TTL)
const detailsCache = new Map<
  number,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

async function anilistQuery(query: string, variables?: Record<string, any>) {
  try {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      const proxyError = data?.errors?.[0]?.message || response.statusText;
      throw new Error(`AniList API error: ${proxyError}`);
    }

    if (data.errors) {
      console.error("AniList GraphQL error:", data.errors);
      throw new Error(data.errors[0]?.message || "AniList query failed");
    }

    return data.data;
  } catch (error) {
    console.error("AniList API request failed:", error);
    throw error;
  }
}

export interface SearchFilters {
  search?: string;
  genre?: string[];
  status?: "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED";
  format?: string[];
  page?: number;
  sort?: string;
}

export async function searchMedia(
  type: "ANIME" | "MANGA",
  filters: SearchFilters
) {
  const { search, genre, status, format, page = 1, sort = "POPULARITY_DESC" } = filters;

  const variables = {
    search,
    type,
    page,
    genre,
    status,
    format,
    sort: [sort],
  };

  return anilistQuery(SEARCH_MEDIA_QUERY, variables);
}

export async function getMediaDetails(id: number) {
  // Check cache first
  const cached = detailsCache.get(id);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await anilistQuery(MEDIA_DETAILS_QUERY, { id });

  // Cache the result
  detailsCache.set(id, { data: data.Media, timestamp: Date.now() });

  return data.Media;
}

export async function getTrendingMedia(type: "ANIME" | "MANGA", page = 1) {
  const data = await anilistQuery(TRENDING_MEDIA_QUERY, { type, page });
  return data.Page;
}

export async function getGenresAndTags() {
  const data = await anilistQuery(GENRES_AND_TAGS_QUERY);
  return {
    genres: data.GenreCollection || [],
    tags: data.MediaTagCollection || [],
  };
}
