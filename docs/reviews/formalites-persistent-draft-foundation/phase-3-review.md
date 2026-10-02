# Formalités Persistent Draft Foundation — Phase 3 Review

Review status: `AWAITING_HUMAN_REVIEW`

Change: `formalites-persistent-draft-foundation`

Apply scope: `PHASE 3 — UI / COMPONENTS ONLY`

Tasks: `3.1`–`3.7` COMPLETE; `23/31` total tasks complete

Browser QA: `NOT RUN YET`

Production migration / route enablement / deployment: `NOT_AUTHORIZED`

## Phase verdict

Phase 3 Technical Implementation Contract: `PASS`

Không có scope deviation hoặc blocked evidence. Phase 4 chưa bắt đầu.

## Pre-Apply integrity

| Artifact hoặc protected state             | Approved SHA-256                                                   | Result        |
| ----------------------------------------- | ------------------------------------------------------------------ | ------------- |
| Delta Spec                                | `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850` | MATCH         |
| `design.md`                               | `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610` | MATCH         |
| 11 Phase 1 implementation/migration paths | exact set trong `phase-1-review.md`                                | `11/11 MATCH` |
| 5 Phase 2 implementation/test paths       | exact set trong `phase-2-review.md`                                | `5/5 MATCH`   |
| `0018_elite_hardball.sql`                 | `98ab37e9c9b13ebea5503b30f7ace60cc25fd14758cddeb6ef144844ef10cf75` | MATCH         |
| Formalités authorization prerequisite     | exact set bên dưới                                                 | `4/4 MATCH`   |

Worktree tiếp tục chứa các thay đổi đã biết của các change khác. Không reset,
rewrite hoặc absorb các thay đổi đó. Bảy UI/test paths của Phase 3 không có
overlap chưa giải thích; ba existing targets có preimage được ghi bên dưới và
bốn targets mới chưa tồn tại trước Phase 3.

## Exact Phase 3 implementation inventory

