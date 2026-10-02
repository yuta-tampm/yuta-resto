export function nullableText(value: FormDataEntryValue | null): string | null {
  const normalized = String(value ?? '').trim();
  return normalized || null;
}
