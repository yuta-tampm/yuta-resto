# Gate 2 — Repository Format Policy Specs

Change: repository-format-policy-and-baseline-remediation
Gate: 2 — Specs Review
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-13
Schema: yuta-spec-driven
Analysis conclusion: BLOCKED_NEEDS_REVIEW — historical artifact preserved; current explicit decisions resolve requirement blockers
Sensitive change: YES

## Current approval and strict boundary

Approval source: explicit current-user Control Tower instruction, “REPOSITORY FORMAT POLICY — GATE 1 APPROVED → SPECS ONLY”.
Gate 1: APPROVED for the preserved bindings below, with the six explicit policy decisions recorded here. This is not approval inferred from a command or from this packet.

The prior Analysis and Gate-1 packet describe unresolved questions at their historical checkpoint. The current instruction explicitly resolves those questions and permits only Specs/Gate-2 evidence. Accordingly, their exact bytes, historical recommendation and approval-status text remain unchanged; no retroactive edit or generic rebaseline is performed. This bounded current-user instruction overrides the ordinary skill metadata/revision step for this turn only. Current operational readiness: READY_FOR_SPECS fulfilled; Gate 2 remains awaiting human review.

Only new delta Specs and this packet are delivery. No Design, Sensitive Design artifact, Tasks/TIC, Apply, configuration, baseline formatting, generated/history/archive mutation, parent continuation, Sync, Archive or Knowledge update.

## Gate-1 integrity PRE and POST

Exact file bytes hashed using Node `crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')`; independently checked with PowerShell `Get-FileHash -Algorithm SHA256`. PRE equals POST for all three protected artifacts:

| Path                                                                                 | PRE SHA-256                                                      | POST SHA-256                                                     |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/repository-format-policy-and-baseline-remediation/01-analysis-review.md | 2dcbb5d283fd21e19bc859f42d9713d7ccfa23beead9752e117b8cce7d4559d0 | 2dcbb5d283fd21e19bc859f42d9713d7ccfa23beead9752e117b8cce7d4559d0 |
| openspec/changes/repository-format-policy-and-baseline-remediation/analysis.md       | 7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9 | 7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9 |
| openspec/changes/repository-format-policy-and-baseline-remediation/proposal.md       | 4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0 | 4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0 |

Delta path: `openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md`.
Delta SHA-256: `0567fbaa45fc37ac3b687cf34f2625f6278db7d1429e9d8ea1493b065366880b`.
Exactly one new capability, `repository/artifact-format-validation`, as declared in Proposal. No main spec changed.

## Authority and source review

Read current Proposal, Analysis, Gate-1 packet; root instructions (no nested AGENTS found in affected docs/openspec paths); docs index and CURRENT_STATE; Authority Model; workflow approval/invalidation rules; activation upgrade rules; normativity bounded-edit rules; archive README; package scripts; .prettierrc.json; .prettierignore; CI and schema configuration; installed OpenSpec skill-generation source.

Package/CI still use `format:check = prettier --check .`. This is implemented-state evidence, not evidence that the proposed class-aware contract exists. The installed generator supports generation and an optional instruction transform; source inspection alone does not prove full-pipeline reproducibility.

Language follows the selected schema's artifact context (Vietnamese, structural headings and SHALL/MUST in English). UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE, carried from Analysis; no UI design or external-advice self-validation.

## Gate-1 decision mapping

| Explicit decision       | Requirements         | Resolution                                                                                                                                       |
| ----------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1 Archive preservation  | R1, R3, R6           | Evidence-backed admission only; exact bytes by default; append/new revision preserves original record; no directory-wide immutability assumption |
| 2 Historical/hash-bound | R1, R3, R5           | Owner-bound admission; outside mutable scope only with mandatory preservation; no silent rewrite or general rebind                               |
| 3 Generated             | R1, R3, R4           | Reproducibility mandatory; source/tool/inventory identity; no hand-format; unknown and reviewed-deviation cannot fabricate PASS                  |
| 4 Coverage              | R1, R2, R3, R10, R11 | Complete classification; mandatory alternates; unknown, stale, unresolved overlap, skipped checks and failures fail closed                       |
| 5 Active ownership      | R1, R7, R8, R9       | Owner coordination, reviewed lifecycle transition, exact revision approval; known overlap WAIT_FOR_OWNER                                         |
| 6 Baseline migration    | R9, R10, R12         | Exact 67 preimages; stop on drift/status change; approved subset only; no automatic parent advancement                                           |

R8 additionally preserves the explicitly requested normative path/preimage/diff approval, parsed requirement/scenario equivalence, schema/template structure, strict validation and no readiness promotion. R11 supplies deterministic, non-secret evidence. R12 separates prerequisite success from authorization to resume the parent.

## Requirement and scenario coverage

12 requirements / 58 scenarios. IDs R1.1–R12.3 are local traceability labels; each requirement's actual range is determined by its count below. Every scenario has observable WHEN/THEN outcomes, not an implementation task.

| Requirement                                 | Scenarios |
| ------------------------------------------- | --------- |
| R1 Phân loại artifact đầy đủ và fail-closed | 9         |
| R2 Mutable formatting được thực thi         | 3         |
| R3 Alternate validation bắt buộc            | 4         |
| R4 Generated authority và reproducibility   | 7         |
| R5 Historical và hash-bound preservation    | 5         |
| R6 Archived provenance preservation         | 6         |
| R7 Active change ownership                  | 4         |
| R8 Normative review và semantic equivalence | 5         |
| R9 Exact reviewed baseline migration        | 6         |
| R10 Mandatory validation orchestration      | 3         |
| R11 Deterministic audit evidence            | 3         |
| R12 Parent hold và historical failure truth | 3         |

## Review assessment

- Completeness: all 12 requested groups covered, including six known classes, unknown/stale/overlap, mutable failure, all four alternate-validator failure conditions and aggregation.
- Fail-closed: exclusion never equals successful validation. Unknown class, stale classification/configuration, missing or unresolved identity, failed/skipped/incomplete alternate check, source/version/inventory drift, stale historical binding or unauthorized revision cannot yield overall PASS.
- Generated: R4.1–R4.7 distinguish proven exact reproduction, unexplained differences, version drift, missing/unexpected output, manual drift and reviewed-but-unproven deviation. Current evidence remains only 1 pure-generation match and 8 not explained by full-pipeline comparison. No 9/9 claim; no generation or upgrade executed.
- Historical: R5 preserves original exact path/bytes and reference meaning. New reviewed correction has its own identity. Incidental digest mentions are not sufficient admission; no migration that replaces old approval hashes.
- Archive: R6 requires actual admitted provenance; arbitrary docs/archive files do not become exempt. Append means an additional record/revision, not alteration of an original admitted record's exact bytes.
- Active: R7 preserves owner authority, exact revision approval and lifecycle entry/exit. Known async-feedback overlap remains WAIT_FOR_OWNER. No current-owner artifacts edited.
- Normative: R8 requires explicit approval, exact preimage/diff, applicable parsed/structural equivalence and strict validation. Formatting success alone cannot change behavior or lifecycle.
- Migration: R9 binds initial exact 67 inventory and owner/status; counts are historical migration evidence, not permanent limits. Subset approval is neither automatic rebaseline nor whole-baseline completion.
- Orchestration: R10 requires all checks to participate in overall results. No concrete manifest, topology, script, library or data representation selected.
- Audit: R11 makes class/owner/validator/reasons and missing/stale/drift findings attributable and logically deterministic without secret disclosure.
- Parent: R12 retains historical failed outcomes; even fresh prerequisite PASS requires separate parent continuation authorization.
- Non-requirements: no UI/Product/runtime/auth/database changes, blanket ignores, arbitrary rebasing, historical rewrite, generated hand-formatting, automatic active mutation, lifecycle/readiness promotion, parent progression or production.

No unresolved requirement-level authority decision was filled by assumption. Full-pipeline evidence, concrete classification representation/precedence, safe path handling, alternate implementation, migration controls and recovery remain Design/implementation work; they are not claimed complete by Specs. Sensitive Design is REQUIRED LATER, not created or approved here.

## Actual validation evidence

| Command/check                                                                                                                                                                                                                                                                   | Result                                       | Scope                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- |
| `openspec status --change repository-format-policy-and-baseline-remediation --json`                                                                                                                                                                                             | exit 0                                       | Selected local root, yuta-spec-driven; Specs initially absent          |
| `openspec instructions specs --change repository-format-policy-and-baseline-remediation --json`                                                                                                                                                                                 | exit 0                                       | Returned capability path rules, Purpose and WHEN/THEN contract         |
| `openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive`                                                                                                                                                                                 | exit 0, valid                                | Current delta; not an implementation test                              |
| `pnpm docs:check`                                                                                                                                                                                                                                                               | exit 0, PASS, 36 current documents           | Documentation consistency                                              |
| `pnpm architecture:check`                                                                                                                                                                                                                                                       | exit 0, PASS                                 | Runtime imports, database URLs, client boundaries, migration baselines |
| `pnpm exec prettier --check openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md`                                           | exit 0, PASS                                 | Only two new delivery files                                            |
| `git diff --check -- openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md` plus explicit untracked whitespace/content check | exit 0, PASS; exact embedded spec MATCH      | Git diff alone omits these untracked files                             |
| Exact baseline comparison against parent retained 67-row table                                                                                                                                                                                                                  | PASS, 67/67, zero drift                      | Read-only, no baseline mutation                                        |
| Current parent Tasks and receipt inspection                                                                                                                                                                                                                                     | Exact Tasks hash preserved; receipt verified | No parent validation closure rerun                                     |

The initial read of nonexistent `.prettierrc` returned a file-not-found diagnostic; discovery located and read actual `.prettierrc.json`. No source repair was needed.

