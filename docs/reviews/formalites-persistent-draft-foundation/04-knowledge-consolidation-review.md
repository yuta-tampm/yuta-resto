# Knowledge Consolidation Review

Change: `formalites-persistent-draft-foundation`

Review status: `APPROVED`

Approval source: `explicit current-user instruction`

Approval recorded by: `Codex workflow`

Approved: `2026-09-05T14:56:50.6841896+02:00`

Knowledge byte-integrity revalidation: `APPROVED`

Byte-integrity approval source: `explicit current-user instruction`

Byte-integrity approved: `2026-09-05T15:25:56.8411784+02:00`

Accepted repository representation: `CRLF working-tree bytes`

Semantic patch SHA: `PRESERVED — 2cafb3ef49d6255d0ba94936cdbe640c95884842c2d929f214b0979717759a40`

Formatting-only correction: `APPROVED_AND_APPLIED`

Formatting approval source: `explicit current-user instruction`

Formatting closure: `PASS`

Semantic content: `UNCHANGED`

Created: `2026-09-05T14:27:34.3530756+02:00`

Workflow status: `DONE`

## Classification

Knowledge consolidation: `COMPLETED`

The completed, archived change introduced a bounded employee-connected
persistent CDI preparation draft in the repository. Several current knowledge
sources still state that Formalités is only in-memory, that no durable draft
consumer is wired, or that no durable Formalités schema/data owner exists.
Those statements now conflict with the approved and verified repository state.

This packet proposes only a bounded reconciliation of that durable knowledge.
It does not apply the patch and grants no production authority.

## Completed-change evidence

- Gate 3: `APPROVED` by explicit current-user instruction.
- Technical Implementation Compliance: `PASS — preserved`.
- VERIFY: `PASS — preserved`.
- QA: `PASS — preserved`.
- Tasks: `31/31` complete.
- Approved aggregate implementation/change SHA-256:
  `73688e1e1ca8d02669bf71b07c23401e1fb344b9d1ab3280242350818aaedf9f`.
- Approved delta Spec SHA-256:
  `c83da9a062dbe6b0e6308f0f9e391dc38e3a6335e9c56560063b4d6742eb0850`.
- Approved Design SHA-256:
  `83585641dc2be89282ad5e810c97e23724572ae6aaebe655637b705bf78d5610`.
- Archive location:
  `openspec/changes/archive/2026-09-05-formalites-persistent-draft-foundation`.
- Archived-change strict validation: `12 passed, 0 failed`.
- Synced normative capability:
  `openspec/specs/formalites/persistent-draft-foundation/spec.md`.
- Synced main Spec SHA-256:
  `b4c8077df69c7da638627836255b0a64a3b9b342751964bebe6860183c1b768e`.
- Strict main-spec validation: `11 passed, 0 failed`.
- Production migration, route enablement, deployment, retention operations,
  backup/PITR change, purge and anonymization: `NOT_AUTHORIZED` and not run.

## Sources inspected

- `docs/ui/pages/backoffice-equipe-formalites-personnel/README.md`
- `docs/ui/pages/backoffice-equipe-formalites-personnel/PRODUCT_SCOPE.md`
- `docs/features/personnel/README.md`
- `docs/features/identity-access/README.md`
- `docs/PRODUCT_KNOWLEDGE.md`
- `docs/MODULE_REGISTRY.md`
- `docs/CURRENT_STATE.md`
- `docs/LIFECYCLE_STATUS_MODEL.md`
- `docs/operations/PRODUCTION_READINESS.md`
- `openspec/specs/authorization/formalites/spec.md`
- `openspec/specs/formalites/persistent-draft-foundation/spec.md`
- archived Proposal, Analysis, Design, Tasks, delta Spec and Gate 3 evidence.

The Formalités page pack already describes the as-built development-only
persistent foundation and therefore needs no additional edit. Production
Readiness remains the controlling source for the still-blocked legal, privacy,
template, storage, signature, retention, audit and operational gates.

## Exact proposed target set

