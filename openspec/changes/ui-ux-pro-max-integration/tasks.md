# Tasks / Implementation Plan

Change: ui-ux-pro-max-integration
Schema: yuta-spec-driven
Planning review: APPROVED — explicit Control Tower decision
Gate 1 / Gate 2 / Gate 2b: APPROVED — exact hashes rechecked
Apply: AUTHORIZED — PHASE A ONLY, tasks 1.1–4.3
Artifact procurement: NOT AUTHORIZED
Production: NOT AUTHORIZED

## Planning boundary

23 tasks, 0 completed. Sáu nhóm là change-specific subgroups của phase hiện có
**Integration / Regression**, không thêm mandatory Workflow phase hoặc sửa
schema. Foundation / Data, Service / Domain, UI / Components và
Interaction / States: NOT_APPLICABLE vì không database/domain/application UI.
Các tên nhóm tooling do current Control Tower yêu cầu không đổi workflow
vocabulary canonical.

UI_AFFECTING: NO
BROWSER_QA_REQUIRED: NO
UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE
Reason: Integration không tự validate bằng advisory tool của chính nó.
Scope: tooling/external-design-intelligence only.
Decision source: approved R05, D2 và current Gate 2b instruction.
Tooling runtime QA: REQUIRED — chưa chạy; không được miễn do classification trên.

PRE-APPLY BLOCKER: LICENSE_PROVENANCE_ACCEPTANCE_REQUIRED — SATISFIED
LICENSE_PROVENANCE: ACCEPTED_FOR_EXACT_ARTIFACT_AND_BOUNDED_USE
Acceptance required: ACCEPTED_FOR_EXACT_ARTIFACT_AND_BOUNDED_USE
Acceptance: explicit current-user Control Tower decision; packet SHA-256
7228acfe862cc6cd23157e0d9d3c7a22c215dd122cb9da24192166e31e60c6ec
Blocker completion: acceptance prerequisite only; no procurement/install permission

Current Phase-A authorization supersedes the historical planning-only execution
status below. Embedded planning/contract semantics remain unchanged; tasks 5.x
and 6.x remain unauthorized and unchecked. PRE_PROCUREMENT_CHECKPOINT follows
only after actual completion/evidence for tasks 1.1–4.3.

Hồ sơ input: docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md.
LICENSE_REVIEW_INPUT_INCOMPLETE không phải legal rejection; INPUT_COMPLETE
cũng không tự tạo acceptance. Planning approval thỏa neither acceptance nor
Apply authorization. Tất cả tasks còn blocked cho execution: giữ approved R11
và D11 yêu cầu cả acceptance **và** explicit Apply. Sau dual approval, xây/test
YUTA logic với inert local synthetic archives trước procurement; không
download/extract/execute upstream để phát triển parser. Procurement còn cần
explicit exact artifact/path authorization. Ví dụ ordering của Control Tower
không được dùng để bỏ pre-Apply gate đã duyệt.

<!-- IMPLEMENTATION_PLAN_BEGIN -->

## Implementation Plan

P0 (không phải implementation checkbox): recheck Proposal/Analysis/Specs/Design,
earlier Gate tables, protected paths, fresh Git status/HEAD + tracked/untracked
path/hash baseline; license acceptance, Tasks approval và explicit Apply scope.
Intended existing files phải clean relative reviewed baseline; unrelated overlaps
-> STOP, không rebaseline/merge/revert tự động.

Dependency order: P0 -> 1.1–1.4 -> 2.1–2.4 -> 3.1–3.4 -> 4.1–4.3
-> explicit accepted-artifact procurement 5.1 -> staged M01–M10 5.2
-> provisional placement/M11 5.3 -> M12/M13 + completion 5.4
-> 6.1–6.4 -> STOP Gate 3. Synthetic tests lặp sau mỗi subgroup trước procurement.
Acceptance/presence trong artifact.json không tự cấp execution: kiểm exact
approval reference và bytes.

M11 cần actual fresh Codex context kiểm chứng local discovery, không giả lập
bằng parser unit test. Thiếu approved QA context khi Apply ->
BLOCKED_BY_ENVIRONMENT, pending/quarantine D17, không bypass/đổi Design.
Maintenance update code kiểm bằng inert archives, không fetch upstream version
thứ hai để thử update.

Deliverable: exact D11 implementation và actual evidence; 23/23 chỉ sau checks
tương ứng. Không deploy/Sync/Archive/Knowledge/lifecycle promotion.
Application builds/cloud/local DB suites không required cho scope này;
ghi NOT RUN với lý do trong final evidence, không gọi PASS.

<!-- IMPLEMENTATION_PLAN_END -->

<!-- TECHNICAL_CONTRACT_BEGIN -->

## TECHNICAL IMPLEMENTATION CONTRACT — Integration / Regression

Boundary: repository instruction routing, trusted developer workstation,
archive-as-data/parser, local filesystem placement, accepted local Python query
và evidence. Canonical owner: YUTA engineering tooling; Product/UI/runtime/data
owners giữ nguyên. Root/nearest instruction: AGENTS.md; không nested AGENTS
trong docs/openspec/scripts/.agents được tìm thấy; recheck trước Apply.

Authorities consulted: docs/README.md, docs/CURRENT_STATE.md (routing only),
docs/AUTHORITY_MODEL.md, docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md,
docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md, docs/YUTA_WORKFLOW_V3.md,
docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md, docs/YUTA_QA_PROTOCOL.md,
docs/ui/README.md, docs/ui/YUTA_FRONTEND_RULES.md,
docs/ui/DELIVERY_WORKFLOW_MODES.md, docs/DEVELOPMENT_WORKFLOW.md,
.agents/skills/yuta-run-change/SKILL.md, package.json và .gitignore.
Approved Specs/Design là delivery contract, không normative main specs.
Trước Apply reread từng D11 caller: chỉ routing, không duplicate policy.
Code/upstream output không phải Product/authority approval.

