# HollyFlixHD repository instructions

These instructions apply to this repository. Follow the user's global instructions too. The current code and `hollyflixhd/deploy/COOLIFY.md` describe the running system; older project prompt and SEO planning documents are background material where they differ.

## Project and implementation

- The application is in `hollyflixhd/`: Next.js 14 App Router, React 18, TypeScript, Tailwind CSS 3, and Node.js 20. Use npm and the committed lockfile. Keep changes focused and follow existing components, routes, and styling patterns.
- Use TMDB for movie data and images. Preserve the footer's TMDB attribution. Editorials are supplemental content, not a replacement for movie facts.
- Before changing packages, check their compatibility with the current stack and prefer stable releases. Do not add a dependency when existing code can handle the task cleanly.

## Editorials and data

- Only slugs in `hollyflixhd/lib/published-editorial-slugs.ts` are published as reviews. Their JSON files live in `hollyflixhd/data/editorials/`; other saved reviews remain in `hollyflixhd/data/editorials_archive/`. Follow the `Editorial` type and slug validation in `hollyflixhd/lib/editorial.ts`. Keep editorial text nonempty and `editorRating` one of the supported values.
- Production retains editorial JSON in the persistent `/data/hollyflixhd/editorials` host directory, mounted at `/app/data/editorials`. Do not delete, replace, or move this directory during a deploy. The public API, movie pages, homepage, and editorial sitemap must respect the published list even when the volume contains archived reviews.
- The daily `hollyflixhd-editorial-sync` service commits newly generated valid reviews to the GitHub archive, without publishing them; see `hollyflixhd/deploy/sync-editorials.py`. To publish a reviewed editorial, move its JSON into `data/editorials/` and add its slug to the published list. Check the persistent directory against GitHub before claiming the archive is current.

## Search and URLs

- Use `https://hollyflixhd.com/` as the canonical origin. Preserve the existing redirects, canonical metadata, `robots.txt`, XML sitemaps, and structured data when editing routes.
- Keep sitemap URLs limited to live, canonical, indexable pages. The editorial sitemap lists only the published reviews. Do not submit search results, API routes, redirect variants, or missing movie pages as indexable URLs.
- Search Console reports can lag behind a deployment. Check the exact canonical URL with URL Inspection and compare the live response before changing code for an indexing issue. Indexability does not guarantee that Google will index a page.

## Production and secrets

- GitHub `main` deploys through Coolify on the Oracle VM using `hollyflixhd/Dockerfile`. Caddy terminates HTTPS and proxies the public site to the Coolify application. Keep deployment changes compatible with the persistent editorial mount and `hollyflixhd/deploy/COOLIFY.md`.
- Configure environment variables in Coolify. Keep TMDB and Ollama API keys runtime-only, and never commit their values or server credentials. `NEXT_PUBLIC_*` values need build and runtime scope.
- `next.config.mjs` deliberately disables Next.js image optimization because its unbounded cache exhausted the VM disk. Do not re-enable it without a bounded cache and capacity plan.
- The primary local checkout may contain unrelated uncommitted work. Inspect Git status before editing or pulling, and use a clean worktree when needed. Never discard user changes.

## Verification

- From `hollyflixhd/`, run `npm run lint` and `npm run build` for application changes when possible. Validate any new editorial JSON against the expected fields and rating values.
- For deployment or SEO changes, check the live canonical URL, relevant sitemap and robots response, and the Coolify app health after deployment. Report the exact files changed, checks run, and any remaining limitation.
