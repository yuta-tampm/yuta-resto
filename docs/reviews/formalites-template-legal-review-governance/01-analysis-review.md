Change: formalites-template-legal-review-governance
Gate: 1 — Product / authority review
Review status: APPROVED
Created: 2026-09-07T15:13:31+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — CROSS_MODULE / AUTHORITY_SENSITIVE

# Analysis Review

## Integrity-only rebaseline approval — 2026-09-07T14:36:24Z

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T14:36:24Z
Rebaseline type: INTEGRITY_ONLY
Current review status: APPROVED

Control Tower đã approve chính xác ba current hashes trong historical drift
record bên dưới, với cause Verified Pointage Knowledge Consolidation only.
Đã recompute cả ba trước edit: 3/3 khớp approval; mười baseline pairs khác
không đổi. Active protected baseline table dưới đây chỉ thay ba hashes đã
được duyệt. Proposal, Analysis, metadata và mọi semantic artifact giữ nguyên.
Không sửa canonical Knowledge hoặc Pointage files.

Packet trước rebaseline:
`ecaad3b2a970c48421a3ea634e27b8274d336302875ebf832d5b3fccb2f68348`.
Historical invalidation được giữ làm provenance, không còn là current blocker;
historical hash comparisons không phải active baseline. Gate 1 REMAINS APPROVED;
Gate 2 và Gate 2b REMAIN APPROVED theo cùng current-user decision. Downstream
packet references sẽ được refresh theo thứ tự Gate 1 → Gate 2 → Gate 2b sau
scoped formatting; không đổi reviewed Proposal/Analysis/Specs/Design.

Authorization chỉ cho integrity records và Tasks / Implementation Plan /
embedded Technical Implementation Contracts. Apply và production NOT AUTHORIZED.
Không inference rằng rebaseline hoặc planning cho phép Sync/Archive hoặc
lifecycle/readiness promotion.

## Tasks resume integrity blocker — 2026-09-07T14:21:22Z

Current review status: `INVALIDATED_BY_ARTIFACT_CHANGE`. This section supersedes
the historical approval/status records below for progression purposes, without
changing their provenance or the original expected hash table.

The current user approved Gate 2b and requested Tasks / Implementation Plan /
embedded Technical Implementation Contracts only, with no Apply. Resume integrity
found three changed protected sources in this Gate 1 packet. The skill requires
exact path/hash equality across all earlier packets; the Gate 2b approval cannot
be consumed against a silently replaced source baseline.

| Protected source                  | Recorded SHA-256                                                   | Current SHA-256                                                    |
| --------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| docs/CURRENT_STATE.md             | `25929ae727be862b7af4370aec1d881a135b609d6529a1deabaf98f3f23874f4` | `ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b` |
| docs/MODULE_REGISTRY.md           | `dd18644278f44bdce8ce900ca0b6bb183551ea5f016c53d5c241f47dd7628942` | `880bda34f9bbcae3ac361669d0a3d175e7ec510b636f374e93e5f5df882165d0` |
| docs/features/personnel/README.md | `5069acd7c3b5571072393c4337c7d31142a8aeb591f486d5daf4f978b129c7a8` | `7fce8f42319534032e67c8b98b91ad6e7384362cfad039c5063ed66aee45439b` |

At resume, 10/13 Gate 1 path/hash pairs matched; Gate 2 matched 5/5 and Gate 2b
matched 7/7. Metadata, Proposal, Analysis, delta Specs and Design remain unchanged.
The pre-invalidation packet hashes were:

- Gate 1: `6d0e0bf3f12b336925089fbd2c2e4d88a868365bd8467fc55020dab6ed6657e0`.
- Gate 2: `ca50e70078d565bc6618e2220bfd22daf99dbaaf2a8853cc9c1429636b864f6f`.
- Gate 2b: `607d46e24ef979b01432677b62f9595b31d4580cb371116d65650710898dea84`.

### Exact drift attribution

Read-only inspection identifies the Pointage Knowledge Consolidation byte manifest
at `docs/reviews/pointage-authority-and-access-foundation/04-knowledge-consolidation-byte-replacements.json`,
SHA-256 `5b6288188fe0c7b98c8758da6760e6460eaf0ba228f5a4c7b16204e8da109b51`.
Its corresponding review records approval of that exact manifest. This is
provenance, not authority to rebaseline this change or a claim that the separate
Pointage workflow is complete.

A read-only Node.js byte comparison loaded each target with `fs.readFileSync`,
decoded the manifest's `afterBase64` / `beforeBase64` buffers, required exactly one
occurrence of each after-image, then reversed replacements in descending manifest
order in memory only. SHA-256 via `crypto.createHash('sha256')` of the reconstructed
bytes matched every recorded preimage: 4/4 manifest targets and 10/10 unique
replacements. For the three protected sources above, those preimages also match
this Gate 1 packet exactly. No files were reverted or written by this comparison.

The exact drift is the Pointage foundation/current-state split and related
Personnel integration wording represented by manifest replacements 2–10. No
additional byte drift exists in these three sources relative to that manifest.
The fourth manifest target, `docs/PRODUCT_KNOWLEDGE.md`, is unrelated provenance,
not an additional protected target or an authorized edit in this change.

### Stop and next decision

Only this review packet is updated to record the integrity failure. Gate 2 and
Gate 2b packets are preserved as historical evidence; their earlier Gate 1 packet
reference is now superseded by this invalidation record and cannot authorize
progression. No semantic re-review of unchanged Proposal/Analysis/Specs/Design is
being inferred, and no current target hash replaces an approved baseline yet.

