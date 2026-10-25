# HollyFlixHD on Coolify

Deploy `main` from `https://github.com/Dipesh199/HollyFlixHd` using the Dockerfile build strategy.

| Setting | Value |
| --- | --- |
| Base directory | `/hollyflixhd` |
| Dockerfile location | `/Dockerfile` |
| Internal port | `3000` |
| Health check | `/` on port `3000` |
| Public domain | `https://hollyflixhd.com` |
| Persistent directory mount | `/data/hollyflixhd/editorials` on the host to `/app/data/editorials` in the container |

Create the host directory before the first deploy and give UID/GID `1001` write access. The container copies repository editorials into the mount at startup; reviews generated during visits remain in the mount across redeploys. Back up the host directory separately. A movie with no saved review generates one on its first visit and displays it on the movie page. `lib/published-editorial-slugs.ts` selects the 26 featured reviews shown in the editorial hub. The host runs `deploy/sync-editorials.py` daily with a repository-specific write deploy key to commit newly generated, valid reviews to `data/editorials/` on GitHub. Keep that key outside the application container.

Set these production environment variables in Coolify, copying values from the existing server environment file rather than committing them:

| Variable | Scope |
| --- | --- |
| `TMDB_API_KEY` | Runtime secret |
| `TMDB_BASE_URL` | Runtime |
| `TMDB_IMAGE_BASE_URL` | Runtime |
| `OLLAMA_API_KEY` | Runtime secret |
| `OLLAMA_MODEL` | Runtime |
| `NEXT_PUBLIC_SITE_URL` | Build and runtime |
| `NEXT_PUBLIC_SITE_NAME` | Build and runtime |
| `NEXT_PUBLIC_GA_ID` | Build and runtime |
| `NEXT_PUBLIC_ADSENSE_ID` | Build and runtime |

The public values are declared as Docker build arguments so Next.js can include them in client code. Keep the API keys runtime-only. Use a GitHub App or a manual Git webhook for automatic deployments from `main`.
