export function updateReviewsSearchParams(
  current: string,
  updates: Record<string, string | number | null>,
  options?: { keepSelected?: boolean; keepPage?: boolean },
) {
  const params = new URLSearchParams(current);
  params.delete('working');
  for (const [key, value] of Object.entries(updates)) {
    if (value === null || value === '' || value === 'ALL') params.delete(key);
    else params.set(key, String(value));
  }
  if (!options?.keepSelected) params.delete('selected');
  if (!Object.hasOwn(updates, 'page') && !options?.keepPage)
    params.delete('page');
  return params;
}

export function closeReviewSearchParams(current: string) {
  const params = new URLSearchParams(current);
  params.delete('selected');
  return params;
}
