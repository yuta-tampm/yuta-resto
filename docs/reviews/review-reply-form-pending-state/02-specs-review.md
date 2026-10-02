Change: review-reply-form-pending-state
Gate: Gate 2 — Requirements Review
Review status: APPROVED
Approval source: explicit current-user instruction after reviewing all 4 Requirements and 9 Scenarios in Vietnamese
Approval recorded by: Codex workflow
Approved: 2026-09-24T23:39:25.0629265+02:00
Approval scope: exact Spec SHA-256 71115d2e59a52edc2e8b46bc3657683d1f329b8c400087d9d15e10fbb1aff834; bounded Design and Design review only; implementation unauthorized
Created: 2026-09-24T23:27:25.2802469+02:00
Schema: yuta-spec-driven
Analysis conclusion: READY_FOR_SPECS
Sensitive change: NO — Sensitive Design Gate NOT_TRIGGERED for the approved presentation-only scope

# Gate 2 Review — Review Reply Form Pending State

## Approved Gate 1 and artifact integrity

The current user explicitly approved Gate 1 for this named change after reviewing the 11 Gate 1 decisions. The Gate 1 packet is now APPROVED. Its exact reviewed Proposal and Analysis bytes remain unchanged.

| Approved path                                                      | SHA-256 / state                                                                    |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| openspec/changes/review-reply-form-pending-state/analysis.md       | e038230d05014147275d5468123ca830697f053563715c4dd5e5d250a1a9b7e8 / MATCH           |
| openspec/changes/review-reply-form-pending-state/proposal.md       | dfa7d8b2c99f0ec96b1926097cbd2a026ea007a2562428250444078ad7793ce9 / MATCH           |
| docs/reviews/review-reply-form-pending-state/01-analysis-review.md | e4f2d04bbebd549021871f90263822b9fe38689bdc50cd90f0c739b8e087a625 / APPROVED packet |

Hash command/tool: Get-FileHash -Algorithm SHA256 -LiteralPath <exact path>; lowercase hexadecimal over exact bytes. The path set above was recomputed before this packet was created. Baseline HEAD remains fc63fef58345a4d99d07b1a4c9a427c679122bb3; unrelated dirty repository-format and untracked VLOCK work was preserved.

## Delta Spec inventory and validation

| Capability                              | Exact delta path                                                                                       | Requirements | Scenarios | SHA-256                                                          |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------ | -----------: | --------: | ---------------------------------------------------------------- |
| reputation/reply-draft-pending-feedback | openspec/changes/review-reply-form-pending-state/specs/reputation/reply-draft-pending-feedback/spec.md |            4 |         9 | 71115d2e59a52edc2e8b46bc3657683d1f329b8c400087d9d15e10fbb1aff834 |

Strict validation command: pnpm exec openspec validate review-reply-form-pending-state --type change --strict --json --no-interactive

Exact strict validation result:

```json
{
  "items": [
    {
      "id": "review-reply-form-pending-state",
      "type": "change",
      "valid": true,
      "issues": [],
      "durationMs": 11
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

Additional scoped checks: pnpm docs:check PASS (36 current documents); pnpm exec prettier --check openspec/changes/review-reply-form-pending-state/specs/reputation/reply-draft-pending-feedback/spec.md PASS. A check that also included the already approved Gate 1 packet reported formatting FAIL for that packet. It is retained byte-for-byte because it embeds the exact reviewed Proposal/Analysis and now carries the human approval record. This formatting result is not relabeled as PASS. No builds, typecheck, runtime tests or Browser QA were run.

## Requirement/scenario summary and Gate 1 traceability

| Requirement                                                  | Scenarios | Gate 1 approved boundary |
| ------------------------------------------------------------ | --------: | ------------------------ |
| Feedback scope limited to the Avis Google reply-draft submit |         2 | Decisions 1–2, 5         |
| Idle label and visible draft-saving indication               |         3 | Decision 3               |
| Disabled and truthful button busy semantics                  |         2 | Decisions 4, 6           |
| Preserve the rest of the form and authoritative save outcome |         2 | Decisions 4–5            |

The Spec uses observable behavior and SHALL/SHALL NOT statements, without a Server Action, API, repository, shared UI or implementation plan. The idle label is Enregistrer; pending wording must convey that the draft is being saved, with Enregistrement du brouillon… as an equivalent example. The Spec does not claim success while pending, alter existing disabled conditions or add whole-form busy semantics.

## Explicit non-requirements and related change isolation

No Server Action, API, database/schema, shared @yuta/ui, authentication, authorization, role, tenant/organization/establishment, assigned-feedback, validation, business-logic, navigation, Google publication or broad loading-foundation change is required. The active async-interaction-feedback-foundation remains outside this change. Its fixed pilot allowlist excludes this form; its QA BLOCKED_BY_ENVIRONMENT state remains separate and unchanged.

## Browser QA and adopted workflow controls

UI_AFFECTING: YES. BROWSER_QA_REQUIRED: YES. Later QA must use the real authenticated /visibilite-reputation/avis route with a selected GOOGLE review and check idle/pending meaning, disabled/busy semantics, layout and basic readability/accessibility. Safe dev review data and observable pending duration remain unverified prerequisites; neither is claimed here.

DEV_USABLE, MANUAL_TEST_READY and HUMAN_PRODUCT_VALIDATION are applicable after Apply under the adopted workflow. This Spec creates no result record for them and does not put workflow controls inside the UI component.

## Sensitive Design, assumptions and recommendation

SENSITIVE_DESIGN_GATE: NOT_TRIGGERED for the exact approved presentation-only scope. A change to authorization, privacy, provider, data/runtime ownership or another durable sensitive boundary would require renewed review. Changed requirement-level assumptions since Analysis: NONE. Remaining QA environment availability is unknown and must be assessed later; it is not a Spec-level blocker.

Recommendation: human Gate 2 review of the exact delta Spec and hash above. This packet does not approve Gate 2, Design or implementation.

## Exact Gate 2 questions

1. Does the Spec preserve the current submit, action, validation, authorization, persistence and business outcomes?
2. Does it define Enregistrer at idle and a narrow visible draft-saving indication while pending?
3. Does it preserve current disabled rules and truthful busy semantics on the submit control?
4. Does it correctly avoid marking the whole form busy or changing textarea availability?
5. Are the readability and accessibility expectations sufficient for this small PAGE_LOCAL change?
6. Are all Server Action, API, schema, shared UI, auth, tenant, assignment, validation, business, navigation and Google-publication non-scope boundaries preserved?
7. Is mandatory later Browser QA on the real authenticated route with a selected GOOGLE review correctly scoped?
8. Are DEV_USABLE, MANUAL_TEST_READY and HUMAN_PRODUCT_VALIDATION correctly treated as post-Apply workflow obligations?
9. Is SENSITIVE_DESIGN_GATE = NOT_TRIGGERED still correct for this exact scope?
10. May the exact Spec hash above proceed to Design only after explicit current-user Gate 2 approval?

The current user may approve this exact Gate 2 packet and Spec hash, request specific changes, or defer. No approval is inferred from strict validation PASS.

## Exact delta Spec snapshot

```markdown
## Purpose

Xác định phản hồi nhìn thấy được và ngữ nghĩa truy cập cho nút lưu bản nháp phản hồi Google trên trang Avis của Backoffice, trong khi giữ nguyên thao tác lưu và các ranh giới nghiệp vụ hiện hữu.

## ADDED Requirements

### Requirement: Phản hồi chờ chỉ thuộc thao tác lưu bản nháp trên trang Avis

Trên `/visibilite-reputation/avis`, khi một review Google được chọn và form lưu bản nháp phản hồi được hiển thị, hệ thống SHALL giới hạn phản hồi chờ mới vào nút submit lưu bản nháp đó. Hệ thống SHALL NOT áp dụng phản hồi chờ này cho các form, route hoặc thao tác khác.

#### Scenario: Form của review Google được chọn

- **WHEN** người dùng xem form phản hồi của một review Google được chọn trên trang Avis
- **THEN** nút lưu bản nháp SHALL dùng phản hồi chờ được định nghĩa trong capability này khi chính thao tác lưu đang pending

#### Scenario: Luồng feedback trực tiếp giữ nguyên

- **WHEN** người dùng xem feedback trực tiếp trên trang Satisfaction
- **THEN** capability này SHALL NOT thêm nút lưu bản nháp phản hồi Google hoặc phản hồi chờ của nút đó

### Requirement: Nhãn nút phân biệt trạng thái rảnh và đang lưu

Khi thao tác lưu bản nháp không pending, nút submit SHALL giữ nhãn nhìn thấy `Enregistrer`. Khi chính thao tác lưu đang pending, cùng nút SHALL hiển thị một indication nhìn thấy, dễ hiểu và riêng cho hành động lưu bản nháp đang diễn ra. Indication SHALL NOT tuyên bố bản nháp đã được lưu thành công trước khi kết quả lưu được xác nhận.

#### Scenario: Nút ở trạng thái rảnh

- **WHEN** form lưu bản nháp được hiển thị và thao tác lưu không pending
- **THEN** nút submit SHALL hiển thị `Enregistrer`

#### Scenario: Đang lưu bản nháp

- **WHEN** thao tác lưu bản nháp của form đang pending
- **THEN** cùng nút submit SHALL hiển thị indication cho biết bản nháp đang được lưu, tương đương về nghĩa với `Enregistrement du brouillon…`

#### Scenario: Không báo thành công sớm

