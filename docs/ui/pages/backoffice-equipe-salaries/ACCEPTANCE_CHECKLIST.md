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
- [x] Design prompt is `READY` but not executed.

## Product approval gate

- [ ] Approve the operational employee-record MVP and establishment ownership.
- [ ] Approve OWNER-only first slice or explicit manager authorization; deny STAFF.
- [ ] Confirm deferred sensitive documents, OCR, remuneration, Formalités,
      apprenticeship, register, and PDF.
- [ ] Authorize design-prompt execution.

## Design and prototype gates

- [ ] Generated references are stored under `references/` as `DRAFT`.
- [ ] Unsupported concepts are removed/rejected; scope/reference are approved.
- [ ] Package becomes `implementation-ready` only after all gates.
- [ ] Approved typed fixtures are fictional with a prototype notice.
- [ ] No control implies production persistence/upload/export/generation/compliance.
- [ ] Required loading/empty/forbidden/validation/conflict/pending/success/error/recovery states exist.

## Domain, tenant, security, and privacy gates

- [ ] Aggregate and multiple-establishment semantics are approved.
- [ ] Employee access includes trusted organization and establishment scope.
- [ ] Resource-ID-only lookup and browser-trusted authorization are denied.
- [ ] Role/action/field and entitlement decisions are approved.
- [ ] Cross-tenant, suspended, stale, and missing-permission tests exist.
- [ ] Sensitive-data purpose, minimization, access, encryption, storage,
      malware scanning, audit, retention/archive/deletion/legal hold, rights,
      backup/restore, and incident handling are approved before collection.
- [ ] No PDF-only electronic-register compliance claim is made.

## MVP behavior after implementation

- [ ] Authorized list/read uses real establishment-scoped data.
- [ ] Create/edit validates and preserves failed input/conflicts.
- [ ] Departure records a date without hard deletion.
- [ ] Completeness is explainable/actionable.
- [ ] Fixtures are removed from integrated vertical slices.

## UI, responsive, accessibility, and verification

- [ ] Current shell/navigation and `@yuta/ui`/tokens/typography/icons are preserved.
- [ ] 1440, 1024, 768, and 390 px have no overflow/unreachable actions.
- [ ] Keyboard, focus, labels/errors, dialog focus, and text statuses work.
- [ ] UI pack, tooling, docs, format, and architecture checks pass or unrelated
      baseline failures are reported.
- [ ] Later affected typecheck/test/build/security/database checks pass.
- [ ] Functional/security QA precedes visual parity and as-built sync.