Global `pnpm format:check`, recursive typecheck, runtime tests/builds, schema regeneration and parent task 6.1 were NOT RUN in this Specs-only turn. The inherited global formatting failure remains historical, not relabelled or remediated. No executable validation contract is implemented by these checks; technical implementation VERIFY/QA are not claimed.

## Scoped path integrity and parent hold

PRE snapshot: HEAD `415990386327aaccab3c32b1fef0569a0fde7f3a`, 2,629 existing Git-listed tracked/untracked non-ignored files. Snapshot command uses `git ls-files --cached --others --exclude-standard -z`, unique sorted paths, exact SHA-256 for existing files, plus `git status --porcelain=v1 -uall`. POST comparison: all 2,629 pre-existing paths/bytes unchanged, zero removed paths, HEAD unchanged, exactly two added files (delta spec and this packet). This includes pre-existing untracked work. No protected Gate-1 or baseline hash changed. The exact embedded spec content equals the delta file, and both new files pass explicit trailing-whitespace checks.

No pre-existing Pointage, parent integration, Formalités metadata or other bytes changed during Specs preparation. Ignored installed receipt was separately read, not changed.

Parent Tasks SHA-256: `36e66b08a712d99a12f3f3243a803bced9bf707a7bb6ea9b47b83ec7e896b504`.
Receipt SHA-256: `1ff4b04f62e8c76ad6242ca0640f564618e4f3c89d18f767f6bf9cc6193ba1c7`, state VERIFIED.
Parent Tasks: 19/23. Task 6.1: FAIL / UNCHECKED. Tasks 6.2–6.4: BLOCKED.
Production: NOT_AUTHORIZED.

## Exact delta spec content

<!-- prettier-ignore -->
````markdown
## Purpose

Thiết lập contract validation formatting theo authority và class của artifact, bảo đảm coverage đầy đủ, kiểm tra thay thế bắt buộc và bảo toàn integrity khi migration repository baseline.

## ADDED Requirements

### Requirement: R1 Phân loại artifact đầy đủ và fail-closed

Repository validation SHALL phân loại mọi artifact tham gia phạm vi repository formatting validation bằng admission evidence hiện hành, owner hoặc policy authority và nghĩa vụ validation xác định. Sáu class được nhận diện là `MUTABLE_FORMATTED`, `GENERATED_EXTERNAL_OR_DERIVED`, `HISTORICAL_HASH_BOUND`, `ARCHIVED_PRESERVED`, `ACTIVE_CHANGE_OWNED` và `NORMATIVE_REVIEW_REQUIRED`. `UNCLASSIFIED`, classification thiếu hoặc stale, hay overlap chưa giải quyết SHALL làm overall validation FAIL. Một artifact SHALL NOT bị bỏ qua cả mutable formatting lẫn alternate validation; class không tự cấp quyền sửa file. Admission và chuyển class SHALL giữ các nghĩa vụ authority/integrity còn áp dụng, không dùng tên đường dẫn hoặc lỗi formatter làm bằng chứng miễn kiểm tra.

#### Scenario: R1.1 Mutable artifact có authority

- **WHEN** artifact được phân loại hiện hành là mutable với owner xác định
- **THEN** validation SHALL đưa artifact vào mutable-format checking và báo class cùng owner

#### Scenario: R1.2 Generated artifact có admission evidence

- **WHEN** artifact có source/generator authority và được nhận diện là generated
- **THEN** validation SHALL áp dụng nghĩa vụ reproducibility của R4 thay vì yêu cầu hand-format output

#### Scenario: R1.3 Historical artifact được nhận diện tường minh

- **WHEN** historical/hash-bound artifact có admission evidence và owner hợp lệ
- **THEN** artifact SHALL nằm ngoài mutable-format scope nhưng bắt buộc chịu preservation validation của R5

#### Scenario: R1.4 Archived provenance được nhận diện tường minh

- **WHEN** artifact được admitted là archived provenance với owner và historical identity
- **THEN** validation SHALL áp dụng exact-byte preservation của R6

#### Scenario: R1.5 Active artifact thuộc owner hiện hành

- **WHEN** artifact đang thuộc active change với owner và lifecycle binding hiện hành
- **THEN** validation SHALL giữ owner control của R7, không suy ra formatting exemption chỉ từ trạng thái active

#### Scenario: R1.6 Normative artifact yêu cầu review

- **WHEN** artifact là normative spec hoặc schema/template thuộc authority đã xác định
- **THEN** validation SHALL áp dụng review/equivalence obligations của R8, không coi là ordinary mutable document

#### Scenario: R1.7 Artifact chưa phân loại

- **WHEN** có artifact trong validation scope chưa có classification hợp lệ
- **THEN** overall validation SHALL FAIL với artifact identity và missing-classification reason, không silently exclude

#### Scenario: R1.8 Classification stale

- **WHEN** classification không còn khớp owner, lifecycle hoặc authority hiện hành
- **THEN** overall validation SHALL FAIL vì stale classification, không tự cập nhật baseline

#### Scenario: R1.9 Overlap chưa giải quyết

- **WHEN** các classification áp dụng cho cùng artifact tạo nghĩa vụ mâu thuẫn chưa được authority giải quyết
- **THEN** overall validation SHALL FAIL và yêu cầu review, không chọn class ít kiểm tra hơn để PASS

### Requirement: R2 Mutable formatting được thực thi

Artifact thuộc mutable-format scope SHALL được kiểm tra bằng repository formatting policy hiện hành. Bất kỳ mutable formatting failure nào SHALL làm overall validation FAIL. Artifact SHALL NOT bị loại khỏi scope chỉ vì hiện tại không đạt Prettier; thay đổi classification cần authority và admission evidence độc lập với formatter result.

#### Scenario: R2.1 Mutable formatting hợp lệ

- **WHEN** mutable artifact đạt formatting policy hiện hành
- **THEN** mutable check SHALL báo PASS cho artifact đó, không thay thế các kiểm tra bắt buộc khác

#### Scenario: R2.2 Mutable formatting thất bại

- **WHEN** một mutable artifact không đạt formatting policy
- **THEN** overall validation SHALL FAIL và chỉ rõ artifact thất bại

#### Scenario: R2.3 Loại file chỉ để bỏ lỗi

- **WHEN** đề xuất bỏ một mutable artifact khỏi format scope chỉ dựa trên Prettier failure
- **THEN** validation SHALL từ chối exclusion đó và không báo overall PASS

### Requirement: R3 Alternate validation bắt buộc

Mọi artifact không được mutable-format checking SHALL có alternate validator phù hợp với class và tham gia overall result. Mọi non-mutable-format class SHALL có nghĩa vụ validation tường minh; active/normative authority checks vẫn bắt buộc khi formatting cũng áp dụng. Missing validator, unresolved artifact identity, stale validator configuration hoặc alternate validation failure SHALL làm overall validation FAIL, kể cả mutable checks đều PASS.

#### Scenario: R3.1 Thiếu alternate validator

- **WHEN** artifact bị loại khỏi mutable-format checking nhưng không có mandatory alternate validator
- **THEN** overall validation SHALL FAIL vì coverage thiếu

#### Scenario: R3.2 Không resolve được identity

- **WHEN** alternate validator không xác định được exact artifact identity cần kiểm tra
- **THEN** overall validation SHALL FAIL, không coi artifact là absent khỏi scope

#### Scenario: R3.3 Validator configuration stale

- **WHEN** validator configuration không còn tương ứng class/authority binding được review
- **THEN** overall validation SHALL FAIL và báo stale binding

#### Scenario: R3.4 Alternate validator thất bại

- **WHEN** mandatory alternate validator thất bại dù mutable checks PASS
- **THEN** overall validation SHALL FAIL, giữ nguyên failure reason của alternate check

### Requirement: R4 Generated authority và reproducibility

Generated artifacts SHALL nằm ngoài mutable-format scope với mandatory reproducibility validation gắn known generator/source authority, generator/tool version hoặc equivalent identity, và expected inventory. Manual formatting/patching generated output SHALL NOT là remediation hợp lệ. Reproducibility chưa chứng minh SHALL được báo UNKNOWN hoặc unresolved deviation và SHALL NOT được tính là PASS. Reviewed deviation SHALL được phân biệt với unexplained deviation nhưng approval của deviation tự nó SHALL NOT thay thế chứng minh reproducibility trên approved generation scope. Đổi generator/source/version hoặc pipeline cần review riêng; contract này không tự cho phép regeneration hay chấp nhận byte mới.

#### Scenario: R4.1 Exact generation được chứng minh

- **WHEN** approved generator/source/version tái tạo đúng exact output bytes và expected inventory
- **THEN** generated validation SHALL báo reproducibility PASS cho đúng scope đã kiểm tra

#### Scenario: R4.2 Unexplained generated deviation

- **WHEN** output khác generation evidence và full-pipeline comparison chưa giải thích được khác biệt
- **THEN** validation SHALL giữ reproducibility chưa chứng minh và overall FAIL, không suy diễn PASS từ generated label

#### Scenario: R4.3 Generator version drift

- **WHEN** generator/tool identity hiện hành khác identity đã review
- **THEN** generated validation SHALL FAIL vì stale binding và yêu cầu review trước khi chấp nhận generation mới

#### Scenario: R4.4 Thiếu generated artifact

- **WHEN** một artifact thuộc expected generated inventory không tồn tại
- **THEN** generated validation SHALL FAIL với missing identity

#### Scenario: R4.5 Generated artifact ngoài inventory

- **WHEN** generation scope chứa output không thuộc expected inventory đã review
- **THEN** generated validation SHALL FAIL với unexpected identity, không tự mở rộng inventory

#### Scenario: R4.6 Manual edit hoặc formatter drift

- **WHEN** generated bytes bị manual edit hoặc formatter rewrite khác approved reproducible output
- **THEN** generated validation SHALL FAIL và không chấp nhận hand-format làm cách khôi phục authority

