## Purpose

Thiết lập contract validation formatting theo authority và class của artifact, bảo đảm coverage đầy đủ, kiểm tra thay thế bắt buộc và bảo toàn integrity khi migration repository baseline.

## ADDED Requirements

### Requirement: R1 Phân loại artifact đầy đủ và fail-closed

Repository validation SHALL phân loại mọi artifact tham gia phạm vi repository formatting validation bằng admission evidence hiện hành, owner hoặc policy authority và nghĩa vụ validation xác định. Sáu class được nhận diện là `MUTABLE_FORMATTED`, `GENERATED_EXTERNAL_OR_DERIVED`, `HISTORICAL_HASH_BOUND`, `ARCHIVED_PRESERVED`, `ACTIVE_CHANGE_OWNED` và `NORMATIVE_REVIEW_REQUIRED`. `UNCLASSIFIED`, classification thiếu hoặc stale, hay overlap chưa giải quyết SHALL làm overall validation FAIL. Một artifact SHALL NOT bị bỏ qua cả mutable formatting lẫn alternate validation; class không tự cấp quyền sửa file. Admission và chuyển class SHALL giữ các nghĩa vụ authority/integrity còn áp dụng, không dùng tên đường dẫn hoặc lỗi formatter làm bằng chứng miễn kiểm tra.

Trong class `GENERATED_EXTERNAL_OR_DERIVED`, validation SHALL phân biệt `REPRODUCIBLE_GENERATED_ARTIFACT` theo R4 với `TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA` theo R4L bằng accepted tool authority và admission evidence. Hai subclass SHALL nằm ngoài mutable-format scope; không subclass nào cho phép manual formatting. Historical journal copy SHALL được nhận diện riêng theo historical provenance và R5, không nhận live-metadata authority chỉ vì cùng filename. Subclass thiếu, mơ hồ hoặc không có accepted authority SHALL làm overall validation FAIL; `.prettierignore` không tạo admission.

#### Scenario: R1.1 Mutable artifact có authority

- **WHEN** artifact được phân loại hiện hành là mutable với owner xác định
- **THEN** validation SHALL đưa artifact vào mutable-format checking và báo class cùng owner

#### Scenario: R1.2 Generated artifact có admission evidence

- **WHEN** artifact có source/generator authority và accepted subclass REPRODUCIBLE_GENERATED_ARTIFACT
- **THEN** validation SHALL áp dụng nghĩa vụ reproducibility của R4 thay vì yêu cầu hand-format output

#### Scenario: R1.3 Historical artifact được nhận diện tường minh

- **WHEN** historical/hash-bound artifact có admission evidence và owner hợp lệ
- **THEN** artifact SHALL nằm ngoài mutable-format scope nhưng bắt buộc chịu preservation validation của R5

#### Scenario: R1.4 Archived provenance được nhận diện tường minh

- **WHEN** artifact được admitted là archived provenance với owner và historical identity
- **THEN** validation SHALL áp dụng exact-byte preservation của R6

#### Scenario: R1.5 Active artifact thuộc owner hiện hành

- **WHEN** artifact đang thuộc active change với owner và lifecycle binding hiện hành
- **THEN** validation SHALL giữ owner control của R7, không suy ra formatting exemption chỉ từ trạng thái active

#### Scenario: R1.6 Normative artifact yêu cầu review

- **WHEN** artifact là normative spec hoặc schema/template thuộc authority đã xác định
- **THEN** validation SHALL áp dụng review/equivalence obligations của R8, không coi là ordinary mutable document

#### Scenario: R1.7 Artifact chưa phân loại

- **WHEN** có artifact trong validation scope chưa có classification hợp lệ
- **THEN** overall validation SHALL FAIL với artifact identity và missing-classification reason, không silently exclude

#### Scenario: R1.8 Classification stale

- **WHEN** classification không còn khớp owner, lifecycle hoặc authority hiện hành
- **THEN** overall validation SHALL FAIL vì stale classification, không tự cập nhật baseline

#### Scenario: R1.9 Overlap chưa giải quyết

- **WHEN** các classification áp dụng cho cùng artifact tạo nghĩa vụ mâu thuẫn chưa được authority giải quyết
- **THEN** overall validation SHALL FAIL và yêu cầu review, không chọn class ít kiểm tra hơn để PASS

#### Scenario: R1.10 Live metadata có accepted tool authority

- **WHEN** live migration metadata có admission evidence hiện hành cho tool-owned nondeterministic contract
- **THEN** validation SHALL giữ class GENERATED_EXTERNAL_OR_DERIVED và áp dụng R4L, không áp dụng mutable formatting hoặc yêu cầu tái tạo UUID/timestamp bytes

