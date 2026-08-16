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

## Documents Wave A Phase 0 approval gate

- [x] Existing Salaries drawer, tabs, authorization, tenant scope, contracts,
      schema, audit behavior, tests, and current visual context were inspected.
- [x] No Backoffice/cloud document storage, upload/download flow, document
      contract/schema/permission, malware-processing flow, or document test exists.
- [x] The local Display upload directory is recorded as a separate runtime and
      forbidden for cloud employee documents.
- [x] Capability mode is `NEW_CAPABILITY_DISCOVERY` inside the stable
      `backoffice-equipe-salaries` page pack; no duplicate pack or route was created.
- [x] Proposed MVP, users, establishment ownership, sensitive data, deferred
      capabilities, UI discovery scope, states, and ready design prompt are recorded.
- [x] Phase 0 created no schema, migration, API, permission, provider, storage,
      upload/download action, or implementation code.
- [x] Product owner approved OWNER-only list/upload/view/download/replace actions
      and category examples for visual discovery only.
- [x] Product owner authorized and the Documents design prompt was executed.
- [x] Desktop, 1024, 768, and 390 px references were stored as `DRAFT` for review.
- [x] Product owner approved the generated Documents hierarchy, actions,
      category examples, copy, states, and responsive direction for Phase 1.
- [x] The sixth `Documents` tab uses typed fictional fixtures and a visible
      demonstration notice.
- [x] Add, view, and replace controls are disabled; no fake success is shown.
- [x] Fixtures contain no ID, URL, storage key, tenant value, transport contract,
      or persistence behavior.
- [x] Existing employee authorization, audit, history, and persisted behavior
      remain unchanged.
- [ ] Controller/DPO or legal owner approves each enabled category's purpose,
      recipients, rights workflow, and per-category/version retention schedule.
- [ ] Security owner approves private storage, encryption/key separation,
      malware quarantine, short-lived delivery, audit, backup/restore, provider,
      incident, and deletion behavior before real-file implementation.
- [ ] Manager delegation, OCR, generation, sharing/export, delete/archive/legal
      hold, employee self-service, and actionable expiry alerts remain deferred.

## Documents Wave A Phase 2 technical-design gate

- [x] Product owner authorized technical design and decision preparation only.
- [x] Repository reuse and new private-storage boundaries are identified.
- [x] Conceptual document/version/processing/audit responsibilities are mapped
      without treating them as tables or contracts.
- [x] Tenant scope repeats organization + establishment + employee on every
      metadata, mutation, processing, cleanup, and delivery operation.
- [x] Neon/PostgreSQL rows, authentication audit events, and local Display
      uploads are explicitly rejected as binary document storage.
- [x] Upload, quarantine, processing, available, rejected, replacement,
      conflict, access, retry, and compensation behavior are proposed.
- [x] The later delivery order uses narrow end-to-end vertical slices.
- [x] Scaleway Paris, OVHcloud EU, AWS S3 Paris, and Cloudflare R2 EU are
      compared without selecting or connecting a provider.
- [x] Storage and malware scanning are separate provider-neutral service
      boundaries, so either provider can change independently.
- [x] Residency covers objects, replicas, backups, scanner processing, logs,
      support access, deletion, and disaster recovery rather than bucket region alone.
- [x] D2-01 product choice: first category is the signed employment contract;
      no generic attachment category, and signed amendments remain separate.
- [ ] D2-01 legal/privacy approval: confirm purpose, applicability, recipients,
      rights handling, required/optional status, and retention class.
- [ ] D2-02: product and security approve separate document read/manage
      permissions, initially OWNER-only.
- [x] D2-03 product choice: the first slice accepts PDF only, up to 10 MiB.
- [ ] D2-03 security approval: confirm content verification, filename/page
      limits, processing timeout, and current/version behavior.
- [ ] D2-04/D2-05: security, operations, and engineering approve private EU
      storage, quarantine/scanning, and server-mediated first-slice delivery.
- [ ] D2-06: product and security approve the personnel document event taxonomy
      and its separate safe projection.
- [ ] D2-07: legal/privacy and operations approve per-category/version
      retention, deletion propagation, backup, restore, and rights handling.
- [ ] D2-08: product and engineering approve verification-before-swap replacement
      semantics and prior-version behavior.