#### Scenario: R4.7 Reviewed deviation chưa có reproducibility

- **WHEN** deviation được review nhưng chưa có evidence tái tạo approved output bằng approved generation scope
- **THEN** evidence SHALL giữ reviewed-deviation status riêng, reproducibility SHALL NOT PASS và overall validation SHALL FAIL

### Requirement: R5 Historical và hash-bound preservation

Historical/hash-bound admission SHALL có evidence, exact path/byte identity và owner tường minh; incidental hash reference không tự đủ admission. Artifact admitted SHALL nằm ngoài mutable-format scope và SHALL bảo toàn approved historical identity cùng reference integrity. Silent byte rewrite giữ approval identity cũ SHALL FAIL. Correction SHALL dùng explicitly approved revision/new-record path giữ original bytes và approval meaning cũ, không cấp general historical-rebind migration.

#### Scenario: R5.1 Original exact bytes được giữ

- **WHEN** historical artifact tồn tại với exact approved path/bytes và reference binding hợp lệ
- **THEN** preservation validation SHALL PASS mà không yêu cầu reformat original

#### Scenario: R5.2 Byte thay đổi không có revision

- **WHEN** historical bytes thay đổi nhưng vẫn dùng approval identity cũ
- **THEN** preservation validation SHALL FAIL, không thay hash cũ để hợp thức hóa bytes mới

#### Scenario: R5.3 Historical artifact bị thiếu

- **WHEN** approved historical path không tồn tại
- **THEN** preservation validation SHALL FAIL với missing artifact reason

#### Scenario: R5.4 Hash identity stale

- **WHEN** preservation binding hoặc approval reference không còn khớp historical identity được duyệt
- **THEN** preservation validation SHALL FAIL vì stale identity dù file hiện tại đạt formatter

#### Scenario: R5.5 Correction bằng approved revision

- **WHEN** owner duyệt exact new revision/record và original cùng historical approval vẫn nguyên vẹn
- **THEN** validation SHALL nhận diện riêng revision mới theo approval của nó và tiếp tục kiểm tra original theo binding cũ

### Requirement: R6 Archived provenance preservation

Chỉ artifact có evidence-backed admission, owner và approved historical identity mới SHALL được coi là `ARCHIVED_PRESERVED`. Với admitted record, policy SHALL là `EXACT_BYTE_PRESERVATION_BY_DEFAULT`; correction SHALL là append/new revision không sửa bytes của original admitted record. Silent archive rewrite SHALL bị cấm. Tên hoặc vị trí dưới `docs/archive` SHALL NOT tự tạo admission, immutability hoặc exclusion khỏi validation.

#### Scenario: R6.1 Archive được giữ nguyên

- **WHEN** admitted archive record khớp exact approved identity
- **THEN** archive preservation SHALL PASS mà không yêu cầu mutable formatting

#### Scenario: R6.2 Archive content drift

- **WHEN** bytes của admitted archive record khác preservation binding
- **THEN** archive validation SHALL FAIL và giữ historical binding để review

#### Scenario: R6.3 Archive bị thiếu

- **WHEN** admitted archive record không còn ở approved path
- **THEN** archive validation SHALL FAIL, không silently shrink inventory

#### Scenario: R6.4 Correction là new record

- **WHEN** correction được owner duyệt thành record/revision bổ sung, original admitted record giữ exact bytes
- **THEN** validation SHALL kiểm tra original và correction bằng identity riêng, không gán correction vào approval cũ

#### Scenario: R6.5 Rewrite original archive

- **WHEN** hygiene correction đề nghị viết lại original admitted record để làm nó current hoặc format-clean
- **THEN** validation SHALL từ chối rewrite đó theo correction model và không báo preservation PASS

#### Scenario: R6.6 Arbitrary archive-directory path

- **WHEN** một file dưới `docs/archive` không có archived-provenance admission evidence
- **THEN** validation SHALL NOT tự nhận file là immutable/exempt; nếu chưa có classification hợp lệ khác, overall result SHALL FAIL

### Requirement: R7 Active change ownership

Active-change-owned artifacts SHALL giữ quyền kiểm soát của active owner và current review/lifecycle bindings. Hygiene tooling SHALL NOT mutate artifact nếu chưa có explicit owner coordination/authorization cho exact revision. Entry/exit classification SHALL tuân theo approved lifecycle và giữ historical evidence; passing checks hoặc path move không tự chuyển ownership. Khi coordination chưa có, affected remediation SHALL giữ `WAIT_FOR_OWNER`, không suy ra approval từ technical PASS.

#### Scenario: R7.1 Active owner giữ artifact

- **WHEN** active owner chưa cho phép hygiene revision
- **THEN** artifact SHALL giữ nguyên, affected remediation SHALL báo WAIT_FOR_OWNER và không claim completion nhờ bỏ kiểm tra

#### Scenario: R7.2 Owner-authorized revision

- **WHEN** owner duyệt exact path/preimage/revision trong lifecycle hiện hành
- **THEN** validation SHALL kiểm tra revision theo approval mới và giữ lịch sử cũ, không tái sử dụng stale approval

#### Scenario: R7.3 Hygiene mutation không có approval

- **WHEN** hygiene work sửa active artifact ngoài owner authorization
- **THEN** ownership/integrity validation SHALL FAIL dù formatting PASS

#### Scenario: R7.4 Approved lifecycle exit

- **WHEN** artifact rời active state qua approved lifecycle transition
- **THEN** classification SHALL được review theo owner/authority mới, giữ lịch sử và mandatory validation coverage; không auto-exempt hoặc auto-mutate

### Requirement: R8 Normative review và semantic equivalence

Normative specs/schema/templates SHALL NOT được xử lý như ordinary mutable docs. Formatting mutation SHALL cần explicit owner approval gắn exact path, preimage và exact diff; parsed requirement/scenario meaning equivalence khi áp dụng; schema/template structural equivalence khi áp dụng; và strict validation phù hợp. Thiếu hoặc fail bất kỳ nghĩa vụ áp dụng nào SHALL ngăn acceptance. Formatting alone SHALL NOT đổi normative behavior, approval meaning hay lifecycle/readiness.

#### Scenario: R8.1 Exact approved equivalent change

- **WHEN** exact path/preimage/diff được owner duyệt, applicable semantic/structural equivalence và strict validation đều PASS
- **THEN** validation SHALL chấp nhận bounded formatting revision, không cấp quyền sửa ngoài diff

#### Scenario: R8.2 Missing approval hoặc preimage drift

- **WHEN** thiếu exact owner-approved diff hoặc path/preimage không còn khớp
- **THEN** affected mutation SHALL dừng và normative validation SHALL FAIL

#### Scenario: R8.3 Parsed requirement hoặc scenario thay đổi nghĩa

- **WHEN** formatting candidate làm đổi requirement/scenario meaning dù formatter PASS
- **THEN** equivalence validation SHALL FAIL và yêu cầu behavioral review, không coi là formatting-only

#### Scenario: R8.4 Structural hoặc strict validation thất bại

- **WHEN** applicable schema/template structure không tương đương hoặc strict validation không PASS
- **THEN** normative validation SHALL FAIL và không chấp nhận revision

#### Scenario: R8.5 Không lifecycle promotion

- **WHEN** normative formatting revision đạt mọi check áp dụng
- **THEN** lifecycle/readiness và production status SHALL giữ nguyên, không suy ra implementation/deployment completion

### Requirement: R9 Exact reviewed baseline migration

Initial migration SHALL bind đúng reviewed 67-file baseline bằng exact path/hash và current owner/status trước mutation. Mọi path SHALL giữ exact baseline tới khi có separate review cho bounded revision. Drift, missing/unexpected baseline member hoặc owner/status change SHALL dừng affected migration; wildcard rebaseline và auto-rebaseline SHALL bị cấm. Approved subset không miễn kiểm tra phần còn lại hay mở rộng scope. Các số lượng class trong migration evidence không SHALL trở thành giới hạn phân loại lâu dài; artifact mới vẫn chịu R1.

#### Scenario: R9.1 Exact baseline match

- **WHEN** toàn bộ reviewed 67 paths/hashes và owner/status vẫn khớp
- **THEN** migration precheck SHALL PASS nhưng SHALL NOT tự cấp mutation authorization

#### Scenario: R9.2 Một file drift

- **WHEN** một baseline file khác exact reviewed hash trước mutation
- **THEN** affected migration SHALL STOP và báo expected/current identity, không tự rebaseline

#### Scenario: R9.3 Baseline member missing

- **WHEN** một reviewed baseline path bị thiếu
- **THEN** affected migration SHALL STOP, không giảm baseline size để PASS

#### Scenario: R9.4 Unexpected baseline member

- **WHEN** migration candidate có thêm path ngoài reviewed baseline
- **THEN** affected migration SHALL STOP, không tự nhập file mới vào authorization; repository artifact mới vẫn cần classification đầy đủ

#### Scenario: R9.5 Owner hoặc status đổi

- **WHEN** baseline bytes không đổi nhưng owner/status binding đã thay đổi
- **THEN** affected migration SHALL STOP cho owner/lifecycle review trước mutation

#### Scenario: R9.6 Approved subset remediation

- **WHEN** exact subset có separate owner approval, preimages khớp và class obligations được đáp ứng
- **THEN** remediation SHALL chỉ áp dụng subset đó, giữ nguyên phần chưa được duyệt và SHALL NOT claim toàn baseline hoàn thành khi checks còn thiếu

### Requirement: R10 Mandatory validation orchestration

Repository-level formatting validation entry contract SHALL tổng hợp mutable formatting, classification completeness và mọi mandatory alternate validator theo fail-closed semantics. Overall PASS SHALL chỉ có khi tất cả applicable obligations có current successful evidence. Excluded artifact SHALL NOT có đường đi tới overall PASS nếu alternate validation không thực sự tham gia. Missing/skipped/incomplete required check SHALL NOT tương đương PASS. Contract không chọn command topology, manifest representation hoặc implementation location.

