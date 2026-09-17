## Why

Global Prettier validation hiện bao gồm các artifact mà authority repository không cho phép direct-format; inherited baseline 67 file đang chặn D18/task 6.1 của `ui-ux-pro-max-integration`. Cần một contract formatting-policy tường minh, đồng bộ validation scope với artifact authority và giữ integrity fail-closed, không phải chỉ làm command xanh.

## What Changes

- Định nghĩa artifact classes, mutable-format scope và admission/ownership rules.
- Định nghĩa alternate validation bắt buộc cho generated, historical/hash-bound và archive-preserved artifacts; không silent exclusion.
- Yêu cầu classification đầy đủ; unknown, overlapping, missing hoặc stale evidence không được silently bypass validation.
- Xác lập generated validation policy, historical preservation và correction/revision rules sau quyết định Gate 1.
- Giữ active-owner coordination và normative diff/equivalence review độc lập với formatter success.
- Thiết lập bounded migration cho đúng 67-file baseline; drift không tự trở thành baseline mới.
- Parent chỉ được return khi approved validation contract thực sự PASS và có authorization tiếp tục riêng.

## Capabilities

### New Capabilities

- `repository/artifact-format-validation`: observable repository-tooling contract cho classification coverage, mutable formatting và enforced alternate validation. Đây là thay đổi hành vi validator/CI, không phải spec giả cho whitespace-only cleanup.

### Modified Capabilities

Không thay đổi requirement của capability hiện hữu. Normative Restaurant Knowledge files chỉ là future formatting candidates, không thay behavioral meaning.

## Impact

Classification: `CROSS_MODULE / REPOSITORY_TOOLING / WORKFLOW_INTEGRITY_SENSITIVE`.

Affected authority domains: repository tooling; Prettier orchestration; generated OpenSpec skills; archive; review evidence; schema/templates; main specs; active changes; current Product Knowledge; CI (`.github/workflows/ci.yml` gọi `pnpm format:check`). Concrete placement/representation và command wiring để lại Design.

Owner: YUTA repository/tooling engineering cùng Workflow/Knowledge custodians và affected artifact owners. `SENSITIVE_DESIGN_REQUIRED: YES` vì validation coverage/integrity enforcement thay đổi.

## Non-goals

Không đổi Product/runtime/auth/database/UI behavior; không blanket ignore, arbitrary failure hiding, historical approval rewriting, manual generated formatting, parent task progression hoặc production/deployment. Lượt này chỉ tạo Proposal, Analysis và Gate 1 review evidence; không Specs, Design, Tasks/TIC hay Apply.

Parent giữ 19/23; 5.4 COMPLETE; 6.1 FAIL/UNCHECKED; 6.2–6.4 BLOCKED; receipt VERIFIED; Production NOT_AUTHORIZED.
