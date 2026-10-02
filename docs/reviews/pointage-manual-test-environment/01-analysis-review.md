Change: pointage-manual-test-environment
Gate: GATE 1 — PRODUCT / AUTHORITY REVIEW
Review status: APPROVED
Created: 2026-09-27T15:02:11Z
Schema: yuta-spec-driven
Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE
Sensitive change: YES — local disposable database, synthetic credentials, runtime admission and cleanup require a reviewed Design
Approval source: explicit current-user instruction — “duyệt gate 1”
Approval recorded by: Codex workflow
Approved: 2026-09-27T15:06:45Z

# Bounded review

User request: enable manual Microsoft Edge testing of the existing Pointage employee route on the user's dev machine, using only synthetic employees and a disposable database. The previous manual-test Discovery/Shaping request supplies the one-command, two-employee, READY/output and cleanup acceptance boundary; the current user explicitly confirmed proceeding with synthetic testing. This is not authority to run real employee attendance or modify `pointage-usable-raw-clocking`.

The change is `CROSS_MODULE` at the development tooling layer. Proposal and Analysis declare no new/modified capability Spec. The change metadata explicitly sets `skip_specs: true`; current OpenSpec status reports `specs: skipped`, `design: ready`. No Design, Tasks, implementation, container or database operation has been created or executed in this Gate 1 run.

## REQUIREMENT_BASELINE

| Part                             | Exact bounded meaning                                                                                                                                                                                                                                            | Source                                                                                                     |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `AUTHORITATIVE_USER_REQUIREMENT` | One repository-supported command starts an existing Pointage-capable Backoffice runtime with at least two synthetic dossiers/PINs, reaches context-driven READY, prints URL/names/PINs/initial states/generation, stays alive for manual Edge interaction.       | User's Pointage manual-test Discovery/Shaping request and current explicit confirmation; Proposal baseline |
| `HARD_CONSTRAINTS`               | Disposable loopback PostgreSQL; canonical migrations then existing test-only 0021; synthetic org/establishment/dossiers/credentials; existing injected synthetic address provider; no real attendance; guarded startup and owned-resource cleanup.               | Same user request; current Pointage Product Knowledge, Local Development and implementation guards         |
| `OUT_OF_SCOPE`                   | No modification to completed Pointage change, Product behavior, Specs, contracts, authorization, schema, canonical migration, UI, production provider or readiness; no real personnel data, shared dev database, POS/offline/sync or automated Edge requirement. | Same user request and approved Pointage authority                                                          |
| `SUCCESS_OUTCOMES`               | READY is backed by actual runtime/context evidence; operator can manually test two isolated synthetic employees; Ctrl+C/normal termination and setup failures remove owned child/client/container/ports without secret leakage.                                  | Same user request; existing Browser QA harness provides implementation evidence, not new Product authority |

## Exact reviewed artifact hashes

Hash method: `Get-FileHash -Algorithm SHA256 <path>` over exact file bytes; lowercase hexadecimal recorded below. Paths are repository-relative and sorted.

| Path                                                               | SHA-256                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `openspec/changes/pointage-manual-test-environment/.openspec.yaml` | `ad5d1392b83e1fb364af846ecfc007e0da466a5405703f35acbeaac52dbc3eed` |
| `openspec/changes/pointage-manual-test-environment/analysis.md`    | `82d409d08297a1679c1f6de263b28f46e73cac831905801d9ab46ab9ef748560` |
| `openspec/changes/pointage-manual-test-environment/proposal.md`    | `bfb4624f359a666bba24d06388072344e0a3e20cb6eb09ff1b8c7a8b8beaab3e` |

OpenSpec status command: `pnpm exec openspec status --change "pointage-manual-test-environment" --json`; result: schema `yuta-spec-driven`, Proposal/Analysis done, Specs skipped, Design ready, Tasks blocked. Strict validation command: `pnpm exec openspec validate "pointage-manual-test-environment" --strict`; result: `Change 'pointage-manual-test-environment' is valid` (exit 0).

Provenance: `HEAD 0dad7546745d4072eae8337f45cbc263d19ed66c`. Fresh Git status contained unrelated dirty/untracked `product-version-management-foundation` work and `docs/MODULE_REGISTRY.md`; none was edited for this packet.

## Authorities consulted and findings

- Product/behavior: `docs/PRODUCT_KNOWLEDGE.md`, normative `openspec/specs/pointage/raw-clocking/spec.md` and `openspec/specs/authorization/pointage/spec.md`, `docs/features/personnel/README.md`.
- Ownership/security/operation: `docs/AUTHORITY_MODEL.md`, `docs/architecture/AUTHENTICATION.md`, accepted `docs/decisions/ADR-003-database-ownership-boundaries.md`, `docs/operations/LOCAL_DEVELOPMENT.md`, root and nested AGENTS instructions.
- Lifecycle/UI: `docs/MODULE_REGISTRY.md`, `docs/LIFECYCLE_STATUS_MODEL.md`, `docs/ui/pages/backoffice-pointage-employee/README.md`, `docs/ui/EXTERNAL_DESIGN_INTELLIGENCE.md`.
- Implementation evidence only: guarded DB helper, existing launcher and Next child, Browser QA harness, Backoffice/root package scripts.

