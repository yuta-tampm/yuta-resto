## 1. Pure copy helper và model coverage

- [x] 1.1 Thêm named pure helper vào `general-information-model.ts` để tạo draft kế tiếp bằng cách copy độc lập từng source contact không rỗng sang public counterpart, giữ destination khi source rỗng hoặc `null`, và bảo toàn mọi field khác; verify bằng các focused helper tests trong `general-information-model.test.ts`.
- [x] 1.2 Mở rộng `general-information-model.test.ts` cho full matrix gồm cả hai source không rỗng, từng source rỗng/`null`, cả hai source rỗng/`null`, overwrite/preserve existing public values, no-op, unrelated-field preservation và không có ongoing linkage; verify bằng `pnpm --filter @yuta/backoffice exec vitest run test/general-information-model.test.ts`.

## 2. Form-state integration

- [x] 2.1 Trong `GeneralInformationForm`, thêm one-time copy callback dùng functional `setDraft` với pure helper và truyền callback xuống `PublicInformationSection`, không gọi server action hoặc persistence; verify bằng Backoffice typecheck và xác nhận existing dirty-state comparison cùng explicit submit path không bị thay đổi.

## 3. Public-contact control và read-only behavior

- [x] 3.1 Trong `PublicInformationSection`, thêm shared `Button` có `type="button"`, visible accessible French label và callback prop tại public-contact area, chỉ render khi `canEdit` và không thay đổi page layout ngoài control cần thiết; verify bằng focused static-render component test.
- [x] 3.2 Thêm focused Vitest test dùng current `renderToStaticMarkup` convention để xác nhận editable render có visible accessible label và `type="button"`, read-only render không có mutating copy action, đồng thời giữ existing permission tests làm regression; verify bằng chạy component test mới cùng `establishment-profile-permissions.test.ts`.

## 4. Bounded verification

- [x] 4.1 Chạy các relevant Vitest tests cho copy helper, public-contact control và Establishment Profile permission matrix; verify tất cả targeted tests pass và không có test nào bị skip hoặc đổi expectation ngoài bounded behavior.
- [x] 4.2 Chạy `pnpm --filter @yuta/backoffice typecheck`, targeted Prettier check cho các file implementation/test bị đổi, `openspec validate establishment-copy-primary-contact-to-public --strict`, `pnpm docs:check` và `git diff --check`; verify mọi command pass và diff không chứa DB migration, API, repository, schema, permission, save-flow, Product Knowledge hoặc lifecycle change.
