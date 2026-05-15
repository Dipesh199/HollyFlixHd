# HollyFlixHD.com — Complete SEO Requirements
> Project: Movie Info & Database Website | Target Audience: US | Domain: hollyflixhd.com

---

## 1. TECHNICAL SEO

### Site Speed & Performance
- Target Google PageSpeed score: **90+ on mobile, 95+ on desktop**
- Use **Next.js** with Static Site Generation (SSG) or Incremental Static Regeneration (ISR)
- Implement **lazy loading** for all images
- Use **next/image** for automatic image optimization
- Enable **Gzip / Brotli compression**
- Use **Vercel Edge Network** for global fast delivery (built-in with Vercel — no Cloudflare setup needed)
- Minify all CSS, JS, and HTML
- Avoid render-blocking resources
- Use **WebP format** for all images
- Target **Core Web Vitals**:
  - LCP (Largest Contentful Paint): < 2.5s
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1

### Mobile First
- Google uses **mobile-first indexing** — mobile version is primary
- Fully responsive design across all screen sizes
- Touch-friendly UI elements
- Font size minimum **16px** for body text on mobile
- No horizontal scrolling on mobile

### Crawlability
- Submit **XML Sitemap** to Google Search Console → `hollyflixhd.com/sitemap.xml`
- Proper **robots.txt** at `hollyflixhd.com/robots.txt`
- **No orphan pages** — every page must be linked internally
- Implement **pagination** for listing pages (rel="next" / rel="prev")
- Avoid **duplicate content** — use canonical tags on every page
- Fix all **404 errors** immediately
- Implement **301 redirects** for any changed URLs

### robots.txt Template
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: https://hollyflixhd.com/sitemap.xml
```

### Sitemap Structure
```
hollyflixhd.com/sitemap.xml           → Index sitemap
hollyflixhd.com/sitemap-movies.xml    → All movie pages
hollyflixhd.com/sitemap-actors.xml    → All actor pages
hollyflixhd.com/sitemap-genres.xml    → All genre pages
hollyflixhd.com/sitemap-years.xml     → All year pages
```

---

## 2. URL STRUCTURE & SLUGS

### Rules for Slugs
- Always **lowercase**
- Use **hyphens** (not underscores) between words
- Include **year** in movie slugs to avoid conflicts
- No special characters
- No stop words where possible (a, the, of)
- Maximum **60 characters** for slug

### URL Structure
```
Homepage:         hollyflixhd.com/
Movies Listing:   hollyflixhd.com/movies/
Single Movie:     hollyflixhd.com/movies/inception-2010/
Actor Page:       hollyflixhd.com/actors/leonardo-dicaprio/
Director Page:    hollyflixhd.com/directors/christopher-nolan/
Genre Page:       hollyflixhd.com/genre/thriller/
Year Page:        hollyflixhd.com/year/2010/
Search:           hollyflixhd.com/search?q=inception
Top Lists:        hollyflixhd.com/top-rated/
New Releases:     hollyflixhd.com/new-releases/
Trending:         hollyflixhd.com/trending/
```

### Slug Generation Formula
```
[movie-title-lowercase]-[year]
Examples:
  "The Dark Knight (2008)"  → the-dark-knight-2008
  "Avengers: Endgame (2019)"→ avengers-endgame-2019
  "Spider-Man: No Way Home" → spider-man-no-way-home-2021
