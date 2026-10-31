#!/usr/bin/env python3
"""
Test Beam Model for HollyFlixHD Editorials
------------------------------------------
Tests generating 5 movie editorials using the 'beam' model on Ollama Cloud.
Evaluates JSON structure, word count, speed, and content quality.
"""

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

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
DATA_DIR = PROJECT_DIR / "data"
EDITORIALS_DIR = DATA_DIR / "editorials"

TMDB_BASE = "https://api.themoviedb.org/3"
MODEL = "beam"
VALID_RATINGS = {"Must Watch", "Worth Watching", "Skip It", "Cult Classic"}


def load_env():
    for filename in [".env.local", ".env"]:
        env_file = PROJECT_DIR / filename
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

TMDB_KEY = os.environ.get("TMDB_API_KEY")
OLLAMA_KEY = os.environ.get("OLLAMA_API_KEY")


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^\w\-]+", "", text)
    text = re.sub(r"\-\-+", "-", text)
    return text.strip("-")


def tmdb_request(endpoint: str, params: dict | None = None) -> dict | None:
    if not TMDB_KEY:
        raise RuntimeError("TMDB_API_KEY is not set.")
    query = {"api_key": TMDB_KEY}
    if params:
        query.update(params)
    url = f"{TMDB_BASE}{endpoint}?{urllib.parse.urlencode(query)}"
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Accept-Encoding": "gzip"},
    )
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                content = resp.read()
                if content.startswith(b"\x1f\x8b"):
                    content = gzip.decompress(content)
                return json.loads(content.decode("utf-8"))
        except Exception as e:
            if attempt == 2:
                print(f"  [TMDB Error] {e}")
            time.sleep(1)
    return None


def fetch_5_candidates() -> list[dict]:
    """Find 5 new trending movies that do not have editorials yet."""
    candidates = []
    print("\nFetching candidate trending movies from TMDB...")
    data = tmdb_request("/trending/movie/day", {"page": 1})
    if not data or "results" not in data:
        return []

    for item in data["results"]:
        title = item.get("title")
        rel = item.get("release_date") or ""
        overview = item.get("overview") or ""
        year_match = re.match(r"^(\d{4})", rel)
        if not title or not year_match:
            continue
        year = year_match.group(1)
        slug = f"{slugify(title)}-{year}"
        file_path = EDITORIALS_DIR / f"{slug}.json"
        if file_path.exists() and file_path.stat().st_size > 0:
            continue

        candidates.append({
            "id": item.get("id"),
            "title": title,
            "year": year,
            "slug": slug,
            "overview": overview,
        })
        if len(candidates) >= 5:
            break

    return candidates


def fetch_context(movie_id: int) -> dict:
    data = tmdb_request(f"/movie/{movie_id}", {"append_to_response": "credits"})
    if not data:
        return {}
    director = "Unknown"
    for crew in data.get("credits", {}).get("crew", []):
        if crew.get("job") == "Director":
            director = crew.get("name", "Unknown")
            break
    genres = [g["name"] for g in data.get("genres", []) if "name" in g]
    return {
        "director": director,
        "genres": ", ".join(genres) if genres else "Drama, Cinema",
    }


