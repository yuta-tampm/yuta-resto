# Bounded investigation — F1/F2 design return

Change: next-generated-types-bootstrap

Scope: Technical Design investigation only. Not Phase 3 continuation, implementation acceptance, production, sync or archive.

## Provenance and protected state

Current candidate snapshot: `a99b0fb8ddd3021276d355c59882f195b00841f7`, tree `6477540a408f5be23212fb1d43f310a3008f44aa`; source HEAD `07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa`.

Disposable root: `D:/working/yuta/.tmp-bootstrap-design-20260904`.

Snapshot used the proven temporary-index + `core.autocrlf=false` staging/checkout method, not bare HEAD or default-CRLF worktree checkout. Original index before/after SHA-256 identical: `cb06e0450599f335de1d95e90b075824c9043cd15db6cab4a354b4fc77b17d8a`.

Before any injection: full **2205/2205 exact path + byte hashes MATCH**; Formalités **4/4 + 18/18 + 17/17 MATCH**. Frozen install exit 0. No generated state/env/node_modules copied. Installed Node 24.17.0, pnpm 11.8.0, Next 16.2.9.

Then six next.config files received documented conditional synthetic hooks; only the selected app/mode activates in each case. All other 2199 files remained byte-identical. Protection was rechecked before the validated negative matrix and after experiments. No CRLF-normalized equality used. Exact baseline: [02b-investigation-baseline.json](02b-investigation-baseline.json).

Raw evidence, observer/probe source and per-case prechecks: [02b-investigation.json](02b-investigation.json). Fixture F2 from the previous turn remains diagnostic-only; no evidence from it is promoted.

## Mechanisms actually evaluated

All three mechanisms invoke the installed public Next CLI, not private generator functions. The experimental `.tmp-design-probe.mjs` dispatches sequentially and records actual child status/signal; mode selects only process strictness and output validation. CLI shape:

```text
raw:       node <installed next CLI> typegen
strict:    node --unhandled-rejections=strict <installed next CLI> typegen
validated: same strict CLI, with fresh bounded output checks before continuing
```

Outer invocation:

```text
node .tmp-design-probe.mjs <mode> && pnpm -r --if-present typecheck
```

PowerShell process-local environment selects the disposable failure; `NODE_OPTIONS=--require <fixture>/.tmp-process-observer.cjs` only prints PID/cwd/argv. This observer does not install exception listeners or alter exit status. Proposed implementation does not depend on it or on log-string parsing.

| Mechanism / case                                                                | Actual Next 16.2.9 child exit | Bootstrap/outer result                                      | Later generators                    | Recursive invoked         | Assessment                                         |
| ------------------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------- | ----------------------------------- | ------------------------- | -------------------------------------------------- |
| Raw status only, config throw in Backoffice                                     | 0 despite unhandled rejection | Bootstrap 0; outer 1 only after downstream TypeScript fails | YES, all remaining five             | YES                       | REJECT                                             |
| Strict status only, config throw                                                | 1                             | 1                                                           | NO                                  | NO                        | Fixes observed rejection class, insufficient alone |
| Strict status only, normal source path                                          | Six exits 0                   | Outer 0                                                     | YES, intended order                 | YES, PASS                 | Happy path works                                   |
| Strict status only, early process.exit(0), stale types primed                   | 0, no new generation          | Outer 0 falsely accepts stale output                        | YES                                 | YES, PASS using old types | REJECT as sole mechanism                           |
| Strict + freshness/validation, early exit 0 with stale types primed             | 0                             | 1: new next-env missing                                     | NO                                  | NO                        | Rejects false success                              |
| Strict + freshness/validation, normal source path                               | Six exits 0                   | Outer 0, all four outputs/app validated                     | YES, intended order                 | YES, PASS                 | Selected mechanism feasible                        |
| Strict + freshness/validation, config throw at each of six positions            | Intended child 1 in 6/6 cases | 1 each                                                      | NO generator after failing position | NO in 6/6                 | Fail-closed                                        |
| Strict + freshness/validation, async Promise rejection                          | 1                             | 1                                                           | NO                                  | NO                        | Fail-closed                                        |
| Strict + freshness/validation, delete fresh routes after actual Next success    | 0                             | 1: missing output                                           | NO                                  | NO                        | Invalid-result rejection                           |
| Strict + freshness/validation, empty fresh routes after actual Next success     | 0                             | 1: empty output                                             | NO                                  | NO                        | Invalid-result rejection                           |
| Strict + freshness/validation, malformed fresh routes after actual Next success | 0                             | 1: TypeScript parse diagnostics                             | NO                                  | NO                        | Invalid-result rejection                           |

