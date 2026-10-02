# Change Analysis

## Scope and Change Type

Change này chỉ bổ sung tooling để chủ sản phẩm/developer tự thử route nhân viên Pointage trên cùng máy dev, bằng dữ liệu giả và PostgreSQL disposable. Đây là tác động `CROSS_MODULE` ở lớp test/orchestration, không đổi hành vi capability, UI, hợp đồng transport, quyền hoặc dữ liệu production. `UI_AFFECTING: NO`; thao tác thử thủ công trên giao diện hiện có vẫn là kết quả phải quan sát. Việc cấp PIN giả, dựng DB và điều phối child runtime khiến Design nhạy cảm cần duyệt riêng trước Apply.

## Sources Consulted

- Yêu cầu Discovery/Shaping manual-test trong cuộc trao đổi này và xác nhận hiện tại dùng nhân viên giả trên máy dev; [Proposal](proposal.md) ghi bốn phần `REQUIREMENT_BASELINE`.
- [Authority Model](../../../docs/AUTHORITY_MODEL.md), [Product Knowledge Pointage](../../../docs/PRODUCT_KNOWLEDGE.md), [Module Registry](../../../docs/MODULE_REGISTRY.md), [Lifecycle Status Model](../../../docs/LIFECYCLE_STATUS_MODEL.md), [Local Development](../../../docs/operations/LOCAL_DEVELOPMENT.md), [Authentication](../../../docs/architecture/AUTHENTICATION.md), [Personnel Product Knowledge](../../../docs/features/personnel/README.md), [ADR-003](../../../docs/decisions/ADR-003-database-ownership-boundaries.md).
- [Pointage raw-clocking Spec](../../specs/pointage/raw-clocking/spec.md), [Pointage authorization Spec](../../specs/authorization/pointage/spec.md), [Pointage page pack](../../../docs/ui/pages/backoffice-pointage-employee/README.md) và [External Design Intelligence](../../../docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md).
- [Disposable DB helper](../../../packages/db-cloud/test/helpers/pointage-raw-clocking-test-database.ts), [launcher hiện có](../../../apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts), [Next child](../../../apps/backoffice/test/helpers/pointage-raw-clocking-next-child.ts), [Browser QA harness](../../../docs/reviews/pointage-usable-raw-clocking/qa/full-browser-qa.mts), [Backoffice package scripts](../../../apps/backoffice/package.json), [root scripts](../../../package.json).

## Authority and Product Decision

Yêu cầu hiện tại cho phép chuẩn bị cách thử **synthetic/disposable trên máy dev**; không phải quyết định cho phép ghi giờ bằng dossier đã có trong DB dev thường hoặc dữ liệu nhân viên thật. Product Knowledge và Specs hiện hành chỉ phê duyệt Pointage employee flow đã triển khai trong giới hạn đó. Change này không mở lại `pointage-usable-raw-clocking` hoặc cấp Production Readiness. Không có quyết định Product mới về raw events, lifecycle Personnel hay quyền cần thiết cho tooling này.

## Current Implemented State

- Code hiện có tạo một PostgreSQL local tmpfs, chạy canonical migration rồi extension Pointage test-only `0021`, tạo một tổ chức/cơ sở/dossier giả và PIN 8 chữ số; Next child kiểm tra admission và phát trạng thái `READY`. Browser QA harness còn tạo dossier/PIN giả thứ hai và đợi context `200` cùng `READY` trước khi thử route thật.
- Nhánh `--serve` hiện có chỉ phục vụ một fixture, không in gói bàn giao URL/tên/PIN sau readiness và không tự xóa container trên mọi đường dừng/lỗi. Chưa có script `pointage:manual:test` hay change active trùng tên. Lệnh `dev:backoffice` khởi chạy Backoffice thông thường, không chứng minh Pointage synthetic runtime đã được admit.
- Browser QA cũ là bằng chứng kiểm thử repository, không phải bằng chứng rằng môi trường thử thủ công đang chạy hay một deployment đã được bật. Cổng 3001 có thể đã được tiến trình dev khác dùng; entrypoint mới không được chiếm hoặc dừng tiến trình không do nó sở hữu.

