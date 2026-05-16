import os
import json
import urllib.request
import urllib.parse
import re
import time

MODEL = "gemma4" # Reverted back to the exact name you have!
TMDB_BASE = "https://api.themoviedb.org/3"

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

def ask_ollama(title, year, overview):
    url = "http://localhost:11434/api/generate"
    
    prompt = f"""You are a professional movie critic for HollyFlixHD.
Write a JSON editorial for the movie "{title} ({year})".
Movie Overview: {overview}

Respond ONLY with valid JSON. Do not include markdown (no ```json). Do not include conversational text.
Use this exact structure:
{{
  "editorial": "2-3 sentences of an engaging, spoiler-free, premium review with a strong hook.",
  "worthWatching": true,
  "editorRating": "Must Watch",
  "tags": ["tag1", "tag2"]
}}

Note: editorRating MUST be one of: "Must Watch", "Worth Watching", "Skip It", "Cult Classic".
"""
    
    payload = {
        "model": MODEL,
        "prompt": prompt,
        "stream": False
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
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

    editorials_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'editorials.json')
    
    # Load existing data
    existing_data = {}
    if os.path.exists(editorials_file):
        with open(editorials_file, 'r', encoding='utf-8') as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                pass

    print(f"Starting Auto-Generation with local model: {MODEL}")
    
    # Iterate through years
    for year in range(2010, 2026):
        print(f"\n=== Processing Year: {year} ===")
        movies = fetch_movies_for_year(api_key, year, max_pages=20) # Top 20 per year
        
        for movie in movies:
            title = movie.get('title')
            overview = movie.get('overview', '')
            slug = f"{slugify(title)}-{year}"
            
            # Check if we already have a valid editorial
            existing = existing_data.get(slug, {})
            if existing.get('editorial'):
                print(f"⏩ Skipping {slug} (Already exists)")
                continue
                
            print(f"✍️  Generating: {title} ({year})... ", end="", flush=True)
            start_time = time.time()
            
            generated_json = ask_ollama(title, year, overview)
            
            if generated_json:
                existing_data[slug] = generated_json
                elapsed = time.time() - start_time
                print(f"Done! ({elapsed:.1f}s)")
                
                # Save immediately so progress isn't lost if script is stopped
                with open(editorials_file, 'w', encoding='utf-8') as f:
                    json.dump(existing_data, f, indent=2)
            else:
                print("Failed.")

if __name__ == "__main__":
    main()
