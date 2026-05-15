# HollyFlixHD — Master Project Prompt
> Copy and paste this entire prompt to generate the full project zip file.

---

## ✅ PROMPT TO GENERATE FULL PROJECT

---

Build me a complete, production-ready **Next.js 14** movie info website called **HollyFlixHD** (domain: hollyflixhd.com). This is a US-focused Hollywood movie information and database website. Generate the full project as a downloadable zip file with all files, folders, components, and configurations included.

---

### 🎯 PROJECT OVERVIEW

- **Site Name:** HollyFlixHD
- **Domain:** hollyflixhd.com
- **Target Audience:** United States
- **Purpose:** Movie info, cast, plot, ratings, streaming info — NO actual streaming
- **Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Movie Data Source:** TMDB API (The Movie Database) — data AND images
- **Image Source:** TMDB Image CDN (`https://image.tmdb.org/t/p/`) — NO Supabase, NO external storage
- **Attribution:** TMDB attribution logo and credit must appear in the footer on every page (TMDB requirement)
- **Monetization:** Google AdSense placements included in layout

> ⚠️ **IMPORTANT — TMDB Attribution Rule:**
> Per TMDB's terms of use, every page must display:
> - The TMDB logo in the footer
> - Text: "This product uses the TMDB API but is not endorsed or certified by TMDB."
> - A link back to https://www.themoviedb.org

---

### 📁 PROJECT STRUCTURE

Generate the following folder/file structure:

```
hollyflixhd/
├── app/
│   ├── layout.tsx                          ← Root layout with global SEO, Analytics
│   ├── page.tsx                            ← Homepage
│   ├── sitemap.ts                          ← Dynamic XML sitemap generator
│   ├── robots.ts                           ← robots.txt generator
│   ├── movies/
│   │   ├── page.tsx                        ← All movies listing page
│   │   └── [slug]/
│   │       └── page.tsx                    ← Individual movie detail page (MAIN PAGE)
│   ├── actors/
│   │   ├── page.tsx                        ← Actors listing
│   │   └── [slug]/
│   │       └── page.tsx                    ← Actor profile page
│   ├── directors/
│   │   └── [slug]/
│   │       └── page.tsx                    ← Director profile page
│   ├── genre/
│   │   ├── page.tsx                        ← All genres listing
│   │   └── [genre]/
│   │       └── page.tsx                    ← Genre movies page
│   ├── year/
│   │   └── [year]/
│   │       └── page.tsx                    ← Movies by year page
│   ├── top-rated/
│   │   └── page.tsx                        ← Top rated movies
│   ├── new-releases/
│   │   └── page.tsx                        ← New releases
│   ├── trending/
│   │   └── page.tsx                        ← Trending movies
│   └── search/
│       └── page.tsx                        ← Search results page
├── components/
│   ├── layout/
│   │   ├── Header.tsx                      ← Site header with search
│   │   ├── Footer.tsx                      ← Footer with links
│   │   └── Breadcrumb.tsx                  ← Breadcrumb navigation
│   ├── movie/
│   │   ├── MovieCard.tsx                   ← Movie card for listings
│   │   ├── MovieGrid.tsx                   ← Grid of movie cards
│   │   ├── MovieHero.tsx                   ← Movie page hero section
│   │   ├── CastSection.tsx                 ← Cast & crew section
│   │   ├── MovieDetails.tsx                ← Movie details sidebar
│   │   ├── RatingsSection.tsx              ← IMDb/RT/Metacritic ratings
│   │   ├── StreamingSection.tsx            ← Where to watch section
│   │   ├── WatchOnlineButton.tsx           ← 123movies redirect button
│   │   ├── SimilarMovies.tsx               ← Similar movies section
│   │   ├── FAQSection.tsx                  ← FAQ accordion section
│   │   └── TrailerSection.tsx              ← YouTube trailer embed
│   ├── seo/
│   │   ├── MovieSchema.tsx                 ← Movie JSON-LD schema
│   │   ├── BreadcrumbSchema.tsx            ← Breadcrumb JSON-LD schema
│   │   └── FAQSchema.tsx                   ← FAQ JSON-LD schema
│   └── ui/
│       ├── RatingBadge.tsx                 ← Star rating display
│       ├── GenreTag.tsx                    ← Genre tag pill
│       ├── SearchBar.tsx                   ← Search input component
│       └── AdSlot.tsx                      ← Google AdSense slot
├── lib/
│   ├── tmdb.ts                             ← TMDB API functions (data + images)
│   ├── tmdb-image.ts                       ← TMDB image URL helpers & size configs
│   ├── slugify.ts                          ← Slug generation utility
│   └── seo.ts                              ← SEO metadata generators
├── types/
│   └── movie.ts                            ← TypeScript type definitions
├── public/
│   ├── robots.txt
│   └── favicon.ico
├── .env.local.example                      ← Environment variables template
├── next.config.js                          ← Next.js config with image domains
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

### 🎬 MOVIE DETAIL PAGE — FULL REQUIREMENTS

The movie detail page (`app/movies/[slug]/page.tsx`) is the MOST important page. Build it with ALL of the following:

#### URL / SLUG
- Format: `/movies/[movie-title-lowercase-hyphenated]-[year]/`
- Example: `/movies/inception-2010/`
- Generated using the `slugify.ts` utility

#### Full SEO Metadata (Next.js generateMetadata)
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  // Fetch movie data from TMDB by slug
  // Return complete metadata object including:
  title: `${movie.title} (${movie.year}) - Cast, Plot & Rating | HollyFlixHD`
  description: `Discover ${movie.title} (${movie.year}) — ${movie.tagline}. Full cast, ${movie.director}, IMDb ${movie.imdbRating}/10 & where to watch.`
  keywords: [movie title, cast, plot, rating, streaming, director name, genre]
  canonical: `https://hollyflixhd.com/movies/${slug}/`
  openGraph: { type: 'video.movie', image from TMDB (w1280 size = 1280px wide), locale: en_US }
  twitter: { card: 'summary_large_image' }
  robots: { index: true, follow: true, max-image-preview: large }
}
```

#### Page Sections (in this exact order)
1. **Breadcrumb** — Home > Movies > [Genre] > [Movie Title]
2. **Movie Hero Section:**
   - Movie poster (from TMDB `w500` size — `https://image.tmdb.org/t/p/w500/[poster_path]`)
   - Title (H1) with year
   - Genre tags (linked to genre pages)
   - Runtime, Age Rating, Release Date, Language
   - IMDb rating badge
   - Short tagline/plot (2-3 sentences)
   - Two CTA buttons:
     - 🎬 **Watch Online** → opens `https://www.123movies.com/search/[movie-title]` in new tab with `rel="nofollow noopener noreferrer"`
     - 📋 **Full Details** → scrolls to details section
3. **Plot Summary** (H2) — full plot description from TMDB (200-400 words)
4. **Full Cast & Characters** (H2) — actor name + character name, linked to actor pages, with actor thumbnail from TMDB (`https://image.tmdb.org/t/p/w185/[profile_path]`)
5. **Director & Key Crew** (H2) — Director, Producer, Writer — all linked to their pages
6. **Movie Details** (H2) — release date, budget, box office, production company, original language, country, MPAA rating
7. **Ratings & Reviews** (H2) — IMDb, Rotten Tomatoes, Metacritic ratings displayed visually
8. **Awards & Nominations** (H2) — list major awards
9. **Watch Online / Streaming** (H2):
   - List streaming platforms (Netflix, HBO Max, Amazon Prime, Disney+, Apple TV) if available
   - Prominent **"Watch Online Free"** button → `https://www.123movies.com/search/[encoded-movie-title]` (new tab, nofollow)
10. **Trailer** (H2) — YouTube embed as facade (click to load, saves page speed)
11. **Similar Movies** (H2) — 6 movie cards linking to their detail pages
12. **FAQ Section** (H2) — 5-8 dynamically generated Q&A pairs about the movie
13. **User Reviews** (H2) — show 3 top reviews from TMDB

