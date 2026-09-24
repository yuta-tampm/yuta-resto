# Product Release Identity — Phase 5 Technical VERIFY

Change: `product-version-management-foundation`  
Schema: `yuta-spec-driven`  
Verified: 2026-09-24, Europe/Paris  
HEAD provenance: `14dd0f35645586abc5877da28df0fcd16eba971d`  
UI_AFFECTING: YES  
BROWSER_QA_REQUIRED: YES  
SENSITIVE_DESIGN_GATE: NOT_TRIGGERED  
Workflow adoption: GRANDFATHERED  
TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL  
VERIFY: FAIL

The scoped Product Release behavior is supported by source, tests, typechecks,
builds, and strict change validation. The required repository-wide
`pnpm format:check` exited 1 with 82 formatting warnings. The approved Phase 5
TIC makes that command required for Final VERIFY, so this run cannot record
Technical Implementation Compliance or VERIFY as PASS. The warnings do not
identify a Product Release implementation defect: scoped source/docs pass, the
two dirty indexes had the same formatting failures before Phase 4, and several
other warnings concern unchanged historical or hash-approved artifacts. This
failure is preserved; unrelated files and reviewed artifacts were not
reformatted. Phase 6 Browser QA and Gate 3 have not started.

## Approved inputs and candidate integrity

The approved Gate 1 packet is `APPROVED`, SHA-256
`fd4b1f47ab87be02cda632228f4d27838cb4f77fb0ca6cb3b109346144900564`.
The approved Gate 2 packet is `APPROVED`, SHA-256
`3d18c72596a250e6ae85a1f75b54ef2f5b0c164a0c2333903cc8f32ede9c25a7`.
Their reviewed Proposal and Analysis remain at SHA-256
`5d924477c3d83fc7f0b5e4fbf657c66f17a9d85b6a1439bbe4e43814ed4bf0dc`
and `f2721e6a41223b1283e79becbe98f62818580cbfdc6a22550d3199b180256d29`.
The approved delta Spec and Design remain at
`bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d`
and `e930bdddf01d0bf7b18490d915df9c5b81c2381e4a32b85827b4f40de8e3408c`.
Tasks entered VERIFY at SHA-256
`54eb19d070a1969906af2ca035a077d6d909a70e99f57c8d5650258ec311f9d2`,
15/22 checked. All accepted Phase 1–4 implementation/documentation hashes
matched their immediately preceding accepted state before commands ran.

| Attributed file                                                  | SHA-256 before VERIFY                                              |
| ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| `packages/core/src/product-release.ts`                           | `9ea616aa2daa123a7c27ee15c343174ec8d5d9271917f5cb3b0f9fbe4de36e37` |
| `packages/core/src/index.ts`                                     | `2acb0b1e7b264f1b0aa1f57c23d57d410f8f0aea809e67c253a588f359e00981` |
| `packages/core/test/product-release.test.ts`                     | `e6df393c259b58a97e5e8348bf3713d46b3d795de036712744158409bec8486d` |
| `apps/web/src/components/marketing/MarketingShell.tsx`           | `5353ab9f89f1074d5e3f9920d66380f1a9d0231fbd128b164ceb4abea52e4ca8` |
| `apps/backoffice/src/components/backoffice/backoffice-frame.tsx` | `8363f4ea7a6ec02a65568368723d92baf13b71d262c11fa1f696458ff0edf997` |
| `apps/backoffice/test/product-release-footer.test.tsx`           | `6d4b128d456aae63c1de4c1c5333a4bd7831c734a8a7e9622b89b2819d53057f` |
| `docs/features/product-release/README.md`                        | `42d38631082a578d29ecb2ba0dfb99d3316e2b06327f6e58fa396bd9710715ca` |
| `docs/README.md`                                                 | `9c0f49e58f5da0320f61823c56d5d02dfb0dc726a6f9e13eeac388a3fc53e5f8` |
| `docs/PRODUCT_KNOWLEDGE.md`                                      | `96f13edecdaefa941d78f817121e92f41c25544712d2abdfe755b660b81fa259` |
| `docs/MODULE_REGISTRY.md`                                        | `fa93f0b814fd4094f9c55673d7bc00d8cb42148e9b886800665b8184b6dfd580` |

