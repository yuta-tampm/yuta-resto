## 1. Attribution và persistence foundation

- [x] 1.1 Lưu `git status` cùng exact pre-Apply bytes và SHA-256 của mọi shared file dự kiến sửa vào review evidence, rồi verify manifest có thể tái tạo change-scoped diff mà không dựa riêng vào `HEAD`.
- [x] 1.2 Bổ sung dedicated `restaurant_knowledge_customer_experience` cloud schema với composite organization/establishment scope và ba nullable text column, tạo additive Drizzle migration kế tiếp, rồi verify generated SQL, journal, snapshot và schema tests.
- [x] 1.3 Bổ sung scoped get/whole-slice upsert trong `@yuta/db-cloud`, rồi verify missing/all-null, từng single-value state, full round-trip, overwrite và wrong-organization/wrong-establishment isolation bằng guarded disposable PostgreSQL integration tests.

## 2. Server authorization và page composition

- [x] 2.1 Bổ sung READ-gated page-local loader cho `Expérience client`, rồi verify principal thiếu READ và STAFF bị deny trước repository access trong focused loader tests.
- [x] 2.2 Bổ sung MANAGE-gated server action parse đúng ba value và thực hiện một whole-slice save, rồi verify OWNER/MANAGER success, READ-only/STAFF denial trước persistence và Profile permissions không thay thế Restaurant Knowledge MANAGE.
- [x] 2.3 Compose section độc lập vào page hiện hữu mà không đổi ownership của Profile hoặc các Restaurant Knowledge slice khác, rồi verify page-level visibility/read-only/editable behavior và regression tests liên quan.

## 3. Client draft và explicit-save behavior

- [x] 3.1 Tạo page-local model cho ba optional independent value, rồi verify all-empty, từng single-value state, independent edit và dirty-state behavior bằng unit tests.
- [x] 3.2 Tạo fields/form page-local với đúng một explicit whole-slice submit, rồi verify một action invocation, read-only state, submit availability và preservation của hai value không đổi bằng component tests.
- [x] 3.3 Chứng minh không có autosave từ change, blur, timer, effect hoặc background request, rồi verify focused form tests và source inspection không quan sát persistence trước explicit submit.

## 4. Documentation và lifecycle

- [x] 4.1 Cập nhật Establishment Product Knowledge, `Informations générales` Product Knowledge, Module Registry và page pack cho bounded `Expérience client`, rồi verify Restaurant Knowledge vẫn `Implementation = PARTIAL`, `Environment = NOT_ENABLED`, `Production Readiness = NOT_ASSESSED` và documentation checks pass.
- [x] 4.2 Kiểm tra dependency/source surface để chứng minh không có read, write, link, sync hoặc required consumer cho Reservations, Reputation, Today, Personnel, POS/orders, Marketing, CRM hay provider, rồi lưu exact command/result trong verify evidence.

## 5. Bounded verification

- [x] 5.1 Chạy focused Backoffice và db-cloud tests cho schema/repository/loader/action/model/form cùng regression Establishment Profile, Concept/Histoire và Cuisine/savoir-faire; sửa chỉ technical defects nằm trong approved behavior và ghi exact results.
- [x] 5.2 Chạy strict OpenSpec validation, `pnpm docs:check`, `pnpm architecture:check`, `pnpm -r --if-present typecheck`, formatting-sensitive checks và relevant Backoffice/cloud builds/tests; ghi truthful exits, skipped checks và limitations.
- [x] 5.3 Chạy generated OpenSpec verify workflow, đối chiếu mọi requirement/scenario với code/test evidence và chỉ mark task complete khi bounded implementation không có spec/design deviation.

## 6. Gate 3 evidence

- [x] 6.1 Tạo full deterministic change-scoped implementation diff từ saved pre-Apply bytes plus attributable new files, tạo migration-only diff, và verify SHA-256 của exact diff bytes.
- [x] 6.2 Tạo canonical verify-evidence artifact và Gate 3 packet với planning/task hashes, mapping requirement-to-code/test, exact commands/results, changed-file attribution, lifecycle preservation và `Sync authorization: PENDING`, rồi stop trước normative sync/archive.