```

---

## 3. KEYWORD STRATEGY

### Primary Keyword Categories (US Audience)

#### High Volume Keywords
```
[movie name] cast
[movie name] full movie
[movie name] plot
[movie name] review
[movie name] rating
[movie name] where to watch
[movie name] streaming
[movie name] ending explained
[movie name] release date
best movies on netflix
best movies 2024
movies releasing this weekend
top rated movies of all time
oscar winning movies
```

#### Long-tail Keywords (Low Competition, High Intent)
```
is [movie name] worth watching
[movie name] based on true story
[movie name] age rating explained
how long is [movie name]
[movie name] vs [movie name]
best [genre] movies on netflix
movies like [movie name]
[actor name] best movies
[director name] all movies
[movie name] full cast and crew
```

#### Trending / Seasonal Keywords
```
best movies this weekend
new movies releasing in [month]
movies releasing on [streaming platform] this month
oscar nominations [year]
golden globe winners [year]
best horror movies for halloween
best christmas movies [year]
```

### Keyword Placement Rules
- **Primary keyword** in: Title tag, H1, first 100 words, URL slug, meta description
- **Secondary keywords** in: H2s, H3s, image alt text, body content
- **LSI keywords** naturally throughout content
- **Never keyword stuff** — Google penalizes this

---

## 4. ON-PAGE SEO RULES (ALL PAGES)

### Title Tag Rules
- Maximum **60 characters**
- Include **primary keyword**
- Include **brand name** at end
- Format: `Primary Keyword | HollyFlixHD`
- Example: `Inception (2010) Cast, Plot & Rating | HollyFlixHD`

### Meta Description Rules
- Maximum **155 characters**
- Include **primary keyword** naturally
- Include a **call to action**
- Make it compelling to increase CTR
- Example: `Discover Inception (2010) full cast, plot summary, IMDb rating & where to watch online. Complete movie info on HollyFlixHD.`

### Heading Structure
```
H1 → Movie Title + Year (only ONE H1 per page)
H2 → Main sections (Cast, Plot, Director, etc.)
H3 → Subsections within H2s
H4 → Minor subsections if needed
```

### Image SEO
- Every image must have **descriptive alt text**
- Use **next/image** for automatic optimization
- All images served from **TMDB CDN** (`https://image.tmdb.org/t/p/`)
- TMDB image sizes to use:
  - Posters: `w342` for cards, `w500` for detail pages
  - Backdrops: `w1280` for hero banners and OG images
  - Actor photos: `w185` for cards, `h632` for profile pages
- Always have a **local fallback** image in `/public/images/` for null TMDB paths

### Internal Linking Rules
- Every movie page must link to:
  - Actor profile pages (all cast members)
  - Director page
  - Genre page
  - Year page
  - At least 5 similar/related movies
- Use **descriptive anchor text** (not "click here")
- Link from listing pages to movie pages
- Add **breadcrumbs** on every page

### Breadcrumb Structure
```
Home > Movies > Thriller > Inception (2010)
Home > Actors > Leonardo DiCaprio
Home > Genre > Thriller
```

---

## 5. SCHEMA MARKUP (STRUCTURED DATA)

### Required Schema Types
- `Movie` schema on every movie page
- `Person` schema on every actor/director page
- `BreadcrumbList` on every page
- `WebSite` schema on homepage
- `SearchAction` schema on homepage (Sitelinks Searchbox)
- `ItemList` schema on listing/genre/year pages

### WebSite Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "HollyFlixHD",
  "url": "https://hollyflixhd.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://hollyflixhd.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

---

## 6. OPEN GRAPH & SOCIAL META TAGS

Every page must include Open Graph and Twitter Card meta tags:

```html
<!-- Open Graph -->
<meta property="og:title" content="Inception (2010) - Cast, Plot & Rating | HollyFlixHD" />
<meta property="og:description" content="Full cast, plot summary and rating for Inception (2010)." />
<meta property="og:image" content="https://image.tmdb.org/t/p/w1280/[backdrop_path]" />
<meta property="og:url" content="https://hollyflixhd.com/movies/inception-2010" />
<meta property="og:type" content="video.movie" />
<meta property="og:site_name" content="HollyFlixHD" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Inception (2010) - Cast, Plot & Rating | HollyFlixHD" />
<meta name="twitter:description" content="Full cast, plot summary and rating for Inception (2010)." />
<meta name="twitter:image" content="https://image.tmdb.org/t/p/w1280/[backdrop_path]" />
```

