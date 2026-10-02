# Knowledge Consolidation Review

Change: `pointage-authority-and-access-foundation`

Gate: `Post-archive Knowledge Consolidation`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-07T16:16:59.2843975+02:00`

Approval scope: exact regenerated proposal SHA-256
`6c4e9e47b7cdf7257924b62673e82de36b8045a7c57ce1b6bbd91405823a01d9`
and byte manifest SHA-256
`5b6288188fe0c7b98c8758da6760e6460eaf0ba228f5a4c7b16204e8da109b51`;
four recorded target hashes and ten ordered decoded byte substitutions only.

Created: `2026-09-07T15:12:27.0842740+02:00`

Schema: `yuta-spec-driven`

Knowledge consolidation: `UPDATE_REQUIRED`

Regenerated: `2026-09-07T16:08:04.9325535+02:00`

Previous approved proposal disposition: `INVALIDATED_BY_ARTIFACT_CHANGE` —
exact-preimage mismatch; file hashes did not drift.

Application: `APPLIED_EXACTLY` — 4 targets, 10 substitutions

Workflow status: `DONE`

RELEASE_FOLLOW_UP: `NOT_REQUIRED`

Production enablement: `NOT_AUTHORIZED`

## Branch B preflight và regeneration

Current user đã approve proposal cũ với đúng bốn files và mười byte replacements.
Branch B xác nhận Gate 3 APPROVED, finish COMPLETED, archive hiện hữu và không
có active change. Proposal hash và cả bốn target hashes vẫn khớp bảng dưới.

Tuy nhiên kiểm tra không normalize newline cho kết quả:

| Replacement         | Expected exact Before count | Observed count | Cause                              |
| ------------------- | --------------------------- | -------------- | ---------------------------------- |
| 5                   | 1                           | 0              | Proposal LF; Personnel target CRLF |
| 8                   | 1                           | 0              | Proposal LF; Personnel target CRLF |
| 10                  | 1                           | 0              | Proposal LF; Personnel target CRLF |
| 1, 2, 3, 4, 6, 7, 9 | 1 each                      | 1 each         | Exact match                        |

Đây là lỗi trong kiểm tra preimage của packet trước: phép so sánh cũ đã normalize
CRLF thành LF. Không có bằng chứng target hoặc proposal bị sửa kể từ review.
Theo current-user STOP condition, không Apply, không tự điều chỉnh replacement
và không ghi DONE. Approval cũ không đủ cho byte representation mới.

Proposal đã được regenerate trong cùng path, giữ nguyên nội dung của mười
replacements và bổ sung manifest chứa exact Before/After UTF-8 bytes bằng Base64.
CRLF được chỉ rõ cho Product Knowledge và Personnel; LF cho Registry và Current
State. Mười Before trong manifest mới đều match đúng một lần bằng byte comparison.
Mọi byte ngoài vùng thay thế phải được giữ nguyên khi một lượt Apply mới được duyệt.

Riêng replacements 1 và 3 cố ý giữ Before bên trong After; kiểm tra post-Apply
phải so sánh vị trí và toàn bộ output, không yêu cầu xóa heading/Personnel row
được proposal giữ lại. Không target nào đã thay đổi trong lượt này.

## Why an update is required

The approved Pointage foundation is now implemented, its two delta Specs are
synced and strictly validated as normative main Specs, and the change is
archived. Current Product Knowledge, Module Registry, Current State and
Personnel knowledge still classify all Pointage scope as a planned placeholder,
`NOT_STARTED`, with no implemented Personnel relationship or approved owner.

Those statements now conflict with completed evidence. The exact proposal
separates the approved and implemented server-only authority/access foundation
from the still-unapproved and unimplemented usable clocking workflow. It does
not describe the placeholder page as implemented and does not clear any
production or legal/privacy gate.

## Completed-change evidence

- Gate 3: `APPROVED` by explicit current-user instruction;
- reviewed Gate 3 pre-approval SHA-256:
  `339ffba42c4dd44b6eec17435424e1d683cdb5c726600dc92b0f7dac996cc723`;
- Technical Implementation Compliance: `PASS`;
- VERIFY: `PASS`;
- QA: `NOT_APPLICABLE`, explicitly accepted;
- completed Tasks: `22/22`;
- canonical implementation diff SHA-256:
  `e161c46680bc4ab0f86e383a5263736b7a8200fb6485b6e9c0f70cecfc2af0fe`;
- synced `authorization/pointage` main Spec SHA-256:
  `871df9f0cbc1cbabd19ef79a9226baeae4e7ed57c852eeb2f601feaac22bdd2b`;
- synced `pointage/authority-foundation` main Spec SHA-256:
  `6c57de01c3c83502253df8ea59410c3d3e4f453fef64d7700ad775b487b10cdb`;
- strict main-spec validation: `PASS — 15 passed, 0 failed`;
- archived change:
  `openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation`;
- archived authorization delta SHA-256:
  `55b550bb449d2fd2c342bb91d328b82c8cc5658252fa460c02de39fcddfd4058`;
- archived authority-foundation delta SHA-256:
  `3d5dce5f6ed6149655cd29f2fc046b39801e2e3a86376b57abf78cee942cb613`;
- semantic normalized delta-to-main comparisons after scoped formatting:
  `MATCH — 2/2`.

## Exact proposed update

The exact ten byte-replacement operations are attached at
[`04-knowledge-consolidation-proposal.md`](04-knowledge-consolidation-proposal.md).

- proposal artifact SHA-256:
  `6c4e9e47b7cdf7257924b62673e82de36b8045a7c57ce1b6bbd91405823a01d9`;
- exact byte manifest:
  [`04-knowledge-consolidation-byte-replacements.json`](04-knowledge-consolidation-byte-replacements.json);
- manifest SHA-256:
  `5b6288188fe0c7b98c8758da6760e6460eaf0ba228f5a4c7b16204e8da109b51`;
- target files: `4`;
- exact replacements: `10`;
- each decoded manifest `Before` byte sequence matches exactly once: `PASS`;
- no canonical knowledge byte has been edited by this scan.

## Current target hashes

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <path>` with lowercase
output.

