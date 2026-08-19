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

## Wave D Phase 0 — `À traiter` discovery

- [x] Repository inventory confirms no current `À traiter`, personnel task,
      acknowledgement, assignment, scheduled reminder, or notification domain.
- [x] The capability is classified as `NEW_CAPABILITY_DISCOVERY` inside the
      existing integrated Salaries page and stable page pack.
- [x] Signed-in OWNER baseline confirms three existing metric cards and no
      current `À traiter` surface; current Phase 5 captures remain containing-page
      evidence and the new surface baseline is `NOT_APPLICABLE`.
- [x] The proposed MVP is a derived overview rather than persisted task state.
- [x] MVP item kinds are limited to incomplete active/upcoming dossiers, missing
      signed base contracts, and recorded departures within 0–5 local days.
- [x] Missing contract remains separate from current dossier completeness;
      expected CDD end and missing amendment are not silently derived as issues.
- [x] Every proposed item has one currently supported resolving entry point.
- [x] OWNER-only organization + establishment + employee ownership and the
      additional document-read boundary are recorded.
- [x] Employee names, missing field groups, contract presence, and departure
      dates are classified as confidential employment information.
- [x] A later minimized overview-access audit strategy is required; per-item
      duplicate employee-history events are rejected.
- [x] Page-read refresh, establishment business date, partial document failure,
      no-items, full error/retry, and forbidden truth rules are specified.
- [x] No fourth KPI, new route/tab/navigation, task semantics, notification,
      CDD-expiry alert, Formalités, bulk action, manager view, or production
      claim is proposed.
- [x] Responsive/accessibility discovery covers 1440/1024/768/390, focus,
      keyboard operation, text-backed meaning, touch targets, and overflow.
- [x] A self-contained Wave D French design prompt was approved and executed.
- [x] Phase 0 changes documentation only and creates no UI, fixture, schema,
      migration, contract, query, API/action, permission, audit event, task
      state, scheduled job, notification, or production behavior.
- [x] Product owner approved WD0-01 through WD0-08 for design exploration.
- [x] Product owner authorized execution of the Wave D design prompt only.
- [x] Four selected responsive ready-state references are stored as DRAFT.
- [x] The selected 390 px study preserves the existing one-card-per-row metric
      layout; the rejected three-column mobile generation is not retained.
- [x] Product owner approved the selected Wave D visual direction.
- [x] Product owner authorized Phase 1 typed-fixture prototype work only.

## Wave D Phase 1 — local typed-fixture prototype

- [x] `À traiter` is a route-local component between the three real metrics and
      the existing employee filters/list.
- [x] The prototype retains exactly three fictional approved examples split
      between `À corriger` and `Échéances proches`.
- [x] `DRAFT` and `Données fictives` are visible, and all prototype actions are
      disabled with contextual accessible names.
- [x] Existing loader data, summary counts, search, list, drawer, permissions,
      actions, and audit behavior are unchanged.
- [x] The server page exposes the prototype only in development mode;
      production builds omit it.
- [x] No schema, migration, contract, repository query, server action/API,
      permission, audit event, task state, notification, provider, or
      production behavior is added.
- [x] Fixture tests protect the approved reasons, action labels, and
      prototype-only identities.
- [x] Browser QA passes at 1440, 1024, 768, and 390 px with no horizontal
      overflow, console error, or enabled prototype action.
- [x] Product owner approved the local as-built prototype and authorized Phase 2
      interaction/data design only.

## Wave D Phase 2 — interaction/data proposal

- [x] Current paged employee list and per-employee Documents reads are rejected
      as an authoritative overview source.
- [x] A separate bounded, tenant-scoped, derived overview read is proposed with
      no task/snapshot persistence and no per-employee document loop.
- [x] The minimized item dictionary excludes completeness details, document
      metadata/file data, tenant IDs, audit IDs, and unrelated employee facts.
- [x] Each group uses five-item independent cursor pages with previous/next,
      no total, no `Voir tout`, no infinite scroll, and no new route.
- [x] Correction and event ordering is deterministic without invented priority.
- [x] Every action performs a fresh scoped server check before opening the
      existing edit, Documents-add, or departure-review entry point.
- [x] Source refresh, stale-item handling, no optimistic completion, and no
      polling/background delivery are specified.
- [x] Document-source partial failure never becomes a false missing-contract
      item; full employee failure and forbidden states disclose no items.
- [x] Existing OWNER employee/document permissions and organization +
      establishment + employee scope are retained.
