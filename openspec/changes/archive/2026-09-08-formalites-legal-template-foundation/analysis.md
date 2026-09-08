# Change Analysis

## Scope and Change Type

`formalites-legal-template-foundation` là behavioral, data-affecting, security-sensitive và legal/privacy-sensitive change. Classification: `CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE`; Strategy A: một bounded foundation, không general-purpose Platform Admin hoặc publication lifecycle.

Current-user authorization chỉ cho Proposal + Analysis và Gate 1 packet. Target capability là `formalites/legal-template-foundation`. Không tạo Specs, Design, Tasks, implementation, migration hoặc runtime trong turn này. Sensitive Design Gate bắt buộc sau Design, trước Tasks/Apply.

## Sources Consulted

- [Proposal](proposal.md), current-user Control Tower request với 14 approved Product decisions; request provenance/hash được ghi trong Gate 1 packet.
- [Root instructions](../../../AGENTS.md), [documentation index](../../../docs/README.md), [Authority Model](../../../docs/AUTHORITY_MODEL.md), [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), [workflow skill](../../../.agents/skills/yuta-run-change/SKILL.md) và [OpenSpec config](../../config.yaml).
- [Current State](../../../docs/CURRENT_STATE.md), [Personnel Home](../../../docs/features/personnel/README.md), [Product Knowledge](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Cloud database instructions](../../../packages/db-cloud/AGENTS.md), [auth instructions](../../../packages/auth/AGENTS.md), [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md), [database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md), [tenancy](../../../docs/architecture/TENANCY.md), [identity/membership](../../../docs/architecture/IDENTITY_AND_MEMBERSHIP.md), [architecture overview](../../../docs/architecture/OVERVIEW.md), [data model](../../../docs/architecture/DATA_MODEL.md), [Production Readiness](../../../docs/operations/PRODUCTION_READINESS.md).
- Normative [system authorization](../../specs/authorization/platform-admin-formalites-template-administration/spec.md), [legal-review governance](../../specs/formalites/template-legal-review-governance/spec.md), [tenant Formalités authorization](../../specs/authorization/formalites/spec.md), [persistent draft](../../specs/formalites/persistent-draft-foundation/spec.md).
- Current [system operation policy](../../../packages/auth/src/formalites-template-system-authorization.ts), [session resolution/guard](../../../packages/auth/src/session.ts), [authorization tests](../../../packages/auth/test/formalites-template-system-authorization.test.ts), [Formalités schema](../../../packages/db-cloud/src/schema/formalites.ts), [global users schema](../../../packages/db-cloud/src/schema/users.ts), [Personnel versions/history schema](../../../packages/db-cloud/src/schema/personnel.ts), [draft integration tests](../../../packages/db-cloud/test/formalites-personnel-draft-repository.integration.test.ts).
- Completed prerequisite evidence: [authority final review](../../../docs/reviews/platform-admin-formalites-template-authority-foundation/03-final-review.md), [governance final review](../../../docs/reviews/formalites-template-legal-review-governance/03-final-review.md). Các packets là provenance, không thay current normative sources.

## Authority and Product Decision

Control Tower đã explicitly resolve Discovery/Shaping bằng current-user request. Đây là authority cho bounded Product decisions dưới đây, không phải Gate 1 approval hoặc Apply authorization. Existing main specs tiếp tục normative, không cần sửa để tạo new foundation capability.