| Target path                         | Current SHA-256                                                    |
| ----------------------------------- | ------------------------------------------------------------------ |
| `docs/PRODUCT_KNOWLEDGE.md`         | `313f6edce6e4f4aced28eecf5cb44516fd67fbe6490cfc29ee32fce6dccfa368` |
| `docs/MODULE_REGISTRY.md`           | `dd18644278f44bdce8ce900ca0b6bb183551ea5f016c53d5c241f47dd7628942` |
| `docs/CURRENT_STATE.md`             | `25929ae727be862b7af4370aec1d881a135b609d6529a1deabaf98f3f23874f4` |
| `docs/features/personnel/README.md` | `5069acd7c3b5571072393c4337c7d31142a8aeb591f486d5daf4f978b129c7a8` |

These hashes include unrelated current checkout work where present. The
proposal uses exact unique preimages and does not normalize or attribute those
other changes. Any target-path, target-hash or proposal-hash drift invalidates
only this Knowledge Review packet and requires a fresh proposal; it does not
reopen Gate 3 or recreate the archived change.

## Authority classification per target

| Target                              | Proposed reconciliation                                                                                                             | Authority classification                                                                                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/PRODUCT_KNOWLEDGE.md`         | Add bounded routing for the two normative Pointage Specs, implementation evidence and exclusions.                                   | Product Knowledge routing/current evidence only; no new behavior, permission or readiness decision.                                                                                               |
| `docs/MODULE_REGISTRY.md`           | Split the stale broad Pointage row into implemented foundation and future usable-workflow rows.                                     | Records the already approved P1–P7 foundation and verified implementation; lifecycle values apply only to each explicitly bounded row. Production remains `BLOCKED`; workflow remains unresolved. |
| `docs/CURRENT_STATE.md`             | Add the server-only foundation to the repository snapshot and clarify that the page/workflow remains a placeholder.                 | Broad implemented-state routing; no claim of deployment, page completion or production enablement.                                                                                                |
| `docs/features/personnel/README.md` | Replace “no integration” wording with the exact read-only dossier/employment-period relationship and keep future workflow separate. | Personnel Product Knowledge reconciliation; Personnel ownership, permissions and state remain unchanged.                                                                                          |

## Safeguards

The proposal does not:

- approve or implement usable clock-in/out, Pointage UI/browser transport or raw
  attendance evidence;
- add Planning, Today, HS/HC, absence, jours fériés, avantages en nature,
  payroll/TESE/PDF or POS/Site Agent/offline/sync integration;
- change Personnel ownership, lifecycle facts or permissions;
- change Pointage operation grants or credential behavior;
- rewrite either normative main Spec;
- add a trusted production client-address provider;
- enable an environment, deploy, migrate production data or promote production
  readiness; or
- resolve exact retention, deletion/anonymization, legal hold,
  backup-retention, employee notice or detailed audit visibility.

The proposed `APPROVED` and `IMPLEMENTED` values are bounded strictly to the
foundation already approved at Gate 1 and verified at Gate 3. The separately
named usable workflow remains `NOT_STARTED`, `NOT_ENABLED` and `NEEDS REVIEW`.

## Sources inspected

- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/CURRENT_STATE.md`
- `docs/features/personnel/README.md`
- `docs/features/identity-access/README.md`
- `docs/features/today/README.md`
- `docs/architecture/AUTHENTICATION.md`
- `docs/architecture/TENANCY.md`
- `docs/architecture/DATABASE_BOUNDARIES.md`
- `docs/operations/PRODUCTION_READINESS.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/decisions/ADR-003-database-ownership-boundaries.md`
- `docs/decisions/ADR-005-today-operational-steering.md`
- `openspec/specs/authorization/pointage/spec.md`
- `openspec/specs/pointage/authority-foundation/spec.md`
- `openspec/changes/archive/2026-09-07-pointage-authority-and-access-foundation/`
- `docs/reviews/pointage-authority-and-access-foundation/03-final-review.md`
- `docs/reviews/pointage-authority-and-access-foundation/verify-evidence.md`
- `docs/reviews/pointage-authority-and-access-foundation/qa-assessment.md`

