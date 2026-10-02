# Knowledge Consolidation Review — Formalités Legal Template Foundation

Change: formalites-legal-template-foundation  
Revision: 1  
Knowledge consolidation: COMPLETED  
Review status: APPROVED  
Apply authorization: AUTHORIZED_BY_CURRENT_USER  
Knowledge applied: YES  
Finish outcome: COMPLETED — archive and approved Knowledge Apply  
Workflow status: READY_FOR_DONE  
RELEASE_FOLLOW_UP: REQUIRED — separately gated before any future production use  
Production: NOT AUTHORIZED

## 1. Purpose and authority

Hồ sơ post-archive theo YUTA Workflow v3. Đề xuất chỉ hòa giải mô tả/routing đã lỗi thời vì bounded legal-template persistence foundation đã được triển khai và có main spec được sync/validate. Không suy ra Product Decision mới từ việc archive. Không áp dụng canonical Knowledge ở bước này.

Nguồn thẩm quyền: approved archived Proposal/Analysis/Specs/Design và completed Tasks, approved Gate 3, canonical main spec và dedicated implementation/schema/tests. Code là implementation evidence, không thay thế Product authority. Gate 1/2/2b/3 không được mở lại.

Exact proposed diff: [04-proposed-knowledge.diff](04-proposed-knowledge.diff).

Proposed diff SHA-256: `005a7b271be126522ba5d64e765ae68c1d46e835dc49857fd97c0aa8ffe3bc49`.

Separate review-packet SHA-256 is returned in the handoff; this packet does not hash itself.

## 2. Archive and normative evidence

Archive result: PASS. Official command, exit 0:

```text
pnpm exec openspec archive formalites-legal-template-foundation --skip-specs --yes --json
```

`--skip-specs` chỉ ngăn sync lặp lại sau khi exact main/delta equivalence đã được kiểm chứng. Không skip archive validation, không đổi `skip_specs` authority, không dùng `--no-validate`. Archive command returned `specsUpdated: false`.

Exact destination:

`D:/working/yuta/yuta-resto/openspec/changes/archive/2026-09-08-formalites-legal-template-foundation`

Active path `D:/working/yuta/yuta-resto/openspec/changes/formalites-legal-template-foundation`: ABSENT.
Archive destination: PRESENT; previously absent, unambiguous resolved local path.
All six moved files retain exact original bytes, including hidden metadata. No metadata exceptions or artifact reconstruction.

| Archived relative path                               | SHA-256                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `.openspec.yaml`                                     | `26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820` |
| `analysis.md`                                        | `c40e395a230518bb5ff2073204fb44ae083eee5a2b833898c58287d326d6a4c1` |
| `design.md`                                          | `d6db50dc5db2a64e29e8b8a5148011bda1b4bb46127101fdf188e3b7a3526cf5` |
| `proposal.md`                                        | `61d51cce2ddc75acd050ca0317865e3ddc60e38f41c8e7e2047e4d2a28a9951c` |
| `specs/formalites/legal-template-foundation/spec.md` | `b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418` |
| `tasks.md`                                           | `38c79ae3abf6a8a0547cf35acfc036276ed7d099a304e9b487f0712e0098d96b` |

Canonical main spec:
`openspec/specs/formalites/legal-template-foundation/spec.md`.

Main-spec SHA-256:
`5ae4931fd7f252312d650f2941bc9b97a7f45998612f670ed18dc7951e90b32a`.

Approved requirement/scenario equivalence: 14/14 requirements, 42/42 scenarios. Exact body unchanged by Archive. Authorization and legal-review governance main specs unchanged:

| Protected main spec                                                                      | SHA-256                                                            |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/specs/authorization/formalites/spec.md`                                        | `1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616` |
| `openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2` |
| `openspec/specs/formalites/template-legal-review-governance/spec.md`                     | `cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22` |

Pre-archive approved Gate 3 packet hash:
`961e35c4bce32fd62bcbb4abc4b2e0cadab8f981e55e660c3e5a2ad358c10855`.
Only bounded finish/archive/Knowledge status metadata and appended result evidence supersede that hash. Historical technical matrix, failed commands and approval evidence remain intact.

## 3. Exact candidate target set — five files

No canonical target has been changed. Each current raw SHA-256 is the preimage identity; postimage hashes represent the exact proposed text, not an applied state.

| Candidate target                    | Current / preimage SHA-256                                         | Expected postimage SHA-256                                         |
| ----------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/features/personnel/README.md` | `ac6e0a1baf36dd0839de1e9c8d36613f773852ec1644d21b9e3f867b29e6922a` | `33214c8a8699b4fffda22afd15d6360f8d4f90c4548adfe98955db772fccdd9d` |
| `docs/PRODUCT_KNOWLEDGE.md`         | `4249d0ef9caf3da7f6cc703eb182305f186e82bf14b820765918b00ce1ff19c9` | `7723a19aa5ffd7afe0c01d67d45ee352ea33dc0dec3892a2e6f423747e715c2d` |
| `docs/MODULE_REGISTRY.md`           | `5727e1caaf374dd9611a79e5447f68b781a826f61ccfa27b53ac9693607f5481` | `7205d06cd76e1e89f3fb0f755dbd295fe8191ec31ef97b8eafb8d69b06a1a5b3` |
| `docs/CURRENT_STATE.md`             | `ad5f744b3758079f1fb55024cf85f4185d32acf51a7488e210c41a2b418f993b` | `d279d0d2e76de9498d2266c742cc3408f9be471174f04cb5413fd62d3c80b105` |
| `docs/architecture/DATA_MODEL.md`   | `1022e45f8f56748e8ef9326deb6824c35b4ee0945016c69ae05ea754d04f999b` | `35a5abac7b714e900c1c185a84fd29bf1762d6994c9a1761237915bbc5d4926c` |

Preserve original bytes outside the exact hunks. Personnel README and PRODUCT_KNOWLEDGE retain CRLF; the other three targets retain LF. No BOM, whole-file normalization or formatter remediation is proposed. The unified diff is UTF-8/LF; its displayed context does not authorize line-ending changes to canonical files. Exact replacement preimages below plus target hashes bind the proposal.

## 4. Proposed edits, exact preimages and classification

The linked diff is the exact proposed replacement/addition authority. Unchanged neighboring headings and table rows are context only; no Pointage content, lifecycle row, readiness value or other scope may be edited.

### K1 — `docs/features/personnel/README.md`

Authority classification: `CURRENT_KNOWLEDGE_RECONCILIATION` — no Product Decision.

Required: owning Product Knowledge currently describes template governance and future templates but omits the implemented separate persistence foundation. Clarify template version versus generated contract and future lifecycle without rewriting lifecycle rows.

Exact replacement preimage (CRLF in current target; displayed below as text):

```text
### GLOBAL YUTA Formalités template governance
```

### K2 — `docs/PRODUCT_KNOWLEDGE.md`

Authority classification: `CURRENT_KNOWLEDGE_RECONCILIATION` — no Product Decision.

Required routing: expose the new normative capability next to its distinct governance prerequisite. Pointage heading is unchanged insertion context, not Pointage content modification.

Exact replacement preimage (CRLF in current target; displayed below as text):

```text
### Pointage authority and access foundation
```

### K3 — `docs/MODULE_REGISTRY.md`

Authority classification: `CURRENT_KNOWLEDGE_RECONCILIATION` — no Product Decision.

Required registry routing and source evidence without new lifecycle assignments or promoting the broad future generation/template row.

Exact replacement preimage (LF in current target; displayed below as text):

```text
## Adoption / maintenance rule
```

### K4 — `docs/CURRENT_STATE.md`

Authority classification: `CURRENT_KNOWLEDGE_RECONCILIATION` — no Product Decision.

Required narrow summary clarification: future legal templates wording otherwise hides an implemented global persistence foundation. No maturity table or lifecycle value edit.

Exact replacement preimage (LF in current target; displayed below as text):

```text
These summaries are bounded orientation, not a duplicated lifecycle table.
```

### K5 — `docs/architecture/DATA_MODEL.md`

Authority classification: `CURRENT_ARCHITECTURE_RECONCILIATION` — no Product Decision.

Required executable-shape reconciliation: scope list currently covers global identity and tenant-owned records only. Add only the accepted dedicated global resource boundary; preserve tenant restrictions.

