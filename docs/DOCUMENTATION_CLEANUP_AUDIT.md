# YUTA Documentation Cleanup Audit

Status: PROPOSED FOR REVIEW

Visibility: Engineering

Owner: YUTA product and engineering

Audited: 2026-08-27

## 1. Executive summary

This audit reviewed the 334 Markdown files that existed under `docs/` before
this output was created. The corpus contains 335 Markdown files when this audit
itself is included. The classification counts below cover the 334 pre-existing
files exactly once.

The largest group is `docs/ui/`, with 277 files. Of those, 252 are under
`docs/ui/pages/`, including the page-pack index, 18 page packages, 108 phase
prompt files, and 143 other page-specific README, product, interaction,
implementation, design, acceptance, and reference records. These are mostly UI
delivery or historical evidence, not duplicate Product Knowledge authority.

The main cleanup opportunities are:

- correct stale routing and pre-approval wording in the three current indexes;
- slim `CURRENT_STATE.md` from an 832-line summary with substantial phase
  chronology into a current routing/status summary;
- move completed Knowledge Normalization task instructions and the superseded
  initial Knowledge Audit out of the active reading path while preserving
  provenance;
- record the resolved Generated Snapshots treatment for byte-identical
  page-pack prompts: they remain sealed local historical execution inputs; and
- review the public-booking and POS master specifications, both of which retain
  unique product intent while identifying some architecture as superseded.

The main risk is removing or merging evidence that still serves a different
authority role. Product Knowledge Homes, accepted decisions, architecture,
page-pack as-built evidence, task provenance, and executable/tooling
dependencies must not be treated as interchangeable merely because their text
overlaps.

There is no safe `DELETE` candidate in the current evidence. Seven exact-content
hash groups exist, but Steps E1-E3 resolved their role: the approved Generated
Snapshots topology requires six sealed local prompt snapshots in each page
package, and the completed provenance migration proves all 19 originally
flagged copies as historical snapshots. They are `KEEP`, not duplicate-content
cleanup targets. Git history alone is also not yet an approved substitute for
task provenance in this normalization series.

## 2. Cleanup principles

- Classify by authority, current role, unique information, references, and
  tooling dependencies—not by age, size, phase number, or file count alone.
- Keep the approved Personnel, Today, Establishment, Identity / Access, Site
  Agent, and Display homes as current Product Knowledge entry points.
- Preserve accepted ADRs and durable architecture unless an explicit
  superseding decision exists.
- Treat page packs as UI delivery, implementation, design, and QA evidence;
  they do not become disposable when a Product Knowledge Home exists.
- Treat task documents as provenance rather than current product truth.
- Prefer `UPDATE` or `ARCHIVE` over `DELETE` when a file contains unique
  context, evidence, or decision history.
- Keep byte-identical generated snapshots when their independent page-pack
  provenance and execution role are established; content identity alone does
  not authorize merge or deletion.
- Do not use Git modification time as lifecycle evidence. This audit used
  content, current routing, approved status, inbound references, Git tracking,
  exact SHA-256 content hashes, and documented tooling rules.

## 3. Classification summary

Methodology: each of the 334 pre-existing Markdown files receives one primary
classification. Groups are counted by their member files. The original audit
counted one required anchor in each of seven exact-hash groups as `KEEP` and the
other 19 byte-identical files as `NEEDS REVIEW`. Steps E1-E3 subsequently
approved and implemented Generated Snapshots and migrated provenance for all 18
packs. All 19 original candidates are now proven structurally required
historical snapshots and are reclassified `KEEP`. The audit output itself is
not included.

| Classification |   Count | Main reason                                                                                                                                |
| -------------- | ------: | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `KEEP`         |     317 | Current authority, approved Product Knowledge, sealed UI snapshots, required structure, operational guidance, or unique delivery evidence. |
| `UPDATE`       |       4 | Current routing or summary role is valid, but wording, status, or chronology is stale.                                                     |
| `MERGE`        |       0 | Generated snapshots are not merge candidates; no other merge is safe without resolving authority and unique evidence.                      |
| `ARCHIVE`      |      11 | Ten completed normalization tasks plus the initial audit retain provenance but are no longer current authority.                            |
| `DELETE`       |       0 | No candidate satisfies the required evidence threshold.                                                                                    |
| `NEEDS REVIEW` |       2 | Two master product specifications retain the original authority-review classification; unrelated areas are not re-audited here.            |
| **Total**      | **334** | All pre-existing Markdown files are classified once.                                                                                       |

Breakdown used to verify the total:

