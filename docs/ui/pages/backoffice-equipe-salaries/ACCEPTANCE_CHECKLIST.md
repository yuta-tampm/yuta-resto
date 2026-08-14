# Backoffice Équipe — Salariés — Acceptance Checklist

## Phase 0 repository and application

- [x] Root/Backoffice instructions and current architecture/UI workflow were read.
- [x] Route, placeholder, shell, navigation, session, permissions, contracts,
      cloud schema, and tests were inspected.
- [x] Target is `NEW_PAGE` under `NEW_CAPABILITY_DISCOVERY`, intended `integrated`.
- [x] Missing employee domain, persistence, API, mutation, HR permission,
      documents, OCR, Formalités, register, and PDF capabilities are recorded.
- [x] Users/memberships remain separate from employee records.
- [x] Baseline is `NOT_APPLICABLE`.
- [x] Shared context is `RESOLVED` with `REUSE_APPROVED_SHARED_SHELL`.
- [x] Design prompt was executed and desktop/mobile references are stored as `APPROVED` visual direction.

## Product approval gate

- [x] Approve the operational employee-record MVP and establishment ownership.
- [x] Approve OWNER-only first slice; deny STAFF and defer manager authorization.
- [x] Confirm deferred sensitive documents, OCR, remuneration, Formalités,
      apprenticeship, register, and PDF.
- [x] Design-prompt execution was authorized for draft visual discovery.

## Design and prototype gates

- [x] Generated references are stored under `references/` as `APPROVED` visual direction.
- [x] Unsupported concepts are removed/rejected; scope/reference are approved.
- [x] Package becomes `implementation-ready` only after all gates.
- [x] Approved typed fixtures are fictional with a prototype notice.
- [x] No control implies production persistence/upload/export/generation/compliance.
- [x] Required loading/empty/forbidden/validation/conflict/pending/success/error/recovery states exist.
- [x] Row selection opens the read-only dossier drawer without employee mutation.
- [x] Initial page load leaves every employee unselected and the dossier closed.
- [x] Explicit row/card selection opens a wider right-side drawer without
      reserving or shrinking the list column.
- [x] The drawer separates identity, actions, tabs, and overview facts into
      scannable responsive regions without adding unsupported employee data.
- [x] Quick view remains concise rather than becoming a monolithic editor.
- [x] Completeness exposes reasons and supported actions.
- [x] Missing-data and future actionable-event semantics are not conflated.
- [x] Pagination does not gain configurable page size solely from the raster.

## Future-wave retention gates

- [x] Documents, Formalités, register/PDF, apprenticeship, OCR, and sensitive
      contract data are recorded as future waves rather than discarded.
- [ ] A Documents wave approves categories, actions, storage, authorization,
      audit, retention, failure, retry, and recovery before UI enablement.
- [ ] A Formalités wave approves reusable data handoff, route, authorization,
      and document-specific ownership.
- [ ] An actionable-events wave distinguishes incomplete data from upcoming
      expiry/contract/formality events and provides real resolving actions.
- [ ] A register wave approves route, historical ordering, dated history,
      retention, stagiaire scope, and legal/immutability guarantees.
- [ ] PDF remains an export of structured register data and does not imply
      electronic-register compliance.

## Domain, tenant, security, and privacy gates

- [x] Phase 2 proposes an establishment dossier aggregate without creating a global person.
- [x] Stored, derived, transient, and integration-owned values are distinguished.
- [x] Prototype fixture fields are explicitly not treated as schema/contracts.
- [x] List/read/create/edit/departure/conflict/retry interactions and states are mapped.
- [x] Multiple-establishment, duplicate, conflict/idempotency, and departure semantics are proposed.
- [x] Phase 3 review package defines aggregate and multiple-establishment semantics.
- [x] Trusted organization/establishment ownership and fail-closed access are specified.
- [x] Resource-ID-only lookup and browser-trusted authorization are prohibited.
- [x] OWNER-only role/action/field matrices and no-entitlement decision are proposed.
- [x] Audit taxonomy, concurrency/idempotency, domain validation, retention architecture,
      and cross-tenant/security test matrix are specified.
- [x] CNIL/Légifrance constraints are recorded without a compliance claim.
- [ ] Product/security owner explicitly approves or revises the Phase 3 register.
- [ ] Controller/DPO/legal approves purpose, legal bases, notice, recipients,
      rights workflow, and per-class retention/deletion schedule.
