## Why

Pointage đã có authority/access foundation canonical nhưng chưa có luồng nhân
viên chấm công sử dụng được hoặc raw attendance evidence. P1–P14 được current
user phê duyệt cho phép định hình vertical slice đầu tiên, chỉ dùng dữ liệu
synthetic/disposable và không mở lại foundation đã archive.

## What Changes

- Thêm employee surface `/pointage/[establishmentSlug]` trong existing
  Backoffice cloud; public locator không phải tenant authority.
- Consume dedicated credential và Pointage-specific continuation ngắn hạn,
  self-only, shared-device safe. Mọi employee identify/state read/operation
  vẫn chịu Personnel eligibility và exact authority; credential proof alone
  không tạo employee authority.
- Chỉ `CLOCK_IN`/`CLOCK_OUT`: không có phiên mở + IN thì accept/open; có
  phiên mở + OUT thì accept/close; hai tổ hợp còn lại conflict, không event.
- Stable request identifier; cùng identifier/intent replay committed receipt
  chỉ sau current authorization/lifecycle checks, khác intent conflict.
  Competing requests cho một transition có tối đa một acceptance; timeout retry
  dùng lại identifier.
- Ghi immutable canonical raw events; derive session/current state. Cho phép
  nhiều phiên tuần tự, tối đa một phiên mở; không overlap, quota hoặc auto-close.
  Receipt/continuation metadata không trở thành attendance source of truth.
- Dùng server-observed instant, giữ đủ timezone/calendar context; không browser
  time/backdating/Planning rounding. Session qua midnight vẫn là một phiên,
  grouping ban đầu theo CLOCK_IN business date. OUT sau departure bị deny,
  giữ phiên mở cho future correction; không tự tạo close.
- Employee chỉ thấy own display name, `NOT_CLOCKED_IN`/`CLOCKED_IN`,
  open-session start date/time và immediate committed receipt. Xóa
  employee-specific state khi kết thúc interaction; không durable browser
  storage cho plaintext credential, trusted employee context hoặc identity.
- Thêm minimal manager server read dưới `pointage.establishment.read` cho
  scoped current-day raw events và current open session; OWNER/MANAGER theo
  exact grants, STAFF không được mở rộng quyền; không manager UI.
- Chỉ synthetic/disposable development, integration tests và Browser QA.
  Injected synthetic test provider không phải production provider; missing hoặc
  untrusted provenance vẫn fail closed.

### Explicit non-scope

Không manager/credential-management UI, monthly dashboard, employee attendance
history, today session history/totals hoặc prior clock-out display. Không
break/pause/meal/manual-adjustment events, correction, auto-close hay weekly
acknowledgement.

Không Planning reconciliation/rounding, +/-15-minute anomalies, Today
integration, weekly/monthly/payroll allocation, HS/HC, absences, jours fériés,
avantages en nature, payroll/TESE, closure hoặc PDF/export.

Không canonical/materialized session table; credential crypto/grant redesign;
standalone revoke/suspend; global employee identity; Personnel write-back;
browser-supplied tenant authority; app/deployment topology mới; POS, Site Agent,
db-pos, offline acceptance/replay queue/sync; production client-address provider;
real employee attendance ở bất kỳ environment nào; production enablement.

## Capabilities

### New Capabilities

- `pointage/raw-clocking`: employee raw-clock flow, transitions, immutable
  events, derived current/session state, time/grouping, idempotency/concurrency,
  minimal manager server read và synthetic-only boundary theo P1–P14.

### Modified Capabilities

- `authorization/pointage`: bổ sung bounded continuation/consumer authorization
  requirements cho usable slice; giữ credential crypto/grants, self-only scope,
  non-enumeration, current eligibility và reset-invalidates-old-authority
  invariants. Không thay foundation thành generic employee/cloud session.

`pointage/authority-foundation` và Personnel là unchanged dependencies, không
phải delta targets. Archived foundation không bị rewrite.

## Impact

- Classification: `CROSS_MODULE`; owning capability: Pointage.
- Runtime/data: existing `apps/backoffice` và `@yuta/db-cloud`; Personnel giữ
  dossier/lifecycle, Pointage giữ actual-work evidence, Planning giữ planned work
  và không được consume.
- Affected areas dự kiến: Backoffice employee route/transport/server foundation,
  scoped Personnel read projection, cloud persistence/repository, transport
  contracts và tests; portable auth primitives chỉ khi Sensitive Design yêu cầu
  cho continuation, không redesign credential.
- `Sensitive change: YES`; `UI_AFFECTING: YES`;
  `BROWSER_QA_REQUIRED: YES`. Exact continuation, timeout/storage/rotation,
  transaction, schema/migration, time precision và security mechanisms chờ
  Sensitive Design; Proposal/Analysis không lựa chọn chúng.
- Production vẫn blocked bởi retention, deletion/anonymization, legal hold,
  backup-retention interaction, employee notice, detailed audit visibility và
  trusted production client-address provenance.
- Lượt này chỉ tạo Proposal, Analysis, Gate 1 packet và CLI-required metadata;
  không Specs, Design, Tasks, implementation, lifecycle promotion, sync,
  archive hoặc deploy.