| Area                    |  `KEEP` | `UPDATE` | `ARCHIVE` | `NEEDS REVIEW` |   Total |
| ----------------------- | ------: | -------: | --------: | -------------: | ------: |
| `docs/ui/`              |     276 |        1 |         0 |              0 |     277 |
| `docs/tasks/`           |       2 |        0 |        10 |              0 |      12 |
| All other `docs/` paths |      39 |        3 |         1 |              2 |      45 |
| **Total**               | **317** |    **4** |    **11** |          **2** | **334** |

## 4. High-confidence actions

These are proposals only. No action is executed in this audit.

| Path / group                                                                                                                                           | Classification  | Reason                                                                                                                                                                                                                         | Authority impact                                                                                      | Confidence |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ---------- |
| `docs/features/{personnel,today,establishment,identity-access}/README.md`, `docs/products/pos/site-agent/README.md`, `docs/products/display/README.md` | `KEEP`          | All six homes are approved current Product Knowledge entry points.                                                                                                                                                             | Preserves the most specific broader Product Knowledge/context authority.                              | High       |
| `docs/architecture/*.md`                                                                                                                               | `KEEP`          | The six documents describe current runtime, data, tenancy, identity, and authentication boundaries.                                                                                                                            | Preserves durable architecture and security context.                                                  | High       |
| Accepted `docs/decisions/ADR-001` through `ADR-006`                                                                                                    | `KEEP`          | No ADR identifies any of these accepted decisions as superseded.                                                                                                                                                               | Preserves highest-authority durable decisions.                                                        | High       |
| `docs/README.md`                                                                                                                                       | `UPDATE`        | Its universal authority order starts with `CURRENT_STATE.md` and places accepted decisions fifth, conflicting with the approved question-specific Authority Model.                                                             | Routing-only correction should point readers to `AUTHORITY_MODEL.md`; it must not invent a new order. | High       |
| `docs/PRODUCT_KNOWLEDGE.md`                                                                                                                            | `UPDATE`        | It remains `Proposed`, calls approved Site Agent and Display homes “Proposed canonical,” and says the repository still lacks the authority model that is now approved.                                                         | Restores this file to a truthful routing layer without copying product rules.                         | High       |
| `docs/ui/pages/README.md`                                                                                                                              | `UPDATE`        | Its Formalités summary still says Phase 5 product decisions remain proposed, while the current approved Personnel sources record the bounded decisions more precisely. Its dated backlog also needs reconciliation.            | Keeps page-pack routing current; does not promote UI evidence to Product Intent authority.            | High       |
| `docs/CURRENT_STATE.md`                                                                                                                                | `UPDATE` / slim | It is a useful overall summary, but 832 lines and 83 Phase/Wave/F03–F08 marker lines mix current state with extensive delivery chronology already held by Product Knowledge Homes and page packs.                              | Preserve current cross-product summary; route detailed history instead of deleting it.                | High       |
| `docs/archive/knowledge-normalization/KNOWLEDGE_AUDIT.md`                                                                                              | `ARCHIVE`       | It is the 623-line initial normalization audit. Its questions led to approved Authority, Lifecycle, Registry, and Product Knowledge outputs; before archive execution, routing still treated it as an unresolved prerequisite. | Historical evidence remains searchable but must no longer override approved models.                   | High       |
| Ten completed task files under `docs/archive/knowledge-normalization/tasks/`                                                                           | `ARCHIVE`       | Their outputs are complete and approved. They have provenance value but are not current Product Knowledge.                                                                                                                     | No product authority is removed; archive preserves the normalization trail.                           | High       |
| `docs/tasks/TASK_TEMPLATE.md` and `docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md`                                                       | `KEEP`          | The first is the current task template; the second is the active audit instruction.                                                                                                                                            | Preserves current process authority.                                                                  | High       |

No high-confidence action is `DELETE`.

## 5. Product Knowledge / feature docs

