# HollyFlixHD — Movie Details Page: Complete SEO Specification
> Every single SEO requirement for individual movie pages on hollyflixhd.com

---

## 1. URL / SLUG

### Format
```
https://hollyflixhd.com/movies/[movie-title-slug]-[year]/
```

### Slug Rules
- All **lowercase**
- **Hyphens** between words (no underscores, no spaces)
- Include **release year** at end to avoid conflicts
- Remove special characters (colons, apostrophes, exclamation marks)
- Keep **"the"** only if essential to title recognition
- Maximum **70 characters** total slug length
- Always end with **trailing slash** for consistency

### Slug Examples
```
Inception (2010)              → /movies/inception-2010/
The Dark Knight (2008)        → /movies/the-dark-knight-2008/
Avengers: Endgame (2019)      → /movies/avengers-endgame-2019/
Spider-Man: No Way Home (2021)→ /movies/spider-man-no-way-home-2021/
It's a Wonderful Life (1946)  → /movies/its-a-wonderful-life-1946/
2001: A Space Odyssey (1968)  → /movies/2001-a-space-odyssey-1968/
Se7en (1995)                  → /movies/se7en-1995/
Don't Look Up (2021)          → /movies/dont-look-up-2021/
```

---

## 2. PAGE TITLE TAG

### Format
```
[Movie Title] ([Year]) - Cast, Plot, Rating & Streaming | HollyFlixHD
```

### Rules
- Maximum **60 characters** (Google truncates beyond this)
- Include **movie title** (primary keyword)
- Include **year** in parentheses
- Include **secondary keywords**: cast, plot, rating
- End with **brand name**: HollyFlixHD
- Never duplicate title tags across pages

### Examples
```
✅ Inception (2010) - Cast, Plot, Rating & Streaming | HollyFlixHD
✅ The Dark Knight (2008) - Cast, Plot & IMDb Rating | HollyFlixHD
✅ Avengers Endgame (2019) - Full Cast & Plot | HollyFlixHD
❌ Inception Movie (too generic, no year)
❌ Watch Inception Online Free (misleading)
```

---

## 3. META DESCRIPTION

### Format
```
Discover [Movie Title] ([Year]) — [one-line plot teaser]. Full cast, [director name], IMDb rating [X.X/10] & where to stream. | HollyFlixHD
```

### Rules
- Maximum **155 characters** (Google truncates beyond this)
- Minimum **120 characters** (too short = missed opportunity)
- Include **primary keyword** (movie title) naturally
- Include **compelling hook** to increase click-through rate
- Include **rating** and **streaming info** — these drive clicks
- Include **call to action** (Discover, Explore, Find out)
- Never duplicate meta descriptions

### Examples
```
✅ Discover Inception (2010) — A thief who steals secrets through dreams. 
   Full cast, Christopher Nolan's direction, IMDb 8.8/10 & streaming info. | HollyFlixHD
   [153 chars ✅]

✅ The Dark Knight (2008) starring Christian Bale. Full cast, plot, 
   IMDb 9.0/10 rating & where to watch. The ultimate Batman movie. | HollyFlixHD
   [149 chars ✅]
```

---

## 4. CANONICAL TAG

```html
<link rel="canonical" href="https://hollyflixhd.com/movies/inception-2010/" />
```

### Rules
- Every movie page must have **self-referencing canonical**
- Must use **HTTPS** always
- Must include **trailing slash** (consistent sitewide)
- Prevents duplicate content if page is accessed via multiple URLs

---

## 5. OPEN GRAPH META TAGS

```html
<meta property="og:type" content="video.movie" />
<meta property="og:title" content="Inception (2010) - Cast, Plot & Rating | HollyFlixHD" />
<meta property="og:description" content="Full cast, plot summary, IMDb rating 8.8/10 and streaming info for Inception (2010) directed by Christopher Nolan." />
<meta property="og:image" content="https://image.tmdb.org/t/p/w1280/[backdrop_path]" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Inception 2010 movie poster" />
<meta property="og:url" content="https://hollyflixhd.com/movies/inception-2010/" />
<meta property="og:site_name" content="HollyFlixHD" />
<meta property="og:locale" content="en_US" />
```

### OG Image Requirements (TMDB CDN)
- Dimensions: **1280 x 720px** (TMDB w1280 backdrop size)
- Format: **WebP** (served directly from TMDB CDN)
- File size: under **300KB**
- TMDB path: `https://image.tmdb.org/t/p/w1280/[backdrop_path]`
- Must show movie backdrop visually (no local storage needed)

---

