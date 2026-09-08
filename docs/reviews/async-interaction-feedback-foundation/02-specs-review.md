# Specs Review Packet

Change: `async-interaction-feedback-foundation`
Gate: Gate 2 — Requirements Review
Review status: `APPROVED`
Created: `2026-09-06T17:36:58.4240760+02:00`
Approved: `2026-09-06T18:19:12.2414878+02:00` by current-user Design Phase instruction; exact Gate 1, Proposal, Analysis and delta-spec hashes revalidated before Design.
Schema: `yuta-spec-driven`
Classification: `CROSS_MODULE`
Specs status: `done`
Design status: `ready` but not authorized
Tasks status: `blocked`
Apply status: `NOT_AUTHORIZED`

## Approved Gate 1 Reference

- Packet: `docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md`
- Review status: `APPROVED` by the current-user Specs Phase instruction.
- Gate 1 packet SHA256: `03cbb892029eb01c8bac8b48e7c301458e21acde4940c4c5f71f2a08eea6c15c`
- Proposal SHA256: `c973917e01917c17bb9399330312a9c7b7003ae920a11f0e0e50f876d879908e`
- Analysis SHA256: `7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39`
- Gate 1 Proposal and Analysis hashes were recomputed and matched the exact hashes approved before Specs.

## Requirements and Scenarios Summary

The delta adds one new capability, `frontend/async-interaction-feedback`, with behavioral requirements for:

- truthful mutation pending feedback and conclusive outcomes;
- UI-level duplicate-activation prevention distinct from server idempotency;
- action-specific accessible pending meaning, disabled/busy scope and delegated-control equivalence;
- validation versus operation-failure presentation, value preservation and bounded retry;
- authoritative success through explicit feedback, visible reconciled result or redirect/result state;
- preservation and precedence of Formalités, Reputation, tenant-switching and route-owned state machines;
- bounded observable expectations for shared `Button loading` behavior and future contract tests;
- a four-category Backoffice pilot with no POS, Display, Booking or Feedback adoption;
- an explicit Control Tower stop guard for any auth, tenant, data, API, idempotency, conflict, transaction, persistence, runtime or redirect/revalidation boundary change;
- a non-repair boundary for the externally reported stuck-pending runtime defect.

The delta contains concrete scenarios for standard form submission, validation failure, operation failure, redirect success, shell/navigation action, delegated/non-native controls, custom-state compatibility, shared primitive behavior, pilot adoption and runtime-boundary escalation.

## Scope and Authority Review

- Scope remains within the approved Proposal and Analysis.
- No universal action component, generic async state machine, new library, global spinner, toast architecture, fetch interception, route-skeleton rollout, background refresh, polling, long-running state model or optimistic framework is specified.
- No implementation hook, component architecture, file path, CSS mechanism, test framework or test runner is mandated.
- Specific accepted Product/domain specs remain authoritative for validation, conflict, uncertain operations, idempotency/retry identity, tenant switching and authoritative outcomes.
- Adoption is limited to the Backoffice pilot categories; POS, Display, Booking and Feedback adoption is explicitly excluded.
- Authorization, role/permission, organization/establishment scope, data ownership, API/action contracts, transactions, persistence and runtime topology remain unchanged.

## Accessibility Review

- Pending action meaning must remain specific and understandable.
- A generic accessible name containing only “Loading” is prohibited.
- Native unavailable controls require disabled semantics and an applicable programmatically determinable busy state.
- Local pending actions must not mark unrelated content or an available surrounding region busy.
- Delegated/non-native controls require equivalent activation prevention, keyboard behavior and accessibility semantics.

## Duplicate Prevention and Success Review

- UI duplicate prevention is explicitly separate from server idempotency, replay protection, transaction deduplication and exactly-once behavior.
- Success is allowed only after authoritative completion.
- A visible authoritative result, redirect or unambiguous updated route state can satisfy completion feedback without an explicit success message.
- Client submission start or optimistic presentation alone cannot establish success.
- Toast and spinner use are not standardized.

## Changed Assumptions Since Analysis

