# Analysis Review Packet

Change: `async-interaction-feedback-foundation`
Gate: Gate 1 — Proposal + Analysis
Review status: `APPROVED`
Created: `2026-09-06T17:23:30.9468320+02:00`
Approved: `2026-09-06T17:36:09.6754664+02:00` by current-user Specs Phase instruction; exact Proposal and Analysis hashes revalidated before Specs.
Schema: `yuta-spec-driven`
Analysis conclusion: `READY_FOR_SPECS`
Sensitive change: `NO`

Proposal status: `done`
Analysis status: `done`
Specs status: `ready` but not created
Design status: `blocked`
Tasks status: `blocked`
Apply status: `NOT_AUTHORIZED`

## Request and Bounded-Change Summary

Define a cross-module behavioral foundation for honest async interaction feedback, then use Strategy B for a small Backoffice adoption allowlist after later gates. This Gate 1 authorizes no Specs, Design, Tasks, Apply, production code, shared UI edit, runtime repair, sync or archive.

In scope for later Specs: pending and disabled semantics, accessible busy state, action-specific pending labels, field versus operation errors, recoverable value preservation, authoritative-success presentation, UI duplicate prevention boundaries, and a bounded Backoffice pilot allowlist.

Out of scope: universal async components/state machines, toast architecture, global spinners, route-skeleton expansion, background refresh/polling, optimistic frameworks, server idempotency, API/action contracts, authorization, tenancy, data, persistence, transactions, runtime completion fixes, POS/Display/Booking/Feedback adoption, sync and archive.

## Authorities Consulted

- Root, Backoffice and shared UI `AGENTS.md` files.
- `docs/README.md`, `docs/CURRENT_STATE.md`, `docs/AUTHORITY_MODEL.md`, `docs/MODULE_REGISTRY.md`, `docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`.
- OpenSpec activation and normativity policy reviews, `openspec/config.yaml`, and schema `yuta-spec-driven`.
- Frontend and Backoffice UI rules, page-pack protocol, architecture overview, current page-pack interaction specifications and relevant normative capability specs.
- Current `packages/ui` and Backoffice implementation/test-command evidence.

## Conflicts and Needs Review

- No authority conflict blocks behavioral Specs.
- Before Design/Tasks, reviewers must resolve whether a package-local shared-UI contract test command will be introduced or verification will be explicitly limited to consumer contract tests. No current command independently proves the `packages/ui` Button contract.
- The reported stuck-pending route is not identified by repository evidence and is excluded. Any need to change runtime completion, redirect/revalidation, router refresh, transition architecture, action return shape, business outcomes, authorization, tenant scope, validation, idempotency, conflict/retry identity, transactions or persistence requires `STOP — CONTROL_TOWER_REVIEW_REQUIRED`.

## Recommendation

`APPROVE_GATE_1`

Approval means only: authorize creation of the next Specs artifact from the exact Proposal and Analysis below. It does not authorize Design, Tasks, Apply, production changes, sync or archive.

## Exact Proposal

````markdown
## Why

Các tương tác mutation do người dùng khởi tạo trong các frontend YUTA hiện có nhiều pattern hợp lệ nhưng chưa có một behavioral contract dùng chung cho pending feedback, ngăn kích hoạt lặp ngoài ý muốn, error recovery, confirmed success và accessibility. Cần định nghĩa foundation hẹp trước khi mở rộng adoption để tái sử dụng các primitive và framework-native pattern hiện có mà không đồng nhất hóa các business state machine riêng của từng route.

## What Changes

- Định nghĩa behavioral foundation dùng chung cho standard form mutation, navigation/redirect mutation, refresh/retry action, custom business state machine và direct API/manual pending state.
- Yêu cầu pending feedback phải xuất hiện trung thực, giữ rõ nghĩa hành động và ngăn accidental duplicate activation trong khi cùng mutation đang pending.
- Phân biệt field validation với operation/server failure; giữ user-entered values khi recoverable failure và current architecture cho phép; chỉ cung cấp retry khi route thực sự hỗ trợ.
- Chỉ trình bày success sau authoritative success; cho phép visible updated result, redirect hoặc route state rõ ràng thay thế explicit success message khi chính kết quả đã xác nhận completion.
- Định nghĩa accessibility contract cho disabled, busy, accessible action name, error association, focus recovery và live-region restraint.
- Làm rõ vai trò của `Button loading` và composition với `Alert`, `ErrorState`, `Skeleton`, `LoadingOverlay` cùng các route-owned component; bảo vệ behavior dùng chung bằng test phù hợp sau các gate.
- Dùng Strategy B: foundation dùng chung trước, sau đó adoption có allowlist trong Backoffice; POS, Display, Booking và Feedback cần các adoption review riêng.