#### Scenario: R1.11 Generated subclass chưa được xác định

- **WHEN** generated artifact không có accepted validation contract hoặc bị gán đồng thời hai subclass mâu thuẫn
- **THEN** overall validation SHALL FAIL và yêu cầu authority review, không chọn live-metadata contract để tránh reproducibility của R4

### Requirement: R2 Mutable formatting được thực thi

Artifact thuộc mutable-format scope SHALL được kiểm tra bằng repository formatting policy hiện hành. Bất kỳ mutable formatting failure nào SHALL làm overall validation FAIL. Artifact SHALL NOT bị loại khỏi scope chỉ vì hiện tại không đạt Prettier; thay đổi classification cần authority và admission evidence độc lập với formatter result.

#### Scenario: R2.1 Mutable formatting hợp lệ

- **WHEN** mutable artifact đạt formatting policy hiện hành
- **THEN** mutable check SHALL báo PASS cho artifact đó, không thay thế các kiểm tra bắt buộc khác

#### Scenario: R2.2 Mutable formatting thất bại

- **WHEN** một mutable artifact không đạt formatting policy
- **THEN** overall validation SHALL FAIL và chỉ rõ artifact thất bại

#### Scenario: R2.3 Loại file chỉ để bỏ lỗi

- **WHEN** đề xuất bỏ một mutable artifact khỏi format scope chỉ dựa trên Prettier failure
- **THEN** validation SHALL từ chối exclusion đó và không báo overall PASS

### Requirement: R3 Alternate validation bắt buộc

Mọi artifact không được mutable-format checking SHALL có alternate validator phù hợp với class và tham gia overall result. Mọi non-mutable-format class SHALL có nghĩa vụ validation tường minh; active/normative authority checks vẫn bắt buộc khi formatting cũng áp dụng. Missing validator, unresolved artifact identity, stale validator configuration hoặc alternate validation failure SHALL làm overall validation FAIL, kể cả mutable checks đều PASS.

#### Scenario: R3.1 Thiếu alternate validator

- **WHEN** artifact bị loại khỏi mutable-format checking nhưng không có mandatory alternate validator
- **THEN** overall validation SHALL FAIL vì coverage thiếu

#### Scenario: R3.2 Không resolve được identity

- **WHEN** alternate validator không xác định được exact artifact identity cần kiểm tra
- **THEN** overall validation SHALL FAIL, không coi artifact là absent khỏi scope

#### Scenario: R3.3 Validator configuration stale

- **WHEN** validator configuration không còn tương ứng class/authority binding được review
- **THEN** overall validation SHALL FAIL và báo stale binding

#### Scenario: R3.4 Alternate validator thất bại

- **WHEN** mandatory alternate validator thất bại dù mutable checks PASS
- **THEN** overall validation SHALL FAIL, giữ nguyên failure reason của alternate check

### Requirement: R4 Generated authority và reproducibility

R4 và toàn bộ scenarios R4.1–R4.12 SHALL áp dụng cho subclass `REPRODUCIBLE_GENERATED_ARTIFACT`, bao gồm generated OpenSpec skills hiện hữu; live migration metadata có accepted contract riêng theo R4L không thuộc reproducibility scope này. Reproducible generated artifacts SHALL nằm ngoài mutable-format scope với mandatory reproducibility validation gắn known generator/source authority, generator/tool version hoặc equivalent identity, và expected inventory. Manual formatting/patching generated output SHALL NOT là remediation hợp lệ. Reproducibility chưa chứng minh SHALL được báo UNKNOWN hoặc unresolved deviation và SHALL NOT được tính là PASS. Reviewed deviation SHALL được phân biệt với unexplained deviation nhưng approval của deviation tự nó SHALL NOT thay thế chứng minh reproducibility trên approved generation scope. Đổi generator/source/version hoặc pipeline cần review riêng; contract này không tự cho phép regeneration hay chấp nhận byte mới.

Current reproduction SHALL prove the artifact's own explicitly approved current generation identity, independently of historical preservation identity under R5. Admission SHALL require approved renderer identity, controlled generation, captured candidate output set, independent review, explicit output identity approval and proven reproducibility, in that order. Historical/current byte equality SHALL be required only by a separate explicit approved requirement, not inferred from preservation. This separation SHALL NOT create a waiver, semantic-only validation or automatic historical reclassification.

#### Scenario: R4.1 Exact generation được chứng minh

- **WHEN** approved generator/source/version tái tạo đúng exact output bytes và expected inventory
- **THEN** generated validation SHALL báo reproducibility PASS cho đúng scope đã kiểm tra

#### Scenario: R4.2 Unexplained generated deviation

