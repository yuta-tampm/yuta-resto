import 'server-only';

import type { PersonnelRegisterEntry } from '@yuta/contracts/personnel';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, rgb, type PDFFont, type PDFPage } from 'pdf-lib';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

type PersonnelRegisterExportSnapshot = {
  establishmentName: string;
  snapshotRevision: number;
  generatedAt: string;
  items: PersonnelRegisterEntry[];
};

type ScriptFontKey =
  | 'latin'
  | 'latinExt'
  | 'vietnamese'
  | 'greek'
  | 'greekExt'
  | 'cyrillic'
  | 'cyrillicExt'
  | 'devanagari';

type RegisterFonts = Record<ScriptFontKey, { regular: PDFFont; bold: PDFFont }>;
type FontBytes = Record<
  ScriptFontKey,
  { regular: Uint8Array; bold: Uint8Array }
>;

let fontBytesPromise: Promise<FontBytes> | null = null;

function fontPath(filename: string): string {
  return join(
    process.cwd(),
    'node_modules',
    '@fontsource',
    'noto-sans',
    'files',
    filename,
  );
}

const FONT_PATHS: Record<ScriptFontKey, { regular: string; bold: string }> = {
  latin: {
    regular: fontPath('noto-sans-latin-400-normal.woff'),
    bold: fontPath('noto-sans-latin-700-normal.woff'),
  },
  latinExt: {
    regular: fontPath('noto-sans-latin-ext-400-normal.woff'),
    bold: fontPath('noto-sans-latin-ext-700-normal.woff'),
  },
  vietnamese: {
    regular: fontPath('noto-sans-vietnamese-400-normal.woff'),
    bold: fontPath('noto-sans-vietnamese-700-normal.woff'),
  },
  greek: {
    regular: fontPath('noto-sans-greek-400-normal.woff'),
    bold: fontPath('noto-sans-greek-700-normal.woff'),
  },
  greekExt: {
    regular: fontPath('noto-sans-greek-ext-400-normal.woff'),
    bold: fontPath('noto-sans-greek-ext-700-normal.woff'),
  },
  cyrillic: {
    regular: fontPath('noto-sans-cyrillic-400-normal.woff'),
    bold: fontPath('noto-sans-cyrillic-700-normal.woff'),
  },
  cyrillicExt: {
    regular: fontPath('noto-sans-cyrillic-ext-400-normal.woff'),
    bold: fontPath('noto-sans-cyrillic-ext-700-normal.woff'),
  },
  devanagari: {
    regular: fontPath('noto-sans-devanagari-400-normal.woff'),
    bold: fontPath('noto-sans-devanagari-700-normal.woff'),
  },
};

export class PersonnelRegisterPdfError extends Error {
  constructor(public readonly unsupportedCharacter: string) {
    super(
      'The register contains a character unsupported by the local PDF font set.',
    );
    this.name = 'PersonnelRegisterPdfError';
  }
}

export async function buildPersonnelRegisterPdf(
  snapshot: PersonnelRegisterExportSnapshot,
): Promise<Uint8Array> {
  const document = await PDFDocument.create();
  document.registerFontkit(fontkit);
  document.setTitle('Registre unique du personnel');
  document.setSubject('Export local structuré du registre du personnel');
  document.setCreator('YUTA Backoffice');
  const fonts = await embedFonts(document);
  const totalPages = snapshot.items.length;

  for (const [index, entry] of snapshot.items.entries()) {
    const page = document.addPage([595.28, 841.89]);
    const { height } = page.getSize();
    drawUnicodeText(page, fonts, 'Registre unique du personnel', {
      x: 42,
      y: height - 52,
      size: 18,
      bold: true,
      color: rgb(0.06, 0.25, 0.2),
    });
    drawUnicodeText(page, fonts, snapshot.establishmentName, {
      x: 42,
      y: height - 76,
      size: 11,
    });
    drawUnicodeText(
      page,
      fonts,
      `Génération : ${formatDateTime(snapshot.generatedAt)} · Révision : ${snapshot.snapshotRevision}`,
      { x: 42, y: height - 94, size: 8 },
    );
    page.drawLine({
      start: { x: 42, y: height - 110 },
      end: { x: 553, y: height - 110 },
      thickness: 1,
      color: rgb(0.8, 0.82, 0.81),
    });
    let y = height - 145;
    drawUnicodeText(page, fonts, `Inscription n° ${entry.sequence}`, {
      x: 42,
      y,
      size: 14,
      bold: true,
    });
    y -= 28;
    for (const [label, value] of getEntryLines(entry)) {
      y = drawFact(page, fonts, label, value, y);
    }
    drawUnicodeText(
      page,
      fonts,
      `Page ${index + 1}/${totalPages} · Inscription ${entry.sequence} · Version ${entry.revision}`,
      { x: 42, y: 30, size: 8 },
    );
  }
  return document.save();
}

