# Phase 1 — Bootstrap foundation + pre-untrack proof

Change: next-generated-types-bootstrap

Review status: AWAITING_HUMAN_REVIEW

Schema: yuta-spec-driven

Scope: tasks 1.1–1.7 only. Phase 2: NOT AUTHORIZED.

Phase 1 Technical Implementation Contract: PASS

## Result and boundaries

Hard gate PASS trên cùng faithful isolated candidate. Không bỏ tracking, không sửa .gitignore, không sửa POS housekeeping, không build trước typegen; không production operation. Đây không phải full-change VERIFY/QA hoặc Gate 3 readiness.

Tasks/Implementation Plan approval được user cấp riêng, bounded Apply Phase 1. Proposal/Analysis/Design và earlier packets có hash hợp lệ trước Apply; 43 hash rows qua hai review packets MATCH. Không thay approved planning semantics.

## Exact changed files

Implementation (five files only):

- `package.json`
- `.github/workflows/ci.yml`
- `README.md`
- `docs/DEVELOPMENT_WORKFLOW.md`
- `scripts/next-generated-types-bootstrap.test.mjs` (new)

Progress/evidence:

- `openspec/changes/next-generated-types-bootstrap/tasks.md` — approval state and 1.1–1.7 progress only; phases 2/3 remain unchecked.
- `docs/reviews/next-generated-types-bootstrap/phase-1-baseline.json`
- `docs/reviews/next-generated-types-bootstrap/phase-1-candidate.json`
- `docs/reviews/next-generated-types-bootstrap/phase-1-commands.json`
- This `phase-1-review.md`.

No other current source was attributed to this phase. Existing dirty F07/Formalités/workflow/docs work preserved.

## Exact script and CI diff

`package.json` adds only `typegen:next`:

```text
pnpm --filter @yuta/backoffice --fail-if-no-match exec next typegen && pnpm --filter @yuta/web --fail-if-no-match exec next typegen && pnpm --filter @yuta/booking-web --fail-if-no-match exec next typegen && pnpm --filter @yuta/feedback-web --fail-if-no-match exec next typegen && pnpm --filter @yuta/pos --fail-if-no-match exec next typegen && pnpm --filter @yuta/display --fail-if-no-match exec next typegen
```

Existing root/app script meanings and dependencies unchanged. No new app hooks.

```diff
       - name: Type-check workspaces
-        run: pnpm -r --if-present typecheck
+        run: pnpm typegen:next && pnpm -r --if-present typecheck
```

Only that run line changes in CI. No separate job dependency, continue-on-error, environment change or bypass. Documentation explains explicit local/direct-app prerequisite; does not claim tracking transition already happened.

## Clean snapshot provenance