| Path / group                                                                                 | Classification | Recommendation                                                                                                                                                                                                       |
| -------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Six approved Product Knowledge Homes                                                         | `KEEP`         | Keep in place and route product questions to them before broad summaries or page packs.                                                                                                                              |
| `docs/features/public-website/README.md`                                                     | `KEEP`         | Current public-site scope and the independent feedback boundary are already reconciled.                                                                                                                              |
| `docs/features/public-booking/README.md` and `STATUS.md`                                     | `KEEP`         | Continue separating current bounded implementation from remaining work/readiness.                                                                                                                                    |
| `docs/features/public-booking/PRODUCT_SPEC.md`                                               | `NEEDS REVIEW` | It retains unique broader/future product requirements, but must be reviewed for a clean separation from architecture sections already marked superseded. Do not delete or merge it until unique intent is mapped.    |
| `docs/features/reputation/README.md` and `STATUS.md`                                         | `KEEP`         | The pair separates current product boundary from remaining provider/synchronization work.                                                                                                                            |
| `docs/products/pos/README.md`, `USER_GUIDE.md`, `OFFLINE_STRATEGY.md`, and `QA_CHECKLIST.md` | `KEEP`         | They have distinct current product, operator, resilience, and verification roles.                                                                                                                                    |
| `docs/products/pos/PRODUCT_SPEC.md`                                                          | `NEEDS REVIEW` | It contains durable POS product intent but explicitly says architecture sections are superseded. Review whether to update in place or split current intent from historical architecture without losing requirements. |
| `docs/PRODUCT_KNOWLEDGE.md`                                                                  | `UPDATE`       | Finalize it as current routing, remove pre-approval warnings, and keep authority links rather than duplicated rules.                                                                                                 |
| `docs/MODULE_REGISTRY.md`                                                                    | `KEEP`         | It is the approved central product/module/capability index and should remain a routing/status registry, not a product spec.                                                                                          |

No approved Product Knowledge Home is proposed for merge, archive, or deletion.

## 6. UI page-pack audit

### Inventory and current role

`docs/ui/pages/` contains 252 Markdown files:

- one page-pack index;
- 18 page-package directories;
- 108 phase prompts (`18 × 6`); and
- 143 README, scope, interaction, implementation, design, acceptance, legal,
  audit, and reference metadata files.

The 18 current package directories are:

- Backoffice: `backoffice-equipe-salaries`,
  `backoffice-equipe-registre-personnel`,
  `backoffice-equipe-formalites-personnel`,
  `establishment-general-information`, `hours-services`, and `today`;
- POS: `pos-orders-home`, `pos-order-entry`, `pos-order-detail`,
  `pos-order-items`, `pos-kitchen`, `pos-management-home`,
  `pos-management-users`, `pos-management-catalog`,
  `pos-management-combos`, `pos-management-printing`,
  `pos-management-establishment`, and `pos-management-reports`.

The package README and non-prompt evidence should remain `KEEP` for now. Many
files record approved interaction scope, as-built behavior, QA, device limits,
or production blockers not duplicated by Product Knowledge. Phase history is
not a default source for agents, but it remains useful delivery evidence.
Agents should read the package README and current product source first, then
open phase evidence only when the question requires it.

`docs/ui/pages/README.md` is `UPDATE`: it remains the route/page routing layer,
not Product Knowledge authority.

### Exact duplicate prompts — E4 final classification

The original SHA-256 audit found seven exact-content groups involving 26 files
and counted 19 files beyond one anchor per group as cleanup candidates. Steps
E1-E3 resolved the topology ambiguity and migrated provenance without changing
any prompt body. E4 now classifies those exact 19 candidates:

| Exact-content group                                                                         | Files in group | Originally flagged copies | E4 classification | Provenance outcome                                               |
| ------------------------------------------------------------------------------------------- | -------------: | ------------------------: | ----------------- | ---------------------------------------------------------------- |
| Template `05_VISUAL_QA` plus Registre and Formalités snapshots                              |              3 |                         2 | `KEEP`            | Registre and Formalités snapshots are `PROVEN`.                  |
| Template `00_REPOSITORY_ANALYSIS` plus Formalités and POS Catalog snapshots                 |              3 |                         2 | `KEEP`            | Formalités and Catalog snapshots are `PROVEN`.                   |
| Template `02_COMPONENT_REFACTOR` plus Printing, Registre, Formalités, and Catalog snapshots |              5 |                         4 | `KEEP`            | All four local snapshots are `PROVEN`.                           |
| POS Printing and POS Catalog `05_VISUAL_QA` snapshots                                       |              2 |                         1 | `KEEP`            | Both preserve the `49e42581` historical cohort and are `PROVEN`. |
| Template `01_VISUAL_BASELINE` plus Registre and Formalités snapshots                        |              3 |                         2 | `KEEP`            | Registre and Formalités snapshots are `PROVEN`.                  |
| Template `03_INTERACTIONS` plus Printing, Registre, Formalités, and Catalog snapshots       |              5 |                         4 | `KEEP`            | All four local snapshots are `PROVEN`.                           |
| Template `04_DATA_INTEGRATION` plus Printing, Registre, Formalités, and Catalog snapshots   |              5 |                         4 | `KEEP`            | All four local snapshots are `PROVEN`.                           |
| **Total**                                                                                   |         **26** |                    **19** | **19 `KEEP`**     | **0 of the original 19 remain `NEEDS REVIEW`.**                  |

