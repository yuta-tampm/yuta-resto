# YUTA UI Prompt Topology Review

Status: APPROVED

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-28

## 1. Executive summary

The current page-pack topology requires every package to contain six local
phase prompts under `prompts/`. The generator recursively copies the canonical
page template, including those prompts, into a new stable page-pack directory.
The validator and tests require the six filenames to exist, but they do not
record or verify template version, source hash, snapshot hash, generation
commit, immutability, or later local divergence.

The 19 byte-identical prompt copies identified by the Documentation Cleanup
Audit are therefore not proven accidental duplication. They follow the current
protocol structure and, for generated packs, the current copy behavior. They do
create maintenance and interpretation risk because the repository does not say
whether a local prompt is an immutable historical input, a mutable copy that
should follow the template, or a deliberate page-specific variant.

The representative packs demonstrate all three relevant states:

- local prompts still byte-identical to the current canonical template;
- deliberate page-specific prompts, such as the Registre Phase 0 prompt and
  the POS Catalog visual-baseline prompt; and
- a shared older cohort, such as POS Printing and POS Catalog Phase 5, that is
  byte-identical within the cohort but differs from the current template.

No reviewed evidence proves an accidental duplicate. Some divergent files may
be intentional historical inputs; others may reflect template drift. Their
provenance cannot be resolved from current content alone.

**Recommendation: `GENERATED SNAPSHOTS` (Option C).** Keep canonical templates
as the source for creating future packs, copy the six prompts into each pack,
record minimal template/snapshot provenance, and treat the resulting local
files as immutable historical execution inputs. Template changes must not
rewrite old packs. Existing duplicate bodies should be preserved and later
marked as snapshots, not merged or deleted.

This review does not change the current protocol, tooling, tests, prompts, or
page packs.

## 2. Current tooling contract

### Required local prompt set

`PAGE_PACK_PROTOCOL.md` requires a local `prompts/` directory containing
exactly the six named phase files used by the documented prompt order:

1. `00_REPOSITORY_ANALYSIS.md`
2. `01_VISUAL_BASELINE.md`
3. `02_COMPONENT_REFACTOR.md`
4. `03_INTERACTIONS.md`
5. `04_DATA_INTEGRATION.md`
6. `05_VISUAL_QA.md`

The protocol says the directory contains one focused instruction per phase and
forbids replacing the set with one large `CODEX_PROMPT.md`. A page README lists
the six local files in execution order and requires review between phases.
Shared UI and application rules remain linked authorities; they are not copied
into each pack. Thus the current package is structurally self-contained for its
phase prompt sequence while still repository-dependent for shared authority.

### Generator behavior

`scripts/ui-pack-tooling.mjs`:

- resolves `docs/ui/templates/page` as the canonical template root;
- recursively copies the complete template into an atomic staging directory;
- populates safe mechanical page metadata;
- renames the staged directory to the stable page-pack destination; and
- refuses to overwrite an existing pack.

Because `prompts/` is inside the canonical page template, all six prompt files
are copied into a new pack. The generator does not write prompt-template
version or hash metadata and does not declare the copied files immutable.

### Validator behavior

The validator:

- requires each of the six local filenames;
- reports `missing-prompt` for an absent phase file;
- reports a monolithic-prompt error when `CODEX_PROMPT.md` attempts to replace
  the six-file set; and
- validates other pack structure and lifecycle metadata independently.

It does not compare prompt content with canonical templates, detect divergent
copies, require provenance, classify local customization, or verify
immutability.

### Test assumptions

The tooling tests:

- assert a generated tree contains `prompts/05_VISUAL_QA.md`;
- delete `prompts/03_INTERACTIONS.md` and expect `missing-prompt`;
- construct legacy fixtures with all six required phase prompts; and
- copy the current canonical template into disposable repositories before
  generator/validator tests.

They do not assert prompt byte identity, source/template hashes, a template
version, generation commit, local-modification policy, or behavior when a
snapshot differs from the current template.

## 3. Duplicate inventory interpretation

The table below uses the Cleanup Audit's definition of “duplicate count”: the
number of byte-identical copies remaining after one anchor is retained. The
seven groups contain 26 files and 19 such copies.

