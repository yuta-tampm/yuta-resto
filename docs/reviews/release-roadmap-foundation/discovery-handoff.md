# Release roadmap discovery and Control Tower handoff

Change candidate: `release-roadmap-foundation` — not created

Gate: Discovery / Shaping; OpenSpec Gate 1 not reached

Review status: AWAITING_HUMAN_REVIEW

Created: 2026-10-01

Schema: Repository default `yuta-spec-driven`; no new change metadata pinned

Analysis conclusion: NOT_CREATED — pre-change discovery

Sensitive change: Documentation-only proposal; later auth/provider/privacy and
cross-module runtime work requires its own classification and approvals

UI_AFFECTING: NO

BROWSER_QA_REQUIRED: NO

## Decision for the Human / Global Control Tower

Review the [complete proposed roadmap](../../PRODUCT_RELEASE_ROADMAP.md) and
decide its owner, A–C sequencing and bounded exposure/journey direction before
creating an OpenSpec change. This packet does not approve the roadmap, Google
V1, capability availability, a product maturity stage, a version change or a
release. No message has been sent to a Control Tower or Page Chat.

The concrete default proposal is:

1. Use `docs/PRODUCT_RELEASE_ROADMAP.md` as the single Engineering planning
   owner, with Product/engineering ownership and Global Control Tower
   coordination. Existing Product Release identity, capability and operations
   authorities retain their roles.
2. Sequence Foundation -> A Reputation Core for a small invited cohort -> B
   private Direct Feedback -> C assisted Reputation AI, with no calendar dates
   or fixed later-module order. A targets Private Beta only after its readiness
   decision; B/C do not automatically advance maturity.
3. Propose A's existing Today, Avis, minimum establishment profile, OWNER Google
   integrations and permitted access settings. Keep every other module,
   private-feedback and AI slice out of A exposure, including nested sections,
   links, routes and actions. Changes to runtime gates need separate approval.
4. Adopt the proposed HIDE/SHOW/setup/retry/reconnect policy only after Product
   review. Availability remains independent of server authorization, role,
   tenant scope, configuration and temporary health.
5. Explicitly reconcile Google A inclusion (AVIS-01), approver/provider roles
   and ownership (AVIS-05/08), Today source/metric scope, minimum setup and
   operator-assisted cohort access/recovery. Retain B's SAT-01–10 decisions and
   C's provider/Knowledge dependencies without resolving them implicitly.

Choices: accept these bounded directions with explicit answers to unresolved
items; request specified changes; or choose a different owner/sequence and
defer OpenSpec entry. A generic approval cannot settle unanswered Product or
authority questions. Approving documentation direction is not runtime Apply,
release, stage, sync or archive authorization.

## REQUIREMENT_BASELINE

- `AUTHORITATIVE_USER_REQUIREMENT`: current-user supplied request of 2026-10-01,
  “Establish a repository-owned YUTA Release Roadmap,” explicitly classifying
  CROSS_MODULE and authorizing analysis plus a concrete reviewable proposal.
- `HARD_CONSTRAINTS`: verify actual version-foundation state first; locate
  current authority/owner/routes/scripts; preserve capability granularity and
  independent maturity/version/lifecycle/availability; respect Page Chat and
  Control Tower authority; distinguish evidence/direction/proposal/unknown;
  preserve dirty checkout and historical failures; readiness-based milestones.
- `OUT_OF_SCOPE`: runtime/navigation/gates, flags, auth/onboarding,
  provider integration, schema/API, version bumps, deployment, public roadmap
  publication, Product/stage/readiness promotion and gate waiver.
- `SUCCESS_OUTCOMES`: reviewable single destination with Foundation/A audit,
  release matrix, journey states/routes, exposure policy, B/C boundaries,
  provider evidence, readiness criteria, conflicts/unknowns and an exact
  Human decision, plus truthful scoped checks and preserved unrelated files.

This baseline transports the supplied request; it is not an OpenSpec artifact
or a rewrite of an approved capability requirement.

## Authority reviewed and unavailable context

