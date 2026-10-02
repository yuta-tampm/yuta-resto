export function contentDisposition(
  disposition: 'inline' | 'attachment',
  filename: string,
): string {
  const asciiFilename = filename
    .normalize('NFKD')
    .replace(/[^a-zA-Z0-9._-]/gu, '_')
    .slice(0, 180);
  return `${disposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}