## Affected Boundaries

- Runtime owner: `apps/backoffice` cloud; route nhân viên hiện có vẫn nằm ở đây. Không thêm app, runtime production hoặc Site Agent/POS.
- Data owner: `@yuta/db-cloud` chỉ trong fixture DB dùng một lần; Personnel sở hữu dossier/lifecycle, Pointage sở hữu credential và raw evidence. Không chạm canonical migration hoặc database dev dùng chung.
- Security/tenancy: giữ đúng scope tổ chức+cơ sở+dossier, credential giả, provider địa chỉ client giả được inject sau admission; không cho browser cung cấp trusted scope và không thêm provider production.
- External dependency local: Docker/PostgreSQL disposable và trình duyệt Edge do người dùng tự mở. Playwright không phải phụ thuộc của lệnh vận hành thủ công. Không có external provider mới.

## Lifecycle Baseline

Theo Module Registry, Pointage foundation và usable raw clocking đều có `Product Decision: APPROVED`, `Implementation: IMPLEMENTED`, `Environment: NOT_ENABLED`, `Production Readiness: BLOCKED`, `External Dependency: BLOCKED`. Change tooling này không sửa các giá trị đó. Kiểm thử local synthetic cũng không chứng minh enablement hoặc tính sẵn sàng của dữ liệu nhân viên thật.

## Requirement Readiness

`NO_SPEC_BEHAVIOR_CHANGE`. Người dùng yêu cầu một entrypoint thử thủ công cho hành vi Pointage đã có; không yêu cầu thay đổi requirement hoặc scenario của `pointage/raw-clocking` hay `authorization/pointage`. Metadata change đã đặt `skip_specs: true`; không tạo delta Spec. Quan sát được cần đạt là lệnh chạy thành công với dữ liệu giả, bàn giao sau readiness và cleanup, thuộc kiểm chứng tooling/operation chứ không phải nguồn hành vi attendance mới.

## UI / UX Applicability

`UI_AFFECTING: NO`; page pack và mã giao diện không đổi. Người vận hành sẽ tự mở route hiện có trong Edge và kiểm tra neutral, PIN sai, hai nhân viên, vào/ra, Terminer, reload/navigation/tab và responsive. `UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE` — change không hỏi ý kiến thiết kế/thay đổi UI; nguồn quyết định là phạm vi user request và page pack Pointage hiện hành. Không gọi external advisory tool.

## Conflicts and Unknowns

- `CONFLICT`: không thấy xung đột với Product/Specs hiện hành khi giới hạn ở synthetic/disposable.
- `NEEDS REVIEW` ở Design nhạy cảm: profile môi trường và secret-output tối thiểu; việc tái sử dụng fixture hai nhân viên không nhân đôi authority; admission/readiness chính xác; cleanup idempotent trên normal signal/lỗi từng giai đoạn; xử lý cổng 3001 đã bị chiếm mà không tác động tiến trình khác; xác minh không còn container/port owned. Forced kill hoặc mất điện không thể được trình bày như cleanup đồng bộ đã chứng minh.
- Không có unknown nào đòi quyết định Product hoặc Spec mới trước Gate 1. Nếu Design cần thay đổi guard, schema, quyền, provider production, dữ liệu thật hoặc runtime topology, phải dừng và xin quyết định mới.

## Analysis Conclusion

`NO_SPEC_BEHAVIOR_CHANGE`. Đề nghị duyệt phạm vi tooling dev/test và `skip_specs: true`; sau Gate 1 mới có thể lập Sensitive Design cho ranh giới dữ liệu/credential/runtime, không tiến thẳng vào Apply. Production enablement và real employee attendance vẫn `NOT_AUTHORIZED`.