- Original root: D:/working/yuta/yuta-resto.
- Original HEAD: `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.
- Disposable root: `D:/working/yuta/.tmp-bootstrap-phase1-20260904`.
- Snapshot commit: `c5cdad547d33fdc8a2aa3f585ce0822c76de8309`.
- Snapshot tree: `1ace66504ce97c2f849c8be4a7eb4fb5ba4f0593`.
- Detached snapshot, no branch update or main commit. Temporary independent Git index populated from actual current working tree, including nonignored uncommitted required sources; not old HEAD alone.
- Original Git index SHA-256 before/after: `a543404aa2c7106ef468ebd1e7c32307343fc69f5424c86f5ff02bb6308f5108`, MATCH. No staged changes added in original checkout.
- Snapshot contains 2,197 files; exact path set and all 2,197 raw byte hashes matched current candidate before controlled deletion. Includes approved uncommitted Formalités/F07 files. Missing-in-HEAD inventory in baseline consists of 25 already-deleted historical docs, excluded by the current-state snapshot; no missing snapshot assets.
- Snapshot construction: isolated GIT_INDEX_FILE, `git read-tree HEAD`, `git -c core.autocrlf=false -c core.safecrlf=false add -A -- .`, `git write-tree`, `git commit-tree <tree> -p HEAD`, `git -c core.autocrlf=false worktree add --detach <root> <snapshot>`. No main-index staging. Byte comparison avoids relying on normalized EOL equality.
- Source versions: Node v24.17.0, pnpm 11.8.0; installed Next 16.2.9 in every app.
- Before install: no node_modules, six .next directories, env.local or incremental state; snapshot does not include ignored environments/caches.
- Only six next-env files removed in disposable checkout using apply_patch, not from Git index. The same six files in original remain unchanged and tracked.
- Frozen install resolved from repository lockfile, reused pnpm store packages; no copying/symlinking original node_modules, .next or env. Reuse of package store is normal install, not reuse of application-generated state.
- No build/dev/DB/provider invocation during this proof. Subsequent evidence files and checkbox progress do not alter the tested implementation candidate.

Full before/after inventories: [phase-1-candidate.json](phase-1-candidate.json). Pre-Apply original inventory: [phase-1-baseline.json](phase-1-baseline.json).

## Commands and hard-gate evidence

Exact captured outputs and exits: [phase-1-commands.json](phase-1-commands.json).

| Hard-gate row                             | Result | Evidence                                                                                                                    |
| ----------------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- |
| Frozen install                            | PASS   | `pnpm install --frozen-lockfile`, exit 0, 16.5s, all 16 workspace projects; lockfile unchanged                              |
| Six next-env absent before generation     | PASS   | Per-app existence false before install and again after install                                                              |
| Six .next states absent before generation | PASS   | Per-app absence checks, no incremental/build prewarm                                                                        |
| Root generation                           | PASS   | `pnpm typegen:next`, exit 0, six success outputs in exact sequential order                                                  |
| Six direct app typechecks                 | PASS   | Six individually captured commands, all exit 0                                                                              |
| Recursive workspace typecheck             | PASS   | `pnpm -r --if-present typecheck`, exit 0, 15 of 16 workspace projects                                                       |
| Unauthorized tracked drift                | PASS   | 2,197-file before/after hash inventory, zero unauthorized differences; only three next-env outputs differ                   |
| Formalités protected state                | PASS   | Four implementation hashes, 18 approved entries, 17-file supplemental path/hash set MATCH; all earlier packet hashes intact |

### Per-app generation and typecheck

| App                 | Generation                                                                      | Direct typecheck                                     | Generated files                                      |
| ------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------- |
| `apps/backoffice`   | `pnpm --filter @yuta/backoffice --fail-if-no-match exec next typegen`: exit 0   | `pnpm --filter @yuta/backoffice typecheck`: exit 0   | next-env, routes.d.ts, validator.ts, cache-life.d.ts |
| `apps/web`          | `pnpm --filter @yuta/web --fail-if-no-match exec next typegen`: exit 0          | `pnpm --filter @yuta/web typecheck`: exit 0          | next-env, routes.d.ts, validator.ts, cache-life.d.ts |
| `apps/booking-web`  | `pnpm --filter @yuta/booking-web --fail-if-no-match exec next typegen`: exit 0  | `pnpm --filter @yuta/booking-web typecheck`: exit 0  | next-env, routes.d.ts, validator.ts, cache-life.d.ts |
| `apps/feedback-web` | `pnpm --filter @yuta/feedback-web --fail-if-no-match exec next typegen`: exit 0 | `pnpm --filter @yuta/feedback-web typecheck`: exit 0 | next-env, routes.d.ts, validator.ts, cache-life.d.ts |
| `apps/yuta-pos`     | `pnpm --filter @yuta/pos --fail-if-no-match exec next typegen`: exit 0          | `pnpm --filter @yuta/pos typecheck`: exit 0          | next-env, routes.d.ts, validator.ts, cache-life.d.ts |
| `apps/yuta-display` | `pnpm --filter @yuta/display --fail-if-no-match exec next typegen`: exit 0      | `pnpm --filter @yuta/display typecheck`: exit 0      | next-env, routes.d.ts, validator.ts, cache-life.d.ts |

Root generation child attribution: exact script runs six commands with `&&`; six contiguous `Generating route types... / ✓ Types generated successfully` pairs in approved order and final exit 0 prove each child succeeded. The JSON records that attribution explicitly; these are not falsely represented as six additional separate generator invocations. Direct typechecks were six separate invocations, each output `$ tsc --noEmit`.

All six generated declarations import `./.next/types/routes.d.ts` and reference Next/image types.

## Tracked-source inventory and scope

Post-generation and post-typecheck comparison against the same before inventory:

- 2,197 paths remain present.
- 2,194 files exactly byte-identical.
- Differences only in `apps/booking-web/next-env.d.ts`, `apps/feedback-web/next-env.d.ts`, `apps/yuta-display/next-env.d.ts`.
- These three are allowed generated outputs in the disposable proof. Other three regenerated next-env files already match their snapshot bytes.
- No tsconfig, app source, package manifest, dependency lockfile, schema or migration drift.
- Original checkout still tracks all six next-env files; original generated bytes were not rewritten.
- Original `.gitignore` and `scripts/test-pos-offline.mjs` have no diff and retain baseline hashes.

## Focused checks and contract matrix

`node --test scripts/next-generated-types-bootstrap.test.mjs`: exit 0, **11/11 PASS**, no skipped/cancelled tests. Covers exact six mappings/order, unchanged aliases/no hooks, CI ordering/no bypass, both docs prerequisites, success and six shell failure positions. Shell probes substitute harmless child commands into the actual conjunction structure; real Next failure injection remains Phase 3, not claimed here.

| Contract                                | Evidence                                                              | Assessment |
| --------------------------------------- | --------------------------------------------------------------------- | ---------- |
| Five-path implementation allowlist      | Scoped diff + baseline inventory                                      | PASS       |
| Root command/CI/documented prerequisite | Actual changed files, 11 focused tests                                | PASS       |
| Current candidate, not stale HEAD       | 2,197-file path and byte match                                        | PASS       |
| Frozen install/no caches/no prebuild    | Install transcript and absence checks                                 | PASS       |
| Six actual generators and direct checks | Captured root and per-app results                                     | PASS       |
| Recursive clean-state check             | Same candidate, exit 0                                                | PASS       |
| Source/compiler rules preserved         | Before/after inventory and no tsconfig drift                          | PASS       |
| Formalités exact preservation           | Approved 4/4 + 18/18 + supplemental 17 checks                         | PASS       |
| No untrack/ignore/POS transition        | Original index SHA unchanged, six tracked paths, forbidden diff empty | PASS       |

Repository checks:

- `pnpm docs:check`: exit 0, 36 current documents.
- `pnpm architecture:check`: exit 0.
- Scoped `pnpm exec prettier --check package.json .github/workflows/ci.yml README.md docs/DEVELOPMENT_WORKFLOW.md scripts/next-generated-types-bootstrap.test.mjs`: exit 0.
- `openspec validate next-generated-types-bootstrap --strict`: exit 0, valid.
- `pnpm format:check`: exit 1, 62 unrelated baseline files. No broad formatting applied; not hidden as PASS.

## Deviations, unrelated failures and deferred evidence

No approved-scope deviation or blocked hard-gate evidence. Full repository formatting failure remains unrelated/pre-existing (same 62-file categories at Gate 1: generated skills, historical docs, existing knowledge/review/main-spec/schema-template files). No failure in clean install/typegen/typecheck.

A read-only initial inventory command outlived its first tool yield; inventory capture was repeated and completed before implementation. No source mutation or discarded failing test resulted. EOL warnings are not used to dismiss raw-byte drift; exact candidate comparison passed.

No app build, dev smoke, real Next injected-failure cases, source mutation negative control, Docker/offline acceptance, tracking transition, Gate 3 or production action performed. These remain later-phase obligations. Non-browser full-change QA/VERIFY not declared PASS merely from Phase 1.

## Integrity hashes

| Path                                                                 | SHA-256                                                            |
| -------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.github/workflows/ci.yml`                                           | `0f738c855e627da68f9304754117488744a4d2fa2e39e9dc0db6c5b71da5702e` |
| `docs/DEVELOPMENT_WORKFLOW.md`                                       | `96443cd5cf7e9e90685bad2435478ce27b2ab0edb89c84c3d9d2c86558c6432c` |
| `docs/reviews/next-generated-types-bootstrap/phase-1-baseline.json`  | `ef366ae0767a0e2d1096e8e1588efa9eb37c574cfdc93e21a97c706d851a6e31` |
| `docs/reviews/next-generated-types-bootstrap/phase-1-candidate.json` | `3954ec4670975e39409c80e170a1da892af22b99c0c9a3604b30bc8abb630078` |
| `docs/reviews/next-generated-types-bootstrap/phase-1-commands.json`  | `8ad4a9427075488ca64a5bd5d0411830ab66c9dd8eb8795fbfbf029ca063aa7a` |
| `package.json`                                                       | `0eaff8739b9a97e99514c67f314ce137fabe82e4440caebc305fc2389ea5d690` |
| `README.md`                                                          | `30b4022ec198578459b9564e27a35142f7d79413eddab65a31190c3d61136982` |
| `scripts/next-generated-types-bootstrap.test.mjs`                    | `75208952c76578b643d6ca2c777ce3959cd20b22e961477668f36d2998a35cf0` |

Hash method: `(Get-FileHash -LiteralPath <path> -Algorithm SHA256).Hash.ToLower()`. Full file inventories and protected expected/actual evidence are in the linked JSON, not an ad-hoc weakening of Gate 3.

## Stop for human review

Phase 1 Technical Implementation Contract: PASS.

Tasks 1.1–1.7 complete; Phase 2 and Phase 3 untouched. Phase 2 MUST NOT begin in this turn even though hard gate PASS. Later resume must recheck candidate/approval/protected hashes; stale proof is not authorization.

No sync/archive for this change or Formalités; no production enablement.