The shared checkout also contained Pointage, workflow-governance, and other
unrelated edits. The Phase 4 pre-edit copies of `docs/PRODUCT_KNOWLEDGE.md` and
`docs/MODULE_REGISTRY.md` had SHA-256
`33c7498883a1c8405612aeedbe6e1ab906abcd096860153b1aa77a17963a3f67`
and `9c454d370e50e6c5950d03a9614ee14699d42640aa05e9e3bbbae6320457c764`.
Comparison with those copies shows only eight and six added Phase 4 lines,
respectively, with no removed lines. The clean `docs/README.md` gained one
link. The added Product Knowledge and Registry sections match their isolated
Prettier-formatted snippets, with line endings normalized for comparison.

## Requirement-level Technical Compliance Matrix

Each row maps one approved requirement. Scenario identifiers below follow the
order of headings in the approved delta Spec; the separate table maps all 21
scenarios. `PASS` here means the named technical claim is supported, not that
the overall VERIFY or Browser QA passed.

| Requirement                                         | Approved behavior                                                                             | Implementation surface                                                      | Automated/static evidence                                                                                                                                          | Command evidence                                        | Status | Evidence limitation                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ------ | --------------------------------------------------------- |
| R1 Canonical Product Release metadata (2 scenarios) | One four-field YUTA/ALPHA/0.1.0-alpha.1/Foundation record; no release ID; name independent    | `product-release.ts:21-33,61-88`                                            | Core tests at `product-release.test.ts:95-153`; no second runtime record in scoped searches                                                                        | Core test/typecheck PASS                                | PASS   | Live deployed release not established                     |
| R2 Closed maturity stages and public labels (3)     | Exactly six stages, exhaustive labels, Stable for GA, unknown stage rejected                  | `product-release.ts:1-18,37-40,91-98`                                       | Core tests `:24-53`; `satisfies Record<ProductMaturityStage,string>`                                                                                               | Core test/typecheck PASS                                | PASS   | No browser label inspection yet                           |
| R3 Validated and independent Product Version (9)    | Approved grammar, no `v`/build metadata/invalid prerelease, no stage or package inference     | `product-release.ts:35-88`; package manifests                               | Core table cases `product-release.test.ts:56-93,156-175`; source has no manifest input; relevant manifests remain `0.1.0` while Product Version is `0.1.0-alpha.1` | Core test/typecheck PASS                                | PASS   | No package publication/release operation assessed         |
| R4 Deterministic release representation (2)         | Full and compact derived strings, validated before formatting                                 | `product-release.ts:91-109`                                                 | Core tests `product-release.test.ts:136-144,178-190` with independent expected text                                                                                | Core test/typecheck PASS                                | PASS   | Visual presentation belongs to Phase 6                    |
| R5 Public Web footer (1)                            | Existing marketing footer uses full Core value; removes only pilot maturity wording           | `MarketingShell.tsx:1,289-297`                                              | Scoped diff preserves copyright/footer groups/hosting; built HTML contains full label and hosting, with no old pilot literal                                       | Web typecheck/build PASS                                | PASS   | Built HTML is technical evidence, not Browser QA          |
| R6 Backoffice footer and consumer consistency (2)   | Existing authenticated AppFooter uses compact same-source value; no stale version             | `backoffice-frame.tsx:1-8,174-181`; `product-release-footer.test.tsx:22-47` | Scoped diff preserves shell/auth/tenant/navigation; render regression test; both apps import same Core record                                                      | Backoffice test/typecheck/build and architecture PASS   | PASS   | Authenticated real-browser flow belongs to Phase 6        |
| R7 Product maturity versus capability lifecycle (2) | Product metadata neither proves nor derives capability readiness; no deployment authorization | Core four-field type/record; Product Release Knowledge home                 | No capability/flag/readiness input in module or consumers; docs explicitly separate lifecycle and deployment                                                       | Core test, source review, docs/architecture checks PASS | PASS   | No live capability or production assessment was performed |

### All 21 approved scenarios