- **WHEN** output khác generation evidence và full-pipeline comparison chưa giải thích được khác biệt
- **THEN** validation SHALL giữ reproducibility chưa chứng minh và overall FAIL, không suy diễn PASS từ generated label

#### Scenario: R4.3 Generator version drift

- **WHEN** generator/tool identity hiện hành khác identity đã review
- **THEN** generated validation SHALL FAIL vì stale binding và yêu cầu review trước khi chấp nhận generation mới

#### Scenario: R4.4 Thiếu generated artifact

- **WHEN** một artifact thuộc expected generated inventory không tồn tại
- **THEN** generated validation SHALL FAIL với missing identity

#### Scenario: R4.5 Generated artifact ngoài inventory

- **WHEN** generation scope chứa output không thuộc expected inventory đã review
- **THEN** generated validation SHALL FAIL với unexpected identity, không tự mở rộng inventory

#### Scenario: R4.6 Manual edit hoặc formatter drift

- **WHEN** generated bytes bị manual edit hoặc formatter rewrite khác approved reproducible output
- **THEN** generated validation SHALL FAIL và không chấp nhận hand-format làm cách khôi phục authority

#### Scenario: R4.7 Reviewed deviation chưa có reproducibility

- **WHEN** deviation được review nhưng chưa có evidence tái tạo approved output bằng approved generation scope
- **THEN** evidence SHALL giữ reviewed-deviation status riêng, reproducibility SHALL NOT PASS và overall validation SHALL FAIL

#### Scenario: R4.8 Separate current generation identity

- **WHEN** current generated artifacts are submitted for admission
- **THEN** validation SHALL require a separately reviewed generation identity binding source, inputs, runtime, supply, font where applicable, output inventory and exact output identities; historical approval SHALL NOT supply that approval

#### Scenario: R4.9 Stable candidate without output approval

- **WHEN** repeated generation produces stable candidate bytes but independent output review and explicit output identity approval are missing
- **THEN** generated admission SHALL remain invalid and reproducibility acceptance SHALL NOT PASS solely from candidate stability

#### Scenario: R4.10 Current generation dependency drift

- **WHEN** source, input, runtime, supply, font or repertoire differs from the approved current generation binding
- **THEN** current generated validation SHALL FAIL for the affected binding, even when output bytes happen to match; it SHALL NOT fall back to historical validation

#### Scenario: R4.11 No inherited historical equivalence

- **WHEN** current bytes are semantically similar to historical bytes or differ from them under a separately approved current generation identity
- **THEN** current reproduction SHALL compare against its own approved exact bytes and inventory, SHALL NOT inherit historical approval, and SHALL NOT claim historical reproduction or replace historical artifacts

#### Scenario: R4.12 Failed reproduction cannot create historical admission

- **WHEN** current reproduction fails or an original generation environment cannot be reconstructed
- **THEN** the artifact SHALL NOT automatically become historical, receive admission, change validator or obtain a waiver; explicit reviewed classification and the corresponding validation obligations remain mandatory

### Requirement: R4L Live migration metadata thuộc migration tooling

Live migration metadata được admitted là `TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA` SHALL giữ class `GENERATED_EXTERNAL_OR_DERIVED`, authority `MIGRATION_TOOLING_OWNED` và mutation path `AUTHORIZED_MIGRATION_TOOLING_ONLY`. Contract validation SHALL là `SEMANTIC_AND_CHAIN_INTEGRITY_VALIDATION`, ngoài mutable Prettier scope. Exact regeneration SHALL NOT là điều kiện PASS cho subclass này; UUID/timestamp nondeterministic SHALL NOT bị yêu cầu tái tạo. Manual Prettier formatting và direct human edit SHALL bị cấm mặc định; tool ownership không tự cấp mutation authorization.

Validation SHALL bind known migration tool/source, current reviewed tool/version identity và expected inventory/path membership. Theo semantics được current tool contract hỗ trợ, validation SHALL kiểm tra parse/structure validity, migration ordering, journal integrity, snapshot/migration/journal linkage, absence of dangling references hoặc duplicate/missing migration identity, và sự tồn tại của referenced migration artifacts. Applicable migration-tool native validation SHALL có current PASS; native check thiếu, bị skip hoặc không hoàn tất SHALL NOT được báo PASS. Coverage gap chưa có accepted validation SHALL làm overall validation FAIL, không bỏ nghĩa vụ chỉ vì thiếu native check. Validation SHALL ưu tiên native tool contract, existing repository checks rồi bounded structural/reference coverage cho gap được xác định; SHALL NOT tự diễn giải lại migration-domain semantics do tool sở hữu.

