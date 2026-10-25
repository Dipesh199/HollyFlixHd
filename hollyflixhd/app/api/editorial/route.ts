import { NextRequest, NextResponse } from 'next/server';
import { getEditorial, getOrGenerateEditorial, isPublishedEditorialSlug, isValidEditorialSlug } from '@/lib/editorial';
import { getMovieBySlug } from '@/lib/tmdb';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  if (!isValidEditorialSlug(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
  }

  if (!isPublishedEditorialSlug(slug)) {
    return NextResponse.json({ error: 'Editorial not published' }, { status: 404 });
  }

  // 1. Fast check if already exists
  const existing = getEditorial(slug);
  if (existing) {
    return NextResponse.json({ editorial: existing });
  }

  // 2. Fetch movie details to provide rich context to Ollama
  try {
    const movie = await getMovieBySlug(slug);
    if (!movie) {
      return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
    }
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';
    const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name;

    const editorial = await getOrGenerateEditorial(slug, {
      title: movie.title,
      year,
      overview: movie.overview,
      genres: movie.genres?.map(g => g.name),
      director,
    });

    if (!editorial) {
      return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
    }

    revalidatePath(`/movies/${slug}`);
    return NextResponse.json({ editorial });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal error';
    console.error(`[API /api/editorial] Error:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