Read root AGENTS, docs index/CURRENT_STATE, Authority Model, Product Knowledge,
Registry and Lifecycle Model; Workflow v3, Automated Workflow, Control Tower
prompt/handoff, OpenSpec activation/normativity policy and run-change skill;
Backoffice/Feedback Web instructions; Authentication/Tenancy; Product Release,
Identity–Access, Establishment/Restaurant Knowledge, Reputation including
Satisfaction/Expérience client, Today; Deployment/Production Readiness,
Documentation Policy and OpenAI eligibility. Inspected current auth/session,
membership selection/recovery, shell/navigation, Today, profile composition,
inbox/drafts, Google OAuth/discovery/binding, permissions, contracts/repository
and relevant test definitions. Consulted official Google documentation linked
in the roadmap on 2026-10-01.

Live Page Chat histories, a selected/verified Control Tower, provider console,
private Google approvals/configuration/quotas, actual customer cohort, live
deployment and monitoring/recovery evidence were unavailable to this audit.
No requirement is treated as absent because that context was unavailable.
Repository authority cutovers are scope-bound; unmigrated scopes keep their
Page Chat authority. The Satisfaction supplemental Human-exception cutover
does not erase strict delta fresh-agent BLOCKED/formal PASS NO.

Prior memory was used only to locate version-foundation evidence. The status,
identity, archive, approval records and commits were rechecked in this checkout;
memory is not current Product or execution authority.

## Version-foundation result

Repository HEAD at intake: `516e9605ca77e24c3adacf95aafb9501c3438c37`, branch `main`.

Foundation: implemented, approved in recorded packets, synced to its main spec,
archived, knowledge consolidation completed, and committed. Its default/pinned
schema is `yuta-spec-driven`; 22/22 tasks checked. Runtime record remains
`YUTA / ALPHA / 0.1.0-alpha.1 / Foundation`. Recorded Technical VERIFY/local
Browser QA PASS is historical candidate evidence; live release remains
unverified and production-readiness values are not promoted.

Archive:
`openspec/changes/archive/2026-09-27-product-version-management-foundation`.
Recorded Gate 3 approval/archive/knowledge completion: 2026-09-27, respectively
16:31:06, 16:34:01 and 16:45:44 Europe/Paris. Git path history records
`fc63fef5` implementation and `83e9a4c3` foundation completion. The earlier
VERIFY FAIL and formatting limitations remain in historical evidence.

Verified file hashes matched the values in the final review:

| Foundation artifact                  | SHA-256                                                            |
| ------------------------------------ | ------------------------------------------------------------------ |
| Archived proposal                    | `5d924477c3d83fc7f0b5e4fbf657c66f17a9d85b6a1439bbe4e43814ed4bf0dc` |
| Archived analysis                    | `f2721e6a41223b1283e79becbe98f62818580cbfdc6a22550d3199b180256d29` |
| Archived design                      | `e930bdddf01d0bf7b18490d915df9c5b81c2381e4a32b85827b4f40de8e3408c` |
| Archived tasks                       | `8da6cf1be6768e2ce4f10ad0a1a8deee088d1b5b5ba7c228df2d972ad273793b` |
| Archived delta spec                  | `bf3923c420a10918bbd6233a9c3102b3f8da896ee5908e6764b8d2102b69d95d` |
| Main `product-release/identity` spec | `f8344286e86a42362dca4f7c6f5b563da5de6756c83644b0b4baa30aae640a6e` |

## CROSS-MODULE CHANGE HANDOFF

- Origin: direct Human request in Codex; no origin Page Chat identified.
- Impact: `CROSS_MODULE` — release policy spans Identity/Access, Establishment,
  Today, Reputation, private Feedback Web, AI/Restaurant Knowledge, shell and
  operations; future exposure has server/provider/privacy implications.
- Proposed coordination owner: Global Control Tower / YUTA Product and
  engineering; confirmation pending. Exact Control Tower title/URL: UNKNOWN.
- Data owners: `packages/db-cloud` for scoped cloud records; Reputation owns
  feedback/replies/connectors, Establishment owns profile/Knowledge,
  Identity–Access owns sessions/membership, Booking retains booking data.
  Today owns presentation projections only. No ownership change proposed.
