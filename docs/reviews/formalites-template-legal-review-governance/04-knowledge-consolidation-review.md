Change: formalites-template-legal-review-governance
Review: Post-archive Knowledge Consolidation
Classification: UPDATE_REQUIRED
Review status: APPROVED
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-07T21:04:44Z
Created: 2026-09-07T20:46:19Z
Revision: 2 — requested supersession/retirement correction
Apply authorization: AUTHORIZED_BY_CURRENT_USER — exact revision 2 diff only
Workflow status: DONE
Knowledge Consolidation: COMPLETED
Production: NOT AUTHORIZED

# Knowledge Consolidation Review

## 1. Completed evidence and bounded reason

Gate 3 được current user approve cho exact reviewed Tasks
`29692d7060e99253fc733a30de4ba9a3185f56cb3de2e57a00265f60f301eece`
và final review
`72cc08bcb54fe6afa363d03f4f7f5c8427b83951dab07b3e5d972f87c8ceb182`.
Finish integrity đã match tất cả active Gate 1/2/2b pairs, 19 Gate 3
source/artifact pairs, exact documentary diff và ba approved rebaseline hashes.

Canonical main spec:
[formalites/template-legal-review-governance](../../../openspec/specs/formalites/template-legal-review-governance/spec.md).

Main-spec SHA-256:
`cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22`.

Archive:
[2026-09-07-formalites-template-legal-review-governance](../../../openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance).

Sync chỉ thêm title và đổi `## ADDED Requirements` thành `## Requirements`;
Purpose và toàn bộ requirements/scenarios giữ exact bytes. Equivalence:
13/13 requirements, 32/32 scenarios; no delta operation header. Strict main-spec
validation PASS (16/16); archive task validation PASS (16/16 archives).
Six archived artifacts giữ original hashes, active directory absent, archive unique.
Technical compliance/VERIFY vẫn chỉ DOCUMENTARY CONFORMANCE; QA NOT_APPLICABLE.

Owning Personnel Home và routing hiện chưa chỉ tới normative governance contract
mới. Registry đã có future lifecycle nhưng chưa có reference phân biệt documentary
governance với actual template implementation. Cần bổ sung context/routing nhỏ,
không sửa các lifecycle rows hoặc làm legal templates trở thành implemented.

## 2. Exact candidate target set and preimages

Candidate targets: đúng 3 files; chưa file nào được sửa.

| Exact candidate target              | Current SHA-256                                                    |
| ----------------------------------- | ------------------------------------------------------------------ |
| `docs/features/personnel/README.md` | `7fce8f42319534032e67c8b98b91ad6e7384362cfad039c5063ed66aee45439b` |
| `docs/PRODUCT_KNOWLEDGE.md`         | `c66e1cc6696de61759b4090d51d798e043c1c914f677e21ab65d8f739f787d11` |
| `docs/MODULE_REGISTRY.md`           | `880bda34f9bbcae3ac361669d0a3d175e7ec510b636f374e93e5f5df882165d0` |

## 3. Exact proposed diff

[04-proposed-knowledge.diff](04-proposed-knowledge.diff)

Diff SHA-256:
`9274a366e84830106ac3b2cca61f91a2c0a376815c2925ae97d363b4e8977745`.

UTF-8 unified diff, 56 added lines / 0 removed lines:
Personnel 41, Product Knowledge 7, Module Registry 8. Diff file là exact
proposal bytes để review/applicability; không là applied canonical update.
Không thêm target ngoài ba paths ở trên.

Expected postimages nếu chỉ chèn đúng các additions và giữ existing file EOL:

| Target                              | Expected post-apply SHA-256                                        | Existing EOL |
| ----------------------------------- | ------------------------------------------------------------------ | ------------ |
| `docs/features/personnel/README.md` | `ac6e0a1baf36dd0839de1e9c8d36613f773852ec1644d21b9e3f867b29e6922a` | CRLF         |
| `docs/PRODUCT_KNOWLEDGE.md`         | `4249d0ef9caf3da7f6cc703eb182305f186e82bf14b820765918b00ce1ff19c9` | CRLF         |
| `docs/MODULE_REGISTRY.md`           | `5727e1caaf374dd9611a79e5447f68b781a826f61ccfa27b53ac9693607f5481` | LF           |

