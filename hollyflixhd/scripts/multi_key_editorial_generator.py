#!/usr/bin/env python3
"""
Multi-Key Concurrent Editorial Generator for HollyFlixHD
--------------------------------------------------------
Spawns parallel worker threads based on the number of available Ollama API keys
in 'ollama_keys.txt' (e.g. 10 keys = 10 simultaneous editorial generations).

Features:
- Dynamic concurrency scaling: Concurrency matches the number of active keys in ollama_keys.txt.
- Zero duplicate guarantee: Pre-indexes 8,600+ existing editorials and locks slug registry.
- Resilient rate-limit handling: When a key hits HTTP 429 quota limit, it safely shuts down
  while other active keys continue generating. The pending movie is returned to the queue.
- Real-time thread-safe terminal monitoring with live progress and worker stats.
- Detailed end-of-run report detailing total generation count and per-key exhaustion status.
"""

import argparse
import json
import os
import queue
import re
import sys
import threading
import time
import unicodedata
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
KEYS_FILE = SCRIPT_DIR / "ollama_keys.txt"
CANDIDATES_FILE = SCRIPT_DIR / "candidates.json"
LOG_FILE = SCRIPT_DIR / "multi_key_generator.log"

DEFAULT_MODEL = "beam"
VALID_RATINGS = {"Must Watch", "Worth Watching", "Skip It", "Cult Classic"}

# Threading locks & state
PRINT_LOCK = threading.Lock()
SLUG_CACHE_LOCK = threading.Lock()
COUNTER_LOCK = threading.Lock()

EXISTING_EDITORIAL_SLUGS: set[str] = set()


class ThreadSafeLogger:
    def __init__(self, filepath: Path):
        self.terminal = sys.stdout
        self.filepath = filepath
        self.log_file = open(filepath, "a", encoding="utf-8", buffering=1)
        self.lock = threading.Lock()

    def write(self, message: str):
        with self.lock:
            self.terminal.write(message)
            self.terminal.flush()
            try:
                self.log_file.write(message)
                self.log_file.flush()
            except Exception:
                pass

    def flush(self):
        with self.lock:
            self.terminal.flush()
            try:
                self.log_file.flush()
            except Exception:
                pass


LOGGER = ThreadSafeLogger(LOG_FILE)


def safe_print(msg: str):
    with PRINT_LOCK:
        LOGGER.write(msg + "\n")


def mask_key(key: str) -> str:
    """Mask key for safe logging (e.g. d05159...Gls)."""
    if len(key) <= 12:
        return key[:4] + "..."
    return f"{key[:6]}...{key[-4:]}"


def load_env():
    """Load environment variables from .env.local or .env if present."""
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


def load_api_keys(keys_file: Path) -> list[str]:
    """Load all valid, non-commented API keys from ollama_keys.txt or fallback to env."""
    keys = []
    if keys_file.is_file():
        for line in keys_file.read_text(encoding="utf-8").splitlines():
            clean = line.strip()
            if clean and not clean.startswith("#"):
                # Clean possible trailing comments or quotes
                parts = clean.split("#")[0].strip().strip("'\"")
                if parts and parts not in keys:
                    keys.append(parts)

    if not keys:
        env_key = os.environ.get("OLLAMA_API_KEY")
        if env_key:
            keys.append(env_key)

    return keys


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("utf-8")
    text = text.lower().strip()
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"[^a-z0-9\-]+", "", text)
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
    if PERSISTENT_SERVER_DIR.is_dir():
        return PERSISTENT_SERVER_DIR
    return EDITORIALS_DIR


def init_existing_slugs() -> set[str]:
    """Pre-index all existing editorial filenames to guarantee zero duplicate generation."""
    global EXISTING_EDITORIAL_SLUGS
    with SLUG_CACHE_LOCK:
        EXISTING_EDITORIAL_SLUGS.clear()
        storage_dir = get_target_storage_dir()
        for directory in {storage_dir, EDITORIALS_DIR}:
            if directory.is_dir():
                for p in directory.glob("*.json"):
                    try:
                        if p.is_file() and p.stat().st_size > 0:
                            EXISTING_EDITORIAL_SLUGS.add(p.stem.lower())
                    except OSError:
                        pass
        return set(EXISTING_EDITORIAL_SLUGS)


