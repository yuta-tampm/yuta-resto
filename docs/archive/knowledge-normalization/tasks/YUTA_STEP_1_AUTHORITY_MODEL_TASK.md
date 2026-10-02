# YUTA — Step 1: Authority Model

## Mục tiêu

Thiết lập **Authority Model** (quy tắc xác định nguồn nào được ưu tiên khi nhiều tài liệu/code nói khác nhau) cho YuTa.

Đây là **bước 1 của Knowledge Normalization**.

Ở bước này:
- chỉ định nghĩa luật đọc và ưu tiên nguồn;
- không refactor toàn bộ docs;
- không sửa business rule;
- không custom OpenSpec;
- không tạo OpenSpec change;
- không sửa code.

---

## Bối cảnh bắt buộc phải đọc trước

Đọc:

1. `AGENTS.md`
2. `docs/KNOWLEDGE_AUDIT.md`
3. `docs/PRODUCT_KNOWLEDGE.md`
4. `docs/README.md`
5. `docs/DOCUMENTATION_POLICY.md`
6. `docs/architecture/DATA_MODEL.md`
7. `docs/ui/README.md`

Nếu có nested `AGENTS.md` liên quan tới tài liệu đang đọc thì phải tuân thủ.

Knowledge Audit đã phát hiện rằng repo hiện có nhiều thứ tự ưu tiên nguồn khác nhau cho các mục đích khác nhau. Không được cố ép thành một thứ tự duy nhất cho mọi câu hỏi.

---

## Output duy nhất được phép tạo

Tạo:

`docs/AUTHORITY_MODEL.md`

Không sửa file nào khác trong bước này.

---

# Nội dung bắt buộc của `docs/AUTHORITY_MODEL.md`

## 1. Purpose

Giải thích ngắn:

- Authority Model dùng để làm gì;
- tại sao YuTa không dùng một thứ tự ưu tiên duy nhất;
- agent phải xác định **loại câu hỏi** trước khi chọn nguồn.

---

## 2. Knowledge question types

Tối thiểu phải có 5 loại sau:

### A. Product Intent
*(ý định sản phẩm: YuTa đã quyết định hoặc muốn hệ thống phải làm gì)*

### B. Implemented State
*(trạng thái đã triển khai: code hiện tại thực sự đang làm gì)*

### C. Executable Data Shape
*(cấu trúc dữ liệu thực thi: schema/migration thực tế đang định nghĩa dữ liệu thế nào)*

### D. UI Delivery
*(trạng thái và quy tắc triển khai UI: UI được thiết kế, triển khai và kiểm chứng thế nào)*

### E. Production Readiness
*(mức sẵn sàng production: có đủ điều kiện chạy thật ngoài môi trường phát triển chưa)*

Nếu repo hiện tại cần thêm loại riêng như:
- Authorization / Security
- Runtime Ownership
- Operational Behavior

thì có thể đề xuất, nhưng phải giải thích vì sao 5 loại trên chưa đủ.

---

## 3. Authority matrix

Tạo bảng rõ ràng:

| Question type | Primary authority | Secondary authority | Verification source | Sources that must NOT be treated as final authority |
|---|---|---|---|---|

Không copy mù thứ tự từ task này.

Phải đối chiếu các quy tắc đang có trong:
- `docs/README.md`
- `docs/ui/README.md`
- `docs/architecture/DATA_MODEL.md`
- `docs/KNOWLEDGE_AUDIT.md`

và đề xuất mô hình phù hợp nhất với repo hiện tại.

### Hướng mong muốn

Mô hình cần gần với nguyên tắc sau, nhưng Codex phải kiểm tra lại với repo trước khi ghi chính thức:

#### Product Intent
Ưu tiên:
1. accepted decisions / ADRs có liên quan;
2. current feature/product docs;
3. approved OpenSpec specs khi chúng tồn tại và đã được YuTa chấp nhận;
4. UI docs khi câu hỏi liên quan UX;
5. code chỉ dùng để kiểm chứng trạng thái đã triển khai, không tự biến thành product intent.

#### Implemented State
Ưu tiên:
1. current code + tests;
2. contracts / runtime guards / repositories;
3. current feature/product status docs;
4. `CURRENT_STATE.md` như summary (bản tóm tắt), không phải bằng chứng duy nhất.

#### Executable Data Shape
Ưu tiên:
1. active executable schemas;
2. migrations;
3. contracts liên quan;
4. architecture docs;
5. prose docs không được ghi đè executable schema nếu chưa có quyết định thay đổi được phê duyệt.

#### UI Delivery
Ưu tiên:
1. UI governance/rules;
2. current page pack cho page cụ thể;
3. current UI code;
4. screenshots/reference images chỉ là visual evidence (bằng chứng hình ảnh), không tự định nghĩa business rule, permission hay data model.

#### Production Readiness
Ưu tiên:
1. production-readiness / operations gates;
2. dated deployment/runtime evidence;
3. provider/external approvals nếu cần;
4. code existence không được xem là production-ready.