## 6. TWITTER CARD META TAGS

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Inception (2010) - Cast, Plot & Rating | HollyFlixHD" />
<meta name="twitter:description" content="Full cast, plot summary, IMDb rating 8.8/10 and streaming info for Inception (2010) by Christopher Nolan." />
<meta name="twitter:image" content="https://image.tmdb.org/t/p/w1280/[backdrop_path]" />
<meta name="twitter:image:alt" content="Inception 2010 movie poster" />
<meta name="twitter:site" content="@hollyflixhd" />
```

---

## 7. SCHEMA MARKUP (STRUCTURED DATA)

### Full Movie Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Movie",
  "name": "Inception",
  "alternateName": "Inception (2010)",
  "url": "https://hollyflixhd.com/movies/inception-2010/",
  "description": "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
  "image": "https://image.tmdb.org/t/p/w500/[poster_path]",
  "datePublished": "2010-07-16",
  "duration": "PT2H28M",
  "genre": ["Action", "Adventure", "Sci-Fi", "Thriller"],
  "contentRating": "PG-13",
  "inLanguage": "en",
  "countryOfOrigin": {
    "@type": "Country",
    "name": "United States"
  },
  "director": {
    "@type": "Person",
    "name": "Christopher Nolan",
    "url": "https://hollyflixhd.com/directors/christopher-nolan/"
  },
  "actor": [
    {
      "@type": "Person",
      "name": "Leonardo DiCaprio",
      "url": "https://hollyflixhd.com/actors/leonardo-dicaprio/"
    },
    {
      "@type": "Person",
      "name": "Joseph Gordon-Levitt",
      "url": "https://hollyflixhd.com/actors/joseph-gordon-levitt/"
    },
    {
      "@type": "Person",
      "name": "Elliot Page",
      "url": "https://hollyflixhd.com/actors/elliot-page/"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "8.8",
    "bestRating": "10",
    "worstRating": "1",
    "ratingCount": "2400000",
    "reviewCount": "2400000"
  },
  "productionCompany": {
    "@type": "Organization",
    "name": "Warner Bros. Pictures"
  },
  "award": "Academy Award for Best Cinematography"
}
```

### BreadcrumbList Schema
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://hollyflixhd.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Movies",
      "item": "https://hollyflixhd.com/movies/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Thriller",
      "item": "https://hollyflixhd.com/genre/thriller/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Inception (2010)",
      "item": "https://hollyflixhd.com/movies/inception-2010/"
    }
  ]
}
```

---

## 8. PAGE H TAG STRUCTURE

```
<h1> Inception (2010)                          ← ONE per page, primary keyword
  <h2> Plot Summary                            ← Section header
  <h2> Full Cast & Characters                  ← Section header
    <h3> Leonardo DiCaprio as Dom Cobb         ← Cast member
    <h3> Joseph Gordon-Levitt as Arthur        ← Cast member
  <h2> Director & Crew                         ← Section header
  <h2> Movie Details                           ← Section header
  <h2> Ratings & Reviews                       ← Section header
  <h2> Where to Watch Inception Online         ← Section header (keyword rich)
  <h2> Movies Similar to Inception             ← Section header (internal links)
  <h2> Frequently Asked Questions              ← Section header (FAQ schema)
```

---

## 9. IMAGE SEO (TMDB CDN)

### TMDB Image URL Structure
```
Base URL: https://image.tmdb.org/t/p/

Movie Poster (detail page):   https://image.tmdb.org/t/p/w500/[poster_path]
Movie Poster (card/thumb):    https://image.tmdb.org/t/p/w342/[poster_path]
Movie Backdrop (hero/OG):     https://image.tmdb.org/t/p/w1280/[backdrop_path]
Actor Photo (card):           https://image.tmdb.org/t/p/w185/[profile_path]
Actor Photo (detail page):    https://image.tmdb.org/t/p/h632/[profile_path]
```

### Image Alt Text Rules
```
Movie Poster:   alt="Inception 2010 official movie poster"
Backdrop:       alt="Inception 2010 movie scene with Leonardo DiCaprio"
Actor Image:    alt="Leonardo DiCaprio as Dom Cobb in Inception 2010"
Director:       alt="Christopher Nolan director of Inception 2010"
```

### Next.js Image Component Usage with TMDB
```jsx
<Image
  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
  alt="Inception 2010 official movie poster"
  width={500}
  height={750}
  priority={true}              // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### OG Image for Social Sharing
- Use TMDB **backdrop** image at `w1280` size for Open Graph
- TMDB backdrops are naturally landscape (16:9) — great for social sharing
- URL: `https://image.tmdb.org/t/p/w1280/[backdrop_path]`

### Fallback for Missing Images
```tsx
// If TMDB returns null poster_path or profile_path:
const posterUrl = movie.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : '/images/no-poster.webp'  // local fallback in /public/images/
```