### Explicit non-goals

- Không tạo universal `ActionButton`, generic async state machine, state-management library, toast architecture, global request spinner hoặc cơ chế intercept mọi `fetch`.
- Không chuẩn hóa route skeleton, mở rộng hàng loạt `loading.tsx`, background refresh, stale/revalidation UX, polling, long-running processing, optimistic update framework hoặc server-side idempotency.
- Không đổi API/action contract, schema, permission, authorization, tenant/org/establishment scope, transaction, persistence lifecycle hoặc business outcome semantics.
- Không sửa stuck-pending runtime issue trong change này.

## Capabilities

### New Capabilities

- `frontend/async-interaction-feedback`: Behavioral contract dùng chung cho feedback của user-triggered async mutation và nguyên tắc adoption có giới hạn theo application/route.

### Modified Capabilities

- Không có. Các capability hiện hữu tiếp tục sở hữu validation, conflict, idempotency, retry identity, authoritative outcome và persistence semantics riêng.

## Impact

- Affected presentation boundary: `packages/ui` có thể được làm rõ hoặc mở rộng hẹp sau khi Specs/Design được duyệt; không thay thế các primitive hiện hữu.
- Initial adoption boundary: một allowlist nhỏ trong `apps/backoffice`; change hiện tại chỉ shaping, chưa adoption.
- Multiple applications chịu tác động ở mức contract tương lai, nhưng POS, Display, Booking và Feedback không nằm trong implementation/adoption của phase đầu.
- Không có API, schema, authorization, data ownership, runtime topology, persistence hoặc transaction change.
- Nếu runtime resolution yêu cầu thay đổi Server Action completion, redirect/revalidation, router refresh, transition architecture hoặc action return contract thì `STOP — CONTROL_TOWER_REVIEW_REQUIRED` và tách khỏi pure UX change này.
````

## Exact Analysis

````markdown
# Change Analysis

## Scope and Change Type

- **Classification:** `CROSS_MODULE`.
- Change đề xuất một behavioral foundation cho user-triggered async mutation ở frontend YUTA, với shared presentation ownership tại `packages/ui` và adoption ban đầu có allowlist tại `apps/backoffice`.
- Strategy được chọn là **Strategy B — foundation trước, adoption có giới hạn sau**. POS, Display, Booking và Feedback chỉ chịu ảnh hưởng ở mức future adoption review riêng; không thuộc phase implementation đầu tiên.
- Đây không phải runtime, API, authorization, persistence hoặc business-semantics change. Nếu việc áp dụng yêu cầu đổi Server Action completion, redirect/revalidation, router refresh, transition architecture, action return contract, retry identity hoặc transaction thì `STOP — CONTROL_TOWER_REVIEW_REQUIRED`.
- Gate hiện tại chỉ tạo Proposal, Analysis và Gate 1 review packet. Specs, Design, Tasks, Apply, sync và archive chưa được phép.

## Sources Consulted

- Repository governance: [`AGENTS.md`](../../../AGENTS.md), [`docs/README.md`](../../../docs/README.md), [`docs/CURRENT_STATE.md`](../../../docs/CURRENT_STATE.md), [`docs/AUTHORITY_MODEL.md`](../../../docs/AUTHORITY_MODEL.md), [`docs/MODULE_REGISTRY.md`](../../../docs/MODULE_REGISTRY.md), [`docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md`](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md).
- OpenSpec governance: [`openspec/config.yaml`](../../config.yaml), [`docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md`](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md), [`docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md`](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md), schema `yuta-spec-driven`.
- Frontend authority: [`docs/ui/README.md`](../../../docs/ui/README.md), [`docs/ui/YUTA_FRONTEND_RULES.md`](../../../docs/ui/YUTA_FRONTEND_RULES.md), [`docs/ui/BACKOFFICE_FRONTEND_RULES.md`](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md), [`docs/ui/PAGE_PACK_PROTOCOL.md`](../../../docs/ui/PAGE_PACK_PROTOCOL.md), [`docs/architecture/OVERVIEW.md`](../../../docs/architecture/OVERVIEW.md), [`packages/ui/AGENTS.md`](../../../packages/ui/AGENTS.md), [`apps/backoffice/AGENTS.md`](../../../apps/backoffice/AGENTS.md).
- Shared implementation evidence: [`packages/ui/src/components/button.tsx`](../../../packages/ui/src/components/button.tsx), [`packages/ui/src/index.ts`](../../../packages/ui/src/index.ts), [`packages/ui/package.json`](../../../packages/ui/package.json), root [`package.json`](../../../package.json).
- Backoffice implementation evidence: general-information form, Google location selector, authenticated shell logout, Formalités CDI draft workspace, route `loading.tsx` files and current `useActionState`, `useFormStatus`, `useTransition`, Suspense and manual pending-state usages under `apps/backoffice/src`.
- Existing capability semantics: [`openspec/specs/reputation/review-social-links-configuration/spec.md`](../../specs/reputation/review-social-links-configuration/spec.md), [`openspec/specs/formalites/persistent-draft-foundation/spec.md`](../../specs/formalites/persistent-draft-foundation/spec.md), [`openspec/specs/personnel/reconstructable-value-history/spec.md`](../../specs/personnel/reconstructable-value-history/spec.md), relevant Satisfaction, Formalités and Establishment General Information page-pack interaction specifications.

