import type { z } from 'zod';
import { employeeEditSemanticGroups } from './employee-edit-flow';

type IssuePath = readonly PropertyKey[];

export function zodFieldErrors(
  error: z.ZodError,
  fieldOf: (path: IssuePath) => string,
  messageOf: (field: string) => string,
): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = fieldOf(issue.path);
    fieldErrors[field] ??= messageOf(field);
  }
  return fieldErrors;
}

export function rootIssueField(path: IssuePath): string {
  return String(path[0] ?? 'form');
}

/** Maps nested F07 metadata issues to their semantic-group form field. */
export function employeeUpdateIssueField(
  path: IssuePath,
  submittedHistoryMetadata: unknown,
): string {
  const root = rootIssueField(path);
  if (root !== 'historyMetadata') return root;
  const index = path[1];
  const field = path[2];
  if (
    typeof index === 'number' &&
    Array.isArray(submittedHistoryMetadata) &&
    typeof field === 'string'
  ) {
    const item: unknown = submittedHistoryMetadata[index];
    if (item && typeof item === 'object') {
      const semanticGroup = (item as Record<string, unknown>).semanticGroup;
      if (
        typeof semanticGroup === 'string' &&
        (employeeEditSemanticGroups as readonly string[]).includes(
          semanticGroup,
        )
      ) {
        return `historyMetadata.${semanticGroup}.${field}`;
      }
    }
  }
  return 'historyMetadata';
}

export function amendmentFieldError(field: string): string {
  if (field === 'effectiveDate') return 'Indiquez une date d’effet valide.';
  if (field === 'reference') {
    return 'La référence doit contenir 80 caractères maximum.';
  }
  return 'Vérifiez cette valeur.';
}
