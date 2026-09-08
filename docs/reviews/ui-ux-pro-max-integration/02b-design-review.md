Change: ui-ux-pro-max-integration
Gate: 2b — Sensitive Design
Review status: APPROVED
Created: 2026-09-08T15:00:59Z
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — REQUIRED

Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-08T15:18:13Z

Current decision: Gate 2b APPROVED for exact Design SHA-256
`77fcbdc9938f48c7414d037e5216a2d5f0d2b725561b55ed08d5e80db47dde33`
and pre-metadata packet
`3d8ae1cb987e814ce70c3be5c686c5ec835024fc20b03145c42aa2d68d6a8967`.
Only Tasks / Implementation Plan / embedded Technical Implementation Contract
and bounded license review input are authorized. Apply/download/install and
canonical governance edits remain NOT AUTHORIZED. Historical Design-stage
evidence below is preserved; this metadata does not accept artifact licensing.

# Sensitive Design Review

## Authorization and preserved integrity

Current user Gate 2 approval cho Design only, không Tasks/Apply/download/
install/execute upstream, không sửa canonical governance hoặc `.agents/skills`.
User-bound hashes rechecked trước edit:
Specs `568d37a253878fee2a9f853b027a21f95f708af77c8df496ae99fa67f38b2646`;
pre-metadata Gate 2 packet
`a5b33fa549dfd7925ec450b5b7b1d094e367df6b8432d784cfc01d8bffe12510`.
29/29 Gate 1 table entries khớp (26 protected sources, 3 artifacts/metadata).

Gate 2 chỉ thêm current approval metadata; historical text không rewrite.
Updated Gate 2 hash:
`735ed0e987511f43ff817b5c38cc17be75ef0d9a6173a16f25a027033b7e94d3`.

| Approved artifact path                                                                          | SHA-256                                                            |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/ui-ux-pro-max-integration/analysis.md`                                        | `88198e944804810a145e463513127e498a9e7dfccb19ef0656dcea019bb235d7` |
| `openspec/changes/ui-ux-pro-max-integration/proposal.md`                                        | `04454de85462b9f571b18022f250a9fdb996b43636eb22a3a7710897b2ba5d45` |
| `openspec/changes/ui-ux-pro-max-integration/specs/tooling/external-design-intelligence/spec.md` | `568d37a253878fee2a9f853b027a21f95f708af77c8df496ae99fa67f38b2646` |

## Exact Design

Path: `openspec/changes/ui-ux-pro-max-integration/design.md`
SHA-256: `77fcbdc9938f48c7414d037e5216a2d5f0d2b725561b55ed08d5e80db47dde33`

Hash method: Node built-in `crypto.createHash("sha256")` over exact
`fs.readFileSync(path)` bytes, lowercase hex. No normalization.
Packet hash returned separately, no self-hash.

```markdown
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

`installation.json` chứa hashes của 69 files còn lại, không chứa hash của
chính nó. Validation receipt kiểm tra exact schema, artifact/acceptance/
wrapper identity và controlled state; hash exact receipt sau transition được
ghi trong external review evidence, tránh self-hash cycle. Tổng path-set luôn
là 70. Chỉ bootstrap đang giữ run/parent guards được đổi pending thành verified.

Pending installation chỉ cho phép verification do bootstrap sở hữu với
run-scoped in-memory verification context đã kiểm acceptance/content, không
public `skip-check` flag. General query runner từ chối pending. M05–M08 trong
post-placement smoke dùng context này; M11 kiểm discovery/instruction behavior
không cấp quyền general query trước completion. Nếu activation không được
kiểm chứng ngay, giữ pending và báo blocker, không mở tool cho use bình thường.

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
| M12 | repeated verified bootstrap same artifact                                                       | VERIFIED_NO_CHANGE only after full hash/content/smoke; no silent skip                                 |
| M13 | own bootstrap unit/negative suite                                                               | Traversal, case collision, links, target race, partial stage, digest and Python failures fail closed  |

