## Why

Restaurant Knowledge đã được phê duyệt ở Product Intent cho family `Équipe &
culture`, nhưng page `Informations générales` hiện mới triển khai ba slice
`Concept & histoire`, `Cuisine & savoir-faire` và `Expérience client`. Change
page-local này bổ sung tri thức mô tả về văn hóa và cách làm việc chung của
establishment mà không biến nội dung đó thành dữ liệu Personnel, HR workflow
hay dữ liệu vận hành nhân viên.

## What Changes

- Bổ sung đúng ba descriptive knowledge values trong slice `Équipe & culture`:
  `Valeurs & état d’esprit`, `Façon de travailler ensemble` và `Transmission &
intégration`.
- Cho phép manual input, view và edit từng value; cả ba độc lập, optional và
  trạng thái all-empty hợp lệ.
- Cung cấp một explicit save duy nhất cho toàn bộ slice và không autosave.
- Giữ Restaurant Knowledge là canonical owner; dữ liệu có semantic scope theo
  establishment, còn Organization chỉ là tenancy/access envelope.
- Dùng authorization contract hiện có: READ để view, MANAGE để edit/save;
  OWNER và MANAGER có cả hai operation, STAFF bị deny theo default policy.
- Giữ slice độc lập với Establishment Profile và không kế thừa
  `establishment.profile.read/manage`.
- Không đọc, ghi, liên kết hoặc đồng bộ dữ liệu Personnel/Salariés; không tạo
  employee field, evaluation, competency, discipline, onboarding/training
  state, progress, acknowledgement hoặc history.
- Không tích hợp Planning, Pointage, Today, Tâches du jour, Formalités, POS,
  Site Agent, Display hoặc external provider; không tạo checklist, SOP,
  procedure, shift workflow, task, alert hay operational execution state.
- Không thêm AI, automatic learning/inference, review/comment ingestion,
  Marketing/social integration, embeddings/vector DB, provenance/history chi
  tiết hoặc Restaurant Knowledge section khác.
- Không định nghĩa schema, repository/table, API, shared contract, validation
  limit hoặc technical persistence representation trong Proposal này; các lựa
  chọn kỹ thuật hợp lệ thuộc Design sau khi Specs được phê duyệt.

Không có breaking change được đề xuất.

## Capabilities

### New Capabilities

- `restaurant-knowledge/team-culture`: Behavior của slice `Équipe & culture`,
  gồm ownership/scope, READ/MANAGE, ba descriptive values optional độc lập,
  manual view/edit, một whole-slice explicit save, no-autosave và các
  non-relationship bắt buộc với Personnel, HR và module vận hành.

### Modified Capabilities

Không có. Change không sửa requirements của authorization, Concept/Histoire,
Cuisine/savoir-faire hoặc Expérience client đã được chấp nhận.

## Impact

- Page được sở hữu: `apps/backoffice` route
  `/etablissement/informations-generales`.
- Domain/data boundary được sở hữu: Restaurant Knowledge trong cloud boundary
  hiện có; representation cụ thể chưa được quyết định ở Gate 1.
- Authorization: chỉ consume `restaurant-knowledge.read` và
  `restaurant-knowledge.manage`; không thêm permission, role hoặc principal.
- Tenant boundary: giữ trusted server-derived organization + establishment
  context và active membership enforcement hiện tại.
- Existing capabilities cần được bảo toàn: Establishment Profile,
  Restaurant Knowledge authorization, Concept/Histoire, Cuisine/savoir-faire
  và Expérience client.
- Không có dependency hoặc consumer contract mới với Personnel, Planning,
  Pointage, Today, Tâches du jour, Formalités, POS/Site Agent, Display hay
  external runtime/provider.