Live journals SHALL theo `TOOL_OWNED_APPEND_OR_TOOL_UPDATE`, không giả định chỉ append nếu tool contract cho phép update. Historical journal copies SHALL giữ historical provenance, exact-byte preservation theo R5 và correction bằng new record/revision giữ original; live và historical authority SHALL NOT thay thế lẫn nhau.

Reviewed exact path/byte identity SHALL được bảo toàn tới authorized tooling mutation. Một legitimate tool-generated change SHALL NOT tự bị kết luận tampering, nhưng changed state SHALL giữ awaiting reviewed identity và overall validation SHALL FAIL tới khi exact new tool-generated state được review và mọi applicable check PASS. Authorization để mutate SHALL NOT tự duyệt output hoặc rebaseline. Unexplained/manual mutation SHALL được báo riêng và ngăn acceptance, kể cả structure/native checks PASS. Stale tool/owner/inventory/identity SHALL FAIL; không silent rebaseline, auto-repair hoặc regeneration trong validation. Contract này không cấp quyền chạy migration hay sửa metadata.

#### Scenario: R4L.1 Reviewed live metadata hợp lệ

- **WHEN** admitted live metadata khớp reviewed identity/tool/inventory, applicable native validation PASS và mọi applicable structure/chain/reference check PASS
- **THEN** live-metadata validation SHALL PASS mà không yêu cầu UUID/timestamp bytes tái tạo hoặc manual formatting; result SHALL NOT được ghi thành reproducibility PASS của R4

#### Scenario: R4L.2 Parse hoặc structure không hợp lệ

- **WHEN** live metadata không parse được hoặc vi phạm structure của current migration-tool contract
- **THEN** validation SHALL FAIL với affected identity và native/structure reason, không sửa metadata

#### Scenario: R4L.3 Ordering hoặc journal integrity sai

- **WHEN** migration ordering hoặc journal entries vi phạm current tool contract, gồm duplicate/missing migration identity
- **THEN** validation SHALL FAIL với affected journal/migration identity, không tự sắp xếp hoặc viết lại entries

#### Scenario: R4L.4 Linkage hoặc reference không hợp lệ

- **WHEN** snapshot/migration/journal relationship vi phạm tool contract, có dangling reference hoặc referenced migration artifact không tồn tại
- **THEN** validation SHALL FAIL và chỉ rõ relationship/artifact thiếu, không dựng snapshot hoặc migration thay thế

#### Scenario: R4L.5 Expected inventory bị thiếu hoặc có artifact mới

- **WHEN** expected live-metadata path bị thiếu hoặc xuất hiện output ngoài reviewed inventory
- **THEN** validation SHALL FAIL vì missing/unexpected identity, không silently shrink hoặc mở rộng baseline

#### Scenario: R4L.6 Native validation không PASS

- **WHEN** applicable native validation FAIL, không khả dụng, bị skip hoặc không hoàn tất
- **THEN** overall validation SHALL FAIL và báo đúng failure/missing evidence; structural-only success SHALL NOT thay native PASS bắt buộc

#### Scenario: R4L.7 Tool owner hoặc version binding stale

- **WHEN** tool/source/version hoặc owner hiện hành khác reviewed authority binding
- **THEN** validation SHALL FAIL và yêu cầu review riêng, không tự nhận tool-generated bytes theo binding cũ

#### Scenario: R4L.8 Authorized tool mutation đang chờ review

- **WHEN** authorized tooling tạo legitimate new metadata state nhưng exact new identity chưa được review
- **THEN** validation SHALL phân biệt awaiting reviewed identity với tampering và giữ overall FAIL, dù native/chain checks PASS

#### Scenario: R4L.9 Exact tool-generated state được review

- **WHEN** exact state từ authorized tooling mutation được duyệt với new identity/inventory và mọi applicable validation PASS
- **THEN** validation SHALL chấp nhận reviewed new identity với attribution riêng, không gán bytes mới vào approval cũ hoặc tự cấp quyền mutation tiếp theo

#### Scenario: R4L.10 Manual mutation hoặc formatter rewrite

- **WHEN** reviewed metadata có unexplained manual edit, formatter rewrite hoặc manual edit trộn với authorized tool output
- **THEN** validation SHALL FAIL và surface mutation cần review, không hợp thức hóa bằng native PASS hoặc hash rebaseline

#### Scenario: R4L.11 Tool-owned journal update

- **WHEN** authorized tool append hoặc tool-update journal theo current native contract
- **THEN** validation SHALL kiểm tra changed state theo native semantics và reviewed-identity transition, không tự kết luận mọi non-append change là tampering hoặc tự chấp nhận baseline mới

