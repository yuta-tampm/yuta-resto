# YUTA — Step 6.2B1: CURRENT_STATE Slimming Plan

## Mục tiêu

Chuẩn bị **kế hoạch rút gọn `docs/CURRENT_STATE.md`** trước khi sửa file thật.

Đây là bước **plan-only** (chỉ lập kế hoạch), chưa được chỉnh nội dung `CURRENT_STATE.md`.

Mục tiêu cuối cùng của việc slimming là biến `CURRENT_STATE.md` thành một **cross-product current-state summary** (bản tóm tắt hiện trạng toàn hệ thống) ngắn, dễ đọc, chủ yếu dùng để:

- định hướng người đọc;
- tóm tắt trạng thái hiện tại ở mức cao;
- chỉ đường tới Product Knowledge Home / Module Registry / page pack / readiness source cụ thể;
- không lặp lại lịch sử phase/wave dài;
- không trở thành source-of-truth thay cho nguồn chuyên biệt.

Không archive/delete/move file ở bước này.
Không sửa code.
Không sửa OpenSpec.

## Nguồn bắt buộc phải đọc

1. `AGENTS.md`
2. `docs/DOCUMENTATION_CLEANUP_AUDIT.md`
3. `docs/AUTHORITY_MODEL.md`
4. `docs/LIFECYCLE_STATUS_MODEL.md`
5. `docs/MODULE_REGISTRY.md`
6. `docs/PRODUCT_KNOWLEDGE.md`
7. `docs/README.md`
8. `docs/CURRENT_STATE.md`

Sau đó đọc các Product Knowledge Homes đã APPROVED:
- `docs/features/personnel/README.md`
- `docs/features/today/README.md`
- `docs/features/establishment/README.md`
- `docs/features/identity-access/README.md`
- `docs/products/pos/site-agent/README.md`
- `docs/products/display/README.md`

Đọc thêm khi cần:
- public booking feature docs
- reputation feature docs
- POS product docs
- `docs/operations/PRODUCTION_READINESS.md`
- `docs/ui/pages/README.md`
- page-pack README cụ thể nếu một section trong CURRENT_STATE đang lặp lại UI delivery/history.

## Output duy nhất được phép tạo

Tạo:
`docs/CURRENT_STATE_SLIM_PLAN.md`

Không sửa bất kỳ file nào khác.

## Nguyên tắc bắt buộc

### 1. `CURRENT_STATE.md` vẫn được giữ

Không đề xuất archive/delete toàn file.

Vai trò sau slimming:
> Repository-wide current-state summary + routing layer.

Nó KHÔNG phải:
- Product Knowledge Home;
- architecture authority;
- lifecycle registry;
- UI delivery log;
- phase history;
- production-readiness register.

### 2. Không được làm mất unique information

Mỗi section/khối nội dung trong CURRENT_STATE hiện tại phải được phân loại.

Nếu nội dung bị bỏ khỏi CURRENT_STATE sau này, plan phải chỉ rõ:
- nội dung đó đã tồn tại ở source nào khác;
- hoặc sẽ được giữ ở đâu;
- hoặc là chronology có thể phục hồi bằng Git history;
- hoặc `NEEDS REVIEW` nếu chưa rõ.

Không được chỉ ghi “remove because old”.

### 3. Không dùng Product Knowledge Home để xóa bằng chứng lịch sử

Product Knowledge Home thay vai trò **entry point hiện hành**, không tự động thay thế:
- accepted decision;
- page-pack implementation evidence;
- QA evidence;
- production gates;
- historical delivery provenance.

### 4. Không đổi lifecycle trong bước này

Không tự thay:
- Product Decision;
- Implementation;
- Environment;
- Production Readiness;
- External Dependency.

Nếu CURRENT_STATE có status khác Module Registry:
- ghi `REPLACE WITH ROUTING TO MODULE_REGISTRY`
- hoặc `NEEDS REVIEW`
- không tự sửa status ở plan.

## Nội dung bắt buộc của `docs/CURRENT_STATE_SLIM_PLAN.md`

### 1. Goal and target role

Mô tả vai trò mong muốn của CURRENT_STATE sau slimming.

Nên hướng tới:
- ngắn;
- cross-product;
- current;
- routing-first;
- không lặp phase history.

Không đặt target số dòng cứng nếu không cần.

### 2. Current structure inventory

Liệt kê các heading cấp chính hiện tại.

Bảng:
| Current section | Approx size | Current role | Main issue |
|---|---:|---|---|

### 3. Section-by-section action map