function getEntryLines(
  entry: PersonnelRegisterEntry,
): readonly (readonly [string, string])[] {
  const facts = entry.facts;
  return [
    ['Nom et prénoms', `${facts.familyName} ${facts.givenNames}`],
    ['Nationalité', `${facts.nationalityLabel} (${facts.nationalityCode})`],
    ['Date de naissance', facts.birthDate],
    ['Sexe', facts.sex],
    ['Emploi', facts.position],
    ['Qualification', facts.qualification],
    ['Date d’entrée', facts.entryDate],
    ['Date de sortie', facts.departureDate ?? 'Non renseignée'],
    [
      'Contrat',
      facts.employmentTermType === 'fixed_term'
        ? 'Contrat à durée déterminée'
        : 'Contrat à durée indéterminée',
    ],
    [
      'Temps de travail',
      facts.workTimeCategory === 'part_time'
        ? 'Salarié à temps partiel'
        : 'Temps plein',
    ],
    [
      'Autorisation administrative',
      facts.protectedAuthorization.required
        ? `Requise · autorisation : ${facts.protectedAuthorization.authorizationDate ?? '—'} · demande : ${facts.protectedAuthorization.requestDate ?? '—'}`
        : 'Non requise',
    ],
    [
      'Titre autorisant le travail',
      facts.workAuthorization.required
        ? `${facts.workAuthorization.titleType} · ordre : ${facts.workAuthorization.orderNumber}`
        : 'Non requis',
    ],
    ['Travail temporaire', thirdPartyText(facts.temporaryWorkCompany)],
    ['Groupement d’employeurs', thirdPartyText(facts.employerGroup)],
    [
      'Mention particulière',
      facts.specialContract === 'apprenticeship'
        ? 'Apprenti'
        : facts.specialContract === 'professionalization'
          ? 'Contrat de professionnalisation'
          : 'Aucune',
    ],
  ];
}

function drawFact(
  page: PDFPage,
  fonts: RegisterFonts,
  label: string,
  value: string,
  y: number,
): number {
  drawUnicodeText(page, fonts, label, { x: 42, y, size: 9, bold: true });
  const lines = wrapText(value, fonts, 9, 360);
  lines.forEach((line, index) => {
    drawUnicodeText(page, fonts, line, { x: 190, y: y - index * 12, size: 9 });
  });
  return y - Math.max(24, lines.length * 12 + 8);
}

function drawUnicodeText(
  page: PDFPage,
  fonts: RegisterFonts,
  rawValue: string,
  options: {
    x: number;
    y: number;
    size: number;
    bold?: boolean;
    color?: ReturnType<typeof rgb>;
  },
): void {
  let x = options.x;
  for (const segment of segmentText(rawValue.normalize('NFC'))) {
    const font = fonts[segment.font][options.bold ? 'bold' : 'regular'];
    page.drawText(segment.value, {
      x,
      y: options.y,
      size: options.size,
      font,
      color: options.color,
    });
    x += font.widthOfTextAtSize(segment.value, options.size);
  }
}

function wrapText(
  value: string,
  fonts: RegisterFonts,
  size: number,
  maxWidth: number,
): string[] {
  const words = value.normalize('NFC').split(/\s+/u);
  const lines: string[] = [];
  for (const word of words) {
    const current = lines.at(-1);
    const candidate = current ? `${current} ${word}` : word;
    if (measureText(candidate, fonts, size) <= maxWidth) {
      if (current) lines[lines.length - 1] = candidate;
      else lines.push(candidate);
      continue;
    }
    if (measureText(word, fonts, size) <= maxWidth) {
      lines.push(word);
      continue;
    }
    let fragment = '';
    for (const character of Array.from(word)) {
      const next = `${fragment}${character}`;
      if (fragment && measureText(next, fonts, size) > maxWidth) {
        lines.push(fragment);
        fragment = character;
      } else {
        fragment = next;
      }
    }
    if (fragment) lines.push(fragment);
  }
  return lines.length > 0 ? lines : [''];
}