- Runtime boundaries: Backoffice and independent public Feedback/Web cloud
  apps; Google external; AI consumer/provider unapproved. POS, Site Agent and
  Display remain independent and outside this release path.
- Security: trusted validated session, active membership, organization and
  establishment, existing per-operation roles/entitlements; public verified
  hostname and trusted-client boundary; no browser-derived authority.
- Durable boundaries: existing runtime/database/independent-feedback and
  Today/Establishment/Knowledge ADRs routed through their canonical homes.
  Normative identity, draft-pending, social-link and Knowledge specs retain
  their approved scope; no main spec changed.
- Existing roadmap OpenSpec change: NO in active list; suggested name unused.
- Workflow: DISCOVERY / SHAPING; Product/owner/OpenSpec-readiness decision
  pending; Gate 1 not created. No `skip_specs` setting selected.
- Implementation evidence: repository inspection only for finer release
  claims; no new runtime implementation. Technical VERIFY: NOT_RUN.
- QA: no new Browser QA; documentation applicability is non-UI. Historical
  draft/identity PASS and configured Google QA BLOCKED remain separate.
- Post-Apply checkpoints/iteration ledger: NOT_APPLICABLE; no new change or
  Apply. No retry budget, assertion, Human Product validation or PASS invented.
- CONFLICT: OpenAI dossier submission description differs between tracker and
  operations dossier; B retains domain/client-address/contact conflicts.
- NEEDS REVIEW: proposed canonical owner; Google A inclusion and publication
  contract; Today/establishment/settings exposure; cohort setup/recovery;
  provider content storage/use; B SAT and C Knowledge/provider decisions.
- Release impact: planning only; zero deployment, production enablement,
  Product identity or lifecycle edits. Calendar targets remain unassigned.

Required next action: Human reviews the concrete roadmap, identifies/selects
the Global Control Tower for coordination if using the bridge, and obtains an
explicit owner/strategy/readiness decision plus answers to the affected Product
questions. Do not create or continue an OpenSpec change before that decision.
Then a separately bounded documentation request may enter Proposal/Analysis
and Gate 1 using current CLI-resolved instructions. Gates remain sequential.

This stop follows the
[run-change skill](../../../.agents/skills/yuta-run-change/SKILL.md):
“If behavior, ownership, authorization, compatibility, acceptance criteria, or
another material boundary remains ambiguous after applicable shaping, ask
before creating the change.” The
[handoff template](../../chatGPT/YUTA_CONTROL_TOWER_HANDOFF_TEMPLATE_V3.md)
also says, “Do not create or continue an OpenSpec change until Control Tower
explicitly decides that the change is ready to enter OpenSpec.” Owner and
release-specific Product reconciliation have not yet been decided; the draft
is authorized preparation, not bypassed OpenSpec planning or Apply.

## Diff, checks and preservation evidence

Authorized attributed files only:

- `docs/PRODUCT_RELEASE_ROADMAP.md`: new proposed single destination; complete
  exact draft is available at the linked file, with explicit PROPOSED status.
- `docs/README.md`: date and two proposal/review links under a distinct
  release-planning-proposal heading; current capability claims unchanged.
- `docs/reviews/release-roadmap-foundation/discovery-handoff.md`: this current
  evidence/decision packet, not canonical capability or gate authority.

The exact index change replaces `Last updated: 2026-09-29` with
`Last updated: 2026-10-01` and inserts the proposal section before Architecture.
The full draft and index change are reviewable without approving runtime work.
No scripts, current-state/Registry lifecycle rows, capability specs or archived
foundation artifacts are edited. All ten pre-existing dirty tracked/untracked
Pointage/dependency paths were hashed before this edit; their final comparison
is reported below.

### Executed commands and outcomes

