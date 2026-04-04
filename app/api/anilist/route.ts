import { NextResponse } from "next/server";

const ANILIST_API_URL = "https://graphql.anilist.co";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function postWithRetry(query: string, variables?: Record<string, unknown>) {
  let lastStatus = 500;
  let lastMessage = "Unknown AniList error";

  for (let attempt = 0; attempt < 3; attempt += 1) {
    const response = await fetch(ANILIST_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Yozara/1.0 (+https://yozara.in)",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (response.ok) {
      return response.json();
    }

    lastStatus = response.status;
    const text = await response.text();
    lastMessage = text || response.statusText || "AniList request failed";

    if (!RETRYABLE_STATUS.has(response.status) || attempt === 2) {
      break;
    }

    // Exponential backoff to handle AniList rate limits.
    await sleep(250 * (attempt + 1));
  }

  return {
    errors: [{ message: `AniList API error (${lastStatus}): ${lastMessage}` }],
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = typeof body?.query === "string" ? body.query : "";
    const variables = body?.variables;

    if (!query) {
      return NextResponse.json(
        { errors: [{ message: "Missing GraphQL query" }] },
        { status: 400 }
      );
    }

    const data = await postWithRetry(query, variables);

    if (data?.errors) {
      return NextResponse.json(data, { status: 502 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        errors: [
          {
            message:
              error instanceof Error
                ? error.message
                : "Unexpected AniList proxy error",
          },
        ],
      },
      { status: 500 }
    );
  }
}
