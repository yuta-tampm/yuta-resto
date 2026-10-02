import type { PersonnelRegisterEntry } from '@yuta/contracts/personnel';
import { PDFDocument } from 'pdf-lib';
import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));

import {
  buildPersonnelRegisterPdf,
  PersonnelRegisterPdfError,
} from '../src/server/personnel-register/pdf';

function entry(
  overrides: Partial<PersonnelRegisterEntry['facts']> = {},
): PersonnelRegisterEntry {
  return {
    id: '0198c7af-37b8-7aa6-af0e-7fef3b81aaf1',
    employeeId: '0198c7af-37b8-7aa6-af0e-7fef3b81aaf2',
    sequence: 1,
    revision: 1,
    inscribedAt: '2026-08-18T10:00:00.000Z',
    updatedAt: '2026-08-18T10:00:00.000Z',
    facts: {
      givenNames: 'Thị Ánh',
      familyName: 'Đặng',
      nationalityCode: 'VN',
      nationalityLabel: 'Vietnamienne',
      birthDate: '1994-05-12',
      sex: 'F',
      position: 'Cheffe de rang',
      qualification: 'Employée qualifiée',
      entryDate: '2026-08-01',
      departureDate: null,
      protectedAuthorization: {
        required: false,
        authorizationDate: null,
        requestDate: null,
      },
      workAuthorization: {
        required: false,
        titleType: null,
        orderNumber: null,
      },
      employmentTermType: 'indefinite',
      workTimeCategory: 'full_time',
      temporaryWorkCompany: null,
      employerGroup: null,
      specialContract: 'none',
      ...overrides,
    },
  };
}

describe('personnel register PDF', () => {
  it('creates a readable PDF with Vietnamese and Cyrillic text', async () => {
    const bytes = await buildPersonnelRegisterPdf({
      establishmentName: 'YUTA République',
      snapshotRevision: 2,
      generatedAt: '2026-08-18T10:00:00.000Z',
      items: [entry(), entry({ givenNames: 'Иван', familyName: 'Петров' })],
    });

    expect(new TextDecoder('ascii').decode(bytes.slice(0, 4))).toBe('%PDF');
    const document = await PDFDocument.load(bytes);
    expect(document.getPageCount()).toBe(2);
  });

  it('blocks export instead of replacing unsupported text', async () => {
    await expect(
      buildPersonnelRegisterPdf({
        establishmentName: 'YUTA République',
        snapshotRevision: 1,
        generatedAt: '2026-08-18T10:00:00.000Z',
        items: [entry({ givenNames: 'ليلى' })],
      }),
    ).rejects.toBeInstanceOf(PersonnelRegisterPdfError);
  });
});
