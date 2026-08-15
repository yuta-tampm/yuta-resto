import { describe, expect, it } from 'vitest';
import {
  formatDocumentSize,
  getDocumentFileSelectionLabel,
} from './employee-documents-model';

describe('employee document presentation', () => {
  it('formats bounded PDF sizes for the French interface', () => {
    expect(formatDocumentSize(428 * 1024)).toBe('428 Ko');
    expect(formatDocumentSize(1_200_000)).toBe('1,1 Mo');
  });

  it('keeps the file selection copy in French', () => {
    expect(getDocumentFileSelectionLabel(null)).toBe(
      'Aucun fichier sélectionné',
    );
    expect(getDocumentFileSelectionLabel('contrat-signe.pdf')).toBe(
      'contrat-signe.pdf',
    );
  });
});
