## Context

Xem [Proposal](proposal.md), [Analysis](analysis.md) và
[approved delta](specs/tooling/external-design-intelligence/spec.md).
Gate 2 approve 18 requirements / 42 scenarios, không approve artifact 2.15.0.

Thiết kế này là contract đề xuất, không phải implementation hay installation
proof. Dùng lại tarball inventory/source text đã đọc trong Discovery ngày
2026-09-08, không download hoặc execute upstream trong lần Design.
LICENSE_PROVENANCE: UNCERTAIN. Sensitive Design Gate: REQUIRED.

## Goals / Non-Goals

Chọn cơ chế project-local core-only trước mutation, tách YUTA entrypoint khỏi
upstream instructions và giảm executable installer dependencies về Python
standard library. Không tạo code/skill/policy trong lần này.

Không Product/UI redesign, numeric preset authority, persistence/provider/
runtime integration, new phase, Product Knowledge/lifecycle promotion hoặc
production. Không sửa generated OpenSpec skills, schema/config, main specs
hoặc existing sealed page-pack prompts.

## Decisions

### D1. Policy owner and authority routing

Canonical policy đề xuất: `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`, owner
YUTA engineering cho tooling contract; Product/architecture decisions vẫn
thuộc authority tương ứng, không thuộc external skill. Policy chỉ điều khiển
external advisory integration; không tạo Design Bible.

Disposition record trong VERIFY: source/query, reference nội dung hoặc output
hash, controlling YUTA source, finding, disposition, rationale, owning approval
khi cần. External conflict → giữ YUTA và REJECTED_EXTERNAL_RECOMMENDATION.
YUTA/YUTA conflict → CONFLICT / NEEDS_REVIEW / STOP affected work, không dùng
external recommendation làm tie breaker. Không lấy newer output làm authority.

Alternatives: copy policy vào mọi prompt bị loại vì drift; upstream SKILL làm
authority bị loại vì scope/persistence defaults trái YUTA.

### D2. Usage record

Trong change mới, Codex đề xuất field trong `analysis.md` section UI/UX
Applicability và Gate 1 packet; owning reviewer chấp thuận theo scope, không
phải tool tự đặt. Sau approval, giữ field/rationale/reference trong
`tasks.md` và VERIFY section của `03-final-review.md`; không sửa approved
Analysis bytes khi cập nhật progress. Page-only workflow ghi tại existing
page `IMPLEMENTATION_PLAN.md` và acceptance evidence, không tạo artifact mới.

Record gồm `UI_UX_PRO_MAX_USAGE: REQUIRED | OPTIONAL | NOT_APPLICABLE`,
`Reason`, `Scope`, `Decision source`. Chỉ đúng ba values; thiếu/unknown →
classification error và STOP review kết luận phụ thuộc, không implicit default.

REQUIRED cần accepted-artifact record, verified installed identity, successful
actual query output, provenance, findings/dispositions, failure evidence.
Tool absent/unapproved/unavailable → blocker, không auto-install hay downgrade.
OPTIONAL không dùng phải nói rõ; NOT_APPLICABLE có lý do. Integration hiện tại
cố định NOT_APPLICABLE vì không được self-validate; tooling smoke vẫn REQUIRED.
Không biến mọi UI request thành REQUIRED theo suy đoán.

### D3. Target and host scope