Byte-identical generated snapshots are intentional provenance artifacts, not
duplicate-content cleanup targets. Canonical templates generate new packs;
local page-pack prompts remain sealed historical execution snapshots. A later
template change does not update old packs, duplicate bodies are acceptable, a
snapshot hash mismatch is an error, and the validator never auto-repairs.

The migration separately records 86 prompts with `NEEDS_REVIEW` provenance.
That status means only that their historical origin is not fully proven. Their
bodies remain sealed snapshots and are not stale-content, merge, regeneration,
deletion, or other cleanup candidates.

### Historical phase evidence

Do not bulk-archive page-pack phase files. A later page-pack-specific batch may
mark individual completed prompts, interim design handoffs, or superseded
phase plans as historical, but only after its README identifies the final
as-built sources and current tooling no longer requires the file in place.
Reference metadata, accepted design evidence, legal-review briefs, acceptance
checklists, and final QA records should default to `KEEP` or `ARCHIVE`, never
automatic deletion.

## 7. Task/history audit

| Task group                                                                | Classification | Reason                                                                                                 |
| ------------------------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------ |
| `docs/tasks/TASK_TEMPLATE.md`                                             | `KEEP`         | Current reusable task format and linked from active process docs.                                      |
| `docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md`            | `KEEP`         | Active Step 6.1 instruction.                                                                           |
| `docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md` | `ARCHIVE`      | Completed; the resulting audit and approved normalization outputs preserve the outcome and provenance. |
| Step 1, Step 2, and Step 3 task files                                     | `ARCHIVE`      | Authority Model, Lifecycle Status Model, and Module Registry are approved.                             |
| Step 5.1 through Step 5.6 task files                                      | `ARCHIVE`      | All six Product Knowledge Homes are approved.                                                          |

The ten completed tasks have no current inbound documentation links except the
Knowledge Audit's provenance link to its own task. Lack of inbound links is not
used as deletion authority. Archive them as one normalization-history batch
after the archive policy and target location are approved.

No task is classified `DELETE` because this series is the review trail for the
new authority, lifecycle, registry, and Product Knowledge structure.

## 8. CURRENT_STATE.md recommendation

Recommendation: **UPDATE / SLIM**.

Keep `CURRENT_STATE.md` as the concise cross-product current-state summary and
routing source described by the Authority Model. Do not archive the whole file:
it remains useful for repository-wide product/runtime orientation and gaps.

Slim it by:

- retaining current product/runtime boundaries and a bounded current status per
  major product/capability;
- routing detailed Personnel, Today, Establishment, Identity / Access, Site
  Agent, and Display content to their approved homes;
- routing UI delivery and QA detail to the applicable page-pack README;
- moving long F03–F08, Wave, and Phase chronology to historical delivery
  evidence or archive references rather than repeating it in the summary;
- preserving unresolved readiness and external-dependency statements with
  links to `PRODUCTION_READINESS.md`; and
- verifying every remaining implemented/deployed claim under the Authority
  Model before rewriting it.

The slim operation must not silently change lifecycle assignments, discard
unique decisions, or convert repository implementation into production claims.

## 9. Cleanup candidates requiring review

| Path / group                                                                                   | Proposed action                                                         | Why uncertain                                                                                                                          | Required reviewer/evidence                                                                          |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `docs/features/public-booking/PRODUCT_SPEC.md`                                                 | Update in place or split current intent from superseded architecture    | It still owns unique future requirements; deleting or broad merging risks losing Product Intent.                                       | Product owner plus booking/runtime architecture review and a requirement-by-requirement source map. |
| `docs/products/pos/PRODUCT_SPEC.md`                                                            | Update in place or split current intent from superseded architecture    | Its status explicitly says architecture sections are superseded, but durable POS intent remains.                                       | POS product owner plus runtime/database architecture review and requirement source map.             |
| `docs/archive/knowledge-normalization/KNOWLEDGE_AUDIT.md` and ten archived normalization tasks | Archive in repository or remove from active tree with Git-only recovery | `DOCUMENTATION_POLICY.md` currently favors removing completed tasks, while this normalization series has meaningful review provenance. | Documentation owner decision on archive policy and audit-retention expectations.                    |
| Detailed chronology removed while slimming `CURRENT_STATE.md`                                  | Archive, route to existing page packs, or retain selected milestones    | Some chronology may be the only concise pointer to an implementation wave or production gate.                                          | Owning product/module reviewer and a destination map proving no unique fact is lost.                |
| `docs/operations/OPENAI_PROVIDER_ELIGIBILITY.md`                                               | Keep current or update dated status                                     | Repository text says a response is pending; this audit cannot verify external correspondence.                                          | Dated provider correspondence from the authorized owner; no external request is authorized here.    |

