import https from 'https';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const TMDB_API_KEY = process.env.TMDB_API_KEY;

https.get(`https://api.themoviedb.org/3/movie/1228710?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,similar`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const movie = JSON.parse(data);
    console.log("Title:", movie.title);
    console.log("Poster:", movie.poster_path);
    console.log("Backdrop:", movie.backdrop_path);
    if (movie.similar) {
       console.log("Similar count:", movie.similar.results.length);
    } else {
       console.log("Similar:", movie.similar);
    }
  });
});