| ID   | Approved scenario                                  | Technical evidence                                                  | Status |
| ---- | -------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| R1.1 | Current release has four exact values, no ID       | Core record and identity test `:96-113`                             | PASS   |
| R1.2 | Release name remains distinct from stage/version   | Core rename test `:146-153`                                         | PASS   |
| R2.1 | Six stages map to six labels                       | Core stage test `:25-41`                                            | PASS   |
| R2.2 | GA public label is Stable                          | Mapping and Core stage test `:25-41`                                | PASS   |
| R2.3 | Unsupported stage is rejected                      | Core rejection test `:43-53`                                        | PASS   |
| R3.1 | Valid core versions accepted                       | Core valid-case table `:56-69`                                      | PASS   |
| R3.2 | Valid prerelease versions accepted                 | Core valid-case table `:56-69`                                      | PASS   |
| R3.3 | Numeric core leading zero rejected                 | Core invalid-case table `:72-93`                                    | PASS   |
| R3.4 | Missing core version component rejected            | Core invalid-case table `:72-93`                                    | PASS   |
| R3.5 | Malformed prerelease rejected                      | Core invalid-case table `:72-93`                                    | PASS   |
| R3.6 | Canonical version rejects leading `v`              | Core invalid-case table `:72-93`                                    | PASS   |
| R3.7 | Build metadata excluded                            | Core invalid-case table `:72-93`                                    | PASS   |
| R3.8 | Package version changes independently              | Source/manifest review: no manifest input, no package edits         | PASS   |
| R3.9 | Prerelease does not determine maturity             | Core independence test `:156-175`                                   | PASS   |
| R4.1 | Full representation derived from record            | Core formatter/test `:136-144`                                      | PASS   |
| R4.2 | Compact representation derived from record         | Core formatter/test `:136-144`                                      | PASS   |
| R5.1 | Web footer renders full initial representation     | Web source, build, generated HTML inspection                        | PASS   |
| R6.1 | Authenticated Backoffice footer uses compact value | Frame source and footer render test `:22-47`                        | PASS   |
| R6.2 | Both direct consumers use one authority            | Exact `@yuta/core` imports in both app sources                      | PASS   |
| R7.1 | Alpha does not assert blocked capability readiness | No capability status input; Product Knowledge separation            | PASS   |
| R7.2 | Capability readiness cannot promote Product stage  | Pure static record, no promotion code; Product Knowledge separation | PASS   |

## Technical Implementation Contract matrix

| Contract item                                                                                       | Authority                                          | Affected implementation/evidence                                | Check                                                              | Status |
| --------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------ | ------ |
| Phase 1 Core purity, one owner, four fields, six stages, validation/formatting, narrow export       | Approved Design §1; Tasks/TIC Phase 1; Core AGENTS | Core module, index, tests                                       | Source review; 41 tests; typecheck; architecture                   | PASS   |
| Phase 2 Web existing Server Component footer, derived full label, hosting/copyright preserved       | Approved Design §4; Tasks/TIC Phase 2              | MarketingShell only                                             | Scoped diff; typecheck; build; generated HTML                      | PASS   |
| Phase 3 Backoffice Client Component footer, derived compact label, shell/auth/tenant unchanged      | Approved Design §5; Tasks/TIC Phase 3              | Backoffice frame and focused test                               | 984 passed/54 skipped; typecheck; build; architecture; scoped diff | PASS   |
| Phase 4 one Product Knowledge home, minimal routing, scoped registry evidence, readiness separation | Approved Design §7; Tasks/TIC Phase 4              | Product Release home; docs indexes/registry                     | docs:check; isolated add-only diff; targeted formatting            | PASS   |
| Phase 5 exact 7/21 trace, strict validation, current candidate isolation                            | Tasks/TIC Phase 5; YUTA workflow VERIFY            | This evidence and source/hash inventory                         | Requirement/scenario mapping; OpenSpec strict PASS                 | PASS   |
| Phase 5 generated types and focused/broader technical checks                                        | Tasks/TIC Phase 5; Development Workflow            | Six Next generated type sets, Core/Web/Backoffice and workspace | typegen, tests, typechecks, builds, docs/architecture              | PASS   |
| Phase 5 repository-wide formatting gate                                                             | Tasks/TIC Phase 5 verification matrix              | Shared checkout                                                 | `pnpm format:check` exit 1, 82 warnings                            | FAIL   |

UI/UX advisory classification remains `UI_UX_PRO_MAX_USAGE: OPTIONAL`,
external advisory `NOT USED`, per approved Analysis/Design. No external query,
installation, or advisory evidence was used as verification authority.

## Commands and supported claims

All commands ran in `D:\working\yuta\yuta-resto` unless the filter selected a
package. A command result supports only the claim in its row.