M01–M10 run staged before placement where applicable, then final verification;
M11 only after provisional placement, before integration completion. Save actual
stdout/results and inventory hashes. Search process exit 0 without relevant
results fails smoke. No upstream tests claiming legal/UI correctness.

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
```

## D1–D18 traceability

| Design decision | Requirements      | Scenarios                 |
| --------------- | ----------------- | ------------------------- |
| D1              | R01–R02           | S01–S04                   |
| D2              | R03–R05           | S05–S12                   |
| D3              | R10, R12–R13      | S21–S22, S27–S31          |
| D4              | R12–R14           | S27–S34                   |
| D5              | R11, R15          | S24–S25, S35–S36          |
| D6              | R15               | S35–S36                   |
| D7              | R11               | S23–S26                   |
| D8              | R13               | S29–S31                   |
| D9              | R01–R05           | S01–S12                   |
| D10             | R08–R09, R16      | S18–S20, S37              |
| D11             | R06, R17–R18      | S13–S14, S39–S42          |
| D12             | R01–R02, R08, R16 | S01–S04, S18, S37–S38     |
| D13             | R04, R06          | S08–S10, S13–S14          |
| D14             | R07               | S15–S17                   |
| D15             | R05, R14          | S11–S12, S32–S34          |
| D16             | R10–R11, R13, R15 | S21–S26, S29–S30, S35–S36 |
| D17             | R04, R11–R14      | S08–S09, S23–S34          |
| D18             | R05–R07, R14, R18 | S11–S17, S32–S34, S41–S42 |

Coverage: D1–D18, R01–R18, S01–S42 đều được map. Đây là documentary design
traceability, không phải implementation/test PASS.

## Core-only mechanism assessment

Design construction: exact 67-entry data/scripts map bound to candidate
tarball SHA-256, không upstream init/npm graph, không output map cho siblings.
Thêm đúng ba YUTA files → 70 target files. Full archive inventory acceptance
và parser/type/path checks trước stage writes; stage ngoài discovery roots;
guarded same-volume no-replace placement; exact target/receipt validation;
pending không usable; rollback chỉ owned identities.

Read-only mapping check trên saved Discovery inventory: 67 unique destinations,
67 case-fold unique, zero dot/dot-dot/absolute/path-escape keys và zero sibling
destinations. Không extract/execute archive. Không biến static proof thành
actual installer PASS; adversarial/parser/rename/rollback tests và runtime
smoke vẫn phải chạy sau authorization.

Safe core-only CONTRACT: PROPOSED_FOR_SENSITIVE_REVIEW.
Không có known need phải cài siblings trước. Host scope đề xuất Windows local
NTFS; unsupported host fails closed. Actual implementation safety/activation:
NOT_EXECUTED, không INTEGRATED. Nếu reviewer không chấp nhận mechanism/host
boundary, hoặc Apply không chứng minh được, STOP / NEEDS_REVIEW, không weaken
Specs. No absolute malicious-admin/model-sandbox guarantee.

## LICENSE / PROVENANCE REVIEW INPUT

LICENSE_PROVENANCE: UNCERTAIN.
License acceptance: NOT GRANTED.

Candidate 2.15.0 không approved; Gate 2b approval cũng không thay license review.
D7 chỉ rõ evidence cần Control Tower xem: exact manifest MIT, published README
CC-BY-NC wording, pinned upstream LICENSE, PR 486/correction commit, all retained
asset notices/provenance và adaptation/redistribution assessment. NOTICE và
accepted-artifact record không được có assumed conclusion.

Nguồn tarball inventory và text được giữ từ Discovery trong session; lần này
không fetch npm package, upstream source hoặc tarball. Chỉ đọc official OpenAI
discovery docs và Microsoft placement contract qua web. Không claim toàn bộ
asset license đã audit hoặc tag/gitHead reproducible build đã được chứng minh.

## Security, runtime and documentation boundaries

- Runtime owner: local developer tooling, không YUTA cloud/POS/Display app.
- Persistence: ignored local staging/skill payload only trong future Apply;
  không database/schema/business persistence.
- Security: pre-mutation allowlist, reparse/junction/path escape rejection,
  no force, exact ownership/hash guard, controlled failure/rollback.
- Activation: YUTA adapter and query gateway, external output DESIGN_REFERENCE;
  skills không cấp authority hoặc quyền mới.
- D11 liệt kê exact future policy/routing/script/template path-set; không
  tạo/sửa chúng trong Design. No generated OpenSpec skill changes.
- Product Knowledge, CURRENT_STATE, MODULE_REGISTRY, architecture summaries,
  normative main specs, sealed page packs và lifecycle/readiness giữ nguyên.
- UI_AFFECTING: NO. BROWSER_QA_REQUIRED: NO.
- UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE.
- Runtime/tooling QA: REQUIRED, chưa chạy. Không gán QA NOT_APPLICABLE.
- Browser QA cho UI changes tương lai giữ nguyên YUTA protocol, heuristic
  không chuyển FAIL/BLOCKED_BY_ENVIRONMENT thành PASS.

## Baseline and concurrent attribution

HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Pre-write baseline `2026-09-08T14:55:31.303Z`, 2576 paths.
Method: `git ls-files --cached --others --exclude-standard -z`, deduplicate
existing files + SHA-256; no ignored secrets content output.

Dirty Pointage/Formalités/async-interaction context đã tồn tại, không approve
hoặc silently rebaseline. Trong Design, snapshot `2026-09-08T15:01:11.093Z`
ghi nhận các concurrent Pointage paths dưới; không có thao tác ghi chúng từ
task UI/UX và không nhận chúng làm delivery:

| Concurrent path                                                         | Pre-run SHA-256                                                    | Observed SHA-256                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `apps/backoffice/src/server/pointage/raw-clocking-service.ts`           | `013ffba32ff2ef2dcbfa92a5dd75e522436bf4df79a1f36b7928006054e38cd0` | `a144202f2b7af2955b458fc445b699342bb4ed8cdbda33a4d46905452dcd3d37` |
| `apps/backoffice/test/pointage-raw-clocking-service.test.ts`            | `75ba68854ba089f21d536e3406cde5e8e4327b89ed7e8f702ab17b715c7919aa` | `23afd99b1760ed3be0c31f6b74d7c25a51cd8a329858b687654f63ee0e7b7ccd` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`             | `02d46a40b43568dff1b931a43537cc5cc3be725c906a6b99ef364c83ed64b27a` | `40ae8e2d63de53a8ede46b3e7154d3953a27147b5563b3f312ff1a6400da04a6` |
| `packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts` | `7589f19f838cec21d85708c662fd509c5517495784c42f26b80a7677b6ee62b7` | `1b57abee9273150d828e6d9b640849ba42af459eae7d4e7dca4e523d4ee98234` |

