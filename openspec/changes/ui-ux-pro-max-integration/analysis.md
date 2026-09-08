# Change Analysis

## Scope and Change Type

`ui-ux-pro-max-integration` là thay đổi `CROSS_MODULE`,
`TOOLING_GOVERNANCE_SENSITIVE`, `SUPPLY_CHAIN_SENSITIVE`,
`LICENSE_PROVENANCE_UNCERTAIN`. Scope là external advisory design intelligence
cho Codex trong repository YUTA, không phải thay đổi giao diện sản phẩm.

Strategy A: một capability `tooling/external-design-intelligence`. Core-only,
pinned bootstrap và một policy gắn vào governance hiện tại là hướng planning
đã được người dùng đồng ý. Chưa có phê duyệt Gate 1, license acceptance hoặc
Apply. Lần này chỉ Proposal, Analysis và Gate 1 review.

## Sources Consulted

- [Repository instructions](../../../AGENTS.md),
  [documentation index](../../../docs/README.md),
  [current state](../../../docs/CURRENT_STATE.md),
  [Product Knowledge routing](../../../docs/PRODUCT_KNOWLEDGE.md),
  [Module Registry](../../../docs/MODULE_REGISTRY.md),
  [lifecycle model](../../../docs/LIFECYCLE_STATUS_MODEL.md).
- [Authority Model](../../../docs/AUTHORITY_MODEL.md),
  [activation policy](../../../docs/OPENSPEC_YUTA_ACTIVATION_POLICY_REVIEW.md),
  [normativity policy](../../../docs/OPENSPEC_YUTA_NORMATIVITY_POLICY_REVIEW.md),
  [Workflow v3](../../../docs/YUTA_WORKFLOW_V3.md),
  [automation protocol](../../../docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md).
- [UI guide](../../../docs/ui/README.md),
  [shared frontend rules](../../../docs/ui/YUTA_FRONTEND_RULES.md),
  [delivery modes](../../../docs/ui/DELIVERY_WORKFLOW_MODES.md),
  [design workflow](../../../docs/ui/DESIGN_TO_CODE_WORKFLOW.md),
  [page-pack protocol](../../../docs/ui/PAGE_PACK_PROTOCOL.md),
  [Backoffice rules](../../../docs/ui/BACKOFFICE_FRONTEND_RULES.md),
  [UI package instructions](../../../packages/ui/AGENTS.md),
  [export catalog](../../../packages/ui/src/index.ts),
  [semantic tokens](../../../packages/ui/src/styles/global.css).
- [Package manifest](../../../package.json),
  [ignore policy](../../../.gitignore),
  [development workflow](../../../docs/DEVELOPMENT_WORKFLOW.md),
  [run-change skill](../../../.agents/skills/yuta-run-change/SKILL.md),
  [OpenSpec config](../../config.yaml).
