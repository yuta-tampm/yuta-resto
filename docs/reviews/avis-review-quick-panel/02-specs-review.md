Change: avis-review-quick-panel
Gate: 2
Review status: APPROVED
Created: 2026-10-03
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO

## Delegation and earlier approval

CODEX_ONLY; COMMIT_AFTER_TASK: YES, current-user selection. Gate 1: 01-analysis-review.md, APPROVED by /root/quick_panel_gate1; exact Proposal/Analysis bytes unchanged. Scope and exclusions in Proposal remain.

## Exact delta

Path: openspec/changes/avis-review-quick-panel/specs/reputation/review-quick-panel/spec.md
SHA-256: 4fe243a5b98692c4f4207e13f6778ae7a40d2eeccdc09dc649e9898785fc20ba
Hash command: Get-FileHash -Algorithm SHA256.

## Validation

openspec validate avis-review-quick-panel --strict: PASS, exit 0.

## Requirements and questions

Four requirements: explicit panel selection with truthful loading/unavailable; list context and focus on close; existing forms/persistence/unsaved input during open revalidation; responsive accessibility and Satisfaction exclusion. No new authority assumption or requirement-level question identified.

## Exact spec content

## Purpose

Cho phép người dùng xem và xử lý nhanh một avis trong modal bên phải, giữ danh sách và ngữ cảnh điều hướng đang dùng ở phía sau.

## ADDED Requirements

### Requirement: Explicit selection opens the quick panel

Trang Avis SHALL mở modal trượt từ phải khi người dùng chọn một avis, thay cho detail inline. Trang không có lựa chọn rõ ràng SHALL hiển thị danh sách mà không tự mở modal. URL có `selected` SHALL mở modal cho lựa chọn đó; modal SHALL không hiển thị nội dung của avis trước trong lúc đang tải avis mới. Avis không còn truy cập được SHALL có trạng thái unavailable đúng sự thật.

#### Scenario: Open an item from the list

- **WHEN** người dùng chọn một avis trong danh sách
- **THEN** modal bên phải SHALL mở cho đúng avis và không có detail inline bên dưới hoặc cạnh danh sách

#### Scenario: Initial list and direct link

- **WHEN** người dùng truy cập Avis không có `selected`, rồi truy cập URL có `selected`
- **THEN** lần đầu SHALL chỉ có danh sách; lần sau SHALL mở modal của avis được chỉ định hoặc thông báo unavailable

### Requirement: Closing preserves the list context

Mở và đóng modal SHALL giữ bộ lọc, thứ tự, trang phân trang và vị trí cuộn danh sách. Đóng bằng nút có accessible name, Escape hoặc backdrop SHALL trở lại danh sách; sau thao tác mở từ một dòng, focus SHALL trở lại dòng đó khi còn tồn tại. Filter/search/pagination SHALL tiếp tục có semantics hiện có. Đóng modal SHALL không tự Save hoặc publish.

#### Scenario: Process a review on a later page

- **WHEN** người dùng mở và đóng avis từ trang 2 của danh sách đã lọc
- **THEN** trang 2, bộ lọc và vị trí cuộn SHALL được giữ; focus SHALL trở về dòng đã mở

### Requirement: Existing processing remains usable in the panel

Modal SHALL dùng cùng thông tin và các thao tác xử lý được cấp quyền hiện có: status/assignee, manual draft và internal notes. Các Save SHALL giữ validation, pending/success/error feedback và persistence hiện có; modal SHALL giữ lựa chọn và unsaved input qua revalidation/retrieval khi còn mở. Quyền server, tenant scope và provider semantics SHALL không thay đổi; UI không cho phép publication/AI mới.

#### Scenario: Save a manual draft

- **WHEN** người dùng được cấp quyền lưu draft trong modal
- **THEN** pending và success SHALL hiển thị; modal SHALL còn mở đúng avis và draft SHALL persist qua reload

#### Scenario: Preserve unsubmitted writing during a local save

- **WHEN** người dùng có draft chưa lưu rồi lưu một internal note cho cùng avis
- **THEN** modal SHALL giữ draft chưa lưu và đúng avis trong khi note persist

### Requirement: Accessible responsive quick processing

Modal SHALL có tên, mô tả, focus containment và keyboard operation. Nội dung SHALL cuộn trong modal với header/close dễ truy cập; mobile SHALL dùng chiều rộng màn hình. 1440/1024/768/390 SHALL không có horizontal overflow hoặc clipping thao tác xử lý. Satisfaction SHALL giữ bố cục và semantics hiện tại.