- [ ] D2-09: security and operations select an EU-approved malware/content
      scanner or approve an operated scanner boundary and its incident handling.
- [x] No schema, migration, contract, API, permission, provider, storage object,
      worker, or runtime implementation was created in Phase 2.

## Documents Wave A Phase 3 local implementation

- [x] Product owner authorized implementation after selecting the first category
      and PDF/10 MiB boundary.
- [x] Fictional document items and disabled prototype actions were removed.
- [x] Document list/add/replace/view/download is OWNER-only and reauthorizes on
      the server.
- [x] Every metadata query includes organization + establishment + employee.
- [x] Binary content is outside Neon/PostgreSQL and has no public/stable URL.
- [x] Local private storage quarantines each file and promotes it only after
      Microsoft Defender succeeds.
- [x] Storage and scanner remain separate replaceable service interfaces.
- [x] PDF signature, declared type, 10 MiB limit, sanitized filename, checksum,
      expected revision, and idempotency are enforced.
- [x] Failed scan/persistence cleans the new object and never replaces the
      current version.
- [x] Tab, upload/rejection, replacement, view, and download access events avoid
      filenames, storage keys, checksums, and scanner details.
- [x] Migration `0007_happy_master_chief.sql` was generated and applied only to
      `localhost:55431/yuta_cloud`.
- [x] Production runtime fails closed; no external provider is implied.
- [ ] Legal/privacy approves category purpose and retention/deletion behavior.
- [ ] Security/operations approves EU storage, EU scanner, backup/restore,
      incident ownership, monitoring, and provider exit.
- [x] Desktop browser QA covers empty, verified upload, available, view,
      download, access events, and test-data cleanup.
- [x] Responsive visual QA at 1024, 768, and 390 px is complete.

## Documents Wave B Phase 0 — signed amendments

- [x] Current category enum, contracts, repository, action, UI, audit, tests,
      local storage/scanner, and as-built Documents evidence were inspected.
- [x] Signed amendments are classified as `NEW_CAPABILITY_DISCOVERY` inside the
      stable integrated Salaries page pack.
- [x] The proposed MVP is OWNER-only and scoped by trusted organization +
      establishment + employee dossier.
- [x] A distinct later legal amendment is separated from the base contract and
      from a correction version of the same amendment scan.
- [x] Sensitive data, audit minimization, local-only storage boundary, truthful
      states, UI discovery scope, and deferred capabilities are recorded.
- [x] Effective date, signature date, amendment number, ordering, applicability,
      completeness, and retention remain explicit decisions rather than inferred
      fields.
- [x] Current as-built Documents captures provide the containing-surface context;
      the absent amendment flow has baseline `NOT_APPLICABLE`.
- [x] A self-contained responsive design prompt is ready and not yet executed.
- [x] Phase 0 created no schema, enum, migration, contract, API, permission,
      repository, action, storage object, or implementation code.
- [x] Product owner approves the proposed local MVP and date/label
      discovery scope.
- [x] Product owner authorizes running the signed-amendments design prompt.
- [x] Four selected responsive references are stored as `DRAFT`; redundant
      desktop chevrons and the mobile three-dot menu from initial generations
      were removed before handoff.
- [x] Product owner approves the selected generated visual direction.
- [x] Product owner authorizes a typed-fixture local Phase 1 prototype only.
- [x] The prototype uses fictional values, a persistent no-save notice, and
      disabled add/view/download/replace controls.
- [x] The prototype introduces no amendment ID, enum, schema, migration,
      contract, API, permission, repository, action, URL, storage, or audit event.
- [x] The proposed effective date is labelled as proposed rather than persisted.
- [x] Route-local model tests cover fictional shape and timezone-safe French date
      formatting.
- [x] Responsive browser QA at 1440, 1024, 768, and 390 px is complete.
- [x] Product owner authorizes Documents Wave B Phase 2 technical design only.
- [x] The current base-contract single-category uniqueness rule is not reused
      for multiple distinct amendments.
- [x] A separate amendment aggregate with immutable correction versions is the
      recommended persistence boundary.
- [x] Required effective date, optional bounded reference, newest-first stable
      ordering, and ten-item cursor pages are proposed for approval.
- [x] Existing OWNER-only document read/manage permissions and provider-neutral
      storage/scanner services are proposed for reuse without weakening scope.
