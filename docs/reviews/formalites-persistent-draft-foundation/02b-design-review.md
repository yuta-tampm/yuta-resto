# Gate 2b — Sensitive Technical Design / Privacy-Data Review

Change: `formalites-persistent-draft-foundation`

Review status: `APPROVED`

Technical Design: `APPROVED`

N4 Privacy/Data: `RESOLVED_FOR_BOUNDED_SLICE`

Production retention/readiness: `DEFERRED / NOT_AUTHORIZED`

Sensitive Design Gate: `APPROVED`

Approval source: `explicit current-user instruction`

Approval recorded by: `Codex workflow`

Approved: `2026-09-04T23:29:32.6932801+02:00`

Created: `2026-09-04T22:18:39.5609469+02:00`

Regenerated: `2026-09-04T22:57:03.6464328+02:00`

Schema: `yuta-spec-driven`

UI_AFFECTING: `YES`

BROWSER_QA_REQUIRED: `YES — later Integration/Regression only`

## Gate authority and integrity

Gate 1 remains approved. Human review approved the targeted Gate 2 N4 revision
and this exact Sensitive Design. No other Product boundary was reopened. Exact
current artifacts checked before Design:

| Artifact                                                                                                       | SHA-256                                                            | Disposition                                     |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `openspec/changes/formalites-persistent-draft-foundation/proposal.md`                                          | `2166d890b0449b63c925c798724e9e66432a8bff5debbccab238851ade73db18` | Approved Gate 1 bytes unchanged                 |
| `openspec/changes/formalites-persistent-draft-foundation/analysis.md`                                          | `11f11ee989b339dad2286fd6e2bc34e3119514a55dd4717123bea529a28ad693` | Approved Gate 1 bytes unchanged                 |
| `openspec/changes/formalites-persistent-draft-foundation/specs/formalites/persistent-draft-foundation/spec.md` | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` | Gate 2 APPROVED: 22 Requirements / 70 Scenarios |
| `docs/reviews/formalites-persistent-draft-foundation/01-analysis-review.md`                                    | `17bf41fa36705e6ec96c93b08d9a0419aff1c88fb9e1ba84178f9c96f7462815` | Gate 1 APPROVED                                 |
| `docs/reviews/formalites-persistent-draft-foundation/02-specs-review.md`                                       | `12c341f511e0cbd79e4ee567002bfa0d814fa238c63386c97ea17a06ceaa61b5` | Gate 2 APPROVED                                 |

## Design under review

Targeted revision provenance:

| Artifact           | Before N4 decision                                                 | Regenerated                                                        |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Delta Spec SHA-256 | `e540c535b6f738f4e3a24247f23c39483b68bd5673935b9df45b2317e26c880b` | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` |
| Design SHA-256     | `3d7cc3105eca9d90d7ea7b01df488ffd16cd81b100279d3919f5110fa8c63298` | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` |
| N4 disposition     | `BLOCKED_NEEDS_PRIVACY_DECISION`                                   | `RESOLVED_FOR_BOUNDED_SLICE`                                       |

Only approved N4 retention wording and the canonical lock-order correction were
revised. All other accepted Design decisions remain preserved.

| Artifact                                                            | SHA-256                                                            | Decisions |
| ------------------------------------------------------------------- | ------------------------------------------------------------------ | --------: |
| `openspec/changes/formalites-persistent-draft-foundation/design.md` | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` |        16 |

Hash is lowercase SHA-256 of exact formatted bytes.

## Numbered decision review