#### Scenario: Mobile keyboard and scroll

- **WHEN** người dùng mở avis trên màn hình 390px, cuộn đến editor và dùng keyboard/close
- **THEN** nội dung và Save SHALL truy cập được; focus SHALL ở trong modal khi mở và trở về danh sách khi đóng

## Historical independent verdict

Reviewer: /root/quick_panel_gate2
Verdict: CHANGES_REQUESTED. Original Vietnamese spec conflicts with current-user English technical-documentation instructions. No behavior or authority blocker found. Reviewed original spec SHA-256: 4fe243a5b98692c4f4207e13f6778ae7a40d2eeccdc09dc649e9898785fc20ba. This candidate was translated without scope/behavior changes; earlier Gate 1 was invalidated because its artifacts were translated too. New Gate 2 review waits for fresh Gate 1 approval.

## Current English candidate

Earlier CHANGES_REQUESTED is preserved above. Gate 1 now APPROVED by /root/quick_panel_gate1_english for current Proposal/Analysis. Language-only correction; no changed requirement or authority assumption. Strict validation of current candidate exited 0.

Current path: openspec/changes/avis-review-quick-panel/specs/reputation/review-quick-panel/spec.md
Current SHA-256: 1738b33a7cd08c9a09d76a1c08a12b097be77ded8d2d907ecfd46d0d0ef21bc1

## Purpose

Provide quick viewing and processing of an Avis item in a right-side modal while keeping the current list and its navigation context behind it.

## ADDED Requirements

### Requirement: Explicit selection opens the quick panel

The Avis page SHALL open a modal sliding in from the right when the user selects a review, replacing inline detail. Without explicit selection the page SHALL show the list without automatically opening the modal. A URL containing `selected` SHALL open the modal for that selection. While loading a new item, the modal SHALL NOT display the previous item's content. An inaccessible selected item SHALL have a truthful unavailable state.

#### Scenario: Open an item from the list

- **WHEN** a user selects a review in the list
- **THEN** the right-side modal SHALL open for that item and no inline detail SHALL appear below or beside the list

#### Scenario: Initial list and direct link

- **WHEN** a user visits Avis without `selected` and then visits a URL containing `selected`
- **THEN** the first visit SHALL show only the list and the second SHALL open the requested review or its unavailable state

### Requirement: Closing preserves the list context

Opening and closing the modal SHALL preserve filters, ordering, pagination and list scroll position. An accessibly named close button, Escape and backdrop dismissal SHALL return to the list. After opening from a row, focus SHALL return to that row when it still exists. Filter/search/pagination SHALL retain existing semantics. Closing SHALL NOT automatically Save or publish.

#### Scenario: Process a review on a later page

- **WHEN** a user opens and closes an item from page 2 of a filtered list
- **THEN** page 2, filters and list scroll position SHALL remain, and focus SHALL return to the opening row

### Requirement: Existing processing remains usable in the panel

The modal SHALL expose the same review information and authorized existing status/assignee, manual-draft and internal-note actions. Saves SHALL retain current validation, pending/success/error feedback and persistence. While open, the modal SHALL preserve the selected item and unsaved input across revalidation/retrieval. Server permissions, tenant scope and provider semantics SHALL remain unchanged, without enabling new publication or AI behavior.

#### Scenario: Save a manual draft

- **WHEN** an authorized user saves a draft in the modal
- **THEN** pending and success SHALL be visible, the modal SHALL stay open for the same review, and the draft SHALL persist across reload

#### Scenario: Preserve unsubmitted writing during a local save

- **WHEN** a user has an unsaved draft and saves an internal note for the same review
- **THEN** the modal SHALL preserve the unsaved draft and selected review while the note persists

### Requirement: Accessible responsive quick processing

The modal SHALL have an accessible name, description, focus containment and keyboard operation. Its content SHALL scroll within the modal while header/close remain accessible. Mobile SHALL use the screen width. At 1440/1024/768/390, processing controls SHALL remain accessible without horizontal overflow or clipping. Satisfaction SHALL retain its existing layout and semantics.

#### Scenario: Mobile keyboard and scroll

- **WHEN** a user opens a review at 390px, scrolls to the editor and uses keyboard/close
- **THEN** content and Save SHALL be accessible, focus SHALL stay in the open modal and return to the list after closing

## Current independent approval

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW
Independent reviewer: /root/quick_panel_gate2_english
Independent review evidence: APPROVED; no material findings; current English delta/Proposal/Analysis hashes rechecked.
Approval recorded by: Codex workflow
Approved: 2026-10-03T08:29:06.4579386+02:00