- **WHEN** thao tác lưu vẫn pending và chưa có kết quả từ luồng lưu hiện hữu
- **THEN** indication trên nút SHALL NOT thể hiện rằng bản nháp đã được lưu thành công

### Requirement: Nút giữ trạng thái vô hiệu hóa và bận đúng với thao tác lưu

Trong lúc thao tác lưu pending, nút submit SHALL tiếp tục bị vô hiệu hóa để ngăn kích hoạt lặp và SHALL phản ánh trạng thái bận trung thực qua ngữ nghĩa truy cập `aria-busy`. Khi không pending, các điều kiện vô hiệu hóa hiện hữu SHALL giữ nguyên. Hệ thống SHALL NOT tạo trạng thái chờ độc lập thứ hai hoặc ngữ nghĩa bận mâu thuẫn cho cùng thao tác.

#### Scenario: Nút đang chờ không thể kích hoạt lặp

- **WHEN** thao tác lưu bản nháp đang pending
- **THEN** nút submit SHALL bị vô hiệu hóa và `aria-busy` của nút SHALL phản ánh trạng thái đang bận

#### Scenario: Điều kiện vô hiệu hóa khi rảnh được giữ nguyên

- **WHEN** thao tác lưu không pending nhưng quyền lưu hoặc nội dung hiện tại không cho phép submit theo quy tắc hiện hữu
- **THEN** nút submit SHALL tiếp tục bị vô hiệu hóa theo các quy tắc đó

### Requirement: Các phần còn lại của form và kết quả lưu được bảo toàn

Việc hiển thị phản hồi chờ trên nút SHALL giữ nguyên trạng thái sử dụng của textarea và phần còn lại của form theo hành vi hiện hữu. Hệ thống SHALL NOT yêu cầu trạng thái bận cho toàn form chỉ vì nút lưu đang pending. Validation, quyền, phạm vi dữ liệu, lưu bền vững, thông báo kết quả và hành vi xuất bản Google SHALL tiếp tục do các luồng hiện hữu quyết định.

#### Scenario: Textarea không bị khóa thêm bởi phản hồi chờ

- **WHEN** nút lưu bản nháp đang pending và textarea vốn được phép sử dụng
- **THEN** phản hồi chờ mới SHALL NOT tự vô hiệu hóa textarea hoặc đánh dấu toàn form là bận

#### Scenario: Kết quả lưu đi theo luồng hiện hữu

- **WHEN** thao tác lưu kết thúc với kết quả thành công hoặc lỗi
- **THEN** form SHALL tiếp tục trình bày kết quả theo hành vi lưu và thông báo hiện hữu, không thay đổi validation, quyền, dữ liệu hay xuất bản Google

## Scope and non-requirements

Capability này không yêu cầu thay đổi Server Action, API, database/schema, shared `@yuta/ui`, authentication, authorization, role, tenant/organization/establishment scope, assigned-feedback logic, validation, business logic, navigation, Google publication, hoặc một loading foundation rộng hơn. Change `async-interaction-feedback-foundation` và QA lịch sử của nó nằm ngoài delta này. `SENSITIVE_DESIGN_GATE: NOT_TRIGGERED` chỉ đúng với phạm vi presentation đã được Gate 1 duyệt.

## Verification and workflow obligations

`UI_AFFECTING: YES`; `BROWSER_QA_REQUIRED: YES`. Browser QA sau implementation cần kiểm tra route xác thực thật với review Google được chọn: nhãn rảnh, indication chờ, nút bị vô hiệu hóa, ngữ nghĩa bận trung thực, bố cục và khả năng đọc/truy cập cơ bản. `DEV_USABLE`, `MANUAL_TEST_READY` và `HUMAN_PRODUCT_VALIDATION` là các kiểm soát workflow áp dụng sau Apply, không phải hành vi cần thêm vào component. Không có kết quả QA hoặc kiểm soát hậu Apply nào được xác lập bởi Spec này.
```

## Gate 2 approval record

The review narrative and exact Spec snapshot above preserve the pre-approval `AWAITING_HUMAN_REVIEW` state. After receiving a Vietnamese review of all 4 Requirements and 9 Scenarios, including behavior, triggers, acceptance, UI/UX, test and Browser QA obligations, non-scope, ambiguities, risks, and Gate 1 traceability, the current user explicitly replied `APPROVE Gate 2` for `review-reply-form-pending-state`. The reviewed Spec SHA-256 and pre-approval packet SHA-256 were rechecked before recording approval and matched `71115d2e59a52edc2e8b46bc3657683d1f329b8c400087d9d15e10fbb1aff834` and `94413d71aad71dcd3a0e8b4c567f12e159c3eaec5b5b842644223aa90cda30d7`, respectively. This approval permits only bounded Design and its review. It does not authorize Tasks/TIC, production implementation, tests, VERIFY, Browser QA, sync, archive, deployment, or lifecycle promotion.