#### JSON-LD Schema Scripts (all three in `<head>`)
1. Movie schema (full, as shown in MOVIE_PAGE_SEO.md)
2. BreadcrumbList schema
3. FAQPage schema

---

### 🔧 TMDB API INTEGRATION (`lib/tmdb.ts`)

```typescript
// Base URL: https://api.themoviedb.org/3
// API Key from: process.env.TMDB_API_KEY

// Required functions:
getPopularMovies(page: number)
getTrendingMovies()
getTopRatedMovies(page: number)
getNewReleases(page: number)
getMovieBySlug(slug: string)           ← parse slug to get title + year, search TMDB
getMovieById(tmdbId: number)
getMovieCredits(tmdbId: number)         ← cast and crew
getSimilarMovies(tmdbId: number)
getMovieVideos(tmdbId: number)          ← trailers
getMoviesByGenre(genreId: number)
searchMovies(query: string)
getActorById(actorId: number)
getActorMovies(actorId: number)
generateSlug(title: string, year: number): string
```

---

### 🖼️ TMDB IMAGE INTEGRATION (`lib/tmdb-image.ts`)

All images are served directly from the TMDB image CDN. No external storage needed.

```typescript
// TMDB Image Base URL: https://image.tmdb.org/t/p/
// All image paths come from TMDB API responses (e.g. movie.poster_path)

// TMDB Image Sizes:
const TMDB_IMAGE_SIZES = {
  poster: {
    small:    'w185',    // Movie cards / thumbnails
    medium:   'w342',    // Medium listings
    large:    'w500',    // Movie detail page poster
    original: 'original' // Full quality
  },
  backdrop: {
    small:    'w300',    // Small previews
    medium:   'w780',    // Medium banners
    large:    'w1280',   // Hero banners & OG images
    original: 'original'
  },
  profile: {
    small:    'w45',     // Tiny actor thumbnails
    medium:   'w185',    // Actor cards
    large:    'h632',    // Actor detail page
  }
}

// Required helper functions:
getMoviePosterUrl(posterPath: string, size?: string): string
// → https://image.tmdb.org/t/p/w500/[posterPath]

getMovieBackdropUrl(backdropPath: string, size?: string): string
// → https://image.tmdb.org/t/p/w1280/[backdropPath]

getActorImageUrl(profilePath: string, size?: string): string
// → https://image.tmdb.org/t/p/w185/[profilePath]

getOgImageUrl(backdropPath: string): string
// → https://image.tmdb.org/t/p/w1280/[backdropPath]
// Used for Open Graph / Twitter card images

// Fallback placeholder for missing images:
const FALLBACK_POSTER = '/images/no-poster.webp'       // local fallback
const FALLBACK_ACTOR  = '/images/no-actor.webp'        // local fallback
const FALLBACK_BACKDROP = '/images/no-backdrop.webp'   // local fallback
```

---

### 🎨 DESIGN REQUIREMENTS

