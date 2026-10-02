# Gate 3 — Formalités Legal Template Foundation

Change: formalites-legal-template-foundation
Schema: yuta-spec-driven
Classification: CROSS_MODULE / DATA_OWNERSHIP_SENSITIVE / LEGAL_PRIVACY_SENSITIVE
Review status: APPROVED
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-08T09:48:04Z
Approval scope: Gate 3 unchanged; Sync/Archive complete; separately approved Knowledge Apply PASS; Control Tower READY_FOR_DONE handoff
Reviewed packet SHA-256: 26df96783d569d0daaca89485be3a21ed8de5589d7e7719e12f95c75d39b1ebc
Finish outcome: COMPLETED
Workflow status: READY_FOR_DONE
Integrity status: RE-ESTABLISHED — explicit two-index integrity-only rebaseline
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
QA: PASS
UI_AFFECTING: NO
BROWSER_QA_REQUIRED: NO
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Sync result: COMPLETED
Main-spec validation: PASS
Archive authorization: AUTHORIZED_BY_CURRENT_USER
Archive location: D:/working/yuta/yuta-resto/openspec/changes/archive/2026-09-08-formalites-legal-template-foundation
Knowledge consolidation: COMPLETED
Knowledge review: APPROVED
RELEASE_FOLLOW_UP: REQUIRED — separately gated before future production use
Production: NOT AUTHORIZED

## Current review scope

Hồ sơ này chỉ đưa bounded foundation tới human Gate 3, không tự approve Gate 3 hoặc authorize Sync/Archive. Tasks **17/17** sau targeted B2 thực chạy. Các kết quả thất bại lịch sử vẫn giữ nguyên dưới accepted-failure section, không gọi toàn bộ repository test matrix xanh.

Repository `D:/working/yuta/yuta-resto`; HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Fresh resume baseline `2026-09-08T09:17:33.983Z`, bao gồm tracked và non-ignored untracked paths. Dirty checkout có concurrent Pointage/UI/Knowledge work; baseline không được coi là clean HEAD. Current delivery không nhận ownership của những thay đổi đó.

## Approved planning, gates and integrity

| Source                                                                                                     | Current SHA-256 / decision                                                                                                |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `docs/reviews/formalites-legal-template-foundation/01-analysis-review.md`                                  | `bf141feb65b3a6a0253148088c15bee639d16b83c5367e0700b135fa21a869d1`; Gate 1 APPROVED, 26/26 protected rows unchanged       |
| `docs/reviews/formalites-legal-template-foundation/02-specs-review.md`                                     | `791f79b393b4bbd746a40952baf0f06d706339d61eb72f26ef11e200ddab2ff2`; Gate 2 APPROVED, 29/29 unchanged                      |
| `docs/reviews/formalites-legal-template-foundation/02b-design-review.md`                                   | `f2510ef533646970e92690b9a08aa6e40ce79f276cd0be520f0724ffe8ba2c71`; Sensitive Gate 2b APPROVED, semantic Design unchanged |
| `openspec/changes/formalites-legal-template-foundation/proposal.md`                                        | `61d51cce2ddc75acd050ca0317865e3ddc60e38f41c8e7e2047e4d2a28a9951c`                                                        |
| `openspec/changes/formalites-legal-template-foundation/analysis.md`                                        | `c40e395a230518bb5ff2073204fb44ae083eee5a2b833898c58287d326d6a4c1`                                                        |
| `openspec/changes/formalites-legal-template-foundation/design.md`                                          | `d6db50dc5db2a64e29e8b8a5148011bda1b4bb46127101fdf188e3b7a3526cf5`                                                        |
| `openspec/changes/formalites-legal-template-foundation/specs/formalites/legal-template-foundation/spec.md` | `b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418`                                                        |
| `openspec/changes/formalites-legal-template-foundation/.openspec.yaml`                                     | `26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820`                                                        |
| `openspec/changes/formalites-legal-template-foundation/tasks.md`                                           | `38c79ae3abf6a8a0547cf35acfc036276ed7d099a304e9b487f0712e0098d96b`; completed 17/17, documentary execution evidence       |

Original approved planning Tasks hash `f044288dfacf994f1ca197ca7e4c0fff1c084d52e4b31235294116a2f53d03f1`; original approved Gate 2b packet `917a344589e25531208cb56c60439a8f1cab73700c506cc8ef6693b605cea93e`. Subsequent Tasks checkbox/evidence and review integrity/status metadata are authorized workflow progress, not semantic planning rewrites.

Original Gate 2b 44 rows: 40 original exact matches; root db-cloud index/journal contain only approved D8 additive implementation; auth/schema indexes match the explicit two-hash rebaseline below. The later two Pointage incident context rows remain attribution-only. Proposal, Analysis, Specs, Design, earlier gates, dedicated implementation and migration bytes rechecked before B2. No silent rebaseline or semantic reopening.

| Approved shared baseline                | SHA-256                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| `packages/auth/src/index.ts`            | `464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a` |
| `packages/db-cloud/src/schema/index.ts` | `eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944` |

Only additive `export * from './pointage-continuation';` and `export * from './pointage-raw-clocking';` reconstruct earlier checkpoint hashes when removed in memory. No file was reverted. Another shared-index drift invalidates this review; no authorization to absorb it.

## Design and implementation summary

D1–D10 giữ nguyên. Formalités owns dedicated GLOBAL_YUTA_FORMALITES_TEMPLATES; `@yuta/db-cloud` owns persistence. Three global tables, no tenant owner/context/nullable fallback, no ordinal/actor audit/evidence/lifecycle fields. UUIDv7 identity/version; one active mutable draft; 0..N immutable Versions; partial active index, containment restrictive FKs and exact source-draft/revision uniqueness.

Eight facade methods have fixed first-operation guards; read/create-edit/freeze map only to read/draft.manage/review.submit. Exactly five existing authorization operations remain:
`formalites.template.read`, `formalites.template.draft.manage`, `formalites.template.review.submit`, `formalites.template.publish`, `formalites.template.retire`.
No new role/principal/grant, inheritance, wildcard/prefix/caller policy, TenantContext reuse or tenant bypass. YUTA_ADMIN keeps explicit grants, YUTA_SUPPORT none. Publish/retire have no domain execution.

READ COMMITTED identity→draft locks, expected revision and one-row checks. Freeze reads one exact revision, computes SHA-256, inserts/verifies full binding, closes draft atomically, succeeds only after commit. Exact locator replay requires fresh guard; response uncertainty is not claimed success and never becomes latest-revision retry. Normal paths never update a frozen binding; privileged DB tamper-proofing is not claimed.

Canonical profile `formalites.legal-source.utf8-lf.v1`: strict UTF-8, no BOM, CRLF/CR→LF only before freeze, no Unicode normalization/trim/final-newline insertion, exact bytea/SHA-256 and immutable profile/content/applicability. Nine declaration dimensions, explicit unknown/assertions and empty initial canonical-reference allowlist; no legal enum authority or matcher.

No runtime/UI/session change, actual template/legal content, legal review/evidence, publication/qualification/retirement, generation/PDF/signature/Documents/provider, production enablement or canonical Knowledge/lifecycle promotion.

### Source/test aliases

All paths below are relative to the repository root.

- Schema: `packages/db-cloud/src/schema/formalites-legal-templates.ts`.
- Domain: `packages/db-cloud/src/formalites-legal-template-domain.ts`.
- Facade: `packages/db-cloud/src/formalites-legal-template-repository.ts`.
- DomainTest: `packages/db-cloud/test/formalites-legal-template-domain.test.ts`.
- Guard/schema/normal-path unit tests: `packages/db-cloud/test/formalites-legal-template-repository.test.ts`.
- DB QA: `packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`.
- Auth: existing `packages/auth/src/formalites-template-system-authorization.ts`, `session.ts` and their tests, unchanged by Formalités.
- C1–C10 refer to exact approved command rows in completed Tasks and executed evidence below. Q1–Q11 refer to actual DB QA, not browser QA.

DB QA locations: Q1 line216; Q2/Q7/Q9/Q11 line262; Q3 line339; edit-wins line353; freeze-wins line386; concurrent freeze line402; response loss line421; rollback line455; corruption parameterization line509; invalid input line558; Q10 line594; durable constraint checks line627. Independent-connection/ordering harness lines101–214. Test-only injection wraps actual DB transactions; no production hook/evaluator was added.

## TECHNICAL VERIFY

VERIFY: PASS

Approved 14 requirements / 42 scenarios match unchanged design and 11-file implementation. Fresh B2 resolves the conditional regression acceptance; B1 is explicitly accepted baseline failure, not hidden or repaired. No remaining critical implementation or authority issue found. Independent real persistence/concurrency evidence is retained at unchanged hashes; current auth/tenant/unit/type/docs/architecture/build checks were rerun.

### Requirement coverage — 14/14

| Exact requirement                                                                | Scenario coverage | Implementation / actual evidence                                  | Result |
| -------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------- | ------ |
| R1 — Global template foundation giữ dedicated ownership boundary                 | S1–S2             | Schema; Facade:162–234; Q2/Q10                                    | PASS   |
| R2 — Foundation sử dụng exact existing system operations và fail closed          | S3–S7             | Facade:162–400; Auth; guard-order unit tests; Q10; B1/B2          | PASS   |
| R3 — Stable Template Identity không bị repurpose qua version                     | S8–S10            | Schema; Facade:162–186,319–400; Q2/Q11                            | PASS   |
| R4 — Một active mutable Working Draft không phải canonical version               | S11–S14           | Schema active index; Facade:236–317; Q2/Q3/Q4/Q5                  | PASS   |
| R5 — Freeze tạo exact durable immutable version binding                          | S15–S17           | Facade:319–400; Q2/Q4/Q6/Q7                                       | PASS   |
| R6 — Frozen content profile và applicability không thể sửa tại chỗ               | S18–S20           | Domain:42–63; Facade verifiedVersion/replay; Q7/Q8                | PASS   |
| R7 — Canonical Legal Source Profile V1 giữ exact textual byte rules              | S21–S24           | Domain:22–60; DomainTest; Q7                                      | PASS   |
| R8 — SHA-256 được tính trên exact canonical bytes                                | S25–S27           | Domain:62–63; Facade:51–102; Q7/Q8/Q11                            | PASS   |
| R9 — Applicability change tạo Version khác dù content checksum giống nhau        | S28–S29           | Facade:319–400; Schema no checksum uniqueness; Q9                 | PASS   |
| R10 — Applicability assertions không tạo canonical truth hoặc automatic matching | S30–S32           | Domain:66–149; DomainTest; Q9                                     | PASS   |
| R11 — Repeated freeze cùng draft revision không tạo duplicate Versions           | S33–S34           | Facade:146–160,319–400; Q5                                        | PASS   |
| R12 — Version ordinal không phải applicability selector                          | S35–S36           | Schema no ordinal; Facade:217–234; Q9/Q11                         | PASS   |
| R13 — Bounded internal traceability không lưu private legal evidence             | S37–S39           | Strict Domain input/schema; Q6/Q11; no actor/evidence persistence | PASS   |
| R14 — Freeze và foundation completion không triển khai excluded capabilities     | S40–S42           | Schema/Facade/export inventory; Q11; exact source integrity       | PASS   |

### Scenario coverage — 42/42

Every exact title below comes from the approved delta. C2/Q references point to the actual two-database 16/16 executions; C1 is the 87/87 focused tests, supplemented by code/absence inspection. Scenario IDs are document-order IDs, not a claim of 42 separately named automated tests. S35 and S37 use explicit absent-premise evidence, not new ordinal/actor features.

| Exact scenario                                                           | Requirement / source mapping above | Tasks       | Executed evidence | Observable outcome verified                                                                                                     | Result                            |
| ------------------------------------------------------------------------ | ---------------------------------- | ----------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| S1 — Global identity không cần restaurant owner                          | R1                                 | 2.3,3.2     | C2,C4 / Q2,Q10    | Admin không membership có global access; owner fields absent                                                                    | PASS                              |
| S2 — Tenant fallback không tạo global access                             | R1                                 | 2.3,3.2     | C1,C2,C4 / Q10    | Tenant input/missing scope/fake organization không cấp authority                                                                | PASS                              |
| S3 — Exact read và draft operations của trusted admin                    | R2                                 | 2.3,3.2     | C1,C2,C4 / Q10    | Mỗi read/manage method gọi đúng literal op trước query                                                                          | PASS                              |
| S4 — Freeze cần exact submission operation                               | R2                                 | 2.3,2.5,3.2 | C1,C2,C4 / Q10    | Freeze không nhận read/manage context; guard exact review.submit                                                                | PASS                              |
| S5 — Support và restaurant-only actors bị denied                         | R2                                 | 2.3,3.2     | C1,C2,C4 / Q10    | Support và restaurant-only roles denied, zero template lookup                                                                   | PASS                              |
| S6 — Untrusted hoặc unsupported authority fail closed                    | R2                                 | 2.3,3.2     | C1,C2,C4 / Q10    | Anonymous/missing/disabled, unknown/wildcard/prefix/policy input denied                                                         | PASS                              |
| S7 — System allow không cấp tenant resource access                       | R2                                 | 3.2,3.4     | C2,C4,C5 / Q10    | Global allow không cấp tenant access; existing denial unchanged                                                                 | PASS                              |
| S8 — Nhiều revisions cùng legal purpose                                  | R3                                 | 2.3,2.4,3.4 | C2 / Q2           | Same purpose identity cho new drafts/versions, different version IDs                                                            | PASS                              |
| S9 — Fundamental legal purpose thay đổi                                  | R3                                 | 2.3,2.7,3.4 | C1,C2 / Q2,Q8     | Purpose không có update path; fundamental purpose mới dùng new identity                                                         | PASS                              |
| S10 — Metadata không được dùng làm version bypass                        | R3                                 | 2.7,3.4     | C1,C2 / Q8        | Presentation label không mở metadata/version-binding patch                                                                      | PASS                              |
| S11 — Identity chưa có immutable version                                 | R4                                 | 1.2,2.3,3.4 | C1,C2 / Q2        | Identity zero versions; draft được đọc riêng, không canonical Version                                                           | PASS                              |
| S12 — Active draft thứ hai bị ngăn                                       | R4                                 | 1.3,2.4,3.3 | C2,C3 / Q3        | Independent competing create: maximum one active row                                                                            | PASS                              |
| S13 — Edit mutable working draft                                         | R4                                 | 2.4,3.4     | C2 / Q2,Q3        | Edit active revision persists content/envelope; no Version created                                                              | PASS                              |
| S14 — Continuation sau freeze giữ historical candidates                  | R4                                 | 2.4,2.6,3.4 | C2 / Q2,Q5        | After freeze new draft, retained historical candidates unchanged                                                                | PASS                              |
| S15 — Freeze exact candidate                                             | R5                                 | 2.5,3.4     | C2 / Q2,Q7        | Exact template/version/profile/bytes/hash/applicability binding from one revision                                               | PASS                              |
| S16 — Competing edit không tạo mixed snapshot                            | R5                                 | 2.4,2.5,3.3 | C2 / Q4,Q6        | Both winner orderings; no mixed snapshot or partial durable binding                                                             | PASS                              |
| S17 — Reopen durable foundation state                                    | R5                                 | 2.3,2.7,3.4 | C2 / Q2           | Independent client reread stable identity/draft/version                                                                         | PASS                              |
| S18 — Frozen content hoặc applicability bị edit                          | R6                                 | 2.7,3.4     | C1,C2 / Q8        | Frozen content/applicability edits absent/denied; exact tuple unchanged                                                         | PASS                              |
| S19 — Formatting được coi là minor change                                | R6                                 | 2.1,2.7,3.4 | C1,C2 / Q7,Q8     | No post-freeze trim/Unicode normalization/format cleanup                                                                        | PASS                              |
| S20 — Content profile tiến hóa                                           | R6                                 | 2.1,2.7,3.4 | C1,C2 / Q8        | Unknown profile rejected; historical V1 kept, not recanonicalized                                                               | PASS                              |
| S21 — Canonical source không BOM và dùng LF                              | R7                                 | 2.1,3.4     | C1,C2 / Q7        | CRLF/CR canonicalize before freeze; strict UTF-8/LF persisted, leading BOM rejected                                             | PASS                              |
| S22 — Invalid UTF-8 không được âm thầm sửa thành reviewed content        | R7                                 | 2.1,3.4     | C1,C2 / Q7        | Malformed/truncated/overlong UTF-8 rejected, no silent replacement                                                              | PASS                              |
| S23 — Unicode sequence không bị normalize                                | R7                                 | 2.1,3.4     | C1,C2 / Q7        | Composed/decomposed Unicode exact sequences stay distinct                                                                       | PASS                              |
| S24 — Meaningful whitespace được giữ                                     | R7                                 | 2.1,3.4     | C1,C2 / Q7        | Leading/trailing spaces, tabs, blank lines and final-newline presence preserved                                                 | PASS                              |
| S25 — Independent checksum recomputation                                 | R8                                 | 2.1,2.7,3.4 | C1,C2 / Q7        | Independent SHA-256 from actual reread bytea bytes matches                                                                      | PASS                              |
| S26 — Checksum không khớp bytes                                          | R8                                 | 2.5,2.7,3.4 | C1,C2 / Q8        | Caller checksum input not authority; corrupt digest/bytes fail closed                                                           | PASS                              |
| S27 — Checksum không phải legal evidence                                 | R8                                 | 2.7,3.4     | C1,C2 / Q11       | Matching digest yields content identity only, no legal-proof fields/effect                                                      | PASS                              |
| S28 — Envelope đổi nhưng content giữ nguyên                              | R9                                 | 2.2,2.6,3.4 | C2 / Q9           | Same bytes/hash with changed applicability produces distinct Version                                                            | PASS                              |
| S29 — Same checksum không cho qualification inheritance                  | R9                                 | 2.6,3.4     | C1,C2 / Q9        | Checksum equality cannot merge candidates or inherit qualification                                                              | PASS                              |
| S30 — Approved owner reference và assertion được phân biệt               | R10                                | 2.2,3.4     | C1,C2 / Q9        | Reference representation distinct; no currently approved binding, empty allowlist denies claims; assertions not canonical truth | PASS                              |
| S31 — Unsupported hoặc unknown applicability                             | R10                                | 2.2,3.4     | C1,C2 / Q9        | Missing/unknown/unmapped never defaults to unrestricted/matched                                                                 | PASS                              |
| S32 — Asserted conditions không được thực thi như engine                 | R10                                | 2.2,3.4     | C1,C2 / Q9        | Conditions/dates/exclusions preserved as declarations, no evaluator                                                             | PASS                              |
| S33 — Retry freeze sau response loss                                     | R11                                | 2.6,3.3     | C2 / Q5           | Lost response then exact retry returns same stable Version, count=1                                                             | PASS                              |
| S34 — Concurrent freeze của cùng revision                                | R11                                | 1.3,2.6,3.3 | C2 / Q5           | Independent concurrent exact-revision freeze commits at most one Version                                                        | PASS                              |
| S35 — Optional ordinal unique trong template                             | R12                                | 1.2,2.7,3.4 | C1,C2 / Q11       | Conditional premise absent: no ordinal field/parameter/export; stable IDs remain                                                | PASS — conditional premise absent |
| S36 — Highest Version chưa phải applicable Version                       | R12                                | 2.7,3.4     | C1,C2 / Q9        | History ordering never implies applicable/reviewed/qualified selection                                                          | PASS                              |
| S37 — Minimal internal mutation attribution                              | R13                                | 1.2,2.7,3.4 | C1,C2 / Q11       | Conditional premise absent: no actor persistence; verify no actor/email/name/contact columns                                    | PASS — conditional premise absent |
| S38 — Private evidence không được nhét vào foundation                    | R13                                | 2.2,2.7,3.4 | C1,C2 / Q11       | Strict extra/evidence-field denial; no evidence CRUD/storage or reviewer principal                                              | PASS                              |
| S39 — Security allow không là completed mutation hoặc retention approval | R13                                | 2.5,3.3,3.4 | C2 / Q6,Q11       | Auth allow + failed transaction is not freeze completion or privacy/retention approval                                          | PASS                              |
| S40 — Freeze không gửi review và không qualify                           | R14                                | 2.5,3.4     | C2 / Q2,Q11       | Freeze only immutable candidate, no review receipt/evidence/qualification                                                       | PASS                              |
| S41 — Publish hoặc retire authority không tạo domain execution           | R14                                | 2.3,2.7,3.4 | C1,C2,C4 / Q11    | Publish/retire grants unchanged; domain methods absent, no fallback execution                                                   | PASS                              |
| S42 — Specs hoặc foundation được hoàn tất                                | R14                                | 3.5,3.6     | C7–C10 / Q10,Q11  | Exact source path/hash scope; no app/provider/content/Knowledge/lifecycle/production promotion                                  | PASS                              |

### TECHNICAL COMPLIANCE MATRIX

Phase coverage: Foundation / Data 8/8; Service / Domain 13/13; Integration / Regression 8/8. No UI/Interaction phase invented. Authority chain: approved Tasks embedded contracts, referenced unchanged Design D1–D10, root and db-cloud AGENTS, existing architecture/cloud ownership/authorization contracts and Workflow v3. Exact authoritative paths/hashes remain in Tasks and approved gate packets.

Matrix source: this exact block, UTF-8 LF bytes between the markers, excluding marker lines. Matrix SHA-256: `8968ad71ecafe26f768d12adc5a4614a9678c2b096afe1874a90a2f49222d503`.

<!-- TECHNICAL_MATRIX_BEGIN -->

| Rule | Authority -> implementation -> executed evidence                                                                                                                                              | Result |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| F1   | D1–D2 global ownership -> Schema/0020 -> Q1 exact 3 tables, no tenant columns/imports                                                                                                         | PASS   |
| F2   | D2/D7 identity separation -> Schema/Facade -> UUIDv7, zero/two-version history, no repurpose/ordinal/actor method/field, Q2/Q11                                                               | PASS   |
| F3   | D2/D5 exact bytea -> Schema/Domain -> real Q7 NUL/Unicode roundtrip plus copied codec tests                                                                                                   | PASS   |
| F4   | D2–D4 durable constraints -> Schema/0020/Facade -> Q1/Q3/Q4/Q5 direct constraint/race denials                                                                                                 | PASS   |
| F5   | D2 full binding/restrictive references -> Schema -> 22 columns, NOT NULL/check/FK inventory and same-hash distinct versions Q9                                                                | PASS   |
| F6   | D8 additive migration -> SQL/snapshot/journal -> 55 old tables unchanged, 0019 retained, re-generation no-op, protected hashes                                                                | PASS   |
| F7   | D2/D7 exclusions -> exact path/schema/facade inventory -> Q11, no legal seed/evidence/lifecycle/app addition                                                                                  | PASS   |
| F8   | D9–D10 safe additive migration/rollback -> exact new disposable container -> clean/incremental preservation, no down/reset of existing resources                                              | PASS   |
| S1   | D1 fixed guard/fresh replay authorization -> Facade -> all 8 method operation-order tests + real Q10 denials                                                                                  | PASS   |
| S2   | D1 closed operations -> unchanged auth + strict inputs -> C1/C4, protected hashes, no caller policy/context                                                                                   | PASS   |
| S3   | D2/D7 stable purpose/mutable draft -> Facade -> Q2 retained purpose, frozen edit denied, excluded methods absent                                                                              | PASS   |
| S4   | D3 lock/revision contract -> Facade -> READ COMMITTED parent then draft, Q3/Q4 and overflow/containment denials                                                                               | PASS   |
| S5   | D4 atomic snapshot/freeze -> Facade -> Q2/Q4 full tuple, Q6 real inserted-row rollback before close                                                                                           | PASS   |
| S6   | D4 exact locator replay -> Facade -> Q5 independent concurrent freeze/response loss/new draft retry, no checksum dedup                                                                        | PASS   |
| S7   | D5 strict profile -> Domain -> C1 malformed/BOM cases + Q7 persisted LF and invalid input rejection                                                                                           | PASS   |
| S8   | D5 no source rewriting -> Domain/Facade -> C1 Unicode/whitespace edge cases, Q7 independent frozen bytes                                                                                      | PASS   |
| S9   | D4–D5 exact SHA-256 -> Domain/Facade -> independent digest and Q8 corrupt bytes/digest/profile failures, caller hash rejected                                                                 | PASS   |
| S10  | D6 non-executable declaration -> Domain -> all nine unknown dimensions, copied assertions, empty reference allowlist, Q9                                                                      | PASS   |
| S11  | D7 normal-path immutable binding -> Facade -> no patch/upsert/delete/reopen; Q2/Q8/Q9 independent reads and changed-envelope Version                                                          | PASS   |
| S12  | D2/D6–D7 exclusions -> Schema/Facade -> exact field/method inventory, Q11; ordinal/actor conditional premises absent                                                                          | PASS   |
| S13  | D1/D8 runtime/auth separation -> Facade/export graph -> unchanged dedicated auth/tenant/app behavior, two exact approved shared rebaselines, scoped source diff and fresh architecture exit 0 | PASS   |
| I1   | D9/operations disposable verification -> new tmpfs container -> sanitized identity before writes, no existing resource reuse                                                                  | PASS   |
| I2   | D9 clean/incremental migration -> 0020 -> both command exits 0 and exact three-point row/schema/index/constraint hashes                                                                       | PASS   |
| I3   | D3/D4 independent races -> DB QA -> four distinct real backends, observed lock waits and controlled winner ordering                                                                           | PASS   |
| I4   | D5–D7 durable binding -> DB QA -> Q7/Q8/Q9 raw bytes/digest/corruption/changed-applicability outcomes                                                                                         | PASS   |
| I5   | D1/D9 tenant compatibility -> Auth/Facade/tenant/C5 -> Q10, preserved tenant data, fresh auth64/tenant11, unchanged B2 owner27/Pointage8; B1 accepted baseline failure, C5 still exit 1       | PASS   |
| I6   | Workflow exact execution/attribution -> command table and raw full-tree inventory -> actual failures/skips recorded; no protected/source edits hidden                                         | PASS   |
| I7   | D9 mandatory non-browser Q1-Q11 -> real clean/incremental DB QA retained at exact hashes, Q10 regression acceptance complete with actual B2 passes and explicit B1 decision                   | PASS   |
| I8   | Workflow complete delivery -> unchanged 14/42 mapping + 17 tasks + this packet -> 29/29 matrix PASS, separate VERIFY/QA/human Gate3, no Sync/Knowledge/lifecycle/production promotion         | PASS   |

<!-- TECHNICAL_MATRIX_END -->

TECHNICAL IMPLEMENTATION COMPLIANCE: PASS

## QA

QA: PASS
UI_AFFECTING: NO
BROWSER_QA_REQUIRED: NO

Non-browser runtime/data QA is required and was performed; NOT_APPLICABLE is not used. Original clean/incremental Formalités disposable runs each execute 16 tests with zero skips, retained under unchanged dedicated source/schema/test/migration hashes. This continuation executes only authorized B2 database suites; no fabricated rerun of original Formalités QA.

| QA case | Real acceptance evidence                                                                                                                                                        | Result |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Q1      | Clean/incremental migrations and exact preservation of 55 existing tables/616 columns; both 21-entry tips valid.                                                                | PASS   |
| Q2      | Real authorized admin without membership creates, edits, freezes and independently reopens identity/draft/version/history.                                                      | PASS   |
| Q3      | Distinct connection draft-creation race and stale edit denial; at most one active draft.                                                                                        | PASS   |
| Q4      | Controlled edit-wins and freeze-wins orderings, observed DB locks; no mixed snapshot.                                                                                           | PASS   |
| Q5      | Concurrent same-revision freeze, committed response-loss exact retry and old-draft replay after new active draft return one Version.                                            | PASS   |
| Q6      | Actual insert observed inside transaction, injected failure before close; independent reads show rollback, zero Version and original active revision.                           | PASS   |
| Q7      | Real bytea driver NUL/Unicode/whitespace/LF roundtrip; independent SHA-256; invalid UTF-8/BOM/profile fail closed.                                                              | PASS   |
| Q8      | Normal frozen edit denied, copied returns cannot mutate persisted tuple; five isolated corruption cases fail closed. Not privileged-tamper-proof.                               | PASS   |
| Q9      | Same bytes/hash and changed applicability creates distinct immutable versions; assertions/unknown retained and unsupported references denied; no matcher.                       | PASS   |
| Q10     | Actual global/tenant confusion denial and existing regression compatibility. Fresh auth64/tenant11 plus owner27/Pointage8; C5 remains accepted baseline failure, not test PASS. | PASS   |
| Q11     | Exact fields/methods exclude ordinal/actor/evidence/reviewer/publication/qualification/retirement; existing tenant state preserved; no app/provider effect.                     | PASS   |

Original distinct PostgreSQL backends: final clean 233/234/235/236, incremental 242/243/244/245. Coordinated real row locks with observed `pg_stat_activity`/`pg_blocking_pids` establish both winner orderings, not two promises on one connection. Lost-response injection occurs after actual commit; rollback injection observes actual inserted row before error. All corruption is isolated synthetic data, never a production repair capability.

Incremental preservation evidence: 55 pre-existing tables, 616 columns, original synthetic tenant rows and corresponding constraints/indexes unchanged across 0019→0020 and the new foundation journey. Six pre-existing synthetic fixture tables retain one row each. Three additive tables produce total58; only exact owned synthetic identifiers cleaned.

| Raw preservation snapshot | SHA-256                                                            |
| ------------------------- | ------------------------------------------------------------------ |
| 55-table row/count map    | `7028f21cfb6588fe4233c5d995e4a3fa8ebd838dec07c21b88115d0bdfcecbf4` |
| 616 columns               | `baf78a54f3e1f2206f11af6de56311dce6dde5f8831364553d4add891fbb7590` |
| Constraints               | `2c2f756ed3b0dd00666de31ca09bb68dba4f76040070a17ee2771b8a8e164743` |
| Indexes                   | `b5b42dfe3f0231966487fd4108f071a6468ed9b503e1da63ba6d3c413ce0c620` |
| 20-entry journal state    | `0398e7f7de3c9d40ed5961edc905d77d7445d5ed2b2150cda15b0e4771269ff4` |
| 21-entry journal state    | `9027f09f16978e6e32390bb771414447ccf5d56a60fa7fd5c2df114d3ee5c236` |

### Current B2 environment and outcome

New tmpfs PostgreSQL container `yuta-formalites-b2-qa-20260908`, full ID `89afc75b6d08ebf9b2bac877bb4e5f2c3ea5b6408f596562667e181c5efef2dd`, created `2026-09-08T09:19:03.13046882Z`, PostgreSQL 17.10, loopback `127.0.0.1:56542`, role `formalites_b2_qa`. `Mounts=[]`; `/var/lib/postgresql/data` is tmpfs; no existing volume or database reused. Ownership labels, exact container ID, endpoint availability, database/role/version and zero pre-migration public tables were verified before writes. No credentials or full connection URL are recorded.

Each command used only a process-scoped verified `CLOUD_DATABASE_URL`, `CLOUD_DATABASE_SSL=false` and `YUTA_ALLOW_DATABASE_INTEGRATION_TESTS=true`. No environment file changed, no production NODE_ENV or DB-name guard bypass. The two approved shared hashes and every migration file hash were rechecked before migrations/tests.

| Target                                       | Preparation / exact command                                                                    | Exit / actual result                                                  |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `yuta_owner_preservation_test_formalitesb2`  | `pnpm db:cloud:migrate`                                                                        | 0; current unchanged full 21-migration chain                          |
| Same owner target                            | `pnpm --filter @yuta/db-cloud exec vitest run test/tenant-user-repository.integration.test.ts` | 0; 27/27 tests, 1 file, 0 skips; start 11:20:05 local, duration 7.03s |
| `yuta_pointage_foundation_test_formalitesb2` | `pnpm db:cloud:migrate`                                                                        | 0; current unchanged full 21-migration chain                          |
| Same Pointage target                         | `pnpm --filter @yuta/db-cloud exec vitest run test/pointage-repository.integration.test.ts`    | 0; 8/8 tests, 1 file, 0 skips; start 11:20:06 local, duration 1.82s   |

Owner suite guard: `/^\\/yuta_owner_preservation_test(?:_[a-z0-9]+)?$/`. Pointage guard: `/^\\/yuta_pointage_foundation_test(?:_[a-z0-9]+)?$/u`. Both exact accepted names matched, suites executed rather than skipped. Unchanged owner test SHA-256 `e7784767b6600b9110d72798a7949e29193a19965a3db507908fc3ddad795724`; Pointage test `4761848b92e1ebb4f2db81d15e596f654f02b480c34bd290a339755302a6c1f1`.

Pointage inspection found that the existing suite uses the prior credential/rate/audit repository/schema supplied by migration 0019, plus existing tenant/user/personnel state. It does not require the concurrent raw-clocking repository, raw-clocking tables or continuation queries. Execution against the current unchanged migration chain actually passed. This is existing-suite compatibility evidence, not authority/readiness approval of concurrent Pointage work.

Post-test read-only identity checks: each target has 58 public tables, 21 recorded migrations, role `formalites_b2_qa`, PostgreSQL 17.10; observation PIDs 100/101 respectively. Both tips are SQL hash `690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b`, timestamp `1788853104815`. Pre-write host TCP identity checks had distinct PIDs 83/84 and zero public tables.

Cleanup revalidated the exact full ID/name/disposable labels/no-volume/tmpfs boundary, stopped and removed only this newly created container: both commands exit 0. Its two disposable databases and synthetic test data are destroyed and not recoverable; all seven pre-existing containers remain. No named volume removed. Guard/URL variables were cleared after each process. No customer/shared/production resource was touched.

## Accepted external / baseline failures

- **B1 / C5: ACCEPTED_ATTRIBUTED_BASELINE_FAILURE**, non-blocking by explicit Control Tower decision. Original command remains exit 1, **76 PASS / 1 FAIL**, 0 skipped. The newest-50 Personnel assertion compares a fixed September 4 fixture cutoff with September 8 creation timestamps. Personnel source/test and fixture remain unchanged; never relabel C5 PASS.
- **B2 / `pnpm test:cloud`: FAIL — ACCEPTED_TEST_ORCHESTRATION_LIMITATION**. The historical aggregate still exits 1: db-cloud 254 passed / 1 failed / 37 skipped; Pointage and owner beforeAll database-name guards reject its single shared target. The unchanged targeted suites now actually pass on their separately guarded databases, satisfying Control Tower's conditional B2 acceptance. The aggregate was not rerun or relabelled PASS. The separately executed Backoffice supplement retains 541 passes and one provider-conditional skipped file; no external provider fixture was fabricated.
- `pnpm format:check` freshly exits 1 with the same 67 inherited warnings. All 67 warning paths are byte-identical to this continuation's baseline; no new warning. No global formatter write occurred.
- Follow-up candidates only: deterministic Personnel newest-50 fixture; separate guarded database orchestration for integration suites. Neither is implemented, assigned readiness, opened as a change or folded into Formalités.

These are reviewable accepted constraints, not blanket relaxation of integrity/tests. Neither concurrency-related product approval nor repository aggregate PASS is inferred.

## Commands and truthful execution evidence

### Retained original Apply/QA command evidence

The following historical executions are retained, not claimed as fresh B2 reruns. C5/root cloud failed as shown; current acceptance above applies without changing command exit codes. All required original source/test/migration bytes are preserved.