Đây là expected semantic-proposal postimages, không formatter authorization.
Approval phải bind current preimage/path set và exact diff; không tự broaden
diff để sửa baseline formatting.

## 4. Necessity and authority classification

| Target / insertion                                       | Why necessary                                                                                                       | Authority classification / evidence                                                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Personnel Home, new subsection under Business boundaries | Phân biệt global governance prerequisite với tenant draft và future generation; context chưa ghi nhận contract mới. | Broader Product Knowledge reconciliation từ normative R1–R13; không redefine normative behavior hoặc thay ownership. |
| Product Knowledge index, Personnel/Formalités routing    | Cho phép discovery đi tới precise approved governance spec thay vì chỉ future-stage wording.                        | Navigation/source routing, không Product Decision mới.                                                               |
| Module Registry, OpenSpec position note                  | Tách newly normative documentary prerequisite khỏi unchanged future lifecycle rows và reserved Platform Admin app.  | Evidence routing/context only; không thêm hoặc promote lifecycle row.                                                |

Không copy full 13/32 into Knowledge. Exact requirements/scenarios tiếp tục
thuộc main spec; proposed summary không là replacement authorization contract.

## 5. Inspected sources and exclusions

| Source inspected                                                                 | Decision                                                                                                              |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `docs/features/personnel/README.md`                                              | Candidate: context addition only; all current/development/future and lifecycle sections remain intact.                |
| `docs/PRODUCT_KNOWLEDGE.md`                                                      | Candidate: one bounded governance link/paragraph; no unrelated routing/count cleanup.                                 |
| `docs/MODULE_REGISTRY.md`                                                        | Candidate: OpenSpec-position note only; existing lifecycle table bytes untouched.                                     |
| `docs/CURRENT_STATE.md`                                                          | No edit: broad runtime and future-stage summary remains accurate, points to owning Home.                              |
| `docs/features/identity-access/README.md`                                        | No edit: exact five-operation foundation remains true; no new grant/role.                                             |
| `docs/architecture/IDENTITY_AND_MEMBERSHIP.md`                                   | No edit: trusted system-only auth remains independent of TenantContext.                                               |
| `docs/architecture/OVERVIEW.md`                                                  | No edit: no runtime/application/persistence architecture changed.                                                     |
| `docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`                 | No edit: UI/as-built scope unchanged; actual qualified template/legal review still not obtained.                      |
| `docs/LIFECYCLE_STATUS_MODEL.md`, OpenSpec/lifecycle separation                  | No edit: normative contract does not assign lifecycle values.                                                         |
| `docs/operations/PRODUCTION_READINESS.md`, Personnel/legal/privacy gates         | No edit: HR-TEMPLATE-01, HR-FORMALITY-01, HR-RET-01 and other gates remain blocked; no real template/review evidence. |
| `docs/decisions/ADR-003-database-ownership-boundaries.md`                        | No edit: no executable data model or runtime ownership change.                                                        |
| `docs/AUTHORITY_MODEL.md`, normativity policy and Workflow v3 Knowledge protocol | Governance authority; no edits needed.                                                                                |
| Existing authorization main spec                                                 | Protected unchanged; no contract/grant modification.                                                                  |

Không có NEEDS REVIEW nào được đóng bằng inference. Retention duration/processing
decisions vẫn cần authority trước future evidence processing/persistence.
Actual template review, version implementation, publication, evidence storage
và runtime là future work, không được authorize qua packet này.
Historical/detailed page-pack progress và dated unrelated repository counts
không được normalize trong proposal này.

## 6. Preserved boundaries

