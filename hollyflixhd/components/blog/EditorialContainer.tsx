'use client';

import React, { useState, useEffect } from 'react';
import { Editorial } from '@/lib/editorial';
import { EditorialSection } from '@/components/blog/EditorialSection';
import { EditorialSkeleton } from '@/components/blog/EditorialSkeleton';
import { Movie } from '@/types/movie';

interface Props {
  slug: string;
  movie: Movie;
  initialEditorial?: Editorial | null;
}

export function EditorialContainer({ slug, movie, initialEditorial = null }: Props) {
  const [editorial, setEditorial] = useState<Editorial | null>(initialEditorial);
  const [isGenerating, setIsGenerating] = useState<boolean>(!initialEditorial);

  useEffect(() => {
    // If we already have the review, do nothing
    if (editorial) return;

    let isMounted = true;
    setIsGenerating(true);

    fetch(`/api/editorial?slug=${encodeURIComponent(slug)}`)
      .then((res) => {
        if (!res.ok) throw new Error('Editorial generation failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted && data.editorial) {
          setEditorial(data.editorial);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load editorial:', err);
        if (isMounted) setIsGenerating(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, editorial]);

  if (editorial) {
    return <EditorialSection data={editorial} movieTitle={movie.title} />;
  }

  if (isGenerating) {
    return <EditorialSkeleton movieTitle={movie.title} />;
  }

  return null;
}
