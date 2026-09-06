# Phase 2 — Tracking transition + bounded housekeeping

Change: next-generated-types-bootstrap

Gate: Phase 2 Technical Implementation Contract review

Review status: APPROVED

Approval source: explicit current-user instruction (attached request)

Approval recorded by: Codex workflow

Approved: 2026-09-04T14:03:48.4218173+02:00

Approval scope: Phase 2 accepted; only Phase 3 verification/regression authorized.

Created: 2026-09-04

Schema: yuta-spec-driven

Analysis conclusion: NO_SPEC_BEHAVIOR_CHANGE

Sensitive change: YES — repository integrity/bootstrap

## Outcome

**Phase 2 Technical Implementation Contract: PASS.**

Tasks 2.1–2.4 complete; overall 11/19. Phase 3 NOT STARTED / NOT AUTHORIZED. Đây không phải full-change VERIFY, QA hoặc Gate 3.

Approval source: explicit current-user instruction, accepting Phase 1 revalidation and authorizing only Phase 2. Workflow `yuta-run-change` / `openspec-apply-change`; returned state ready, 7/19 before Apply; no delta Specs expected.

## Entry proof and attribution

- Refreshed snapshot: `9b87c571f7b9ae2cc52cdfee25c16121514bc79d`.
- Refreshed evidence hash: `d9e06d91a8175e7ae70d64486bd8cb829f4f241cdcb63b4ed7f298772e521aa3`.
- Revalidation review pre-approval hash: `1a04d58b7e592f88915841d33686b3eaf070bad59a04afd04019f9bbd129d349`.
- Before mutation, all 2,201 candidate file hashes and exact path set plus the two known closeout evidence files matched. Five Phase 1 implementation hashes MATCH. Original index MATCH, staged diff empty.
- Formalités before: 4/4 implementation, 18/18 approved manifest, 17/17 supplemental exact paths/hashes MATCH.
- `.gitignore` and POS script had no pre-existing diff. Existing harness is Phase 1 code; only two bounded assertions are added, preserving original tests and all bootstrap logic.
- Existing unrelated dirty work remains untouched. `docs/YUTA_WORKFLOW_V3.md` and its clarification report retain accepted current-candidate bytes and are not attributed to this implementation.
- No new clean proof was needed: the refreshed source/evidence was still current before transition.
- Source HEAD remains `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`. No commit/branch update.

## Exact tracking transition

Command, exit 0:

```text
git rm --cached -- apps/backoffice/next-env.d.ts apps/web/next-env.d.ts apps/booking-web/next-env.d.ts apps/feedback-web/next-env.d.ts apps/yuta-pos/next-env.d.ts apps/yuta-display/next-env.d.ts
```

No `--force`, reset or working-file deletion. All six local files stayed present with pre-transition SHA-256 unchanged.

| Untracked path                    | Exact added root ignore rule       | git ls-files  | git check-ignore -v                                     |
| --------------------------------- | ---------------------------------- | ------------- | ------------------------------------------------------- |
| `apps/backoffice/next-env.d.ts`   | `/apps/backoffice/next-env.d.ts`   | Empty, exit 0 | `.gitignore:3:/apps/backoffice/next-env.d.ts`, exit 0   |
| `apps/web/next-env.d.ts`          | `/apps/web/next-env.d.ts`          | Empty, exit 0 | `.gitignore:4:/apps/web/next-env.d.ts`, exit 0          |
| `apps/booking-web/next-env.d.ts`  | `/apps/booking-web/next-env.d.ts`  | Empty, exit 0 | `.gitignore:5:/apps/booking-web/next-env.d.ts`, exit 0  |
| `apps/feedback-web/next-env.d.ts` | `/apps/feedback-web/next-env.d.ts` | Empty, exit 0 | `.gitignore:6:/apps/feedback-web/next-env.d.ts`, exit 0 |
| `apps/yuta-pos/next-env.d.ts`     | `/apps/yuta-pos/next-env.d.ts`     | Empty, exit 0 | `.gitignore:7:/apps/yuta-pos/next-env.d.ts`, exit 0     |
| `apps/yuta-display/next-env.d.ts` | `/apps/yuta-display/next-env.d.ts` | Empty, exit 0 | `.gitignore:8:/apps/yuta-display/next-env.d.ts`, exit 0 |

Full check-ignore output (each line includes the target path):

```text
.gitignore:3:/apps/backoffice/next-env.d.ts	apps/backoffice/next-env.d.ts
.gitignore:4:/apps/web/next-env.d.ts	apps/web/next-env.d.ts
.gitignore:5:/apps/booking-web/next-env.d.ts	apps/booking-web/next-env.d.ts
.gitignore:6:/apps/feedback-web/next-env.d.ts	apps/feedback-web/next-env.d.ts
.gitignore:7:/apps/yuta-pos/next-env.d.ts	apps/yuta-pos/next-env.d.ts
.gitignore:8:/apps/yuta-display/next-env.d.ts	apps/yuta-display/next-env.d.ts
```