- Formalités semantic ownership; GLOBAL YUTA scope, not tenant-owned.
- Existing five operations only:
  `formalites.template.read`, `formalites.template.draft.manage`,
  `formalites.template.review.submit`, `formalites.template.publish`,
  `formalites.template.retire`.
- Explicit YUTA_ADMIN grants only; YUTA_SUPPORT none; no caller policy,
  wildcard, prefix matching, implication, hierarchy, new role/principal.
- Trusted active internal user + exact grant; no tenant membership or
  TenantContext prerequisite, merge, fallback or tenant-resource bypass.
- External/manual reviewer, evidenced identity/authority/competence, no YUTA
  account. Reviewer differs from publisher; recorder may equal publisher.
- Three outcomes only; exact immutable version/checksum/envelope/conditions,
  current approved evidence and successful publication needed for qualification.
- No standalone evidence CRUD, opinion authoring by admin, sixth operation,
  schema/migration/repository/API/UI or apps/platform-admin.
- No legal-review engine, atomic transaction implementation, evidence upload,
  template content/version implementation, provider or production capability.
- No generated CDI/PDF/signature/Documents handoff.
- Security audit, external review evidence and publication/retirement audit
  retain separate meanings.
- No legal-compliance/certification/final-contract guarantee.
- No lifecycle/readiness promotion, global Product Decision approval, closed
  readiness gate or actual legal review implied.
- Canonical Knowledge remains unchanged pending explicit review approval.

## 7. Historical initial-proposal validation and attribution

| Actual command / inspection                                                                                      | Exit / result                                        | Scope                                                                         |
| ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| `git apply --check docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff`          | 0 / PASS                                             | Applicability only; no apply.                                                 |
| `git apply --numstat docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff`        | 0 / PASS                                             | Exactly 3 targets, 54 additions, 0 deletions.                                 |
| Raw SHA-256 comparison and in-memory insertion calculation                                                       | 0 / PASS                                             | Current preimages and expected postimages above; canonical files not written. |
| `pnpm exec openspec validate --specs --strict`                                                                   | 0 / PASS, 16/16                                      | Synced current main specs, rerun after archive.                               |
| `pnpm exec openspec validate --archived --strict`                                                                | 0 / PASS, 16/16                                      | Archived task completion; separate 6/6 byte manifest check passed.            |
| `pnpm docs:check`                                                                                                | 0 / PASS, 36 documents                               | Actual post-sync repository, not a simulated Knowledge apply.                 |
| `pnpm architecture:check`                                                                                        | 0 / PASS                                             | Actual post-sync repository; no runtime edit.                                 |
| `pnpm -r --if-present typecheck`                                                                                 | 0 / PASS                                             | Repository compatibility only, not a legal-review engine.                     |
| `pnpm format:check`                                                                                              | 1 / baseline FAIL, 67 files                          | Same existing out-of-scope failures as Gate 3; no global formatter write.     |
| `pnpm exec prettier --check docs/features/personnel/README.md docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md` | 1 / baseline FAIL in Personnel and Product Knowledge | Current unapplied targets; Registry passed. No remediation applied/proposed.  |

Two candidate files already fail global/scoped Prettier before this proposal.
This packet does not claim a full proposed-output formatting PASS or post-apply
docs/architecture PASS. A later authorized apply must recheck target hashes,
exact diff, formatting and docs/architecture; it must not silently add formatter
changes outside this exact proposal. Any required formatting remediation remains
separately reviewable.

## 8. Review stop

Knowledge Consolidation: UPDATE_REQUIRED.
Knowledge Review: AWAITING_HUMAN_REVIEW.
Knowledge diff applied: NO.
Repository workflow: AWAITING_KNOWLEDGE_REVIEW, not DONE.
RELEASE_FOLLOW_UP: NOT_REQUIRED — documentary governance only.
Production: NOT AUTHORIZED.

Control Tower review is required for the exact three-target diff above.
Do not reopen Gate 3, repeat Sync/Archive or modify canonical Knowledge before
a separate explicit approval.

### Historical initial packet issuance validation