## Historical pre-approval scan validation — preimage claim corrected above

- `openspec validate --specs --strict --json`: PASS — 15/15 main Specs;
- `openspec validate --archived --strict --json`: PASS — 15/15 archived
  changes;
- semantic normalized archived-delta/main-spec comparison: MATCH — 2/2;
- scoped Prettier over both main Specs and all finish/Knowledge Review
  artifacts: PASS;
- `pnpm docs:check`: PASS — 36 current documents;
- `pnpm architecture:check`: PASS;
- exact proposal preimages: PASS — 10/10 each matches once; and
- canonical knowledge targets changed by this scan: NONE.

The first scoped formatting check found only the two newly synced main Specs.
Formatting was confined to those two sync outputs, their semantics were
recompared as MATCH, final hashes above were recomputed, and strict main/archive
validation passed again. No knowledge target, code, implementation artifact or
archived delta was formatted.

## Regeneration checks — 2026-09-07

- Proposal cũ và 4/4 target hashes: MATCH; không có hash drift.
- Literal Before cũ: 7/10 match; 5/8/10 không match do LF/CRLF.
- Byte-array search trên manifest mới: 10/10 Before match đúng một lần; encoded
  byte lengths đúng. Không normalize newline trong phép kiểm tra này.
- 4/4 canonical target hashes sau regeneration giữ nguyên.
- 15 main Spec files, 7 archive files (gồm metadata) và 6 source files được
  snapshot trước regeneration: 28/28 giữ nguyên path/hash. Đây là preservation
  check theo yêu cầu current user, không reopen Gate 3 hoặc chạy Branch A.
- `pnpm docs:check`: exit 0, 36 current documents.
- `pnpm architecture:check`: exit 0.
- Scoped `pnpm exec prettier --check` trên bốn targets: FAIL trên
  `docs/PRODUCT_KNOWLEDGE.md` và `docs/features/personnel/README.md`, hai files
  vẫn đúng hash trước Apply. Không formatter write trên target nào.
- Formatting của review artifacts được xử lý riêng; mọi target remains
  NOT_APPLIED. Full tests/build/typecheck và global formatting không rerun cho
  preflight bị dừng này; không thay code, schema hoặc runtime.
- Exact applied knowledge diff: EMPTY — 0 target files, 0 replacements applied.
- Post-Apply After verification: NOT_RUN — Apply chưa diễn ra.

Do preimage failure và target formatting debt chưa được xử lý trong authority
hiện tại, không ghi `KNOWLEDGE CONSOLIDATION: COMPLETE` hoặc `DONE`.

## Required review decision — historical regenerated proposal

Approve only if the exact four-target, ten-replacement proposal accurately
reconciles the completed foundation while preserving the unresolved usable
workflow and every production/legal/privacy blocker.

Review mới phải bao gồm cả proposal hash và manifest hash nêu trên. Không
formatter write hoặc manual adaptation được phép trên bốn targets. Nếu current
byte hashes/preimages thay đổi trước Apply, dừng để regenerate lại. Gate 3,
normative Specs và archive giữ nguyên; không sync/archive lần nữa.

Review status: `APPROVED`

## Approved byte-exact application — 2026-09-07

