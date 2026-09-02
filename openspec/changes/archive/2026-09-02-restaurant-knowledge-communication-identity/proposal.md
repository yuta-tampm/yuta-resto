## Why

Restaurant Knowledge đã được phê duyệt ở Product Intent cho family `Identité
de communication`, nhưng page `Informations générales` hiện chỉ triển khai bốn
slice khác. Change page-local này bổ sung tri thức mô tả về cách establishment
muốn giao tiếp và thể hiện bản thân mà không biến nội dung thành Marketing,
social publishing, review automation, CRM hoặc generated content.

## What Changes

- Bổ sung đúng ba descriptive Restaurant Knowledge values trong slice
  `Identité de communication`: `Ton & style de communication`, `Façon de
s’adresser aux clients` và `Éléments de langage & choses à éviter`.
- Cho phép manual input, view và edit từng value; cả ba độc lập, optional và
  trạng thái all-empty hợp lệ.
- Cung cấp một explicit save duy nhất cho toàn bộ slice và không autosave.
- Giữ Restaurant Knowledge là canonical owner; dữ liệu có semantic scope theo
  establishment, còn Organization chỉ là tenancy/access envelope.
- Consume authorization contract hiện có: READ để view, MANAGE để edit/save;
  OWNER và MANAGER có cả hai operation, STAFF bị deny theo default policy.
- Giữ slice độc lập với Establishment Profile và không kế thừa
  `establishment.profile.read/manage` hoặc Marketing permission.
- Không tạo campaign, post, copy, template, schedule, publication setting,
  channel configuration hoặc Marketing repository dependency; Marketing không
  phải required source, consumer hoặc reactive dependency.
- Không đọc reviews/comments, derive identity từ Reputation, tạo/gửi review
  reply hoặc yêu cầu Reviews/Reputation consume các value.
- Không thêm AI generation, automatic learning/inference, prompts, provider,
  embeddings/vector storage, social/external channel integration, CRM/customer
  profile/segmentation hoặc customer-specific preference.
- Giữ `Éléments de langage & choses à éviter` là descriptive free text; không
  tạo moderation, prohibited-word enforcement, legal/compliance engine, claim
  approval hoặc automatic blocking.
- Không áp đặt required content, length, formatting, enum, taxonomy, preset,
  score, brand/sentiment rating, automatic classification hoặc template
  selection.
- Không định nghĩa table/repository representation, API, shared contract,
  migration mechanics hoặc component architecture trong Proposal; technical
  representation hợp lệ thuộc Design sau khi Specs được phê duyệt.

Không có breaking change được đề xuất.

## Capabilities

### New Capabilities

- `restaurant-knowledge/communication-identity`: Observable behavior của slice
  `Identité de communication`, gồm ownership/scope, READ/MANAGE, đúng ba
  descriptive values optional độc lập, manual view/edit, một whole-slice
  explicit save, no-autosave và các non-relationship bắt buộc với Marketing,
  Reviews/Reputation, AI, social/providers, CRM/customer data và runtime khác.

### Modified Capabilities

Không có. Change không sửa requirements của Restaurant Knowledge authorization,
Concept/Histoire, Cuisine/savoir-faire, Expérience client hoặc Équipe & culture
đã được chấp nhận.

## Impact

- Page được sở hữu: `apps/backoffice` route
  `/etablissement/informations-generales`.
- Domain/data boundary được sở hữu: Restaurant Knowledge trong cloud boundary
  hiện có; technical persistence representation chưa được chọn ở Gate 1.
- Authorization: chỉ consume `restaurant-knowledge.read` và
  `restaurant-knowledge.manage`; không thêm permission, role, principal hoặc
  admin/support bypass.
- Tenant boundary: giữ trusted server-derived organization + establishment
  context và active membership enforcement hiện tại.
- Existing capabilities phải được bảo toàn: Establishment Profile, Restaurant
  Knowledge authorization, Concept/Histoire, Cuisine/savoir-faire, Expérience
  client và Équipe & culture.
- Không có dependency hoặc consumer contract mới với Marketing,
  Reviews/Reputation, AI/automation, Social, CRM/customer data, POS/Site Agent,
  Display, public website hoặc external provider.
- UI bị ảnh hưởng trên một `EXISTING_PAGE`; Browser QA responsive,
  accessibility, role/state và screenshot-hash evidence sẽ bắt buộc trước Gate
  3, không thuộc Gate 1.