#### Scenario: R10.1 Tất cả obligations PASS

- **WHEN** classification đầy đủ, mutable checks và mọi applicable alternate check đều có current PASS
- **THEN** entry contract SHALL trả overall PASS với coverage evidence tương ứng

#### Scenario: R10.2 Một obligation FAIL

- **WHEN** một required obligation FAIL dù các checks khác PASS
- **THEN** entry contract SHALL trả overall FAIL và giữ nguyên failed obligation

#### Scenario: R10.3 Bỏ alternate check

- **WHEN** artifact bị excluded khỏi mutable checking và required alternate check bị skip, không chạy hoặc chưa hoàn tất
- **THEN** entry contract SHALL FAIL, không dùng mutable-only PASS làm overall result

### Requirement: R11 Deterministic audit evidence

Validation SHALL cung cấp deterministic evidence đủ để đối chiếu artifact identity, class, owner/policy authority, validator áp dụng và pass/fail reason, gồm missing/stale classification và unexpected drift. Cùng artifact state, authority/configuration bindings và check results SHALL cho cùng logical evidence; incidental run metadata không SHALL che khác biệt validation. Evidence SHALL NOT yêu cầu lộ secrets hoặc private configuration content.

#### Scenario: R11.1 Cùng inputs cùng logical evidence

- **WHEN** hai validation runs có cùng artifact state, authority bindings và check results
- **THEN** logical evidence SHALL đối chiếu tương đương cho identity/class/owner/validator/reason, không phụ thuộc thứ tự phát hiện artifact

#### Scenario: R11.2 Missing stale và drift có attribution

- **WHEN** validation phát hiện missing classification, stale binding hoặc unexpected drift
- **THEN** evidence SHALL chỉ rõ artifact liên quan và failure category để reviewer phân biệt, không chỉ báo generic PASS/FAIL

#### Scenario: R11.3 Không lộ private configuration

- **WHEN** failure liên quan configuration chứa private hoặc secret content
- **THEN** evidence SHALL báo safe identity/reason đủ review mà không in secret/private contents

### Requirement: R12 Parent hold và historical failure truth

Parent `ui-ux-pro-max-integration` task 6.1 SHALL giữ blocked cho tới khi approved repository formatting validation contract thực sự PASS trên migrated repository state. Historical failed commands SHALL giữ nguyên failed outcomes; không retroactive PASS. PASS của prerequisite SHALL chỉ là evidence cho separate authorized parent continuation, không tự check task, tiến task 6.2–6.4, đổi receipt, hoặc promote lifecycle/readiness/production.

#### Scenario: R12.1 Prerequisite chưa đạt

- **WHEN** contract chưa được approve/migrate hoặc current aggregate validation chưa PASS
- **THEN** parent task 6.1 SHALL giữ FAIL/UNCHECKED và blocked, không tiến parent nhờ Specs hay formatting subset PASS

#### Scenario: R12.2 Prerequisite đạt nhưng chưa có parent authorization

- **WHEN** approved contract PASS trên migrated state nhưng chưa có separate parent continuation authorization
- **THEN** evidence SHALL được dùng để request continuation, parent progression SHALL NOT tự xảy ra

#### Scenario: R12.3 Historical failure vẫn là failure

- **WHEN** một fresh validation run PASS sau remediation
- **THEN** historical parent failures SHALL giữ nguyên kết quả cũ và fresh result SHALL được phân biệt, không rewrite lịch sử thành PASS

## Non-goals

Không bao gồm UI/Product behavior, runtime/auth/database changes, blanket `.prettierignore` exclusion, arbitrary hash rebasing, silent historical evidence rewriting, hand-format generated output, automatic active-owner mutation, lifecycle/readiness promotion, parent task progression trong change này hoặc production action. Specs không chỉ định manifest filename/location, data structure, validator implementation, orchestration topology hay migration script. Sensitive Design vẫn bắt buộc sau Gate 2 approval; Specs không cấp Apply authority.

## Migration context

Reviewed discovery baseline có 67 files: 9 generated, 3 active-change, 5 normative/schema, 24 historical/hash-bound, 22 archived policy group, 4 current mutable docs. Đây là migration evidence, không phải permanent repository class limits hoặc automatic admission. Historical evidence chỉ có 1 exact pure-generation match; 8 generated outputs chưa được full-pipeline comparison giải thích. Không claim 9/9 reproducibility. Known async-feedback overlap giữ WAIT_FOR_OWNER. Parent giữ 19/23, task 6.1 FAIL/UNCHECKED, 6.2–6.4 BLOCKED, receipt VERIFIED, Production NOT_AUTHORIZED.
````

## Recommendation and stop

Recommendation: READY_FOR_GATE_2.
Review status: AWAITING_HUMAN_REVIEW.
Gate 2 is NOT self-approved. Design: NOT_CREATED. Sensitive Design: REQUIRED LATER.
Tasks/TIC and Apply: NOT_STARTED / NOT_AUTHORIZED.
Next authorization required: explicit Control Tower Gate-2 review decision on this exact Specs hash.
STOP before Design; no parent progression or production action.

## Bounded amendment — live migration metadata (current Gate 2 checkpoint)

Change: repository-format-policy-and-baseline-remediation
Gate: 2 — bounded Specs amendment
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-13
Schema: yuta-spec-driven
Analysis conclusion: historical BLOCKED_NEEDS_REVIEW preserved; current explicit authority decisions resolve this bounded Specs conflict
Sensitive change: YES

ORIGINAL_GATE_2_SPECS: APPROVED_HISTORICALLY.
AMENDED_SPECS: AWAITING_GATE_2_REVIEW.
REPOSITORY_FORMAT_POLICY_GATE_2_AMENDMENT_CHECKPOINT: AWAITING_CONTROL_TOWER_REVIEW.
Recommendation: READY_FOR_GATE_2.

This section is the current amendment checkpoint. Everything before it is retained historical evidence, including its exact original spec snapshot, original validation results and former Design-not-created statement. Control Tower subsequently approved that original Gate 2; the current instruction explicitly records that historical approval and authorizes a bounded amendment, not approval of amended bytes. No old approval is reused for the amended spec. Design and Sensitive Design packet now exist but remain byte-for-byte unchanged and BLOCKED_NEEDS_REVIEW pending later authorized reconciliation and review.

Authorization source: explicit current-user “CONTROL TOWER — BOUNDED SPECS AMENDMENT LIVE MIGRATION METADATA CONTRACT”, mode SPECS_AMENDMENT_ONLY. The changed authority decision is limited to nondeterministic live migration metadata. Proposal, Analysis, Gate 1 and all unrelated requirement semantics remain preserved. No new main-spec capability, runtime behavior, migration execution or Product Knowledge change is introduced.

### Exact PRE bindings and current spec

All seven PRE bindings matched before editing. Hash method: Node crypto SHA-256 over fs.readFileSync raw file bytes; snapshot paths obtained from git ls-files --cached --others --exclude-standard -z, unique and sorted. No newline normalization precedes hashing.

- `docs/reviews/repository-format-policy-and-baseline-remediation/01-analysis-review.md`: `2dcbb5d283fd21e19bc859f42d9713d7ccfa23beead9752e117b8cce7d4559d0`.
- `docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md`: `b3a61588334d46fb1defe6a57fd33a0794e178a9e9926e7065e6347ad71ab02b`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/analysis.md`: `7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/proposal.md`: `4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md`: `0567fbaa45fc37ac3b687cf34f2625f6278db7d1429e9d8ea1493b065366880b`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/design.md`: `106b431a19eec026f5c5a6ccadef018c5e19f8580f2c08f2cace9bab822d289d`.
- `docs/reviews/repository-format-policy-and-baseline-remediation/02b-design-review.md`: `09d9e3474ec87a68c588273cae1edb01ec4d6863f6a86dcac83c989fce2d4468`.

Specs POST SHA-256: `11a24180f8620f688a9a718127ec040d09e7b7e279a3a7a92f6d588de89be394`.
Original Gate-2 packet PRE SHA-256: `b3a61588334d46fb1defe6a57fd33a0794e178a9e9926e7065e6347ad71ab02b`.
The packet POST hash is returned separately after final serialization to avoid a self-referential digest. Original packet bytes remain an exact prefix of this amended packet.

### Exact amendment scope and coverage

Original: 12 requirements / 58 scenarios. Current: 13 requirements / 77 scenarios. Net addition: one requirement and 19 scenarios; no scenario removed or renumbered.

- R1: 9 → 11 scenarios. Adds explicit generated subclass admission and historical-copy distinction. R1.2 routes reproducible artifacts to R4; R1.10 routes accepted live metadata to R4L; R1.11 rejects missing or conflicting subclass authority.
- R4: remains 7 scenarios. Only its opening contract scope is narrowed explicitly to REPRODUCIBLE_GENERATED_ARTIFACT, including existing generated OpenSpec skills. R4.1–R4.7 text is byte-for-byte unchanged. Known source/tool/version/inventory, exact output reproducibility, missing/unexpected output, stale binding, manual drift and reviewed deviation without reproduction retain their original fail-closed behavior.
- R4L: new requirement with 15 scenarios, R4L.1–R4L.15. Covers live metadata success, parse/structure, ordering/journal identity, links/references, inventory, native validation failure or absence, stale authority, pending/reviewed tool mutation, manual mixed drift, native append/tool-update semantics, historical preservation/class confusion, partial state and uncovered validation gaps.
- R10: 3 → 5 scenarios. Opening explicitly aggregates R4 and R4L for their respective scopes. Existing R10.1–R10.3 unchanged; R10.4 requires both contracts and all other applicable checks; R10.5 denies generated-exclusion-only PASS.
- Unchanged requirement blocks, exact text including scenarios: R2 (3), R3 (4), R5 (5), R6 (6), R7 (4), R8 (5), R9 (6), R11 (3), R12 (3). Purpose, Non-goals and Migration context unchanged.

