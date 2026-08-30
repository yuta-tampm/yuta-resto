# YUTA — Informations générales: Product Decision Integration Task

## Mục tiêu

Tích hợp Product Decision vừa được YUTA phê duyệt cho page:

`Informations générales`

Quyết định đã được chốt:

```text
Informations générales
= composed page (page tổng hợp)

├── Establishment Profile
│   └── giữ nguyên boundary/ownership hiện tại
│
└── Restaurant Knowledge
    └── capability mới thuộc domain Establishment,
        nhưng có boundary/data/permission riêng
```

Đây là Product Knowledge integration task.

Không tạo OpenSpec change/spec.
Không thiết kế DB/API/provider.
Không code.

---

## 1. Nguồn phải đọc

Đọc:

- `docs/INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_REVIEW.md`
- Product-discussion source về `Informations générales`
- `docs/features/establishment/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/AUTHORITY_MODEL.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/MODULE_REGISTRY.md`
- accepted ADRs liên quan Establishment / tenancy / runtime

Dùng integration review làm reconciliation evidence.

---

## 2. Product Decisions được APPROVED

### 2.1 Page responsibility

`Informations générales` là một **composed page**.

Một page có thể hiển thị/combine nhiều capability mà không biến page thành một
data owner duy nhất.

### 2.2 Existing Establishment Profile

Giữ nguyên current approved/current implemented boundary:

- name
- description
- structured address
- phone / email / website / public contacts
- logo / cover URL references
- languages
- service modes
- visibility
- current trusted tenant/runtime/data boundaries
- current profile permissions

Không thay ownership hoặc lifecycle của phần này.

### 2.3 New capability: Restaurant Knowledge

Approve Product Intent cho một capability mới:

`Restaurant Knowledge`

Thuộc domain Establishment ở cấp product/navigation context, nhưng phải có:

- boundary riêng;
- data ownership riêng được định nghĩa trước implementation;
- permission operations riêng;
- không tự kế thừa permission của Establishment Profile;
- không trở thành nơi copy dữ liệu từ module khác.

Initial approved knowledge families:

- Concept & histoire
- Cuisine & savoir-faire
- Expérience client
- Équipe & culture
- Identité de communication
- Connaissances validées du restaurant

Nguyên tắc:

```text
Một datum → một canonical owner → nhiều consumers
```

Restaurant Knowledge chỉ sở hữu knowledge thực sự thuộc capability này.
Dữ liệu Booking, Personnel, Menu/POS, v.v. không được duplicate.

### 2.4 Human-controlled knowledge

Approved principle:

- Restaurant Knowledge có thể được enrich dần theo thời gian;
- restaurateur có thể trực tiếp bổ sung knowledge;
- knowledge do hệ thống/AI đề xuất không được tự động trở thành validated truth;
- human validation là bắt buộc trước promotion thành validated knowledge.

Chưa design workflow chi tiết.

---

## 3. Explicitly OUT OF INITIAL SCOPE / still NEEDS REVIEW

Không promote các phần sau thành current approved behavior:

### Company/legal data
- raison sociale
- forme juridique
- SIREN/SIRET
- TVA
- siège
- représentant légal
- administrative legal contacts

Ownership giữa Organization / Establishment / employer/legal configuration /
Formalités vẫn `NEEDS REVIEW`.

### Automatic knowledge detection from other modules
Ví dụ:
- reviews
- comments
- corrections
- replies

Để future phase / separate Product Decision.

### History / provenance lifecycle
Chưa approve detailed history, retention, source metadata hoặc audit model.

### Marketing / Facebook / Instagram consumption
Future integration, chưa approve contract/owner.

### Social-profile links ownership
Vẫn `NEEDS REVIEW`.

### AI/provider implementation
Không approve provider, prompt, embeddings, vector DB, storage, jobs, model, API.

### Detailed permissions
Chưa approve roles/permission matrix cho Restaurant Knowledge.

### Detailed data model / fields
Chưa approve schema, required fields, enums, limits, validations.

---

## 4. Canonical page home

Tạo:

`docs/features/establishment/general-information/README.md`

Vai trò:

- PAGE-level Product Knowledge;
- không thay thế `docs/features/establishment/README.md`;
- mô tả composed-page responsibility;
- phân biệt rõ:
  - `Establishment Profile` = current approved/implemented capability
  - `Restaurant Knowledge` = newly approved Product Intent, chưa implemented
- route các unresolved areas sang `NEEDS REVIEW`.

Không copy toàn bộ schema/code catalog.

---

## 5. Durable decision record

Nếu repository convention hiện tại dùng accepted ADR cho durable Product boundary,
tạo decision record mới với **next available ADR number**, không tự đoán số.

Decision phải ghi ngắn:

- page is composed;
- page != single data owner;
- Establishment Profile boundary unchanged;
- Restaurant Knowledge is a new bounded capability in Establishment domain;
- separate data/permission boundary required before implementation;
- no duplication of source-module data;
- legal/company data excluded pending ownership decision;
- automatic cross-module knowledge inference not approved yet.

Status phải theo convention accepted/current của repo.

---

## 6. Update current routing/indexes

Update tối thiểu khi cần:

- `docs/features/establishment/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`

Mục tiêu:
- route tới page home;
- add Restaurant Knowledge capability row nếu registry convention yêu cầu;
- lifecycle phải phản ánh đúng evidence.

### Lifecycle cho Restaurant Knowledge

Không tự suy từ implementation.

Product Decision:
`APPROVED`

Implementation:
`NOT_STARTED`

Environment:
`NOT_ENABLED`

Production Readiness:
`NOT_ASSESSED`

External Dependency:
`NOT_ASSESSED` hoặc `NOT_APPLICABLE` chỉ nếu current model/evidence thực sự hỗ trợ.

Nếu External Dependency chưa thể xác định vì future AI/provider scope:
ưu tiên value phù hợp với Lifecycle Model và ghi `NEEDS REVIEW` nếu cần.

Review Marker:
`NEEDS REVIEW` nếu data ownership/permissions unresolved làm capability chưa sẵn sàng cho specs.

Không thay lifecycle của existing Establishment Profile.

---

## 7. OpenSpec readiness

Page home phải ghi rõ:

### Current page context is canonical

OpenSpec analysis cho change thuộc page phải đọc:

1. `docs/features/establishment/README.md`
2. `docs/features/establishment/general-information/README.md`
3. relevant Module Registry row
4. accepted decisions
5. current implementation evidence khi cần

### Restaurant Knowledge implementation is NOT ready yet

Không bắt đầu implementation spec cho Restaurant Knowledge cho đến khi ít nhất:

- data owner/boundary;
- operation-level permissions;
- initial knowledge data shape / behavior scope

được Product/architecture/security review đủ để viết specs không cần đoán.

### Pilot recommendation

Sau integration, đánh giá lại xem pilot nên:
- dùng một bounded enhancement của existing Establishment Profile; hoặc
- chờ resolve Restaurant Knowledge blockers rồi pilot capability mới.

Không tạo OpenSpec change trong task này.

---

## 8. Source document treatment

Product-discussion source không được trở thành canonical authority bằng vị trí file.

Sau integration:
- giữ nó như source/provenance nếu repository policy cho phép;
- hoặc archive theo documentation policy;
- không delete nếu chưa có safe-delete authority.

Nếu move/archive, update links đúng policy.

---

## 9. Validation

Chạy:

- targeted formatting
- docs/link checks
- architecture check nếu required
- `git diff --check`

Xác nhận:

- không OpenSpec change/spec được tạo;
- không schema/config/skills đổi;
- không code đổi;
- existing Establishment Profile lifecycle không đổi;
- unresolved items vẫn `NEEDS REVIEW`.

---

## 10. Output / report

Tạo:

`docs/INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_REPORT.md`

Report gồm:

1. approved decisions integrated
2. canonical page path
3. decision record created/updated
4. routing/index updates
5. lifecycle result
6. remaining NEEDS REVIEW
7. OpenSpec readiness
8. recommended first pilot candidate

Cuối file:

`Status: PROPOSED FOR REVIEW`

Dừng sau integration.
Không tạo OpenSpec pilot.