| ID  | Approved Design  | Constraint / required evidence                                                                                                                                                                                                                                                            |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| T1  | D11              | Exact 20-file source write allowlist dưới đây; scope mỗi row không mở rộng; generated writes chỉ D3/D4.                                                                                                                                                                                   |
| T2  | D6, D11          | Không package.json, pnpm-lock.yaml hoặc dependency mutation; không npm/npx/pnpm dlx/uipro/hooks/pip.                                                                                                                                                                                      |
| T3  | D3, D8           | Windows local NTFS same volume, Python 3.10+; unsupported/unknown host/owner/guard -> STOP trước mutation.                                                                                                                                                                                |
| T4  | D3               | Exact discoverable project target .agents/skills/ui-ux-pro-max/; không global.                                                                                                                                                                                                            |
| T5  | D4, D8           | Exact staging .yuta-tooling/ui-ux-pro-max/<run-id>/candidate/; unique exclusive owned run ngoài discovery.                                                                                                                                                                                |
| T6  | D4, D6           | Không execute upstream installer/bin/init/update hoặc npm dependency graph.                                                                                                                                                                                                               |
| T7  | D4               | Archive là data; toàn bộ pre-mutation validation/projection trong memory trước write.                                                                                                                                                                                                     |
| T8  | D4, D5           | Exact candidate 2.15.0 + SHA256/SRI D5, 862011 compressed bytes, 4656556 regular-file bytes, 196-entry inventory; identity không suy ra từ count.                                                                                                                                         |
| T9  | D4, Appendix A   | Fixed exact 67 source/destination mapping, 39 data/28 scripts, bytes unchanged; không runtime prefix selector.                                                                                                                                                                            |
| T10 | D4, D9           | Đúng SKILL.md, NOTICE.md, installation.json thêm vào 67; total70. Receipt hashes69otherfiles, exact schema/state + external receipt hash.                                                                                                                                                 |
| T11 | D4               | 129 excluded entries không output; không sibling skill transient/final, không install-all/delete.                                                                                                                                                                                         |
| T12 | D4               | Không extractall/unrestricted extraction; chỉ validated exact map exclusive writes.                                                                                                                                                                                                       |
| T13 | D4, D8           | Reject symlink/hardlink/device/FIFO/sparse/unsupported headers/duplicate/absolute/drive/UNC/backslash/NUL/ADS/empty/dot segments/reserved Windows/trailing dot-space/case collision/unreviewed PAX; reject reparse ancestors.                                                             |
| T14 | D8               | Exact existing path/hash/file-ID/volume/owner evidence, handles không FILE_SHARE_DELETE; conflicting target preserve/STOP, exact payload verify toàn bộ chứ không silent skip.                                                                                                            |
| T15 | D4               | MoveFileExW flags0 directory same-volume no-replace; no COPY_ALLOWED/REPLACE/DELAY; guard suốt critical section; không crash-durability guarantee.                                                                                                                                        |
| T16 | D4, D10          | General runner rejects pending; only guarded bootstrap owns run-scoped in-memory verification context; no public skip-check.                                                                                                                                                              |
| T17 | D10              | Chỉ query + domain ux XOR stack nextjs + max-results1..10, JSON; -B -E -s sanitized owned subprocess, no shell/eval; unknown trước spawn.                                                                                                                                                 |
| T18 | D9, D10          | Không --persist/MASTER.md/design-system/page/output-dir/force/dials, parallel design system, raw upstream instruction entrypoint.                                                                                                                                                         |
| T19 | D3, D8, D9       | Không global config/skills mutation hoặc new tools grants; only fingerprints, không secrets trong evidence.                                                                                                                                                                               |
| T20 | D5, D16          | Không latest/automatic update; replace-reviewed cần exact old/new artifact/wrapper/manifest and rollback authorization; not atomic swap.                                                                                                                                                  |
| T21 | D15              | Đủ M01–M13 exact matrix dưới đây; staged before placement, M11 after provisional placement, completed receipt only after required checks.                                                                                                                                                 |
| T22 | D17              | Preflight failure no write; staged fail no placement; post-placement fail owned quarantine; restore only exact reviewed owned unchanged backup; unknown concurrent state preserve/STOP.                                                                                                   |
| T23 | D5, D7           | Tách npmName/npmVersion/tarballUrl/tarballSha256/npmIntegrity/gitHead/upstreamRepository/observedMainCommit/bundledSkillName/bundledSkillVersion/upstreamTagRelationship/localWrapperVersion/licenseProvenance; manifest, approval reference/UTC/bounded-use and hashes không fabricated. |
| T24 | D1, D2, D12, D13 | External output chỉ DESIGN_REFERENCE; keep YUTA, internal conflict STOP, closed usage/findings, no numeric authority/stack/data/provider/Product enablement.                                                                                                                              |
| T25 | D13, D14, D18    | UI_AFFECTING NO/BROWSER_QA_REQUIRED NO, actual tooling QA REQUIRED; future UI Browser QA giữ nguyên; separate compliance/VERIFY/QA, no sync/archive/production by PASS.                                                                                                                   |

### Exact planned source write allowlist — D11

20 paths là future Apply allowlist, không current authorization.
Generated target/staging chỉ T4/T5/T9/T10, không tracked third-party payload.
Không sibling/app/main-spec/sealed-page-pack/Product Knowledge/CURRENT_STATE/
MODULE_REGISTRY/architecture summary/package/lock edits.
tasks.md và existing review evidence là change-local workflow documentation.