| ID              | Actual command / execution                                                                                                                     | Exit and actual result                                                                                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1              | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts` | 0; 87/87, 2 files, 0 skips                                                                                                                                                                  |
| C2              | `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-repository.integration.test.ts`                                   | 0 on clean and incremental; each 16/16, 1 file, 0 skips. Initial runs and diagnostic `--silent=false` rerun also exited 0; final sanitized-output runs cited above                          |
| C3              | `pnpm --filter @yuta/db-cloud test:integration`                                                                                                | 0; 3/3, 1 file, 0 skips                                                                                                                                                                     |
| C4              | `pnpm --filter @yuta/auth test`; `pnpm --filter @yuta/tenant test` executed by test:cloud                                                      | Each 0; 45/45 in 5 files and 11/11 in 2 files, 0 skips                                                                                                                                      |
| C5              | Exact eleven-file `pnpm --filter @yuta/db-cloud exec vitest run ...` invocation from the approved C5 row above, unchanged                      | 1; 76 passed, 1 failed, 0 skipped; 10 files passed, 1 failed                                                                                                                                |
| C6              | `pnpm db:cloud:generate`                                                                                                                       | 0; 58 tables, "No schema changes, nothing to migrate"; no additional migration created                                                                                                      |
| C6              | `pnpm db:cloud:migrate` clean; same command incremental                                                                                        | Each 0; full 21 chain and isolated 0019 -> 0020 upgrade respectively                                                                                                                        |
| C7              | `pnpm --filter @yuta/db-cloud typecheck`; `pnpm --filter @yuta/auth typecheck`; `pnpm --filter @yuta/tenant typecheck`                         | Each 0                                                                                                                                                                                      |
| C7              | `pnpm -r --if-present typecheck`                                                                                                               | 0; all invoked typechecks complete, scope 15 of 16 projects                                                                                                                                 |
| C8              | `pnpm docs:check`                                                                                                                              | 0; 36 current documents                                                                                                                                                                     |
| C8              | `pnpm architecture:check`                                                                                                                      | 0; imports, URLs, client boundaries and migration baselines valid                                                                                                                           |
| C8              | `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                             | 0; 1/1 valid, 0 issues                                                                                                                                                                      |
| C9              | `pnpm test:cloud`                                                                                                                              | 1; auth 45/core 9/contracts 98/booking 3/booking-web 7/tenant 11 passed; db-cloud 254 passed, 1 failed, 37 skipped, 3 failed files / 29 passed / 1 skipped. Chain stopped before Backoffice |
| C9 supplement   | `pnpm --filter @yuta/backoffice test` separately, because aggregate stopped earlier                                                            | 0; 541 passed, 97 passed files / 1 skipped file. Provider smoke suite conditional on approved fixture IDs was not fabricated/enabled                                                        |
| C9              | `pnpm build:cloud`                                                                                                                             | 0; web, Backoffice, booking-web, feedback-web all compiled, typechecked and generated their build output. This is a local build, not deployment                                             |
| C10             | `pnpm exec prettier --check packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts`                                   | 0 on final test source                                                                                                                                                                      |
| C10             | `pnpm format:check`                                                                                                                            | 1; exactly 67 inherited warnings, all matched Gate 2b baseline and byte-identical to fresh resume baseline; no new warning                                                                  |
| Scope exclusion | `pnpm test:local`                                                                                                                              | NOT RUN; NOT REQUIRED, unchanged local packages                                                                                                                                             |

No db-cloud lint/build command was invented. No existing test or guard was edited to turn a failure into PASS.

### Fresh continuation commands

| Exact command                                                                                                                                  | Exit / actual result                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/auth test`                                                                                                                | 0; 64/64, 6 files, 0 skips; includes concurrent Pointage tests without promoting their authority                                                                                              |
| `pnpm --filter @yuta/tenant test`                                                                                                              | 0; 11/11, 2 files, 0 skips                                                                                                                                                                    |
| `pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts` | 0; 87/87, 2 files, 0 skips                                                                                                                                                                    |
| `pnpm docs:check`                                                                                                                              | 0; 36 current documents                                                                                                                                                                       |
| `pnpm architecture:check`                                                                                                                      | 0; imports, URLs, client boundaries and migration baselines                                                                                                                                   |
| `pnpm -r --if-present typecheck`                                                                                                               | 0; all invoked projects, scope 15 of 16                                                                                                                                                       |
| `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`                                                             | 0; 1/1 valid, zero issues                                                                                                                                                                     |
| `pnpm build:cloud`                                                                                                                             | 0; web, Backoffice, booking-web, feedback-web built on current rebaseline; local build only                                                                                                   |
| Scoped `pnpm exec prettier --check`                                                                                                            | 0 on matched Formalités TypeScript, Tasks and Gate 2b packet; Drizzle metadata ignored by existing repository rule, SQL checked by exact bytes/diff/migrations, not a claimed Prettier parser |
| `pnpm format:check`                                                                                                                            | 1; same 67 inherited warnings                                                                                                                                                                 |
| Attributed implementation `git apply --reverse --check --whitespace=nowarn -`                                                                  | 0; exact 11-file patch, 11699 insertions, no deletions                                                                                                                                        |

Scoped formatter command includes exactly the eight TypeScript implementation/export/test files, Tasks, Gate2b and this Gate3 packet. Existing ignore rules exclude Drizzle metadata; no SQL formatter is configured. SQL and generated metadata are verified through raw hashes, scoped diff review, JSON structure and actual migrations, not a false formatter PASS. No repository-wide formatter write.

### Canonical verify evidence

Exact summary source: the unchanged fenced UTF-8 LF block below, excluding fences. SHA-256: `e3486126f7439faba2f2f7b86c03327220c36fff571f4281e1d78a015de3b93a`. This refers to this packet's assessment and completed Tasks, not a new standalone verify artifact.

```text
Root: D:/working/yuta/yuta-resto
Assessment source: docs/reviews/formalites-legal-template-foundation/03-final-review.md, TECHNICAL VERIFY, TECHNICAL COMPLIANCE MATRIX, QA, accepted failures.
Detailed historical command/DB source: openspec/changes/formalites-legal-template-foundation/tasks.md, disposable QA checkpoint and approved B2 completion.
Fresh B2: pnpm db:cloud:migrate -> owner database exit 0; Pointage database exit 0; each 21 migrations.
Fresh B2: pnpm --filter @yuta/db-cloud exec vitest run test/tenant-user-repository.integration.test.ts -> exit 0; 27 passed; 0 skipped.
Fresh B2: pnpm --filter @yuta/db-cloud exec vitest run test/pointage-repository.integration.test.ts -> exit 0; 8 passed; 0 skipped.
Fresh C1: pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-domain.test.ts test/formalites-legal-template-repository.test.ts -> exit 0; 87 passed; 0 skipped.
Fresh C4: pnpm --filter @yuta/auth test -> exit 0; 64 passed; 0 skipped.
Fresh C4: pnpm --filter @yuta/tenant test -> exit 0; 11 passed; 0 skipped.
Fresh C7: pnpm -r --if-present typecheck -> exit 0.
Fresh C8: pnpm docs:check -> exit 0; 36 documents.
Fresh C8: pnpm architecture:check -> exit 0.
Fresh C8: pnpm exec openspec validate formalites-legal-template-foundation --strict --json -> exit 0; 1 valid; 0 issues.
Fresh C9: pnpm build:cloud -> exit 0; web/backoffice/booking-web/feedback-web; local build only.
Fresh C10: pnpm format:check -> exit 1; 67 byte-identical inherited warning paths.
Fresh C10: pnpm exec prettier --check packages/db-cloud/src/formalites-legal-template-domain.ts packages/db-cloud/src/formalites-legal-template-repository.ts packages/db-cloud/src/schema/formalites-legal-templates.ts packages/db-cloud/src/index.ts packages/db-cloud/src/schema/index.ts packages/db-cloud/test/formalites-legal-template-domain.test.ts packages/db-cloud/test/formalites-legal-template-repository.test.ts packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts openspec/changes/formalites-legal-template-foundation/tasks.md docs/reviews/formalites-legal-template-foundation/02b-design-review.md docs/reviews/formalites-legal-template-foundation/03-final-review.md -> exit 0 on matched files; generated metadata ignored, SQL has no configured formatter.
Fresh diff: git apply --reverse --check --whitespace=nowarn - < embedded attributed patch -> exit 0.
Retained C2: pnpm --filter @yuta/db-cloud exec vitest run test/formalites-legal-template-repository.integration.test.ts -> exit 0 on each clean and incremental DB; 16 passed each; 0 skipped.
Retained C3: pnpm --filter @yuta/db-cloud test:integration -> exit 0; 3 passed; 0 skipped.
Retained C5: pnpm --filter @yuta/db-cloud exec vitest run test/formalites-personnel-draft-domain.test.ts test/formalites-personnel-draft-schema.integration.test.ts test/formalites-personnel-draft-repository.integration.test.ts test/personnel-repository.integration.test.ts test/personnel-document-repository.integration.test.ts test/personnel-register-repository.integration.test.ts test/personnel-contract-amendment-repository.integration.test.ts test/personnel-action-overview-repository.integration.test.ts test/personnel-history-domain.test.ts test/personnel-history-cutover.test.ts test/personnel-history-cutover.integration.test.ts -> exit 1; 76 passed, 1 failed, 0 skipped; ACCEPTED_ATTRIBUTED_BASELINE_FAILURE.
Retained C6: pnpm db:cloud:generate -> exit 0 during original Apply; later no-op exit 0; NOT RERUN in B2 continuation.
Retained C6: pnpm db:cloud:migrate -> exit 0 on clean chain and 0019-to-0020 incremental DB.
Retained C7: pnpm --filter @yuta/db-cloud typecheck; pnpm --filter @yuta/auth typecheck; pnpm --filter @yuta/tenant typecheck -> each exit 0.
Retained C9: pnpm test:cloud -> exit 1; db-cloud 254 passed, 1 failed, 37 skipped; FAIL - ACCEPTED_TEST_ORCHESTRATION_LIMITATION.
Retained C9 supplement: pnpm --filter @yuta/backoffice test -> exit 0; 541 passed, 97 passed files, one provider-conditional skipped file.
Not run/not required: pnpm test:local; unchanged local ownership.
Technical conformance: 14/14 requirements; 42/42 scenarios; F1-F8, S1-S13, I1-I8 all PASS.
TECHNICAL IMPLEMENTATION COMPLIANCE: PASS
VERIFY: PASS
QA: PASS - real PostgreSQL non-browser acceptance; not a mock or browser claim.
Gate 3: AWAITING_HUMAN_REVIEW
Sync authorization: PENDING
Production: NOT AUTHORIZED
```

## Attributed paths, raw hashes and integrity

Sorted implementation set: exactly 11 files, 8 originally absent and 3 scoped shared additive edits. No code/test/migration changed during this B2 continuation. Pointage addition is preserved in both schema-index preimage and postimage of the attributed patch. Original pre-Apply shared preimages are embedded in the deterministic diff command; no dirty-HEAD diff is mistaken for Formalités ownership.

| Implementation path                                                               | Current SHA-256                                                    |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql`         | `690c94cbaac1d6cec863a9f8a86ad46efe0507f9a7a6286fae8cd3c9a5680e1b` |
| `packages/db-cloud/drizzle/meta/0020_snapshot.json`                               | `b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8` |
| `packages/db-cloud/drizzle/meta/_journal.json`                                    | `64220d2f34a139073a378cf90ad088a950005cd008497afc57f5d5b6a0b23997` |
| `packages/db-cloud/src/formalites-legal-template-domain.ts`                       | `985b91cd04b41559185b7462ccfd67b7e738bba0ab6efae951c4ab83c9528ccd` |
| `packages/db-cloud/src/formalites-legal-template-repository.ts`                   | `4ad3349d11a38ebf5da67787bbe00a3a1500005c07278869306ecd087cd5a6e6` |
| `packages/db-cloud/src/index.ts`                                                  | `7242c6e54fd7f1856e5077ea34a26e8f35c8e4ae16485e7d94f8aac7d0dd4bb0` |
| `packages/db-cloud/src/schema/formalites-legal-templates.ts`                      | `27a235157b543dca2723a6ce27e796939b88f451ba8d927e2c6d2a9a441709ab` |
| `packages/db-cloud/src/schema/index.ts`                                           | `eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944` |
| `packages/db-cloud/test/formalites-legal-template-domain.test.ts`                 | `6442d51a9b53e17bcf2ce2dae98dc4057feb1ba77566b6a3638703398c39f8db` |
| `packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts` | `0cd6a24069fb8e9ca85a12babdd4cf4c037e53206a89eafad0cf9a0476ef4682` |
| `packages/db-cloud/test/formalites-legal-template-repository.test.ts`             | `5a186b21d57a2175707f4639c32bc9460987e6ba5856fb2289cfa923f51f5c15` |

This continuation's workflow delivery: completed Tasks, Gate2b integrity/status update, new `03-final-review.md` only. Canonical Product Knowledge/CURRENT_STATE/MODULE_REGISTRY/architecture/main specs and runtime/auth/tenant/Personnel source are untouched by this continuation.

### Concurrent Pointage attribution — not approval

| Path outside Formalités delivery                                 | Observed SHA-256                                                   |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/src/schema/pointage.ts`                       | `8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`         | `50135e23a7b02a509833a3a63bfaca5339281fae191ba9700deec54bf377600a` |
| `packages/auth/src/pointage-continuation.ts`                     | `f2c829c33030ae3550350ff4b5eac3d5dce774e5bd4774a5e46a0dd621465172` |
| `packages/auth/test/pointage-continuation.test.ts`               | `6d9e78b745c47a96e4d59e256e67090ede1258860b140e28b6210fca57b07b4a` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`      | `2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb` |
| `packages/db-cloud/src/schema/pointage-raw-clocking.ts`          | `d19c5c84c9b3352437aa839d97b54e800211bc956d28e70445e6b1247c5e4754` |
| `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts`    | `4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158` |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md` | `f9574a408c6b6e415893e2862aac9d82d7fe408e07cd3f5c7fa20a9ee9e7bc6b` |
| `openspec/changes/pointage-usable-raw-clocking/design.md`        | `a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361` |

Pointage design and its own Gate2b packet changed concurrently after the fresh baseline; no Formalités authority is derived from them. Their preceding hashes were `be9fa518e12c116c42c46c6e2f0e9834fc8c143edaf6164a726553930b905bc9` and `9627eb9fabe81bfb1408724100e470c7dbdc96a8fcf15bbedd2fc6597e21bad5` respectively. No concurrent file edited/reverted/included in the patch. Newly observed Pointage source/test files listed above already existed at this continuation baseline and remain attribution-only.

### Attributed diff statistics

Plain `git diff --stat` would omit eight untracked implementation files and include unrelated dirty work. The exact attributed equivalent below is produced by `git apply --stat -` from the embedded patch, rather than falsely treating HEAD as the approved preimage.

```text
 .../0020_formalites_legal_template_foundation.sql  |   42
 packages/db-cloud/drizzle/meta/0020_snapshot.json  | 9824 ++++++++++++++++++++
 packages/db-cloud/drizzle/meta/_journal.json       |    7
 .../src/formalites-legal-template-domain.ts        |  179
 .../src/formalites-legal-template-repository.ts    |  408 +
 packages/db-cloud/src/index.ts                     |   10
 .../src/schema/formalites-legal-templates.ts       |  125
 packages/db-cloud/src/schema/index.ts              |    1
 .../test/formalites-legal-template-domain.test.ts  |  143
 ...s-legal-template-repository.integration.test.ts |  686 +
 .../formalites-legal-template-repository.test.ts   |  274 +
 11 files changed, 11699 insertions(+)
```

Exact implementation diff SHA-256: `d9dc596a877b071c42e306c4a16cfcf2762f7695abb55024d88ec364f6e9b54e`; 368057 UTF-8 bytes, LF; 11 files, 11699 additions, no deletions. `git apply --reverse --check --whitespace=nowarn -` exit0 against current working tree, preserving Pointage. Shared preimage hashes are:

| Shared preimage used for Formalités-only patch | SHA-256                                                            |
| ---------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/drizzle/meta/_journal.json` | `855d5ace75fac337d0fe701f130565b5673c31b84c5a47a25b6f19315e77f665` |
| `packages/db-cloud/src/index.ts`               | `78dfaea8430d150923eaad931a9e034c5fa9eb8e27664f3b2a356fdc1c0057e1` |
| `packages/db-cloud/src/schema/index.ts`        | `93c19bfc4be9ddfdb391e7d0f407e12bf354d68772a9ce96f34399c445654b73` |

The schema preimage incorporates the separately approved concurrent Pointage export. Removing that export in memory reconstructs original pre-Apply schema index; the command enforces equivalence. This does not edit either source.

### Exact deterministic reconstruction command

Run from repository root. Read-only reconstruction returns patch bytes/hash, per-file statistics and reverse-check outcome. Base64 values are previously captured non-secret shared source preimages, not credentials.

```powershell
node -e 'const fs=require("fs"),crypto=require("crypto"),cp=require("child_process");const shared={"packages/db-cloud/src/index.ts":"ZXhwb3J0ICogZnJvbSAnLi9hY2Nlc3MtYXVkaXQtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vYXV0aC1yZXBvc2l0b3J5JzsKZXhwb3J0ICogZnJvbSAnLi9ib29raW5nLXJlcG9zaXRvcnknOwpleHBvcnQgKiBmcm9tICcuL2NsaWVudCc7CmV4cG9ydCAqIGZyb20gJy4vZW52JzsKZXhwb3J0ICogZnJvbSAnLi9lc3RhYmxpc2htZW50LXByb2ZpbGUtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vZm9ybWFsaXRlcy1wZXJzb25uZWwtZHJhZnQtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsLXJlcG9zaXRvcnknOwpleHBvcnQgewogIFBFUlNPTk5FTF9ISVNUT1JZX0NVVE9WRVJfVkVSU0lPTiwKICBQZXJzb25uZWxIaXN0b3J5Q3V0b3ZlckludGVncml0eUVycm9yLAogIFBlcnNvbm5lbEhpc3RvcnlDdXRvdmVyTm90Q29tcGxldGVkRXJyb3IsCiAgYXNzZXJ0UGVyc29ubmVsSGlzdG9yeUN1dG92ZXJDb21wbGV0ZWQsCiAgZ2V0UGVyc29ubmVsSGlzdG9yeVJldGVudGlvbkVsaWdpYmlsaXR5LAogIHJ1blBlcnNvbm5lbEhpc3RvcnlDdXRvdmVyLAogIHR5cGUgUGVyc29ubmVsSGlzdG9yeUN1dG92ZXJSZXN1bHQsCiAgdHlwZSBQZXJzb25uZWxIaXN0b3J5UmV0ZW50aW9uRWxpZ2liaWxpdHksCn0gZnJvbSAnLi9wZXJzb25uZWwtaGlzdG9yeS1jdXRvdmVyJzsKZXhwb3J0ICogZnJvbSAnLi9wZXJzb25uZWwtcmVnaXN0ZXItcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcG9pbnRhZ2UtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsLWFjdGlvbi1vdmVydmlldy1yZXBvc2l0b3J5JzsKZXhwb3J0ICogZnJvbSAnLi9wZXJzb25uZWwtZG9jdW1lbnQtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcGVyc29ubmVsLWNvbnRyYWN0LWFtZW5kbWVudC1yZXBvc2l0b3J5JzsKZXhwb3J0ICogZnJvbSAnLi9yZXB1dGF0aW9uLXJldmlldy1zb2NpYWwtbGlua3MnOwpleHBvcnQgKiBmcm9tICcuL3JlcHV0YXRpb24tcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vcmVzdGF1cmFudC1rbm93bGVkZ2UtcmVwb3NpdG9yeSc7CmV4cG9ydCAqIGZyb20gJy4vc2NoZW1hJzsKZXhwb3J0ICogZnJvbSAnLi90ZW5hbnQtYWRhcHRlcnMnOwpleHBvcnQgKiBmcm9tICcuL3RlbmFudC1mb3VuZGF0aW9uLXJlcG9zaXRvcnknOwpleHBvcnQgKiBmcm9tICcuL3RlbmFudC11c2VyLXJlcG9zaXRvcnknOwo=","packages/db-cloud/src/schema/index.ts":"ZXhwb3J0ICogZnJvbSAnLi9hdXRoJzsKZXhwb3J0ICogZnJvbSAnLi9ib29raW5nJzsKZXhwb3J0ICogZnJvbSAnLi9mb3JtYWxpdGVzJzsKZXhwb3J0ICogZnJvbSAnLi9wZXJzb25uZWwnOwpleHBvcnQgKiBmcm9tICcuL3BvaW50YWdlJzsKZXhwb3J0ICogZnJvbSAnLi9yZXB1dGF0aW9uJzsKZXhwb3J0ICogZnJvbSAnLi9yZXN0YXVyYW50LWtub3dsZWRnZSc7CmV4cG9ydCAqIGZyb20gJy4vcmVsYXRpb25zJzsKZXhwb3J0ICogZnJvbSAnLi90ZW5hbmN5JzsKZXhwb3J0ICogZnJvbSAnLi91c2Vycyc7Cg==","packages/db-cloud/drizzle/meta/_journal.json":"ewogICJ2ZXJzaW9uIjogIjciLAogICJkaWFsZWN0IjogInBvc3RncmVzcWwiLAogICJlbnRyaWVzIjogWwogICAgewogICAgICAiaWR4IjogMCwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NTE4NjI4MDk3MSwKICAgICAgInRhZyI6ICIwMDAwX2luaXRpYWwiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogMSwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NTYyNzEzNjEwNCwKICAgICAgInRhZyI6ICIwMDAxX2FtdXNlZF93cmVja2VyIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDIsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODU2NjQwMTY2NDUsCiAgICAgICJ0YWciOiAiMDAwMl9idW1weV9lbGVrdHJhIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDMsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODU2NjQ2NTY1ODIsCiAgICAgICJ0YWciOiAiMDAwM19zbWFsbF9yYWlkZXIiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogNCwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NjAzOTgwNzc4OCwKICAgICAgInRhZyI6ICIwMDA0X3ByZXZpb3VzX2dyYXZpdHkiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogNSwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NjYxOTA4NjYwOCwKICAgICAgInRhZyI6ICIwMDA1X2xlYW5fenp6YXgiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogNiwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4NjYyNzE2OTYwOCwKICAgICAgInRhZyI6ICIwMDA2X2Fyb21hdGljX2Jvb21fYm9vbSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiA3LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg2Nzg0MjAzODYzLAogICAgICAidGFnIjogIjAwMDdfaGFwcHlfbWFzdGVyX2NoaWVmIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDgsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODY3OTYwMTgxMzgsCiAgICAgICJ0YWciOiAiMDAwOF9vbW5pc2NpZW50X2NvbG9uZWxfYW1lcmljYSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiA5LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg2ODgwNTMwODQwLAogICAgICAidGFnIjogIjAwMDlfaGVhdnlfc2F1cm9uIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDEwLAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg3MDA2MDMxNzM1LAogICAgICAidGFnIjogIjAwMTBfZ2lmdGVkX3JvbGFuZF9kZXNjaGFpbiIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxMSwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODEyNTgwOTkwNiwKICAgICAgInRhZyI6ICIwMDExX3Jlc3RhdXJhbnRfa25vd2xlZGdlX2NvbmNlcHRfaGlzdG9yeSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxMiwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODE3MzI0MzU0NCwKICAgICAgInRhZyI6ICIwMDEyX3Jlc3RhdXJhbnRfa25vd2xlZGdlX2N1aXNpbmVfa25vd19ob3ciLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogMTMsCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODgyNjc3NzkyMTQsCiAgICAgICJ0YWciOiAiMDAxM19yZXN0YXVyYW50X2tub3dsZWRnZV9jdXN0b21lcl9leHBlcmllbmNlIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDE0LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg4MzM4OTQyNzMxLAogICAgICAidGFnIjogIjAwMTRfcmVzdGF1cmFudF9rbm93bGVkZ2VfdGVhbV9jdWx0dXJlIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDE1LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg4MzcwMjk5Njg1LAogICAgICAidGFnIjogIjAwMTVfcmVzdGF1cmFudF9rbm93bGVkZ2VfY29tbXVuaWNhdGlvbl9pZGVudGl0eSIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxNiwKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODM4NjQ4MTQxNiwKICAgICAgInRhZyI6ICIwMDE2X3Jlc3RhdXJhbnRfa25vd2xlZGdlX3ZhbGlkYXRlZF9pdGVtcyIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0sCiAgICB7CiAgICAgICJpZHgiOiAxNywKICAgICAgInZlcnNpb24iOiAiNyIsCiAgICAgICJ3aGVuIjogMTc4ODQzODUwOTA1MSwKICAgICAgInRhZyI6ICIwMDE3X3dob2xlX3dhcmJvdW5kIiwKICAgICAgImJyZWFrcG9pbnRzIjogdHJ1ZQogICAgfSwKICAgIHsKICAgICAgImlkeCI6IDE4LAogICAgICAidmVyc2lvbiI6ICI3IiwKICAgICAgIndoZW4iOiAxNzg4NTU5ODgwMjk5LAogICAgICAidGFnIjogIjAwMThfZWxpdGVfaGFyZGJhbGwiLAogICAgICAiYnJlYWtwb2ludHMiOiB0cnVlCiAgICB9LAogICAgewogICAgICAiaWR4IjogMTksCiAgICAgICJ2ZXJzaW9uIjogIjciLAogICAgICAid2hlbiI6IDE3ODg3MzE5NTgwMzgsCiAgICAgICJ0YWciOiAiMDAxOV9wb2ludGFnZV9hdXRob3JpdHlfZm91bmRhdGlvbiIsCiAgICAgICJicmVha3BvaW50cyI6IHRydWUKICAgIH0KICBdCn0="},paths=["packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql","packages/db-cloud/drizzle/meta/0020_snapshot.json","packages/db-cloud/drizzle/meta/_journal.json","packages/db-cloud/src/formalites-legal-template-domain.ts","packages/db-cloud/src/formalites-legal-template-repository.ts","packages/db-cloud/src/index.ts","packages/db-cloud/src/schema/formalites-legal-templates.ts","packages/db-cloud/src/schema/index.ts","packages/db-cloud/test/formalites-legal-template-domain.test.ts","packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts","packages/db-cloud/test/formalites-legal-template-repository.test.ts"];
const H=s=>crypto.createHash("sha256").update(s).digest("hex");
function lines(s){const a=s.split("\n");if(s.endsWith("\n"))a.pop();return a;}
let diff="",stats=[],pre={};
for(const p of paths){const after=fs.readFileSync(p,"utf8");let before=shared[p]===undefined?null:Buffer.from(shared[p],"base64").toString("utf8");
if(p==="packages/db-cloud/src/schema/index.ts"){const original=before;before=after.replace("export * from ''./formalites-legal-templates'';\n","");if(before.replace("export * from ''./pointage-raw-clocking'';\n","")!==original)throw Error("schema attribution drift");}
pre[p]=before===null?null:H(before);const a=before===null?[]:lines(before),b=lines(after);let start=0,end=0;
while(start<a.length&&start<b.length&&a[start]===b[start])start++;
while(end<a.length-start&&end<b.length-start&&a[a.length-1-end]===b[b.length-1-end])end++;
const lo=Math.max(0,start-3),aHi=Math.min(a.length,a.length-end+3),bHi=Math.min(b.length,b.length-end+3);
diff+="diff --git a/"+p+" b/"+p+"\n"+(before===null?"new file mode 100644\n":"")+"--- "+(before===null?"/dev/null":"a/"+p)+"\n+++ b/"+p+"\n";
diff+="@@ -"+(a.length?lo+1:0)+","+(aHi-lo)+" +"+(b.length?lo+1:0)+","+(bHi-lo)+" @@\n";
function emit(prefix,text,last,noNL){diff+=prefix+text+"\n";if(last&&noNL)diff+="\\ No newline at end of file\n";}
for(let i=lo;i<start;i++)emit(" ",a[i],i===a.length-1,!before.endsWith("\n"));
for(let i=start;i<a.length-end;i++)emit("-",a[i],i===a.length-1,!before.endsWith("\n"));
for(let i=start;i<b.length-end;i++)emit("+",b[i],i===b.length-1,!after.endsWith("\n"));
for(let i=0;i<aHi-(a.length-end);i++){const ai=a.length-end+i;emit(" ",a[ai],ai===a.length-1,!after.endsWith("\n"));}
stats.push({path:p,added:b.length-end-start,removed:a.length-end-start});}
const check=cp.spawnSync("git",["apply","--reverse","--check","--whitespace=nowarn","-"],{input:diff,encoding:"utf8"});
const stat=cp.spawnSync("git",["apply","--stat","-"],{input:diff,encoding:"utf8"});
console.log(JSON.stringify({diff,sha256:H(diff),bytes:Buffer.byteLength(diff),stats,pre,reverse:{exit:check.status,stdout:check.stdout,stderr:check.stderr},stat:stat.stdout}));'
```

### Exact complete implementation diff

The complete patch, including all originally untracked files and the generated snapshot, is included unchanged for review. Hash covers only fenced diff content with its final LF, not Markdown fences.

