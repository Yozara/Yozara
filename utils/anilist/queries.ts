// AniList GraphQL Queries for anime and manga

export const SEARCH_MEDIA_QUERY = `
  query SearchMedia($search: String, $type: MediaType, $page: Int, $genre: [String], $status: MediaStatus, $format: [MediaFormat], $onList: Boolean, $sort: [MediaSort]) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        total
        currentPage
        hasNextPage
        lastPage
      }
      media(search: $search, type: $type, genre_in: $genre, status: $status, format_in: $format, onList: $onList, sort: $sort, isAdult: false) {
        id
        title {
          romaji
          english
          native
        }
        popularity
        averageScore
        meanScore
        favourites
        episodes
        chapters
        duration
        status
        type
        format
        genres
        coverImage {
          large
          extraLarge
        }
        bannerImage
        season
        seasonYear
        studios(isMain: true) {
          nodes {
            name
          }
        }
      }
    }
  }
`;

export const MEDIA_DETAILS_QUERY = `
  query MediaDetails($id: Int) {
    Media(id: $id) {
      id
      title {
        romaji
        english
        native
      }
      description
      popularity
      averageScore
      meanScore
      favourites
      episodes
      chapters
      volumes
      duration
      status
      type
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      format
      genres
      isAdult
      countryOfOrigin
      tags {
        name
        rank
      }
      coverImage {
        large
        extraLarge
      }
      bannerImage
      season
      seasonYear
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
      studios(isMain: true) {
        nodes {
          id
          name
          siteUrl
        }
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              romaji
              english
            }
            type
            format
            coverImage {
              large
            }
          }
        }
      }
      characters(page: 1, perPage: 6) {
        edges {
          role
          node {
            id
            name {
              full
            }
            image {
              large
            }
          }
        }
      }
      recommendations(page: 1, perPage: 4) {
        nodes {
          mediaRecommendation {
            id
            title {
              romaji
              english
            }
            format
            type
            coverImage {
              large
            }
          }
        }
      }
      externalLinks {
        site
        url
      }
      siteUrl
      source
      trailer {
        id
        site
        thumbnail
      }
    }
  }
`;

export const TRENDING_MEDIA_QUERY = `
  query TrendingMedia($type: MediaType, $page: Int) {
    Page(page: $page, perPage: 20) {
      media(type: $type, sort: [TRENDING_DESC], isAdult: false) {
        id
        type
        title {
          romaji
          english
        }
        popularity
        averageScore
        episodes
        chapters
        coverImage {
          large
          extraLarge
        }
        bannerImage
        trailer {
          id
          site
        }
        season
        seasonYear
        genres
      }
    }
  }
`;

export const GENRES_AND_TAGS_QUERY = `
  query {
    GenreCollection
    MediaTagCollection {
      name
    }
  }
`;