| Exact repository path                                    | Bounded edit                                                                         | Current planning baseline SHA-256                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`                | One canonical external-tool policy, D1–D18 operational contract                      | `ABSENT`                                                           |
| `AGENTS.md`                                              | Short routing + no implicit mutation grant                                           | `9e93a58dcdf6127660388ae073817fbac1df0b73be1e8fff9da9187e5cd9065b` |
| `docs/README.md`                                         | Index link only                                                                      | `5bcf60ad959e26cf4f32c7a740fa55615ce482ce674d5352bf5dc0ad216b23d9` |
| `docs/ui/README.md`                                      | Policy routing only                                                                  | `cf45d6be36bd69bf6fd3a010f20895178b5cce113507a935fe65f49a8cd63a69` |
| `docs/ui/YUTA_FRONTEND_RULES.md`                         | Reference/disposition rule link, no duplicated stack catalog                         | `4754f686492b1c8683d7aeed62f6faf4be709c45c9f90c73bee17c22b9e93949` |
| `docs/ui/DELIVERY_WORKFLOW_MODES.md`                     | Same modes/phases, usage record reference                                            | `d0c035a5510b82492c95f1153b461b276718dd89da70c3d34f5b95c1ededc999` |
| `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`                     | Phase 0 classification and VERIFY reference, no new phase                            | `b5bde661cc67da3bf48f0981f5fa4720347173513cf9509cfe80be05d5c7f279` |
| `docs/YUTA_WORKFLOW_V3.md`                               | Usage routing and three Gate 3 assessments unchanged                                 | `2e10a64ec93fd10927439dc803d515919accd5ebb77b0a2c4119d2d92fc4c4ca` |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`                 | Existing evidence blocks get usage/provenance reference                              | `b76d13f5cb929ba30ae13ed7e74679f28b7991201fb4336c13867b95feb80b05` |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`     | Page handoff/VERIFY references only                                                  | `82e0af41b0509074a4b5559ebb0dca82bbed4c8d07134c588288b9e2485e16a0` |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | Review usage, artifact gate and reference routing                                    | `fb8a8c99dd340ee7a1d8e5594e07a679a7666d8ddfdb5b5fdff0bbf10dbdac9b` |
| `docs/DEVELOPMENT_WORKFLOW.md`                           | Explicit bounded bootstrap/check commands and host limitation                        | `892db065b41c932152ea56bd55f043eb6ae94d5181894ace69cb26746b8f2b6f` |
| `.agents/skills/yuta-run-change/SKILL.md`                | Reference policy at classification/VERIFY; no new state/gate                         | `ea82819f0ae07ea24e58169c3b33fe7ad2b1140b5ca91b9cbad81389e9ef0f70` |
| `.gitignore`                                             | Exact generated `/.agents/skills/ui-ux-pro-max/` and `/.yuta-tooling/ui-ux-pro-max/` | `31262a06e1e330502c323eda7ac811cdcd8bd6e9e2b10c0c73bd6ca60543351b` |
| `tooling/ui-ux-pro-max/artifact.json`                    | Accepted candidate/projection manifest; initially UNCERTAIN                          | `ABSENT`                                                           |
| `tooling/ui-ux-pro-max/SKILL.md.template`                | YUTA adapter, not vendored upstream instructions                                     | `ABSENT`                                                           |
| `tooling/ui-ux-pro-max/NOTICE.md.template`               | Reviewed attribution, no guessed license conclusion                                  | `ABSENT`                                                           |
| `scripts/ui-ux-pro-max/bootstrap.py`                     | Standard-library verifier/stager/placement/rollback                                  | `ABSENT`                                                           |
| `scripts/ui-ux-pro-max/query.py`                         | Non-persistent bounded query runner                                                  | `ABSENT`                                                           |
| `scripts/ui-ux-pro-max/test_bootstrap.py`                | Local deterministic safety/negative checks                                           | `ABSENT`                                                           |

### Targeted checks and completion evidence

Mọi T1–T25 map authority -> actual implementation -> test/documentary evidence
-> PASS/FAIL trong existing 03-final-review.md. Không PASS từ prose plan.
Checks: deterministic safety suite, exact M01–M13, docs/architecture/recursive
typecheck, UI-pack test/check, strict OpenSpec, scoped Prettier/diff/hash.
NEW planned (chưa có/chưa chạy):
`python -B -m unittest discover -s scripts/ui-ux-pro-max -p test_bootstrap.py`.
D15 commands cũng NEW, không claimed existing scripts.

Contract allocation: group1=T1/T24/T25;
group2=T2/T3/T6/T7/T8/T12/T13/T14/T23;
group3=T4/T5/T9/T10/T11/T14/T15/T16/T20/T22;
group4=T6/T10/T16/T17/T18/T19/T24;
group5=T3/T4/T5/T8/T9/T10/T11/T15/T16/T19/T21/T22/T23;
group6=all T1–T25.
Mọi constraint vẫn áp dụng, allocation không bỏ cross-cutting safety rule.

<!-- TECHNICAL_CONTRACT_END -->

## 1. Integration / Regression — Governance / Policy

- [x] 1.1 Tạo policy single-owner DESIGN_REFERENCE, question-type routing và conflict disposition; kiểm review S01–S04/S18–S20/S37–S40, không promote Product, numeric preset hoặc lifecycle. Design: D1, D11, D12.

- [x] 1.2 Ghi closed usage record, scope/rationale/decision source và REQUIRED fail-closed trong existing analysis/plan/VERIFY routing; kiểm S05–S12, không rewrite approved Analysis hoặc tạo phase/gate mới. Design: D2, D11.

- [x] 1.3 Đồng bộ các caller routing trong allowlist, giữ delivery modes/page-pack authority và Browser QA; kiểm scoped diff, docs links và S13–S17/S41–S42. Design: D11, D12, D14, D18.

- [x] 1.4 Định nghĩa existing TECHNICAL VERIFY evidence block và finding dispositions; kiểm đủ query/provenance/UTC/exit/output hashes, approval references và ba Gate 3 assessments riêng. Design: D5, D13, D14.

## 2. Integration / Regression — Tooling Foundation

- [x] 2.1 Tạo candidate/acceptance representation và validate exact schema/identity mà không lấy artifact; kiểm inert unknown/missing/mismatched acceptance bị từ chối và không mutate package/lock. Design: D5, D6, D7, D11.

- [x] 2.2 Implement archive-as-data parser/pre-mutation verifier với bounded bytes/inventory và path/type/link/collision checks; kiểm synthetic negative cases cho mọi rejection D4, không extractall hay upstream installer. Design: D4, D6.

- [x] 2.3 Implement Windows local NTFS/Python 3.10+ host check, realpath/owner/file-ID/volume và guarded ancestors; kiểm unsupported host, reparse, outside path, guard failure không mutation. Design: D3, D4, D8.

- [x] 2.4 Tạo inert local synthetic archive tests trong owned scratch trước procurement; chạy NEW unittest command, chứng minh digest mismatch, 196-entry bounds, malicious headers/paths, race và no sibling transient writes; không execute synthetic payload. Design: D4, D8, D17, D18.

## 3. Integration / Regression — Safe Bootstrap / Provenance

- [x] 3.1 Implement fixed 67-entry projection D4 Appendix A + đúng ba YUTA files; stage candidate exclusive trong exact non-discoverable root, hash và recursively compare 70 paths; synthetic kiểm không dùng runtime prefix/glob và giữ raw bytes. Design: D4, D5, D8.

- [x] 3.2 Implement receipt pending/verified transition: hashes 69 other files, external receipt hash, no self-hash; general query từ chối pending, chỉ bootstrap run-scoped in-memory verification context; kiểm không public bypass flag. Design: D4, D9, D10.

- [x] 3.3 Implement guarded same-volume initial no-replace MoveFileExW flags 0; kiểm actual Windows primitive với inert owned directory và target race, không REPLACE_EXISTING/COPY_ALLOWED/DELAY, không incremental discovered writes. Design: D3, D4, D8.

- [x] 3.4 Implement D16 reviewed update và D17 quarantine/rollback; kiểm old/new exact acceptance+hash/rollback authorization, two-rename không gọi atomic swap, crash-pending, cleanup identity/hash guard và concurrent recovery preserve/STOP. Design: D8, D16, D17.

## 4. Integration / Regression — Query / Activation

- [x] 4.1 Tạo YUTA SKILL adapter và NOTICE template từ exact separately reviewed notice; giữ raw core unchanged và distinct yuta-adapter-1; kiểm narrow default discovery, authority/usage/receipt routing, không upstream instruction copy hoặc global grants. Design: D5, D7, D9.

- [x] 4.2 Implement only supported query gateway: positional query, domain ux XOR stack nextjs, max-results 1–10, JSON; kiểm validated absolute Python -B -E -s, sanitized env/no PYTHONPATH, owned cwd, shell=False/no eval và output-as-data. Design: D6, D10.

- [x] 4.3 Kiểm query pre-spawn deny pending/drift/unknown flags/domains/stacks, --persist/--force/--output-dir/--design-system/--page/dials; ghi zero spawn/write proof và no MASTER/global mutation bằng synthetic spy tests. Design: D4, D9, D10, D17.

## 5. Integration / Regression — Verification / Tooling QA

- [ ] 5.1 Chỉ sau dual authorization + explicit procurement scope: nhận đúng accepted tgz tại repo-local reviewed path, rehash compressed bytes và SRI, exact 196 inventory/per-entry hashes; đối chiếu notices/NOTICE và 67/129 split trước mọi extraction/execution, sai -> STOP. Design: D4, D5, D7.

- [ ] 5.2 Chạy actual accepted staged M01–M10 theo D15 qua bootstrap-owned context; ghi commands/exit/JSON relevance/output hashes/interpreter và before-after inventory, không dùng standalone runner pending bypass; bất kỳ fail -> no placement. Design: D4, D6, D10, D15, D17.

- [ ] 5.3 Chỉ khi staged checks pass: provisional no-replace placement, final-content recheck và fresh Codex M11 exact local discovery/behavior; kiểm conflict/REQUIRED/self-integration, pending không normal use, thất bại -> bounded quarantine, không INTEGRATED. Design: D3, D4, D8, D9, D15, D17.

- [ ] 5.4 Chạy M12 VERIFIED_NO_CHANGE full verification và M13 negative regression; hoàn tất/recheck exact receipt transition chỉ khi toàn bộ M01–M13 pass, lưu 70-file manifest và no sibling/global drift; không silent skip. Design: D4, D8, D15, D17.

## 6. Integration / Regression — Integration / Regression

- [ ] 6.1 Hoàn tất exact validated setup/check routing trong D11 và chạy docs/architecture/typecheck/UI-pack/scoped checks; đối chiếu hiện có modes/phases/sealed provenance/main specs, mọi global-format failure phải attributed, không repo-wide format-write. Design: D11, D12, D18.

- [ ] 6.2 Hoàn tất traceability R01–R18/S01–S42 và Technical Compliance Matrix T1–T25, D1–D18; mỗi dòng có authority -> actual path -> exact test/documentary evidence -> PASS/FAIL, không gọi mapping plan là implementation PASS. Design: D1–D18.

- [ ] 6.3 Thực hiện independent non-browser tooling QA theo M01–M13 và D14; ghi QA đúng actual status, không NOT_APPLICABLE do UI_AFFECTING=NO, không heuristic thay Browser QA cho UI work tương lai. Design: D13, D14, D15, D18.

- [ ] 6.4 Tạo 03-final-review.md chỉ khi đủ compliance/VERIFY/QA, final task/evidence/source hashes và attributed diff; recheck protected bytes, ghi Sync authorization PENDING và STOP Gate 3, không Sync/Archive/Knowledge/production. Design: D11, D13, D14, D17, D18.

## Traceability — planned, not executed

18/18 requirements và 42/42 scenarios mapped với exact headings từ Specs.
Mỗi scenario cần separate premise/expected outcome/result khi VERIFY.
Documentary gates không thay actual installation/activation checks.

| Requirement / scenario                                            | Planned tasks           |
| ----------------------------------------------------------------- | ----------------------- |
| R01 Advisory authority and external conflict handling             | 1.1, 1.4, 4.1, 6.2      |
| S01 Compatible advice remains reference                           | 1.1, 1.4, 4.1, 6.2      |
| S02 External advice conflicts with YUTA                           | 1.1, 1.4, 4.1, 6.2      |
| S03 Reference enters normal review                                | 1.1, 1.4, 4.1, 6.2      |
| R02 Internal authority conflicts stop the affected work           | 1.1, 4.1, 5.3, 6.2      |
| S04 Two controlling YUTA sources disagree                         | 1.1, 4.1, 5.3, 6.2      |
| R03 Closed usage classification with explicit rationale           | 1.2, 6.2                |
| S05 Optional use is omitted truthfully                            | 1.2, 6.2                |
| S06 Non applicable use has a scoped reason                        | 1.2, 6.2                |
| S07 Missing or unsupported classification                         | 1.2, 6.2                |
| R04 Required review fails closed without a valid tool             | 1.2, 3.2, 4.2, 4.3, 5.3 |
| S08 Required tool is absent or unavailable                        | 1.2, 3.2, 4.2, 4.3, 5.3 |
| S09 Present tool is unapproved or has drifted                     | 1.2, 3.2, 4.2, 4.3, 5.3 |
| S10 Required review with a valid available tool                   | 1.2, 3.2, 4.2, 4.3, 5.3 |
| R05 Integration cannot validate itself through advisory use       | 1.2, 5.2–5.4, 6.3       |
| S11 Planning the integration itself                               | 1.2, 5.2–5.4, 6.3       |
| S12 Later authorized installation still needs smoke tests         | 1.2, 5.2–5.4, 6.3       |
| R06 Existing phases and separate Gate 3 assessments               | 1.3, 1.4, 6.1, 6.4      |
| S13 Heuristic findings during Verify                              | 1.3, 1.4, 6.1, 6.4      |
| S14 Gate 3 evidence assembly                                      | 1.3, 1.4, 6.1, 6.4      |
| R07 Browser QA remains mandatory for UI affecting work            | 1.3, 6.3, 6.4           |
| S15 Clean heuristic but missing Browser QA                        | 1.3, 6.3, 6.4           |
| S16 Observed QA failure remains failure                           | 1.3, 6.3, 6.4           |
| S17 Environmental QA blocker remains blocked                      | 1.3, 6.3, 6.4           |
| R08 External suggestions cannot authorize stack changes           | 1.1, 4.3, 6.2           |
| S18 Suggested stack addition lacks YUTA approval                  | 1.1, 4.3, 6.2           |
| R09 No persistent parallel design system by default               | 1.1, 4.1, 4.3, 5.2      |
| S19 External instructions request persisted design output         | 1.1, 4.1, 4.3, 5.2      |
| S20 Existing external master claims precedence                    | 1.1, 4.1, 4.3, 5.2      |
| R10 Project local pinned installation and controlled updates      | 2.2, 3.4, 4.3, 5.1      |
| S21 Prohibited install or update mode                             | 2.2, 3.4, 4.3, 5.1      |
| S22 Upstream has a newer version                                  | 2.2, 3.4, 4.3, 5.1      |
| R11 Explicit license and provenance acceptance precedes Apply     | 2.1, 5.1, 6.2           |
| S23 Planning approval with unresolved license                     | 2.1, 5.1, 6.2           |
| S24 Exact artifact differs from accepted set                      | 2.1, 5.1, 6.2           |
| S25 Candidate version or upstream clarification is not acceptance | 2.1, 5.1, 6.2           |
| S26 Acceptance and Apply authorization are distinct               | 2.1, 5.1, 6.2           |
| R12 Core only payload without incidental sibling skills           | 2.2, 2.4, 3.1, 5.2      |
| S27 Installer would add sibling skills                            | 2.2, 2.4, 3.1, 5.2      |
| S28 No proven safe core only mechanism                            | 2.2, 2.4, 3.1, 5.2      |
| R13 Existing paths are preserved with controlled evidence         | 2.3, 3.3, 3.4, 5.4      |
| S29 Existing conflicting content                                  | 2.3, 3.3, 3.4, 5.4      |
| S30 Existing exact payload is not silently skipped                | 2.3, 3.3, 3.4, 5.4      |
| S31 Target resolves outside approved project scope                | 2.3, 3.3, 3.4, 5.4      |
| R14 Installation success requires content and smoke evidence      | 3.1, 3.2, 5.2–5.4, 6.3  |
| S32 Exit zero with incomplete or unexpected output                | 3.1, 3.2, 5.2–5.4, 6.3  |
| S33 Expected content but smoke fails                              | 3.1, 3.2, 5.2–5.4, 6.3  |
| S34 Verified installation evidence                                | 3.1, 3.2, 5.2–5.4, 6.3  |
| R15 Distinct provenance fields and bounded reproducibility claims | 2.1, 5.1, 6.2           |
| S35 Package and bundled skill have different version evidence     | 2.1, 5.1, 6.2           |
| S36 Only top level package is pinned                              | 2.1, 5.1, 6.2           |
| R16 App preset inheritance does not create numeric authority      | 1.1, 4.3, 6.2           |
| S37 Numeric recommendation for an app                             | 1.1, 4.3, 6.2           |
| S38 Page seeks an exception from app guidance                     | 1.1, 4.3, 6.2           |
| R17 Tooling boundary cannot enable product or runtime changes     | 1.1, 4.1, 5.4, 6.1, 6.4 |
| S39 External advice requests runtime or data access               | 1.1, 4.1, 5.4, 6.1, 6.4 |
| S40 Successful tooling checks do not promote product state        | 1.1, 4.1, 5.4, 6.1, 6.4 |
| R18 Review gates remain explicit and scope bound                  | 1.3, 6.2, 6.4           |
| S41 Specs complete without Gate 2 approval                        | 1.3, 6.2, 6.4           |
| S42 Sensitive Design lacks approval or safe mechanism             | 1.3, 6.2, 6.4           |

### D1–D18 coverage

| Decision | Tasks                                                      |
| -------- | ---------------------------------------------------------- |
| D1       | 1.1, 6.2                                                   |
| D2       | 1.2, 6.2                                                   |
| D3       | 2.3, 3.3, 5.3, 6.2                                         |
| D4       | 2.2, 2.3, 2.4, 3.1, 3.2, 3.3, 4.3, 5.1, 5.2, 5.3, 5.4, 6.2 |
| D5       | 1.4, 2.1, 3.1, 4.1, 5.1, 6.2                               |
| D6       | 2.1, 2.2, 4.2, 5.2, 6.2                                    |
| D7       | 2.1, 4.1, 5.1, 6.2                                         |
| D8       | 2.3, 2.4, 3.1, 3.3, 3.4, 5.3, 5.4, 6.2                     |
| D9       | 3.2, 4.1, 4.3, 5.3, 6.2                                    |
| D10      | 3.2, 4.2, 4.3, 5.2, 6.2                                    |
| D11      | 1.1, 1.2, 1.3, 2.1, 6.1, 6.2, 6.4                          |
| D12      | 1.1, 1.3, 6.1, 6.2                                         |
| D13      | 1.4, 6.2, 6.3, 6.4                                         |
| D14      | 1.3, 1.4, 6.2, 6.3, 6.4                                    |
| D15      | 5.2, 5.3, 5.4, 6.2, 6.3                                    |
| D16      | 3.4, 6.2                                                   |
| D17      | 2.4, 3.4, 4.3, 5.2, 5.3, 5.4, 6.2, 6.4                     |
| D18      | 1.3, 2.4, 6.1, 6.2, 6.3, 6.4                               |

## M01–M13 tooling QA matrix — exact approved D15

Tất cả NOT RUN trong planning. Giữ exact approved matrix:

| ID  | Check / command                                                                                 | Required observation                                                                                  |
| --- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| M01 | bootstrap verify-content                                                                        | SKILL.md exists, name ui-ux-pro-max, wrapper version/hash exact                                       |
| M02 | bootstrap verify-content                                                                        | 67 raw core files equal archive bytes, NOTICE/receipt exact approved derivation                       |
| M03 | before/after full inventory                                                                     | No sibling added or changed; exact target output = 70 files                                           |
| M04 | `python --version` plus actual executable identity                                              | Supported Python runs; no install if missing                                                          |
| M05 | `python -B scripts/ui-ux-pro-max/query.py "keyboard accessibility" --domain ux --max-results 3` | exit 0, valid JSON, nonempty UX results with source/category, meaningful query relevance              |
| M06 | same runner `"destructive confirmation modal form validation" --domain ux --max-results 3`      | nonempty relevant results; no fabricated exact ranking requirement                                    |
| M07 | same runner `"loading pending feedback" --domain ux --max-results 3`                            | relevant loading/pending guidance                                                                     |
| M08 | same runner `"server client component boundaries" --stack nextjs --max-results 3`               | stack nextjs and meaningful results                                                                   |
| M09 | runner query with `--persist`, `--force`, `--output-dir`, `--design-system` one at a time       | nonzero pre-spawn denial, no created files                                                            |
| M10 | pre/post owned scratch and full target/global fingerprint                                       | No MASTER.md, design-system output, unexpected files, global config modifications                     |
| M11 | Fresh Codex discovery + explicit selected local skill, no application changes                   | Exact local path loaded; external conflict rejected, internal conflict STOP, invalid REQUIRED blocked |
| M12 | repeated verified bootstrap same artifact                                                       | VERIFIED_NO_CHANGE only after full hash/content/smoke; no silent skip                                 |
| M13 | own bootstrap unit/negative suite                                                               | Traversal, case collision, links, target race, partial stage, digest and Python failures fail closed  |

M01–M10 staged trước placement khi applicable rồi final verification; M11 sau
provisional placement trước completion; M12/M13 và final scope/evidence phải
PASS. M05–M08 pending dùng bootstrap-owned context, không public bypass hoặc
general runner. Actual argv/UTC/exit/stdout-stderr hashes, source/category/
relevance và full inventory là evidence bắt buộc.

## Planning validation record

Actual checks, attribution và embedded-block hashes ở cùng review input
docs/reviews/ui-ux-pro-max-integration/license-provenance-review.md.
Không tạo 03-final-review.md trước Apply.
Hash convention: exact UTF-8 bytes giữa respective BEGIN/END marker lines,
không gồm marker lines, giữ terminal LF. Full Tasks hash độc lập, không self-hash.
Không sửa approved Design/Specs để format.

## Phase-A pre-procurement checkpoint — 2026-09-08

PRE_PROCUREMENT_CHECKPOINT: AWAITING_CONTROL_TOWER_REVIEW

PHASE_A_TASKS: 15/15 completed; TOTAL_TASKS: 15/23.
Remaining 5.1–5.4 and 6.1–6.4: UNCHECKED / NOT AUTHORIZED.
Full Technical Implementation Compliance / VERIFY / tooling QA: NOT COMPLETE.
This is not Gate 3, INTEGRATED, VERIFIED_NO_CHANGE, or production readiness.

Current authorization: explicit Control Tower Phase A, approved Tasks preimage
`9e58474ba55cd6242741d4fc7db1a8af5b1708ba76481e2045362fe044928157`.
License packet remains
`7228acfe862cc6cd23157e0d9d3c7a22c215dd122cb9da24192166e31e60c6ec`.
Before the first write, all 20 D11 preimages and all 29 Gate 1 protected rows
matched. Fresh working-tree path/hash baseline: 2584 tracked/untracked
non-ignored paths, UTC 2026-09-08T20:53:54.642Z;
HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Dirty working-tree bytes, not HEAD,
were used for attribution. No broad reset/revert/rebaseline was performed.

### Completed task evidence — bounded Phase A only

The implementation paths are the exact D11 table below. Python test names are
in `scripts/ui-ux-pro-max/test_bootstrap.py`; they execute YUTA controls only.
Synthetic record substitutions are private test doubles, not an alternative
accepted artifact or a public bypass. No fixture member is executable evidence
of upstream behavior.

| Task | Actual implementation and evidence                                                                                                                                                                                                                                                                     | Bounded result                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| 1.1  | Policy Authority and scope: S01–S04, S18–S20, S37–S40 reviewed against exact Specs; external/YUTA rejection, internal conflict STOP, owning review for new requirements/app exceptions; no numeric values or Product promotion.                                                                        | PASS — documentary conformance                         |
| 1.2  | Policy Usage classification plus workflow routing: S05–S12; closed three-value record with Reason/Scope/Decision source, unknown classification error, REQUIRED fail closed, self-integration NOT_APPLICABLE without QA waiver. Approved Analysis unchanged.                                           | PASS — documentary conformance                         |
| 1.3  | Thirteen existing D11 files have additive routing/ignore changes only; new policy owns the contract. S13–S17/S41–S42 checked: no new phase/gate, no sealed-pack rewrite or QA waiver. docs:check and 12 UI-pack tests PASS. Whole UI-pack validator remains the unrelated failure recorded below.      | PASS — scoped routing; aggregate failure not waived    |
| 1.4  | Policy Existing TECHNICAL VERIFY evidence specifies exact query/argv, provenance, UTC, actual exit/output hashes, acceptance and finding dispositions; three Gate 3 assessments stay separate. Query failure/timeout evidence tests preserve actual failure.                                           | PASS — evidence contract                               |
| 2.1  | artifact.json plus validate*record/decode_json pins the entire canonical object, including schema, types, identity, full inventory/projection and acceptance packet. test_record*\* and duplicate/nonfinite JSON tests reject unknown/missing/mismatched inputs. Package/lock unchanged from baseline. | PASS — inert tests and exact record                    |
| 2.2  | \_archive/verify_archive validate compressed SHA/SRI/size, bounded decompression, USTAR headers/types, 196 exact entry names/sizes/hashes, padding/terminator and Windows paths before output. ArchiveTests covers all authorized negative families. No extraction API or installer.                   | PASS — synthetic only                                  |
| 2.3  | host_check, Windows, Guard pin local NTFS volume, running absolute Python module, owner/SID/file ID/final path and non-reparse ancestors. Actual junction and ancestor-rename tests; unsupported host/filesystem/owner, missing/other executable and outside-root tests fail closed.                   | PASS — native Windows/inert                            |
| 2.4  | 120 deterministic unittest cases; YUTA-owned disposable directories on D: outside repository/discovery roots. Inert 196-member bytes constructed locally; exact names may follow reviewed metadata, no retained upstream content read or executed.                                                     | PASS — exit 0, zero skips                              |
| 3.1  | Exact 67-row source/target list, 39 data + 28 scripts; \_projection preserves fixture bytes. \_Run validates the complete 69-file plan before mutation; stage exclusively adds receipt for exact 70, validates hidden files/directories and siblings.                                                  | PASS — synthetic projection/stage                      |
| 3.2  | receipt/verify_receipt and \_Run.complete: 69 hashes, receipt hash external, exact pending/verified schema, all checks required. Pending denied before normal spawn/scratch; only active private run context accepts it. Missing/unknown receipt fields/checks and content drift denied.               | PASS — state-machine tests, not real M01–M13           |
| 3.3  | move_no_replace calls actual MoveFileExW with flags 0; test_actual_no_replace, test_actual_target_race_at_primitive and test_wrapper_target_race_preserves_competitor prove same-volume move and competing-target preservation.                                                                        | PASS — real OS primitive, inert files                  |
| 3.4  | replace_reviewed/restore_reviewed bind old/new record/acceptance/tree hashes and explicit rollback reference; invalid fields denied before old move. Two-rename maintenance, owned backup, pending/quarantine, guarded cleanup and racing/unknown recovery tests preserve competing data.              | PASS — private mechanics tested; actual update not run |
| 4.1  | Exact YUTA-owned SKILL template with narrow name/description, metadata yuta-adapter-1, root/policy/usage/receipt routing and no tools grants. NOTICE exact accepted hash. Static frontmatter/body test PASS; external quick_validate dependency failure below is not activation evidence.              | PASS — template/static bytes                           |
| 4.2  | query.arguments/\_argv/\_execute: one query, domain ux XOR stack nextjs, max 1..10, JSON, validated absolute Python -B -E -s, sanitized env, exclusive owned cwd, shell=False. Spawn spy checks arguments/environment and unchanged output tree; no synthetic/upstream member execution.               | PASS — gateway/spies only                              |
| 4.3  | test*pre_spawn*\* rejects unknown/persist/force/output-dir/design-system/page/dials/global/skip/script flags before record read/spawn; pending/drift tests deny before scratch. Forbidden MASTER output and global/sibling changes are blocked and preserved for review.                               | PASS — negative controls, not actual upstream smoke    |

### Native host and no-replace evidence

Final suite: 120 tests, 0 failures, 0 errors, 0 skipped; 9.404 seconds reported by
unittest. Actual Win32 calls run on Windows/local NTFS D: (volume serial 1480607138) in exclusively created
`D:/working/yuta/.tmp-yuta-phase-a-<unique>/`, never the real skill target.
Current interpreter version 3.10.11, actual module path:
`C:/Program Files/WindowsApps/PythonSoftwareFoundation.Python.3.10_3.10.3056.0_x64__qbz5n2kfra8p0/python3.10.exe`;
SHA-256 `efe7bd5309ae1a946d199344691312994aa377c7efe15097f8569ee9dc7f20ba`.
The Windows Store alias was not substituted for a hashable executable identity.

The implementation uses MoveFileExW flags = 0; no REPLACE_EXISTING,
COPY_ALLOWED or DELAY_UNTIL_REBOOT. Native competing-target calls fail and
preserve both competitor and unmoved source. Handles use GENERIC_READ |
READ_CONTROL and READ/WRITE sharing without DELETE sharing. A real junction is
rejected; a pinned ancestor cannot be renamed. These observations support the
bounded namespace operation, not power-loss durability or hostile-admin safety.
API semantics were checked against
[Microsoft MoveFileExW documentation](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw).

Development failures retained truthfully: the first 98-test run failed with
11 UNKNOWN_OWNER errors on default C: scratch; no allowlist was weakened.
Scratch was moved to the approved same-volume owned D: fixture area. A second
98-test run exposed one ancestor-rename failure with metadata-only handles.
Using GENERIC_READ established the required sharing constraint; the next
98-test run passed, then expanded suites passed at 111, 119 and finally 120.
These were development-control failures, not upstream M01–M12 results.

### Artifact, NOTICE, receipt and execution boundary

The canonical JSON object digest is
`00a9c767cf1023526f17ed6ed31e6d73cd97fb478619626d56352e1642198a02`.
validate_record requires this exact value; mere counts or an acceptance label
cannot admit changed bytes. The record carries all 196 reviewed metadata rows,
exact 67 projection rows and the separate 129 exclusions. No real tgz was
downloaded/procured, no previous in-memory artifact was reused, and no raw
retained upstream member was read or executed during this Apply.

Accepted and generated NOTICE bytes use the same unmodified template, SHA-256:
`1c0d756bc8feeb1d6dd3dfffe9644f8f812581ae6cb53d6f06c50284bbb0451c`.
The generated-byte claim is the exact byte-forwarding rule and synthetic
projection equality, not a claim that a real NOTICE was installed.
LICENSE_PROVENANCE remains ACCEPTED_FOR_EXACT_ARTIFACT_AND_BOUNDED_USE with
all three residual risks; no MIT/universal-clearance assertion.

Actual repository target `.agents/skills/ui-ux-pro-max/`: ABSENT.
Actual repository staging `.yuta-tooling/ui-ux-pro-max/`: ABSENT.
No sibling installation or real M01–M12, M05–M08 query, M11 discovery/activation,
real update, Sync, Archive, Knowledge, deployment or production action occurred.

The CLI install/replace-reviewed modes deliberately stop at this checkpoint;
private staging/placement/receipt/update/rollback mechanics exist and are tested.
Real artifact orchestration and M01–M12 execution remain tasks 5.x; final setup
validation remains 6.1. There is no claim of an install-ready/activated tool.
Partial staging with an unknown post-failure inventory is preserved for review;
only exact owned unchanged candidate/quarantine trees qualify for cleanup.
Crash-pending never grants normal query use. Rollback refuses any racing target.

### Actual command results

| Command/check actually run                                                     | Exit/result                                                                                                                                                |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `python -B -m unittest discover -s scripts/ui-ux-pro-max -p test_bootstrap.py` | 0; final 120/120 PASS, no skips                                                                                                                            |
| `pnpm docs:check`                                                              | 0; 36 current documents                                                                                                                                    |
| `pnpm architecture:check`                                                      | 0; runtime imports, DB URLs, client boundaries and migration baselines valid                                                                               |
| `pnpm -r --if-present typecheck`                                               | 0; all invoked existing package/app typechecks completed                                                                                                   |
| `pnpm test:ui-pack`                                                            | 0; 12/12 PASS, no skips                                                                                                                                    |
| `pnpm ui:pack:check`                                                           | 1; 2 errors / 90 warnings, NOT PASS; baseline attribution below                                                                                            |
| `openspec validate ui-ux-pro-max-integration --strict`                         | 0; valid                                                                                                                                                   |
| `openspec validate ui-ux-pro-max-integration --strict --no-interactive`        | 0; valid                                                                                                                                                   |
| `openspec status --change ui-ux-pro-max-integration --json`                    | 0; planning artifacts complete, not implementation/QA completion                                                                                           |
| `pnpm exec prettier --check <exact D11 Markdown/JSON paths plus tasks.md>`     | 0; matched files use Prettier style; no formatter write                                                                                                    |
| `git -c core.safecrlf=false diff --check -- <exact D11 paths plus tasks.md>`   | 0; no whitespace errors; untracked bytes separately inventoried/hashed                                                                                     |
| `pnpm format:check`                                                            | 1; exactly 67 inherited warning paths, all unchanged from fresh baseline; NOT PASS                                                                         |
| Supplementary skill-creator quick_validate import against the template         | 1; ModuleNotFoundError: yaml. No pip/dependency install. Closed-template stdlib frontmatter/body test passes; not a general YAML parser or M11 substitute. |
| Read-only host/absence/NOTICE/record hash inspection                           | 0; values recorded above                                                                                                                                   |
| Read-only UI-pack validator JSON diagnostic                                    | 0 for diagnostic execution; returned the same 2 errors / 90 warnings, not validation PASS                                                                  |

Scoped Prettier exact argument set: all D11 paths ending in .md or .json,
plus this tasks.md (15 files). Hash-pinned .template bytes were not rewritten.
Python is covered by stdlib syntax/import execution and unittest, not a
nonexistent Python formatter/lint command. No repository-wide formatter write.

While assembling this checkpoint, scoped Prettier reported this tasks.md only
(exit 1). A read-only formatter preview proved both embedded approved blocks
byte-identical; `pnpm exec prettier --write
openspec/changes/ui-ux-pro-max-integration/tasks.md` formats this evidence file
only. Its final scoped check and embedded hashes are revalidated after writing.

Not run: actual accepted payload M01–M12, real procurement/install/query,
fresh Codex activation, independent final tooling QA; not authorized.
Application builds and cloud/local database suites: NOT RUN, no changed
application/database boundary. Full-change T1–T25/R01–R18/S01–S42 completion
matrix and 03-final-review.md remain unauthorized tasks 6.2–6.4, not fabricated
from Phase-A unit tests.

### UI-pack and global-format baseline attribution

The two `incomplete-impact` errors are in the unchanged
`docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`:
Files expected to modify is unresolved; Files expected to create is unresolved.
Its pre/post SHA-256 is
`cb1391626ee478bb2ddb6ff31c5d7e38e825c89c875f9a8c835d0b42c53e3a92`.
All page-pack files and UI-pack checker/tooling files match the fresh baseline.
The 12 compatibility tests include preserving sealed prompt snapshots after
canonical template changes. No pack was edited/resealed to force a PASS.
This aggregate failure remains visible for Control Tower disposition.

All 67 global-format warning files have unchanged pre/post exact bytes. Their
recorded set is below; no warning belongs to this delivery's 20 D11 targets.

| Inherited warning path                                                                                    | Unchanged baseline/final SHA-256                                   |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.agents/skills/openspec-apply-change/SKILL.md`                                                           | `7c79315715da88639e60f05268206ba72939ef9bf298c6f3195152d09d20b3fe` |
| `.agents/skills/openspec-archive-change/SKILL.md`                                                         | `e0ffaacdb982e7440e97979422a91178cc93220a5805bd07cbdaef82c33284ac` |
| `.agents/skills/openspec-continue-change/SKILL.md`                                                        | `0176d962032c6c36011db0ef30c1cd6130ef6c34ebf359d64cdb21c958949972` |
| `.agents/skills/openspec-explore/SKILL.md`                                                                | `95ed31936b538cbf44b5e3f7f81da50defd256d96048ee370d82b36e8ff5c486` |
| `.agents/skills/openspec-new-change/SKILL.md`                                                             | `84374cb8ab0c6e076933126f688bc7f59abdfa7aced7bb710743dd3bf72e3383` |
| `.agents/skills/openspec-propose/SKILL.md`                                                                | `0c95777dd8cc28f52dc4d6e2a51beeb1917a6638bed51baa710735721784d731` |
| `.agents/skills/openspec-sync-specs/SKILL.md`                                                             | `da0ae40869be60ceff6cd231c75976487875675a7eca390b61a932b081aa91d4` |
| `.agents/skills/openspec-update-change/SKILL.md`                                                          | `23bd9d7d95cc34caee693f7f3671ec8d49f8eca436483d3e29bea43e511b87d5` |
| `.agents/skills/openspec-verify-change/SKILL.md`                                                          | `a049b171b9728a684d901f5e0d6f523bdcd768bc083277a1f6bb9b556cd24b9c` |
| `docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md`                                 | `b64b2552f443f934fcbce610742ba096121a21e1bcd6e72f60815d86f99737d1` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md`                          | `d2868540f14588fc63a1023a4d4c656ade4c87a11d13b1c912a4bc7d35e47716` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md`                   | `91bd52894d8a47298e413c82c14930ed947ff7ae509381a19af21f5dbe4eabd1` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md`                          | `b67b76d8e6b68a94164849e06abcac607136ef5d6fd0847bca69dd87eabb4aaf` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md`       | `c3233400c564b178bfea043a3377ce9dbdf6eef129c974c30ce6cd54a0cd061f` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md`           | `eaaba0ec35c84752b6611e83956a7ee940c7e95c58dabb602add33d8843fa5e1` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md`   | `076ce2c81cd01f730712bbd99b17ccfce2c295659bdcc4d48e20db33838a2297` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md` | `a32137c77beb979e58e6ef302dd6a40260c582da7975917d6234b85d74bfe89f` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md`      | `ce8aae0936e8da8cf2612d0c7800467f1767c1df880365f4b6fa0d91e471fda2` |
| `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md`         | `0e897d0298b1edb364fb8d30af347a7b571a50c5de6bf555a1f1aa7cd6b88799` |
| `docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md`                 | `26cfc8e0e0805a2a716909a18cfb86407f85eb508eefe5657e5c50a64e158ff6` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md`                    | `44f10bc1956b130d26fbe2a5ca37bcbba8e12e571608d6448ced5be26af52e6b` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md`                     | `3bff5078465adc49a91db004dc527cd9fdedf0b3ef435e34affb0824b2a83550` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md`                      | `1c09d910450fd7d1e32b35c6c86f0beabd683b2bae6247fef73b30e71fa7ec36` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md`              | `eab95cce27be4f9e76b2eb3e854d01bde059066f9ac60a39fc9645dbb2a01269` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md`              | `98b375dee27a9a112377ed2feaabe1f7d505ef5c37ab6ec60f6e40c335559880` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md`                        | `d226560949cd6ca073b907fdddae71d3bc17e7e161846fcc9c1703873e985e62` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md`                | `d48f8dca326d38b874867dcd20f641eaa9c6385333010ab6224cd04a57c3f289` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md`                        | `7843820f9cf323127c7024e2e44530ad330c741832983b7a3685708793503012` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md`              | `34f4264630ea7d07428fa58e6409e7a4eb7815250848d27b193225630e49fd0c` |
| `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md`                          | `e2a5517077d2234001c8cb7c0e9b8027b099b409b04d6b26aaa55d2574465f39` |
| `docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md`                             | `14538a6aeb70c26552811935cabe5f3729608a6b2d462ab78c05017aaa19dfba` |
| `docs/features/establishment/general-information/README.md`                                               | `2cd26adfe88321fb22d69d18d79f472faa0da49b9f1f7bcea2e212faf43cad62` |
| `docs/features/establishment/README.md`                                                                   | `3faa9733f0422b39c1959758beb2e06ee2371810680eb89099e83da3b11da815` |
| `docs/features/personnel/README.md`                                                                       | `33214c8a8699b4fffda22afd15d6360f8d4f90c4548adfe98955db772fccdd9d` |
| `docs/PRODUCT_KNOWLEDGE.md`                                                                               | `7723a19aa5ffd7afe0c01d67d45ee352ea33dc0dec3892a2e6f423747e715c2d` |
| `docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md`                                | `03cbb892029eb01c8bac8b48e7c301458e21acde4940c4c5f71f2a08eea6c15c` |
| `docs/reviews/async-interaction-feedback-foundation/02-specs-review.md`                                   | `221fa3040d8c5756c5f00dd9a0d42ec18c314bb00c8f0b286c4f1c3eab628b92` |
| `docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md`               | `134888250a8ee9a874d142866d19209dbad23066a1dd633f6d88434a320d4769` |
| `docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md`           | `258c4405bff05a27a87d631b5fbd42f50148485c8ca72a60e7a1ce2b1cf49c0e` |
| `docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md`                     | `c2ec96123ca08b5e78c682e2fe5d0f87a13a1f543c3cff390c0399a7e4cea1f3` |
| `docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md`                                | `894efffdcb38fedab5956f925968ac0b1cc177a9eed212b30164c2c5f4c286ef` |
| `docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md`                              | `56eb5f4807b82d500ac9b323c60506e2040c25586356beb90b632fbd6b0d9a4d` |
| `docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md`              | `82a4470c3b4f3d415db7964eb514919b9fc30e0ecab6897745145add28a4b306` |
| `docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md`                                             | `8be6ec2bb544955ad27e131a877f3f361741a85cfb96167911a9e95593f47a2a` |
| `docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md`                         | `af36c756a79e5a0c6c8a4566651df7e053e9468e4dffada3991eac9b652b4050` |
| `docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md`                             | `802cf663fbfd2abee4e45a15723450dded0ac1d8a0f75e6a6bcb2b4aa400f3fe` |
| `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md`                                      | `3a8e3ad54c0b25240c2807dcc3e6007032b21e6fe38a2f60485b1304c663f95c` |
| `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md`                           | `3a9f28842b5eb8e6abfba01eb32ce15f3936358fdf543d2e81f8c655df9050ce` |
| `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md`                                       | `13295a7c1760535e16bdf1ca500fc9e5646957d024e2b1dec9ff9a37362b74ce` |
| `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md`                                       | `6ba82212a9b07239905d93f99e54ddcd63cf662d3e2e8c503fc38d909f05cb21` |
| `docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md`                                            | `286e8257f44d98c92e4437264caffc477ac9694ddc111e3bd15086d6c4e8b1c4` |
| `docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md`                                            | `bcc64d6d57ddd7ab838f93ea670a5950befb1a168f7356b8f4f7f1efa9462545` |
| `docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md`                                              | `c756582e4d7b885de4f65ba087dc3f1642b32e51bb81a0c633a0dec379c187c2` |
| `docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md`                               | `54375b5ba943bad17f12cf24876327734ef435399d7b57cdf060bc591cf1aeb1` |
| `docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md`                                   | `0cc1d849c2f83a87802ce2ee8239c3b409f20c37f01dd3c4052be7dac2dbdd29` |
| `docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md`                                              | `56d11486010cc8d5c18cad82242c02759d80e3417ac732320ddd08f5754907b6` |
| `docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md`                                            | `a244f28cabde04d78bc1189517d19514c74f336611ee74cd146228fd7e0c4531` |
| `docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md`                                | `2cdb6edaf3ba6c292c4ee7bf0a9b1e3ee758676a42f6ee46c44b16c333a8f50e` |
| `docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md`                                   | `9b702151136d530c441077f08cf8d415d48832960c2aea9c13e445fe79c97f52` |
| `docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md`                                | `38d3cd2c5812ff5693853b9d9cac2ca25fd8b401a81e9bf463746413ec887a86` |
| `openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md`            | `cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2` |
| `openspec/changes/async-interaction-feedback-foundation/analysis.md`                                      | `7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39` |
| `openspec/schemas/yuta-spec-driven/templates/design.md`                                                   | `e47df296318c6622f0b0911407e16b1578169403b96f61bf35fe1db7f7b417d6` |
| `openspec/schemas/yuta-spec-driven/templates/proposal.md`                                                 | `ea0879a322bb1a3c6e3002c67b5a29e31120dcb17219e3000d43775f48481284` |
| `openspec/schemas/yuta-spec-driven/templates/spec.md`                                                     | `1f370642f106589d901c0568e81b5f7741e9289da48df41b70dd21ad99592a0c` |
| `openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md`                                            | `90e46a1a4e0c2f13679c3eb15cbb560b84b7b4206b1a09ff926f01b7f6624928` |
| `openspec/specs/restaurant-knowledge/validated-knowledge/spec.md`                                         | `203d674ad3f0afc1b4462b5584ca597412e09bf0a2c40f9b7937d736d7a73a70` |

### Exact D11 delivery hashes

All 20 D11 paths below changed/created, plus tasks.md status/evidence only.
No sixth/extra canonical target outside D11 was edited. Existing D11 bodies
were not removed/reworded; changes are bounded additive routing/ignore entries.
Full Tasks hash is returned externally to avoid a self-hash cycle.

| Exact path                                               | Current SHA-256                                                    |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`                | `1c78740b9074e0d2e7cf7c70e183ed297dd4dad5ae72b18c4ec38a612414aad4` |
| `AGENTS.md`                                              | `168fdbb0d4766949c3806ff35b919441f62510483297f509907e4034a98df22a` |
| `docs/README.md`                                         | `a48857650fb617a99b65f11a8ac175d14c1c5cf38ee13c1aa52469228f82509d` |
| `docs/ui/README.md`                                      | `f298bdad13af8d9fe6adc4070c19ee392b18111dcdc51cec5868dea96221a936` |
| `docs/ui/YUTA_FRONTEND_RULES.md`                         | `7ad388d3035fb8e301d44a84cfb95e25bfe15159f2a362311ce6f220021d3cc5` |
| `docs/ui/DELIVERY_WORKFLOW_MODES.md`                     | `3f4c0dd57091a1e9524c4bdfe7d1359579ba9208df2f7cbdbb1aec57ed101fe4` |
| `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`                     | `598cb3fbdf608f3bef034ee20fb3f0754d816359d838a879116d74c525e6e835` |
| `docs/YUTA_WORKFLOW_V3.md`                               | `ec958bac93e6466a24b227d38fca60774b702866eef0a4c3b7b99e7ff61c2594` |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`                 | `32030bac1ea2c1d489c206e808f6fbd2e0f656e31477616a67af71192adb25e1` |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`     | `6fc1782504f0bf75141ba501480ce19502b7da4e12a3161e82abf8d19871f799` |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | `e0f2a612dfcb975e5913a0686136beabd6f3baf8c300a10c03b2c0bada55f2d0` |
| `docs/DEVELOPMENT_WORKFLOW.md`                           | `82eefeb44e4be4e05964200d4821122cd559bcaa673f169c69d52fde9b6f6290` |
| `.agents/skills/yuta-run-change/SKILL.md`                | `17c3ac53292f81d4e45b8b3e56c7d4efcfa07a0612564194f808eed2f81311b9` |
| `.gitignore`                                             | `a372cb177efa791aa16b93fd8e1f15e204215115c111747211949629326315c5` |
| `tooling/ui-ux-pro-max/artifact.json`                    | `ace0288a7d91e7a5d00cf6bf35ccbb35caec13095cf5fe7d6ba2ab1f3b541e05` |
| `tooling/ui-ux-pro-max/SKILL.md.template`                | `8530977c8b873807a6083b73a4d9579c4f2832e207e6938f636a0640cec7e984` |
| `tooling/ui-ux-pro-max/NOTICE.md.template`               | `1c0d756bc8feeb1d6dd3dfffe9644f8f812581ae6cb53d6f06c50284bbb0451c` |
| `scripts/ui-ux-pro-max/bootstrap.py`                     | `819ebfaf700aaaedcf93e52ef14bf624b6a272eaea1aa782316c865db7f1e6e8` |
| `scripts/ui-ux-pro-max/query.py`                         | `55f2291f0c957480e00a742e0cc9aaf18e4511c047f9aa5996fae2d86cb729ec` |
| `scripts/ui-ux-pro-max/test_bootstrap.py`                | `c5d5748a3b9a271d9026f189023711a78da6c66206d78206eadfa81bd4db1a0f` |