```diff
diff --git a/packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql b/packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/drizzle/0020_formalites_legal_template_foundation.sql
@@ -0,0 +1,42 @@
+CREATE TABLE "formalites_template_identities" (
+	"id" uuid PRIMARY KEY NOT NULL,
+	"legal_purpose" text NOT NULL,
+	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
+	CONSTRAINT "formalites_template_purpose_nonempty" CHECK (length("formalites_template_identities"."legal_purpose") > 0)
+);
+--> statement-breakpoint
+CREATE TABLE "formalites_template_versions" (
+	"id" uuid PRIMARY KEY NOT NULL,
+	"template_id" uuid NOT NULL,
+	"source_draft_id" uuid NOT NULL,
+	"source_draft_revision" integer NOT NULL,
+	"content_profile" text NOT NULL,
+	"source_bytes" "bytea" NOT NULL,
+	"checksum_algorithm" text NOT NULL,
+	"content_checksum" text NOT NULL,
+	"applicability" jsonb NOT NULL,
+	"frozen_at" timestamp with time zone NOT NULL,
+	CONSTRAINT "formalites_template_freeze_locator" UNIQUE("source_draft_id","source_draft_revision"),
+	CONSTRAINT "formalites_template_version_positive_revision" CHECK ("formalites_template_versions"."source_draft_revision" > 0),
+	CONSTRAINT "formalites_template_checksum_algorithm" CHECK ("formalites_template_versions"."checksum_algorithm" = 'sha256'),
+	CONSTRAINT "formalites_template_checksum_shape" CHECK ("formalites_template_versions"."content_checksum" ~ '^[0-9a-f]{64}$')
+);
+--> statement-breakpoint
+CREATE TABLE "formalites_template_working_drafts" (
+	"id" uuid PRIMARY KEY NOT NULL,
+	"template_id" uuid NOT NULL,
+	"revision" integer DEFAULT 1 NOT NULL,
+	"content_profile" text NOT NULL,
+	"source_bytes" "bytea" NOT NULL,
+	"applicability" jsonb NOT NULL,
+	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
+	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
+	"frozen_at" timestamp with time zone,
+	CONSTRAINT "formalites_template_draft_containment" UNIQUE("id","template_id"),
+	CONSTRAINT "formalites_template_draft_positive_revision" CHECK ("formalites_template_working_drafts"."revision" > 0)
+);
+--> statement-breakpoint
+ALTER TABLE "formalites_template_versions" ADD CONSTRAINT "formalites_template_versions_template_id_formalites_template_identities_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."formalites_template_identities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
+ALTER TABLE "formalites_template_versions" ADD CONSTRAINT "formalites_template_version_draft_containment" FOREIGN KEY ("source_draft_id","template_id") REFERENCES "public"."formalites_template_working_drafts"("id","template_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
+ALTER TABLE "formalites_template_working_drafts" ADD CONSTRAINT "formalites_template_working_drafts_template_id_formalites_template_identities_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."formalites_template_identities"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
+CREATE UNIQUE INDEX "formalites_template_one_active_draft" ON "formalites_template_working_drafts" USING btree ("template_id") WHERE "formalites_template_working_drafts"."frozen_at" is null;
\ No newline at end of file
diff --git a/packages/db-cloud/drizzle/meta/0020_snapshot.json b/packages/db-cloud/drizzle/meta/0020_snapshot.json
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/drizzle/meta/0020_snapshot.json
@@ -0,0 +1,9824 @@
+{
+  "id": "a561064d-9525-4287-9e02-4fec59b90bba",
+  "prevId": "c3abc783-459d-45a5-b451-e23275ce33d2",
+  "version": "7",
+  "dialect": "postgresql",
+  "tables": {
+    "public.auth_audit_events": {
+      "name": "auth_audit_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "event": {
+          "name": "event",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "subject_user_id": {
+          "name": "subject_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "metadata": {
+          "name": "metadata",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'{}'::jsonb"
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "auth_audit_events_actor_user_id_idx": {
+          "name": "auth_audit_events_actor_user_id_idx",
+          "columns": [
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_audit_events_subject_user_id_idx": {
+          "name": "auth_audit_events_subject_user_id_idx",
+          "columns": [
+            {
+              "expression": "subject_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_audit_events_scope_idx": {
+          "name": "auth_audit_events_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_audit_events_created_at_idx": {
+          "name": "auth_audit_events_created_at_idx",
+          "columns": [
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "auth_audit_events_actor_user_id_users_id_fk": {
+          "name": "auth_audit_events_actor_user_id_users_id_fk",
+          "tableFrom": "auth_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "auth_audit_events_subject_user_id_users_id_fk": {
+          "name": "auth_audit_events_subject_user_id_users_id_fk",
+          "tableFrom": "auth_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "subject_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "auth_audit_events_organization_id_organizations_id_fk": {
+          "name": "auth_audit_events_organization_id_organizations_id_fk",
+          "tableFrom": "auth_audit_events",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "auth_audit_events_establishment_id_establishments_id_fk": {
+          "name": "auth_audit_events_establishment_id_establishments_id_fk",
+          "tableFrom": "auth_audit_events",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.auth_login_attempts": {
+      "name": "auth_login_attempts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "key_hash": {
+          "name": "key_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "attempted_at": {
+          "name": "attempted_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "succeeded": {
+          "name": "succeeded",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        }
+      },
+      "indexes": {
+        "auth_login_attempts_key_time_idx": {
+          "name": "auth_login_attempts_key_time_idx",
+          "columns": [
+            {
+              "expression": "key_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "attempted_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {},
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.auth_selection_tickets": {
+      "name": "auth_selection_tickets",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "user_id": {
+          "name": "user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "token_hash": {
+          "name": "token_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "auth_version": {
+          "name": "auth_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "expires_at": {
+          "name": "expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "consumed_at": {
+          "name": "consumed_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "ip_hash": {
+          "name": "ip_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "user_agent": {
+          "name": "user_agent",
+          "type": "varchar(500)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "auth_selection_tickets_token_hash_unique_idx": {
+          "name": "auth_selection_tickets_token_hash_unique_idx",
+          "columns": [
+            {
+              "expression": "token_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_selection_tickets_user_id_idx": {
+          "name": "auth_selection_tickets_user_id_idx",
+          "columns": [
+            {
+              "expression": "user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_selection_tickets_expires_at_idx": {
+          "name": "auth_selection_tickets_expires_at_idx",
+          "columns": [
+            {
+              "expression": "expires_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "auth_selection_tickets_user_id_users_id_fk": {
+          "name": "auth_selection_tickets_user_id_users_id_fk",
+          "tableFrom": "auth_selection_tickets",
+          "tableTo": "users",
+          "columnsFrom": [
+            "user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.auth_sessions": {
+      "name": "auth_sessions",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "user_id": {
+          "name": "user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "token_hash": {
+          "name": "token_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "auth_version": {
+          "name": "auth_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "expires_at": {
+          "name": "expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "last_seen_at": {
+          "name": "last_seen_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "revoked_at": {
+          "name": "revoked_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "ip_hash": {
+          "name": "ip_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "user_agent": {
+          "name": "user_agent",
+          "type": "varchar(500)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "auth_sessions_token_hash_unique_idx": {
+          "name": "auth_sessions_token_hash_unique_idx",
+          "columns": [
+            {
+              "expression": "token_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_sessions_user_id_idx": {
+          "name": "auth_sessions_user_id_idx",
+          "columns": [
+            {
+              "expression": "user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_sessions_scope_idx": {
+          "name": "auth_sessions_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "auth_sessions_expires_at_idx": {
+          "name": "auth_sessions_expires_at_idx",
+          "columns": [
+            {
+              "expression": "expires_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "auth_sessions_user_id_users_id_fk": {
+          "name": "auth_sessions_user_id_users_id_fk",
+          "tableFrom": "auth_sessions",
+          "tableTo": "users",
+          "columnsFrom": [
+            "user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        },
+        "auth_sessions_organization_id_organizations_id_fk": {
+          "name": "auth_sessions_organization_id_organizations_id_fk",
+          "tableFrom": "auth_sessions",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "auth_sessions_establishment_id_establishments_id_fk": {
+          "name": "auth_sessions_establishment_id_establishments_id_fk",
+          "tableFrom": "auth_sessions",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.password_reset_tokens": {
+      "name": "password_reset_tokens",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "user_id": {
+          "name": "user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "token_hash": {
+          "name": "token_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "expires_at": {
+          "name": "expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "consumed_at": {
+          "name": "consumed_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "password_reset_tokens_hash_unique_idx": {
+          "name": "password_reset_tokens_hash_unique_idx",
+          "columns": [
+            {
+              "expression": "token_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "password_reset_tokens_user_id_idx": {
+          "name": "password_reset_tokens_user_id_idx",
+          "columns": [
+            {
+              "expression": "user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "password_reset_tokens_expires_at_idx": {
+          "name": "password_reset_tokens_expires_at_idx",
+          "columns": [
+            {
+              "expression": "expires_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "password_reset_tokens_user_id_users_id_fk": {
+          "name": "password_reset_tokens_user_id_users_id_fk",
+          "tableFrom": "password_reset_tokens",
+          "tableTo": "users",
+          "columnsFrom": [
+            "user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.booking_audit_events": {
+      "name": "booking_audit_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reservation_id": {
+          "name": "reservation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "actor_type": {
+          "name": "actor_type",
+          "type": "booking_actor_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "event_type": {
+          "name": "event_type",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "metadata": {
+          "name": "metadata",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'{}'::jsonb"
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "booking_audit_events_scope_idx": {
+          "name": "booking_audit_events_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "booking_audit_events_organization_id_organizations_id_fk": {
+          "name": "booking_audit_events_organization_id_organizations_id_fk",
+          "tableFrom": "booking_audit_events",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_audit_events_establishment_id_establishments_id_fk": {
+          "name": "booking_audit_events_establishment_id_establishments_id_fk",
+          "tableFrom": "booking_audit_events",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_audit_events_reservation_id_reservations_id_fk": {
+          "name": "booking_audit_events_reservation_id_reservations_id_fk",
+          "tableFrom": "booking_audit_events",
+          "tableTo": "reservations",
+          "columnsFrom": [
+            "reservation_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "booking_audit_events_actor_user_id_users_id_fk": {
+          "name": "booking_audit_events_actor_user_id_users_id_fk",
+          "tableFrom": "booking_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.booking_exceptions": {
+      "name": "booking_exceptions",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "exception_date": {
+          "name": "exception_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "kind": {
+          "name": "kind",
+          "type": "booking_exception_kind",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "service_period_id": {
+          "name": "service_period_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "start_time": {
+          "name": "start_time",
+          "type": "time(0)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "end_time": {
+          "name": "end_time",
+          "type": "time(0)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "capacity_override": {
+          "name": "capacity_override",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "reason": {
+          "name": "reason",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "booking_exceptions_scope_date_idx": {
+          "name": "booking_exceptions_scope_date_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "exception_date",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "booking_exceptions_organization_id_organizations_id_fk": {
+          "name": "booking_exceptions_organization_id_organizations_id_fk",
+          "tableFrom": "booking_exceptions",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_exceptions_establishment_id_establishments_id_fk": {
+          "name": "booking_exceptions_establishment_id_establishments_id_fk",
+          "tableFrom": "booking_exceptions",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_exceptions_service_period_id_booking_service_periods_id_fk": {
+          "name": "booking_exceptions_service_period_id_booking_service_periods_id_fk",
+          "tableFrom": "booking_exceptions",
+          "tableTo": "booking_service_periods",
+          "columnsFrom": [
+            "service_period_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "booking_exceptions_capacity_check": {
+          "name": "booking_exceptions_capacity_check",
+          "value": "\"booking_exceptions\".\"capacity_override\" is null or \"booking_exceptions\".\"capacity_override\" >= 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.booking_notification_deliveries": {
+      "name": "booking_notification_deliveries",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reservation_id": {
+          "name": "reservation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "event_type": {
+          "name": "event_type",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "channel": {
+          "name": "channel",
+          "type": "varchar(30)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'EMAIL'"
+        },
+        "recipient": {
+          "name": "recipient",
+          "type": "varchar(254)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "booking_notification_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'PENDING'"
+        },
+        "attempt_count": {
+          "name": "attempt_count",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 0
+        },
+        "provider_message_id": {
+          "name": "provider_message_id",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "last_error": {
+          "name": "last_error",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "next_attempt_at": {
+          "name": "next_attempt_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "sent_at": {
+          "name": "sent_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "booking_notification_outbox_idx": {
+          "name": "booking_notification_outbox_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "next_attempt_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "booking_notification_deliveries_organization_id_organizations_id_fk": {
+          "name": "booking_notification_deliveries_organization_id_organizations_id_fk",
+          "tableFrom": "booking_notification_deliveries",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_notification_deliveries_establishment_id_establishments_id_fk": {
+          "name": "booking_notification_deliveries_establishment_id_establishments_id_fk",
+          "tableFrom": "booking_notification_deliveries",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_notification_deliveries_reservation_id_reservations_id_fk": {
+          "name": "booking_notification_deliveries_reservation_id_reservations_id_fk",
+          "tableFrom": "booking_notification_deliveries",
+          "tableTo": "reservations",
+          "columnsFrom": [
+            "reservation_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.booking_public_attempts": {
+      "name": "booking_public_attempts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "action": {
+          "name": "action",
+          "type": "varchar(30)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "subject_hash": {
+          "name": "subject_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "booking_public_attempts_lookup_idx": {
+          "name": "booking_public_attempts_lookup_idx",
+          "columns": [
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "action",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "subject_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "booking_public_attempts_cleanup_idx": {
+          "name": "booking_public_attempts_cleanup_idx",
+          "columns": [
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "booking_public_attempts_establishment_id_establishments_id_fk": {
+          "name": "booking_public_attempts_establishment_id_establishments_id_fk",
+          "tableFrom": "booking_public_attempts",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.booking_service_periods": {
+      "name": "booking_service_periods",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "day_of_week": {
+          "name": "day_of_week",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "name": {
+          "name": "name",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "start_time": {
+          "name": "start_time",
+          "type": "time(0)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "end_time": {
+          "name": "end_time",
+          "type": "time(0)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "capacity": {
+          "name": "capacity",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "enabled": {
+          "name": "enabled",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "sort_order": {
+          "name": "sort_order",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 0
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "booking_service_periods_scope_day_idx": {
+          "name": "booking_service_periods_scope_day_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "day_of_week",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "booking_service_periods_organization_id_organizations_id_fk": {
+          "name": "booking_service_periods_organization_id_organizations_id_fk",
+          "tableFrom": "booking_service_periods",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "booking_service_periods_establishment_id_establishments_id_fk": {
+          "name": "booking_service_periods_establishment_id_establishments_id_fk",
+          "tableFrom": "booking_service_periods",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "booking_service_periods_day_check": {
+          "name": "booking_service_periods_day_check",
+          "value": "\"booking_service_periods\".\"day_of_week\" between 0 and 6"
+        },
+        "booking_service_periods_time_check": {
+          "name": "booking_service_periods_time_check",
+          "value": "\"booking_service_periods\".\"end_time\" > \"booking_service_periods\".\"start_time\""
+        },
+        "booking_service_periods_capacity_check": {
+          "name": "booking_service_periods_capacity_check",
+          "value": "\"booking_service_periods\".\"capacity\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.booking_settings": {
+      "name": "booking_settings",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "enabled": {
+          "name": "enabled",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "confirmation_mode": {
+          "name": "confirmation_mode",
+          "type": "booking_confirmation_mode",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'MANUAL'"
+        },
+        "minimum_party_size": {
+          "name": "minimum_party_size",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "maximum_party_size": {
+          "name": "maximum_party_size",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 12
+        },
+        "slot_interval_minutes": {
+          "name": "slot_interval_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 30
+        },
+        "average_duration_minutes": {
+          "name": "average_duration_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 90
+        },
+        "minimum_notice_minutes": {
+          "name": "minimum_notice_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 120
+        },
+        "booking_window_days": {
+          "name": "booking_window_days",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 60
+        },
+        "cancellation_deadline_minutes": {
+          "name": "cancellation_deadline_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 120
+        },
+        "welcome_message": {
+          "name": "welcome_message",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "booking_policy": {
+          "name": "booking_policy",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "booking_settings_scope_unique_idx": {
+          "name": "booking_settings_scope_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "booking_settings_organization_id_organizations_id_fk": {
+          "name": "booking_settings_organization_id_organizations_id_fk",
+          "tableFrom": "booking_settings",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        },
+        "booking_settings_establishment_id_establishments_id_fk": {
+          "name": "booking_settings_establishment_id_establishments_id_fk",
+          "tableFrom": "booking_settings",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "booking_settings_party_size_check": {
+          "name": "booking_settings_party_size_check",
+          "value": "\"booking_settings\".\"minimum_party_size\" > 0 and \"booking_settings\".\"maximum_party_size\" >= \"booking_settings\".\"minimum_party_size\""
+        },
+        "booking_settings_intervals_check": {
+          "name": "booking_settings_intervals_check",
+          "value": "\"booking_settings\".\"slot_interval_minutes\" > 0 and \"booking_settings\".\"average_duration_minutes\" > 0 and \"booking_settings\".\"minimum_notice_minutes\" >= 0 and \"booking_settings\".\"booking_window_days\" >= 0 and \"booking_settings\".\"cancellation_deadline_minutes\" >= 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.reservation_internal_notes": {
+      "name": "reservation_internal_notes",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reservation_id": {
+          "name": "reservation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "author_user_id": {
+          "name": "author_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "body": {
+          "name": "body",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "reservation_internal_notes_reservation_idx": {
+          "name": "reservation_internal_notes_reservation_idx",
+          "columns": [
+            {
+              "expression": "reservation_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "reservation_internal_notes_organization_id_organizations_id_fk": {
+          "name": "reservation_internal_notes_organization_id_organizations_id_fk",
+          "tableFrom": "reservation_internal_notes",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reservation_internal_notes_establishment_id_establishments_id_fk": {
+          "name": "reservation_internal_notes_establishment_id_establishments_id_fk",
+          "tableFrom": "reservation_internal_notes",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reservation_internal_notes_reservation_id_reservations_id_fk": {
+          "name": "reservation_internal_notes_reservation_id_reservations_id_fk",
+          "tableFrom": "reservation_internal_notes",
+          "tableTo": "reservations",
+          "columnsFrom": [
+            "reservation_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        },
+        "reservation_internal_notes_author_user_id_users_id_fk": {
+          "name": "reservation_internal_notes_author_user_id_users_id_fk",
+          "tableFrom": "reservation_internal_notes",
+          "tableTo": "users",
+          "columnsFrom": [
+            "author_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.reservation_status_history": {
+      "name": "reservation_status_history",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reservation_id": {
+          "name": "reservation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "from_status": {
+          "name": "from_status",
+          "type": "reservation_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "to_status": {
+          "name": "to_status",
+          "type": "reservation_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_type": {
+          "name": "actor_type",
+          "type": "booking_actor_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "reason": {
+          "name": "reason",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "reservation_status_history_reservation_idx": {
+          "name": "reservation_status_history_reservation_idx",
+          "columns": [
+            {
+              "expression": "reservation_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "reservation_status_history_organization_id_organizations_id_fk": {
+          "name": "reservation_status_history_organization_id_organizations_id_fk",
+          "tableFrom": "reservation_status_history",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reservation_status_history_establishment_id_establishments_id_fk": {
+          "name": "reservation_status_history_establishment_id_establishments_id_fk",
+          "tableFrom": "reservation_status_history",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reservation_status_history_reservation_id_reservations_id_fk": {
+          "name": "reservation_status_history_reservation_id_reservations_id_fk",
+          "tableFrom": "reservation_status_history",
+          "tableTo": "reservations",
+          "columnsFrom": [
+            "reservation_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        },
+        "reservation_status_history_actor_user_id_users_id_fk": {
+          "name": "reservation_status_history_actor_user_id_users_id_fk",
+          "tableFrom": "reservation_status_history",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.reservations": {
+      "name": "reservations",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reference": {
+          "name": "reference",
+          "type": "varchar(30)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "reservation_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source": {
+          "name": "source",
+          "type": "reservation_source",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'DIRECT'"
+        },
+        "local_date": {
+          "name": "local_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "local_time": {
+          "name": "local_time",
+          "type": "time(0)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "timezone": {
+          "name": "timezone",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "start_at": {
+          "name": "start_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "end_at": {
+          "name": "end_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "party_size": {
+          "name": "party_size",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "guest_first_name": {
+          "name": "guest_first_name",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "guest_last_name": {
+          "name": "guest_last_name",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "guest_email": {
+          "name": "guest_email",
+          "type": "varchar(254)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "guest_phone": {
+          "name": "guest_phone",
+          "type": "varchar(30)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "special_requirements": {
+          "name": "special_requirements",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "marketing_consent": {
+          "name": "marketing_consent",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "policy_accepted_at": {
+          "name": "policy_accepted_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "public_token_hash": {
+          "name": "public_token_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "idempotency_hash": {
+          "name": "idempotency_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "request_fingerprint": {
+          "name": "request_fingerprint",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_name_snapshot": {
+          "name": "establishment_name_snapshot",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_by_user_id": {
+          "name": "created_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "cancelled_at": {
+          "name": "cancelled_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "reservations_reference_unique_idx": {
+          "name": "reservations_reference_unique_idx",
+          "columns": [
+            {
+              "expression": "reference",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reservations_public_token_hash_unique_idx": {
+          "name": "reservations_public_token_hash_unique_idx",
+          "columns": [
+            {
+              "expression": "public_token_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reservations_scope_idempotency_unique_idx": {
+          "name": "reservations_scope_idempotency_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "idempotency_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reservations_scope_start_idx": {
+          "name": "reservations_scope_start_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "start_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reservations_capacity_idx": {
+          "name": "reservations_capacity_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "local_date",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "local_time",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "reservations_organization_id_organizations_id_fk": {
+          "name": "reservations_organization_id_organizations_id_fk",
+          "tableFrom": "reservations",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reservations_establishment_id_establishments_id_fk": {
+          "name": "reservations_establishment_id_establishments_id_fk",
+          "tableFrom": "reservations",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reservations_created_by_user_id_users_id_fk": {
+          "name": "reservations_created_by_user_id_users_id_fk",
+          "tableFrom": "reservations",
+          "tableTo": "users",
+          "columnsFrom": [
+            "created_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "reservations_party_size_check": {
+          "name": "reservations_party_size_check",
+          "value": "\"reservations\".\"party_size\" > 0"
+        },
+        "reservations_time_order_check": {
+          "name": "reservations_time_order_check",
+          "value": "\"reservations\".\"end_at\" > \"reservations\".\"start_at\""
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.formalites_personnel_draft_command_receipts": {
+      "name": "formalites_personnel_draft_command_receipts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "command_type": {
+          "name": "command_type",
+          "type": "formalites_personnel_draft_command",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "operation_key_hash": {
+          "name": "operation_key_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "request_fingerprint": {
+          "name": "request_fingerprint",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "resulting_draft_id": {
+          "name": "resulting_draft_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "resulting_draft_revision": {
+          "name": "resulting_draft_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "resulting_outcome": {
+          "name": "resulting_outcome",
+          "type": "formalites_personnel_draft_command_outcome",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "formalites_personnel_draft_receipts_scope_key_unique_idx": {
+          "name": "formalites_personnel_draft_receipts_scope_key_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "command_type",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "operation_key_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "formalites_personnel_draft_receipts_scope_draft_idx": {
+          "name": "formalites_personnel_draft_receipts_scope_draft_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "resulting_draft_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "formalites_personnel_draft_command_receipts_organization_id_organizations_id_fk": {
+          "name": "formalites_personnel_draft_command_receipts_organization_id_organizations_id_fk",
+          "tableFrom": "formalites_personnel_draft_command_receipts",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "formalites_personnel_draft_command_receipts_actor_user_id_users_id_fk": {
+          "name": "formalites_personnel_draft_command_receipts_actor_user_id_users_id_fk",
+          "tableFrom": "formalites_personnel_draft_command_receipts",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "formalites_personnel_draft_receipts_establishment_scope_fk": {
+          "name": "formalites_personnel_draft_receipts_establishment_scope_fk",
+          "tableFrom": "formalites_personnel_draft_command_receipts",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "formalites_personnel_draft_receipts_draft_scope_fk": {
+          "name": "formalites_personnel_draft_receipts_draft_scope_fk",
+          "tableFrom": "formalites_personnel_draft_command_receipts",
+          "tableTo": "formalites_personnel_drafts",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "resulting_draft_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "formalites_personnel_draft_receipts_revision_check": {
+          "name": "formalites_personnel_draft_receipts_revision_check",
+          "value": "\"formalites_personnel_draft_command_receipts\".\"resulting_draft_revision\" > 0"
+        },
+        "formalites_personnel_draft_receipts_hashes_check": {
+          "name": "formalites_personnel_draft_receipts_hashes_check",
+          "value": "char_length(\"formalites_personnel_draft_command_receipts\".\"operation_key_hash\") = 64 and \"formalites_personnel_draft_command_receipts\".\"operation_key_hash\" ~ '^[0-9a-f]{64}$' and char_length(\"formalites_personnel_draft_command_receipts\".\"request_fingerprint\") = 64 and \"formalites_personnel_draft_command_receipts\".\"request_fingerprint\" ~ '^[0-9a-f]{64}$'"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.formalites_personnel_drafts": {
+      "name": "formalites_personnel_drafts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "formality_type": {
+          "name": "formality_type",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "formalites_personnel_draft_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'draft'"
+        },
+        "probation_choice": {
+          "name": "probation_choice",
+          "type": "formalites_personnel_probation_choice",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'undecided'"
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "draft_given_names": {
+          "name": "draft_given_names",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "draft_family_name": {
+          "name": "draft_family_name",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "draft_position": {
+          "name": "draft_position",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "draft_qualification": {
+          "name": "draft_qualification",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "draft_employment_term_type": {
+          "name": "draft_employment_term_type",
+          "type": "personnel_employment_term_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "draft_entry_date": {
+          "name": "draft_entry_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "draft_contract_weekly_minutes": {
+          "name": "draft_contract_weekly_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "source_given_names": {
+          "name": "source_given_names",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_family_name": {
+          "name": "source_family_name",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_position": {
+          "name": "source_position",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_qualification": {
+          "name": "source_qualification",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_employment_term_type": {
+          "name": "source_employment_term_type",
+          "type": "personnel_employment_term_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_entry_date": {
+          "name": "source_entry_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_contract_weekly_minutes": {
+          "name": "source_contract_weekly_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "source_personnel_revision": {
+          "name": "source_personnel_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "abandonment_reason": {
+          "name": "abandonment_reason",
+          "type": "varchar(250)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "abandoned_at": {
+          "name": "abandoned_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "formalites_personnel_drafts_one_active_idx": {
+          "name": "formalites_personnel_drafts_one_active_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "formality_type",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "where": "\"formalites_personnel_drafts\".\"status\" = 'draft'",
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "formalites_personnel_drafts_scope_employee_idx": {
+          "name": "formalites_personnel_drafts_scope_employee_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "formalites_personnel_drafts_organization_id_organizations_id_fk": {
+          "name": "formalites_personnel_drafts_organization_id_organizations_id_fk",
+          "tableFrom": "formalites_personnel_drafts",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "formalites_personnel_drafts_establishment_scope_fk": {
+          "name": "formalites_personnel_drafts_establishment_scope_fk",
+          "tableFrom": "formalites_personnel_drafts",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "formalites_personnel_drafts_employee_scope_fk": {
+          "name": "formalites_personnel_drafts_employee_scope_fk",
+          "tableFrom": "formalites_personnel_drafts",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "formalites_personnel_drafts_scope_id_unique": {
+          "name": "formalites_personnel_drafts_scope_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "formalites_personnel_drafts_formality_type_check": {
+          "name": "formalites_personnel_drafts_formality_type_check",
+          "value": "\"formalites_personnel_drafts\".\"formality_type\" = 'cdi_preparation'"
+        },
+        "formalites_personnel_drafts_revision_check": {
+          "name": "formalites_personnel_drafts_revision_check",
+          "value": "\"formalites_personnel_drafts\".\"revision\" > 0"
+        },
+        "formalites_personnel_drafts_source_revision_check": {
+          "name": "formalites_personnel_drafts_source_revision_check",
+          "value": "\"formalites_personnel_drafts\".\"source_personnel_revision\" > 0"
+        },
+        "formalites_personnel_drafts_weekly_minutes_check": {
+          "name": "formalites_personnel_drafts_weekly_minutes_check",
+          "value": "(\"formalites_personnel_drafts\".\"draft_contract_weekly_minutes\" is null or (\"formalites_personnel_drafts\".\"draft_contract_weekly_minutes\" >= 1 and \"formalites_personnel_drafts\".\"draft_contract_weekly_minutes\" <= 2880)) and (\"formalites_personnel_drafts\".\"source_contract_weekly_minutes\" is null or (\"formalites_personnel_drafts\".\"source_contract_weekly_minutes\" >= 1 and \"formalites_personnel_drafts\".\"source_contract_weekly_minutes\" <= 2880))"
+        },
+        "formalites_personnel_drafts_lifecycle_check": {
+          "name": "formalites_personnel_drafts_lifecycle_check",
+          "value": "(\"formalites_personnel_drafts\".\"status\" = 'draft' and \"formalites_personnel_drafts\".\"abandonment_reason\" is null and \"formalites_personnel_drafts\".\"abandoned_at\" is null) or (\"formalites_personnel_drafts\".\"status\" = 'abandoned' and \"formalites_personnel_drafts\".\"abandonment_reason\" is not null and btrim(\"formalites_personnel_drafts\".\"abandonment_reason\") = \"formalites_personnel_drafts\".\"abandonment_reason\" and char_length(\"formalites_personnel_drafts\".\"abandonment_reason\") between 1 and 250 and \"formalites_personnel_drafts\".\"abandoned_at\" is not null)"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.formalites_template_identities": {
+      "name": "formalites_template_identities",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "legal_purpose": {
+          "name": "legal_purpose",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {},
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "formalites_template_purpose_nonempty": {
+          "name": "formalites_template_purpose_nonempty",
+          "value": "length(\"formalites_template_identities\".\"legal_purpose\") > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.formalites_template_versions": {
+      "name": "formalites_template_versions",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "template_id": {
+          "name": "template_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_draft_id": {
+          "name": "source_draft_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_draft_revision": {
+          "name": "source_draft_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "content_profile": {
+          "name": "content_profile",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_bytes": {
+          "name": "source_bytes",
+          "type": "bytea",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "checksum_algorithm": {
+          "name": "checksum_algorithm",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "content_checksum": {
+          "name": "content_checksum",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "applicability": {
+          "name": "applicability",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "frozen_at": {
+          "name": "frozen_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "formalites_template_versions_template_id_formalites_template_identities_id_fk": {
+          "name": "formalites_template_versions_template_id_formalites_template_identities_id_fk",
+          "tableFrom": "formalites_template_versions",
+          "tableTo": "formalites_template_identities",
+          "columnsFrom": [
+            "template_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "formalites_template_version_draft_containment": {
+          "name": "formalites_template_version_draft_containment",
+          "tableFrom": "formalites_template_versions",
+          "tableTo": "formalites_template_working_drafts",
+          "columnsFrom": [
+            "source_draft_id",
+            "template_id"
+          ],
+          "columnsTo": [
+            "id",
+            "template_id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "formalites_template_freeze_locator": {
+          "name": "formalites_template_freeze_locator",
+          "nullsNotDistinct": false,
+          "columns": [
+            "source_draft_id",
+            "source_draft_revision"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "formalites_template_version_positive_revision": {
+          "name": "formalites_template_version_positive_revision",
+          "value": "\"formalites_template_versions\".\"source_draft_revision\" > 0"
+        },
+        "formalites_template_checksum_algorithm": {
+          "name": "formalites_template_checksum_algorithm",
+          "value": "\"formalites_template_versions\".\"checksum_algorithm\" = 'sha256'"
+        },
+        "formalites_template_checksum_shape": {
+          "name": "formalites_template_checksum_shape",
+          "value": "\"formalites_template_versions\".\"content_checksum\" ~ '^[0-9a-f]{64}$'"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.formalites_template_working_drafts": {
+      "name": "formalites_template_working_drafts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "template_id": {
+          "name": "template_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "content_profile": {
+          "name": "content_profile",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source_bytes": {
+          "name": "source_bytes",
+          "type": "bytea",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "applicability": {
+          "name": "applicability",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "frozen_at": {
+          "name": "frozen_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {
+        "formalites_template_one_active_draft": {
+          "name": "formalites_template_one_active_draft",
+          "columns": [
+            {
+              "expression": "template_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "where": "\"formalites_template_working_drafts\".\"frozen_at\" is null",
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "formalites_template_working_drafts_template_id_formalites_template_identities_id_fk": {
+          "name": "formalites_template_working_drafts_template_id_formalites_template_identities_id_fk",
+          "tableFrom": "formalites_template_working_drafts",
+          "tableTo": "formalites_template_identities",
+          "columnsFrom": [
+            "template_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "formalites_template_draft_containment": {
+          "name": "formalites_template_draft_containment",
+          "nullsNotDistinct": false,
+          "columns": [
+            "id",
+            "template_id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "formalites_template_draft_positive_revision": {
+          "name": "formalites_template_draft_positive_revision",
+          "value": "\"formalites_template_working_drafts\".\"revision\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_command_receipts": {
+      "name": "personnel_command_receipts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "command_type": {
+          "name": "command_type",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "idempotency_hash": {
+          "name": "idempotency_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "request_fingerprint": {
+          "name": "request_fingerprint",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "expires_at": {
+          "name": "expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {
+        "personnel_command_receipts_scope_key_unique_idx": {
+          "name": "personnel_command_receipts_scope_key_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "command_type",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "idempotency_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_command_receipts_expires_at_idx": {
+          "name": "personnel_command_receipts_expires_at_idx",
+          "columns": [
+            {
+              "expression": "expires_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_command_receipts_organization_id_organizations_id_fk": {
+          "name": "personnel_command_receipts_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_command_receipts",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_command_receipts_actor_user_id_users_id_fk": {
+          "name": "personnel_command_receipts_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_command_receipts",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_command_receipts_employee_scope_fk": {
+          "name": "personnel_command_receipts_employee_scope_fk",
+          "tableFrom": "personnel_command_receipts",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.personnel_contract_amendment_command_receipts": {
+      "name": "personnel_contract_amendment_command_receipts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "command_type": {
+          "name": "command_type",
+          "type": "varchar(80)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "idempotency_hash": {
+          "name": "idempotency_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "request_fingerprint": {
+          "name": "request_fingerprint",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "amendment_id": {
+          "name": "amendment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "version": {
+          "name": "version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "expires_at": {
+          "name": "expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {
+        "personnel_contract_amendment_receipts_scope_key_unique_idx": {
+          "name": "personnel_contract_amendment_receipts_scope_key_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "idempotency_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_contract_amendment_receipts_expires_at_idx": {
+          "name": "personnel_contract_amendment_receipts_expires_at_idx",
+          "columns": [
+            {
+              "expression": "expires_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_contract_amendment_command_receipts_organization_id_organizations_id_fk": {
+          "name": "personnel_contract_amendment_command_receipts_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_contract_amendment_command_receipts",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_contract_amendment_command_receipts_actor_user_id_users_id_fk": {
+          "name": "personnel_contract_amendment_command_receipts_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_contract_amendment_command_receipts",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_contract_amendment_receipts_amendment_scope_fk": {
+          "name": "personnel_contract_amendment_receipts_amendment_scope_fk",
+          "tableFrom": "personnel_contract_amendment_command_receipts",
+          "tableTo": "personnel_contract_amendments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "amendment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_contract_amendment_receipts_version_check": {
+          "name": "personnel_contract_amendment_receipts_version_check",
+          "value": "\"personnel_contract_amendment_command_receipts\".\"version\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_contract_amendment_versions": {
+      "name": "personnel_contract_amendment_versions",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "amendment_id": {
+          "name": "amendment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "version": {
+          "name": "version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "filename": {
+          "name": "filename",
+          "type": "varchar(180)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "media_type": {
+          "name": "media_type",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "byte_size": {
+          "name": "byte_size",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "checksum": {
+          "name": "checksum",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "storage_key": {
+          "name": "storage_key",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "uploaded_by_user_id": {
+          "name": "uploaded_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_contract_amendment_versions_amendment_version_unique_idx": {
+          "name": "personnel_contract_amendment_versions_amendment_version_unique_idx",
+          "columns": [
+            {
+              "expression": "amendment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "version",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_contract_amendment_versions_storage_key_unique_idx": {
+          "name": "personnel_contract_amendment_versions_storage_key_unique_idx",
+          "columns": [
+            {
+              "expression": "storage_key",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_contract_amendment_versions_scope_employee_idx": {
+          "name": "personnel_contract_amendment_versions_scope_employee_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_contract_amendment_versions_organization_id_organizations_id_fk": {
+          "name": "personnel_contract_amendment_versions_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_contract_amendment_versions",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_contract_amendment_versions_uploaded_by_user_id_users_id_fk": {
+          "name": "personnel_contract_amendment_versions_uploaded_by_user_id_users_id_fk",
+          "tableFrom": "personnel_contract_amendment_versions",
+          "tableTo": "users",
+          "columnsFrom": [
+            "uploaded_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "personnel_contract_amendment_versions_amendment_scope_fk": {
+          "name": "personnel_contract_amendment_versions_amendment_scope_fk",
+          "tableFrom": "personnel_contract_amendment_versions",
+          "tableTo": "personnel_contract_amendments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "amendment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_contract_amendment_versions_version_check": {
+          "name": "personnel_contract_amendment_versions_version_check",
+          "value": "\"personnel_contract_amendment_versions\".\"version\" > 0"
+        },
+        "personnel_contract_amendment_versions_byte_size_check": {
+          "name": "personnel_contract_amendment_versions_byte_size_check",
+          "value": "\"personnel_contract_amendment_versions\".\"byte_size\" > 0 and \"personnel_contract_amendment_versions\".\"byte_size\" <= 10485760"
+        },
+        "personnel_contract_amendment_versions_media_type_check": {
+          "name": "personnel_contract_amendment_versions_media_type_check",
+          "value": "\"personnel_contract_amendment_versions\".\"media_type\" = 'application/pdf'"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_contract_amendments": {
+      "name": "personnel_contract_amendments",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "effective_date": {
+          "name": "effective_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reference": {
+          "name": "reference",
+          "type": "varchar(80)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "current_version": {
+          "name": "current_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_contract_amendments_scope_employee_date_idx": {
+          "name": "personnel_contract_amendments_scope_employee_date_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "effective_date",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_contract_amendments_organization_id_organizations_id_fk": {
+          "name": "personnel_contract_amendments_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_contract_amendments",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_contract_amendments_employee_scope_fk": {
+          "name": "personnel_contract_amendments_employee_scope_fk",
+          "tableFrom": "personnel_contract_amendments",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "personnel_contract_amendments_scope_id_unique": {
+          "name": "personnel_contract_amendments_scope_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "personnel_contract_amendments_current_version_check": {
+          "name": "personnel_contract_amendments_current_version_check",
+          "value": "\"personnel_contract_amendments\".\"current_version\" > 0"
+        },
+        "personnel_contract_amendments_revision_check": {
+          "name": "personnel_contract_amendments_revision_check",
+          "value": "\"personnel_contract_amendments\".\"revision\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_document_command_receipts": {
+      "name": "personnel_document_command_receipts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "idempotency_hash": {
+          "name": "idempotency_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "request_fingerprint": {
+          "name": "request_fingerprint",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "document_id": {
+          "name": "document_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "version": {
+          "name": "version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "expires_at": {
+          "name": "expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {
+        "personnel_document_receipts_scope_key_unique_idx": {
+          "name": "personnel_document_receipts_scope_key_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "idempotency_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_document_receipts_expires_at_idx": {
+          "name": "personnel_document_receipts_expires_at_idx",
+          "columns": [
+            {
+              "expression": "expires_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_document_command_receipts_organization_id_organizations_id_fk": {
+          "name": "personnel_document_command_receipts_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_document_command_receipts",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_document_command_receipts_actor_user_id_users_id_fk": {
+          "name": "personnel_document_command_receipts_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_document_command_receipts",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_document_receipts_document_scope_fk": {
+          "name": "personnel_document_receipts_document_scope_fk",
+          "tableFrom": "personnel_document_command_receipts",
+          "tableTo": "personnel_documents",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "document_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_document_receipts_version_check": {
+          "name": "personnel_document_receipts_version_check",
+          "value": "\"personnel_document_command_receipts\".\"version\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_document_versions": {
+      "name": "personnel_document_versions",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "document_id": {
+          "name": "document_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "version": {
+          "name": "version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "filename": {
+          "name": "filename",
+          "type": "varchar(180)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "media_type": {
+          "name": "media_type",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "byte_size": {
+          "name": "byte_size",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "checksum": {
+          "name": "checksum",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "storage_key": {
+          "name": "storage_key",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "uploaded_by_user_id": {
+          "name": "uploaded_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_document_versions_document_version_unique_idx": {
+          "name": "personnel_document_versions_document_version_unique_idx",
+          "columns": [
+            {
+              "expression": "document_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "version",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_document_versions_storage_key_unique_idx": {
+          "name": "personnel_document_versions_storage_key_unique_idx",
+          "columns": [
+            {
+              "expression": "storage_key",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_document_versions_scope_employee_idx": {
+          "name": "personnel_document_versions_scope_employee_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_document_versions_organization_id_organizations_id_fk": {
+          "name": "personnel_document_versions_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_document_versions",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_document_versions_uploaded_by_user_id_users_id_fk": {
+          "name": "personnel_document_versions_uploaded_by_user_id_users_id_fk",
+          "tableFrom": "personnel_document_versions",
+          "tableTo": "users",
+          "columnsFrom": [
+            "uploaded_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "personnel_document_versions_document_scope_fk": {
+          "name": "personnel_document_versions_document_scope_fk",
+          "tableFrom": "personnel_document_versions",
+          "tableTo": "personnel_documents",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "document_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_document_versions_version_check": {
+          "name": "personnel_document_versions_version_check",
+          "value": "\"personnel_document_versions\".\"version\" > 0"
+        },
+        "personnel_document_versions_byte_size_check": {
+          "name": "personnel_document_versions_byte_size_check",
+          "value": "\"personnel_document_versions\".\"byte_size\" > 0 and \"personnel_document_versions\".\"byte_size\" <= 10485760"
+        },
+        "personnel_document_versions_media_type_check": {
+          "name": "personnel_document_versions_media_type_check",
+          "value": "\"personnel_document_versions\".\"media_type\" = 'application/pdf'"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_documents": {
+      "name": "personnel_documents",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "category": {
+          "name": "category",
+          "type": "personnel_document_category",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "current_version": {
+          "name": "current_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_documents_scope_employee_category_unique_idx": {
+          "name": "personnel_documents_scope_employee_category_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "category",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_documents_organization_id_organizations_id_fk": {
+          "name": "personnel_documents_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_documents",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_documents_employee_scope_fk": {
+          "name": "personnel_documents_employee_scope_fk",
+          "tableFrom": "personnel_documents",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "personnel_documents_scope_id_unique": {
+          "name": "personnel_documents_scope_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "personnel_documents_current_version_check": {
+          "name": "personnel_documents_current_version_check",
+          "value": "\"personnel_documents\".\"current_version\" > 0"
+        },
+        "personnel_documents_revision_check": {
+          "name": "personnel_documents_revision_check",
+          "value": "\"personnel_documents\".\"revision\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_employee_audit_events": {
+      "name": "personnel_employee_audit_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "event_type": {
+          "name": "event_type",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "operation_id": {
+          "name": "operation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "changed_fields": {
+          "name": "changed_fields",
+          "type": "varchar(100)[]",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "ARRAY[]::varchar[]"
+        },
+        "metadata": {
+          "name": "metadata",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'{}'::jsonb"
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_employee_audit_events_scope_employee_idx": {
+          "name": "personnel_employee_audit_events_scope_employee_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_employee_audit_events_organization_id_organizations_id_fk": {
+          "name": "personnel_employee_audit_events_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_employee_audit_events",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_employee_audit_events_actor_user_id_users_id_fk": {
+          "name": "personnel_employee_audit_events_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_employee_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "personnel_employee_audit_events_employee_scope_fk": {
+          "name": "personnel_employee_audit_events_employee_scope_fk",
+          "tableFrom": "personnel_employee_audit_events",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.personnel_employee_dossiers": {
+      "name": "personnel_employee_dossiers",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "given_names": {
+          "name": "given_names",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "family_name": {
+          "name": "family_name",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "position": {
+          "name": "position",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "qualification": {
+          "name": "qualification",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employment_term_type": {
+          "name": "employment_term_type",
+          "type": "personnel_employment_term_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "expected_end_date": {
+          "name": "expected_end_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "fixed_term_reason_code": {
+          "name": "fixed_term_reason_code",
+          "type": "personnel_fixed_term_reason_code",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "work_time_category": {
+          "name": "work_time_category",
+          "type": "personnel_work_time_category",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "contract_weekly_minutes": {
+          "name": "contract_weekly_minutes",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "entry_date": {
+          "name": "entry_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "departure_date": {
+          "name": "departure_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_employee_dossiers_scope_entry_idx": {
+          "name": "personnel_employee_dossiers_scope_entry_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "entry_date",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_employee_dossiers_scope_name_idx": {
+          "name": "personnel_employee_dossiers_scope_name_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "family_name",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "given_names",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_employee_dossiers_scope_id_unique_idx": {
+          "name": "personnel_employee_dossiers_scope_id_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_employee_dossiers_organization_id_organizations_id_fk": {
+          "name": "personnel_employee_dossiers_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_employee_dossiers",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_employee_dossiers_establishment_scope_fk": {
+          "name": "personnel_employee_dossiers_establishment_scope_fk",
+          "tableFrom": "personnel_employee_dossiers",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_employee_dossiers_term_dates_check": {
+          "name": "personnel_employee_dossiers_term_dates_check",
+          "value": "(\"personnel_employee_dossiers\".\"employment_term_type\" = 'indefinite' and \"personnel_employee_dossiers\".\"expected_end_date\" is null) or (\"personnel_employee_dossiers\".\"employment_term_type\" = 'fixed_term' and \"personnel_employee_dossiers\".\"expected_end_date\" is not null and \"personnel_employee_dossiers\".\"expected_end_date\" >= \"personnel_employee_dossiers\".\"entry_date\")"
+        },
+        "personnel_employee_dossiers_fixed_term_reason_check": {
+          "name": "personnel_employee_dossiers_fixed_term_reason_check",
+          "value": "(\"personnel_employee_dossiers\".\"employment_term_type\" = 'indefinite' and \"personnel_employee_dossiers\".\"fixed_term_reason_code\" is null) or \"personnel_employee_dossiers\".\"employment_term_type\" = 'fixed_term'"
+        },
+        "personnel_employee_dossiers_contract_weekly_minutes_check": {
+          "name": "personnel_employee_dossiers_contract_weekly_minutes_check",
+          "value": "\"personnel_employee_dossiers\".\"contract_weekly_minutes\" is null or (\"personnel_employee_dossiers\".\"contract_weekly_minutes\" >= 1 and \"personnel_employee_dossiers\".\"contract_weekly_minutes\" <= 2880)"
+        },
+        "personnel_employee_dossiers_departure_date_check": {
+          "name": "personnel_employee_dossiers_departure_date_check",
+          "value": "\"personnel_employee_dossiers\".\"departure_date\" is null or \"personnel_employee_dossiers\".\"departure_date\" >= \"personnel_employee_dossiers\".\"entry_date\""
+        },
+        "personnel_employee_dossiers_revision_check": {
+          "name": "personnel_employee_dossiers_revision_check",
+          "value": "\"personnel_employee_dossiers\".\"revision\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_employee_history_events": {
+      "name": "personnel_employee_history_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "event_kind": {
+          "name": "event_kind",
+          "type": "personnel_history_event_kind",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "operation_id": {
+          "name": "operation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "previous_revision": {
+          "name": "previous_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "new_revision": {
+          "name": "new_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "payload_version": {
+          "name": "payload_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "recorded_at": {
+          "name": "recorded_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {
+        "personnel_employee_history_events_scope_operation_unique_idx": {
+          "name": "personnel_employee_history_events_scope_operation_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "operation_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_employee_history_events_one_cutover_idx": {
+          "name": "personnel_employee_history_events_one_cutover_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "where": "\"personnel_employee_history_events\".\"event_kind\" = 'cutover_baseline'",
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_employee_history_events_scope_employee_recorded_idx": {
+          "name": "personnel_employee_history_events_scope_employee_recorded_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "recorded_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_employee_history_events_organization_id_organizations_id_fk": {
+          "name": "personnel_employee_history_events_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_employee_history_events",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_employee_history_events_actor_user_id_users_id_fk": {
+          "name": "personnel_employee_history_events_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_employee_history_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "personnel_employee_history_events_employee_scope_fk": {
+          "name": "personnel_employee_history_events_employee_scope_fk",
+          "tableFrom": "personnel_employee_history_events",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "personnel_employee_history_events_scope_kind_id_unique": {
+          "name": "personnel_employee_history_events_scope_kind_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "event_kind",
+            "id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "personnel_employee_history_events_payload_version_check": {
+          "name": "personnel_employee_history_events_payload_version_check",
+          "value": "\"personnel_employee_history_events\".\"payload_version\" = 1"
+        },
+        "personnel_employee_history_events_kind_metadata_check": {
+          "name": "personnel_employee_history_events_kind_metadata_check",
+          "value": "(\"personnel_employee_history_events\".\"event_kind\" = 'mutation' and \"personnel_employee_history_events\".\"previous_revision\" is not null and \"personnel_employee_history_events\".\"previous_revision\" > 0 and \"personnel_employee_history_events\".\"new_revision\" = \"personnel_employee_history_events\".\"previous_revision\" + 1) or (\"personnel_employee_history_events\".\"event_kind\" = 'cutover_baseline' and \"personnel_employee_history_events\".\"actor_user_id\" is null and \"personnel_employee_history_events\".\"previous_revision\" is null and \"personnel_employee_history_events\".\"new_revision\" > 0)"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_employee_history_group_changes": {
+      "name": "personnel_employee_history_group_changes",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "event_id": {
+          "name": "event_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "event_kind": {
+          "name": "event_kind",
+          "type": "personnel_history_event_kind",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "semantic_group": {
+          "name": "semantic_group",
+          "type": "personnel_history_semantic_group",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "classification": {
+          "name": "classification",
+          "type": "personnel_history_classification",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "previous_values": {
+          "name": "previous_values",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "new_values": {
+          "name": "new_values",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "effective_date": {
+          "name": "effective_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "correction_reason": {
+          "name": "correction_reason",
+          "type": "varchar(250)",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {
+        "personnel_employee_history_groups_event_group_unique_idx": {
+          "name": "personnel_employee_history_groups_event_group_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "event_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "semantic_group",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_employee_history_groups_scope_employee_idx": {
+          "name": "personnel_employee_history_groups_scope_employee_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "event_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_employee_history_group_changes_organization_id_organizations_id_fk": {
+          "name": "personnel_employee_history_group_changes_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_employee_history_group_changes",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_employee_history_groups_event_scope_fk": {
+          "name": "personnel_employee_history_groups_event_scope_fk",
+          "tableFrom": "personnel_employee_history_group_changes",
+          "tableTo": "personnel_employee_history_events",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "event_kind",
+            "event_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "employee_id",
+            "event_kind",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_employee_history_groups_kind_metadata_check": {
+          "name": "personnel_employee_history_groups_kind_metadata_check",
+          "value": "(\"personnel_employee_history_group_changes\".\"event_kind\" = 'mutation' and \"personnel_employee_history_group_changes\".\"classification\" is not null and \"personnel_employee_history_group_changes\".\"previous_values\" is not null) or (\"personnel_employee_history_group_changes\".\"event_kind\" = 'cutover_baseline' and \"personnel_employee_history_group_changes\".\"classification\" is null and \"personnel_employee_history_group_changes\".\"previous_values\" is null and \"personnel_employee_history_group_changes\".\"effective_date\" is null and \"personnel_employee_history_group_changes\".\"correction_reason\" is null)"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_history_cutovers": {
+      "name": "personnel_history_cutovers",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "cutover_version": {
+          "name": "cutover_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "cutover_at": {
+          "name": "cutover_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "completed_at": {
+          "name": "completed_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "personnel_history_cutovers_organization_id_organizations_id_fk": {
+          "name": "personnel_history_cutovers_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_history_cutovers",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_history_cutovers_establishment_scope_fk": {
+          "name": "personnel_history_cutovers_establishment_scope_fk",
+          "tableFrom": "personnel_history_cutovers",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "personnel_history_cutovers_scope_version_unique": {
+          "name": "personnel_history_cutovers_scope_version_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "cutover_version"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "personnel_history_cutovers_version_check": {
+          "name": "personnel_history_cutovers_version_check",
+          "value": "\"personnel_history_cutovers\".\"cutover_version\" = 1"
+        },
+        "personnel_history_cutovers_timestamps_check": {
+          "name": "personnel_history_cutovers_timestamps_check",
+          "value": "\"personnel_history_cutovers\".\"completed_at\" >= \"personnel_history_cutovers\".\"cutover_at\""
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_register_audit_events": {
+      "name": "personnel_register_audit_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "event_type": {
+          "name": "event_type",
+          "type": "varchar(80)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "operation_id": {
+          "name": "operation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_register_audit_scope_operation_unique_idx": {
+          "name": "personnel_register_audit_scope_operation_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "event_type",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "operation_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_register_audit_scope_created_idx": {
+          "name": "personnel_register_audit_scope_created_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_register_audit_events_actor_user_id_users_id_fk": {
+          "name": "personnel_register_audit_events_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_register_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_register_audit_establishment_scope_fk": {
+          "name": "personnel_register_audit_establishment_scope_fk",
+          "tableFrom": "personnel_register_audit_events",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.personnel_register_command_receipts": {
+      "name": "personnel_register_command_receipts",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "command_type": {
+          "name": "command_type",
+          "type": "varchar(80)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "operation_id": {
+          "name": "operation_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "request_fingerprint": {
+          "name": "request_fingerprint",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "entry_id": {
+          "name": "entry_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_register_receipts_scope_operation_unique_idx": {
+          "name": "personnel_register_receipts_scope_operation_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "actor_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "command_type",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "operation_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_register_command_receipts_actor_user_id_users_id_fk": {
+          "name": "personnel_register_command_receipts_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_register_command_receipts",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_register_receipts_entry_scope_fk": {
+          "name": "personnel_register_receipts_entry_scope_fk",
+          "tableFrom": "personnel_register_command_receipts",
+          "tableTo": "personnel_register_entries",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "entry_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.personnel_register_corrections": {
+      "name": "personnel_register_corrections",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "entry_id": {
+          "name": "entry_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "prior_revision": {
+          "name": "prior_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "new_revision": {
+          "name": "new_revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "previous_facts": {
+          "name": "previous_facts",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "new_facts": {
+          "name": "new_facts",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "effective_date": {
+          "name": "effective_date",
+          "type": "date",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reason": {
+          "name": "reason",
+          "type": "varchar(250)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "recorded_at": {
+          "name": "recorded_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_register_corrections_scope_entry_idx": {
+          "name": "personnel_register_corrections_scope_entry_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "entry_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "new_revision",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_register_corrections_actor_user_id_users_id_fk": {
+          "name": "personnel_register_corrections_actor_user_id_users_id_fk",
+          "tableFrom": "personnel_register_corrections",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "personnel_register_corrections_entry_scope_fk": {
+          "name": "personnel_register_corrections_entry_scope_fk",
+          "tableFrom": "personnel_register_corrections",
+          "tableTo": "personnel_register_entries",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "entry_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "personnel_register_corrections_revision_check": {
+          "name": "personnel_register_corrections_revision_check",
+          "value": "\"personnel_register_corrections\".\"prior_revision\" > 0 and \"personnel_register_corrections\".\"new_revision\" = \"personnel_register_corrections\".\"prior_revision\" + 1"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_register_counters": {
+      "name": "personnel_register_counters",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "next_sequence": {
+          "name": "next_sequence",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 0
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "personnel_register_counters_organization_id_organizations_id_fk": {
+          "name": "personnel_register_counters_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_register_counters",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_register_counters_establishment_scope_fk": {
+          "name": "personnel_register_counters_establishment_scope_fk",
+          "tableFrom": "personnel_register_counters",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "personnel_register_counters_scope_unique": {
+          "name": "personnel_register_counters_scope_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "personnel_register_counters_next_check": {
+          "name": "personnel_register_counters_next_check",
+          "value": "\"personnel_register_counters\".\"next_sequence\" > 0"
+        },
+        "personnel_register_counters_revision_check": {
+          "name": "personnel_register_counters_revision_check",
+          "value": "\"personnel_register_counters\".\"revision\" >= 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.personnel_register_entries": {
+      "name": "personnel_register_entries",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "employee_id": {
+          "name": "employee_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "sequence": {
+          "name": "sequence",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "revision": {
+          "name": "revision",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 1
+        },
+        "initial_facts": {
+          "name": "initial_facts",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "current_facts": {
+          "name": "current_facts",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "inscribed_by_user_id": {
+          "name": "inscribed_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "inscribed_at": {
+          "name": "inscribed_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "personnel_register_entries_scope_employee_unique_idx": {
+          "name": "personnel_register_entries_scope_employee_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "employee_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "personnel_register_entries_scope_sequence_unique_idx": {
+          "name": "personnel_register_entries_scope_sequence_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "sequence",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "personnel_register_entries_organization_id_organizations_id_fk": {
+          "name": "personnel_register_entries_organization_id_organizations_id_fk",
+          "tableFrom": "personnel_register_entries",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "personnel_register_entries_inscribed_by_user_id_users_id_fk": {
+          "name": "personnel_register_entries_inscribed_by_user_id_users_id_fk",
+          "tableFrom": "personnel_register_entries",
+          "tableTo": "users",
+          "columnsFrom": [
+            "inscribed_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "personnel_register_entries_employee_scope_fk": {
+          "name": "personnel_register_entries_employee_scope_fk",
+          "tableFrom": "personnel_register_entries",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "employee_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "personnel_register_entries_scope_id_unique": {
+          "name": "personnel_register_entries_scope_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "personnel_register_entries_sequence_check": {
+          "name": "personnel_register_entries_sequence_check",
+          "value": "\"personnel_register_entries\".\"sequence\" > 0"
+        },
+        "personnel_register_entries_revision_check": {
+          "name": "personnel_register_entries_revision_check",
+          "value": "\"personnel_register_entries\".\"revision\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.pointage_credential_rate_limits": {
+      "name": "pointage_credential_rate_limits",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "key_kind": {
+          "name": "key_kind",
+          "type": "varchar(16)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "key_digest": {
+          "name": "key_digest",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "window_started_at": {
+          "name": "window_started_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "failure_count": {
+          "name": "failure_count",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "blocked_until": {
+          "name": "blocked_until",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "pointage_rate_limits_establishment_scope_fk": {
+          "name": "pointage_rate_limits_establishment_scope_fk",
+          "tableFrom": "pointage_credential_rate_limits",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "pointage_rate_limits_scope_key_pk": {
+          "name": "pointage_rate_limits_scope_key_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "key_kind",
+            "key_digest"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "pointage_rate_limits_key_kind_check": {
+          "name": "pointage_rate_limits_key_kind_check",
+          "value": "\"pointage_credential_rate_limits\".\"key_kind\" in ('candidate', 'client')"
+        },
+        "pointage_rate_limits_digest_check": {
+          "name": "pointage_rate_limits_digest_check",
+          "value": "\"pointage_credential_rate_limits\".\"key_digest\" ~ '^[0-9a-f]{64}$'"
+        },
+        "pointage_rate_limits_failure_count_check": {
+          "name": "pointage_rate_limits_failure_count_check",
+          "value": "\"pointage_credential_rate_limits\".\"failure_count\" >= 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.pointage_employee_credentials": {
+      "name": "pointage_employee_credentials",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "personnel_dossier_id": {
+          "name": "personnel_dossier_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "credential_version": {
+          "name": "credential_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "credential_format_version": {
+          "name": "credential_format_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "algorithm_version": {
+          "name": "algorithm_version",
+          "type": "varchar(32)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "key_version": {
+          "name": "key_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "lookup_digest": {
+          "name": "lookup_digest",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "salt": {
+          "name": "salt",
+          "type": "varchar(24)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "verifier": {
+          "name": "verifier",
+          "type": "varchar(44)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "issued_at": {
+          "name": "issued_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "issued_by_user_id": {
+          "name": "issued_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "superseded_at": {
+          "name": "superseded_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "superseded_by_credential_id": {
+          "name": "superseded_by_credential_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "superseded_by_user_id": {
+          "name": "superseded_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {
+        "pointage_credentials_historical_digest_unique_idx": {
+          "name": "pointage_credentials_historical_digest_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "lookup_digest",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "pointage_credentials_dossier_version_unique_idx": {
+          "name": "pointage_credentials_dossier_version_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "personnel_dossier_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "credential_version",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "pointage_credentials_one_active_dossier_unique_idx": {
+          "name": "pointage_credentials_one_active_dossier_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "personnel_dossier_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "where": "\"pointage_employee_credentials\".\"superseded_at\" is null",
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "pointage_credentials_scope_dossier_idx": {
+          "name": "pointage_credentials_scope_dossier_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "personnel_dossier_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "pointage_employee_credentials_organization_id_organizations_id_fk": {
+          "name": "pointage_employee_credentials_organization_id_organizations_id_fk",
+          "tableFrom": "pointage_employee_credentials",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "pointage_employee_credentials_issued_by_user_id_users_id_fk": {
+          "name": "pointage_employee_credentials_issued_by_user_id_users_id_fk",
+          "tableFrom": "pointage_employee_credentials",
+          "tableTo": "users",
+          "columnsFrom": [
+            "issued_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "pointage_employee_credentials_superseded_by_user_id_users_id_fk": {
+          "name": "pointage_employee_credentials_superseded_by_user_id_users_id_fk",
+          "tableFrom": "pointage_employee_credentials",
+          "tableTo": "users",
+          "columnsFrom": [
+            "superseded_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "pointage_credentials_establishment_scope_fk": {
+          "name": "pointage_credentials_establishment_scope_fk",
+          "tableFrom": "pointage_employee_credentials",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "pointage_credentials_dossier_scope_fk": {
+          "name": "pointage_credentials_dossier_scope_fk",
+          "tableFrom": "pointage_employee_credentials",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "personnel_dossier_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "pointage_credentials_superseded_scope_fk": {
+          "name": "pointage_credentials_superseded_scope_fk",
+          "tableFrom": "pointage_employee_credentials",
+          "tableTo": "pointage_employee_credentials",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "superseded_by_credential_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "pointage_credentials_scope_id_unique": {
+          "name": "pointage_credentials_scope_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {
+        "pointage_credentials_versions_check": {
+          "name": "pointage_credentials_versions_check",
+          "value": "\"pointage_employee_credentials\".\"credential_version\" > 0 and \"pointage_employee_credentials\".\"credential_format_version\" > 0 and \"pointage_employee_credentials\".\"key_version\" > 0"
+        },
+        "pointage_credentials_lookup_digest_check": {
+          "name": "pointage_credentials_lookup_digest_check",
+          "value": "\"pointage_employee_credentials\".\"lookup_digest\" ~ '^[0-9a-f]{64}$'"
+        },
+        "pointage_credentials_supersede_consistency_check": {
+          "name": "pointage_credentials_supersede_consistency_check",
+          "value": "(\"pointage_employee_credentials\".\"superseded_at\" is null and \"pointage_employee_credentials\".\"superseded_by_credential_id\" is null and \"pointage_employee_credentials\".\"superseded_by_user_id\" is null) or (\"pointage_employee_credentials\".\"superseded_at\" is not null and \"pointage_employee_credentials\".\"superseded_by_credential_id\" is not null and \"pointage_employee_credentials\".\"superseded_by_user_id\" is not null)"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.pointage_security_audit_events": {
+      "name": "pointage_security_audit_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "event_type": {
+          "name": "event_type",
+          "type": "varchar(80)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "outcome": {
+          "name": "outcome",
+          "type": "varchar(16)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reason_code": {
+          "name": "reason_code",
+          "type": "varchar(40)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "manager_user_id": {
+          "name": "manager_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "personnel_dossier_id": {
+          "name": "personnel_dossier_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "credential_id": {
+          "name": "credential_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "credential_version": {
+          "name": "credential_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "requested_operation": {
+          "name": "requested_operation",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "occurred_at": {
+          "name": "occurred_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {
+        "pointage_audit_scope_time_idx": {
+          "name": "pointage_audit_scope_time_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "occurred_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "pointage_security_audit_events_manager_user_id_users_id_fk": {
+          "name": "pointage_security_audit_events_manager_user_id_users_id_fk",
+          "tableFrom": "pointage_security_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "manager_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "pointage_audit_establishment_scope_fk": {
+          "name": "pointage_audit_establishment_scope_fk",
+          "tableFrom": "pointage_security_audit_events",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "pointage_audit_dossier_scope_fk": {
+          "name": "pointage_audit_dossier_scope_fk",
+          "tableFrom": "pointage_security_audit_events",
+          "tableTo": "personnel_employee_dossiers",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "personnel_dossier_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "pointage_audit_credential_scope_fk": {
+          "name": "pointage_audit_credential_scope_fk",
+          "tableFrom": "pointage_security_audit_events",
+          "tableTo": "pointage_employee_credentials",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id",
+            "credential_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "pointage_audit_event_type_check": {
+          "name": "pointage_audit_event_type_check",
+          "value": "\"pointage_security_audit_events\".\"event_type\" in ('pointage.credential.issued', 'pointage.credential.reset', 'pointage.credential.superseded', 'pointage.credential.authentication_succeeded', 'pointage.credential.authentication_denied', 'pointage.credential.rate_limited', 'pointage.authorization.denied', 'pointage.evidence_eligibility.denied')"
+        },
+        "pointage_audit_outcome_check": {
+          "name": "pointage_audit_outcome_check",
+          "value": "\"pointage_security_audit_events\".\"outcome\" in ('succeeded', 'denied')"
+        },
+        "pointage_audit_reason_code_check": {
+          "name": "pointage_audit_reason_code_check",
+          "value": "\"pointage_security_audit_events\".\"reason_code\" is null or \"pointage_security_audit_events\".\"reason_code\" in ('invalid_credential', 'superseded_credential', 'unsupported_version', 'rate_limited', 'scope_not_resolved', 'client_address_untrusted', 'operation_not_granted', 'dossier_not_in_scope', 'before_entry', 'after_departure')"
+        },
+        "pointage_audit_credential_version_check": {
+          "name": "pointage_audit_credential_version_check",
+          "value": "\"pointage_security_audit_events\".\"credential_version\" is null or \"pointage_security_audit_events\".\"credential_version\" > 0"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.direct_customer_feedback": {
+      "name": "direct_customer_feedback",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "feedback_item_id": {
+          "name": "feedback_item_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "selected_topics": {
+          "name": "selected_topics",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'[]'::jsonb"
+        },
+        "customer_name": {
+          "name": "customer_name",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "customer_email": {
+          "name": "customer_email",
+          "type": "varchar(320)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "customer_phone": {
+          "name": "customer_phone",
+          "type": "varchar(40)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "consent_to_contact": {
+          "name": "consent_to_contact",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "consent_recorded_at": {
+          "name": "consent_recorded_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "order_reference": {
+          "name": "order_reference",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "visit_date": {
+          "name": "visit_date",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "service_period": {
+          "name": "service_period",
+          "type": "feedback_service_period",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "source_tag": {
+          "name": "source_tag",
+          "type": "varchar(50)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "submission_ip_hash": {
+          "name": "submission_ip_hash",
+          "type": "varchar(64)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "user_agent": {
+          "name": "user_agent",
+          "type": "varchar(500)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "direct_customer_feedback_item_unique_idx": {
+          "name": "direct_customer_feedback_item_unique_idx",
+          "columns": [
+            {
+              "expression": "feedback_item_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "direct_customer_feedback_scope_idx": {
+          "name": "direct_customer_feedback_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "direct_customer_feedback_ip_created_idx": {
+          "name": "direct_customer_feedback_ip_created_idx",
+          "columns": [
+            {
+              "expression": "submission_ip_hash",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "direct_customer_feedback_organization_id_organizations_id_fk": {
+          "name": "direct_customer_feedback_organization_id_organizations_id_fk",
+          "tableFrom": "direct_customer_feedback",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "direct_customer_feedback_establishment_id_establishments_id_fk": {
+          "name": "direct_customer_feedback_establishment_id_establishments_id_fk",
+          "tableFrom": "direct_customer_feedback",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "direct_customer_feedback_feedback_item_id_feedback_items_id_fk": {
+          "name": "direct_customer_feedback_feedback_item_id_feedback_items_id_fk",
+          "tableFrom": "direct_customer_feedback",
+          "tableTo": "feedback_items",
+          "columnsFrom": [
+            "feedback_item_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.feedback_internal_notes": {
+      "name": "feedback_internal_notes",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "feedback_item_id": {
+          "name": "feedback_item_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "content": {
+          "name": "content",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_by_user_id": {
+          "name": "created_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "feedback_internal_notes_organization_id_idx": {
+          "name": "feedback_internal_notes_organization_id_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_internal_notes_feedback_item_id_idx": {
+          "name": "feedback_internal_notes_feedback_item_id_idx",
+          "columns": [
+            {
+              "expression": "feedback_item_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "feedback_internal_notes_organization_id_organizations_id_fk": {
+          "name": "feedback_internal_notes_organization_id_organizations_id_fk",
+          "tableFrom": "feedback_internal_notes",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "feedback_internal_notes_feedback_item_id_feedback_items_id_fk": {
+          "name": "feedback_internal_notes_feedback_item_id_feedback_items_id_fk",
+          "tableFrom": "feedback_internal_notes",
+          "tableTo": "feedback_items",
+          "columnsFrom": [
+            "feedback_item_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        },
+        "feedback_internal_notes_created_by_user_id_users_id_fk": {
+          "name": "feedback_internal_notes_created_by_user_id_users_id_fk",
+          "tableFrom": "feedback_internal_notes",
+          "tableTo": "users",
+          "columnsFrom": [
+            "created_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.feedback_items": {
+      "name": "feedback_items",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "source": {
+          "name": "source",
+          "type": "feedback_source",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "type": {
+          "name": "type",
+          "type": "feedback_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "external_id": {
+          "name": "external_id",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "external_url": {
+          "name": "external_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "author_name": {
+          "name": "author_name",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "author_avatar_url": {
+          "name": "author_avatar_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "rating": {
+          "name": "rating",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "title": {
+          "name": "title",
+          "type": "varchar(500)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "content": {
+          "name": "content",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "language": {
+          "name": "language",
+          "type": "varchar(35)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "sentiment": {
+          "name": "sentiment",
+          "type": "feedback_sentiment",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "urgency": {
+          "name": "urgency",
+          "type": "feedback_urgency",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "status": {
+          "name": "status",
+          "type": "feedback_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'NEW'"
+        },
+        "assigned_to_user_id": {
+          "name": "assigned_to_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "published_at": {
+          "name": "published_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "received_at": {
+          "name": "received_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "last_synced_at": {
+          "name": "last_synced_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "provider_metadata": {
+          "name": "provider_metadata",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "feedback_items_provider_external_unique_idx": {
+          "name": "feedback_items_provider_external_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "source",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "external_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_items_scope_idx": {
+          "name": "feedback_items_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_items_status_idx": {
+          "name": "feedback_items_status_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_items_received_at_idx": {
+          "name": "feedback_items_received_at_idx",
+          "columns": [
+            {
+              "expression": "received_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_items_assigned_to_user_id_idx": {
+          "name": "feedback_items_assigned_to_user_id_idx",
+          "columns": [
+            {
+              "expression": "assigned_to_user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "feedback_items_organization_id_organizations_id_fk": {
+          "name": "feedback_items_organization_id_organizations_id_fk",
+          "tableFrom": "feedback_items",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "feedback_items_establishment_id_establishments_id_fk": {
+          "name": "feedback_items_establishment_id_establishments_id_fk",
+          "tableFrom": "feedback_items",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "feedback_items_assigned_to_user_id_users_id_fk": {
+          "name": "feedback_items_assigned_to_user_id_users_id_fk",
+          "tableFrom": "feedback_items",
+          "tableTo": "users",
+          "columnsFrom": [
+            "assigned_to_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "feedback_items_rating_check": {
+          "name": "feedback_items_rating_check",
+          "value": "\"feedback_items\".\"rating\" is null or (\"feedback_items\".\"rating\" >= 1 and \"feedback_items\".\"rating\" <= 5)"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.feedback_replies": {
+      "name": "feedback_replies",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "feedback_item_id": {
+          "name": "feedback_item_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "content": {
+          "name": "content",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "feedback_reply_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'DRAFT'"
+        },
+        "external_reply_id": {
+          "name": "external_reply_id",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "external_reply_status": {
+          "name": "external_reply_status",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "generated_by_ai": {
+          "name": "generated_by_ai",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "original_ai_content": {
+          "name": "original_ai_content",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_by_user_id": {
+          "name": "created_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "edited_by_user_id": {
+          "name": "edited_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "approved_by_user_id": {
+          "name": "approved_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "published_by_user_id": {
+          "name": "published_by_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "published_at": {
+          "name": "published_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "failed_at": {
+          "name": "failed_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "error_code": {
+          "name": "error_code",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "error_message": {
+          "name": "error_message",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "feedback_replies_organization_id_idx": {
+          "name": "feedback_replies_organization_id_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_replies_feedback_item_id_idx": {
+          "name": "feedback_replies_feedback_item_id_idx",
+          "columns": [
+            {
+              "expression": "feedback_item_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "feedback_replies_status_idx": {
+          "name": "feedback_replies_status_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "feedback_replies_organization_id_organizations_id_fk": {
+          "name": "feedback_replies_organization_id_organizations_id_fk",
+          "tableFrom": "feedback_replies",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "feedback_replies_feedback_item_id_feedback_items_id_fk": {
+          "name": "feedback_replies_feedback_item_id_feedback_items_id_fk",
+          "tableFrom": "feedback_replies",
+          "tableTo": "feedback_items",
+          "columnsFrom": [
+            "feedback_item_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "cascade",
+          "onUpdate": "no action"
+        },
+        "feedback_replies_created_by_user_id_users_id_fk": {
+          "name": "feedback_replies_created_by_user_id_users_id_fk",
+          "tableFrom": "feedback_replies",
+          "tableTo": "users",
+          "columnsFrom": [
+            "created_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "feedback_replies_edited_by_user_id_users_id_fk": {
+          "name": "feedback_replies_edited_by_user_id_users_id_fk",
+          "tableFrom": "feedback_replies",
+          "tableTo": "users",
+          "columnsFrom": [
+            "edited_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "feedback_replies_approved_by_user_id_users_id_fk": {
+          "name": "feedback_replies_approved_by_user_id_users_id_fk",
+          "tableFrom": "feedback_replies",
+          "tableTo": "users",
+          "columnsFrom": [
+            "approved_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        },
+        "feedback_replies_published_by_user_id_users_id_fk": {
+          "name": "feedback_replies_published_by_user_id_users_id_fk",
+          "tableFrom": "feedback_replies",
+          "tableTo": "users",
+          "columnsFrom": [
+            "published_by_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.reputation_audit_events": {
+      "name": "reputation_audit_events",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "entity_type": {
+          "name": "entity_type",
+          "type": "reputation_audit_entity_type",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "entity_id": {
+          "name": "entity_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "action": {
+          "name": "action",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "actor_user_id": {
+          "name": "actor_user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "metadata": {
+          "name": "metadata",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "reputation_audit_events_organization_id_idx": {
+          "name": "reputation_audit_events_organization_id_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reputation_audit_events_entity_idx": {
+          "name": "reputation_audit_events_entity_idx",
+          "columns": [
+            {
+              "expression": "entity_type",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "entity_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reputation_audit_events_created_at_idx": {
+          "name": "reputation_audit_events_created_at_idx",
+          "columns": [
+            {
+              "expression": "created_at",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "reputation_audit_events_organization_id_organizations_id_fk": {
+          "name": "reputation_audit_events_organization_id_organizations_id_fk",
+          "tableFrom": "reputation_audit_events",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reputation_audit_events_actor_user_id_users_id_fk": {
+          "name": "reputation_audit_events_actor_user_id_users_id_fk",
+          "tableFrom": "reputation_audit_events",
+          "tableTo": "users",
+          "columnsFrom": [
+            "actor_user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "set null",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.reputation_connectors": {
+      "name": "reputation_connectors",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "provider": {
+          "name": "provider",
+          "type": "reputation_connector_provider",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "external_account_id": {
+          "name": "external_account_id",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "external_location_id": {
+          "name": "external_location_id",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "reputation_connector_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'DISCONNECTED'"
+        },
+        "encrypted_access_token": {
+          "name": "encrypted_access_token",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "encrypted_refresh_token": {
+          "name": "encrypted_refresh_token",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "token_expires_at": {
+          "name": "token_expires_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "granted_scopes": {
+          "name": "granted_scopes",
+          "type": "jsonb",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'[]'::jsonb"
+        },
+        "last_synced_at": {
+          "name": "last_synced_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "last_successful_sync_at": {
+          "name": "last_successful_sync_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "last_sync_error": {
+          "name": "last_sync_error",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "reputation_connectors_location_provider_unique_idx": {
+          "name": "reputation_connectors_location_provider_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "provider",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reputation_connectors_status_idx": {
+          "name": "reputation_connectors_status_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "reputation_connectors_organization_id_organizations_id_fk": {
+          "name": "reputation_connectors_organization_id_organizations_id_fk",
+          "tableFrom": "reputation_connectors",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reputation_connectors_establishment_id_establishments_id_fk": {
+          "name": "reputation_connectors_establishment_id_establishments_id_fk",
+          "tableFrom": "reputation_connectors",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.reputation_settings": {
+      "name": "reputation_settings",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "brand_voice": {
+          "name": "brand_voice",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "reply_signature": {
+          "name": "reply_signature",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "default_reply_language": {
+          "name": "default_reply_language",
+          "type": "varchar(35)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'fr'"
+        },
+        "allow_employee_publish": {
+          "name": "allow_employee_publish",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "require_manager_approval": {
+          "name": "require_manager_approval",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "google_review_url": {
+          "name": "google_review_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "facebook_review_url": {
+          "name": "facebook_review_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "instagram_url": {
+          "name": "instagram_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "public_feedback_enabled": {
+          "name": "public_feedback_enabled",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "public_feedback_slug": {
+          "name": "public_feedback_slug",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "notify_on_new_review": {
+          "name": "notify_on_new_review",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "notify_on_negative_review": {
+          "name": "notify_on_negative_review",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "negative_rating_threshold": {
+          "name": "negative_rating_threshold",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 3
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "reputation_settings_location_unique_idx": {
+          "name": "reputation_settings_location_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "reputation_settings_public_slug_unique_idx": {
+          "name": "reputation_settings_public_slug_unique_idx",
+          "columns": [
+            {
+              "expression": "public_feedback_slug",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "reputation_settings_organization_id_organizations_id_fk": {
+          "name": "reputation_settings_organization_id_organizations_id_fk",
+          "tableFrom": "reputation_settings",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "reputation_settings_establishment_id_establishments_id_fk": {
+          "name": "reputation_settings_establishment_id_establishments_id_fk",
+          "tableFrom": "reputation_settings",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {
+        "reputation_settings_negative_threshold_check": {
+          "name": "reputation_settings_negative_threshold_check",
+          "value": "\"reputation_settings\".\"negative_rating_threshold\" >= 1 and \"reputation_settings\".\"negative_rating_threshold\" <= 5"
+        }
+      },
+      "isRLSEnabled": false
+    },
+    "public.restaurant_knowledge_communication_identity": {
+      "name": "restaurant_knowledge_communication_identity",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "tone_and_communication_style": {
+          "name": "tone_and_communication_style",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "customer_addressing": {
+          "name": "customer_addressing",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "language_elements_and_things_to_avoid": {
+          "name": "language_elements_and_things_to_avoid",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "restaurant_knowledge_communication_identity_establishment_fk": {
+          "name": "restaurant_knowledge_communication_identity_establishment_fk",
+          "tableFrom": "restaurant_knowledge_communication_identity",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "restaurant_knowledge_communication_identity_scope_pk": {
+          "name": "restaurant_knowledge_communication_identity_scope_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.restaurant_knowledge_concept_history": {
+      "name": "restaurant_knowledge_concept_history",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "concept": {
+          "name": "concept",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "history": {
+          "name": "history",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "restaurant_knowledge_concept_history_establishment_scope_fk": {
+          "name": "restaurant_knowledge_concept_history_establishment_scope_fk",
+          "tableFrom": "restaurant_knowledge_concept_history",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "restaurant_knowledge_concept_history_scope_pk": {
+          "name": "restaurant_knowledge_concept_history_scope_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.restaurant_knowledge_cuisine_know_how": {
+      "name": "restaurant_knowledge_cuisine_know_how",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "cuisine_description": {
+          "name": "cuisine_description",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "know_how_particularities": {
+          "name": "know_how_particularities",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "homemade": {
+          "name": "homemade",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "restaurant_knowledge_cuisine_know_how_establishment_scope_fk": {
+          "name": "restaurant_knowledge_cuisine_know_how_establishment_scope_fk",
+          "tableFrom": "restaurant_knowledge_cuisine_know_how",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "restaurant_knowledge_cuisine_know_how_scope_pk": {
+          "name": "restaurant_knowledge_cuisine_know_how_scope_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.restaurant_knowledge_customer_experience": {
+      "name": "restaurant_knowledge_customer_experience",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "desired_experience": {
+          "name": "desired_experience",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "welcome_and_service": {
+          "name": "welcome_and_service",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "customer_attention": {
+          "name": "customer_attention",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "restaurant_knowledge_customer_experience_establishment_scope_fk": {
+          "name": "restaurant_knowledge_customer_experience_establishment_scope_fk",
+          "tableFrom": "restaurant_knowledge_customer_experience",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "restaurant_knowledge_customer_experience_scope_pk": {
+          "name": "restaurant_knowledge_customer_experience_scope_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.restaurant_knowledge_team_culture": {
+      "name": "restaurant_knowledge_team_culture",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "values_and_mindset": {
+          "name": "values_and_mindset",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "working_together": {
+          "name": "working_together",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "transmission_and_integration": {
+          "name": "transmission_and_integration",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "restaurant_knowledge_team_culture_establishment_scope_fk": {
+          "name": "restaurant_knowledge_team_culture_establishment_scope_fk",
+          "tableFrom": "restaurant_knowledge_team_culture",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "restaurant_knowledge_team_culture_scope_pk": {
+          "name": "restaurant_knowledge_team_culture_scope_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.restaurant_knowledge_validated_items": {
+      "name": "restaurant_knowledge_validated_items",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "statement": {
+          "name": "statement",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": true
+        }
+      },
+      "indexes": {},
+      "foreignKeys": {
+        "restaurant_knowledge_validated_items_establishment_scope_fk": {
+          "name": "restaurant_knowledge_validated_items_establishment_scope_fk",
+          "tableFrom": "restaurant_knowledge_validated_items",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "organization_id",
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "organization_id",
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "restaurant_knowledge_validated_items_scope_item_pk": {
+          "name": "restaurant_knowledge_validated_items_scope_item_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "id"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.establishments": {
+      "name": "establishments",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "name": {
+          "name": "name",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "slug": {
+          "name": "slug",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "organization_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'active'"
+        },
+        "locale": {
+          "name": "locale",
+          "type": "varchar(35)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'fr-FR'"
+        },
+        "timezone": {
+          "name": "timezone",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'Europe/Paris'"
+        },
+        "description": {
+          "name": "description",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "address_line_1": {
+          "name": "address_line_1",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "address_line_2": {
+          "name": "address_line_2",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "postal_code": {
+          "name": "postal_code",
+          "type": "varchar(32)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "city": {
+          "name": "city",
+          "type": "varchar(120)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "country_code": {
+          "name": "country_code",
+          "type": "varchar(2)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "phone": {
+          "name": "phone",
+          "type": "varchar(30)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "email": {
+          "name": "email",
+          "type": "varchar(254)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "website": {
+          "name": "website",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "public_phone": {
+          "name": "public_phone",
+          "type": "varchar(30)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "public_email": {
+          "name": "public_email",
+          "type": "varchar(254)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "logo_url": {
+          "name": "logo_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "cover_image_url": {
+          "name": "cover_image_url",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "languages": {
+          "name": "languages",
+          "type": "varchar(35)[]",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "ARRAY[]::varchar[]"
+        },
+        "service_modes": {
+          "name": "service_modes",
+          "type": "establishment_service_mode[]",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "ARRAY[]::establishment_service_mode[]"
+        },
+        "public_description": {
+          "name": "public_description",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "public_address": {
+          "name": "public_address",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "public_phone_visible": {
+          "name": "public_phone_visible",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "public_email_visible": {
+          "name": "public_email_visible",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "public_website": {
+          "name": "public_website",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "public_languages": {
+          "name": "public_languages",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "public_service_modes": {
+          "name": "public_service_modes",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "establishments_slug_unique_idx": {
+          "name": "establishments_slug_unique_idx",
+          "columns": [
+            {
+              "expression": "lower(\"slug\")",
+              "asc": true,
+              "isExpression": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "establishments_organization_id_id_unique_idx": {
+          "name": "establishments_organization_id_id_unique_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "establishments_organization_id_idx": {
+          "name": "establishments_organization_id_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "establishments_status_idx": {
+          "name": "establishments_status_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "establishments_organization_id_organizations_id_fk": {
+          "name": "establishments_organization_id_organizations_id_fk",
+          "tableFrom": "establishments",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.organizations": {
+      "name": "organizations",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "name": {
+          "name": "name",
+          "type": "varchar(255)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "slug": {
+          "name": "slug",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "organization_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'active'"
+        },
+        "locale": {
+          "name": "locale",
+          "type": "varchar(35)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'fr-FR'"
+        },
+        "timezone": {
+          "name": "timezone",
+          "type": "varchar(100)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'Europe/Paris'"
+        },
+        "currency": {
+          "name": "currency",
+          "type": "varchar(3)",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'EUR'"
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "organizations_slug_unique_idx": {
+          "name": "organizations_slug_unique_idx",
+          "columns": [
+            {
+              "expression": "lower(\"slug\")",
+              "asc": true,
+              "isExpression": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "organizations_status_idx": {
+          "name": "organizations_status_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {},
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.tenant_domains": {
+      "name": "tenant_domains",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "hostname": {
+          "name": "hostname",
+          "type": "varchar(253)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "domain_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'pending'"
+        },
+        "is_primary": {
+          "name": "is_primary",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": false
+        },
+        "verified_at": {
+          "name": "verified_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "tenant_domains_hostname_unique_idx": {
+          "name": "tenant_domains_hostname_unique_idx",
+          "columns": [
+            {
+              "expression": "hostname",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "tenant_domains_scope_idx": {
+          "name": "tenant_domains_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "tenant_domains_organization_id_organizations_id_fk": {
+          "name": "tenant_domains_organization_id_organizations_id_fk",
+          "tableFrom": "tenant_domains",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "tenant_domains_establishment_id_establishments_id_fk": {
+          "name": "tenant_domains_establishment_id_establishments_id_fk",
+          "tableFrom": "tenant_domains",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.tenant_entitlements": {
+      "name": "tenant_entitlements",
+      "schema": "",
+      "columns": {
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "key": {
+          "name": "key",
+          "type": "varchar(150)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "enabled": {
+          "name": "enabled",
+          "type": "boolean",
+          "primaryKey": false,
+          "notNull": true,
+          "default": true
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "tenant_entitlements_scope_idx": {
+          "name": "tenant_entitlements_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "tenant_entitlements_organization_id_organizations_id_fk": {
+          "name": "tenant_entitlements_organization_id_organizations_id_fk",
+          "tableFrom": "tenant_entitlements",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "tenant_entitlements_establishment_id_establishments_id_fk": {
+          "name": "tenant_entitlements_establishment_id_establishments_id_fk",
+          "tableFrom": "tenant_entitlements",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {
+        "tenant_entitlements_organization_id_establishment_id_key_pk": {
+          "name": "tenant_entitlements_organization_id_establishment_id_key_pk",
+          "columns": [
+            "organization_id",
+            "establishment_id",
+            "key"
+          ]
+        }
+      },
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.tenant_memberships": {
+      "name": "tenant_memberships",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "user_id": {
+          "name": "user_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "organization_id": {
+          "name": "organization_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "establishment_id": {
+          "name": "establishment_id",
+          "type": "uuid",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "role": {
+          "name": "role",
+          "type": "cloud_role",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "membership_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'active'"
+        },
+        "joined_at": {
+          "name": "joined_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "tenant_memberships_scope_unique_idx": {
+          "name": "tenant_memberships_scope_unique_idx",
+          "columns": [
+            {
+              "expression": "user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "tenant_memberships_user_id_idx": {
+          "name": "tenant_memberships_user_id_idx",
+          "columns": [
+            {
+              "expression": "user_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "tenant_memberships_scope_idx": {
+          "name": "tenant_memberships_scope_idx",
+          "columns": [
+            {
+              "expression": "organization_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            },
+            {
+              "expression": "establishment_id",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {
+        "tenant_memberships_user_id_users_id_fk": {
+          "name": "tenant_memberships_user_id_users_id_fk",
+          "tableFrom": "tenant_memberships",
+          "tableTo": "users",
+          "columnsFrom": [
+            "user_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "restrict",
+          "onUpdate": "no action"
+        },
+        "tenant_memberships_organization_id_organizations_id_fk": {
+          "name": "tenant_memberships_organization_id_organizations_id_fk",
+          "tableFrom": "tenant_memberships",
+          "tableTo": "organizations",
+          "columnsFrom": [
+            "organization_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        },
+        "tenant_memberships_establishment_id_establishments_id_fk": {
+          "name": "tenant_memberships_establishment_id_establishments_id_fk",
+          "tableFrom": "tenant_memberships",
+          "tableTo": "establishments",
+          "columnsFrom": [
+            "establishment_id"
+          ],
+          "columnsTo": [
+            "id"
+          ],
+          "onDelete": "no action",
+          "onUpdate": "no action"
+        }
+      },
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {},
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    },
+    "public.users": {
+      "name": "users",
+      "schema": "",
+      "columns": {
+        "id": {
+          "name": "id",
+          "type": "uuid",
+          "primaryKey": true,
+          "notNull": true
+        },
+        "auth_provider_id": {
+          "name": "auth_provider_id",
+          "type": "varchar(191)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "display_name": {
+          "name": "display_name",
+          "type": "varchar(160)",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "email": {
+          "name": "email",
+          "type": "varchar(320)",
+          "primaryKey": false,
+          "notNull": true
+        },
+        "status": {
+          "name": "status",
+          "type": "user_status",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "'ACTIVE'"
+        },
+        "system_role": {
+          "name": "system_role",
+          "type": "system_role",
+          "typeSchema": "public",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "password_hash": {
+          "name": "password_hash",
+          "type": "text",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "email_verified_at": {
+          "name": "email_verified_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "last_login_at": {
+          "name": "last_login_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": false
+        },
+        "auth_version": {
+          "name": "auth_version",
+          "type": "integer",
+          "primaryKey": false,
+          "notNull": true,
+          "default": 0
+        },
+        "created_at": {
+          "name": "created_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        },
+        "updated_at": {
+          "name": "updated_at",
+          "type": "timestamp with time zone",
+          "primaryKey": false,
+          "notNull": true,
+          "default": "now()"
+        }
+      },
+      "indexes": {
+        "users_email_unique_idx": {
+          "name": "users_email_unique_idx",
+          "columns": [
+            {
+              "expression": "lower(\"email\")",
+              "asc": true,
+              "isExpression": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": true,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "users_status_idx": {
+          "name": "users_status_idx",
+          "columns": [
+            {
+              "expression": "status",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        },
+        "users_system_role_idx": {
+          "name": "users_system_role_idx",
+          "columns": [
+            {
+              "expression": "system_role",
+              "isExpression": false,
+              "asc": true,
+              "nulls": "last"
+            }
+          ],
+          "isUnique": false,
+          "concurrently": false,
+          "method": "btree",
+          "with": {}
+        }
+      },
+      "foreignKeys": {},
+      "compositePrimaryKeys": {},
+      "uniqueConstraints": {
+        "users_auth_provider_id_unique": {
+          "name": "users_auth_provider_id_unique",
+          "nullsNotDistinct": false,
+          "columns": [
+            "auth_provider_id"
+          ]
+        }
+      },
+      "policies": {},
+      "checkConstraints": {},
+      "isRLSEnabled": false
+    }
+  },
+  "enums": {
+    "public.booking_actor_type": {
+      "name": "booking_actor_type",
+      "schema": "public",
+      "values": [
+        "GUEST",
+        "USER",
+        "SYSTEM"
+      ]
+    },
+    "public.booking_confirmation_mode": {
+      "name": "booking_confirmation_mode",
+      "schema": "public",
+      "values": [
+        "AUTOMATIC",
+        "MANUAL"
+      ]
+    },
+    "public.booking_exception_kind": {
+      "name": "booking_exception_kind",
+      "schema": "public",
+      "values": [
+        "CLOSED_ALL_DAY",
+        "CLOSED_SERVICE",
+        "MODIFIED_HOURS",
+        "BLOCKED_SLOT"
+      ]
+    },
+    "public.booking_notification_status": {
+      "name": "booking_notification_status",
+      "schema": "public",
+      "values": [
+        "PENDING",
+        "PROCESSING",
+        "SENT",
+        "FAILED"
+      ]
+    },
+    "public.reservation_source": {
+      "name": "reservation_source",
+      "schema": "public",
+      "values": [
+        "DIRECT",
+        "GOOGLE",
+        "FACEBOOK",
+        "INSTAGRAM",
+        "TIKTOK",
+        "QR_CODE",
+        "WEBSITE",
+        "PHONE",
+        "BACK_OFFICE",
+        "OTHER"
+      ]
+    },
+    "public.reservation_status": {
+      "name": "reservation_status",
+      "schema": "public",
+      "values": [
+        "PENDING",
+        "CONFIRMED",
+        "DECLINED",
+        "CANCELLED",
+        "SEATED",
+        "COMPLETED",
+        "NO_SHOW"
+      ]
+    },
+    "public.formalites_personnel_draft_command": {
+      "name": "formalites_personnel_draft_command",
+      "schema": "public",
+      "values": [
+        "create",
+        "save",
+        "reconcile",
+        "abandon"
+      ]
+    },
+    "public.formalites_personnel_draft_command_outcome": {
+      "name": "formalites_personnel_draft_command_outcome",
+      "schema": "public",
+      "values": [
+        "created",
+        "saved",
+        "reconciled",
+        "abandoned"
+      ]
+    },
+    "public.formalites_personnel_draft_status": {
+      "name": "formalites_personnel_draft_status",
+      "schema": "public",
+      "values": [
+        "draft",
+        "abandoned"
+      ]
+    },
+    "public.formalites_personnel_probation_choice": {
+      "name": "formalites_personnel_probation_choice",
+      "schema": "public",
+      "values": [
+        "undecided",
+        "include",
+        "exclude"
+      ]
+    },
+    "public.personnel_document_category": {
+      "name": "personnel_document_category",
+      "schema": "public",
+      "values": [
+        "signed_employment_contract"
+      ]
+    },
+    "public.personnel_employment_term_type": {
+      "name": "personnel_employment_term_type",
+      "schema": "public",
+      "values": [
+        "indefinite",
+        "fixed_term"
+      ]
+    },
+    "public.personnel_fixed_term_reason_code": {
+      "name": "personnel_fixed_term_reason_code",
+      "schema": "public",
+      "values": [
+        "employee_replacement",
+        "temporary_activity_increase",
+        "seasonal_employment",
+        "customary_use_employment"
+      ]
+    },
+    "public.personnel_history_classification": {
+      "name": "personnel_history_classification",
+      "schema": "public",
+      "values": [
+        "correction",
+        "change"
+      ]
+    },
+    "public.personnel_history_event_kind": {
+      "name": "personnel_history_event_kind",
+      "schema": "public",
+      "values": [
+        "mutation",
+        "cutover_baseline"
+      ]
+    },
+    "public.personnel_history_semantic_group": {
+      "name": "personnel_history_semantic_group",
+      "schema": "public",
+      "values": [
+        "identity",
+        "role",
+        "contract_terms",
+        "work_time",
+        "entry",
+        "departure"
+      ]
+    },
+    "public.personnel_work_time_category": {
+      "name": "personnel_work_time_category",
+      "schema": "public",
+      "values": [
+        "full_time",
+        "part_time"
+      ]
+    },
+    "public.reputation_audit_entity_type": {
+      "name": "reputation_audit_entity_type",
+      "schema": "public",
+      "values": [
+        "FEEDBACK",
+        "REPLY",
+        "CONNECTOR",
+        "SETTINGS"
+      ]
+    },
+    "public.reputation_connector_provider": {
+      "name": "reputation_connector_provider",
+      "schema": "public",
+      "values": [
+        "GOOGLE"
+      ]
+    },
+    "public.reputation_connector_status": {
+      "name": "reputation_connector_status",
+      "schema": "public",
+      "values": [
+        "DISCONNECTED",
+        "CONNECTING",
+        "CONNECTED",
+        "ERROR",
+        "AUTH_EXPIRED"
+      ]
+    },
+    "public.feedback_reply_status": {
+      "name": "feedback_reply_status",
+      "schema": "public",
+      "values": [
+        "DRAFT",
+        "READY",
+        "PUBLISHED",
+        "FAILED",
+        "DELETED"
+      ]
+    },
+    "public.feedback_sentiment": {
+      "name": "feedback_sentiment",
+      "schema": "public",
+      "values": [
+        "POSITIVE",
+        "NEUTRAL",
+        "NEGATIVE"
+      ]
+    },
+    "public.feedback_source": {
+      "name": "feedback_source",
+      "schema": "public",
+      "values": [
+        "GOOGLE",
+        "DIRECT"
+      ]
+    },
+    "public.feedback_status": {
+      "name": "feedback_status",
+      "schema": "public",
+      "values": [
+        "NEW",
+        "TO_PROCESS",
+        "DRAFTED",
+        "REPLIED",
+        "FOLLOW_UP",
+        "RESOLVED",
+        "ARCHIVED",
+        "SPAM"
+      ]
+    },
+    "public.feedback_type": {
+      "name": "feedback_type",
+      "schema": "public",
+      "values": [
+        "PUBLIC_REVIEW",
+        "DIRECT_FEEDBACK"
+      ]
+    },
+    "public.feedback_urgency": {
+      "name": "feedback_urgency",
+      "schema": "public",
+      "values": [
+        "LOW",
+        "MEDIUM",
+        "HIGH",
+        "CRITICAL"
+      ]
+    },
+    "public.feedback_service_period": {
+      "name": "feedback_service_period",
+      "schema": "public",
+      "values": [
+        "LUNCH",
+        "DINNER",
+        "OTHER"
+      ]
+    },
+    "public.cloud_role": {
+      "name": "cloud_role",
+      "schema": "public",
+      "values": [
+        "OWNER",
+        "MANAGER",
+        "STAFF"
+      ]
+    },
+    "public.domain_status": {
+      "name": "domain_status",
+      "schema": "public",
+      "values": [
+        "pending",
+        "active",
+        "disabled"
+      ]
+    },
+    "public.establishment_service_mode": {
+      "name": "establishment_service_mode",
+      "schema": "public",
+      "values": [
+        "DINE_IN",
+        "TAKEAWAY",
+        "RESERVATION",
+        "DELIVERY",
+        "CLICK_AND_COLLECT",
+        "PRIVATE_EVENTS",
+        "CATERING"
+      ]
+    },
+    "public.membership_status": {
+      "name": "membership_status",
+      "schema": "public",
+      "values": [
+        "active",
+        "suspended"
+      ]
+    },
+    "public.organization_status": {
+      "name": "organization_status",
+      "schema": "public",
+      "values": [
+        "active",
+        "disabled"
+      ]
+    },
+    "public.system_role": {
+      "name": "system_role",
+      "schema": "public",
+      "values": [
+        "YUTA_ADMIN",
+        "YUTA_SUPPORT"
+      ]
+    },
+    "public.user_status": {
+      "name": "user_status",
+      "schema": "public",
+      "values": [
+        "ACTIVE",
+        "DISABLED"
+      ]
+    }
+  },
+  "schemas": {},
+  "sequences": {},
+  "roles": {},
+  "policies": {},
+  "views": {},
+  "_meta": {
+    "columns": {},
+    "schemas": {},
+    "tables": {}
+  }
+}
\ No newline at end of file
diff --git a/packages/db-cloud/drizzle/meta/_journal.json b/packages/db-cloud/drizzle/meta/_journal.json
--- a/packages/db-cloud/drizzle/meta/_journal.json
+++ b/packages/db-cloud/drizzle/meta/_journal.json
@@ -141,6 +141,13 @@
       "when": 1788731958038,
       "tag": "0019_pointage_authority_foundation",
       "breakpoints": true
+    },
+    {
+      "idx": 20,
+      "version": "7",
+      "when": 1788853104815,
+      "tag": "0020_formalites_legal_template_foundation",
+      "breakpoints": true
     }
   ]
 }
\ No newline at end of file
diff --git a/packages/db-cloud/src/formalites-legal-template-domain.ts b/packages/db-cloud/src/formalites-legal-template-domain.ts
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/src/formalites-legal-template-domain.ts
@@ -0,0 +1,179 @@
+import { createHash } from 'node:crypto';
+import { z } from 'zod';
+
+export const FORMALITES_LEGAL_SOURCE_PROFILE =
+  'formalites.legal-source.utf8-lf.v1';
+
+export type FormalitesLegalTemplateErrorCode =
+  | 'NOT_FOUND'
+  | 'ACTIVE_DRAFT_EXISTS'
+  | 'STALE_DRAFT_REVISION'
+  | 'DRAFT_FROZEN'
+  | 'INVALID_SOURCE'
+  | 'INVALID_APPLICABILITY'
+  | 'INTEGRITY_FAILURE';
+
+export class FormalitesLegalTemplateError extends Error {
+  constructor(readonly code: FormalitesLegalTemplateErrorCode) {
+    super(code);
+    this.name = 'FormalitesLegalTemplateError';
+  }
+}
+
+function decodeSource(input: unknown, profile: unknown): string {
+  if (
+    profile !== FORMALITES_LEGAL_SOURCE_PROFILE ||
+    !(input instanceof Uint8Array)
+  ) {
+    throw new FormalitesLegalTemplateError('INVALID_SOURCE');
+  }
+  try {
+    const value = new TextDecoder('utf-8', {
+      fatal: true,
+      ignoreBOM: true,
+    }).decode(Buffer.from(input));
+    if (value.startsWith('\uFEFF')) throw new Error('Leading BOM');
+    return value;
+  } catch {
+    throw new FormalitesLegalTemplateError('INVALID_SOURCE');
+  }
+}
+
+export function validateFormalitesLegalSource(
+  input: unknown,
+  profile: unknown,
+): Buffer {
+  const value = decodeSource(input, profile);
+  if (value.includes('\r'))
+    throw new FormalitesLegalTemplateError('INVALID_SOURCE');
+  return Buffer.from(value, 'utf8');
+}
+
+export function canonicalizeFormalitesLegalSource(
+  input: unknown,
+  profile: unknown,
+): Buffer {
+  const value = decodeSource(input, profile)
+    .replace(/\r\n/g, '\n')
+    .replace(/\r/g, '\n');
+  return validateFormalitesLegalSource(Buffer.from(value, 'utf8'), profile);
+}
+
+export function hashFormalitesLegalSource(input: Uint8Array): string {
+  return createHash('sha256').update(input).digest('hex');
+}
+
+const dimensionSchema = z
+  .discriminatedUnion('kind', [
+    z.object({ kind: z.literal('unknown') }).strict(),
+    z
+      .object({
+        kind: z.literal('assertions'),
+        values: z.array(z.string().min(1)).min(1),
+      })
+      .strict(),
+    z
+      .object({
+        kind: z.literal('canonicalReferences'),
+        values: z
+          .array(
+            z
+              .object({
+                owner: z.string().min(1),
+                referenceId: z.string().min(1),
+              })
+              .strict(),
+          )
+          .min(1),
+      })
+      .strict(),
+  ])
+  .superRefine((value, ctx) => {
+    // No canonical owner/reference binding is approved for any dimension in V1.
+    if (value.kind === 'canonicalReferences')
+      ctx.addIssue({
+        code: z.ZodIssueCode.custom,
+        message: 'No approved canonical reference binding',
+      });
+  });
+
+const applicabilityShape = {
+  jurisdiction: dimensionSchema,
+  contractCategory: dimensionSchema,
+  workingTimeBoundary: dimensionSchema,
+  employeeCategories: dimensionSchema,
+  employerCategories: dimensionSchema,
+  collectiveAgreementAssumptions: dimensionSchema,
+  effectiveDateConstraints: dimensionSchema,
+  exclusions: dimensionSchema,
+  bindingConditions: dimensionSchema,
+};
+
+const storedApplicabilitySchema = z.object(applicabilityShape).strict();
+const inputApplicabilitySchema = z
+  .object({
+    jurisdiction: dimensionSchema.default({ kind: 'unknown' }),
+    contractCategory: dimensionSchema.default({ kind: 'unknown' }),
+    workingTimeBoundary: dimensionSchema.default({ kind: 'unknown' }),
+    employeeCategories: dimensionSchema.default({ kind: 'unknown' }),
+    employerCategories: dimensionSchema.default({ kind: 'unknown' }),
+    collectiveAgreementAssumptions: dimensionSchema.default({
+      kind: 'unknown',
+    }),
+    effectiveDateConstraints: dimensionSchema.default({ kind: 'unknown' }),
+    exclusions: dimensionSchema.default({ kind: 'unknown' }),
+    bindingConditions: dimensionSchema.default({ kind: 'unknown' }),
+  })
+  .strict();
+
+export type FormalitesTemplateApplicability = z.infer<
+  typeof storedApplicabilitySchema
+>;
+
+export function parseFormalitesTemplateApplicability(
+  input: unknown,
+): FormalitesTemplateApplicability {
+  const result = inputApplicabilitySchema.safeParse(input);
+  if (!result.success)
+    throw new FormalitesLegalTemplateError('INVALID_APPLICABILITY');
+  return result.data;
+}
+
+export function validateStoredFormalitesTemplateApplicability(
+  input: unknown,
+): FormalitesTemplateApplicability {
+  const result = storedApplicabilitySchema.safeParse(input);
+  if (!result.success)
+    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+  return result.data;
+}
+
+export const formalitesTemplateIdentityInput = z
+  .object({ legalPurpose: z.string().min(1) })
+  .strict();
+export const formalitesTemplateIdInput = z
+  .object({ templateId: z.string().uuid() })
+  .strict();
+export const formalitesTemplateDraftLocator = formalitesTemplateIdInput
+  .extend({ draftId: z.string().uuid() })
+  .strict();
+export const formalitesTemplateVersionLocator = formalitesTemplateIdInput
+  .extend({ versionId: z.string().uuid() })
+  .strict();
+export const formalitesTemplateFreezeInput = formalitesTemplateDraftLocator
+  .extend({ expectedRevision: z.number().int().positive().max(2147483647) })
+  .strict();
+
+const sourceInput = {
+  contentProfile: z.literal(FORMALITES_LEGAL_SOURCE_PROFILE),
+  sourceBytes: z
+    .instanceof(Uint8Array)
+    .transform((bytes) => Buffer.from(bytes)),
+  applicability: z.unknown().transform(parseFormalitesTemplateApplicability),
+};
+export const formalitesTemplateCreateDraftInput = formalitesTemplateIdInput
+  .extend(sourceInput)
+  .strict();
+export const formalitesTemplateEditDraftInput = formalitesTemplateFreezeInput
+  .extend(sourceInput)
+  .strict();
diff --git a/packages/db-cloud/src/formalites-legal-template-repository.ts b/packages/db-cloud/src/formalites-legal-template-repository.ts
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/src/formalites-legal-template-repository.ts
@@ -0,0 +1,408 @@
+import type { AuthService } from '@yuta/auth';
+import { and, asc, eq, isNull } from 'drizzle-orm';
+import { isDeepStrictEqual } from 'node:util';
+import { v7 as uuidv7 } from 'uuid';
+import type { z } from 'zod';
+import type { CloudDatabaseClient } from './client';
+import {
+  FormalitesLegalTemplateError,
+  canonicalizeFormalitesLegalSource,
+  formalitesTemplateCreateDraftInput,
+  formalitesTemplateDraftLocator,
+  formalitesTemplateEditDraftInput,
+  formalitesTemplateFreezeInput,
+  formalitesTemplateIdentityInput,
+  formalitesTemplateIdInput,
+  formalitesTemplateVersionLocator,
+  hashFormalitesLegalSource,
+  validateFormalitesLegalSource,
+  validateStoredFormalitesTemplateApplicability,
+} from './formalites-legal-template-domain';
+import {
+  formalitesTemplateIdentities as identities,
+  formalitesTemplateVersions as versions,
+  formalitesTemplateWorkingDrafts as drafts,
+} from './schema/formalites-legal-templates';
+
+type Transaction = Parameters<
+  Parameters<CloudDatabaseClient['transaction']>[0]
+>[0];
+type Draft = typeof drafts.$inferSelect;
+type Version = typeof versions.$inferSelect;
+type FreezeInput = z.infer<typeof formalitesTemplateFreezeInput>;
+
+function exactlyOne<T>(rows: T[]): T {
+  if (rows.length !== 1 || rows[0] === undefined)
+    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+  return rows[0];
+}
+
+function copyDraft(row: Draft) {
+  try {
+    return {
+      ...row,
+      sourceBytes: validateFormalitesLegalSource(
+        row.sourceBytes,
+        row.contentProfile,
+      ),
+      applicability: validateStoredFormalitesTemplateApplicability(
+        row.applicability,
+      ),
+      createdAt: new Date(row.createdAt),
+      updatedAt: new Date(row.updatedAt),
+      frozenAt: row.frozenAt ? new Date(row.frozenAt) : null,
+    };
+  } catch {
+    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+  }
+}
+
+function verifiedVersion(row: Version) {
+  try {
+    const sourceBytes = validateFormalitesLegalSource(
+      row.sourceBytes,
+      row.contentProfile,
+    );
+    if (
+      row.checksumAlgorithm !== 'sha256' ||
+      !/^[0-9a-f]{64}$/.test(row.contentChecksum) ||
+      hashFormalitesLegalSource(sourceBytes) !== row.contentChecksum
+    ) {
+      throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+    }
+    return {
+      ...row,
+      sourceBytes,
+      applicability: validateStoredFormalitesTemplateApplicability(
+        row.applicability,
+      ),
+      frozenAt: new Date(row.frozenAt),
+    };
+  } catch {
+    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+  }
+}
+
+function verifyBinding(row: Version, draft: Draft) {
+  const version = verifiedVersion(row);
+  const source = copyDraft(draft);
+  if (
+    version.templateId !== source.templateId ||
+    version.sourceDraftId !== source.id ||
+    version.sourceDraftRevision !== source.revision ||
+    version.contentProfile !== source.contentProfile ||
+    !version.sourceBytes.equals(source.sourceBytes) ||
+    !isDeepStrictEqual(version.applicability, source.applicability) ||
+    (source.frozenAt !== null &&
+      version.frozenAt.getTime() !== source.frozenAt.getTime())
+  ) {
+    throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+  }
+  return version;
+}
+
+function isUniqueViolation(error: unknown): boolean {
+  if (typeof error !== 'object' || error === null) return false;
+  if ('code' in error && error.code === '23505') return true;
+  return (
+    'cause' in error && error.cause !== error && isUniqueViolation(error.cause)
+  );
+}
+
+// Trusted server composition only. No request may supply an auth context or policy.
+export function createFormalitesLegalTemplateRepository(
+  db: CloudDatabaseClient,
+  auth: AuthService,
+) {
+  async function lockIdentity(tx: Transaction, templateId: string) {
+    const rows = await tx
+      .select()
+      .from(identities)
+      .where(eq(identities.id, templateId))
+      .for('update');
+    if (rows.length === 0) throw new FormalitesLegalTemplateError('NOT_FOUND');
+    return exactlyOne(rows);
+  }
+
+  async function lockDraft(tx: Transaction, input: FreezeInput) {
+    await lockIdentity(tx, input.templateId);
+    const rows = await tx
+      .select()
+      .from(drafts)
+      .where(
+        and(
+          eq(drafts.templateId, input.templateId),
+          eq(drafts.id, input.draftId),
+        ),
+      )
+      .for('update');
+    if (rows.length === 0) throw new FormalitesLegalTemplateError('NOT_FOUND');
+    const row = exactlyOne(rows);
+    if (row.revision !== input.expectedRevision)
+      throw new FormalitesLegalTemplateError('STALE_DRAFT_REVISION');
+    return row;
+  }
+
+  async function replay(tx: Transaction, draft: Draft) {
+    if (!draft.frozenAt)
+      throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+    const rows = await tx
+      .select()
+      .from(versions)
+      .where(
+        and(
+          eq(versions.templateId, draft.templateId),
+          eq(versions.sourceDraftId, draft.id),
+          eq(versions.sourceDraftRevision, draft.revision),
+        ),
+      );
+    return { version: verifyBinding(exactlyOne(rows), draft), replayed: true };
+  }
+
+  async function createIdentity(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.draft.manage',
+    );
+    const value = formalitesTemplateIdentityInput.parse(input);
+    return exactlyOne(
+      await db
+        .insert(identities)
+        .values({ id: uuidv7(), legalPurpose: value.legalPurpose })
+        .returning(),
+    );
+  }
+
+  async function readIdentity(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.read',
+    );
+    const { templateId } = formalitesTemplateIdInput.parse(input);
+    const rows = await db
+      .select()
+      .from(identities)
+      .where(eq(identities.id, templateId));
+    if (!rows.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
+    return exactlyOne(rows);
+  }
+
+  async function readDraft(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.read',
+    );
+    const { templateId, draftId } = formalitesTemplateDraftLocator.parse(input);
+    const rows = await db
+      .select()
+      .from(drafts)
+      .where(and(eq(drafts.templateId, templateId), eq(drafts.id, draftId)));
+    if (!rows.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
+    return copyDraft(exactlyOne(rows));
+  }
+
+  async function readVersion(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.read',
+    );
+    const { templateId, versionId } =
+      formalitesTemplateVersionLocator.parse(input);
+    const rows = await db
+      .select()
+      .from(versions)
+      .where(
+        and(eq(versions.templateId, templateId), eq(versions.id, versionId)),
+      );
+    if (!rows.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
+    return verifiedVersion(exactlyOne(rows));
+  }
+
+  async function readHistory(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.read',
+    );
+    const { templateId } = formalitesTemplateIdInput.parse(input);
+    const parent = await db
+      .select({ id: identities.id })
+      .from(identities)
+      .where(eq(identities.id, templateId));
+    if (!parent.length) throw new FormalitesLegalTemplateError('NOT_FOUND');
+    // Order is deterministic history only, never applicability or qualification.
+    const rows = await db
+      .select()
+      .from(versions)
+      .where(eq(versions.templateId, templateId))
+      .orderBy(asc(versions.frozenAt), asc(versions.id));
+    return rows.map(verifiedVersion);
+  }
+
+  async function createDraft(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.draft.manage',
+    );
+    const value = formalitesTemplateCreateDraftInput.parse(input);
+    const sourceBytes = canonicalizeFormalitesLegalSource(
+      value.sourceBytes,
+      value.contentProfile,
+    );
+    return db.transaction(
+      async (tx) => {
+        await lockIdentity(tx, value.templateId);
+        const active = await tx
+          .select({ id: drafts.id })
+          .from(drafts)
+          .where(
+            and(
+              eq(drafts.templateId, value.templateId),
+              isNull(drafts.frozenAt),
+            ),
+          );
+        if (active.length)
+          throw new FormalitesLegalTemplateError('ACTIVE_DRAFT_EXISTS');
+        return copyDraft(
+          exactlyOne(
+            await tx
+              .insert(drafts)
+              .values({
+                id: uuidv7(),
+                templateId: value.templateId,
+                revision: 1,
+                contentProfile: value.contentProfile,
+                sourceBytes,
+                applicability: value.applicability,
+              })
+              .returning(),
+          ),
+        );
+      },
+      { isolationLevel: 'read committed' },
+    );
+  }
+
+  async function editDraft(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.draft.manage',
+    );
+    const value = formalitesTemplateEditDraftInput.parse(input);
+    const sourceBytes = canonicalizeFormalitesLegalSource(
+      value.sourceBytes,
+      value.contentProfile,
+    );
+    return db.transaction(
+      async (tx) => {
+        const draft = await lockDraft(tx, value);
+        if (draft.frozenAt)
+          throw new FormalitesLegalTemplateError('DRAFT_FROZEN');
+        if (draft.revision >= 2147483647)
+          throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+        const rows = await tx
+          .update(drafts)
+          .set({
+            sourceBytes,
+            contentProfile: value.contentProfile,
+            applicability: value.applicability,
+            revision: draft.revision + 1,
+            updatedAt: new Date(),
+          })
+          .where(
+            and(
+              eq(drafts.templateId, value.templateId),
+              eq(drafts.id, value.draftId),
+              eq(drafts.revision, value.expectedRevision),
+              isNull(drafts.frozenAt),
+            ),
+          )
+          .returning();
+        return copyDraft(exactlyOne(rows));
+      },
+      { isolationLevel: 'read committed' },
+    );
+  }
+
+  async function freezeDraft(input: unknown) {
+    await auth.requireFormalitesTemplateSystemOperation(
+      'formalites.template.review.submit',
+    );
+    const value = formalitesTemplateFreezeInput.parse(input);
+    try {
+      return await db.transaction(
+        async (tx) => {
+          const draft = await lockDraft(tx, value);
+          if (draft.frozenAt) return replay(tx, draft);
+          const snapshot = copyDraft(draft);
+          const versionId = uuidv7();
+          const frozenAt = new Date();
+          await tx.insert(versions).values({
+            id: versionId,
+            templateId: snapshot.templateId,
+            sourceDraftId: snapshot.id,
+            sourceDraftRevision: snapshot.revision,
+            contentProfile: snapshot.contentProfile,
+            sourceBytes: snapshot.sourceBytes,
+            checksumAlgorithm: 'sha256',
+            contentChecksum: hashFormalitesLegalSource(snapshot.sourceBytes),
+            applicability: snapshot.applicability,
+            frozenAt,
+          });
+          const inserted = exactlyOne(
+            await tx
+              .select()
+              .from(versions)
+              .where(
+                and(
+                  eq(versions.templateId, snapshot.templateId),
+                  eq(versions.id, versionId),
+                ),
+              ),
+          );
+          const version = verifyBinding(inserted, snapshot);
+          if (
+            version.id !== versionId ||
+            version.frozenAt.getTime() !== frozenAt.getTime()
+          )
+            throw new FormalitesLegalTemplateError('INTEGRITY_FAILURE');
+          const closed = exactlyOne(
+            await tx
+              .update(drafts)
+              .set({ frozenAt })
+              .where(
+                and(
+                  eq(drafts.templateId, value.templateId),
+                  eq(drafts.id, value.draftId),
+                  eq(drafts.revision, value.expectedRevision),
+                  isNull(drafts.frozenAt),
+                ),
+              )
+              .returning(),
+          );
+          verifyBinding(version, closed);
+          return { version, replayed: false };
+        },
+        { isolationLevel: 'read committed' },
+      );
+    } catch (error) {
+      // Only a known unique-constraint failure permits bounded replay recovery.
+      // Connection/commit errors propagate; they do not prove commit or rollback.
+      if (!isUniqueViolation(error)) throw error;
+      await auth.requireFormalitesTemplateSystemOperation(
+        'formalites.template.review.submit',
+      );
+      return db.transaction(
+        async (tx) => replay(tx, await lockDraft(tx, value)),
+        { isolationLevel: 'read committed' },
+      );
+    }
+  }
+
+  return {
+    createIdentity,
+    readIdentity,
+    readDraft,
+    readVersion,
+    readHistory,
+    createDraft,
+    editDraft,
+    freezeDraft,
+  };
+}
+
+export type FormalitesLegalTemplateRepository = ReturnType<
+  typeof createFormalitesLegalTemplateRepository
+>;
diff --git a/packages/db-cloud/src/index.ts b/packages/db-cloud/src/index.ts
--- a/packages/db-cloud/src/index.ts
+++ b/packages/db-cloud/src/index.ts
@@ -28,3 +28,13 @@
 export * from './tenant-adapters';
 export * from './tenant-foundation-repository';
 export * from './tenant-user-repository';
+export {
+  createFormalitesLegalTemplateRepository,
+  type FormalitesLegalTemplateRepository,
+} from './formalites-legal-template-repository';
+export {
+  FORMALITES_LEGAL_SOURCE_PROFILE,
+  FormalitesLegalTemplateError,
+  type FormalitesLegalTemplateErrorCode,
+  type FormalitesTemplateApplicability,
+} from './formalites-legal-template-domain';
diff --git a/packages/db-cloud/src/schema/formalites-legal-templates.ts b/packages/db-cloud/src/schema/formalites-legal-templates.ts
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/src/schema/formalites-legal-templates.ts
@@ -0,0 +1,125 @@
+import { sql } from 'drizzle-orm';
+import {
+  check,
+  customType,
+  foreignKey,
+  integer,
+  jsonb,
+  pgTable,
+  text,
+  timestamp,
+  unique,
+  uniqueIndex,
+  uuid,
+} from 'drizzle-orm/pg-core';
+
+// Keep binary source independent from PostgreSQL text encoding and NUL limits.
+const legalSourceBytes = customType<{ data: Buffer; driverData: Buffer }>({
+  dataType: () => 'bytea',
+  toDriver: (value) => Buffer.from(value),
+  fromDriver: (value) => {
+    if (!(value instanceof Uint8Array)) {
+      throw new Error('Invalid legal source binary representation');
+    }
+    return Buffer.from(value);
+  },
+});
+
+export const formalitesTemplateIdentities = pgTable(
+  'formalites_template_identities',
+  {
+    id: uuid('id').primaryKey(),
+    legalPurpose: text('legal_purpose').notNull(),
+    createdAt: timestamp('created_at', { withTimezone: true })
+      .defaultNow()
+      .notNull(),
+  },
+  (table) => [
+    check(
+      'formalites_template_purpose_nonempty',
+      sql`length(${table.legalPurpose}) > 0`,
+    ),
+  ],
+);
+
+export const formalitesTemplateWorkingDrafts = pgTable(
+  'formalites_template_working_drafts',
+  {
+    id: uuid('id').primaryKey(),
+    templateId: uuid('template_id')
+      .notNull()
+      .references(() => formalitesTemplateIdentities.id, {
+        onDelete: 'restrict',
+      }),
+    revision: integer('revision').default(1).notNull(),
+    contentProfile: text('content_profile').notNull(),
+    sourceBytes: legalSourceBytes('source_bytes').notNull(),
+    applicability: jsonb('applicability').notNull(),
+    createdAt: timestamp('created_at', { withTimezone: true })
+      .defaultNow()
+      .notNull(),
+    updatedAt: timestamp('updated_at', { withTimezone: true })
+      .defaultNow()
+      .notNull(),
+    frozenAt: timestamp('frozen_at', { withTimezone: true }),
+  },
+  (table) => [
+    unique('formalites_template_draft_containment').on(
+      table.id,
+      table.templateId,
+    ),
+    uniqueIndex('formalites_template_one_active_draft')
+      .on(table.templateId)
+      .where(sql`${table.frozenAt} is null`),
+    check(
+      'formalites_template_draft_positive_revision',
+      sql`${table.revision} > 0`,
+    ),
+  ],
+);
+
+export const formalitesTemplateVersions = pgTable(
+  'formalites_template_versions',
+  {
+    id: uuid('id').primaryKey(),
+    templateId: uuid('template_id')
+      .notNull()
+      .references(() => formalitesTemplateIdentities.id, {
+        onDelete: 'restrict',
+      }),
+    sourceDraftId: uuid('source_draft_id').notNull(),
+    sourceDraftRevision: integer('source_draft_revision').notNull(),
+    contentProfile: text('content_profile').notNull(),
+    sourceBytes: legalSourceBytes('source_bytes').notNull(),
+    checksumAlgorithm: text('checksum_algorithm').notNull(),
+    contentChecksum: text('content_checksum').notNull(),
+    applicability: jsonb('applicability').notNull(),
+    frozenAt: timestamp('frozen_at', { withTimezone: true }).notNull(),
+  },
+  (table) => [
+    foreignKey({
+      name: 'formalites_template_version_draft_containment',
+      columns: [table.sourceDraftId, table.templateId],
+      foreignColumns: [
+        formalitesTemplateWorkingDrafts.id,
+        formalitesTemplateWorkingDrafts.templateId,
+      ],
+    }).onDelete('restrict'),
+    unique('formalites_template_freeze_locator').on(
+      table.sourceDraftId,
+      table.sourceDraftRevision,
+    ),
+    check(
+      'formalites_template_version_positive_revision',
+      sql`${table.sourceDraftRevision} > 0`,
+    ),
+    check(
+      'formalites_template_checksum_algorithm',
+      sql`${table.checksumAlgorithm} = 'sha256'`,
+    ),
+    check(
+      'formalites_template_checksum_shape',
+      sql`${table.contentChecksum} ~ '^[0-9a-f]{64}$'`,
+    ),
+  ],
+);
diff --git a/packages/db-cloud/src/schema/index.ts b/packages/db-cloud/src/schema/index.ts
--- a/packages/db-cloud/src/schema/index.ts
+++ b/packages/db-cloud/src/schema/index.ts
@@ -1,6 +1,7 @@
 export * from './auth';
 export * from './booking';
 export * from './formalites';
+export * from './formalites-legal-templates';
 export * from './personnel';
 export * from './pointage';
 export * from './pointage-raw-clocking';
diff --git a/packages/db-cloud/test/formalites-legal-template-domain.test.ts b/packages/db-cloud/test/formalites-legal-template-domain.test.ts
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/test/formalites-legal-template-domain.test.ts
@@ -0,0 +1,143 @@
+import { createHash } from 'node:crypto';
+import { describe, expect, it } from 'vitest';
+import {
+  FORMALITES_LEGAL_SOURCE_PROFILE as profile,
+  canonicalizeFormalitesLegalSource as canonicalize,
+  validateFormalitesLegalSource as validate,
+  hashFormalitesLegalSource as hash,
+  parseFormalitesTemplateApplicability as applicability,
+  validateStoredFormalitesTemplateApplicability as storedApplicability,
+  formalitesTemplateFreezeInput,
+} from '../src/formalites-legal-template-domain';
+
+describe('Canonical Legal Source Profile V1', () => {
+  it.each([
+    [0xef, 0xbb, 0xbf, 65],
+    [0xc0, 0xaf],
+    [0xe2, 0x82],
+    [0xff],
+    [0xed, 0xa0, 0x80],
+    [0xf4, 0x90, 0x80, 0x80],
+  ])('rejects BOM or invalid UTF-8 %j', (...bytes) => {
+    expect(() => canonicalize(Buffer.from(bytes), profile)).toThrow(
+      'INVALID_SOURCE',
+    );
+  });
+  it('converts only line endings before freeze; validation never repairs stored CR', () => {
+    const input = Buffer.from('  a\r\nb\rc\t\n\n');
+    expect(canonicalize(input, profile)).toEqual(
+      Buffer.from('  a\nb\nc\t\n\n'),
+    );
+    expect(() => validate(input, profile)).toThrow('INVALID_SOURCE');
+    expect(input.toString()).toBe('  a\r\nb\rc\t\n\n');
+  });
+  it.each(['', 'a', 'a\n', ' \t\n\na  ', 'a\uFEFFb\0', 'é', 'e\u0301'])(
+    'preserves exact bytes %j and independent digest',
+    (value) => {
+      const bytes = Buffer.from(value);
+      const output = canonicalize(bytes, profile);
+      expect(output).toEqual(bytes);
+      expect(output).not.toBe(bytes);
+      expect(hash(output)).toBe(
+        createHash('sha256').update(bytes).digest('hex'),
+      );
+      bytes.fill(0);
+      expect(output).toEqual(Buffer.from(value));
+    },
+  );
+  it('does not normalize Unicode or accept unknown profiles/non-binary source', () => {
+    expect(hash(canonicalize(Buffer.from('é'), profile))).not.toBe(
+      hash(canonicalize(Buffer.from('e\u0301'), profile)),
+    );
+    expect(() => canonicalize(Buffer.from('a'), 'future')).toThrow(
+      'INVALID_SOURCE',
+    );
+    expect(() => canonicalize('a', profile)).toThrow('INVALID_SOURCE');
+  });
+});
+
+describe('Non-executable applicability declaration', () => {
+  it('materializes exactly nine unknown dimensions, not unrestricted defaults', () => {
+    const value = applicability({});
+    expect(Object.keys(value)).toEqual([
+      'jurisdiction',
+      'contractCategory',
+      'workingTimeBoundary',
+      'employeeCategories',
+      'employerCategories',
+      'collectiveAgreementAssumptions',
+      'effectiveDateConstraints',
+      'exclusions',
+      'bindingConditions',
+    ]);
+    expect(
+      Object.values(value).every((dimension) => dimension.kind === 'unknown'),
+    ).toBe(true);
+    expect(() => storedApplicability({})).toThrow('INTEGRITY_FAILURE');
+  });
+  it('preserves declaration strings/order and copies caller objects', () => {
+    const input = {
+      jurisdiction: {
+        kind: 'assertions',
+        values: ['  synthetic B ', 'synthetic A'],
+      },
+    };
+    const value = applicability(input);
+    input.jurisdiction.values[0] = 'changed';
+    expect(value.jurisdiction).toEqual({
+      kind: 'assertions',
+      values: ['  synthetic B ', 'synthetic A'],
+    });
+    expect(storedApplicability(value)).toEqual(value);
+    expect(storedApplicability(value)).not.toBe(value);
+  });
+  it.each([
+    {
+      jurisdiction: {
+        kind: 'canonicalReferences',
+        values: [{ owner: 'unapproved', referenceId: 'claim' }],
+      },
+    },
+    { jurisdiction: { kind: 'assertions', values: [] } },
+    { jurisdiction: { kind: 'assertions', values: [''] } },
+    { jurisdiction: { kind: 'unknown', unrestricted: true } },
+    { reviewer: 'private' },
+    { evidenceUrl: 'private' },
+    { metadata: {} },
+    { publication: true },
+  ])(
+    'rejects unsupported owner, private/extra fields and invalid declaration %j',
+    (input) => {
+      expect(() => applicability(input)).toThrow('INVALID_APPLICABILITY');
+    },
+  );
+  it('freeze input admits only the exact locator/revision, not replacement or authority', () => {
+    const input = {
+      templateId: '019c0000-0000-7000-8000-000000000001',
+      draftId: '019c0000-0000-7000-8000-000000000002',
+      expectedRevision: 1,
+    };
+    expect(formalitesTemplateFreezeInput.parse(input)).toEqual(input);
+    for (const extra of [
+      'sourceBytes',
+      'applicability',
+      'contentChecksum',
+      'TenantContext',
+      'organizationId',
+      'operation',
+      'systemRole',
+    ]) {
+      expect(
+        formalitesTemplateFreezeInput.safeParse({
+          ...input,
+          [extra]: 'untrusted',
+        }).success,
+      ).toBe(false);
+    }
+    for (const expectedRevision of [0, -1, 1.5, 2147483648])
+      expect(
+        formalitesTemplateFreezeInput.safeParse({ ...input, expectedRevision })
+          .success,
+      ).toBe(false);
+  });
+});
diff --git a/packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts b/packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/test/formalites-legal-template-repository.integration.test.ts
@@ -0,0 +1,686 @@
+import { createAuthService, type AuthService } from '@yuta/auth';
+import type { TenantContext } from '@yuta/tenant';
+import { and, eq, inArray } from 'drizzle-orm';
+import { drizzle } from 'drizzle-orm/postgres-js';
+import { createHash } from 'node:crypto';
+import postgres from 'postgres';
+import { afterAll, beforeAll, describe, expect, it } from 'vitest';
+import { v7 as uuidv7, version as uuidVersion } from 'uuid';
+import type { CloudDatabaseClient } from '../src/client';
+import { FORMALITES_LEGAL_SOURCE_PROFILE as profile } from '../src/formalites-legal-template-domain';
+import { createFormalitesLegalTemplateRepository as repository } from '../src/formalites-legal-template-repository';
+import { readFormalitesPersonnelDraft } from '../src/formalites-personnel-draft-repository';
+import * as schema from '../src/schema';
+import {
+  formalitesTemplateIdentities as identities,
+  formalitesTemplateWorkingDrafts as drafts,
+  formalitesTemplateVersions as versions,
+} from '../src/schema/formalites-legal-templates';
+
+const integration =
+  process.env.CLOUD_DATABASE_URL &&
+  process.env.YUTA_ALLOW_DATABASE_INTEGRATION_TESTS === 'true'
+    ? describe
+    : describe.skip;
+type Transaction = Parameters<
+  Parameters<CloudDatabaseClient['transaction']>[0]
+>[0];
+
+function deferred() {
+  let resolve!: () => void;
+  const promise = new Promise<void>((done) => {
+    resolve = done;
+  });
+  return { promise, resolve };
+}
+
+function internalAuth(
+  role: 'YUTA_ADMIN' | 'YUTA_SUPPORT' | null = 'YUTA_ADMIN',
+): AuthService {
+  return createAuthService(
+    {
+      getIdentity: async () => ({
+        providerUserId: 'synthetic-internal',
+        email: 'synthetic@example.invalid',
+      }),
+    },
+    {
+      findByAuthProviderId: async () => ({
+        id: '019c0000-0000-7000-8000-000000000001',
+        email: 'synthetic@example.invalid',
+        displayName: null,
+        systemRole: role,
+        status: 'ACTIVE',
+      }),
+    },
+  );
+}
+
+// Test-only composition around real transactions; never exported production hooks.
+function instrument(
+  db: CloudDatabaseClient,
+  wrap: (tx: Transaction) => Transaction,
+  afterCommit?: () => void,
+): CloudDatabaseClient {
+  return new Proxy(db, {
+    get(target, key) {
+      if (key === 'transaction')
+        return async (
+          work: (tx: Transaction) => Promise<unknown>,
+          config: Parameters<CloudDatabaseClient['transaction']>[1],
+        ) => {
+          const value = await target.transaction(
+            (tx) => work(wrap(tx)),
+            config,
+          );
+          afterCommit?.();
+          return value;
+        };
+      const member: unknown = Reflect.get(target, key);
+      return typeof member === 'function' ? member.bind(target) : member;
+    },
+  });
+}
+
+integration('Formalites legal-template real PostgreSQL acceptance', () => {
+  let a: CloudDatabaseClient;
+  let b: CloudDatabaseClient;
+  let control: ReturnType<typeof postgres>;
+  let observer: ReturnType<typeof postgres>;
+  let pidA: number;
+  let pidB: number;
+  const owned: string[] = [];
+  const source = (text = 'synthetic\r\nsource') => ({
+    contentProfile: profile,
+    sourceBytes: Buffer.from(text),
+    applicability: {},
+  });
+  const apiA = () => repository(a, internalAuth());
+  const apiB = () => repository(b, internalAuth());
+
+  beforeAll(async () => {
+    const url = new URL(process.env.CLOUD_DATABASE_URL!);
+    // Necessary test guard, not a substitute for separately recorded ownership verification.
+    if (
+      process.env.NODE_ENV === 'production' ||
+      !['127.0.0.1', 'localhost'].includes(url.hostname) ||
+      ![
+        '/formalites_template_clean',
+        '/formalites_template_incremental',
+      ].includes(url.pathname)
+    )
+      throw new Error('Unverified disposable test target');
+    a = drizzle(postgres(url.toString(), { max: 1 }), { schema });
+    b = drizzle(postgres(url.toString(), { max: 1 }), { schema });
+    control = postgres(url.toString(), { max: 1 });
+    observer = postgres(url.toString(), { max: 1 });
+    const connectionA =
+      await a.$client`select pg_backend_pid() as pid, current_database() as database, current_user as role, current_setting('server_version') as version`;
+    const connectionB = await b.$client`select pg_backend_pid() as pid`;
+    pidA = Number(connectionA[0]!.pid);
+    pidB = Number(connectionB[0]!.pid);
+    const other = await Promise.all([
+      control`select pg_backend_pid() as pid`,
+      observer`select pg_backend_pid() as pid`,
+    ]);
+    expect(
+      new Set([pidA, pidB, ...other.map((rows) => Number(rows[0]!.pid))]).size,
+    ).toBe(4);
+    expect(connectionA[0]!.database).toBe(url.pathname.slice(1));
+    expect(connectionA[0]!.role).toBe('formalites_qa');
+    process.stdout.write(
+      JSON.stringify({
+        evidence: 'Q1/Q3 independent disposable connections',
+        database: connectionA[0]!.database,
+        role: connectionA[0]!.role,
+        version: connectionA[0]!.version,
+        pids: [pidA, pidB, ...other.map((rows) => rows[0]!.pid)],
+      }) + '\n',
+    );
+  });
+
+  afterAll(async () => {
+    if (a && owned.length) {
+      // Privileged cleanup of this suite's exact synthetic IDs, not normal domain methods.
+      await a.delete(versions).where(inArray(versions.templateId, owned));
+      await a.delete(drafts).where(inArray(drafts.templateId, owned));
+      await a.delete(identities).where(inArray(identities.id, owned));
+    }
+    await Promise.all([
+      a?.$client.end(),
+      b?.$client.end(),
+      control?.end(),
+      observer?.end(),
+    ]);
+  });
+
+  async function identity() {
+    const row = await apiA().createIdentity({
+      legalPurpose: 'synthetic purpose',
+    });
+    owned.push(row.id);
+    expect(uuidVersion(row.id)).toBe(7);
+    return row.id;
+  }
+
+  async function draft(text?: string) {
+    const templateId = await identity();
+    const row = await apiA().createDraft({ templateId, ...source(text) });
+    return { templateId, draftId: row.id, expectedRevision: row.revision };
+  }
+
+  async function waitBlocked(pid: number) {
+    for (let attempt = 0; attempt < 500; attempt += 1) {
+      const rows =
+        await observer`select wait_event_type, pg_blocking_pids(pid) as blockers from pg_stat_activity where pid=${pid}`;
+      if (rows[0]?.wait_event_type === 'Lock' && rows[0]?.blockers.length)
+        return;
+      await new Promise((done) => setTimeout(done, 10));
+    }
+    throw new Error(`Expected real PostgreSQL lock wait for ${pid}`);
+  }
+
+  async function orderedRace<T, U>(
+    templateId: string,
+    first: () => Promise<T>,
+    second: () => Promise<U>,
+  ) {
+    const locked = deferred();
+    const release = deferred();
+    const holder = control.begin(async (tx) => {
+      await tx`select id from formalites_template_identities where id=${templateId} for update`;
+      locked.resolve();
+      await release.promise;
+    });
+    await locked.promise;
+    try {
+      const firstResult = first().then(
+        (value) => ({ value }),
+        (error: unknown) => ({ error }),
+      );
+      await waitBlocked(pidA);
+      const secondResult = second().then(
+        (value) => ({ value }),
+        (error: unknown) => ({ error }),
+      );
+      await waitBlocked(pidB);
+      release.resolve();
+      await holder;
+      return await Promise.all([firstResult, secondResult]);
+    } finally {
+      release.resolve();
+      await holder;
+    }
+  }
+
+  it('Q1: migrated schema has exact global columns, constraints and journal', async () => {
+    const tables =
+      await observer`select tablename from pg_tables where schemaname='public' and tablename like 'formalites_template_%' order by tablename`;
+    expect(tables.map((row) => row.tablename)).toEqual([
+      'formalites_template_identities',
+      'formalites_template_versions',
+      'formalites_template_working_drafts',
+    ]);
+    const columns =
+      await observer`select table_name,column_name,is_nullable,data_type from information_schema.columns where table_schema='public' and table_name like 'formalites_template_%' order by table_name,ordinal_position`;
+    expect(columns).toHaveLength(22);
+    expect(
+      columns
+        .filter((row) => row.column_name === 'source_bytes')
+        .every((row) => row.data_type === 'bytea'),
+    ).toBe(true);
+    expect(
+      columns
+        .filter((row) => row.is_nullable === 'YES')
+        .map((row) => row.column_name),
+    ).toEqual(['frozen_at']);
+    expect(
+      columns.some((row) =>
+        /organization|establishment|actor|reviewer|evidence|ordinal|publication|qualification|retirement|metadata/.test(
+          String(row.column_name),
+        ),
+      ),
+    ).toBe(false);
+    const checks =
+      await observer`select conname,contype,confdeltype,pg_get_constraintdef(oid) as definition from pg_constraint where conrelid in ('formalites_template_identities'::regclass,'formalites_template_working_drafts'::regclass,'formalites_template_versions'::regclass)`;
+    expect(checks.filter((row) => row.contype === 'f')).toHaveLength(3);
+    expect(
+      checks
+        .filter((row) => row.contype === 'f')
+        .every((row) => row.confdeltype === 'r'),
+    ).toBe(true);
+    expect(checks.filter((row) => row.contype === 'c')).toHaveLength(5);
+    const active =
+      await observer`select indexdef from pg_indexes where indexname='formalites_template_one_active_draft'`;
+    expect(active[0]!.indexdef).toContain('UNIQUE INDEX');
+    expect(active[0]!.indexdef).toContain('WHERE (frozen_at IS NULL)');
+    const journal =
+      await observer`select count(*)::int as count from drizzle.__drizzle_migrations`;
+    expect(journal[0]!.count).toBe(21);
+  });
+
+  it('Q2/Q7/Q9/Q11: real draft/edit/freeze/history preserves bytes and immutable applicability', async () => {
+    const templateId = await identity();
+    expect(await apiB().readHistory({ templateId })).toEqual([]);
+    const first = await apiA().createDraft({
+      templateId,
+      ...source(' a\0é\uFEFF\r\n\t\n '),
+    });
+    expect(uuidVersion(first.id)).toBe(7);
+    expect(first.sourceBytes).toEqual(Buffer.from(' a\0é\uFEFF\n\t\n '));
+    const changed = await apiA().editDraft({
+      templateId,
+      draftId: first.id,
+      expectedRevision: 1,
+      ...source(' e\u0301\0\t\r\n\n '),
+      applicability: {
+        bindingConditions: {
+          kind: 'assertions',
+          values: [' synthetic B ', 'synthetic A'],
+        },
+      },
+    });
+    expect(changed.revision).toBe(2);
+    const locator = { templateId, draftId: first.id, expectedRevision: 2 };
+    const frozen = await apiA().freezeDraft(locator);
+    expect(frozen.replayed).toBe(false);
+    expect(uuidVersion(frozen.version.id)).toBe(7);
+    const independent = await apiB().readVersion({
+      templateId,
+      versionId: frozen.version.id,
+    });
+    expect(independent).toEqual(frozen.version);
+    expect(independent.sourceBytes).toEqual(Buffer.from(' e\u0301\0\t\n\n '));
+    expect(independent.contentChecksum).toBe(
+      createHash('sha256').update(independent.sourceBytes).digest('hex'),
+    );
+    expect(Object.keys(independent.applicability)).toHaveLength(9);
+    expect(independent.applicability.bindingConditions).toEqual({
+      kind: 'assertions',
+      values: [' synthetic B ', 'synthetic A'],
+    });
+    independent.sourceBytes.fill(0);
+    expect(
+      await apiB().readVersion({ templateId, versionId: frozen.version.id }),
+    ).toEqual(frozen.version);
+    await expect(
+      apiA().editDraft({ ...locator, ...source('replacement') }),
+    ).rejects.toMatchObject({ code: 'DRAFT_FROZEN' });
+    const next = await apiA().createDraft({
+      templateId,
+      ...source(' e\u0301\0\t\n\n '),
+      applicability: {
+        jurisdiction: {
+          kind: 'assertions',
+          values: ['different synthetic scope'],
+        },
+      },
+    });
+    const second = await apiB().freezeDraft({
+      templateId,
+      draftId: next.id,
+      expectedRevision: 1,
+    });
+    expect(second.version.id).not.toBe(frozen.version.id);
+    expect(second.version.contentChecksum).toBe(frozen.version.contentChecksum);
+    expect(second.version.applicability).not.toEqual(
+      frozen.version.applicability,
+    );
+    expect((await apiA().freezeDraft(locator)).version).toEqual(frozen.version);
+    expect(await apiB().readHistory({ templateId })).toEqual([
+      frozen.version,
+      second.version,
+    ]);
+    expect((await apiB().readIdentity({ templateId })).legalPurpose).toBe(
+      'synthetic purpose',
+    );
+  });
+
+  it('Q3: independent competing creation commits at most one active draft', async () => {
+    const templateId = await identity();
+    const [first, second] = await orderedRace(
+      templateId,
+      () => apiA().createDraft({ templateId, ...source() }),
+      () => apiB().createDraft({ templateId, ...source('other') }),
+    );
+    expect(first).toHaveProperty('value');
+    expect(second).toMatchObject({ error: { code: 'ACTIVE_DRAFT_EXISTS' } });
+    const rows =
+      await observer`select count(*)::int as count from formalites_template_working_drafts where template_id=${templateId} and frozen_at is null`;
+    expect(rows[0]!.count).toBe(1);
+  });
+
+  it('Q3/Q4: edit wins; stale edit/freeze cannot overwrite or mix snapshots', async () => {
+    const locator = await draft();
+    const [first, second] = await orderedRace(
+      locator.templateId,
+      () =>
+        apiA().editDraft({
+          ...locator,
+          ...source('new'),
+          applicability: {
+            jurisdiction: { kind: 'assertions', values: ['new scope'] },
+          },
+        }),
+      () => apiB().freezeDraft(locator),
+    );
+    expect(first).toHaveProperty('value');
+    expect(second).toMatchObject({ error: { code: 'STALE_DRAFT_REVISION' } });
+    await expect(
+      apiB().editDraft({ ...locator, ...source('stale') }),
+    ).rejects.toMatchObject({ code: 'STALE_DRAFT_REVISION' });
+    expect(
+      await apiA().readHistory({ templateId: locator.templateId }),
+    ).toEqual([]);
+    const result = await apiB().freezeDraft({
+      ...locator,
+      expectedRevision: 2,
+    });
+    expect(result.version.sourceBytes.toString()).toBe('new');
+    expect(result.version.applicability.jurisdiction).toEqual({
+      kind: 'assertions',
+      values: ['new scope'],
+    });
+  });
+
+  it('Q4: freeze wins; blocked competing edit cannot mutate frozen binding', async () => {
+    const locator = await draft('original');
+    const [first, second] = await orderedRace(
+      locator.templateId,
+      () => apiA().freezeDraft(locator),
+      () => apiB().editDraft({ ...locator, ...source('later') }),
+    );
+    expect(first).toHaveProperty('value');
+    expect(second).toMatchObject({ error: { code: 'DRAFT_FROZEN' } });
+    const history = await apiB().readHistory({
+      templateId: locator.templateId,
+    });
+    expect(history).toHaveLength(1);
+    expect(history[0]!.sourceBytes.toString()).toBe('original');
+  });
+
+  it('Q5: independent concurrent exact-revision freezes return the same version', async () => {
+    const locator = await draft();
+    const [first, second] = await orderedRace(
+      locator.templateId,
+      () => apiA().freezeDraft(locator),
+      () => apiB().freezeDraft(locator),
+    );
+    expect(first).toHaveProperty('value');
+    expect(second).toHaveProperty('value');
+    if (!('value' in first) || !('value' in second))
+      throw new Error('Expected two successful freeze results');
+    expect(first.value.replayed).toBe(false);
+    expect(second.value.replayed).toBe(true);
+    expect(first.value.version).toEqual(second.value.version);
+    expect(
+      await apiB().readHistory({ templateId: locator.templateId }),
+    ).toHaveLength(1);
+  });
+
+  it('Q5: lost response after a real commit propagates error, exact retry resolves durable result', async () => {
+    const locator = await draft();
+    const loss = new Error(
+      'Synthetic response lost after commit; outcome unknown to caller',
+    );
+    const failing = repository(
+      instrument(
+        a,
+        (tx) => tx,
+        () => {
+          throw loss;
+        },
+      ),
+      internalAuth(),
+    );
+    await expect(failing.freezeDraft(locator)).rejects.toBe(loss);
+    const retained = await apiB().readHistory({
+      templateId: locator.templateId,
+    });
+    expect(retained).toHaveLength(1);
+    expect(await apiB().freezeDraft(locator)).toEqual({
+      version: retained[0],
+      replayed: true,
+    });
+    await apiA().createDraft({
+      templateId: locator.templateId,
+      ...source('new active'),
+    });
+    expect(await apiA().freezeDraft(locator)).toEqual({
+      version: retained[0],
+      replayed: true,
+    });
+  });
+
+  it('Q6: injected failure after real version insert rolls back both version and close', async () => {
+    const locator = await draft();
+    let insertedInsideTransaction = false;
+    const failure = new Error('Synthetic failure before draft close');
+    const wrapped = new Proxy(a, {
+      get(target, key) {
+        if (key === 'transaction')
+          return (
+            work: (tx: Transaction) => Promise<unknown>,
+            config: Parameters<CloudDatabaseClient['transaction']>[1],
+          ) =>
+            target.transaction(async (tx) => {
+              const wrappedTx = new Proxy(tx, {
+                get(txTarget, txKey) {
+                  if (txKey === 'update')
+                    return () => {
+                      throw failure;
+                    };
+                  const member: unknown = Reflect.get(txTarget, txKey);
+                  return typeof member === 'function'
+                    ? member.bind(txTarget)
+                    : member;
+                },
+              });
+              try {
+                return await work(wrappedTx);
+              } catch (error) {
+                const inserted = await tx
+                  .select()
+                  .from(versions)
+                  .where(eq(versions.templateId, locator.templateId));
+                insertedInsideTransaction = inserted.length === 1;
+                throw error;
+              }
+            }, config);
+        const member: unknown = Reflect.get(target, key);
+        return typeof member === 'function' ? member.bind(target) : member;
+      },
+    });
+    await expect(
+      repository(wrapped, internalAuth()).freezeDraft(locator),
+    ).rejects.toBe(failure);
+    expect(insertedInsideTransaction).toBe(true);
+    expect(
+      await apiB().readHistory({ templateId: locator.templateId }),
+    ).toEqual([]);
+    expect(
+      await apiB().readDraft({
+        templateId: locator.templateId,
+        draftId: locator.draftId,
+      }),
+    ).toMatchObject({ revision: 1, frozenAt: null });
+  });
+
+  it.each([
+    'bytes',
+    'checksum',
+    'profile',
+    'applicability',
+    'draft-binding',
+  ] as const)(
+    'Q8: full reads/replay fail closed for controlled %s corruption',
+    async (corruption) => {
+      const locator = await draft('unchanged');
+      const frozen = await apiA().freezeDraft(locator);
+      if (corruption === 'bytes')
+        await a
+          .update(versions)
+          .set({ sourceBytes: Buffer.from('corrupted') })
+          .where(eq(versions.id, frozen.version.id));
+      if (corruption === 'checksum')
+        await a
+          .update(versions)
+          .set({ contentChecksum: '0'.repeat(64) })
+          .where(eq(versions.id, frozen.version.id));
+      if (corruption === 'profile')
+        await a
+          .update(versions)
+          .set({ contentProfile: 'unapproved-future-profile' })
+          .where(eq(versions.id, frozen.version.id));
+      if (corruption === 'applicability')
+        await a
+          .update(versions)
+          .set({ applicability: {} })
+          .where(eq(versions.id, frozen.version.id));
+      if (corruption === 'draft-binding')
+        await a
+          .update(drafts)
+          .set({ sourceBytes: Buffer.from('corrupted draft') })
+          .where(eq(drafts.id, locator.draftId));
+      if (corruption !== 'draft-binding')
+        await expect(
+          apiB().readVersion({
+            templateId: locator.templateId,
+            versionId: frozen.version.id,
+          }),
+        ).rejects.toMatchObject({ code: 'INTEGRITY_FAILURE' });
+      await expect(apiB().freezeDraft(locator)).rejects.toMatchObject({
+        code: 'INTEGRITY_FAILURE',
+      });
+    },
+  );
+
+  it('Q7/Q9: invalid source/profile/reference/evidence input never persists a draft', async () => {
+    const templateId = await identity();
+    for (const sourceBytes of [
+      Buffer.from([0xc0, 0xaf]),
+      Buffer.from([0xef, 0xbb, 0xbf, 65]),
+    ])
+      await expect(
+        apiA().createDraft({ templateId, ...source(), sourceBytes }),
+      ).rejects.toThrow();
+    await expect(
+      apiA().createDraft({ templateId, ...source(), contentProfile: 'future' }),
+    ).rejects.toThrow();
+    await expect(
+      apiA().createDraft({
+        templateId,
+        ...source(),
+        applicability: {
+          jurisdiction: {
+            kind: 'canonicalReferences',
+            values: [{ owner: 'unapproved', referenceId: 'synthetic' }],
+          },
+        },
+      }),
+    ).rejects.toMatchObject({ code: 'INVALID_APPLICABILITY' });
+    await expect(
+      apiA().createDraft({
+        templateId,
+        ...source(),
+        applicability: { evidenceUrl: 'private' },
+      }),
+    ).rejects.toThrow();
+    expect(
+      await a.select().from(drafts).where(eq(drafts.templateId, templateId)),
+    ).toEqual([]);
+  });
+
+  it('Q10: denied actors and system context do not acquire tenant authority', async () => {
+    const locator = await draft();
+    for (const role of ['YUTA_SUPPORT', null] as const) {
+      await expect(
+        repository(a, internalAuth(role)).readDraft({
+          templateId: locator.templateId,
+          draftId: locator.draftId,
+        }),
+      ).rejects.toThrow();
+      await expect(
+        repository(a, internalAuth(role)).freezeDraft(locator),
+      ).rejects.toThrow();
+    }
+    const system =
+      await internalAuth().requireFormalitesTemplateSystemOperation(
+        'formalites.template.read',
+      );
+    await expect(
+      readFormalitesPersonnelDraft(
+        a,
+        system as unknown as TenantContext,
+        uuidv7(),
+      ),
+    ).rejects.toThrow();
+    const wrongTemplate = await identity();
+    await expect(
+      apiB().readDraft({ templateId: wrongTemplate, draftId: locator.draftId }),
+    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
+    await expect(
+      apiB().freezeDraft({ ...locator, templateId: wrongTemplate }),
+    ).rejects.toMatchObject({ code: 'NOT_FOUND' });
+  });
+
+  it('Q1/Q3: durable database constraints reject duplicate active drafts, invalid revisions and cross-identity versions', async () => {
+    const locator = await draft();
+    const row = (
+      await a.select().from(drafts).where(eq(drafts.id, locator.draftId))
+    )[0]!;
+    await expect(
+      a.insert(drafts).values({ ...row, id: uuidv7() }),
+    ).rejects.toThrow();
+    await expect(
+      a.update(drafts).set({ revision: 0 }).where(eq(drafts.id, row.id)),
+    ).rejects.toThrow();
+    await a
+      .update(drafts)
+      .set({ revision: 2147483647 })
+      .where(eq(drafts.id, row.id));
+    await expect(
+      apiB().editDraft({
+        ...locator,
+        expectedRevision: 2147483647,
+        ...source(),
+      }),
+    ).rejects.toMatchObject({ code: 'INTEGRITY_FAILURE' });
+    await a.update(drafts).set({ revision: 1 }).where(eq(drafts.id, row.id));
+    const frozen = await apiA().freezeDraft(locator);
+    const another = await identity();
+    await expect(
+      a
+        .insert(versions)
+        .values({ ...frozen.version, id: uuidv7(), templateId: another }),
+    ).rejects.toThrow();
+    await expect(
+      a.insert(versions).values({ ...frozen.version, id: uuidv7() }),
+    ).rejects.toThrow();
+    await expect(
+      a
+        .update(versions)
+        .set({ contentChecksum: 'INVALID' })
+        .where(eq(versions.id, frozen.version.id)),
+    ).rejects.toThrow();
+    await expect(
+      a
+        .update(versions)
+        .set({ checksumAlgorithm: 'other' })
+        .where(eq(versions.id, frozen.version.id)),
+    ).rejects.toThrow();
+    await expect(
+      a.delete(identities).where(eq(identities.id, locator.templateId)),
+    ).rejects.toThrow();
+    await expect(
+      a
+        .delete(drafts)
+        .where(
+          and(
+            eq(drafts.templateId, locator.templateId),
+            eq(drafts.id, locator.draftId),
+          ),
+        ),
+    ).rejects.toThrow();
+  });
+});
diff --git a/packages/db-cloud/test/formalites-legal-template-repository.test.ts b/packages/db-cloud/test/formalites-legal-template-repository.test.ts
new file mode 100644
--- /dev/null
+++ b/packages/db-cloud/test/formalites-legal-template-repository.test.ts
@@ -0,0 +1,274 @@
+import { getTableConfig } from 'drizzle-orm/pg-core';
+import { describe, expect, it } from 'vitest';
+import { createAuthService, type InternalUserRecord } from '@yuta/auth';
+import type { CloudDatabaseClient } from '../src/client';
+import { createFormalitesLegalTemplateRepository } from '../src/formalites-legal-template-repository';
+import { FORMALITES_LEGAL_SOURCE_PROFILE } from '../src/formalites-legal-template-domain';
+import {
+  formalitesTemplateIdentities,
+  formalitesTemplateVersions,
+  formalitesTemplateWorkingDrafts,
+} from '../src/schema/formalites-legal-templates';
+
+describe('Formalites legal-template schema boundary', () => {
+  it('defines exactly the three global records, without lifecycle or tenant fields', () => {
+    const expected = [
+      [formalitesTemplateIdentities, ['id', 'legal_purpose', 'created_at']],
+      [
+        formalitesTemplateWorkingDrafts,
+        [
+          'id',
+          'template_id',
+          'revision',
+          'content_profile',
+          'source_bytes',
+          'applicability',
+          'created_at',
+          'updated_at',
+          'frozen_at',
+        ],
+      ],
+      [
+        formalitesTemplateVersions,
+        [
+          'id',
+          'template_id',
+          'source_draft_id',
+          'source_draft_revision',
+          'content_profile',
+          'source_bytes',
+          'checksum_algorithm',
+          'content_checksum',
+          'applicability',
+          'frozen_at',
+        ],
+      ],
+    ] as const;
+    for (const [table, columns] of expected) {
+      const config = getTableConfig(table);
+      expect(config.columns.map((column) => column.name)).toEqual(columns);
+      expect(
+        config.columns
+          .filter((column) => !column.notNull)
+          .map((column) => column.name),
+      ).toEqual(table === formalitesTemplateWorkingDrafts ? ['frozen_at'] : []);
+      for (const fk of config.foreignKeys) expect(fk.onDelete).toBe('restrict');
+    }
+  });
+
+  it('keeps partial active uniqueness, exact freeze uniqueness and containment', () => {
+    const draft = getTableConfig(formalitesTemplateWorkingDrafts);
+    expect(draft.indexes).toHaveLength(1);
+    expect(draft.indexes[0]?.config).toMatchObject({
+      name: 'formalites_template_one_active_draft',
+      unique: true,
+    });
+    expect(draft.indexes[0]?.config.where).toBeDefined();
+    expect(
+      draft.uniqueConstraints.map((key) =>
+        key.columns.map((column) => column.name),
+      ),
+    ).toEqual([['id', 'template_id']]);
+    expect(draft.checks.map((check) => check.name)).toEqual([
+      'formalites_template_draft_positive_revision',
+    ]);
+    const version = getTableConfig(formalitesTemplateVersions);
+    expect(
+      version.uniqueConstraints.map((key) =>
+        key.columns.map((column) => column.name),
+      ),
+    ).toEqual([['source_draft_id', 'source_draft_revision']]);
+    expect(version.checks.map((check) => check.name)).toEqual([
+      'formalites_template_version_positive_revision',
+      'formalites_template_checksum_algorithm',
+      'formalites_template_checksum_shape',
+    ]);
+    expect(
+      version.foreignKeys
+        .find(
+          (fk) =>
+            fk.getName() === 'formalites_template_version_draft_containment',
+        )
+        ?.reference()
+        .columns.map((column) => column.name),
+    ).toEqual(['source_draft_id', 'template_id']);
+  });
+
+  it('maps bytea with defensive binary copies (not a database roundtrip claim)', () => {
+    const column = formalitesTemplateVersions.sourceBytes;
+    expect(column.getSQLType()).toBe('bytea');
+    const original = Buffer.from('a\0é\t\n');
+    const encoded = column.mapToDriverValue(original);
+    const decoded = column.mapFromDriverValue(encoded);
+    expect(decoded).toEqual(original);
+    expect(decoded).not.toBe(original);
+    original.fill(0);
+    expect(decoded).toEqual(Buffer.from('a\0é\t\n'));
+    expect(() =>
+      column.mapFromDriverValue('not bytes' as unknown as Buffer),
+    ).toThrow('Invalid legal source binary representation');
+  });
+});
+
+describe('Exact-operation authorized global facade', () => {
+  const templateId = '019c0000-0000-7000-8000-000000000001';
+  const draftId = '019c0000-0000-7000-8000-000000000002';
+  const source = {
+    contentProfile: FORMALITES_LEGAL_SOURCE_PROFILE,
+    sourceBytes: Buffer.from('synthetic'),
+    applicability: {},
+  };
+  const actions = [
+    [
+      'createIdentity',
+      { legalPurpose: 'synthetic purpose' },
+      'formalites.template.draft.manage',
+    ],
+    ['readIdentity', { templateId }, 'formalites.template.read'],
+    ['readDraft', { templateId, draftId }, 'formalites.template.read'],
+    [
+      'readVersion',
+      { templateId, versionId: draftId },
+      'formalites.template.read',
+    ],
+    ['readHistory', { templateId }, 'formalites.template.read'],
+    [
+      'createDraft',
+      { templateId, ...source },
+      'formalites.template.draft.manage',
+    ],
+    [
+      'editDraft',
+      { templateId, draftId, expectedRevision: 1, ...source },
+      'formalites.template.draft.manage',
+    ],
+    [
+      'freezeDraft',
+      { templateId, draftId, expectedRevision: 1 },
+      'formalites.template.review.submit',
+    ],
+  ] as const;
+
+  function setup(
+    state:
+      | 'admin'
+      | 'support'
+      | 'restaurant-only'
+      | 'anonymous'
+      | 'missing'
+      | 'disabled',
+  ) {
+    const events: string[] = [];
+    const internal: InternalUserRecord = {
+      id: templateId,
+      email: 'synthetic@example.invalid',
+      displayName: null,
+      status: state === 'disabled' ? 'DISABLED' : 'ACTIVE',
+      systemRole:
+        state === 'support'
+          ? 'YUTA_SUPPORT'
+          : state === 'restaurant-only'
+            ? null
+            : 'YUTA_ADMIN',
+    };
+    const auth = createAuthService(
+      {
+        getIdentity: async () => {
+          events.push('identity');
+          return state === 'anonymous'
+            ? null
+            : { providerUserId: 'synthetic-provider', email: internal.email };
+        },
+      },
+      {
+        findByAuthProviderId: async () => {
+          events.push('internal-user');
+          return state === 'missing' ? null : internal;
+        },
+      },
+    );
+    const guard = auth.requireFormalitesTemplateSystemOperation;
+    auth.requireFormalitesTemplateSystemOperation = async (operation) => {
+      events.push(`guard:${String(operation)}`);
+      const context = await guard(operation);
+      events.push('allowed');
+      return context;
+    };
+    const resourceFailure = new Error('RESOURCE_DB_SENTINEL');
+    const db = new Proxy(
+      {},
+      {
+        get: (_target, property) => {
+          events.push(`db:${String(property)}`);
+          throw resourceFailure;
+        },
+      },
+    ) as CloudDatabaseClient;
+    return {
+      repository: createFormalitesLegalTemplateRepository(db, auth),
+      events,
+      resourceFailure,
+    };
+  }
+
+  for (const [action, input, operation] of actions) {
+    it(`${action} requires only its exact operation before resource access`, async () => {
+      const { repository, events, resourceFailure } = setup('admin');
+      await expect(repository[action](input)).rejects.toBe(resourceFailure);
+      expect(events.slice(0, 4)).toEqual([
+        `guard:${operation}`,
+        'identity',
+        'internal-user',
+        'allowed',
+      ]);
+      expect(events.filter((event) => event.startsWith('db:'))).toHaveLength(1);
+    });
+    it.each([
+      'support',
+      'restaurant-only',
+      'anonymous',
+      'missing',
+      'disabled',
+    ] as const)(
+      `${action} denies %s without any template DB access`,
+      async (state) => {
+        const { repository, events, resourceFailure } = setup(state);
+        await expect(repository[action](input)).rejects.not.toBe(
+          resourceFailure,
+        );
+        expect(events[0]).toBe(`guard:${operation}`);
+        expect(events.some((event) => event.startsWith('db:'))).toBe(false);
+        expect(events).not.toContain('allowed');
+      },
+    );
+    it(`${action} rejects caller authority/extra fields even after a real admin guard`, async () => {
+      const { repository, events } = setup('admin');
+      await expect(
+        repository[action]({
+          ...input,
+          systemRole: 'YUTA_ADMIN',
+          organizationId: templateId,
+        }),
+      ).rejects.toThrow();
+      expect(events).toContain('allowed');
+      expect(events.some((event) => event.startsWith('db:'))).toBe(false);
+    });
+  }
+
+  it('exposes no purpose/version patch, delete, reopen or lifecycle operation', () => {
+    expect(Object.keys(setup('admin').repository).sort()).toEqual(
+      actions.map(([name]) => name).sort(),
+    );
+  });
+
+  it('does not report a failed/unknown transaction as freeze success or rollback', async () => {
+    const { repository, events } = setup('admin');
+    await expect(
+      repository.freezeDraft({ templateId, draftId, expectedRevision: 1 }),
+    ).rejects.toThrow('RESOURCE_DB_SENTINEL');
+    expect(events.filter((event) => event.startsWith('guard:'))).toHaveLength(
+      1,
+    );
+    expect(events.at(-1)).toBe('db:transaction');
+  });
+});
```

