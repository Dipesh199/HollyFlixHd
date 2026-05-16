import os
import json
import urllib.request
import urllib.parse
import time

def get_tmdb_key():
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                if line.startswith('TMDB_API_KEY='):
                    return line.strip().split('=')[1]
    return None

def search_movie_id(api_key, query, year):
    encoded_query = urllib.parse.quote(query)
    url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={encoded_query}&primary_release_year={year}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            results = data.get('results', [])
            if results:
                return results[0]['id']
    except Exception as e:
        print(f"Error fetching {query}: {e}")
    return None

def main():
    api_key = get_tmdb_key()
    if not api_key:
        print("Error: TMDB_API_KEY not found in .env.local")
        return

    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')
    editorials_dir = os.path.join(data_dir, 'editorials')
    
    if not os.path.exists(editorials_dir):
        print("No editorials directory found.")
        return

    files = [f for f in os.listdir(editorials_dir) if f.endswith('.json')]
    print(f"Found {len(files)} files to check for migration.")
    
    success = 0
    failed = 0

    for file in files:
        # Check if the filename ends with a 4-digit year or an ID
        slug = file.replace('.json', '')
        parts = slug.split('-')
        last_part = parts[-1]
        
        # If it's exactly 4 digits starting with 19 or 20, it's likely a year
        if len(last_part) == 4 and (last_part.startswith('19') or last_part.startswith('20')):
            year = last_part
            title_query = " ".join(parts[:-1])
            
            print(f"Migrating {slug}... ", end="", flush=True)
            movie_id = search_movie_id(api_key, title_query, year)
            
            if movie_id:
                new_slug = f"{'-'.join(parts[:-1])}-{movie_id}"
                old_path = os.path.join(editorials_dir, file)
                new_path = os.path.join(editorials_dir, f"{new_slug}.json")
                
                # Check if target already exists just in case
                if not os.path.exists(new_path):
                    os.rename(old_path, new_path)
                    print(f"-> {new_slug}.json")
                    success += 1
                else:
                    print(f"-> target {new_slug}.json already exists. Deleting old file.")
                    os.remove(old_path)
                    success += 1
            else:
                print("FAILED to find ID from TMDB.")
                failed += 1
                
            time.sleep(0.1) # Be nice to TMDB API
            
    print(f"\nMigration complete! Successfully renamed {success} files. Failed: {failed}")

if __name__ == "__main__":
    main()