Observed completion: 2026-09-07T20:49:59Z.

- `pnpm docs:check`: exit 0, 36 current documents PASS after packet creation.
- `pnpm architecture:check`: exit 0, PASS after packet creation.
- `pnpm exec prettier --check docs/reviews/formalites-template-legal-review-governance/03-final-review.md docs/reviews/formalites-template-legal-review-governance/04-knowledge-consolidation-review.md openspec/specs/formalites/template-legal-review-governance/spec.md openspec/changes/archive/2026-09-07-formalites-template-legal-review-governance/tasks.md`:
  exit 0, exact four Markdown paths PASS.
- Scoped no-index whitespace wrapper over those same four paths: exit 0,
  no diagnostics. Each underlying file-versus-NUL exit 1 is expected.
- `git apply --check docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff`:
  exit 0, applicability remains PASS without apply.
- Current three target hashes still match proposal preimages; diff SHA-256
  remains `bd9735b721e296131d5e7cf36a0717c3b05111af45fc6ac11cd7485ca4ef6048`.
- Removing only the authorized finish append/approval fields from Gate 3
  reconstructs the exact reviewed packet hash
  `72cc08bcb54fe6afa363d03f4f7f5c8427b83951dab07b3e5d972f87c8ceb182`.
  Original reviewed documentary evidence therefore remains intact.
- These validations cover current repository/packets, not an applied Knowledge
  proposal. Canonical Knowledge remains unchanged; review is still pending.

## 9. Control Tower correction — revision 2

Recorded: 2026-09-07T20:58:04Z.
Correction authority: explicit current-user Knowledge Review CHANGES_REQUESTED.
This authorizes proposal revision only, not canonical Apply.

Superseded proposed diff SHA-256:
`bd9735b721e296131d5e7cf36a0717c3b05111af45fc6ac11cd7485ca4ef6048`.
Superseded review packet SHA-256:
`c5007ae4fc63069cb96c9c4b54c6ae2d64675d499645a6c09ef1fd92479792d0`.
Neither is an approval for canonical Knowledge.
The historical validation sections above remain evidence for revision 1;
section 3 and this section identify the current revision.

### Exact semantic correction

Only the proposed Personnel addition changes:

> Content or applicability changes require a new version and new review.
> Supersession preserves historical attribution, while retirement blocks future
> use without rewriting historical evidence or previously generated artifacts.

This replaces the earlier sentence that grouped supersession and retirement
as preserving historical evidence. Retirement now expresses future-use denial
and non-rewrite semantics, not an independent evidence-retention obligation.
Retention duration remains deferred. All other proposed wording is unchanged,
including the following authorization-audit sentence; its line break changes
only because the replacement paragraph is longer.

### Current revision validation

- Exact comparison to revision 1: only the requested sentence replacement and
  the necessary first-hunk line-count change; both other target diff sections
  are byte-identical. Result: PASS.
- `git apply --check docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff`:
  exit 0, applicability PASS; no canonical apply.
- `git apply --numstat docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff`:
  exit 0, exactly Personnel 41/0, Product Knowledge 7/0, Registry 8/0
  additions/deletions. Total 56/0, same exact three-target set.
- Read-only unified-hunk parser: all old context/counts match current target
  bytes. Expected postimages recalculated in memory while preserving each
  target's original EOL; updated table is in section 3.
- Fresh SHA-256 checks: all three canonical target preimages match section 2;
  no target drift or canonical write.
- `pnpm exec prettier --check docs/reviews/formalites-template-legal-review-governance/04-knowledge-consolidation-review.md`:
  exit 0, scoped review-packet formatting PASS.
- Scoped `git -c core.autocrlf=false diff --no-index --check -- NUL <review-packet>`
  wrapper: exit 0, no diagnostics; underlying exit 1 indicates file-versus-NUL.