Authorized delivery đúng ba paths:
`openspec/changes/ui-ux-pro-max-integration/design.md`,
`docs/reviews/ui-ux-pro-max-integration/02b-design-review.md`,
`docs/reviews/ui-ux-pro-max-integration/02-specs-review.md` (metadata only).

## Executed checks

| Command/check                                                           | Result                                                                                                                       |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `openspec validate ui-ux-pro-max-integration --strict --no-interactive` | exit 0, valid                                                                                                                |
| `pnpm docs:check`                                                       | exit 0, 36 current documents                                                                                                 |
| `pnpm architecture:check`                                               | exit 0                                                                                                                       |
| `pnpm -r --if-present typecheck`                                        | exit 0, scope 15/16 projects; compatibility result trong concurrent checkout, không final Pointage certification             |
| `pnpm format:check`                                                     | exit 1, 69 warnings: 67 inherited unchanged files + 2 concurrent Pointage files; ngoài delivery, không relabel PASS          |
| Scoped formatting/integrity                                             | exit 0; three delivery Markdown files PASS; exact hashes/embedded Design/metadata-only reconstruction checks described below |

Prettier write giới hạn Design mới và authorized review packets; không rewrite
approved semantic artifacts. Hash/projection checks chỉ read-only metadata
processing, không execute upstream. Một lần đọc JSON evidence bị truncate do
output budget, parse thất bại; đọc lại với đủ budget thành công, không có file
mutation trong bước đọc đó.

Không chạy future bootstrap/query commands, no npm/npx/pnpm dlx/install,
upstream Python, activation QA, cloud/local tests/builds hoặc ui-pack suite
trong Design-only. D18 ghi exact current commands và phân biệt NEW planned
commands chưa tồn tại. Không báo runtime/tooling QA PASS.

### Final check method and scope

Scoped command: `pnpm exec prettier --check openspec/changes/ui-ux-pro-max-integration/design.md docs/reviews/ui-ux-pro-max-integration/02-specs-review.md docs/reviews/ui-ux-pro-max-integration/02b-design-review.md`.
`git diff --check` scoped to change/review paths kết hợp exact hash inventory
vì delivery untracked. Node read-only rechecks Gate 1 hashes, approved Specs,
Gate 2 approval-only reconstruction, exact embedded Design and absent Tasks/
skill payload. `.agents/skills` và canonical main specs giữ nguyên bytes.

Hai warning paths bổ sung: `apps/backoffice/test/pointage-raw-clocking-service.test.ts`
và `packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts`.
Cả hai thuộc concurrent Pointage attribution, không phải formatting regression
do Design/packet; không sửa. Các kết quả compatibility checks không phê duyệt
concurrent work hoặc chứng minh snapshot mới sau mỗi lần writer khác thay đổi.

## Review decision requested

Review exact Design hash, D1–D18 và Windows-local constrained bootstrap/adapter
contract. Mandatory Gate 2b remains AWAITING_HUMAN_REVIEW.
License gate stays separate pre-Apply. Nếu approved, chỉ tiến đến giai đoạn
Control Tower expressly cho phép; không infer Tasks/Apply authorization.

STOP at Gate 2b.
Tasks: ABSENT.
Apply/install/production: NOT AUTHORIZED.