`CONFLICT`: none identified within the bounded synthetic/disposable scope. Product/authority question to decide at Gate 1: approve a tooling-only, no-delta-Spec path with the exact baseline and preserve existing production/real-data prohibitions. Design questions about secret output, resource ownership, startup admission, busy port and normal-signal cleanup remain for the later Sensitive Design Gate; they do not authorize a new guard/provider or a real-data exception.

UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE — no UI design or presentation change; manual observation uses the already approved employee page. `UI_AFFECTING: NO`. This Gate 1 does not pre-evaluate later manual product validation, VERIFY or QA.

Recommendation: approve Gate 1 only for `skip_specs: true` and progression to Sensitive Design. No Apply authorization is requested. Production enablement and real attendance remain `NOT_AUTHORIZED`.

## Exact proposal.md content

```text
## Why

Giao diện nhân viên Pointage đã có trong Backoffice, nhưng lệnh dev thông thường không tạo được môi trường Pointage an toàn để chủ sản phẩm tự thử trên máy cá nhân. Harness Browser QA hiện có chứng minh luồng với dữ liệu giả dùng một lần, song chưa cung cấp một lệnh vận hành thủ công có thông tin đăng nhập và dọn dẹp đầy đủ.

## REQUIREMENT_BASELINE

- **AUTHORITATIVE_USER_REQUIREMENT:** Yêu cầu Discovery/Shaping Pointage manual-test trong cuộc trao đổi này, được xác nhận bằng yêu cầu hiện tại “làm cho tôi kiểm thử”, là một lệnh repository để người vận hành tự mở Microsoft Edge trên máy dev và thử route nhân viên Pointage với ít nhất hai hồ sơ giả, PIN giả, trạng thái ban đầu và generation ID được hiển thị sau khi runtime thực sự READY.
- **HARD_CONSTRAINTS:** Chỉ dùng PostgreSQL tạm/disposable, migration canonical rồi extension Pointage test-only hiện có, tổ chức/cơ sở/dossier giả, provider địa chỉ client giả được tiêm từ harness hiện có, Backoffice runtime và route hiện có. Giữ các guard dev/test, loopback, database identity, bí mật và authority hiện hành; Ctrl+C/termination phải dừng child, đóng client, xóa đúng container và nhả cổng. Không dùng dữ liệu nhân viên thật trong dev, staging hoặc production.
- **OUT_OF_SCOPE:** Không mở lại `pointage-usable-raw-clocking`; không đổi Product behavior, Specs, quyền, contracts, schema, migration canonical, UI Pointage, provider production hay deployment/readiness. Không bắt buộc Playwright hoặc tự động điều khiển Edge. Không dùng hồ sơ nhân viên trong database dev thông thường.
- **SUCCESS_OUTCOMES:** Một lệnh được repository hỗ trợ khởi tạo môi trường tạm, xác nhận context-driven READY, in URL, tên/PIN 8 chữ số và trạng thái ban đầu của hai nhân viên giả cùng generation ID; người vận hành có thể tự kiểm thử trên Edge; dừng hoặc lỗi khởi động đều được dọn dẹp xác định, không để runtime/container/cổng sở hữu còn hoạt động.

## What Changes

- Thêm entrypoint dev/test cho việc chạy thử thủ công, tái sử dụng fixture, migration helper và runtime child Pointage hiện có.
- Bổ sung fixture nhân viên giả thứ hai, kiểm tra readiness, thông tin bàn giao tối thiểu cho người vận hành và cleanup có kiểm chứng.
- Ghi hướng dẫn vận hành và checklist thử thủ công ngắn trong tài liệu phát triển hiện có; thêm kiểm thử cho guard, readiness và cleanup của entrypoint.

## Capabilities

### New Capabilities

Không có. Đây là công cụ phát triển/kiểm thử cho capability Pointage đã được phê duyệt; không tạo hành vi Product mới.

### Modified Capabilities

Không có. Các requirement trong `pointage/raw-clocking` và `authorization/pointage` không đổi. Change sử dụng `skip_specs: true`; không tạo delta Spec giả để hợp thức hóa tooling.

## Impact

- Phân loại tác động: `CROSS_MODULE` cho tooling dev/test, vì một lệnh điều phối `apps/backoffice`, fixture `@yuta/db-cloud`, dossier Personnel giả, credential Pointage và tenant scope.
- Dự kiến chỉ chạm entrypoint/helper/test, script package và hướng dẫn phát triển; không chạm mã Product/runtime production hoặc main Specs.
- `UI_AFFECTING: NO`: không sửa giao diện hiện có. Người vận hành vẫn cần quan sát thủ công route thật; việc này không tự động biến thay đổi tooling thành UI redesign.
- Sensitive Design cần xem xét ranh giới credential, database tạm, runtime admission, cleanup và việc có tiến trình khác đang giữ cổng 3001 trước khi Apply.
- Production enablement và ghi giờ nhân viên thật tiếp tục `NOT_AUTHORIZED`; các blocker legal/privacy và provenance production hiện có không được xóa.
```

## Exact analysis.md content

```text
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
```

## Required human decision

Gate 1 may approve the exact Proposal/Analysis and no-spec tooling classification, request bounded changes, or reject the change. Approval, if granted, permits Sensitive Design only; it does not authorize Tasks, Apply, database/container execution, manual Edge testing, real attendance, or production enablement.
