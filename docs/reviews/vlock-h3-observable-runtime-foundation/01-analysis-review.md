# Gate 1 — V-LOCK H3 Observable Runtime Foundation

Change: vlock-h3-observable-runtime-foundation
Gate: 1 — Product / Authority Review
Review status: APPROVED
Created: 2026-09-24
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES
Approval source: explicit current-user Gate 1 instruction for `vlock-h3-observable-runtime-foundation`
Approval recorded by: Codex workflow
Approved: 2026-09-24T19:36:20Z

## Gate 1 approval decision

Human approval binds the exact Proposal/Analysis hashes below and authorizes only `Specs → Gate 2`. Approved capability owner: `repository/vlock-native-tooling`, normal delta Specs, no `skip_specs: true`. Classification: `CROSS_MODULE = YES`, `UI_AFFECTING = NO`, `BROWSER_QA_REQUIRED = NO`; a focused non-browser runtime QA dimension remains applicable without a final status. `SENSITIVE_DESIGN_GATE = REQUIRED` after Gate 2. AST-based extraction is approved as direction, not an exact parser/version/dependency; any dependency change affecting `pnpm-lock.yaml` needs separate review before mutation. A new observer asset or digest-bound image may be proposed in Design but is not authorized for implementation here. Parent and Product Version boundaries, historical FAIL/BLOCKED, and all explicit non-goals remain unchanged. No Design or Apply before the next human gate.

## Request and bounded recommendation

Control Tower đã quyết định `SPLIT_CHANGE` để tách blocker H3/native-caller/observation khỏi `repository-format-policy-and-baseline-remediation`. Đề xuất một capability tooling nội bộ `repository/vlock-native-tooling` và delta Spec bình thường. Parent vẫn sở hữu Task 3.3, input/graph thật, approval và real V-LOCK. Gate 1 được chuẩn bị để human review; artifact tồn tại hoặc check PASS không phải approval. Recommendation: duyệt scope và authority để có thể viết Specs, với Sensitive Design Gate `REQUIRED` sau Gate 2.

## Integrity and current state

HEAD trước tạo change: `fc63fef58345a4d99d07b1a4c9a427c679122bb3`. Ba file dirty thuộc parent đã có trước lượt này và không bị sửa. File mới trong lượt này chỉ gồm OpenSpec shell/Proposal/Analysis và packet Gate 1 này. Không tạo Specs, Design hoặc Tasks.

SHA-256 exact file bytes được tính bằng `Get-FileHash -Algorithm SHA256`, chữ hex thường; paths sắp xếp theo repository-relative order:

| Path                                                                  | SHA-256                                                            |
| --------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/changes/vlock-h3-observable-runtime-foundation/analysis.md` | `ae33992f46a63c436a76ae309e782b28d6e7bd6ad5edc23f856a3ebcb5e80a80` |
| `openspec/changes/vlock-h3-observable-runtime-foundation/proposal.md` | `a2846ef20519bab20581652e9cb0cefb4f4c853f8f41e03446824996a64ab6b6` |

Parent 10/29; Task 3.3 `BLOCKED / UNCHECKED`, historical H3 smoke `FAIL`, current split blocker `H3_DESIGN_NOT_FEASIBLE_WITH_CURRENT_RUNTIME`. Product Version `VERIFY: FAIL`, Phase 6 `BLOCKED`. Không thay đổi hoặc relabel các records này.

## Authorities and evidence consulted

Root `AGENTS.md`, `docs/README.md`, `docs/CURRENT_STATE.md`, `docs/AUTHORITY_MODEL.md`, `docs/YUTA_WORKFLOW_V3.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`, `docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md`, `docs/YUTA_QA_PROTOCOL.md`, OpenSpec activation/normativity policies, `openspec/config.yaml`, parent Design/Tasks/Gate 2b and delta Spec, repository tooling code/tests/manifests, local pnpm 11.8.0 package/bundle. Current code and image observations are Implemented State/runtime evidence, not Product or Gate approval. The exact source links and bounded findings are in the Analysis snapshot below.

## Validation evidence

- `openspec new change "vlock-h3-observable-runtime-foundation"`: exit 0; CLI final result and `.openspec.yaml` confirm `yuta-spec-driven` despite a generic creation banner mentioning `spec-driven`.
- `openspec status --change "vlock-h3-observable-runtime-foundation" --json`: exit 0; Proposal and Analysis done; Specs ready only as raw OpenSpec graph state, not YUTA authorization.
- `openspec validate "vlock-h3-observable-runtime-foundation" --strict --no-interactive`: exit 1, expected “Change must have at least one delta. No deltas found.” Specs are deliberately absent before Gate 1; do not set `skip_specs: true` or claim strict PASS.
- `pnpm docs:check`: exit 0, 36 current documents.
- `pnpm architecture:check`: exit 0.
- Scoped `pnpm exec prettier --check` for Proposal/Analysis: exit 0 after formatting Analysis within authorized scope.
- No runtime test, image build, tracer install, H3 extraction, graph computation, native V-LOCK, recursive typecheck or Browser QA. Generated Next type prerequisite and exclusive checkout make recursive typecheck inappropriate for this planning-only turn.

## Gate 1 decisions requested

1. Approve the bounded tooling objective: deterministic H3, safe native caller, isolated observable runtime, synthetic proof and parent handoff only?
2. Approve the parent/child ownership boundary without transferring Task 3.3 or real-lock/graph policy?
3. Approve normal delta Specs, without `skip_specs: true`, for new internal `repository/vlock-native-tooling`?
4. Confirm repository/tooling engineering as owner and keep application/Product Module Registry ownership unchanged?
5. Accept AST-based semantic extraction as the direction, with exact parser identity and closure proven later rather than fixed by installed presence?
6. Require explicit repository-tooling ownership for any parser dependency; must Design avoid any `pnpm-lock.yaml` change, or return for separate parent input/authority review if a dependency declaration needs it?
7. Require a narrow non-CLI pnpm-native caller with exact export/loader/input/settings/output contract and fail closed if safe exposure is impossible?
8. Require both external enforcement and complete attempted-event observation for process, network, registry/store and writes, including native scratch fsync/rename?
9. Permit a newly supplied observer executable or different digest-bound Linux image in later Design, subject to Sensitive Design approval and no installation/build in this Gate 1 turn?
10. Approve the runtime identity domains: image/platform/config, Node/pnpm, parser/extractor/assets/loader, observer/libraries, environment, command and mounts?
11. Approve synthetic positive/negative proof of native roundtrip and deliberate prohibited attempts, with no real-lock write or registry resolution?
12. Confirm `SENSITIVE_DESIGN_GATE = REQUIRED` because of execution, network, filesystem and evidence boundaries?
13. Confirm `UI_AFFECTING = NO`, `BROWSER_QA_REQUIRED = NO`, and require a later focused non-browser runtime QA applicability decision independent of Technical VERIFY?
14. Approve the explicit non-goals: no generic sandbox/CI/security platform, parent remediation, real graph/V-LOCK, Product Version, deployment or production action?
15. Confirm child completion only yields identified tooling and synthetic evidence; parent still needs independent exact input/graph approval and separately authorized real V-LOCK?

## Conflicts, unknowns and Gate 1 recommendation

No controlling-source `CONFLICT` was identified. Requirement-level boundary is sufficiently explicit for `READY_FOR_SPECS` after human Gate 1 approval. Parser packaging without parent lock drift, exact native closure and observer feasibility remain design-sensitive `NEEDS REVIEW`; no tool or runtime is approved by this packet. If Gate 1 changes scope or compatibility, revise the affected Proposal/Analysis and re-review exact hashes before Specs. Historical FAIL/BLOCKED remain unchanged.

## Exact proposal

<!-- prettier-ignore -->
````markdown
## Why

Task 3.3 của `repository-format-policy-and-baseline-remediation` đang `BLOCKED / UNCHECKED`: runtime hiện được ghi nhận chưa có hợp đồng H3/native caller và quan sát process, network, filesystem đủ để chứng minh V-LOCK đáng tin cậy. Tách một năng lực tooling nội bộ có thể kiểm chứng và tái sử dụng để giải quyết đúng blocker này, trong khi parent giữ quyền quyết định và kiểm chứng lockfile/graph thật.

## What Changes

- Tạo foundation giới hạn cho việc trích xuất deterministic các tài sản pnpm-native từ nguồn đã ràng buộc, cùng inventory, khoảng byte nguồn và identity H3 có thể tái lập; mọi closure thiếu hoặc mơ hồ phải fail closed.
- Cung cấp caller pnpm-native không khởi chạy CLI/install, với hợp đồng input, settings, loader và output tường minh.
- Cung cấp runtime Linux cô lập, có identity ràng buộc, nguồn chỉ đọc, scratch thuộc quyền ghi, và bằng chứng trung thực về các attempt process, network, registry/store, source/unexpected write và native scratch write/fsync/rename/cleanup.
- Cung cấp synthetic proof cho các cơ chế trên và handoff contract ổn định để parent đánh giá độc lập. Không chạy hoặc phê duyệt V-LOCK trên repository thật trong change này.

## Capabilities

### New Capabilities

- `repository/vlock-native-tooling`: hành vi tooling nội bộ quan sát được cho H3 extraction, native caller, runtime isolation/observation, synthetic proof và handoff identity. Đây là requirement của repository tooling, không phải capability restaurant/product runtime.

### Modified Capabilities

Không có. `repository/artifact-format-validation` thuộc parent active change; change này không sửa delta Spec hoặc acceptance của parent.

## Impact

Classification: `CROSS_MODULE = YES`; `UI_AFFECTING = NO`; `BROWSER_QA_REQUIRED = NO`. Không có UI hay browser flow; runtime/tooling QA tập trung có thể cần sau Technical VERIFY và sẽ được quyết định trong kế hoạch QA, không được predeclare `PASS` hoặc `NOT_APPLICABLE`.

Owner dự kiến: YUTA repository/tooling engineering. Phạm vi có thể cần thay đổi sau các gate gồm tooling scripts, dependency/parser khai báo tường minh, native caller/loader, runtime/container definition, observer và synthetic tests; đường dẫn chính xác và supply sẽ được Design/TIC xét duyệt. Change này cần delta Spec thông thường vì tạo hành vi tooling có input, output, fail-closed và evidence contract cho consumer. Sensitive Design Gate dự kiến bắt buộc vì cô lập thực thi, ranh giới network/filesystem/process và integrity bằng chứng.

Parent tiếp tục sở hữu Task 3.3, exact YUTA input closure, resolved graph thật, independent graph/input approval, real `pnpm-lock.yaml` scratch V-LOCK, raw/semantic comparison và formatting remediation. Child hoàn thành không tự đánh dấu Task 3.3 hoàn tất. Product Version không đổi semantics hoặc trạng thái (`VERIFY: FAIL`; Phase 6 `BLOCKED`). Không cấp quyền production, deployment hoặc lifecycle promotion.

## Non-goals

Không tạo generic sandbox SDK, dependency resolver, CI runner, production isolation system hay security-monitoring platform. Không tính graph repository thật, không chạy V-LOCK thật, không resolve từ registry, không sửa parent, Product Version, `pnpm-lock.yaml`, app/business logic, database hoặc UI. Lượt này chỉ tạo Proposal, Analysis và Gate 1 review; không implement, cài tracer, build image, tạo Specs/Design/Tasks hoặc chạy synthetic harness.
````

## Exact analysis

<!-- prettier-ignore -->
````markdown
# Change Analysis

## Scope and Change Type

`CROSS_MODULE / INTERNAL_REPOSITORY_TOOLING / SECURITY_AND_RUNTIME_SENSITIVE`.
Change này tạo hành vi tooling nội bộ có thể quan sát cho parent Task 3.3: H3 extraction, pnpm-native caller không đi vào CLI/install, Linux runtime cô lập, observation trung thực, synthetic proof và handoff identity. Không đổi restaurant Product behavior, UI, persistence, deployment hay repository lock/graph thật. Lượt hiện tại chỉ chuẩn bị Proposal, Analysis và Gate 1.

## Sources Consulted

- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [current state](../../../docs/CURRENT_STATE.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md), [automation protocol](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md), [Control Tower v3.1](../../../docs/chatGPT/YUTA_CONTROL_TOWER_OPERATING_PROMPT_V3.md), [QA Protocol](../../../docs/YUTA_QA_PROTOCOL.md) và [external design policy](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- [OpenSpec activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [Module Registry](../../../docs/MODULE_REGISTRY.md) và [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md). Module Registry không có row Product riêng cho repository tooling.
- Parent [Design VL1–VL8](../repository-format-policy-and-baseline-remediation/design.md), [Task 3.3 TIC](../repository-format-policy-and-baseline-remediation/tasks.md), [Gate 2b evidence](../../../docs/reviews/repository-format-policy-and-baseline-remediation/02b-design-review.md) và delta [artifact-format-validation spec](../repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md).
- Implemented State: [format-policy validator](../../../scripts/format-policy/check.mjs), [tests](../../../scripts/format-policy/check.test.mjs), [V-FIX Dockerfile](../../../scripts/format-policy/vfix-renderer/Dockerfile), [import-boundary scanner](../../../scripts/check-import-boundaries.mjs), root and `packages/core` package manifests, `pnpm-lock.yaml`, local pnpm 11.8.0 package manifest/bundle. Local bundle inspection is source evidence, not approval of execution.

## Authority and Product Decision

Current user/Control Tower authorizes `SPLIT_CHANGE` and the exact parent/child boundary in the Proposal, not Apply. Parent retains V-LOCK policy and real repository acceptance. Parent VL7/VL8 provide obligations for this foundation's handoff: exact source fidelity, safe native path, isolated normal fsync/write semantics, observed attempts and synthetic proof. They do not approve an extractor, observer, runtime image or real V-LOCK. No conflict with existing durable ownership was found. `repository/vlock-native-tooling` is a new internal repository capability with testable downstream output/failure behavior; normal delta Specs are warranted, `skip_specs: true` is not.

## Current Implemented State

- Parent is 10/29; Task 3.3 `BLOCKED / UNCHECKED`. Historical H3 smoke is `FAIL` because Node Permission Model denied fsync. Approved pnpm manifest/bundle bytes exist, but H3 composite remains candidate/not approved; runtime, effective-settings and graph acceptance remain open.
- `scripts/format-policy/check.mjs` has hash/identity checks, owned scratch, Docker isolation flags, bounded execution and PRE/POST checks for other validator work. `check.test.mjs` has synthetic fixtures and a permission-denial import test. Neither establishes a complete H3 extractor, non-CLI native caller or syscall-attempt observer.
- `packages/core` declares TypeScript `^6.0.3` and the lock resolves 6.0.3. Root tooling does not directly declare TypeScript. Prettier is a root dependency with parsers, but its formatting parser does not itself establish the required identifier/dependency closure. No supported Acorn/Babel parser dependency was found in the inspected workspace.
- The pnpm 11.8.0 distribution exports its package metadata, not a stable lockfile API. Its bundle contains `_read`, `convertToLockfileObject`, `allProjectsAreUpToDate`, `getOutdatedLockfileSetting` and `writeWantedLockfile`, but the bundle also invokes `runPnpm()` at module startup. `_readWantedLockfile` forces autofix; `convertToLockfileObject` can mutate snapshot objects. Direct import/CLI use is not a safe caller contract.
- Docker and a local `node:24.17.0-bookworm` image are present. Earlier candidate observations bind image/Node identities but parent calls runtime authority pending. No adequate attempt observer is demonstrated in that candidate. This repository analysis did not run or build a container.

## Ownership and Candidate Change Surface

`MUST_CHANGE` describes future implementation ownership after all gates, not permission in this turn.

| Asset / candidate owner                                                                         | Classification                  | Reason/boundary                                                                                                                                                                                                                                             |
| ----------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H3 extractor — new `scripts/vlock-h3/` repository-tooling module                                | MUST_CHANGE                     | Semantic selection, exact source-byte fidelity and closed native-asset inventory; no parent validator edit.                                                                                                                                                 |
| Parser dependency — repository tooling, with explicit supply identity                           | MAY_CHANGE                      | TypeScript already resolves through `packages/core`, but that package does not own this tool. Design must select an explicit reproducible supply; a root manifest change needs separate raw-lock compatibility review. `packages/core` itself is NO_CHANGE. |
| Non-CLI native caller/loader — new `scripts/vlock-h3/` module                                   | MUST_CHANGE                     | Narrow native API and forbidden-side-effect boundary; parent retains repository-specific policy.                                                                                                                                                            |
| Linux runtime/container definition — new `scripts/vlock-h3/` runtime asset                      | MUST_CHANGE                     | Bound image/platform/command/mount/environment contract, with no production runtime change. Exact Dockerfile/image choice belongs in Design.                                                                                                                |
| Observer and trace interpreter — new `scripts/vlock-h3/` assets                                 | MUST_CHANGE                     | Attempt-level evidence and complete trace interpretation, paired with external enforcement.                                                                                                                                                                 |
| Synthetic fixtures/tests — new `scripts/vlock-h3/` assets                                       | MUST_CHANGE                     | Prove native mechanics and deliberate prohibited attempts without real-lock mutation.                                                                                                                                                                       |
| Canonical H3/runtime identity output and parent handoff schema — new `scripts/vlock-h3/` assets | MUST_CHANGE                     | Stable, deterministic consumption contract; parent independently approves real inputs and graph.                                                                                                                                                            |
| Root `package.json`                                                                             | MAY_CHANGE                      | Only if an explicit parser/tooling dependency or script entry is necessary after review; avoid hidden transitive ownership.                                                                                                                                 |
| `pnpm-lock.yaml`                                                                                | NO_CHANGE in this authorization | Parent's exact raw-lock binding cannot silently change. A later dependency plan needing lock mutation must return for explicit compatibility/authority review.                                                                                              |
| Existing `scripts/format-policy/check.mjs` and `check.test.mjs`                                 | NO_CHANGE in this child         | Parent owns real V-LOCK integration, graph/input policy and Task 3.3 evidence. Reuse patterns conceptually without editing parent paths.                                                                                                                    |
| Parent OpenSpec Design/Tasks/Gate 2b and Product Version                                        | NO_CHANGE                       | Preserve current approvals, FAIL/BLOCKED and independent future review.                                                                                                                                                                                     |
| CI/deployment/app/package runtime                                                               | NO_CHANGE                       | No generic runner or production runtime delivery.                                                                                                                                                                                                           |

## Parser, H3 and Native Caller Boundary

Recommendation for Gate 1 direction: a bounded AST-based extractor is the smallest supported semantic-selection approach. TypeScript compiler API is a candidate already resolved in the workspace, but its exact version, byte supply and dependency ownership must be reviewed; installed presence alone is not approval. Regex/module comments or visually chosen offsets cannot prove unique symbol selection/transitive closure. A whole-bundle import is unsafe because CLI startup is present. The extractor must bind source and tool/parser identities, derive deterministic source ranges, close imports/initializers/generated factories, reject ambiguity/overlap/unresolved names and verify emitted bytes against bound raw ranges. H3 output must expose selected-asset inventory, hashes, caller/loader identities, explicit gaps and deterministic composite identity. Detailed schema/algorithm belongs in Design.

The foundation should expose only read/project, frozen-consistency and scratch-roundtrip operations. Candidate private pnpm roots are `_read`, `allProjectsAreUpToDate`, `getOutdatedLockfileSetting`, and `writeWantedLockfile`; direct `convertToLockfileObject` is required only if the reviewed projection needs a separate native conversion. The caller must preserve an independent pre-conversion parsed representation, disable autofix, accept closed manifest/workspace/settings inputs, and prohibit install, registry resolution, scripts, auto-repair and ambient store/config use. Exact export/loader/arguments/returns are sensitive Design decisions. If the exact bundle cannot support a safe non-CLI caller without modifying pnpm semantics or vendoring an unreviewed source, stop for Gate 2b redesign.

## Observation and Runtime Boundary

| Mechanism                                                                          | Observes                                                                                         | Enforces                                             | Limit                                                                                                                 |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Read-only mounts, owned scratch, no host store/socket and Docker network isolation | No attempted-event proof                                                                         | Source/write boundary and external network isolation | Loopback and attempted syscalls still need scrutiny.                                                                  |
| Node Permission Model / API wrappers                                               | Some denied JS calls                                                                             | Some JS process/FS calls                             | Historical fsync failure; incomplete native/syscall coverage.                                                         |
| Static caller/asset reachability review                                            | Selected source paths                                                                            | No runtime effect                                    | Cannot prove runtime zero attempts.                                                                                   |
| Supervised complete-child syscall trace plus the isolation above                   | Candidate observation for process, network, registry/store paths and writes/fsync/rename/cleanup | Isolation supplies enforcement                       | Trace executable, libraries, path/descriptor attribution, completeness and non-privileged feasibility are unapproved. |

Smallest plausible direction is a digest/byte-bound Linux observer supervising the complete child tree, paired with external container controls. It may require a different image or a separately supplied observer; a purpose-built generic security framework, privileged host monitor or broad CI runner is outside scope. A `strace`-class mechanism is a candidate, not an approved dependency. The runtime identity must bind image index/platform manifest/config, linux/amd64, Node executable and material libraries, pnpm source, extractor/parser, extracted assets/loader, observer and libraries, sanitized environment, command, mounts and process/network controls. The child owns tooling/runtime identities; parent binds its exact repository inputs and separately reviews the combined real-execution candidate.

## Synthetic Proof and Handoff

Minimum synthetic cases: valid native parse/write/reread with observed scratch write/fsync/rename/cleanup; malformed, conflicted and incompatible lock failures; importer/settings positive and negative cases; deliberate subprocess, network, registry/store and forbidden/source-write attempts that prove detection and enforcement. Source is read-only, writable target is owned scratch, and the real repository lock is never a write target. Incomplete/truncated/ambiguous observation fails closed. Technical VERIFY maps implementation to Specs/Design and runs deterministic checks; a later focused non-browser runtime QA assessment should exercise the actual isolated delivery context independently if it has a distinct runtime behavior dimension. No Browser QA or final QA verdict is declared now.

Successful child handoff provides exact extractor, native caller, runtime and observer identities, complete synthetic evidence and a stable output/error contract. It does not provide parent graph approval, real lock acceptance or Task 3.3 completion. Parent must independently bind exact Git-object repository inputs, compute/review the graph candidate, obtain graph/input approval, authorize real V-LOCK and perform raw/semantic comparison.

## Affected Boundaries and Lifecycle Baseline

Affected: repository-tooling execution and security/evidence integrity across local host and isolated Linux runtime. Not affected: restaurant cloud/POS/display runtime ownership, database, tenancy, auth, provider, device, public visibility or product behavior. No Module Registry lifecycle row is created for internal tooling. Parent Task 3.3 remains blocked; Product Version remains `VERIFY: FAIL`, Phase 6 `BLOCKED`. No implementation, environment enablement, production readiness or external-dependency status is promoted.

## Requirement Readiness

`READY_FOR_SPECS`: the observable foundation outcome, fail-closed cases and parent boundary are sufficiently bounded for requirement writing after Gate 1 approval. `skip_specs: true` is not appropriate. Exact parser supply, export closure and observer mechanism are Design/Gate 2b choices, not implicit approvals. If Gate 1 changes the input/output or lock-compatibility boundary, revise Proposal/Analysis and review again before Specs.

## UI / UX Applicability

`UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE` — no UI design or advisory self-validation; scope is internal H3/runtime tooling; decision source is this bounded request and the external-design policy. `UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO`. Focused non-browser runtime QA applicability must be decided separately from Technical VERIFY; no final QA status is inferred.

## Conflicts and Unknowns

No controlling-source `CONFLICT` found. `NEEDS REVIEW` at Gate 1: confirm `repository/vlock-native-tooling` ownership; parser dependency owned by repository tooling without silently changing the parent raw lock; permitted future observer/runtime asset; exact child handoff and parent re-review on any dependency/input drift; focused runtime QA dimension. `NEEDS REVIEW` at sensitive Design: closure/loader feasibility, trace completeness and non-privileged execution, exact runtime/supply identities, negative proof coverage. These are not evidence of current PASS.

## Analysis Conclusion

`READY_FOR_SPECS`, conditional on explicit Gate 1 approval of this Proposal/Analysis and the stated parent/child and internal-tooling capability boundaries. Sensitive Design Gate recommendation: `REQUIRED` for process/network/filesystem isolation and evidence integrity. No Specs, Design, Tasks, Apply, runtime generation or parent/Product Version action is authorized by this analysis.
````