1. Scope là `GLOBAL_YUTA_FORMALITES_TEMPLATES`; Formalités giữ semantic ownership, `@yuta/db-cloud` giữ persistence family. Không org/establishment owner, `TenantContext`, system organization giả, tenant fallback hoặc restaurant customization.
2. Template Identity đại diện stable legal purpose/type. Đổi fundamental purpose/type cần identity khác. Metadata tác động legal meaning/rendered content/applicability/selection/generation/review scope là version-significant. Không có concrete mutable presentation-only field được cấp thêm tại Analysis.
3. Mutable Working Draft không phải canonical Template Version. Tối đa một active draft mỗi identity; identity có `0..N` immutable versions và có thể nhiều frozen historical/review candidates. Freeze tạo exact snapshot; sau freeze mọi content/applicability change cần draft/version khác.
4. Stable version identity là bắt buộc. Ordinal chỉ nếu Design cần: unique trong template, không applicability selector. Repeated freeze cùng draft revision không tạo duplicate version; không quyết định locking, transactions hoặc receipt mechanism ở đây.
5. Canonical Legal Source Profile V1 là textual source, explicit profile identity, valid UTF-8/no BOM/LF, không Unicode normalization/silent whitespace trimming. Canonicalization trước freeze; sau freeze profile/bytes bất biến, không formatter rewrite hoặc recanonicalize historical data khi profile tiến hóa. AST, DOCX và PDF không phải canonical source của slice này.
6. SHA-256 được identify và tính trên exact canonical bytes. Version bind template/version identity, profile, exact content, algorithm/checksum và immutable applicability. Cùng checksum với applicability khác không cho inherit qualification.
7. Applicability giữ jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions, effective-date constraints, exclusions và binding conditions. Approved owner có sẵn mới cho canonical references; otherwise là explicit assertions/assumptions. Chúng không chứng minh external review đã diễn ra. Unsupported/unmapped/unknown không trở thành executable applicability facts. Không automatic matching hoặc invented dictionaries.
8. Existing five independent operations/grants giữ nguyên: `YUTA_ADMIN` nhận explicit grants, `YUTA_SUPPORT` none; không wildcard/prefix/implication/hierarchy/caller policy hoặc principal mới. Trusted active internal user + exact operation, không cần restaurant membership; global grant không cấp tenant access.
9. Không external reviewer identity/professional data, legal opinion/correspondence, private evidence URL/path/attachment/record hoặc publication evidence. Minimal internal actor ID có thể hỗ trợ create/edit/freeze traceability nếu Design cần; không copy email/name/contact. Security audit không là mutation completion, legal-review evidence hoặc publication audit.
10. Privacy/retention production gates vẫn unresolved. Không invent retention duration, indefinite-retention guarantee, evidence processing approval hoặc lifecycle/readiness promotion. Canonical Knowledge reconciliation chỉ qua reviewed post-archive Knowledge Consolidation.

Approved operation-to-behavior mapping:

| Exact operation                     | Bounded behavior                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `formalites.template.read`          | Đọc template identity, working draft và retained version history theo authorized boundary                                            |
| `formalites.template.draft.manage`  | Tạo template identity, tạo working draft, sửa mutable draft                                                                          |
| `formalites.template.review.submit` | Freeze exact working draft thành immutable review candidate/version; không chứng minh delivery/receipt/review/evidence/qualification |
| `formalites.template.publish`       | Existing authority giữ nguyên; không domain execution trong change                                                                   |
| `formalites.template.retire`        | Existing authority giữ nguyên; không domain execution trong change                                                                   |

## Current Implemented State

- `packages/auth` đã có exact operation tuple/grant map và trusted active-user system guard, cùng tests cho allow/deny/unsupported operations và không tenant fallback. `requireSystemRole` đơn lẻ không thay exact capability guard. Tests được inspect, không được trình bày như execution evidence của foundation chưa tồn tại.
- Current Formalités database chỉ có tenant/employee-connected preparation drafts và receipts. Draft revision/concurrency không phải global immutable legal-template version. No Personnel write-back và existing scoped authorization tiếp tục độc lập.
- Global users chứng minh cloud package có non-tenant identity records; không tạo general-purpose global content authority. Documents immutable signed-artifact versions và Personnel history chỉ là implementation patterns, không phải template/evidence owner để reuse bằng cách bỏ tenant scope.
- Không tìm thấy existing global template catalog/version repository/contracts hoặc equivalent archived foundation. Hai archived prerequisites hiện có là authority-only và governance-only; không duplicate chúng.
- Platform Admin application, legal evidence storage, actual qualified content, publication/retirement service và generation chưa có trong bounded foundation. Không kiểm tra deployed database/runtime; deployment/environment evidence `UNVERIFIED` trong analysis này.

## Affected Boundaries

- Formalités: new identity/draft/freeze/version/content/applicability semantics. Dedicated global persistence trong approved cloud family; exact files/schema/API-internal representation thuộc Design, không chọn tại Analysis.
- Identity / Access: reuse existing system-only authorization, không grant change hoặc tenant bypass. Không sửa Backoffice session architecture; không browser/runtime integration.
- Personnel và Documents: không facts/history mutation, signed-artifact storage reuse hoặc ownership transfer. Không thu thập employee/employer data.
- Employer legal configuration, collective-agreement canonical configuration và automatic applicability selection: excluded; absence không được xử lý bằng invented fields/enums.
- Private evidence, publication, qualification, retirement execution, external provider, generation/rendering/signature/handoff: excluded. Foundation không tạo evidence CRUD hoặc reviewer account.
- POS/Site Agent/Display: không bị ảnh hưởng. Production và lifecycle state: không được promote.

## Lifecycle Baseline

Các giá trị dưới đây là current routing/evidence, không phải status assignment mới:

| Existing bounded scope                  | Baseline                                                                                                                                                                      |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee-connected persistent CDI draft | Product `APPROVED`; Implementation `IMPLEMENTED`; Environment `DEVELOPMENT_ONLY`; Production Readiness `BLOCKED`; External Dependency `BLOCKED` theo Personnel Home           |
| Broader future generation/signature     | `PROPOSED / NOT_STARTED / NOT_ENABLED / BLOCKED`; external legal/template/privacy/storage/signature dependencies `BLOCKED`                                                    |
| Platform Admin application              | Reserved runtime only; `NOT_STARTED / NOT_ENABLED / NOT_ASSESSED`; portable authority implementation không promote app lifecycle                                              |
| Authority và governance prerequisites   | Review evidence ghi workflow `DONE`; normative specs tồn tại, không actual legal review/template qualification hoặc production permission                                     |
| Candidate này                           | Current-user bounded Product decisions đã explicit; chưa có implementation hoặc riêng một canonical registry assignment. Không tự thêm row hay gán inherited lifecycle values |

`HR-TEMPLATE-01`, `HR-FORMALITY-01`, `HR-RET-01`, `HR-STORE-01` và `HR-AUDIT-01` vẫn là unresolved external/production gates; persistence planning không đóng chúng.

## Requirement Readiness

Có thể viết precise behavioral specs cho `formalites/legal-template-foundation` mà không invent Product authority. Current request đã resolve draft/version distinction, cardinality, textual profile/byte rules, SHA-256, operation mapping, global persistence owner và excluded evidence boundary.

Behavioral acceptance dimensions cho Specs, chưa là delta spec: exact grants/denials và independent tenant isolation; stable identity/purpose; one active working draft; immutable freeze binding; no duplicate freeze; byte/checksum preservation; changed applicability creates another version; assertions không là applicability engine; minimal traceability không là review/publication; excluded lifecycle/runtime không xuất hiện.

Mọi version vẫn unqualified bởi slice này: freeze không legal review, checksum không opinion authenticity, authorization allow không publication. Không có `published/qualified` writable shortcut hoặc false placeholder evidence.

## UI / UX Applicability

`UI_AFFECTING: NO`; `BROWSER_QA_REQUIRED: NO` cho approved candidate scope. Không UI/page-pack change, preview hoặc Platform Admin app. Future data/domain Apply vẫn cần appropriate non-browser QA; chưa gán final QA `NOT_APPLICABLE` cho executable persistence chỉ vì không có UI. Turn này không thực hiện Apply/Verify/QA.

## Conflicts and Unknowns

- **Resolved discovery ambiguity:** canonical-content changes luôn tạo new version theo governance; mutable working draft không canonical version theo current explicit decision. Freeze bắt đầu canonical immutable identity, không sửa governance hoặc cho minor-change exemption.
- **CONFLICT — non-blocking stale summary:** `docs/architecture/DATA_MODEL.md` vẫn ghi Formalités data “not active”, trong khi current persisted draft schema/spec và Personnel Home chứng minh ngược lại. Conflict chỉ là broad implemented-state summary; không tác động new foundation requirements. Preserve nguyên bytes, không sửa canonical docs tại Gate 1.
- **NEEDS REVIEW — Design-only:** exact content-profile identifier, byte validation/canonicalization interface và error representation; applicability serialization/reference representation; identity storage shape; stable version/optional ordinal mechanism; one-active-draft and repeated-freeze concurrency/idempotency; integrity enforcement; bounded traceability/minimization và migration/rollback verification. Phải tuân fixed Product semantics; không chọn mechanisms trong Analysis. Nếu lựa chọn đổi observable Product scope, quay lại Control Tower.
- **NEEDS REVIEW — excluded future scope:** actual private evidence owner/privacy/retention, employer legal configuration, collective reference authority, automatic applicability selection, publication/retirement execution và qualified-template production readiness. Không cần giải quyết bằng implementation trong change này.
- Repository dirty trước turn, gồm shared auth/database/Knowledge và unrelated active changes. Gate 1 chỉ thêm scoped planning/review files. Before Apply cần fresh exact path/hash baseline và isolation review; current dirty paths không được coi là approved implementation changes.
- CLI creation progress/planning-home metadata hiển thị default `spec-driven`, nhưng `.openspec.yaml`, `status.schemaName` và artifact instructions đều xác nhận pinned `yuta-spec-driven`. Không override schema/config hoặc sửa tooling. Nếu effective schema đổi/không resolve, STOP.

Không còn requirement-level authority conflict trong approved bounded request. Không có Product question bắt buộc trả lời thêm trước Specs; human Gate 1 review vẫn bắt buộc. Sensitive Design review không được bỏ qua.

## Analysis Conclusion

`READY_FOR_SPECS`

Scope confirmed cho duy nhất `formalites/legal-template-foundation`, sau explicit Gate 1 approval và intact hashes. Đây là behavior change; không dùng `skip_specs: true`. Không tạo Specs trong turn này. Proposal/Analysis không authorize Apply, Sync, Archive hoặc production; dừng tại Gate 1 với `AWAITING_HUMAN_REVIEW`.
