# YUTA — Step 2: Lifecycle Status Model

## Mục tiêu

Thiết lập **Lifecycle Status Model** (mô hình trạng thái vòng đời) cho YuTa.

Mục tiêu của bước này là chuẩn hóa cách mô tả trạng thái của một capability/feature
(chức năng hoặc năng lực của hệ thống), để tránh dùng lẫn các từ như:

- planned
- approved
- prototype
- development-only
- implemented
- integrated
- implemented locally
- production blocked
- production ready
- current runtime
- not ready

Đây là **bước 2 của Knowledge Normalization**.

Ở bước này:
- chỉ định nghĩa mô hình trạng thái chuẩn;
- không sửa trạng thái của các feature hiện có;
- không refactor toàn bộ docs;
- không sửa business rule;
- không sửa code;
- không custom OpenSpec;
- không tạo OpenSpec change/spec.

---

## Bối cảnh bắt buộc phải đọc trước

Đọc:

1. `AGENTS.md`
2. `docs/AUTHORITY_MODEL.md`
3. `docs/KNOWLEDGE_AUDIT.md`
4. `docs/PRODUCT_KNOWLEDGE.md`
5. `docs/CURRENT_STATE.md`
6. `docs/DOCUMENTATION_POLICY.md`
7. `docs/operations/PRODUCTION_READINESS.md`
8. `docs/ui/pages/README.md`

Sau đó tìm trong `docs/` các từ trạng thái đang được dùng, tối thiểu:

- `planned`
- `approved`
- `prototype`
- `development`
- `development-only`
- `implemented`
- `integrated`
- `implemented locally`
- `production blocked`
- `production ready`
- `not ready`
- `current runtime`
- `status`
- `package status`
- `phase`

Không cần đọc toàn bộ code ở bước này, trừ khi cần hiểu ý nghĩa của một trạng thái cụ thể trong tài liệu.

Nếu có nested `AGENTS.md` liên quan thì phải tuân thủ.

---

## Output duy nhất được phép tạo

Tạo:

`docs/LIFECYCLE_STATUS_MODEL.md`

Không sửa bất kỳ file nào khác trong bước này.

---

# Yêu cầu thiết kế mô hình

## Nguyên tắc quan trọng nhất

Không dùng **một status duy nhất** để mô tả mọi khía cạnh.

Ví dụ một feature có thể:

- đã được Product Owner chấp nhận;
- đã có code;
- chỉ được bật ở development;
- chưa được production-ready vì thiếu legal/provider/ops gate.

Do đó phải dùng **nhiều dimension** (nhiều trục trạng thái) độc lập.

---

## Các dimension tối thiểu phải xem xét

Codex phải đánh giá repo hiện tại và đề xuất mô hình. Mô hình cuối cùng tối thiểu phải xử lý được các dimension sau:

### 1. Product Decision Status
*(trạng thái quyết định sản phẩm)*

Trả lời:

> Feature này đã được YuTa chấp nhận về mặt sản phẩm chưa?

Ví dụ có thể gồm:

- `PROPOSED`
- `APPROVED`
- `DEPRECATED`

Không copy mù các giá trị này; phải kiểm tra repo và giải thích lựa chọn.

---

### 2. Implementation Status
*(trạng thái triển khai trong repository)*

Trả lời:

> Code hiện tại đã triển khai feature đến mức nào?

Mô hình phải phân biệt ít nhất:

- chưa triển khai;
- prototype/fixture;
- triển khai thật trong repo;
- nếu cần, partial/incomplete.

Tránh dùng `implemented` để ngầm suy ra production-ready.

---

### 3. Environment Availability
*(feature được phép/chạy được ở môi trường nào)*

Trả lời:

> Feature hiện được bật ở đâu?

Ví dụ:

- none
- development only
- staging
- production enabled

Nếu repo không có staging chính thức thì không được tự tạo nghĩa giả.

---

### 4. Production Readiness
*(mức sẵn sàng production)*

Trả lời:

> Feature đã vượt qua các gate cần thiết để chạy production chưa?

Phải phân biệt:

- chưa đánh giá;
- bị block;
- ready.

Không dùng code existence làm bằng chứng duy nhất.

Phải tuân thủ `docs/AUTHORITY_MODEL.md`.

---

### 5. External Dependency Status
*(trạng thái phụ thuộc bên ngoài)*

Chỉ giữ dimension này nếu repo thực sự cần.

Dùng cho các feature phụ thuộc:
- provider;
- OAuth;
- legal approval;
- external API;
- hardware;
- signed template;
- third-party configuration.

Ví dụ Google sync có thể code foundation nhưng provider/external approval chưa sẵn sàng.

Nếu Codex thấy dimension này không nên là top-level status, phải giải thích và đề xuất cách khác.

---

## Không gộp nhầm các khái niệm

Tài liệu phải nêu rõ:

`APPROVED`
không đồng nghĩa
`IMPLEMENTED`.

`IMPLEMENTED`
không đồng nghĩa
`PRODUCTION_READY`.

`PRODUCTION_READY`
không đồng nghĩa
`DEPLOYED`.

`DEPLOYED`
không đồng nghĩa
mọi external dependency đang hoạt động.

`PROTOTYPE`
không đồng nghĩa
`PLANNED`.

---

# Nội dung bắt buộc của `docs/LIFECYCLE_STATUS_MODEL.md`

## 1. Purpose

Giải thích:
- vấn đề trạng thái hiện tại;
- vì sao YuTa cần nhiều dimension;
- tài liệu này không tự thay đổi trạng thái feature hiện có.

---

## 2. Current vocabulary findings

Tóm tắt các từ trạng thái đang được dùng trong repo.

Không cần liệt kê mọi occurrence.

Nhóm chúng theo ý nghĩa và chỉ ra nơi có ambiguity
(mơ hồ), ví dụ:

- `implemented`
- `integrated`
- `approved`
- `current runtime`
- `development-only`
- `production blocked`
- `package status`
- `phase`

Ghi source/path đại diện.

---

## 3. Canonical status dimensions

Tạo bảng:

| Dimension | Question answered | Allowed values | Authority / verification |
|---|---|---|---|

Mỗi dimension phải:
- có tên rõ;
- có tập giá trị hữu hạn;
- mỗi giá trị có nghĩa chính xác;
- tránh overlap (chồng nghĩa) với dimension khác.

---

## 4. Status definitions

Cho từng dimension, định nghĩa từng giá trị.

Ví dụ format:

```md
### Implementation Status

#### NOT_STARTED
Không có implementation hiện tại được xác minh.

#### PROTOTYPE
Có UI/fixture/dev slice để khám phá hoặc kiểm chứng,
nhưng chưa phải implementation hoàn chỉnh.

#### IMPLEMENTED
Có repository implementation thực, được xác minh bằng
code/tests theo Authority Model.
```

Đây chỉ là ví dụ format.
Codex phải đề xuất vocabulary phù hợp nhất sau khi audit repo.

---

## 5. Invalid combinations / interpretation rules

Định nghĩa các combination cần cảnh báo.

Ví dụ:

- `Product Decision = PROPOSED`
  nhưng `Production Readiness = READY`
  → có thể là conflict hoặc governance error.

- `Implementation = NOT_STARTED`
  nhưng `Environment = PRODUCTION_ENABLED`
  → invalid.

- `Implementation = PROTOTYPE`
  nhưng `Production Readiness = READY`
  → cần review.

Không cần tạo quá nhiều rule; chỉ giữ các rule có giá trị thực tế.

---

## 6. Mapping from legacy vocabulary

Tạo bảng:

| Existing term | Likely dimension | Canonical interpretation | Automatic mapping allowed? |
|---|---|---|---|

Phải bao gồm tối thiểu:

- planned
- approved
- prototype
- development-only
- implemented
- integrated
- implemented locally
- production blocked
- production ready
- not ready
- current runtime
- package status
- phase