Required Control Tower decision: review and explicitly accept the three exact
current source hashes above as Pointage-only Knowledge evolution; authorize
integrity-only packet rebaselining while preserving the unchanged governance
artifacts and semantic gate decisions, then resume Tasks-only planning. Recheck
all bytes again before consuming that decision.

Tasks / Implementation Plan / Technical Implementation Contracts: `NOT_CREATED`.
Apply: `NOT_AUTHORIZED`. No canonical source, normative main spec, implementation,
lifecycle value, Sync, Archive or production state is changed by this task.
Production: `NOT_AUTHORIZED`.

### Checks on the blocked resume

- `pnpm docs:check`: exit 0; 36 current documents passed.
- `pnpm architecture:check`: exit 0.
- `pnpm -r --if-present typecheck`: exit 0; recursive typechecks completed.
- `pnpm exec openspec validate formalites-template-legal-review-governance --strict`:
  exit 0; change valid.
- `pnpm exec prettier --check docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`:
  exit 0.
- `git -c core.autocrlf=false diff --no-index --check -- NUL docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`:
  no whitespace diagnostics; exit 1 denotes the nonempty file versus `NUL`.
- Global `pnpm format:check`, tests and builds were not rerun for this
  integrity-only stop; earlier command results remain historical evidence only.

Passing checks do not restore approval or authorize Tasks/Apply.

## Request and bounded scope

Control Tower xác nhận các Product/reviewer/outcome/qualification/recorder/publisher/evidence-linkage decisions đã RESOLVED và cho phép bắt đầu OpenSpec. Retention duration DEFERRED, không chặn governance-only change; persistence OUT OF SCOPE; Sensitive Design Gate REQUIRED.

Packet này chuyển những quyết định đã chốt thành exact Proposal/Analysis để review. Không coi start authorization là Gate 1 artifact approval, completed legal opinion hoặc production authorization.

Chỉ new capability `formalites/template-legal-review-governance`: reviewer acceptance, minimum review evidence, outcomes, exact-version qualification, independent external reviewer, atomic publication evidence linkage, invalidation/supersession, bounded wording và privacy/audit prerequisites. Existing five-operation authorization contract và tenant boundaries không đổi.

## Provenance and artifact inventory

- Repository: `D:/working/yuta/yuta-resto`.
- Baseline HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
- Root discovery: nearest repository; không chọn external store.
- Creation command: `openspec new change "formalites-template-legal-review-governance"`, không truyền schema override.
- CLI creation banner/planningHome báo default `spec-driven`, nhưng completion, `.openspec.yaml`, status `schemaName` và artifact instructions đều xác nhận actual pinned `yuta-spec-driven`. Không có schema fallback hoặc config modification.
- Trước creation, exact change/review paths chưa tồn tại; không có artifact được adopt hoặc overwrite.
- Sau Gate 1: metadata, Proposal, Analysis và packet này được tạo mới. Specs/Design/Tasks chưa tồn tại.
- Không thực hiện Apply, sync, archive hoặc deployment.

Baseline `git status --short`:

```text
 M apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-selector-panel.tsx
 M apps/backoffice/src/components/backoffice/backoffice-frame.tsx
 M docs/CURRENT_STATE.md
 M docs/MODULE_REGISTRY.md
 M docs/architecture/AUTHENTICATION.md
 M docs/architecture/IDENTITY_AND_MEMBERSHIP.md
 M docs/architecture/OVERVIEW.md
 M docs/features/identity-access/README.md
 M packages/auth/src/index.ts
 M packages/auth/src/session.ts
 M packages/db-cloud/drizzle/meta/_journal.json
 M packages/db-cloud/src/index.ts
 M packages/db-cloud/src/schema/index.ts
 M packages/ui/package.json
 M packages/ui/src/button.tsx
 M pnpm-lock.yaml
?? apps/backoffice/src/app/(authenticated)/parametres/integrations/_components/google-location-submit-button.tsx
?? apps/backoffice/src/components/backoffice/logout-submit-button.tsx
?? apps/backoffice/src/server/pointage/
?? apps/backoffice/test/general-information-form.test.tsx
?? apps/backoffice/test/google-location-submit-button.test.tsx
?? apps/backoffice/test/logout-submit-button.test.tsx
?? apps/backoffice/test/pointage-foundation-inventory.test.ts
?? apps/backoffice/test/pointage-foundation.test.ts
?? docs/reviews/async-interaction-feedback-foundation/
?? docs/reviews/platform-admin-formalites-template-authority-foundation/
?? docs/reviews/pointage-authority-and-access-foundation/
?? openspec/changes/archive/2026-09-06-platform-admin-formalites-template-authority-foundation/
?? openspec/changes/async-interaction-feedback-foundation/
?? openspec/changes/pointage-authority-and-access-foundation/
?? openspec/specs/authorization/platform-admin-formalites-template-administration/
?? packages/auth/src/formalites-template-system-authorization.ts
?? packages/auth/src/pointage-credential.ts
?? packages/auth/test/formalites-template-system-authorization.test.ts
?? packages/auth/test/pointage-credential.test.ts
?? packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql
?? packages/db-cloud/drizzle/meta/0019_snapshot.json
?? packages/db-cloud/src/pointage-repository.ts
?? packages/db-cloud/src/schema/pointage.ts
?? packages/db-cloud/test/pointage-repository.integration.test.ts
?? packages/db-cloud/test/pointage-schema.test.ts
?? packages/ui/test/
```

Snapshot SHA-256 được capture cho 2490 existing tracked/untracked non-ignored files bằng Node `fs.readFileSync` + `crypto.createHash('sha256')` sau inventory `git ls-files --cached --others --exclude-standard -z`. Generated ignored Next outputs có thể được regeneration bởi approved bootstrap check; không là source edits.