- [x] One Documents-open audit event avoids duplicate list-open entries; item
      add/reject/view/download/replace events remain allowlisted and minimized.
- [x] Add/replace idempotency, expected revision, scan-before-commit/swap,
      cleanup, conflict, and safe retry behavior are documented.
- [x] Product owner approves AB2-01 through AB2-09 and local Phase 3
      implementation; local security reuses the already approved contract-file
      boundary.
- [ ] AB2-10 retention/rights/backup/restore/deletion and production providers
      remain release blockers, not local implementation approval.
- [x] Phase 2 creates no enum, schema, migration, contract, repository,
      permission, API, server action, storage object, or real employee data.
- [x] Separate Phase 3 local implementation approval was recorded before schema,
      contract, repository, route, action, or real file behavior changed.
- [x] Migration `0008` creates separate scoped amendment/version/receipt tables
      without changing the signed-contract category or uniqueness rule.
- [x] OWNER-only list/add/replace/view/download repeats organization +
      establishment + employee scope and resource ID alone never authorizes.
- [x] Required effective date, optional reference, stable newest-first ordering,
      and ten-item cursor pagination are implemented.
- [x] Add/replace verify the PDF before commit/swap; failure removes the new
      object and replacement leaves the current version unchanged.
- [x] Idempotent replay, stale revision conflict, immutable versions, safe
      projection, cross-establishment denial, and content grants are tested.
- [x] The Phase 1 amendment fixture and no-save notice are removed.
- [x] Signed-in browser QA covers real empty/load/add-form/cancel states at
      1440, 1024, 768, and 390 px without closing the employee drawer.
- [x] Production remains fail-closed and AB2-10 remains deferred.

## Documents Wave B Phase 5 — local QA and as-built

- [x] A non-personal PDF is scanned, added, listed, opened, and downloaded
      through the signed-in OWNER flow.
- [x] Replacing the selected scan creates version 2 without replacing the base
      contract or another amendment.
- [x] Invalid-file feedback preserves the effective date and optional reference,
      clears stale success feedback, and requires the file to be selected again.
- [x] Guarded database QA verifies ten-item cursor pages, immutable versions,
      idempotent retry, content grants, and cross-establishment denial.
- [x] Responsive QA passes at 1440 x 1000, 1024 x 768, 768 x 1024, and
      390 x 844 with no page or drawer overflow.
- [x] Wave B as-built captures use the stable
      `documents-wave-b-phase-5-as-built-*` naming convention.
- [x] QA-only amendment metadata, audit events, storage objects, and temporary
      source files are removed after evidence capture.
- [x] Production remains fail-closed; AB2-10 is still an explicit release gate.

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
- [x] A successful edit closes the edit dialog, keeps the dossier drawer open,
      and immediately shows the committed employee while the route refreshes.
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

## Wave C Phase 0 — complementary employment facts

- [x] Repository inventory distinguishes the integrated Salaries dossier from
      the planned Formalités placeholder.
- [x] The smallest proposed MVP is limited to CDD reason and contractual weekly
      duration in the existing `Relation de travail` tab.
- [x] Organization + establishment + employee ownership and OWNER-only audience
      are explicit; browser-trusted scope and ID-only lookup remain forbidden.
- [x] Salariés, Documents, Formalités, Planning, Pointage, and payroll ownership
      boundaries are separated.
- [x] Confidential and more-sensitive fields have explicit handling and
      minimized future-audit requirements.
- [x] Remuneration, probation, detailed part-time distribution, apprenticeship,
      Formalités workflows, Wave D events, Wave E register/PDF, OCR, delegation,
      self-service, transfer, and merge are retained as deferred work.
- [x] Loading, complete, incomplete, not-applicable, forbidden, validation,
      pending, conflict, error/retry, success, responsive, and accessibility
      discovery states are specified.
- [x] A self-contained French design prompt was approved and run.
- [x] Phase 0 creates no schema, migration, enum, contract, permission, API,
      repository, server action, fixture, runtime behavior, or Formalités flow.
- [x] Product owner approves the Wave C Phase 0 scope and authorizes
      design-prompt execution.
- [x] Four selected 1440/1024/768/390 references are stored and labelled DRAFT.
- [x] The selected designs use one header edit action and read-only default
      values instead of duplicating edit controls or showing an open form.
