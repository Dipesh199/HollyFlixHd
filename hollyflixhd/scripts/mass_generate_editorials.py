import os
import json
import urllib.request
import urllib.parse
import re
import time
import gzip

MODEL = "gemma4"
TMDB_BASE = "https://api.themoviedb.org/3"
BATCH_SIZE = 1

def get_tmdb_key():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('TMDB_API_KEY='):
                    return line.strip().split('=')[1]
    return None

def get_ollama_key():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('OLLAMA_API_KEY='):
                    return line.strip().split('=')[1]
    return None

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def fetch_movies_for_year(api_key, year, max_pages=1):
    movies = []
    for page in range(1, max_pages + 1):
        url = f"{TMDB_BASE}/discover/movie?api_key={api_key}&primary_release_year={year}&sort_by=popularity.desc&page={page}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                content = response.read()
                # If the content is gzipped (starts with gzip magic bytes 0x1f 0x8b)
                if content.startswith(b'\x1f\x8b'):
                    content = gzip.decompress(content)
                data = json.loads(content.decode('utf-8'))
                for item in data.get('results', []):
                    title = item.get('title')
                    if title:
                        movies.append(item)
        except Exception as e:
            print(f"Failed to fetch year {year}: {e}")
    return movies

def ask_ollama_batch(movies_batch, api_key=None):
    if api_key:
        url = "https://ollama.com/api/generate"
        headers = {'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'}
        target_model = "gpt-oss:20b-cloud"
    else:
        url = "http://localhost:11434/api/generate"
        headers = {'Content-Type': 'application/json'}
        target_model = MODEL
    
    # Construct the movie list text for the prompt
    movie_list_text = ""
    for m in movies_batch:
        movie_list_text += f"- Title: {m['title']} ({m['year']}) | Slug: {m['slug']} | Overview: {m['overview']}\n"

    prompt = f"""You are a senior movie critic and editorial writer for HollyFlixHD — a premium streaming platform.
Write editorial reviews for the following {len(movies_batch)} movies:

{movie_list_text}

EDITORIAL RULES:
- Write 4-6 sentences structured as: hook → what makes it unique → one standout element → who it's for
- Be specific — not "great acting" but "Joaquin Phoenix carries every scene with almost no dialogue"
- Be honest — briefly mention a flaw if it exists (pacing issues, weak third act, etc.). This builds reader trust.
- Avoid plot summary — focus on the experience and feeling of watching it
- Do not use superlatives like "masterpiece" or "stunning" unless editorRating is "Must Watch"
- Do not start with "I", "This movie", or the movie title
- Write in second person, addressing the reader as "you"
- Naturally include the movie's title, genre, and tone within the editorial text
- Do not use markdown or HTML inside any field values

OUTPUT RULES:
- Respond ONLY with valid JSON. No markdown, no ```json, no explanation.
- The response MUST be a single JSON object where keys are the EXACT slugs provided above
- Each value must match this structure EXACTLY:

{{
  "movie-slug": {{
    "editorial": "4-6 sentence engaging, spoiler-free editorial review with a strong hook.",
    "worthWatching": true,
    "editorRating": "Must Watch",
    "tags": ["mood-tag", "genre-tag", "audience-tag", "optional-4th-tag"],
    "toneAndPace": "slow-burn, cerebral, visually intense",
    "targetAudience": "Ideal for fans of psychological thrillers who enjoy non-linear storytelling.",
    "similarMovies": ["Movie A", "Movie B", "Movie C"],
    "watchReasons": ["career-best performance", "unpredictable narrative", "stunning practical effects"]
  }}
}}

FIELD RULES:
- editorRating: MUST be exactly one of: "Must Watch", "Worth Watching", "Skip It", "Cult Classic"
- tags: 3-4 short lowercase strings. Must include one mood/tone tag (e.g. "slow-burn"), one genre tag (e.g. "sci-fi"), one audience tag (e.g. "date-night", "solo-watch", "film-buffs")
- toneAndPace: 2-4 hyphenated descriptors only, comma-separated
- targetAudience: one sentence starting with "Ideal for..."
- similarMovies: 2-3 real, well-known titles in the same genre and tone
- watchReasons: 2-3 short specific phrases — avoid generic praise like "great story"
- worthWatching: true if editorRating is "Must Watch", "Worth Watching", or "Cult Classic" — false only for "Skip It"
"""
    
    payload = {
        "model": target_model,
        "prompt": prompt,
        "stream": False
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=300) as response:
            result = json.loads(response.read().decode())
            response_text = result.get('response', '')
            
            # Robust JSON extraction
            first_brace = response_text.find('{')
            last_brace = response_text.rfind('}')
            
            if first_brace != -1 and last_brace != -1:
                json_str = response_text[first_brace:last_brace + 1]
                return json.loads(json_str)
            else:
                raise ValueError("No JSON object found in response.")
    except Exception as e:
        print(f"  [Ollama Error]: {e}")
        return None