Coverage arithmetic: 11 + 3 + 4 + 7 + 15 + 5 + 6 + 4 + 5 + 6 + 5 + 3 + 3 = 77. All 13 requirements have scenarios. Every added scenario has observable WHEN/THEN outcomes. Subclasses do not add a seventh top-level artifact class.

### Accepted authority expressed as proposed behavior

Reproducible-generated contract remains exact reproduction under R4, not merely structure or hash preservation. No canonicalization relaxation is introduced for the OpenSpec skill case; the historical 1-match / 8-unexplained evidence remains unchanged and is not relabelled.

Live metadata remains GENERATED_EXTERNAL_OR_DERIVED, MIGRATION_TOOLING_OWNED, AUTHORIZED_MIGRATION_TOOLING_ONLY. Its accepted validation model is SEMANTIC_AND_CHAIN_INTEGRITY_VALIDATION; nondeterministic UUID/timestamp reproduction is not required. Both generated subclasses are outside mutable Prettier scope; neither permits hand-formatting.

R4L requires reviewed tool/source/version/owner and exact inventory, applicable native validation PASS plus current-tool-supported structure, ordering, journal integrity, snapshot/migration/journal links, no dangling or duplicate/missing identities, and referenced artifact existence. Missing/skipped native evidence or uncovered applicable obligations fail closed. Native validation and existing repository checks own semantics; bounded structural/reference checks may close identified gaps, not invent migration-domain semantics. Specs select no command topology, package placement, state enum or validator implementation.

Live journal policy: TOOL_OWNED_APPEND_OR_TOOL_UPDATE. Tool-valid non-append changes are not automatically tampering. Historical journal copies remain R5 exact-byte preservation with approved new record/revision for corrections and original preservation. R4L.13 rejects class confusion in either direction; shared filenames or ignore rules confer no authority.

Observable transition: reviewed exact identity → separately authorized tooling mutation → changed tool-generated state awaiting identity review (overall FAIL, not automatically tampering) → exact new identity approved and all checks PASS. Mutation approval alone does not accept output. No auto-rebaseline, auto-repair or generation during validation. Mixed manual/tool changes fail and require review.

Non-regression: R5 historical/hash-bound exact bytes; R6 archives; R7 active-owner control; R8 normative owner/equivalence; R9 exact67 stop-on-drift; R1/R3 complete admission and mandatory coverage; R12 parent hold remain. No blanket ignore, arbitrary historical rewrite or production permission.

### Actual checks and execution limits

The following commands ran after the Specs amendment:

- `openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive`: exit 0, change valid.
- `pnpm docs:check`: exit 0, documentation consistency passed (36 current documents).
- `pnpm architecture:check`: exit 0, runtime imports, database URLs, client boundaries and migration baselines valid.
- `pnpm exec prettier --check openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md`: exit 0 before packet append; final packet validation is recorded below.

Read-only discovery initially attempted two incorrect policy filenames (OPENSPEC_ACTIVATION_POLICY.md / OPENSPEC_NORMATIVITY_POLICY.md); the command returned exit 1. Repository search located the actual OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md / OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md, which were read. This is a discovery-path diagnostic, not a validation PASS or a repository defect.

No global format check/remediation, recursive typecheck, runtime test/build, native migration execution, metadata regeneration, parent 6.1 closure or production action ran. The scoped checks validate documentary conformance, not implementation of the proposed validators. No Technical VERIFY/QA or whole-repository-format PASS is claimed. Required runtime checks remain for later authorized implementation.

### Protected scope and operational hold

Fresh PRE snapshot: HEAD `415990386327aaccab3c32b1fef0569a0fde7f3a`, 2633 existing Git-listed files. Approved baseline67 and ignored45 both matched their exact reviewed inventories and hashes before amendment. Final snapshot comparison and scoped diff checks are recorded below after this packet is serialized.

Parent tasks still contain 19 checked of 23 and 6.1–6.4 unchecked; historical 6.1 remains FAIL, 6.2–6.4 BLOCKED. Parent Tasks SHA-256 remains `36e66b08a712d99a12f3f3243a803bced9bf707a7bb6ea9b47b83ec7e896b504`. Receipt remains VERIFIED, SHA-256 `1ff4b04f62e8c76ad6242ca0640f564618e4f3c89d18f767f6bf9cc6193ba1c7`. No parent progression was attempted.

Tasks/TIC: NOT_CREATED. Implementation Plan: NOT_CREATED. Apply: NOT_RUN. Design and Sensitive packet: UNCHANGED. Sensitive Design: BLOCKED_NEEDS_REVIEW; not reassessed or approved in this Specs-only turn. Production: NOT_AUTHORIZED.

Next authority needed: explicit Gate-2 decision on this amended spec hash, followed by separately authorized Design reconciliation. No Tasks, Apply, Sync or Archive follows this packet automatically.

### Final amendment validation and integrity

Scoped Prettier on both delivery files after packet assembly: exit 0, PASS. Scoped `git diff --check -- openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md`: exit 0. Since both delivery paths are untracked, this was supplemented with direct exact-byte PRE/POST comparison, explicit trailing-whitespace checks (zero findings), and verification that the original packet is an exact byte prefix and the current embedded Specs equal the amended file. Git diff alone is not claimed to cover untracked content.

POST snapshot comparison: exactly two changed paths (this packet and the delta spec), zero added/removed paths, HEAD unchanged, all other 2,631 Git-listed paths/bytes unchanged. Baseline67: 67/67 unchanged. Ignored45: 45/45 unchanged. Proposal, Analysis, Gate 1, Design and Sensitive packet retain their listed PRE hashes. R2/R3/R5/R6/R7/R8/R9/R11/R12 blocks and original R4 scenarios compare exactly to PRE. No Tasks/TIC or other delivery file was created. The old Gate-2 packet prefix and embedded historical Specs remain intact; its full POST hash necessarily changes because of this bounded append.

REPOSITORY_FORMAT_POLICY_GATE_2_AMENDMENT_CHECKPOINT: AWAITING_CONTROL_TOWER_REVIEW. Amended Gate-2 recommendation: READY_FOR_GATE_2. This is a review recommendation, not approval. Parent 19/23, task 6.1 FAIL / UNCHECKED, 6.2–6.4 BLOCKED; Production NOT_AUTHORIZED. STOP.

### Exact amended delta spec

<!-- prettier-ignore -->
````markdown
## Purpose

Thiết lập contract validation formatting theo authority và class của artifact, bảo đảm coverage đầy đủ, kiểm tra thay thế bắt buộc và bảo toàn integrity khi migration repository baseline.

## ADDED Requirements

### Requirement: R1 Phân loại artifact đầy đủ và fail-closed

Repository validation SHALL phân loại mọi artifact tham gia phạm vi repository formatting validation bằng admission evidence hiện hành, owner hoặc policy authority và nghĩa vụ validation xác định. Sáu class được nhận diện là `MUTABLE_FORMATTED`, `GENERATED_EXTERNAL_OR_DERIVED`, `HISTORICAL_HASH_BOUND`, `ARCHIVED_PRESERVED`, `ACTIVE_CHANGE_OWNED` và `NORMATIVE_REVIEW_REQUIRED`. `UNCLASSIFIED`, classification thiếu hoặc stale, hay overlap chưa giải quyết SHALL làm overall validation FAIL. Một artifact SHALL NOT bị bỏ qua cả mutable formatting lẫn alternate validation; class không tự cấp quyền sửa file. Admission và chuyển class SHALL giữ các nghĩa vụ authority/integrity còn áp dụng, không dùng tên đường dẫn hoặc lỗi formatter làm bằng chứng miễn kiểm tra.

Trong class `GENERATED_EXTERNAL_OR_DERIVED`, validation SHALL phân biệt `REPRODUCIBLE_GENERATED_ARTIFACT` theo R4 với `TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA` theo R4L bằng accepted tool authority và admission evidence. Hai subclass SHALL nằm ngoài mutable-format scope; không subclass nào cho phép manual formatting. Historical journal copy SHALL được nhận diện riêng theo historical provenance và R5, không nhận live-metadata authority chỉ vì cùng filename. Subclass thiếu, mơ hồ hoặc không có accepted authority SHALL làm overall validation FAIL; `.prettierignore` không tạo admission.

#### Scenario: R1.1 Mutable artifact có authority

- **WHEN** artifact được phân loại hiện hành là mutable với owner xác định
- **THEN** validation SHALL đưa artifact vào mutable-format checking và báo class cùng owner

#### Scenario: R1.2 Generated artifact có admission evidence

- **WHEN** artifact có source/generator authority và accepted subclass REPRODUCIBLE_GENERATED_ARTIFACT
- **THEN** validation SHALL áp dụng nghĩa vụ reproducibility của R4 thay vì yêu cầu hand-format output

#### Scenario: R1.3 Historical artifact được nhận diện tường minh

- **WHEN** historical/hash-bound artifact có admission evidence và owner hợp lệ
- **THEN** artifact SHALL nằm ngoài mutable-format scope nhưng bắt buộc chịu preservation validation của R5

#### Scenario: R1.4 Archived provenance được nhận diện tường minh

- **WHEN** artifact được admitted là archived provenance với owner và historical identity
- **THEN** validation SHALL áp dụng exact-byte preservation của R6

#### Scenario: R1.5 Active artifact thuộc owner hiện hành

- **WHEN** artifact đang thuộc active change với owner và lifecycle binding hiện hành
- **THEN** validation SHALL giữ owner control của R7, không suy ra formatting exemption chỉ từ trạng thái active