- No behavioral, Product, authority, security, data or runtime assumption changed.
- Evidence-path correction only: the current shared button implementation is `packages/ui/src/button.tsx`; the approved Analysis links to the non-existent `packages/ui/src/components/button.tsx`. Proposal and Analysis bytes were preserved because this reference-path defect does not change their reviewed findings or requirement readiness.
- The location and runnable command for shared primitive contract tests remain Design-gated, as approved at Gate 1.

## Remaining Ambiguity

- Before Design/Tasks can authorize a shared primitive change, the technical plan must resolve shared contract-test ownership and an actual runnable command, or explicitly constrain verification to approved consumer contract tests.
- The route and reproduction for the external stuck-pending report remain unverified and outside this change.
- Any implementation discovery requiring a durable or runtime boundary change must stop with `STOP — CONTROL_TOWER_REVIEW_REQUIRED`.

## Strict Validation

Command:

```text
openspec validate 'async-interaction-feedback-foundation' --strict --json
```

Exact result:

```json
{
  "items": [
    {
      "id": "async-interaction-feedback-foundation",
      "type": "change",
      "valid": true,
      "issues": [],
      "durationMs": 9
    }
  ],
  "summary": {
    "totals": {
      "items": 1,
      "passed": 1,
      "failed": 0
    },
    "byType": {
      "change": {
        "items": 1,
        "passed": 1,
        "failed": 0
      }
    }
  },
  "version": "1.0",
  "root": {
    "path": "D:\\working\\yuta\\yuta-resto",
    "source": "nearest"
  }
}
```

Validation assessment: `PASS` — one change validated, zero issues.

Additional repository artifact checks:

| Command | Result |
| --- | --- |
| `pnpm docs:check` | `PASS` — documentation consistency passed for 36 current documents. |
| `pnpm exec prettier --check 'openspec/changes/async-interaction-feedback-foundation/specs/frontend/async-interaction-feedback/spec.md'` | `PASS` — the delta spec matches repository Prettier style. |
| `git diff --check -- 'openspec/changes/async-interaction-feedback-foundation' 'docs/reviews/async-interaction-feedback-foundation'` | `PASS` — no whitespace errors. |
| `pnpm format:check` | `WARN / EXIT 1` — repository-wide baseline reports 70 files, including pre-existing generated skills, archived/current docs, the approved Gate 1 artifacts and review packets. No broad formatting write was performed. The delta spec itself passes the targeted check above. |

Working-tree scope at review: only `openspec/changes/async-interaction-feedback-foundation/` and `docs/reviews/async-interaction-feedback-foundation/` are untracked; no unrelated tracked or untracked path is reported by `git status --short`.

Implementation builds, tests, typechecks and runtime QA were not run because this gate is Specs-only and the current request excludes implementation validation.

## Exact Delta Spec

Path: `openspec/changes/async-interaction-feedback-foundation/specs/frontend/async-interaction-feedback/spec.md`

````markdown
## Purpose

Định nghĩa contract hành vi dùng chung để các mutation do người dùng khởi tạo cung cấp pending, failure, recovery và authoritative success feedback trung thực, accessible, đồng thời giữ nguyên các state machine và durable boundary thuộc từng capability.

## ADDED Requirements

### Requirement: Mutation Pending Feedback

Đối với mutation do người dùng khởi tạo, giao diện SHALL cung cấp pending feedback ngay sau activation và trước authoritative completion mà không yêu cầu người dùng thực hiện thêm một hành động hoặc tự refresh. Pending feedback SHALL giữ cho mục đích của hành động tiếp tục dễ hiểu, MUST NOT biểu thị success, và SHALL chỉ kết thúc khi interaction đạt một conclusive UI outcome hoặc chuyển sang navigation/result state phù hợp với lifecycle hiện hữu của route.

#### Scenario: Standard form mutation enters pending

- **WHEN** người dùng submit một standard form mutation
- **THEN** pending feedback xuất hiện trong khi chờ authoritative completion
- **AND** mục đích của action vẫn dễ hiểu
- **AND** giao diện chưa trình bày mutation là thành công