#### Scenario: R4L.12 Historical journal copy được giữ nguyên

- **WHEN** journal copy có historical admission và exact approved path/bytes/reference binding còn nguyên
- **THEN** validation SHALL áp dụng R5 exact-byte preservation; correction SHALL là approved new record/revision giữ original, không refresh copy từ live journal

#### Scenario: R4L.13 Confusion giữa live và historical journal

- **WHEN** live journal bị gán historical-copy contract hoặc historical copy bị gán live-tool mutation contract trái admission provenance
- **THEN** classification/validation SHALL FAIL, không dùng filename hoặc shared ignore rule để thay authority

#### Scenario: R4L.14 Partial tooling state

- **WHEN** tooling chỉ hoàn tất một phần và journal/snapshot/migration set không thỏa expected relationship/inventory của current tool contract
- **THEN** validation SHALL FAIL với incomplete-state evidence, không auto-repair hoặc chạy generation để tạo PASS

#### Scenario: R4L.15 Native coverage gap chưa được xử lý

- **WHEN** native/repository checks không bao phủ một applicable integrity obligation và chưa có accepted bounded gap validation
- **THEN** overall validation SHALL FAIL với exact uncovered obligation, không silently skip hoặc tạo migration-domain semantics mới

### Requirement: R5 Historical và hash-bound preservation

Historical/hash-bound admission SHALL có evidence, exact path/byte identity và owner tường minh; incidental hash reference không tự đủ admission. Artifact admitted SHALL nằm ngoài mutable-format scope và SHALL bảo toàn approved historical identity cùng reference integrity. Silent byte rewrite giữ approval identity cũ SHALL FAIL. Correction SHALL dùng explicitly approved revision/new-record path giữ original bytes và approval meaning cũ, không cấp general historical-rebind migration.

Historical preservation SHALL bind exact path, raw bytes and raw SHA-256, reviewed owner, historical role, reference integrity and historical closure identity. Preservation SHALL NOT require reconstruction merely to establish preservation unless a separate approved requirement explicitly requires it. Historical admission SHALL require explicit reviewed classification and SHALL NOT confer current generated-artifact admission. Original evidence and failed reconstruction records SHALL remain unchanged; current output approval SHALL NOT retroactively revise historical results.

#### Scenario: R5.1 Original exact bytes được giữ

- **WHEN** historical artifact tồn tại với exact approved path/bytes và reference binding hợp lệ
- **THEN** preservation validation SHALL PASS mà không yêu cầu reformat original

#### Scenario: R5.2 Byte thay đổi không có revision

- **WHEN** historical bytes thay đổi nhưng vẫn dùng approval identity cũ
- **THEN** preservation validation SHALL FAIL, không thay hash cũ để hợp thức hóa bytes mới

#### Scenario: R5.3 Historical artifact bị thiếu

- **WHEN** approved historical path không tồn tại
- **THEN** preservation validation SHALL FAIL với missing artifact reason

#### Scenario: R5.4 Hash identity stale

- **WHEN** preservation binding hoặc approval reference không còn khớp historical identity được duyệt
- **THEN** preservation validation SHALL FAIL vì stale identity dù file hiện tại đạt formatter

#### Scenario: R5.5 Correction bằng approved revision

- **WHEN** owner duyệt exact new revision/record và original cùng historical approval vẫn nguyên vẹn
- **THEN** validation SHALL nhận diện riêng revision mới theo approval của nó và tiếp tục kiểm tra original theo binding cũ

#### Scenario: R5.6 Preservation without reconstructable runtime

- **WHEN** explicitly admitted historical artifacts retain exact reviewed paths, raw bytes, raw hashes, owner, historical role, reference integrity and closure identity but their original generation environment is not reconstructable
- **THEN** preservation SHALL be evaluated independently and MAY PASS without regeneration proof; this SHALL NOT grant current generated admission or change any historical failed reproduction result

#### Scenario: R5.7 Explicit historical classification required

- **WHEN** an artifact is proposed as historical based only on age, version-directory naming, reproduction failure or semantic similarity
- **THEN** historical admission SHALL FAIL without explicit reviewed classification, owner, role and exact identity/reference evidence

#### Scenario: R5.8 No historical replacement

- **WHEN** new renderer output or a new manifest is offered as a replacement for an admitted historical artifact
- **THEN** preservation SHALL reject replacement and preserve the original exact path, bytes, hash and approval meaning; any separately approved current identity SHALL remain distinct

#### Scenario: R5.9 Historical reference or path drift

- **WHEN** an admitted historical path, reference binding or closure identity changes, even if another file retains identical content
- **THEN** historical preservation SHALL FAIL; no automatic rebaseline or current-generation fallback is allowed

