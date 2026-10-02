# YUTA — Step 3: Module Registry

## Mục tiêu

Tạo **Module Registry** (bảng danh mục trung tâm của các product/module/capability trong YuTa).

Registry này phải giúp agent trả lời nhanh:

- YuTa có những product/app nào?
- Mỗi module thuộc product/runtime nào?
- Tài liệu chính của module nằm ở đâu?
- Code chính nằm ở đâu?
- Ai sở hữu dữ liệu/runtime?
- Module liên quan tới module nào?
- Trạng thái hiện tại theo `LIFECYCLE_STATUS_MODEL.md` là gì?
- Kết luận đó dựa trên bằng chứng nào?

Đây là **Step 3 của Knowledge Normalization**.

Ở bước này:
- chỉ tạo registry trung tâm;
- không sửa các tài liệu nguồn;
- không sửa status trong docs cũ;
- không refactor docs;
- không sửa code;
- không custom OpenSpec;
- không tạo OpenSpec change/spec.

---

# Nguồn bắt buộc phải đọc

Đọc trước:

1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/LIFECYCLE_STATUS_MODEL.md`
4. `docs/KNOWLEDGE_AUDIT.md`
5. `docs/PRODUCT_KNOWLEDGE.md`
6. `docs/REPOSITORY_MAP.md`
7. `docs/CURRENT_STATE.md`
8. `docs/README.md`

Sau đó đọc có chọn lọc:

- `docs/features/`
- `docs/products/`
- `docs/architecture/`
- `docs/decisions/`
- `docs/operations/`
- `docs/ui/pages/README.md`

Kiểm tra code/manifests/tests chỉ khi cần xác minh `Implemented State`,
`Runtime Ownership`, `Executable Data Shape`, hoặc deployment evidence theo
`AUTHORITY_MODEL.md`.

Tuân thủ root và nested `AGENTS.md`.

---

# Output duy nhất được phép tạo

Tạo:

`docs/MODULE_REGISTRY.md`

Không sửa file nào khác.

---

# Nguyên tắc thiết kế registry

## 1. Registry không được trở thành một tài liệu product spec mới

Registry chỉ:

- định danh;
- phân loại;
- chỉ đường tới source chính;
- ghi trạng thái;
- ghi evidence (bằng chứng);
- ghi relation (liên hệ).

Không copy business rules, user flows, schemas hoặc nội dung dài từ các tài liệu khác.

---

## 2. Phân biệt 3 cấp

Registry phải dùng 3 cấp sau khi phù hợp:

### Product / Runtime
*(sản phẩm hoặc runtime lớn)*

Ví dụ:
- Public Web
- Backoffice
- Public Booking
- Public Feedback
- POS
- Site Agent
- Display

### Module
*(nhóm chức năng nghiệp vụ)*

Ví dụ:
- Reservations
- Reputation
- Personnel
- Stock
- Planning
- Pointage
- Formalités

### Capability
*(một năng lực cụ thể đủ nhỏ để có trạng thái riêng)*

Ví dụ:
- Public booking creation
- Booking cancellation
- Google OAuth foundation
- Google review synchronization
- Employee document upload
- Formalités generation

Không bắt buộc mọi module phải chia capability ở bước này.

Chỉ chia capability khi:
- trạng thái trong cùng module khác nhau đáng kể;
- owner/runtime khác nhau;
- production gate khác nhau;
- nếu gộp lại sẽ tạo status mơ hồ.

Tránh registry quá chi tiết tới mức mỗi route/API là một dòng.

---

## 3. Bounded scope

Mỗi dòng phải có **bounded scope** (phạm vi được giới hạn rõ).

Không ghi:

`Formalités = IMPLEMENTED`

nếu chỉ có một development prototype.

Phải ghi kiểu:

`Formalités — connected development prototype`

hoặc tách capability phù hợp.

Tương tự:
- Google OAuth foundation khác Google review synchronization.
- POS repository implementation khác một deployment cụ thể tại LUNA.
- Display product khác một device/site cụ thể.

---

# Nội dung bắt buộc của `docs/MODULE_REGISTRY.md`

## 1. Purpose

Giải thích ngắn:

- registry dùng để làm gì;
- registry không thay thế Product Knowledge, OpenSpec specs, code hay operational evidence;
- mọi status phải tuân theo `AUTHORITY_MODEL.md` và `LIFECYCLE_STATUS_MODEL.md`.

---

## 2. Registry conventions

Định nghĩa ngắn:

- `Product / Runtime`
- `Module`
- `Capability`
- `Primary Knowledge Source`
- `Implementation Evidence`
- `Data Owner`
- `Runtime Owner`
- `Related Modules`
- `Review Marker`

### Review Marker

Dùng một cột riêng cho:

- `OK`
- `UNVERIFIED`
- `CONFLICT`
- `NEEDS REVIEW`

Đây là **evidence/review marker** (dấu đánh giá bằng chứng), không phải lifecycle status.

Nếu không đủ bằng chứng để gán một canonical status:
- không đoán;
- ghi `—` ở status đó;
- dùng `UNVERIFIED` hoặc `NEEDS REVIEW`;
- ghi lý do ngắn.

---

## 3. Product / Runtime Registry

Tạo bảng tổng quan các product/runtime chính.

Tối thiểu kiểm tra:

- `apps/web`
- `apps/backoffice`
- `apps/booking-web`
- `apps/feedback-web`
- `apps/yuta-pos`
- `apps/site-agent`
- `apps/yuta-display`
- reserved `apps/platform-admin` nếu vẫn là Product Intent hợp lệ

Bảng tối thiểu:

| Product / Runtime | Purpose | Runtime class | Primary docs | Implementation root | Data owner | Status summary | Review marker |
|---|---|---|---|---|---|---|---|

`Status summary` chỉ là tóm tắt ngắn, không thay thế bảng module/capability chi tiết.

---

## 4. Module / Capability Registry

Tạo bảng trung tâm.

Tối thiểu phải xem xét các nhóm đã được audit tìm thấy:

### Cloud / Public
- Public website
- Public booking
- Reservations administration
- Reputation
- Direct feedback
- Google connector / synchronization

### Backoffice foundation
- Authentication
- Tenancy
- Access / membership
- Establishment profile
- Today

### Gestion de l'équipe
- Salariés / Personnel
- Registre du personnel
- Formalités du personnel
- Planning
- Pointage
- Tâches du jour

### Stock
Nếu có source phù hợp:
- Inventaire
- Fournisseurs
- Mouvements
- Fiches techniques

### Local restaurant runtime
- POS
- Site Agent
- Printing
- Kitchen
- Payments
- Catalog / management
- Reports

### Standalone
- Display

Không tự tạo module chỉ vì route/file tồn tại.
Phải có Product Knowledge hoặc repository evidence đủ để xác định nó là module/capability có ý nghĩa.

---

## 5. Cột bắt buộc cho mỗi module/capability

Bảng phải có tối thiểu:

| Product / Runtime | Module | Capability / Scope | Primary Knowledge Source | Implementation Evidence | Runtime Owner | Data Owner | Related Modules | Product Decision | Implementation | Environment | Production Readiness | External Dependency | Review Marker |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Có thể thêm cột nếu thật sự cần, nhưng tránh làm bảng quá nặng.

### Status values

Phải dùng đúng canonical values từ:

`docs/LIFECYCLE_STATUS_MODEL.md`

Không tạo status mới.

Nếu một status chưa xác minh được:
- ghi `—`;
- dùng `UNVERIFIED` / `NEEDS REVIEW` ở `Review Marker`;
- nêu evidence ngắn trong note hoặc source.

---

## 6. Source linking rules

Mỗi dòng phải ưu tiên link tới:

### Product Intent
- accepted decision/ADR;
- feature/product doc;
- approved OpenSpec spec sau này.

### Implemented State
- code root;
- route/service/repository/package;
- tests nếu quan trọng.

### Data Owner
Ví dụ:
- `packages/db-cloud`
- `packages/db-pos`
- `apps/yuta-display/src/db`
- `N/A` nếu không có persisted business data
- `NEEDS REVIEW` nếu ownership chưa rõ

Không ghi database owner từ suy đoán UI.

---

## 7. Related Modules

Chỉ ghi relation quan trọng.

Ví dụ:
- Reservations ↔ Establishment / service periods
- Today ↔ Reservations / tasks / stock / pointage
- Personnel ↔ Formalités / Planning / Pointage
- Inventory ↔ Suppliers / Movements / Fiches techniques
- POS ↔ Site Agent / Printing / Payments / Kitchen

Không cần mô tả flow chi tiết.

Nếu relation thể hiện hướng ownership/source of truth, ghi rõ:

`A -> B`

nếu A phụ thuộc/đọc từ B.

Không invent relation từ tên module.

---

## 8. Known conflicts section

Sau registry, tạo:

`## Known conflicts / needs review`