Index inventory: 2,120 → 2,114 entries. Staged diff contains exactly the six expected `D` paths above, no other staged change. `git ls-files -ci --exclude-standard` is empty before and after. Thus no remaining tracked source became ignored; index diff proves no other source was untracked. All other ignore rules unchanged. No arbitrary `*.d.ts` / `**/next-env.d.ts` rule.

These staged deletions are the intended tooling transition, not new regeneration noise. Full build/dev/typegen stability after transition remains Phase 3. Existing original Backoffice generated-file drift was preserved locally; the index removal deletes the previously tracked version, not a fabricated content edit.

## Exact POS housekeeping diff

```diff
diff --git a/scripts/test-pos-offline.mjs b/scripts/test-pos-offline.mjs
index ed5c0b4..75bf892 100644
--- a/scripts/test-pos-offline.mjs
+++ b/scripts/test-pos-offline.mjs
@@ -1,6 +1,6 @@
 import { spawn } from 'node:child_process';
 import { randomInt, randomUUID } from 'node:crypto';
-import { existsSync, readFileSync, writeFileSync } from 'node:fs';
+import { existsSync } from 'node:fs';
 import { createServer } from 'node:net';
 import { join, resolve } from 'node:path';
 import { fileURLToPath } from 'node:url';
@@ -10,15 +10,8 @@ const containerName = `yuta-pos-offline-acceptance-${randomUUID().slice(0, 8)}`;
 const pnpmEntrypoint = process.env.npm_execpath;
 const siteAgentPort = readPort('YUTA_OFFLINE_SITE_AGENT_PORT', 3004);
 const posPort = readPort('YUTA_OFFLINE_POS_PORT', 3003);
-const posNextEnvPath = join(
-  repositoryRoot,
-  'apps',
-  'yuta-pos',
-  'next-env.d.ts',
-);
 const childProcesses = [];
 let containerStarted = false;
-let originalPosNextEnv;

 function readPort(name, fallback) {
   const value = Number(process.env[name] ?? fallback);
@@ -177,10 +170,6 @@ async function stopChild(child) {
 async function cleanup() {
   await Promise.allSettled(childProcesses.reverse().map(stopChild));

-  if (originalPosNextEnv !== undefined) {
-    writeFileSync(posNextEnvPath, originalPosNextEnv);
-  }
-
   if (containerStarted) {
     await runCommand('docker', ['rm', '--force', containerName], {
       quiet: true,
@@ -319,9 +308,6 @@ async function main() {
   );

   console.log('Building the POS production bundle...');
-  if (existsSync(posNextEnvPath)) {
-    originalPosNextEnv = readFileSync(posNextEnvPath);
-  }
   await runPnpm(['--filter', '@yuta/pos', 'build'], {
     env: runtimeEnv,
   });
```

Whole-source comparison against refreshed snapshot PASS after exactly five approved replacements/removals, with LF normalization for text comparison. Exact raw bytes/diff are independently hashed. All other script text remains unchanged: Docker/container lifecycle, migration/seed setup, ports, env, process cleanup, auth/order/report assertions. `existsSync` remains for dependency checks. No new next-env deletion logic.

## Attributed implementation and evidence files

Implementation only:

- `.gitignore`: exactly six rules.
- `scripts/test-pos-offline.mjs`: bounded housekeeping deletion.
- `scripts/next-generated-types-bootstrap.test.mjs`: two focused tests, no bootstrap logic change.
- Six index removals listed above; local files not deleted.

Workflow/evidence only:

- `openspec/changes/next-generated-types-bootstrap/tasks.md`: current approval scope and 2.1–2.4 progress.
- `docs/reviews/next-generated-types-bootstrap/phase-1-revalidation-review.md`: approval metadata only; original review conclusions/evidence preserved.
- `phase-2-evidence.json`, `phase-2-implementation.diff`, this `phase-2-review.md` in this review directory.

Exact attributed Phase 2 diff: [phase-2-implementation.diff](phase-2-implementation.diff).
No Phase 1 package/CI/README/development guidance change. No app manifests/tsconfig, business code, auth/tenancy, Formalités or concurrent-doc content change.

## Commands and results

Exact command/output/exit records: [phase-2-evidence.json](phase-2-evidence.json).

