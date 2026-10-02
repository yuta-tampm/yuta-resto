import { describe, expect, it } from 'vitest';
import { receiptBufferToText } from '../src/services/receipt-preview-service';

describe('receipt preview text', () => {
  it('removes ESC/POS commands while preserving printable receipt text', () => {
    const buffer = Buffer.concat([
      Buffer.from([0x1b, 0x40, 0x1d, 0x21, 0x11]),
      Buffer.from('RECU DE PAIEMENT\r\nTOTAL 12,00 EUR\r\n', 'ascii'),
      Buffer.from([0x1d, 0x56, 0x00]),
    ]);
    expect(receiptBufferToText(buffer)).toBe(
      'RECU DE PAIEMENT\nTOTAL 12,00 EUR',
    );
  });
});