def generate_with_beam(movie: dict, context: dict) -> dict | None:
    prompt = f"""You are a movie guide writer for HollyFlixHD.
Write a clear, casual, and detailed movie review for everyday viewers.
Title: {movie['title']} ({movie['year']})
Genre: {context.get('genres', 'Drama, Cinema')}
Director: {context.get('director', 'Unknown')}
Overview: {movie.get('overview') or 'Plot synopsis not available.'}

Keep internal thinking very brief and output the JSON immediately.

LANGUAGE & LENGTH RULES:
- Use simple, natural, conversational English (8th-grade reading level). Talk like a friend recommending a movie.
- NO fancy, pretentious, or academic words (DO NOT use: visceral, claustrophobic, cerebral, juxtaposition, tour-de-force, metaphor, descent, haunting, tapestry).
- LENGTH REQUIREMENT FOR EDITORIAL: The "editorial" review MUST be at least 150 to 200 words long (2 detailed paragraphs).
  * Paragraph 1: An engaging hook about the setup, main characters, and the overall vibe. Avoid repetitive opening formulas like "Imagine you are...".
  * Paragraph 2: Standout elements (acting performances, pacing, twists), honest strengths and weaknesses, and who will enjoy it most. Do NOT invent or specify streaming platforms or physical disc formats (e.g., do not mention Prime Video, Apple TV, or 4K Blu-ray).
- LENGTH REQUIREMENT FOR ENDING: The "endingExplained" MUST be at least 60 to 90 words long clearly explaining what happens in the final scenes and twist (spoilers allowed).
- Write in second person, speaking directly to "you".
- Do not start with "I", "This movie", or the movie title.
- Do not include emojis or markdown in JSON values.

OUTPUT JSON FORMAT ONLY:
{{
  "editorial": "A detailed 150-200 word review written in simple, natural English across 2 paragraphs.",
  "endingExplained": "A detailed 60-90 word plain English breakdown of the ending, final twist, and conclusion.",
  "worthWatching": true,
  "editorRating": "Must Watch",
  "tags": ["mood-tag", "genre-tag", "audience-tag"],
  "toneAndPace": "fast-paced, exciting, funny",
  "targetAudience": "Ideal for anyone who loves...",
  "similarMovies": ["Movie 1", "Movie 2", "Movie 3"],
  "watchReasons": ["fun storyline", "great acting", "kept me hooked"]
}}

FIELD CONSTRAINTS:
- editorRating must be exactly one of: "Must Watch", "Worth Watching", "Skip It", "Cult Classic"
- worthWatching must be true if editorRating is "Must Watch", "Worth Watching", or "Cult Classic", false only for "Skip It"
- similarMovies: 2-3 well-known real movies with similar vibe
"""

    url = "https://ollama.com/api/generate"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {OLLAMA_KEY}",
    }
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "num_predict": 4096,
            "temperature": 0.5,
        },
    }

    try:
        req = urllib.request.Request(
            url, data=json.dumps(payload).encode("utf-8"), headers=headers
        )
        with urllib.request.urlopen(req, timeout=90) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            response_text = data.get("response", "").strip()
            first_brace = response_text.find("{")
            last_brace = response_text.rfind("}")
            if first_brace != -1 and last_brace != -1:
                try:
                    parsed = json.loads(response_text[first_brace : last_brace + 1])
                    if parsed.get("editorRating") not in VALID_RATINGS:
                        parsed["editorRating"] = "Must Watch"
                    if "worthWatching" not in parsed:
                        parsed["worthWatching"] = parsed["editorRating"] != "Skip It"
                    return parsed
                except Exception as parse_err:
                    print(f"  [JSON Parse Error]: {parse_err}")
                    print(f"  [Raw Response Snippet]: {response_text[:300]}")
                    return None
            else:
                print(f"  [No Braces Found in Response]: {response_text[:300]}")
                print(f"  [Thinking Snippet]: {data.get('thinking', '')[:300]}")
                return None
    except Exception as e:
        print(f"  [Beam Error]: {e}")
        return None


def main():
    print("==========================================================")
    print("🧪 HollyFlixHD - Testing Beam Model for Editorials")
    print("==========================================================")
    print(f"Model           : {MODEL}")
    print(f"Endpoint        : https://ollama.com/api/generate")
    print(f"Target count    : 5 editorials")
    print("==========================================================")

    if not OLLAMA_KEY:
        print("[Error] OLLAMA_API_KEY missing.")
        sys.exit(1)

    candidates = fetch_5_candidates()
    if not candidates:
        print("Could not find 5 unreviewed candidates.")
        return

    print(f"Found {len(candidates)} candidates:")
    for idx, c in enumerate(candidates, 1):
        print(f"  {idx}. {c['title']} ({c['year']}) -> {c['slug']}")

    EDITORIALS_DIR.mkdir(parents=True, exist_ok=True)
    generated = []

    for idx, movie in enumerate(candidates, 1):
        print(f"\n[{idx}/5] Generating with 'beam': {movie['title']} ({movie['year']})")
        context = fetch_context(movie["id"])
        print(f"       Director: {context.get('director')} | Genres: {context.get('genres')}")

        t0 = time.time()
        editorial = generate_with_beam(movie, context)
        elapsed = time.time() - t0

        if editorial and editorial.get("editorial"):
            slug = movie["slug"]
            target_file = EDITORIALS_DIR / f"{slug}.json"
            with open(target_file, "w", encoding="utf-8") as f:
                json.dump(editorial, f, indent=2, ensure_ascii=False)

            word_count_ed = len(editorial["editorial"].split())
            word_count_end = len(editorial.get("endingExplained", "").split())

            print(f"       [+] Success in {elapsed:.1f}s!")
            print(f"           - Editorial word count : {word_count_ed} words")
            print(f"           - Ending word count    : {word_count_end} words")
            print(f"           - Rating               : {editorial.get('editorRating')}")
            print(f"           - Saved to             : {slug}.json")
            generated.append((movie, editorial, elapsed))
        else:
            print(f"       [!] Failed or invalid response.")

        time.sleep(1)

    print("\n==========================================================")
    print("🎉 Test Run Finished!")
    print(f"Successfully generated: {len(generated)}/5 movies using '{MODEL}'")
    print("==========================================================")

    if generated:
        print("\nQuality Preview of First Review:")
        m0, ed0, _ = generated[0]
        print(f"\nMovie: {m0['title']} ({m0['year']})")
        print(f"Rating: {ed0.get('editorRating')}")
        print(f"Tags: {ed0.get('tags')}")
        print("\n--- Editorial Review ---")
        print(ed0.get("editorial"))
        print("\n--- Ending Explained ---")
        print(ed0.get("endingExplained"))


if __name__ == "__main__":
    main()