Exact replacement preimage (LF in current target; displayed below as text):

```text
3. **Restaurant/branch-owned:** contains non-null `organization_id` and
   non-null `establishment_id`.

Every tenant-owned repository method
```

### K6 — `docs/architecture/DATA_MODEL.md`

Authority classification: `CURRENT_STATE_CORRECTION` — no Product Decision.

Required bounded correction to the newly stale blanket Formalités absence claim. The inherited payroll/register assertion is deliberately unchanged and separately flagged for owner review.

Exact replacement preimage (LF in current target; displayed below as text):

```text
foreign keys. Payroll, register, and Formalités data are not active.
```

## 5. Scan results and exclusions

| Source examined                                                        | Decision and reason                                                                                                                                                                                              |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Personnel Home                                                         | UPDATE_REQUIRED: distinguish this implemented global identity/draft/frozen-version foundation from employee preparation and future generated-contract/publication capabilities.                                  |
| PRODUCT_KNOWLEDGE                                                      | UPDATE_REQUIRED: add only concise routing/context to the new normative capability.                                                                                                                               |
| MODULE_REGISTRY                                                        | UPDATE_REQUIRED: bounded implementation evidence/routing paragraph; leave every lifecycle row/value unchanged.                                                                                                   |
| CURRENT_STATE                                                          | UPDATE_REQUIRED: clarify the broad future-template summary without changing maturity/readiness values or opening production gates.                                                                               |
| architecture/DATA_MODEL                                                | UPDATE_REQUIRED: current three-scope list omits this accepted dedicated global non-tenant resource; narrow blanket Formalités absence claim only.                                                                |
| Architecture OVERVIEW; Identity / Access Home; IDENTITY_AND_MEMBERSHIP | NO_UPDATE_REQUIRED for this bounded diff: their no-template-persistence statements describe the earlier authorization-only foundation. Do not reinterpret them as granting runtime or tenant-resource authority. |
| DATABASE_BOUNDARIES and authorization contracts                        | NO_UPDATE_REQUIRED: cloud/POS/Display ownership, tenant query obligations, trusted system boundary and five operation grants remain unchanged.                                                                   |
| Formalités page pack and application route context                     | NO_UPDATE_REQUIRED: this change has no UI/runtime integration; generated-contract and qualification workflows remain future work.                                                                                |
| Operations / readiness gates                                           | NO_UPDATE_REQUIRED: no operational or production gate was closed by local implementation, sync or archive.                                                                                                       |

### Inherited conflict — needs owner review, not silently fixed

`docs/architecture/DATA_MODEL.md` currently says Payroll/register/Formalités data are inactive. The blanket Formalités claim becomes stale because of this new separate global foundation and is narrowly corrected in the proposal. The inherited register-inactive clause conflicts with implemented register context in the Personnel Home/Module Registry. It predates this archive and remains unchanged: `NEEDS_REVIEW` by Personnel/data-model owners outside this proposal. This packet does not approve a register correction or infer its release status.

## 6. Scope, lifecycle and security confirmations

No ownership, role/principal, permission, operation grant, implication or tenant/global authorization rule is changed. Formalités remains semantic owner; `@yuta/db-cloud` remains the accepted persistence family. Restaurant membership provides no global authority.

No normative detail is duplicated as a competing specification. Links point only to successfully synced/validated main specs. The proposal deliberately distinguishes immutable frozen template versions from generated employee contracts.

No lifecycle/readiness value is promoted. No Platform Admin app/runtime, real CDI/CDD content, legal-review evidence persistence, publication, qualification, retirement execution, generation/PDF/signature/Documents handoff or production capability is implied. Historical governance/authorization scope remains unchanged.

## 7. Executed checks and exact attribution

