import { getTableConfig, type PgTable } from 'drizzle-orm/pg-core';
import { describe, expect, it } from 'vitest';
import { v7 as uuidv7, version as uuidVersion } from 'uuid';
import {
  authAuditEvents,
  authLoginAttempts,
  authSelectionTickets,
  authSessions,
  bookingSettings,
  cloudRoleEnum,
  directCustomerFeedback,
  establishments,
  establishmentServiceModeEnum,
  feedbackInternalNotes,
  feedbackItems,
  feedbackReplies,
  organizations,
  passwordResetTokens,
  personnelContractAmendmentCommandReceipts,
  personnelContractAmendments,
  personnelContractAmendmentVersions,
  personnelEmployeeDossiers,
  personnelEmployeeAuditEvents,
  personnelCommandReceipts,
  personnelDocumentCommandReceipts,
  personnelDocumentVersions,
  personnelDocuments,
  reputationAuditEvents,
  reputationConnectors,
  reputationSettings,
  restaurantKnowledgeConceptHistory,
  tenantDomains,
  tenantMemberships,
  users,
} from '../src/schema';

const tablesWithBusinessIds: PgTable[] = [
  users,
  organizations,
  establishments,
  tenantDomains,
  tenantMemberships,
  authSessions,
  authSelectionTickets,
  passwordResetTokens,
  authLoginAttempts,
  authAuditEvents,
  feedbackItems,
  feedbackReplies,
  directCustomerFeedback,
  feedbackInternalNotes,
  reputationConnectors,
  reputationSettings,
  reputationAuditEvents,
  personnelEmployeeDossiers,
  personnelEmployeeAuditEvents,
  personnelCommandReceipts,
  personnelDocuments,
  personnelDocumentVersions,
  personnelDocumentCommandReceipts,
  personnelContractAmendments,
  personnelContractAmendmentVersions,
  personnelContractAmendmentCommandReceipts,
];

describe('cloud schema boundaries', () => {
  it('requires application-generated IDs for every business record', () => {
    for (const table of tablesWithBusinessIds) {
      const config = getTableConfig(table);
      const idColumn = config.columns.find((column) => column.name === 'id');

      expect(idColumn, `${config.name}.id must exist`).toBeDefined();
      expect(
        idColumn?.hasDefault,
        `${config.name}.id must have no default`,
      ).toBe(false);
    }
  });

  it('keeps POS-only roles out of cloud memberships', () => {
    expect(cloudRoleEnum.enumValues).toEqual(['OWNER', 'MANAGER', 'STAFF']);
  });

  it('keeps personnel dossiers establishment-owned and revision-protected', () => {
    const columns = getTableConfig(personnelEmployeeDossiers).columns.map(
      (column) => column.name,
    );
    expect(columns).toEqual(
      expect.arrayContaining([
        'organization_id',
        'establishment_id',
        'entry_date',
        'revision',
      ]),
    );
    expect(columns).not.toContain('tenant_id');
    expect(columns).not.toContain('status');
    expect(columns).not.toContain('display_name');
  });

  it('keeps general profile ownership on establishments', () => {
    const establishmentColumns = getTableConfig(establishments).columns.map(
      (column) => column.name,
    );
    const bookingColumns = getTableConfig(bookingSettings).columns.map(
      (column) => column.name,
    );
    expect(establishmentColumns).toEqual(
      expect.arrayContaining([
        'description',
        'address_line_1',
        'public_phone',
        'public_email',
        'logo_url',
        'cover_image_url',
        'languages',
        'service_modes',
      ]),
    );
    expect(bookingColumns).not.toEqual(
      expect.arrayContaining([
        'address',
        'public_phone',
        'public_email',
        'logo_url',
        'cover_image_url',
      ]),
    );
    expect(establishmentServiceModeEnum.enumValues).toContain('RESERVATION');
  });

  it('keeps Concept and Histoire in a dedicated establishment-scoped Restaurant Knowledge table', () => {
    const knowledgeConfig = getTableConfig(restaurantKnowledgeConceptHistory);
    const knowledgeColumns = knowledgeConfig.columns.map(
      (column) => column.name,
    );
    const establishmentColumns = getTableConfig(establishments).columns.map(
      (column) => column.name,
    );

    expect(knowledgeColumns).toEqual([
      'organization_id',
      'establishment_id',
      'concept',
      'history',
    ]);
    expect(
      knowledgeConfig.columns.find((column) => column.name === 'concept')
        ?.notNull,
    ).toBe(false);
    expect(
      knowledgeConfig.columns.find((column) => column.name === 'history')
        ?.notNull,
    ).toBe(false);
    expect(knowledgeConfig.primaryKeys).toHaveLength(1);
    expect(knowledgeConfig.foreignKeys).toHaveLength(1);
    expect(establishmentColumns).not.toContain('concept');
    expect(establishmentColumns).not.toContain('history');
  });

  it('keeps personnel document metadata establishment and employee scoped', () => {
    for (const table of [
      personnelDocuments,
      personnelDocumentVersions,
      personnelContractAmendments,
      personnelContractAmendmentVersions,
    ]) {
      const columns = getTableConfig(table).columns.map(
        (column) => column.name,
      );
      expect(columns).toEqual(
        expect.arrayContaining([
          'organization_id',
          'establishment_id',
          'employee_id',
        ]),
      );
      expect(columns).not.toContain('tenant_id');
      expect(columns).not.toContain('content');
    }
  });

  it('keeps contract amendments separate from the single contract category slot', () => {
    const amendmentColumns = getTableConfig(
      personnelContractAmendments,
    ).columns.map((column) => column.name);
    expect(amendmentColumns).toEqual(
      expect.arrayContaining([
        'employee_id',
        'effective_date',
        'current_version',
        'revision',
      ]),
    );
    expect(amendmentColumns).not.toContain('category');
  });

  it('uses an RFC UUIDv7 generator for seed-created records', () => {
    expect(uuidVersion(uuidv7())).toBe(7);
  });
});