- [x] One minimized cross-employee overview event in `auth_audit_events` is
      proposed for later approval; per-item employee-history events are rejected.
- [x] Tenant isolation, authorization, date boundaries, cursor stability,
      stale sources, audit, states, accessibility, and responsive tests are listed.
- [x] Phase 2 changes documentation only; fixture, code, schema, migration,
      contract, query, action/API, permission, audit, and real data are unchanged.
- [x] Product/security/engineering approve WD2-01 through WD2-12 for local use.
- [x] Product owner authorizes a local real-data Phase 3 vertical slice.

## Wave D Phase 3 — local real-data implementation

- [x] Fictional Wave D items and prototype labels are removed.
- [x] The overview is derived from tenant-scoped employee rows and signed-base-
      contract metadata presence without reading file content or storage data.
- [x] Each group returns at most five items and has independent previous/next
      cursor state; no totals, new route, or `Voir tout` is added.
- [x] Document-source failure cannot create a false missing-contract item.
- [x] Every item is revalidated under current OWNER permissions and full
      organization + establishment + employee scope before a flow opens.
- [x] Existing edit, Documents-add, and departure-review flows are reused.
- [x] One minimized `personnel.action_overview_viewed` audit row is written per
      authorized overview read; no per-item employee history is written.
- [x] No schema, migration, task table, reminder, notification, scheduler,
      public API, or new permission is added.
- [x] Development mode loads and renders the real overview; production remains
      fail closed and performs no overview read.
- [x] Contract and Backoffice tests pass; conditional database integration
      coverage is present for tenant isolation, paging, audit, and stale target.
- [x] Local browser QA at 1440, 1024, 768, and 390 px confirms the real item,
      Documents-add entry point, no horizontal overflow, and no console error.
- [ ] Production legal, privacy, retention, security, and operations gates are
      approved.

## Wave D Phase 4 — local integration and production-boundary audit

- [x] Product owner authorized Phase 4 after the local Phase 3 slice.
- [x] Phase 4 is interpreted within the standing no-production boundary.
- [x] The full session, OWNER permission, establishment scope, repository,
      minimized response, target revalidation, and existing-flow path is traced.
- [x] Page-loader and server-action runtime checks use one tested helper.
- [x] The helper enables only `development` and fails closed for production,
      test, and missing environment values.
- [x] Backoffice tests pass with 31 files and 93 tests.
- [x] A fresh production build passes and an authenticated production runtime
      renders Salariés without rendering Wave D or logging browser errors.
- [x] Development runtime still renders the real Wave D item/action without
      `DRAFT` or fictional-data disclosure.
- [x] No schema, migration, contract field, repository rule, permission,
      public API, audit payload, task, notification, or provider was added.
- [x] Mutation-capable database integration tests were not forced without the
      explicit local database opt-in.
- [ ] Production legal, privacy, retention, security, backup/restore, and
      operations approval remains required.

## Wave F Phase 0 — document extraction discovery

- [x] Wave F is classified `NEW_CAPABILITY_DISCOVERY` inside the existing Salariés Documents surface.
- [x] Repository inventory confirms secure private PDF storage, quarantine,
      Defender scanning, OWNER permissions, server delivery, and no OCR/AI capability.
- [x] The functional pack is treated as intent only and its no-fake-OCR rule is preserved.
- [x] The recommended MVP is one verified signed base contract for one existing employee.
- [x] Trusted organization + establishment + employee + document-version ownership is explicit.
- [x] OWNER is the only proposed first user; no manager, staff, employee, public, or service access is inferred.
- [x] The first allowlist contains existing employment facts only and excludes identity, departure, remuneration, payroll, and register facts.
- [x] AI/OCR output remains an untrusted suggestion requiring per-field review; no automatic save is allowed.
- [x] A later apply action must reuse employee validation, revision conflict,
      idempotency, and minimized changed-field audit behavior.
- [x] PDF content, raw text, prompts, responses, values, snippets, and provider IDs are excluded from URLs, analytics, generic logs, and audit metadata.
- [x] Prompt-injection content inside documents is treated as data and cannot invoke tools or change authorization/schema rules.
- [x] A provider-neutral server interface is proposed for later design without creating a generic AI platform now.
- [x] File-first employee creation, amendments, identity/work-permit documents,
      multi-file reconciliation, chatbot, batch, and production providers are deferred.