This section is the current outcome. Earlier regeneration and NOT_APPLIED
statements above describe the historical stopped attempt, not this application.

Approval recorded: `2026-09-07T16:16:59.2843975+02:00`.

Applied: `2026-09-07T16:17:50.6638648+02:00`.

Application: `APPLIED_EXACTLY` — four approved targets, ten approved
substitutions in manifest order.

### Pre-write and complete-output proof

- Current-user proposal SHA-256: `6c4e9e47b7cdf7257924b62673e82de36b8045a7c57ce1b6bbd91405823a01d9` — MATCH.
- Current-user byte manifest SHA-256: `5b6288188fe0c7b98c8758da6760e6460eaf0ba228f5a4c7b16204e8da109b51` — MATCH.
- Exact four-target path set and all four recorded pre-Apply hashes: MATCH.
- Every decoded Before byte sequence matched exactly once in its original
  target and at its sequential application step: PASS — 10/10.
- Base64 decoding and byte-array substitution performed without newline,
  Unicode or whitespace normalization. Latin-1 ordinal indexing was used only
  as a reversible one-byte search index; replacement data remained byte arrays.
- Expected complete outputs were computed before writing, then recomputed
  independently from the manifest and compared with that snapshot.
- Each complete written file compared byte-for-byte with its expected in-memory
  result: PASS — 4/4. All bytes outside the ten regions are unchanged.
- Every After sequence matched at its exact final zero-based byte offset:
  PASS — 10/10.
- Before sequences 1 and 3 remain once, intentionally inside their After
  regions. For the other eight operations, Before occurs zero times.
- Proposal and manifest remain immutable approved inputs; their historical
  AWAITING_HUMAN_REVIEW labels are not changed by this approval record.
- A fresh pre-Apply Git inventory covered 2,503 tracked/untracked files.
  Existing dirty Current State and Registry content was part of the approved
  preimage, not attributed to this change or overwritten.

### Final target SHA-256

| Applied path                        | Final SHA-256                                                      | Complete byte comparison |
| ----------------------------------- | ------------------------------------------------------------------ | ------------------------ |
| `docs/PRODUCT_KNOWLEDGE.md`         | `c66e1cc6696de61759b4090d51d798e043c1c914f677e21ab65d8f739f787d11` | PASS                     |
| `docs/MODULE_REGISTRY.md`           | `880bda34f9bbcae3ac361669d0a3d175e7ec510b636f374e93e5f5df882165d0` | PASS                     |
| `docs/CURRENT_STATE.md`             | `ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b` | PASS                     |
| `docs/features/personnel/README.md` | `7fce8f42319534032e67c8b98b91ad6e7384362cfad039c5063ed66aee45439b` | PASS                     |

### Exact replacement locations

Offsets refer to final target bytes. Each ID maps to its unchanged path,
beforeBase64 and afterBase64 in the approved manifest. Together, that manifest,
these offsets and the four full-output hashes record the exact applied byte
diff; no fuzzy patch interpretation is involved.

| Manifest ID | Final byte offset | After byte length | Exact After comparison | Remaining Before count     |
| ----------- | ----------------- | ----------------- | ---------------------- | -------------------------- |
| 1           | 13956             | 1067              | PASS                   | 1 (intentionally retained) |
| 2           | 52953             | 4601              | PASS                   | 0                          |
| 3           | 9962              | 1266              | PASS                   | 1 (intentionally retained) |
| 4           | 15782             | 338               | PASS                   | 0                          |
| 5           | 3424              | 305               | PASS                   | 0                          |
| 6           | 6118              | 478               | PASS                   | 0                          |
| 7           | 9907              | 598               | PASS                   | 0                          |
| 8           | 11725             | 395               | PASS                   | 0                          |
| 9           | 16718             | 405               | PASS                   | 0                          |
| 10          | 19612             | 297               | PASS                   | 0                          |

### Exact knowledge diff review

The change-relative diff compares fresh pre-Apply snapshots with the complete
verified outputs, not Git HEAD. Its exact path set is the four approved targets
above; there are no added, removed or unrelated knowledge paths.

Command, run against the snapshot's before/after directories:

```text
git -c core.autocrlf=false diff --no-index --binary --no-ext-diff --unified=0 -- before after
```

Exit 1 is Git's expected "differences present" result, not a validation failure.

Raw zero-context Git diff SHA-256:
`499b67654ae64a4f3b9bb8852ffeedd3bc280d6ee9387eccf3b0c7308c612243`.