function measureText(
  value: string,
  fonts: RegisterFonts,
  size: number,
): number {
  return segmentText(value).reduce(
    (width, segment) =>
      width +
      fonts[segment.font].regular.widthOfTextAtSize(segment.value, size),
    0,
  );
}

function segmentText(
  value: string,
): Array<{ font: ScriptFontKey; value: string }> {
  const segments: Array<{ font: ScriptFontKey; value: string }> = [];
  for (const character of Array.from(value)) {
    const codePoint = character.codePointAt(0) ?? 0;
    const current = segments.at(-1);
    if (codePoint >= 0x0300 && codePoint <= 0x036f && current) {
      current.value += character;
      continue;
    }
    const font = fontForCharacter(character);
    if (current?.font === font) current.value += character;
    else segments.push({ font, value: character });
  }
  return segments;
}

function fontForCharacter(character: string): ScriptFontKey {
  const codePoint = character.codePointAt(0) ?? 0;
  if (
    (codePoint >= 0x1ea0 && codePoint <= 0x1ef9) ||
    [
      0x0102, 0x0103, 0x0110, 0x0111, 0x0128, 0x0129, 0x0168, 0x0169, 0x01a0,
      0x01a1, 0x01af, 0x01b0, 0x20ab,
    ].includes(codePoint)
  )
    return 'vietnamese';
  if (codePoint >= 0x1f00 && codePoint <= 0x1fff) return 'greekExt';
  if (codePoint >= 0x0370 && codePoint <= 0x03ff) return 'greek';
  if (
    (codePoint >= 0x0460 && codePoint <= 0x052f) ||
    (codePoint >= 0x2de0 && codePoint <= 0x2dff) ||
    (codePoint >= 0xa640 && codePoint <= 0xa69f)
  )
    return 'cyrillicExt';
  if (codePoint >= 0x0400 && codePoint <= 0x045f) return 'cyrillic';
  if (
    (codePoint >= 0x0900 && codePoint <= 0x097f) ||
    (codePoint >= 0xa8e0 && codePoint <= 0xa8ff)
  )
    return 'devanagari';
  if (
    (codePoint >= 0x0100 && codePoint <= 0x02ff) ||
    (codePoint >= 0x1e00 && codePoint <= 0x1eff) ||
    (codePoint >= 0x2c60 && codePoint <= 0x2c7f) ||
    (codePoint >= 0xa720 && codePoint <= 0xa7ff)
  )
    return 'latinExt';
  if (
    codePoint <= 0x00ff ||
    (codePoint >= 0x2000 && codePoint <= 0x206f) ||
    [0x20ac, 0x2122, 0x2191, 0x2193, 0x2212, 0x2215].includes(codePoint)
  )
    return 'latin';
  throw new PersonnelRegisterPdfError(character);
}

async function embedFonts(document: PDFDocument): Promise<RegisterFonts> {
  const bytes = await loadFontBytes();
  const entries = await Promise.all(
    (Object.keys(bytes) as ScriptFontKey[]).map(
      async (key) =>
        [
          key,
          {
            regular: await document.embedFont(bytes[key].regular, {
              subset: true,
            }),
            bold: await document.embedFont(bytes[key].bold, { subset: true }),
          },
        ] as const,
    ),
  );
  return Object.fromEntries(entries) as RegisterFonts;
}

function loadFontBytes(): Promise<FontBytes> {
  fontBytesPromise ??= Promise.all(
    (
      [
        'latin',
        'latinExt',
        'vietnamese',
        'greek',
        'greekExt',
        'cyrillic',
        'cyrillicExt',
        'devanagari',
      ] as const
    ).map(async (key) => {
      const [regular, bold] = await Promise.all([
        readFile(FONT_PATHS[key].regular),
        readFile(FONT_PATHS[key].bold),
      ]);
      return [
        key,
        { regular: new Uint8Array(regular), bold: new Uint8Array(bold) },
      ] as const;
    }),
  ).then((entries) => Object.fromEntries(entries) as FontBytes);
  return fontBytesPromise;
}

function thirdPartyText(
  value: PersonnelRegisterEntry['facts']['temporaryWorkCompany'],
): string {
  if (!value) return 'Non concerné';
  const address = value.address;
  return `${value.legalName}, ${address.line1}${address.line2 ? `, ${address.line2}` : ''}, ${address.postalCode} ${address.city}, ${address.countryCode}`;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  }).format(new Date(value));
}