| Target                                    | Current SHA-256                                                    | Current bytes | Proposed SHA-256                                                   | Proposed bytes |
| ----------------------------------------- | ------------------------------------------------------------------ | ------------: | ------------------------------------------------------------------ | -------------: |
| `docs/features/personnel/README.md`       | `1eb553ae5f6b2d866c9120a982903d27e3f5bced92b52f76c0ef5f314f1c9c7d` |         23764 | `6ce83060a382745e4d1c2d79109e6a69ec0dd6df22c92aba3d0912b281864c21` |          25784 |
| `docs/features/identity-access/README.md` | `8683fbf189f16fdc31515c7e8bc0133dee78bfb374b73d1fe156caccbd5d591d` |         27624 | `8042656bdf5d54de417ea2157c8f4aa887cffa59ae78ea918d62a8386ae268cb` |          27654 |
| `docs/PRODUCT_KNOWLEDGE.md`               | `6b08e2ec8aa677c5aa5259f9517f35c85eb811f30ca57f8dd4f8d5c68b51aea5` |         18380 | `883c56457c6f01e58272c7386d8e91e188e3d1527c4966edcc54ff0dfb44a9d0` |          18698 |
| `docs/MODULE_REGISTRY.md`                 | `d1a4a3dbe76932ae611dcdbed4c971f49a6ab029582b19715e7226f07d6f14b3` |         69442 | `7696ed73dfaee4b1571eb127b42fd48820dfc363668bcd162cc4d4ccc7e094e7` |          71940 |
| `docs/CURRENT_STATE.md`                   | `69b5c985766f1f2c2389c5592134bda20a9c510b0703d1e63cdca703d8464a4f` |         25058 | `db82dd3d753f43711f9465249031aaf1b8038ccd27e1dbfcbc2712dc55dde497` |          25210 |

No sixth canonical knowledge target is included.

## Exact proposed diff

Artifact:
`docs/reviews/formalites-persistent-draft-foundation/04-proposed-knowledge.patch`

SHA-256:
`2cafb3ef49d6255d0ba94936cdbe640c95884842c2d929f214b0979717759a40`

Size: `65853` bytes.

Inventory: `5` target files, `18` unified-diff hunks, `89` insertions and `70`
deletions. `git apply --check` against the exact current target bytes: `PASS`.

The patch is the complete proposed Knowledge Consolidation change. It must be
applied exactly, without fuzzy reconstruction or unrelated cleanup, only after
explicit human approval of this packet and patch hash.

## Post-apply byte-integrity diagnosis

Diagnosed: `2026-09-05T15:08:18.3030011+02:00`

Root-cause disposition: `RESULT C — EXPECTED_HASH_GENERATION_DEFECT`.

The exact approved patch SHA-256 remains
`2cafb3ef49d6255d0ba94936cdbe640c95884842c2d929f214b0979717759a40`,
and `git apply` applied it successfully to exactly the five approved targets.
All five current working-tree files contain the exact approved output text
after diagnostic-only BOM removal and CRLF/LF normalization. The approved
expected post-apply hashes were calculated from the LF working files in
`D:/working/yuta/.tmp-formalites-knowledge-20260905`, while the actual
repository working tree represents all five tracked text files with CRLF.

### Raw-byte comparison