The following readable display uses the review document's line endings.
Canonical target byte endings were not normalized; the immutable Base64
manifest and complete-output proof above remain the byte authority.

```diff
diff --git a/before/docs/CURRENT_STATE.md b/after/docs/CURRENT_STATE.md
index 5481df0..2d82a6a 100644
--- a/before/docs/CURRENT_STATE.md
+++ b/after/docs/CURRENT_STATE.md
@@ -60,0 +61 @@ claims.
+| Pointage foundation           | A cloud/online-only server foundation for dedicated employee credentials, scoped OWNER/MANAGER authority, STAFF denial, distributed protection and Personnel employment-period eligibility is approved and implemented. The route stays a placeholder; no browser transport, usable clocking or raw attendance evidence exists.        | [Pointage authority spec](../openspec/specs/pointage/authority-foundation/spec.md), [Pointage authorization spec](../openspec/specs/authorization/pointage/spec.md), [Authentication](architecture/AUTHENTICATION.md), and [Module Registry](MODULE_REGISTRY.md).           |
@@ -91,3 +92,5 @@ persistence, environment enablement, or readiness.
-- **Planned placeholders:** Planning, Pointage, Tâches du jour, Technical
-  Sheets, and the additional planned surfaces below are not implemented merely
-  because a route or navigation item exists.
+- **Planned placeholders:** Planning, the usable Pointage clocking workflow,
+  Tâches du jour, Technical Sheets, and the additional planned surfaces below
+  are not implemented merely because a route or navigation item exists. The
+  Pointage authority/access foundation is server-only and does not change the
+  route's placeholder state.
diff --git a/before/docs/MODULE_REGISTRY.md b/after/docs/MODULE_REGISTRY.md
index e3d4725..ee209c5 100644
--- a/before/docs/MODULE_REGISTRY.md
+++ b/after/docs/MODULE_REGISTRY.md
@@ -92 +92,2 @@ scoped only to the exact capability stated in the row.
-| Backoffice        | Pointage                   | Planned time-tracking capability behind a shared planned-page state                                                                                                                      | [Current State](CURRENT_STATE.md)                                                                                                                                                                                                                   | [`apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx`](<../apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx>) is a placeholder, not capability implementation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `apps/backoffice`                                  | `N/A`                                                                                                                                                | Pointage <-> Personnel / Today                                                                                                                                                         | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                | `NEEDS REVIEW` — planned wording does not resolve the Product Decision status                                                                                                                                                  |
+| Backoffice        | Pointage foundation        | Cloud/online-only credential, trusted scope, dedicated authorization and Personnel employment-period eligibility foundation; no usable clocking or raw evidence                          | [Pointage authority spec](../openspec/specs/pointage/authority-foundation/spec.md), [Pointage authorization spec](../openspec/specs/authorization/pointage/spec.md), [Authentication](architecture/AUTHENTICATION.md)                               | [`packages/auth/src/pointage-credential.ts`](../packages/auth/src/pointage-credential.ts), [`packages/db-cloud/src/pointage-repository.ts`](../packages/db-cloud/src/pointage-repository.ts), [`apps/backoffice/src/server/pointage`](../apps/backoffice/src/server/pointage)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `apps/backoffice`                                  | `packages/db-cloud` for credential versions, distributed limits and minimized security audit; no raw-evidence store                                  | Pointage -> Personnel lifecycle reference / Shared Authorization / Tenancy; no Today, Planning, payroll or local integration                                                           | `APPROVED`       | `IMPLEMENTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — trusted address provenance and legal/privacy gates                | `OK` — bounded foundation only; no UI, browser transport, usable clocking workflow or production enablement                                                                                                                    |
+| Backoffice        | Pointage usable workflow   | Future employee/manager UI, browser transport, raw actual-work evidence capture, correction/derived views and downstream integrations                                                    | [Current State](CURRENT_STATE.md), [Pointage foundation specs](../openspec/specs/pointage/authority-foundation/spec.md)                                                                                                                             | [`apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx`](<../apps/backoffice/src/app/(authenticated)/equipe/pointage/page.tsx>) remains a placeholder; no usable workflow or raw-evidence implementation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `apps/backoffice` (future review)                  | Pointage must own raw actual-work evidence; exact executable persistence remains unimplemented                                                       | Pointage <-> Personnel / Today / Planning / payroll only through separately approved integrations                                                                                      | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                | `NEEDS REVIEW` — foundation approval does not approve the usable workflow or integrations                                                                                                                                      |
diff --git a/before/docs/PRODUCT_KNOWLEDGE.md b/after/docs/PRODUCT_KNOWLEDGE.md
index 07ba75c..7c1a6fa 100644
--- a/before/docs/PRODUCT_KNOWLEDGE.md
+++ b/after/docs/PRODUCT_KNOWLEDGE.md
@@ -244,0 +245,19 @@ unimplemented or separately gated.
+### Pointage authority and access foundation
+
+- Precise normative ownership and behavioral boundaries:
+  `openspec/specs/pointage/authority-foundation/spec.md`
+- Precise normative credential and authorization behavior:
+  `openspec/specs/authorization/pointage/spec.md`
+- Current implementation: portable primitives in `packages/auth`, additive
+  credential/rate-limit/security-audit persistence in `packages/db-cloud`, and
+  server-only composition in `apps/backoffice/src/server/pointage`
+- Personnel relationship: `docs/features/personnel/README.md`
+- Security architecture: `docs/architecture/AUTHENTICATION.md`
+
+Only the cloud/online authority and access foundation is approved and
+implemented. The visible Pointage route remains a placeholder. There is no
+browser transport, usable clock-in/out workflow, raw attendance evidence,
+Planning/Today/payroll integration, POS/Site Agent/offline/sync behavior or
+production enablement. Legal/privacy gates and trusted production client-address
+provenance remain blocked.
+
diff --git a/before/docs/features/personnel/README.md b/after/docs/features/personnel/README.md
index 80b94d7..df4ce47 100644
--- a/before/docs/features/personnel/README.md
+++ b/after/docs/features/personnel/README.md
@@ -69,3 +69,4 @@ generic fictional prototype and existing grant mapping remain unchanged.
-- Planning, Pointage, and Tâches du jour are planned surfaces with unresolved
-  Product Decision status. Their placeholders do not establish an implemented
-  capability or data owner.
+- Planning, the usable Pointage clocking workflow, and Tâches du jour remain
+  planned surfaces with unresolved Product Decision status. Pointage now has a
+  separately approved and implemented server-only authority/access foundation;
+  that foundation does not make the placeholder a usable workflow.
@@ -87 +88,2 @@ generic fictional prototype and existing grant mapping remain unchanged.
-| Pointage                               | Planned related surface; no implemented Personnel or Today integration.                                                                                                                           |
+| Pointage authority/access foundation   | Implemented cloud server foundation reads the scoped Personnel dossier and employment period without transferring ownership or writing Personnel state; no Today integration.                     |
+| Future usable Pointage workflow        | Planned related surface; no browser transport, raw attendance evidence, clock-in/out UI, correction flow or downstream integration is implemented.                                                |
@@ -107 +109,2 @@ status remains unresolved until a dedicated registry assignment is approved.
-| Pointage                               | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — planned wording does not resolve Product Decision status |
+| Pointage authority/access foundation   | `APPROVED`       | `IMPLEMENTED`  | `NOT_ENABLED`      | `BLOCKED`            | `BLOCKED` — trusted production client-address provenance and legal/privacy gates              | `OK` — bounded foundation only; no usable clocking or readiness promotion |
+| Future usable Pointage workflow        | `—`              | `NOT_STARTED`  | `NOT_ENABLED`      | `NOT_ASSESSED`       | `NOT_ASSESSED`                                                                                | `NEEDS REVIEW` — foundation approval does not approve the workflow        |
@@ -125,4 +128,5 @@ status remains unresolved until a dedicated registry assignment is approved.
-- Planning, Pointage, and Tâches du jour may relate to Personnel, but their
-  placeholders neither duplicate Personnel identity nor establish an
-  integration. Any future integration must preserve the approved Personnel
-  source rather than silently creating a second employee identity source.
+- The Pointage authority/access foundation reads only trusted scoped Personnel
+  dossier and employment-period data. Personnel remains the canonical employee
+  and lifecycle source; Pointage credentials and contexts do not create a
+  second employee identity. Planning, the usable Pointage workflow and Tâches du
+  jour remain separately reviewable, and no Today integration is implemented.
@@ -156 +160 @@ or storage scope is not authority.
-| Pointage              | Relationship to Personnel and Today is recorded, but no integration is implemented.                                                                                        | Future data direction and owner need review; no current source may be inferred from the placeholder.                                                                                                         |
+| Pointage              | The server-only foundation resolves trusted scoped dossier/employment period; no Personnel write, Today integration, browser workflow or raw evidence exists.              | Personnel owns employee dossier/lifecycle; Pointage owns its credentials/authority and future raw actual-work evidence under the normative foundation specs.                                                 |
@@ -185,2 +189,4 @@ or storage scope is not authority.
-- Planning, Pointage, and Tâches du jour are not implemented Personnel
-  capabilities merely because their routes or navigation entries exist.
+- Planning, the usable Pointage workflow, and Tâches du jour are not implemented
+  Personnel capabilities merely because their routes or navigation entries
+  exist. The Pointage authority/access foundation remains a separate server-only
+  prerequisite, not a usable Personnel or Pointage page.
```

### Preservation evidence

- The immediate post-Apply scan found all 2,497 files outside the four targets
  and two permitted review packets unchanged. At the final preservation scan,
  2,496 remained byte-identical and one unrelated review had changed
  concurrently, as recorded below. No new repository path was introduced.
- All 15 normative main Spec files and all 7 files in the recorded Pointage
  archive, including metadata, are unchanged. This is preservation evidence,
  not a rerun of Branch A or fresh sync/archive.
- All 18 scoped implementation/evidence-source files below are unchanged.
  In particular, the existing unrelated Formalités export in
  `packages/auth/src/index.ts` remains byte-for-byte intact.
- The only additional repository edits are bounded approval, validation and
  completion evidence in this packet and `03-final-review.md`.
- Snapshot/recovery evidence is local and temporary, outside the repository:
  `C:/Users/Tam/AppData/Local/Temp/yuta-pointage-knowledge-9e8872ca2d7146c8806cbfba6ba4d81e`.
  The approved manifest, exact offsets and final hashes in this packet provide
  the durable applied-diff record.

Implementation preservation aggregate SHA-256:
`716ef69bb5f6ed4e974062fff5be18c07d586e331f169e594232f10ac7047b21`.

Aggregate format: sort paths ascending; join each `path<TAB>lowercase-sha256`
with LF, no trailing LF; hash UTF-8 bytes.

| Preserved implementation/evidence source                           | Unchanged SHA-256                                                  |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/architecture/AUTHENTICATION.md`                              | `c92736abbc1192b18a06923e5ead5ed7416c4610f8c0dbd8ae639bc65cfdf4c8` |
| `packages/auth/src/index.ts`                                       | `b5a8cb1f5bf9c87db3974a08948a8cd98418e42f3761ae228df6fd5e1642c634` |
| `packages/auth/src/pointage-credential.ts`                         | `8b294113e7a97fb83e5acff5df96224ed4c18d73d60c46a63abf824c37195fa1` |
| `packages/auth/test/pointage-credential.test.ts`                   | `6ea66dbb73a82f8586575c15f049be3ee0832987888045a593b982001c1479a0` |
| `packages/db-cloud/drizzle/0019_pointage_authority_foundation.sql` | `143b6d1e47f92336b4359c4c85a17487ead97416afbbe2c0fd0b99880c0e7056` |
| `packages/db-cloud/drizzle/meta/0019_snapshot.json`                | `3ab5d679d0802a3ba6bb3faf25f3cbfda10d282064eb202485a8029ab4f7cb49` |
| `packages/db-cloud/drizzle/meta/_journal.json`                     | `855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665` |
| `packages/db-cloud/src/index.ts`                                   | `78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1` |
| `packages/db-cloud/src/schema/index.ts`                            | `934314b0cc16f81e050447869259554ff50366eefb5fe3c5d86be03113966264` |
| `packages/db-cloud/src/schema/pointage.ts`                         | `19ee38a3153883067eac3fd62fcfe5668968e60f5c43cef71c29f993972429e6` |
| `packages/db-cloud/src/pointage-repository.ts`                     | `4cfcfc4f5287590fde3ff44062a97efe1bd256771774495ae0ce91ab488034d8` |
| `packages/db-cloud/test/pointage-schema.test.ts`                   | `e1026fbfc7adef0773a916ed230d302005c09c711c61503159799f35f5e1b090` |
| `packages/db-cloud/test/pointage-repository.integration.test.ts`   | `4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1` |
| `apps/backoffice/src/server/pointage/authorization.ts`             | `c33a530483f76f29065729834e07b5d4512ee54255765645bece9cef8c87cc34` |
| `apps/backoffice/src/server/pointage/service.ts`                   | `1e34ca92770148dbbaa9582a793de425163e89cd067d6d90e317b1fb2e2747ae` |
| `apps/backoffice/src/server/pointage/index.ts`                     | `5a17ce9a793561f26e7eca9c62f7835925d54d9eba61074951d58871dd910133` |
| `apps/backoffice/test/pointage-foundation.test.ts`                 | `e3f091057b9c0f21bfd2ed872b9e435fc4330ae9239ffa8e5bbd51534ed3729b` |
| `apps/backoffice/test/pointage-foundation-inventory.test.ts`       | `1a8d4d2f026d6444de11f1afc5d47e38a4098eedbd0059e330cb78d102242daa` |