def editorial_exists(slug: str, base_slug: str | None = None) -> bool:
    """Check if editorial already exists in memory cache or filesystem."""
    with SLUG_CACHE_LOCK:
        slug_lower = slug.lower()
        if slug_lower in EXISTING_EDITORIAL_SLUGS:
            return True
        if base_slug and base_slug.lower() in EXISTING_EDITORIAL_SLUGS:
            return True

        storage_dir = get_target_storage_dir()
        target_path = storage_dir / f"{slug}.json"
        if target_path.is_file() and target_path.stat().st_size > 0:
            EXISTING_EDITORIAL_SLUGS.add(slug_lower)
            return True

        if storage_dir != EDITORIALS_DIR:
            local_path = EDITORIALS_DIR / f"{slug}.json"
            if local_path.is_file() and local_path.stat().st_size > 0:
                EXISTING_EDITORIAL_SLUGS.add(slug_lower)
                return True

        return False


def register_saved_slug(slug: str, base_slug: str | None = None):
    with SLUG_CACHE_LOCK:
        EXISTING_EDITORIAL_SLUGS.add(slug.lower())
        if base_slug:
            EXISTING_EDITORIAL_SLUGS.add(base_slug.lower())


def save_editorial_atomically(slug: str, editorial_data: dict, base_slug: str | None = None) -> bool:
    storage_dir = get_target_storage_dir()
    storage_dir.mkdir(parents=True, exist_ok=True)
    target_path = storage_dir / f"{slug}.json"
    temp_path = storage_dir / f".{slug}.{os.getpid()}_{threading.get_ident()}.tmp"

    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(editorial_data, f, indent=2, ensure_ascii=False)
        temp_path.replace(target_path)
        register_saved_slug(slug, base_slug)
        return True
    except Exception as e:
        if temp_path.exists():
            try:
                temp_path.unlink()
            except Exception:
                pass
        safe_print(f"    [Save Error] Failed to write {target_path.name}: {e}")
        return False