| Target                                    | Approved expected SHA-256 / bytes                                          | Current SHA-256 / bytes                                                    | Expected EOL | Current EOL | BOM    | Final newline | Classification |
| ----------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -----------: | ----------: | ------ | ------------- | -------------- |
| `docs/features/personnel/README.md`       | `6ce83060a382745e4d1c2d79109e6a69ec0dd6df22c92aba3d0912b281864c21` / 25784 | `a9c56e260b6666fe488929db6b882ab204600dd3d3164130099156c546873479` / 26022 |       238 LF |    238 CRLF | absent | present       | `CRLF_LF_ONLY` |
| `docs/features/identity-access/README.md` | `8042656bdf5d54de417ea2157c8f4aa887cffa59ae78ea918d62a8386ae268cb` / 27654 | `6629981d7360302774bd84397a3c8c6c5430d24280a6364cf6fe34f68b17344e` / 27972 |       318 LF |    318 CRLF | absent | present       | `CRLF_LF_ONLY` |
| `docs/PRODUCT_KNOWLEDGE.md`               | `883c56457c6f01e58272c7386d8e91e188e3d1527c4966edcc54ff0dfb44a9d0` / 18698 | `313f6edce6e4f4aced28eecf5cb44516fd67fbe6490cfc29ee32fce6dccfa368` / 19048 |       350 LF |    350 CRLF | absent | present       | `CRLF_LF_ONLY` |
| `docs/MODULE_REGISTRY.md`                 | `7696ed73dfaee4b1571eb127b42fd48820dfc363668bcd162cc4d4ccc7e094e7` / 71940 | `9457d1dca1fd49aa3b279ab107470eb092a79e1325dbe2b1d87a02d5a34c7858` / 72106 |       166 LF |    166 CRLF | absent | present       | `CRLF_LF_ONLY` |
| `docs/CURRENT_STATE.md`                   | `db82dd3d753f43711f9465249031aaf1b8038ccd27e1dbfcbc2712dc55dde497` / 25210 | `c999f46a1252a8c7a16d2905d9b95dc976a0c6f1445b1ce8c7e7bba182e946dc` / 25376 |       166 LF |    166 CRLF | absent | present       | `CRLF_LF_ONLY` |

Every current file has zero bare LF, zero bare CR and a final newline. Every
expected fixture file has zero CRLF, zero bare CR and the same final newline.
The normalized UTF-8 text comparison is exact for all five targets; each
current normalized SHA-256 equals its approved expected SHA-256.

Git classifies every target as a tracked modified file. `git diff --check`
passes. The current working-tree diff against `HEAD` reports, respectively,
`88/57`, `28/8`, `21/10`, `33/19` and `7/6` added/deleted lines for Personnel,
Identity / Access, Product Knowledge, Module Registry and Current State. These
HEAD-relative counts include the already-approved preimage state; they do not
indicate extra post-approval content. Exact preimage hashes matched before
application, and normalized current output equals the exact approved proposed
output for every target.

### Git text and EOL evidence

- No `.gitattributes` file exists in the repository.
- `git check-attr text eol working-tree-encoding` reports `unspecified` for all
  three attributes on all five targets.
- System Git configuration sets `core.autocrlf=true` from
  `C:/Program Files/Git/etc/gitconfig`; `core.eol` and `core.safecrlf` are
  unset.
- `git ls-files --eol` reports `i/lf w/crlf attr/` for all five repository
  targets.
- The external proposed-output fixture reports `i/lf w/lf attr/` for the same
  five paths. Its five hashes exactly equal the approved expected hashes.

The actual repository representation therefore follows the active Windows Git
working-tree convention. The expected hashes came from LF files overlaid in a
temporary fixture rather than from the repository's CRLF working-tree
representation. The approved patch bytes and semantic approval are unchanged;
the erroneous postimage hash expectation must not be silently replaced.

### Semantic verification

Normalized exact equality with the five approved fixture postimages confirms
that the current repository contains exactly the approved knowledge changes
and no additional semantic content:

- Personnel separates the generic fictional prototype, the persistent CDI
  draft foundation and future generation/signature stages.
- Identity / Access records the durable Formalités consumer while preserving
  independent Formalités and Personnel permissions.
- Product Knowledge routes the synced persistent-draft capability and keeps it
  `DEVELOPMENT_ONLY`.
- Module Registry keeps the generic prototype, persistent draft foundation and
  future generation/signature lifecycle as separate capabilities.
- Current State no longer describes all Formalités state as in-memory and
  keeps production and future stages deferred.

No implementation, schema, migration, normative Spec, archive or production
state changed during this diagnosis.

### Integrity revalidation disposition