Total recorded runs: 16. Output corruption hooks exist only in the experimental probe and are not proposed production flags. The test uses actual Next generation before corruption; it does not fabricate a successful generator.

The raw case now directly measures Next exit 0 on an exact-byte qualified fixture, confirming F1 independently of the previous invalid-CRLF fixture. Its final outer error was missing `./routes.js` / `LayoutProps`, after recursive invocation. A final nonzero alone is not fail-fast evidence.

## Smallest selected supported shape

One root Node script, fixed six app/name pairs, public CLI resolved per installed app, sequential `spawn`/argument array/`shell:false`. Use `process.execPath` and direct strict Node option; no global environment switch, shell-specific assignment, custom generator, private Next API, package/framework/dependency upgrade or app manifest change.

The wrapper must validate package identity before dispatch; missing target fails closed rather than relying on an unexecuted pnpm filter. Keep current CI expression unchanged: `pnpm typegen:next && pnpm -r --if-present typecheck`. Only `typegen:next` implementation changes after future approval.

Strict alone cannot cover early zero exit or incomplete output; therefore fresh-result validation is required, not optional.

## Output contract and freshness

Before each app run, safely unlink only these four exact generated files if present, then verify absence:

- `next-env.d.ts`
- `.next/types/routes.d.ts`
- `.next/types/validator.ts`
- `.next/types/cache-life.d.ts`

No directory deletion, broad glob, tsconfig/source modification, generated declaration writing, or restoration of stale content. Existing default six-app configs generate all four. Next source confirms cache-life can be conditional under other configs, so the designed validator fails closed rather than silently skipping it when configuration/version changes.

After child exit 0: regular-file/path checks, nonempty UTF-8 content, TypeScript parser without diagnostics, expected type references/module imports and bounded route/validator/cache declaration structure. No mtime check or retained-file presence as freshness proof. Exact future contract in revised Design D2; research prototype proves the core mechanism, not every future hardening condition.

Reference source: installed Next `dist/cli/next-typegen.js`, `dist/lib/typescript/writeAppTypeDeclarations.js`, `dist/server/lib/router-utils/cache-life-type-utils.js`. Node installed help supports `--unhandled-rejections=strict`. No dependency/provider connection or upgrade used.

## Cross-platform and side effects

- Windows execution recorded. Node argument arrays/strict option/fs APIs and per-app CLI resolution are portable in design; Linux execution is **not claimed** and remains future verification.
- Unlike shell-prefixed env assignments, direct Node flags do not need POSIX/PowerShell/cmd-specific quoting or a new cross-env dependency.
- Generated output invalidation is a deliberate local side effect, bounded to four untracked/generated files per app and only within bootstrap; not a cleanup cron or Git-integrity exception.
- Strictness applies only to child generator, not Next dev/build, server runtime, sessions or app business logic.
- Proposed single-run lock and path/timeout defenses require implementation evidence after approval; this investigation is not proof of their completed implementation.
- Log matching and private API wrappers are not selected: installed public CLI + runtime flag + structural file validation suffices without relying on message text or private API compatibility.

## Preserved findings and limitations

Previous Phase 3 happy-path evidence remains unchanged: fresh post-transition checkout/install, six typegens/direct checks/builds, recursive PASS and main snapshot source stability. No prior QA report or implementation progress is rewritten.

This investigation does not run dev smoke, POS offline, source-negative Phase 3 acceptance, production or final Gate 3. No Tasks update. Do not treat the 16 probe runs as completion of revised implementation or final Phase 3 matrix.

Minor command mistakes are recorded in JSON: Windows inline-eval quoting, one wrong source path, one wrong cwd for experimental helper hash, and a discarded post-injection hash command that used wildcard path semantics. Corrected exact-byte check with `-LiteralPath` and terminating errors passed before further tests; no failed command is counted as PASS.

Canonical Formalités remains unchanged; all four implementation, 18 integrity entries and 17 supplemental paths MATCH. Canonical app/config/package/CI/ignore/POS files remain unchanged during this investigation.

## Next gate

Regenerated Sensitive Technical Design review only. Previous D1/D2 status-only assumption superseded; Gate 1 and generated/non-authoritative decision unchanged. Tasks remain frozen and must be reconciled only after explicit revised Design approval. No Apply, retracking, Gate 3, sync/archive or production authority.
