## Context

Xem [proposal.md](proposal.md) để biết động cơ và [delta spec](specs/establishment-profile/spec.md) để biết behavioral contract.

Route hiện có một `GeneralInformationForm` sở hữu toàn bộ client-side draft, truyền draft và các updater xuống các section, và xác định dirty state bằng cách so sánh draft với profile ban đầu. Primary `phone`/`email` nằm trong section Coordonnées; `publicPhone`/`publicEmail` nằm trong cột contact của section Informations publiques. Submit rõ ràng hiện tại đi qua server action, contract validation, permission `establishment.profile.manage` và tenant-scoped repository.

Không có component-interaction test framework riêng trong Backoffice. Convention hiện có dùng Vitest cho pure model tests và `renderToStaticMarkup` cho những assertion component phù hợp.

## Goals / Non-Goals

**Goals:**

- Thêm một explicit, accessible client-side action tại public-contact area mà không redesign page.
- Reuse current form draft và dirty-state mechanisms cho one-time conditional copy.
- Giữ nguyên explicit save, validation, authorization và read-only behavior.
- Tách copy transformation thành pure logic nhỏ, dễ kiểm thử đủ các source/destination combinations.

**Non-Goals:**

- Không thêm server action, API, persistence call hoặc autosave cho copy action.
- Không đổi Establishment Profile contract, repository, schema, permissions hoặc visibility behavior.
- Không thêm form-state hoặc test framework mới.
- Không thay đổi primary/public field layout ngoài control cần thiết, và không đụng Restaurant Knowledge hay capability khác.

## Decisions

### 1. Đặt action trong cột public contact

Đặt một shared `Button` có `type="button"` ngay phía trên `publicEmail` và `publicPhone` trong cột contact của section Informations publiques. Visible French label sẽ diễn đạt đầy đủ hành động, ví dụ `Utiliser les coordonnées principales`; nếu dùng icon `Copy` từ icon system hiện tại thì icon là decorative và có `aria-hidden`.

Vị trí này đặt action cạnh destination mà nó thay đổi, tránh làm primary-contact section trông như nơi persist hoặc đồng bộ dữ liệu. Shared button primitive cung cấp keyboard/touch behavior và focus style hiện có. `type="button"` bắt buộc để action không submit form.

Action được render chỉ khi `canEdit` là `true`. Không disable action chỉ vì cả hai source đang rỗng: scenario both-empty vẫn là một valid no-op và không cần trạng thái control thứ hai.

**Alternative considered:** đặt action trong section Coordonnées cạnh source fields. Không chọn vì kết quả tác động đến public fields ở section kế tiếp và dễ làm người dùng hiểu nhầm primary fields sẽ được liên kết lâu dài.

### 2. Form owner thực hiện one-time draft update

`GeneralInformationForm`, nơi đang sở hữu `draft` và `setDraft`, định nghĩa một callback copy duy nhất và truyền callback đó xuống `PublicInformationSection`. Callback dùng functional state update để transformation luôn đọc snapshot draft mới nhất tại thời điểm click.

`PublicInformationSection` chỉ render control và gọi callback; section không sở hữu state và không gọi persistence. Primary fields tiếp tục thay đổi độc lập qua updater hiện có sau copy.

**Alternative considered:** thêm một server action hoặc gọi save action trực tiếp từ copy control. Không chọn vì vi phạm draft-only requirement, lặp lại authorization/persistence path và làm mất explicit-save semantics.

### 3. Dùng pure model helper cho conditional copy

Thêm một named pure function vào general-information model để nhận current profile draft và trả về draft kế tiếp:

- source `phone` không rỗng thay thế `publicPhone`; source rỗng hoặc `null` giữ destination hiện tại;
- source `email` không rỗng thay thế `publicEmail`; source rỗng hoặc `null` giữ destination hiện tại;
- mọi field khác được bảo toàn.

Hai cặp field được xử lý độc lập trong cùng một transformation. Helper không giữ subscription, linkage hoặc derived-state relationship, nên thay đổi primary sau đó không thể tự đồng bộ public counterpart.