| Path                                                                                                                     | Pre-Apply SHA-256                                                  | Final SHA-256                                                      | Change                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/[employeeId]/page.tsx`                              | `2b6df3845dc9061793132939b40200dc7b272861bb764c11f37528ee676606e9` | `f79f9cc3c86cca0dafaaa2bd79f0fb2fad9c28a7d3c7f3e8012940fa50fb8c72` | trusted persistent loader + bounded action wiring                                                              |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-connected-read-model.ts`             | `e2037a3bb38432733076231253e20ea3e3bb62ab85c30a7bae4bbb943c994bb4` | `bb2679be6919f0af8bd9a9b3a925387cd5031edfa63005a8eddaf5cdee5ddf31` | safe typed persistent read-model adapter                                                                       |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-connected-read-prototype.tsx` | `a24be129f95e6e85fcd6ad9324f50163fe76fee2b0cb53cafd0e32f7785e6f95` | `4a7a9272d145e8f887c1a72a4dda0a43773b2713ee7721a7c268f16b21d5e406` | preserve legacy connected prototype fallback; select durable workspace only with complete typed inputs/actions |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-workspace.tsx`                | ABSENT                                                             | `c6722b322b5acd975e9f26c7ac72a11571462778b20eea0a9116d5d6bc96dc8e` | new employee-connected persistent workspace                                                                    |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-workspace-state.ts`                  | ABSENT                                                             | `49d62b72661ff2282cd880a0c055db093084e1756ce773102b9089163a504ded` | new pure operation/dirty/reconciliation state helpers                                                          |
| `apps/backoffice/test/formalites-persistent-draft-component.test.tsx`                                                    | ABSENT                                                             | `92f776df45c52c19d7bdaa190ba9f42e63e87fba2380aab22c925162437f2cc2` | new component/route/protected-boundary evidence                                                                |
| `apps/backoffice/test/formalites-persistent-draft-state.test.ts`                                                         | ABSENT                                                             | `3a149cc792cf6295e44b84f26ca00a20a969e583e84cf4d5df0812f2be1ca4ec` | new pure interaction/operation-key evidence                                                                    |
| `openspec/changes/formalites-persistent-draft-foundation/tasks.md`                                                       | `d285bfe9c66d940a165b57ba6d48e1bfcdfc9a48f2d6b26e667bdb4246ead822` | `c9ec0bf4dbcfeea19aa1f20348db09d14d9334fb031985cb2b0d33cfd2630586` | check tasks `3.1`–`3.7` only                                                                                   |

`actions.ts` vẫn có Phase 2 SHA
`41d0ed0dbf7bb71e8c0d111e154a1daefc8c86ceb96b744b8bd0282694644b76`;
Phase 3 chỉ gọi typed actions đã duyệt và không sửa file này.

## Route, authorization và source boundaries

- Employee-connected route vẫn fail closed sau
  `isFormalitesReadPrototypeEnabled()`; flag không được đổi hoặc production-enable.
- Server loader gọi `requireFormalitesTenant('formalites.read', path)`, sau đó
  `requirePersonnelPermission(..., 'personnel.employee.read')` độc lập trước
  scoped `readFormalitesPersonnelDraft`.
- Browser chỉ gửi parsed resource references và typed mutation inputs; không
  cung cấp organization, establishment, membership, role hoặc permission làm
  authority.
- Wrong-scope hoặc missing employee/draft không render dữ liệu; repository và
  existing actions tiếp tục full organization + establishment + employee scope.
- Generic fictional route và return-to-Personnel handoff không đổi.

## UI state and interaction coverage

| Required behavior                     | Implementation/evidence                                                                                  | Result                                           |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| eligible / no active draft            | explicit `Créer le brouillon`, current Personnel values, no autosave                                     | PASS                                             |
| editable DRAFT                        | explicit Save; `undecided`, `include`, `exclude` French controls                                         | PASS                                             |
| SAVE UNDECIDED                        | state keeps `undecided` valid and Save never disables it                                                 | PASS                                             |
| persisted reopen                      | authoritative typed model initializes controls; success/load replaces displayed model                    | PASS                                             |
| reconciliation required               | only server `divergentFacts`; draft/current labels; KEEP/REFRESH and mixed choices                       | PASS                                             |
| unchanged source acknowledgement      | successful server model removes resolved divergence; no client-created divergence                        | PASS                                             |
| later Personnel change                | fresh server model controls a new reconciliation episode                                                 | PASS                                             |
| stale Personnel source                | no partial success; relevant still-divergent choices retained; reload recovery                           | PASS                                             |
| ineligible recovery                   | stored/current values readable; normal Create/Edit/Save/Refresh controls absent; Abandon remains         | PASS                                             |
| abandoned                             | retained reason and values read-only; a separate new draft is offered only when current Personnel is CDI | PASS                                             |
| abandon                               | explicit dialog; trimmed required reason, 1–250; no hard delete                                          | PASS                                             |
| validation/stale/replay/server errors | safe French messages, no success, focus/reload/retry recovery                                            | PASS                                             |
| pending/double submit                 | pending operation blocks a second submit/key                                                             | PASS                                             |
| dirty close                           | route-local `beforeunload` plus guarded return link/dialog close; no global navigation change            | PASS                                             |
| responsive structure                  | bounded grids collapse at `sm`/`md`/`lg`; no fixed content width or horizontal-scroll design             | PASS at component structure; Browser QA deferred |

## Operation-key lifecycle evidence

- Key được tạo trước lần submit đầu tiên bằng browser cryptographic UUID và
  không render trong DOM.
- `prepareWorkspaceOperation` khóa accidental double-submit khi pending.
- `server_error` giữ operation ở `uncertain`; retry cùng command + normalized
  intent dùng lại đúng key.
- Thay đổi intent có chủ ý sau uncertain tạo key mới; mọi conclusive outcome
  đóng operation cũ.
- Success dùng authoritative returned model, clear stale form metadata và gọi
  `router.refresh()`; reload action cũng thay model bằng authoritative response.
- Operation key, source fingerprint và revision chỉ đi vào typed technical
  mutation input khi cần; không có label, hidden input hoặc debug rendering.

## Accessibility and forbidden-content evidence

- Semantic `button`, `fieldset`, `legend`, labeled RadioGroup, dialog title/
  description, required Textarea, `aria-live`, visible focus-ring hooks và focus
  recovery được test/inspect.
- French UI phân biệt rõ `Valeur du brouillon` và
  `Valeur actuelle du dossier salarié`; KEEP không đổi nhãn Personnel truth.
- Focus chuyển tới reconciliation choice còn thiếu, abandonment reason hoặc
  recovery alert phù hợp.
- Component assertions xác nhận không render address, remuneration,
  `reviewAcknowledged`, tenant/actor IDs, operation key/hash, source fingerprint,
  receipt internals, raw row/stack, PDF/signature/provider/generation controls.
- Shared `@yuta/ui` changes: `NONE`.

## Protected exact-byte evidence after Apply

| Protected path                                                                                                      | SHA-256                                                            | Result |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/page.tsx`                                      | `dca3e2bd45570847b95117ffe9c3acc7a332d08dd0a3383f2974d65f34326fe4` | MATCH  |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/formalites-read-prototype-runtime.ts`     | `8e68816d2e69b7ef373806a10bc313dd12650b7f651b2a1ff8e7be3b3f99eb50` | MATCH  |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_lib/cdi-draft-prototype.ts`                   | `c186e16f54a16d0447a727583166123df1498f83193efda9b97e258603c574cb` | MATCH  |
| `apps/backoffice/src/app/(authenticated)/equipe/formalites-personnel/_components/cdi-draft-readiness-prototype.tsx` | `89cdfceaa840a0ce2f939aef5f4f77ff1ef8d27b8cb79e5269d3f64e96ea52c1` | MATCH  |
| `apps/backoffice/src/components/backoffice/backoffice-navigation.ts`                                                | `6deaa75874a35b114248d349433ab1c71b8e4e788411908786c5e89d6c4d0a97` | MATCH  |
| `apps/backoffice/src/app/(authenticated)/equipe/salaries/[employeeId]/page.tsx`                                     | `a4d3aafc557f428d1d40b8d9e3ba6d100f3212154043ac81b4d50fe688630471` | MATCH  |
| `packages/ui/src/index.ts`                                                                                          | `ba8a9a3f0b41736294396036dd9fbca4684e3dc7f1123fe10d93245c36ee8f6d` | MATCH  |
| `apps/backoffice/src/server/auth/formalites.ts`                                                                     | `60b1c5369ef3b28af7377c6e8920707e8643f13269a82d192125c009b9333626` | MATCH  |
| `apps/backoffice/src/server/auth/permissions.ts`                                                                    | `e3a21cf5b8456a859762d8603500669ead764e3bd43a8ba06a2ad17620014353` | MATCH  |
| `apps/backoffice/test/formalites-authorization-context.test.ts`                                                     | `af3a2bd48565cec5afb559602626b16c563f21ca3ec660b7943e4e49327f4537` | MATCH  |
| `apps/backoffice/test/formalites-permissions.test.ts`                                                               | `9e9888461c4154df90802f3d9021956dba3731cd34a9d27aa110d08ba9bc42e6` | MATCH  |
| `packages/db-cloud/src/formalites-personnel-draft-repository.ts`                                                    | `d3c371c6e3b22ba4ffa3bccc4cf77f83493ca58bebe8e2a48974ff6b9d054418` | MATCH  |
| `packages/db-cloud/src/schema/formalites.ts`                                                                        | `bf7be60d7c9957683e84ad990c513e91e023ae1ab8096d8c7e5d50eb8ea694c8` | MATCH  |
| `packages/db-cloud/drizzle/0018_elite_hardball.sql`                                                                 | `98ab37e9c9b13ebea5503b30f7ace60cc25fd14758cddeb6ef144844ef10cf75` | MATCH  |