#### Scenario: R5.10 V-FIX historical truth and complete set

- **WHEN** the amended V-FIX obligations are evaluated
- **THEN** all 122 existing reviewed outputs SHALL retain their historical exact identities independently of version-directory names; historical Task 3.2 FAIL, 91/122 exact matches, 30 PDF and one derived manifest mismatch, unresolved reconstruction and unknown historical font/runtime SHALL remain historical truth and SHALL NOT be relabeled PASS by current renderer success

### Requirement: R6 Archived provenance preservation

Chỉ artifact có evidence-backed admission, owner và approved historical identity mới SHALL được coi là `ARCHIVED_PRESERVED`. Với admitted record, policy SHALL là `EXACT_BYTE_PRESERVATION_BY_DEFAULT`; correction SHALL là append/new revision không sửa bytes của original admitted record. Silent archive rewrite SHALL bị cấm. Tên hoặc vị trí dưới `docs/archive` SHALL NOT tự tạo admission, immutability hoặc exclusion khỏi validation.

#### Scenario: R6.1 Archive được giữ nguyên

- **WHEN** admitted archive record khớp exact approved identity
- **THEN** archive preservation SHALL PASS mà không yêu cầu mutable formatting

#### Scenario: R6.2 Archive content drift

- **WHEN** bytes của admitted archive record khác preservation binding
- **THEN** archive validation SHALL FAIL và giữ historical binding để review

#### Scenario: R6.3 Archive bị thiếu

- **WHEN** admitted archive record không còn ở approved path
- **THEN** archive validation SHALL FAIL, không silently shrink inventory

#### Scenario: R6.4 Correction là new record

- **WHEN** correction được owner duyệt thành record/revision bổ sung, original admitted record giữ exact bytes
- **THEN** validation SHALL kiểm tra original và correction bằng identity riêng, không gán correction vào approval cũ

#### Scenario: R6.5 Rewrite original archive

- **WHEN** hygiene correction đề nghị viết lại original admitted record để làm nó current hoặc format-clean
- **THEN** validation SHALL từ chối rewrite đó theo correction model và không báo preservation PASS

#### Scenario: R6.6 Arbitrary archive-directory path

- **WHEN** một file dưới `docs/archive` không có archived-provenance admission evidence
- **THEN** validation SHALL NOT tự nhận file là immutable/exempt; nếu chưa có classification hợp lệ khác, overall result SHALL FAIL

### Requirement: R7 Active change ownership

Active-change-owned artifacts SHALL giữ quyền kiểm soát của active owner và current review/lifecycle bindings. Hygiene tooling SHALL NOT mutate artifact nếu chưa có explicit owner coordination/authorization cho exact revision. Entry/exit classification SHALL tuân theo approved lifecycle và giữ historical evidence; passing checks hoặc path move không tự chuyển ownership. Khi coordination chưa có, affected remediation SHALL giữ `WAIT_FOR_OWNER`, không suy ra approval từ technical PASS.

#### Scenario: R7.1 Active owner giữ artifact

- **WHEN** active owner chưa cho phép hygiene revision
- **THEN** artifact SHALL giữ nguyên, affected remediation SHALL báo WAIT_FOR_OWNER và không claim completion nhờ bỏ kiểm tra

#### Scenario: R7.2 Owner-authorized revision

- **WHEN** owner duyệt exact path/preimage/revision trong lifecycle hiện hành
- **THEN** validation SHALL kiểm tra revision theo approval mới và giữ lịch sử cũ, không tái sử dụng stale approval

#### Scenario: R7.3 Hygiene mutation không có approval

- **WHEN** hygiene work sửa active artifact ngoài owner authorization
- **THEN** ownership/integrity validation SHALL FAIL dù formatting PASS

#### Scenario: R7.4 Approved lifecycle exit

- **WHEN** artifact rời active state qua approved lifecycle transition
- **THEN** classification SHALL được review theo owner/authority mới, giữ lịch sử và mandatory validation coverage; không auto-exempt hoặc auto-mutate

### Requirement: R8 Normative review và semantic equivalence

Normative specs/schema/templates SHALL NOT được xử lý như ordinary mutable docs. Formatting mutation SHALL cần explicit owner approval gắn exact path, preimage và exact diff; parsed requirement/scenario meaning equivalence khi áp dụng; schema/template structural equivalence khi áp dụng; và strict validation phù hợp. Thiếu hoặc fail bất kỳ nghĩa vụ áp dụng nào SHALL ngăn acceptance. Formatting alone SHALL NOT đổi normative behavior, approval meaning hay lifecycle/readiness.

#### Scenario: R8.1 Exact approved equivalent change

