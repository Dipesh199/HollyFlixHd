#!/usr/bin/env python3
"""
Daily Editorial Generator for HollyFlixHD
-----------------------------------------
Automatically discovers trending and newly released movies from TMDB,
filters out movies that already have editorials, and generates high-quality,
SEO-optimized editorial reviews using Ollama (Cloud or Local).

Daily quota: 20 new movie editorials per run.
"""

import argparse
import gzip
import json
import os
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime
from pathlib import Path

# Ensure UTF-8 output on Windows terminals
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ("utf-8", "utf8"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

# Paths
SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
EDITORIALS_DIR = DATA_DIR / "editorials"
PERSISTENT_SERVER_DIR = Path("/data/hollyflixhd/editorials")

# TMDB & Ollama Configuration
TMDB_BASE = "https://api.themoviedb.org/3"
DEFAULT_LOCAL_MODEL = "gemma4"
DEFAULT_CLOUD_MODEL = "gemma4:31b"
VALID_RATINGS = {"Must Watch", "Worth Watching", "Skip It", "Cult Classic"}


def load_env():
    """Load environment variables from /etc/hollyflixhd.env or .env.local or .env if present."""
    env_files = [
        Path("/etc/hollyflixhd.env"),
        PROJECT_DIR / ".env.local",
        PROJECT_DIR / ".env",
    ]
    for env_file in env_files:
        if env_file.is_file():
            try:
                for line in env_file.read_text(encoding="utf-8").splitlines():
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k not in os.environ:
                            os.environ[k] = v
            except Exception:
                pass


load_env()


def get_tmdb_key():
    return os.environ.get("TMDB_API_KEY")


def get_ollama_key():
    return os.environ.get("OLLAMA_API_KEY")


def get_ollama_model(api_key):
    if api_key:
        return os.environ.get("OLLAMA_MODEL", DEFAULT_CLOUD_MODEL)
    return os.environ.get("OLLAMA_MODEL", DEFAULT_LOCAL_MODEL)


def slugify(text: str) -> str:
    """Matches HollyFlixHD's TypeScript slugify logic."""
    text = text.lower().strip()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^\w\-]+", "", text)
    text = re.sub(r"\-\-+", "-", text)
    return text.strip("-")


def generate_movie_slug(title: str, year: str | int | None) -> str:
    base = slugify(title)
    if year:
        return f"{base}-{year}"
    return base


def is_valid_editorial_slug(slug: str) -> bool:
    return bool(re.match(r"^[a-z0-9_]+(?:-[a-z0-9_]+)*-(?:19|20)\d{2}$", slug))


def get_target_storage_dir() -> Path:
    """Return persistent server directory if on production server, else local editorials dir."""
    if PERSISTENT_SERVER_DIR.is_dir():
        return PERSISTENT_SERVER_DIR
    return EDITORIALS_DIR


def editorial_exists(slug: str) -> bool:
    """Check if editorial already exists locally or in persistent server volume."""
    storage_dir = get_target_storage_dir()
    target_path = storage_dir / f"{slug}.json"
    if target_path.is_file() and target_path.stat().st_size > 0:
        return True
    # Also check local repo dir if different from target
    if storage_dir != EDITORIALS_DIR:
        local_path = EDITORIALS_DIR / f"{slug}.json"
        if local_path.is_file() and local_path.stat().st_size > 0:
            return True
    return False


def tmdb_request(endpoint: str, params: dict | None = None) -> dict | None:
    api_key = get_tmdb_key()
    if not api_key:
        raise RuntimeError("TMDB_API_KEY is not set in environment or .env.local")

    query = {"api_key": api_key}
    if params:
        query.update(params)

    url = f"{TMDB_BASE}{endpoint}?{urllib.parse.urlencode(query)}"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "HollyFlixHD-DailyGenerator/1.0",
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
        },
    )

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read()
            if content.startswith(b"\x1f\x8b"):
                content = gzip.decompress(content)
            return json.loads(content.decode("utf-8"))
    except Exception as e:
        print(f"  [TMDB API Error] {endpoint}: {e}")
        return None


