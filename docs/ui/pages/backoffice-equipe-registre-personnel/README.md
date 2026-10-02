# Backoffice Équipe — Registre du personnel

Status: Phase 5 local QA and as-built synchronization complete; production blocked

Visibility: Engineering

Owner: YUTA product and engineering

Prompt snapshot topology: GENERATED_SNAPSHOTS

Prompt provenance: prompt-provenance.json

Last updated: 2026-08-18

Protocol revision: 4

Application: `apps/backoffice`

Target type: `PAGE`

Route / entry point: `/equipe/registre-personnel` (local real-data slice)

Runtime family: `cloud`

Page classification: `NEW_PAGE`

Implementation class: `integrated`

Package status: `implemented`

Scope status: `APPROVED`

Reference status: `APPROVED`

Inventory status: `COMPLETE`

Baseline status: `NOT_APPLICABLE`

Design prompt status: `READY`

Shared context status: `RESOLVED`

No-image reference reason: `NOT_APPLICABLE; four approved references exist.`

## Current implementation

The authenticated route now implements the approved employee-only real-data
slice in local development. Existing employee dossiers are shown only as
candidates; no dossier is silently inserted. An OWNER reviews the required and
conditional facts before an atomic first inscription receives an irreversible
establishment sequence. Corrections retain the first facts and append a
reasoned prior/new version record.

The route has distinct OWNER-only register read/export permissions, 50-entry
snapshot-bound cursor pages, minimized read/export audit events, and a
server-generated no-store PDF. The PDF is never stored and has no public URL.
The route, actions, and export endpoint all fail closed outside development.
Interns, service-civic volunteers, automated purge/legal hold operations, AI/
OCR, and every production claim remain deferred.

Phase 4 keeps pagination state in browser memory rather than the URL, restores
the original result for idempotent inscription/correction replays, rejects
no-op corrections, and requires both register-read and employee-management
authority for mutations. PDF generation now embeds packaged local Unicode fonts;
unsupported scripts stop the export with no file or export audit rather than
silently replacing characters.

Phase 5 verified the authenticated empty register and non-mutating inscription
review flow at 1440 x 1000, 1024 x 768, 768 x 1024, and 390 x 844. All four
viewports have zero document-level horizontal overflow and no browser warning or
error. Closing the inscription dialog with Escape now restores focus to the
button that opened it. No employee was inscribed for visual evidence.

## Authority and documents

Use root/Backoffice instructions, `docs/CURRENT_STATE.md`,
`docs/ui/YUTA_FRONTEND_RULES.md`,
`docs/ui/BACKOFFICE_FRONTEND_RULES.md`, the shared UI workflow, and the containing
`../backoffice-equipe-salaries/` pack before this pack. This pack owns the new
register page design; the Salariés pack owns its existing page and entry point.

- `PRODUCT_SCOPE.md`
- `UI_SPEC.md`
- `DATA_AND_INTERACTION_SPEC.md`
- `DESIGN_HANDOFF.md`
- `IMPLEMENTATION_PLAN.md`
- `ACCEPTANCE_CHECKLIST.md`

## References

- `wave-e-design-draft-1440x1000-01.png`
- `wave-e-design-draft-1024x768-01.png`
- `wave-e-design-draft-768x1024-01.png`
- `wave-e-design-draft-390x844-01.png`
- `wave-e-phase-5-as-built-1440x1000.png`
- `wave-e-phase-5-as-built-1024x768.png`
- `wave-e-phase-5-as-built-768x1024.png`
- `wave-e-phase-5-as-built-390x844.png`
- `wave-e-phase-5-as-built-inscription-390x844.png`

All are approved Phase 1 presentation evidence. Their names and values remain
fictional and guide hierarchy, density, and responsive composition only.
The Phase 5 files are authenticated local as-built evidence using the truthful
persisted empty-register state and current candidate metadata.

## Shared context

Shell mode: `REUSE_APPROVED_SHARED_SHELL`. Preserve the authenticated
Backoffice topbar/sidebar, establishment selector, account area, semantic
tokens, and responsive conventions. Keep `Salariés` selected; do not add a
sidebar item. The proposed page is one-establishment, OWNER-only, and server-
authorized. Users/memberships and POS staff are not register people.