## Final packet validation

Post-creation `pnpm docs:check` exit0 (36 documents), `pnpm architecture:check` exit0 and strict OpenSpec validation exit0 (1 valid, 0 issues). Exact scoped Prettier command in the canonical block exit0, including this packet. Embedded patch reverse-check exit0; its 368057 bytes and SHA-256 remain identical after Markdown formatting. Matrix contains29 rows; scenario table42 rows; CLI apply instructions exit0, total17/complete17/remaining0.

Scoped tracked `git diff --check -- packages/db-cloud/src/index.ts packages/db-cloud/src/schema/index.ts packages/db-cloud/drizzle/meta/_journal.json` exits0. For each of the eight untracked implementation files, `git -c core.autocrlf=false diff --no-index --check -- /dev/null <exact path from implementation table>` returns1 with empty stdout/stderr: expected no-index file-difference status, no whitespace diagnostics. An initial wrapper incorrectly treated that expected1 as a failure and exited1 on the first SQL file; the explicit per-file diagnostic confirmed all eight without editing source or suppressing a real warning. Raw migration hashes remain authoritative; no formatter rewrite of SQL/metadata.

RAW OPENSPEC STATUS: all_done. YUTA OPERATIONAL READINESS: Gate3 review ready only; the generic CLI archive suggestion is not authorization. Final Tasks and Gate2b packet hashes above are exact after formatting. This packet's own final raw SHA-256 is returned separately to avoid a self-hash cycle.