#### Scenario: Pending reaches a conclusive outcome

- **WHEN** route nhận được authoritative success, validation failure, operation failure, conflict, uncertain outcome hoặc một result state kết luận interaction theo lifecycle hiện hữu
- **THEN** pending presentation SHALL kết thúc hoặc chuyển sang presentation của outcome tương ứng
- **AND** outcome MUST NOT bị thay thế bằng một success state chung chung

#### Scenario: Successful navigation replaces the initiating surface

- **WHEN** mutation hoàn tất bằng navigation hoặc redirect tới result state xác nhận completion
- **THEN** initiating pending presentation không còn được yêu cầu sau khi surface khởi tạo đã bị thay thế
- **AND** resulting route hoặc state SHALL làm cho kết quả completion dễ hiểu

### Requirement: Duplicate Activation Prevention

Giao diện SHALL ngăn repeated accidental activation của cùng một user action trong khi mutation tương ứng còn in flight và initiating control vẫn hiện diện. Đây là UX-level prevention duy nhất; requirement này MUST NOT được diễn giải thành server idempotency, replay protection, transaction deduplication hoặc business-level exactly-once behavior.

#### Scenario: Repeated activation while control remains present

- **WHEN** người dùng cố kích hoạt lại cùng action trong lúc mutation đang pending và control vẫn hiện diện
- **THEN** giao diện SHALL ngăn activation lặp ngoài ý muốn
- **AND** pending feedback hiện tại SHALL tiếp tục đại diện cho interaction đang in flight

#### Scenario: Navigation removes the control

- **WHEN** navigation hoặc redirect loại bỏ initiating control ngay sau activation
- **THEN** shared UX contract không yêu cầu tiếp tục disable một control không còn hiện diện
- **AND** hành vi này MUST NOT tạo hoặc ngụ ý bất kỳ server-side deduplication guarantee nào

### Requirement: Accessible Pending Semantics

Pending presentation SHALL giữ accessible action meaning cụ thể. Shared contract SHALL chấp nhận action-specific pending copy, action label đi cùng bounded progress indicator, hoặc một equivalent presentation khác có cùng ý nghĩa; accessible name chỉ là “Loading” hoặc copy hướng tới success trước completion MUST NOT được dùng. Shared contract MUST NOT yêu cầu một spinner toàn cục.

Một native actionable control không available trong pending operation SHALL expose correct disabled semantics và một programmatically determinable busy state khi applicable. Một surrounding form hoặc region MUST NOT được đánh dấu busy chỉ vì một local action đang pending, trừ khi toàn bộ form hoặc region thực sự unavailable. Unrelated content MUST NOT nhận busy semantics từ local pending action.

#### Scenario: Action-specific pending meaning

- **WHEN** một actionable control chuyển sang pending presentation
- **THEN** người dùng và assistive technology vẫn xác định được action cụ thể đang được xử lý
- **AND** accessible name MUST NOT chỉ là “Loading”
- **AND** copy MUST NOT tuyên bố hoặc ám chỉ success trước authoritative completion

#### Scenario: Local action does not block the whole region

- **WHEN** chỉ một action cục bộ trong form hoặc region đang pending và phần còn lại vẫn available
- **THEN** pending và disabled semantics SHALL chỉ áp dụng cho interaction bị ảnh hưởng
- **AND** surrounding form, region và unrelated content MUST NOT bị trình bày là busy hoặc unavailable

#### Scenario: Whole region is unavailable

- **WHEN** lifecycle hiện hữu của interaction làm cho toàn bộ form hoặc region thực sự unavailable trong lúc pending
- **THEN** giao diện SHALL expose busy semantics ở scope đó
- **AND** accessible action meaning của initiating interaction SHALL vẫn dễ hiểu

### Requirement: Delegated and Non-Native Control Boundary

