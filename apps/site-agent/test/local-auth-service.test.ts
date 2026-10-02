import { describe, expect, it, vi } from 'vitest';
import { PgDialect } from 'drizzle-orm/pg-core';
import type { SQL } from 'drizzle-orm';
import type { PosDatabaseClient } from '@yuta/db-pos/client';
import { hashLocalSessionToken } from '@yuta/db-pos/local-auth-crypto';
import { localAuthSessions, localUsers } from '@yuta/db-pos/schema';
import { createLocalAuthService } from '../src/services/local-auth-service';

function localLookupFixture() {
  const token = 'local-positive-token-with-at-least-thirty-two-characters';
  const row = {
    session: {
      id: '33333333-3333-4333-8333-333333333333',
      authVersion: 1,
      lastSeenAt: new Date(),
      expiresAt: new Date(Date.now() + 60000),
    },
    user: {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Synthetic',
      email: null,
      role: 'admin',
      isActive: true,
      authVersion: 1,
    },
  };
  let parameters: unknown[] = [];
  const limit = vi.fn(async () =>
    parameters.includes(hashLocalSessionToken(token)) ? [row] : [],
  );
  const where = vi.fn((condition: SQL) => {
    const query = new PgDialect().sqlToQuery(condition);
    expect(query.sql).toContain('"local_auth_sessions"."token_hash"');
    expect(query.sql).toContain('"local_auth_sessions"."revoked_at" is null');
    expect(query.sql).toContain('"local_auth_sessions"."expires_at" >');
    parameters = query.params;
    return { limit };
  });
  const innerJoin = vi.fn(() => ({ where }));
  const from = vi.fn(() => ({ innerJoin }));
  const select = vi.fn(() => ({ from }));
  const insert = vi.fn(),
    update = vi.fn();
  const db = { select, insert, update } as unknown as PosDatabaseClient;
  const service = createLocalAuthService(db);
  const findSession = vi.fn(service.findSession);
  return {
    token,
    row,
    findSession,
    select,
    from,
    innerJoin,
    where,
    limit,
    insert,
    update,
    parameters: () => parameters,
  };
}

describe('A1.2 POS real local session service with observable adapter (not PostgreSQL)', () => {
  it('rejects Pointage-shaped token through the actual local query without writes', async () => {
    const f = localLookupFixture();
    const wrong = 'ptc1_' + 'A'.repeat(43);
    expect(await f.findSession(wrong)).toBeNull();
    expect(f.findSession).toHaveBeenCalledExactlyOnceWith(wrong);
    expect(f.select).toHaveBeenCalledExactlyOnceWith({
      session: localAuthSessions,
      user: localUsers,
    });
    expect(f.from).toHaveBeenCalledExactlyOnceWith(localAuthSessions);
    expect(f.innerJoin).toHaveBeenCalledWith(localUsers, expect.anything());
    expect(f.parameters()[0]).toBe(hashLocalSessionToken(wrong));
    expect(f.limit).toHaveBeenCalledExactlyOnceWith(1);
    expect(f.insert).not.toHaveBeenCalled();
    expect(f.update).not.toHaveBeenCalled();
  });
  it('accepts the legitimate local-session positive control', async () => {
    const f = localLookupFixture();
    expect(await f.findSession(f.token)).toMatchObject({
      id: f.row.session.id,
      user: { id: f.row.user.id, role: 'admin' },
    });
    expect(f.insert).not.toHaveBeenCalled();
    expect(f.update).not.toHaveBeenCalled();
  });
});