## 10. Proposed execution batches

1. **Index truthfulness only.** Update `docs/README.md`,
   `docs/PRODUCT_KNOWLEDGE.md`, and `docs/ui/pages/README.md` to reference the
   approved Authority Model and approved homes and to remove stale pre-approval
   wording. Run link and documentation checks.
2. **CURRENT_STATE slim plan.** Produce a reviewed section-by-section keep,
   route, and historical-destination map before changing the file. Then make
   one documentation-only slim update.
3. **Normalization-history archive.** After choosing repository archive versus
   Git-only retention, handle `KNOWLEDGE_AUDIT.md` and the ten completed task
   files together, updating all inbound links in the same change.
4. **Product-spec authority review.** Review public-booking and POS master
   specifications separately. Preserve unique Product Intent before removing
   superseded architecture content.
5. **Page-pack prompt topology — resolved in E1-E4.** Generated Snapshots is the
   approved and implemented model. All 19 original byte-identical candidates
   are `KEEP`; no prompt body is consolidated, regenerated, merged, or deleted.
6. **Per-pack historical review.** Audit one page pack at a time for interim
   prompts/plans and final as-built evidence. Never bulk-delete phase files.

Each batch should be independently reviewable and must update links and checks
in the same change. No batch should combine product-status normalization with
file movement or deletion.

## 11. Archive strategy

If repository archives are approved, use a clearly non-authoritative location
such as `docs/archive/<category>/` with one archive README that states:

- all contents are historical/provenance only;
- archive material is not current Product Knowledge, architecture, operations,
  lifecycle, or OpenSpec authority;
- current entry points are `docs/README.md`, `PRODUCT_KNOWLEDGE.md`, and
  `MODULE_REGISTRY.md`; and
- agents should open archive material only for a named historical question.

Organize by role rather than vague versions, for example
`knowledge-normalization/`, `tasks/`, and `ui-delivery/`. Preserve original
filenames or an explicit source-path map so Git history and inbound references
remain understandable. Current indexes must not list archived files as current
documents, though a single provenance link may be retained where useful.

Do not create an archive folder until the documentation owner resolves the
current policy preference for Git-only history versus an in-repository archive.

## 12. Delete policy

A file may be classified `DELETE` in Step 6.2 or later only when all of the
following are evidenced:

1. it has no current authority role;
2. it contains no unique product, architecture, security, operations,
   readiness, decision, QA, or provenance information;
3. it is not needed for audit/history retention;
4. no current documentation links to it;
5. no code, test, script, generator, checker, or tooling layout depends on it;
6. any durable content has been incorporated into the correct current source;
7. Git history can recover it unambiguously;
8. the owning reviewer confirms the bounded scope; and
9. confidence is High.

Exact duplication, completion, age, an untracked state, or the existence of a
new Product Knowledge Home is insufficient on its own. A deletion batch must
list exact paths, link/tooling checks, retained authority, and recovery commit.

## 13. Readiness for cleanup execution

Status: READY WITH REVIEW

### Safe first batch

- Correct routing and pre-approval wording in `docs/README.md`,
  `docs/PRODUCT_KNOWLEDGE.md`, and `docs/ui/pages/README.md` only.
- Keep all approved Product Knowledge Homes, accepted ADRs, architecture,
  page-pack evidence, and OpenSpec files unchanged in that first batch.
- Run `pnpm docs:check`, targeted formatting, and a full inbound-link check.

### Blocking questions

- Should completed normalization tasks and the initial audit live in a
  repository archive, or should Git remain their only historical store?
- Page-pack prompt topology is no longer a blocking question: canonical
  templates generate new packs, while existing local prompts remain sealed
  snapshots even when bodies are identical or provenance remains unresolved.
- Should the booking and POS master specifications be updated in place or
  separated into current product intent and historical architecture?
- Which detailed `CURRENT_STATE.md` milestones have unique cross-product value
  and therefore need an explicit archive or destination link?
- Has the external OpenAI provider status changed since the dated repository
  evidence?

No move, merge, archive, delete, mass rewrite, code change, or OpenSpec change
is ready without the applicable review above.

## 14. Document status

Status: PROPOSED FOR REVIEW