---

## 10. INTERNAL LINKING REQUIREMENTS

Every movie page MUST have these internal links:

### Mandatory Links
- [ ] Link to each **cast member's actor page**
- [ ] Link to **director's page**
- [ ] Link to **genre page** (e.g., /genre/thriller/)
- [ ] Link to **year page** (e.g., /year/2010/)
- [ ] Link to **at least 5 similar/related movies**
- [ ] Link back to **movies listing** (/movies/)
- [ ] **Breadcrumb navigation** at top of page

### Anchor Text Rules
```
✅ "Leonardo DiCaprio" → /actors/leonardo-dicaprio/
✅ "Christopher Nolan" → /directors/christopher-nolan/
✅ "Thriller movies" → /genre/thriller/
✅ "best movies of 2010" → /year/2010/
✅ "The Dark Knight" → /movies/the-dark-knight-2008/
❌ "click here"
❌ "read more"
❌ "this page"
```

---

## 11. MOVIE PAGE CONTENT STRUCTURE

### Required Sections (in order)
1. **Breadcrumb** navigation
2. **Movie Header** — Title, Year, Rating badge, Genre tags, Runtime, Age Rating
3. **Movie Poster** (TMDB CDN: `image.tmdb.org/t/p/w500/[poster_path]`) + **Key Details sidebar**
4. **Plot Summary** — 200-400 words, unique description
5. **Full Cast & Characters** — all main cast with links to actor pages
6. **Director & Key Crew** — with links
7. **Movie Details** — release date, budget, box office, language, country
8. **Ratings** — IMDb, Rotten Tomatoes, Metacritic
9. **Awards & Nominations**
10. **Trailer** (YouTube embed)
11. **Where to Watch** section — streaming platforms
12. **Watch Online Button** → redirects to 123movies
13. **Similar Movies** — minimum 6 movie cards with links
14. **FAQ Section** — 5-8 questions with answers
15. **User Reviews** section (for fresh content signal)

---

## 12. WATCH ONLINE BUTTON (123MOVIES REDIRECT)

```jsx
// SEO-safe implementation
<a
  href={`https://www.123movies.com/search/${encodeURIComponent(movieTitle)}`}
  target="_blank"
  rel="nofollow noopener noreferrer"   // CRITICAL: nofollow for external links
  aria-label={`Watch ${movieTitle} online`}
>
  Watch Online Free
</a>
```

### Important Notes
- Use `rel="nofollow noopener noreferrer"` — do NOT pass SEO link juice
- Open in **new tab** (`target="_blank"`)
- This is an **outbound monetization link** — never dofollow

---

## 13. FAQ SCHEMA FOR MOVIE PAGE

Add FAQ schema to capture **"People Also Ask"** results in Google:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Where can I watch Inception online?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Inception (2010) is available to stream on various platforms. You can also watch it online via our Watch Online button."
      }
    },
    {
      "@type": "Question",
      "name": "What is Inception rated?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Inception is rated PG-13 by the MPAA. It has an IMDb rating of 8.8/10 based on over 2.4 million votes."
      }
    },
    {
      "@type": "Question",
      "name": "Who directed Inception?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Inception was directed by Christopher Nolan and released in 2010 by Warner Bros. Pictures."
      }
    },
    {
      "@type": "Question",
      "name": "How long is Inception?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Inception has a runtime of 2 hours and 28 minutes (148 minutes)."
      }
    },
    {
      "@type": "Question",
      "name": "Is Inception based on a true story?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No, Inception is not based on a true story. It is an original screenplay written by Christopher Nolan."
      }
    }
  ]
}
```

---

## 14. PAGE SPEED REQUIREMENTS (MOVIE PAGE SPECIFIC)

- Movie poster image: **under 80KB** (WebP from TMDB CDN)
- Total page weight: **under 1.5MB**
- No auto-playing videos
- YouTube trailer loaded as **facade** (click to load) — saves 500ms+
- Ads loaded **after** main content (lazy)
- Above-the-fold: poster, title, rating, plot — no layout shift

---

## 15. NEXT.JS METADATA API IMPLEMENTATION