| Command or inspection                                                                                                        | COMMAND_RESULT                                                                       | CLAIM_SUPPORTED                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- |
| `pnpm --filter @yuta/core test`                                                                                              | exit 0; 2 files, 41 tests passed                                                     | Core metadata, stage mapping, grammar, and format cases                                 |
| `pnpm --filter @yuta/core typecheck`                                                                                         | exit 0                                                                               | Core types and public export compile                                                    |
| `pnpm typegen:next`                                                                                                          | exit 0; six apps, each 4/4 fresh outputs validated                                   | Fresh Next generated types prerequisite; exclusive preflight found no Next process/lock |
| `pnpm --filter @yuta/web typecheck`                                                                                          | exit 0                                                                               | Web source type compatibility                                                           |
| `pnpm --filter @yuta/web build`                                                                                              | exit 0; compilation, TypeScript, 17/17 static generation                             | Web Server Component/build integration                                                  |
| `pnpm --filter @yuta/backoffice typecheck`                                                                                   | exit 0                                                                               | Backoffice client import type compatibility                                             |
| `pnpm --filter @yuta/backoffice test`                                                                                        | exit 0; 107 files passed, 1 skipped; 984 tests passed, 54 skipped                    | Backoffice regression suite including focused footer test; skipped cases remain skipped |
| `pnpm build:backoffice`                                                                                                      | exit 0; compilation, TypeScript, 7/7 static generation                               | Backoffice client bundling/build integration                                            |
| `pnpm architecture:check`                                                                                                    | exit 0                                                                               | Runtime imports, database URLs, client boundaries, migration baseline checks            |
| `pnpm docs:check`                                                                                                            | exit 0; 36 current documents                                                         | Documentation links/structural consistency                                              |
| `pnpm -r --if-present typecheck`                                                                                             | exit 0; 15/16 workspace projects in scope, all available typecheck scripts completed | Repository TypeScript compatibility after fresh typegen                                 |
| `openspec validate product-version-management-foundation --type change --strict --json --no-interactive`                     | exit 0; 1 change valid, 0 issues                                                     | Strict OpenSpec structural validity, not implementation behavior                        |
| `pnpm format:check`                                                                                                          | exit 1; 82 files warned                                                              | Required repository-wide formatting gate failed; no formatting PASS                     |
| `pnpm exec prettier --check` on Core/Web/Backoffice source and tests, new Product Release home, docs index, Design and Tasks | exit 0                                                                               | Scoped candidate files listed are formatted                                             |
| `pnpm exec prettier --check` on saved pre-Phase 4 Product Knowledge and Registry copies                                      | exit 1 for both                                                                      | Their whole-file formatting failures predated Phase 4                                   |
| `pnpm exec prettier --check` on isolated new Product Knowledge and Registry sections                                         | exit 0                                                                               | The additions themselves are formatted                                                  |

The Web build's retained `index.html` contained two generated occurrences of
`YUTA Alpha · v0.1.0-alpha.1`, zero `Projet pilote`, and two retained hosting
occurrences. A Backoffice client chunk contained `0.1.0-alpha.1`. These are
build artifacts, not real-route or authenticated Browser QA.

`pnpm test:local`, POS/DB migration checks, and a nonexistent Web test script
are not applicable to this bounded no-persistence change. Broader
`pnpm test:cloud` and `pnpm build:cloud` are not the required default; no
concrete cross-module regression arose to expand to them.

## Formatting attribution and remaining limits

The full formatter warned on unchanged OpenSpec skill/archive material,
hash-approved Product Version Analysis/Spec/Gate packets, unrelated dirty
Pointage and workflow material, and the two already dirty Product Knowledge
indexes. The two index files failed full-file formatting before Phase 4; their
new sections pass isolated formatting. Candidate Core/Web/Backoffice source and
tests, the new Product Release home, docs index, Design, and Tasks pass scoped
Prettier. No historical approved artifact or unrelated dirty file was edited
to repair the full-check failure. The required full command still failed.

The unrelated `docs/PRODUCT_KNOWLEDGE.md` line claiming there is no current
OpenSpec change remains stale. It does not contradict the focused Product
Release home or its routing; it is preserved for separate documentation work.

Technical evidence does not establish browser layout, responsive behavior,
accessibility, or the actual authenticated Backoffice browser path. Phase 6
requires real Web and Backoffice routes, screenshots, and canonical QA evidence.
No QA status is assigned here. No deployed version, tenant rollout, external
readiness, or Production Readiness is inferred.

## Disposition and stop

All seven requirement rows and 21 scenario rows have supporting technical
evidence, but the mandatory full formatting check failed. Therefore
`TECHNICAL IMPLEMENTATION COMPLIANCE: FAIL` and `VERIFY: FAIL` are the formal
Phase 5 results under the current TIC. This is a repository baseline gate
failure, not an identified Product Release semantic defect. Phase 5 tasks
5.1–5.4 record completed verification work, including the failed command and
its attribution; their checkmarks do not represent a PASS. Phase 6 tasks
6.1–6.3 remain open. The exact next
Control Tower action is to review this attribution and decide an authorized
resolution of the required formatting gate without rewriting unrelated or
hash-approved history. Phase 6 cannot be authorized under the current failed
VERIFY result. Do not begin Browser QA or prepare Gate 3 from this record.