- [x] Loading, partial/no result, unsupported, provider failure, stale document,
      employee conflict, validation, apply, success, retry, forbidden, and production-disabled states are recorded.
- [x] The self-contained French design prompt was executed only after explicit approval.
- [x] Phase 0 creates no route, UI, fixture, schema, migration, contract,
      permission, audit event, AI service/provider, file read/transmission,
      employee mutation, operational data, or production behavior.
- [x] Product owner approved WF0-01 through WF0-12 on 2026-08-18.
- [x] Product owner authorized Wave F design-prompt execution separately.
- [x] DRAFT references exist for the requested 1440, 1024, 768, and 390 viewport concepts.
- [x] The DRAFT references keep analysis on the signed base contract and do not analyze amendments.
- [x] No runtime UI, file read, OCR/AI call, provider, contract, persistence, permission, audit, or employee mutation was created.
- [x] Product owner approved the Wave F DRAFT visual direction and requested Phase 1.

## Wave F Phase 1 — local typed-fixture prototype

- [x] The prototype is enabled only in local development and fails closed in production/test.
- [x] `Analyser le contrat` appears only on an available signed base contract, never on an amendment.
- [x] The panel says `Aperçu — aucune analyse réelle`, identifies fictional data,
      and states that no PDF is read or transmitted.
- [x] Only the three approved fictional employment suggestions are present.
- [x] Every suggestion shows current/detected values, textual confidence, page,
      fictional evidence, and explicit keep/use choices.
- [x] No suggestion is preselected; choices affect only the local summary.
- [x] The apply action remains disabled after local selections.
- [x] Closing the inline preview restores focus to `Analyser le contrat`.
- [x] Consult and download actions remain available and unchanged.
- [x] 1440, 1024, 768, and 390 px have no page or prototype horizontal overflow.
- [x] Browser QA reports no console error.
- [x] No file read/transmission, OCR/AI/provider call, API, contract, schema,
      migration, repository, permission, audit event, employee/register mutation,
      operational data, or production behavior was added.
- [x] Product owner authorized Wave F Phase 2 interaction/data/domain design.

## Wave F Phase 2 — interaction, data, and service design

- [x] Product owner authorized Phase 2 design only.
- [x] Current document storage, scanner, exact-version grant, employee update,
      revision, idempotency, validation, permissions, and audit behavior were rechecked.
- [x] The service boundary is server-only and provider-neutral.
- [x] Local PDF preflight and semantic extraction are separate replaceable stages.
- [x] Browser identifiers, storage keys, URLs, roles, provider output, and PDF instructions are untrusted.
- [x] The strict versioned result, field allowlist, typed candidates, confidence,
      page, excerpt, warnings, status, expiry, and extra-key rejection are specified.
- [x] `position` and `contractWeeklyMinutes` are the only proposed first apply fields.
- [x] CDI/CDD stays review-only until expected end date and controlled CDD reason dependencies are supported.
- [x] Suggestions are transient; invalidation on close/reload/version/revision/scope/expiry is specified.
- [x] Fresh authorization, exact document version, employee revision, validation,
      idempotency, and existing employee audit are required before apply.
- [x] Separate future extract permission and minimized extraction audit outcomes are specified.
- [x] Foreground timeout, concurrency, manual retry, file/page, and establishment rate limits are proposed.
- [x] OpenAI file-input, structured-output, retention, and EU processing constraints were checked against official documentation.
- [x] Remote real-file use remains blocked by EU/ZDR-or-MAM/DPA/legal/DPO/privacy/security/operations evidence.
- [x] Synthetic fixtures, cross-tenant denial, prompt injection, malformed output,
      stale/conflict, log redaction, rate/cost, and production-disabled tests are specified.
- [x] Phase 2 created no service, provider, SDK/library, contract, permission,
      audit event, schema, migration, file access/transmission, mutation, or operational data.
- [x] Product owner approved WF2-01 through WF2-16.
- [x] Product owner authorized Wave F Phase 3 local implementation with synthetic PDFs/data only.

## Wave F Phase 3 — local synthetic implementation