| Actual command / check                                                                           | Exit / result                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec openspec instructions archive --change formalites-legal-template-foundation --json`   | 0; inspected official instruction/context before archive                                                                                                                      |
| `pnpm exec openspec archive formalites-legal-template-foundation --skip-specs --yes --json`      | 0; official archive, specsUpdated false                                                                                                                                       |
| Exact recursive archive path/hash comparison                                                     | PASS; 6/6 original artifacts, active absent                                                                                                                                   |
| `pnpm exec openspec validate --specs --strict --json`                                            | 0; 17/17 specs PASS, no errors/warnings; 41 informational long-requirement messages                                                                                           |
| `pnpm exec openspec validate --archived --strict --json`                                         | 0; 17/17 archives PASS, 0 issues                                                                                                                                              |
| `pnpm docs:check`                                                                                | 0; 36 documents checked against current repository                                                                                                                            |
| `pnpm architecture:check`                                                                        | 0                                                                                                                                                                             |
| `pnpm -r --if-present typecheck`                                                                 | 0; recursive run completed, scope 15 of 16 workspace projects                                                                                                                 |
| Scoped `pnpm exec prettier --check` on six archived artifacts and the canonical foundation spec  | 0; all matched files PASS, no formatter write                                                                                                                                 |
| `git apply --check docs/reviews/formalites-legal-template-foundation/04-proposed-knowledge.diff` | 0; read-only applicability, no canonical apply                                                                                                                                |
| Read-only Prettier API check of five exact preimages/proposed postimages                         | Registry, CURRENT_STATE, DATA_MODEL PASS before/after; Personnel and Product index FAIL before/after solely for unchanged CRLF baseline                                       |
| Formatter baseline comparison                                                                    | For both inherited failures, formatter output equals input with only CRLF to LF conversion, before and after proposal. No new formatting defect; no normalization authorized. |

Docs/architecture/typecheck results above validate the actual archived repository, not a claimed application of the Knowledge proposal. Applicability and formatter checks inspect proposed output in memory only. Review-artifact formatting and final integrity are recorded in the appended Archive Result in Gate 3 after the packet is written.

Historical results are retained, not rerun or relabeled: B1/C5 exit 1, Personnel newest-50 76 PASS / 1 FAIL, ACCEPTED_ATTRIBUTED_BASELINE_FAILURE. B2 aggregate `pnpm test:cloud` exit 1, ACCEPTED_TEST_ORCHESTRATION_LIMITATION; targeted Owner 27/27 and Pointage 8/8 passed without guard skips. Global format check previously had 67 inherited warnings. No repository-wide formatter write; no claim of current aggregate test/build/global-format PASS. No DB suite or build rerun is required by this archive-only action.

## 8. Scoped integrity and concurrent attribution

Pre-archive repository path/hash/status baseline: `2026-09-08T10:39:18.625Z`, HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Dirty checkout is not clean HEAD. Gate 1 26/26, Gate 2 29/29 and Gate 2b 44/44 interpreted with explicitly approved D8/two-index rebaselines were checked before lifecycle action. Dedicated Formalités implementation/schema/test/migration/snapshot/journal hashes remain protected.

Authorized current-turn repository writes: the six-file official archive move, bounded status/evidence updates to `03-final-review.md`, this review packet and `04-proposed-knowledge.diff`. Canonical Knowledge, main specs, implementation and concurrent Pointage paths were not edited.

| Concurrent Pointage path, attribution only                                    | Pre-archive SHA-256                                                | Observed post-archive SHA-256                                      |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `4a43db85422353d37a0132a7b47362ae6fab63d15c532442016ff7a834a50f04` | `ec96d42705d707cb99845fa9723076992c0677935eb39b2e01c8f32cb3232f81` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`                   | `2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb` | `761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3` |
| `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts`                 | `4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158` | `9a674855aba632365412bd08fd270610f61c8c1c9ae21c1a470c49429350fd06` |

No merge, revert, rewrite or approval of that concurrent work. Earlier sync-stage Pointage observations remain historical attribution in Gate 3. The two protected shared indexes and all dedicated Formalités files retain their approved hashes. Snapshot differences are evidence of concurrently observed bytes, not attribution of intent or readiness.

## 9. Release follow-up and stop boundary

RELEASE_FOLLOW_UP: REQUIRED, separate from repository finish. Before any future runtime/production use of this cloud persistence foundation, obtain explicit target-environment/runtime authorization and the applicable db-cloud migration/readiness review for unchanged `0020_formalites_legal_template_foundation.sql`, including backup/rollback planning and post-migration schema/integrity verification. This packet neither schedules nor executes those operations and does not approve a runtime integration.

