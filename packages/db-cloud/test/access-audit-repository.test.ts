import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  decodeAccessAuditCursor,
  encodeAccessAuditCursor,
  sanitizeAccessAuditMetadata,
} from '../src/access-audit-repository';

describe('access audit repository helpers', () => {
  it('round-trips a stable timestamp and UUID cursor', () => {
    const value = {
      createdAt: new Date('2026-08-13T10:15:30.000Z'),
      id: randomUUID(),
    };
    expect(decodeAccessAuditCursor(encodeAccessAuditCursor(value))).toEqual(
      value,
    );
    expect(decodeAccessAuditCursor('not-a-cursor')).toBeNull();
  });

  it('keeps only display-approved metadata fields', () => {
    const sanitized = sanitizeAccessAuditMetadata('tenant.membership.updated', {
      previousRole: 'STAFF',
      previousStatus: 'active',
      role: 'MANAGER',
      status: 'suspended',
      passwordHash: 'never-return-this',
      token: 'never-return-this',
      ipHash: 'never-return-this',
      userAgent: 'never-return-this',
    });

    expect(sanitized).toEqual({
      establishmentIds: [],
      previousRole: 'STAFF',
      nextRole: 'MANAGER',
      previousStatus: 'active',
      nextStatus: 'suspended',
    });
    expect(JSON.stringify(sanitized)).not.toContain('never-return-this');
  });
});