Bảng:
| Current section / content block | Action | Keep in CURRENT_STATE? | Destination / canonical source | Reason | Confidence |
|---|---|---|---|---|---|

Allowed actions:
- `KEEP`
- `ROUTE`
- `CONDENSE`
- `HISTORICAL`
- `NEEDS REVIEW`

Không dùng `DELETE` trong plan này.

### 4. Product/runtime target outline

Đề xuất outline mới cho CURRENT_STATE sau slimming.

Phải dựa trên repo thực tế, không copy mù template.

### 5. Product Knowledge routing map

Bảng:
| Topic currently detailed in CURRENT_STATE | Future summary in CURRENT_STATE | Route to |
|---|---|---|

Tối thiểu:
- Personnel
- Today
- Establishment
- Identity / Access
- Site Agent
- Display
- Public Booking
- Reputation
- POS

### 6. UI chronology map

Tìm các phần:
- Phase
- Wave
- F03–F08
- implementation wave
- QA/approval chronology

Bảng:
| Chronology block | Unique information? | Existing page-pack/source | Proposed treatment |
|---|---|---|---|

Nếu chronology đã có trong page pack:
- đề xuất `HISTORICAL` khỏi CURRENT_STATE;
- route tới page-pack README.

Nếu có unique info:
- `NEEDS REVIEW`;
- không loại bỏ.

### 7. Production/readiness map

Tìm statements về:
- production-ready;
- blocked;
- provider;
- deployment;
- legal/privacy;
- hardware;
- external approvals.

Phân loại:
- giữ summary nếu cross-product;
- route chi tiết tới `PRODUCTION_READINESS.md`;
- không giữ status duplicated nếu Module Registry/Readiness đã là authority.

### 8. Planned / prototype surface map

Liệt kê các module currently:
- planned;
- placeholder;
- fixture prototype;
- development-only.

Đối chiếu với Module Registry.

Plan phải chỉ rõ cách CURRENT_STATE sau slimming nên mô tả chúng mà không:
- gọi prototype là implemented;
- gọi planned là Product Decision;
- duplicate lifecycle table.

### 9. Historical destination strategy for CURRENT_STATE-only chronology

Nếu có chronology unique mà không có source khác, đề xuất một trong:
- preserve selected milestone in slim summary;
- move later to `docs/archive/current-state-history/...`;
- rely on Git history ONLY if Documentation Cleanup archive policy later approves.

Không thực thi.

### 10. Risk list

Bảng:
| Risk | Affected section | Mitigation |
|---|---|---|

Tối thiểu xem xét:
- mất unique decision;
- mất implementation provenance;
- làm sai lifecycle;
- link tới home chưa approved;
- archive policy chưa chốt;
- production claim bị đơn giản hóa quá mức.

### 11. Proposed execution scope for Step 6.2B2

Liệt kê chính xác:

#### Files allowed to modify
Khuyến nghị chỉ:
- `docs/CURRENT_STATE.md`

Nếu plan thật sự cần update một index/link khác, ghi riêng và giải thích.

#### Files explicitly protected
- Product Knowledge Homes
- MODULE_REGISTRY
- AUTHORITY_MODEL
- LIFECYCLE_STATUS_MODEL
- page packs
- decisions
- architecture
- PRODUCTION_READINESS
- code
- OpenSpec

#### Expected validation
- docs check
- link check
- targeted format
- no lifecycle drift
- no unique-information loss

### 12. Readiness

Cuối file:

```md
## Readiness for CURRENT_STATE slimming

Status: READY | READY WITH REVIEW | NOT READY

### Safe sections to slim
- ...

### Sections requiring review
- ...

### Blocking questions
- ...
```

### 13. Document status

Cuối file:
`Status: PROPOSED FOR REVIEW`

Không tự approve.

## Validation

Sau khi tạo plan:

1. Confirm chỉ `docs/CURRENT_STATE_SLIM_PLAN.md` được tạo.
2. Confirm `CURRENT_STATE.md` chưa bị sửa.
3. Confirm mọi section bị đề xuất remove khỏi current summary có destination hoặc recovery strategy.
4. Confirm Product Knowledge Homes giữ canonical role.
5. Confirm lifecycle/status không bị thay đổi.
6. Confirm page-pack history không bị xóa trong plan một cách mù quáng.
7. Run targeted Markdown formatting nếu phù hợp.

Report:
- plan file created;
- major sections to KEEP/ROUTE/CONDENSE/HISTORICAL;
- unique-information risks;
- safe execution scope;
- blocking questions.

Không bắt đầu Step 6.2B2.
Dừng và chờ review.
