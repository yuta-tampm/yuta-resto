import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import {
  pointageCredentialRateLimits,
  pointageEmployeeCredentials,
  pointageSecurityAuditEvents,
} from '../src/schema';

describe('Pointage cloud schema boundary', () => {
  it('defines exactly the approved credential durability fields and constraints', () => {
    const config = getTableConfig(pointageEmployeeCredentials);
    expect(config.name).toBe('pointage_employee_credentials');
    expect(config.columns.map((column) => column.name)).toEqual([
      'id',
      'organization_id',
      'establishment_id',
      'personnel_dossier_id',
      'credential_version',
      'credential_format_version',
      'algorithm_version',
      'key_version',
      'lookup_digest',
      'salt',
      'verifier',
      'issued_at',
      'issued_by_user_id',
      'superseded_at',
      'superseded_by_credential_id',
      'superseded_by_user_id',
    ]);
    expect(config.columns.map((column) => column.name)).not.toEqual(
      expect.arrayContaining(['credential', 'plaintext', 'pin', 'tenant_id']),
    );
    expect(
      config.uniqueConstraints.map((constraint) => constraint.name),
    ).toContain('pointage_credentials_scope_id_unique');
    expect(config.indexes.map((index) => index.config.name)).toEqual(
      expect.arrayContaining([
        'pointage_credentials_historical_digest_unique_idx',
        'pointage_credentials_dossier_version_unique_idx',
        'pointage_credentials_one_active_dossier_unique_idx',
      ]),
    );
    expect(
      config.foreignKeys.map((foreignKey) => foreignKey.getName()),
    ).toEqual(
      expect.arrayContaining([
        'pointage_credentials_establishment_scope_fk',
        'pointage_credentials_dossier_scope_fk',
        'pointage_credentials_superseded_scope_fk',
      ]),
    );
  });

  it('stores only scoped digests and distributed limiter state', () => {
    const config = getTableConfig(pointageCredentialRateLimits);
    expect(config.columns.map((column) => column.name)).toEqual([
      'organization_id',
      'establishment_id',
      'key_kind',
      'key_digest',
      'window_started_at',
      'failure_count',
      'blocked_until',
      'updated_at',
    ]);
    expect(config.columns.map((column) => column.name)).not.toEqual(
      expect.arrayContaining(['ip', 'address', 'credential', 'raw_value']),
    );
    expect(config.checks.map((constraint) => constraint.name)).toEqual(
      expect.arrayContaining([
        'pointage_rate_limits_key_kind_check',
        'pointage_rate_limits_digest_check',
      ]),
    );
  });

  it('keeps the security audit attribution minimized and write-only shaped', () => {
    const config = getTableConfig(pointageSecurityAuditEvents);
    expect(config.columns.map((column) => column.name)).toEqual([
      'id',
      'organization_id',
      'establishment_id',
      'event_type',
      'outcome',
      'reason_code',
      'manager_user_id',
      'personnel_dossier_id',
      'credential_id',
      'credential_version',
      'requested_operation',
      'occurred_at',
    ]);
    expect(config.columns.map((column) => column.name)).not.toEqual(
      expect.arrayContaining([
        'metadata',
        'payload',
        'display_name',
        'lookup_digest',
        'verifier',
        'salt',
        'ip',
        'address',
      ]),
    );
  });
});
