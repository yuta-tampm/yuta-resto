# Pre-Apply Attribution Manifest

Change: `restaurant-knowledge-validated-knowledge`

Decision: `APPROVED_FOR_APPLY`

Captured: `2026-09-02T23:58:23.8296157+02:00`

## Repository state

- HEAD: `abf6ab6516d3fff151761851561c46db00497f52`
- Exact sorted status: `pre-apply-baseline/git-status-short.txt`
- Shared write allowlist: exactly `14` paths in
  `pre-apply-baseline/shared-file-allowlist.txt`.
- Exact baseline copies: `pre-apply-baseline/files/<repository-relative-path>`.
- Exact lowercase hashes: `pre-apply-baseline/shared-files.sha256`.
- Source-to-copy SHA-256 equality at capture: `PASS (14/14)`.

## New and evidence paths

Five intended non-migration implementation/test files and the conditional
generated SQL/snapshot were all absent before Apply and are recorded as
`MISSING` in `pre-apply-baseline/intended-new-files.txt`.

Future Gate 3/QA evidence paths were absent before this capture and are listed
in `pre-apply-baseline/intended-evidence-paths.txt`. The baseline directory and
this manifest were themselves absent before Task 1.1 created them.

## Migration inventory

The exact pre-Apply SQL/snapshot/journal inventory is recorded in
`pre-apply-baseline/migration-inventory.txt`. The terminal journal entry is
`0015_restaurant_knowledge_communication_identity`; therefore repository
tooling may generate the corresponding next migration only if the immediate
pre-generation recheck still matches.

The exact `_journal.json` bytes are preserved in the 14-file baseline and its
hash is separately recorded in `pre-apply-baseline/journal.sha256`.

## Protected unrelated work

The following unrelated dirty files existed at capture and are protected:

- `apps/yuta-pos/package.json`;
- `docs/products/pos/QA_CHECKLIST.md`.

Their exact lowercase hashes are in
`pre-apply-baseline/protected-existing-files.sha256`. Apply must stop and
investigate attribution if either current hash changes. No other unrelated
dirty path was present in the sorted status.

## Planning integrity

Proposal, Analysis, revised Spec, approved Design, approved Tasks and all three
approved review packets are recorded in
`pre-apply-baseline/planning-and-gates.sha256`. The approved Tasks hash is the
pre-execution value; subsequent checkbox/status changes are workflow tracking,
not Product scope changes.

## Attribution rule

Gate 3 evidence must compare saved baseline copies to current bytes. New files
must be represented as `/dev/null -> current`. Raw HEAD diff is not sufficient.
Implementation and migration diffs must have sorted exact path inventories,
declared path counts equal to actual `diff --git` section counts, forward/apply
and reverse integrity, and lowercase SHA-256. Protected unrelated paths must be
recomputed before every phase boundary and before Gate 3.