| Prompt group                                                                      | Duplicate count | Current reason                                                            | Harmful duplication?                                                | Notes                                                                                                    |
| --------------------------------------------------------------------------------- | --------------: | ------------------------------------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Template `05_VISUAL_QA` plus Registre and Formalités                              |               2 | Required local phase file copied or retained in each self-contained pack. | Not inherently; provenance is missing.                              | All three are byte-identical to the current template.                                                    |
| Template `00_REPOSITORY_ANALYSIS` plus Formalités and POS Catalog                 |               2 | Generator/template topology places Phase 0 locally in each pack.          | Not inherently; agents cannot tell whether identity is intentional. | Registre and POS Printing have different Phase 0 bodies and are not part of this group.                  |
| Template `02_COMPONENT_REFACTOR` plus Printing, Registre, Formalités, and Catalog |               4 | The same focused Phase 2 instruction is required in all four packs.       | Low content risk, but unmarked duplication adds cleanup noise.      | All five files are byte-identical.                                                                       |
| POS Printing and POS Catalog `05_VISUAL_QA`                                       |               1 | Both appear to preserve the same earlier prompt cohort.                   | Potential drift risk, not safe deletion.                            | They are byte-identical to each other but differ from the current template; provenance needs Git review. |
| Template `01_VISUAL_BASELINE` plus Registre and Formalités                        |               2 | Required local Phase 1 copies still match the canonical template.         | Not inherently; historical version is unrecorded.                   | POS Printing and POS Catalog use different Phase 1 bodies.                                               |
| Template `03_INTERACTIONS` plus Printing, Registre, Formalités, and Catalog       |               4 | Required local Phase 3 instruction copied across packs.                   | Low content risk, but provenance is implicit.                       | All five files are byte-identical.                                                                       |
| Template `04_DATA_INTEGRATION` plus Printing, Registre, Formalités, and Catalog   |               4 | Required local Phase 4 instruction copied across packs.                   | Low content risk, but provenance is implicit.                       | All five files are byte-identical.                                                                       |
| **Total**                                                                         |          **19** | Current protocol and generator require local phase files.                 | **Not a deletion case before topology approval.**                   | Seven anchors plus 19 byte-identical copies.                                                             |

### Exact duplicate versus divergence

- **Byte-identical but structurally intentional:** the seven audited groups
  satisfy the required local six-prompt topology. Their identity alone does
  not make them redundant in the current execution model.
- **Page-specific divergence:** Registre Phase 0 is a concise scope-specific
  re-analysis instruction; POS Catalog Phase 1 explicitly applies its resolved
  shared context and shell/navigation decision. These are not accidental
  duplicates.
- **Potential historical drift:** POS Printing Phase 0/1/5 differs from the
  current template, and its Phase 5 matches POS Catalog Phase 5. Content alone
  cannot determine whether these are intentionally frozen older inputs or
  stale copies.
- **Accidental duplicate:** none is proven by the current protocol, tooling,
  hashes, or representative-pack evidence.

## 4. Evaluation matrix