`git diff/status` for `packages/ui` is empty. Không có shared primitive, auth
grant, schema, migration, repository, generic prototype, development gate,
navigation hoặc Personnel change nào attributable cho Phase 3.

## Commands and exact results

| Exact command                                                                                                                                                                                                                                    | Result                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/backoffice exec vitest run test/formalites-persistent-draft-state.test.ts test/formalites-persistent-draft-component.test.tsx test/formalites-persistent-draft-actions.test.ts test/formalites-cdi-connected-read.test.tsx` | Exit 0; 4 files / 44 tests PASS                                                                                |
| `pnpm --filter @yuta/backoffice test`                                                                                                                                                                                                            | Exit 0; 88 files PASS, 1 existing guarded file skipped, 478 tests PASS                                         |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                                                                                                                                       | Exit 0                                                                                                         |
| `pnpm --filter @yuta/backoffice build`                                                                                                                                                                                                           | Exit 0; Next 16.2.9 compiled/typechecked/static-page collection PASS; employee-connected route remains dynamic |
| `pnpm typegen:next`                                                                                                                                                                                                                              | Exit 0; 6/6 Next apps, each 4/4 fresh generated outputs validated                                              |
| `pnpm -r --if-present typecheck`                                                                                                                                                                                                                 | Exit 0; 15/16 workspace projects selected, all applicable typechecks PASS                                      |
| `pnpm docs:check`                                                                                                                                                                                                                                | Exit 0; 36 current documents PASS                                                                              |
| `pnpm architecture:check`                                                                                                                                                                                                                        | Exit 0                                                                                                         |
| `pnpm exec openspec validate formalites-persistent-draft-foundation --strict`                                                                                                                                                                    | Exit 0; change valid                                                                                           |
| scoped `pnpm exec prettier --check` over the seven Phase 3 UI/test paths                                                                                                                                                                         | Exit 0; all matched files PASS                                                                                 |
| `pnpm format:check`                                                                                                                                                                                                                              | Exit 1; exactly 62 pre-existing unrelated unchanged files reported; none is a Phase 3 path                     |

Một focused command đầu tiên có path chứa `(authenticated)` đi qua Windows
`pnpm.cmd` và bị shell parse trước khi Vitest chạy; nó không phải test failure.
Command được chạy lại bằng package-root test paths và đạt 44/44. Một TypeScript
exhaustiveness issue nội bộ được phát hiện trước evidence run, sửa trong allowed
workspace component, rồi mọi final check ở trên PASS.

## Deferred and unchanged boundaries

- Browser QA tại 1440/1024/768/390: `NOT RUN YET`; thuộc Phase 4.
- Không có screenshot/QA verdict ở Phase 3.
- Generic fictional Formalités prototype và development gate vẫn nguyên byte.
- Không có autosave, address, remuneration, PDF, template, signature, provider,
  Documents write, Personnel write-back, hard delete hoặc production behavior.
- Production migration: `NOT_AUTHORIZED`.
- Production route enablement: `NOT_AUTHORIZED`.
- Production deployment: `NOT_AUTHORIZED`.

## Human review checkpoint

Phase 3 — UI / Components: `PASS`

Human approval is required before any Phase 4 Integration / Regression work.