Shared pending guarantees MUST NOT dựa trên giả định rằng HTML `disabled` semantics được chuyển sang arbitrary delegated child elements. Nếu delegated hoặc non-native interactive control được dùng cho một in-flight action, control đó MUST cung cấp equivalent activation prevention, keyboard behavior và programmatically determinable unavailable/busy semantics; nếu không, interaction không conform với shared pending contract.

#### Scenario: Delegated control provides equivalent behavior

- **WHEN** pending interaction sử dụng delegated hoặc non-native interactive control
- **THEN** repeated activation SHALL bị ngăn trong khi control vẫn hiện diện
- **AND** keyboard và assistive-technology semantics SHALL truyền đạt trạng thái unavailable hoặc busy tương đương

#### Scenario: Delegated control relies only on transferred disabled state

- **WHEN** delegated hoặc non-native control không cung cấp equivalent activation prevention và accessibility semantics mà chỉ dựa vào disabled behavior của native button
- **THEN** interaction SHALL được xem là non-conforming với shared pending contract

### Requirement: Error and Recovery Feedback

Field hoặc input validation SHALL tiếp tục được associated với input liên quan khi route hỗ trợ field-level validation. Operation, action hoặc server failure SHALL được trình bày ở action, form hoặc section scope thích hợp và MUST NOT bị trình bày như success. Recoverable failure SHALL giữ các giá trị người dùng đã nhập khi behavior hiện hữu và business semantics của route cho phép. Shared foundation MUST NOT định nghĩa lại validation meaning hoặc error taxonomy thuộc route.

Retry SHALL chỉ được trình bày khi capability hiện hữu hỗ trợ safe retry hoặc recovery action. Shared foundation MUST NOT tự tạo retry semantics; retry identity, conflict token, operation key, idempotency và uncertain-operation behavior SHALL tiếp tục do route hoặc domain sở hữu.

#### Scenario: Validation failure preserves field context

- **WHEN** client hoặc server validation từ chối một hoặc nhiều field
- **THEN** field-level feedback SHALL tiếp tục associated với các field liên quan
- **AND** unrelated entered values SHALL được giữ khi route behavior và business semantics cho phép
- **AND** giao diện MUST NOT tuyên bố operation thành công

#### Scenario: Operation failure after submission

- **WHEN** mutation thất bại sau submission mà không phải field-level validation outcome
- **THEN** operation-level error SHALL hiển thị ở scope liên quan
- **AND** pending presentation SHALL không chuyển thành success
- **AND** retry SHALL chỉ được cung cấp nếu capability hiện hữu hỗ trợ safe retry hoặc recovery

#### Scenario: Route owns uncertain recovery

- **WHEN** capability phân loại outcome là uncertain hoặc yêu cầu operation identity cụ thể để retry
- **THEN** shared feedback SHALL giữ nguyên recovery và identity semantics của capability
- **AND** shared foundation MUST NOT tạo operation key mới, diễn giải lại outcome hoặc hứa hẹn exactly-once behavior

### Requirement: Authoritative Success Feedback

Success feedback SHALL chỉ xuất hiện sau authoritative operation success. Shared contract MUST NOT yêu cầu explicit success message khi completion đã được thể hiện rõ bởi authoritative visible updated result, redirect tới resulting state hoặc updated route state xác nhận completion một cách không mơ hồ. Success MUST NOT được hiển thị chỉ vì client submission bắt đầu hoặc optimistic presentation thay đổi. Shared contract MUST NOT yêu cầu toast cho mọi success.

#### Scenario: Standard form reaches authoritative success

- **WHEN** standard form mutation nhận authoritative success và initiating surface vẫn hiện diện
- **THEN** giao diện SHALL trình bày confirmed result hoặc success feedback đủ rõ để phân biệt với pending
- **AND** presentation SHALL phản ánh authoritative outcome của route

#### Scenario: Redirect confirms success

- **WHEN** successful mutation hoàn tất bằng redirect hoặc navigation tới resulting state rõ ràng
- **THEN** explicit success message SHALL là optional
- **AND** resulting route hoặc state SHALL xác nhận completion một cách không mơ hồ

#### Scenario: Client-side change precedes authoritative completion

