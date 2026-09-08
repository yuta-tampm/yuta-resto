## Context

Xem [`proposal.md`](proposal.md) để biết động cơ và [`specs/frontend/async-interaction-feedback/spec.md`](specs/frontend/async-interaction-feedback/spec.md) để biết behavioral contract đã duyệt.

Frontend hiện dùng nhiều cơ chế async hợp lệ theo route: standard form dựa trên framework-native form status, redirect-based Server Actions, shell mutations và custom state machines như Formalités. `@yuta/ui` đã có `Button`, `Alert`, `ErrorState`, `Skeleton` và `LoadingOverlay`; không có shared mutation state machine. Thiết kế vì vậy là một mở rộng incremental: làm rõ một contract nhỏ trên `Button`, thêm client feedback ở đúng interaction boundary và giữ business outcome tại route/domain hiện hữu.

`Button loading` hiện giữ nguyên children, đặt `data-loading`, và với native rendering dùng `disabled={disabled || loading}`. Nó chưa phát `aria-busy`. Repository có 123 `asChild` usages nhưng không có consumer kết hợp `Button asChild` với `loading`; native pending guarantee vẫn không thể suy ra cho delegated element.

Backoffice đã có Vitest và nhiều component tests dùng `react-dom/server`. `packages/ui` chưa có test script, Vitest hoặc `react-dom` dev dependency, nên direct shared contract test cần package-local wiring trước khi shared primitive implementation được xem là complete.

## Goals / Non-Goals

**Goals:**

- Làm cho native `Button loading` phát disabled và busy semantics nhất quán mà không đổi visible children.
- Dùng composition cục bộ cho pending label/indicator, error và confirmed result; không tạo universal async abstraction.
- Giới hạn adoption vào bốn Backoffice pilot categories đã duyệt.
- Bảo vệ shared primitive bằng test do `packages/ui` sở hữu và bảo vệ pilot bằng Backoffice tests hiện hữu.
- Giữ nguyên Server Component/client boundary, Server Action contract, authorization, provider, data và route-specific recovery.

**Non-Goals:**

- Không tạo `ActionButton`, shared async hook/state machine, global provider, spinner hoặc toast convention.
- Không đổi Server Action/API input/output, redirect/revalidation sequencing, idempotency, conflict/retry identity, transaction hoặc persistence.
- Không sửa stuck-pending runtime defect và không mở adoption sang POS, Display, Booking hoặc Feedback.
- Không dùng `Skeleton` hoặc `LoadingOverlay` để thay thế local mutation feedback.

## Architecture / Ownership

### `packages/ui`

`packages/ui` chỉ sở hữu domain-neutral native button contract: `loading`, explicit `disabled`, `data-loading`, preserved children, forwarded native attributes và busy semantics. Package không sở hữu pending copy, success/error taxonomy, focus recovery, retry hoặc business operation lifecycle.

### `apps/backoffice`

Backoffice sở hữu route-local/shell-local composition: lấy pending state từ framework-native interaction boundary, chọn visible copy/indicator, đặt error/result presentation, và giữ client state ở component nhỏ nhất cần thiết. Backoffice không chuyển trusted scope, provider access hoặc Server Action logic sang browser.

### Route/domain-specific ownership

Mỗi route/domain tiếp tục sở hữu validation, authoritative result, redirect, conflict, uncertain operation, retry identity và idempotency. Formalités và Reputation specs ưu tiên hơn shared UX contract khi chúng định nghĩa outcome chi tiết hơn. Tenant switching tiếp tục sở hữu validated membership/session refresh; Google connector tiếp tục sở hữu provider validation và redirect result.

## Decisions

### 1. Narrowly extend native `Button loading`

`Button` sẽ được mở rộng hẹp để derive `aria-busy="true"` khi `loading` là true. Khi `loading` false hoặc undefined, component giữ caller-supplied `aria-busy` thay vì xóa một busy state hợp lệ khác. Implementation cần tách `aria-busy` khỏi forwarded props hoặc bảo đảm prop order không cho caller vô tình override `loading=true` thành `aria-busy=false`.

Các behavior hiện hữu sau giữ nguyên:

- native rendering dùng `disabled={disabled || loading}`;
- explicit `disabled` vẫn có hiệu lực độc lập với `loading`;
- `data-loading` chỉ tồn tại khi `loading=true`;
- children không bị component thay thế;
- không chèn spinner tự động;
- không thay label tự động;
- refs, native attributes, variants và class composition tiếp tục được forward.

Rationale: đây là thay đổi nhỏ nhất làm busy state programmatically determinable cho toàn bộ native `Button loading` consumers, trong khi visible pending meaning vẫn thuộc caller.