- [x] Development-only server flow generates and prepares a fictional PDF; it never opens the signed personnel file.
- [x] Strict versioned schemas reject extra keys, unsupported apply fields, duplicate selections, invalid pages, and long excerpts.
- [x] OWNER-only extraction permission is enforced before preparation or adapter invocation.
- [x] Exact employee revision and signed-document version are checked before review and apply.
- [x] Complete, partial, no-result, unsupported, failure, timeout, and manual-retry states are available locally.
- [x] CDI/CDD remains review-only; only position and weekly minutes can be selected for apply.
- [x] Apply reuses employee validation, revision, idempotency, and atomic changed-field audit behavior.
- [x] Requested, completed, failed, and applied events contain no file content, snippets, candidate/current values, prompt, or provider response.
- [x] Suggestions remain transient and are cleared on close, refresh, document replacement, retry, or conflict.
- [x] No provider, remote call, API key, schema, migration, result store, queue, worker, or production enablement was added.
- [x] Product owner authorized Wave F Phase 4 local integration verification and hardening.

## Wave F Phase 4 — local integration hardening

- [x] Apply requires a matching completed extraction event in the same trusted organization, establishment, employee, request, and document/version scope.
- [x] Complete/partial outcome mismatch, fabricated request, another establishment, and document mismatch fail closed.
- [x] Completed review grants expire after 15 minutes and are checked server-side before employee mutation.
- [x] Employee/document revision changes and apply conflicts clear the request, choices, and review result.
- [x] Radio groups remain controlled from first render and produce no React warning after selection.
- [x] Complete, partial, unsupported, failure, timeout, retry, selection, and focus recovery were exercised in the live local app.
- [x] Browser geometry at 1440/1024/768/390 has no page or review horizontal overflow.
- [x] Browser QA produced no warning/error after hardening and did not apply a suggestion to employee data.
- [x] No real personnel file was opened or transmitted and no external AI/provider/production path was enabled.
- [x] Product owner authorized Wave F Phase 5 evidence/finalization on 2026-08-18.

## Wave F Phase 5 — local QA and as-built finalization

- [x] Signed-in OWNER QA uses the development-only synthetic PDF path and does
      not open or transmit the signed employee PDF.
- [x] The ready review truthfully says `Local — PDF synthétique` and
      `Test local avec données fictives`.
- [x] Review content, document actions, and the drawer remain usable at 1440,
      1024, 768, and 390 px with no horizontal page or review overflow.
- [x] Mobile stacks the review content and keeps the existing scrollable dossier
      tab strip; no desktop-only comparison layout is forced onto 390 px.
- [x] Closing the review restores focus to `Analyser le contrat` with
      `aria-expanded=false`.
- [x] Fresh browser QA reports no warning or error.
- [x] Four stable `wave-f-phase-5-as-built-*` captures are retained.
- [x] No suggestion was applied and no employee, document, or register data was changed.
- [x] No real-file extraction, external AI/OCR, provider SDK/key, production
      rate limiter, schema, migration, result store, queue, or production path
      was introduced.
- [ ] Real-file/provider evaluation and production approval remain separately blocked.

## Wave G Phase 0 — synthetic AI/OCR provider evaluation discovery

- [x] Wave G is classified as a new `FLOW + INTEGRATION` capability inside the
      existing integrated Documents surface and stable Salariés page pack.
- [x] Repository inventory confirms a provider-neutral preparer/adapter,
      strict result schema, timeout, review, authorization, and no remote provider.
- [x] Current manifests contain no selected OCR/AI SDK or provider secret.
- [x] The Phase 0 MVP is an evaluation specification using generated fictional
      French contracts with known expected answers.
- [x] OpenAI Responses direct PDF is the only external AI/OCR provider path
      proposed for the first synthetic benchmark.
- [x] Local native extraction, Tesseract/self-hosted OCR, Azure, Google, and a
      second provider are outside the current direction.
- [x] Proposed corpus classes, minimum counts, metrics, and safe pass/fail rules are recorded.
- [x] Production files remain in private EU storage outside Neon; an AI request
      does not become file storage or an authoritative employee update.
- [x] OWNER and trusted organization + establishment + employee + exact
      document/version scope remain future runtime invariants.
- [x] UI discovery reuses Wave F; design prompt is truthfully `NOT_APPLICABLE`.
- [x] OpenAI PDF/structured-output, retention, and EU residency documentation
      was reviewed without creating an account, key, SDK, or request.
- [x] Current OpenAI and CNIL primary documentation was reviewed for EU
      processing, retention controls, file/image exceptions, and privacy risks.
- [x] WG0-01 through WG0-14 are prepared for product approval.
- [x] Phase 0 creates no code, fixture PDF, schema, migration, contract change,
      permission, audit event, SDK/library, key, external request, file read,
      operational data, employee mutation, or production behavior.