| Decision | Bounded choice                                                                                                           | Review assessment                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| D1       | Formalités owns draft/workflow/reconciliation; Backoffice + db-cloud runtime/persistence; Personnel remains source owner | Correct existing ownership; no cross-runtime boundary                                                  |
| D2       | One literal `cdi_preparation` with typed transport and DB check                                                          | Smallest future-safe discriminator; no generic workflow engine                                         |
| D3       | One scoped draft aggregate with lifecycle, content snapshot, reconciled-source snapshot and revision                     | Sufficient for approved behavior; no unapproved input                                                  |
| D4       | Explicit field inventory and bounded retention disposition                                                               | Every persistent field maps to Spec/integrity; retained without automatic timer; final policy deferred |
| D5       | Compare current Personnel with acknowledged source; KEEP updates source only, REFRESH updates content + source           | Prevents repeated prompt and false Personnel truth                                                     |
| D6       | Exact seven-fact source fingerprint plus locked server reread                                                            | Detects stale reconciliation without trusting browser values or revision-only divergence               |
| D7       | Transactional current CDI revalidation for active mutations                                                              | Closes CDI→CDD stale-page race; recovery retains READ/REOPEN/ABANDON                                   |
| D8       | Partial unique DB index for one active draft per full business key                                                       | Survives concurrent CREATE; abandoned row permits later create                                         |
| D9       | Scoped optimistic draft revision; abandonment reason trimmed to 1–250 characters with lifecycle DB checks                | Prevents save/save, save/abandon and stale-editor last-write-wins                                      |
| D10      | Formalités-owned scoped command receipts without expiry/cleanup in this slice                                            | Makes response replay duplicate-safe; final receipt retention remains a future decision                |
| D11      | One transaction per CREATE/SAVE/RECONCILE/ABANDON; canonical PERSONNEL → FORMALITES DRAFT lock order where both apply    | Full commit or prior state; no partial snapshot/lifecycle/receipt or inconsistent lock ordering        |
| D12      | Existing trusted session/membership/org/establishment + independent Formalités and Personnel permissions                 | No grant change, browser authority or cross-scope disclosure                                           |
| D13      | Strict shared transport and typed safe outcomes                                                                          | Supports recovery without raw rows, hashes, IDs or cross-tenant existence exposure                     |
| D14      | Extend current employee-connected route behind existing development gate                                                 | Preserves shell, real source, generic prototype and navigation                                         |
| D15      | Additive future migration, no backfill, preserve-data/roll-forward rollback                                              | Compatible with clean/existing DB; no production operation authorized                                  |
| D16      | Layered contract, disposable-db, auth, component and later Browser QA evidence                                           | Required DB integration cannot be replaced by mocks; browser QA deferred correctly                     |

Technical Design is coherent and `READY_FOR_REVIEW`. N4 is
`RESOLVED_FOR_BOUNDED_SLICE`; this packet still requires human Sensitive Design
approval and does not authorize Tasks/Apply.

## Requirement-to-Design coverage — all 22 Requirements

|   # | Approved Requirement title                                                 | Design coverage   | Status                    |
| --: | -------------------------------------------------------------------------- | ----------------- | ------------------------- |
|   1 | Eligibility tạo draft dựa trên Personnel hiện tại và trusted scope         | D7, D8, D12       | COVERED                   |
|   2 | Formalités authorization và Personnel source authorization độc lập         | D1, D12           | COVERED                   |
|   3 | Browser identifiers và claims không tạo authority                          | D12, D13          | COVERED                   |
|   4 | Draft lifecycle sử dụng explicit persistence                               | D3, D9, D11, D14  | COVERED                   |
|   5 | Abandonment yêu cầu reason và giữ record                                   | D3, D4, D9, D11   | COVERED                   |
|   6 | Có thể tạo draft mới sau abandonment                                       | D8, D9            | COVERED                   |
|   7 | Tối đa một active draft trong business scope                               | D3, D8            | COVERED                   |
|   8 | probationChoice có ba trạng thái chuẩn bị đã duyệt                         | D3, D4, D13, D14  | COVERED                   |
|   9 | INCLUDE không phải kết luận hoặc khuyến nghị pháp lý                       | D2, D14           | COVERED                   |
|  10 | Draft giữ đúng Personnel reference, anchor và source snapshot              | D3, D4, D6        | COVERED                   |
|  11 | Reopen phát hiện relevant Personnel divergence theo source facts           | D5, D6, D13       | COVERED                   |
|  12 | Reconciliation là explicit và per divergent fact                           | D5, D6, D11, D14  | COVERED                   |
|  13 | Reconciliation thành công giải quyết đúng source state đã đối chiếu        | D3, D5, D6        | COVERED                   |
|  14 | Reconciliation stale phải fail visibly                                     | D6, D9, D11, D13  | COVERED                   |
|  15 | Current Personnel eligibility độc lập với reconciliation choice            | D5, D7, D13, D14  | COVERED                   |
|  16 | CDI eligibility phục hồi không bỏ qua reconciliation                       | D5, D7, D13       | COVERED                   |
|  17 | Save failure giữ nguyên authoritative saved state                          | D9, D10, D11, D14 | COVERED                   |
|  18 | Concurrent và stale mutations không dùng silent last-write-wins            | D8, D9, D10, D11  | COVERED                   |
|  19 | Mọi resource access giữ full tenant scope                                  | D3, D8, D10, D12  | COVERED                   |
|  20 | Formalités draft không ghi ngược vào Personnel                             | D1, D5, D7, D11   | COVERED                   |
|  21 | Employee-connected capability được mở rộng mà không phá prototype hiện tại | D14               | COVERED                   |
|  22 | Workflow giữ draft mà không hứa retention vô hạn                           | D4, D10, D15, N4  | COVERED for bounded slice |