Alternatives rejected:

- Automatic spinner hoặc automatic label: bị Specs loại trừ và sẽ phá route-specific copy/composition.
- Shared pending wrapper: tạo abstraction không có repeated need được chứng minh.
- Chỉ yêu cầu từng consumer thêm `aria-busy`: để shared native contract tiếp tục không nhất quán và khó test trực tiếp.

### 2. Keep `asChild + loading` outside the normative guarantee

Normative `loading` guarantee chỉ áp dụng khi `Button` render native `<button>`. Change này không thêm runtime throw, không tạo delegated-control abstraction và không mô phỏng disabled bằng event interception trên arbitrary child.

Current prop forwarding cho `asChild` không được quảng bá thành guarantee. Consumer dùng delegated/non-native element cho in-flight action phải tự cung cấp equivalent activation prevention, keyboard behavior và programmatically determinable unavailable/busy semantics; nếu không thì không conform. Current scan không tìm thấy `asChild + loading`, nên không cần migration consumer trong pilot.

Alternative rejected: discriminated prop type hoặc runtime prohibition trong phase này. Cả hai mở rộng compatibility surface mà không cần thiết để đáp ứng approved pilot; có thể được đề xuất riêng nếu real consumer xuất hiện.

### 3. Compose existing primitives; create no new primitive

| Primitive        | Decision          | Use in this change                                                                   |
| ---------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `Button`         | Narrowly extended | Native disabled/busy contract và standard pending controls.                          |
| `Alert`          | Reused unchanged  | Existing route-owned operation/result feedback; không thành global mutation wrapper. |
| `ErrorState`     | Not used          | Phù hợp full-section/load failure hơn local pilot mutations.                         |
| `Skeleton`       | Not used          | Không liên quan user-triggered mutation pending.                                     |
| `LoadingOverlay` | Not used          | Sẽ overstate whole-region unavailability cho local actions.                          |

Không có evidence cho primitive mới. Pending text, icon/indicator và error placement được compose tại caller.

### 4. Accessibility stays local and truthful

- Native mutation control: `Button loading` cung cấp disabled và `aria-busy`; caller giữ action-specific accessible name bằng pending copy hoặc stable label cộng indicator.
- Local action: không đặt `aria-busy` trên form/region khi các control khác vẫn usable.
- Whole-region busy: chỉ dùng khi route lifecycle thực sự khóa toàn region; pilot này không thêm whole-region busy wrapper.
- Pending visual: General Information và Google selection dùng action-specific pending text; logout giữ icon-only action meaning bằng pending `aria-label` cụ thể và một bounded visual indicator.
- Errors: giữ field association và action/form/section placement hiện hữu. Existing `Alert`/route result presentation không bị normalize.
- Live regions: không thêm global announcer. Chỉ dùng route-owned status/alert khi có outcome cần announce, tránh duplicate announcement từ button và region.
- Focus: redirect-based Google selection/logout để resulting route sở hữu focus. Formalités giữ `focusSoon` và recovery refs hiện hữu. Không thêm global focus manager.

### 5. Preserve Server Component and client boundaries

General Information và Formalités đã là client interaction boundaries; không đổi boundary.

Google location selector hiện là Server Component. Route giữ nguyên data loading và form action; chỉ submit control được tách thành route-local `GoogleLocationSubmitButton` client island dùng form pending context. Hidden provider identifiers và Server Action tiếp tục ở form hiện hữu; không có trusted scope hoặc provider logic chuyển vào client.

Backoffice shell đã là Client Component. `LogoutSubmitButton` có thể tách thành application-shell component để cô lập pending presentation và test, nhưng không làm tăng trusted client ownership hoặc tạo global provider. Logout action, cookie/session revocation và redirect giữ nguyên server-owned behavior.

### 6. Preserve success, error and duplicate semantics

General Information tiếp tục dùng returned action state, field errors, preserved draft và explicit success/error message. Shared `aria-busy` addition không thay state model.

Google selection tiếp tục kết thúc bằng existing query-result redirect (`location_selected`, `invalid_location`, `auth_expired`, `location_error`) và existing result `Alert`. Client submit control chỉ thêm pending copy và duplicate prevention trước navigation; nó không catch hoặc reinterpret Server Action outcomes.

Logout tiếp tục kết thúc bằng redirect tới `/connexion`. Pending control ngăn repeat activation trong khi còn hiện diện; không thêm success toast hoặc local success state.

Formalités tiếp tục dùng route-owned operation gate, operation key, `pending`/`uncertain`, authoritative model reconciliation, feedback focus và router refresh. Shared Button change chỉ thêm busy semantics cho native loading buttons; không thay operation lifecycle.