Chỉ liệt kê conflict hiện có đã được source/evidence hỗ trợ.

Tối thiểu kiểm tra các conflict từ Knowledge Audit:

1. Public feedback ownership
2. Formalités maturity wording
3. UI page-pack lifecycle drift
4. `packages/db` filesystem residue / active package interpretation

Không sửa conflict trong bước này.

Mỗi item:

- Scope
- Conflict
- Authority type
- Current registry treatment
- Recommended owner/review needed

---

## 9. Missing module knowledge section

Tạo:

`## Missing or weak Product Knowledge homes`

Liệt kê module nào registry xác định được nhưng chưa có một source Product Knowledge đủ rõ.

Knowledge Audit đã gợi ý kiểm tra:
- Display
- Site Agent
- Identity / Access
- Establishment
- Today
- Personnel

Không tự tạo các docs còn thiếu trong bước này.

Chỉ ghi:
- module;
- knowledge hiện đang phân tán ở đâu;
- đề xuất source home tương lai.

---

## 10. OpenSpec position

Ghi ngắn:

- hiện chưa có normative `openspec/specs/`;
- registry hiện link tới docs + code hiện tại;
- sau khi OpenSpec được approve làm normative, registry sẽ thêm/link approved spec của từng capability;
- registry không được copy nội dung spec;
- OpenSpec change không tự thay status trong registry;
- status chỉ đổi khi evidence tương ứng được review theo lifecycle model.