Việc để logic trong model tạo một boundary kiểm thử nhỏ mà không đưa domain behavior vào presentation component. Nó cũng tránh duplicate condition giữa handler và tests.

**Alternative considered:** inline conditional object update trong component. Cách này ít dòng hơn nhưng khó kiểm thử ma trận empty/null/overwrite bằng convention hiện có và đặt behavior đã được spec hóa vào JSX handler.

### 4. Reuse dirty-state và save flow hiện tại

Không thêm dirty flag. Sau transformation, JSON comparison hiện tại tự chuyển form sang dirty khi ít nhất một public value khác profile ban đầu; nếu copy tạo cùng giá trị hoặc là no-op thì pristine/dirty status hiện tại được giữ đúng theo actual draft difference.

Public contact inputs đang bind vào draft nên sẽ phản ánh ngay kết quả. Existing submit control và server action tiếp tục là đường duy nhất persist profile; contract validation tiếp tục chạy khi save. Không thay actions, contract hoặc repository.

**Alternative considered:** gọi một setter cho từng public field hoặc force dirty sau click. Không chọn vì hai update tách rời có thể tạo intermediate state không cần thiết, còn force-dirty sẽ đánh dấu thay đổi khi action là no-op.

### 5. Giữ permission boundary bằng existing `canEdit`

Route đã derive `canEdit` từ permission hiện tại và truyền vào form. Copy control dùng cùng boolean đó và không xuất hiện trong read-only render. Đây chỉ là UI gate cho draft mutation; server-side manage permission vẫn được kiểm tra lại khi explicit save.

Không thêm permission hoặc browser-derived authorization input.

**Alternative considered:** luôn render nhưng disable cho read-only user. Không chọn vì spec yêu cầu read-only user không được cung cấp mutating action, và conditional rendering phù hợp với existing save-control behavior.

### 6. Kiểm thử theo các layer hiện có

- Mở rộng `general-information-model.test.ts` cho pure helper: cả hai source không rỗng; từng source rỗng/null; cả hai rỗng/null; overwrite destination chỉ cho source không rỗng; bảo toàn mọi field khác; và output không liên kết với primary changes sau đó.
- Thêm một focused static-render component test cho `PublicInformationSection`: editable state có button với visible accessible name và `type="button"`; read-only state không render copy action. Reuse Vitest và `renderToStaticMarkup`, không thêm dependency.
- Giữ permission matrix test hiện tại làm regression cho `OWNER`/`MANAGER` manage và `STAFF` read-only.
- Explicit-save/no-auto-persist regression được bảo vệ bởi pure client transformation cùng assertion control là `type="button"`; không thêm server call vào handler. Existing server action validation/authorization tests tiếp tục kiểm soát persistence boundary.

Không cần integration DB test mới vì repository input, schema và mutation path không đổi.

## Risks / Trade-offs

- [Button bên trong form vô tình submit] → đặt `type="button"` rõ ràng và assert trong component test.
- [Empty source xóa public value] → gom condition trong pure helper và bao phủ riêng empty/null combinations.
- [Hai state update tạo kết quả không nhất quán] → dùng một functional draft transformation cho cả hai cặp field.
- [No-op bị đánh dấu dirty] → không force dirty; reuse comparison với profile ban đầu.
- [Read-only UI lộ mutating control] → conditionally render bằng cùng `canEdit` đang bảo vệ save control, đồng thời giữ server authorization khi save.
- [Người dùng hiểu action là ongoing sync] → dùng action wording theo one-time copy, không thêm toggle, linked state hoặc automatic effect.

## Migration Plan

Không cần data migration, schema migration, backfill, API rollout hoặc compatibility phase. Thay đổi có thể deploy cùng Backoffice frontend sau khi tests và checks liên quan pass.

Rollback là revert client form/model/control và các tests đi kèm; persisted profile data không cần rollback vì action chỉ sử dụng save path hiện có và không thay data shape.