---

## 4. Conflict resolution rules

Định nghĩa rõ agent phải làm gì khi nguồn mâu thuẫn.

Tối thiểu:

1. Xác định câu hỏi thuộc loại nào trước.
2. Chọn authority model tương ứng.
3. Nếu hai nguồn cùng cấp mâu thuẫn:
   - không tự đoán;
   - ghi rõ conflict;
   - chỉ ra file/source cụ thể;
   - đánh dấu `NEEDS REVIEW`.
4. Accepted decision không được bị OpenSpec change, page pack, task hoặc code mới ghi đè âm thầm.
5. Code có thể chứng minh `Implemented State`, nhưng không tự chứng minh:
   - Product approval;
   - legal compliance;
   - production readiness;
   - public marketing scope.
6. Task/history không phải source of truth mặc định.
7. Screenshot không phải source of truth cho business logic.
8. Nếu tài liệu nói feature đã implemented nhưng code không xác minh được:
   - trạng thái phải là `UNVERIFIED` hoặc `CONFLICT`;
   - không được tự kết luận implemented.

---

## 5. Scope and specificity rule

Giải thích nguyên tắc:

Trong cùng một cấp authority, nguồn **cụ thể và gần phạm vi câu hỏi hơn** thường được ưu tiên hơn nguồn tổng quát.

Ví dụ:

`docs/features/public-booking/README.md`

cụ thể hơn:

`docs/CURRENT_STATE.md`

cho câu hỏi về booking.

Nhưng quy tắc này KHÔNG được dùng để vượt qua một accepted decision có authority cao hơn.

---

## 6. OpenSpec position

Phải định nghĩa rõ trạng thái OpenSpec hiện tại:

- `openspec/specs/` hiện chưa phải Product Knowledge authority vì chưa có approved specs;
- `openspec/changes/` là proposed/in-progress change, không phải current truth;
- custom OpenSpec workflow chưa được tạo;
- khi sau này `openspec/specs/` trở thành normative (nguồn chuẩn), Authority Model phải ghi rõ vị trí của nó trong từng loại câu hỏi.

Đề xuất nguyên tắc tương lai:

- OpenSpec spec đã approved có authority cao cho **behavioral requirement** (yêu cầu hành vi cụ thể của hệ thống);
- nhưng không được âm thầm override accepted ADR/decision;
- archive/sync không tự động có nghĩa là production-ready.

---

## 7. Examples

Cho ít nhất 4 ví dụ từ repo hiện tại, ưu tiên các conflict đã có trong audit:

1. Public feedback ownership (`apps/web` vs `apps/feedback-web`)
2. Formalités development prototype vs planned wording
3. UI page-pack lifecycle drift
4. `packages/db` filesystem residue vs active tracked packages

Mỗi ví dụ phải cho thấy:
- câu hỏi thuộc loại nào;
- nguồn nào được dùng;
- kết luận;
- vì sao.

---

## 8. Agent decision procedure

Thêm checklist ngắn để agent dùng trước khi kết luận:

```md
1. What type of question is this?
2. What is the primary authority for that question type?
3. Is there a more specific source at the same authority level?
4. Does code/test verification matter for this conclusion?
5. Are there conflicting sources?
6. If conflict exists, stop and mark NEEDS REVIEW.
```

Có thể viết tiếng Việt, nhưng giữ tên trạng thái/kỹ thuật tiếng Anh nếu cần.

---

## 9. Status of this document

Cuối file ghi:

```md
Status: PROPOSED FOR REVIEW
```

Không được tự chuyển thành `APPROVED`.

---

# Quy tắc viết

- Ngắn gọn, dễ tra cứu.
- Không biến `AUTHORITY_MODEL.md` thành một tài liệu dài kể lại toàn bộ audit.
- Link tới nguồn thay vì copy nội dung dài.
- Không sửa các mâu thuẫn hiện có trong bước này.
- Không đổi trạng thái bất kỳ feature nào.
- Không thay đổi `PRODUCT_KNOWLEDGE.md` ở bước này.
- Không tạo glossary/status model ở bước này; đó là bước tiếp theo.

---

# Điều kiện hoàn thành

Task chỉ hoàn thành khi:

- [ ] Đã đọc các nguồn bắt buộc
- [ ] Đã tạo `docs/AUTHORITY_MODEL.md`
- [ ] Có ít nhất 5 question types
- [ ] Có authority matrix
- [ ] Có conflict resolution rules
- [ ] Có specificity rule
- [ ] Có vị trí hiện tại và tương lai của OpenSpec
- [ ] Có ít nhất 4 ví dụ thực tế từ repo
- [ ] Không sửa bất kỳ file nào khác
- [ ] File kết thúc với `Status: PROPOSED FOR REVIEW`

Sau khi tạo file, dừng lại và chờ review.
Không tự chuyển sang Lifecycle Status Model hoặc bước Knowledge Normalization tiếp theo.