---

## 11. Adoption / maintenance rule

Đề xuất rule duy trì registry:

1. Registry là index trung tâm, không phải source chứa business logic.
2. Khi thêm module/capability mới, thêm hoặc cập nhật dòng tương ứng.
3. Khi source ownership thay đổi, update link/owner sau khi decision được approve.
4. Khi lifecycle status thay đổi, cập nhật từng dimension độc lập.
5. Không tự promote status từ OpenSpec `apply`, `archive`, hoặc code merge.
6. `CURRENT_STATE.md` có thể là summary, nhưng registry phải trỏ tới nguồn cụ thể hơn khi có.
7. Nếu evidence conflict, giữ `NEEDS REVIEW` thay vì chọn nguồn thuận tiện.

---

## 12. Status

Cuối file ghi:

```md
Status: PROPOSED FOR REVIEW
```

Không tự chuyển thành `APPROVED`.

---

# Chất lượng mong muốn

Registry phải:

- dễ scan;
- không quá dài;
- đủ để agent biết phải đọc gì tiếp theo;
- không duplicate nội dung;
- không gom các capability có status khác nhau vào cùng một status giả;
- không gán production status từ code;
- không gán implementation status từ docs wording;
- không gán Product Decision chỉ vì code tồn tại.

Nếu bảng trở nên quá rộng, có thể dùng một bảng chính + các bảng theo domain,
nhưng vẫn phải giữ cùng schema cột/status nhất quán.

---

# Điều kiện hoàn thành

Task chỉ hoàn thành khi:

- [ ] Đã đọc Authority Model và Lifecycle Status Model đã approved
- [ ] Đã xác định Product / Runtime registry
- [ ] Đã tạo Module / Capability registry
- [ ] Status dùng đúng 5 dimensions
- [ ] Có Review Marker riêng
- [ ] Không đoán status khi thiếu evidence
- [ ] Có Data Owner và Runtime Owner
- [ ] Có Related Modules
- [ ] Có Known conflicts / needs review
- [ ] Có Missing or weak Product Knowledge homes
- [ ] Có OpenSpec position
- [ ] Không sửa bất kỳ file nào khác
- [ ] `docs/MODULE_REGISTRY.md` kết thúc bằng `Status: PROPOSED FOR REVIEW`

Sau khi tạo file, dừng lại và chờ review.

Không:
- sửa conflict;
- normalize docs;
- tạo missing Product Knowledge docs;
- custom OpenSpec;
- tạo OpenSpec change/spec;
- bắt đầu Step 4.