#### Scenario: R1.6 Normative artifact yêu cầu review

- **WHEN** artifact là normative spec hoặc schema/template thuộc authority đã xác định
- **THEN** validation SHALL áp dụng review/equivalence obligations của R8, không coi là ordinary mutable document

#### Scenario: R1.7 Artifact chưa phân loại

- **WHEN** có artifact trong validation scope chưa có classification hợp lệ
- **THEN** overall validation SHALL FAIL với artifact identity và missing-classification reason, không silently exclude

#### Scenario: R1.8 Classification stale

- **WHEN** classification không còn khớp owner, lifecycle hoặc authority hiện hành
- **THEN** overall validation SHALL FAIL vì stale classification, không tự cập nhật baseline

#### Scenario: R1.9 Overlap chưa giải quyết

- **WHEN** các classification áp dụng cho cùng artifact tạo nghĩa vụ mâu thuẫn chưa được authority giải quyết
- **THEN** overall validation SHALL FAIL và yêu cầu review, không chọn class ít kiểm tra hơn để PASS

#### Scenario: R1.10 Live metadata có accepted tool authority

- **WHEN** live migration metadata có admission evidence hiện hành cho tool-owned nondeterministic contract
- **THEN** validation SHALL giữ class GENERATED_EXTERNAL_OR_DERIVED và áp dụng R4L, không áp dụng mutable formatting hoặc yêu cầu tái tạo UUID/timestamp bytes

#### Scenario: R1.11 Generated subclass chưa được xác định

- **WHEN** generated artifact không có accepted validation contract hoặc bị gán đồng thời hai subclass mâu thuẫn
- **THEN** overall validation SHALL FAIL và yêu cầu authority review, không chọn live-metadata contract để tránh reproducibility của R4

### Requirement: R2 Mutable formatting được thực thi

Artifact thuộc mutable-format scope SHALL được kiểm tra bằng repository formatting policy hiện hành. Bất kỳ mutable formatting failure nào SHALL làm overall validation FAIL. Artifact SHALL NOT bị loại khỏi scope chỉ vì hiện tại không đạt Prettier; thay đổi classification cần authority và admission evidence độc lập với formatter result.

#### Scenario: R2.1 Mutable formatting hợp lệ

- **WHEN** mutable artifact đạt formatting policy hiện hành
- **THEN** mutable check SHALL báo PASS cho artifact đó, không thay thế các kiểm tra bắt buộc khác

#### Scenario: R2.2 Mutable formatting thất bại

- **WHEN** một mutable artifact không đạt formatting policy
- **THEN** overall validation SHALL FAIL và chỉ rõ artifact thất bại

#### Scenario: R2.3 Loại file chỉ để bỏ lỗi

- **WHEN** đề xuất bỏ một mutable artifact khỏi format scope chỉ dựa trên Prettier failure
- **THEN** validation SHALL từ chối exclusion đó và không báo overall PASS

### Requirement: R3 Alternate validation bắt buộc

Mọi artifact không được mutable-format checking SHALL có alternate validator phù hợp với class và tham gia overall result. Mọi non-mutable-format class SHALL có nghĩa vụ validation tường minh; active/normative authority checks vẫn bắt buộc khi formatting cũng áp dụng. Missing validator, unresolved artifact identity, stale validator configuration hoặc alternate validation failure SHALL làm overall validation FAIL, kể cả mutable checks đều PASS.

#### Scenario: R3.1 Thiếu alternate validator

- **WHEN** artifact bị loại khỏi mutable-format checking nhưng không có mandatory alternate validator
- **THEN** overall validation SHALL FAIL vì coverage thiếu

#### Scenario: R3.2 Không resolve được identity

- **WHEN** alternate validator không xác định được exact artifact identity cần kiểm tra
- **THEN** overall validation SHALL FAIL, không coi artifact là absent khỏi scope

#### Scenario: R3.3 Validator configuration stale

- **WHEN** validator configuration không còn tương ứng class/authority binding được review
- **THEN** overall validation SHALL FAIL và báo stale binding

#### Scenario: R3.4 Alternate validator thất bại

- **WHEN** mandatory alternate validator thất bại dù mutable checks PASS
- **THEN** overall validation SHALL FAIL, giữ nguyên failure reason của alternate check

### Requirement: R4 Generated authority và reproducibility

R4 và toàn bộ scenarios R4.1–R4.7 SHALL áp dụng cho subclass `REPRODUCIBLE_GENERATED_ARTIFACT`, bao gồm generated OpenSpec skills hiện hữu; live migration metadata có accepted contract riêng theo R4L không thuộc reproducibility scope này. Reproducible generated artifacts SHALL nằm ngoài mutable-format scope với mandatory reproducibility validation gắn known generator/source authority, generator/tool version hoặc equivalent identity, và expected inventory. Manual formatting/patching generated output SHALL NOT là remediation hợp lệ. Reproducibility chưa chứng minh SHALL được báo UNKNOWN hoặc unresolved deviation và SHALL NOT được tính là PASS. Reviewed deviation SHALL được phân biệt với unexplained deviation nhưng approval của deviation tự nó SHALL NOT thay thế chứng minh reproducibility trên approved generation scope. Đổi generator/source/version hoặc pipeline cần review riêng; contract này không tự cho phép regeneration hay chấp nhận byte mới.

#### Scenario: R4.1 Exact generation được chứng minh

- **WHEN** approved generator/source/version tái tạo đúng exact output bytes và expected inventory
- **THEN** generated validation SHALL báo reproducibility PASS cho đúng scope đã kiểm tra

#### Scenario: R4.2 Unexplained generated deviation

- **WHEN** output khác generation evidence và full-pipeline comparison chưa giải thích được khác biệt
- **THEN** validation SHALL giữ reproducibility chưa chứng minh và overall FAIL, không suy diễn PASS từ generated label

#### Scenario: R4.3 Generator version drift

- **WHEN** generator/tool identity hiện hành khác identity đã review
- **THEN** generated validation SHALL FAIL vì stale binding và yêu cầu review trước khi chấp nhận generation mới

#### Scenario: R4.4 Thiếu generated artifact

- **WHEN** một artifact thuộc expected generated inventory không tồn tại
- **THEN** generated validation SHALL FAIL với missing identity

#### Scenario: R4.5 Generated artifact ngoài inventory

- **WHEN** generation scope chứa output không thuộc expected inventory đã review
- **THEN** generated validation SHALL FAIL với unexpected identity, không tự mở rộng inventory

#### Scenario: R4.6 Manual edit hoặc formatter drift

- **WHEN** generated bytes bị manual edit hoặc formatter rewrite khác approved reproducible output
- **THEN** generated validation SHALL FAIL và không chấp nhận hand-format làm cách khôi phục authority

#### Scenario: R4.7 Reviewed deviation chưa có reproducibility

- **WHEN** deviation được review nhưng chưa có evidence tái tạo approved output bằng approved generation scope
- **THEN** evidence SHALL giữ reviewed-deviation status riêng, reproducibility SHALL NOT PASS và overall validation SHALL FAIL

### Requirement: R4L Live migration metadata thuộc migration tooling

Live migration metadata được admitted là `TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA` SHALL giữ class `GENERATED_EXTERNAL_OR_DERIVED`, authority `MIGRATION_TOOLING_OWNED` và mutation path `AUTHORIZED_MIGRATION_TOOLING_ONLY`. Contract validation SHALL là `SEMANTIC_AND_CHAIN_INTEGRITY_VALIDATION`, ngoài mutable Prettier scope. Exact regeneration SHALL NOT là điều kiện PASS cho subclass này; UUID/timestamp nondeterministic SHALL NOT bị yêu cầu tái tạo. Manual Prettier formatting và direct human edit SHALL bị cấm mặc định; tool ownership không tự cấp mutation authorization.

Validation SHALL bind known migration tool/source, current reviewed tool/version identity và expected inventory/path membership. Theo semantics được current tool contract hỗ trợ, validation SHALL kiểm tra parse/structure validity, migration ordering, journal integrity, snapshot/migration/journal linkage, absence of dangling references hoặc duplicate/missing migration identity, và sự tồn tại của referenced migration artifacts. Applicable migration-tool native validation SHALL có current PASS; native check thiếu, bị skip hoặc không hoàn tất SHALL NOT được báo PASS. Coverage gap chưa có accepted validation SHALL làm overall validation FAIL, không bỏ nghĩa vụ chỉ vì thiếu native check. Validation SHALL ưu tiên native tool contract, existing repository checks rồi bounded structural/reference coverage cho gap được xác định; SHALL NOT tự diễn giải lại migration-domain semantics do tool sở hữu.

Live journals SHALL theo `TOOL_OWNED_APPEND_OR_TOOL_UPDATE`, không giả định chỉ append nếu tool contract cho phép update. Historical journal copies SHALL giữ historical provenance, exact-byte preservation theo R5 và correction bằng new record/revision giữ original; live và historical authority SHALL NOT thay thế lẫn nhau.

Reviewed exact path/byte identity SHALL được bảo toàn tới authorized tooling mutation. Một legitimate tool-generated change SHALL NOT tự bị kết luận tampering, nhưng changed state SHALL giữ awaiting reviewed identity và overall validation SHALL FAIL tới khi exact new tool-generated state được review và mọi applicable check PASS. Authorization để mutate SHALL NOT tự duyệt output hoặc rebaseline. Unexplained/manual mutation SHALL được báo riêng và ngăn acceptance, kể cả structure/native checks PASS. Stale tool/owner/inventory/identity SHALL FAIL; không silent rebaseline, auto-repair hoặc regeneration trong validation. Contract này không cấp quyền chạy migration hay sửa metadata.

#### Scenario: R4L.1 Reviewed live metadata hợp lệ