Production: NOT AUTHORIZED. No deploy, production migration, runtime enablement, template seed/content, reviewer evidence, publication/qualification/retirement or generated CDI action occurred.

Archive is complete. Repository workflow is NOT DONE: `AWAITING_KNOWLEDGE_REVIEW`. Control Tower must review this exact five-target proposal and approve the exact packet/diff hashes before canonical edits. Any target/preimage drift requires a new review; do not silently rebaseline. STOP here.

## 10. Authorized Knowledge Apply — final execution evidence

Recorded: 2026-09-08T10:58:36Z

Knowledge review: APPROVED  
Approval source: explicit current-user Control Tower authorization  
Approval recorded by: Codex workflow  
Approved review packet SHA-256: `dfd97abc15627dc61f2aadf3be56c3413c1453670c57737a0225f479a94a279d`  
Approved exact diff SHA-256: `005a7b271be126522ba5d64e765ae68c1d46e835dc49857fd97c0aa8ffe3bc49`  
Knowledge applied: YES  
Knowledge apply result: PASS  
KNOWLEDGE_CONSOLIDATION: PASS  
REPOSITORY_WORKFLOW: READY_FOR_DONE  
REGISTER_DATA_MODEL_STATUS: NEEDS_REVIEW_OUT_OF_SCOPE  
RELEASE_FOLLOW_UP: REQUIRED  
Production: NOT AUTHORIZED

This bounded execution/status section supersedes only earlier pending-Apply statements in sections 1–9. Their approved proposal, exact preimages, scope, archive and historical validation evidence remain unchanged. Current-user instructions explicitly require READY_FOR_DONE and a Control Tower handoff, so the normal skill's automatic DONE transition is not performed.

### Exact application and five final hashes

Immediately before Apply, all five canonical preimages, the reviewed packet and the exact diff matched the user-approved SHA-256 values. The existing approved Gate 3 finish/archive/awaiting-Knowledge status and archive-present/active-absent conditions were checked. No Gate 3, Sync or Archive was reopened.

The two CRLF files received a mechanical application of only their exact approved diff hunks:

```text
git -c core.autocrlf=true apply --include=docs/features/personnel/README.md --include=docs/PRODUCT_KNOWLEDGE.md docs/reviews/formalites-legal-template-foundation/04-proposed-knowledge.diff
```

Exit 0; both raw postimages immediately matched. The remaining three LF files received the exact approved hunks using the local patch tool, without rewriting wording. No canonical formatter write, whole-file normalization, BOM or mixed line endings was introduced. Original CRLF/LF styles are intact.

| Applied canonical target            | Final raw SHA-256                                                  | Line endings |
| ----------------------------------- | ------------------------------------------------------------------ | ------------ |
| `docs/features/personnel/README.md` | `33214c8a8699b4fffda22afd15d6360f8d4f90c4548adfe98955db772fccdd9d` | CRLF         |
| `docs/PRODUCT_KNOWLEDGE.md`         | `7723a19aa5ffd7afe0c01d67d45ee352ea33dc0dec3892a2e6f423747e715c2d` | CRLF         |
| `docs/MODULE_REGISTRY.md`           | `7205d06cd76e1e89f3fb0f755dbd295fe8191ec31ef97b8eafb8d69b06a1a5b3` | LF           |
| `docs/CURRENT_STATE.md`             | `d279d0d2e76de9498d2266c742cc3408f9be471174f04cb5413fd62d3c80b105` | LF           |
| `docs/architecture/DATA_MODEL.md`   | `35a5abac7b714e900c1c185a84fd29bf1762d6994c9a1761237915bbc5d4926c` | LF           |

All 5/5 expected postimages match. Read-only reverse-hunk reconstruction of each postimage reproduces its exact approved preimage hash. This checks exact bytes and patch equivalence independently of Git status. All lifecycle/readiness table rows are unchanged; the approved narrow Register wording is preserved without out-of-scope correction.

### Commands actually executed after Apply

