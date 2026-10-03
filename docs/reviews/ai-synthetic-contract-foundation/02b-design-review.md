Change: ai-synthetic-contract-foundation
Gate: Sensitive Design Gate
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — Personnel, authorization and provider execution

# Sensitive Design Review

Visibility: Engineering

Owner: YUTA engineering

## Delegation and prerequisite integrity

COLLABORATION_MODE: CODEX_ONLY

Mode selection source: Current-user intake reply on 2026-10-03: `Codex một mình (CODEX_ONLY)` for Slice 1 implementation planning only.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: Current-user intake `YES` on 2026-10-03 for local commit after the authorized planning scope is completed.

Gate 1 and Gate 2 are APPROVED by their actual fresh independent reviewers. All earlier reviewed paths/hashes were rechecked unchanged before Design and packet preparation. References: [Gate 1](01-analysis-review.md), [Gate 2](02-specs-review.md).

This packet requests Design approval to create Tasks and finish planning only. No Apply, provider request, qualification/real-data/production authority, Storage implementation, new model/prompt/provider, sync/archive, lifecycle or remote Git is granted.

## Security, data and runtime assessment

The design retains Backoffice server ownership, Personnel authorization/classification/domain validation/audit/review/apply, ADR-009 exposure, separate runtimes/DBs and existing synthetic source guards. It introduces no database, migration, framework, env, credential or deployment. It places typed capability, versioned config, eligibility, selection and terminal observation in four app-local server modules. Existing raw adapter interfaces remain infrastructure-boundary unknown values validated before typed success.

Reviewer must independently assess trusted descriptor creation, adapter resolution after eligibility/selection, stored-provider-once handling before its source remap, timeout/late-result behavior, source-specific path compatibility, no value-import cycle, sanitized observation and mandatory domain audit preservation. Model identity does not prove qualification. Upload attestation is a documented content-truth limitation, not a classifier.

Migration/rollback: source-only integration when separately authorized; no data migration or remote deployment. Revert only the implementation hunks to the captured baseline, preserve unrelated checkout work and private stored data.

Unresolved choices: NONE asserted within the bounded design. Deferred Storage/provider/real-data decisions are excluded; they do not silently acquire approval. Assess feasibility and baseline/spec consistency independently.

Strict validation: `openspec validate "ai-synthetic-contract-foundation" --strict`, exit 0, exact output `Change 'ai-synthetic-contract-foundation' is valid` (2026-10-03).

Recommendation for review: determine whether this design can support bounded Tasks without changing the approved behavioral baseline. Scope stays planning-only even on approval.

## Candidate identities

PowerShell `Get-FileHash -LiteralPath <path> -Algorithm SHA256`; exact bytes; lowercase hex; sorted path set. Table includes Design, delta and prior artifacts/approved review packets.

| Path                                                                                                       | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/ai-synthetic-contract-foundation/01-analysis-review.md                                        | 1429da397b7249da2cc701ecbfdcf287410da57ac28011a6b0b17238a1d8f8a6 |
| docs/reviews/ai-synthetic-contract-foundation/02-specs-review.md                                           | 9ced9c55c31d1374183ac92a2c2ff720dc0e0f48621fcdf2cd5a0ca8a028d6b8 |
| openspec/changes/ai-synthetic-contract-foundation/.openspec.yaml                                           | eb984f1a844433fcf686b11b57962c6db65a3260148771b10c6a5388a1c446b8 |
| openspec/changes/ai-synthetic-contract-foundation/analysis.md                                              | 4ee0680244238b3fc00f8aedda75cf3c0c9b7e7c4eef4ad76b06258c23c1b728 |
| openspec/changes/ai-synthetic-contract-foundation/design.md                                                | a18969c31285e989c0862b527d9d939b5a88c15d2294ee4f2d8a014c3c4209da |
| openspec/changes/ai-synthetic-contract-foundation/proposal.md                                              | 3fa579534aec953238ac60c5bd98f6e55763487cebb2933e47d22feb0e64cec4 |
| openspec/changes/ai-synthetic-contract-foundation/specs/ai/synthetic-personnel-contract-extraction/spec.md | 90c95135fa2768afb80a7df927f7737563e88e968a8c2aec3be0428cd0d9a936 |

