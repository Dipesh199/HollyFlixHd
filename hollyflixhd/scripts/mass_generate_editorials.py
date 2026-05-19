import os
import json
import urllib.request
import urllib.parse
import re
import time

MODEL = "gemma4"
TMDB_BASE = "https://api.themoviedb.org/3"
BATCH_SIZE = 3

def get_tmdb_key():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('TMDB_API_KEY='):
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
                data = json.loads(response.read().decode())
                for item in data.get('results', []):
                    title = item.get('title')
                    if title:
                        movies.append(item)
        except Exception as e:
            print(f"Failed to fetch year {year}: {e}")
    return movies

def ask_ollama_batch(movies_batch):
    url = "http://localhost:11434/api/generate"
    
    # Construct the movie list text for the prompt
    movie_list_text = ""
    for m in movies_batch:
        movie_list_text += f"- Title: {m['title']} ({m['year']}) | Slug: {m['slug']} | Overview: {m['overview']}\n"

    prompt = f"""You are a professional movie critic for HollyFlixHD.
Write a JSON object containing editorial reviews for the following {len(movies_batch)} movies:

{movie_list_text}

Respond ONLY with valid JSON. Do not include markdown (no ```json). Do not include conversational text.
Your response MUST be a single JSON object where the keys are the EXACT slugs provided above, and the values match this structure:
{{
  "movie-slug-1": {{
    "editorial": "2-3 sentences of an engaging, spoiler-free, premium review with a strong hook.",
    "worthWatching": true,
    "editorRating": "Must Watch",
    "tags": ["tag1", "tag2"]
  }},
  "movie-slug-2": {{
    ...
  }}
}}

Note: editorRating MUST be exactly one of: "Must Watch", "Worth Watching", "Skip It", "Cult Classic".
"""
    
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
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
            
            generated_json = ask_ollama_batch(batch)
            
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
