import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import {
  buildAccessAuditHref,
  parseAccessAuditQuery,
} from '../src/app/(authenticated)/parametres/utilisateurs-acces/access-audit-model';

describe('access audit query model', () => {
  it('accepts only validated display filters and cursor input', () => {
    const userId = randomUUID();
    const establishmentId = randomUUID();
    expect(
      parseAccessAuditQuery({
        auditUser: userId,
        auditEstablishment: establishmentId,
        auditAction: 'tenant.membership.updated',
        auditCursor: 'opaque-cursor',
      }),
    ).toEqual({
      subjectUserId: userId,
      establishmentId,
      action: 'tenant.membership.updated',
      cursor: 'opaque-cursor',
    });

    expect(
      parseAccessAuditQuery({
        auditUser: 'outside-scope',
        auditEstablishment: 'outside-scope',
        auditAction: 'tenant.login.succeeded',
        auditCursor: '',
      }),
    ).toEqual({});
  });

  it('preserves filters while replacing the cursor', () => {
    const userId = randomUUID();
    const href = buildAccessAuditHref(
      { subjectUserId: userId, action: 'tenant.user.created' },
      'next-cursor',
    );
    expect(href).toContain(`auditUser=${userId}`);
    expect(href).toContain('auditAction=tenant.user.created');
    expect(href).toContain('auditCursor=next-cursor');
    expect(href.endsWith('#historique-acces')).toBe(true);
  });
});