| Criterion                  | Self-contained snapshots                                                | Canonical templates only                                                           | Generated immutable snapshots                                                             | Hybrid reference + overrides                                                     |
| -------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Provenance                 | Weak unless authors manually record the source/version.                 | Clear current source, weak historical source.                                      | Strong when generation metadata and hashes are recorded.                                  | Complex: provenance spans template plus ordered overrides.                       |
| Historical reproducibility | Good if local files are preserved, but current mutability is ambiguous. | Poor: an old pack resolves through today's template.                               | Strong: the exact executed input remains local and frozen.                                | Medium: requires the old template plus every old override.                       |
| Agent readability          | Strong: one local file per phase.                                       | Medium: agents must leave the pack and may read a newer prompt than the pack used. | Strong: agents execute the local snapshot and use canonical templates only for new packs. | Weak to medium: agents must compose base plus deltas correctly.                  |
| Maintenance                | Repeated manual edits or unresolved divergence.                         | Lowest number of prompt files.                                                     | Moderate: maintain canonical templates and provenance tooling, not old bodies.            | High: base/override semantics must be maintained and taught.                     |
| Drift risk                 | High because it is unclear whether copies should track changes.         | High historical drift; low current duplication.                                    | Low after sealing; template evolution is explicit and does not mutate old packs.          | High unless composition/version rules are rigorous.                              |
| Tooling complexity         | Lowest; approximately the current structure.                            | Moderate: generator, validator, protocol, and readers must switch to references.   | Moderate: hash/version generation and validation are required.                            | Highest: resolution, ordering, conflict, and materialization logic are required. |
| Migration risk             | Low if nothing changes, but ambiguity remains.                          | High: removes required local files and changes historical behavior.                | Low to moderate: preserve bodies and add provenance incrementally.                        | High: every divergent pack needs a correct delta extraction.                     |
| Git diff clarity           | Weak when broad template updates rewrite many packs.                    | Strong for template changes, weak for understanding old executions.                | Strong: template changes affect the template; new packs show a deliberate snapshot.       | Medium: small override diffs but harder semantic reconstruction.                 |
| Page-pack portability      | Strong within the repository and better for historical handoff.         | Weak: pack is unusable without the matching external template revision.            | Strongest practical option: prompt inputs travel with the pack and retain source proof.   | Medium: portable only with the exact base and resolution rules.                  |

## 5. Recommended model

### Option C — Generated immutable snapshots

The canonical source for future phase prompts remains:

`docs/ui/templates/page/prompts/`

Each newly generated page pack should continue to contain all six local prompt
files. The local copy becomes the phase's immutable historical input once
generated/sealed. The pack records which template revision and exact template
hash produced it, plus the final snapshot hash.

When a canonical template changes:

- existing page packs do not change automatically;
- no bulk regeneration occurs;
- the template receives a new explicit revision or source commit;
- new packs use the new revision; and
- a deliberate replacement of an unexecuted snapshot, if ever allowed, is a
  separately reviewed migration with new provenance rather than a silent edit.

Agents working inside an existing pack should read and execute the local
snapshot for the relevant phase, together with the page-pack documents and
higher-authority repository sources. They should read the canonical template
only when creating a new pack, reviewing template evolution, or diagnosing a
recorded provenance mismatch.

Page-specific scope belongs primarily in the pack's Product Scope, Design
Handoff, implementation plan, and other owned evidence. If a prompt must be
specialized before it is sealed, the final local hash and a declared
pre-seal-modification flag preserve that fact. After sealing, local prompt
modification is not allowed; a correction requires an explicit successor
provenance record, not an in-place invisible rewrite.

Under this model, byte-identical local prompts are intentional snapshots, not
cleanup problems. Missing or contradictory provenance remains a review problem;
content identity alone is neither a reason to merge nor a reason to delete.

## 6. Migration impact

No migration is authorized by this review.

| Area                          | Required change if Option C is approved                                                                                                             | Risk                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `PAGE_PACK_PROTOCOL.md`       | Define local phase prompts as generated immutable snapshots; define which local prompt agents execute and when sealing occurs.                      | Medium: lifecycle wording must not conflict with existing update-in-place package rules. |
| `UI_PACK_TOOLING_SPEC.md`     | Specify template revision/hash capture, snapshot hash, generation commit/date, compatibility behavior, and validation severity.                     | Low to medium.                                                                           |
| `scripts/ui-pack-tooling.mjs` | Calculate provenance during creation, populate the chosen metadata location, and validate recorded hashes without overwriting old packs.            | Medium: cross-platform hashing/path behavior and atomic generation must remain safe.     |
| Tooling tests                 | Add exact provenance generation, hash validation, changed-snapshot, compatibility, and no-overwrite cases while preserving current six-file checks. | Medium.                                                                                  |
| Existing page packs           | Preserve every prompt body; add provenance only where the source can be positively established, otherwise mark it unresolved.                       | Medium: retroactive inference can misclassify intentional variants.                      |
| Future page-pack creation     | Continue copying six prompts, then emit and validate provenance before the pack is used.                                                            | Low after tooling is implemented.                                                        |
| Duplicate prompt cleanup      | Reclassify proven copies as intentional snapshots; keep ambiguous cohorts under review. Do not merge/delete bodies merely to reduce file count.     | Low if bodies remain untouched; high if cleanup precedes provenance.                     |