Final full-tree attribution snapshot: `2026-09-08T09:32:40.966Z`. Relative to this continuation's captured baseline, no path was deleted and no implementation/migration/semantic Formalités artifact changed. The only Formalités changes are Tasks, Gate2b metadata and this new packet. Both explicitly protected shared hashes still match exactly. Three concurrent Pointage-only documentation paths changed outside delivery:

| Concurrent path                                                               | Snapshot SHA-256                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`              | `0562bd888e90653234b14e1c888821bf21a0cc5eb114a5c9e39e046db216d979` |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `00cb1f24ba28594ecba5c65a78a5098872d0da998817aae974ad1d96909b0614` |
| `openspec/changes/pointage-usable-raw-clocking/design.md`                     | `a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361` |

The Pointage plan-review preimage was `a80a45fdc7889a1f68b15a9af9da95ef6695684b085ad6b394dbae53f12b0977`. These hashes supplement earlier observed context, do not rebaseline protected Formalités authority and do not imply any Pointage approval/readiness. Global formatting result records its actual earlier execution; later concurrent review edits are not silently presented as part of that formatting run. Final post-packet scoped formatter/docs/architecture/strict validation all exit0.

## Gate decision requested

No unresolved scoped implementation, protected-integrity, migration or required QA blocker remains under the explicit Control Tower B1/B2/rebaseline decisions. Technical acceptance is not Product compliance certification, application/runtime enablement or production readiness.

Recommendation: APPROVE_GATE_3_WITH_EXPLICIT_SYNC_AUTHORIZATION_IF_READY
Review status: AWAITING_HUMAN_REVIEW
Sync authorization: PENDING
Production: NOT AUTHORIZED

STOP here for human Gate 3. No Sync, Archive, Knowledge Consolidation, migration generation, production migration or deployment performed by this continuation. Release follow-ups are candidates recorded above only, not implemented or approved.

## Gate 3 approval and pre-sync authorization stop — 2026-09-08

### Current decision and bounded finish stage

Gate 3: APPROVED
Approval source: explicit current-user instruction
Approval recorded by: Codex workflow
Approved: 2026-09-08T09:48:04Z
Sync authorization: NOT_GRANTED
Archive authorization: NOT_GRANTED
Finish outcome: PENDING_SYNC_AUTHORIZATION
Workflow status: AWAITING_SYNC_AUTHORIZATION
Production: NOT AUTHORIZED

Control Tower duyệt đúng Tasks `38c79ae3abf6a8a0547cf35acfc036276ed7d099a304e9b487f0712e0098d96b` và packet trước metadata `26df96783d569d0daaca89485be3a21ed8de5589d7e7719e12f95c75d39b1ebc`. Approval basis: Tasks17/17; Technical Implementation Compliance29/29 (F1–F8/S1–S13/I1–I8); VERIFY PASS; QA PASS; requirements14/14; scenarios42/42. UI_AFFECTING NO; BROWSER_QA_REQUIRED NO.

`yuta-finish-change` hiện yêu cầu Gate3 approval cùng quyền Sync/Archive để vào active finalization; điều kiện đó chưa đủ ở bước này. Chỉ ghi metadata Gate3 theo yêu cầu riêng, rõ ràng của current user và chuẩn bị preview read-only; không chạy nhánh Sync/Archive hay sửa protocol/skill để tạo quyền. Future continuation cần explicit authorization theo từng ranh giới đã được Control Tower quyết định; trạng thái APPROVED này không phải archived-resume và không được suy thành quyền Sync. Không đánh dấu workflow DONE.

Các trạng thái AWAITING_HUMAN_REVIEW, Sync PENDING và command failures trong review/evidence gốc phía trên là lịch sử trước approval. Canonical VERIFY block, matrix và implementation diff được giữ nguyên exact bytes/hashes. Chỉ current top-level review/sync metadata và phần bổ sung này thay đổi; không sửa kết quả lịch sử. Có thể tái dựng đúng packet đã duyệt bằng cách bỏ phần bổ sung này và approval fields mới, hoàn nguyên đúng hai top-level status values; hash phải bằng reviewed packet hash.

### Finish preflight integrity

Fresh full repository path/hash snapshot: `2026-09-08T09:47:05.303Z`; HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Gate1 26/26, Gate2 29/29, Gate2b44/44 sau các explicit D8/rebaseline allowances đã duyệt: không drift. Hai shared hash được kiểm tra riêng, vẫn đúng:

| Protected shared path                   | SHA-256                                                            |
| --------------------------------------- | ------------------------------------------------------------------ |
| `packages/auth/src/index.ts`            | `464739729900d884af3ab82159151d7df5de6a0f8ee0a3a23feed7bc285a1c2a` |
| `packages/db-cloud/src/schema/index.ts` | `eb2629b220bcee856e8caaf24c9d16d88848c992231e031a46fe5f41ec6f9944` |

Proposal/Analysis/Specs/Design/metadata/Tasks và toàn bộ11 implementation/migration paths khớp bảng approved hashes phía trên. Source/snapshot/journal0020 không thay đổi; không generate hoặc áp dụng migration. CLI status trả đúng `yuta-spec-driven`, complete planning; Tasks17/17. Delta selection từ `artifactPaths.specs.existingOutputPaths` có đúng một file:

`D:/working/yuta/yuta-resto/openspec/changes/formalites-legal-template-foundation/specs/formalites/legal-template-foundation/spec.md`

- Delta SHA-256: `b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418`.
- Implementation diff SHA-256: `d9dc596a877b071c42e306c4a16cfcf2762f7695abb55024d88ec364f6e9b54e`; reverse applicability check exit0.
- Technical matrix SHA-256: `8968ad71ecafe26f768d12adc5a4614a9678c2b096afe1874a90a2f49222d503`;29 rows.
- Canonical VERIFY evidence SHA-256: `e3486126f7439faba2f2f7b86c03327220c36fff571f4281e1d78a015de3b93a`.

### Exact Sync preview — NOT APPLIED

Only capability: `formalites/legal-template-foundation`.

Exact proposed target:
`D:/working/yuta/yuta-resto/openspec/specs/formalites/legal-template-foundation/spec.md`

Pre-sync state: ABSENT.
Pre-sync SHA-256: NOT_APPLICABLE — file does not exist; not an empty-file hash.
Expected post-sync SHA-256: `5ae4931fd7f252312d650f2941bc9b97a7f45998612f670ed18dc7951e90b32a`.
Exact proposed patch SHA-256: `360d19af4cca83a5664d34fe66e519329cc0da49d2b1543f487c6cc1afd4320d`.

Đây là new-capability addition, không merge existing requirements. Preview thêm title `# Formalités Legal Template Foundation Specification`, giữ nguyên Purpose, đổi đúng structural header `## ADDED Requirements` thành `## Requirements`. Toàn bộ14 requirements/42 scenarios, thứ tự, lời văn và phần thân giữ exact bytes; không copy delta operation header vào main spec. Requirements/scenarios body SHA-256: `14f652a4615159654199715c9449424d2d4257dd9751662adac50381d747bf43`, giống hệt approved delta. Không thêm trạng thái triển khai/production hay Product intent.

