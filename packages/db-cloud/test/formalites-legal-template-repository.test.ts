import { getTableConfig } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { createAuthService, type InternalUserRecord } from '@yuta/auth';
import type { CloudDatabaseClient } from '../src/client';
import { createFormalitesLegalTemplateRepository } from '../src/formalites-legal-template-repository';
import { FORMALITES_LEGAL_SOURCE_PROFILE } from '../src/formalites-legal-template-domain';
import {
  formalitesTemplateIdentities,
  formalitesTemplateVersions,
  formalitesTemplateWorkingDrafts,
} from '../src/schema/formalites-legal-templates';

describe('Formalites legal-template schema boundary', () => {
  it('defines exactly the three global records, without lifecycle or tenant fields', () => {
    const expected = [
      [formalitesTemplateIdentities, ['id', 'legal_purpose', 'created_at']],
      [
        formalitesTemplateWorkingDrafts,
        [
          'id',
          'template_id',
          'revision',
          'content_profile',
          'source_bytes',
          'applicability',
          'created_at',
          'updated_at',
          'frozen_at',
        ],
      ],
      [
        formalitesTemplateVersions,
        [
          'id',
          'template_id',
          'source_draft_id',
          'source_draft_revision',
          'content_profile',
          'source_bytes',
          'checksum_algorithm',
          'content_checksum',
          'applicability',
          'frozen_at',
        ],
      ],
    ] as const;
    for (const [table, columns] of expected) {
      const config = getTableConfig(table);
      expect(config.columns.map((column) => column.name)).toEqual(columns);
      expect(
        config.columns
          .filter((column) => !column.notNull)
          .map((column) => column.name),
      ).toEqual(table === formalitesTemplateWorkingDrafts ? ['frozen_at'] : []);
      for (const fk of config.foreignKeys) expect(fk.onDelete).toBe('restrict');
    }
  });

  it('keeps partial active uniqueness, exact freeze uniqueness and containment', () => {
    const draft = getTableConfig(formalitesTemplateWorkingDrafts);
    expect(draft.indexes).toHaveLength(1);
    expect(draft.indexes[0]?.config).toMatchObject({
      name: 'formalites_template_one_active_draft',
      unique: true,
    });
    expect(draft.indexes[0]?.config.where).toBeDefined();
    expect(
      draft.uniqueConstraints.map((key) =>
        key.columns.map((column) => column.name),
      ),
    ).toEqual([['id', 'template_id']]);
    expect(draft.checks.map((check) => check.name)).toEqual([
      'formalites_template_draft_positive_revision',
    ]);
    const version = getTableConfig(formalitesTemplateVersions);
    expect(
      version.uniqueConstraints.map((key) =>
        key.columns.map((column) => column.name),
      ),
    ).toEqual([['source_draft_id', 'source_draft_revision']]);
    expect(version.checks.map((check) => check.name)).toEqual([
      'formalites_template_version_positive_revision',
      'formalites_template_checksum_algorithm',
      'formalites_template_checksum_shape',
    ]);
    expect(
      version.foreignKeys
        .find(
          (fk) =>
            fk.getName() === 'formalites_template_version_draft_containment',
        )
        ?.reference()
        .columns.map((column) => column.name),
    ).toEqual(['source_draft_id', 'template_id']);
  });

  it('maps bytea with defensive binary copies (not a database roundtrip claim)', () => {
    const column = formalitesTemplateVersions.sourceBytes;
    expect(column.getSQLType()).toBe('bytea');
    const original = Buffer.from('a\0é\t\n');
    const encoded = column.mapToDriverValue(original);
    const decoded = column.mapFromDriverValue(encoded);
    expect(decoded).toEqual(original);
    expect(decoded).not.toBe(original);
    original.fill(0);
    expect(decoded).toEqual(Buffer.from('a\0é\t\n'));
    expect(() =>
      column.mapFromDriverValue('not bytes' as unknown as Buffer),
    ).toThrow('Invalid legal source binary representation');
  });
});