Coverage: `22/22`. N4 encodes only the approved bounded retention behavior; no
duration, infinite-retention promise or production policy is invented.

## Persistence and snapshot review

Proposed future persistence consists of exactly two Formalités-owned tables:

1. `formalites_personnel_drafts`: scoped identity, one bounded formality type,
   DRAFT/ABANDONED lifecycle, three-state probation choice, optimistic revision,
   seven draft-content facts, seven acknowledged-source facts, Personnel source
   revision anchor, abandonment reason/time and server timestamps.
2. `formalites_personnel_draft_command_receipts`: full scope, actor, bounded
   command, operation-key hash, request fingerprint, committed draft outcome and
   lifecycle timestamps for replay recovery.

The exact field inventory, ownership, purpose, nullability, source, mutation
authority and N4 class is in D4/D10. No third table, history engine, generic
workflow model or JSON form dump is proposed.

The coherent CREATE snapshot comes from one locked/scoped Personnel row and
contains exactly:

- `givenNames`;
- `familyName`;
- `position`;
- `qualification`;
- `employmentTermType`;
- `entryDate`;
- `contractWeeklyMinutes` as integer or explicit `null`.

`givenNames` and `familyName` remain atomic. A revision-only change does not
create divergence. Typed scalar columns avoid unvalidated persistence JSON and
make the nullable weekly duration unambiguous.

## Reconciliation review

The dual-snapshot model is the smallest representation found that satisfies R1:

- `draft*` = value Formalités currently uses;
- `source*` = trusted Personnel value most recently captured/reconciled.

KEEP leaves `draft*` unchanged and advances `source*` to the locked current
Personnel value. REFRESH advances both. Later reads compare Personnel with
`source*`, not with `draft*` or revision alone. Consequently:

- unchanged source after KEEP does not reprompt;
- a retained KEEP value may differ visibly from Personnel without being called
  Personnel truth;
- REFRESH resolves to the actual trusted accepted value;
- any later source-fact change differs from `source*` and creates a new episode.

The source fingerprint is transient concurrency evidence. All values and the
divergent set are derived again on server; browser claims cannot create source
authority.

## Concurrency, transaction and failure review

| Case                     | Backstop                                                | Observable failure/recovery                                              |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------------------------ |
| Concurrent CREATE        | Partial unique active-draft index                       | One succeeds; loser receives scoped `active_draft_exists`; no overwrite  |
| Save vs save             | Scoped revision compare-and-swap                        | Stale mutation rejected with authoritative reread                        |
| Save vs abandon          | Active status + scoped revision compare-and-swap        | One transition commits; other receives stale/abandoned recovery          |
| Stale editor             | `expectedDraftRevision`                                 | No last-write-wins                                                       |
| Stale reconciliation     | Exact current-source fingerprint + locked server reread | `stale_personnel_source`; no choices applied                             |
| CDI→CDD before submit    | Locked current Personnel eligibility read               | Mutation rejected; prior draft unchanged; recovery state returned        |
| Response loss replay     | Scoped command receipt                                  | Same logical mutation returns committed outcome without duplicate effect |
| Different payload replay | Canonical request fingerprint                           | `replay_conflict`; prior outcome not misrepresented                      |
| Any write failure        | Single db transaction                                   | Draft and receipt both rollback                                          |