def main():
    api_key = get_tmdb_key()
    if not api_key:
        print("Error: TMDB_API_KEY not found in .env.local")
        return
        
    ollama_key = get_ollama_key()
    if ollama_key:
        print("Using Ollama Cloud Endpoint with API Key.")
    else:
        print("Using local Ollama Endpoint.")

    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    editorials_dir = os.path.join(data_dir, 'editorials')
    os.makedirs(editorials_dir, exist_ok=True)
    
    # Migrate existing editorials.json to individual files
    old_editorials_file = os.path.join(data_dir, 'editorials.json')
    if os.path.exists(old_editorials_file):
        print("Migrating old editorials.json to individual files...")
        try:
            with open(old_editorials_file, 'r', encoding='utf-8') as f:
                old_data = json.load(f)
            for slug, data in old_data.items():
                file_path = os.path.join(editorials_dir, f"{slug}.json")
                if not os.path.exists(file_path):
                    with open(file_path, 'w', encoding='utf-8') as f2:
                        json.dump(data, f2, indent=4)
            # Rename old file so we don't migrate again and it stops bloating the repo
            os.rename(old_editorials_file, old_editorials_file + ".bak")
            print("Migration complete! Old file renamed to editorials.json.bak")
        except Exception as e:
            print(f"Migration error: {e}")

    print(f"Starting Batch Auto-Generation with local model: {MODEL}")
    
    # Iterate through years in REVERSE (2026 down to 2010)
    for year in range(2026, 2009, -1):
        print(f"\n=== Processing Year: {year} ===")
        raw_movies = fetch_movies_for_year(api_key, year, max_pages=10) # Top 20 per year
        
        # Filter out movies that already have editorials
        movies_to_process = []
        for movie in raw_movies:
            title = movie.get('title')
            overview = movie.get('overview', '')
            slug = f"{slugify(title)}-{year}"
            
            file_path = os.path.join(editorials_dir, f"{slug}.json")
            if os.path.exists(file_path):
                print(f"Skipping {slug} (Already exists)")
            else:
                movies_to_process.append({
                    "title": title,
                    "year": year,
                    "slug": slug,
                    "overview": overview
                })
        
        # Process in batches
        for i in range(0, len(movies_to_process), BATCH_SIZE):
            batch = movies_to_process[i:i + BATCH_SIZE]
            
            print(f"Generating batch of {len(batch)} movies... ", end="", flush=True)
            start_time = time.time()
            
            generated_json = ask_ollama_batch(batch, ollama_key)
            
            if generated_json and isinstance(generated_json, dict):
                success_count = 0
                for slug, data in generated_json.items():
                    # Validate the data looks somewhat correct
                    if isinstance(data, dict) and "editorial" in data:
                        file_path = os.path.join(editorials_dir, f"{slug}.json")
                        with open(file_path, 'w', encoding='utf-8') as f:
                            json.dump(data, f, indent=4)
                        success_count += 1
                
                elapsed = time.time() - start_time
                print(f"Done! Saved {success_count} movies to individual files. ({elapsed:.1f}s)")
            else:
                print("Failed or returned invalid format.")

if __name__ == "__main__":
    main()