Byte comparison trong turn phát hiện concurrent changes ngoài scope: `docs/reviews/pointage-authority-and-access-foundation/03-final-review.md` thay đổi, hai Pointage main specs mới xuất hiện (`openspec/specs/authorization/pointage/spec.md`, `openspec/specs/pointage/authority-foundation/spec.md`). Đây không phải thao tác của change này; giữ nguyên và không claim repository-wide zero drift. Các source hashes bảo vệ dưới đây giữ nguyên. Không suy ra approval hoặc sync authority cho Pointage từ observations này.

Final preservation scan cũng ghi nhận Pointage active-change paths được chuyển sang `openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/` bởi công việc đồng thời. Không có thao tác archive nào được thực hiện bởi change Formalités này. Toàn bộ protected Formalités/authority hashes bên dưới và exact new Proposal/Analysis hashes vẫn match; không restore hoặc sửa các Pointage paths.

## Reviewed artifact hashes

Hash exact file bytes, lowercase hexadecimal SHA-256. Metadata được hash như supplementary scope evidence. Proposal và Analysis là Gate 1 reviewed artifact set.

| Path                                                                          | SHA-256                                                            |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/formalites-template-legal-review-governance/.openspec.yaml` | `84963d5bb5659efe782a9e644fd11bc8fbedb5b4dc250c9d6f8122a029d3fa6e` |
| `openspec/changes/formalites-template-legal-review-governance/analysis.md`    | `1cf8a62d41994d8a33ce56dfc03659a5a609f7b42e2a19acd7365fe2f5b9db1d` |
| `openspec/changes/formalites-template-legal-review-governance/proposal.md`    | `53bc674bb634576506bc50cb94bb38ab9a939939f6cc2c7fc8695647c45f6d7e` |

Reproduction:

```powershell
$artifactPaths = @(
  'openspec/changes/formalites-template-legal-review-governance/.openspec.yaml',
  'openspec/changes/formalites-template-legal-review-governance/analysis.md',
  'openspec/changes/formalites-template-legal-review-governance/proposal.md'
)
$artifactPaths | Sort-Object | ForEach-Object {
  [PSCustomObject]@{
    Path = $_
    SHA256 = (Get-FileHash -LiteralPath $_ -Algorithm SHA256).Hash.ToLowerInvariant()
  }
}
```

Original capture used Node `createHash('sha256').update(fs.readFileSync(path)).digest('hex')`; byte hashes equivalent, không normalize newline/encoding.

## Authorities consulted and protected baseline

Authority routing và consulted sources đầy đủ nằm trong exact Analysis bên dưới. User quyết định bounded Product intent; existing normative authorization spec kiểm soát grants/system-only isolation; inspected code/tests chỉ là implementation evidence; Production Readiness kiểm soát legal/privacy/deployment gates.

| Protected path                                                                           | Unchanged baseline SHA-256                                         |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/CURRENT_STATE.md`                                                                  | `ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b` |
| `docs/MODULE_REGISTRY.md`                                                                | `880bda34f9bbcae3ac361669d0a3d175e7ec510b636f374e93e5f5df882165d0` |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md`                                           | `515e3ab673914db49e01aeda1bda7c05f7053628435107566df8fdeb19ca1578` |
| `docs/architecture/OVERVIEW.md`                                                          | `ec83802f61facff522007346ca0ec2111698dea6ac81211cf19289bd944824c5` |
| `docs/features/identity-access/README.md`                                                | `6df71086f496151b4fa4f8e286a6e3db83233db140a9d154ff4c85adaa653e36` |
| `docs/features/personnel/README.md`                                                      | `7fce8f42319534032e67c8b98b91ad6e7384362cfad039c5063ed66aee45439b` |
| `openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2` |
| `packages/auth/src/formalites-template-system-authorization.ts`                          | `816b912b7cd4b9408d50f4ae4d01832499e87b452661143cac6dbcb0886cace2` |
| `packages/auth/src/session.ts`                                                           | `278d08effc39d90cfe147bd45182a6e80d76ff5641f94d3d1bc302fd8063f5a1` |
| `packages/auth/test/formalites-template-system-authorization.test.ts`                    | `93911ec279fa61f20f2f9af3b0fdb6cc591d1ba88fd6eb1ae2f344f45c52de89` |

## Conflicts, unknowns and Product questions

- Requirement-level CONFLICT: NONE trong bounded request đã resolved.
- Outstanding Product/authority question trước Specs: NONE. Review exact artifact wording vẫn cần Gate 1 approval.
- Retention duration/legal basis/private storage/rights/operational controls: deferred trước corresponding processing/persistence; không được thực hiện trong governance-only change.
- Actual reviewer engagement/qualification evidence và actual template review: future instance prerequisites; chưa tồn tại bằng chứng phê duyệt legal template trong packet.
- Unsigned legal-review brief không cung cấp current approval; outcome labels trong brief không override resolved Product semantics.
- Independent evidence CRUD, new role/principal/operation, tenant session changes, runtime/persistence hoặc unsafe qualification/wording sẽ STOP về Control Tower.
- Sensitive Design Gate bắt buộc sau Design và trước Tasks/Apply.
- Canonical Knowledge reconciliation chỉ sau Gate 3 → finish → authorized Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation.

## Validation evidence

### pnpm docs:check

Exit code: `0`.

```text
$ node ./scripts/check-documentation-consistency.mjs
Documentation consistency check passed (36 current documents).
```

### pnpm architecture:check

Exit code: `0`.

```text
$ node ./scripts/check-import-boundaries.mjs
Architecture check passed: runtime imports, database URLs, client boundaries, and migration baselines are valid.
```

### pnpm typegen:next

Exit code: `0`.

```text
$ node scripts/generate-next-types.mjs
[typegen:next] apps/backoffice: strict Next 16.2.9 start
Generating route types...
✓ Types generated successfully
[typegen:next] apps/backoffice: exit 0; 4/4 fresh outputs validated
[typegen:next] apps/web: strict Next 16.2.9 start
Generating route types...
✓ Types generated successfully
[typegen:next] apps/web: exit 0; 4/4 fresh outputs validated
[typegen:next] apps/booking-web: strict Next 16.2.9 start
Generating route types...
✓ Types generated successfully
[typegen:next] apps/booking-web: exit 0; 4/4 fresh outputs validated
[typegen:next] apps/feedback-web: strict Next 16.2.9 start
Generating route types...
✓ Types generated successfully
[typegen:next] apps/feedback-web: exit 0; 4/4 fresh outputs validated
[typegen:next] apps/yuta-pos: strict Next 16.2.9 start
Generating route types...
✓ Types generated successfully
[typegen:next] apps/yuta-pos: exit 0; 4/4 fresh outputs validated
[typegen:next] apps/yuta-display: strict Next 16.2.9 start
Generating route types...
✓ Types generated successfully
[typegen:next] apps/yuta-display: exit 0; 4/4 fresh outputs validated
```

### pnpm -r --if-present typecheck

Exit code: `0`.

```text
Scope: 15 of 16 workspace projects
packages/contracts typecheck$ tsc --noEmit
packages/core typecheck$ tsc --noEmit
packages/db-pos typecheck$ tsc --noEmit
packages/tenant typecheck$ tsc --noEmit
packages/tenant typecheck: Done
packages/core typecheck: Done
packages/db-pos typecheck: Done
packages/contracts typecheck: Done
apps/site-agent typecheck$ tsc --noEmit
apps/yuta-display typecheck$ tsc --noEmit
apps/yuta-pos typecheck$ tsc --noEmit
packages/auth typecheck$ tsc --noEmit
packages/auth typecheck: Done
packages/booking typecheck$ tsc --noEmit
packages/booking typecheck: Done
apps/yuta-display typecheck: Done
apps/yuta-pos typecheck: Done
apps/site-agent typecheck: Done
packages/db-cloud typecheck$ tsc --noEmit
packages/db-cloud typecheck: Done
apps/backoffice typecheck$ tsc --noEmit
apps/booking-web typecheck$ tsc --noEmit
apps/web typecheck$ tsc --noEmit
apps/feedback-web typecheck$ tsc --noEmit
apps/feedback-web typecheck: Done
apps/web typecheck: Done
apps/booking-web typecheck: Done
apps/backoffice typecheck: Done
```

### pnpm exec prettier --check openspec/changes/formalites-template-legal-review-governance/proposal.md openspec/changes/formalites-template-legal-review-governance/analysis.md

Exit code: `0`.

```text
Checking formatting...
All matched files use Prettier code style!
```

### openspec validate formalites-template-legal-review-governance --strict

Exit code: `1`.

```text
Change 'formalites-template-legal-review-governance' has issues
✗ [ERROR] file: Change must have at least one delta. No deltas found. Ensure your change has a specs/ directory with capability folders (e.g. specs/http-server/spec.md) containing .md files that use delta headers (## ADDED/MODIFIED/REMOVED/RENAMED Requirements) and that each requirement includes at least one "#### Scenario:" block. If this change intentionally modifies no specs (pure refactor, tooling, docs), set "skip_specs: true" in the change's .openspec.yaml instead. Tip: run "openspec change show <change-id> --json --deltas-only" to inspect parsed deltas.
Next steps:
  - Ensure change has deltas in specs/: use headers ## ADDED/MODIFIED/REMOVED/RENAMED Requirements
  - Each requirement MUST include at least one #### Scenario: block
  - Debug parsed deltas: openspec show formalites-template-legal-review-governance --json --deltas-only
```

### pnpm format:check

Exit code: `1`.

```text
Code style issues found in 67 files. All warning paths existed before this turn and retain baseline SHA-256; exact list follows below.
```

Strict OpenSpec exit 1 là expected current gate limitation: chưa có delta vì phải dừng trước Specs. Không ghi PASS, không thêm placeholder delta và không dùng `skip_specs: true` để vượt validation. Full strict change validation phải PASS sau authorized Specs trước Gate 2.

Global formatting exit 1 là pre-existing/out-of-scope result. Tất cả 67 warning files có trong baseline và exact bytes không đổi; không repository-wide formatter write hoặc cleanup. Scoped new Proposal/Analysis check exit 0.

```text
.agents/skills/openspec-apply-change/SKILL.md
.agents/skills/openspec-archive-change/SKILL.md
.agents/skills/openspec-continue-change/SKILL.md
.agents/skills/openspec-explore/SKILL.md
.agents/skills/openspec-new-change/SKILL.md
.agents/skills/openspec-propose/SKILL.md
.agents/skills/openspec-sync-specs/SKILL.md
.agents/skills/openspec-update-change/SKILL.md
.agents/skills/openspec-verify-change/SKILL.md
docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md
docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md
docs/features/establishment/general-information/README.md
docs/features/establishment/README.md
docs/features/personnel/README.md
docs/PRODUCT_KNOWLEDGE.md
docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md
docs/reviews/async-interaction-feedback-foundation/02-specs-review.md
docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md
docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md
docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md
docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md
docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md
docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md
docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md
docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md
docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md
docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md
docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md
docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md
docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md
docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md
docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md
docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md
docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md
docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md
docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md
docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md
openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md
openspec/changes/async-interaction-feedback-foundation/analysis.md
openspec/schemas/yuta-spec-driven/templates/design.md
openspec/schemas/yuta-spec-driven/templates/proposal.md
openspec/schemas/yuta-spec-driven/templates/spec.md
openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md
openspec/specs/restaurant-knowledge/validated-knowledge/spec.md
```

Auth tests, cloud/local tests, builds và Browser QA: NOT RUN ở Gate 1 vì không thay runtime/code. Inspected tests không được ghi là executed PASS. Recursive typecheck, docs và architecture đã thực sự chạy trên current shared checkout, không phải clean-checkout/prerequisite revalidation.

Final validation sau packet creation:

- Scoped Prettier cho `.openspec.yaml`, Proposal, Analysis và packet: PASS, exit 0.
- Exact embedded Proposal/Analysis body so với source files: PASS; hai hashes trong packet match exact file bytes.
- `pnpm docs:check`: rerun PASS, exit 0, 36 current documents.
- `pnpm architecture:check`: rerun PASS, exit 0.
- `git -c core.autocrlf=false diff --no-index --check -- NUL <path>` cho bốn new files: không có whitespace diagnostics; no-index exit 1 biểu thị file khác empty baseline, không được ghi là command exit 0. Aggregate checker PASS, exit 0.
- Gate scope: không có `specs/`, `design.md` hoặc `tasks.md`.
- Initial verification harness tìm four-backtick fences trong khi Prettier chuẩn hóa thành three-backtick fences; sửa reader rồi exact content comparison PASS, không sửa artifact content. Git line-ending conversion warnings được loại khỏi whitespace check bằng read-only `core.autocrlf=false` per command, không đổi repository config.

Không dùng tracked `git diff` một mình để bỏ sót new untracked artifacts.

## Exact proposal content

UTF-8 body bên dưới giữ nguyên nội dung artifact; hash trong table áp dụng file bytes bên ngoài fences.

```markdown
## Why

Formalités đã có authority foundation cho năm global template operations, nhưng chưa có contract bền vững xác định legal review nào đủ điều kiện qualify một exact template version. Control Tower đã chốt Discovery/Shaping và các Product/authority decisions; cần ghi nhận governance semantics trước khi xem xét template persistence hoặc generation.

## What Changes

- Định nghĩa reviewer external/manual có danh tính, tư cách tư vấn pháp luật Pháp và năng lực French employment law được kiểm chứng; không yêu cầu YUTA identity.
- Định nghĩa minimum evidence gắn với exact immutable template/version, content checksum, reviewer, ngày review, outcome, applicability envelope, conditions và external evidence reference.
- Chốt ba outcomes `APPROVED`, `CHANGES_REQUIRED`, `REJECTED`; conditions chỉ nằm trong `APPROVED` khi đã thuộc envelope và không yêu cầu sửa version.
- Định nghĩa qualification cho declared use: exact version, complete accepted review/evidence, matching envelope, satisfied conditions và authorized publication; authorization allow đơn lẻ không tạo qualification.
- Định nghĩa recorder/publisher attribution: external reviewer khác publisher; recorder có thể là publisher. Evidence linkage chỉ là prerequisite của future atomic publication qua `formalites.template.publish`, không tạo standalone evidence CRUD.
- Định nghĩa invalidation/supersession, giới hạn legal wording, ba audit families riêng biệt và privacy/retention prerequisites trước persistence.
- Giữ Sensitive Design Gate bắt buộc. Retention duration được defer và không chặn governance-only change.

## Capabilities

### New Capabilities

- `formalites/template-legal-review-governance`: behavioral contract cho human legal review, exact-version qualification và internal publication prerequisites của GLOBAL YUTA Formalités templates; chỉ định nghĩa governance, chưa thực thi lifecycle.

### Modified Capabilities

Không có. `authorization/platform-admin-formalites-template-administration` tiếp tục sở hữu đúng năm grants và trusted system-only boundary; `authorization/formalites` và `formalites/persistent-draft-foundation` giữ nguyên.

## Impact

Classification: `CROSS_MODULE / AUTHORITY_SENSITIVE`.

Formalités là semantic owner; Platform Admin là future internal administration runtime/access boundary; Identity / Access tiếp tục sở hữu authorization foundation. GLOBAL template không thuộc organization hoặc establishment; restaurant memberships không có global authority.

Phạm vi hiện tại là Proposal/Analysis và Gate 1 review packet. Sau review, change sẽ định nghĩa governance delta spec và Design/Tasks phù hợp với phạm vi không có runtime. Không dùng `skip_specs: true` vì governance này bổ sung observable acceptance/rejection requirements dù chưa triển khai software behavior.

Không tạo hoặc sửa application/package code, system roles/principals/grants, tenant authorization, Backoffice sessions, `apps/platform-admin`, template content/schema/migration/repository/API/UI, legal-evidence store, provider integration, generation/PDF/signature/Documents handoff hoặc production configuration. Không thay đổi draft/persistence behavior hiện hữu, không thêm restaurant customization.

Canonical Product Knowledge, `CURRENT_STATE`, Module Registry, architecture summaries và lifecycle/readiness không được cập nhật trong Apply/Verify. Reconciliation chỉ sau Gate 3 → finish → authorized Sync → Validate Main Specs → Archive, qua reviewed Knowledge Consolidation. Change này không chứng minh bất kỳ template nào đã được legal review hoặc qualified và không đưa ra legal-compliance guarantee.
```

## Exact analysis content

```markdown
# Change Analysis

## Scope and Change Type

Change: `formalites-template-legal-review-governance`.

Classification: `CROSS_MODULE / AUTHORITY_SENSITIVE`; governance-only behavioral contract cho GLOBAL YUTA Formalités legal templates. Đây là bước định nghĩa desired acceptance/rejection behavior trước persistence hoặc lifecycle implementation. Không có runtime implementation trong scope.

Control Tower đã xác nhận Product decisions, reviewer authority, outcomes, qualification, recorder/publisher boundary và evidence linkage `RESOLVED`; cho phép bắt đầu OpenSpec. Retention duration `DEFERRED`, persistence `OUT OF SCOPE`, Sensitive Design Gate `REQUIRED`. Quyết định này cho phép soạn Proposal/Analysis; không tự phê duyệt artifact Gate 1 chưa được review.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current-state routing](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md).
- [Activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [YUTA run skill](../../../.agents/skills/yuta-run-change/SKILL.md), [workflow gate/knowledge protocol](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [configuration](../../config.yaml).
- [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [Identity / Access Product Knowledge](../../../docs/features/identity-access/README.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Identity and Membership architecture](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md), [normative system authorization](../../specs/authorization/platform-admin-formalites-template-administration/spec.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md).
- [Auth package instructions](../../../packages/auth/AGENTS.md), [operation/grant implementation](../../../packages/auth/src/formalites-template-system-authorization.ts), [trusted auth service](../../../packages/auth/src/session.ts), [authorization tests](../../../packages/auth/test/formalites-template-system-authorization.test.ts), [existing tenant-owned draft schema](../../../packages/db-cloud/src/schema/formalites.ts).
- [Draft legal-review brief](../../../docs/ui/pages/backoffice-equipe-formalites-personnel/LEGAL_REVIEW_BRIEF.md): supporting discovery evidence; không phải completed review hoặc approved template.
- Current-user Control Tower decision ngày 2026-09-07 và Discovery/Shaping trong cùng conversation: provenance cho bounded Product decisions được chuyển thành reviewable artifacts; không phải completed legal opinion hay main-spec promotion.

## Authority and Product Decision

### Ownership and authorization

Formalités sở hữu template semantics. Platform Admin là future internal administration runtime/access boundary; không mở general-purpose Platform Admin. GLOBAL YUTA Formalités template không thuộc organization hoặc establishment; restaurant OWNER/MANAGER/STAFF là future consumers, không có global template authority.

Existing authority contract giữ đúng năm operations:

- `formalites.template.read`;
- `formalites.template.draft.manage`;
- `formalites.template.review.submit`;
- `formalites.template.publish`;
- `formalites.template.retire`.

`YUTA_ADMIN` chỉ nhận explicit grant cho từng operation; `YUTA_SUPPORT` nhận none. Không wildcard, prefix matching, implication, role hierarchy, caller policy hoặc principal mới. Trusted active internal user và exact system-operation grant là prerequisite; tenant membership và `TenantContext` không cần thiết và không cung cấp global authority. System context không cho phép truy cập tenant resources.

### Reviewer authority

Reviewer là external/manual, không cần YUTA identity. Một cá nhân chịu trách nhiệm cho opinion phải xác định được; tên firm/entity đơn lẻ không đủ.

Theo quyết định đã chốt sau Discovery, default acceptance là avocat đăng ký tại barreau Pháp, hoặc luật sư EU được phép tư vấn pháp luật Pháp, có năng lực French employment law phù hợp. Juriste khác chỉ được chấp nhận khi có documented professional/legal authority cho đúng loại tư vấn và evidence về năng lực phù hợp; nhãn “juriste qualifié” đơn lẻ không đủ. Đây là acceptance policy của YUTA, không phải kết luận rằng chỉ một loại nghề nghiệp được pháp luật cho phép tư vấn.

Evidence về reviewer gồm identity, firm/entity nếu có, professional capacity, registration hoặc equivalent authority reference, jurisdiction, competence, engagement/matter reference và dated review confirmation. Thiếu căn cứ authority hoặc không xác định được người chịu trách nhiệm thì review không đủ điều kiện qualification. `YUTA_ADMIN` không sở hữu hoặc tạo legal opinion.

### Minimum review evidence

Evidence phải xác định exact immutable template/version và canonical-content checksum kèm thuật toán; review date; reviewer identity/authority/qualification references; outcome; reviewed applicability envelope; binding conditions/reservations/exclusions; effective date nếu liên quan; legal/conventional reference snapshot khi reviewer yêu cầu; external deliverable/confirmation reference; evidence received/recorded time; internal recorder identity; supersedes reference nếu có.

Envelope bao gồm jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions và effective-date constraints liên quan. Không coi thiếu thông tin là không có điều kiện. Evidence phải cho phép đối chiếu opinion thực sự nói về đúng version và envelope; checksum chỉ chứng minh content identity, không tự chứng minh reviewer identity hoặc authenticity của opinion.

Private evidence và professional personal data không được đưa vào Git. Public repository chỉ giữ governance descriptions và opaque references; không private URL hoặc vault path. Không thu thập actual review hay real employee dossier trong change này. Không thiết kế schema hoặc checksum representation/canonicalization algorithm ở Analysis.

### Outcomes and qualification

Ba Product outcomes, chưa chọn enum implementation:

- `APPROVED`: reviewer chấp nhận exact version trong envelope đã khai báo. Conditions/reservations vẫn bắt buộc; chỉ phù hợp khi đã nằm trong envelope và không yêu cầu sửa version.
- `CHANGES_REQUIRED`: có thay đổi cần thực hiện; version chưa qualified. Thay content/envelope tạo version mới và cần review lại.
- `REJECTED`: không đủ điều kiện publication cho declared use.

Không có outcome riêng `APPROVED_WITH_CONDITIONS`; source opinion có điều kiện được đánh giá theo hai trường hợp trên, không được nội bộ sửa hoặc bỏ điều kiện để đổi kết quả.

Qualification cho declared use yêu cầu đồng thời exact immutable version/checksum, completed accepted external review với `APPROVED`, complete evidence, matching reviewed envelope, satisfied binding conditions, applicable effective dates, review chưa bị supersede/invalidate và successful authorized publication của version chưa retired. Authorization allow không phải publication completion, review completion hoặc qualification.

Qualification không bảo đảm contract cuối cùng compliant/valid, không xác minh employee/employer input, không thay legal advice cho trường hợp cụ thể và không mở rộng sang version/use khác.

### Recorder/publisher and evidence linkage

External reviewer khác internal publisher; recorder có thể là publisher. Không yêu cầu hai internal approvers hoặc ba người riêng biệt. Internal record phải phân biệt opinion author, internal recorder/publisher và external evidence source; không được sửa outcome, reservations hoặc envelope của reviewer.

`formalites.template.review.submit` chỉ đại diện submission, không cấp independent evidence CRUD. Evidence record/linkage là prerequisite bên trong future atomic publication action dùng `formalites.template.publish`. Chỉ mô tả semantic all-or-nothing boundary: không có successful publication khi required evidence không hợp lệ; không định nghĩa transaction, storage hoặc service implementation.

Nếu cần standalone evidence intake/edit/approval trước publication, đây là authority expansion ngoài scope và phải STOP về Control Tower. Existing authorization spec không bị sửa để ngầm cấp operation thứ sáu.

### Invalidation and supersession

Thay đổi content hoặc applicability tạo version mới; evidence cũ không tự qualify version mới. `CHANGES_REQUIRED`/`REJECTED` không qualify. Review mới supersede evidence cũ nhưng không ghi đè historical attribution. Review đã bị supersede/invalidate không tiếp tục hỗ trợ current qualification; evidence mới phải vượt đủ prerequisites, không tự tái-publication.

Legal/conventional change, effective-date boundary hoặc reviewer re-review trigger làm version không còn đủ điều kiện future use khi review không còn applicable. Không tự suy luận pháp luật còn hiệu lực từ publication cũ. Retirement khỏi future use giữ nguyên historical records; không sửa ngược generated artifacts. Không tạo thêm suspension operation hoặc lifecycle executor trong change này.

### Wording, privacy and audit

Wording đã bounded: “préparé à partir d’un modèle qualifié pour ce cas d’usage”, đi kèm qualifier: “La qualification concerne uniquement la version du modèle et le périmètre déclarés. Elle ne constitue ni un avis juridique sur la situation individuelle, ni une garantie de conformité du contrat final.” Đây là future wording contract; change không hiển thị claim trên UI hoặc tạo document.

Không dùng default claims “contrat conforme”, “juridiquement conforme”, “validé juridiquement” hoặc certification/guarantee. Completion của governance không chứng minh bất kỳ actual template nào đã qualified.

Reviewer/evidence có thể là personal/confidential data. Trước persistence phải có purpose/legal basis, minimization, recipients/access, private storage/confidentiality, active/archive separation, rights handling, legal hold, deletion/backup propagation và justified retention decision. Không định retention duration; việc defer chỉ áp dụng governance-only scope, không cho phép lưu evidence vô thời hạn hoặc bắt đầu processing.

Giữ riêng authorization/security audit (actor/operation/decision), external legal-review evidence (author/opinion/version/envelope), publication/retirement audit (internal actor/action/version/time/reason/evidence reference). Security logs không chứa legal content và không là proof của domain completion.

Không có external provider integration. Manual/private evidence handling là future permitted direction, không phải authorization gửi dữ liệu, ký hợp đồng, chọn provider hoặc mở vault trong turn này.

## Current Implemented State

Inspected checkout có five-operation authorization source và denial/grant tests; `session.ts` cung cấp minimized system context từ trusted user và exact operation. Existing tests mô tả denial cho missing/disabled user, missing/ungranted role, unknown operations và no lifecycle side effects; inspection không được ghi thành test PASS.

Prerequisite đã completed theo Control Tower và có normative main-spec file trong checkout. Một số prerequisite files vẫn untracked hoặc modified relative to HEAD, vì worktree dùng chung; không coi HEAD một mình là approved full implementation snapshot, không commit hoặc normalize chúng.

Không có global-template legal-review resource implementation được xác lập. Existing `formalites.ts` là tenant-owned personnel draft với organization/establishment/employee scope, không phải global template model. Development persistent draft đã tồn tại và được giữ nguyên. Không có actual accepted legal review/template evidence hoặc production deployment được xác minh trong analysis.

## Affected Boundaries

- Domain: Formalités sở hữu human-review/qualification semantics.
- Authorization: chỉ reference existing exact system operations; không thêm grant hoặc đổi security behavior.
- Runtime: Platform Admin vẫn reserved, chưa tạo application; Backoffice sessions không đổi.
- Data: không schema/migration/repository/API. `@yuta/db-cloud` là approved cloud persistence family cho later global Formalités data; không chọn model hoặc file provider trong change này.
- Tenancy: global templates tách organization/establishment resources; không `TenantContext` reuse, fabrication, merge hoặc fallback. Existing tenant Formalités permissions/draft không đổi.
- Legal/privacy: manual external author và private evidence prerequisites; no legal-compliance guarantee.
- External/local: không provider call; POS/Display không bị ảnh hưởng; không generation/PDF/signature/Documents handoff hoặc restaurant customization.

## Lifecycle Baseline

Giữ nguyên current bounded assignments trong Module Registry/Personnel Home:

- Generic Formalités walkthrough: `APPROVED / PROTOTYPE / DEVELOPMENT_ONLY / BLOCKED / BLOCKED`.
- Persistent CDI draft: `APPROVED / IMPLEMENTED / DEVELOPMENT_ONLY / BLOCKED / BLOCKED`.
- Future generation/template/signature lifecycle: `PROPOSED / NOT_STARTED / NOT_ENABLED / BLOCKED / BLOCKED`.
- Platform Admin app chưa started/enabled; chỉ portable five-operation foundation đã được approved/implemented trong scope riêng.

Thứ tự trên là Product Decision / Implementation / Environment / Production Readiness / External Dependency. Các giá trị tổng hợp không phải assignment mới cho governance candidate. Current-user Product decisions được ghi nhận theo bounded request; không chỉnh Registry hoặc tự nâng broad future lifecycle. `HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-RET-01`, `HR-AUDIT-01` và các production gates liên quan vẫn chưa được đóng bởi change này.

Canonical reconciliation chỉ sau Gate 3 → finish → authorized Sync → Validate Main Specs → Archive → reviewed Knowledge Consolidation. Không cập nhật canonical Knowledge, summaries hoặc lifecycle trong Apply/Verify; main-spec link chỉ được thêm sau successful authorized sync/validation và đúng Knowledge review scope.

## Requirement Readiness

Có thể soạn precise observable acceptance/rejection scenarios mà không chọn persistence hoặc auth redesign. Minimum scenario coverage cho Specs: unqualified/anonymous reviewer; missing/mismatched evidence/checksum/envelope; approved có binding conditions; changes required/rejected; unauthorized publisher/support/tenant-only actor; author/recorder attribution; review supersession; content/applicability version changes; publish allow without domain completion; misleading legal claims; private evidence/audit separation.

Chỉ capability `formalites/template-legal-review-governance` được phép tiến đến Specs sau Gate 1. Existing authorization main spec không có requirement modification. Không dùng `skip_specs: true`; governance semantics là behavioral delta dù chưa triển khai runtime.

## UI / UX Applicability

`UI_AFFECTING: NO`. `BROWSER_QA_REQUIRED: NO` cho bounded governance-only scope. Không sửa page pack/UI, tạo `ux-flow`, generation screen hoặc Platform Admin. Wording là contract cho future use, chưa có rendering. QA applicability và documentary verification sẽ được ghi bằng evidence ở giai đoạn thích hợp; không tuyên bố QA/VERIFY PASS tại Analysis.

## Conflicts and Unknowns

Requirement-level `CONFLICT`: không phát hiện trong scope đã được Control Tower chốt.

Draft brief dùng “avocat ou juriste qualifié” và bốn checkbox outcomes; đó là unsigned proposal, không cao hơn current resolved acceptance/outcome decisions. Không sửa brief hoặc tạo legal approval. Nếu sau này nhận actual opinion với conditions chưa biểu diễn được, fail closed và review lại thay vì tự map thành approved.

`NEEDS REVIEW` được defer ra ngoài change: actual reviewer engagement và qualification evidence cho từng review; actual template/content/applicability; exact retention duration/legal basis/storage/access operations; provider và production readiness. Chúng không chặn governance-only requirements nhưng phải được quyết định trước corresponding processing/runtime enablement.

Design-only: cách tài liệu hóa và kiểm chứng governance scenarios, exact content identity/canonicalization boundary khi thích hợp; không được dùng Design để chọn schema, API, runtime hoặc thực hiện evidence persistence. Sensitive Design Gate bắt buộc trước Tasks/Apply.

STOP nếu cần principal/role/operation mới, independent evidence CRUD, tenant-bound session redesign/bypass, persistence để giải quyết governance, Platform Admin implementation, unresolved reviewer/qualification semantics hoặc unsafe legal wording. Không mở lại unrelated tooling/prerequisite lifecycle.

## Analysis Conclusion

`READY_FOR_SPECS`.

Bounded governance scope đã rõ; không còn requirement-level Product/authority blocker. Gate 1 review phải kiểm tra exact Proposal/Analysis và artifact hashes trước khi cho phép Specs. Sensitive Design Gate tiếp tục bắt buộc. Không có Apply, Sync, Archive, actual legal approval hoặc production authorization ở bước hiện tại.
```

## Recommendation and next authorization

Analysis conclusion: `READY_FOR_SPECS`.

Recommendation: review và approve Gate 1 cho exact Proposal/Analysis hashes nếu nội dung khớp resolved Control Tower decisions. Approval tiếp theo chỉ cho phép Specs; không cho phép Design/Tasks/Apply hoặc legal publication.

Required next instruction: `Gate 1: APPROVED. Proceed to Specs only.`

Review status: `APPROVED`.
Sync authorization: `PENDING`.
Production: `NOT AUTHORIZED`.

## Gate 1 approval record

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T14:02:25.532Z

User decision: `Gate 1: APPROVED. Proceed to Specs only.`

Resume integrity: 13/13 recorded path/hash pairs match, including exact Proposal,
Analysis, metadata and ten protected sources. Reviewed packet before approval:
`3fd7e7b08335bacbe9294b05a96ab36daebf9fb434a6cd3aa17196026f5560fa`.
Artifact inventory contains only the expected metadata, Proposal and Analysis;
Specs, Design and Tasks were absent before this authorized progression.
Historical awaiting-review wording above describes the original Gate 1 packet;
this dated record is the current approval. No Proposal/Analysis content changed.
Authorization is bounded to Specs and Gate 2 evidence. Sensitive Design Gate
remains mandatory after Design; no Design, Tasks or implementation is authorized here.