- `pnpm docs:check`: exit 0, 36 current documents PASS.
- `pnpm architecture:check`: exit 0, PASS.
- `pnpm -r --if-present typecheck`: exit 0, PASS.
- Global formatting, candidate-output formatting, main-spec validation, archive
  validation, tests and builds were not rerun for this proposal-only correction.
  Earlier baseline format failures remain historical, not a new PASS or a
  formatter-remediation authorization.

Fresh repository inventory: 2,512 existing tracked/untracked nonignored files.
Sorted path/raw-SHA-256 JSON digest excluding only this review packet and
`04-proposed-knowledge.diff`, at baseline and the interim correction check:

`9012d9bf4468e45f481bec939bfce2ddff38ccc4e05629aa4576c48af771a635`.

The final full-repository digest later became
`3a0ce1b9301910b991254d6e2df356354a56bebe835379cd0c96b841c4c44548`.
The unrelated `docs/reviews/pointage-usable-raw-clocking/01-analysis-review.md`
was concurrently rewritten at 2026-09-07T20:58:05Z; observed SHA-256:
`ee18fdbf3b9802978eb7d71000d001c1b32eb7672f333bf8fe452005414f3557`.
That packet was not edited, validated or approved by this correction. Full
repository equality after that concurrent activity is not claimed.

Separate exact path/hash inspection confirms the three canonical targets,
CURRENT_STATE, architecture documents, normative specs and archived artifacts
remain unchanged. Gate 3 remains at its prior completion-packet hash
`cc230caccdfb4d36408eed797943523d575344f382a535f9e1ce6d6674d3259a`.
Only the two authorized Knowledge review/proposal files were edited here.
This is scoped non-mutation evidence, not renewed Gate 3/Sync/Archive approval;
those lifecycle steps remain closed and were not rerun.

Current proposed diff SHA-256:
`9274a366e84830106ac3b2cca61f91a2c0a376815c2925ae97d363b4e8977745`.

Review packet SHA-256 is returned after the final edit/check rather than stored
inside this self-hashed file. Final scoped formatting/integrity is rechecked
after this revision section is added.

Knowledge Review: AWAITING_HUMAN_REVIEW.
Workflow: AWAITING_KNOWLEDGE_REVIEW, not DONE.
Canonical Knowledge applied: NO.
Formatter remediation: NONE.
Lifecycle/readiness promotion: NONE.
Production: NOT AUTHORIZED.
STOP for explicit Control Tower approval of revision 2.

## 10. Authorized revision 2 Apply — completion record

Completed: 2026-09-07T21:05:56Z.
Operating mode: archived Knowledge Review resume only.
Approval source: explicit current-user instruction.
Approval recorded by: Codex workflow.
Approved: 2026-09-07T21:04:44Z.
Approved revision: 2.

Approved exact diff SHA-256:
`9274a366e84830106ac3b2cca61f91a2c0a376815c2925ae97d363b4e8977745`.
Approved review packet before approval/completion metadata SHA-256:
`3832be4cddf766fcef46318f768a63f9463c52588473e15ed1e022627e5dc964`.

Both approved hashes and all three current target hashes were recomputed
before any write and matched. The diff path set was exactly the authorized
three files, with 41/7/8 added lines and no deletions.
Existing Gate 3 approval, completed finish/archive and pending Knowledge
Review state were inspected; active change was absent and recorded archive
present. Gate 3/Sync/Archive were not reopened or rerun.

### Exact application and postimages

Only the approved canonical additions were applied. Original CRLF for Personnel
and Product Knowledge and LF for Module Registry are preserved; no formatter
`--write` ran. The patch tool initially normalized the two CRLF files to LF;
a bounded mechanical EOL preservation step computed the approved postimage hash
before restoring those two files to their original CRLF. Its first read-only
conversion attempt failed on PowerShell argument parsing before a write;
the corrected conversion succeeded. No content or formatter remediation was added.