- **WHEN** client-side hoặc optimistic presentation thay đổi trước authoritative completion
- **THEN** giao diện MUST NOT dùng thay đổi đó làm bằng chứng duy nhất của success
- **AND** pending hoặc capability-owned intermediate state SHALL tiếp tục cho đến conclusive outcome

### Requirement: Custom-State Compatibility and Domain Precedence

Shared feedback foundation SHALL giữ nguyên route-specific state machine và MUST NOT yêu cầu thay thế state machine đó chỉ để đạt visual hoặc structural consistency. Specific accepted Product hoặc domain specs SHALL ưu tiên khi chúng định nghĩa conflict, uncertain operation, retry identity, idempotency, reload, tenant switching, redirect-based completion hoặc authoritative outcome chi tiết hơn shared foundation.

#### Scenario: Formalités uncertain-operation handling

- **WHEN** Formalités route chuyển operation từ pending sang uncertain hoặc retry với capability-owned operation identity
- **THEN** shared UX SHALL giữ nguyên uncertain-operation và retry behavior đó
- **AND** MUST NOT flatten behavior thành một generic pending/success/error state model

#### Scenario: Reputation conflict requires reload or reconciliation

- **WHEN** Reputation capability trả về conflict hoặc yêu cầu reload/reconciliation theo normative behavior hiện hữu
- **THEN** shared feedback SHALL trình bày capability-owned conflict/recovery path
- **AND** MUST NOT thay conflict bằng generic retry hoặc success presentation

#### Scenario: Tenant switching or redirect owns completion

- **WHEN** tenant switching hoặc một route-specific mutation hoàn tất qua validated navigation, redirect hoặc resulting route state
- **THEN** shared UX SHALL cho phép lifecycle đó xác nhận completion
- **AND** MUST NOT thay đổi membership validation, trusted session refresh hoặc redirect semantics

### Requirement: Shared Primitive Pending Contract

Shared contract SHALL cho phép `Button loading` behavior tham gia pending UX. Khi loading áp dụng cho native button, button MUST ngăn activation trong lúc loading và children hoặc equivalent presentation SHALL giữ action meaning dễ hiểu. Shared primitive contract MUST NOT tự động yêu cầu spinner insertion hoặc label replacement. Nếu shared primitive behavior được thay đổi hoặc formally codified trong implementation, relevant shared contract tests SHALL tồn tại và pass trước khi implementation được xem là complete; vị trí và test runner không thuộc requirement này.

#### Scenario: Native loading button participates in pending UX

- **WHEN** native shared button được đặt vào loading state cho mutation đang in flight
- **THEN** activation SHALL bị ngăn trong lúc loading
- **AND** action meaning SHALL tiếp tục dễ hiểu
- **AND** loading state MUST NOT tự tuyên bố success

#### Scenario: Primitive does not impose a universal visual

- **WHEN** consumer chọn conforming pending presentation giữ nguyên action meaning
- **THEN** shared contract MUST NOT buộc automatic spinner insertion
- **AND** shared contract MUST NOT buộc automatic label replacement

#### Scenario: Shared primitive contract is changed or codified

- **WHEN** implementation thay đổi hoặc formally codify observable pending behavior của shared primitive
- **THEN** relevant shared contract tests SHALL xác minh behavior đó trước khi implementation được xem là complete
- **AND** Specs MUST NOT quyết định test location, framework hoặc runner

### Requirement: Bounded Backoffice Pilot Adoption

Initial adoption SHALL chỉ bao gồm một bounded Backoffice pilot với bốn loại evidence: một standard form mutation đã có conforming pending behavior làm baseline, một mutation đang thiếu local feedback, một shell hoặc navigation mutation, và một custom business state machine làm non-regression compatibility case. Pilot SHALL chứng minh shared contract trên các interaction type khác nhau mà không thay đổi capability-owned state machine, authorization, data hoặc runtime behavior. Adoption trong POS, Display, Booking và Feedback MUST NOT thuộc pilot này.

#### Scenario: Standard form baseline