- **WHEN** exact path/preimage/diff được owner duyệt, applicable semantic/structural equivalence và strict validation đều PASS
- **THEN** validation SHALL chấp nhận bounded formatting revision, không cấp quyền sửa ngoài diff

#### Scenario: R8.2 Missing approval hoặc preimage drift

- **WHEN** thiếu exact owner-approved diff hoặc path/preimage không còn khớp
- **THEN** affected mutation SHALL dừng và normative validation SHALL FAIL

#### Scenario: R8.3 Parsed requirement hoặc scenario thay đổi nghĩa

- **WHEN** formatting candidate làm đổi requirement/scenario meaning dù formatter PASS
- **THEN** equivalence validation SHALL FAIL và yêu cầu behavioral review, không coi là formatting-only

#### Scenario: R8.4 Structural hoặc strict validation thất bại

- **WHEN** applicable schema/template structure không tương đương hoặc strict validation không PASS
- **THEN** normative validation SHALL FAIL và không chấp nhận revision

#### Scenario: R8.5 Không lifecycle promotion

- **WHEN** normative formatting revision đạt mọi check áp dụng
- **THEN** lifecycle/readiness và production status SHALL giữ nguyên, không suy ra implementation/deployment completion

### Requirement: R9 Exact reviewed baseline migration

Initial migration SHALL bind đúng reviewed 67-file baseline bằng exact path/hash và current owner/status trước mutation. Mọi path SHALL giữ exact baseline tới khi có separate review cho bounded revision. Drift, missing/unexpected baseline member hoặc owner/status change SHALL dừng affected migration; wildcard rebaseline và auto-rebaseline SHALL bị cấm. Approved subset không miễn kiểm tra phần còn lại hay mở rộng scope. Các số lượng class trong migration evidence không SHALL trở thành giới hạn phân loại lâu dài; artifact mới vẫn chịu R1.

#### Scenario: R9.1 Exact baseline match

- **WHEN** toàn bộ reviewed 67 paths/hashes và owner/status vẫn khớp
- **THEN** migration precheck SHALL PASS nhưng SHALL NOT tự cấp mutation authorization

#### Scenario: R9.2 Một file drift

- **WHEN** một baseline file khác exact reviewed hash trước mutation
- **THEN** affected migration SHALL STOP và báo expected/current identity, không tự rebaseline

#### Scenario: R9.3 Baseline member missing

- **WHEN** một reviewed baseline path bị thiếu
- **THEN** affected migration SHALL STOP, không giảm baseline size để PASS

#### Scenario: R9.4 Unexpected baseline member

- **WHEN** migration candidate có thêm path ngoài reviewed baseline
- **THEN** affected migration SHALL STOP, không tự nhập file mới vào authorization; repository artifact mới vẫn cần classification đầy đủ

#### Scenario: R9.5 Owner hoặc status đổi

- **WHEN** baseline bytes không đổi nhưng owner/status binding đã thay đổi
- **THEN** affected migration SHALL STOP cho owner/lifecycle review trước mutation

#### Scenario: R9.6 Approved subset remediation

- **WHEN** exact subset có separate owner approval, preimages khớp và class obligations được đáp ứng
- **THEN** remediation SHALL chỉ áp dụng subset đó, giữ nguyên phần chưa được duyệt và SHALL NOT claim toàn baseline hoàn thành khi checks còn thiếu

### Requirement: R10 Mandatory validation orchestration

Repository-level formatting validation entry contract SHALL tổng hợp mutable formatting, classification completeness, reproducibility theo R4 khi áp dụng, semantic/chain integrity theo R4L khi áp dụng và mọi mandatory alternate validator khác theo fail-closed semantics. Overall PASS SHALL chỉ có khi tất cả applicable obligations có current successful evidence. Excluded artifact SHALL NOT có đường đi tới overall PASS nếu alternate validation không thực sự tham gia. Missing/skipped/incomplete required check SHALL NOT tương đương PASS. Contract không chọn command topology, manifest representation hoặc implementation location.

#### Scenario: R10.1 Tất cả obligations PASS

- **WHEN** classification đầy đủ, mutable checks và mọi applicable alternate check đều có current PASS
- **THEN** entry contract SHALL trả overall PASS với coverage evidence tương ứng

#### Scenario: R10.2 Một obligation FAIL

- **WHEN** một required obligation FAIL dù các checks khác PASS
- **THEN** entry contract SHALL trả overall FAIL và giữ nguyên failed obligation

#### Scenario: R10.3 Bỏ alternate check

- **WHEN** artifact bị excluded khỏi mutable checking và required alternate check bị skip, không chạy hoặc chưa hoàn tất
- **THEN** entry contract SHALL FAIL, không dùng mutable-only PASS làm overall result

