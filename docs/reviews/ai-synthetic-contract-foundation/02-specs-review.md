Change: ai-synthetic-contract-foundation
Gate: Gate 2 — Behavioral Specs
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: YES — Personnel, authorization and provider boundary

# Specs Review

Visibility: Engineering

Owner: YUTA engineering

## Delegation and scope

COLLABORATION_MODE: CODEX_ONLY

Mode selection source: Current-user reply on 2026-10-03: `Codex một mình (CODEX_ONLY)` for Slice 1 implementation planning only.

COMMIT_AFTER_TASK: YES

COMMIT_SELECTION_SOURCE: Current-user reply `YES` on 2026-10-03 for local commit after planning completion.

No Apply, live provider, Storage, real-data/production processing, main-spec sync/archive, lifecycle or remote delivery is authorized. Gate 1 candidate 2 is independently APPROVED by `/root/ai_gate1_rereview`; exact Proposal/Analysis/metadata hashes were rechecked before Specs. Reference: [Gate 1](01-analysis-review.md).

## Requirements and evidence

One new capability at the declared full path. Nine requirements cover typed capability, domain/source trust, auth/versions before bytes/effects, fail-closed eligibility, selection invariant, existing execution paths, validated review/apply, independent identities and sanitized observations. Scenarios specify compile-time checks and offline mocks; no provider call is an acceptance prerequisite.

Changed assumptions since Analysis: NONE. Source-control validation is distinguished from proof of fictional content. The real-data prohibition is policy, not an invented classifier. Qualification/storage remain deferred and do not acquire authority through these specs.

Remaining ambiguity: NONE asserted; reviewer must assess scenario precision, compatibility, source paths and the approved requirement baseline independently.

Strict validation command: `openspec validate "ai-synthetic-contract-foundation" --strict`

Exact result: `Change 'ai-synthetic-contract-foundation' is valid`

Exit code: 0 (2026-10-03).

Recommendation for review: assess Specs planning readiness; approval permits Design planning only. Sensitive Design review remains required before Tasks. No main spec has been changed or promoted.

## Candidate identities

Hash command: PowerShell `Get-FileHash -LiteralPath <path> -Algorithm SHA256`, lowercase; exact bytes; sorted path set. Prior reviewed artifact paths and approved Gate 1 packet are included with the delta spec.

| Path                                                                                                       | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/ai-synthetic-contract-foundation/01-analysis-review.md                                        | 1429da397b7249da2cc701ecbfdcf287410da57ac28011a6b0b17238a1d8f8a6 |
| openspec/changes/ai-synthetic-contract-foundation/.openspec.yaml                                           | eb984f1a844433fcf686b11b57962c6db65a3260148771b10c6a5388a1c446b8 |
| openspec/changes/ai-synthetic-contract-foundation/analysis.md                                              | 4ee0680244238b3fc00f8aedda75cf3c0c9b7e7c4eef4ad76b06258c23c1b728 |
| openspec/changes/ai-synthetic-contract-foundation/proposal.md                                              | 3fa579534aec953238ac60c5bd98f6e55763487cebb2933e47d22feb0e64cec4 |
| openspec/changes/ai-synthetic-contract-foundation/specs/ai/synthetic-personnel-contract-extraction/spec.md | 90c95135fa2768afb80a7df927f7737563e88e968a8c2aec3be0428cd0d9a936 |

## Exact delta spec

