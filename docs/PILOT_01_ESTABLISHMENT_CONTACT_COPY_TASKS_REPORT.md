# Pilot 01 — Establishment Contact Copy Tasks Report

## 1. Task groups

The implementation checklist contains four ordered groups:

1. Pure conditional-copy helper and model coverage.
2. One-time functional draft integration in the owning form.
3. Accessible public-contact control and read-only rendering coverage.
4. Bounded tests, typecheck, formatting, OpenSpec/docs validation, and diff checks.

All seven tasks remain unchecked. No apply or implementation work was performed.

## 2. Implementation files expected

- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/general-information-model.ts`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/general-information-form.tsx`
- `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/public-information-section.tsx`
- `apps/backoffice/test/general-information-model.test.ts`
- One focused Backoffice static-render test for `PublicInformationSection`, following the existing test directory convention.

The existing `apps/backoffice/test/establishment-profile-permissions.test.ts` is planned as regression evidence; no permission behavior change is expected.

## 3. Test coverage planned

- Both primary contact sources non-empty.
- Phone empty/null with email non-empty.
- Phone non-empty with email empty/null.
- Both sources empty/null.
- Existing public values overwritten only by corresponding non-empty sources.
- No-op and unrelated-field preservation.
- No ongoing linkage after the one-time transformation.
- Editable rendering exposes an accessible non-submit action.
- Read-only rendering does not expose a mutating copy action.
- Existing OWNER/MANAGER/STAFF permission matrix remains unchanged.
- Explicit save, existing validation, and server authorization remain the only persistence path.

## 4. Migrations/API/schema changes

**NO.**

The task list contains no database migration, API, server action, repository, contract, schema, permission, external dependency, or lifecycle task.

## 5. Blocker

None. The approved spec and design provide enough detail to implement and verify the bounded behavior without a new Product or technical decision.

## 6. Recommendation

`READY_FOR_APPLY`

Proceed only after review and approval of this task breakdown. No task has been marked complete, and no product code has been modified in this step.

Status: PROPOSED FOR REVIEW