#### Scenario: R10.4 Hai generated contracts cùng tham gia

- **WHEN** repository có cả reproducible generated artifacts và admitted tool-owned live metadata
- **THEN** overall PASS SHALL cần current R4 reproducibility PASS và R4L semantic/chain integrity PASS cho đúng scope, cùng mutable và mọi alternate obligation khác

#### Scenario: R10.5 Generated exclusion không thay validation

- **WHEN** generated artifact được exclude khỏi Prettier nhưng applicable R4 hoặc R4L contract chưa PASS
- **THEN** overall validation SHALL FAIL, không dùng exclusion hay PASS của generated subclass khác thay nghĩa vụ còn thiếu

### Requirement: R11 Deterministic audit evidence

Validation SHALL cung cấp deterministic evidence đủ để đối chiếu artifact identity, class, owner/policy authority, validator áp dụng và pass/fail reason, gồm missing/stale classification và unexpected drift. Cùng artifact state, authority/configuration bindings và check results SHALL cho cùng logical evidence; incidental run metadata không SHALL che khác biệt validation. Evidence SHALL NOT yêu cầu lộ secrets hoặc private configuration content.

#### Scenario: R11.1 Cùng inputs cùng logical evidence

- **WHEN** hai validation runs có cùng artifact state, authority bindings và check results
- **THEN** logical evidence SHALL đối chiếu tương đương cho identity/class/owner/validator/reason, không phụ thuộc thứ tự phát hiện artifact

#### Scenario: R11.2 Missing stale và drift có attribution

- **WHEN** validation phát hiện missing classification, stale binding hoặc unexpected drift
- **THEN** evidence SHALL chỉ rõ artifact liên quan và failure category để reviewer phân biệt, không chỉ báo generic PASS/FAIL

#### Scenario: R11.3 Không lộ private configuration

- **WHEN** failure liên quan configuration chứa private hoặc secret content
- **THEN** evidence SHALL báo safe identity/reason đủ review mà không in secret/private contents

### Requirement: R12 Parent hold và historical failure truth

Parent `ui-ux-pro-max-integration` task 6.1 SHALL giữ blocked cho tới khi approved repository formatting validation contract thực sự PASS trên migrated repository state. Historical failed commands SHALL giữ nguyên failed outcomes; không retroactive PASS. PASS của prerequisite SHALL chỉ là evidence cho separate authorized parent continuation, không tự check task, tiến task 6.2–6.4, đổi receipt, hoặc promote lifecycle/readiness/production.

#### Scenario: R12.1 Prerequisite chưa đạt

- **WHEN** contract chưa được approve/migrate hoặc current aggregate validation chưa PASS
- **THEN** parent task 6.1 SHALL giữ FAIL/UNCHECKED và blocked, không tiến parent nhờ Specs hay formatting subset PASS

#### Scenario: R12.2 Prerequisite đạt nhưng chưa có parent authorization

- **WHEN** approved contract PASS trên migrated state nhưng chưa có separate parent continuation authorization
- **THEN** evidence SHALL được dùng để request continuation, parent progression SHALL NOT tự xảy ra

#### Scenario: R12.3 Historical failure vẫn là failure

- **WHEN** một fresh validation run PASS sau remediation
- **THEN** historical parent failures SHALL giữ nguyên kết quả cũ và fresh result SHALL được phân biệt, không rewrite lịch sử thành PASS

## Non-goals

Không bao gồm UI/Product behavior, runtime/auth/database changes, blanket `.prettierignore` exclusion, arbitrary hash rebasing, silent historical evidence rewriting, hand-format generated output, automatic active-owner mutation, lifecycle/readiness promotion, parent task progression trong change này hoặc production action. Specs không chỉ định manifest filename/location, data structure, validator implementation, orchestration topology hay migration script. Sensitive Design vẫn bắt buộc sau Gate 2 approval; Specs không cấp Apply authority.

## Migration context

Reviewed discovery baseline có 67 files: 9 generated, 3 active-change, 5 normative/schema, 24 historical/hash-bound, 22 archived policy group, 4 current mutable docs. Đây là migration evidence, không phải permanent repository class limits hoặc automatic admission. Historical evidence chỉ có 1 exact pure-generation match; 8 generated outputs chưa được full-pipeline comparison giải thích. Không claim 9/9 reproducibility. Known async-feedback overlap giữ WAIT_FOR_OWNER. Parent giữ 19/23, task 6.1 FAIL/UNCHECKED, 6.2–6.4 BLOCKED, receipt VERIFIED, Production NOT_AUTHORIZED.