| Check                                                                                                     | Result                                                                     |
| --------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `node --test scripts/next-generated-types-bootstrap.test.mjs`                                             | Exit 0; 13/13 tests PASS, 0 failed/skipped                                 |
| `node --check scripts/test-pos-offline.mjs`                                                               | Exit 0, no output                                                          |
| Exact per-path `git ls-files -- <path>`                                                                   | Six empty outputs, all exit 0                                              |
| Exact per-path `git check-ignore -v -- <path>`                                                            | Six exact root rules, all exit 0                                           |
| Index/other-ignored assertions                                                                            | PASS; exactly six staged deletions, no other tracked source ignored        |
| POS full-text comparison                                                                                  | PASS; exactly five approved operations only                                |
| `pnpm exec prettier --check scripts/test-pos-offline.mjs scripts/next-generated-types-bootstrap.test.mjs` | Exit 0                                                                     |
| Scoped evidence/progress Prettier at closeout                                                             | PASS                                                                       |
| `git diff --check -- .gitignore scripts/test-pos-offline.mjs`; `git diff --cached --check`                | Exit 0; only Git LF/CRLF advisories                                        |
| `pnpm docs:check`                                                                                         | Exit 0; 36 current documents                                               |
| `pnpm architecture:check`                                                                                 | Exit 0                                                                     |
| `openspec validate next-generated-types-bootstrap --strict`                                               | Exit 0                                                                     |
| `pnpm -r --if-present typecheck`                                                                          | Exit 0; current checkout supplemental check, not Phase 3 clean-state proof |

Harness covers exact mapping/aliases/CI/docs, six-rule bounds, obsolete POS handling absence, conjunction success and all six synthetic child failure positions. These are focused assertions, **not** actual full POS offline acceptance or real Next failure injection.

No full repository formatting rerun: scoped formatting avoids unrelated churn; prior 62-file baseline formatting failure is not claimed fixed. No builds/dev, clean Phase 3 flow, Browser QA or Docker/offline acceptance run. The full two-state POS offline acceptance remains mandatory Phase 3.

## Protection and contract assessment

Formalités comparison ran before mutation and immediately after approval/progress metadata, cached-removal, ignore rules, POS deletion, test addition/comment placement, task progress, and evidence writes/formatting. Every checkpoint: **4/4 + 18/18 + 17/17 MATCH**. No Formalités Gate 3 regeneration.

| Phase 2 contract                                     | Evidence                                                        | Result |
| ---------------------------------------------------- | --------------------------------------------------------------- | ------ |
| Current valid Phase 1 entry proof                    | Refreshed evidence/path/hash comparison                         | PASS   |
| Exactly six cached removals, local bytes retained    | Scoped command and before/after index/file evidence             | PASS   |
| Exactly six root-anchored ignore rules               | Git output + focused assertion; other tracked ignored set empty | PASS   |
| POS bounded deletion only                            | Exact diff + whole-script comparison                            | PASS   |
| Protected Formalités and concurrent docs             | Per-mutation hashes/set checks, source inventory                | PASS   |
| No Phase 1 prerequisite or excluded boundary changes | Scoped diff and inventory; test assertions only                 | PASS   |
| Required focused evidence                            | Tests/syntax/Git/format/docs/architecture                       | PASS   |
| No Phase 3 or production overclaim                   | Explicit deferred evidence above                                | PASS   |

Deviations/blockers: NONE. An initial over-large read-only index listing exceeded the tool output budget; parsing failed before mutation. The bounded baseline capture was rerun successfully. This was not a repository/test failure and no state changed during that attempt.

## Integrity

| Path                                                                      | SHA-256                                                            |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `.gitignore`                                                              | `31262a06e1e330502c323eda7ac811cdcd8bd6e9e2b10c0c73bd6ca60543351b` |
| `docs/reviews/next-generated-types-bootstrap/phase-2-evidence.json`       | `4b598a0285858bf59debb46e24212ff0ef562d87720ddff5da82a6ef8f1a5474` |
| `docs/reviews/next-generated-types-bootstrap/phase-2-implementation.diff` | `5b0a35bba33aba5be370f44316033c9d5d7a76a4f5be892f7815d97927f60867` |
| `scripts/next-generated-types-bootstrap.test.mjs`                         | `89a6c0bcfe25a25d34350bfdc621e9094088b881d6fca43964c467bb34449c06` |
| `scripts/test-pos-offline.mjs`                                            | `ef08133a64c67a5dae5c5a4b5845a2f95286d9397af77b7678d993c522fd8764` |

Hash method: PowerShell `Get-FileHash -Algorithm SHA256`, exact bytes, lowercase.
Diff assembly: three recorded Git commands for working tracked source, index deletions and harness versus Phase 1 snapshot; concatenate in recorded order and normalize only the old harness snapshot path prefix to repository-relative `a/scripts/`. No unrelated diff or warning is included. This is Phase 2 evidence, not a Gate 3 aggregate authorization.

## Human review stop

Phase 2 Technical Implementation Contract: **PASS**.

Dừng tại Phase 2 review. Chưa bắt đầu Phase 3; không sync/archive, deploy, production migration/cutover, production enablement hoặc lifecycle promotion.
