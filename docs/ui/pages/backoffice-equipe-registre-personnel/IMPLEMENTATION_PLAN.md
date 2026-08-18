# Backoffice Équipe — Registre du personnel — Implementation Plan

Status: Phase 5 local QA and as-built synchronization complete; production blocked

Visibility: Engineering

## Delivery mode

`NEW_CAPABILITY_DISCOVERY`: the route and domain are absent. The integrated
Salariés foundation may be reused only after later domain approval.

## Phase 0 — complete

Repository, product, user, ownership, authorization, sensitive data, legal
sources, missing domains, deferred capabilities, UI states, responsive scope,
and prompt were recorded. WE0-01 through WE0-10 were approved. Four DRAFT
references were generated. No code or operational data changed.

## Phase 1 — complete

Product approved the visual direction and local typed-fixture prototype on
2026-08-18. The implementation adds:

1. authenticated `/equipe/registre-personnel` route composition;
2. the existing OWNER-only `personnel.employee.read` guard;
3. two route-local typed fictional records and pure presentation helpers;
4. responsive table-to-card presentation, DRAFT/demo disclosure, disabled PDF,
   loading, error/retry, forbidden, incomplete, and unsupported-category states;
5. a secondary Salariés header link while keeping Salariés selected in the sidebar;
6. focused fixture-model and navigation-owner tests.

No real employee read, mutation, persistence, schema, contract, API, new
permission, audit event, PDF, provider, or production capability was added.

## Phase 2 — documentation complete for decision

Product authorized interaction/data design only on 2026-08-18. Phase 2 now
proposes WE2-01 through WE2-14 covering:

1. employee-only first integration and separate intern/service-civic categories;
2. establishment ownership, exact required/conditional employee facts, and no
   silent backfill from mutable Salariés rows;
3. irreversible canonical sequence plus reconstructable append-only history;
4. 50-entry snapshot-bound cursor pages and readiness/export gating;
5. distinct OWNER-only read/export permissions and minimized access/export audit;
6. server-mediated no-store PDF generated from one authorized snapshot;
7. optimistic conflict, idempotent correction/export retry, truthful recovery,
   five-year employee retention, and the required test matrix.

Phase 2 changes page-pack Markdown only. The local fixture prototype remains
unchanged. WE2 approval does not itself authorize schema/API implementation;
a later real-data phase needs separate approval and remains local-only until
legal/DPO/privacy/security/operations gates pass.

## Phase 3 — local real-data slice complete

Product approved WE2-01 through WE2-14 and local Phase 3 on 2026-08-18. The
implementation adds typed register contracts, migration `0010`, an
establishment-scoped register repository, explicit reviewed inscription,
atomic sequence allocation, immutable initial facts, append-only corrections,
revision/idempotency guards, 50-entry cursor pages, OWNER-only read/export
permissions, minimized audits, and a transient protected PDF response.

The Phase 1 fictional fixtures are no longer imported by the route. Existing
Salariés rows remain candidates until an OWNER verifies the extra facts; there
is no backfill. All three server entry points (page, mutations, PDF) are enabled
only in development. The local database migration was applied successfully.

## Phase 4 — local integration hardening complete

Product approved local verification and hardening on 2026-08-18. The work:

1. removes cursor state from the URL and loads next/previous pages through a
   reauthorized server action while retaining the current page on failure;
2. makes idempotent inscription/correction replay return the original accepted
   revision even after later corrections, rejects changed-payload reuse, and
   rejects corrections that change no register fact;
3. requires register-read plus employee-management authority for mutations and
   preserves minimized deduplicated read/export audit events;
4. embeds packaged local Noto Sans subsets with `pdf-lib` fontkit, verifies
   Vietnamese/Cyrillic output, and blocks unsupported scripts without a file or
   successful-export audit;
5. returns truthful local export errors for empty or unrepresentable snapshots.

No schema or migration was added in Phase 4. Production remains fail-closed.

## Phase 5 — local visual, responsive, and accessibility QA complete

Product approved Phase 5 on 2026-08-18. The authenticated development route
was verified at 1440 x 1000, 1024 x 768, 768 x 1024, and 390 x 844 using the
persisted empty register and existing candidates. No employee inscription,
correction, or PDF export was performed for screenshots.

The pass found and corrected one accessibility regression: a controlled dialog
opened outside a `DialogTrigger` returned focus to the document body on Escape.
The page now records the originating inscription/correction button and restores
focus after close. Functional tests and typecheck pass after the correction.

The final matrix has no document-level horizontal overflow, browser warning, or
browser error. A narrow inscription-dialog capture confirms internal vertical
scrolling and readable controls without viewport overflow. The stable package
and references now match the local as-built result.

## Later phases — separately gated

Legal/DPO, privacy, security, retention/legal-hold/purge, backup/restore, and
operations approval precede production. Intern and service-civic models remain
separate. Wave F AI/OCR remains separate.

## Verification

Phase 5 verification includes contract tests, OWNER-permission/runtime-gate
tests, a guarded real-database repository integration test, package and
monorepo typechecks, Backoffice tests/build, architecture/docs/page-pack checks,
and authenticated responsive browser QA.