## Review history — candidate 1

Verdict: CHANGES_REQUESTED by `/root/ai_design_review` on 2026-10-03; P2 exact-copy fence defect in this packet. Reviewer requested a longer outer fence, no dangling fences, unchanged Design/prerequisite bytes and a fresh independent verdict. No architectural/behavioral Design correction was requested. Candidate 1 packet at review: `6b8bc11e566ac970031f8f4cabf62f99facc886e777dedd7d732f706ffa0ba45`; all seven identities in the table above were verified unchanged. No reviewer writes, tests/checks, provider or CT calls.

Correction: the exact Design is now reproduced inside a matching outer text fence longer than the embedded fence. Its embedded three-backtick flow is preserved verbatim. No Design or prerequisite artifact was edited. Candidate 2 awaits a fresh independent review; the old candidate is not approved.

## Exact Design

````text
## Context

Xem [Proposal](proposal.md) và [behavioral Specs](specs/ai/synthetic-personnel-contract-extraction/spec.md). Gate 1/2 đã approved độc lập; task hiện tại vẫn planning-only. Existing service sở hữu authorization/version-before-bytes, preparation, timeout và result validation; runtime/actions đang compose adapter cùng diagnostics riêng của OpenAI và stored-fixture QA.

Design áp dụng vì thêm architectural boundary và chạm authorization/Personnel/provider-sensitive path. Không thay ownership, tenancy, database hoặc runtime topology; không có migration/dependency mới. Sensitive Design Gate bắt buộc trước Tasks; approval trong task này chỉ cho phép hoàn tất planning, không Apply.

## Goals / Non-Goals

**Goals:**

- Một typed capability và một consumer, configuration versioned có thể test bằng dependency injection offline.
- Tách eligibility khỏi selection; giữ Personnel semantics và các source-specific guard trước effect.
- Provider-specific wiring và diagnostics ở server composition; restaurant feature không chọn model/provider.

**Non-Goals:**

