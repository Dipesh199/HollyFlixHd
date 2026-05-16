import os
import json
import urllib.request
import re

# We will read the TMDB key from .env.local
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

def fetch_popular_movies(api_key, pages=2):
    movies = {}
    print(f"Fetching top {pages * 20} popular movies from TMDB...")
    
    for page in range(1, pages + 1):
        url = f"https://api.themoviedb.org/3/movie/popular?api_key={api_key}&page={page}"
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                data = json.loads(response.read().decode())
                for item in data.get('results', []):
                    title = item.get('title')
                    release_date = item.get('release_date', '')
                    if not title or not release_date:
                        continue
                    
                    year = release_date.split('-')[0]
                    slug = f"{slugify(title)}-{year}"
                    
                    # Add placeholder for ChatGPT to fill
                    movies[slug] = {
                        "_movieNameForChatGPT": f"{title} ({year})", # Temporary field so ChatGPT knows what movie this is
                        "editorial": "",
                        "worthWatching": True,
                        "editorRating": "Must Watch",
                        "tags": []
                    }
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            
    return movies

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
                
    new_movies = fetch_popular_movies(api_key, pages=2) # Fetches 40 movies
    
    # Merge, keeping existing ones intact
    added_count = 0
    for slug, data in new_movies.items():
        if slug not in existing_data:
            existing_data[slug] = data
            added_count += 1
            
    with open(editorials_file, 'w', encoding='utf-8') as f:
        json.dump(existing_data, f, indent=2)
        
    print(f"Success! Added {added_count} new movie placeholders to data/editorials.json.")
    print("You can now copy segments of this file to ChatGPT using the prompt provided.")

if __name__ == "__main__":
    main()