def fetch_candidate_movies(target_count: int = 50) -> list[dict]:
    """
    Collect movie candidates prioritizing:
      1. Trending today (/trending/movie/day)
      2. Now playing in theaters/streaming (/movie/now_playing)
      3. Top popular releases of the current year (/discover/movie)
      4. Upcoming releases (/movie/upcoming)
    """
    candidates = []
    seen_ids = set()
    current_year = datetime.now().year

    endpoints = [
        # (endpoint, params_fn, label)
        ("/trending/movie/day", lambda p: {"page": p}, "Trending Today"),
        ("/movie/now_playing", lambda p: {"page": p, "region": "US"}, "Now Playing (US)"),
        (
            "/discover/movie",
            lambda p: {
                "page": p,
                "primary_release_year": current_year,
                "sort_by": "popularity.desc",
            },
            f"Popular {current_year}",
        ),
        (
            "/discover/movie",
            lambda p: {
                "page": p,
                "primary_release_year": current_year - 1,
                "sort_by": "popularity.desc",
            },
            f"Popular {current_year - 1}",
        ),
        ("/movie/upcoming", lambda p: {"page": p, "region": "US"}, "Upcoming (US)"),
    ]

    print("\n[1/3] Discovering candidates from TMDB...")
    for endpoint, param_fn, label in endpoints:
        for page in range(1, 4):  # Check up to 3 pages per category
            data = tmdb_request(endpoint, param_fn(page))
            if not data or "results" not in data:
                break

            for item in data["results"]:
                movie_id = item.get("id")
                title = item.get("title")
                release_date = item.get("release_date") or ""
                overview = item.get("overview") or ""

                if not movie_id or not title or not release_date:
                    continue

                if movie_id in seen_ids:
                    continue
                seen_ids.add(movie_id)

                # Extract release year
                year_match = re.match(r"^(\d{4})", release_date)
                if not year_match:
                    continue
                year = year_match.group(1)

                slug = generate_movie_slug(title, year)
                if not is_valid_editorial_slug(slug):
                    continue

                if editorial_exists(slug):
                    continue

                candidates.append({
                    "id": movie_id,
                    "title": title,
                    "year": year,
                    "slug": slug,
                    "overview": overview,
                    "source": label,
                    "popularity": item.get("popularity", 0),
                    "vote_average": item.get("vote_average", 0),
                })

                if len(candidates) >= target_count:
                    break

            if len(candidates) >= target_count:
                break
        if len(candidates) >= target_count:
            break

    print(f"  Found {len(candidates)} new candidate movies without editorials.")
    return candidates


def fetch_movie_context(movie_id: int) -> dict:
    """Fetch movie details including director and genres for high quality prompts."""
    data = tmdb_request(f"/movie/{movie_id}", {"append_to_response": "credits"})
    if not data:
        return {}

    director = "Unknown"
    if "credits" in data and "crew" in data["credits"]:
        for crew in data["credits"]["crew"]:
            if crew.get("job") == "Director":
                director = crew.get("name", "Unknown")
                break

    genres = [g["name"] for g in data.get("genres", []) if "name" in g]

    return {
        "director": director,
        "genres": ", ".join(genres) if genres else "Drama, Cinema",
        "runtime": data.get("runtime"),
        "tagline": data.get("tagline", ""),
    }