- Generic AI platform, DB registry, package mới hoặc trừu tượng hóa cho consumer chưa tồn tại.
- Triển khai qualification, provider swap, evaluation service, Storage hoặc bất kỳ phần ngoài [requirement baseline](proposal.md#requirement_baseline).

## Decisions

### 1. App-local ownership and minimal modules

Dùng `apps/backoffice/src/server/ai/` với các file dự kiến:

| File           | Trách nhiệm                                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `contracts.ts` | One-entry capability type map, typed executor, trusted server execution descriptor và observation types                         |
| `policy.ts`    | Readonly versioned deployment records, eligibility và static selection là các hàm riêng                                         |
| `executor.ts`  | Validate boundary, enforce eligibility/selection/deadline, invoke adapter, validated typed result và terminal observation       |
| `runtime.ts`   | Server composition từ environment hiện có, adapter factories, stored-fixture/provider-once wiring và neutral observation bridge |

Không bắt buộc tách thêm registry/observability module. `policy.ts` không đọc env/DB hay gọi provider; composition giữ effects/secrets. Bốn file là intended ownership, implementation chỉ tách thêm nếu cần để tránh cycle có bằng chứng và vẫn cùng bounded responsibility.

Alternative: shared `packages/ai`, generic registry hoặc gateway. Không chọn vì chưa có consumer thứ hai, có nguy cơ kéo domain/runtime khác vào abstraction và không giúp acceptance hiện tại.

### 2. Typed single-capability contract and runtime validation

Type map chỉ có key literal `personnel.contract.extract_fields@1`:

- input: `{ request: PersonnelContractExtractionRequest; document: PreparedSyntheticContract }`;
- result: `PersonnelContractExtractionReviewResult`.

`execute` dùng generic giới hạn bằng keys của map để literal suy ra input/result. Context là server-owned descriptor, gồm purpose literal `synthetic-personnel-contract-evaluation`, classification `synthetic`, modality `pdf`, source provenance và runtime configuration identity. Không nhận capability string tự do hoặc trả `unknown`. Existing raw adapter port `Promise<unknown>` vẫn hợp lệ ở infrastructure boundary; không lan lên consumer.

Reuse schema từ `@yuta/contracts/personnel`; không thêm transport payload. `PreparedSyntheticContract` tiếp tục domain-owned trong service. AI contract chỉ import type từ domain; service chỉ import type executor từ AI. Không tạo runtime value cycle. Composition inject một domain-owned result validator, lấy từ extraction service, parse schema và kiểm tra identity/version/page count trước typed success. Không chép business semantics vào generic AI layer.

Alternative: `execute(string, unknown): unknown` hoặc chỉ runtime schema. Không chọn vì không có compile-time mapping; cũng không thay validation bằng TypeScript casts. Mock typed thay mapping được nhưng invalid-output tests phải inject raw adapter bên dưới validation.

### 3. Trusted domain context and order of effects

Actions giữ `requireBackofficePageAvailable`, validated Personnel tenant và permissions. `authorizeAndResolve` giữ scoped repository resolution và requested audit; service tiếp tục exact document/employee version checks rồi rate limit, source load và preparation. Loader giữ upload metadata/attestation checks; stored loader xác minh actual-byte checksum sau authorized read.

Domain mới tạo execution descriptor từ branch đã qua source controls; không parse browser classification/purpose thành authority. Generated fixture có server provenance; upload ghi nhận attested source, không gọi đó là verified fictional content; stored source chỉ eligible khi exact fixture/hash controls thành công. Provenance từ bytes/source loader không được thay bằng metadata/browser label. Việc gọi typed executor xảy ra sau các bước này.

Luồng execution:

```text
Exposure + session + permissions
  -> scoped target + versions -> rate limit
  -> approved source controls + bytes + PDF preparation
  -> domain execution descriptor
  -> capability validation -> eligibility -> static selection
  -> existing adapter under deadline -> domain result validation
  -> sanitized terminal observation
  -> existing completed audit + transient review
  -> separate Human apply with fresh authorization/proof/versions
```

AI không truy cập `cloudDatabase`, giải quyết tenant hoặc ghi domain data. New internal denial codes được map sang `ContractExtractionServiceError`/safe action failure hiện có, không thêm public error discriminant hoặc UI state. Auth/version/source/rate-limit denial trước executor vẫn thuộc domain và không cần một AI success/observation.

### 4. Versioned configuration, eligibility and deterministic selection

Records readonly trong server code có `deploymentId`, `deploymentVersion`, supported capability/version, purpose, classification, modality, environment và executor kind. Policy có version riêng; capability @1 không đồng nghĩa prompt v4 hoặc config @1.

Các kind cần thiết chỉ bọc paths đang tồn tại:

| Context đã qua source guards                                                           | Static choice                                                 |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Default / non-complete scenario                                                        | Existing deterministic synthetic adapter                      |
| Complete generated/upload + explicit valid `openai-synthetic`                          | Existing OpenAI adapter, Luna/v4                              |
| Approved stored fixture, provider-once gate không enabled                              | Existing stored-fixture offline adapter                       |
| Approved stored fixture + explicit unconsumed provider-once gate + valid OpenAI config | Existing stored-provider-QA wrapper + existing OpenAI adapter |

Environment values được validate server-side từ biến hiện có, không thêm env hoặc browser selector. Unknown execution configuration/purpose/classification/capability/modality và non-development đều fail closed. Mode `openai-synthetic` cần key sẵn có; record chỉ có credential-presence/secret reference nội bộ, không giữ secret trong public descriptor/observation. Default và supported non-complete scenarios giữ local deterministic behavior; invalid config vẫn là explicit denial, không fallback do provider failure.

Eligibility trả eligible deployment identities từ records tương thích. Selection lấy đúng static mapping rồi kiểm tra membership trong tập; thiếu/mismatch thì denial. Chỉ sau đó composition mới resolve/construct adapter, không tạo provider effect trong factory. Factory/environment validation vẫn defense-in-depth.

Stored provider-once wrapper không đổi: exact source/scenario/page count/hash được kiểm tra, `consume()` đúng một lần, rồi wrapper mới remap source cho existing OpenAI adapter. Eligibility dùng provenance stored đã kiểm chứng trước remap; remap không phải quyền biến bất kỳ stored HR document thành upload synthetic.

Model/prompt constants có một owner configuration; giữ exports đang dùng cho targeted tests nhưng feature không import/chọn provider. Config refs của prompt/corpus/evaluator reuse identities hiện có khi cần traceability, không tạo evaluator lifecycle/schema/service mới. Không tuyên bố deployment eligible cho real data, EU region, ZDR hay qualified từ model name. Future real-data qualification sẽ dùng private evidence refs và `VEND-01`/`AI-01`–`AI-04`; không implementation expiry engine trong Slice 1.

### 5. Timeout, validation and Human review preservation

Capability executor bọc **adapter invocation** bằng timeout/deadline với default 45 seconds và test override từ trusted dependency như hiện có. PDF preparation vẫn trước timeout như baseline. Result được domain-owned validator parse và kiểm tra trước success. Service dùng typed executor thay raw adapter; không tạo hai independent outer deadlines có thể log late success sau domain timeout. Existing OpenAI AbortSignal timeout vẫn giữ như adapter defense.

Executor chỉ publish một terminal observation cho mỗi attempt tới executor; late completion/usage sau timeout không tạo success event, review hoặc retry. Adapter cancellation/late raw response không trở thành persisted result. Existing audit error mapping vẫn được domain actions xử lý.

Review store, 15-minute review expiry, completed-extraction grant, reauthorization/versions/idempotency ở apply và allowlist position/weekly minutes giữ nguyên. Không tự áp dụng employmentTermType hoặc mở rộng field allowlist; không ghi Register.

Alternative: chỉ thêm metadata quanh adapter nhưng domain vẫn tự chọn provider hoặc cast result. Không chọn vì chưa chứng minh dependency inversion và typed validated result.

### 6. Minimal observations without a new service

Dùng local optional callback với strict allowlist: capability identity/version, deployment identity/version nếu đã selected, policy version, bounded outcome/reason, latency, finite non-negative token counters nếu có. Không serialize context/input/output/error bằng object spread hoặc `JSON.stringify(error)`. Không có tenant/personnel/resource ID, bytes, excerpts, prompt/response, paths/URLs hay keys.

Observation failure bị cô lập và không thay result; audit/review failures vẫn theo domain behavior hiện có, không bị nuốt cùng observation callback. Existing provider QA diagnostics được bridge ở composition từ allowlisted adapter metadata, không import `OpenAiExtractionObservation` vào feature action. Không thay spend/authorization/logging scope, thêm external sink hoặc database.

### 7. Offline acceptance and documentation ownership

Test fixtures và fake fetch dùng dependency injection, không process-wide env mutation chứa credentials. Policy tests test development descriptor giả lập; runtime tests vẫn chứng minh test/production/unset bị từ chối. Typed fixtures được `tsc` kiểm tra cả invalid-input cases bằng `@ts-expect-error`, không chỉ Vitest runtime assertion.

Targeted tests giữ service/runtime/raw adapter/upload/stored source/review-store coverage và thêm capability eligibility/selection/observation/late-timeout coverage. Fake adapter/fetch chứng minh existing payload/config semantics; không chạy `test:openai:synthetic` hoặc opt-in smoke/evaluation scripts. No live model-quality equivalence claim.

Implementation sau này cập nhật English current Personnel Home và đoạn app-owned provider boundary trong Architecture Overview khi có as-built evidence; không thêm knowledge home/ADR thay boundary, registry row hay readiness status chưa được duyệt. Gate evidence không trở thành source of Product truth.

## Risks / Trade-offs

- [Upload attestation không kiểm tra tính fictional của nội dung] → Giữ existing operational fictional-only obligation/guards, server-owned classification và deny real/unknown policy context; không hứa phát hiện misuse hoặc tạo classifier.
- [Domain validator/type imports tạo cycle] → Chỉ type-only imports qua map; validator inject tại composition, kiểm tra import graph và architecture check.
- [Eligibility bị bỏ qua bởi source-specific integration] → Mọi application extraction paths đi qua cùng typed executor; giữ source wrappers và test spies chứng minh denial không effect.
- [Timeout log late success hoặc callback làm hỏng audit] → Một terminal state trong executor, bỏ late completion observations, tách best-effort observation khỏi mandatory domain audit.
- [Config/version bị hiểu là qualification] → Synthetic-only records, không real-data branch; không region/DPA/production claims hoặc private evidence trong Git.
- [Dirty shared checkout] → Trước Apply và commit chỉ scope paths; preserve unrelated Formalités changes, không broad refactor/formatter.

## Migration Plan

Không data migration, new env, credential, dependency hoặc deployment action. Khi được cho phép Apply riêng: thêm typed/config foundation và offline tests; tích hợp service/composition/actions; kiểm tra regression, hiện hành docs và exact review evidence. Không bật explicit provider mode hoặc one-time QA gate để acceptance.

Rollback source-only: khôi phục các hunks của Slice 1 theo recorded implementation baseline để quay lại runtime wiring hiện có; không reset checkout hoặc đụng database/private stored objects. Không remote rollout hoặc production activation trong change scope.

## Task Context

COLLABORATION_MODE: CODEX_ONLY

MODE_SELECTION_SOURCE: current-user intake reply ngày 2026-10-03, bounded planning-only Slice 1.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: current-user `YES` ngày 2026-10-03 cho local planning commit.

Open Questions: NONE trong bounded design. Storage/provider selection/real-data qualification là out-of-scope future decisions, không dependency bị ngầm coi là đã duyệt. Tasks chỉ tạo sau sensitive Design approval; sau Tasks task hiện tại dừng trước Apply.
````

## Independent approval — candidate 2

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Mode selection source: Current-user CODEX_ONLY intake reply on 2026-10-03 for Slice 1 planning only.

Independent reviewer: `/root/ai_design_rereview` (fresh context).

Independent review evidence: APPROVED; no blocking findings. Reviewer independently confirmed the exact UTF-8 Design reproduction, all seven prerequisite/candidate hashes, typed/domain-validation boundary, auth/version/source ordering, eligibility/selection before adapter resolution, stored-source/provider-once before remap, single deadline/terminal observation, configuration/import feasibility, sanitized observations and preserved mandatory audit/review/Human apply. Packet at verdict: `29a01df9111dbc0f2a037e3197c627ba32de17fd0935527cdc2748d401e85415`.

Source attribution: current HEAD `14fd1f06a3829599cb06661879384fc22a7a9dc2` differs from intake through unrelated Formalités work. Reviewer found no intervening relevant authority/contracts/extraction drift and independently matched all seven implementation source hashes supplied for inspection. Unrelated Salariés UI/history dirty work is preserved. Future Apply requires a fresh scoped baseline.

No reviewer writes, tests, validation reruns, provider or CT calls. Strict-validation evidence was inspected, not rerun.

Approval recorded by: Codex workflow

Approved: 2026-10-03T12:54:21.5760876+00:00

Integrity: all seven paths/hashes rechecked unchanged after verdict. Approval permits Tasks planning only and does not authorize Apply or any operational/provider action.