### Protected and concurrent integrity

Proposal/Analysis/Specs/Design, Gate review packets, license packet and
non-D11 protected source bytes remain unchanged. Embedded Implementation Plan
and Technical Contract exact hashes remain, respectively:
`576d8ce8cb9ae117ae4b9a068fa10c47a1c9e12e76e1035360e0fe4fda0f4382`;
`c51f4560fb8241d6cb92df6877ae6e046932e3e12b9c047f05c8fc4f89b13a9c`.
The following Gate 1 non-D11 protected rows still match; D11 changes are
authorized differences, not an integrity bypass.

| Protected path                                              | Unchanged SHA-256                                                  |
| ----------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/ui-ux-pro-max-integration/.openspec.yaml` | `26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820` |
| `openspec/changes/ui-ux-pro-max-integration/analysis.md`    | `88198e944804810a145e463513127e498a9e7dfccb19ef0656dcea019bb235d7` |
| `openspec/changes/ui-ux-pro-max-integration/proposal.md`    | `04454de85462b9f571b18022f250a9fdb996b43636eb22a3a7710897b2ba5d45` |
| `.agents/skills/yuta-finish-change/SKILL.md`                | `90522895c23e6d4e7943344e915be94cdfe15a40bc7b3951387e349e3225ce8f` |
| `docs/AUTHORITY_MODEL.md`                                   | `ff82cba785e2f81d9605f20aa9d311a3d7d8abc4008384fabc159d54b949e01f` |
| `docs/CURRENT_STATE.md`                                     | `d279d0d2e76de9498d2266c742cc3408f9be471174f04cb5413fd62d3c80b105` |
| `docs/LIFECYCLE_STATUS_MODEL.md`                            | `8f9f45a918f37a538d211e1981f7109fbbed6543d0e28b6eff91d89d9a8e0b1f` |
| `docs/MODULE_REGISTRY.md`                                   | `7205d06cd76e1e89f3fb0f755dbd295fe8191ec31ef97b8eafb8d69b06a1a5b3` |
| `docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`            | `27e7cd6a621c6a3f490949041d0d87e1093ffa0d6f045f4356ab39255a0b4a8f` |
| `docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`           | `edf97a0988b6edfa26c4acc04c89ff91eec6ec8f6df3ac16d3b50d1c895d1bd5` |
| `docs/PRODUCT_KNOWLEDGE.md`                                 | `7723a19aa5ffd7afe0c01d67d45ee352ea33dc0dec3892a2e6f423747e715c2d` |
| `docs/ui/PAGE_PACK_PROTOCOL.md`                             | `68ecaa85ba8be73e56fc9903f29dc6ac78ef9803d943ca54bd6cda36145d51af` |
| `openspec/config.yaml`                                      | `d8d2b2aefd4b52e48d3e419b94234460a158820ab3aeb3325ced92d9d4965d8a` |
| `openspec/schemas/yuta-spec-driven/schema.yaml`             | `23ecc50057c4d68342c1688ef5723c3cabe75fe8a549a1401a998cfff605dba9` |
| `package.json`                                              | `fc6fdde9d6ee80a5a8861c94082c64829a18dafde2eae238f5d1cbc4e0d31595` |
| `packages/ui/src/index.ts`                                  | `ba8a9a3f0b41736294396036dd9fbca4684e3dc7f1123fe10d93245c36ee8f6d` |
| `packages/ui/src/styles/global.css`                         | `78a58bbb56c56aa17b442e677cfad61bf380f0df768ff748f78030b4d1ac9b81` |
| `pnpm-lock.yaml`                                            | `1ccc65b174137c8e4a15aa655f4c32e7e4fa736d55982ec7f41c3c85db733275` |

Concurrent changes observed since the fresh Apply baseline are only the two
Pointage review paths below. They were not edited, reverted or adopted into this
delivery. Existing Pointage/Formalités/async-interaction dirty work remains
outside this change; existence does not imply approval/readiness.

| Concurrent path                                                               | Pre-Apply SHA-256                                                  | Observed SHA-256                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`              | `637e763f94f4bc52bd5d419e92de00bc5680ef3267598173f34992683a474b54` | `e26f506559f7fac1bda8a01a282250d355cc582afdb538538b38f85a22b2b09e` |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `ff60d56bd4179f3e89a9b87ab82ab71be2d7a3681b108a74327ebebc1d6ed7c1` | `6cf0a188e26c209f20de2ad0c8d83902a28a38a25cb55eea6a56d134b1ac5a87` |

Production: NOT AUTHORIZED.
STOP at PRE_PROCUREMENT_CHECKPOINT; do not proceed to task 5.1.