def generate_editorial_llm(movie: dict, api_key: str, model: str) -> tuple[dict | None, bool]:
    """
    Generate an editorial review using Ollama Cloud.
    Returns (editorial_dict or None, is_rate_limited: bool)
    """
    title = movie["title"]
    year = movie["year"]
    overview = movie.get("overview") or "Plot synopsis not available."
    genres = movie.get("genres") or "Drama, Cinema"
    director = movie.get("director") or "Acclaimed Director"

    thinking_directive = "Do NOT overthink. Keep internal thinking very brief (under 50 words) and output the JSON immediately.\n" if model == "beam" else ""

    prompt = f"""You are a movie guide writer for HollyFlixHD.
Write a clear, casual, and detailed movie review for everyday viewers.
Title: {title} ({year})
Genre: {genres}
Director: {director}
Overview: {overview}

{thinking_directive}LANGUAGE & LENGTH RULES:
- Use simple, natural, conversational English (8th-grade reading level). Talk like a friend recommending a movie.
- NO fancy, pretentious, or academic words (DO NOT use: visceral, claustrophobic, cerebral, juxtaposition, tour-de-force, metaphor, descent, haunting, tapestry).
- LENGTH REQUIREMENT FOR EDITORIAL: The "editorial" review MUST be at least 150 to 200 words long (2 detailed paragraphs).
  * Paragraph 1: An engaging hook about the setup, main characters, and overall vibe. Avoid repetitive opening formulas like "Imagine you are...".
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
        "Authorization": f"Bearer {api_key}",
    }

    num_predict = 8192 if model == "beam" else 1500
    temperature = 0.3 if model == "beam" else 0.7

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "num_predict": num_predict,
            "temperature": temperature,
        },
    }

    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers)

    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read().decode("utf-8"))
                response_text = result.get("response", "").strip()

                first_brace = response_text.find("{")
                last_brace = response_text.rfind("}")
                if first_brace != -1 and last_brace != -1:
                    clean_json = response_text[first_brace : last_brace + 1]
                    parsed = json.loads(clean_json)

                    if not isinstance(parsed, dict):
                        return None, False
                    if not isinstance(parsed.get("editorial"), str) or not parsed["editorial"].strip():
                        return None, False
                    if parsed.get("editorRating") not in VALID_RATINGS:
                        parsed["editorRating"] = "Must Watch"
                    if "worthWatching" not in parsed:
                        parsed["worthWatching"] = parsed["editorRating"] != "Skip It"
                    if not isinstance(parsed.get("tags"), list):
                        parsed["tags"] = ["movie-night", "featured"]

                    return parsed, False
                else:
                    if attempt == 0:
                        time.sleep(1)
                        continue
                    return None, False
        except urllib.error.HTTPError as e:
            if e.code == 429:
                return None, True
            if attempt == 0:
                time.sleep(1.5)
                continue
            return None, False
        except Exception as e:
            if attempt == 0:
                time.sleep(1.5)
                continue
            return None, False

    return None, False


def load_candidate_queue(candidates_path: Path, target_limit: int) -> queue.Queue:
    """Load candidate movies, filter duplicates against existing editorials, and populate queue."""
    q = queue.Queue()
    if not candidates_path.is_file():
        safe_print(f"[Error] Candidates file not found at: {candidates_path}")
        return q

    try:
        with open(candidates_path, "r", encoding="utf-8") as f:
            items = json.load(f)
    except Exception as e:
        safe_print(f"[Error] Failed to read candidates: {e}")
        return q

    added = 0
    seen_slugs = set()

    for item in items:
        title = item.get("title")
        year = str(item.get("year") or "").strip()
        if not year and item.get("release_date"):
            m = re.match(r"^(\d{4})", item["release_date"])
            if m:
                year = m.group(1)

        if not title or not year or not re.match(r"^(?:19|20)\d{2}$", year):
            continue

        base_slug = slugify(title)
        slug = generate_movie_slug(title, year)
        if not is_valid_editorial_slug(slug) or slug in seen_slugs:
            continue

        if editorial_exists(slug, base_slug):
            continue

        seen_slugs.add(slug)
        movie_data = {
            "id": item.get("id"),
            "title": title,
            "year": year,
            "slug": slug,
            "base_slug": base_slug,
            "overview": item.get("overview") or "Plot synopsis not available.",
            "source": item.get("source") or "Candidate Feed",
            "genres": item.get("genres") or "Drama, Cinema",
            "director": item.get("director") or "Acclaimed Director",
        }
        q.put(movie_data)
        added += 1

    return q


def worker_loop(
    worker_id: int,
    api_key: str,
    movie_queue: queue.Queue,
    stats: dict,
    stop_event: threading.Event,
    target_limit: int,
    model: str,
    active_workers_tracker: dict,
):
    key_masked = mask_key(api_key)
    stats[worker_id] = {
        "key_masked": key_masked,
        "success": 0,
        "failed": 0,
        "rate_limited": False,
        "exhausted_at": None,
    }

    while not stop_event.is_set():
        # Check global limit (0 = endless)
        with COUNTER_LOCK:
            current_total = stats["_total_success"]
            if target_limit > 0 and current_total >= target_limit:
                stop_event.set()
                break

        try:
            movie = movie_queue.get(timeout=1.0)
        except queue.Empty:
            break

        slug = movie["slug"]
        base_slug = movie["base_slug"]

        # Double check existence in case another worker just completed it
        if editorial_exists(slug, base_slug):
            movie_queue.task_done()
            continue

        start_time = time.time()
        editorial, is_rate_limited = generate_editorial_llm(movie, api_key, model)

        if is_rate_limited:
            # Put movie back so another active worker can take it!
            movie_queue.put(movie)
            movie_queue.task_done()

            stats[worker_id]["rate_limited"] = True
            stats[worker_id]["exhausted_at"] = datetime.now().strftime("%H:%M:%S")

            with COUNTER_LOCK:
                active_workers_tracker["count"] -= 1
                remaining_active = active_workers_tracker["count"]

            safe_print(
                f"\n🚨 [KEY #{worker_id:02d} EXHAUSTED] ({key_masked}) reached Ollama 429 quota limit!\n"
                f"   Worker #{worker_id:02d} stopped. Remaining active workers: {remaining_active}\n"
            )
            break

        if editorial:
            saved = save_editorial_atomically(slug, editorial, base_slug)
            if saved:
                duration = time.time() - start_time
                with COUNTER_LOCK:
                    stats["_total_success"] += 1
                    stats[worker_id]["success"] += 1
                    completed = stats["_total_success"]
                    active_now = active_workers_tracker["count"]

                limit_label = f"{target_limit}" if target_limit > 0 else "∞"
                safe_print(
                    f"[{completed:04d}/{limit_label}] [Worker #{worker_id:02d} | {key_masked}] "
                    f"[+] Saved {slug}.json ({duration:.1f}s) | Active Workers: {active_now}"
                )
            else:
                stats[worker_id]["failed"] += 1
                movie_queue.put(movie)
        else:
            stats[worker_id]["failed"] += 1
            retries = movie.get("retry_count", 0)
            if retries < 1:
                movie["retry_count"] = retries + 1
                movie_queue.put(movie)
            else:
                safe_print(
                    f"    [Worker #{worker_id:02d} | {key_masked}] [!] Format error for {movie['title']} ({movie['year']}). Skipping."
                )

        movie_queue.task_done()
        time.sleep(0.3)

    # Worker exit
    with COUNTER_LOCK:
        if not stats[worker_id]["rate_limited"]:
            active_workers_tracker["count"] = max(0, active_workers_tracker["count"] - 1)


def main():
    parser = argparse.ArgumentParser(
        description="Multi-Key Concurrent Editorial Generator for HollyFlixHD"
    )
    parser.add_argument(
        "--keys-file",
        type=str,
        default=str(KEYS_FILE),
        help=f"Path to file containing Ollama API keys (default: {KEYS_FILE.name})",
    )
    parser.add_argument(
        "--candidates",
        type=str,
        default=str(CANDIDATES_FILE),
        help=f"Path to pre-fetched candidate movies JSON (default: {CANDIDATES_FILE.name})",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Target number of new editorials to generate (default: 0 for endless generation)",
    )
    parser.add_argument(
        "--model",
        type=str,
        default=DEFAULT_MODEL,
        help=f"Ollama model name (default: {DEFAULT_MODEL})",
    )
    args = parser.parse_args()

    # 1. Load Keys
    keys_path = Path(args.keys_file)
    api_keys = load_api_keys(keys_path)
    if not api_keys:
        safe_print(f"[Error] No Ollama API keys found in {keys_path} or environment.")
        safe_print(f"Please add your API keys (one per line) to: {keys_path}")
        sys.exit(1)

    # 2. Index Existing Files
    existing_count = len(init_existing_slugs())

    # 3. Populate Candidate Queue
    candidate_queue = load_candidate_queue(Path(args.candidates), args.limit)
    total_candidates = candidate_queue.qsize()

    target_desc = f"{args.limit} new editorials" if args.limit > 0 else "Endless / Continuous (Runs until stopped or all keys exhausted)"

    safe_print("=" * 66)
    safe_print("🚀 HollyFlixHD - Multi-Key Concurrent Editorial Generator")
    safe_print("=" * 66)
    safe_print(f"Target Mode         : {target_desc}")
    safe_print(f"Available API Keys  : {len(api_keys)} keys (Spawning {len(api_keys)} parallel workers)")
    safe_print(f"Model               : {args.model}")
    safe_print(f"Existing Editorials : {existing_count} indexed (guaranteed 0 duplicates)")
    safe_print(f"Candidate Queue     : {total_candidates} unreviewed movies ready")
    safe_print(f"Storage Directory   : {get_target_storage_dir()}")
    safe_print(f"Log File            : {LOG_FILE}")
    safe_print("-" * 66)
    safe_print("Active Keys Loaded:")
    for idx, k in enumerate(api_keys, 1):
        safe_print(f"  Worker #{idx:02d} -> {mask_key(k)}")
    safe_print("=" * 66 + "\n")

    if total_candidates == 0:
        safe_print("All candidate movies already have editorials! Nothing to generate.")
        return

    stats = {"_total_success": 0}
    stop_event = threading.Event()
    active_workers_tracker = {"count": len(api_keys)}
    threads = []
    start_run_time = time.time()

    # 4. Spawn Worker Threads
    for worker_id, api_key in enumerate(api_keys, 1):
        t = threading.Thread(
            target=worker_loop,
            args=(
                worker_id,
                api_key,
                candidate_queue,
                stats,
                stop_event,
                args.limit,
                args.model,
                active_workers_tracker,
            ),
            daemon=True,
            name=f"Worker-{worker_id:02d}",
        )
        threads.append(t)
        t.start()

    # 5. Monitor Main Loop
    try:
        while any(t.is_alive() for t in threads):
            with COUNTER_LOCK:
                if args.limit > 0 and stats["_total_success"] >= args.limit:
                    stop_event.set()
                    break
                if active_workers_tracker["count"] == 0:
                    safe_print("\n⚠️ All API keys have reached their quota limits! Stopping generation.")
                    stop_event.set()
                    break
            time.sleep(0.5)

        for t in threads:
            t.join(timeout=2.0)
    except KeyboardInterrupt:
        safe_print("\n[!] Ctrl+C detected. Shutting down workers gracefully...")
        stop_event.set()
        for t in threads:
            t.join(timeout=2.0)

    total_duration = time.time() - start_run_time
    total_generated = stats["_total_success"]

    # 6. Comprehensive Summary Report
    safe_print("\n" + "=" * 66)
    safe_print("📊 GENERATION SUMMARY REPORT")
    safe_print("=" * 66)
    limit_str = f"/ {args.limit}" if args.limit > 0 else "(Endless Mode)"
    safe_print(f"Total Editorials Generated : {total_generated} {limit_str}")
    safe_print(f"Total Run Time             : {total_duration:.1f}s ({total_duration/60:.1f} min)")
    if total_duration > 0 and total_generated > 0:
        rate = total_generated / (total_duration / 60)
        safe_print(f"Generation Rate            : {rate:.1f} editorials / minute")
    safe_print("-" * 66)
    safe_print("API Key Breakdown & Quota Status:")

    exhausted_keys = []
    active_keys = []

    for worker_id in range(1, len(api_keys) + 1):
        info = stats.get(worker_id, {})
        m_key = info.get("key_masked", f"Worker-{worker_id}")
        s_count = info.get("success", 0)
        is_exhausted = info.get("rate_limited", False)
        ex_time = info.get("exhausted_at")

        if is_exhausted:
            status_str = f"❌ EXHAUSTED (Hit 429 at {ex_time})"
            exhausted_keys.append((worker_id, m_key))
        else:
            status_str = "✅ ACTIVE"
            active_keys.append((worker_id, m_key))

        safe_print(f"  Worker #{worker_id:02d} ({m_key}): {s_count:3d} generated | {status_str}")

    safe_print("-" * 66)
    safe_print(f"Keys Still Active   : {len(active_keys)} / {len(api_keys)}")
    safe_print(f"Keys Limit Reached  : {len(exhausted_keys)} / {len(api_keys)}")

    if exhausted_keys:
        safe_print("\n🚨 Keys That Reached Quota Limits:")
        for wid, k in exhausted_keys:
            safe_print(f"   - Worker #{wid:02d}: {k}")
    else:
        safe_print("\n✨ All API keys remained healthy and within quota!")

    safe_print("=" * 66 + "\n")


if __name__ == "__main__":
    main()