- `docs/features/personnel/README.md`: `ac6e0a1baf36dd0839de1e9c8d36613f773852ec1644d21b9e3f867b29e6922a`.
- `docs/PRODUCT_KNOWLEDGE.md`: `4249d0ef9caf3da7f6cc703eb182305f186e82bf14b820765918b00ce1ff19c9`.
- `docs/MODULE_REGISTRY.md`: `5727e1caaf374dd9611a79e5447f68b781a826f61ccfa27b53ac9693607f5481`.

All three final hashes match current-user expected values exactly.
Reverse applicability succeeded. Removing only the inserted approved blocks
in memory reconstructs each exact approved raw-byte preimage hash; this proves
diff equivalence rather than relying on a dirty HEAD comparison.

Governance main-spec SHA-256 remains
`cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22`.
Authorization main-spec SHA-256 remains
`3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2`.

### Actual validation

- Pre-Apply exact diff/review/three target hashes and exact diff path set: 0 / PASS.
- `git apply --check docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff` before Apply: 0 / PASS.
- `git apply --reverse --check docs/reviews/formalites-template-legal-review-governance/04-proposed-knowledge.diff` after Apply: 0 / PASS; no reverse write.
- Read-only exact postimage/preimage and formatter-delta comparison: 0 / PASS, 3/3.
- `git diff --check -- docs/features/personnel/README.md docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md`: 0 / PASS.
- `pnpm docs:check`: 0 / PASS, 36 current documents.
- `pnpm architecture:check`: 0 / PASS.
- `pnpm -r --if-present typecheck`: 0 / PASS.
- `pnpm exec prettier --check docs/features/personnel/README.md docs/PRODUCT_KNOWLEDGE.md docs/MODULE_REGISTRY.md`, before and after Apply: 1 / same two baseline failures; Registry PASS.

No new formatting failure was introduced. This is not a claim that all three
canonical files pass Prettier. The current-user formatting rule expressly
permits unchanged baseline failures; no failure was silently waived.

The read-only formatter comparison used installed Prettier with the resolved
repository config and each actual target filepath. For each file, the exact
approved addition remains byte-identical in LF formatter output. Removing that
addition from formatted post-Apply output equals formatted pre-Apply output
exactly, not merely the same list of failed filenames. Normalized formatter
baseline hashes (and post-Apply output with the addition removed) are:

- Personnel Home: FAIL / FAIL: `afd45e4bf9f06a4a25811ef4cba8bc563d11b37da00c8067865e28eaab92fd79`.
- Product Knowledge index: FAIL / FAIL: `3bd28b6dfa35f7023080b72c17757eeedd41ed447d11e5c570e7a80606d5e730`.
- Module Registry: PASS / PASS: `880bda34f9bbcae3ac361669d0a3d175e7ec510b636f374e93e5f5df882165d0`.

Formatter output was computed in memory only, never applied.
No global formatter, remediation proposal, build, test suite, main-spec sync,
archive operation or production action ran in this Knowledge Apply.

### Scoped integrity and closure

Fresh inventory: 2,515 existing tracked/untracked nonignored files.
SHA-256 of UTF-8 JSON for lexically sorted `[path, raw SHA-256]` rows,
excluding only the three approved canonical targets and the two permitted
review evidence files, matched before and after Apply:

`6250506ff3e831d192fb705e8b84a692a7382e570e116e03d2c8468cd166c874`.

This preserves CURRENT_STATE, architecture, normative specs, auth/runtime/data
sources, archived artifacts, the approved diff itself and all unrelated dirty
work. Canonical change set is exactly three files. Only this packet and
`03-final-review.md` additionally receive authorized lifecycle/validation evidence.

Earlier pending-review statements and hashes remain dated history; this
completion section and current header supersede their workflow status.
Historical finish evidence is not rewritten into a new Gate 3 approval.

Knowledge Consolidation: COMPLETED.
Knowledge diff applied: YES — exact approved revision 2 only.
Repository workflow: DONE.
RELEASE_FOLLOW_UP: NOT_REQUIRED.
Lifecycle/readiness promotion: NONE.
Production: NOT AUTHORIZED.
Remaining Knowledge blocker: NONE.