def generate_editorial_llm(movie: dict, context: dict, ollama_key: str | None, model: str) -> dict | None:
    """Send prompt to Ollama to generate an editorial review."""
    title = movie["title"]
    year = movie["year"]
    overview = movie.get("overview") or "Plot synopsis not available."
    genres = context.get("genres", "Drama, Cinema")
    director = context.get("director", "Unknown")

    prompt = f"""You are a movie guide writer for HollyFlixHD.
Write a clear, casual, and detailed movie review for everyday viewers.
Title: {title} ({year})
Genre: {genres}
Director: {director}
Overview: {overview}

LANGUAGE & LENGTH RULES:
- Use simple, natural, conversational English (8th-grade reading level). Talk like a friend recommending a movie.
- NO fancy, pretentious, or academic words (DO NOT use: visceral, claustrophobic, cerebral, juxtaposition, tour-de-force, metaphor, descent, haunting, tapestry).
- LENGTH REQUIREMENT FOR EDITORIAL: The "editorial" review MUST be at least 150 to 200 words long (2 detailed paragraphs). Do not make it a short summary.
  * Paragraph 1: An engaging hook about the setup, the main characters, and the overall vibe of the movie.
  * Paragraph 2: What stood out (acting, twists, action, pacing), honest pros and cons, who should watch it, and naturally include viewing/format advice (e.g. streaming in 4K Ultra HD on Prime Video, renting on Apple TV, or adding the 4K Blu-ray to your physical collection). Make it flow naturally as friendly advice.
- LENGTH REQUIREMENT FOR ENDING: The "endingExplained" MUST be at least 60 to 90 words long. Clearly explain what happens in the final scenes, the twist, and how things wrap up in plain, simple English (spoilers allowed).
- Write in second person, speaking directly to "you".
- Do not start with "I", "This movie", or the movie title.
- Do not include emojis or markdown in JSON values.

OUTPUT JSON FORMAT ONLY:
{{
  "editorial": "A detailed 150-200 word review written in simple, natural English across 2 paragraphs.",
  "endingExplained": "A detailed 60-90 word plain English breakdown of the ending, final twist, and conclusion (spoilers allowed).",
  "worthWatching": true,
  "editorRating": "Must Watch",
  "tags": ["mood-tag", "genre-tag", "audience-tag"],
  "toneAndPace": "fast-paced, exciting, funny",
  "targetAudience": "Ideal for anyone who loves...",
  "similarMovies": ["Movie 1", "Movie 2", "Movie 3"],
  "watchReasons": ["fun storyline", "great acting", "kept me hooked"]
}}

FIELD CONSTRAINTS:
- editorial: MUST be at least 150-200 words long in simple, clear English
- endingExplained: MUST be at least 60-90 words long clearly explaining the ending in plain words
- editorRating must be exactly one of: "Must Watch", "Worth Watching", "Skip It", "Cult Classic"
- worthWatching must be true if editorRating is "Must Watch", "Worth Watching", or "Cult Classic", false only for "Skip It"
- toneAndPace: simple everyday words separated by commas
- tags: 3-4 simple lowercase words
- similarMovies: 2-3 well-known real movies with similar vibe
"""

    if ollama_key:
        url = "https://ollama.com/api/generate"
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {ollama_key}",
        }
    else:
        url = "http://localhost:11434/api/generate"
        headers = {"Content-Type": "application/json"}

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "num_predict": 1500,
            "temperature": 0.7,
        },
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers)

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            response_text = result.get("response", "").strip()

            # Robust JSON extraction
            first_brace = response_text.find("{")
            last_brace = response_text.rfind("}")
            if first_brace != -1 and last_brace != -1:
                clean_json = response_text[first_brace : last_brace + 1]
                parsed = json.loads(clean_json)

                # Validate essential fields
                if not isinstance(parsed, dict):
                    return None
                if not isinstance(parsed.get("editorial"), str) or not parsed["editorial"].strip():
                    return None
                if parsed.get("editorRating") not in VALID_RATINGS:
                    parsed["editorRating"] = "Must Watch"
                if "worthWatching" not in parsed:
                    parsed["worthWatching"] = parsed["editorRating"] != "Skip It"
                if not isinstance(parsed.get("tags"), list):
                    parsed["tags"] = ["movie-night", "featured"]

                return parsed
            else:
                print(f"    [LLM Format Error] Could not find JSON braces in response.")
                return None
    except Exception as e:
        print(f"    [LLM Request Error]: {e}")
        return None


