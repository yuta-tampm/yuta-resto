## Why

Hai prerequisite normative về system authority và legal-review governance đã hoàn tất, nhưng repository chưa có durable GLOBAL YUTA Formalités template identity/version. Control Tower đã chốt scope và content-identity decisions để tạo foundation tối thiểu trước một real CDI template, không đồng nhất persistence với review, publication hoặc qualification.

## What Changes

- Tạo dedicated GLOBAL template data boundary trong `@yuta/db-cloud`, không organization/establishment ownership, `TenantContext`, system organization giả hoặc tenant fallback.
- Template Identity giữ một stable legal purpose/type qua nhiều versions; đổi fundamental purpose/type cần identity khác. Metadata ảnh hưởng legal meaning, rendered content, applicability, selection, generation hoặc review scope là version-significant; không invent mutable presentation fields.
- Mỗi identity có tối đa một active mutable Working Draft và `0..N` immutable Template Versions. Working Draft không phải canonical version. Freeze tạo exact immutable snapshot; sửa content/applicability sau freeze cần Working Draft khác và Version khác.
- Repeated freeze cùng working-draft revision không tạo duplicate versions. Nếu có ordinal, nó unique trong template nhưng không làm applicability selector; latest không đồng nghĩa applicable. Cơ chế thuộc Design.
- Canonical Legal Source Profile V1 là textual source có explicit profile identity: valid UTF-8, không BOM, LF, không Unicode normalization, không silent whitespace trimming. Canonicalization trước freeze; profile và bytes bất biến sau freeze, không formatter rewrite hoặc recanonicalize historical versions.
- Bind exact template/version identity, profile, canonical content, identified SHA-256 checksum và immutable applicability declaration. Cùng content checksum nhưng applicability khác không kế thừa qualification.
- Giữ các governance applicability dimensions; dùng canonical reference chỉ khi approved owner tồn tại, còn lại là explicit assertions/assumptions. Không tạo reference-data enums, executable applicability facts hoặc automatic matching.
- Reuse đúng operation mapping: `formalites.template.read` đọc identity/draft/retained history; `formalites.template.draft.manage` tạo identity/draft và sửa mutable draft; `formalites.template.review.submit` freeze exact draft. Freeze không xác nhận reviewer receipt, review, evidence hoặc qualification.
- Chỉ cho bounded internal create/edit/freeze traceability nếu Design cần, dùng minimal internal YUTA actor identifier; không duplicate name/email/contact. Existing security audit giữ riêng.

## Capabilities

### New Capabilities

- `formalites/legal-template-foundation`: durable global template identity, mutable working draft, immutable version/content/applicability binding, exact operation enforcement và duplicate-free freeze; không publication/evidence lifecycle.

### Modified Capabilities

Không có. Reuse nguyên trạng `authorization/platform-admin-formalites-template-administration` và `formalites/template-legal-review-governance`; không sửa `authorization/formalites` hoặc `formalites/persistent-draft-foundation`.

## Impact

- Classification: `CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE`; Strategy A, một bounded cross-module change.
- Formalités giữ semantic ownership; `@yuta/db-cloud` giữ persistence; Identity / Access giữ authorization; Platform Admin chỉ là future runtime. Exact files, data shape, concurrency và traceability mechanisms thuộc Design; Sensitive Design Gate bắt buộc.
- Personnel facts, Documents signed artifacts, tenant repositories/authorization, Backoffice sessions, POS và Display không đổi. Không tạo application/API/UI hoặc provider integration; không yêu cầu dependency mới tại Proposal.
- Turn này chỉ tạo Proposal + Analysis và Gate 1 packet. Chưa Specs, Design, Tasks hoặc Apply. Canonical Knowledge reconciliation chỉ sau archive qua reviewed Knowledge Consolidation; không tự promote lifecycle/readiness. Production `NOT AUTHORIZED`.

## Non-goals

Không actual CDI/CDD content, legal engagement/review, reviewer identity/professional data, opinion/correspondence, private evidence URL/path/attachment/record, publication evidence, evidence CRUD/upload/storage, publication, qualification hoặc retirement execution. Không sixth operation, new principal/reviewer YUTA account, tenant customization, employer/employee collection, employer legal/collective configuration, automatic applicability selection, placeholder/conditional execution, generated contract, preview/PDF/DOCX renderer, signature, Documents handoff, automatic legal research/change detection hoặc production enablement. Privacy/retention production gates không được đóng bởi foundation này.
