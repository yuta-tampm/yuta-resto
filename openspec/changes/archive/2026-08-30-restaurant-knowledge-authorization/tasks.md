## 1. Shared Authorization Implementation

- [x] 1.1 Thêm typed `restaurant-knowledge.read` và `restaurant-knowledge.manage` permissions, hai grant-map entries độc lập cho `OWNER`/`MANAGER`, cùng fail-closed `has`/`require` guards trong existing Backoffice permission module; verify bằng Backoffice typecheck và focused permission test.
- [x] 1.2 Tạo focused Restaurant Knowledge authorization tests chứng minh READ/MANAGE được đánh giá riêng, `OWNER`/`MANAGER` được allow, `STAFF` bị deny, public/service actors bị deny, Establishment Profile permission không được inherit và `YUTA_ADMIN`/`YUTA_SUPPORT` không bypass membership-role grants; verify focused test passes.

## 2. Current Authority Documentation

- [x] 2.1 Cập nhật current Identity / Access và Restaurant Knowledge Product Knowledge để ghi nhận semantic/authorization ownership split, READ/MANAGE grant matrix, STAFF denial, no-profile-inheritance và no-system-role-bypass; verify `pnpm docs:check` passes.
- [x] 2.2 Cập nhật Module Registry review marker/evidence tối thiểu để phản ánh authorization prerequisite mà không promote Restaurant Knowledge content implementation, environment, readiness hoặc external-dependency lifecycle values; verify scoped documentation diff preserves unrelated lifecycle values.

## 3. Verification and Regression

- [x] 3.1 Chạy focused Backoffice authorization tests và existing Establishment Profile, Personnel, Access Audit permission regressions; verify all exact test commands exit 0.
- [x] 3.2 Chạy relevant tenant/auth tests cho trusted active membership, cross-scope denial và no restaurant access without membership; verify all exact test commands exit 0.
- [x] 3.3 Chạy strict OpenSpec validation, targeted formatting, `git diff --check`, `pnpm docs:check`, `pnpm architecture:check`, Backoffice typecheck/test và workspace typecheck; verify every required command result is recorded truthfully.
- [x] 3.4 Chạy generated OpenSpec verify workflow, reconcile every requirement/scenario với code/tests/docs, và chỉ mark complete khi verification assessment passes without spec/design deviation.