CREATE/SAVE/RECONCILE/ABANDON each commit all authoritative state or preserve
the prior durable state. No operation writes Personnel. Every operation needing
both locks uses the canonical `PERSONNEL → FORMALITES DRAFT` order:

- CREATE locks/reads Personnel before draft insertion;
- SAVE/EDIT/RECONCILE lock/read Personnel before locking/reading draft;
- ABANDON does not revalidate eligibility and locks only the scoped draft.

The exact order and short transactions must be tested with real disposable
PostgreSQL, not inferred.

## Authorization and resource-boundary review

- READ/REOPEN: trusted authenticated OWNER membership, organization, active
  establishment, `formalites.read`, independent `personnel.employee.read`, full
  organization + establishment + employee + draft scope.
- CREATE/SAVE/RECONCILE/ABANDON: same trusted context with
  `formalites.manage`; independent Personnel READ whenever current source is
  consulted.
- No grant-map change. MANAGER/STAFF remain denied. Public/service/system role
  has no bypass.
- Browser `TenantContext`, organization, establishment, membership, role,
  permission, employeeId or draftId never creates authority.
- Missing establishment retains 400; permission denial retains 403; wrong-scope
  resources return fail-closed not-found without existence disclosure.

Assessment: no new tenancy/security boundary. Existing Formalités and Personnel
permission independence is preserved.

## UI interaction and QA review

The future implementation extends the existing employee-connected route only,
still behind the current development gate. It supports eligible/no-draft,
active/editable, saved/reopen, reconciliation-required, non-CDI recovery,
abandoned and stale/error states. Save is explicit; leaving does not autosave;
unsaved values survive recoverable errors but disappear on reload unless saved.
ABANDON requires reason and confirmation. Current Personnel and retained draft
values are labeled separately.

Generic fictional prototype, address/remuneration memory fields, navigation,
shell and existing Personnel handoff remain unchanged. No shared UI primitive
change is designed.

Later Browser QA is mandatory on the real authenticated local route with safe
synthetic persisted data at `1440`, `1024`, `768` and `390`. It must cover OWNER
and denied roles, wrong scope, all major lifecycle/reconciliation/recovery/
conflict/error states, reload persistence, keyboard traversal, focus recovery,
dirty-close protection, visible labels and no responsive overflow. No Browser
QA was run during Design.

## Migration and rollback review

- Additive future Drizzle migration only; no old migration edit.
- No prototype checkpoint or employee backfill; no automatic draft creation.
- Clean DB and DB with existing Personnel rows remain compatible.
- Route remains development-gated; production cutover is not authorized.
- Before data, defects are fixed through normal forward migration workflow.
- After data, rollback preserves tables/data and stops writers or rolls forward;
  no automatic drop/hard delete/restore loop.
- Production backup/PITR, restore privacy, final deletion policy and production
  migration remain separate operational/privacy gates. Their duration is not
  invented and does not alone block local/disposable persistence after this
  Sensitive Design is approved.

No schema or migration file exists in this change at this review point.

## Privacy/data inventory and N4 review

### Data stored by this slice

- employee reference plus organization/establishment scope;
- duplicate Formalités copies of seven Personnel facts in draft content and
  reconciled-source state;
- Personnel revision anchor;
- `probationChoice`;
- acknowledgement semantics encoded by reconciled-source state;
- `abandonmentReason` and lifecycle timestamps/status/revision;
- minimal command receipt actor/hash/fingerprint/outcome metadata.

### Sensitivity, purpose and minimization

The employee reference, identity, role, employment term, entry date, weekly
duration, probation preparation and free-text abandonment reason are personnel
data. Copies are purpose-limited to preparation, reopen, explicit
reconciliation, conflict recovery and duplicate-safe mutation. Duplication is
necessary for KEEP/REFRESH behavior but increases exposure and deletion work.

Minimization is bounded to the seven approved facts and one approved business
input. Address, remuneration, documents, generated content, IP, user-agent,
request dumps and Personnel history are excluded. Scalar typed columns prevent
accidental broad payload capture. Receipt does not contain raw reason/source
values.

Active and abandoned records remain readable while retained. The approved slice
contains no automatic expiry, purge, anonymization or user hard delete. It also
does not guarantee infinite retention. No Formalités-specific legal-hold source
is introduced, and Personnel's separate five-year rule is not inherited.

