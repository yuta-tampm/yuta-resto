import { describe, expect, it } from 'vitest';
import { renderEscPosPreviewHtml } from '../src/services/internal-ticket-preview-service';

describe('internal ticket browser preview', () => {
  it('preserves alignment, bold, reverse, and double-height commands', () => {
    const buffer = Buffer.from([
      0x1b,
      0x40,
      0x1b,
      0x61,
      0x01,
      0x1b,
      0x45,
      0x01,
      0x1d,
      0x21,
      0x01,
      ...Buffer.from('CUISINE'),
      0x0d,
      0x0a,
      0x1d,
      0x21,
      0x00,
      0x1d,
      0x42,
      0x01,
      ...Buffer.from('ENTREES'),
      0x1d,
      0x42,
      0x00,
      0x0d,
      0x0a,
      0x1d,
      0x56,
      0x00,
    ]);

    const html = renderEscPosPreviewHtml(buffer, 'cuisine');
    expect(html).toContain('class="line center w1 h2"');
    expect(html).toContain('class="bold ">CUISINE</span>');
    expect(html).toContain('class="bold reverse">ENTREES</span>');
    expect(html).not.toContain(String.fromCharCode(0x1b));
  });
});
