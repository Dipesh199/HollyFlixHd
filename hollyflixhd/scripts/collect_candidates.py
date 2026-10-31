#!/usr/bin/env python3
"""
Fetch candidate unreviewed movies from TMDB via SSH or direct API,
caching existing local editorials so zero duplicates are selected.
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
EDITORIALS_DIR = PROJECT_DIR / "data" / "editorials"
SSH_KEY = Path(r"C:\Users\korat\.ssh\hollyflixhd_oci")
SERVER_HOST = "ubuntu@152.70.14.232"
TMDB_KEY = "ad73ae76042bab88f68161b9bfc66b0d"


def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^\w\-]+", "", text)
    text = re.sub(r"\-\-+", "-", text)
    return text.strip("-")


def get_existing_slugs() -> set[str]:
    slugs = set()
    if EDITORIALS_DIR.is_dir():
        for p in EDITORIALS_DIR.glob("*.json"):
            if p.is_file() and p.stat().st_size > 0:
                slugs.add(p.stem.lower())
    print(f"Loaded {len(slugs)} existing local editorial files into cache.")
    return slugs


def tmdb_remote_fetch(endpoint: str, query: str = "") -> dict | None:
    full_url = f"https://api.themoviedb.org/3{endpoint}?api_key={TMDB_KEY}"
    if query:
        full_url += f"&{query}"
    
    cmd = [
        "ssh",
        "-i", str(SSH_KEY),
        "-o", "StrictHostKeyChecking=no",
        "-o", "ConnectTimeout=5",
        SERVER_HOST,
        f"curl -s '{full_url}'"
    ]
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", timeout=15)
        if res.returncode == 0 and res.stdout.strip():
            return json.loads(res.stdout)
    except Exception as e:
        print(f"Error fetching {endpoint}: {e}")
    return None


def collect_unreviewed_candidates(target_count: int = 350) -> list[dict]:
    existing_slugs = get_existing_slugs()
    candidates = []
    seen_ids = set()
    current_year = datetime.now().year

    GENRE_MAP = {
        28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
        99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
        27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
        10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    }

    def process_items(results: list, source_label: str) -> bool:
        for item in results:
            m_id = item.get("id")
            title = item.get("title")
            rel_date = item.get("release_date") or ""
            overview = item.get("overview") or ""

            if not m_id or not title or not rel_date:
                continue
            if m_id in seen_ids:
                continue
            seen_ids.add(m_id)

            m = re.match(r"^(\d{4})", rel_date)
            if not m:
                continue
            year = m.group(1)

            base_slug = slugify(title)
            slug = f"{base_slug}-{year}"
            if not re.match(r"^[a-z0-9_]+(?:-[a-z0-9_]+)*-(?:19|20)\d{2}$", slug):
                continue

            # Check if exists in existing local files
            if slug.lower() in existing_slugs or base_slug.lower() in existing_slugs:
                continue

            genre_names = [GENRE_MAP.get(gid, "Cinema") for gid in item.get("genre_ids", [])]
            genres_str = ", ".join(genre_names) if genre_names else "Drama, Cinema"

            candidates.append({
                "id": m_id,
                "title": title,
                "year": year,
                "slug": slug,
                "base_slug": base_slug,
                "overview": overview,
                "source": source_label,
                "genres": genres_str,
                "popularity": item.get("popularity", 0),
                "vote_average": item.get("vote_average", 0),
            })

            if len(candidates) >= target_count:
                return True
        return False

    feeds = [
        ("/trending/movie/day", "", "Trending Today", 5),
        ("/movie/now_playing", "region=US", "Now Playing", 5),
        ("/trending/movie/week", "", "Trending This Week", 5),
        ("/movie/upcoming", "region=US", "Upcoming Releases", 5),
    ]

    print("Fetching candidate movies from TMDB feeds...")
    for endpoint, extra, label, max_p in feeds:
        if len(candidates) >= target_count:
            break
        for page in range(1, max_p + 1):
            q = f"page={page}"
            if extra:
                q += f"&{extra}"
            data = tmdb_remote_fetch(endpoint, q)
            if not data or not data.get("results"):
                break
            if process_items(data["results"], label):
                break

    if len(candidates) < target_count:
        for year in range(current_year, 2012, -1):
            if len(candidates) >= target_count:
                break
            for page in range(1, 8):
                q = f"page={page}&primary_release_year={year}&sort_by=popularity.desc"
                data = tmdb_remote_fetch("/discover/movie", q)
                if not data or not data.get("results"):
                    break
                if process_items(data["results"], f"Popular {year}"):
                    break

    out_file = SCRIPT_DIR / "unreviewed_candidates.json"
    out_file.write_text(json.dumps(candidates, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Discovered {len(candidates)} unreviewed candidate movies. Saved to {out_file.name}")
    return candidates


if __name__ == "__main__":
    count = int(sys.argv[1]) if len(sys.argv) > 1 else 350
    collect_unreviewed_candidates(count)