Preview được tạo trong memory; `git apply --check --whitespace=nowarn -` với patch dưới đây exit0, không áp dụng patch, không tạo file/target directory. Chưa có normative promotion. Không Sync bất kỳ Pointage capability nào.

### Preserved neighboring normative specs

Các file này không thuộc target set và không cần sửa để Sync approved foundation:

| Existing main spec                                                                       | Exact pre-sync SHA-256                                             |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/specs/authorization/formalites/spec.md`                                        | `1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616` |
| `openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2` |
| `openspec/specs/formalites/template-legal-review-governance/spec.md`                     | `cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22` |

Mọi normative main-spec path/hash được snapshot trước metadata, không chỉ ba file trên. Không được tự nới target set hoặc sửa authorization/governance khi thực hiện preview này.

### Strict validation plan after explicit Sync authorization

1. Recheck approved delivery/current metadata hashes, the single delta path/hash, target still absent and preserved main-spec preimages; STOP on protected drift.
2. Apply only the exact one-file preview after explicit authorization. Compare resulting raw bytes/hash to `5ae4931fd7f252312d650f2941bc9b97a7f45998612f670ed18dc7951e90b32a`; verify exact14/42 body equivalence, Purpose preservation and absence of delta operation headers.
3. Review exact pre/post main-spec diff and confirm all other main specs, especially authorization/governance and Pointage, are unchanged.
4. Run `pnpm exec openspec validate --specs --strict --json`; record actual result, not a preview PASS. Run scoped main-spec formatting/diff checks, `pnpm docs:check` and `pnpm architecture:check`.
5. STOP if validation fails; preserve evidence and use only explicitly authorized exact-state recovery. Archive remains NOT AUTHORIZED in this step and must not happen automatically after future Sync.

Strict main-spec validation after Sync: NOT RUN — no Sync has occurred. No prospective result is claimed.

### Accepted failures and concurrent attribution preserved

B1 unchanged: C5 exit1,76 PASS/1 FAIL, `ACCEPTED_ATTRIBUTED_BASELINE_FAILURE`; never relabel PASS.
B2 unchanged: `pnpm test:cloud` exit1, `ACCEPTED_TEST_ORCHESTRATION_LIMITATION`; separately owner27/27 and Pointage8/8 PASS, not aggregate PASS.
Global format: historical67 inherited warnings; no repository-wide formatter-write and no formatter remediation here.

Concurrent Pointage context below is attribution only, unchanged since the latest Gate3 attribution snapshot; it is not approved Formalités authority or Pointage readiness:

| Concurrent path                                                               | Current SHA-256                                                    |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/db-cloud/src/schema/pointage.ts`                                    | `8f4f12cf76773dfca6f99ba59e37e5ee7d0a18ef13827f78caebddd51400de29` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                      | `50135e23a7b02a509833a3a63bfaca5339281fae191ba9700deec54bf377600a` |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md`              | `0562bd888e90653234b14e1c888821bf21a0cc5eb114a5c9e39e046db216d979` |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `00cb1f24ba28594ecba5c65a78a5098872d0da998817aae974ad1d96909b0614` |
| `openspec/changes/pointage-usable-raw-clocking/design.md`                     | `a6ae1cc787b756c0695edc29897f3a50cd92a349d10905aa679641c13522e361` |

No new protected/current approved drift detected. No Pointage file changed, merged or reverted by this finish preflight. No edits to Personnel Product Knowledge, PRODUCT_KNOWLEDGE, MODULE_REGISTRY, CURRENT_STATE or architecture summaries.

### Checks executed in this preflight

- `pnpm exec openspec status --change formalites-legal-template-foundation --json`: exit0, expected schema/root/single delta.
- `pnpm exec openspec instructions specs --change formalites-legal-template-foundation --json`: exit0; current rule snapshot inspected for read-only preview.
- `pnpm exec openspec validate formalites-legal-template-foundation --strict --json`: exit0,1/1 valid,0 issues.
- `pnpm docs:check`: exit0,36 documents.
- `pnpm architecture:check`: exit0.
- `pnpm -r --if-present typecheck`: exit0, all invoked projects.
- Exact implementation reverse check and proposed Sync applicability: both exit0.
- Test suites/builds/global `format:check`: NOT RERUN in this metadata-only finish stage; reviewed execution and accepted failures above remain historical evidence, not fresh results.
- Main-spec Sync/validation-after-Sync, Archive, Knowledge Consolidation and production: NOT PERFORMED.

### Exact proposed main-spec delta

Hash covers the exact UTF-8 LF fenced patch bytes, including final LF, excluding fences. This is a proposal only.

```diff
diff --git a/openspec/specs/formalites/legal-template-foundation/spec.md b/openspec/specs/formalites/legal-template-foundation/spec.md
new file mode 100644
--- /dev/null
+++ b/openspec/specs/formalites/legal-template-foundation/spec.md
@@ -0,0 +1,327 @@
+# Formalités Legal Template Foundation Specification
+
+## Purpose
+
+Định nghĩa durable GLOBAL YUTA Formalités template identity, mutable working draft và immutable canonical version với exact content/applicability binding. Foundation chuẩn bị dữ liệu cho future legal review mà không triển khai review, evidence, publication, qualification, retirement hoặc generation.
+
+## Requirements
+
+### Requirement: Global template foundation giữ dedicated ownership boundary
+
+Template Identity, Working Draft và Template Version SHALL thuộc `GLOBAL_YUTA_FORMALITES_TEMPLATES`, với Formalités là semantic owner và `@yuta/db-cloud` là persistence family qua dedicated global boundary. Resources SHALL NOT thuộc organization hoặc establishment, yêu cầu `TenantContext`, dùng system organization giả hoặc reuse tenant repository bằng cách bỏ scope. Platform Admin SHALL chỉ là future administration runtime boundary; Personnel và Documents SHALL giữ nguyên ownership hiện có.
+
+#### Scenario: Global identity không cần restaurant owner
+
+- **WHEN** authorized internal actor tạo template identity trong global boundary mà không có restaurant membership
+- **THEN** capability SHALL không yêu cầu organization, establishment hoặc `TenantContext` làm owner/context
+- **AND** identity SHALL không trở thành tenant-owned hoặc restaurant-customizable resource
+
+#### Scenario: Tenant fallback không tạo global access
+
+- **WHEN** caller cung cấp tenant scope, thiếu tenant scope hoặc fabricated system organization để yêu cầu global template access
+- **THEN** các giá trị đó SHALL NOT cung cấp global authority hoặc chuyển tenant repository thành global repository
+- **AND** capability SHALL chỉ cho access khi independent trusted system authorization hợp lệ
+
+### Requirement: Foundation sử dụng exact existing system operations và fail closed
+
+Capability SHALL giữ nguyên đúng năm independent operations `formalites.template.read`, `formalites.template.draft.manage`, `formalites.template.review.submit`, `formalites.template.publish`, `formalites.template.retire`. `YUTA_ADMIN` SHALL giữ explicit per-operation grants; `YUTA_SUPPORT` SHALL nhận none. Authority SHALL dựa trên trusted authenticated active internal YUTA user và exact operation grant, không browser/caller role assertion hoặc restaurant membership. Không wildcard, prefix matching, implication, role hierarchy, caller policy, new role/principal hoặc sixth operation.
+
+Trong slice này, `read` SHALL kiểm soát identity/draft/retained-version-history read; `draft.manage` SHALL kiểm soát create identity/create working draft/edit mutable draft; `review.submit` SHALL kiểm soát freeze. `publish` và `retire` SHALL giữ existing authorization nhưng SHALL NOT có domain execution trong foundation.
+
+#### Scenario: Exact read và draft operations của trusted admin
+
+- **WHEN** trusted active `YUTA_ADMIN` yêu cầu read hoặc create/edit thuộc bounded foundation
+- **THEN** capability SHALL kiểm tra đúng `formalites.template.read` hoặc `formalites.template.draft.manage` cho requested action
+- **AND** grant của operation khác SHALL NOT thay thế exact required grant
+
+#### Scenario: Freeze cần exact submission operation
+
+- **WHEN** caller yêu cầu freeze chỉ dựa trên read hoặc draft-management authorization result
+- **THEN** capability SHALL không freeze bằng result đó
+- **AND** freeze SHALL yêu cầu trusted authorization cho `formalites.template.review.submit`
+
+#### Scenario: Support và restaurant-only actors bị denied
+
+- **WHEN** actor là `YUTA_SUPPORT` hoặc chỉ có OWNER/MANAGER/STAFF membership mà không có required system grant
+- **THEN** capability SHALL từ chối global identity/draft/version read và mutation
+- **AND** membership hoặc tenant permission SHALL NOT cung cấp fallback
+
+#### Scenario: Untrusted hoặc unsupported authority fail closed
+
+- **WHEN** identity không authenticated, internal user không tồn tại/không active, hoặc caller dùng unknown operation, wildcard, prefix hay caller-defined policy
+- **THEN** capability SHALL từ chối requested access/mutation
+- **AND** caller-provided role hoặc operation similarity SHALL NOT tạo allow
+
+#### Scenario: System allow không cấp tenant resource access
+
+- **WHEN** actor có valid global template authorization yêu cầu employee dossier, tenant preparation draft hoặc tenant resource khác
+- **THEN** global grant SHALL NOT authorize tenant access
+- **AND** independent tenant authorization và resource scope SHALL tiếp tục áp dụng, không merge/fallback
+
+### Requirement: Stable Template Identity không bị repurpose qua version
+
+Template Identity SHALL đại diện một stable legal purpose/type qua các versions. Fundamental legal purpose/type khác SHALL yêu cầu identity khác, không overwrite purpose/type của existing identity để tái sử dụng lịch sử. Content/applicability revisions giữ cùng fundamental purpose SHALL có thể thuộc các versions của cùng identity.
+
+Metadata ảnh hưởng legal meaning, rendered content, applicability, selection, generation hoặc legal-review scope SHALL là version-significant. Chỉ explicitly approved internal presentation-only metadata SHALL được thay ngoài version; capability SHALL NOT tự coi một field là presentation-only để tránh version boundary.
+
+#### Scenario: Nhiều revisions cùng legal purpose
+
+- **WHEN** canonical content hoặc applicability được thay đổi nhưng fundamental legal purpose/type giữ nguyên
+- **THEN** changed revision SHALL có thể giữ cùng Template Identity và SHALL có immutable Version khác sau freeze
+
+#### Scenario: Fundamental legal purpose thay đổi
+
+- **WHEN** requested purpose/type không còn là fundamental purpose/type của existing Template Identity
+- **THEN** capability SHALL yêu cầu Template Identity khác cho purpose/type đó
+- **AND** SHALL không repurpose existing identity hoặc historical versions
+
+#### Scenario: Metadata không được dùng làm version bypass
+
+- **WHEN** một metadata change ảnh hưởng rendered/legal content, applicability, selection, generation hoặc review scope của frozen version
+- **THEN** change SHALL tuân new-version rule
+- **AND** nhãn display/presentation-only do caller tự đặt SHALL NOT cho phép sửa frozen binding
+
+### Requirement: Một active mutable Working Draft không phải canonical version
+
+Mỗi Template Identity SHALL có tối đa một active mutable Working Draft và SHALL cho phép `0..N` immutable Template Versions. Working Draft SHALL NOT được coi là canonical Template Version hoặc mang qualification. Authorized draft management SHALL cho phép sửa mutable content/applicability trước freeze mà không giả tạo immutable version cho mỗi edit.
+
+Sau successful freeze, working draft đã freeze SHALL không tiếp tục được sửa như active mutable draft; continuation SHALL dùng Working Draft khác. Multiple frozen historical/review candidates SHALL không vi phạm one-active-working-draft rule.
+
+#### Scenario: Identity chưa có immutable version
+
+- **WHEN** identity tồn tại nhưng chưa có successful freeze
+- **THEN** authorized read SHALL có thể phản ánh zero immutable versions
+- **AND** active working draft nếu có SHALL không được trình bày như canonical version
+
+#### Scenario: Active draft thứ hai bị ngăn
+
+- **WHEN** một identity đã có active mutable working draft và có yêu cầu tạo active draft khác, kể cả competing requests
+- **THEN** kết quả durable SHALL có tối đa một active mutable draft cho identity đó
+- **AND** capability SHALL không báo thành công tạo thêm một independently active draft trái rule
+
+#### Scenario: Edit mutable working draft
+
+- **WHEN** authorized actor sửa content/applicability của active mutable draft trước freeze
+- **THEN** successful mutation SHALL thay working draft state và có thể được đọc lại
+- **AND** edit đó SHALL không tự tạo canonical version, legal review hoặc qualification
+
+#### Scenario: Continuation sau freeze giữ historical candidates
+
+- **WHEN** actor muốn tiếp tục thay đổi sau khi một working draft đã freeze thành Version
+- **THEN** continuation SHALL dùng working draft khác theo one-active rule
+- **AND** các immutable versions đã tồn tại SHALL không bị biến thành editable drafts hoặc bị thay bởi draft mới
+
+### Requirement: Freeze tạo exact durable immutable version binding
+
+Successful freeze SHALL tạo một stable Template Version identity bound với exact Template Identity, content profile, canonical content bytes, identified checksum algorithm/checksum và immutable applicability declaration của exact working-draft revision được freeze. Capability SHALL không báo freeze thành công khi binding thiếu hoặc không nhất quán; partial/mixed snapshot SHALL không được coi là successful immutable Version.
+
+Successful identity/draft/version persistence SHALL có thể được đọc lại qua authorized read độc lập với transient caller state. Stable version identity SHALL không thay đổi giữa các lần đọc.
+
+#### Scenario: Freeze exact candidate
+
+- **WHEN** authorized freeze của một exact working-draft revision thành công
+- **THEN** authorized read SHALL trả một immutable Version với toàn bộ binding của đúng revision đó
+- **AND** canonical bytes/applicability SHALL không được thay bằng dữ liệu từ revision khác
+
+#### Scenario: Competing edit không tạo mixed snapshot
+
+- **WHEN** working content/applicability thay đổi cạnh tranh với freeze của một exact revision
+- **THEN** capability SHALL không báo successful freeze cho một snapshot trộn nhiều revisions hoặc khác exact revision được freeze
+- **AND** chỉ complete consistent binding SHALL được coi là successful Version
+
+#### Scenario: Reopen durable foundation state
+
+- **WHEN** authorized actor đọc lại identity, saved working draft hoặc successfully frozen version sau khi transient caller state không còn
+- **THEN** capability SHALL trả corresponding durable state
+- **AND** một frozen version SHALL giữ original stable identity và exact binding, không tái tạo từ current working draft
+
+### Requirement: Frozen content profile và applicability không thể sửa tại chỗ
+
+Sau freeze, template/version identity binding, content profile, canonical bytes, checksum algorithm/checksum và applicability declaration SHALL bất biến. Content/applicability changes SHALL yêu cầu Working Draft khác và Template Version khác; edit permission SHALL NOT cho phép sửa một frozen Version. Later profile/format rules SHALL NOT recanonicalize, normalize, formatter-rewrite hoặc reinterpret original byte identity của historical versions.
+
+#### Scenario: Frozen content hoặc applicability bị edit
+
+- **WHEN** caller yêu cầu sửa content/applicability tại existing frozen Version, kể cả bằng draft-management authority
+- **THEN** capability SHALL không thay frozen Version
+- **AND** requested revision SHALL cần working draft khác và new Version
+
+#### Scenario: Formatting được coi là minor change
+
+- **WHEN** caller muốn trim whitespace, normalize Unicode hoặc formatter-rewrite canonical content sau freeze vì coi đó là non-semantic cleanup
+- **THEN** original frozen bytes và checksum SHALL giữ nguyên
+- **AND** changed canonical content SHALL không được lưu dưới existing Version identity
+
+#### Scenario: Content profile tiến hóa
+
+- **WHEN** một future profile/format rule khác được sử dụng cho later work
+- **THEN** historical Version SHALL giữ original profile identity, bytes, algorithm/checksum và applicability binding
+- **AND** foundation SHALL không tự recanonicalize hoặc overwrite historical content
+
+### Requirement: Canonical Legal Source Profile V1 giữ exact textual byte rules
+
+Canonical Legal Source Profile V1 SHALL là textual source artifact có explicit content-profile identity. Canonical source bytes SHALL là valid UTF-8 không BOM và dùng LF line endings. Canonicalization SHALL xảy ra trước freeze; SHALL NOT Unicode-normalize hoặc silently trim whitespace. Frozen profile/bytes SHALL không chịu formatter rewrite. AST, DOCX, PDF và rendered output SHALL NOT thay canonical textual source identity trong foundation này.
+
+#### Scenario: Canonical source không BOM và dùng LF
+
+- **WHEN** freeze thành công theo Canonical Legal Source Profile V1
+- **THEN** persisted canonical bytes SHALL decode thành valid UTF-8, không bắt đầu bằng UTF-8 BOM và không dùng CR/CRLF làm line endings
+- **AND** LF canonicalization SHALL hoàn tất trước khi immutable checksum/binding được thiết lập
+
+#### Scenario: Invalid UTF-8 không được âm thầm sửa thành reviewed content
+
+- **WHEN** source input không biểu diễn valid UTF-8 cho canonical profile
+- **THEN** capability SHALL không báo successful freeze của input đó như valid canonical source
+- **AND** SHALL không silently replace invalid encoding để claim exact content identity
+
+#### Scenario: Unicode sequence không bị normalize
+
+- **WHEN** hai valid UTF-8 sources dùng different Unicode sequences dù hiển thị tương tự
+- **THEN** canonicalization SHALL giữ từng Unicode sequence mà không normalize chúng thành một source
+- **AND** exact byte identity SHALL không được thay bằng visual equivalence
+
+#### Scenario: Meaningful whitespace được giữ
+
+- **WHEN** source chứa leading/trailing spaces hoặc blank lines hợp lệ trước freeze
+- **THEN** canonicalization SHALL không silently trim chúng
+- **AND** frozen bytes SHALL giữ whitespace ngoài approved line-ending canonicalization
+
+### Requirement: SHA-256 được tính trên exact canonical bytes
+
+Mỗi immutable Version SHALL bind identified SHA-256 content checksum tính trên exact canonical source bytes của version đó. Checksum SHALL không lấy từ mutable draft khác, rendered content hoặc một normalized/truncated substitute. Caller-supplied checksum alone SHALL NOT chứng minh matching content; successful binding SHALL nhất quán với exact persisted bytes. Checksum SHALL chỉ biểu thị content identity, không reviewer authority, opinion authenticity hoặc qualification.
+
+#### Scenario: Independent checksum recomputation
+
+- **WHEN** authorized read cung cấp exact canonical source bytes của frozen Version để kiểm chứng
+- **THEN** SHA-256 recomputation trên những bytes đó SHALL bằng checksum bound với Version
+- **AND** identified algorithm và profile SHALL có thể được đối chiếu với version binding
+
+#### Scenario: Checksum không khớp bytes
+
+- **WHEN** claimed checksum không bằng SHA-256 của exact canonical bytes được bind
+- **THEN** capability SHALL không chấp nhận binding đó như successful consistent freeze
+- **AND** valid actor authority SHALL không thay thế content-integrity check
+
+#### Scenario: Checksum không phải legal evidence
+
+- **WHEN** canonical bytes và SHA-256 khớp
+- **THEN** kết quả SHALL chỉ xác lập bounded content identity
+- **AND** SHALL không xác lập external review, legal opinion authenticity, publication hoặc qualification
+
+### Requirement: Applicability change tạo Version khác dù content checksum giống nhau
+
+Immutable applicability declaration SHALL bound với exact Version độc lập với content checksum. Applicability change sau freeze SHALL yêu cầu Working Draft khác và Version khác dù canonical content bytes/checksum không đổi. Capability SHALL NOT deduplicate hai applicability revisions thành cùng Version chỉ vì content checksum giống nhau hoặc kế thừa review/qualification từ checksum.
+
+#### Scenario: Envelope đổi nhưng content giữ nguyên
+
+- **WHEN** actor thay applicability của frozen content qua another working draft, giữ canonical content bytes không đổi và freeze thành công
+- **THEN** resulting Version SHALL khác prior Version, có new immutable applicability binding
+- **AND** same content checksum SHALL không merge hai Version identities
+
+#### Scenario: Same checksum không cho qualification inheritance
+
+- **WHEN** two Versions có cùng canonical content checksum nhưng applicability declarations khác nhau
+- **THEN** foundation SHALL không dùng checksum equality làm qualification, review hoặc applicability equivalence
+
+### Requirement: Applicability assertions không tạo canonical truth hoặc automatic matching
+
+Applicability declaration SHALL bảo toàn jurisdiction, contract category, full/part-time boundary, employee/employer categories, collective-agreement assumptions, effective-date constraints, exclusions và binding conditions. Canonical references SHALL chỉ sử dụng khi approved authoritative owner đã tồn tại; otherwise declaration SHALL giữ explicit assertions/assumptions, không duplicate owning capability truth hoặc invent Product enums/reference-data authority.
+
+Unsupported, unmapped, missing hoặc unknown declarations SHALL NOT thành executable applicability facts. Foundation SHALL không automatic-match declared use, select applicable/current template hoặc claim assertions đã được external review. Missing/unknown SHALL không được diễn giải thành unrestricted applicability hoặc không có conditions.
+
+#### Scenario: Approved owner reference và assertion được phân biệt
+
+- **WHEN** một dimension có approved owning canonical reference còn dimension khác chưa có authoritative owner
+- **THEN** declaration SHALL giữ boundary giữa reference hợp lệ và explicit assertion/assumption
+- **AND** SHALL không tạo substitute canonical employer/collective configuration trong Formalités
+
+#### Scenario: Unsupported hoặc unknown applicability
+
+- **WHEN** declaration chứa unsupported/unmapped/unknown value hoặc thiếu thông tin cần để xác định applicability
+- **THEN** foundation SHALL không coi value đó là executable match, unrestricted applicability hoặc qualified use
+- **AND** SHALL không tự map sang invented enum/default để cho phép use
+
+#### Scenario: Asserted conditions không được thực thi như engine
+
+- **WHEN** declaration có exclusions, effective-date assumptions hoặc binding conditions
+- **THEN** foundation SHALL preserve declaration trong exact version binding
+- **AND** SHALL không tự thực thi applicability matching hoặc tuyên bố điều kiện đã đạt/legal review đã xảy ra
+
+### Requirement: Repeated freeze cùng draft revision không tạo duplicate Versions
+
+Repeated hoặc concurrent freeze của cùng working-draft revision SHALL không tạo nhiều immutable Versions cho revision đó. Successful Version đã tạo SHALL giữ stable identity và exact binding. Rule này SHALL không cho coi different draft revisions hoặc changed applicability là cùng candidate chỉ vì cùng content checksum; exact concurrency/idempotency mechanism không được quy định bởi requirement này.
+
+#### Scenario: Retry freeze sau response loss
+
+- **WHEN** freeze đã tạo Version thành công nhưng caller không nhận response và gửi lại freeze cùng draft revision
+- **THEN** capability SHALL không tạo second immutable Version cho revision đó
+- **AND** SHALL không báo một newly created Version khác như effect của repeated freeze
+
+#### Scenario: Concurrent freeze của cùng revision
+
+- **WHEN** nhiều authorized requests freeze cùng working-draft revision cạnh tranh
+- **THEN** durable result SHALL chứa tối đa một resulting Version cho revision đó
+- **AND** resulting stable binding SHALL không bị overwrite bởi competing request
+
+### Requirement: Version ordinal không phải applicability selector
+
+Template Version SHALL có stable identity, không phụ thuộc vào việc có ordinal hay không. Nếu capability cung cấp ordinal/version number, giá trị đó SHALL unique trong cùng Template Identity nhưng SHALL NOT biểu thị applicability, publication hoặc qualification. Highest/latest Version SHALL NOT được tự chọn cho declared use.
+
+#### Scenario: Optional ordinal unique trong template
+
+- **WHEN** capability cung cấp ordinal cho nhiều Versions của cùng Template Identity
+- **THEN** distinct Versions SHALL không dùng cùng ordinal trong identity đó
+- **AND** ordinal SHALL không thay stable Version identity
+
+#### Scenario: Highest Version chưa phải applicable Version
+
+- **WHEN** authorized caller đọc history có latest/highest ordinal hoặc nhiều frozen candidates
+- **THEN** foundation SHALL không suy ra Version đó applicable, reviewed, published hoặc qualified
+- **AND** thứ tự history SHALL không tạo automatic selection behavior
+
+### Requirement: Bounded internal traceability không lưu private legal evidence
+
+Foundation SHALL NOT persist external reviewer identity/professional data, legal opinion/correspondence, private evidence URL/path, evidence attachment/record hoặc publication evidence. Nó SHALL không cung cấp standalone legal-evidence CRUD/storage/upload hoặc reviewer YUTA account.
+
+Nếu internal mutation traceability được cung cấp, nó SHALL chỉ phục vụ bounded identity creation, working-draft mutation và version freeze; internal actor attribution SHALL dùng minimal YUTA actor identifier, không duplicate email/name/contact. Traceability SHALL phân biệt actual mutation outcome với authorization/security decision và SHALL NOT là legal-review evidence, publication audit hoặc qualification evidence. Privacy/retention production prerequisites SHALL còn nguyên; không invent duration hoặc indefinite-retention guarantee.
+
+#### Scenario: Minimal internal mutation attribution
+
+- **WHEN** foundation ghi traceability cho create/edit/freeze đã thực hiện
+- **THEN** actor attribution SHALL giới hạn ở minimal internal actor identifier cho bounded action
+- **AND** SHALL không copy user email/name/contact hoặc gọi record đó là legal-review/publication evidence
+
+#### Scenario: Private evidence không được nhét vào foundation
+
+- **WHEN** yêu cầu persistence bao gồm reviewer personal/professional data, opinion, correspondence, private evidence locator, attachment hoặc legal-review/publication evidence record
+- **THEN** foundation SHALL không persist dữ liệu đó như capability của slice này
+- **AND** existing draft/submit/publish authority SHALL không được suy diễn thành evidence CRUD
+
+#### Scenario: Security allow không là completed mutation hoặc retention approval
+
+- **WHEN** chỉ có authorization allow hoặc bounded mutation traceability
+- **THEN** capability SHALL không coi security allow là completed freeze và không coi traceability là legal review/publication/qualification
+- **AND** các records SHALL không tạo production privacy approval hoặc indefinite-retention obligation
+
+### Requirement: Freeze và foundation completion không triển khai excluded capabilities
+
+Freeze SHALL chỉ tạo immutable review candidate/version; SHALL NOT chứng minh external reviewer received it, review occurred, evidence exists, publication completed hoặc qualification. Existing governance ba outcomes và qualification prerequisites SHALL không bị thay đổi hoặc triển khai qua frozen-state labels. Existing publish/retire grants SHALL không tạo domain publication, qualification hoặc retirement execution trong foundation.
+
+Change SHALL NOT cung cấp actual CDI/CDD content, legal engagement/review, Platform Admin runtime/UI, Backoffice UI/session change, employer/employee collection, collective-agreement canonical configuration, placeholder/conditional execution, generated contract, preview/PDF/DOCX rendering, signature, Documents handoff, provider hoặc production enablement. Personnel facts, tenant draft behavior, signed Documents và POS/Display boundaries SHALL giữ nguyên. Workflow/spec completion SHALL không tự promote canonical Knowledge hoặc lifecycle/readiness.
+
+#### Scenario: Freeze không gửi review và không qualify
+
+- **WHEN** exact candidate freeze thành công
+- **THEN** outcome SHALL chỉ là immutable Version creation
+- **AND** SHALL không ghi hoặc claim external receipt, legal review, evidence, publication hoặc qualification
+
+#### Scenario: Publish hoặc retire authority không tạo domain execution
+
+- **WHEN** actor có existing `formalites.template.publish` hoặc `formalites.template.retire` grant yêu cầu thực hiện lifecycle action qua foundation này
+- **THEN** foundation SHALL không thực hiện publication, qualification hoặc retirement
+- **AND** SHALL không làm action đó thông qua freeze/draft-management fallback
+
+#### Scenario: Specs hoặc foundation được hoàn tất
+
+- **WHEN** artifacts được approved/validated hoặc bounded foundation được implement trong future authorized Apply
+- **THEN** kết quả SHALL không tạo actual template content, evidence store, application/UI, generation/provider hoặc production capability
+- **AND** SHALL không tự thay canonical Knowledge/lifecycle/readiness hoặc existing tenant/Personnel/Documents behavior
```

Post-metadata validation: scoped Prettier exit0; docs:check exit0 (36 documents); architecture:check exit0. Full-tree comparison against the fresh preflight snapshot finds only this review packet changed, no added/deleted source path, no protected drift and no main-spec change. Reconstructing the reviewed pre-metadata packet produces exactly `26df96783d569d0daaca89485be3a21ed8de5589d7e7719e12f95c75d39b1ebc`. The embedded Sync preview retains exact SHA-256 `360d19af4cca83a5664d34fe66e519329cc0da49d2b1543f487c6cc1afd4320d`; read-only applicability exit0 and the proposed main-spec path remains absent.

STOP: AWAITING_SYNC_AUTHORIZATION. Gate3 approval is recorded; current authorized finish preflight is complete, repository lifecycle is not DONE. No production action is authorized.

## Sync Result — 2026-09-08

Gate 3: APPROVED
Sync authorization: AUTHORIZED_BY_CURRENT_USER
Sync result: COMPLETED
Main-spec validation: PASS
Finish outcome: PENDING_ARCHIVE_AUTHORIZATION
Workflow status: AWAITING_ARCHIVE_AUTHORIZATION
Archive authorization: NOT_GRANTED
Knowledge Consolidation: NOT_STARTED
Production: NOT AUTHORIZED

### Explicit authority and pre-sync integrity

Current-user request: `C:/Users/Tam/.codex/attachments/8cc39047-4f95-4727-9a39-8fb515427538/pasted-text.txt`. Quyền này chỉ cho Sync + validation của `formalites/legal-template-foundation`; không bao gồm Archive, Knowledge hoặc production. Đây là continuation có giới hạn theo quyết định Control Tower, không sửa skill/protocol hoặc suy quyền Archive từ quyền Sync. Gate3 approval và accepted B1/B2 decisions giữ nguyên.

Pre-sync packet SHA-256 khớp `8f97cc8e4d375d4e69be7a714f27f356e67523202e0eb55155d6533f366fa4ce`; Tasks vẫn `38c79ae3abf6a8a0547cf35acfc036276ed7d099a304e9b487f0712e0098d96b`,17/17. Proposal/Analysis/Design/delta/.openspec.yaml, dedicated implementation/schema/test/0020 SQL/snapshot/journal và hai shared resume hashes không đổi. Earlier gates kiểm tra lại:26/26,29/29,44/44 với đúng các allowances đã duyệt; không protected drift.

Fresh full-tree pre-sync baseline: `2026-09-08T10:01:03.652Z`; HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. Root/scoped instructions và Authority Model/normativity/workflow documents đã đọc ở preflight trước vẫn giữ exact hashes. Snapshot bao gồm mọi tracked và non-ignored untracked path; không bỏ concurrent work hoặc coi dirty HEAD là Formalités delivery. Approved matrix/VERIFY/implementation-diff hashes và reverse applicability vẫn khớp.

CLI `openspec status` và current `instructions specs` đều exit0, `yuta-spec-driven`, repository root đúng và đúng một delta từ `artifactPaths.specs.existingOutputPaths`. Target được kiểm tra ABSENT ngay trước write; không overwrite hoặc merge unknown content. Pre-sync state ABSENT không được coi là empty-file hash.

### Exact synchronized main spec

| Evidence                          | Exact value                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------- |
| Capability                        | `formalites/legal-template-foundation` only                                   |
| Main-spec path                    | `openspec/specs/formalites/legal-template-foundation/spec.md`                 |
| Pre-sync state / hash             | ABSENT / NOT_APPLICABLE                                                       |
| Approved source delta SHA-256     | `b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418`            |
| Exact applied Sync patch SHA-256  | `360d19af4cca83a5664d34fe66e519329cc0da49d2b1543f487c6cc1afd4320d`            |
| Post-sync main-spec SHA-256       | `5ae4931fd7f252312d650f2941bc9b97a7f45998612f670ed18dc7951e90b32a`            |
| Requirement/scenario body SHA-256 | `14f652a4615159654199715c9449424d2d4257dd9751662adac50381d747bf43`            |
| Equivalence                       | 14/14 requirements;42/42 scenarios; exact body/Purpose/order/wording equality |
| Unapplied approved delta          | NONE                                                                          |

Actual main-spec bytes bằng chính xác canonical title + approved delta với duy nhất structural header replacement `## ADDED Requirements` → `## Requirements`. Không còn delta-operation header, không có implementation/production status, Product Knowledge prose hoặc runtime/UI/provider addition. Full approved one-file patch đã có trong packet phía trên và nay reverse-applicable trên actual main spec; không sửa patch bytes. Sync thực hiện mechanical promotion, không tạo Product/authorization/ownership/lifecycle approval mới.