- [x] One organization-level eligibility dossier discloses review analysis,
      reply drafting, creative visual generation, and contract extraction while
      keeping the personnel use case separately blocked.
- [x] The dossier contains no private contact, account, key, employee, customer,
      contract, review, or production identifier.
- [ ] Product, privacy/DPO, security, legal, operations, volume, and budget fields
      are approved in a private submission copy.
- [x] An authorized YUTA representative separately approves external submission.
- [x] Product owner approves WG0-01 through WG0-14 and separately authorizes Wave G Phase 1.

## Wave G Phase 1 — provider eligibility and private submission

- [x] The private submission identifies YUTA truthfully as a pre-incorporation project.
- [x] The request covers all four proposed AI use cases and the 100-establishment, 24-month target.
- [x] The private submission contains no real customer, employee, review,
      contract, prompt, response, key, or production identifier.
- [x] Product authorizes contact with OpenAI Sales for eligibility guidance.
- [x] The product owner confirms submission through the OpenAI Sales contact
      form on 2026-08-18; no provider approval is inferred from form delivery.
- [ ] OpenAI's written response is retained privately.
- [ ] Accepted non-confidential conclusions are synchronized into current documentation.
- [x] Product separately authorizes Wave G Phase 2 offline and Phase 3 design
      preparation on 2026-08-19; this approval did not authorize a key or request.

## Wave G Phase 2 — offline corpus

- [x] The ten-file starter corpus was reviewed and expansion to 60 files was
      authorized by product on 2026-08-19.
- [x] Sixty visibly fictional two-page PDFs are generated: 20 digital text,
      15 clear scans, 15 degraded scans, and 10 adversarial/ambiguous files.
- [x] The manifest records a stable file, SHA-256, page count, exact allowlisted
      answers, and required abstentions for every fixture.
- [x] No fixture contains a real person, restaurant, address, signature, salary,
      bank value, identity number, employee metadata, or production identifier.
- [x] The scorer reuses the strict YUTA result schema and measures exact, false,
      missing, incorrect-high-confidence, and abstention outcomes.
- [x] Tests verify distribution, PDF signature, hash, page count, exact answers,
      unsafe guesses, and extra-key rejection.
- [x] Representative digital, clear-scan, degraded-scan, and adversarial pages
      are rendered and visually inspected.
- [x] No UI, storage, employee/document/register data, provider SDK, key,
      request, schema, migration, or production behavior is added.
- [x] Two consecutive generations produce identical hashes for all 60 PDFs and
      the manifest.

## Wave G Phase 3 — temporary-account preparation

- [x] Product permits design preparation around the current
      personal/pre-incorporation API organization.
- [x] Product separately authorizes creation of the disposable `YUTA AI Test`
      project on 2026-08-19, isolated from every production use.
- [x] The dashboard reports `Global` geography and data-retention control
      `None`; no EU or Zero Data Retention claim is made.
- [x] The private project ID is not stored in repository documentation.
- [x] Project-scoped service account/key, truthful geography, retention, model
      allowlist, rate limit, spend alert, and hard limit are required.
- [x] A later company-owned environment must use a new organization/project/key
      and rerun synthetic acceptance.
- [x] USD 10 prepaid organization credit is present and automatic reload is
      disabled.
- [x] The project has a USD 5 monthly hard limit and the dashboard's 100% alert.
- [x] The model allowlist contains only `gpt-5.6-luna` and
      `gpt-5.6-terra`; this does not yet approve exact snapshots.
- [x] The project service account/key is named `yuta-ai-evaluation-local`; its
      secret is private and absent from the repository.
- [x] `YUTA AI Evaluation Caller` grants only model-request capability, is the
      service account's only assigned role, and replaces preset `member`.
- [x] The key was unused and project spend was USD 0 immediately after sandbox
      setup, before the separately authorized first call.
- [ ] Exact model snapshots and a project rate limit are approved.
- [x] The ignored local secret path and exact `approved-synthetic-only` run gate
      provide evaluation-only injection and a default-off kill switch.
- [x] Product explicitly authorizes one first Phase 4 synthetic request on
      2026-08-19.

## Wave G Phase 4 — complete synthetic benchmark

- [x] The adapter is server-only, implements the existing provider-neutral
      interface, and adds no OpenAI SDK.
- [x] The remote request uses only `gpt-5.6-luna`, direct Base64 PDF input,
      `store: false`, strict structured output, low reasoning effort, no tools,
      no background mode, and no automatic retry.