- **WHEN** admitted live metadata khớp reviewed identity/tool/inventory, applicable native validation PASS và mọi applicable structure/chain/reference check PASS
- **THEN** live-metadata validation SHALL PASS mà không yêu cầu UUID/timestamp bytes tái tạo hoặc manual formatting; result SHALL NOT được ghi thành reproducibility PASS của R4

#### Scenario: R4L.2 Parse hoặc structure không hợp lệ

- **WHEN** live metadata không parse được hoặc vi phạm structure của current migration-tool contract
- **THEN** validation SHALL FAIL với affected identity và native/structure reason, không sửa metadata

#### Scenario: R4L.3 Ordering hoặc journal integrity sai

- **WHEN** migration ordering hoặc journal entries vi phạm current tool contract, gồm duplicate/missing migration identity
- **THEN** validation SHALL FAIL với affected journal/migration identity, không tự sắp xếp hoặc viết lại entries

#### Scenario: R4L.4 Linkage hoặc reference không hợp lệ

- **WHEN** snapshot/migration/journal relationship vi phạm tool contract, có dangling reference hoặc referenced migration artifact không tồn tại
- **THEN** validation SHALL FAIL và chỉ rõ relationship/artifact thiếu, không dựng snapshot hoặc migration thay thế

#### Scenario: R4L.5 Expected inventory bị thiếu hoặc có artifact mới

- **WHEN** expected live-metadata path bị thiếu hoặc xuất hiện output ngoài reviewed inventory
- **THEN** validation SHALL FAIL vì missing/unexpected identity, không silently shrink hoặc mở rộng baseline

#### Scenario: R4L.6 Native validation không PASS

- **WHEN** applicable native validation FAIL, không khả dụng, bị skip hoặc không hoàn tất
- **THEN** overall validation SHALL FAIL và báo đúng failure/missing evidence; structural-only success SHALL NOT thay native PASS bắt buộc

#### Scenario: R4L.7 Tool owner hoặc version binding stale

- **WHEN** tool/source/version hoặc owner hiện hành khác reviewed authority binding
- **THEN** validation SHALL FAIL và yêu cầu review riêng, không tự nhận tool-generated bytes theo binding cũ

#### Scenario: R4L.8 Authorized tool mutation đang chờ review

- **WHEN** authorized tooling tạo legitimate new metadata state nhưng exact new identity chưa được review
- **THEN** validation SHALL phân biệt awaiting reviewed identity với tampering và giữ overall FAIL, dù native/chain checks PASS

#### Scenario: R4L.9 Exact tool-generated state được review

- **WHEN** exact state từ authorized tooling mutation được duyệt với new identity/inventory và mọi applicable validation PASS
- **THEN** validation SHALL chấp nhận reviewed new identity với attribution riêng, không gán bytes mới vào approval cũ hoặc tự cấp quyền mutation tiếp theo

#### Scenario: R4L.10 Manual mutation hoặc formatter rewrite

- **WHEN** reviewed metadata có unexplained manual edit, formatter rewrite hoặc manual edit trộn với authorized tool output
- **THEN** validation SHALL FAIL và surface mutation cần review, không hợp thức hóa bằng native PASS hoặc hash rebaseline

#### Scenario: R4L.11 Tool-owned journal update

- **WHEN** authorized tool append hoặc tool-update journal theo current native contract
- **THEN** validation SHALL kiểm tra changed state theo native semantics và reviewed-identity transition, không tự kết luận mọi non-append change là tampering hoặc tự chấp nhận baseline mới

#### Scenario: R4L.12 Historical journal copy được giữ nguyên

- **WHEN** journal copy có historical admission và exact approved path/bytes/reference binding còn nguyên
- **THEN** validation SHALL áp dụng R5 exact-byte preservation; correction SHALL là approved new record/revision giữ original, không refresh copy từ live journal

#### Scenario: R4L.13 Confusion giữa live và historical journal

- **WHEN** live journal bị gán historical-copy contract hoặc historical copy bị gán live-tool mutation contract trái admission provenance
- **THEN** classification/validation SHALL FAIL, không dùng filename hoặc shared ignore rule để thay authority

#### Scenario: R4L.14 Partial tooling state

- **WHEN** tooling chỉ hoàn tất một phần và journal/snapshot/migration set không thỏa expected relationship/inventory của current tool contract
- **THEN** validation SHALL FAIL với incomplete-state evidence, không auto-repair hoặc chạy generation để tạo PASS

#### Scenario: R4L.15 Native coverage gap chưa được xử lý

- **WHEN** native/repository checks không bao phủ một applicable integrity obligation và chưa có accepted bounded gap validation
- **THEN** overall validation SHALL FAIL với exact uncovered obligation, không silently skip hoặc tạo migration-domain semantics mới

### Requirement: R5 Historical và hash-bound preservation

Historical/hash-bound admission SHALL có evidence, exact path/byte identity và owner tường minh; incidental hash reference không tự đủ admission. Artifact admitted SHALL nằm ngoài mutable-format scope và SHALL bảo toàn approved historical identity cùng reference integrity. Silent byte rewrite giữ approval identity cũ SHALL FAIL. Correction SHALL dùng explicitly approved revision/new-record path giữ original bytes và approval meaning cũ, không cấp general historical-rebind migration.

#### Scenario: R5.1 Original exact bytes được giữ

- **WHEN** historical artifact tồn tại với exact approved path/bytes và reference binding hợp lệ
- **THEN** preservation validation SHALL PASS mà không yêu cầu reformat original

#### Scenario: R5.2 Byte thay đổi không có revision

- **WHEN** historical bytes thay đổi nhưng vẫn dùng approval identity cũ
- **THEN** preservation validation SHALL FAIL, không thay hash cũ để hợp thức hóa bytes mới

#### Scenario: R5.3 Historical artifact bị thiếu

- **WHEN** approved historical path không tồn tại
- **THEN** preservation validation SHALL FAIL với missing artifact reason

#### Scenario: R5.4 Hash identity stale

- **WHEN** preservation binding hoặc approval reference không còn khớp historical identity được duyệt
- **THEN** preservation validation SHALL FAIL vì stale identity dù file hiện tại đạt formatter

#### Scenario: R5.5 Correction bằng approved revision

- **WHEN** owner duyệt exact new revision/record và original cùng historical approval vẫn nguyên vẹn
- **THEN** validation SHALL nhận diện riêng revision mới theo approval của nó và tiếp tục kiểm tra original theo binding cũ

### Requirement: R6 Archived provenance preservation

Chỉ artifact có evidence-backed admission, owner và approved historical identity mới SHALL được coi là `ARCHIVED_PRESERVED`. Với admitted record, policy SHALL là `EXACT_BYTE_PRESERVATION_BY_DEFAULT`; correction SHALL là append/new revision không sửa bytes của original admitted record. Silent archive rewrite SHALL bị cấm. Tên hoặc vị trí dưới `docs/archive` SHALL NOT tự tạo admission, immutability hoặc exclusion khỏi validation.

#### Scenario: R6.1 Archive được giữ nguyên

- **WHEN** admitted archive record khớp exact approved identity
- **THEN** archive preservation SHALL PASS mà không yêu cầu mutable formatting

#### Scenario: R6.2 Archive content drift

- **WHEN** bytes của admitted archive record khác preservation binding
- **THEN** archive validation SHALL FAIL và giữ historical binding để review

#### Scenario: R6.3 Archive bị thiếu

- **WHEN** admitted archive record không còn ở approved path
- **THEN** archive validation SHALL FAIL, không silently shrink inventory

#### Scenario: R6.4 Correction là new record

- **WHEN** correction được owner duyệt thành record/revision bổ sung, original admitted record giữ exact bytes
- **THEN** validation SHALL kiểm tra original và correction bằng identity riêng, không gán correction vào approval cũ

#### Scenario: R6.5 Rewrite original archive

- **WHEN** hygiene correction đề nghị viết lại original admitted record để làm nó current hoặc format-clean
- **THEN** validation SHALL từ chối rewrite đó theo correction model và không báo preservation PASS

#### Scenario: R6.6 Arbitrary archive-directory path

- **WHEN** một file dưới `docs/archive` không có archived-provenance admission evidence
- **THEN** validation SHALL NOT tự nhận file là immutable/exempt; nếu chưa có classification hợp lệ khác, overall result SHALL FAIL

### Requirement: R7 Active change ownership

Active-change-owned artifacts SHALL giữ quyền kiểm soát của active owner và current review/lifecycle bindings. Hygiene tooling SHALL NOT mutate artifact nếu chưa có explicit owner coordination/authorization cho exact revision. Entry/exit classification SHALL tuân theo approved lifecycle và giữ historical evidence; passing checks hoặc path move không tự chuyển ownership. Khi coordination chưa có, affected remediation SHALL giữ `WAIT_FOR_OWNER`, không suy ra approval từ technical PASS.

#### Scenario: R7.1 Active owner giữ artifact

- **WHEN** active owner chưa cho phép hygiene revision
- **THEN** artifact SHALL giữ nguyên, affected remediation SHALL báo WAIT_FOR_OWNER và không claim completion nhờ bỏ kiểm tra

#### Scenario: R7.2 Owner-authorized revision

- **WHEN** owner duyệt exact path/preimage/revision trong lifecycle hiện hành
- **THEN** validation SHALL kiểm tra revision theo approval mới và giữ lịch sử cũ, không tái sử dụng stale approval

#### Scenario: R7.3 Hygiene mutation không có approval

- **WHEN** hygiene work sửa active artifact ngoài owner authorization
- **THEN** ownership/integrity validation SHALL FAIL dù formatting PASS

#### Scenario: R7.4 Approved lifecycle exit

- **WHEN** artifact rời active state qua approved lifecycle transition
- **THEN** classification SHALL được review theo owner/authority mới, giữ lịch sử và mandatory validation coverage; không auto-exempt hoặc auto-mutate