- Upstream read-only Discovery ngày 2026-09-08:
  [npm metadata](https://registry.npmjs.org/ui-ux-pro-max-cli/2.15.0),
  [published tarball](https://registry.npmjs.org/ui-ux-pro-max-cli/-/ui-ux-pro-max-cli-2.15.0.tgz),
  [source repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill),
  [license correction PR 486](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/pull/486),
  [release issue 457](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/issues/457),
  [release run](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/actions/runs/34030391223),
  [dry-run PR 489](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/pull/489).
  Đây là snapshot Discovery, không phải cam kết trạng thái upstream không đổi.

## Authority and Product Decision

YUTA authority được chọn theo loại câu hỏi trong Authority Model, không dùng
một universal precedence mới. External advice không thay Product intent,
accepted ADR, authorization, contracts, runtime/data ownership hoặc UI rules.
Xung đột external/YUTA: giữ YUTA. Xung đột giữa controlling YUTA sources:
`CONFLICT / NEEDS_REVIEW`, STOP; không dùng external tool để phân xử.

Existing UI governance giữ vai trò điều phối. Không tìm thấy canonical source
riêng có tên chính xác “Frontend UX Foundation” hoặc “Design Bible”; không
diễn giải các tên đó thành giấy phép tạo nguồn authority song song.

App có preset riêng cho ba dials, page kế thừa và ngoại lệ được review. Không
có giá trị số được chốt; gợi ý Backoffice trước đó chỉ là advisory. Preset
không thay tokens, typography, accessibility, business states hoặc page scope.

## Current Implemented State

### Repository baseline

HEAD: `defbc50eba3952fa2e7b1c016637daf083b18c65`.
Fresh path/hash baseline: `2026-09-08T14:18:45.144Z`, 2,566 file paths từ Git
tracked và untracked không bị ignore. Checkout đang dirty do công việc khác;
không lấy HEAD làm bằng chứng exact working-tree bytes.

`.agents/skills` hiện chứa generated OpenSpec skills và hai YUTA workflow
skills; chưa có UI/UX Pro Max. Không có policy/registry riêng cho provenance
của external skill được tìm thấy trong Discovery. `.gitignore` chưa có rule
riêng cho payload này. Không có existing main spec cùng capability được tìm
thấy; không sửa normative specs về Formalités, authorization hoặc Pointage.

Node `24.17.0`, pnpm `11.8.0`, npm/npx `8.14.0`, Python/Python3 `3.10.11`
đã được kiểm tra trong Discovery; `py` launcher không có. Python core search
dùng standard library/local modules theo source inspection; smoke chưa chạy.

### Published artifact versus main

Discovery quan sát npm `2.15.0`, published `2026-08-13T17:10:39.965Z`, gitHead
`a38d04c3d5c298c851dbe5e6ee1965ee3de42cb5`. Main snapshot
`4aad0584d92131626b16d4ff4d77f0455385013c` đi trước 37 commits.
Tarball SHA-256:
`50966c6c1cf99db6c9706222df6a3094e8043413e8b94a477ff8339ebc3fef52`.
Discovery xác minh digest/integrity bằng bytes trong memory, không cài/extract
payload vào repository và không chạy CLI package.

- Tarball có 196 files. Static fresh-install projection: 172 output files,
  gồm 68 core và 104 sibling files. Đây không phải kết quả chạy installer.
- Codex destination là `.agents/skills/ui-ux-pro-max/`; upstream còn tự thêm
  `banner-design`, `brand`, `design`, `design-system`, `slides`, `ui-styling`.
  Published CLI không có core-only selector.
- Published options có `--ai`, `--force`, `--offline`, `--global`, `--token`;
  không có `--dry-run`. Main đã thêm dry-run sau bản publish; không được dùng
  tính năng main như bằng chứng của npm. `--offline` không làm npm fetch offline.
- Existing skill có thể bị skip mà không báo lỗi; một số xử lý data/scripts
  dọn target không phải directory. Không thể coi mặc định upstream là đủ cho
  yêu cầu bảo vệ existing paths của YUTA.
- Package manifest nói MIT nhưng published README nói CC-BY-NC-4.0. Main
  LICENSE nói MIT; PR 486 đã sửa README trên upstream nhưng không thay bytes
  tarball 2.15.0. Bundled asset notices cần review theo exact selected payload.
- Năm release jobs gần nhất trong Discovery thất bại; job mới nhất thất bại
  tại `Run semantic-release`. Issue 457 báo vấn đề npm token; chưa kiểm tra log
  để khẳng định lỗi token là nguyên nhân của job mới nhất.
- Dependencies dùng version ranges, không có shrinkwrap; pin top-level
  version/digest chưa tự khóa toàn bộ execution dependency graph.

Chưa có installed integration, successful bootstrap, license acceptance hoặc
deployed/runtime evidence. Không suy diễn test readiness từ source inspection.

## Affected Boundaries

Agent instruction/activation và local developer tooling là boundary bị ảnh
hưởng. External content phải được coi là untrusted advisory input; không cấp
thêm quyền chạy lệnh, gửi dữ liệu hoặc sửa source. Không gửi secrets, dữ liệu
tenant/nhân sự hoặc repository content lên provider trong capability này.

Cloud/POS/Display runtime, database, tenancy, permissions và public product
visibility không thay đổi. Không có application dependency hoặc provider API.

Documentation architecture đề xuất: một external-design-intelligence policy
trong `docs/ui`, được routing từ nguồn UI/setup/workflow liên quan; không copy
dataset hoặc component catalog. Exact filenames, bootstrap representation và
activation mechanism để Design chốt. Nếu sửa workflow classification/routing,
cần đồng bộ các nguồn thực sự liên quan, gồm delivery modes; không thêm phase.
Không rewrite/reseal existing page-pack prompts hoặc sửa generated OpenSpec
skills. Canonical Product Knowledge/lifecycle không được promote bởi tooling.

## Lifecycle Baseline

Không tìm thấy Registry row riêng cho integration này; không tự tạo hay gán
năm lifecycle values. Evidence hiện có: chỉ được phép planning; integration
chưa được triển khai; môi trường cài đặt chưa được chứng minh; production
không được phép; license/provenance acceptance còn mở. Giữ nguyên mọi row và
giá trị canonical, kể cả công việc Formalités/Pointage đồng thời.

## Requirement Readiness

Có thể viết observable requirements về authority routing, core-only scope,
artifact acceptance, bounded setup, usage classification và truthful evidence
mà không chọn installer architecture hoặc tự phê duyệt license.

`REQUIRED` không có tool hợp lệ phải báo blocker, không auto-install hoặc bịa
evidence. `OPTIONAL` có thể không dùng và ghi rõ; `NOT_APPLICABLE` có lý do.
Việc phân loại cụ thể theo loại nhiệm vụ phải được review trong Specs, không
biến mọi thay đổi repository thành mandatory design-tool use.

License còn mở **chặn Apply/cài đặt**, không ngăn viết yêu cầu “chỉ sử dụng
artifact được chấp thuận”. Nếu Control Tower yêu cầu dùng ngay 2.15.0 bất chấp
mâu thuẫn, đó là thay đổi boundary và phải quay lại review trước khi tiến tiếp.

## UI / UX Applicability

`UI_AFFECTING: NO` cho delivery tooling này; không có route/UI change.
Browser QA của integration không được mặc nhiên giả lập; Design/Tasks sẽ
phân loại QA theo implementation thực tế. Các UI changes tương lai vẫn phải
tuân thủ Browser QA/page-pack gates. Heuristic output không chứng minh visual
parity, accessibility hoặc hoàn thành Gate 3.

## Conflicts and Unknowns

| ID  | Classification | Finding và điểm chặn                                                                                                                                                     |
| --- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| U1  | CONFLICT       | MIT metadata/main versus CC-BY-NC published README. Exact artifact và asset license/provenance acceptance bắt buộc trước Apply; không phê duyệt tự động.                 |
| U2  | NEEDS REVIEW   | Core-only không được upstream CLI hỗ trợ trực tiếp. Design phải chứng minh bounded payload, chống overwrite/path escape và reproducibility; không được lén cài siblings. |
| U3  | NEEDS REVIEW   | Published/main drift và transitive dependency ranges: Design review pin/manifest, nguồn artifact, upgrade/revalidation; không dùng latest hoặc automatic updates.        |
| U4  | NEEDS REVIEW   | Exact routing/activation, usage classification và evidence fields cần Specs/Design review; không để implicit skill instructions bypass YUTA authority.                   |
| U5  | NEEDS REVIEW   | App-specific numeric presets chưa chốt và nằm ngoài change; giữ inheritance/exception model, không áp một phong cách cho toàn monorepo.                                  |

Không tìm thấy requirement-level conflict giữa các controlling YUTA sources
cho bounded proposal. U1 là external acceptance gate, U2–U4 là chi tiết phải
được giải quyết ở giai đoạn tương ứng, U5 là scope exclusion; không phải quyền
bỏ qua review. Nếu bounded bootstrap không thể thỏa các điều kiện này, STOP
và quay lại Control Tower, không broaden integration.

## Analysis Conclusion

`READY_FOR_SPECS`

Chỉ `tooling/external-design-intelligence` được đề xuất đi tiếp sau Gate 1
approval; không dùng `skip_specs: true` vì có hành vi tooling mới. Sensitive
Design Gate `REQUIRED` cho supply-chain, agent activation và cross-module
durable governance. Kết luận này không xác nhận license, install readiness,
Apply hoặc production. Dừng tại Gate 1 để review exact Proposal/Analysis.