### N4 — approved bounded Product/privacy decision

Before: `BLOCKED_NEEDS_PRIVACY_DECISION`.

After current human decision: `RESOLVED_FOR_BOUNDED_SLICE`.

Approved behavior is exactly:

1. active DRAFT records are retained without a Product retention timer;
2. ABANDONED records are retained without a Product retention timer;
3. this capability provides no user hard delete;
4. this slice performs no automatic expiry, purge or anonymization;
5. command receipts are retained as bounded technical state without
   `expiresAt` or cleanup job;
6. absence of automatic deletion is not an infinite-retention guarantee;
7. no legal-hold/mandatory-retention override is introduced or inferred;
8. final retention/deletion, production backup/PITR/restore and production
   readiness require future separately approved decisions.

Explicitly **not inferred**: 90 days, one year, five years, Personnel retention
inheritance, keep forever, legal hold, automatic purge/anonymization, cleanup
job or backup retention duration.

This decision removes N4 as a blocker to local/development persistence after
Sensitive Design approval. Production remains `NOT_AUTHORIZED`.

## Test and QA obligations for a later approved plan

- Contract/domain: strict enums/literals, seven facts, nullable weekly minutes,
  comparison, KEEP/REFRESH and typed outcomes.
- Disposable DB: constraints, full tenant FKs, concurrent create, save/save,
  save/abandon, stale reconciliation, replay/fingerprint conflict, atomic
  rollback and clean/existing DB migration behavior.
- Real concurrency: commit-time CDI→CDD race in both serial orders; no skipped DB
  integration may count as PASS.
- Security: OWNER allow; MANAGER/STAFF/public/service/system-role denial; wrong
  organization/establishment/employee/draft; browser claims ignored.
- Isolation: assert Personnel facts, revision, history, receipts and register
  remain byte/row unchanged across every Formalités mutation.
- UI/component: lifecycle, reload, reconciliation, ineligible recovery,
  conflict/retry, pending/double submit, reason, dirty close, focus/keyboard.
- Regression: generic prototype, current development gate, Personnel source
  read and existing authorization suites unchanged.
- Final Browser QA: required real route and four widths listed above.

## Explicit exclusions

No Tasks, schema, migration, API or implementation is authorized or created.
No address, remuneration, legal template, generated document, PDF, signature,
DPAE/DSN, provider, Documents, AI/OCR, payroll, legal advice, Personnel
write-back/history, generic engine, MANAGER/STAFF grant, production enablement,
deployment, migration execution, cleanup/anonymization or legal-hold authority.

## Targeted revision verification

| Check                                                               | Exact result                                                                                                                               |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Spec requirements/scenarios                                         | 22 / 70                                                                                                                                    |
| Gate 2 embedded exact Spec                                          | MATCH after trimming only the final newline used by the enclosing code fence                                                               |
| Canonical lock-order search                                         | D7, D11, Risks, review table and test strategy consistently use `PERSONNEL → FORMALITES DRAFT`; no draft-before-Personnel sequence remains |
| `openspec validate formalites-persistent-draft-foundation --strict` | Exit 0; change is valid                                                                                                                    |
| Scoped Prettier for Spec, Design and both packets                   | Exit 0                                                                                                                                     |
| `pnpm docs:check`                                                   | Exit 0; 36 current documents consistent                                                                                                    |
| `pnpm architecture:check`                                           | Exit 0                                                                                                                                     |
| `pnpm -r --if-present typecheck`                                    | Exit 0; all invoked checks complete                                                                                                        |
| `pnpm format:check`                                                 | Exit 1; exactly 62 pre-existing unrelated files; no attributable file reported                                                             |

No Tasks, schema, migration, API, application/test implementation or production
operation was created or modified by this targeted revision.

## Human review decision

The current combined gate is approved:

- Review status: `APPROVED`
- Technical Design: `APPROVED`
- N4 Privacy/Data: `RESOLVED_FOR_BOUNDED_SLICE`
- Production retention/readiness: `DEFERRED / NOT_AUTHORIZED`
- Sensitive Design Gate: `APPROVED`

The change may proceed to Tasks and Implementation Plan only. Apply still
requires separate later authorization.