## Authority and Product Decision

- Repository and application UI rules authorize reuse of `@yuta/ui`, framework-native React/Next.js patterns, semantic tokens and accessible interaction behavior. They do not authorize a new state-management framework, universal async wrapper, global request spinner or business-logic promotion into `packages/ui`.
- Existing capability specs remain authoritative for validation, conflict, replay/idempotency, retry identity, authoritative success and persistence semantics. The proposed foundation may constrain presentation behavior but must not redefine those outcomes.
- No dedicated async-interaction-feedback capability or lifecycle row exists in the current module registry. This planning change is non-normative and does not promote Product Decision, Implementation, Environment, Production Readiness or External Dependency status for any existing module.
- Product direction is sufficiently bounded for behavioral Specs: honest pending feedback, accidental duplicate prevention, recoverable error presentation, authoritative-success presentation and accessibility, followed by a small Backoffice adoption allowlist.

## Current Implemented State

- `Button` currently accepts `loading`, disables a native button when `disabled || loading`, but does not render a spinner, change its children, or set `aria-busy`. Its `asChild` composition delegates semantics to the child, so native-button guarantees cannot be assumed for links or arbitrary slotted elements.
- Backoffice already contains multiple valid pending patterns: `useFormStatus` with action-specific pending labels, `useActionState` for returned operation state, `useTransition`, Suspense/route loading, and route-owned manual state machines. There is no single mutation hook or common async state machine.
- General Information is a useful standard-form reference: it uses `useFormStatus`, a pending label and `Button loading` while preserving route-owned action/error semantics.
- Google location selection and authenticated-shell logout submit Server Actions without route-local pending feedback or explicit duplicate-activation protection. They are bounded candidates for future adoption, not defects fixed by this Gate 1 work.
- Formalités CDI draft workspace owns a richer operation lifecycle, including pending/uncertain handling and business-specific recovery. It is compatibility evidence: the foundation must not flatten or replace this state machine.
- Shared `Alert`, `ErrorState`, `Skeleton`, `LoadingOverlay` and toast exports exist, but repository evidence does not establish a universal mutation-feedback composition. Route loading and refresh behavior remain intentionally contextual.
- `packages/ui` has no package-local test script or direct component-test suite. Root commands cover application/package tests, including `pnpm test:backoffice`, but no current command independently proves the shared `Button` contract.
- Static repository evidence confirms inconsistent feedback coverage; it does not identify the externally reported stuck-pending route or prove whether that issue is page-specific or systemic.

## Affected Boundaries

| Boundary | Impact | Gate 1 decision |
| --- | --- | --- |
| Shared UI | Yes | May own only domain-neutral button/busy semantics and presentation primitives; no business state machine. |
| Backoffice pages | Yes | Initial adoption is limited to an explicit pilot allowlist. |
| Other applications | Contract-level only | POS, Display, Booking and Feedback require separate adoption reviews. |
| Authentication / authorization | No semantic change | Logout may be a presentation pilot only; session and permission behavior remain unchanged. |
| Data / persistence | None | No schema, repository, transaction, tenant or persistence-lifecycle change. |
| API / Server Actions | None | Existing request, result, validation, conflict and retry contracts remain authoritative. |
| Runtime / routing | External risk only | Any required completion, redirect, revalidation, refresh or transition fix triggers Control Tower review. |
| Accessibility | Yes | Busy, disabled, accessible-name, error-association, focus-recovery and live-region rules belong in the behavioral contract. |
| Tests / tooling | Yes | Shared contract-test ownership/command must be resolved before Design/Tasks authorizes a `packages/ui` change. |
| Product visibility | None | No public capability or commercial claim changes. |

## Lifecycle Baseline