- [x] The runner selects only approved manifest fixture IDs and hashes;
      arbitrary or real file paths are not accepted.
- [x] The digital-text first call and three separately approved representative
      calls for clear scan, degraded partial scan, and adversarial instruction
      content all pass on their first attempt.
- [x] All four results pass the strict YUTA schema and expected-answer scorer
      with no missing, false, incorrect-high-confidence, or abstention
      violation.
- [x] The three-call batch records normalized latency, token, and estimated-cost
      metrics totaling 13,701 input tokens, 427 output tokens, and USD
      0.0032526.
- [x] Product separately authorizes the remaining 56 fixtures; all run once in
      sequence with no retry.
- [x] The complete baseline produces 58/60 document passes: 20/20 digital,
      14/15 clear scan, 14/15 degraded scan, and 10/10 adversarial.
- [x] All 60 responses are schema-valid; there are no provider failures,
      timeouts, arbitrary-key leaks, or abstention violations.
- [ ] WG0-09 passes: `wg2-scan-clear-03` contains one false
      high-confidence suggestion, so zero tolerance is not met.
- [x] `wg2-scan-degraded-07` has a status-only mismatch while safely returning
      no suggestions.
- [x] No secret, raw response, provider ID, prompt, PDF content, employee data,
      or operational mutation is persisted.
- [ ] Full billed cost is reconciled after the delayed Usage dashboard ingests
      all 60 requests.
- [ ] OpenAI or another request configuration is selected in Phase 5.
- [ ] Real personnel-file use, a company-owned production environment, EU and
      retention evidence, production controls, and production release are
      approved.

## Wave G Phase 5 — Luna/Terra comparison

- [x] Product separately authorizes a full `gpt-5.6-terra` comparison against
      the same frozen corpus and request controls.
- [x] All 60 Terra fixtures run once in sequence with no retry.
- [x] Terra produces 58/60 document passes: 20/20 digital, 13/15 clear scan,
      15/15 degraded scan, and 10/10 adversarial.
- [x] All 60 Terra responses are schema-valid; there are no provider failures,
      timeouts, arbitrary-key leaks, or abstention violations.
- [x] Terra records a maximum request latency below five seconds and fixes
      Luna's safe status-only mismatch on `wg2-scan-degraded-07`.
- [ ] Terra passes WG0-09: `wg2-scan-clear-03` and
      `wg2-scan-clear-05` each contain one false high-confidence suggestion.
- [x] Rendered visual review confirms both failed synthetic PDFs and their
      manifest expected answers are legible and correct.
- [x] The comparison preserves the prompt, schema, request shape, synthetic-only
      boundary, and no-retry policy.
- [x] Neither evaluated configuration is selected because both fail WG0-09.
- [ ] Final billed cost is reconciled; the current dashboard snapshot is only
      partial at 98/120 requests, 328,421 tokens, and USD 0.40.
- [ ] Product either rejects both current configurations or predefines and
      approves a new candidate before any fresh full-corpus run.
- [ ] Real personnel-file use and production remain separately blocked.

## Wave G Phase 5 — approved prompt v2 definition

- [x] Prompt v2 exists as `v2`; prompt v1 remains the adapter default.
- [x] No existing external benchmark gate selects v2.
- [x] The draft requires exact position transcription and prohibits spelling,
      accent, apostrophe, punctuation, spacing, or abbreviation correction.
- [x] Status is tied to suggestion count: complete 3, partial 1–2,
      no_result/unsupported 0.
- [x] V2 local validation rejects duplicate fields and inconsistent
      status/count output.
- [x] Offline diagnostics distinguish candidate-value, source-page,
      duplicate-field, missing/unexpected, and orthographic mismatches without
      logging candidate values.
- [x] Fake-response tests cover exact success, `Hôte d’accueil` normalization,
      wrong source page, inconsistent zero-result status, and duplicate fields.
- [x] Exact-match and WG0-09 safety gates remain unchanged.
- [x] Product approved the exact v2 prompt text on 2026-08-19.
- [x] The approved prompt text is pinned by a tested SHA-256 fingerprint.
- [x] Product separately authorized one v2 full-corpus run on 2026-08-19.
- [x] All 60 locked fictional PDFs ran once in sequence with no retry.
- [x] Luna/v2 produced 46/60 passes: digital 14/20, clear scan 9/15,
      degraded scan 15/15, and adversarial 8/10.
- [ ] V2 passes WG0-09: eleven results contain an incorrect high-confidence
      orthographic rewrite of `position`.