UI duplicate prevention dùng native disabled/loading hoặc route-local gate hiện hữu. Nó không thêm hay thay idempotency key, operation key, replay protection hoặc transaction semantics.

## Pilot Adoption Design

| Category / target                                      | Current pattern                                                                                                          | UX gap                                                                         | Frontend-only design                                                                                                                                                                  | Primitives                                                                            | Must remain unchanged                                                                                          | Expected tests                                                                                                                        | Later Browser QA                                                                                                                                                                                                             |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing-good baseline — General Information           | Client form, returned action state, form pending context, action-specific label và `Button loading`                      | Shared button chưa phát busy semantics; không có lý do refactor route          | Không đổi form architecture; nhận `aria-busy` từ shared native Button và thêm/giữ component test cho pending label, disabled/busy, failure value preservation và authoritative result | `Button`, `Alert`                                                                     | Save action, field errors, draft preservation, permissions, transaction/persistence                            | Direct shared Button test + `apps/backoffice/test/general-information-form.test.tsx`                                                  | Pending, validation/error, confirmed success, keyboard/focus ở 1440/1024/768/390 khi safe local data available                                                                                                               |
| Missing feedback — Google Business location selection  | Server-rendered cards, native form gọi redirect-based Server Action                                                      | Submit button không có local pending feedback hoặc duplicate prevention        | Thêm route-local client submit button; label `Sélection en cours…`, `loading`/disabled trong pending; giữ existing redirect-result Alerts                                             | `Button`; existing `Alert` unchanged                                                  | Provider lookup, permission, tenant scope, form fields, action return type, revalidation và redirects          | `apps/backoffice/test/google-location-submit-button.test.tsx`; existing integration model/action security tests remain                | Pending before redirect; selected result; invalid/provider failure result; keyboard/focus and responsive cards. Nếu không có safe Google test environment, report `BLOCKED_BY_ENVIRONMENT` thay vì mutate real provider data |
| Shell/navigation — logout                              | Existing client shell chứa native form và icon-only submit gọi redirect action                                           | Không có pending meaning hoặc duplicate prevention                             | Tách `LogoutSubmitButton` shell-local; disable/busy trong pending, dùng pending accessible label `Déconnexion en cours…` và bounded loading icon; không thêm success state            | `IconButton` reused with route-local pending props/indicator; no new shared primitive | Session revoke, cookie delete, auth rules và `/connexion` redirect                                             | `apps/backoffice/test/logout-submit-button.test.tsx`; existing auth tests remain authoritative                                        | Normal/pending icon-only semantics, repeated activation, redirect to sign-in, keyboard/focus at desktop/mobile shell widths                                                                                                  |
| Complex compatibility — Formalités CDI draft workspace | Route-owned manual async state machine với operation key, pending/uncertain, reconciliation, focused feedback và refresh | Không có gap cần refactor; cần chứng minh shared change không flatten behavior | Không đổi production component/state machine; rerun existing tests và bổ sung assertion chỉ khi cần cho shared busy attribute                                                         | Existing `Button`, `Alert` composition                                                | Operation identity, uncertain retry, conflict/reconciliation, draft preservation, authorization và persistence | Existing `formalites-persistent-draft-state.test.ts` và `formalites-persistent-draft-component.test.tsx`; shared Button contract test | Non-regression pending/uncertain/conflict/retry and focus behavior with safe development data; no generated/legal workflow expansion                                                                                         |

Pilot không bao gồm tenant switcher production edit vì logout đã đại diện shell/navigation category; existing tenant-switcher tests vẫn là compatibility evidence cho disabled/busy/redirect pattern.

## Testing Strategy

### Shared primitive contract ownership

- Test location: `packages/ui/test/button.test.tsx`.
- Owner: `@yuta/ui` workspace.
- Runner: Vitest, đã được dùng bởi Backoffice và nhiều workspace hiện hữu; không thêm test framework mới.
- Package wiring required: thêm package-local `test: "vitest run"` và dev dependencies cần trực tiếp cho test (`vitest`, `react-dom`, types tương ứng nếu TypeScript resolution yêu cầu), dùng version range nhất quán với monorepo. Lockfile update là hệ quả package-local.
- Exact full command sau wiring: `pnpm --filter @yuta/ui test`.
- Exact focused command sau wiring: `pnpm --filter @yuta/ui exec vitest run test/button.test.tsx`.

Direct test render native `Button` bằng server markup để xác minh:

- `loading=true` tạo `disabled`, `aria-busy="true"`, `data-loading` và giữ nguyên children/action text;
- explicit `disabled=true` vẫn disabled khi không loading và không tự tạo loading state;
- caller-supplied `aria-busy` được giữ khi loading false;
- loading không tự chèn spinner hoặc thay label.

Không tạo root script hoặc repo-wide convention. Đây là local tooling wiring cho canonical owner, không phải wider architecture/tooling change và không cần Control Tower.

### Backoffice tests

Backoffice tiếp tục dùng existing Vitest runner và `react-dom/server` patterns. Focused command dự kiến:

```text
pnpm --filter @yuta/backoffice exec vitest run test/general-information-form.test.tsx test/google-location-submit-button.test.tsx test/logout-submit-button.test.tsx test/formalites-persistent-draft-state.test.ts test/formalites-persistent-draft-component.test.tsx
```

Tests mock framework pending context tại component boundary, không mock hoặc redefine domain outcomes. Existing action/security/domain tests vẫn bảo vệ behavior ngoài presentation.

## Compatibility / Migration

Existing native `Button loading` consumers chỉ nhận thêm programmatic busy semantics; visible DOM children, label, variants và disabled logic không đổi. Không có current `asChild + loading` consumer cần migration.

Không có data migration, API migration, route migration hoặc broad page rollout. Nếu rollback cần thiết, revert shared `aria-busy` derivation, package-local UI tests/wiring và ba bounded Backoffice presentation changes; Server Actions, schema và persisted data không bị thay đổi.

## Likely Implementation Phases

- `UI / Components`: narrow `Button` busy contract, package-local test wiring và route/shell submit components.
- `Interaction / States`: pending copy, disabled/busy behavior và preservation of redirect/custom-state outcomes ở pilot.
- `Integration / Regression`: focused shared/Backoffice tests, strict OpenSpec/repository checks và later Browser QA across the bounded pilot.

`Foundation / Data` và `Service / Domain` không applicable vì không có data, persistence, API, authorization hoặc domain change.

## Risks / Trade-offs

- [Risk] Adding `aria-busy` to every native `Button loading` consumer may expose duplicate announcements where a route already has a live status region. → Mitigation: contract test chỉ bảo vệ attribute; route audit/Browser QA kiểm tra duplicate announcements và không thêm global live region.
- [Risk] Server-rendered component tests cannot prove actual repeat-click behavior, navigation timing or screen-reader output. → Mitigation: combine direct markup contract tests with focused route tests and mandatory later Browser QA for visible interactions.
- [Risk] Google provider state may be unsafe or unavailable for mutation QA. → Mitigation: require safe development tenant/provider evidence; otherwise record `BLOCKED_BY_ENVIRONMENT`, never use production provider data or fake success.
- [Risk] Package-local Vitest wiring could drift from workspace versions. → Mitigation: reuse existing version family and package manager lockfile; do not create a root convention.
- [Trade-off] `asChild + loading` remains expressible but unsupported. → Mitigation: document the boundary and keep zero current consumers; revisit only with concrete delegated-control need.

## Control Tower Stop Conditions

Stop with `CONTROL_TOWER_REVIEW_REQUIRED` before Tasks if satisfying the Specs requires any change to:

- Server Action completion, return shape, redirect/revalidation/refresh sequencing hoặc transition architecture;
- authorization, session/membership, role/permission hoặc organization/establishment scope;
- provider contract, validation taxonomy, idempotency/operation keys, conflict/retry identity, transactions hoặc persistence;
- runtime topology, shared global async provider hoặc durable repository-wide testing convention.

Externally reported stuck-pending behavior remains `UNVERIFIED`. Thiết kế không thêm speculative React/Next workaround và không thay runtime completion architecture.

## Sensitive Design Gate Assessment

Result: `SENSITIVE_DESIGN_GATE_NOT_REQUIRED`.

Assessment:

- authorization/security boundary: unchanged;
- runtime/data ownership: unchanged;
- migration/destructive data: none;
- payment/fiscal: none;
- legal/privacy: no new behavior; Formalités is non-regression evidence only;
- provider/external contract: unchanged; Google pilot changes presentation before existing action only;
- POS transaction integrity: not in scope;
- irreversible operation: none;
- cross-module durable boundary: none; shared change is a backward-compatible presentation attribute plus package-local tests.

User-requested Design review vẫn được tạo để review exact Design, nhưng nó không phải Sensitive Design Gate theo workflow criteria.

## Open Questions

Không còn unresolved technical decision chặn Tasks. Tasks về sau phải giữ đúng exact pilot allowlist, package-local test wiring và Control Tower stop conditions của Design này.