Structured register data is the proposed source; PDF is a protected transient
representation. Do not infer fields from PDFs or bounded employee history. No
compliance claim, public URL, organization-wide register, or destructive
correction is approved.

## Protected invariants

- Derive organization, establishment, actor, role, and permissions only from the trusted server session.
- Scope every register read, inscription, correction, pagination request, audit, and export to organization plus establishment.
- Keep the first inscription immutable, corrections append-only, and the canonical establishment sequence irreversible.
- Keep PDF generation server-mediated, transient, no-store, and without a public or stable URL.
- Do not backfill employee dossiers silently, create fixture inscriptions, expose cursor/audit metadata, or claim legal compliance.
- Keep production fail-closed until its separate legal, privacy, security, retention, and operations gates are approved.

## Change impact

```text
Files expected to modify: apps/backoffice personnel permissions/navigation, packages/contracts personnel contracts, packages/db-cloud personnel schema/repository/export support, docs/CURRENT_STATE.md, docs/ui/pages/README.md, and this stable page package
Files expected to create: packages/db-cloud migration 0010, the Backoffice registre-personnel route/actions/components/API/server PDF files, focused tests, and approved design/as-built reference images
Packages affected: apps/backoffice, packages/contracts, packages/db-cloud, and docs/ui/pages/backoffice-equipe-registre-personnel
Cross-application impact: none
Database change: YES
API or contract change: YES
Permission/auth change: YES
Runtime/device change: YES
```

The database, contract, permission, and runtime flags describe the approved
local Wave E implementation. Migration `0010` is the only Wave E migration;
Phases 4 and 5 added none. Runtime capability remains development-only.

## Design approval and stop condition

WE0-01 through WE0-10 and prompt execution were approved on 2026-08-17. The
visual direction and Phase 1 local prototype were approved on 2026-08-18.
WE2-01 through WE2-14 and Phase 3 local real-data implementation were approved
on 2026-08-18. Phase 4 local integration hardening was approved and completed
on 2026-08-18 without another schema or migration. Stop before production enablement, intern/service-civic support,
retention purge/legal-hold operations, external presentation, AI/OCR, or any
compliance claim until separately approved.

Phase 5 local QA and as-built synchronization were approved and completed on
2026-08-18. This closes the approved local Wave E delivery, not the production
gates above.

## Exact verification commands

```bash
pnpm --filter @yuta/backoffice test
pnpm --filter @yuta/backoffice typecheck
pnpm --filter @yuta/backoffice build
pnpm docs:check
pnpm architecture:check
pnpm -r --if-present typecheck
pnpm ui:pack:check backoffice-equipe-registre-personnel
git diff --check
```

The guarded register repository integration test additionally uses the package
test command with `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true` and the existing
local test database configuration; it was completed during Phase 4.

## Final delivery and as-built status

Phase 5 was approved and completed on 2026-08-18 after the functional regression
gate. The authenticated development route was captured at 1440 x 1000,
1024 x 768, 768 x 1024, and 390 x 844 with zero document-level horizontal
overflow and empty browser warning/error collection. A 390 x 844 dialog capture
verifies internal scrolling and readable controls.

The pass corrected Escape focus restoration for controlled inscription and
correction dialogs. No employee was inscribed, corrected, or exported solely
for visual evidence. The approved local implementation, stable documentation,
and as-built references are synchronized. As-built documentation status:
`COMPLETE`.

## Stop conditions

Stop before enabling production, adding intern/service-civic models, automating
retention purge or legal hold, expanding unsupported PDF scripts, exposing an
external register presentation, or starting Wave F AI/OCR without separate
approval and the applicable legal/privacy/security/operations decisions.

## Prompt order

1. `prompts/00_REPOSITORY_ANALYSIS.md`
2. `prompts/01_VISUAL_BASELINE.md`
3. `prompts/02_COMPONENT_REFACTOR.md`
4. `prompts/03_INTERACTIONS.md`
5. `prompts/04_DATA_INTEGRATION.md`
6. `prompts/05_VISUAL_QA.md`

Review and approve each later phase separately.