- [x] One result failed v2 local consistency validation; two adversarial
      results safely omitted one expected weekly duration.
- [x] The temporary v2 external run gate was removed after the authorized run.
- [ ] Exact billed-cost reconciliation is complete.
- [ ] Any real-file or production use remains separately approved.

## Wave G Phase 5 — approved prompt v3 and candidate corpus v2

- [x] Product approved the exact v3 prompt text on 2026-08-19.
- [x] V3 exists as `v3`; v1 remains the adapter default.
- [x] V3 was not the adapter default; its single-use external gate was removed
      after the authorized run.
- [x] V3 uses held-out transcription examples absent from corpus v1.
- [x] Exact matching remains unchanged; normalized French remains a failure.
- [x] V3 does not treat a bare hour duration as weekly.
- [x] Offline review identifies `wg2-adversarial-05` and
      `wg2-adversarial-09` as corpus-v1 specification defects.
- [x] Corpus v1 remains frozen; no post-result answer or PDF was changed.
- [x] Fake-response tests cover the prompt fingerprint, exact unaccented text,
      normalized-title failure, safe duration omission, and local consistency.
- [x] Candidate corpus v2 changes only `wg2-adversarial-05` and
      `wg2-adversarial-09` to make weekly duration explicit.
- [x] Corpus v2 preserves all expected answers and 58/60 PDF hashes.
- [x] The two changed PDF hashes are pinned in the corpus-v2 manifest.
- [x] Both changed two-page PDFs were rendered and visually reviewed.
- [x] Corpus-v2 tests verify distribution, hashes, pages, and v1 comparison.
- [x] Product approved corrected corpus v2 on 2026-08-19.
- [x] Product separately authorized one 60-PDF Luna/v3 run with no retry.
- [x] The run produced 58/60 passes: digital 20/20, clear scan 13/15,
      degraded scan 15/15, and adversarial 10/10.
- [ ] V3 passes WG0-09: `wg2-scan-clear-07` contains one incorrect
      high-confidence orthographic rewrite.
- [x] `wg2-scan-clear-09` completed at the provider but failed local
      schema/consistency validation.
- [x] There were no provider failures or abstention violations.
- [x] Usage observations for 59 responses record 227,463 input tokens, 9,586
      output tokens, and an estimated USD 0.0569958.
- [ ] Final billed-cost reconciliation includes the rejected response.
- [x] The temporary v3 gate was removed; no retry or further call is authorized.

## Wave G Phase 5 — approved prompt v4

- [x] Product requested offline v4 preparation after the v3 result.
- [x] V4 keeps model, reasoning effort, corpus v2, structured schema, local
      validation, scorer, and WG0-09 unchanged.
- [x] V4 excludes the position label, separator, and sentence-ending
      punctuation while preserving characters internal to the value.
- [x] V4 emits at most one suggestion per field in fixed order and derives
      status after the final suggestion count.
- [x] Documentation distinguishes failure hypotheses from unavailable raw v3
      output.
- [x] The v4 prompt is pinned by SHA-256.
- [x] Fake-response tests cover its request name, exact position boundary,
      punctuation mismatch, duplicate fields, and status/count mismatch.
- [x] Prompt v1 remains the adapter default.
- [x] The single-use v4 run gate was removed after the authorized run.
- [x] Product approved the exact v4 prompt on 2026-08-19.
- [x] Product separately authorized one 60-PDF Luna/v4 run with no retry.
- [x] V4 produced 59/60 passes: digital 20/20, clear scan 14/15, degraded
      scan 15/15, and adversarial 10/10.
- [x] All 60 responses were schema-valid or safely rejected; the only invalid
      result was `wg2-scan-clear-15`.
- [x] V4 has zero incorrect high-confidence suggestions and passes WG0-09.
- [x] V4 has zero abstention violations and zero provider failures.
- [x] Maximum observed latency was 7,498 ms, below the 45-second boundary.
- [x] Usage observations for 59 results total 232,065 input tokens, 9,184
      output tokens, and estimated USD 0.0574338.
- [ ] Final billed cost includes the locally rejected result.
- [x] V4 meets the current synthetic safety, accuracy, and latency thresholds.
- [x] Product selected Luna/v4/corpus-v2 as the synthetic evaluation winner on
      2026-08-19.
- [x] The synthetic comparison is closed and no further evaluation call is
      authorized by the selection.