```text
## Purpose

Cung cấp một hợp đồng YUTA typed cho trích xuất các trường hợp đồng Personnel từ nguồn synthetic trong development, tách eligibility và lựa chọn deployment khỏi feature mà giữ authorization và Human review/apply hiện có.

## ADDED Requirements

### Requirement: Typed versioned capability contract

Capability `personnel.contract.extract_fields@1` SHALL có input từ request Personnel và tài liệu synthetic đã chuẩn bị, và output là review result Personnel hiện có. Consumer SHALL suy ra input/result từ capability literal ở compile time; public capability boundary SHALL không trả `unknown` hoặc nhận capability string tùy ý. Output từ adapter vẫn MUST được runtime-validate trước khi trả typed result.

#### Scenario: Supported capability infers input and result

- **WHEN** consumer gọi capability literal `personnel.contract.extract_fields@1` với input đúng contract
- **THEN** TypeScript suy ra review result Personnel; thay executor bằng typed mock không yêu cầu sửa consumer hoặc transport contract

#### Scenario: Invalid capability or payload is rejected

- **WHEN** consumer dùng capability/version không tồn tại hoặc input thiếu trường bắt buộc
- **THEN** compile-time contract từ chối lời gọi; dữ liệu không tin cậy vượt qua bằng runtime boundary cũng bị từ chối trước provider effect

### Requirement: Domain owns authorization and source classification

Personnel SHALL giữ authorization, trusted scope, purpose và classification. Browser input SHALL không có quyền cấp classification, purpose, deployment, model, provider hoặc credentials. Classification synthetic chỉ được tạo sau server validation của các điều kiện nguồn hiện có: generated fixture, upload có fictional-only attestation/PDF guards, hoặc stored fixture allowlist/checksum. Attestation SHALL không được mô tả là bằng chứng đã kiểm tra nội dung fictional hay anonymized; dữ liệu thật vẫn bị cấm.

#### Scenario: Browser attempts to override policy context

- **WHEN** input browser tự khai classification/purpose/deployment/provider hoặc thêm trường cấu hình kỹ thuật vào extraction request
- **THEN** strict request validation từ chối hoặc domain không sử dụng giá trị đó làm authority; không có provider invocation dựa trên giá trị browser

#### Scenario: Source controls fail

- **WHEN** upload thiếu attestation/PDF guard hoặc stored document không khớp fixture allowlist/checksum
- **THEN** extraction bị từ chối, không có provider call; nhãn synthetic do browser khai không bỏ qua được guard

### Requirement: Authorization and versions precede file effects

Exposure, validated session/active membership, Personnel permissions, organization/establishment scope và exact employee/document versions SHALL được kiểm tra trước đọc bytes, chuẩn bị PDF hoặc provider invocation. Capability eligibility SHALL không thay thế hoặc mở rộng các quyền này.

#### Scenario: Wrong scope or permission

- **WHEN** target thuộc organization/establishment khác hoặc actor không có membership/permission cần thiết
- **THEN** source loader, PDF preparation và adapter/provider không được gọi

#### Scenario: Stale target or unavailable exposure

- **WHEN** employee revision/document version không khớp hoặc instance exposure không cho Personnel
- **THEN** extraction dừng trước bytes/provider; giữ safe conflict/unavailable contract hiện có

### Requirement: Eligibility fails closed for unsupported execution

Eligibility SHALL chỉ chấp nhận capability/version, purpose synthetic contract extraction, classification synthetic, modality PDF và deployment configuration được server khai báo cho development. Real/unknown classification, unknown purpose/modality/configuration, unsupported capability/version hoặc môi trường khác development SHALL bị từ chối. Slice 1 SHALL không có real-data qualification path.

#### Scenario: Real or unknown data context

- **WHEN** domain execution context có real/unknown classification hoặc purpose/modality không được hỗ trợ
- **THEN** eligible set rỗng hoặc denial được trả về và không gọi adapter/provider

#### Scenario: Non-development execution

- **WHEN** execution chạy với production, test hoặc environment không xác định
- **THEN** runtime từ chối mọi deployment trước provider effect, kể cả khi key/model/mode đã có; offline test chỉ dùng environment dependency development giả lập

### Requirement: Selection cannot expand eligibility

Selection SHALL deterministic theo mapping tĩnh của server, chọn một deployment thuộc eligible set. Mapping thiếu, mapping ngoài tập hoặc tập rỗng SHALL fail closed. Selection SHALL không tự thêm deployment, retry bằng provider khác hoặc fallback/shadow.

#### Scenario: Static mapping is outside eligible set

- **WHEN** mapping trỏ deployment không có trong eligible set
- **THEN** không invoke deployment đó và không tự chọn deployment thay thế

#### Scenario: Valid mapping is stable

- **WHEN** cùng execution context, versioned configuration và eligible set được cung cấp
- **THEN** selection trả cùng deployment identity/version; consumer chỉ phụ thuộc capability contract

### Requirement: Preserve current synthetic execution paths

Deterministic synthetic SHALL là default. Existing explicit OpenAI synthetic branch SHALL giữ Luna/v4 và các guard hiện tại; non-complete scenarios SHALL ở lại deterministic. Stored synthetic path SHALL giữ exact fixture guards và provider-once prerequisite riêng. Không mở live API bằng test acceptance, không đổi prompt/model, endpoint, provider payload, retry hoặc storage.

#### Scenario: Default or non-complete scenario

- **WHEN** không bật explicit provider mode hoặc scenario không phải complete
- **THEN** kết quả dùng deterministic path hiện có và không gửi provider request

#### Scenario: Stored fixture provider-once gate

- **WHEN** stored fixture hợp lệ nhưng one-time provider gate thiếu hoặc đã consumed
- **THEN** không có provider invocation; offline stored extraction giữ semantics hiện có và không biến denial/provider failure thành một fallback

### Requirement: Validate result identity and preserve review apply

Result SHALL giữ strict schema, request/document identity, versions, page count, source-page limits và outcome constraints hiện có. Timeout, rate limit, audit, tenant-scoped transient review, 15-minute expiry và bounded Human apply SHALL giữ semantics hiện tại. AI SHALL không ghi employee/Register/other domain state hoặc tự apply suggestions.

#### Scenario: Invalid or mismatched provider result

- **WHEN** adapter trả extra fields, malformed data, wrong request/version/page count hoặc source page không tồn tại
- **THEN** không có typed successful result, completed-success audit, usable review grant hoặc Personnel apply từ result đó

#### Scenario: Expired or cross-scope review

- **WHEN** Human apply dùng review đã hết hạn, sai tenant/version hoặc thiếu completed-extraction proof
- **THEN** apply bị từ chối theo guard hiện có; không cập nhật Personnel facts

#### Scenario: Timeout or rate limit

- **WHEN** attempt timeout hoặc vượt rate limit hiện có
- **THEN** giữ safe failure và audit behavior hiện có; không retry/fallback hoặc tạo review thành công

### Requirement: Independent configuration identities

Capability business-contract version SHALL độc lập với deployment/configuration, policy, model/prompt và evaluation identities. Observed execution SHALL xác định versioned deployment/policy thực tế. Model name SHALL không được coi là bằng chứng region/retention/qualification. Đổi deployment sau này SHALL không đổi capability nếu business contract còn tương thích; thay đổi model/provider/prompt hoặc qualification thực tế vẫn cần scope/review riêng.

#### Scenario: Offline deployment substitution

- **WHEN** test thay server mapping bằng một eligible typed mock deployment với identity/version khác
- **THEN** consumer, request/result schema và Human review/apply contract giữ nguyên; observation phản ánh deployment đã dùng

### Requirement: Minimized sanitized observations

Capability observation SHALL chỉ chứa allowlisted capability/deployment/policy versions, bounded outcome/denial code, latency và token usage nếu có. Observation SHALL không chứa raw bytes, prompt/response/excerpts, filenames/object keys, URLs, credentials, employee/document/tenant identifiers hoặc raw exception/provider body. Observation sink SHALL không làm một kết quả hợp lệ thành failure hoặc biến failure thành success; không thêm external logging service hoặc persistence.

#### Scenario: Successful or denied execution contains sensitive canaries

- **WHEN** input/output/error test có canary bytes, prompt, response, identifiers hoặc secrets
- **THEN** chỉ allowlisted sanitized fields xuất hiện trong observation, không có canary values

#### Scenario: Observation sink fails

- **WHEN** local observation sink ném lỗi
- **THEN** extraction result/denial và existing audit/review semantics không thay đổi; sink failure không gây thêm provider call
```

## Independent approval

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Mode selection source: Current-user CODEX_ONLY reply on 2026-10-03 for Slice 1 planning only.

Independent reviewer: `/root/ai_gate2_review` (fresh context).

Independent review evidence: APPROVED; no blocking findings. All nine requirements stay within the baseline, with meaningful typed/denial/selection/observation scenarios, existing source-specific guards and review/apply semantics. OpenSpec artifact language follows the explicit vi context in `openspec/config.yaml`; technical review packets remain English. Reviewer rechecked all five identities in the table plus this packet at `016503b4b556b8cceaeb03fda67430a8a5234d38ceb91fd025db7a2f11f9239a`; strict-validation evidence was inspected, not rerun. No reviewer writes, tests, provider or CT calls.

Approval recorded by: Codex workflow

Approved: 2026-10-03T12:44:17.0785123+00:00

Integrity: exact path set and hashes rechecked unchanged after verdict. Approval permits Design planning only; sensitive Design approval is required before Tasks. No Apply authority.