| Command / check                                                                                                                                                        | Exit and actual result                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `git apply --reverse --check docs/reviews/formalites-legal-template-foundation/04-proposed-knowledge.diff`                                                             | 0; exact reverse applicability                                                                                                          |
| `pnpm docs:check`                                                                                                                                                      | 0; PASS, 36 current documents                                                                                                           |
| `pnpm architecture:check`                                                                                                                                              | 0; PASS                                                                                                                                 |
| `pnpm -r --if-present typecheck`                                                                                                                                       | 0; PASS, completed recursive run across scope 15 of 16 projects                                                                         |
| `pnpm exec openspec validate --specs --strict --json`                                                                                                                  | 0; 17/17 PASS, 0 failed; 41 INFO long-requirement notices, no errors/warnings                                                           |
| `pnpm exec openspec validate --archived --strict --json`                                                                                                               | 0; 17/17 PASS, 0 failed, 0 issues                                                                                                       |
| `pnpm exec prettier --check docs/features/personnel/README.md docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md docs/CURRENT_STATE.md docs/architecture/DATA_MODEL.md` | 1; exactly the two known Personnel/Product CRLF failures, remaining three PASS                                                          |
| Read-only Prettier comparison of exact reverse-reconstructed preimages and applied postimages                                                                          | PASS attribution: both failing files differ from formatter output only by CRLF to LF, before and after Apply; no new formatting failure |
| `git diff --check -- docs/features/personnel/README.md docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md docs/CURRENT_STATE.md docs/architecture/DATA_MODEL.md`        | 0; advisory future LF-to-CRLF Git warnings for the three LF targets, no file conversion occurred                                        |

The scoped Prettier command is not relabeled exit 0. Its inherited line-ending-only result is accepted by the explicit current authorization. Global `format:check` was not rerun; the historical 67-warning result remains historical, not a current measurement. Tests/builds/DB suites were not rerun for this Knowledge-only action, and their earlier B1/B2 outcomes are not rewritten.

### Post-Apply integrity and concurrent context

Fresh Apply baseline: `2026-09-08T10:56:53.618Z`. First post-Apply inventory: `2026-09-08T10:58:14.496Z`. Full tracked/non-ignored-untracked path/hash comparison found exactly the five approved canonical deltas before the permitted review/status finalization. No sixth canonical target changed. The proposed diff itself remains byte-identical.

Unchanged across this Apply: all six archived files; all main specs (including foundation and neighboring authorization/governance specs); implementation/schema/tests; migration 0020 and its snapshot; current journal; and the protected shared indexes. The foundation main-spec SHA-256 remains `5ae4931fd7f252312d650f2941bc9b97a7f45998612f670ed18dc7951e90b32a`. Active change remains absent; the exact completed archive remains present.

The current journal had already changed before Knowledge Apply due to a concurrent appended Pointage migration entry:

- Historical archive journal SHA-256: `64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997`.
- Current journal SHA-256, unchanged throughout this Apply: `897139ed88030e38adfffa55ba5f1bc4d4773b6bf8f1aac619f17653834907b0`.
- New entry: index 21, tag `0021_abandoned_black_queen`; companion migration/snapshot are concurrent work, not Formalités delivery.
- Read-only removal of only entry 21, preserving the existing two-space JSON representation and no terminal newline, reconstructs exactly the historical journal hash above.
- Formalités entry 20, dedicated migration 0020, snapshot and all other protected Formalités hashes retain their reviewed bytes. No journal rebaseline, migration generation, schema edit or production migration was performed.

Concurrent Pointage sources, tests, planning and new migration files were not edited, reverted, merged or included in this delivery. Their presence does not establish Pointage approval/readiness. No unexplained protected drift was found.

REGISTER_DATA_MODEL_STATUS remains NEEDS_REVIEW_OUT_OF_SCOPE. The inherited register-inactive inconsistency is explicitly non-blocking for this change under the current Control Tower decision; no Register production-readiness claim is made.

### Final boundary

Knowledge Apply and required validation are complete: PASS. Repository workflow is READY_FOR_DONE, returned to Control Tower rather than automatically marked DONE. No lifecycle/readiness value, role, permission, operation, owner, runtime or normative spec was changed by this Knowledge Apply.

RELEASE_FOLLOW_UP remains REQUIRED. Future cloud/runtime use requires separate explicit release authorization, including the applicable migration 0020 deployment plan, backup/rollback and post-migration verification. No such operation occurred. Production remains NOT AUTHORIZED.
