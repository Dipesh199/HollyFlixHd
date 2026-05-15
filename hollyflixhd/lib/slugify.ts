export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

export const generateMovieSlug = (title: string, year?: string | number): string => {
  const baseSlug = slugify(title);
  if (year) {
    const yearStr = typeof year === 'string' ? year.split('-')[0] : year;
    return `${baseSlug}-${yearStr}`;
  }
  return baseSlug;
};

export const extractIdFromSlug = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};