---

## 7. CANONICAL TAGS

- Every page must have a **self-referencing canonical tag**
- Prevents duplicate content issues
- Critical for paginated pages

```html
<link rel="canonical" href="https://hollyflixhd.com/movies/inception-2010/" />
```

---

## 8. SITE ARCHITECTURE

### Depth Rule
- No page should be more than **3 clicks** from homepage
- Homepage → Category → Movie Page ✅
- Homepage → Movie Page ✅

### Hub & Spoke Model
```
Homepage (Hub)
├── /movies/ (Hub)
│   ├── /movies/inception-2010/ (Spoke)
│   ├── /movies/the-dark-knight-2008/ (Spoke)
├── /genre/ (Hub)
│   ├── /genre/thriller/ (Spoke)
│   ├── /genre/action/ (Spoke)
├── /actors/ (Hub)
│   ├── /actors/leonardo-dicaprio/ (Spoke)
├── /year/ (Hub)
│   ├── /year/2024/ (Spoke)
├── /top-rated/ (Spoke)
├── /new-releases/ (Spoke)
├── /trending/ (Spoke)
```

---

## 9. CONTENT STRATEGY

### Minimum Content Requirements
- Movie page: **800–1200 words** minimum
- Actor page: **500–800 words** minimum
- Genre page: **400–600 words** minimum
- List pages: **300+ words** + movie cards

### Content Freshness
- Add new movie pages **every week**
- Update ratings and streaming availability monthly
- Add "New Release" tag for movies within 3 months of release
- Create seasonal content (Best Christmas Movies, Best Halloween Movies)

### Content Types to Create
1. Individual movie pages (primary)
2. Actor/Director profile pages
3. Genre hub pages
4. Year-based pages
5. Top lists ("Best 100 Movies of All Time")
6. "Movies Like X" recommendation pages
7. "Where to Watch" pages per streaming platform
8. Seasonal/trending content

---

## 10. GOOGLE SEARCH CONSOLE SETUP

### Must-Do After Launch
- [ ] Verify ownership of `hollyflixhd.com`
- [ ] Submit all sitemaps
- [ ] Check for crawl errors weekly
- [ ] Monitor Core Web Vitals report
- [ ] Set up email alerts for manual penalties
- [ ] Check mobile usability report
- [ ] Monitor search performance (clicks, impressions, CTR)

---

## 11. ANALYTICS SETUP

- Install **Google Analytics 4 (GA4)**
- Install **Google Tag Manager**
- Track: pageviews, bounce rate, session duration, clicks on Watch Online button
- Set up **conversion goals** (Watch Online button clicks)
- Monitor **top landing pages** from organic search

---

## 12. LINK BUILDING STRATEGY

### White-Hat Link Building
- Submit to movie directories (AllMovie, Letterboxd mentions)
- Create **"Top 100 Movies"** lists that attract natural backlinks
- Guest post on entertainment and pop culture blogs
- Share on Reddit (r/movies, r/netflix, r/horror etc.)
- Build presence on social media (Twitter/X, Facebook, Pinterest)
- Get listed in **Google Discover** by having strong E-E-A-T signals

---

## 13. E-E-A-T SIGNALS (Google Trust Factors)

- Add **About Us** page explaining the site
- Add **Contact** page
- Add **Privacy Policy** page
- Add **Terms of Service** page
- Show **data sources** (TMDB, IMDb ratings credited)
- Regular content updates show site is **actively maintained**

---

## 14. MONETIZATION SEO CONSIDERATIONS

- Apply for **Mediavine** (50K sessions/month minimum)
- Apply for **Raptive** (100K pageviews/month minimum)
- Until then use **Google AdSense**
- Place ads without hurting **Core Web Vitals**
- Affiliate links to: Amazon Prime, Apple TV, Vudu — use **rel="nofollow sponsored"**

---

*Last Updated: 2024 | Project: HollyFlixHD.com*