def save_editorial_atomically(slug: str, editorial_data: dict) -> bool:
    """Saves editorial to target directory atomically."""
    storage_dir = get_target_storage_dir()
    storage_dir.mkdir(parents=True, exist_ok=True)
    target_path = storage_dir / f"{slug}.json"
    temp_path = storage_dir / f".{slug}.{os.getpid()}.tmp"

    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(editorial_data, f, indent=2, ensure_ascii=False)
        temp_path.replace(target_path)
        return True
    except Exception as e:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except Exception:
                pass
        print(f"    [Save Error] Failed to write {target_path}: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="Daily Editorial Generator for HollyFlixHD (Generates 20 new movie editorials daily)."
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=20,
        help="Number of new editorials to generate (default: 20)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=None,
        help="Custom Ollama model name (overrides OLLAMA_MODEL)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Discover candidate movies and print them without generating or saving.",
    )
    args = parser.parse_args()

    tmdb_key = get_tmdb_key()
    if not tmdb_key:
        print("[Error] TMDB_API_KEY is missing. Add it to .env.local or your environment.")
        sys.exit(1)

    ollama_key = get_ollama_key()
    model = args.model or get_ollama_model(ollama_key)

    print("==========================================================")
    print("HollyFlixHD - Daily Editorial Generator")
    print("==========================================================")
    print(f"Target count    : {args.limit} new editorials")
    print(f"TMDB API        : Configured")
    print(f"Ollama Mode     : {'Ollama Cloud' if ollama_key else 'Local Ollama'}")
    print(f"Model           : {model}")
    print(f"Storage Dir     : {get_target_storage_dir()}")
    print("==========================================================")

    # 1. Fetch candidate movies
    candidates = fetch_candidate_movies(target_count=max(args.limit * 3, 50))
    if not candidates:
        print("No new candidate movies found. Everything discovered already has an editorial.")
        return

    if args.dry_run:
        print("\n[DRY RUN] Found the following candidate movies:")
        for idx, m in enumerate(candidates[: args.limit], 1):
            print(f"  {idx:02d}. [{m['source']}] {m['title']} ({m['year']}) -> {m['slug']}")
        print(f"\nDry run complete. No files written.")
        return

    # 2. Generate editorials
    print(f"\n[2/3] Generating {args.limit} new editorials...")
    success_count = 0
    generated_movies = []

    for idx, movie in enumerate(candidates):
        if success_count >= args.limit:
            break

        slug = movie["slug"]
        if editorial_exists(slug):
            continue

        print(f"\n[{success_count + 1}/{args.limit}] Processing: {movie['title']} ({movie['year']})")
        print(f"       Source : {movie['source']} | Slug: {slug}")

        # Fetch extra context (director, genres)
        context = fetch_movie_context(movie["id"])
        print(f"       Context: Director: {context.get('director')}, Genres: {context.get('genres')}")

        start_time = time.time()
        editorial = generate_editorial_llm(movie, context, ollama_key, model)

        if editorial:
            saved = save_editorial_atomically(slug, editorial)
            if saved:
                duration = time.time() - start_time
                success_count += 1
                generated_movies.append({
                    "title": movie["title"],
                    "year": movie["year"],
                    "slug": slug,
                    "rating": editorial.get("editorRating"),
                })
                print(f"       [+] Successfully saved {slug}.json ({duration:.1f}s)")
            else:
                print(f"       [-] Failed to save file.")
        else:
            print(f"       [!] Generation failed or returned invalid JSON. Skipping.")

        # Respectful delay between LLM calls
        time.sleep(1)

    # 3. Summary & Links to submit
    print("\n==========================================================")
    print("Generation Completed!")
    print(f"Total new editorials generated: {success_count}/{args.limit}")
    print("==========================================================")

    if generated_movies:
        print("\nNew Movie Pages Ready to Index:")
        for i, m in enumerate(generated_movies, 1):
            print(f"  {i:02d}. https://hollyflixhd.com/movies/{m['slug']} ({m['rating']})")

        print("\nNote: These movies are now immediately live in:")
        print("  - https://hollyflixhd.com/sitemap-editorials.xml")
        print("  - https://hollyflixhd.com/sitemap.xml")


if __name__ == "__main__":
    main()
