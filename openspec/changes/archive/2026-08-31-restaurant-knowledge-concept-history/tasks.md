## 1. Persistence Restaurant Knowledge

- [x] 1.1 Thêm schema table riêng cho `restaurant_knowledge_concept_history` với composite organization/establishment scope, nullable Concept/Histoire và exports cần thiết; verify bằng db-cloud schema tests và typecheck.
- [x] 1.2 Generate và review forward Drizzle migration, xác nhận migration chỉ tạo bounded Restaurant Knowledge table/constraints và không sửa Establishment Profile schema.
- [x] 1.3 Thêm Restaurant Knowledge repository read/upsert nhận trusted `TenantContext`; verify zero-row empty state, Concept-only, Histoire-only, whole-slice save và organization/establishment isolation bằng guarded db-cloud integration tests.

## 2. Backoffice server boundary

- [x] 2.1 Tích hợp page loader với Restaurant Knowledge READ mà không thay đổi Establishment Profile route permission; verify OWNER/MANAGER load slice và STAFF không load/expose slice qua focused tests.
- [x] 2.2 Thêm route-local Zod parser và server action riêng require Restaurant Knowledge MANAGE, re-derive trusted tenant context và save cả slice; verify MANAGE success, READ-only/profile-only denial và không có shared contract/API mới.

## 3. Concept & histoire UI

- [x] 3.1 Thêm route-local form/section cho manual Concept/Histoire draft, independent optional values, valid empty state và một explicit save; verify component/model tests cho Concept-only, Histoire-only và both-empty states.
- [x] 3.2 Bảo đảm draft không autosave và read-only state không render save control; verify tests chỉ quan sát mutation khi explicit form submit và preserve existing profile form behavior.
- [x] 3.3 Chạy Backoffice focused tests và build để verify composed page, READ/MANAGE enforcement, OWNER/MANAGER behavior, STAFF denial, accessibility names và profile regressions.

## 4. Documentation và page pack

- [x] 4.1 Cập nhật current Restaurant Knowledge/Product Knowledge và stable `establishment-general-information` page pack theo as-built ownership, data boundary, permission mapping, explicit-save/no-autosave behavior và evidence; không promote Environment/Production Readiness/External Dependency.

## 5. Verification và Gate 3 evidence

- [x] 5.1 Chạy strict OpenSpec validation, migration/schema checks, db-cloud tests, tenant-isolation integration test khi database evidence khả dụng, Backoffice tests/build, docs/architecture checks, monorepo typecheck và format check; ghi truthful pass/skip/failure results.
- [x] 5.2 Đối chiếu toàn bộ 7 requirements/16 scenarios với code/tests, tạo deterministic full scoped implementation diff cùng migration diff và chuẩn bị Gate 3 packet với lifecycle/status changes; verify không có shared contract, permission, tenancy, ownership hoặc cross-runtime expansion.