- [x] Product owner approves the selected Wave C visual direction.
- [x] Product owner authorizes Phase 1 local prototype work only.
- [x] The prototype fixture is typed, fictional, route-local, and carries no ID,
      tenant value, contract, URL, request payload, or persistence metadata.
- [x] `Prototype` and `Aperçu sans sauvegarde` explain that values are fictional,
      not attached to the employee, and cannot be edited or saved.
- [x] CDI shows the CDD reason as not applicable; CDD shows only the fictional
      discovery example.
- [x] The existing header `Modifier` action is not duplicated or extended with
      unsupported prototype fields.
- [x] Focused tests cover CDD and CDI prototype presentation values.
- [x] Product owner authorizes Phase 2 interaction/data discovery only.

## Wave C Phase 2 — technical proposal

- [x] Current Légifrance sources for CDD cases and weekly-duration context are
      recorded without claiming legal compliance.
- [x] Reason code and integer weekly minutes are classified as nullable,
      confidential employee-dossier facts.
- [x] Four restaurant-relevant CDD reasons are proposed; special cases remain
      unsupported and no free-text `other` fallback exists.
- [x] CDI/CDD applicability, legacy nulls, transition, and initial completeness
      behavior are specified.
- [x] Separate hours/minutes input and 1–2,880-minute validation are proposed as
      an MVP boundary, not a legal guarantee.
- [x] Existing employee aggregate, OWNER permissions, single edit action,
      revision, idempotency, atomic update, audit, and dossier-open event are
      proposed for reuse.
- [x] Documents, Formalités, Planning, Pointage, payroll, unsupported CDD cases,
      and production compliance remain outside the slice.
- [x] Read, edit, create integration, fixture removal, and QA are split into
      later vertical slices.
- [x] Phase 2 creates no schema, migration, enum, contract, API, permission,
      repository, action, audit event, fixture removal, or real employee data.
- [x] Product owner approves WC2-01 through WC2-12 for local work.
- [ ] Legal/security owners approve the applicable reason list, numeric boundary,
      privacy, and production controls before production use.
- [x] Product owner authorizes Phase 3 local real-data implementation.

## Wave C Phase 3 — local implementation

- [x] Nullable reason and weekly-minute fields are added without backfilling
      existing dossiers.
- [x] Read, create, and edit use trusted organization + establishment scope and
      the existing OWNER-only permissions.
- [x] Only four controlled CDD reasons are accepted; no free-text fallback exists.
- [x] Weekly duration uses separate hours/minutes UI and a 1–2,880 minute boundary.
- [x] CDD to CDI clears the reason only after explicit confirmation.
- [x] Revision conflict, idempotent retry, and atomic audit behavior are reused.
- [x] Audit records field names but not old/new reason or duration values.
- [x] Documents and Formalités do not populate either employee fact.
- [x] Fictional Wave C values and the no-save notice are removed.
- [ ] Production legal/privacy/security/retention/operations approval is recorded.

## Wave C Phase 5 — local QA and as-built

- [x] Contract tests cover supported CDD values, unsupported values, and the
      1-minute/48-hour weekly-duration boundaries.
- [x] Guarded integration covers tenant scope, conflict/idempotency, minimized
      audit, CDD-to-CDI confirmation, and legacy nullable CDD edits.
- [x] Signed-in OWNER QA creates and reads one non-personal CDD test dossier.
- [x] CDD-to-CDI save is disabled until confirmation and remains server guarded.
- [x] Weekly duration survives the transition and the CDD reason becomes not
      applicable after the committed CDI update.
- [x] Employee history lists changed field labels without reason/duration values.
- [x] 1440/1024/768/390 layouts have no page or drawer horizontal overflow.
- [x] Select dismissal keeps its containing modal open; no console error occurs.
- [x] Four local as-built captures are retained in `references/`.
- [x] The corrected `Identité` and `Relation de travail` tabs use responsive
      key-fact cards at 1440/1024/768/390 without page or drawer overflow.
- [x] Eight correction captures retain both corrected tabs at all four sizes.
- [x] Temporary QA dossier, audit events, command receipts, and cleanup script
      are removed after capture.
- [ ] Production legal/privacy/security/retention/operations approval is recorded.
