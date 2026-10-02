# Pre-Apply Attribution Manifest

Change: `restaurant-knowledge-team-culture`

Captured: `2026-09-02T10:47:17.3804888+02:00`

Schema: `yuta-spec-driven`

Apply authorization: `GRANTED`

## Baseline provenance

- HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`
- Sorted `git status --short`: 60 entries, exact bytes stored in
  `pre-apply-baseline/git-status-short.txt`.
- Drizzle journal terminal entry:
  `0013_restaurant_knowledge_customer_experience` (`idx: 13`).
- Approved Tasks SHA-256 before checkbox updates:
  `6206c8ab42b7d60d5ae4a2ffa1c21ae7826f071be3b177ec6e6ccebe6229de05`.
- Exact baseline copies exist under `pre-apply-baseline/files/` and reproduce
  every shared-file hash with zero mismatch.

Tasks được tạo với dirty-worktree strategy nhưng không ghi historical hash của
các shared implementation file. Pre-Apply verification vì vậy dùng các
expectation đã được Tasks/Design phê duyệt: exact path/status class, journal kết
thúc ở `0013`, intended new paths còn `MISSING`, planning/gate hashes nguyên vẹn,
và current bytes được cố định trước implementation. Không có expectation nào
trong Tasks bị drift.

## Exact shared-file write allowlist

1. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
2. `packages/db-cloud/drizzle/meta/_journal.json`
3. `packages/db-cloud/test/schema.test.ts`
4. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
5. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
7. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
8. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
9. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
10. `docs/ui/pages/establishment-general-information/README.md`
11. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
12. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
13. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
14. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`

`docs/reviews/README.md` không phải write target: convention hiện tại mô tả
generic packet sequence và không duy trì per-change index. Product Knowledge và
Module Registry chỉ là read-only authority inputs trong Apply/VERIFY.

Exact allowlist bytes and lowercase hashes are stored in:

- `pre-apply-baseline/shared-file-allowlist.txt`;
- `pre-apply-baseline/shared-files.sha256`.

## Intended new paths

Mọi intended implementation, migration, test, verify, QA và Gate 3 path đã được
kiểm tra là `MISSING` trước capture. Exact list nằm trong
`pre-apply-baseline/intended-new-files.txt`. Directory
`pre-apply-baseline/` và manifest này cũng là `MISSING` trước khi task 1.1 tạo
evidence.

Không có `04-knowledge-consolidation-review.md` trong intended paths.

## Protected existing dirty-worktree baseline

Các dirty file hiện hữu ngoài shared write allowlist và ngoài `tasks.md` được
hash theo exact current bytes trong
`pre-apply-baseline/protected-existing-files.sha256`. Apply phải so sánh lại
đúng recorded path set/hash; file mới thuộc approved Team Culture allowlist
không thay đổi nghĩa vụ giữ mọi recorded existing file byte-identical.

At VERIFY, the initial capture script was found to have omitted the 11 tracked
dirty paths from that hash list while retaining all 87 untracked existing
files. The tracked paths were recovered from the immutable captured
`git-status-short.txt`. Ten had filesystem write times before this manifest's
capture. The production build had rewritten only `apps/backoffice/next-env.d.ts`;
it was restored to the exact pre-build SHA-256
`83a6738771334a63124c8acf38250eccd39fd0aba62846bb0815d952a7936205`,
also independently recorded as the restored baseline in the immediately
preceding customer-experience verification evidence. The corrected protected
manifest now covers all 98 pre-existing protected files and reproduces with
zero missing path or hash mismatch. This addendum records the capture defect
and its repair; it does not widen the Apply write scope.

Planning và approved gate packet hashes nằm trong
`pre-apply-baseline/planning-and-gates.sha256`. Proposal, Analysis, delta Spec,
Design và ba packet đã duyệt không được sửa. `tasks.md` chỉ được đổi checkbox và
evidence wording cần thiết bởi Apply workflow.

## Evidence file hashes

| Evidence                          | SHA-256                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `git-status-short.txt`            | `fb4cb3a4c8d8b091aafc38f667a6ed81fd9419faf1918551c820088cb7083a37` |
| `head.txt`                        | `0753bd3e3c20862805aed2c30efa94619a868c5658d27f0ac5a9778934030aae` |
| `intended-new-files.txt`          | `ca5ea354b6c5976e4a4656bb567f419fe68ee4fda18082268e78a9351ff0abbc` |
| `planning-and-gates.sha256`       | `506acf1df58a2ae910456d8212b954cfcf137977cec7f9327f8fcd120c3a7c2d` |
| `protected-existing-files.sha256` | `0b9cda3c0217e38444c601b2e57164837350d06c8eee16b3ba22e35cca5d517c` |
| `shared-file-allowlist.txt`       | `57ec445459e503fa4fb7e0391261f6bc20fb1bfe75ba2a5750e8760254c6643a` |
| `shared-files.sha256`             | `d011e5e012f1b2a0dcc8ceadfbd331547e3468175541e0cce33264863006be31` |

## Reproduction rules

Shared attribution phải so exact saved bytes dưới
`pre-apply-baseline/files/<repository-relative-path>` với post-Apply bytes.
Không dùng raw HEAD diff làm sole attribution và không nhận ownership toàn bộ
shared dirty file.

Commands used:

```powershell
git rev-parse HEAD
git status --short | Sort-Object
Get-FileHash -Algorithm SHA256 -LiteralPath <exact-path>
Copy-Item -LiteralPath <shared-path> -Destination <baseline-path>
```

Baseline verification result: `PASS`.