### Validation and scoped formatting interpretation

- `pnpm docs:check`: PASS, exit 0 — 36 current documents.
- `pnpm architecture:check`: PASS, exit 0.
- `pnpm exec prettier --check docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md docs/CURRENT_STATE.md docs/features/personnel/README.md`:
  exit 1; diagnostic warnings for Product Knowledge and Personnel.
- The same default check on the exact pre-Apply snapshots, using
  `--config .prettierrc.json`, also returned exit 1 on those same two files.
- Read-only Prettier API comparison confirmed the default output differs
  **only** by CRLF-to-LF conversion in those two files. There is no other
  formatting difference in any target. Product Knowledge retains 369 CRLF
  endings and Personnel retains 244; neither contains lone LF.
  Registry retains 167 LF endings and Current State retains 169, with no CRLF.
- `pnpm exec prettier --check --end-of-line auto docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md docs/CURRENT_STATE.md docs/features/personnel/README.md`:
  PASS, exit 0 — all four files match Prettier exactly with the approved
  per-file line endings preserved.
- The scoped newline-preserving invocation implements the explicit
  current-user requirement to preserve CRLF/LF; it does not change repository
  configuration, suppress other formatting checks or authorize a formatter
  write. The default diagnostic is retained honestly above, not relabeled PASS.