### Executed post-sync validation

| Exact check                                                                                                                                                   | Actual result                                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm exec openspec validate --specs --strict --json`                                                                                                         | Exit0;17/17 specs valid;0 failed. INFO về requirement text dài không phải validation error; new foundation có7 INFO như vậy, không sửa approved wording |
| `pnpm docs:check`                                                                                                                                             | Exit0;36 current documents                                                                                                                              |
| `pnpm architecture:check`                                                                                                                                     | Exit0                                                                                                                                                   |
| `pnpm exec prettier --check openspec/specs/formalites/legal-template-foundation/spec.md docs/reviews/formalites-legal-template-foundation/03-final-review.md` | Exit0; exact scoped targets                                                                                                                             |
| `pnpm -r --if-present typecheck`                                                                                                                              | Exit0; all invoked projects, scope15 of16                                                                                                               |
| `git apply --check --whitespace=nowarn -` on exact approved patch before Sync                                                                                 | Exit0                                                                                                                                                   |
| `git apply --reverse --check --whitespace=nowarn -` on same patch after Sync                                                                                  | Exit0                                                                                                                                                   |
| `git -c core.autocrlf=false diff --no-index --check -- /dev/null openspec/specs/formalites/legal-template-foundation/spec.md`                                 | Exit1 with empty stdout/stderr: expected no-index added-file difference, zero whitespace diagnostics; not a test/validation failure                     |
| Raw content/Purpose/14/42/body-hash equivalence                                                                                                               | PASS; no unapplied delta                                                                                                                                |

Không chạy lại tests/builds/database operations trong normative documentation Sync này. Historical C5 exit1,76 PASS/1 FAIL vẫn `ACCEPTED_ATTRIBUTED_BASELINE_FAILURE`; aggregate `pnpm test:cloud` exit1 vẫn `ACCEPTED_TEST_ORCHESTRATION_LIMITATION`; targeted owner27/27 và Pointage8/8 không đổi thành aggregate PASS. Global67 formatting warnings là historical accepted baseline, không claim fresh global run. Không repository-wide formatter-write; main spec không formatter-write vì exact approved bytes đã PASS.

### Neighboring normative and Knowledge preservation

| Protected neighboring main spec                                                          | Unchanged pre/post SHA-256                                         |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `openspec/specs/authorization/formalites/spec.md`                                        | `1815f4dcdd4236d08176b45377e08e9e72a7d187de89172458d7e796a6a05616` |
| `openspec/specs/authorization/platform-admin-formalites-template-administration/spec.md` | `3b53193f63cc3536d00506826d5281aea7607a01604112051edebef5bb810db2` |
| `openspec/specs/formalites/template-legal-review-governance/spec.md`                     | `cbb2dc9173120e9fbc7231bca542b974278ed5d249a9ec8af47a1165873ccb22` |

Mọi main spec khác ngoài authorized target giữ nguyên pre-sync path/hash, gồm Pointage; việc strict validator đọc tất cả specs không phải Sync/approval của Pointage. Không sửa Personnel Product Knowledge, PRODUCT_KNOWLEDGE, MODULE_REGISTRY, CURRENT_STATE hay architecture summaries. Không Knowledge Consolidation hoặc lifecycle/readiness promotion.

Full-tree check lúc `2026-09-08T10:02:20.607Z` không có deleted path, không protected drift. Ngoài new main spec và bounded Gate3 metadata/evidence, concurrent work bên ngoài có các thay đổi dưới đây, chỉ attribution:

| Concurrent Pointage path — not Formalités delivery               | Pre-sync snapshot SHA-256                                          | Observed concurrent SHA-256                                        |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02b-design-review.md` | `0562bd888e90653234b14e1c888821bf21a0cc5eb114a5c9e39e046db216d979` | `8e90aa52ac1ecbd03c56d7040d70bb8a94f8c9947ca174e25fe8ed197cc707da` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`         | `50135e23a7b02a509833a3a63bfaca5339281fae191ba9700deec54bf377600a` | `05ab317d36a571fafce7b5793ffe1333ced351fd1ea1ba0cc1542fd350011407` |

Không edit, revert, merge hoặc approve những file Pointage này. Các dedicated Formalités source/schema/test/migration và approved shared indexes vẫn nguyên vẹn.

### Archive authorization boundary

Active change remains PRESENT:
`D:/working/yuta/yuta-resto/openspec/changes/formalites-legal-template-foundation`.

Proposed archive date: `2026-09-08` (Europe/Paris; recheck date at any later authorized execution).
Proposed archive destination:
`D:/working/yuta/yuta-resto/openspec/changes/archive/2026-09-08-formalites-legal-template-foundation`.
Destination checked ABSENT; not created or moved. This is a proposed destination, not archive evidence.

STOP for explicit Archive authorization. Sync + Validate Main Specs đã hoàn tất; repository workflow chưa DONE. Archive và Knowledge Consolidation chưa thực hiện. Không deploy, production migration, Platform Admin enablement, legal-template seed/content/review/evidence hoặc publish/qualify/retire action. Production remains NOT AUTHORIZED.

Earlier pre-sync/preview statuses and hashes remain historical evidence; this bounded Sync Result supersedes only current Sync/finish status, not approved technical or failed-command evidence. Post-sync packet raw hash is returned separately to avoid self-hash recursion.

## Archive Result — authorized 2026-09-08

Current-user Archive authorization: APPROVED. Pre-archive packet SHA-256 `961e35c4bce32fd62bcbb4abc4b2e0cadab8f981e55e660c3e5a2ad358c10855` matched exactly before any lifecycle action. Approved Tasks, Proposal/Analysis/Specs/Design, 26/29/44 gate-protected rows under accepted overrides, dedicated implementation/migration/snapshot/journal and the two explicitly rebaselined shared indexes were verified unchanged. No protected drift; no authority rebaseline.

Official command executed with exit 0:

```text
pnpm exec openspec archive formalites-legal-template-foundation --skip-specs --yes --json
```

`--skip-specs` avoided redundant Sync after exact approved delta/main equivalence verification; no main-spec write or validation bypass. Returned `specsUpdated: false`. The explicit user approved archive target was absent and resolved inside the intended workspace before the official move. No manual reconstruction, rename fallback or metadata exception.

Archive result: PASS. Active path ABSENT. Exact destination:

`D:/working/yuta/yuta-resto/openspec/changes/archive/2026-09-08-formalites-legal-template-foundation`

All six original files were moved with exact byte preservation:

| Archived relative path                               | SHA-256                                                            |
| ---------------------------------------------------- | ------------------------------------------------------------------ |
| `.openspec.yaml`                                     | `26bded8c207d4f1916a7733b9877e748de1536ffbb966b0f75839ab6a64d8820` |
| `analysis.md`                                        | `c40e395a230518bb5ff2073204fb44ae083eee5a2b833898c58287d326d6a4c1` |
| `design.md`                                          | `d6db50dc5db2a64e29e8b8a5148011bda1b4bb46127101fdf188e3b7a3526cf5` |
| `proposal.md`                                        | `61d51cce2ddc75acd050ca0317865e3ddc60e38f41c8e7e2047e4d2a28a9951c` |
| `specs/formalites/legal-template-foundation/spec.md` | `b68b3581d46d7a12d029303a1e83f24b3943f19e707edde8b2f6ef577bfc9418` |
| `tasks.md`                                           | `38c79ae3abf6a8a0547cf35acfc036276ed7d099a304e9b487f0712e0098d96b` |

Main-spec SHA-256 remains `5ae4931fd7f252312d650f2941bc9b97a7f45998612f670ed18dc7951e90b32a`; 14/14 requirements, 42/42 scenarios exact. Authorization and governance main specs remain unchanged. Archived Tasks remain 17/17 at the exact reviewed hash; no technical matrix, VERIFY, QA or failed-command evidence was rewritten.

### Post-archive checks

| Executed check                                                                                                                          | Exit / result                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm exec openspec validate --specs --strict --json`                                                                                   | 0; 17/17 PASS, no errors/warnings; 41 informational long-text messages                               |
| `pnpm exec openspec validate --archived --strict --json`                                                                                | 0; 17/17 archives PASS, zero issues                                                                  |
| `pnpm docs:check`                                                                                                                       | 0; 36 documents                                                                                      |
| `pnpm architecture:check`                                                                                                               | 0                                                                                                    |
| `pnpm -r --if-present typecheck`                                                                                                        | 0; completed recursive run                                                                           |
| Scoped Prettier check: six archived artifacts plus main spec                                                                            | 0; PASS; no archive formatter write                                                                  |
| Proposed Knowledge diff applicability: `git apply --check docs/reviews/formalites-legal-template-foundation/04-proposed-knowledge.diff` | 0; no apply                                                                                          |
| Knowledge target/proposal formatter comparison                                                                                          | Three targets PASS before/after; Personnel/Product CRLF-only inherited FAIL unchanged; no new defect |