### Requirement: R8 Normative review và semantic equivalence

Normative specs/schema/templates SHALL NOT được xử lý như ordinary mutable docs. Formatting mutation SHALL cần explicit owner approval gắn exact path, preimage và exact diff; parsed requirement/scenario meaning equivalence khi áp dụng; schema/template structural equivalence khi áp dụng; và strict validation phù hợp. Thiếu hoặc fail bất kỳ nghĩa vụ áp dụng nào SHALL ngăn acceptance. Formatting alone SHALL NOT đổi normative behavior, approval meaning hay lifecycle/readiness.

#### Scenario: R8.1 Exact approved equivalent change

- **WHEN** exact path/preimage/diff được owner duyệt, applicable semantic/structural equivalence và strict validation đều PASS
- **THEN** validation SHALL chấp nhận bounded formatting revision, không cấp quyền sửa ngoài diff

#### Scenario: R8.2 Missing approval hoặc preimage drift

- **WHEN** thiếu exact owner-approved diff hoặc path/preimage không còn khớp
- **THEN** affected mutation SHALL dừng và normative validation SHALL FAIL

#### Scenario: R8.3 Parsed requirement hoặc scenario thay đổi nghĩa

- **WHEN** formatting candidate làm đổi requirement/scenario meaning dù formatter PASS
- **THEN** equivalence validation SHALL FAIL và yêu cầu behavioral review, không coi là formatting-only

#### Scenario: R8.4 Structural hoặc strict validation thất bại

- **WHEN** applicable schema/template structure không tương đương hoặc strict validation không PASS
- **THEN** normative validation SHALL FAIL và không chấp nhận revision

#### Scenario: R8.5 Không lifecycle promotion

- **WHEN** normative formatting revision đạt mọi check áp dụng
- **THEN** lifecycle/readiness và production status SHALL giữ nguyên, không suy ra implementation/deployment completion

### Requirement: R9 Exact reviewed baseline migration

Initial migration SHALL bind đúng reviewed 67-file baseline bằng exact path/hash và current owner/status trước mutation. Mọi path SHALL giữ exact baseline tới khi có separate review cho bounded revision. Drift, missing/unexpected baseline member hoặc owner/status change SHALL dừng affected migration; wildcard rebaseline và auto-rebaseline SHALL bị cấm. Approved subset không miễn kiểm tra phần còn lại hay mở rộng scope. Các số lượng class trong migration evidence không SHALL trở thành giới hạn phân loại lâu dài; artifact mới vẫn chịu R1.

#### Scenario: R9.1 Exact baseline match

- **WHEN** toàn bộ reviewed 67 paths/hashes và owner/status vẫn khớp
- **THEN** migration precheck SHALL PASS nhưng SHALL NOT tự cấp mutation authorization

#### Scenario: R9.2 Một file drift

- **WHEN** một baseline file khác exact reviewed hash trước mutation
- **THEN** affected migration SHALL STOP và báo expected/current identity, không tự rebaseline

#### Scenario: R9.3 Baseline member missing

- **WHEN** một reviewed baseline path bị thiếu
- **THEN** affected migration SHALL STOP, không giảm baseline size để PASS

#### Scenario: R9.4 Unexpected baseline member

- **WHEN** migration candidate có thêm path ngoài reviewed baseline
- **THEN** affected migration SHALL STOP, không tự nhập file mới vào authorization; repository artifact mới vẫn cần classification đầy đủ

#### Scenario: R9.5 Owner hoặc status đổi

- **WHEN** baseline bytes không đổi nhưng owner/status binding đã thay đổi
- **THEN** affected migration SHALL STOP cho owner/lifecycle review trước mutation

#### Scenario: R9.6 Approved subset remediation

- **WHEN** exact subset có separate owner approval, preimages khớp và class obligations được đáp ứng
- **THEN** remediation SHALL chỉ áp dụng subset đó, giữ nguyên phần chưa được duyệt và SHALL NOT claim toàn baseline hoàn thành khi checks còn thiếu

### Requirement: R10 Mandatory validation orchestration

Repository-level formatting validation entry contract SHALL tổng hợp mutable formatting, classification completeness, reproducibility theo R4 khi áp dụng, semantic/chain integrity theo R4L khi áp dụng và mọi mandatory alternate validator khác theo fail-closed semantics. Overall PASS SHALL chỉ có khi tất cả applicable obligations có current successful evidence. Excluded artifact SHALL NOT có đường đi tới overall PASS nếu alternate validation không thực sự tham gia. Missing/skipped/incomplete required check SHALL NOT tương đương PASS. Contract không chọn command topology, manifest representation hoặc implementation location.

#### Scenario: R10.1 Tất cả obligations PASS

- **WHEN** classification đầy đủ, mutable checks và mọi applicable alternate check đều có current PASS
- **THEN** entry contract SHALL trả overall PASS với coverage evidence tương ứng

#### Scenario: R10.2 Một obligation FAIL

- **WHEN** một required obligation FAIL dù các checks khác PASS
- **THEN** entry contract SHALL trả overall FAIL và giữ nguyên failed obligation

#### Scenario: R10.3 Bỏ alternate check

- **WHEN** artifact bị excluded khỏi mutable checking và required alternate check bị skip, không chạy hoặc chưa hoàn tất
- **THEN** entry contract SHALL FAIL, không dùng mutable-only PASS làm overall result

#### Scenario: R10.4 Hai generated contracts cùng tham gia

- **WHEN** repository có cả reproducible generated artifacts và admitted tool-owned live metadata
- **THEN** overall PASS SHALL cần current R4 reproducibility PASS và R4L semantic/chain integrity PASS cho đúng scope, cùng mutable và mọi alternate obligation khác

#### Scenario: R10.5 Generated exclusion không thay validation

- **WHEN** generated artifact được exclude khỏi Prettier nhưng applicable R4 hoặc R4L contract chưa PASS
- **THEN** overall validation SHALL FAIL, không dùng exclusion hay PASS của generated subclass khác thay nghĩa vụ còn thiếu

### Requirement: R11 Deterministic audit evidence

Validation SHALL cung cấp deterministic evidence đủ để đối chiếu artifact identity, class, owner/policy authority, validator áp dụng và pass/fail reason, gồm missing/stale classification và unexpected drift. Cùng artifact state, authority/configuration bindings và check results SHALL cho cùng logical evidence; incidental run metadata không SHALL che khác biệt validation. Evidence SHALL NOT yêu cầu lộ secrets hoặc private configuration content.

#### Scenario: R11.1 Cùng inputs cùng logical evidence

- **WHEN** hai validation runs có cùng artifact state, authority bindings và check results
- **THEN** logical evidence SHALL đối chiếu tương đương cho identity/class/owner/validator/reason, không phụ thuộc thứ tự phát hiện artifact

#### Scenario: R11.2 Missing stale và drift có attribution

- **WHEN** validation phát hiện missing classification, stale binding hoặc unexpected drift
- **THEN** evidence SHALL chỉ rõ artifact liên quan và failure category để reviewer phân biệt, không chỉ báo generic PASS/FAIL

#### Scenario: R11.3 Không lộ private configuration

- **WHEN** failure liên quan configuration chứa private hoặc secret content
- **THEN** evidence SHALL báo safe identity/reason đủ review mà không in secret/private contents

### Requirement: R12 Parent hold và historical failure truth

Parent `ui-ux-pro-max-integration` task 6.1 SHALL giữ blocked cho tới khi approved repository formatting validation contract thực sự PASS trên migrated repository state. Historical failed commands SHALL giữ nguyên failed outcomes; không retroactive PASS. PASS của prerequisite SHALL chỉ là evidence cho separate authorized parent continuation, không tự check task, tiến task 6.2–6.4, đổi receipt, hoặc promote lifecycle/readiness/production.

#### Scenario: R12.1 Prerequisite chưa đạt

- **WHEN** contract chưa được approve/migrate hoặc current aggregate validation chưa PASS
- **THEN** parent task 6.1 SHALL giữ FAIL/UNCHECKED và blocked, không tiến parent nhờ Specs hay formatting subset PASS

#### Scenario: R12.2 Prerequisite đạt nhưng chưa có parent authorization

- **WHEN** approved contract PASS trên migrated state nhưng chưa có separate parent continuation authorization
- **THEN** evidence SHALL được dùng để request continuation, parent progression SHALL NOT tự xảy ra

#### Scenario: R12.3 Historical failure vẫn là failure

- **WHEN** một fresh validation run PASS sau remediation
- **THEN** historical parent failures SHALL giữ nguyên kết quả cũ và fresh result SHALL được phân biệt, không rewrite lịch sử thành PASS

## Non-goals

Không bao gồm UI/Product behavior, runtime/auth/database changes, blanket `.prettierignore` exclusion, arbitrary hash rebasing, silent historical evidence rewriting, hand-format generated output, automatic active-owner mutation, lifecycle/readiness promotion, parent task progression trong change này hoặc production action. Specs không chỉ định manifest filename/location, data structure, validator implementation, orchestration topology hay migration script. Sensitive Design vẫn bắt buộc sau Gate 2 approval; Specs không cấp Apply authority.

## Migration context

Reviewed discovery baseline có 67 files: 9 generated, 3 active-change, 5 normative/schema, 24 historical/hash-bound, 22 archived policy group, 4 current mutable docs. Đây là migration evidence, không phải permanent repository class limits hoặc automatic admission. Historical evidence chỉ có 1 exact pure-generation match; 8 generated outputs chưa được full-pipeline comparison giải thích. Không claim 9/9 reproducibility. Known async-feedback overlap giữ WAIT_FOR_OWNER. Parent giữ 19/23, task 6.1 FAIL/UNCHECKED, 6.2–6.4 BLOCKED, receipt VERIFIED, Production NOT_AUTHORIZED.
````
