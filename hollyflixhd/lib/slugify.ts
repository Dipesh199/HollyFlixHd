export const slugify = (text: string): string => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

export const generateMovieSlug = (title: string, id?: string | number): string => {
  const baseSlug = slugify(title);
  if (id) {
    return `${baseSlug}-${id}`;
  }
  return baseSlug;
};

export const extractIdFromSlug = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};