- No formatter wrote any target. No code, migration, database, runtime,
  deployment, sync or archive operation ran.
- The final six-file check also covers the two permitted review packets.
  Its first pass flagged only this updated Knowledge Review packet. Formatting
  is confined to this evidence packet with
  `pnpm exec prettier --write --end-of-line auto docs/reviews/pointage-authority-and-access-foundation/04-knowledge-consolidation-review.md`;
  none of the four approved canonical targets is included in that write command.
- Full typecheck, cloud/local tests, builds, global formatting and repeated
  OpenSpec sync/archive validation were not run: this is Branch B's exact
  documentation-only update with unchanged implementation, Specs and archive.
  The skill requires only the applicable scoped documentation checks here.

### Final preservation scan and unrelated concurrent work

Final scoped preservation verification: `PASS`, recorded at
`2026-09-07T16:22:33.5133947+02:00`.

The four complete target byte arrays and all ten After positions still match
the precomputed results. Proposal/manifest hashes remain unchanged. All 15 main
Spec files, 7 archived change files and 18 scoped implementation sources remain
byte-identical. Exactly six paths changed in this operation's scope: four
approved targets and the two permitted review packets.

An unrelated concurrent change was observed in
`docs/reviews/formalites-template-legal-review-governance/01-analysis-review.md`:

- pre-Apply snapshot SHA-256:
  `6d0e0bf3f12b336925089fbd2c2e4d88a868365bd8467fc55020dab6ed6657e0`;
- final observed SHA-256:
  `4309dc5b44bd421c8868b67616b78a2c7c1e9b06292776ae156c93dd3653cf42`.

This operation did not write or revert that file. It is excluded from the
Pointage knowledge diff, not treated as a new approved target. Its observed
drift does not affect the proposal, manifest, targets, Specs, archive or
implementation preservation proof. The complete repository snapshot is not
claimed unchanged.

Final scoped six-file Prettier check with `--end-of-line auto`: PASS, exit 0.
The four canonical targets and both review packets are included. The final
docs and architecture checks also passed with exit 0 after completion evidence
was added. Default LF-only diagnostics remain recorded above.

### Completion and preserved gates

Completed: `2026-09-07T16:22:33.5133947+02:00`

KNOWLEDGE CONSOLIDATION: COMPLETE

Workflow status: DONE

RELEASE_FOLLOW_UP: NOT_REQUIRED

Production enablement: NOT_AUTHORIZED

The foundation's approved implemented-state reconciliation does not promote the
usable Pointage workflow or production readiness. Exact retention,
deletion/anonymization, legal hold, backup-retention interaction, employee notice
wording, detailed audit visibility and trusted production client-address
provenance remain unresolved blockers. No provider was added, no code or
normative Spec changed, and no sync/archive/deploy/enable action was repeated.