- There is no lifecycle row for this new cross-cutting frontend foundation. Existing Backoffice and application capabilities retain their current registry statuses; this analysis does not infer readiness from code presence.
- The planning artifacts are non-normative until the separately governed OpenSpec lifecycle authorizes later stages. No Product Decision, Implementation, Environment, Production Readiness or External Dependency field is promoted here.
- Repository implementation was inspected as evidence only. Deployed environment behavior and the reported stuck-pending incident are `UNVERIFIED` in this analysis.

## Requirement Readiness

The following decisions are ready to become behavioral requirements in a later Specs step:

1. **Busy semantics:** a native submit/action button must use native disabled behavior for the same in-flight mutation and expose `aria-busy="true"` while pending. A containing form or region uses busy semantics only when the whole region is meaningfully unavailable. The caller owns contextual visible pending feedback and must avoid redundant live-region announcements.
2. **`asChild + loading`:** this composition is not a normative mutation-pending mechanism. Consumers must not rely on it for duplicate prevention or native disabled semantics unless the composed element's semantics are explicitly proven by a separately reviewed contract.
3. **Pending-label convention:** either replace the visible label with action-specific pending text or retain the action label with a visible progress indicator. The accessible action meaning must remain specific; a generic accessible name such as only “Loading” is insufficient.
4. **Success convention:** explicit success feedback is required when the interface would otherwise leave completion ambiguous. A visibly reconciled authoritative result, redirect, or clearly updated route state may itself confirm success; a toast is not required.
5. **Duplicate prevention versus idempotency:** UI-level prevention limits accidental repeated activation while a request is in flight. It does not provide server idempotency, replay safety, conflict handling or exactly-once semantics, which remain capability-owned.
6. **Error and recovery:** field validation remains adjacent to fields; operation/server failure is presented at the relevant action or form scope. Recoverable failure preserves user-entered values where the existing route architecture supports it. Retry is shown only when the existing capability contract supports retry.
7. **Pilot allowlist for later adoption:**
   - standard-form reference/non-regression: General Information form;
   - missing-feedback mutation: Google location selection;
   - shell/navigation mutation: authenticated-shell logout;
   - custom-state-machine compatibility/non-regression: Formalités CDI draft workspace.

Test ownership is only partially ready: `packages/ui` is the correct ownership boundary for a shared primitive contract, but there is no existing package-local command that runs such tests. `pnpm test:backoffice` can protect allowlisted consumer behavior, not independently establish the shared package contract. Design/Tasks must either propose an approved package-local test command or explicitly constrain verification to consumer contract tests before any `packages/ui` implementation is authorized.

## UI / UX Applicability

- UI/UX rules are applicable because this change defines visible and assistive-technology feedback for user-triggered async interactions.
- The contract must preserve action meaning during pending, visible focus, keyboard behavior, error association and recoverability. It must avoid announcing the same state through multiple competing live regions.
- Route skeletons, background refresh, polling, long-running processing, optimistic frameworks and global spinners are outside scope. Existing route/page-pack interaction rules remain authoritative.
- `Alert`, `ErrorState`, `Skeleton`, `LoadingOverlay` and toast primitives are composition options, not mandated universal outcomes. The route owns the smallest truthful feedback appropriate to its interaction.

## Conflicts and Unknowns

- **No authority conflict found** for writing behavioral Specs within the bounded scope.
- **Needs review before Design/Tasks:** exact ownership and runnable command for direct shared-UI contract tests. This does not block behavioral Specs because the desired observable contract is clear, but it blocks claiming a verified `packages/ui` implementation path.
- **External runtime unknown:** the route and reproduction for the reported stuck-pending issue are not established by repository evidence. This is recorded risk, not part of this change. Any attempt to repair completion/routing/action behavior requires a separately bounded investigation and may trigger `STOP — CONTROL_TOWER_REVIEW_REQUIRED`.
- **Control Tower trigger:** any discovered need to alter business outcomes, authorization, role/permission, organization/establishment scope, validation, idempotency, conflict/retry identity, transaction, persistence, API/action return shape or runtime completion architecture.

## Analysis Conclusion

`READY_FOR_SPECS`

The proposed behavioral scope is bounded, cross-module impact is classified, Strategy B is justified, and no current authority conflict blocks Specs. Gate 1 should be reviewed as `APPROVE_GATE_1`; approval would authorize only the next Specs artifact, not Design, Tasks, Apply, production changes, sync or archive.
````

## Exact Artifact Hashes

| Artifact | SHA256 |
| --- | --- |
| `analysis.md` | `7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39` |
| `proposal.md` | `c973917e01917c17bb9399330312a9c7b7003ae920a11f0e0e50f876d879908e` |

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <artifact-path>`, normalized to lowercase.

## Exact Approval Needed

Reply with `APPROVE_GATE_1` to authorize Specs only, or request revisions. No later gate or implementation authority is implied.