Exact target: `<repository>/.agents/skills/ui-ux-pro-max/`.
Official [Codex discovery documentation](https://learn.chatgpt.com/docs/build-skills)
đã revalidate: repo-root `.agents/skills` được discovery; name/description
là metadata, full instructions được load khi dùng. Hai skill trùng tên có thể
cùng xuất hiện, không merge. Đây là discovery evidence, chưa là activation QA.

Hiện `.agents` và `.agents/skills` là normal directories, target absent.
Không `--global`, không sửa user/admin/system config hoặc skill directories.

Installer contract đầu tiên hỗ trợ Windows local NTFS, cùng volume, Python
3.10+; môi trường khác fail UNSUPPORTED_HOST trước mutation. Không tuyên bố
cross-platform support chưa chứng minh. Đây là giới hạn host tooling được
đề xuất để review, không đổi runtime YUTA. Chọn Windows-specific placement
primitive có no-replace semantics thay vì hứa generic rename là an toàn.

### D4. Safe core-only projection before mutation

Không gọi npm/npx/pnpm dlx, package bin `uipro`, install hooks hoặc upstream
init/update. YUTA-owned `scripts/ui-ux-pro-max/bootstrap.py` đọc tarball
được accepted như data, dùng Python stdlib. Không install siblings ở bất kỳ
staging/target directory nào rồi xóa.

Candidate duy nhất: npm `ui-ux-pro-max-cli@2.15.0`, exact source/digests D5.
Initial bootstrap nhận `--artifact <repo-local-tgz>` và
`--acceptance <repo-local-reviewed-json>`; không tự fetch. Artifact procurement
là explicit authorized action sau license review, không execute package manager.
Candidate change cần review mới nếu artifact bytes khác.

Pre-mutation proof obligation:

1. Đọc acceptance và cả compressed archive trong memory; kiểm SHA-256/SRI,
   compressed size 862011, tổng regular-file size 4656556 và exact inventory
   196 entries từ accepted manifest. Các số này là candidate-specific bounds,
   không dùng số file thay digest.
2. Parse tar headers như dữ liệu. Chỉ regular files và explicit directory
   ancestors; reject symlink/hardlink, device/FIFO, sparse, unsupported header,
   duplicate tên, absolute/drive/UNC path, backslash, NUL, ADS colon, empty
   segment, dot/dot-dot, reserved Windows name, trailing dot/space và
   case-insensitive collision. Không `extractall`. PAX metadata nếu xuất hiện
   ngoài reviewed format → STOP, không tự giải thích path override.
3. Derive projection từ exact 67 source paths trong Appendix A, không runtime
   prefix glob. Strip literal `package/assets/`, không tùy ý normalize.
   `package/assets/skills/**`, templates và `dist/**` không có output map.
   Archive có sibling assets đã biết không đồng nghĩa chúng được install;
   unexpected archive entry hoặc output entry → reject trước placement.
4. Toàn bộ bytes của projection và output manifest được tính trước ghi.
   Mỗi output phải khớp accepted archive entry bytes. Output thêm đúng
   YUTA-owned `SKILL.md`, `NOTICE.md`, `installation.json`: 70 files total.
   SKILL từ reviewed template; NOTICE chứa attribution/accepted notices,
   không phải upstream instruction. Receipt chứa artifact/projection hashes,
   wrapper hash/version và pending verification status, không tự cấp acceptance.
5. Stage ở `<repo>/.yuta-tooling/ui-ux-pro-max/<run-id>/candidate/`,
   không ở skill discovery roots. Chỉ tạo unique exclusive run directory sau
   D8 preflight; record exact file IDs/paths. Tạo files exclusive, không dùng
   archive permission/owner hoặc execute bit metadata.
6. Hash all staged files, full recursive allowlist equality, D15 content/search
   smoke trước placement. Không thêm sibling directory, kể cả transient.
7. Recheck target absent và guarded ancestor identity. Trên Windows dùng
   `MoveFileExW` flags 0, same volume, không REPLACE_EXISTING, COPY_ALLOWED
   hoặc DELAY_UNTIL_REBOOT. Một directory rename đưa toàn bộ candidate vào
   target, không incremental copy trực tiếp vào discoverable skill path.
   [Microsoft contract](https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-movefileexw)
   yêu cầu directory move cùng drive; không suy diễn crash durability từ
   rename success.
8. Target đã tồn tại/race → no replacement, STOP. Parent directory handles
   mở với FILE_FLAG_BACKUP_SEMANTICS/OPEN_REPARSE_POINT và không
   FILE_SHARE_DELETE, giữ suốt critical section; verify file IDs/volume.
   Không thể lấy guard hoặc unsupported filesystem → fail closed.
9. Post-placement verify hashes và activation; chỉ hoàn tất khi D15 toàn bộ
   PASS. Failure → D17, không ghi INTEGRATED.

Đây là construction proof: write set chỉ từ fixed projection + ba local
files, archive names không trực tiếp đi vào filesystem API; staging không
discoverable và không có mutation path cho siblings. Executable tests vẫn
phải chứng minh implementation ở Apply. Không gọi design evidence là actual
installation PASS. Threat boundary: trusted owner/admin-controlled machine,
không đảm bảo chống malicious administrator hoặc compromised Python/kernel.

Alternatives loại: upstream init (sibling side effects), install-all/delete,
force overwrite, unrestricted tar extraction, vendored upstream instructions.

#### Receipt and verification transition

Bounded revision, 2026-09-09: PROPOSED / AWAITING_SENSITIVE_DESIGN_REVIEW.
This revises only pending resume and receipt completion; it is not Apply
authorization. The previous all-checks receipt contract creates a cycle:
pending -> complete requires M12 -> M12 requires verified -> pending.

Keep exactly two receipt states, pending and verified. The receipt still hashes
the other 69 files, never itself, and the output contract remains exactly 70
files. Keep schemaVersion 1 and the existing exact top-level field set; tighten
the state-specific checks contract: pending has an empty checks object;
verified has exactly M01–M10, M11, M13 and PRE_COMPLETION_INTEGRITY, each PASS.
M12 is forbidden in this initial verified receipt. No legacy verified receipt
with another check set is silently accepted, migrated or repaired. There is no
known approved verified installation to migrate. A discovered one requires
review. Exact receipt hashes are external evidence, not self-hashes.

PRE_COMPLETION_VERIFICATION is an in-memory result, not another receipt state.
It requires actual current M01–M10 and M13, valid M11 evidence and final
pre-transition integrity. Receipt verified proves these prerequisites only;
it does not prove M12, normal-query sanity, task 5.4 completion or INTEGRATED.
General queries continue to reject pending before scratch creation or spawn.

#### Trusted pending-resume entrypoint

Bounded identity clarification, 2026-09-09: the current Control Tower approves
CURRENT_RESUME_IDENTITY_BASELINE_METHOD only. Gate 2b is reopened solely for
this D4/D17 clarification; captured baseline bytes remain CANDIDATE pending
separate review. No source implementation or task 5.4 execution is authorized.

HISTORICAL_RUN_IDENTITY_PROVENANCE means identities actually recorded during
the original staging/placement lifecycle. Its current status is
INCOMPLETE_NOT_RECONSTRUCTED; HISTORICAL_RUN_DIRECTORY_IDENTITY is NOT_RECORDED.
CURRENT_RESUME_IDENTITY_BASELINE means a new read-only identity capture under
explicit Control Tower authorization, with its own capture UTC and exact
bounded evidence hash. It is not recovered historical provenance, proves no
continuity before that UTC, does not fill or overwrite historical gaps and
does not imply that a path has remained unchanged since placement. Preserve
task-5.3 historical evidence byte-for-byte.

Only a separately Control-Tower-approved current baseline may later become
the forward-looking identity trust anchor. Future authorized resume must
revalidate its exact path set, native identities, file hashes, absence records,
environment and approval binding before mutation. Current observation or
approval of the capture method alone is insufficient. Keep the original
receipt runId, pending receipt preimage, target manifest and approved M11
snapshot bindings; they establish the current visible relationship only.

Record the candidate only in the existing Tasks bounded
CURRENT_RESUME_IDENTITY_BASELINE_BEGIN/END evidence unit. Hash every byte
strictly after its BEGIN marker line up to the byte before its END marker
line, including the interior terminal LF, without trim or newline conversion.
Hash the exact identity map with bootstrap.canonical, separately from this
block. Use existing bootstrap native identity semantics, not a new identity
representation or a generic checkpoint file.

For an absent path record type ABSENT, normalized absolute path, nearest
existing parent and its exact identity, intended final component, containment,
existing ancestor-chain reparse status and before/after absence observations.
Never invent owner, SID, file ID or volume/index fields for the absent path.
Absence is not creation authority. If the original run or a recovery parent is
absent, preserve it, finish this read-only capture and STOP for an explicit
Control Tower decision before source resume implementation may assume any
parent-creation semantics. Do not create a run, quarantine, lease, lock or
scratch as part of capture. Existing D8 read-only/non-delete-sharing directory
handles may be opened, checked and released without constructing a fake run.

Proposed bootstrap API:
`resume_pending(root, artifact_path, acceptance_path, reviewed_checkpoint)`.
It returns a bootstrap-owned guarded resume context, never a fabricated \_Run.
The supported bootstrap orchestration calls it; callers cannot construct the
context, assign PASS flags, supply a query verification token or skip checks.
The context is private, active only within its owning guard lifetime and bound
to the exact accepted artifact, target identity and original receipt runId.
It does not call the new-install constructor or create another candidate.

The first three arguments are validated repository-local inputs under D8.
The target is derived only from root plus the fixed D3 path. The checkpoint is
loaded by bootstrap from the existing change Tasks/review evidence whose exact
bytes and approval reference are explicitly accepted by Control Tower; it is
not an arbitrary receipt, caller policy or a new standalone checkpoint file.
Its exact required facts are: approved artifact/acceptance packet and record
digests; original runId and pending receipt digest; exact 70-file manifest and
69 non-receipt hashes; target and ancestor volume/file-ID/owner evidence from
actual recorded history or the separately approved forward-looking current
baseline, with their provenance and time boundaries kept distinct;
protected source/package/lock hashes; reviewed sibling/global inventory and
fingerprint; interpreter identity; M11 invocation/evidence and environment
binding; permitted owned recovery destination and current resume authority.
Missing facts, unknown fields, stale approval or mismatches fail closed before
verification or mutation. A supplied hash is not itself human authorization.
Do not reconstruct missing provenance from current files or a state string.

Before creating the private context, reacquire every D8 guard for the real
root, artifact, acceptance, evidence, target, original run and recovery parent.
Validate exact owner/SID, file IDs, volume, path type and containment, including
the target root and every recorded file. Acquire an exclusive bootstrap
mutation lease bound to real root and fixed target; reject another writer.
Hold non-delete-sharing ancestor handles and recheck identities/hashes and
surroundings before and after each check and immediately before transition.
Reacquisition is a new validation, not continuation of an expired guard.
The D8 trusted-workstation threat boundary remains unchanged.

Resume runs actual M01–M10 using only its private verification context, then
revalidates the approved M11 evidence against the current accepted environment
and runs current M13. A material or unresolved discovery/configuration change
requires new fresh Codex M11 before transition, after explicit environment
approval; an old PASS is retained historically, not transplanted. No baseline
is updated by resume. Any fresh drift stops the operation for review.

Only the owning context may perform its internal completion transition, once:
compare the exact reviewed pending receipt preimage on the same exclusively
opened receipt handle; reject a concurrent writer or state/runId change; write
only the exact canonical verified receipt, flush and recheck all 70 files and
the unchanged 69 non-receipt hashes. No 71st temporary target file. Hold guards
and the mutation lease through post-transition checks/recovery. This is not a
power-loss-atomic file transaction: partial/invalid receipt after a crash is
denied and preserved for review, never rebuilt or overwritten on resume.

Crash before transition leaves exact pending state resumable only through this
entrypoint after all guards/evidence are revalidated. Crash after transition
does not make task 5.4 complete; pending resume must reject verified state.
Only the separately approved verified-state path below can reassess it, and
missing exact postimage/ownership evidence remains a recovery blocker.

### D5. Distinct provenance record

Future `tooling/ui-ux-pro-max/artifact.json` là tracked candidate/acceptance
record, không chứa secrets. Fields độc lập:

| Field                   | Candidate evidence                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| npmName                 | ui-ux-pro-max-cli                                                                               |
| npmVersion              | 2.15.0                                                                                          |
| tarballUrl              | https://registry.npmjs.org/ui-ux-pro-max-cli/-/ui-ux-pro-max-cli-2.15.0.tgz                     |
| tarballSha256           | 50966c6c1cf99db6c9706222df6a3094e8043413e8b94a477ff8339ebc3fef52                                |
| npmIntegrity            | sha512-D0J/C40xrzzi5si6ZLtRGbEE5v3QjL7d4wJNnasmP3yfDSrGiuqVCdwQiqCNnIkbqOuVoA/uonR2o1WKXh3urw== |
| gitHead                 | a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5                                                        |
| upstreamRepository      | https://github.com/nextlevelbuilder/ui-ux-pro-max-skill                                         |
| observedMainCommit      | 4aad0584d92131626b16d4ff4d77f0455385013c                                                        |
| bundledSkillName        | ui-ux-pro-max, từ published codex template                                                      |
| bundledSkillVersion     | NOT_PRESENT trong inspected Codex frontmatter; không gán npmVersion                             |
| upstreamTagRelationship | UNVERIFIED; không tự dựng tag                                                                   |
| localWrapperVersion     | yuta-adapter-1, khác npm/skill version                                                          |
| licenseProvenance       | UNCERTAIN, acceptance reference absent                                                          |

Registry gitHead là claim provenance của package, không chứng minh source-tree
reproducible build. Main snapshot đi trước 37 commits theo Discovery; không
dùng main thay published bytes. Artifact record chứa toàn bộ 196-entry
inventory và fixed output map, per-entry hashes derived từ exact accepted
tarball trước output. Không đủ inventory/hash proof → STOP, không trust label.

### D6. Executable dependency surface

Installer dùng Python stdlib `hashlib/json/tarfile/pathlib/os/ctypes`, không
npm CLI dependencies hoặc package hooks. Search smoke/use execute chỉ accepted
core Python `search.py` qua YUTA runner, không scripts/tests hoặc refresh tools.
Python runtime/version/path/digest phải ghi vào evidence; stdlib/OS vẫn là
trusted dependency, không tuyên bố hermetic build.

Không execute chalk/commander/ora/prompts hoặc cài dependency graph từ npm.
Top-level pin chứng minh selected bytes, không full npm graph reproducibility.
Core files không chỉnh sửa; wrapper riêng là local adaptation có hash/version
riêng. Nếu core cần third-party dependency ngoài observed closure trong smoke,
STOP và review Design, không pip install tự động.

### D7. LICENSE / PROVENANCE REVIEW INPUT

LICENSE_PROVENANCE: UNCERTAIN.

Control Tower phải review trước Apply/install một packet bounded cho exact
artifact, 67 retained assets và local adaptation:

- exact package manifest license MIT và published README CC-BY-NC-4.0;
- upstream LICENSE MIT tại pinned reviewed commit, không chỉ mutable main URL;
- correction PR 486, merge commit
  `b2ac9b2aa1c3bd6bb748b4b0f79c90319d50e0da`, scope/correction diff và sự thật
  tarball cũ không đổi bởi merge;
- `data/data-provenance.json`, `data/google-font-licenses.json`,
  `data/phosphor-icons-upstream.json` và mọi notice/license liên quan retained
  core scripts/data; đánh giá assets/excerpts/attribution riêng;
- NOTICE content và việc thay upstream instruction entrypoint bằng YUTA wrapper;
- retained/excluded file inventory, digests, source relationship và evidence
  còn thiếu. Sibling `ui-styling/LICENSE.txt` không license core theo suy đoán;
- rõ YUTA không execute installer, không commit third-party payload vào Git,
  nhưng vẫn local-copy/use/adapt upstream assets. Bootstrap không tự làm mất
  nghĩa vụ licensing hoặc quyết định redistribution/derivative work.

Không quyết định legal conclusion. Receipt chỉ tham chiếu explicit current
Control Tower acceptance với artifact/diff hash, date, bounded use;
UNCERTAIN/absent/mismatch → Apply/install blocked. Approval Design/Tasks không
thay acceptance. Thiếu license notice yêu cầu output mới → revise manifest/
NOTICE và review trước Apply, không broadening âm thầm.

### D8. Existing-path and concurrency protection

Preflight read-only exact repo realpath, filesystem/volume và path type/file
IDs cho root, `.agents`, `.agents/skills`, target, staging ancestors và
selected artifact/acceptance. Reject junction/reparse/symlink ancestor, outside
root, unknown owner, unsupported filesystem; kiểm tra case-folded containment.
Record existing files/hash set kể cả hidden files, sibling inventory và
user/admin config path/hash fingerprint (không đưa secrets vào evidence).

Exclusive guarded run, không cạnh tranh writer cùng target. Existing exact
target: compare full 70-file manifest + content + acceptance; run verification
rồi report VERIFIED_NO_CHANGE, không skip ngầm. Different/unknown target:
CONFLICT, không xóa/overwrite. Một lock cooperative đơn lẻ không đủ chống
path replacement; giữ parent handles D4. Thiếu quyền guard → STOP.

Stale staging directory không tự xóa. Chỉ cleanup run này với identity/hashes
đúng, không recursively xóa repo, `.agents` hoặc `.agents/skills`.
Recheck trước mỗi placement/rollback; phát hiện writer khác → preserve/STOP.

### D9. Discovery and constrained entrypoint

YUTA-owned template `tooling/ui-ux-pro-max/SKILL.md.template` tạo
`SKILL.md` name `ui-ux-pro-max`, local metadata yuta-adapter-1. Description
hẹp: external advisory search cho approved YUTA UI design/VERIFY; không
installation, Product decisions hoặc tự validate integration. Giữ default
implicit discovery, không tự đổi sang explicit-only; discovery không đồng
nghĩa quyền invoke search/mutate.

Entrypoint bắt buộc đọc root/scoped AGENTS và canonical policy, valid usage,
acceptance/receipt trước query. Chỉ gọi YUTA runner. Không render/copy
upstream `skill-content.md` và `quick-reference.md` vào active instructions
vì chứa broader defaults/persistence flow. Name không chứng minh nguyên bản:
verification ghi rõ LOCAL_ADAPTATION, raw upstream assets unchanged.

Không có `agents/openai.yaml` tools/dependencies grants hoặc global config
mutation. Fresh Codex task kiểm tra exact local path; duplicate-name skill →
NEEDS_REVIEW, không dùng nhầm global source. Activation test phải chứng minh
external conflict bị reject, internal conflict STOP, REQUIRED invalid tool
block và self-integration NA. Đây là governance/behavior controls, không
security sandbox tuyệt đối của model; OS permissions vẫn cần giữ nguyên.

### D10. Non-persistent query gateway

`scripts/ui-ux-pro-max/query.py` là only supported entrypoint cho queries.
Nó validate accepted manifest và installed hashes, nhận positional query,
đúng một `--domain ux` hoặc `--stack nextjs` cho initial bounded surface,
`--max-results` 1–10; luôn yêu cầu JSON output từ upstream, capture stdout.
Unsupported flag/domain/stack fail trước spawn. Không shell=True hoặc eval.

Từ chối `--persist`, `--design-system`, `--output-dir`, `--page`,
`--force` và numeric dials trong slice này. Không có MASTER.md generation.
Chạy Python absolute validated executable với `-B -E -s`, sanitized environment,
cwd là owned run scratch, no user-site injection; bỏ PYTHONPATH. Dùng `-s`
trực tiếp vì `-E` bỏ qua Python environment options. Search output là data,
không shell instructions.
Không sửa global config hoặc install fonts/libraries từ recommendations.

Đây là query surface nhỏ phục vụ UX/Next guidance; thêm domain/tool mode cần
bounded review, không automatic updater. Core có persistence code nhưng
supported runner không expose; direct execution ngoài runner không được policy
cho phép và không được coi verified integration use.

### D11. Exact future implementation path-set

Chưa chỉnh bất kỳ path nào sau đây trong Design. Sau reviewed Tasks, license
acceptance và explicit Apply, write allowlist sẽ gồm:

| Path                                                     | Bounded change                                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`                | One canonical external-tool policy, D1–D18 operational contract                      |
| `AGENTS.md`                                              | Short routing + no implicit mutation grant                                           |
| `docs/README.md`                                         | Index link only                                                                      |
| `docs/ui/README.md`                                      | Policy routing only                                                                  |
| `docs/ui/YUTA_FRONTEND_RULES.md`                         | Reference/disposition rule link, no duplicated stack catalog                         |
| `docs/ui/DELIVERY_WORKFLOW_MODES.md`                     | Same modes/phases, usage record reference                                            |
| `docs/ui/DESIGN_TO_CODE_WORKFLOW.md`                     | Phase 0 classification and VERIFY reference, no new phase                            |
| `docs/YUTA_WORKFLOW_V3.md`                               | Usage routing and three Gate 3 assessments unchanged                                 |
| `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`                 | Existing evidence blocks get usage/provenance reference                              |
| `docs/chatGPT/YUTA_PAGE_CHAT_OPERATING_PROMPT_V3.md`     | Page handoff/VERIFY references only                                                  |
| `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md` | Review usage, artifact gate and reference routing                                    |
| `docs/DEVELOPMENT_WORKFLOW.md`                           | Explicit bounded bootstrap/check commands and host limitation                        |
| `.agents/skills/yuta-run-change/SKILL.md`                | Reference policy at classification/VERIFY; no new state/gate                         |
| `.gitignore`                                             | Exact generated `/.agents/skills/ui-ux-pro-max/` and `/.yuta-tooling/ui-ux-pro-max/` |
| `tooling/ui-ux-pro-max/artifact.json`                    | Accepted candidate/projection manifest; initially UNCERTAIN                          |
| `tooling/ui-ux-pro-max/SKILL.md.template`                | YUTA adapter, not vendored upstream instructions                                     |
| `tooling/ui-ux-pro-max/NOTICE.md.template`               | Reviewed attribution, no guessed license conclusion                                  |
| `scripts/ui-ux-pro-max/bootstrap.py`                     | Standard-library verifier/stager/placement/rollback                                  |
| `scripts/ui-ux-pro-max/query.py`                         | Non-persistent bounded query runner                                                  |
| `scripts/ui-ux-pro-max/test_bootstrap.py`                | Local deterministic safety/negative checks                                           |

Generated paths only D3/D4, not tracked runtime code. No package.json/lockfile
dependency edits. New commands below invoke these planned files directly and
are explicitly NEW, not falsely existing scripts. Policy not duplicated into
all callers; each reference only states when to route.

No page-pack template/provenance schema or sealed prompt modifications;
classification is recorded in existing freeform analysis/plan fields. No
`yuta-finish-change` change: Gate 3 evidence references already remain intact.
Canonical Product Knowledge/CURRENT_STATE/MODULE_REGISTRY/architecture summaries
are excluded. Post-archive Knowledge Consolidation alone decides any later
reconciliation; implementation success cannot promote lifecycle.

### D12. Frontend governance relationship

Question-type routing stays `docs/AUTHORITY_MODEL.md`. Approved change
Specs/Design constrain delivery within accepted durable boundaries; change
artifacts do not become normative main specs by existing. Shared/app/page UI
rules remain in `docs/ui`, nearest AGENTS and approved page scope.
`packages/ui/src/index.ts` owns exports, `packages/ui/src/styles/global.css`
owns semantic tokens; component contracts and module conventions remain owned
by their existing sources. No numeric app presets, fonts, colors, new system
or library become authority from external recommendation.

Alternative universal hierarchy is rejected; insufficient controlling source →
NEEDS_REVIEW. An external recommendation accepted as a future change still
passes normal YUTA review, not merely ACCEPTED_DEVIATION.

### D13. Verify findings contract

Inside existing `03-final-review.md` TECHNICAL VERIFY, add
`EXTERNAL_DESIGN_INTELLIGENCE` block with D2 usage record, manifest/receipt
hashes, exact query/argv, interpreter identity, UTC, exit code, stdout/stderr
hash and relevant excerpt. Raw evidence stored in existing change review
evidence locations only, not a second permanent design system.

Finding fields: id, reference, YUTA authority link, affected scope, observation,
status, rationale, approval reference if applicable. Closed statuses:
PASS (no issue for assessed question only), FINDING (unresolved actionable
observation), ACCEPTED_DEVIATION (explicit owning YUTA approval required),
REJECTED_EXTERNAL_RECOMMENDATION (incompatible/not adopted with reason),
NOT_APPLICABLE (scoped rationale). Status is not a new QA vocabulary.

REQUIRED unavailable/error → blocker recorded, not PASS/FINDING fabrication.
No ACCEPTED_DEVIATION can override auth/security/durable boundaries without
their owning explicit decision. Unresolved internal conflict stays STOP.
Keep Technical Implementation Compliance, VERIFY and QA independently reported.

### D14. Browser QA

Reference `docs/YUTA_QA_PROTOCOL.md`; no protocol modification needed.
UI_AFFECTING=YES always requires its real-route evidence, screenshot hashes,
responsive/state coverage. Heuristic clean result cannot change QA FAIL or
BLOCKED_BY_ENVIRONMENT. This integration: UI_AFFECTING=NO,
BROWSER_QA_REQUIRED=NO, but tooling runtime QA REQUIRED; not QA NA by shortcut.

### D15. Exact installation smoke matrix

All commands here are proposed for authorized Apply, NOT RUN in Design.
Use validated Python executable and runner D10; staged mode in bootstrap uses
same guard/parser against the selected candidate, never bypasses acceptance.
For final target, proposed commands from repo root:

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
| M12 | bootstrap verify_existing after verified transition                                             | VERIFIED_NO_CHANGE after full identity/content and bound smoke-evidence revalidation; no mutation     |
| M13 | own bootstrap unit/negative suite                                                               | Traversal, case collision, links, target race, partial stage, digest and Python failures fail closed  |

M01–M10 run staged before placement where applicable and are rerun in the
guarded pending-resume context. M11 follows provisional placement and must
remain valid for the approved current environment; otherwise fresh M11 is
required. Current M13 and pre-completion integrity precede receipt transition.
M12 follows transition and is external evidence, never a prerequisite for
creating the initial verified receipt. Save actual stdout/results, invocation
and inventory hashes. Exit zero without relevant results fails search smoke.
No upstream tests claim legal/UI correctness.

```text
exact pending target (general query = PENDING_DENIED)
  -> trusted resume + all D8 guards + exact reviewed checkpoint
  -> current M01–M10 + valid/fresh M11 + current M13 + integrity
  -> PRE_COMPLETION_VERIFICATION = PASS
  -> one guarded pending -> verified receipt transition
  -> M12 verify_existing = VERIFIED_NO_CHANGE
  -> one normal verified-state query sanity PASS
  -> final exact integrity PASS -> task 5.4 eligible for completion
any failure -> D17; never INTEGRATED by receipt state alone
```

#### Supported verified-state M12 operation

Proposed bootstrap API:
`verify_existing(root, artifact_path, acceptance_path, reviewed_checkpoint)`.
It derives the same fixed target as resume and returns VERIFIED_NO_CHANGE
only after full read-only revalidation, not target-exists -> skip. It can be
called by the guarded post-transition orchestration; standalone use must
reacquire all guards and the exact approved evidence independently. No
caller-supplied target, receipt, replacement or update policy is accepted.

Re-read and validate the accepted compressed artifact SHA-256/SRI, complete
196-member inventory and exact 67-member projection; independently derive and
compare all 67 raw hashes plus reviewed SKILL and NOTICE. Verify record and
acceptance identity, exact target location, all 70 paths and directories,
strict verified receipt schema/check-set and externally recorded exact
postimage; check every file identity, protected ancestors and the reviewed
protected/sibling/global state before and after. Validate interpreter identity
and actual pre-completion smoke/M11/M13 evidence bound to these exact bytes,
source hashes and environment. PASS labels or receipt existence alone are
insufficient. Missing/stale smoke evidence fails closed; this read-only
operation does not repair it or manufacture another smoke run.

M12 does not write the receipt, target, stage, global configuration, source,
scratch or other files, and does not run an updater. It reads the actual
checks performed immediately before transition and verifies their binding;
the separately required normal query is a real post-M12 execution, not part
of a no-change claim. Record M12 argv/UTC/exit/result and before/after hashes
externally in existing task/review evidence. Repeating the operation on the
same fully verified state returns VERIFIED_NO_CHANGE with identical bytes.
Any mismatch returns failure without mutation. Bootstrap orchestration, not
this read-only operation, owns subsequent D17 recovery.

Task 5.4 requires verified receipt, actual M12 PASS, a normal D10 gateway
query (`keyboard accessibility`, domain ux, max-results 3) with meaningful
JSON and actual exit/output evidence, and final path/hash/identity integrity.
The normal query receives no pending verification context or bypass token.
It must preserve the target and globals; its approved scratch behavior remains
D10. All M01–M13 remain required for overall integration completion.

### D16. Controlled update sequence

candidate discovery → provenance/license review → artifact/projection/wrapper
diff → explicit approval (exact old/new hashes) → bounded stage/install →
smoke/activation → version record in reviewed artifact.json/evidence.

No automatic updater. Existing different target stops ordinary bootstrap.
A reviewed update uses dedicated explicit `replace-reviewed` mode: require
old manifest/hash equality and rollback authorization; stage new candidate
and smoke fully, move verified old directory to owned same-volume backup,
then no-replace move new directory to target under D8 guards. This is a bounded
two-rename maintenance window, NOT an atomic directory swap. Runner denies use
while update receipt pending. Keep backup until all post-placement checks pass;
do not delete unrecognized data. New target failure → restore old exact backup
only if target is still owned and unchanged, otherwise preserve and STOP.
Update mode cannot accept `--force`, arbitrary old paths or global installation.

### D17. Failures, recovery and completion

| Failure                                                           | Outcome before completion                                                                                            |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| License unaccepted / wrong acceptance                             | BLOCKED_LICENSE, no archive processing writes                                                                        |
| Digest/inventory mismatch, missing core, unexpected entry/sibling | Reject before extraction/placement; no success                                                                       |
| Python missing / unsupported host/filesystem                      | Block before mutation; no dependency installation                                                                    |
| Existing target conflict/path escape/reparse/guard failure        | Preserve exact existing paths, STOP                                                                                  |
| Partial staging/write failure                                     | No target; cleanup only recorded owned run files, retain error evidence                                              |
| Staged smoke failure                                              | No placement; remove only owned stage after hashes/identity checks                                                   |
| Post-placement smoke/activation failure                           | Not INTEGRATED; quarantine new owned target back to non-discoverable run path; restore reviewed old target if update |
| Concurrent change during recovery                                 | No delete/overwrite/restore over unknown state; preserve evidence and request review                                 |
| Crash after rename before completed receipt                       | On resume verify manifest/content; pending does not authorize use or imply success                                   |

Atomic initial placement means one namespace operation for complete candidate,
not guaranteed power-loss durable transaction. No state INTEGRATED until every
required M check, scope integrity and evidence is accepted for completion.
Do not delete broad roots; cleanup failures are explicit blockers, not hidden.
Local malicious administrator/same-user arbitrary process is not neutralized by
advisory instructions; require trusted workstation and exclusive guarded run.

#### Bounded resume and post-transition failure handling

For forward-looking recovery, the separately approved current identity
baseline described in D4 may bind the original run and recovery ancestors.
It does not establish historical run-directory continuity or change the
INCOMPLETE_NOT_RECONSTRUCTED historical status. Record each run/quarantine
path as EXISTING_EXACT, ABSENT or CONFLICTING_OR_UNKNOWN at capture time;
EXISTING_EXACT describes current native observations, not baseline approval.
An absent run/recovery parent has only its exact nearest-existing-parent
identity and absence evidence, never a fabricated identity of its own.
Keep it absent and STOP after capture for Control Tower review; later creation
requires explicit authorization and is not implied by D17 recovery. A future
authorized recovery must revalidate the approved current identity/absence
baseline before any mutation, without weakening the existing owned-tree,
postimage, same-volume or guarded no-replace requirements below.

The D4/D15 revision preserves existing D17 failures and adds explicit handling
after pending -> verified. M12 failure, normal-query failure or final integrity
failure means task 5.4 BLOCKED and NOT_INTEGRATED, even if receipt says verified.
Never silently rewrite verified back to pending, retry completion in place,
repair content or label the failed command PASS.

The owning resume orchestration may quarantine only the exact still-owned
post-transition tree to
`.yuta-tooling/ui-ux-pro-max/<original-runId>/quarantine`, outside discovery.
Before that move, require the destination absent, the original run and target
identities still matching, all 70 paths and the recorded verified postimage
matching, and recovery ancestor/owner/volume guards valid. Use D8 guarded
same-volume no-replace movement, then verify the moved identity and bytes.
Preserve the verified receipt there and record both failed checks and recovery
outcome externally. No deletion or in-place receipt rollback is authorized.

If failure concerns only surroundings or query behavior while this exact owned
tree and recovery path remain provably intact, quarantine does not adopt or
modify the changed surroundings; record that drift for review. If ownership,
target bytes, receipt, ancestors or destination conflict, preserve all paths
and STOP with RECOVERY_BLOCKED_BY_DRIFT. Do not move unknown contents. This
initial installation has no prior verified backup to restore. D16 restoration
remains limited to separately reviewed updates and exact owned backup evidence.

After a crash, a partial/unrecorded receipt or missing ownership/postimage
evidence is preserved for explicit recovery review, not inferred from current
bytes. No automatic recovery, activation or lifecycle promotion follows from
the presence of a verified receipt. A quarantined tree requires a separately
approved recovery path; it is not silently reinstalled by pending resume.

### D18. Validation / QA plan

Current repository commands, after implementation when authorized:

- `pnpm docs:check`
- `pnpm architecture:check`
- `pnpm -r --if-present typecheck`
- `pnpm format:check` — inherited warning attribution, no repo-wide write
- `pnpm test:ui-pack` and `pnpm ui:pack:check` — routing/provenance compatibility
- `openspec validate ui-ux-pro-max-integration --strict --no-interactive`
- `pnpm exec prettier --check <exact changed Markdown/JSON files>`
- `git diff --check -- <exact delivery paths>` plus hash inventory for untracked.

NEW planned commands (files do not exist now): `python -B -m unittest discover
-s scripts/ui-ux-pro-max -p test_bootstrap.py`;
`python -B scripts/ui-ux-pro-max/bootstrap.py verify-content`;
`python -B scripts/ui-ux-pro-max/bootstrap.py install --artifact
<repo-local-tgz> --acceptance <reviewed-json>`; D15 query commands.
No invented lint command, no npm CLI execution. New commands need tests before
being documented as working. App builds/cloud/local tests not required by
non-runtime scope; report explicitly if not run.

Safety tests use locally constructed inert archives/fixtures in approved
disposable scratch, never downloaded unaccepted upstream code. Cover each D17
failure and output-set safety, no mutate-then-delete siblings workaround.
Runtime/tooling QA verifies actual approved installed queries and activation;
cannot be waived by integration usage NOT_APPLICABLE.

## Risks / Trade-offs

- [License contradiction] → explicit pre-Apply acceptance with exact notices;
  no claim bootstrap removes legal risk.
- [Local wrapper differs from upstream skill] → preserve raw assets, distinct
  adapter metadata and reviewed behavior; do not claim byte-identical SKILL.
- [Windows-only first installer] → fail other hosts; cross-platform support
  requires reviewed no-replace/guard proof, not unsafe fallback.
- [No dynamic upstream installer] → own parser/manifest/maintenance tests;
  smaller executable dependency surface but more YUTA-owned verification.
- [Models are not a sandbox] → trusted instruction routing, query gateway and
  actual behavior QA; no absolute security guarantee.
- [Concurrent checkout] → protected hash review and exclusive path guards;
  never sweep Pointage/Formalités into delivery.
- [Receipt/activation gap] → pending is unusable; quarantine/restore only owned
  exact bytes, with explicit blockers for recovery conflict.

## Migration Plan

No database/runtime/production migration. After Gate 2b, Tasks review, license
acceptance and Apply authorization: implement reviewed local tooling/policy,
test inert safety cases, procure exact accepted artifact explicitly, stage and
verify, place and activate, complete tooling QA. Sync/Archive and any Knowledge
Consolidation remain separate later authorization stages. Rollback D17 restores
local tool state only; does not revert semantic Product work or unrelated files.

## Open Questions

License/provenance acceptance remains mandatory and unresolved, not an
implementation assumption. No automatic 2.15.0 approval. If Control Tower
rejects candidate or Windows-only bounded mechanism, return for Design revision;
do not silently change artifact/platform contract. Numeric presets are excluded.
No Tasks or Apply follows from this document.

## Appendix A — Exact candidate core asset projection

Derived read-only from prior 2.15.0 tar inventory: 39 data + 28 scripts = 67.
Each source/destination below is an exact key, not an extraction prefix rule.
Size is a review aid; exact bytes are bound by D5 tarball digest and verified
per-entry hashes. Source archive size/type/path discrepancies fail closed.
The remaining known 129 archive files have NO placement mapping.

| Archive source                                                               | Target relative path                                          | Bytes  |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------- | ------ |
| `package/assets/data/app-interface.csv`                                      | `data/app-interface.csv`                                      | 11046  |
| `package/assets/data/catalog-summary.json`                                   | `data/catalog-summary.json`                                   | 2392   |
| `package/assets/data/charts.csv`                                             | `data/charts.csv`                                             | 23365  |
| `package/assets/data/colors.csv`                                             | `data/colors.csv`                                             | 37940  |
| `package/assets/data/data-provenance.json`                                   | `data/data-provenance.json`                                   | 36686  |
| `package/assets/data/google-font-licenses.json`                              | `data/google-font-licenses.json`                              | 433127 |
| `package/assets/data/google-fonts.csv`                                       | `data/google-fonts.csv`                                       | 747241 |
| `package/assets/data/icons.csv`                                              | `data/icons.csv`                                              | 57945  |
| `package/assets/data/landing.csv`                                            | `data/landing.csv`                                            | 25449  |
| `package/assets/data/motion.csv`                                             | `data/motion.csv`                                             | 14679  |
| `package/assets/data/phosphor-icons-upstream.json`                           | `data/phosphor-icons-upstream.json`                           | 823933 |
| `package/assets/data/products.csv`                                           | `data/products.csv`                                           | 75623  |
| `package/assets/data/react-performance.csv`                                  | `data/react-performance.csv`                                  | 15080  |
| `package/assets/data/stacks/angular.csv`                                     | `data/stacks/angular.csv`                                     | 19863  |
| `package/assets/data/stacks/astro.csv`                                       | `data/stacks/astro.csv`                                       | 14591  |
| `package/assets/data/stacks/avalonia.csv`                                    | `data/stacks/avalonia.csv`                                    | 27327  |
| `package/assets/data/stacks/flutter.csv`                                     | `data/stacks/flutter.csv`                                     | 14192  |
| `package/assets/data/stacks/html-tailwind.csv`                               | `data/stacks/html-tailwind.csv`                               | 16551  |
| `package/assets/data/stacks/javafx.csv`                                      | `data/stacks/javafx.csv`                                      | 33577  |
| `package/assets/data/stacks/jetpack-compose.csv`                             | `data/stacks/jetpack-compose.csv`                             | 12295  |
| `package/assets/data/stacks/laravel.csv`                                     | `data/stacks/laravel.csv`                                     | 20163  |
| `package/assets/data/stacks/nextjs.csv`                                      | `data/stacks/nextjs.csv`                                      | 18687  |
| `package/assets/data/stacks/nuxt-ui.csv`                                     | `data/stacks/nuxt-ui.csv`                                     | 24106  |
| `package/assets/data/stacks/nuxtjs.csv`                                      | `data/stacks/nuxtjs.csv`                                      | 23014  |
| `package/assets/data/stacks/react-native.csv`                                | `data/stacks/react-native.csv`                                | 14049  |
| `package/assets/data/stacks/react.csv`                                       | `data/stacks/react.csv`                                       | 19036  |
| `package/assets/data/stacks/shadcn.csv`                                      | `data/stacks/shadcn.csv`                                      | 23184  |
| `package/assets/data/stacks/svelte.csv`                                      | `data/stacks/svelte.csv`                                      | 15078  |
| `package/assets/data/stacks/swiftui.csv`                                     | `data/stacks/swiftui.csv`                                     | 15323  |
| `package/assets/data/stacks/threejs.csv`                                     | `data/stacks/threejs.csv`                                     | 46051  |
| `package/assets/data/stacks/uno.csv`                                         | `data/stacks/uno.csv`                                         | 30091  |
| `package/assets/data/stacks/uwp.csv`                                         | `data/stacks/uwp.csv`                                         | 24692  |
| `package/assets/data/stacks/vue.csv`                                         | `data/stacks/vue.csv`                                         | 12813  |
| `package/assets/data/stacks/winui.csv`                                       | `data/stacks/winui.csv`                                       | 27890  |
| `package/assets/data/stacks/wpf.csv`                                         | `data/stacks/wpf.csv`                                         | 24158  |
| `package/assets/data/styles.csv`                                             | `data/styles.csv`                                             | 149478 |
| `package/assets/data/typography.csv`                                         | `data/typography.csv`                                         | 49997  |
| `package/assets/data/ui-reasoning.csv`                                       | `data/ui-reasoning.csv`                                       | 77360  |
| `package/assets/data/ux-guidelines.csv`                                      | `data/ux-guidelines.csv`                                      | 27516  |
| `package/assets/scripts/core.py`                                             | `scripts/core.py`                                             | 41234  |
| `package/assets/scripts/design_system.py`                                    | `scripts/design_system.py`                                    | 70937  |
| `package/assets/scripts/reasoning_contract.py`                               | `scripts/reasoning_contract.py`                               | 5824   |
| `package/assets/scripts/search.py`                                           | `scripts/search.py`                                           | 9123   |
| `package/assets/scripts/tests/fixtures/catalogs/google-api.json`             | `scripts/tests/fixtures/catalogs/google-api.json`             | 1079   |
| `package/assets/scripts/tests/fixtures/catalogs/google-catalog.json`         | `scripts/tests/fixtures/catalogs/google-catalog.json`         | 1772   |
| `package/assets/scripts/tests/fixtures/catalogs/google-existing.csv`         | `scripts/tests/fixtures/catalogs/google-existing.csv`         | 480    |
| `package/assets/scripts/tests/fixtures/catalogs/google-metadata.json`        | `scripts/tests/fixtures/catalogs/google-metadata.json`        | 328    |
| `package/assets/scripts/tests/fixtures/catalogs/google-overrides.json`       | `scripts/tests/fixtures/catalogs/google-overrides.json`       | 97     |
| `package/assets/scripts/tests/fixtures/catalogs/icons-curated.csv`           | `scripts/tests/fixtures/catalogs/icons-curated.csv`           | 495    |
| `package/assets/scripts/tests/fixtures/catalogs/phosphor-core.json`          | `scripts/tests/fixtures/catalogs/phosphor-core.json`          | 571    |
| `package/assets/scripts/tests/fixtures/catalogs/phosphor-package.json`       | `scripts/tests/fixtures/catalogs/phosphor-package.json`       | 370    |
| `package/assets/scripts/tests/fixtures/catalogs/phosphor-react-exports.json` | `scripts/tests/fixtures/catalogs/phosphor-react-exports.json` | 87     |
| `package/assets/scripts/tests/fixtures/catalogs/phosphor-react-package.json` | `scripts/tests/fixtures/catalogs/phosphor-react-package.json` | 81     |
| `package/assets/scripts/tests/fixtures/relevance-baseline.json`              | `scripts/tests/fixtures/relevance-baseline.json`              | 89436  |
| `package/assets/scripts/tests/fixtures/relevance-cases.json`                 | `scripts/tests/fixtures/relevance-cases.json`                 | 36734  |
| `package/assets/scripts/tests/fixtures/relevance-thresholds.json`            | `scripts/tests/fixtures/relevance-thresholds.json`            | 5079   |
| `package/assets/scripts/tests/test_catalog_refresh.py`                       | `scripts/tests/test_catalog_refresh.py`                       | 19466  |
| `package/assets/scripts/tests/test_core_data_quality.py`                     | `scripts/tests/test_core_data_quality.py`                     | 8954   |
| `package/assets/scripts/tests/test_core.py`                                  | `scripts/tests/test_core.py`                                  | 16680  |
| `package/assets/scripts/tests/test_data_contracts.py`                        | `scripts/tests/test_data_contracts.py`                        | 19513  |
| `package/assets/scripts/tests/test_design_system_mode.py`                    | `scripts/tests/test_design_system_mode.py`                    | 7690   |
| `package/assets/scripts/tests/test_native_desktop_stack_freshness.py`        | `scripts/tests/test_native_desktop_stack_freshness.py`        | 8170   |
| `package/assets/scripts/tests/test_relevance_evaluator.py`                   | `scripts/tests/test_relevance_evaluator.py`                   | 8430   |
| `package/assets/scripts/tests/test_style_taxonomy.py`                        | `scripts/tests/test_style_taxonomy.py`                        | 7425   |
| `package/assets/scripts/tests/test_text_layout_resilience.py`                | `scripts/tests/test_text_layout_resilience.py`                | 5874   |
| `package/assets/scripts/tests/test_web_stack_freshness.py`                   | `scripts/tests/test_web_stack_freshness.py`                   | 7699   |
| `package/assets/scripts/validate_data.py`                                    | `scripts/validate_data.py`                                    | 52064  |