```tsx
// app/movies/[slug]/page.tsx

import type { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const movie = await getMovie(params.slug)
  
  return {
    title: `${movie.title} (${movie.year}) - Cast, Plot & Rating | HollyFlixHD`,
    description: `Discover ${movie.title} (${movie.year}) — ${movie.shortPlot}. Full cast, ${movie.director}, IMDb ${movie.imdbRating}/10 & streaming info.`,
    keywords: [
      `${movie.title} cast`,
      `${movie.title} plot`,
      `${movie.title} ${movie.year}`,
      `${movie.title} rating`,
      `${movie.title} streaming`,
      `${movie.title} where to watch`,
      `${movie.director} movies`,
    ],
    alternates: {
      canonical: `https://hollyflixhd.com/movies/${params.slug}/`,
    },
    openGraph: {
      title: `${movie.title} (${movie.year}) - Cast, Plot & Rating | HollyFlixHD`,
      description: `Full cast, plot and IMDb ${movie.imdbRating}/10 rating for ${movie.title} (${movie.year}).`,
      url: `https://hollyflixhd.com/movies/${params.slug}/`,
      siteName: 'HollyFlixHD',
      images: [
        {
          url: `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`,  // TMDB backdrop as OG image
          width: 1280,
          height: 720,
          alt: `${movie.title} ${movie.year} movie backdrop`,
        },
      ],
      locale: 'en_US',
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${movie.title} (${movie.year}) | HollyFlixHD`,
      description: `Cast, plot & rating for ${movie.title} (${movie.year}).`,
      images: [`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}
```

---

## 16. ROBOTS META TAG

```html
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
```

---

## 17. COMPLETE HEAD TAG CHECKLIST

For every movie page, verify these are present:

```
[ ] <title> — unique, 60 chars max, includes movie title + year
[ ] <meta name="description"> — unique, 155 chars max
[ ] <meta name="robots" content="index, follow...">
[ ] <link rel="canonical">
[ ] <meta property="og:type" content="video.movie">
[ ] <meta property="og:title">
[ ] <meta property="og:description">
[ ] <meta property="og:image"> (TMDB backdrop URL: image.tmdb.org/t/p/w1280/[backdrop_path])
[ ] <meta property="og:image:width" content="1280">
[ ] <meta property="og:image:height" content="720">
[ ] <meta property="og:url">
[ ] <meta property="og:site_name" content="HollyFlixHD">
[ ] <meta property="og:locale" content="en_US">
[ ] <meta name="twitter:card" content="summary_large_image">
[ ] <meta name="twitter:title">
[ ] <meta name="twitter:description">
[ ] <meta name="twitter:image">
[ ] <script type="application/ld+json"> Movie Schema
[ ] <script type="application/ld+json"> BreadcrumbList Schema
[ ] <script type="application/ld+json"> FAQPage Schema
[ ] <link rel="preload"> for poster image (TMDB CDN: image.tmdb.org/t/p/w500/[path])
```

---

## 18. KEYWORD DENSITY GUIDE

| Keyword Type | Where | Frequency |
|---|---|---|
| Movie Title | Title, H1, first 100 words, URL | 1 each |
| Movie Title + Year | Meta description, schema | 2-3 times |
| "[Movie] cast" | H2, body | 1-2 times |
| "[Movie] plot" | H2, body | 1-2 times |
| "[Movie] rating" | H2, body, schema | 1-2 times |
| "[Movie] streaming" | H2, Watch section | 1-2 times |
| Director name | Body, schema, H2 | 2-3 times |
| Genre keywords | Tags, body, H2 | 2-3 times |
| Actor names | Cast section, alt text | 1 each |
| "watch online" | Watch button, H2 | 1-2 times |

---

## 19. URL PARAMETERS & TRACKING

- Never index URLs with query parameters
- Add to robots.txt or Google Search Console parameter handling:
```
Disallow: /*?*
Disallow: /search?
```
- Use `rel="canonical"` on any filtered/sorted pages

---

## 20. FINAL PRE-PUBLISH CHECKLIST

Before any movie page goes live:

```
[ ] Unique slug following [title]-[year] format
[ ] Unique title tag (60 chars max)
[ ] Unique meta description (155 chars max)
[ ] Canonical tag present
[ ] All OG tags present
[ ] All Twitter card tags present
[ ] Movie schema JSON-LD valid (test at schema.org/validator)
[ ] Breadcrumb schema present
[ ] FAQ schema present (min 5 questions)
[ ] H1 is movie title + year
[ ] H2s for all major sections
[ ] Poster image from TMDB CDN with correct alt text (`image.tmdb.org/t/p/w500/[path]`)
[ ] OG image from TMDB backdrop (`image.tmdb.org/t/p/w1280/[path]`)
[ ] All cast linked to actor pages
[ ] Director linked to director page
[ ] Genre tag linked to genre page
[ ] Year linked to year page
[ ] Min 5 similar movies linked
[ ] Watch Online button with rel="nofollow noopener noreferrer"
[ ] Page loads under 3 seconds
[ ] Mobile responsive check passed
[ ] No broken links
[ ] robots meta tag is index, follow
```

---

*File: MOVIE_PAGE_SEO.md | Project: HollyFlixHD.com | Version: 1.0*