describe('Exact-operation authorized global facade', () => {
  const templateId = '019c0000-0000-7000-8000-000000000001';
  const draftId = '019c0000-0000-7000-8000-000000000002';
  const source = {
    contentProfile: FORMALITES_LEGAL_SOURCE_PROFILE,
    sourceBytes: Buffer.from('synthetic'),
    applicability: {},
  };
  const actions = [
    [
      'createIdentity',
      { legalPurpose: 'synthetic purpose' },
      'formalites.template.draft.manage',
    ],
    ['readIdentity', { templateId }, 'formalites.template.read'],
    ['readDraft', { templateId, draftId }, 'formalites.template.read'],
    [
      'readVersion',
      { templateId, versionId: draftId },
      'formalites.template.read',
    ],
    ['readHistory', { templateId }, 'formalites.template.read'],
    [
      'createDraft',
      { templateId, ...source },
      'formalites.template.draft.manage',
    ],
    [
      'editDraft',
      { templateId, draftId, expectedRevision: 1, ...source },
      'formalites.template.draft.manage',
    ],
    [
      'freezeDraft',
      { templateId, draftId, expectedRevision: 1 },
      'formalites.template.review.submit',
    ],
  ] as const;

  function setup(
    state:
      | 'admin'
      | 'support'
      | 'restaurant-only'
      | 'anonymous'
      | 'missing'
      | 'disabled',
  ) {
    const events: string[] = [];
    const internal: InternalUserRecord = {
      id: templateId,
      email: 'synthetic@example.invalid',
      displayName: null,
      status: state === 'disabled' ? 'DISABLED' : 'ACTIVE',
      systemRole:
        state === 'support'
          ? 'YUTA_SUPPORT'
          : state === 'restaurant-only'
            ? null
            : 'YUTA_ADMIN',
    };
    const auth = createAuthService(
      {
        getIdentity: async () => {
          events.push('identity');
          return state === 'anonymous'
            ? null
            : { providerUserId: 'synthetic-provider', email: internal.email };
        },
      },
      {
        findByAuthProviderId: async () => {
          events.push('internal-user');
          return state === 'missing' ? null : internal;
        },
      },
    );
    const guard = auth.requireFormalitesTemplateSystemOperation;
    auth.requireFormalitesTemplateSystemOperation = async (operation) => {
      events.push(`guard:${String(operation)}`);
      const context = await guard(operation);
      events.push('allowed');
      return context;
    };
    const resourceFailure = new Error('RESOURCE_DB_SENTINEL');
    const db = new Proxy(
      {},
      {
        get: (_target, property) => {
          events.push(`db:${String(property)}`);
          throw resourceFailure;
        },
      },
    ) as CloudDatabaseClient;
    return {
      repository: createFormalitesLegalTemplateRepository(db, auth),
      events,
      resourceFailure,
    };
  }

  for (const [action, input, operation] of actions) {
    it(`${action} requires only its exact operation before resource access`, async () => {
      const { repository, events, resourceFailure } = setup('admin');
      await expect(repository[action](input)).rejects.toBe(resourceFailure);
      expect(events.slice(0, 4)).toEqual([
        `guard:${operation}`,
        'identity',
        'internal-user',
        'allowed',
      ]);
      expect(events.filter((event) => event.startsWith('db:'))).toHaveLength(1);
    });
    it.each([
      'support',
      'restaurant-only',
      'anonymous',
      'missing',
      'disabled',
    ] as const)(
      `${action} denies %s without any template DB access`,
      async (state) => {
        const { repository, events, resourceFailure } = setup(state);
        await expect(repository[action](input)).rejects.not.toBe(
          resourceFailure,
        );
        expect(events[0]).toBe(`guard:${operation}`);
        expect(events.some((event) => event.startsWith('db:'))).toBe(false);
        expect(events).not.toContain('allowed');
      },
    );
    it(`${action} rejects caller authority/extra fields even after a real admin guard`, async () => {
      const { repository, events } = setup('admin');
      await expect(
        repository[action]({
          ...input,
          systemRole: 'YUTA_ADMIN',
          organizationId: templateId,
        }),
      ).rejects.toThrow();
      expect(events).toContain('allowed');
      expect(events.some((event) => event.startsWith('db:'))).toBe(false);
    });
  }

  it('exposes no purpose/version patch, delete, reopen or lifecycle operation', () => {
    expect(Object.keys(setup('admin').repository).sort()).toEqual(
      actions.map(([name]) => name).sort(),
    );
  });

  it('does not report a failed/unknown transaction as freeze success or rollback', async () => {
    const { repository, events } = setup('admin');
    await expect(
      repository.freezeDraft({ templateId, draftId, expectedRevision: 1 }),
    ).rejects.toThrow('RESOURCE_DB_SENTINEL');
    expect(events.filter((event) => event.startsWith('guard:'))).toHaveLength(
      1,
    );
    expect(events.at(-1)).toBe('db:transaction');
  });
});