Rất quan trọng:

Không được map tự động nếu từ cũ mơ hồ.

Ví dụ:
`integrated`
có thể cần `NEEDS REVIEW`
nếu không rõ đang nói code integration, data backing hay production integration.

---

## 7. Examples from current repo

Cho ít nhất 4 ví dụ:

1. Formalités
2. Public booking
3. Reputation / Google integration
4. Local POS hoặc Display

Mỗi ví dụ phải trình bày theo nhiều dimension, ví dụ:

```text
Product Decision:
Implementation:
Environment Availability:
Production Readiness:
External Dependency:
```

Nếu evidence chưa đủ, dùng `UNVERIFIED` hoặc ghi `NEEDS REVIEW`.
Không tự thay đổi source docs.

---

## 8. Relationship with Authority Model

Giải thích ngắn:

- Product Decision lấy authority từ Product Intent;
- Implementation Status lấy authority từ Implemented State;
- Production Readiness lấy authority từ Production Readiness;
- Environment/deployment claim cần dated runtime evidence;
- khi nguồn conflict, áp dụng `CONFLICT` / `NEEDS REVIEW` theo `AUTHORITY_MODEL.md`.

Không lặp lại toàn bộ Authority Model.

---

## 9. Relationship with OpenSpec

Trạng thái hiện tại:

- OpenSpec chưa normative;
- custom workflow chưa có.

Đề xuất tương lai:

- OpenSpec approved spec xác định behavioral requirement;
- OpenSpec change không tự chuyển Product Decision sang `APPROVED`;
- Apply không tự chuyển Implementation Status sang `IMPLEMENTED` nếu chưa verify;
- Archive/sync không tự chuyển Production Readiness sang `READY`;
- Verify có thể cung cấp evidence cho Implementation Status, nhưng không thay thế deployment/production evidence.

Không custom OpenSpec trong bước này.

---

## 10. Adoption rule

Định nghĩa cách áp dụng sau khi model được approve:

- không rewrite toàn bộ docs một lần;
- áp dụng theo từng batch/module;
- khi gặp status cũ mơ hồ → `NEEDS REVIEW`;
- không tự chuyển trạng thái chỉ dựa vào tên file hoặc wording cũ;
- Module Registry ở bước sau sẽ dùng các dimension này.

---

## 11. Status of this document

Cuối file ghi:

```md
Status: PROPOSED FOR REVIEW
```

Không tự chuyển thành `APPROVED`.

---

# Quy tắc viết

- Ngắn gọn, dễ tra cứu.
- Ưu tiên vocabulary đơn giản và ổn định.
- Không tạo quá nhiều trạng thái nếu không cần thiết.
- Mỗi status phải có nghĩa duy nhất.
- Không sửa các status hiện có trong repo.
- Không sửa `CURRENT_STATE.md`.
- Không sửa page packs.
- Không sửa `PRODUCT_KNOWLEDGE.md`.
- Không sửa `AUTHORITY_MODEL.md`.
- Không tạo Module Registry ở bước này.
- Không tạo OpenSpec schema/change/spec.

---

# Điều kiện hoàn thành

Task chỉ hoàn thành khi:

- [ ] Đã đọc các nguồn bắt buộc
- [ ] Đã khảo sát vocabulary trạng thái hiện tại
- [ ] Đã tạo `docs/LIFECYCLE_STATUS_MODEL.md`
- [ ] Có nhiều dimension độc lập, không dùng một status duy nhất
- [ ] Có allowed values rõ ràng cho từng dimension
- [ ] Có mapping từ vocabulary cũ
- [ ] Không tự map các từ mơ hồ
- [ ] Có ít nhất 4 ví dụ thực tế
- [ ] Có relationship với Authority Model
- [ ] Có relationship với OpenSpec
- [ ] Không sửa file nào khác
- [ ] File kết thúc bằng `Status: PROPOSED FOR REVIEW`

Sau khi tạo file, dừng lại và chờ review.
Không tự chuyển sang Step 3 — Module Registry.