- Knowledge patch semantic approval: `PRESERVED`.
- Knowledge patch SHA: `PRESERVED`.
- Post-apply byte integrity: `APPROVED`.
- Knowledge byte-integrity revalidation: `APPROVED` by explicit current-user
  instruction.
- Accepted repository representation: `CRLF working-tree bytes`.
- Knowledge Consolidation: `NOT_COMPLETED_YET`.
- Workflow: `AWAITING_HUMAN_REVIEW` because scoped formatting validation did
  not pass.

## Deferred closure validation result

The approved CRLF representation was revalidated before closure. The following
read-only checks were then run:

- `git diff --check`: `PASS` (exit 0; Git emitted working-tree EOL warnings).
- Scoped repository-default Prettier check for the five Knowledge targets and
  this review packet: `FAIL` (exit 1; all six paths reported).
- Diagnostic scoped Prettier check with `--end-of-line auto`: `FAIL` (exit 1)
  for `docs/features/personnel/README.md`, `docs/MODULE_REGISTRY.md`,
  `docs/CURRENT_STATE.md` and this review packet. Identity / Access and Product
  Knowledge pass when the accepted EOL representation is preserved.
- `pnpm docs:check`: `PASS` — 36 current documents.
- `pnpm architecture:check`: `PASS`.
- `pnpm exec openspec validate --specs --strict`: `PASS` — 11 passed, 0
  failed.
- `pnpm exec openspec validate --archived --strict`: `PASS` — 12 passed, 0
  failed.
- `pnpm exec openspec validate --all --strict`: `PASS` — 12 passed, 0 failed.

No Prettier write or EOL normalization was performed. Because three approved
canonical Knowledge target bytes fail the scoped content-format check and their
exact hashes are protected by the current human approval, the workflow cannot
be marked `DONE` without a separately authorized formatting disposition or
exact replacement bytes/hashes. Repository-wide formatting was not claimed as
passing and the known unrelated formatting debt was not modified.

## Authority classification by target

### `docs/features/personnel/README.md`

Classification: current Module Product Knowledge reconciliation.

The proposal separates the generic in-memory prototype, the now-implemented
bounded persistent draft foundation, and future generation/signature stages. It
records exactly seven Personnel source facts, Formalités-owned draft state,
independent authorization and no Personnel write-back. It does not approve a
template, file, signature, provider, Documents handoff, final retention policy,
or production operation.

### `docs/features/identity-access/README.md`

Classification: current authorization-consumer evidence reconciliation.

The proposal changes only the stale statement that no durable consumer is
wired. It preserves `formalites.read` and `formalites.manage`, OWNER-only grants,
trusted context, system/browser no-bypass behavior and Personnel permission
independence. It adds no permission and changes no grant.

### `docs/PRODUCT_KNOWLEDGE.md`

Classification: routing and bounded current-state reconciliation.

The proposal adds the synced persistent-draft main Spec and distinguishes the
implemented development-only foundation from the generic prototype and future
generated-document lifecycle. It does not make a production or legal claim.

### `docs/MODULE_REGISTRY.md`

Classification: capability decomposition and evidence-backed lifecycle
reconciliation requiring this human Knowledge Review.

The proposal splits the old combined/stale Formalités rows into three bounded
capabilities: generic prototype, persistent draft foundation, and future
generation/signature lifecycle. `APPROVED + IMPLEMENTED + DEVELOPMENT_ONLY` for
the persistent foundation is supported by the approved normative behavior,
current implementation/tests, verified development gate and Gate 3 evidence;
it is not inferred from sync alone. Production Readiness remains `BLOCKED`,
external legal/privacy/retention/operations dependencies remain `BLOCKED`, and
future stages remain `PROPOSED + NOT_STARTED + NOT_ENABLED`.

### `docs/CURRENT_STATE.md`

Classification: repository-wide summary reconciliation.

The proposal replaces the stale in-memory-only summary with the bounded
development persistent state and keeps all future generation, file, signature,
retention and production stages separately gated. It updates no deployment or
production claim.

## Boundary confirmation

The exact proposal:

- does not create a new Product Decision beyond the approved bounded Spec;
- does not change Formalités or Personnel ownership beyond the approved Design;
- does not change permissions, role grants, tenancy, trusted scope or runtime;
- does not modify normative main specs or archived change artifacts;
- does not modify implementation, tests, schema or migration;
- does not promote production Environment, Production Readiness or External
  Dependency;
- does not authorize production migration, route enablement, deployment,
  retention cleanup, purge, anonymization, backup/PITR or legal-hold behavior;
- does not claim legal compliance, approved templates, PDF generation,
  signature, provider integration or Documents handoff; and
- preserves the bounded N4 rule: DRAFT/ABANDONED records remain retained in
  this slice, with no user hard delete or automatic expiry, but without an
  infinite-retention guarantee.

The exact approved patch has been applied to the five canonical targets, but
workflow closure is paused because their working-tree byte hashes differ from
the approved expected LF hashes. No additional canonical knowledge edit has
been made.

## Historical integrity review decision

The exact five-target patch and its semantic content remain approved. Human
review is now required only for the post-apply CRLF working-tree hashes and the
`RESULT C — EXPECTED_HASH_GENERATION_DEFECT` disposition above. Do not mark the
Knowledge Consolidation complete until that bounded byte-integrity review is
approved.

Knowledge review: `APPROVED`

Knowledge byte-integrity revalidation: `APPROVED`

RELEASE_FOLLOW_UP: `NOT_REQUIRED` for this development-only repository change;
any future production consumer or release requires separate authorization and
readiness evidence.

## Final Knowledge closure

- Knowledge Review: `APPROVED`.
- Knowledge byte-integrity revalidation: `APPROVED`.
- Formatting-only correction: `APPROVED_AND_APPLIED`.
- Formatting approval source: `explicit current-user instruction`.
- Formatting diff classification: `TABLE_FORMATTING_ONLY` for all four
  authorized files; semantic assertions `PASS`.
- Accepted EOL: Personnel, Module Registry and Current State `CRLF`; this review
  packet `LF`.
- Scoped Prettier: `PASS` for all six Knowledge closure files.
- `git diff --check`: `PASS`.
- `pnpm docs:check`: `PASS` — 36 current documents.
- `pnpm architecture:check`: `PASS`.
- `pnpm exec openspec validate --specs --strict`: `PASS` — 11 passed, 0
  failed.
- `pnpm exec openspec validate --archived --strict`: `PASS` — 12 passed, 0
  failed.
- `pnpm exec openspec validate --all --strict`: `PASS` — 12 passed, 0 failed.

Final accepted canonical Knowledge hashes:

| Target                                    | Final SHA-256                                                      | Bytes | EOL  |
| ----------------------------------------- | ------------------------------------------------------------------ | ----: | ---- |
| `docs/features/personnel/README.md`       | `5069acd7c3b5571072393c4337c7d31142a8aeb591f486d5daf4f978b129c7a8` | 26044 | CRLF |
| `docs/features/identity-access/README.md` | `6629981d7360302774bd84397a3c8c6c5430d24280a6364cf6fe34f68b17344e` | 27972 | CRLF |
| `docs/PRODUCT_KNOWLEDGE.md`               | `313f6edce6e4f4aced28eecf5cb44516fd67fbe6490cfc29ee32fce6dccfa368` | 19048 | CRLF |
| `docs/MODULE_REGISTRY.md`                 | `3c78451ab4fb5a452d081e82e27f4077f842836ae805b279daa4f0443a86c437` | 72295 | CRLF |
| `docs/CURRENT_STATE.md`                   | `273fc1aae6b8add9eeaa251bb0042a62004c2be4d3df422bb0fefd563848ec16` | 26225 | CRLF |

- Knowledge Consolidation: `COMPLETED`.
- Workflow status: `DONE`.
- Completed: `2026-09-05T16:17:16.8808399+02:00`.
- Production migration, route enablement and deployment: `NOT_AUTHORIZED`.
- Production retention / backup / PITR: `DEFERRED / NOT_AUTHORIZED`.