B1 Personnel C5 remains exit 1, 76 PASS / 1 FAIL, ACCEPTED_ATTRIBUTED_BASELINE_FAILURE. B2 aggregate cloud suite remains exit 1, ACCEPTED_TEST_ORCHESTRATION_LIMITATION; targeted Owner 27/27 and Pointage 8/8 actual PASS remain historical evidence. Global formatting 67 inherited warnings are not relabeled PASS. No database regression, build or global formatter-write was rerun as part of Archive.

### Archive-stage concurrent attribution

Baseline `2026-09-08T10:39:18.625Z`; unchanged HEAD `defbc50eba3952fa2e7b1c016637daf083b18c65`. In addition to the expected six-file archive move and current review metadata/artifacts, observed external Pointage deltas are:

| Concurrent path, not this delivery                                            | Before SHA-256                                                     | Observed SHA-256                                                   |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `4a43db85422353d37a0132a7b47362ae6fab63d15c532442016ff7a834a50f04` | `ec96d42705d707cb99845fa9723076992c0677935eb39b2e01c8f32cb3232f81` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`                   | `2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb` | `761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3` |
| `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts`                 | `4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158` | `9a674855aba632365412bd08fd270610f61c8c1c9ae21c1a470c49429350fd06` |

No Pointage file was edited, reverted, merged or approved by this action. Current concurrent bytes are attribution only; earlier Sync observations remain historical. Shared protected indexes and dedicated Formalités source/migration hashes remain unchanged.

### Post-archive Knowledge boundary

Knowledge consolidation: UPDATE_REQUIRED. Exact candidate set:

- `docs/features/personnel/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/CURRENT_STATE.md`
- `docs/architecture/DATA_MODEL.md`

Review packet: [04-knowledge-consolidation-review.md](04-knowledge-consolidation-review.md).  
Review packet SHA-256: `dfd97abc15627dc61f2aadf3be56c3413c1453670c57737a0225f479a94a279d`.  
Proposed diff: [04-proposed-knowledge.diff](04-proposed-knowledge.diff).  
Proposed diff SHA-256: `005a7b271be126522ba5d64e765ae68c1d46e835dc49857fd97c0aa8ffe3bc49`.

Knowledge applied: NO. Review status: AWAITING_HUMAN_REVIEW. No canonical Knowledge or lifecycle/readiness value was modified/promoted. The inherited register-inactive statement in Data Model is separately flagged NEEDS_REVIEW; only the newly stale Formalités absence claim is proposed for correction.

Finish outcome: COMPLETED — Archive succeeded. Workflow status: AWAITING_KNOWLEDGE_REVIEW, not DONE.

RELEASE_FOLLOW_UP: REQUIRED, separately gated before future production use. The affected future environment is cloud/db-cloud; unchanged migration 0020 requires explicit target/runtime authorization, migration/readiness/backup/rollback review and post-migration schema/integrity verification. No deployment or production migration is scheduled or authorized.

STOP for Control Tower Knowledge Review. No runtime/Platform Admin enablement, template content/seed, reviewer evidence, publication/qualification/retirement, generation or production action. Production remains NOT AUTHORIZED.

This result supersedes only earlier pending Archive/Knowledge status. Historical approval, Sync and technical evidence remains intact; the final packet hash is returned separately.

### Final archive/review integrity checkpoint

Checkpoint: `2026-09-08T10:47:54.639Z`. Fresh full tracked/non-ignored-untracked path/hash comparison confirms 6/6 exact archive postimages and absent active paths; zero dedicated Formalités, approved shared-index or main-spec drift. All five canonical Knowledge target preimages remain unchanged. The pre-existing Gate 3 content is byte-identical after reversing only the four authorized current-status replacements; only the Archive Result was appended. Historical Technical Compliance Matrix, TECHNICAL VERIFY, implementation diff and B1/B2 evidence remain untouched.

After review-artifact creation, actual commands completed:

- `pnpm docs:check`: exit 0, 36 current documents.
- `pnpm architecture:check`: exit 0.
- `pnpm exec prettier --check docs/reviews/formalites-legal-template-foundation/03-final-review.md docs/reviews/formalites-legal-template-foundation/04-knowledge-consolidation-review.md`: exit 0.
- `git apply --check docs/reviews/formalites-legal-template-foundation/04-proposed-knowledge.diff`: exit 0.
- Scoped `git diff --check` over active/archive/foundation-spec/review paths: exit 0. Because review/archive files are untracked, full path/raw-hash inventory and original-prefix comparison additionally cover them; Git diff alone is not presented as complete untracked integrity evidence.

Pointage continued changing independently during review preparation. The following latest observed hashes supersede only earlier archive-stage attribution snapshots, not Formalités authority or any Pointage approval:

| Concurrent path                                                               | Pre-archive SHA-256                                                | Checkpoint SHA-256                                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/pointage-usable-raw-clocking/02c-implementation-plan-review.md` | `4a43db85422353d37a0132a7b47362ae6fab63d15c532442016ff7a834a50f04` | `bbd87a1c0418a00d15aa0ef036efd3cd6bc1609c64665dbffd6de3c960474792` |
| `openspec/changes/pointage-usable-raw-clocking/tasks.md`                      | `e428722e69d8dcddfccfe5ca72701010e0b99f567aa6ec14e25e4ceb92d1f281` | `1227709e9f367535d76edab795de847f943c6b6b691a2db4da2593c06c13ef3f` |
| `packages/db-cloud/src/pointage-raw-clocking-repository.ts`                   | `2fef65f53b3c5aa80e8abe1ee3a2364fcc852b8232ce6b67d22038484607afcb` | `761fcde21524db85d7dba026d5997503c6f2091523e1bb34d23a77f62f72d1c3` |
| `packages/db-cloud/test/pointage-raw-clocking-schema.test.ts`                 | `4848078f7194173cdab9a1a74f1f0c8b8553513fb2f44aa574ec78ff98724158` | `9a674855aba632365412bd08fd270610f61c8c1c9ae21c1a470c49429350fd06` |

Thus four external Pointage paths differ from the pre-archive baseline at this checkpoint. No such path was written by this action. Outside those attributed paths, the exact official archive move and the three permitted review/evidence paths, no additional repository path/hash delta was observed. This is a time-bounded snapshot, not a freeze of concurrent work.

Knowledge Review packet and proposed diff retain the hashes above. Knowledge remains NOT APPLIED. Workflow remains AWAITING_KNOWLEDGE_REVIEW. Production remains NOT AUTHORIZED.

## Knowledge Apply Result — 2026-09-08

Separate current-user Knowledge authorization approved packet `dfd97abc15627dc61f2aadf3be56c3413c1453670c57737a0225f479a94a279d` and exact diff `005a7b271be126522ba5d64e765ae68c1d46e835dc49857fd97c0aa8ffe3bc49`. All five preimages were checked immediately before applying only the reviewed hunks. All five approved postimage hashes match; original CRLF/LF styles are preserved with no BOM. Reverse applicability and exact preimage reconstruction PASS.

Knowledge review: APPROVED. Knowledge applied: YES. Knowledge apply result: PASS.  
KNOWLEDGE_CONSOLIDATION: PASS. REPOSITORY_WORKFLOW: READY_FOR_DONE.  
REGISTER_DATA_MODEL_STATUS: NEEDS_REVIEW_OUT_OF_SCOPE.  
RELEASE_FOLLOW_UP: REQUIRED. Production: NOT AUTHORIZED.

Final execution evidence, five hashes and exact command results:
[04-knowledge-consolidation-review.md](04-knowledge-consolidation-review.md).

Final Knowledge packet SHA-256: `0ba86529e84e987473d330b7c9c84f00219ea16a6e68051025e82ad5f558cda6`.

Post-Apply docs:check PASS (36 documents), architecture:check PASS, recursive typecheck PASS, strict main specs 17/17 PASS and strict archived changes 17/17 PASS. Scoped Prettier exited 1 only for the two explicitly accepted CRLF-only baseline cases; in-memory before/after comparison establishes no new formatting defect. Remaining three canonical targets PASS. No canonical formatter write or global formatting run occurred.

The full Apply path/hash comparison showed only the approved five canonical targets changed before bounded metadata finalization. Archive, main specs, implementation/schema/tests, migration 0020/snapshot, current journal and shared protected indexes stayed unchanged across Apply. The journal already contained a concurrent Pointage index-21 addition before this turn's Apply; removing only that entry in memory reconstructs its historical archive hash exactly. The full journal is not falsely claimed identical to the earlier archive checkpoint. No Pointage artifact was edited, reverted or approved.

Earlier Gate 3/Sync/Archive/technical results and proposal semantics remain historical evidence, not reopened or rewritten. This append supersedes pending Knowledge status only. The explicit current-user READY_FOR_DONE handoff overrides the skill's normal automatic DONE transition. Stop for Control Tower; no deployment, production migration, runtime enablement or lifecycle/readiness promotion.