- **Color Scheme:** Dark theme — Deep black (#0a0a0a) background, dark gray (#1a1a1a) cards, gold (#f5c518) accents for ratings (IMDb style)
- **Font:** Inter for body, Bebas Neue or Oswald for movie titles
- **Movie Cards:** Poster thumbnail + title + year + rating badge + genre tag
- **Hover Effects:** Subtle scale + shadow on movie cards
- **Rating Badges:** Gold color for IMDb, red for Rotten Tomatoes, green for Metacritic
- **Watch Online Button:** Bright red (#e50914 Netflix red) with play icon, prominent placement
- **Mobile First:** All layouts must be mobile-responsive
- **Layout:** Clean, minimal — focus on content, no clutter

---

### 📍 HOMEPAGE SECTIONS

1. **Hero Banner** — Featured/trending movie with full backdrop image
2. **Search Bar** — prominent, centered, with placeholder "Search for any movie..."
3. **Trending Now** — horizontal scroll of movie cards
4. **New Releases** — grid of latest movies
5. **Top Rated** — grid of highest rated movies
6. **Browse by Genre** — genre pills/cards
7. **Popular Actors** — actor thumbnails

---

### 🔗 WATCH ONLINE BUTTON IMPLEMENTATION

```tsx
// WatchOnlineButton.tsx
// Always use: rel="nofollow noopener noreferrer"
// Always open in new tab: target="_blank"
// Redirect URL: https://www.123movies.com/search/[encoded movie title]

const watchUrl = `https://www.123movies.com/search/${encodeURIComponent(movieTitle)}`

<a
  href={watchUrl}
  target="_blank"
  rel="nofollow noopener noreferrer"
  className="watch-online-btn"
>
  🎬 Watch Online Free
</a>
```

---

### ⚙️ NEXT.JS CONFIG (`next.config.js`)

```javascript
// Must include TMDB image domain:
images: {
  domains: [
    'image.tmdb.org',   // All TMDB images (posters, backdrops, actor photos)
  ],
  formats: ['image/webp'],
}
// ✅ Deployment: Vercel — do NOT use output: 'standalone' (Vercel auto-detects Next.js and manages build output)
```

---

### 🌍 SEO CONFIGURATION

#### `app/robots.ts`
```typescript
// Generate:
// Allow: /
// Disallow: /api/, /admin/, /search?
// Sitemap: https://hollyflixhd.com/sitemap.xml
```

#### `app/sitemap.ts`
```typescript
// Dynamic sitemap that includes:
// - Static pages (homepage, /movies, /genre, /top-rated, /new-releases, /trending)
// - All movie pages with lastModified dates
// - All actor pages
// - All genre pages
// Priority: homepage=1.0, movies=0.9, actors=0.7, genres=0.8
// changeFrequency: movies=weekly, actors=monthly
```

---

### 📦 ENVIRONMENT VARIABLES (`.env.local.example`)

```env
# TMDB API (data + images) — get your key at https://www.themoviedb.org/settings/api
TMDB_API_KEY=your_tmdb_api_key_here
TMDB_BASE_URL=https://api.themoviedb.org/3
TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Site
NEXT_PUBLIC_SITE_URL=https://hollyflixhd.com
NEXT_PUBLIC_SITE_NAME=HollyFlixHD

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google AdSense
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX
```

---

### 📦 PACKAGE.JSON DEPENDENCIES

```json
{
  "dependencies": {
    "next": "14.x",
    "react": "18.x",
    "react-dom": "18.x",
    "typescript": "5.x",
    "tailwindcss": "3.x",
    "@tailwindcss/typography": "latest",
    "lucide-react": "latest",
    "next-seo": "latest",
    "slugify": "latest"
  }
}
```

---

### ✅ DELIVERABLES

Generate and provide:
1. **Complete Next.js project** — all files, folders, components
2. **Working TMDB API integration** — real movie data AND images
3. **Full SEO implementation** — metadata, schema, sitemap, robots
4. **Watch Online button** — properly linked to 123movies with nofollow
5. **Responsive dark UI** — mobile first, Tailwind CSS
6. **All pages working** — movie detail, actor, genre, year, home, search
7. **TMDB attribution** — logo + credit text in footer on every page
8. **README.md** — setup instructions, TMDB API key guide, Vercel deployment steps (not shared hosting — this project requires Node.js runtime)

---

### 📌 ADDITIONAL NOTES

- Use **Next.js App Router** (not Pages Router)
- Use **TypeScript** throughout
- Use **Server Components** where possible for better SEO
- Every page must have **generateMetadata** function
- All movie pages use **generateStaticParams** for static generation
- **All images from TMDB CDN** (`https://image.tmdb.org/t/p/`) — no external storage needed
- **TMDB Attribution required** on every page — logo + "This product uses the TMDB API but is not endorsed or certified by TMDB." in footer with link to themoviedb.org
- No actual video streaming — only info + external Watch Online link
- AdSense placeholder slots in Header, Sidebar, and between sections
- Local fallback images (`/public/images/`) for when TMDB images are unavailable
- Include a **README.md** with full setup and deployment instructions

---

*Prompt Version: 2.0 | Project: HollyFlixHD.com | Updated: Removed Supabase, TMDB handles all data + images | Use this prompt to regenerate or update the full project at any time.*
