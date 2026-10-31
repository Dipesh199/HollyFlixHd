import json
import urllib.request
import urllib.error

url = 'https://ollama.com/api/generate'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ceb46ac70f1b4e67ad2bbbafcf845add.PBibCq4c7QDFvzcQ4m8aogX0'
}
prompt = """You are a movie guide writer for HollyFlixHD.
Write a clear, casual, and detailed movie review for everyday viewers.
Title: No Reservations (2007)
Genre: Comedy, Drama, Romance
Director: Scott Hicks
Overview: Master chef Kate Armstrong runs her life and her kitchen with intimidating intensity.

Do NOT overthink. Keep internal thinking very brief (under 50 words) and output the JSON immediately.
OUTPUT JSON FORMAT ONLY:
{
  "editorial": "A detailed 150-200 word review written in simple, natural English across 2 paragraphs.",
  "endingExplained": "A detailed 60-90 word plain English breakdown of the ending, final twist, and conclusion.",
  "worthWatching": true,
  "editorRating": "Must Watch",
  "tags": ["cooking", "romance"],
  "toneAndPace": "warm, charming",
  "targetAudience": "Fans of romantic comedies",
  "similarMovies": ["Chef", "Chocolat"],
  "watchReasons": ["great chemistry", "heartfelt story"]
}
"""

payload = {
    'model': 'beam',
    'prompt': prompt,
    'stream': False,
    'format': 'json',
    'options': {'num_predict': 8192, 'temperature': 0.3}
}

req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers)
try:
    with urllib.request.urlopen(req, timeout=60) as r:
        data = json.loads(r.read().decode('utf-8'))
        print('HTTP Status:', r.status)
        resp = data.get('response', '')
        print('Response length:', len(resp))
        print('Thinking length:', len(data.get('thinking', '')))
        if resp:
            print('Response snippet:', resp[:200])
        else:
            print('Thinking snippet:', data.get('thinking', '')[:200])
except urllib.error.HTTPError as e:
    print('HTTP Error:', e.code, e.read().decode('utf-8'))
except Exception as e:
    print('Error:', e)