- **WHEN** pilot đánh giá standard General Information form mutation đã có local pending behavior
- **THEN** behavior SHALL được dùng làm baseline hoặc non-regression evidence cho shared contract
- **AND** pilot MUST NOT yêu cầu refactor chỉ để đồng nhất implementation structure

#### Scenario: Mutation lacking local feedback

- **WHEN** pilot áp dụng contract cho Google location selection đang thiếu local pending feedback
- **THEN** interaction SHALL đáp ứng pending, duplicate-prevention, error và authoritative-success requirements áp dụng được
- **AND** selection action contract, provider behavior và tenant scope MUST NOT thay đổi

#### Scenario: Shell or navigation mutation

- **WHEN** pilot áp dụng contract cho logout hoặc một shell/navigation mutation được chọn
- **THEN** repeat activation SHALL bị ngăn trong khi action vẫn available
- **AND** pending state SHALL tiếp tục dễ hiểu cho đến khi navigation hoặc một conclusive outcome thay thế initiating surface
- **AND** session, membership và authorization semantics MUST NOT thay đổi

#### Scenario: Custom state machine non-regression

- **WHEN** pilot đánh giá Formalités CDI draft workspace như compatibility case
- **THEN** capability-owned pending, uncertain, conflict, retry và operation-identity behavior SHALL được giữ nguyên
- **AND** pilot MUST NOT thay thế state machine bằng shared generic model

### Requirement: Cross-Module Ownership Guardrail

Shared feedback foundation SHALL chỉ sở hữu observable UX behavior. Nó MUST NOT thay đổi authorization decision, membership/role/permission semantics, organization hoặc establishment scope, data ownership, validation rule, Server Action hoặc API input/output contract, idempotency key, replay semantics, conflict token, transaction boundary, persistence semantics, runtime topology hoặc redirect/revalidation architecture.

Nếu future implementation cần thay đổi bất kỳ boundary nào ở trên, change SHALL dừng với `STOP — CONTROL_TOWER_REVIEW_REQUIRED` trước khi thực hiện thay đổi đó.

#### Scenario: Implementation remains within presentation behavior

- **WHEN** implementation có thể đáp ứng requirements bằng presentation và interaction behavior trong boundary hiện hữu
- **THEN** implementation SHALL chỉ đủ điều kiện tiếp tục qua các gate được phê duyệt sau này
- **AND** capability-specific normative behavior SHALL tiếp tục là authority chi tiết hơn

#### Scenario: Implementation discovers a durable or runtime boundary change

- **WHEN** implementation analysis phát hiện cần đổi một authorization, tenant, data, validation, API/action, idempotency, conflict, transaction, persistence, runtime hoặc redirect/revalidation boundary
- **THEN** workflow SHALL dừng với `STOP — CONTROL_TOWER_REVIEW_REQUIRED`
- **AND** shared UX spec MUST NOT được dùng làm authority cho thay đổi boundary đó

#### Scenario: Externally reported stuck-pending defect

- **WHEN** một pending interaction không đạt conclusive outcome do runtime completion behavior chưa được xác minh
- **THEN** foundation SHALL chỉ cung cấp expected UX contract làm evidence cho investigation riêng
- **AND** change này MUST NOT sửa Server Action completion, navigation, redirect, revalidation, refresh hoặc transition architecture
````

## Exact Artifact Hashes

| Artifact | SHA256 |
| --- | --- |
| `specs/frontend/async-interaction-feedback/spec.md` | `46840b69a936b96e9e6c49bee6330ea1a6206774f7aea7483dbabda4f159cb8e` |

Hash command: `Get-FileHash -Algorithm SHA256 -LiteralPath <artifact-path>`, normalized to lowercase.

## Recommendation

`APPROVE_GATE_2`

Approval means only: accept the exact delta spec above and authorize the next separately governed Design assessment/artifact step. It does not authorize Design content in advance, Tasks, Apply, production changes, sync or archive.

## Exact Approval Needed

Reply with `APPROVE_GATE_2` to approve the exact delta spec and permit the workflow to assess/create Design next, or request revisions. No later gate or implementation authority is implied.