## 7. Existing page-pack treatment

### Proposed treatment for the 19 audited copies

**Primary treatment: `MARK AS SNAPSHOT`.** Do not regenerate, reference away,
merge, or delete any of the 19 copies during topology migration.

For each existing prompt:

1. compare its hash with current and, where needed, historical template hashes;
2. use Git history to identify the source revision or generation commit;
3. record proven provenance without changing the body;
4. mark page-specific or pre-seal modifications explicitly; and
5. use `NEEDS REVIEW` where provenance cannot be positively established.

The current exact-template groups are candidates for straightforward snapshot
annotation, but equality with today's template does not by itself prove when or
how the copy was created. The POS Printing/POS Catalog Phase 5 cohort requires
historical review because it has a shared hash different from the current
template. Divergent page-specific prompts must be preserved as historical
inputs rather than regenerated from the latest canonical template.

After Option C is approved and provenance is recorded, byte-identical files are
intentional historical snapshots. The cleanup inventory may stop calling them
redundant content, while still counting their storage and auditing unresolved
provenance.

## 8. Version and provenance strategy

Use one small prompt-provenance table in the page-pack README rather than a
complex new schema. Record one row per phase prompt because files may come from
different template cohorts.

Minimum fields:

| Field                          | Meaning                                                                                                                                               |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Template source path           | Canonical prompt path used to create the snapshot.                                                                                                    |
| Template revision              | Explicit prompt-template revision, independent when necessary from the page-pack protocol revision.                                                   |
| Template SHA-256               | Hash of the canonical source content used at generation.                                                                                              |
| Snapshot SHA-256               | Hash of the final local prompt body that will be executed.                                                                                            |
| Generation commit or timestamp | Prefer the repository commit; use a dated generation record only when no commit is available.                                                         |
| Local modifications allowed    | `NO` after sealing. Record `YES — before seal` only when a page-specific prompt was deliberately derived before its final snapshot hash was recorded. |
| Provenance status              | `PROVEN`, `PARTIAL`, or `NEEDS REVIEW`; this is provenance metadata, not a product lifecycle status.                                                  |

The tooling should not pretend a working-tree timestamp proves a historical
source commit. Existing packs with insufficient evidence remain `NEEDS REVIEW`
without changing their prompt bodies.

## 9. Execution plan proposal

### Step E2 — Approve and implement the topology contract

- approve Option C and the sealing point;
- update `PAGE_PACK_PROTOCOL.md`, `UI_PACK_TOOLING_SPEC.md`, and the canonical
  template documentation together;
- update generator/validator behavior and tooling tests; and
- keep compatibility explicit for existing packs without provenance metadata.

### Step E3 — Migrate existing pack provenance

- inventory hashes for all existing local phase prompts;
- use current templates and Git history to establish source cohorts;
- add provenance metadata only, without rewriting prompt bodies;
- classify deliberate page-specific/pre-seal variants; and
- leave unresolved origins marked for review.

### Step E4 — Validate and normalize cleanup classification

- run UI-pack tooling tests and validation across every pack;
- verify old packs still execute their local snapshots;
- confirm template changes do not mutate old packs;
- update the duplicate-cleanup classification so proven snapshots are no longer
  deletion/merge candidates; and
- retain ambiguous provenance until separately resolved.

Every step requires separate approval. This review does not begin E2.

## 10. Review validation

- Only `docs/ui/UI_PROMPT_TOPOLOGY_REVIEW.md` is created by Step 6.2E1.
- No prompt, page pack, protocol, tooling specification, script, test, code, or
  OpenSpec artifact is modified.
- The recommendation follows the current six-file protocol, recursive template
  copy behavior, validator rules, and tooling-test assumptions.
- The seven audited exact-content groups still contain 19 byte-identical copies;
  none is merged, regenerated, referenced away, or deleted.
- Representative divergent prompts remain unresolved or page-specific rather
  than being silently treated as stale.

Status: APPROVED
