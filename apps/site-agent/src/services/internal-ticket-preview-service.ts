import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { PrintJob } from '@yuta/db-pos/schema';
import { renderInternalKitchenTickets } from './local-printer-worker';
import { receiptBufferToText } from './receipt-preview-service';

type PreviewSegment = {
  text: string;
  bold: boolean;
  reverse: boolean;
};

type PreviewLine = {
  align: 'left' | 'center';
  widthMultiplier: number;
  heightMultiplier: number;
  segments: PreviewSegment[];
};

export async function writeInternalTicketPreview(input: {
  outputDirectory: string;
  job: PrintJob;
}) {
  const outputDirectory = resolve(input.outputDirectory);
  const tickets = renderInternalKitchenTickets(input.job);
  await mkdir(outputDirectory, { recursive: true });

  const files = await Promise.all(
    tickets.map(async (ticket, index) => {
      const label = index === 0 ? 'cuisine' : 'bar';
      const binaryPath = resolve(outputDirectory, `${label}.bin`);
      const textPath = resolve(outputDirectory, `${label}.txt`);
      const htmlPath = resolve(outputDirectory, `${label}.html`);
      await Promise.all([
        writeFile(binaryPath, ticket),
        writeFile(textPath, `${receiptBufferToText(ticket)}\n`, 'utf8'),
        writeFile(htmlPath, renderEscPosPreviewHtml(ticket, label), 'utf8'),
      ]);
      return {
        label,
        binaryPath,
        textPath,
        htmlPath,
        bytes: ticket.byteLength,
        sha256: createHash('sha256').update(ticket).digest('hex'),
      };
    }),
  );

  const indexPath = resolve(outputDirectory, 'index.html');
  const combinedTextPath = resolve(outputDirectory, 'internal-tickets.txt');
  const metadataPath = resolve(outputDirectory, 'metadata.json');
  await Promise.all([
    writeFile(indexPath, renderIndexHtml(files), 'utf8'),
    writeFile(
      combinedTextPath,
      `${files
        .map(
          (file, index) =>
            `========== ${file.label.toUpperCase()} ==========\n${receiptBufferToText(tickets[index] ?? Buffer.alloc(0))}`,
        )
        .join('\n\n')}\n`,
      'utf8',
    ),
  ]);
  await writeFile(
    metadataPath,
    `${JSON.stringify({ mode: 'synthetic-internal-ticket', files }, null, 2)}\n`,
    'utf8',
  );
  return {
    outputDirectory,
    indexPath,
    combinedTextPath,
    metadataPath,
    files,
  };
}

export function renderEscPosPreviewHtml(buffer: Buffer, title: string): string {
  const lines = parseEscPosLines(buffer);
  const body = lines
    .map((line) => {
      const content = line.segments
        .map(
          (segment) =>
            `<span class="${segment.bold ? 'bold ' : ''}${segment.reverse ? 'reverse' : ''}">${escapeHtml(segment.text) || '&nbsp;'}</span>`,
        )
        .join('');
      return `<div class="line ${line.align} w${line.widthMultiplier} h${line.heightMultiplier}">${content || '&nbsp;'}</div>`;
    })
    .join('\n');
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} print preview</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 24px; background: #ddd; color: #111; }
    .paper { width: 80mm; min-height: 120mm; margin: 0 auto; padding: 4mm; background: #fff; box-shadow: 0 2px 16px #0003; overflow: hidden; }
    .line { min-height: 16px; white-space: pre-wrap; overflow-wrap: anywhere; font: 14px/1.08 "Courier New", monospace; }
    .center { text-align: center; }
    .bold { font-weight: 900; }
    .reverse { padding: 0 2px; background: #111; color: #fff; }
    .h2 { font-size: 28px; line-height: .92; letter-spacing: -1.5px; }
    .w2 { font-stretch: expanded; letter-spacing: .5px; }
  </style>
</head>
<body><main class="paper">${body}</main></body>
</html>\n`;
}

function parseEscPosLines(buffer: Buffer): PreviewLine[] {
  let align: PreviewLine['align'] = 'left';
  let bold = false;
  let reverse = false;
  let widthMultiplier = 1;
  let heightMultiplier = 1;
  let segments: PreviewSegment[] = [];
  let text = '';
  const lines: PreviewLine[] = [];

  const flushText = () => {
    if (!text) return;
    segments.push({ text, bold, reverse });
    text = '';
  };
  const flushLine = () => {
    flushText();
    lines.push({ align, widthMultiplier, heightMultiplier, segments });
    segments = [];
  };

  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];
    if (byte === 0x0d) continue;
    if (byte === 0x0a) {
      flushLine();
      continue;
    }
    if (byte === 0x1b) {
      flushText();
      const command = buffer[index + 1];
      if (command === 0x40) {
        align = 'left';
        bold = false;
        reverse = false;
        widthMultiplier = 1;
        heightMultiplier = 1;
        index += 1;
      } else if (command === 0x61) {
        align = buffer[index + 2] === 1 ? 'center' : 'left';
        index += 2;
      } else if (command === 0x45) {
        bold = buffer[index + 2] === 1;
        index += 2;
      } else if (command === 0x64) {
        const count = buffer[index + 2] ?? 0;
        for (let line = 0; line < count; line += 1) flushLine();
        index += 2;
      }
      continue;
    }
    if (byte === 0x1d) {
      flushText();
      const command = buffer[index + 1];
      if (command === 0x21) {
        const size = buffer[index + 2] ?? 0;
        widthMultiplier = ((size >> 4) & 0x07) + 1;
        heightMultiplier = (size & 0x07) + 1;
        index += 2;
      } else if (command === 0x42) {
        reverse = buffer[index + 2] === 1;
        index += 2;
      } else if (command === 0x56) {
        index += 2;
      }
      continue;
    }
    if (byte >= 0x20 && byte <= 0x7e) text += String.fromCharCode(byte);
  }
  if (text || segments.length > 0) flushLine();
  return lines;
}

function renderIndexHtml(
  files: Array<{ label: string; htmlPath: string; sha256: string }>,
): string {
  const frames = files
    .map(
      (file) =>
        `<section><h2>${escapeHtml(file.label.toUpperCase())}</h2><iframe title="${escapeHtml(file.label)}" src="./${escapeHtml(file.label)}.html?v=${file.sha256}"></iframe></section>`,
    )
    .join('\n');
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Internal ticket preview</title><style>body{margin:0;padding:24px;background:#222;color:#fff;font-family:Arial,sans-serif}main{display:flex;gap:24px;align-items:flex-start;justify-content:center;flex-wrap:wrap}h2{text-align:center}iframe{width:90mm;height:170mm;border:0;background:#fff}</style></head><body><main>${frames}</main></body></html>\n`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
