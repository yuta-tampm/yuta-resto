# Browser QA Report

Change: `restaurant-knowledge-validated-knowledge`

Route: `http://localhost:3001/etablissement/informations-generales`

QA status: `PASS`

Completed: `2026-09-03T00:40:19+02:00`

## Phục hồi môi trường QA

Nguyên nhân của lần `QA_BLOCKED_BY_ENVIRONMENT` trước đã được xác định mà không
đọc hoặc ghi production:

- Backoffice runtime đọc development override và kết nối
  `localhost:56031/yuta_cloud`;
- container repository-supported `yuta-cloud-db-dev` đang healthy và publish
  PostgreSQL qua cổng `56031`;
- migration command trước đó đọc `packages/db-cloud/.env.local` và nhắm
  `localhost:55431/yuta_cloud`, nơi không có listener;
- hai target có cùng logical database/service nhưng khác local endpoint, nên
  target migration cũ trả `ECONNREFUSED`.

Không env file nào được sửa. `pnpm db:cloud:migrate` được chạy với process-local
`CLOUD_DATABASE_URL` lấy từ effective Backoffice development override. Trước
migration, database thật kết thúc ở
`0015_restaurant_knowledge_communication_identity` và chưa có bảng validated
knowledge. Sau migration, bản ghi `0016` tồn tại với timestamp journal hiện
hành.

Kiểm tra trực tiếp trên database thật xác nhận:

- đúng bốn cột `organization_id UUID NOT NULL`,
  `establishment_id UUID NOT NULL`, `id UUID NOT NULL`,
  `statement TEXT NOT NULL`;
- composite primary key `(organization_id, establishment_id, id)`;
- composite foreign key `(organization_id, establishment_id)` tới
  `establishments(organization_id, id)` với `ON DELETE RESTRICT`;
- không có cột hoặc constraint ngoài phạm vi đã duyệt.

Đây chỉ là chuẩn bị database local QA, không phải Environment enablement hay
Production Readiness promotion.

## OWNER

Phiên thật `Propriétaire LUNA` được dùng với dữ liệu persisted:

- no-item state hợp lệ và chỉ có một `Ajouter une connaissance` control;
- pending create không persist khi reload;
- exact-empty create bị client chặn; whitespace-only create hiển thị clear
  field-associated validation, `aria-invalid=true`, save disabled;
- explicit create tạo đúng một item và giữ nguyên surrounding whitespace;
- reload xác nhận một item, sau đó hai item theo thứ tự deterministic;
- pending edit không autosave và canonical value cũ trở lại sau reload;
- whitespace-only/blank edit bị chặn, không chuyển sang remove, và canonical
  statement trước đó giữ nguyên;
- explicit update giữ nguyên surrounding whitespace và hiển thị semantic
  success status;
- pending remove hiển thị warning cùng separate confirm control;
- undo remove tạo zero persistence và cả hai item vẫn còn sau reload;
- explicit physical remove chỉ xóa item Bêta; reload còn đúng item Alpha;
- không có console error sau khi database được migrate.

Server-side bypass behavior cho exact-empty/whitespace create-edit vẫn được
chứng minh bởi focused action tests; Browser QA không dùng DOM mutation hoặc
ad-hoc request để né client boundary.

## MANAGER

Seeded principal thật `Manager LUNA` được đăng nhập qua Backoffice:

- route hiển thị persisted validated item;
- add/edit/remove controls hiện diện, chứng minh MANAGE presentation;
- explicit update sang `  QA Manager Confirmée  ` thành công;
- semantic success status xuất hiện;
- reload giữ nguyên exact surrounding whitespace.

## Principal không có Restaurant Knowledge access

Repository seed không có STAFF principal. Thay vì tạo hoặc giả danh STAFF,
Browser QA dùng seeded platform-admin `admin@yutapro.fr`, được seed code loại bỏ
mọi restaurant membership:

- đăng nhập dẫn tới `/acces/aucun-etablissement`;
- trang hiển thị `Aucun établissement disponible`;
- `Connaissances validées` và toàn bộ mutation controls đều vắng mặt;
- direct authenticated restaurant-route access không được cấp.

Principal này được ghi nhận đúng là platform-admin không có restaurant
membership, không phải STAFF. Không role, permission, membership hoặc accepted
grant matrix nào bị thay đổi.

## Responsive, accessibility và regression

| Kiểm tra                 | Kết quả                                                                                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Width `1440`             | `PASS` — OWNER/MANAGER/no-access evidence, không horizontal overflow                                                                                                                         |
| Width `1024`             | `PASS` — multiple items và update success, `scrollWidth = innerWidth`                                                                                                                        |
| Width `768`              | `PASS` — validation và keyboard focus, không clipping quan sát được                                                                                                                          |
| Width `390`              | `PASS` — pending remove/undo controls xếp dọc, `scrollWidth = innerWidth`                                                                                                                    |
| Keyboard                 | `PASS` — Tab từ textarea tới `Retirer`                                                                                                                                                       |
| Visible focus            | `PASS` — focus-visible ring quan sát được trên `Retirer`                                                                                                                                     |
| Accessible names         | `PASS` — `Connaissance`, add/edit/remove/undo/confirm controls có accessible name                                                                                                            |
| Validation association   | `PASS` — field có `aria-invalid` và `aria-describedby` tới message                                                                                                                           |
| Semantic feedback        | `PASS` — update success dùng status; pending remove dùng warning; validation liên kết field                                                                                                  |
| Existing page regression | `PASS` — Establishment Profile, Concept & histoire, Cuisine & savoir-faire, Expérience client, Équipe & culture, Identité de communication và Connaissances validées cùng render đúng thứ tự |

Safe persistence failure không được cố ý tạo và không được bịa đặt.

## Screenshot evidence

Tất cả 12 screenshot thật và lowercase SHA-256 nằm trong
`screenshot-manifest.md`. Các evidence chính:

- `owner-multiple-items-1024.jpg`;
- `owner-blank-edit-validation-768.jpg`;
- `owner-pending-remove-390.jpg`;
- `manager-update-success-1440.jpg`;
- `no-access-platform-admin-1440.jpg`.

## Post-QA regression

Không implementation file nào được sửa trong lúc phục hồi môi trường hoặc QA.
Focused Backoffice loader/action/model/component suite được chạy lại sau QA:

```text
Test Files  4 passed (4)
Tests       39 passed (39)
```

Gate 3 readiness: `YES`, subject to final hash/integrity recomputation.