| Exact command                                                                                                                                                                                                 | Result                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `openspec status --change product-version-management-foundation --json`                                                                                                                                       | Exit 1, JSON `change_error`: active change absent. Archive/artifacts/finalization were separately verified; this is expected for the archived change.                   |
| `openspec status --change release-roadmap-foundation --json`                                                                                                                                                  | Exit 1, JSON `change_error`: proposed name absent; no active change created.                                                                                            |
| `openspec list --json`                                                                                                                                                                                        | Exit 0; nearest root `D:\working\yuta\yuta-resto`; neither named change is active.                                                                                      |
| `git log -6 --format='%h %ad %s' --date=iso-strict -- packages/core/src/product-release.ts docs/features/product-release/README.md openspec/changes/archive/2026-09-27-product-version-management-foundation` | Exit 0; foundation implementation/completion commits found.                                                                                                             |
| `git merge-base --is-ancestor fc63fef5 HEAD` and `git merge-base --is-ancestor 83e9a4c3 HEAD`                                                                                                                 | Each exit 0; both commits belong to the audited HEAD ancestry.                                                                                                          |
| `pnpm exec prettier --write docs/PRODUCT_RELEASE_ROADMAP.md docs/README.md docs/reviews/release-roadmap-foundation/discovery-handoff.md`                                                                      | Exit 0; scoped authoring format only.                                                                                                                                   |
| `pnpm docs:check`                                                                                                                                                                                             | Exit 0; `Documentation consistency check passed (36 current documents).`                                                                                                |
| `pnpm architecture:check`                                                                                                                                                                                     | Exit 0; runtime imports, database URLs, client boundaries and migration baselines valid.                                                                                |
| `pnpm -r --if-present typecheck`                                                                                                                                                                              | Exit 0; workspace typecheck completed, including Backoffice; no source/runtime repair needed.                                                                           |
| `pnpm format:check`                                                                                                                                                                                           | Exit 1; `Code style issues found in 93 files.` All reported paths are outside these three attributed files. No global formatting repair or acceptance waiver performed. |
| `pnpm exec prettier --check docs/PRODUCT_RELEASE_ROADMAP.md docs/README.md docs/reviews/release-roadmap-foundation/discovery-handoff.md`                                                                      | Exit 0; all three scoped files use Prettier style.                                                                                                                      |
| `git diff --check -- docs/README.md`                                                                                                                                                                          | Exit 0; scoped tracked index diff has no whitespace errors. The two new untracked files are explicitly attributed and covered by scoped Prettier/link/metadata checks.  |
| Scoped Node link/metadata check below, piped from a single-quoted PowerShell here-string to `node --input-type=module`                                                                                        | Exit 0; 143 local links checked, zero missing targets; draft/index metadata valid.                                                                                      |
| `Get-FileHash -Algorithm SHA256 -LiteralPath <each attributed or baseline file>`                                                                                                                              | Artifact hashes below; ten pre-existing dirty file hashes equal the pre-edit baseline, zero mismatches.                                                                 |

The standard docs checker has a fixed 36-document list and does not itself
validate the new draft/handoff. The scoped check below supplies local-link and
draft/index metadata coverage without changing the checker or declaring
roadmap/provider acceptance. Link targets were checked for existence, not full
semantic or live-provider readiness.

Exact scoped check invocation: PowerShell `@'` / `'@` here-string containing
the following source, followed by `| node --input-type=module`:

```javascript
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
const files = [
  'docs/PRODUCT_RELEASE_ROADMAP.md',
  'docs/README.md',
  'docs/reviews/release-roadmap-foundation/discovery-handoff.md',
];
const failures = [];
let checked = 0;
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (!file.includes('/reviews/')) {
    for (const pattern of [
      /^Status:\s*\S+/m,
      /^Visibility: Engineering$/m,
      /^Owner:\s*\S+/m,
      /^Last updated: 2026-10-01$/m,
    ]) {
      if (!pattern.test(source)) failures.push(`${file}: metadata ${pattern}`);
    }
  }
  for (const match of source.matchAll(
    /\[[^\]]*\]\(\s*(<[^>]+>|[^\s)]+)\s*\)/g,
  )) {
    const destination = match[1].replace(/^<|>$/g, '');
    if (/^(https?:|mailto:|#)/.test(destination)) continue;
    const local = destination.split('#')[0];
    if (!existsSync(path.resolve(path.dirname(file), local))) {
      failures.push(`${file}: missing ${destination}`);
    }
    checked++;
  }
}
console.log(
  JSON.stringify({ files, localLinksChecked: checked, failures }, null, 2),
);
if (failures.length) process.exitCode = 1;
```

