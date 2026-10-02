# Pre-Apply Attribution Manifest

Change: `restaurant-knowledge-communication-identity`

Captured: `2026-09-02T19:29:36.7191118+02:00`

Schema: `yuta-spec-driven`

Apply authorization: `GRANTED`

## Baseline provenance

- HEAD: `01e6ca74186f5cda389f5ca8c0700274b29d18d0`.
- Sorted `git status --short`: `73` entries, exact normalized UTF-8/LF bytes
  stored in `pre-apply-baseline/git-status-short.txt`.
- Drizzle journal terminal entry:
  `0014_restaurant_knowledge_team_culture` (`idx: 14`).
- Approved Tasks SHA-256 before checkbox updates:
  `12d2dcb328d11ae146a4adc2b320a547551a1d66d8b9273deb4c8c3ca8dc67fa`.
- Exact source bytes for all shared files are preserved losslessly as Base64 in
  `pre-apply-baseline/shared-files.base64.json`; decoding all `14` entries
  reproduces `shared-files.sha256` with `0` mismatch.

## Exact shared-file write allowlist

1. `packages/db-cloud/src/schema/restaurant-knowledge.ts`
2. `packages/db-cloud/src/restaurant-knowledge-repository.ts`
3. `packages/db-cloud/test/schema.test.ts`
4. `packages/db-cloud/test/restaurant-knowledge-repository.integration.test.ts`
5. `packages/db-cloud/drizzle/meta/_journal.json`
6. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/restaurant-knowledge-loader.ts`
7. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/actions.ts`
8. `apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/page.tsx`
9. `apps/backoffice/test/restaurant-knowledge-loader.test.ts`
10. `docs/ui/pages/establishment-general-information/README.md`
11. `docs/ui/pages/establishment-general-information/PRODUCT_SCOPE.md`
12. `docs/ui/pages/establishment-general-information/DATA_AND_INTERACTION_SPEC.md`
13. `docs/ui/pages/establishment-general-information/UI_SPEC.md`
14. `docs/ui/pages/establishment-general-information/ACCEPTANCE_CHECKLIST.md`

Exact allowlist và lowercase hashes nằm trong:

- `pre-apply-baseline/shared-file-allowlist.txt`;
- `pre-apply-baseline/shared-files.sha256`;
- `pre-apply-baseline/shared-files.base64.json`.

## Intended new paths

Tất cả `23` intended implementation, migration, test, verify, QA và Gate 3
paths đã được kiểm tra là `MISSING` trước capture. Exact list nằm trong
`pre-apply-baseline/intended-new-files.txt`. Hai migration paths dự kiến là
`0015_restaurant_knowledge_communication_identity.sql` và
`meta/0015_snapshot.json`, phù hợp terminal journal `0014`.

Directory `pre-apply-baseline/` và manifest này cũng là `MISSING` trước khi
task 1.1 tạo evidence. Không có
`04-knowledge-consolidation-review.md` trong intended paths.

## Protected existing dirty-worktree baseline

`148` existing dirty files ngoài shared write allowlist và ngoài tám
planning/gate artifacts được hash theo exact current bytes trong
`pre-apply-baseline/protected-existing-files.sha256`. Tám planning/gate
artifacts được khóa riêng trong `pre-apply-baseline/planning-and-gates.sha256`.
Proposal, Analysis, delta Spec, Design và ba approved review packets phải giữ
nguyên byte. `tasks.md` chỉ được đổi Apply authorization, checkbox và evidence
wording cần thiết bởi current workflow.

Product Knowledge, Module Registry, Establishment feature knowledge và
`docs/reviews/README.md` đều nằm trong protected state và không phải Apply
write target.

## Evidence file hashes

| Evidence                          | SHA-256                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `git-status-short.txt`            | `0d3e7365ec5ef46019f2cdd95530e9b510c7f0fc9801cf79b154a99a046beda3` |
| `head.txt`                        | `0753bd3e3c20862805aed2c30efa94619a868c5658d27f0ac5a9778934030aae` |
| `intended-new-files.txt`          | `68637a14a839ee562a5798354d143abab5356634888d80b973880120d6e6dd7d` |
| `planning-and-gates.sha256`       | `b486812b15c74a039b6036d0bab9bed477d87baa628b9824665188521e8ba065` |
| `protected-existing-files.sha256` | `9fe59e7389f6ec130beb5d79a51cd445693607ac2628ef4f192cbae96d6e3e6b` |
| `shared-file-allowlist.txt`       | `38ad83d895e835b59c99c4222faadce208faa6473424f7ef3bfa24c7d3b09140` |
| `shared-files.base64.json`        | `73673ff5c79981fdf7de66e83ef5cca838a223414484db87bbcc36828e0f3302` |
| `shared-files.sha256`             | `43b20fb03b7bf1eddb816a31b7828a7ffae159ed778a011e8a06590cdc0f8807` |

## Reproduction rules

Shared attribution phải decode exact baseline bytes từ
`shared-files.base64.json` rồi so với post-Apply bytes. Không dùng raw HEAD
diff làm sole attribution và không nhận ownership toàn bộ shared dirty file.

Capture/verification commands:

```powershell
git rev-parse HEAD
git status --short | Sort-Object
git ls-files --modified --others --exclude-standard | Sort-Object
Get-FileHash -Algorithm SHA256 -LiteralPath <exact-path>
[Convert]::ToBase64String([IO.File]::ReadAllBytes(<shared-path>))
[Convert]::FromBase64String(<recorded-base64>)
```

Baseline verification result: `PASS`.
