## Why

YUTA chưa có authority durable cho Pointage dù route đã tồn tại dưới dạng
placeholder: Personnel đang sở hữu employee dossier/lifecycle, nhưng chưa có
boundary được duyệt cho actual-work evidence, employee Pointage credential hoặc
Pointage authorization. Control Tower đã duyệt P1-P7 để tạo prerequisite
`CROSS_MODULE` tối thiểu trước khi xem xét usable clock-in / clock-out.

## What Changes

- Thiết lập Pointage là owner của immutable raw actual-work evidence; work
  sessions và time totals chỉ là Pointage-derived values, không biến Planning
  thành owner của actual worked time và không cho future correction ghi đè phá
  hủy raw evidence.
- Thiết lập reference boundary tới Personnel dossier theo trusted
  `organization + establishment + employee dossier`, cùng eligibility theo
  employment period: upcoming chưa được tạo event trước entry date, active và
  valid final employment day được phép, former không được tạo event mới.
- Thiết lập V1 là `CLOUD / ONLINE ONLY`, với trusted establishment resolution;
  loại trừ POS, Site Agent, local persistence, offline mode và local/cloud
  attendance synchronization.
- Giới thiệu dedicated Pointage employee credential, tách khỏi POS PIN và YUTA
  cloud-user authentication, scoped theo establishment, không durable plaintext,
  có issuance/reset/regeneration và vô hiệu hóa credential cũ sau reset.
- Giới thiệu independent Pointage authorization semantics: employee credential
  chỉ được self-identify, đọc current Pointage state cần cho clocking và tạo
  Pointage operation của chính employee; OWNER/MANAGER có establishment
  visibility qua dedicated Pointage grant; STAFF không có establishment-wide
  visibility chỉ nhờ role.
- Phân loại Pointage records là personnel-related operational/legal data, giữ
  authorization/audit hooks và production fail-closed trong khi exact retention,
  deletion, legal hold, notice wording và detailed audit visibility chưa được
  legal/privacy review.
- Yêu cầu Design sau Specs giải quyết establishment-entry mechanism, credential
  format/entropy/hash/storage/collision, throttling/brute-force protection,
  reset/recovery, one-time plaintext display, non-enumerating lookup, audit
  taxonomy, migration/rollback và failure behavior.

Không có breaking change đối với capability đã triển khai vì Pointage hiện chưa
có implementation hoặc consumer runtime.

## Capabilities

### New Capabilities

- `pointage/authority-foundation`: canonical ownership của actual-work evidence,
  Personnel dossier/lifecycle reference, trusted tenancy, cloud/online runtime,
  immutable raw-evidence và derived-value boundaries, cùng privacy/readiness
  classification tối thiểu trước usable raw clocking.
- `authorization/pointage`: dedicated employee Pointage credential và independent
  employee/manager authorization semantics, self-only employee scope,
  OWNER/MANAGER establishment visibility, STAFF denial và fail-closed trusted
  establishment isolation.

### Modified Capabilities

Không có. Change không sửa requirement của Personnel,
`authorization/formalites`, `authorization/restaurant-knowledge`, Planning hoặc
Today; các capability đó chỉ là source/boundary/consumer context được giữ nguyên.

## Impact

- Classification: `CROSS_MODULE`; owning capability là Pointage, với Personnel
  là canonical employee/lifecycle source và Shared Authorization/Tenancy là
  supporting boundaries.
- Runtime/data boundary: cloud/online only; nếu Apply sau các gate cần durable
  Pointage state thì chỉ `packages/db-cloud` qua server-owned cloud runtime có
  thể sở hữu persistence. Browser không được nhận database authority hoặc tự
  khai trusted organization/establishment.
- Khu vực có thể bị ảnh hưởng sau approved Specs và Sensitive Design:
  `apps/backoffice` server authorization/runtime composition,
  `packages/db-cloud`, `packages/contracts` khi transport boundary thực sự cần,
  focused tests và current Product Knowledge/lifecycle routing. Exact files và
  technical shape chưa được quyết định ở Proposal.
- Sensitive change: `YES` — credential/security, authorization, tenancy,
  Personnel-related data, possible migration và cross-module durable boundary.
  Sensitive Design Gate bắt buộc trước Tasks/Apply.
- Production/readiness không được bật hoặc promote; `PRIV-04`, `HR-LEGAL-01`,
  `HR-RET-01`, `HR-AUDIT-01` và các gate áp dụng vẫn giữ nguyên.

### Explicit non-scope

- Final employee clock-in / clock-out UI hoặc usable raw-clocking workflow.
- Raw clock-event capture implementation, trừ khi một minimal supporting element
  được approved Specs/Design chứng minh là không thể tránh để foundation coherent.
- Planning reconciliation, anomaly detection, correction workflow,
  acknowledgement, weekly/monthly Pointage UI, HS/HC, absences, jours fériés,
  avantages en nature, payroll/TESE, monthly closure hoặc PDF export.
- POS, Site Agent, local database, offline behavior hoặc synchronization.
- Global employee identity, cross-establishment dossier merge/transfer, thay đổi
  Personnel data/permission semantics hoặc Today integration.
- Exact legal retention duration, deletion/legal-hold execution, backup-retention
  policy, employee notice copy hoặc production deployment.

### Stop conditions

Trả về Control Tower nếu cần cross-runtime/local behavior, global employee
identity, browser-supplied tenant authority, reuse POS PIN, alias Personnel
permission, grant ngoài P1-P7, destructive raw-evidence mutation hoặc Product /
Legal / Security decision không được P1-P7 hay approved gate sau đó bao phủ.

### Workflow boundary

Lượt này chỉ tạo Proposal, Analysis và Gate 1; dừng chờ human review trước
Specs. Không tạo Design, Tasks, implementation, sync/archive hoặc lifecycle /
readiness promotion.