Reviewed proposed content hashes (exact bytes, lowercase SHA-256):

| Attributed artifact               | SHA-256                                                            |
| --------------------------------- | ------------------------------------------------------------------ |
| `docs/PRODUCT_RELEASE_ROADMAP.md` | `952e8a4cf9f69bebb9edd7fccdde3804aba7729dd8231e9bd082a95c6af9fba2` |
| `docs/README.md`                  | `839d4ed61b2fef3803a02007b34b98503973193ff9ff4b9403ce5b5482a2808b` |

This packet does not hash itself. Recompute the proposed content hashes before
any later owner/direction review; any revision needs review of its actual bytes.
The original index SHA-256 was
`707f6e38dad79f738876e7ff0db73438dde8ea8c14865671e19c24c18f7d615d`.

Unrelated dirty-file preservation baseline (pre-edit and post-check identical):

| Path                                                                              | SHA-256                                                            |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/package.json`                                                    | `3c6210bac030d633cc103dda98e17f580acc79bf794baf2a0d8c59f5b6a09a19` |
| `apps/backoffice/scripts/pointage-manual-test.ts`                                 | `09c2d7ff6ff494b8aa515ddf6bc9908ad70e2dfb3c3f329b968b8f3c2d962f3c` |
| `apps/backoffice/test/helpers/pointage-raw-clocking-launcher.ts`                  | `7a073f47371f8a200d4e34363f7bbabc1c195386c0eae3d938b4d3ec9f947707` |
| `apps/backoffice/test/pointage-manual-test.test.ts`                               | `c28b747d33824f2a6680fdeadea6f6a67cd541d3a4d18fde2200d4fd14158923` |
| `docs/operations/LOCAL_DEVELOPMENT.md`                                            | `94bde5e68165921e95148ee659e08e89bbf02cd987e2705f29bf5399ab3b52d1` |
| `docs/reviews/pointage-manual-test-environment/02b-design-review.md`              | `2417df8d5294328af3bb55c0cc21a2ec4882a93bfc91dd1166f94a8213b72b36` |
| `docs/reviews/pointage-manual-test-environment/02c-implementation-plan-review.md` | `5c8aa459f2a2790e52c92d99d3c971b8ff3cc47d26e379bdf1e62c1b6b80d3e7` |
| `docs/reviews/pointage-manual-test-environment/apply-evidence.md`                 | `7acf8e33696cfce160d6435e41dc91d4dd31449fc469035f7549f4065f51e0be` |
| `openspec/changes/pointage-manual-test-environment/tasks.md`                      | `243dd847fde2f9b9eee7b3f4874ef671eb3a7e12ef4846f2c501d7fe27cdad7c` |
| `pnpm-lock.yaml`                                                                  | `c007d66fc5e2a28997fbef166a63f203c576cca02a342f82866dd7ec56745835` |

### Skipped checks and limits

- `pnpm test:cloud`, `pnpm test:local`, targeted DB/provider integration tests
  and `pnpm build:cloud`: not run; no runtime behavior/source changed and this
  Discovery draft does not require runtime acceptance. DB test files inspected
  require their separate explicit environment opt-in; no DB was accessed.
- Browser QA: NOT_APPLICABLE to this documentation-only diff; future runtime
  UI changes still require their own representative real Browser QA.
- Strict new-change validation, Technical VERIFY, later gate packets, sync,
  archive and knowledge/lifecycle promotion: not run/reached; no new OpenSpec
  change exists. Existing foundation evidence was read and hashed only.
- Lint: no root lint script exists in inspected manifest; no lint claimed.
- No provider request, account change, credential readout, email/Slack/Control
  Tower transmission, production probe, commit, push or deployment performed.

Current workflow status: DISCOVERY_SHAPING_AWAITING_HUMAN_CONTROL_TOWER_DECISION.

Exact next approval: accept/revise the proposed documentation owner and roadmap
direction, explicitly reconcile the named release-specific Product decisions,
and record Global Control Tower OpenSpec strategy/readiness. This is not Gate 1,
runtime Apply, Product stage, version bump, release or deployment approval.