- [x] The generic adapter default remains v1 to prevent implicit promotion.
- [ ] Real personnel files and production use remain separately approved.

## Wave G Phase 6 — development integration

- [x] Existing Documents action resolves the extraction adapter on the server.
- [x] Offline development defaults to `deterministic-synthetic`.
- [x] `openai-synthetic` explicitly pins Luna and prompt v4.
- [x] Missing key and unknown mode fail before provider access.
- [x] Production, test, and missing `NODE_ENV` fail closed even if mode and key
      are present.
- [x] The service generates a fictional PDF and does not read stored signed
      contract bytes.
- [x] End-to-end tests use a fake provider response and make no network call.
- [x] Non-complete UI test scenarios remain deterministic and make no provider
      call.
- [x] Existing OWNER authorization, version checks, rate limit, transient
      review, explicit apply, and minimized audit remain unchanged.
- [x] No schema, migration, SDK, route, provider UI, automatic employee update,
      real-file path, or production capability was added.
- [ ] Real personnel files and production processing remain blocked pending the
      separate provider, EU/privacy/security, and operations gates.

## Wave E Phase 0 — personnel register and PDF export discovery

- [x] Repository inventory confirms no register aggregate, stable arrival
      sequence, complete mandatory-field set, stagiaire/service-civique domain,
      register retention process, register permission/audit, or PDF generator.
- [x] The new capability is classified as `NEW_CAPABILITY_DISCOVERY`; the
      containing `/equipe/salaries` page remains integrated and unchanged.
- [x] The proposed target is an establishment-wide page entered from Salariés,
      not a per-employee drawer tab or organization-wide register.
- [x] Current reusable fields and missing required/conditional fields are
      reconciled explicitly; current audit history is not treated as an
      indelible or reconstructable register.
- [x] OWNER-only first use, trusted organization + establishment ownership, and
      proposed separate future read/export permissions are recorded.
- [x] Salariés, register, Documents, Formalités, Planning, Pointage, login
      users, and POS staff boundaries remain separate.
- [x] Structured register data is the proposed source of truth; PDF is a
      protected, server-generated representation with no public/stable URL.
- [x] Sensitive multi-person data, minimized read/export audit, correction,
      retention, rights, backup/restore, incident, and operations gates are recorded.
- [x] Official Légifrance and CNIL sources were reviewed without a compliance claim.
- [x] Loading, ready, incomplete, empty, unsupported category, forbidden,
      error/retry, export pending/failure/success, stale source, responsive, and
      accessibility discovery states are specified.
- [x] OCR, extraction, AI suggestions, and automatic employee updates remain
      deferred to separately approved Wave F discovery.
- [x] A self-contained French design prompt was approved and executed.
- [x] Phase 0 created no runtime route, UI, fixture, schema, migration,
      contract, repository, API, permission, audit event, PDF, storage, provider,
      test, operational data, or production behavior.
- [x] Product owner approved WE0-01 through WE0-10 for design exploration.
- [x] Product owner authorized execution of the Wave E design prompt only.
- [x] A dedicated `backoffice-equipe-registre-personnel` design pack stores the
      four responsive DRAFT studies.
- [x] Product owner approved the Wave E visual direction.
- [x] Product owner separately authorized Phase 1 local typed-fixture prototype work.

## Wave D Phase 5 — local functional and visual QA

- [x] Product owner authorized Phase 5 after the local Phase 4 audit.
- [x] Signed-in OWNER evidence uses real configured establishment data and no
      fixture/DRAFT disclosure.
- [x] Current data covers one real correction item and one truthful empty group.
- [x] `Ajouter le contrat` revalidates and opens the existing Documents add form.
- [x] Closing the action-opened drawer with Escape restores focus to the
      originating overview action.
- [x] 1440, 1024, 768, and 390 px have no page horizontal overflow.
- [x] The employee drawer at 390 px fits the viewport without horizontal overflow.
- [x] Mobile stacks groups and the item action; desktop uses the approved compact
      two-group composition where space permits.
- [x] Fresh browser QA reports no warning or error.
- [x] Four stable `wave-d-phase-5-as-built-*` captures are retained.
- [x] Error, partial-source, and pagination screenshots are not fabricated when
      current real data does not produce those states; code/tests remain the
      truthful evidence.
- [x] No employee/document mutation, fixture, schema, migration, API, permission,
      audit payload, provider, or production behavior was added in Phase 5.
- [ ] Production legal, privacy, retention, security, backup/restore, and
      operations approval remains required.
