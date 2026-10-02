## Why

Restaurant Knowledge đã được phê duyệt ở Product Intent cho family `Expérience
client`, nhưng page `Informations générales` hiện mới triển khai hai slice
`Concept & histoire` và `Cuisine & savoir-faire`. Change page-local này bổ sung
slice mô tả trải nghiệm khách hàng mà establishment mong muốn, đồng thời giữ dữ
liệu vận hành và dữ liệu riêng của từng khách trong các module sở hữu hiện tại.

## What Changes

- Bổ sung đúng ba descriptive knowledge values trong slice `Expérience client`:
  `Expérience souhaitée`, `Accueil & service` và `Attention particulière au
client`.
- Cho phép manual input, view và edit từng value; cả ba độc lập, optional và
  trạng thái all-empty hợp lệ.
- Cung cấp một explicit save duy nhất cho toàn bộ slice và không autosave.
- Giữ Restaurant Knowledge là canonical owner; dữ liệu có semantic scope theo
  establishment, còn Organization chỉ là tenancy/access envelope.
- Dùng authorization contract hiện có: READ để view, MANAGE để edit/save;
  OWNER và MANAGER có cả hai operation, STAFF bị deny theo default policy.
- Giữ slice độc lập với Establishment Profile và không kế thừa
  `establishment.profile.read/manage`.
- Không đọc, ghi, suy luận, liên kết hoặc đồng bộ dữ liệu từ Reservations,
  Reputation/reviews, Today, Personnel/Gestion équipe, POS/orders hoặc module
  vận hành khác.
- Không thêm AI, automatic learning, customer-specific preferences, CRM,
  checklist/workflow nhân viên, taxonomy, scoring, analytics, provenance,
  Marketing/social integration, external provider, embeddings/vector DB hoặc
  Restaurant Knowledge section khác.
- Không định nghĩa schema, repository/table, API, shared contract, validation
  limit hoặc technical persistence representation trong Proposal này; các lựa
  chọn kỹ thuật hợp lệ thuộc Design sau khi Specs được phê duyệt.

Không có breaking change được đề xuất.

## Capabilities

### New Capabilities

- `restaurant-knowledge/customer-experience`: Behavior của slice `Expérience
client`, gồm ownership/scope, READ/MANAGE, ba descriptive values optional độc
  lập, manual view/edit, một whole-slice explicit save, no-autosave và các
  non-relationship bắt buộc với module vận hành.

### Modified Capabilities

Không có. Change không sửa requirements của authorization, Concept/Histoire
hoặc Cuisine/savoir-faire đã được chấp nhận.

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
  Restaurant Knowledge authorization, Concept/Histoire và Cuisine/savoir-faire.
- Không có dependency hoặc consumer contract mới với Reservations, Reputation,
  Today, Personnel, POS/Site Agent, Marketing hay external runtime/provider.