- [ ] Security owner approves encryption, least privilege, logging,
      backup/restore, incident response, and audit-access operations.
- [x] Cross-tenant, suspended, stale, and missing-permission tests exist.
- [ ] No production collection/mutation starts before all Phase 3 sign-offs.
- [x] No PDF-only electronic-register compliance claim is made.

## Phase 4 technical-preparation gate

- [x] Product boundary is approved for documentation-only technical preparation.
- [x] Future request flow, storage responsibilities, application boundaries,
      delivery order, rollback approach, and required tests are documented.
- [x] Documents, Formalites, register/PDF, apprenticeship, OCR, and sensitive
      contract data remain explicit later waves with separate approval gates.
- [x] Technical preparation preceded implementation; the approved development
      slices now include schema, migrations, contracts, permissions,
      repositories, server actions, and real local storage behavior.
- [ ] Controller/legal and operational-security owners approve production use.
- [x] Product scope authorized the implemented development slices; this does not
      authorize production deployment.

## MVP behavior after implementation

- [x] Authorized list/read uses real establishment-scoped data.
- [x] Create and edit validate and preserve failed input.
- [x] Edit detects a stale revision and requires current-version reload before retry.
- [x] Departure records a date without hard deletion.
- [x] Departure correction or reopening requires a bounded reason and new audit event.
- [x] Employee history is read-only, bounded, newest-first, and tenant-scoped.
- [x] The effective date remains active through that date and becomes former the next day.
- [x] The final five calendar days use text-backed warning badges in list/card
      and dossier views, with `Dernier jour` on the effective departure date.
- [x] Completeness is explainable/actionable and uses the same count/filter rule.
- [x] Fixtures are removed from the integrated read slice.

Read-slice evidence:

- [x] OWNER-only navigation and route authorization are active.
- [x] Fixture rows and simulated page-state controls are removed.
- [x] The real empty/list/loading/error/forbidden states are active.
- [x] Cloud migration and two-organization/two-establishment isolation test pass locally.
- [x] No production/demo employee row is seeded.
- [x] Create commits dossier, minimal audit, and retry receipt atomically.
- [x] Same-establishment duplicate candidates require an explicit reasoned override.
- [x] Edit increments the revision and audits only changed field groups.
- [x] Cross-establishment edit attempts fail without exposing another dossier.
- [x] Repeated identical create returns one committed dossier.
- [x] History exposes only approved event fields and no raw audit/tenant metadata.
- [x] History loads only when opened and provides loading, error, and retry states.
- [x] OWNER dossier-detail, business-history, and consultation-history opens
      append deduplicated sensitive-read audit events.
- [x] Sensitive-read audit events do not pollute the business-change history timeline.
- [x] The OWNER-only Consultations tab loads 10 collapsed access entries per
      cursor page with previous/next controls and no raw actor/tenant/operation
      metadata.
- [x] Immediate same-actor dossier/history navigation pairs render as one
      specific consultation entry while both immutable audit rows are retained.
- [x] Expired command receipts are removed in trusted establishment scope before mutation replay checks.
- [x] Missing establishment, non-user actor, suspended membership, and tenant-switch denial are covered by scoped foundation/personnel tests.

## UI, responsive, accessibility, and verification

- [x] Current shell/navigation and `@yuta/ui`/tokens/typography/icons are preserved.
- [x] 1440, 1024, 768, and 390 px have no overflow/unreachable actions.
- [x] Keyboard, focus, labels/errors, dialog focus, and text statuses work in the prototype.
- [x] UI pack, tooling, docs, format, and architecture checks pass or unrelated
      baseline failures are reported.
- [x] Affected typecheck/test/build/security/database checks pass for development.
- [x] Functional/security QA precedes visual parity and as-built sync.

## Deferred production tasks

- [ ] `SALARIES-RETENTION-01`: approve per-class retention, archive, deletion,
      legal hold, notice/rights workflow, and operational owner.
- [ ] `SALARIES-NEON-RESTORE-01`: run a production Neon backup/PITR restore
      drill into an isolated target after explicit infrastructure approval.
- [ ] `SALARIES-SENSITIVE-AUDIT-01`: add allowlisted audit events before each
      future Documents/export/archive/legal-hold/rights administration action.
