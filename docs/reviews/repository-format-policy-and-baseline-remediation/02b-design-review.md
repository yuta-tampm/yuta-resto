# Gate 2b — Repository Format Policy Sensitive Design

## RAM1–RAM8 — REAL repository anchor/mapping sensitive review

DA4_REPOSITORY_ANCHOR_MAPPING_DESIGN_STATUS: AWAITING_GATE_2B_REVIEW.
SENSITIVE_DESIGN_RESULT: PASS — design assessment only, not human approval.
SPECS_CHANGE_REQUIRED: NO. Specs R3/R10 require complete validation, R11 binds
logical evidence and secret safety, Non-goals reserve representation/topology
to Design. No requirement/scenario, implementation or actual authority changed.

Exact ambiguity resolved: producer locator object does not define logical
ownership or host-to-consumer projection identity. RAM separates those layers,
retains producer schema, selects standalone-only layout explicitly, and makes
repositoryAnchorIdentity the approved logical-descriptor digest. Host binding
remains independently approved execution authority outside graph semantics.
RAM5 changes only the two affected DA4 identity constructions; the other 24
fields and exact stable equality/independent dynamic validation remain intact.

### DA4_ANCHOR_MAPPING_SENSITIVE_BYPASS_MATRIX

| Bypass                                  | Mandatory rejection or proof                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Self-bind current root                  | Separate trusted approval of logical anchor, host binding and mapping; SELF_BOUND_REPOSITORY_ANCHOR |
| Synthetic anchor in REAL                | Exact tagged scope, no packet conversion/inheritance; ANCHOR_SCOPE_MISMATCH                         |
| Wrong repository at correct /input      | Original approved host relation AND fixed HEAD/index/source evidence AND delivered inventory        |
| Correct repository writable             | External mount inspect before start; CONSUMER_MOUNT_NOT_READ_ONLY                                   |
| Writable alias                          | Physical alias/ancestor checks and exact mount allowlist; UNAPPROVED_WRITABLE_ALIAS                 |
| Consumer target substitution            | Exact approved /input plus consumer contract; HOST_CONSUMER_MAPPING_MISMATCH                        |
| Host locator drift                      | Same host binding within bracket; new binding requires independent review                           |
| gitDir/commonDir/index mismatch         | Standalone layout checks plus pinned producer and raw index binding                                 |
| Linked worktree ambiguity               | GIT_LAYOUT_REVIEW_REQUIRED; no linked support inferred                                              |
| Path traversal                          | Exact safe relative projection paths; validate all parents before content access                    |
| Consumer-side symlink escape            | Reject reparse/aliases and verify exact projected file inventory                                    |
| Two roots mapped to one authority       | One independently approved host binding per invocation; reject unapproved second root               |
| Authority reused for foreign repository | Reviewed repositoryKey intent, host binding and fixed state all conjunctive                         |
| Approval from execution output          | Mapping candidate needs external exact approval before acceptance; no consumer-output authority     |
| Host locator enters semantic graph hash | Exclude host binding/locators from VL4; separate execution scope identity                           |
| Full-tree secret leak                   | Exact classified source projection, never original-root mount; instrument read/copy paths           |
| Copied JSON asserts read-only           | Require trusted external launcher enforcement evidence; consumer JSON alone insufficient            |
| Mapping approval cycle                  | Body-only digest in external approval; final descriptor references that record, not itself          |
| Target/smoke cycle                      | Anchor approval before target candidates; no actual smoke prerequisite for candidate review         |

Ownership is logical review plus validated repository/state relations, not
ACL/OS-user/GitHub ownership or proof of upstream clone origin. This limitation
is explicit. Hashes and repositoryKey alone cannot establish trust. External
launcher trust and transient-change limitations remain, not silently claimed
resolved by a schema. Unknown/missing/unobservable requirements fail closed.

REAL_AUTHORITY_DEPENDENCY_ORDER: Gate 2b -> separately authorized fixture
implementation and required regression -> authorized read-only actual anchor
observation/candidates -> independent anchor/policy/host-binding/mapping approval
-> per-target and graph-scope candidate review/approval -> aggregate review/approval
-> all REAL fixed/stable authority established -> explicit actual smoke approval
-> only later separately authorized resolved graph computation.

Actual REAL smoke remains DEFERRED_BY_AUTHORITY_SEQUENCE. No current anchor,
host binding, mapping approval, target packet or aggregate is generated here.
Existing materiality approvals reference PRE Design/TIC hashes: they remain
historical exact approvals, not automatically valid for new document bytes.
Reconciliation is a later explicit review prerequisite, not a secret-policy
change or permission to update scratch records now.

### Amendment integrity and validation evidence

PRE hashes:

- Design: 8f1755e24b24e02c70f870cd364644098cfee20683a30f88d228db2610e1d7a9.
- Sensitive Design: 954d451ca6bd533e40c6bf3637668c9588840791fb3f7332141c4ef88862707f.
- Tasks/TIC: 9896a95fc3c1050b958e9855f9a77548f52a9fcb59156b72b98515b082ba6ee4.

Validation executed for this amendment:

- Strict OpenSpec validation: PASS, exit 0.
- pnpm docs:check: PASS, exit 0, 36 current documents.
- pnpm architecture:check: PASS, exit 0.
- Scoped Prettier: initial exit 1 on new Design/review presentation; formatted
  only the added amendment prefixes, then all three exact files PASS, exit 0.
- Scoped git diff --check: PASS, exit 0; existing LF-to-CRLF checkout warnings
  are informational, not whitespace failures.

No lint claim. No implementation tests, full synthetic, actual REAL smoke,
renderer, V-LOCK or parent check executed. Final hashes are reported externally
after writing this packet; the packet does not embed its own self-hash.
Exact authorized delivery is Design, this review and Tasks only. Prior sections,
Specs, scratch, implementation, index and unrelated work must remain unchanged.
Current partial harness:
89e981088e5448a08330318acf93ed78dd7ac4fbb00370938eb729b174c19ad9.
Current partial inventory:
0067e06f030e6c336293ff1aee05d16457585a5096622df26c9576c48cb50c67.
212 correct / 0 incorrect / 0 skipped remains limited to executed suites.
No five-gap implementation status is promoted. No new execution tests run here.
Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29; 3.4–3.10 and Phase 4+ NOT_AUTHORIZED.
Parent 19/23; parent Task 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.

## LCN1–LCN5 — Secret/local-config sensitive review

SPECS_CHANGE_REQUIRED: NO; R1/R3/R10 alternate obligations and R11 secret safety
remain mandatory. LCN adds explicit content-free disposition, not silent omission.
SENSITIVE_DESIGN_RESULT: PASS — documentary assessment, not Gate 2b approval.
SECRET_LOCAL_CONFIG_DISPOSITION_DESIGN_STATUS: AWAITING_GATE_2B_REVIEW.

| Risk                                    | Required safeguard                                                         |
| --------------------------------------- | -------------------------------------------------------------------------- |
| Secret logged or hashed                 | Metadata-first branch; no content-open/hash/copy; instrument future tests  |
| Wildcard hides source                   | Closed exact path; reject glob/prefix/basename patterns                    |
| Ignored auto-exemption                  | Ignore informational only; independent explicit approval                   |
| Reparse escape                          | Parent/leaf lstat and containment; no follow; reject aliases               |
| Later material dependency               | Bound non-secret evidence inventory; drift/review and materiality conflict |
| Copy record to another path             | Exact path/target/repository approval match                                |
| Directory-wide exclusion                | No inheritance; every neighbor classified independently                    |
| Self-approved record                    | External approval with noncircular binding; missing approval blocks        |
| Secret exposed to Linux                 | No full-tree secret delivery; block if safe delivery cannot be enforced    |
| Tracked/admitted source hidden          | Authoritative overlap fails before non-authority branch                    |
| Policy changed mid-run                  | PRE/POST disposition/evidence identity and metadata validation             |
| Passing classification bypasses closure | Mandatory disposition check plus remaining exact source completeness       |

Current packages/db-cloud/.env.local classification:
SECRET_OR_LOCAL_CONFIG_NON_AUTHORITY, runtime/development configuration,
not graph/source material under inspected contract; Git ignore is not authority.
Exact record use remains CANDIDATE_AWAITING_CONTROL_TOWER_APPROVAL.
No secret read/emission/hash, implementation, full scan or packet generation.
Future narrow tests are specified in LCN5 and the Tasks LCN TIC; not run here.
FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES.

Validation executed for this documentary amendment (all exit 0):

- `openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive`: PASS.
- `pnpm docs:check`: PASS, 36 current documents.
- `pnpm architecture:check`: PASS.
- Scoped Prettier check on the three authorized documents: PASS.
- Scoped `git diff --check` on the three authorized documents: PASS; Git emitted
  existing LF-to-CRLF checkout-conversion warnings, not whitespace errors.

No renderer, synthetic gate, real V-LOCK, secret-content access, full local-source
scan or parent Task 6.1 execution was performed. Tests in LCN5 remain future work.

Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29; graph discovery BLOCKED;
parent 19/23, 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.
Historical sections below remain unchanged; this review does not grant Gate 2b.

## GTA1–GTA7 — REAL_REPOSITORY target-authority-set review

Previous dynamic-observation amendment: APPROVED_HISTORICALLY.
Current amendment: AWAITING_GATE_2B_REVIEW.
Task-3.3 TIC: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO — R3/R10 require complete mandatory validation,
R11 deterministic evidence; Non-goals leave representation/topology to Design.
SENSITIVE_DESIGN_RESULT: PASS — documentary assessment only, NOT human approval.

| Bypass risk                                  | Required rejection / safeguard                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------ |
| Reuse auth authority for contracts           | Exact target/packet equality; GRAPH_TARGET_PATH_MISMATCH                       |
| Parent/root authority covers descendants     | No prefix or inherited target grants; independent packet per required target   |
| Missing target omitted                       | Independent discovery vs approved exact set; GRAPH_TARGET_AUTHORITY_MISSING    |
| Extra unreviewed target                      | GRAPH_TARGET_AUTHORITY_EXTRA; no automatic workspace expansion                 |
| Target changed after approval                | PRE/POST rediscovery and GRAPH_TARGET_SET_DRIFT                                |
| Package/path mismatch                        | Bound manifest identity; GRAPH_TARGET_PACKAGE_MISMATCH                         |
| Duplicate/aliased targets                    | Reject duplicates and physical/case aliases, never silently deduplicate        |
| Synthetic authority used for real            | Aggregate/packet scope equality; GRAPH_TARGET_SCOPE_MISMATCH                   |
| Valid packets but stale aggregate            | Independently approved exact aggregate and graphScopeIdentity required         |
| Self-approved aggregate                      | Candidate status until external Control Tower approval; no embedded approval   |
| Patch/tarball omitted                        | Separate graph input completeness remains conjunctive with directory equality  |
| Unbound source hidden                        | Every LC closure must pass; aggregate reference never admits Pointage files    |
| Manifest/config omitted                      | Exact VL4/VL5 graph-wide closure and complete effective settings               |
| Forged relation/source                       | Recompute source pointers against bound inputs, reject missing/extra relations |
| Shared directory reached by multiple schemes | One target entry retains every relation and native check                       |
| Circular graph/aggregate approval            | Graph scope excludes future graph and aggregate hashes                         |
| Future PID/event binding                     | DA1 unchanged; dynamic evidence independently validated under DA2/DA3          |

GTA1 input-type matrix, GTA2 closed schema/canonicalization, GTA3 failure matrix,
GTA4 separate graph-wide inputs, GTA5 lifecycle/drift and GTA6 execution order in
design.md are the reviewed candidate contract. This is a documentary review of
the proposed controls, not proof that a consumer enforces them.
FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES.
Current 94/94 synthetic and live producer PASS remain historical valid evidence
for candidate 31da0a0aaa0808ec14067e489a0d057776c9e837009ace462c0d3e8f5b8f57c1;
they do not validate future branch/aggregate code.

Pre-amendment SHA-256:

- Design: f1357f45edb641316dc857304d8a797280f2681fb2cdcd1fedcccce871e1db24
- This review: 219180c35fb63337384066f5f988a4a860a3b95033cf0e40c0bbac90cb4b24a9
- Tasks: 73175cf0b21252201280d332d5616d8d780a63dc83c302704c97f6969cf8c83c

Final post-edit hashes are reported externally to avoid a self-hash cycle.
Validation results: strict OpenSpec exit 0; pnpm docs:check exit 0 (36 current
documents); pnpm architecture:check exit 0; scoped Prettier exit 0 for exactly
the three authorized artifacts; scoped git diff --check exit 0 (Git reports
LF-to-CRLF working-copy warnings, not whitespace errors). Initial Prettier
reported two files; only new amendment formatting was corrected before recheck.
No lint, runtime tests/builds, recursive typecheck, global format check, full
synthetic run or parent Task 6.1 rerun: not performed in this documentary scope.
No implementation, target authority packet, aggregate SHA, graph SHA, real
V-LOCK, Pointage disposition or production action is authorized by this packet.
Graph candidate BLOCKED; Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29;
3.4–3.10 and Phase 4+ NOT_AUTHORIZED; parent 19/23,
parent Task 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.
STOP at Control Tower review. Earlier evidence below remains historical.

## DA1–DA7 stable authority / dynamic observation review

Previous provenance authority: APPROVED_HISTORICALLY. Current amendment:
AWAITING_GATE_2B_REVIEW. Task-3.3 TIC: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO (R11 logical determinism, R3/R10 mandatory fail-closed
validation; no future event hash pre-approval requirement).
SENSITIVE_DESIGN_RESULT: PASS — documentary assessment, NOT human Gate 2b approval.

- Self-approval: DA1/DA3 require independent policy bytes/digest before capture;
  actual hash cannot become expected authority. Failed evidence may be retained
  but is never admitted merely because its bytes have a digest.
- Future PID/timing in fixed authority: DA2 excludes these explicitly; runtime
  facts must instead pass exact command/lifecycle validation.
- Dropped helper authority/name-only conhost: exact binary identities, version,
  multiplicity and exclusive Job relation remain fixed admission requirements.
- Over-broad PRE/POST weakening: DA4 enumerates closed stable projection fields,
  including actual index/config/runtime and current source bytes, manifest,
  admissions and closure. Unknown/missing fields fail; no dynamic catch-all.
- Runtime policy substitution: identical fixed authority and policy hashes are
  mandatory at PRE/POST; each observation must independently validate.
- Skipped observation checks: DA3 rejects incomplete or unobservable lifecycle;
  equal stable projections cannot rescue invalid observation evidence.
- Missing audit evidence: DA6 retains both observations and raw artifact hashes
  with phase binding; no circular hash or claim of cross-run raw-byte equality.
- Policy/evidence confusion: different named fields and schema versions; v1
  exact packet is historical only, not an automatically accepted v2 packet.
- Foreign repository/scope: closed scope union and independently verified
  root ownership/mount mapping; no use of packages/auth approval generically.
- Gate bypass: 94 logical cases alone insufficient; DA7 requires actual host
  producer/delivery/consumer integration PASS, not fixture-only substitution.

Implementation review must verify every projection field, independent synthetic
fixture authority, raw-observation validation, failure propagation and updated
negative tests. No implementation or execution is approved by this assessment.
Historical packages/auth PASS and full-run FAIL remain unchanged. Current scratch
candidate remains 476fefd618603ca1c43e46bc9d272aebf0f186edb7415dfe625fea324134e56d.
Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29; parent 19/23 and 6.1 FAIL / UNCHECKED;
later tasks, Phase 4+ and Production NOT_AUTHORIZED. STOP at human review.

## Tracked-inventory provenance review — awaiting Gate 2b

Scope: Design GI1–GI6 and Task-3.3 producer TIC only. Previous local-source
closure: APPROVED_HISTORICALLY. Current provenance amendment:
AWAITING_GATE_2B_REVIEW. TIC: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO. SENSITIVE_DESIGN_RESULT: PASS — documentary assessment
only; not executable parser proof, producer admission or human Gate 2b approval.

- Forged envelope/self-approval: GI5 requires externally approved digest and
  producer authority; hashing attacker-supplied data alone is insufficient.
- Stale or foreign inventory: GI4–GI6 bind root/worktree/Git-dir/mount mapping,
  HEAD, index and canonical entries plus PRE/POST; same HEAD is not same checkout.
- Git/adapter substitution: GI2 exact executable, launcher/runtime dependencies,
  script/parser/command/environment identities; version label alone is rejected.
- Unknown diagnostic grammar: GI3 exact-version fixtures/flags, cross-output
  equality, complete parsing and no fallback; --debug is not cross-version stable.
- NUL/newline/path injection: raw NUL framing, fatal UTF-8 roundtrip, fixed argv,
  exact stage header parsing, subsequent unsafe-path/case/duplicate rejection.
- Locale/color/pager/alias effects: GI2/GI3 controlled environment, absolute
  executable, no shell, no pager/color/prompts, material config rejection.
- Malicious config/hooks/external tools: review complete config influence before
  execution, reject unsafe include/filter/fsmonitor/layout effects; overrides
  alone are not a blanket safety claim. No remote/package-manager operation.
- Unmerged stages/intent-to-add: retain stage/flag evidence, do not flatten stages
  or infer intent solely from object IDs; GI4 fail-closed policy.
- Assume-unchanged/skip-worktree concealment: tags and exact flags cross-checked;
  both unsupported, never trusted as permission to skip current-byte reads.
- Tracked symlink/gitlink: GI4 rejects both; submodule/nested ownership requires
  separate authority. LC3 containment/reparse controls remain mandatory.
- Changed worktree bytes/index and TOCTOU: GI6 bracket capture and repeat index,
  membership, member/type/byte checks; missing POST blocks. No atomic-snapshot
  claim and no repository write locks.
- Linked-worktree ambiguity: Git discovers index location; bind approved native
  mapping, reject unknown relationship rather than assume .git/index.
- Producer mutation: read-only command allowlist, optional locks disabled,
  no default status, no refresh/add/reset/checkout; PRE/POST mutation evidence.
- Git blob laundering: objectId is index provenance only; LC4/GI5 hash current
  approved worktree bytes including modified tracked files.
- Untracked/ignored omission: combined physical discovery plus bound membership;
  only approved install exclusion; unresolved Pointage members are not admitted.

Residual prerequisites: exact Git runtime/config closure, parser grammar and
malformed/state fixtures require review before implementation acceptance;
the documentary contract does not certify the locally observed Git release.
Fresh full synthetic revalidation is REQUIRED after implementation. Historical
failures/PASS evidence remain unchanged. Graph remains BLOCKED; Tasks 10/29;
3.3 UNCHECKED; 3.4–3.10 UNCHECKED / NOT_AUTHORIZED; Phase 4+ NOT_AUTHORIZED;
parent 19/23, 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED. STOP for review.

## Local-source closure documentary amendment — awaiting Gate 2b

Control Tower approved writing Design LC1–LC5 and Task-3.3 TIC only.
Previous V-LOCK Design: APPROVED_HISTORICALLY. Current amendment:
AWAITING_GATE_2B_REVIEW. Task-3.3 TIC: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO. SENSITIVE_DESIGN_RESULT: PASS — documentary bypass
assessment only, not implementation proof or human Gate 2b approval.

- Hidden source/moving source under install exclusion: LC1/LC2 requires explicit
  required-input binding; local source/entry declarations inside install regions
  block. Frozen dependency checks remain mandatory; no installed-module audit
  or guarantee of arbitrary runtime import discovery is claimed.
- Tracked/admitted source under exclusion: inventory/declaration overlap blocks
  before pruning; no authoritative member silently disappears.
- Untracked runtime source: every untracked non-install member is
  UNBOUND_SOURCE_MEMBER until reviewed disposition; no source self-admission.
- Ignored required generated files: ignore status is insufficient; LC2 requires
  explicit authority/admission and keeps tracked generated bytes in closure.
- Secrets/local config: do not read/export raw secret content as incidental
  evidence; required semantics block for separately reviewed identity handling.
- Authoritative symlink/reparse escape: LC3 rejects links and unsafe parents
  irrespective of internal/external target, preserving hardlink/alias checks.
- Nested node_modules/layout drift: only the explicit install class may be
  excluded, with authoritative-overlap rejection; no arbitrary cache exclusion.
- Store dependence: LC2/LC4 excludes store traversal/layout from identity; no
  registry/store fallback or local dependency repair.
- Git index/worktree mismatch: index binds membership only, approved current
  worktree bytes bind content; staged blobs do not replace changed source.
- Missing/deleted tracked file: fail closed, never reconstruct from Git blobs.
- Submodule/nested repository ambiguity: block unsupported ownership instead
  of silently shrinking or recursively importing another repository.
- Case/path collision: exact canonical paths, ordinal UTF-16 ordering and
  alias/collision rejection preserve portable deterministic membership.
- Install-only identity changes: source descriptor excludes physical install
  members/timestamps/absolute paths, preserving identity for unchanged approved
  source. Inventory/byte drift invalidates a run; no automatic rebaseline.

Diagnostic packages/auth 18-member observation and the eight inspected targets
remain discovery only. The three Pointage untracked paths listed in LC5 remain
unresolved potential blockers; no admission, exclusion or mutation authorized.
Historical synthetic FAIL #1, FAIL #2 (93/94), older-harness PASS 94/94 and current
harness PASS 94/94 remain separate historical results. Prior graph restart is
BLOCKED; no graph SHA or source-closure SHA is approved by this amendment.
FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES. No synthetic,
writer, real V-LOCK or graph computation runs in this documentary amendment.
Tasks 10/29; Task 3.3 BLOCKED / UNCHECKED; 3.4–3.10 UNCHECKED / NOT_AUTHORIZED;
Phase 4+ NOT_AUTHORIZED; parent 19/23, 6.1 FAIL / UNCHECKED;
Production NOT_AUTHORIZED. Stop for independent Control Tower review.

## V-LOCK native-first graph/isolation review — pending Gate 2b

Scope: Design VL1–VL8 and Task 3.3/TC3-1 refinement only.
Previous V-LOCK Design: APPROVED_HISTORICALLY.
Current amendment: AWAITING_GATE_2B_REVIEW.
Task-3.3 TIC: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO; R4/R10 require genuine conjunctive evidence without
prescribing native-only verification. Specs unchanged; no R4L authority reused.
SENSITIVE_DESIGN_RESULT: PASS — documentary bypass assessment only, not runtime
proof, graph approval, Apply permission or human Gate 2b approval.

| Bypass risk                                                          | Required rejection/control                                                                                                                          |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Custom check replaces native predicate                               | VL1/VL2 native checks mandatory; native failure cannot be overridden by gap PASS                                                                    |
| Projection omits dependencies or optional/platform members           | VL4 retains complete parsedLock and nativeGraph; no field allowlist/host pruning; VL3 complete inventory                                            |
| Registry-derived data enters projection                              | Reviewed local input closure only; inert existing resolution URLs retained, no network/fresh resolution                                             |
| Graph SHA self-approval or auto-rebaseline                           | VL5 candidate → independent explicit graph/input approval; first observation never accepted                                                         |
| Raw PASS masks graph FAIL or reverse                                 | VL5/VL6 require both raw and semantic identities, native/gap/isolation evidence conjunctively                                                       |
| Dangling/missing/unexpected graph members ignored                    | VL3 exact key sets and all applicable edges; explicit failure codes; unsupported reference kind blocks                                              |
| Patch/local reference substituted from ambient filesystem/store      | VL2/VL4 exact local closure, path safety and native identity relation; no fetched fallback                                                          |
| Canonicalization launders graph differences                          | Tagged lossless values; preserve arrays/undefined/negative zero; sorted object keys only; malformed/colliding paths rejected                        |
| Tag or Windows approval used as Linux runtime authority              | VL7 independently reviewed image/index/platform/config/Node/library binding; tag is not authority                                                   |
| Writable repo mount or subprocess escape                             | Repository absent/read-only; external mount/process restrictions; no privileged container/host socket                                               |
| Network leak, resolver or store fetch hidden by zero counter         | External network denial plus attempt instrumentation/static reachability; incomplete observability blocks proof                                     |
| fsync stub or native writer patch                                    | Normal filesystem semantics required; source-range integrity; historical Permission Model FAIL retained                                             |
| Extraction semantic drift                                            | Exact tool/parser dependency/ranges/output identities reviewed; changes create candidate, no manual source edit                                     |
| Synthetic PASS silently becomes real acceptance                      | VL8 separate synthetic, graph-review and real-execution boundaries; Task 3.3 stays unchecked                                                        |
| New projection baseline computed during amendment                    | No graph computation permitted; APPROVED_RESOLVED_GRAPH_IDENTITY remains absent pending later review                                                |
| Existing approval hashes silently rewritten after documentary change | Preserve original units and historical bindings; future consumers of changed artifact hashes require explicit reconciliation, never auto-reapproval |

Residual execution prerequisites: exact runtime/isolation review, complete
synthetic proof including native fsync, separately reviewed graph/input identity,
real raw roundtrip and final validation. None is completed by this review.
Historical H3 smoke remains FAIL; Task 3.2 historical 91/122 and unresolved
font/runtime/reconstruction evidence unchanged. Tasks10/29; Task3.3 BLOCKED /
UNCHECKED;3.4–3.10 UNCHECKED;Phase4+ NOT_AUTHORIZED. Parent19/23,6.1 FAIL /
UNCHECKED;Production NOT_AUTHORIZED. Stop for Control Tower review.

## Generation-scoped orchestration sensitive review — pending Gate 2b

SPECS_CHANGE_REQUIRED: NO. This review covers Design GS1–GS7 only.
Previous Model-B Gate 2 and Gate 2b: APPROVED_HISTORICALLY.
Current Design amendment: AWAITING_GATE_2B_REVIEW.
Current Task/TIC amendment: AWAITING_CONTROL_TOWER_REVIEW.
SENSITIVE_DESIGN_RESULT: PASS — documentary bypass assessment, not implementation
verification or human Gate 2b approval.

Artifact results retain their existing strict schema, path classification and
observed repository raw-byte sha256. Generation results use an independent
obligation identity and schema; the final result requires both lanes to pass.

| Bypass risk                                           | Required rejection/control                                                                                                                     |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Omitted generation obligation                         | Source-owned applicability derives the mandatory obligation independently of supplied results; GENERATION_OBLIGATION_MISSING.                  |
| Omitted generation result                             | Exactly one result per required obligation; GENERATION_RESULT_MISSING.                                                                         |
| Extra or unknown result                               | Closed approved registry and required-set equality; GENERATION_RESULT_EXTRA.                                                                   |
| Duplicate result                                      | Reject repeated obligation identity, even identical PASS rows; GENERATION_RESULT_DUPLICATE.                                                    |
| Stale generation or output identity                   | Compare approved and freshly observed identities; GENERATION_IDENTITY_MISMATCH / GENERATION_OUTPUT_SET_MISMATCH.                               |
| Cross-lane injection or fake artifact row             | Independent strict parsers, registries and result collections; no generation id admitted into artifact classification.                         |
| Historical classification overwrite                   | One repository path retains one classification; scratch output is a separate observed universe.                                                |
| Historical approval inherited by current generation   | Independently resolved exact generation-obligation approval; historical admission is insufficient.                                             |
| Current approval inherited by historical preservation | Historical admission and exact historical path/hash/bytes/reference closure remain independently mandatory.                                    |
| Exit-1 laundering                                     | Require every GS6 complete-execution premise and exact 30-PDF plus one-manifest mismatch membership; otherwise fail.                           |
| Current mismatch hidden by historical PASS            | Final result is artifact PASS AND generation PASS; neither lane overrides the other.                                                           |
| Generation failure converted to historical admission  | No fallback, downgrade, classification mutation or automatic admission route.                                                                  |
| Auto-rebaseline or semantic-equivalence laundering    | Exact approved identities only; changed bytes require explicit review, not semantic comparison.                                                |
| Partial, timeout, malformed or skipped evidence       | Dedicated fail-closed codes; COMPLETE status or digest shape alone is not execution proof.                                                     |
| Approval self-reference or stale full-file reference  | Approval reference outside canonical obligation body; resolve separately and reject stale references, never rewrite historical approval units. |

The logical path may appear in both evidence universes without creating duplicate
repository classifications. Artifact routing is classification → artifact
validator. Generation routing is approved obligation → generation validator.
Artifact sha256 never becomes an output-set or generation digest.

Current candidate obligation binds validator `vfix-current-generation-v1`,
version 1, the owner/domain in Design GS2, generation
`134bfd72045dc037b9ceb064679b6ec6f8150b52447077bc1d0fbeff3f91f7c8`,
output set `52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a`,
and COLD_AND_REPEATED reproduction. Design D2 canonicalization hashes the strict
body; the external approval reference is separately resolved. This review does
not serialize or approve an activation unit.

Generation result fields are exactly obligationSha256, validator, version,
result, failureCode, observedGenerationIdentitySha256, observedOutputSetSha256,
reproductionEvidenceSha256 and reproductionEvidenceStatus. PASS requires exact
identities and independently validated complete cold/repeated evidence. No
renderer fields are invented and no renderer semantics change.

Historical Task 3.2 remains FAIL: 91/122 exact matches, 30 PDFs plus one derived
manifest mismatch; runtime/font UNKNOWN, reconstruction UNRESOLVED, originating
approval UNRECOVERED. Historical closure
`a075ef0e47cfa288a93316c99d28bb1b74bab6362e081ded4b18e17a62f40560`
is not redefined. Future current reproduction PASS cannot relabel this history.

Review follow-up: this amendment changes full-file Design/review bytes referenced
by existing historical admission evidence. Old reference units remain byte-exact.
Control Tower must explicitly reconcile affected references before future
execution; no fresh applicability or approval is inferred from this amendment.

Implementation remains NOT_AUTHORIZED. Task 3.2 remains UNCHECKED; Tasks 9/29.
Tasks 3.3–3.10 UNCHECKED; Phase 4+ NOT_AUTHORIZED.
Parent 19/23; parent Task 6.1 FAIL / UNCHECKED. Production NOT_AUTHORIZED.

### Amendment validation evidence

Only the three approved planning/review files changed in this amendment.
All pre-existing historical sections were retained unchanged; comparison against
their staged pre-amendment content confirmed identical text. No checkboxes changed.

- Strict OpenSpec validation: exit 0, valid.
- `pnpm docs:check`: exit 0, 36 current documents passed.
- `pnpm architecture:check`: exit 0, passed.
- Scoped Prettier: initial exit 1 on new sections; after formatting only those
  additions, exit 0 on all three targets.
- Scoped `git diff --check`: exit 0.
- Specs SHA-256 unchanged:
  `b54804f9cafcfe21f37f8fae75da09e1fcd4870ed43a442d6c226ec6c42dc95c`.
- Implementation K/T, four renderer-tooling files, package/lock and parent Tasks
  hashes match the pre-amendment protected baseline.
- Baseline67 and ignored45: all current hashes match their reviewed baselines,
  including the separately approved current lockfile baseline.
- Historical outputs: 122/122 existing raw hashes and byte sizes unchanged.
- Current retained cold/warm outputs: 122/122 each match reviewed hashes/sizes;
  recomputed output-set identity remains
  `52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a`.
- No renderer, implementation tests, recursive typecheck, broad formatter,
  parent Task 6.1, commit, sync, archive or production action was run.

Protected-output checks above read existing bytes only; they are not a new
reproduction run. Existing historical admission full-file references remain
historical, not freshly applicable to this pending amendment.

GENERATION_SCOPED_ORCHESTRATION_AMENDMENT_RESULT:
PREPARED_AWAITING_CONTROL_TOWER_REVIEW.

## Model B amendment review — current pending packet

Previous Specs / Gate 2: APPROVED_HISTORICALLY.
Previous Gate 2b: APPROVED_HISTORICALLY.
Current Model-B Specs amendment: AWAITING_GATE_2_REVIEW.
Current Model-B Design/Sensitive amendment: AWAITING_GATE_2B_REVIEW.

Scope: Design MB1–MB6 and Specs R4.8–R4.12 / R5.6–R5.10, with retained
R4/R5 scenarios. This is a documentary security assessment, not Gate 2b approval,
implementation verification, generated admission or output approval.
The prior concrete historical reproduction gate remains historical evidence;
after human approval MB1–MB6 replaces only that V-FIX coupling.

| Bypass                                            | Required denial / review conclusion                                                                |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Failed generated artifact relabeled historical    | R4.12/R5.7 require explicit reviewed classification; failure cannot select another validator       |
| Automatic admission after reproduction failure    | MB3 sequence has no shortcut; candidate stability and accepted direction are not output approval   |
| Historical approval inherited by new identity     | R4.8/R4.11 require separate current identity and independent output approval                       |
| Historical bytes replaced by current bytes        | R5.8 and both original manifests remain exact path/raw-byte protected                              |
| Stale source/input/runtime/font/supply/repertoire | Pre-generation binding checks deny drift even if output hashes happen to match                     |
| Hidden output inventory drift                     | Exact paths/types/lengths/raw hashes; missing/extra rejected, copied versus fresh roles explicit   |
| Current manifest replaces historical manifest     | Current manifest is generation-scoped; original manifests and their references remain unchanged    |
| Auto-rebaseline                                   | No validator may update expected hashes, admission or reference records                            |
| Semantic-equivalence laundering                   | Semantic review supplements but never replaces raw-byte/identity checks                            |
| Disguised waiver                                  | Both obligations mandatory; missing approval or proof keeps Task 3.2 unchecked                     |
| Directory-name authority                          | v2 includes 58 historical copies; no v1/historical versus v2/current shortcut                      |
| Historical FAIL relabeled PASS                    | Historical 91/122, 30 PDF plus one manifest mismatch and unknown runtime remain immutable evidence |

SENSITIVE_DESIGN_RESULT: PASS — documentary bypass assessment only.
Gate 2b is NOT self-approved; AWAITING_GATE_2B_REVIEW.

Residual obligations: exact current output identity is not approved; stable
52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a
is evidence only. Exact reference/admission registration, fresh bounded proof,
negative tests and generic integration remain future authorized work. Full
source-to-binary provenance is not claimed. Neither repeated-run stability nor
copied PDFs establish original historical renderer reconstruction.

Historical Task 3.2 FAIL; reconstruction UNRESOLVED; font/runtime UNKNOWN;
Arial INSUFFICIENT_AUTHORITY; DejaVu NO_REVIEWABLE_HISTORICAL_FONT_CANDIDATE.
Existing failed/blocked/unknown evidence below is retained, not rewritten.
No code, tooling, historical artifacts, expected hashes, baseline67/ignored45,
package/lock or parent mutation is authorized. Production NOT_AUTHORIZED.

Change: repository-format-policy-and-baseline-remediation
Gate: 2b — Sensitive Design Review
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-13
Schema: yuta-spec-driven
Analysis conclusion: BLOCKED_NEEDS_REVIEW — historical wording retained; Gate-1 questions resolved by approved current decisions
Sensitive change: YES

## Current decision and boundary

Current amendment status: AWAITING_GATE_2B_REVIEW; see the final concrete V-FIX
review section. Original Gate 2b is APPROVED_HISTORICALLY only. Earlier sections below
are retained historical evidence, not approval of the amended Design.

Gate 2: APPROVED.
Approval source: explicit current-user Control Tower instruction “GATE 2 APPROVED → DESIGN + SENSITIVE DESIGN”.
Approval recorded by: Codex workflow, trong packet mới này.
Approved binding: bảng dưới; không suy approval từ command PASS.

Giữ nguyên historical Gate-1/Gate-2 packet bytes theo exact current approval và boundary không sửa approved/active artifacts. Trạng thái AWAITING trong old packets là historical checkpoint, không phủ nhận current explicit decision. Không rewrite history hoặc earlier analysis.

Lượt này chỉ tạo Design và packet này. Không Tasks/TIC/Implementation Plan, Apply, policy/config/script files, baseline formatting, generated/history/archive/main-spec changes, parent validation, Sync/Archive/Knowledge/production.

## Approved artifact integrity PRE / POST

SHA-256 raw bytes, dùng PowerShell `Get-FileHash -Algorithm SHA256` và Node `crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')`. Tất cả PRE/POST bằng approved value:

| Exact path                                                                                                               | PRE SHA-256                                                        | POST SHA-256                                                       |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `docs/reviews/repository-format-policy-and-baseline-remediation/01-analysis-review.md`                                   | `2dcbb5d283fd21e19bc859f42d9713d7ccfa23beead9752e117b8cce7d4559d0` | `2dcbb5d283fd21e19bc859f42d9713d7ccfa23beead9752e117b8cce7d4559d0` |
| `docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md`                                      | `b3a61588334d46fb1defe6a57fd33a0794e178a9e9926e7065e6347ad71ab02b` | `b3a61588334d46fb1defe6a57fd33a0794e178a9e9926e7065e6347ad71ab02b` |
| `openspec/changes/repository-format-policy-and-baseline-remediation/analysis.md`                                         | `7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9` | `7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9` |
| `openspec/changes/repository-format-policy-and-baseline-remediation/proposal.md`                                         | `4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0` | `4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0` |
| `openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md` | `0567fbaa45fc37ac3b687cf34f2625f6278db7d1429e9d8ea1493b065366880b` | `0567fbaa45fc37ac3b687cf34f2625f6278db7d1429e9d8ea1493b065366880b` |

Design: `openspec/changes/repository-format-policy-and-baseline-remediation/design.md`.
Design SHA-256: `0dd163e8ae2d513f6865570594aa4c89eef01fa9a1ea7ea4e02c36a6f4199031`.
Exact Design snapshot nằm bên dưới; không hash directory thay file.

## Source and current evidence

Current Proposal/Analysis, approved Specs 12 requirements/58 scenarios và review records được đối chiếu exact hashes; current package/config/ignore, schema, installed generator/update/parser source, workflow approval/invalidation, archive và normativity/upgrade authority được đọc. No nested AGENTS found cho affected docs/openspec paths. Existing docs index, CURRENT_STATE và Authority Model vẫn là routing, không bị chỉnh.

OpenSpec status/instructions xác nhận yuta-spec-driven, Design ban đầu absent. `openspec list --json`: parent 19/23; async-feedback in-progress 15/19; Pointage 25/32 được giữ ngoài delivery. UI_UX_PRO_MAX_USAGE: NOT_APPLICABLE theo approved Analysis, không gọi advisory để tự validate integration.

Installed CLI `openspec --version`: 1.11.0. Source update có transformer trước generation và có ghi/xóa outputs; chỉ inspect, không chạy update. Không chứng minh reproducibility qua inspection. Một lookup tới nonexistent installed `dist/core/configurators` trả diagnostic; tìm đúng current `dist/core/update.js` và `shared/skill-generation.js`; không sửa package.

Read-only file-info scan: 2,631 existing Git-listed files, 1,940 parser-supported, **45 current .prettierignore exclusions ngoài67**. Appendix B ghi path/raw SHA. Đây là discovery evidence, không phải format execution; preliminary commentary “44” đã được corrected bằng actual array length 45.

## Sensitive Design assessment

SENSITIVE_DESIGN_RESULT: BLOCKED_NEEDS_REVIEW

Đây là review của candidate design, không là approval Gate 2b, implementation compliance hay test PASS.

| Review concern              | Design              | Assessment                                                                                              |
| --------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------- |
| Fail-open/fail-closed       | D2, D3, D12         | Candidate fail-closed: unknown/incomplete/error không PASS                                              |
| Classification completeness | D1, D2              | BLOCKED BND-01: treatment cho additional45 chưa có bounded authority; không grandfather                 |
| Bypass resistance           | D10                 | Eight requested attacks và ignore/path/source-trust cases có mitigation; implementation tests chưa chạy |
| Stale manifests             | D1, D2, D12         | Version/binding mismatch FAIL, không self-rebase                                                        |
| Path safety                 | D2                  | Exact relative paths, collision/reparse/escape rejection, pre/post concurrent-drift check               |
| Alternate enforcement       | D3                  | Source-owned obligations và centralized aggregation; missing class adapter FAIL                         |
| Generated reproducibility   | D4                  | Full source/version/transformer/inventory binding; current8 unresolved, không 9/9 claim                 |
| Historical/archive          | D5, D6              | Raw preservation, explicit admission/ref integrity, correction giữ originals                            |
| Active owner                | D7                  | Owner/status exact binding, WAIT_FOR_OWNER, không unilateral revision                                   |
| Migration recovery          | D12, Migration Plan | Partial states FAIL; authorized exact rollback only; không concurrent reset                             |
| Auditability                | D9                  | Deterministic logical evidence, safe identity/code, không secrets                                       |
| Operational cost            | D11                 | Linear bytes + sorting; batch checks, no persistent PASS cache; chưa benchmark                          |

## Requirement and design coverage

| Approved requirements | Design coverage                                                                    |
| --------------------- | ---------------------------------------------------------------------------------- |
| R1/R2/R3              | D1–D3: exact classification, mandatory formatter/alternates, independent inventory |
| R4                    | D4: reproduction and truthful unknown/deviation                                    |
| R5/R6                 | D5–D6: preservation and explicit admission                                         |
| R7                    | D7: owner/status handshake                                                         |
| R8                    | D8: reviewed diff, conservative equivalence, strict validation                     |
| R9                    | Migration Plan, Appendix A, D12: exact67 and rollback                              |
| R10                   | D3: mandatory routing and aggregate                                                |
| R11                   | D9: deterministic attribution                                                      |
| R12                   | Parent hold below, migration activation boundary                                   |

Không sửa 12 requirements hoặc 58 scenarios. Proposed paths/JSON/closed validators là design choices, chưa implementation. Không template/schema/Product/runtime behavior change.

## Blocker and authority request

BND-01: Current `.prettierignore` đang skip 45 supported Git files ngoài reviewed67. Nhóm có cloud/POS/Display migration metadata, historical copied journals, fixture manifests, generated service worker và lockfile. Không đủ căn cứ để cấp một shared alternate validator hoặc preserved/generated admission cho tất cả chỉ vì hiện được ignore.

Hai constraints phải giữ cùng lúc: complete mandatory coverage (R1/R3/R10) và exact67 migration mutation scope (R9). Design không chọn blanket grandfather, cũng không tự mở rộng mutation.

Recommendation to Control Tower: cho phép bounded additional **classification/alternate-validator discovery/design only** trên exact45 Appendix B, giữ nguyên bytes và mutation baseline67. Nếu chọn scope exclusion thay thế, phải explicit review alignment với approved Specs; không auto-reopen/modify Specs trong lượt này.

Đây là blocking design scope/authority decision, không giấu trong deferrable Open Questions. Generated8 full reproduction, active-owner authorization và portable reviewed CI tool supply vẫn là execution prerequisites; chưa được claim satisfied. Trusted CI-source enforcement cũng không được suy từ local self-check.

## Migration and scope evidence

Appendix A bind exact67 path/preimage/intended class/owner routing/proposed handling:
4 mutable, 9 generated, 3 active, 5 normative, 24 historical, 22 archive. All67 current hashes match retained approved baseline. Owner routing labels không tự grant approval; every admission cần evidence.

Appendix B observations không nhập migration baseline. Không file nào được format trong67 hoặc45. Proposed policy.json/preservation.json/migration-67.json/check.mjs chưa tạo. Design chỉ mô tả routing; không edit `package.json`, .prettierrc.json, .prettierignore hoặc CI.

HEAD PRE/POST: `415990386327aaccab3c32b1fef0569a0fde7f3a`. Snapshot Git tracked+untracked non-ignored existing files, exact raw hashes và porcelain status. POST comparison: 2,631 pre-existing files unchanged, zero modifications/removals, exactly two additions (Design và packet này), bao gồm preservation của dirty Pointage/parent work. Five approved bindings và baseline67 đều unchanged. Receipt current verified, exact SHA matches.

## Validation

| Command/check                                                                                    | Result                                                           |
| ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `openspec instructions design --change repository-format-policy-and-baseline-remediation --json` | exit 0, correct schema/path                                      |
| `openspec status --change repository-format-policy-and-baseline-remediation --json`              | exit 0, Design initially absent                                  |
| `openspec list --json`                                                                           | exit 0, current active inventory                                 |
| `openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive`  | exit 0, valid                                                    |
| `pnpm docs:check`                                                                                | exit 0, PASS, 36 current documents                               |
| `pnpm architecture:check`                                                                        | exit 0, PASS                                                     |
| Scoped Prettier on Design and packet                                                             | exit 0, PASS                                                     |
| Scoped git diff --check plus explicit untracked whitespace/snapshot checks                       | exit 0, PASS; exact Design snapshot MATCH                        |
| PRE/POST exact path/hash comparison                                                              | PASS; only two new artifacts; approved5 and baseline67 unchanged |

Exact scoped commands executed:

```text
pnpm exec prettier --check openspec/changes/repository-format-policy-and-baseline-remediation/design.md docs/reviews/repository-format-policy-and-baseline-remediation/02b-design-review.md
git diff --check -- openspec/changes/repository-format-policy-and-baseline-remediation/design.md docs/reviews/repository-format-policy-and-baseline-remediation/02b-design-review.md
```

Git diff không tự bao gồm untracked files; bổ sung Node exact content comparison cho embedded Design và per-line trailing-whitespace check trên cả hai new files, exit 0. Full inventory so sánh unique sorted NUL-delimited `git ls-files --cached --others --exclude-standard -z` path/raw-SHA pairs trước/sau; không chỉ dựa vào git diff.

Passing strict OpenSpec checks structural validity; không resolve BND-01 hoặc prove validator implementation.

Not run: global format:check, parent task6.1, recursive typecheck, runtime/Product tests/builds, schema generation, generator execution, database operations. No current Design workflow requires app build. Proposed future strict schema/main-spec checks là validation design, không claim đã chạy trên hypothetical formatter output.

## Parent hold and stop

Parent `ui-ux-pro-max-integration`: 19/23.
Task 6.1: FAIL / UNCHECKED. Tasks 6.2–6.4: BLOCKED.
Parent Tasks raw SHA: `36e66b08a712d99a12f3f3243a803bced9bf707a7bb6ea9b47b83ec7e896b504`.
Receipt: VERIFIED; raw SHA `1ff4b04f62e8c76ad6242ca0640f564618e4f3c89d18f767f6bf9cc6193ba1c7`.
Historical failure outcomes unchanged.
Tasks/TIC: NOT_CREATED. Apply: NOT_RUN.
Production: NOT_AUTHORIZED.

STOP at Gate2b with BLOCKED_NEEDS_REVIEW. Không đề nghị tự approve Gate2b hoặc proceed Tasks khi BND-01 chưa resolve.

## Exact Design

<!-- prettier-ignore -->
````markdown
## Context

Xem [Proposal](proposal.md) và [approved Specs](specs/repository/artifact-format-validation/spec.md) R1–R12 (58 scenarios). Gate 1 và Gate 2 được current Control Tower duyệt; các historical artifacts giữ exact bytes. Design này là candidate kỹ thuật, không phải policy đang chạy hoặc approval Gate 2b.

Current `package.json`: `format:check = prettier --check .`, `format = prettier --write .`. CI gọi format check trước architecture/typecheck. Installed OpenSpec báo 1.11.0; generator có optional tool transformation; update pipeline gọi transformer rồi ghi output. Không chạy update/init/generation trong lượt này.

Baseline 67/67 exact hashes còn khớp. Async-feedback là in-progress 15/19; parent 19/23. Generated evidence vẫn 1 pure-generation exact match, 8 full-pipeline differences chưa giải thích. Không suy ra 9/9 PASS.

Read-only Prettier file-info scan trên 2,631 Git-listed existing files tìm thấy 1,940 supported-parser files, trong đó **45** bị current `.prettierignore` bỏ qua, ngoài tập 67. Appendix B ghi exact observations; đây không phải mutation/admission authorization. Số 45 là kết quả đếm bằng máy, thay cho preliminary commentary đếm nhầm 44. Design không dùng legacy ignore làm automatic acceptance.

**DESIGN_BLOCKER BND-01:** cần Control Tower quyết định bounded ownership/alternate-validation treatment cho 45 existing exclusions trước khi thiết kế coverage có thể được nhận là sẵn sàng triển khai. Không tự grandfather chúng vào trạng thái PASS; cũng không mở rộng migration mutation từ 67 lên 112. D1–D12 dưới đây mô tả fail-closed candidate; điểm chặn nằm ở admission/scope, không sửa approved Specs.

## Goals / Non-Goals

**Goals:** một repository entry contract read-only, complete coverage và deterministic class-specific checks; exact migration 67; explicit admission authority; preservation không bị formatter phá hủy.

**Non-Goals:** chưa tạo các file implementation được đề xuất bên dưới; không Tasks/TIC/Implementation Plan, không Apply, không sửa formatter/config/CI/skills/baseline/main specs/parent. Không production, database operation, runtime build, UI, auth hoặc Product behavior. Không biến ordinary validation thành mutation tool, approval engine hay human-signature service.

## Decisions

### D1 — Policy representation, identity và authority

Chọn proposed `scripts/format-policy/policy.json` làm machine-readable classification authority sau review; JSON strict, duplicate keys/unknown fields bị reject. Không free-form executable commands trong metadata. Proposed `scripts/format-policy/preservation.json` chứa exact preserved identities/reference records, được policy bind bằng raw SHA-256. Proposed `scripts/format-policy/migration-67.json` chứa frozen baseline Appendix A, được bind tương tự. Đây là proposed paths, chưa tạo.

Policy envelope: `schemaVersion: 1`, `policyRevision` (positive integer), `validatorContractVersion: 1`, `toolBindings`, `entries`, `preservationSha256`, `migrationSha256`, `approvalRef`. Không optional runtime flag để bỏ validators. Tool bindings chứa package/version, reviewed source identity, formatter/config/ignore identities và adapter version. Validator chỉ hỗ trợ exact contract version; không forward-compatible fallback.

Mỗi entry có `path`, `class`, `owner`, `rationale`, `admissionRef`, `validators`, `identity`, `lifecycleBinding` (khi applicable). Owner object: bounded owner ID, authority path và authority unit identity; owner ID là routing identity, không role/principal runtime mới. Identity giữ exact expected raw SHA khi approval/preservation yêu cầu; mutable ordinary file không pin content hash lâu dài. `validators` là closed IDs, compiler đối chiếu minimum obligations theo class và từ chối thiếu/extra unknown ID.

V1 chọn **exact repository-relative paths cho mọi classified formatting artifact**, không wildcard rules hoặc root-wide historical/generated admission. Điều này tốn cập nhật inventory khi thêm file nhưng ngăn overmatch. Sáu valid classes theo Specs; `UNCLASSIFIED` là failure diagnostic, không admission có thể PASS.

Lifecycle/approval/normative obligations là binding bổ sung trên một primary class, không tạo hai entry chồng nhau: ví dụ normative delta trong active change có primary ACTIVE_CHANGE_OWNED, nhưng vẫn phải chạy normative obligations; approved active review cũng có approval-integrity binding. Không ưu tiên “class thắng” để bỏ nghĩa vụ. Conflict chưa resolve → FAIL.

Admission/update/removal là exact reviewed metadata diff, independent reason/owner evidence, expected preimages và new revision. Không dùng file đang FAIL formatter làm admission rationale. Delete entry chỉ hợp lệ cùng approved retirement/removal/transition của artifact; tồn tại file mà mất entry → FAIL. Không reassign class bằng pathname. Current records không tự chứng minh approval: validator kiểm tra evidence existence/digest/decision/scope, nhưng genuine human approval vẫn là workflow trust boundary.

Canonical hash cho structured unit: UTF-8, object keys recursively sort theo code-unit order, arrays giữ order trừ set được schema yêu cầu sort theo path/ID, compact JSON, không BOM/newline; integer only, reject nonfinite/duplicate keys. Không Unicode normalization. Raw file SHA độc lập, không hash canonical JSON thay cho preserved raw bytes. JSON files có thể format ổn định bằng approved Prettier; approval unit bên ngoài bind raw postimage. Không ghi self-hash của file vào chính file đó; evidence refs dùng immutable reviewed units bên ngoài để tránh circular hash.

**Alternative rejected:** comment-only exemptions, directory globs, hash-only self-approval. Authority không được suy từ bytes hiện tại.

### D2 — Universe, coverage và path safety

Inventory lấy union Git tracked paths (kể cả missing) và untracked non-ignored paths bằng NUL-delimited Git output; tracked paths không mất khỏi inventory khi thêm `.gitignore`. Không đọc secret ignored environments, dependencies/cache/build directories. Scope discovery không dùng `.prettierignore` để quyết định classification universe.

Với mỗi regular file, local pinned Prettier file-info API (không ignore) xác định parser; union thêm mọi policy/baseline/preservation path. Supported file phải classified. Unsupported/binary file được báo OUTSIDE_FORMAT_DOMAIN với parser/tool binding; đây không là class/exemption cho supported file. Parser/tool/config thay đổi hoặc rename được review; missing/unknown parser cho entry từng thuộc formatting scope → FAIL, không tự exit. Tên file mới không parser nhưng có extension/text domain chưa được policy owner review → UNCLASSIFIED; không dùng “parser null” để loại arbitrary text source. Binary-domain admission dùng exact inventory/type evidence, không extension-only shortcut.

Resolve root bằng Git top-level. Path syntax slash-relative, reject absolute/UNC/drive/ADS, `.`/`..`, empty components, control/NUL, trailing dot/space, case-collision, symlink/reparse traversal, resolved escape. Không shell interpolation hoặc glob expansion. So sánh exact case Git path; Windows case-fold collision fail. Lstat parents + actual file identity, re-read identities/hashes và inventory sau checks để bắt concurrent drift. Không claim lock toàn repository: change during run làm run không hợp lệ.

Coverage algorithm:

1. Parse policy và bind schema/validator/tools/preservation/migration versions trước chạy checks.
2. Inventory độc lập ignores; snapshot path/type/current raw identity; keep missing tracked/expected paths.
3. Count entries per exact path: zero → UNCLASSIFIED; more than one → DUPLICATE_CLASSIFICATION. Rule matching không có ở V1.
4. Resolve every entry owner/admission/lifecycle/ref; stale metadata hoặc extra dangling entry không được bỏ qua.
5. Derive minimum validator obligations từ class + bindings trong source-owned registry, không tin metadata tự khai đủ.
6. Require exactly one classification và đủ actual result per obligation. Prettier-excluded supported paths vẫn ở universe, phải alternate-validated; BND-01 giữ FAIL cho legacy exclusions chưa được reviewed admission.
7. Re-snapshot trước kết luận; changed/missing/new paths → CONCURRENT_DRIFT. Aggregate không PASS nếu inventory không ổn định.

| Condition                                             | Deterministic code                                                    |
| ----------------------------------------------------- | --------------------------------------------------------------------- |
| Unmatched hoặc unknown class/domain                   | UNCLASSIFIED                                                          |
| Duplicate/overlap                                     | DUPLICATE_CLASSIFICATION                                              |
| Unsupported policy/validator contract pair            | POLICY_VERSION_MISMATCH                                               |
| Policy/preservation missing, malformed, binding drift | POLICY_INVALID / PRESERVATION_BINDING_INVALID                         |
| Entry tồn tại nhưng file missing                      | ARTIFACT_MISSING                                                      |
| File ngoài expected generated/migration inventory     | UNEXPECTED_ARTIFACT                                                   |
| Stale entry/identity/classification                   | CLASSIFICATION_STALE                                                  |
| Owner/status/admission mismatch                       | OWNER_BINDING_STALE                                                   |
| Unsafe path hoặc alias                                | UNSAFE_PATH                                                           |
| Rename                                                | ARTIFACT_MISSING + UNCLASSIFIED hoặc UNEXPECTED_ARTIFACT cho new path |
| Missing/skipped/incomplete validator                  | VALIDATION_COVERAGE_GAP                                               |
| State đổi trong run                                   | CONCURRENT_DRIFT                                                      |

**Alternative rejected:** enumerate chỉ manifest entries; cách đó không phát hiện file mới hoặc deleted classification.

### D3 — Command routing và enforcement

Proposed future routing, **không phải commands đã implemented**:

- `pnpm format:check` → `node scripts/format-policy/check.mjs`.
- `pnpm format` → cùng read-only entry, không còn implicit repository-wide write; thông báo correction cần approved exact scope. Không thêm automatic migration writer.
- CI giữ `pnpm format:check` mandatory. Check verifies exact approved package route + CI invocation; route drift → ROUTE_BINDING_MISMATCH. Không “return 0” khi child failed.
- Registry đóng: `mutable-prettier-v1`, `generated-repro-v1`, `historical-preserve-v1`, `archive-preserve-v1`, `active-owner-v1`, `normative-v1`; class compiler chọn bắt buộc, metadata không được xóa obligations.
- Mutable set: MUTABLE_FORMATTED, ACTIVE_CHANGE_OWNED và NORMATIVE_REVIEW_REQUIRED khi không có separately approved preservation-only disposition. Active status tự nó không exempt. Generated/history/archive chạy mandatory alternates. Active/normative cũng chạy owner/approval checks, dù formatter PASS.
- Call local pinned Prettier API `check` trên exact read bytes, explicit `filepath` và reviewed config; không truyền ignore file vào check. Không formatter-write trong validation. Unsupported/missing parser → failure. Current ignore chỉ là compatibility input được audit/cross-check, không route authority.
- Coverage fatal errors có thể ngăn các dependent checks chạy an toàn; records đó báo NOT_RUN_DEPENDENCY_FAILURE, overall FAIL. Không bỏ lỗi rồi claim all checked.
- Exit 0 chỉ all mandatory PASS; exit 1 deterministic validation failure (gồm UNKNOWN/WAIT_FOR_OWNER nghĩa vụ chưa đạt); exit 2 internal/configuration/execution error. Cả 1 và 2 đều fail CI. Không `--skip-class`, env bypass hoặc diagnostic-only mode trả overall PASS.
- Raw child stdout/stderr và exit giữ attribution, bounded error output; thrown exception, timeout, terminated child là failure, không treat zero artifacts là PASS.

Trong migration, old global checker vẫn là required gate cho tới approved coherent switch; shadow candidate checks không thay old result. Không ghép hai semantics bằng “old OR new PASS”.

**Alternative rejected:** chỉ sửa ignore; parallel optional checks; free-form validator commands từ JSON.

### D4 — Generated OpenSpec adapter

Adapter chỉ nạp reviewed installed generator package sau exact source/version verification. Installed version string 1.11.0 là observation, không supply-chain proof. Future binding phải gồm package integrity/source-tree digest, exported generator/template/transformer dependency closure, adapter source digest, selected nine workflow IDs, Codex tool/delivery/command-surface inputs và expected output inventory. Không dùng machine-specific absolute path làm portable identity.

Nguồn đã đọc: installed `dist/core/shared/skill-generation.js` (`getSkillTemplates`, `generateSkillContent`) và `dist/core/update.js`, nơi `getTransformerForTool` được truyền vào generator. Vì update cũng writes/removes skill directories, **không gọi `openspec update/init` trong validator**. Adapter dùng reviewed pure generation functions + exact tool transformer, output in-memory hoặc isolated temporary directory ngoài repository; không output vào .agents. Package missing/digest mismatch → FAIL, không auto-install/download/update. CI cần reviewed matching local tool supply trước activation, chưa được chứng minh ở Design.

So sánh:

- Inventory canonical: sorted exact output path set, count và raw SHA; missing/extra path FAIL.
- Content: exact raw output bytes so với working file; không normalize newline/BOM/Unicode/trim/formatter. Canonical inventory hash không che content differences.
- Recompute mọi output mỗi full validation run; không dùng previous-run PASS thay thế.
- Deviation record: expected/current SHA, reason, reviewRef, status UNEXPLAINED hoặc REVIEWED_NOT_REPRODUCED. Cả hai fail reproducibility. Không patch table để đưa current bytes vào expected output. Approved future pipeline change phải own reviewed deterministic source + full reproduction evidence; không raw manual patch.

Trước generated baseline migration: full pinned pipeline tái tạo exact nine approved bytes/inventory, tool supply usable in CI/local, cold/warm determinism evidence và negative cases cho version/missing/extra/manual-edit. Nếu không tái tạo được, giữ blocker; cần separate reviewed pipeline/artifact decision, không tự regenerate thay bytes. Một pure-generation match không đủ cho full group PASS.

Codes: GENERATOR_IDENTITY_DRIFT, GENERATION_UNAVAILABLE, GENERATED_INVENTORY_DRIFT, REPRODUCIBILITY_UNPROVEN, GENERATED_BYTE_DRIFT. Mandatory timeout không chuyển FAIL thành PASS.

**Alternative rejected:** hash-only output preservation như reproducibility; formatter-generated canonicalization; chạy mutating upstream installer/update.

### D5 — Historical preservation và reference integrity

Preservation record: exact path, expected raw SHA-256, owner, historicalRole, originating change/review, admission approval ref và reference bindings. Mỗi reference có source path, exact reviewed unit locator/digest, target identity/digest và role (approval/reference/observation). Không coi mọi digest occurrence là approval; không compare old approved hash với một intentionally newer artifact rồi báo historical evidence sai.

Validator resolve original file và reference units, require exact identity/locator cardinality, owner/admission còn applicable. Missing file → ARTIFACT_MISSING; raw drift → PRESERVED_BYTES_CHANGED; ref missing/stale → PRESERVATION_REFERENCE_STALE; malformed record → PRESERVATION_BINDING_INVALID. Lưu historical source unit thay vì hash cả active evolving evidence file khi authority chỉ duyệt unit; full-file binding vẫn phải exact khi review contract quy định full-file.

Correction: new record/revision có approval riêng trỏ tới original identity; original và original approval unchanged. Không updater nào rewrite old hashes. Reference scan trước admission xác định exact accepted references; additional discovered potentially authoritative reference cần review, không tự bỏ. Không quét text rồi suy ra owner.

**Alternative rejected:** global search/replace SHA, reformat-then-rebind, file existence only.

### D6 — Archive admission và validator

Archive admission gồm: exact path/raw SHA, archive custodian, origin/lifecycle provenance evidence, historical role, explicit admission decision, reference bindings. Archive folder membership không đủ. Dùng cùng safe preservation primitive với distinct `archive-preserve-v1`, để result phân biệt archive/historical authority.

Expected bytes còn nguyên → preservation PASS; missing, changed, stale expected identity hoặc unauthorized replacement đều FAIL. Replacement cùng path nhưng khác bytes không được coi là correction. Correction thêm record/revision riêng với owner approval, giữ original. Không sửa link bên trong admitted original chỉ để readability nếu điều đó đổi protected bytes; correction record có thể hướng tới link mới. Ordinary archive README không tự trở thành immutable.

**Alternative rejected:** recursive docs/archive ignore hoặc blanket immutable folder.

### D7 — Active ownership và lifecycle handshake

Active entry có owner.changeId, exact active change path, status tuple (presence, OpenSpec status, completed/total Tasks khi có), review gate/unit bindings và current authorized artifact preimage. Status được lấy read-only từ `openspec list/status --json` cùng source artifacts; CLI chỉ báo implemented workflow state, không human approval. Không suy lifecycle readiness từ task counts.

Known three paths trong Appendix A thuộc `async-interaction-feedback-foundation`, in-progress 15/19, disposition WAIT_FOR_OWNER. Existing approved Technical VERIFY và QA NOT_EXECUTED không cho phép hygiene edit.

Owner-authorized mutation là coordinated exact preimage/postimage/diff, updated current binding trong cùng reviewed owner revision. Không simultaneous independent formatter-write. Status count đổi cũng cần owner binding refresh; không autoaccept. Nếu owner đang làm việc, validation báo OWNER_BINDING_STALE/WAIT_FOR_OWNER và migration đứng lại thay vì lấy fresh hash làm approved baseline.

Exit cần explicit owner lifecycle transition, preserved old approval/history và new class admission cùng revision. Move/archive path một mình không đủ; new path chưa admitted FAIL. Active-owned file vẫn check formatting trừ khi riêng preservation disposition được approved với alternate coverage; Design này không cấp disposition đó.

**Alternative rejected:** ignore active roots hoặc chạy format khi owner không hiện online.

### D8 — Normative mutation evidence và equivalence

Normative evidence object: owner, exact path, preSha256, postSha256, raw proposedDiffSha256, approval unit ref, parser/tool identity, before/after parsed projections, structural checks, strict command/exit evidence và unchanged lifecycle assertion. Postapproval không tự sinh vì formatter PASS.

Read-only validator kiểm tra current bytes là approved preimage (candidate chưa applied) hoặc approved postimage (validation after authorized apply), với explicit stage; preimage mode không được báo migration complete. Exact diff reverse applicability/postimage match bắt buộc. Current normative artifacts ngoài migration chỉ cần current approval/integrity + formatting + strict validation; không phải mọi routine run đều yêu cầu new mutation approval.

Parsed main-spec projection bằng pinned OpenSpec parser: Purpose, ordered requirement identities/text, ordered scenario identities/bodies. Inspected parser có normalization và không giữ đủ heading identity trong parsed requirement model; vì vậy bổ sung ordered heading/structure projection từ nguyên liệu, không dựa vào counts alone. Compare toàn bộ content: fenced code, URLs, inline literals, list nesting/order, requirement/scenario names, WHEN/THEN text. Chỉ parser-position offsets và demonstrably presentation-only whitespace được bỏ; ambiguous Markdown whitespace, tables hoặc unsupported projection → EQUIVALENCE_UNPROVEN, human exact diff review vẫn bắt buộc. Không claim parser chứng minh legal/semantic equivalence tự động.

Schema YAML: parsed structure exact keys/values/order-sensitive arrays; instruction strings bảo toàn nghĩa qua same conservative Markdown projection. Templates: heading hierarchy, placeholders, instructions, code examples và structural whitespace được kiểm tra; không đổi generated instruction meaning. Chọn adapter dùng parser tooling đã tồn tại trong pinned tool chain; không thêm framework ở Design.

Required strict commands sau candidate/apply trong safe scratch review tree: `openspec schema validate yuta-spec-driven --json` khi schema/templates affected; `openspec validate --specs --strict --no-interactive` cho main specs. Nếu active delta affected, thêm exact change strict validation. Scratch chứa faithful required context, không mutate actual repo; validation on scratch không thay actual post-Apply rerun. Schema parser hoặc strict failure → NORMATIVE_VALIDATION_FAILED; wrong owner/preimage/diff → NORMATIVE_APPROVAL_MISMATCH; projection drift → NORMATIVE_SEMANTIC_DRIFT. Không promote lifecycle.

**Alternative rejected:** stripping all whitespace, count-only equivalence, formatter PASS làm semantic proof.

### D9 — Audit evidence model

Output logical JSON envelope: evidenceSchemaVersion, policyRevision, rawPolicySha256, validatorContractVersion, tool bindings, scopeInventorySha256, sorted artifacts và aggregate. Mỗi artifact: path, class, owner, validator IDs/versions, expected/current identity khi applicable, result, sorted failure codes, safe reason và approval reference identity. Sort theo path rồi validator ID; repeated inputs cho logical payload giống nhau. Timestamp/duration/process ID là run metadata riêng, không trong logical canonical digest.

Codes không phụ thuộc OS error prose. Detail giữ actual command exit và affected scope, không dump environment hoặc credentials. Truncated diagnostic vẫn có failure code/identity, không truncated evidence được coi COMPLETE. Report không tự ghi vào repository; current change owner chọn allowed review packet khi ghi evidence. Không standalone lifecycle auto-update.

**Alternative rejected:** console message only, secret config dump, timestamp-sensitive “deterministic” hash.

### D10 — Bypass resistance và trust boundary

| Attempt                                      | Mitigation / failure                                                                                                              |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| New path ngoài classification                | Independent Git+parser inventory; UNCLASSIFIED                                                                                    |
| Broad wildcard ignore                        | No wildcard admission V1; ignore không quyết định universe/check API; coverage gap FAIL                                           |
| Delete entry                                 | Inventory still finds path; UNCLASSIFIED; preservation inventory binding also invalid                                             |
| Update hash không authority                  | Independent immutable approval unit/diff binding; PRESERVATION_REFERENCE_STALE / APPROVAL mismatch                                |
| Skip class via command edit                  | Closed registry mandatory obligations + route binding + dedicated routing regression; ROUTE_BINDING_MISMATCH                      |
| Ignore child failure                         | Central aggregation owns exit; missing result/exception/timeout FAIL                                                              |
| Reclassify failing mutable                   | Require owner/admission evidence independent formatter failure; unauthorized transition FAIL                                      |
| Rename evade                                 | Old expected missing + new unmatched; no path-based historical permission                                                         |
| Change .gitignore                            | Tracked files never hidden; ignore binding change requires review; new ignored content không được introduced as approved delivery |
| Symlink/case/path escape                     | Safe-root/lstat/case checks reject before content/execution                                                                       |
| Modify both validator and policy maliciously | Outside self-authentication guarantee; trusted reviewed execution/CI source remains required                                      |

Không tuyên bố local self-check chống được attacker có quyền thay cả source validator/CI/approval records. CI must execute reviewed validator revision và reviewers phải kiểm tra route/policy/approval diffs qua trusted workflow; current branch protection/mandatory-check configuration chưa được chứng minh trong lượt này. Không tự cấu hình GitHub hoặc thêm signer. Test negative cases là future implementation acceptance, chưa executed.

### D11 — Performance và developer operability

Inventory O(N log N) sorting + O(total relevant bytes) hashing; scan hiện tại ở cỡ 2.6k files là bounded practical candidate, không latency benchmark. Prettier parser info reusable trong run; full content hashing không bỏ để cache shortcut. Generated group chạy một batch pure pipeline cho 9 outputs; strict schema/main checks một lần mỗi run, không per file. Giới hạn concurrency mặc định 4 và bounded subprocess output; deterministic result order độc lập completion order.

Không persistent PASS cache V1. Exact-path inventory tăng review cost khi thêm file; đề xuất diagnostics chỉ rõ entry cần admission, không auto-admit. Validation không cần production credentials, DB, internet hoặc app build. Nếu generator adapter cần những thứ đó, generation remains blocked, phải owner review trước đổi approach. Temp output ngoài repo, unique owned path, cleanup chỉ exact verified temp target; cleanup failure được báo, không broad recursive deletion.

CI local inputs phải cùng tool versions/source identities; missing offline tool FAIL. Runtime cost threshold/timing cụ thể đo ở approved implementation validation sau; không fabricate seconds hoặc performance PASS.

**Alternative rejected:** cache keyed only on mtime/version string hoặc chỉ chạy changed files cho aggregate.

### D12 — Recovery và coherent versioning

| Failure state                                   | Safe recovery                                                                                                                            |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Partial policy migration                        | Giữ FAIL, ghi completed exact subsets/current bytes; resume chỉ matching approved checkpoint; không claim whole67                        |
| Policy written, old validator                   | Contract version/route checks fail; không activate new route trước matched bundle và coverage tests                                      |
| Validator changed, classification incomplete    | VALIDATION_COVERAGE_GAP; không fallback to mutable-only green                                                                            |
| Generated identity stale                        | STOP generated group; retain files; review tool/pipeline binding, không regenerate tự động                                               |
| Late active owner conflict                      | Isolate entry WAIT_FOR_OWNER; preserve owner edits, no hash refresh                                                                      |
| Mutable formatting succeeded rồi check failed   | Preserve failed evidence; owner chọn approved exact rollback hoặc reviewed forward correction; không broad checkout/reset                |
| Normative formatting succeeded rồi check failed | Stop acceptance; retain pre/post/diff; exact owner-authorized reversal only if current postimage still matches; strict rerun             |
| Preservation manifest missing/corrupt           | Overall FAIL; recover exact last-approved bytes từ verified source với authorization, không reconstruct expected hashes từ current files |

New policy/validator/preservation/migration bundle versions phải agree trước result. Không multi-file atomicity giả: partial worktree có thể tồn tại và **phải FAIL**. Rollback không rewrite historical evidence, không touch concurrent Pointage/parent work. Candidate migration diễn ra trong isolated review context sau authorization; actual source switch chỉ sau coherent tested bundle. Chuyển về old checker không xoá historical failures hoặc authorize parent.

## Risks / Trade-offs

- [45 existing exclusions chưa có bounded alternate admission] → BND-01, return Control Tower; không arbitrary grandfather/exclude hoặc mở rộng 67 mutation.
- [8 generated outputs chưa reproducible] → mandatory blocking evidence trước generated migration; không giảm R4.
- [Exact inventory/status bindings tốn owner updates] → deterministic diagnostics và coordinated reviewed changes, không auto-rebaseline.
- [Parser projection không chứng minh mọi semantic equivalence] → conservative fail-closed + exact owner diff review, strict checks không thay thế review.
- [Local source tự khai approval] → distinguish structural binding from genuine human approval; trusted workflow/CI boundary vẫn cần.
- [Concurrent edits giữa scans] → pre/post inventory and identity comparison; retry chỉ fresh authorized binding, không lấy stale PASS.
- [CI portable tool supply chưa verified] → version/source-bound offline execution prerequisite, không auto-procure.
- [Unresolved inclusion rộng hơn migration] → giữ scope question là blocking design decision, không giấu trong “future optimization”.

## Migration Plan

Đây là thiết kế sequencing/recovery, không Implementation Plan/TIC/task authorization. `migration-67.json` khi được phép tạo sẽ copy exact Appendix A preimages, intended class, owner routing và handling; từng entry phải có resolved owner/admission evidence trước execution. Owner labels trong appendix là routing proposals dựa trên class/context, **không tự grant authority**. Current user approval cho 67-file baseline không đồng nghĩa approve mọi future mutation.

1. Resolve BND-01 trước finalized Design: phân biệt validation coverage admission với mutation scope. Mọi additional file giữ nguyên; không autoappend vào frozen67.
2. Capture exact approved policy/validator/tool/owner inputs; verify toàn67 trước mỗi subset và current affected preimage ngay trước mutation. Một file drift → isolate affected entry, STOP review; không rebaseline toànset, không tự tiếp tục affected work. Other subset chỉ tiếp tục nếu separate approval còn valid và independence được chứng minh.
3. Chuẩn bị proposed classification/alternate evidence không đổi baseline bytes: historical24 + archive22 cần explicit admission/ref evidence; generated9 cần full reproduction; active3 giữ WAIT_FOR_OWNER; normative5 và mutable4 cần exact formatter-only proposed diff.
4. Generated migration chỉ admission/validation khi exact reproduction đã PASS; không generated byte formatting. Nếu không đạt, group remains blocked.
5. Mutable4: approved scope-only candidate formatting, diff semantic check và reviewed pre/post identities; không command toànrepo.
6. Normative5: D8 approval/equivalence/strict evidence trước any formatting; giữ requirements/scenarios/lifecycle exact semantics.
7. Active3: owner-authorized revision/lifecycle exit riêng hoặc giữ WAIT_FOR_OWNER; không hygiene takeover.
8. Historical24/archive22: preserve exact originals; corrections nếu cần là separately approved new records, không là mass hash replacement.
9. Chỉ activate approved coherent routing sau complete coverage + all alternate evidence + mutable/normative outcomes PASS trên final state. Partial subset không unblock parent. Fresh parent continuation cần approval riêng; không chạy trong change này.

Counts chỉ initial migration, không permanent class limits. Reversal dùng D12; không deployment/production semantics. Không sửa approved main specs trong lượt này.

## Blocking Review Questions

**BND-01 — existing exclusions coverage/ownership:** current ignore bỏ qua 45 supported Git-listed artifacts ngoài67, gồm active database metadata, historical baseline copies, fixture manifests, service worker và lockfile. Có hai possible routes cần authority lựa chọn, không chọn bằng assumption:

- Authorize bounded additional classification/alternate-validation discovery/design cho đúng45, giữ mutation baseline67 và mọi45bytes unchanged; xác định owner/generator/reference validators trước activation. Đây là recommendation.
- Nếu Control Tower muốn giữ chúng ngoài new validation universe, cần explicit scope decision và review alignment với approved R1/R3/R10; không gọi grandfathered ignore là compliant alternate validation. Không tự revise Specs.

Không thể báo design ready-for-implementation với blanket exemption hoặc unresolved mandatory validator families. Đây không phải regression trong approved artifact bytes. Không mở lại Gate1/2 tự động.

Generated8 evidence và async owner authorization vẫn là migration prerequisites đã biết; không phải evidence PASS. CI source trust/tool supply chưa verified và phải được đáp ứng trước activation, không được suy từ Design.

## Appendix A — Frozen exact 67-file migration binding

M=MUTABLE_FORMATTED; G=GENERATED_EXTERNAL_OR_DERIVED; H=HISTORICAL_HASH_BOUND; A=ARCHIVED_PRESERVED; C=ACTIVE_CHANGE_OWNED; N=NORMATIVE_REVIEW_REQUIRED. Intended classes không thay admission approval. Parent retained baseline source SHA: `36e66b08a712d99a12f3f3243a803bced9bf707a7bb6ea9b47b83ec7e896b504`; 67/67 raw hashes rechecked unchanged.

| ID  | Exact path                                                                                                | Preimage SHA-256                                                   | Intended class | Owner routing                                  | Proposed handling      |
| --- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | -------------- | ---------------------------------------------- | ---------------------- |
| 1   | `.agents/skills/openspec-apply-change/SKILL.md`                                                           | `7c79315715da88639e60f05268206ba72939ef9bf298c6f3195152d09d20b3fe` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 2   | `.agents/skills/openspec-archive-change/SKILL.md`                                                         | `e0ffaacdb982e7440e97979422a91178cc93220a5805bd07cbdaef82c33284ac` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 3   | `.agents/skills/openspec-continue-change/SKILL.md`                                                        | `0176d962032c6c36011db0ef30c1cd6130ef6c34ebf359d64cdb21c958949972` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 4   | `.agents/skills/openspec-explore/SKILL.md`                                                                | `95ed31936b538cbf44b5e3f7f81da50defd256d96048ee370d82b36e8ff5c486` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 5   | `.agents/skills/openspec-new-change/SKILL.md`                                                             | `84374cb8ab0c6e076933126f688bc7f59abdfa7aced7bb710743dd3bf72e3383` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 6   | `.agents/skills/openspec-propose/SKILL.md`                                                                | `0c95777dd8cc28f52dc4d6e2a51beeb1917a6638bed51baa710735721784d731` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 7   | `.agents/skills/openspec-sync-specs/SKILL.md`                                                             | `da0ae40869be60ceff6cd231c75976487875675a7eca390b61a932b081aa91d4` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 8   | `.agents/skills/openspec-update-change/SKILL.md`                                                          | `23bd9d7d95cc34caee693f7f3671ec8d49f8eca436483d3e29bea43e511b87d5` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 9   | `.agents/skills/openspec-verify-change/SKILL.md`                                                          | `a049b171b9728a684d901f5e0d6f523bdcd768bc083277a1f6bb9b556cd24b9c` | G              | OpenSpec tooling custodian                     | REPRODUCE_OR_STOP      |
| 10  | `docs/archive/knowledge-normalization/tasks/YUTA_KNOWLEDGE_AUDIT_TASK.md`                                 | `b64b2552f443f934fcbce610742ba096121a21e1bcd6e72f60815d86f99737d1` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 11  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_1_AUTHORITY_MODEL_TASK.md`                          | `d2868540f14588fc63a1023a4d4c656ade4c87a11d13b1c912a4bc7d35e47716` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 12  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_2_LIFECYCLE_STATUS_MODEL_TASK.md`                   | `91bd52894d8a47298e413c82c14930ed947ff7ae509381a19af21f5dbe4eabd1` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 13  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_3_MODULE_REGISTRY_TASK.md`                          | `b67b76d8e6b68a94164849e06abcac607136ef5d6fd0847bca69dd87eabb4aaf` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 14  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_1_PERSONNEL_PRODUCT_KNOWLEDGE_HOME_TASK.md`       | `c3233400c564b178bfea043a3377ce9dbdf6eef129c974c30ce6cd54a0cd061f` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 15  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_2_TODAY_PRODUCT_KNOWLEDGE_HOME_TASK.md`           | `eaaba0ec35c84752b6611e83956a7ee940c7e95c58dabb602add33d8843fa5e1` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 16  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_3_ESTABLISHMENT_PRODUCT_KNOWLEDGE_HOME_TASK.md`   | `076ce2c81cd01f730712bbd99b17ccfce2c295659bdcc4d48e20db33838a2297` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 17  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_4_IDENTITY_ACCESS_PRODUCT_KNOWLEDGE_HOME_TASK.md` | `a32137c77beb979e58e6ef302dd6a40260c582da7975917d6234b85d74bfe89f` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 18  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_5_SITE_AGENT_PRODUCT_KNOWLEDGE_HOME_TASK.md`      | `ce8aae0936e8da8cf2612d0c7800467f1767c1df880365f4b6fa0d91e471fda2` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 19  | `docs/archive/knowledge-normalization/tasks/YUTA_STEP_5_6_DISPLAY_PRODUCT_KNOWLEDGE_HOME_TASK.md`         | `0e897d0298b1edb364fb8d30af347a7b571a50c5de6bf555a1f1aa7cd6b88799` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 20  | `docs/archive/yuta-workflow/tasks/YUTA_AUTOMATED_OPEN_SPEC_REVIEW_WORKFLOW_SETUP_TASK.md`                 | `26cfc8e0e0805a2a716909a18cfb86407f85eb508eefe5657e5c50a64e158ff6` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 21  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0_OPENSPEC_LOCAL_BASELINE_AUDIT_TASK.md`                    | `44f10bc1956b130d26fbe2a5ca37bcbba8e12e571608d6448ced5be26af52e6b` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 22  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_0B_OPENSPEC_1_11_DELTA_REAUDIT_TASK.md`                     | `3bff5078465adc49a91db004dc527cd9fdedf0b3ef435e34affb0824b2a83550` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 23  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_1_FORK_AND_DESIGN_YUTA_SCHEMA_TASK.md`                      | `1c09d910450fd7d1e32b35c6c86f0beabd683b2bae6247fef73b30e71fa7ec36` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 24  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_2_ISOLATED_OPENSPEC_SCHEMA_SMOKE_TEST_TASK.md`              | `eab95cce27be4f9e76b2eb3e854d01bde059066f9ac60a39fc9645dbb2a01269` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 25  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3A_OPENSPEC_SCHEMA_HARDENING_ANALYSIS_TASK.md`              | `98b375dee27a9a112377ed2feaabe1f7d505ef5c37ab6ec60f6e40c335559880` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 26  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_3B_MINIMAL_SCHEMA_HARDENING_TASK.md`                        | `d226560949cd6ca073b907fdddae71d3bc17e7e161846fcc9c1703873e985e62` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 27  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_4_OPENSPEC_ACTIVATION_POLICY_REVIEW_TASK.md`                | `d48f8dca326d38b874867dcd20f641eaa9c6385333010ab6224cd04a57c3f289` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 28  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_5_ACTIVATE_YUTA_SPEC_DRIVEN_TASK.md`                        | `7843820f9cf323127c7024e2e44530ad330c741832983b7a3685708793503012` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 29  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6A_OPENSPEC_NORMATIVITY_POLICY_REVIEW_TASK.md`              | `34f4264630ea7d07428fa58e6409e7a4eb7815250848d27b193225630e49fd0c` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 30  | `docs/archive/yuta-workflow/tasks/YUTA_STEP_7_6B_ENABLE_NORMATIVE_SPECS_TASK.md`                          | `e2a5517077d2234001c8cb7c0e9b8027b099b409b04d6b26aaa55d2574465f39` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 31  | `docs/archive/yuta-workflow/tasks/YUTA_WORKFLOW_V3_AUTOMATION_UPDATE_TASK.md`                             | `14538a6aeb70c26552811935cabe5f3729608a6b2d462ab78c05017aaa19dfba` | A              | Knowledge/workflow custodian                   | ADMIT_THEN_PRESERVE    |
| 32  | `docs/features/establishment/general-information/README.md`                                               | `2cd26adfe88321fb22d69d18d79f472faa0da49b9f1f7bcea2e212faf43cad62` | M              | Owning Product Knowledge maintainer            | REVIEW_FORMAT_ONLY     |
| 33  | `docs/features/establishment/README.md`                                                                   | `3faa9733f0422b39c1959758beb2e06ee2371810680eb89099e83da3b11da815` | M              | Owning Product Knowledge maintainer            | REVIEW_FORMAT_ONLY     |
| 34  | `docs/features/personnel/README.md`                                                                       | `33214c8a8699b4fffda22afd15d6360f8d4f90c4548adfe98955db772fccdd9d` | M              | Owning Product Knowledge maintainer            | REVIEW_FORMAT_ONLY     |
| 35  | `docs/PRODUCT_KNOWLEDGE.md`                                                                               | `7723a19aa5ffd7afe0c01d67d45ee352ea33dc0dec3892a2e6f423747e715c2d` | M              | Owning Product Knowledge maintainer            | REVIEW_FORMAT_ONLY     |
| 36  | `docs/reviews/async-interaction-feedback-foundation/01-analysis-review.md`                                | `03cbb892029eb01c8bac8b48e7c301458e21acde4940c4c5f71f2a08eea6c15c` | C              | async-interaction-feedback-foundation          | WAIT_FOR_OWNER         |
| 37  | `docs/reviews/async-interaction-feedback-foundation/02-specs-review.md`                                   | `221fa3040d8c5756c5f00dd9a0d42ec18c314bb00c8f0b286c4f1c3eab628b92` | C              | async-interaction-feedback-foundation          | WAIT_FOR_OWNER         |
| 38  | `docs/reviews/personnel-reconstructable-value-history/04-knowledge-consolidation-review.md`               | `134888250a8ee9a874d142866d19209dbad23066a1dd633f6d88434a320d4769` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 39  | `docs/reviews/restaurant-knowledge-communication-identity/04-knowledge-consolidation-review.md`           | `258c4405bff05a27a87d631b5fbd42f50148485c8ca72a60e7a1ce2b1cf49c0e` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 40  | `docs/reviews/restaurant-knowledge-team-culture/04-knowledge-consolidation-review.md`                     | `c2ec96123ca08b5e78c682e2fe5d0f87a13a1f543c3cff390c0399a7e4cea1f3` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 41  | `docs/reviews/restaurant-knowledge-validated-knowledge/02-specs-review.md`                                | `894efffdcb38fedab5956f925968ac0b1cc177a9eed212b30164c2c5f4c286ef` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 42  | `docs/reviews/restaurant-knowledge-validated-knowledge/02b-design-review.md`                              | `56eb5f4807b82d500ac9b323c60506e2040c25586356beb90b632fbd6b0d9a4d` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 43  | `docs/reviews/restaurant-knowledge-validated-knowledge/04-knowledge-consolidation-review.md`              | `82a4470c3b4f3d415db7964eb514919b9fc30e0ecab6897745145add28a4b306` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 44  | `docs/tasks/INFORMATIONS_GENERALES_PAGE_PRODUCT_KNOWLEDGE.md`                                             | `8be6ec2bb544955ad27e131a877f3f361741a85cfb96167911a9e95593f47a2a` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 45  | `docs/tasks/YUTA_INFORMATIONS_GENERALES_PAGE_KNOWLEDGE_INTEGRATION_AUDIT_TASK.md`                         | `af36c756a79e5a0c6c8a4566651df7e053e9468e4dffada3991eac9b652b4050` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 46  | `docs/tasks/YUTA_INFORMATIONS_GENERALES_PRODUCT_DECISION_INTEGRATION_TASK.md`                             | `802cf663fbfd2abee4e45a15723450dded0ac1d8a0f75e6a6bcb2b4aa400f3fe` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 47  | `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_DESIGN_TASK.md`                                      | `3a8e3ad54c0b25240c2807dcc3e6007032b21e6fe38a2f60485b1304c663f95c` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 48  | `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_PROPOSAL_ANALYSIS_TASK.md`                           | `3a9f28842b5eb8e6abfba01eb32ce15f3936358fdf543d2e81f8c655df9050ce` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 49  | `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_SPECS_TASK.md`                                       | `13295a7c1760535e16bdf1ca500fc9e5646957d024e2b1dec9ff9a37362b74ce` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 50  | `docs/tasks/YUTA_PILOT_01_ESTABLISHMENT_CONTACT_COPY_TASKS_TASK.md`                                       | `6ba82212a9b07239905d93f99e54ddcd63cf662d3e2e8c503fc38d909f05cb21` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 51  | `docs/tasks/YUTA_STEP_6_1_DOCUMENTATION_CLEANUP_AUDIT_TASK.md`                                            | `286e8257f44d98c92e4437264caffc477ac9694ddc111e3bd15086d6c4e8b1c4` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 52  | `docs/tasks/YUTA_STEP_6_2A_INDEX_TRUTHFULNESS_CLEANUP_TASK.md`                                            | `bcc64d6d57ddd7ab838f93ea670a5950befb1a168f7356b8f4f7f1efa9462545` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 53  | `docs/tasks/YUTA_STEP_6_2B1_CURRENT_STATE_SLIM_PLAN_TASK.md`                                              | `c756582e4d7b885de4f65ba087dc3f1642b32e51bb81a0c633a0dec379c187c2` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 54  | `docs/tasks/YUTA_STEP_6_2C_ARCHIVE_KNOWLEDGE_NORMALIZATION_HISTORY_TASK.md`                               | `54375b5ba943bad17f12cf24876327734ef435399d7b57cdf060bc591cf1aeb1` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 55  | `docs/tasks/YUTA_STEP_6_2D1_PUBLIC_BOOKING_PRODUCT_SPEC_REVIEW_TASK.md`                                   | `0cc1d849c2f83a87802ce2ee8239c3b409f20c37f01dd3c4052be7dac2dbdd29` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 56  | `docs/tasks/YUTA_STEP_6_2D3_POS_PRODUCT_SPEC_REVIEW_TASK.md`                                              | `56d11486010cc8d5c18cad82242c02759d80e3417ac732320ddd08f5754907b6` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 57  | `docs/tasks/YUTA_STEP_6_2E1_UI_PROMPT_TOPOLOGY_REVIEW_TASK.md`                                            | `a244f28cabde04d78bc1189517d19514c74f336611ee74cd146228fd7e0c4531` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 58  | `docs/tasks/YUTA_STEP_6_2E2_IMPLEMENT_GENERATED_SNAPSHOT_TOPOLOGY_TASK.md`                                | `2cdb6edaf3ba6c292c4ee7bf0a9b1e3ee758676a42f6ee46c44b16c333a8f50e` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 59  | `docs/tasks/YUTA_STEP_6_2E3_MIGRATE_EXISTING_PROMPT_PROVENANCE_TASK.md`                                   | `9b702151136d530c441077f08cf8d415d48832960c2aea9c13e445fe79c97f52` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 60  | `docs/tasks/YUTA_STEP_6_2F_FINAL_DOCUMENTATION_CLEANUP_VALIDATION_TASK.md`                                | `38d3cd2c5812ff5693853b9d9cac2ca25fd8b401a81e9bf463746413ec887a86` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 61  | `openspec/changes/archive/2026-08-30-establishment-copy-primary-contact-to-public/analysis.md`            | `cc46c4f9d3881f6fb930f88264f8a7c4021c0afe05a9b6dd48b899fbf3aaa0a2` | H              | Historical evidence owner / workflow custodian | ADMIT_THEN_PRESERVE    |
| 62  | `openspec/changes/async-interaction-feedback-foundation/analysis.md`                                      | `7535665d3bfac7bc328217fa418d045750eaeaa4d8da852613a351b030f3df39` | C              | async-interaction-feedback-foundation          | WAIT_FOR_OWNER         |
| 63  | `openspec/schemas/yuta-spec-driven/templates/design.md`                                                   | `e47df296318c6622f0b0911407e16b1578169403b96f61bf35fe1db7f7b417d6` | N              | YUTA workflow owner                            | REVIEW_EQUIVALENT_DIFF |
| 64  | `openspec/schemas/yuta-spec-driven/templates/proposal.md`                                                 | `ea0879a322bb1a3c6e3002c67b5a29e31120dcb17219e3000d43775f48481284` | N              | YUTA workflow owner                            | REVIEW_EQUIVALENT_DIFF |
| 65  | `openspec/schemas/yuta-spec-driven/templates/spec.md`                                                     | `1f370642f106589d901c0568e81b5f7741e9289da48df41b70dd21ad99592a0c` | N              | YUTA workflow owner                            | REVIEW_EQUIVALENT_DIFF |
| 66  | `openspec/specs/restaurant-knowledge/cuisine-know-how/spec.md`                                            | `90e46a1a4e0c2f13679c3eb15cbb560b84b7b4206b1a09ff926f01b7f6624928` | N              | Restaurant Knowledge capability owner          | REVIEW_EQUIVALENT_DIFF |
| 67  | `openspec/specs/restaurant-knowledge/validated-knowledge/spec.md`                                         | `203d674ad3f0afc1b4462b5584ca597412e09bf0a2c40f9b7937d736d7a73a70` | N              | Restaurant Knowledge capability owner          | REVIEW_EQUIVALENT_DIFF |

## Appendix B — Additional existing exclusions, observation only

45 exact files ngoài67. Không authorizing classification/mutation. Source: independent Git path inventory, installed Prettier file-info with no ignore versus current `.prettierignore`; `resolveConfig:false`. Đây là parser/ignore inventory, **không** format:check hoặc reproducibility validation.

| Exact observed path                                                                                                           | Current raw SHA-256                                                |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json`                                                | `8e43f64cb32fae3776636e8d74661fecb88d2f137847fe7e67c368a6624274b2` |
| `apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/manifest.json`                                                | `e76e0cfe39cafedcf25564e6dae079fadfc709fd8179da5000f7b7a4ff2879f0` |
| `apps/yuta-display/drizzle/meta/0000_snapshot.json`                                                                           | `615206f464a7a0ab96144af48d2fa7d494658bff9fb3695df63a9d118a65a2f7` |
| `apps/yuta-display/drizzle/meta/_journal.json`                                                                                | `2c0e6208cf91a524f96bdd40de959ca9756e47de0f28367db28464d96d84fc9a` |
| `apps/yuta-pos/public/sw.js`                                                                                                  | `f15be18c9207417c6d76fd363ffdef4f9898efb8cdbca99951707bdb661861be` |
| `docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/drizzle/meta/_journal.json`       | `f4f314b6c4e551641ac505015832219ec3660966fda67f8e79429702b03da2fc` |
| `docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json`        | `be4d18a6478c5c637c45df08d2b4188380340a5ae19e6264fb61523ec4d71052` |
| `docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json` | `eda4a2bf75d48b6cb69a39ec13b84412a96ce239f6b0717ea39cc0cc1118a3f4` |
| `packages/db-cloud/drizzle/meta/0000_snapshot.json`                                                                           | `75086e8b7a0eb17174f765aec9537e71bcb0e774ef05ed7e73ae8a4a7e12e49e` |
| `packages/db-cloud/drizzle/meta/0001_snapshot.json`                                                                           | `f2fa84d91362dbec21f7f8f85ee3c03b1f6d751739da93c3374af6ceade68076` |
| `packages/db-cloud/drizzle/meta/0002_snapshot.json`                                                                           | `5b047f116e96d7dfb64c9072c6d26157c96791d0ef058e2ec59061b216d75f34` |
| `packages/db-cloud/drizzle/meta/0003_snapshot.json`                                                                           | `9468f2723702308be1b23b0c80160c069b3a46975f9a1fd031b26f36e7153701` |
| `packages/db-cloud/drizzle/meta/0004_snapshot.json`                                                                           | `57fd3427fc9aec97dafd77d8b643efd611c8c12a65bf64f8cd39a30e8cdb99ad` |
| `packages/db-cloud/drizzle/meta/0005_snapshot.json`                                                                           | `7109ff799c71fde11b6f525e828b11d57b2731598779948f4c2bebf5bc2ecb8c` |
| `packages/db-cloud/drizzle/meta/0006_snapshot.json`                                                                           | `f729248590dcc711e05a46e3ad756b4b789affd485131799bc069d15537fb936` |
| `packages/db-cloud/drizzle/meta/0007_snapshot.json`                                                                           | `9be05c6ec7d1c2c68f6731289fff95efa1ef5e7a6309745ac10593cdef2e245e` |
| `packages/db-cloud/drizzle/meta/0008_snapshot.json`                                                                           | `2e742120524620e7389731b83da36719bec8e107b4d1841c8e8afeb1d26c95a0` |
| `packages/db-cloud/drizzle/meta/0009_snapshot.json`                                                                           | `fb6099d284bff9976010c5ca50a58f71a7d9188978206baee0f4cacdc33eb082` |
| `packages/db-cloud/drizzle/meta/0010_snapshot.json`                                                                           | `3d18a0e5349007bf5cdd741c0f742db112075da5a743e014b7539482842cdd2f` |
| `packages/db-cloud/drizzle/meta/0011_snapshot.json`                                                                           | `e997a937c036eef36efff3708c7f01691a77bca0d7982b987b18a759c71be5b4` |
| `packages/db-cloud/drizzle/meta/0012_snapshot.json`                                                                           | `78bfbd520781589d5509d1f28ebba3249e28adfb2932756eff33821328e19e7c` |
| `packages/db-cloud/drizzle/meta/0013_snapshot.json`                                                                           | `b50aaa51aa9bd97c5fa36e3ea5027982cca20b345fa2d74f555bc294778a23d8` |
| `packages/db-cloud/drizzle/meta/0014_snapshot.json`                                                                           | `2a353328c9b76c27350fa5374b8b4cdfb55e745b453930b40cda2321f4728d00` |
| `packages/db-cloud/drizzle/meta/0015_snapshot.json`                                                                           | `b4ad465af34ff105074fe72e26260863c10cff38725562ac0242127b8c2ade8f` |
| `packages/db-cloud/drizzle/meta/0016_snapshot.json`                                                                           | `28e3c65cb32594869a517fe8ac769580c1d46517942e91a25a9285c30f5a5537` |
| `packages/db-cloud/drizzle/meta/0017_snapshot.json`                                                                           | `617681b23ddea95f13cfc5d82fac6e3649499515d546d5ee10ff67a8324f9ea6` |
| `packages/db-cloud/drizzle/meta/0018_snapshot.json`                                                                           | `07ede7f42b4f1f744e700d5603b6dbfd69d867aefc86d498295251628035e0ee` |
| `packages/db-cloud/drizzle/meta/0019_snapshot.json`                                                                           | `3ab5d679d0802a3ba6bb3faf25f3cbfda10d282064eb202485a8029ab4f7cb49` |
| `packages/db-cloud/drizzle/meta/0020_snapshot.json`                                                                           | `b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8` |
| `packages/db-cloud/drizzle/meta/0021_snapshot.json`                                                                           | `71052147af479bfb5f480f0981859a7af7235ff21a0be69a427a6faaeb06f4bf` |
| `packages/db-cloud/drizzle/meta/_journal.json`                                                                                | `897139ed88030e38adfffa55ba5f1bc4d4773b6bf8f1aac619f17653834907b0` |
| `packages/db-pos/drizzle/meta/0000_snapshot.json`                                                                             | `fab0469ccef07393ac933136b5a8b79e9150dfd28575a895639788253b1c78f0` |
| `packages/db-pos/drizzle/meta/0001_snapshot.json`                                                                             | `afa5d1997e4b73cf22646a32bff74943772820b656f3ce1c07f04d1290d13544` |
| `packages/db-pos/drizzle/meta/0002_snapshot.json`                                                                             | `e0e2d6d24a31f1241857378177de0bedb379e69102114e2bf80bd23b343ddbf7` |
| `packages/db-pos/drizzle/meta/0003_snapshot.json`                                                                             | `5b8e299967b1e31a972ac421d8dfa9fa5d2ef04dae9e4a32a3acfdd5f3fff30c` |
| `packages/db-pos/drizzle/meta/0004_snapshot.json`                                                                             | `85d09c2bd7c524153fed44d24324702e37885e05581f7e8e2fac64f1e76a453a` |
| `packages/db-pos/drizzle/meta/0005_snapshot.json`                                                                             | `5dce87aa6dae9a0872e17316618383736b9a8dc8b6a153130175ecd338bfd076` |
| `packages/db-pos/drizzle/meta/0006_snapshot.json`                                                                             | `88fa58f223992ea6d1c9a7aecf8776c912605a3ff187fcd6525e38d36a1ad4f8` |
| `packages/db-pos/drizzle/meta/0007_snapshot.json`                                                                             | `613b60ad45d1f799b67b2a208e8e4dcfcc4771023073a5ea05c2b29c9b18e756` |
| `packages/db-pos/drizzle/meta/0008_snapshot.json`                                                                             | `8c046cecf15d8658c5c56026e32e68b346a7c4a2ded4438e2dadd205a667b424` |
| `packages/db-pos/drizzle/meta/0009_snapshot.json`                                                                             | `57d5e61a2f2ce648505b4a193afb081d47d0f7cdd50e35cfeb38d0c78cece142` |
| `packages/db-pos/drizzle/meta/0010_snapshot.json`                                                                             | `87309581f3f640ef2564156b0b426ec6af4e57311e0a7a79807e45435a03fcf9` |
| `packages/db-pos/drizzle/meta/0011_snapshot.json`                                                                             | `04d0f97e814cc160d0a2bf18581c49c5e0ee9db6d80287e7d992235f6e9fe1c6` |
| `packages/db-pos/drizzle/meta/_journal.json`                                                                                  | `f718caff7909e3116626e1525b4b5af0bc6caf0df28f6ffaadb6cdf349fea1a9` |
| `pnpm-lock.yaml`                                                                                                              | `1ccc65b174137c8e4a15aa655f4c32e7e4fa736d55982ec7f41c3c85db733275` |
````

## BND-01 Supplement Review — Current assessment

Mode: SENSITIVE_DESIGN_SUPPLEMENT_ONLY.
Review status: AWAITING_HUMAN_REVIEW.
BND_01_RESULT: PARTIALLY_RESOLVED.
SENSITIVE_DESIGN_RESULT: BLOCKED_NEEDS_REVIEW.

Đây là current supplement assessment; toàn bộ previous packet và exact Design snapshot ở trên giữ nguyên historical bytes. Control Tower authorization chỉ cho discovery/classification/design supplement, không tự approve Gate2b. Using change: repository-format-policy-and-baseline-remediation. Không đổi change hoặc tạo Tasks.

### Integrity and scope

| Artifact                            | PRE SHA-256                                                      | Current binding                                                        |
| ----------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Design                              | 0dd163e8ae2d513f6865570594aa4c89eef01fa9a1ea7ea4e02c36a6f4199031 | 106b431a19eec026f5c5a6ccadef018c5e19f8580f2c08f2cace9bab822d289d       |
| Sensitive packet                    | 11aa94bd148f5126edfaab5c74c3be924a29a69d32d4877bfb2c00e393153fb6 | Final raw SHA reported externally after final validation; no self-hash |
| Proposal/Analysis/Specs/Gate1/Gate2 | Exact five approved bindings above                               | Unchanged; no rebaseline                                               |

Exact45 reconstruction dùng tracked-only Git inventory và independent parser detection, so sánh path/raw SHA với Appendix B. 45 unique, tracked YES, hashes identical. Migration67 riêng và unchanged. Không nhập45 vào67. No ignored/protected source edited.

Design update là **append-only**; current Design = preserved original bytes + exact append snapshot bên dưới. Current packet cũng append-only. Không rewrite historical BLOCKED finding hoặc earlier command result. Chỉ two authorized paths được phép đổi; other tracked/untracked pre-existing files phải raw-identical.

### Findings and policy dispositions

- Live migration metadata: 35 snapshots +3 journals, GENERATED_EXTERNAL_OR_DERIVED, OUT from mutable formatting; final admission/alternate acceptance còn POLICY_DECISION_REQUIRED.
- Historical journal copies: 3 HISTORICAL_HASH_BOUND, OUT, exact preservation/reference validator.
- Fixture manifests: 2 GENERATED_EXTERNAL_OR_DERIVED, OUT; generator/rendering-stack/inventory reproduction + corpus schema/PDF tests, chưa chạy regeneration.
- Service worker: 1 MUTABLE_FORMATTED, IN. Source and registration evidence, no generator found. Legacy ignore không đủ policy; future formatter mutation cần exact owner review vì worker byte change ảnh hưởng update detection.
- Lockfile: 1 GENERATED_EXTERNAL_OR_DERIVED, OUT; pnpm11.8.0 ownership, native serialization binding và frozen consistency. Frozen install alone không prove reproducibility.

MIGRATION_METADATA_POLICY: NEEDS_DECISION (live38), HISTORICAL_PRESERVED (historical3).
FIXTURE_MANIFEST_POLICY: GENERATED_VALIDATED.
SERVICE_WORKER_POLICY: MUTABLE_FORMATTED.
LOCKFILE_POLICY: PACKAGE_MANAGER_OWNED_GENERATED_VALIDATED.

S6 appended Design chứa exact45 paths, hashes, parsers, tracked status, matched ignore rule/source, provenance, class, owner/admission evidence, mutable scope, validator và risk. S7 partition exact IDs:
NO_MIGRATION0; CLASSIFICATION_REGISTRATION_ONLY0; MUTABLE_FORMAT_MIGRATION1; GENERATED_BINDING_MIGRATION3; HISTORICAL_PRESERVATION_REGISTRATION3; NORMATIVE_OWNER_REVIEW0; POLICY_DECISION_REQUIRED38. Sum45, no overlap.

### Why BND-01 is not forced resolved

Source inspection tìm thấy Drizzle randomUUID snapshot IDs và timestamp append cho journal. Migrator hashes SQL, không raw journal. Existing architecture validator chỉ SQL baseline/topology, không full metadata reproduction. Do đó không gọi structure/preservation checks là R4 PASS, không dùng generated directory ignore như admission. Thirty-eight entries còn cần DB/workflow authority chọn reviewed replay/preservation+journal model. Không sửa Specs; nếu decision cần weaken/change R4 thì phải STOP SPECS_CHANGE_REQUIRED và xin review riêng.

Fixture/lock generated bindings vẫn cần actual future proof; seven non-metadata entries có bounded design direction, không claim implementation/validator PASS. Full global coverage acceptance chưa đạt.

### Coverage and safety reassessment

Invariant: independent tracked supported universe = disjoint mutable-checked set union mandatory-alternate-checked set. Every path exactly one class và đủ current actual validator results. Ignore matches không được trừ universe.

| Concern                     | Current assessment                                                                                              |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Fail-closed                 | Preserved; unresolved live38 cannot PASS                                                                        |
| Classification completeness | Exact45 typed and owner-routed; final admission of38 remains blocked                                            |
| Bypass resistance           | Ignore entry alone never admits class; missing/duplicate/skipped checks FAIL                                    |
| Ignore rule safety          | Exact expansion cross-check; sw.js mutable match makes current routing invalid for new contract; no ignore edit |
| Alternate enforcement       | Missing native/generated replay proof remains failure, not waiver                                               |
| Path safety                 | D2 unchanged; exact tracked paths, no arbitrary traversal                                                       |
| Stale classification        | Version/owner/identity changes require review, not auto-rebaseline                                              |
| Recovery                    | D12 unchanged; no baseline mutation occurred                                                                    |
| Audit                       | Per-file parser/rule/provenance/class/owner/validator/migration reason added; no secrets                        |

### Actual commands and validation

- Exact approved7 PRE hash check: MATCH.
- `git blame -- .prettierignore`; `git show c6f2488 -- .prettierignore`; `git show ad6a9f4 -- .prettierignore`: inspected introduction evidence.
- `git check-ignore --no-index -v --stdin -z`: exact45, exit1, zero matches and empty stderr (normal no-match result).
- Independent Prettier `getFileInfo` with/without current ignore: exact45/parser inventory, not formatting acceptance.
- `openspec status --change repository-format-policy-and-baseline-remediation --json`: exit0; raw Tasks-ready does not authorize Tasks.
- `openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive`: exit0, valid.
- `pnpm docs:check`: exit0, PASS, 36 current documents.
- `pnpm architecture:check`: exit0, PASS.
- Scoped Prettier on Design/packet: exit0 PASS; scoped git diff --check: exit0 PASS. Explicit untracked/content check: no trailing whitespace, exact appended Design snapshot MATCH, both original prefixes preserved byte-for-byte.
- Final Git path/raw-hash comparison: exactly two modified paths (Design/packet), zero added/removed paths; all other pre-existing files unchanged. Approved5, baseline67 and ignored45 hashes unchanged. Receipt hash remains 1ff4b04f62e8c76ad6242ca0640f564618e4f3c89d18f767f6bf9cc6193ba1c7.

Supplement prose was formatted in memory only using Prettier API and applied with scoped patch. **No Prettier --write command**, no original-prefix formatting. One oversized in-memory command hit Windows command-length limit before execution; retried using bounded text sections, no file side effect. Initial shell glob searches returned path diagnostics and were replaced by supported rg file filters/exact resolved module paths; no source repair.

Not run: generator, db generate/migrate/drop, fixture regeneration/tests/provider calls, dependency install, runtime tests/builds, full format:check, parent6.1. Tests described above were inspected, not executed. Strict/docs/architecture PASS is not reproducibility/implementation PASS.

### Stop

Tasks/TIC NOT_CREATED. Apply NOT_RUN.
Parent19/23; 6.1 FAIL/UNCHECKED; 6.2–6.4 BLOCKED; receipt VERIFIED.
Production NOT_AUTHORIZED.
STOP awaiting Control Tower decision on live38 metadata acceptance model; no Gate2b self-approval.

### Exact append to Design

This append follows original Design raw bytes exactly; together they reconstruct current Design SHA above.

<!-- prettier-ignore -->
````markdown

## BND-01 Supplement — Current discovery and design revision

Supplement date: 2026-09-13. Mode: SENSITIVE_DESIGN_SUPPLEMENT_ONLY.
BND_01_RESULT: PARTIALLY_RESOLVED.
SENSITIVE_DESIGN_RESULT: BLOCKED_NEEDS_REVIEW.

Phần này bổ sung và cập nhật assessment BND-01, không rewrite D1–D12, Appendix A/B hoặc historical evidence ở trên. Previous Design SHA-256: `0dd163e8ae2d513f6865570594aa4c89eef01fa9a1ea7ea4e02c36a6f4199031`. Previous Gate2b packet SHA-256: `11aa94bd148f5126edfaab5c74c3be924a29a69d32d4877bfb2c00e393153fb6`. Control Tower xác nhận BND-01 và cho phép exact45 discovery/classification/design, không cấp admission/implementation/byte-mutation approval.

### S1 — Exact reconstruction and ignore provenance

Current Git **tracked-only** inventory (`git ls-files -z`) được kiểm tra bằng installed Prettier file-info, `resolveConfig:false`, không ignore để lấy parser, rồi current `.prettierignore` để lấy ignored status. Exact path/raw-SHA pairs khớp Appendix B: 45 unique / 45 tracked YES / zero added, removed hoặc byte drift. Parser labels thực tế: json, babel, yaml. Không dùng previous tracked+untracked discovery để giả định tracked status.

`git check-ignore --no-index -v --stdin -z` trên exact45 trả exit1, empty stdout/stderr: không file nào match Git ignore source trong current environment. Exit1 ở command này nghĩa là no match, không phải validation failure. Vì vậy không có .gitignore-derived hoặc tool-default exclusion giải thích tập45; mỗi file có positive .prettierignore rule match dưới đây. Không suy `EXPLICIT_POLICY` chỉ từ ignore line.

| Rule ID | Exact .prettierignore rule                                                    | Line | Git provenance                                       | Interpretation                                                               |
| ------- | ----------------------------------------------------------------------------- | ---- | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| I1      | `**/drizzle/meta/**`                                                          | 3    | c6f24880808950f899dafb8b069c063154642dc1, 2026-08-05 | Generated-directory convention; overmatches three historical copied journals |
| I2      | `apps/backoffice/test/fixtures/personnel-contract-evaluation/*/manifest.json` | 5    | ad6a9f42add2477133d2786efc2f719a66df6da0, 2026-08-19 | Generator-owned manifest evidence independently established by E-FIX         |
| I3      | `apps/yuta-pos/public/sw.js`                                                  | 4    | c6f24880808950f899dafb8b069c063154642dc1, 2026-08-05 | No generator/exclusion-policy rationale found; legacy source exclusion       |
| I4      | `pnpm-lock.yaml`                                                              | 6    | c6f24880808950f899dafb8b069c063154642dc1, 2026-08-05 | Package-manager-owned representation, not formatter authority                |

C6f2488 commit message nói formatting/manifest changes nhưng không định nghĩa explicit alternate validation policy. Ad6a9f4 thêm fixture exclusion cùng corpus work nhưng không tạo class admission contract. Hai rules .next/next-env không match exact45. No TOOL_DEFAULT classification trong tập này.

### S2 — Authority evidence dictionary

Mỗi row S6 bind owner/admission candidate tới exact evidence key dưới đây; keys không tự biến proposal thành approved admission. Paths, generator/consumer code và current scoped authority được đọc; command definitions không đồng nghĩa commands đã chạy.

- **E-DB-CLOUD:** `packages/db-cloud/AGENTS.md`, `packages/db-cloud/package.json` (`db:generate = drizzle-kit generate`, `db:migrate = drizzle-kit migrate`), `packages/db-cloud/drizzle.config.ts` (schema `src/schema/index.ts`, output `drizzle`, PostgreSQL), `docs/architecture/DATABASE_BOUNDARIES.md`. Cloud owner riêng, không POS/Display fallback.
- **E-DB-POS:** `packages/db-pos/AGENTS.md`, package scripts và `packages/db-pos/drizzle.config.ts`; Site Agent là runtime owner. Không sửa deployed migration, generated SQL cần review.
- **E-DB-DISPLAY:** `apps/yuta-display/AGENTS.md`, package scripts và `apps/yuta-display/drizzle.config.ts`, schema `src/db/schema/index.ts`; standalone persistence, không db-cloud/db-pos.
- **E-FIX:** `apps/backoffice/test/fixtures/personnel-contract-evaluation/README.md` gọi v1 manifest là machine-readable answer authority; fixed fictional sixty-PDF corpus, same supported rendering stack phải giữ manifest hashes. `apps/backoffice/scripts/generate-personnel-contract-evaluation-corpus.py` tạo cả v1/v2 và writes `json.dumps(..., indent=2, ensure_ascii=True) + newline`; v2 giữ 58 PDFs từ v1 và thay hai approved fixtures. `requirements-contract-evaluation.txt` dùng ranges Pillow>=10,<13 và reportlab>=4,<5; font chọn Arial/DejaVu theo host. Hai tests `personnel-contract-evaluation-corpus.test.ts` và `personnel-contract-evaluation-corpus-v2.test.ts` parse strict manifest schema, kiểm PDF hashes/page counts/distribution và expected-answer invariants. Tests không tự hash raw manifest serialization. Đây là generated test authority, không ordinary editable JSON.
- **E-SW:** `apps/yuta-pos/public/sw.js` có handwritten install/activate/fetch handlers; introducing Git commit `33645eb38d06af1746766a1961bf36d2ae9285c0`. `apps/yuta-pos/src/components/pos/PwaInstallPrompt.tsx` registers /sw.js in production; `next.config.ts` chỉ thiết lập headers; package scripts chỉ Next build/dev/start, không worker generator. `docs/products/pos/README.md` và `OFFLINE_STRATEGY.md` mô tả bounded static-asset cache. No vendored/generator evidence found. Không dedicated worker regression assertion được tìm thấy trong scoped test search; general offline suite không được quảng bá thành exact worker verification.
- **E-LOCK:** root `package.json` pins `packageManager: pnpm@11.8.0`; `pnpm-lock.yaml` lockfileVersion9, importers/resolutions; `.github/workflows/ci.yml` chạy `pnpm install --frozen-lockfile` trước format checks. Package manager owns resolved dependency graph/serialization. Range manifests không đủ để tái-resolve identical graph từ registry ngày khác.
- **E-HIST-CX:** `docs/reviews/restaurant-knowledge-customer-experience/03-final-review.md` xác định pre-Apply copies là evidence, không implementation; saved journal dùng reconstruct original migration diff.
- **E-HIST-TEAM:** `docs/reviews/restaurant-knowledge-team-culture/03-final-review.md`, “Technical evidence and scoped diffs”: migration diff từ saved preimages, forward/reverse checks và saved-baseline hashes.
- **E-HIST-VALID:** `docs/reviews/restaurant-knowledge-validated-knowledge/03-final-review.md`, deterministic migration diff evidence, forward/reverse baseline bytes. Copy thuộc evidence owner, không live db-cloud generator output.

E-SW identity dùng exact Git commit `33645eb38d06af1746766a1961bf36d2ae9285c0`; không có thay đổi source trong supplement này.

### S3 — Special types and policy findings

| Category                  | Count | Semantic formatting / binding finding                                                                                                                                               | Policy                                                                                          |
| ------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Live Drizzle snapshots    | 35    | JSON whitespace alone thường không đổi parsed shape, nhưng tool-owned IDs/prevId/schema history và approved byte identities không thể giao Prettier; không proof exact regeneration | MIGRATION_METADATA_POLICY: NEEDS_DECISION                                                       |
| Live Drizzle journals     | 3     | Current append-on-generation engine metadata, không ordinary docs; rewrite history không an toàn. Upstream có drop path nên “tool intrinsically append-only” không đúng             | MIGRATION_METADATA_POLICY: NEEDS_DECISION                                                       |
| Historical journal copies | 3     | Preserved pre-Apply evidence; wrong to regenerate from current DB schema or require current latest journal equality                                                                 | MIGRATION_METADATA_POLICY: HISTORICAL_PRESERVED                                                 |
| Fixture manifests         | 2     | Generator-owned answer authority; parsed JSON equivalence không đủ giữ renderer/generation contract                                                                                 | FIXTURE_MANIFEST_POLICY: GENERATED_VALIDATED, OUT; binding/reproduction evidence still required |
| Service worker            | 1     | Maintained runtime source, no generator found; formatter-only AST-preserving diff có thể phù hợp nhưng raw-byte update triggers worker update detection                             | SERVICE_WORKER_POLICY: MUTABLE_FORMATTED, IN; separate owner-reviewed migration only            |
| Lockfile                  | 1     | pnpm-owned resolved graph; Prettier không own representation                                                                                                                        | LOCKFILE_POLICY: PACKAGE_MANAGER_OWNED_GENERATED_VALIDATED, OUT                                 |

Live38 chính xác: cloud22 snapshots + journal1; POS12 snapshots + journal1; Display1 snapshot + journal1. Journal current lengths lần lượt22,12,1. Historical copies chứa13,14,16 entries, đúng historical role chứ không thiếu latest migrations.

Installed Drizzle inspection: resolved `drizzle-kit@0.31.10` API gọi randomUUID cho snapshot ID; bin writes snapshot JSON và journal JSON rồi appends `when: new Date()`. Resolved `drizzle-orm@0.43.1` migrator parses journal, resolves tagged SQL, hashes SQL bytes; không hash raw journal JSON hoặc use snapshot JSON để execute SQL. Do đó raw JSON formatting không đồng nghĩa SQL hash change, nhưng cũng không authorize metadata rewrite. Current `architecture:check` kiểm SQL baseline/topology, **không** full metadata chain hoặc full generation reproducibility.

**BND-META remains:** chưa có approved replay contract/historical inputs/tool identities đủ để tái tạo exact35 snapshots +3 journals; arbitrary regeneration sẽ có IDs/timestamps mới. Structural checks/preservation không được relabel R4 reproducibility. Cần DB/workflow owners quyết định evidence-backed historical admission đối với exact past snapshots và owner-controlled journal transition, hoặc approved exact generation replay approach. Không tự đổi class thành historical chỉ để tránh R4; không request hay thực hiện Specs edit trong lượt này.

### S4 — Mandatory alternate validators, designed not executed

- **V-SNAPSHOT-CANDIDATE (live35, blocking):** exact tool/source version, version/dialect/schema validation, unique IDs/prevId chain, snapshot/tag inventory, owner-reviewed raw identities; missing/extra/stale/drift fail. Exact reproduction obligation R4 vẫn required và currently unresolved; candidate structural PASS không thể produce aggregate PASS. Không import database env, run generate/migrate hoặc normalize UUIDs trong validation.
- **V-JOURNAL-CANDIDATE (live3, blocking):** strict JSON shape, ordered unique idx/tag/time/version/breakpoints, SQL presence và SQL digest cross-reference, snapshot pairing, previous reviewed prefix preservation và explicit approved append. Missing prefix approval/stale owner/new unapproved entry fail. Đây là engine/preservation check, không thay exact generated reproduction; same BND-META blocker.
- **V-HIST (3):** D5 exact raw path/hash + owning review/reference identity và role, source-copy relation bound tới pre-Apply state. No latest-schema reproduction, no current-journal compare. Missing/drift/reference stale fail; correction new record only.
- **V-FIX (2):** bind generator source + Python/Pillow/reportlab/font exact identities + v1/v2 options + reviewed baseline PDFs; sandbox output ngoài repo, không chạy existing mutating main trực tiếp trên actual tree. Compare exact raw manifest bytes/inventory and all PDF hashes, then existing schema/corpus assertions. V2 binds exact v1 inputs. Renderer unavailable/source drift/mismatch fails. Existing tests verify answer/PDF integrity, không alone prove raw manifest reproducibility. No provider calls, no real Personnel data, no install/download/generation in this turn.
- **V-LOCK (1):** bind pnpm11.8.0 implementation, lockfile version, workspace/package manifests và approved resolved graph; native lockfile parser/writer round-trip of that graph với exact raw output, plus frozen-lock consistency trên safe isolated input. No fresh registry resolution/auto-update/scripts/real-worktree install. Frozen install alone không claim raw reproduction; missing native serializer binding fails. Existing CI frozen install evidence là partial validator, chưa mandatory class integration. Không create new lock graph hay claim full dependency provenance.
- **Service worker IN:** mandatory direct Prettier check (ignores không được hide file), owner exact preimage/diff review và JS behavioral equivalence/routing checks trước separately approved mutation; không alternate needed để exclude source.

Mọi mandatory adapter missing/skipped/unproven → overall FAIL theo R3/R4/R10. “Designed validator” không đồng nghĩa code/test hiện hữu hoặc current PASS.

### S5 — Coverage and ignore-role supplement

PREEXISTING_IGNORE_RULE != POLICY_ADMISSION.

Universe: mọi tracked Prettier-parser-supported file, discovered independently of ignore, union expected/preserved/baseline paths như D2. New ignored tracked file không biến mất. Với mỗi path p:

- Exactly one accepted class và owner/admission binding.
- Nếu mutable: exactly one actual Prettier result, cùng applicable owner/normative checks.
- Nếu non-mutable: đủ actual mandatory alternate results; mỗi result current, bound tới same bytes/policy/tool identity.
- Zero class, duplicate class, missing/skipped validator hoặc stale inventory → FAIL.

Define M và A disjoint với M union A = supported tracked universe; expected missing paths vẫn FAIL. Ignore-coverage set I không được trừ khỏi universe. Raw ignore routing chỉ hợp lệ khi I subset A và mọi I entry có mandatory alternate completion; current sw.js thuộc M, nên current raw ignore mapping không được accepted under new policy.

D3 direct API check không cần .prettierignore routing. Nếu giữ nó như compatibility mechanism, classifier vẫn independently enumerates matches; unknown/mutable match → IGNORE_POLICY_MISMATCH; broad pattern với membership khác reviewed exact expansion → IGNORE_SCOPE_DRIFT; config/rule identity stale → FAIL. Không activate cho tới owner-approved alignment; không thay ignore trong lượt này. `**/drizzle/meta/**` không admission cho future files hoặc historical copies.

A = intentional non-mutable (fixtures, lock, historical candidates; live metadata pending); B = legacy ignored mutable source (sw.js); C = unknown/stale/unadmitted ignored path → FAIL. Current45 đủ type/owner routing nhưng live38 chưa đủ final validator authority, vẫn fail-closed.

### S6 — Exact45 per-file inventory and classification

Bxx là join key giữa hai bảng; mỗi row kế thừa exact ignore source `.prettierignore`, Git tracked YES, no .gitignore/tool-default match. Evidence IDs S2 và validator IDs S4 là resolved definitions, không wildcard summaries. Admission là candidate for Control Tower review, không self-approved.

| ID  | PATH                                                                                                                          | CURRENT_SHA256                                                     | PARSER | IGNORE_RULE_MATCHED | TRACKED |
| --- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------ | ------------------- | ------- |
| B01 | `apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json`                                                | `8e43f64cb32fae3776636e8d74661fecb88d2f137847fe7e67c368a6624274b2` | json   | I2                  | YES     |
| B02 | `apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/manifest.json`                                                | `e76e0cfe39cafedcf25564e6dae079fadfc709fd8179da5000f7b7a4ff2879f0` | json   | I2                  | YES     |
| B03 | `apps/yuta-display/drizzle/meta/0000_snapshot.json`                                                                           | `615206f464a7a0ab96144af48d2fa7d494658bff9fb3695df63a9d118a65a2f7` | json   | I1                  | YES     |
| B04 | `apps/yuta-display/drizzle/meta/_journal.json`                                                                                | `2c0e6208cf91a524f96bdd40de959ca9756e47de0f28367db28464d96d84fc9a` | json   | I1                  | YES     |
| B05 | `apps/yuta-pos/public/sw.js`                                                                                                  | `f15be18c9207417c6d76fd363ffdef4f9898efb8cdbca99951707bdb661861be` | babel  | I3                  | YES     |
| B06 | `docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/drizzle/meta/_journal.json`       | `f4f314b6c4e551641ac505015832219ec3660966fda67f8e79429702b03da2fc` | json   | I1                  | YES     |
| B07 | `docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json`        | `be4d18a6478c5c637c45df08d2b4188380340a5ae19e6264fb61523ec4d71052` | json   | I1                  | YES     |
| B08 | `docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json` | `eda4a2bf75d48b6cb69a39ec13b84412a96ce239f6b0717ea39cc0cc1118a3f4` | json   | I1                  | YES     |
| B09 | `packages/db-cloud/drizzle/meta/0000_snapshot.json`                                                                           | `75086e8b7a0eb17174f765aec9537e71bcb0e774ef05ed7e73ae8a4a7e12e49e` | json   | I1                  | YES     |
| B10 | `packages/db-cloud/drizzle/meta/0001_snapshot.json`                                                                           | `f2fa84d91362dbec21f7f8f85ee3c03b1f6d751739da93c3374af6ceade68076` | json   | I1                  | YES     |
| B11 | `packages/db-cloud/drizzle/meta/0002_snapshot.json`                                                                           | `5b047f116e96d7dfb64c9072c6d26157c96791d0ef058e2ec59061b216d75f34` | json   | I1                  | YES     |
| B12 | `packages/db-cloud/drizzle/meta/0003_snapshot.json`                                                                           | `9468f2723702308be1b23b0c80160c069b3a46975f9a1fd031b26f36e7153701` | json   | I1                  | YES     |
| B13 | `packages/db-cloud/drizzle/meta/0004_snapshot.json`                                                                           | `57fd3427fc9aec97dafd77d8b643efd611c8c12a65bf64f8cd39a30e8cdb99ad` | json   | I1                  | YES     |
| B14 | `packages/db-cloud/drizzle/meta/0005_snapshot.json`                                                                           | `7109ff799c71fde11b6f525e828b11d57b2731598779948f4c2bebf5bc2ecb8c` | json   | I1                  | YES     |
| B15 | `packages/db-cloud/drizzle/meta/0006_snapshot.json`                                                                           | `f729248590dcc711e05a46e3ad756b4b789affd485131799bc069d15537fb936` | json   | I1                  | YES     |
| B16 | `packages/db-cloud/drizzle/meta/0007_snapshot.json`                                                                           | `9be05c6ec7d1c2c68f6731289fff95efa1ef5e7a6309745ac10593cdef2e245e` | json   | I1                  | YES     |
| B17 | `packages/db-cloud/drizzle/meta/0008_snapshot.json`                                                                           | `2e742120524620e7389731b83da36719bec8e107b4d1841c8e8afeb1d26c95a0` | json   | I1                  | YES     |
| B18 | `packages/db-cloud/drizzle/meta/0009_snapshot.json`                                                                           | `fb6099d284bff9976010c5ca50a58f71a7d9188978206baee0f4cacdc33eb082` | json   | I1                  | YES     |
| B19 | `packages/db-cloud/drizzle/meta/0010_snapshot.json`                                                                           | `3d18a0e5349007bf5cdd741c0f742db112075da5a743e014b7539482842cdd2f` | json   | I1                  | YES     |
| B20 | `packages/db-cloud/drizzle/meta/0011_snapshot.json`                                                                           | `e997a937c036eef36efff3708c7f01691a77bca0d7982b987b18a759c71be5b4` | json   | I1                  | YES     |
| B21 | `packages/db-cloud/drizzle/meta/0012_snapshot.json`                                                                           | `78bfbd520781589d5509d1f28ebba3249e28adfb2932756eff33821328e19e7c` | json   | I1                  | YES     |
| B22 | `packages/db-cloud/drizzle/meta/0013_snapshot.json`                                                                           | `b50aaa51aa9bd97c5fa36e3ea5027982cca20b345fa2d74f555bc294778a23d8` | json   | I1                  | YES     |
| B23 | `packages/db-cloud/drizzle/meta/0014_snapshot.json`                                                                           | `2a353328c9b76c27350fa5374b8b4cdfb55e745b453930b40cda2321f4728d00` | json   | I1                  | YES     |
| B24 | `packages/db-cloud/drizzle/meta/0015_snapshot.json`                                                                           | `b4ad465af34ff105074fe72e26260863c10cff38725562ac0242127b8c2ade8f` | json   | I1                  | YES     |
| B25 | `packages/db-cloud/drizzle/meta/0016_snapshot.json`                                                                           | `28e3c65cb32594869a517fe8ac769580c1d46517942e91a25a9285c30f5a5537` | json   | I1                  | YES     |
| B26 | `packages/db-cloud/drizzle/meta/0017_snapshot.json`                                                                           | `617681b23ddea95f13cfc5d82fac6e3649499515d546d5ee10ff67a8324f9ea6` | json   | I1                  | YES     |
| B27 | `packages/db-cloud/drizzle/meta/0018_snapshot.json`                                                                           | `07ede7f42b4f1f744e700d5603b6dbfd69d867aefc86d498295251628035e0ee` | json   | I1                  | YES     |
| B28 | `packages/db-cloud/drizzle/meta/0019_snapshot.json`                                                                           | `3ab5d679d0802a3ba6bb3faf25f3cbfda10d282064eb202485a8029ab4f7cb49` | json   | I1                  | YES     |
| B29 | `packages/db-cloud/drizzle/meta/0020_snapshot.json`                                                                           | `b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8` | json   | I1                  | YES     |
| B30 | `packages/db-cloud/drizzle/meta/0021_snapshot.json`                                                                           | `71052147af479bfb5f480f0981859a7af7235ff21a0be69a427a6faaeb06f4bf` | json   | I1                  | YES     |
| B31 | `packages/db-cloud/drizzle/meta/_journal.json`                                                                                | `897139ed88030e38adfffa55ba5f1bc4d4773b6bf8f1aac619f17653834907b0` | json   | I1                  | YES     |
| B32 | `packages/db-pos/drizzle/meta/0000_snapshot.json`                                                                             | `fab0469ccef07393ac933136b5a8b79e9150dfd28575a895639788253b1c78f0` | json   | I1                  | YES     |
| B33 | `packages/db-pos/drizzle/meta/0001_snapshot.json`                                                                             | `afa5d1997e4b73cf22646a32bff74943772820b656f3ce1c07f04d1290d13544` | json   | I1                  | YES     |
| B34 | `packages/db-pos/drizzle/meta/0002_snapshot.json`                                                                             | `e0e2d6d24a31f1241857378177de0bedb379e69102114e2bf80bd23b343ddbf7` | json   | I1                  | YES     |
| B35 | `packages/db-pos/drizzle/meta/0003_snapshot.json`                                                                             | `5b8e299967b1e31a972ac421d8dfa9fa5d2ef04dae9e4a32a3acfdd5f3fff30c` | json   | I1                  | YES     |
| B36 | `packages/db-pos/drizzle/meta/0004_snapshot.json`                                                                             | `85d09c2bd7c524153fed44d24324702e37885e05581f7e8e2fac64f1e76a453a` | json   | I1                  | YES     |
| B37 | `packages/db-pos/drizzle/meta/0005_snapshot.json`                                                                             | `5dce87aa6dae9a0872e17316618383736b9a8dc8b6a153130175ecd338bfd076` | json   | I1                  | YES     |
| B38 | `packages/db-pos/drizzle/meta/0006_snapshot.json`                                                                             | `88fa58f223992ea6d1c9a7aecf8776c912605a3ff187fcd6525e38d36a1ad4f8` | json   | I1                  | YES     |
| B39 | `packages/db-pos/drizzle/meta/0007_snapshot.json`                                                                             | `613b60ad45d1f799b67b2a208e8e4dcfcc4771023073a5ea05c2b29c9b18e756` | json   | I1                  | YES     |
| B40 | `packages/db-pos/drizzle/meta/0008_snapshot.json`                                                                             | `8c046cecf15d8658c5c56026e32e68b346a7c4a2ded4438e2dadd205a667b424` | json   | I1                  | YES     |
| B41 | `packages/db-pos/drizzle/meta/0009_snapshot.json`                                                                             | `57d5e61a2f2ce648505b4a193afb081d47d0f7cdd50e35cfeb38d0c78cece142` | json   | I1                  | YES     |
| B42 | `packages/db-pos/drizzle/meta/0010_snapshot.json`                                                                             | `87309581f3f640ef2564156b0b426ec6af4e57311e0a7a79807e45435a03fcf9` | json   | I1                  | YES     |
| B43 | `packages/db-pos/drizzle/meta/0011_snapshot.json`                                                                             | `04d0f97e814cc160d0a2bf18581c49c5e0ee9db6d80287e7d992235f6e9fe1c6` | json   | I1                  | YES     |
| B44 | `packages/db-pos/drizzle/meta/_journal.json`                                                                                  | `f718caff7909e3116626e1525b4b5af0bc6caf0df28f6ffaadb6cdf349fea1a9` | json   | I1                  | YES     |
| B45 | `pnpm-lock.yaml`                                                                                                              | `1ccc65b174137c8e4a15aa655f4c32e7e4fa736d55982ec7f41c3c85db733275` | yaml   | I4                  | YES     |

| ID  | CLASS                         | OWNER                                                   | ADMISSION_EVIDENCE | IGNORE_PROVENANCE     | MUTABLE_FORMAT_SCOPE | ALTERNATE_VALIDATOR              | MIGRATION_RELATION                   | RISK                                                                         |
| --- | ----------------------------- | ------------------------------------------------------- | ------------------ | --------------------- | -------------------- | -------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| B01 | GENERATED_EXTERNAL_OR_DERIVED | Backoffice Personnel extraction/evaluation owner        | E-FIX              | GENERATED_CONVENTION  | OUT                  | V-FIX                            | GENERATED_BINDING_MIGRATION          | Rendering-stack/version drift; manifest is answer authority                  |
| B02 | GENERATED_EXTERNAL_OR_DERIVED | Backoffice Personnel extraction/evaluation owner        | E-FIX              | GENERATED_CONVENTION  | OUT                  | V-FIX                            | GENERATED_BINDING_MIGRATION          | Rendering-stack/version drift; manifest is answer authority                  |
| B03 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/display persistence owner                         | E-DB-DISPLAY       | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B04 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/display persistence owner                         | E-DB-DISPLAY       | GENERATED_CONVENTION  | OUT                  | V-JOURNAL-CANDIDATE              | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B05 | MUTABLE_FORMATTED             | YUTA POS PWA owner                                      | E-SW               | LEGACY_OR_UNEXPLAINED | IN                   | Prettier + owner semantic review | MUTABLE_FORMAT_MIGRATION             | Source-byte change triggers service-worker update; no generator found        |
| B06 | HISTORICAL_HASH_BOUND         | restaurant-knowledge-customer-experience evidence owner | E-HIST-CX          | OTHER                 | OUT                  | V-HIST                           | HISTORICAL_PRESERVATION_REGISTRATION | Broad generated-directory rule incidentally matches historical copy          |
| B07 | HISTORICAL_HASH_BOUND         | restaurant-knowledge-team-culture evidence owner        | E-HIST-TEAM        | OTHER                 | OUT                  | V-HIST                           | HISTORICAL_PRESERVATION_REGISTRATION | Broad generated-directory rule incidentally matches historical copy          |
| B08 | HISTORICAL_HASH_BOUND         | restaurant-knowledge-validated-knowledge evidence owner | E-HIST-VALID       | OTHER                 | OUT                  | V-HIST                           | HISTORICAL_PRESERVATION_REGISTRATION | Broad generated-directory rule incidentally matches historical copy          |
| B09 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B10 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B11 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B12 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B13 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B14 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B15 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B16 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B17 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B18 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B19 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B20 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B21 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B22 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B23 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B24 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B25 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B26 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B27 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B28 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B29 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B30 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B31 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-cloud owner                                    | E-DB-CLOUD         | GENERATED_CONVENTION  | OUT                  | V-JOURNAL-CANDIDATE              | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B32 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B33 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B34 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B35 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B36 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B37 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B38 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B39 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B40 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B41 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B42 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B43 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-SNAPSHOT-CANDIDATE             | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B44 | GENERATED_EXTERNAL_OR_DERIVED | @yuta/db-pos owner / Site Agent runtime                 | E-DB-POS           | GENERATED_CONVENTION  | OUT                  | V-JOURNAL-CANDIDATE              | POLICY_DECISION_REQUIRED             | BND-META: exact historical generation inputs/identity replay not established |
| B45 | GENERATED_EXTERNAL_OR_DERIVED | Repository dependency/tooling owner (pnpm)              | E-LOCK             | GENERATED_CONVENTION  | OUT                  | V-LOCK                           | GENERATED_BINDING_MIGRATION          | Frozen install is not full raw-byte reproduction                             |

OUT cho live38 có nghĩa tool-owned, không approved exemption: admission/validator policy vẫn NEEDS_DECISION, aggregate FAIL. Không promote current-ignore thành validation success.

### S7 — Exact migration partition, disjoint from migration67

| Relation                             | Count | Exact IDs                                                                                                                                                                                    |
| ------------------------------------ | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NO_MIGRATION                         | 0     | None; no integrated alternate validation has been proved for this45                                                                                                                          |
| CLASSIFICATION_REGISTRATION_ONLY     | 0     | None                                                                                                                                                                                         |
| MUTABLE_FORMAT_MIGRATION             | 1     | B05                                                                                                                                                                                          |
| GENERATED_BINDING_MIGRATION          | 3     | B01, B02, B45                                                                                                                                                                                |
| HISTORICAL_PRESERVATION_REGISTRATION | 3     | B06, B07, B08                                                                                                                                                                                |
| NORMATIVE_OWNER_REVIEW               | 0     | None                                                                                                                                                                                         |
| POLICY_DECISION_REQUIRED             | 38    | B03, B04, B09, B10, B11, B12, B13, B14, B15, B16, B17, B18, B19, B20, B21, B22, B23, B24, B25, B26, B27, B28, B29, B30, B31, B32, B33, B34, B35, B36, B37, B38, B39, B40, B41, B42, B43, B44 |
| Total                                | 45    | Every S6 row exactly once                                                                                                                                                                    |

Exact paths resolve by S6 IDs; none added to frozen67. No new migration authorization, even for sw.js. Future correction requires separately approved path/preimage/diff/owner review. No path classified ARCHIVED_PRESERVED just because directory name; historical copies remain H.

### S8 — Reassessment and remaining decision

BND_01_RESULT: PARTIALLY_RESOLVED.
SENSITIVE_DESIGN_RESULT: BLOCKED_NEEDS_REVIEW.

Resolved discovery: exact45 tracked set, parser/ignore rules, provenance, type/owner routing; seven files have bounded proposed treatment (two fixture, one lock, three historical, one mutable source). Live38 remain POLICY_DECISION_REQUIRED for mandatory generated replay versus evidence-backed preservation/journal authority. Không claim RESOLVED_IN_DESIGN.

Fail-closed, independent inventory, exact ignore membership, path safety, stale bindings, recovery and deterministic audit remain D2/D9/D10/D12. Audit bổ sung matched ignore rule/source/provenance, parser, proposed versus approved admission và migration relation. No silent ignores, no cache-based PASS, no source change.

Control Tower decision needed: bounded live-metadata acceptance model, preserving raw reviewed identities and safe owner-authorized future journal growth without calling structural validation exact reproduction. Nếu decision thật sự đòi sửa R4, STOP SPECS_CHANGE_REQUIRED; chưa sửa Specs hoặc tự kết luận exemption hợp lệ.

Tasks/TIC NOT_CREATED; Apply NOT_RUN; parent19/23, task6.1 FAIL/UNCHECKED, 6.2–6.4 BLOCKED; receipt VERIFIED; Production NOT_AUTHORIZED.
````

## Current Gate 2b — BND-01 after approved Specs amendment

Change: repository-format-policy-and-baseline-remediation
Gate: 2b — Sensitive Design review
Review status: AWAITING_HUMAN_REVIEW
Created: 2026-09-13
Schema: yuta-spec-driven
Analysis conclusion: historical artifact preserved; current Control Tower decisions resolve bounded authority questions
Sensitive change: YES

REPOSITORY_FORMAT_POLICY_GATE_2B_REVIEW_CHECKPOINT: AWAITING_CONTROL_TOWER_REVIEW.
BND_01_RESULT: RESOLVED_IN_DESIGN.
SENSITIVE_DESIGN_RESULT: PASS — design assessment only.
Gate 2b is NOT self-approved.

Original Gate 2: APPROVED_HISTORICALLY.
Amended Gate 2: APPROVED.
Approval source: explicit current-user “CONTROL TOWER — RESUME BND-01 DESIGN AFTER GATE-2 AMENDMENT”.
Amended Specs SHA-256: `11a24180f8620f688a9a718127ec040d09e7b7e279a3a7a92f6d588de89be394`.
Amended Gate-2 packet SHA-256: `a1ee9d991790b66116d768c2778dd32fedd89fe4ebfc09e3770cf0ccc885cf3e`.
Original Gate-2 approval did not approve amended bytes. No Gate-2 packet or Specs text is rewritten in this turn.

### Exact integrity bindings

Design PRE: `106b431a19eec026f5c5a6ccadef018c5e19f8580f2c08f2cace9bab822d289d`.
Design POST: `9c9886d9c4f671c7c9f7b312c28d9533feb7683e4d74d198e2b8befdc8696728`.
Sensitive packet PRE: `09d9e3474ec87a68c588273cae1edb01ec4d6863f6a86dcac83c989fce2d4468`.
Sensitive packet POST is returned after serialization, outside its own bytes.

Protected PRE bindings all match the current instruction:

- `docs/reviews/repository-format-policy-and-baseline-remediation/01-analysis-review.md`: `2dcbb5d283fd21e19bc859f42d9713d7ccfa23beead9752e117b8cce7d4559d0`.
- `docs/reviews/repository-format-policy-and-baseline-remediation/02-specs-review.md`: `a1ee9d991790b66116d768c2778dd32fedd89fe4ebfc09e3770cf0ccc885cf3e`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/analysis.md`: `7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/proposal.md`: `4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0`.
- `openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md`: `11a24180f8620f688a9a718127ec040d09e7b7e279a3a7a92f6d588de89be394`.

All original Design bytes remain an exact prefix. Its older BND-01 blocked statements are historical checkpoints, explicitly superseded only by the appended current resolution F1–F7. Original packet bytes also remain an exact prefix; no failed result or former approval is erased. This packet includes the exact new Design suffix below; together with the prior preserved Design snapshot and S1–S8 suffix, it reconstructs the full current Design, not merely a summary.

Hash method: Node crypto.createHash('sha256') over fs.readFileSync raw bytes; no normalization. Fresh PRE snapshot uses git ls-files --cached --others --exclude-standard -z, unique sorted paths and raw hashes; HEAD `415990386327aaccab3c32b1fef0569a0fde7f3a`, 2633 existing Git-listed files.

### Discovery and authority result

Fresh tracked-only Prettier file-info scan reconfirmed all45 exact paths/hashes from Design Appendix B/S6; live38 reconfirmed independently from metadata directories, all tracked. Live38 =35 snapshots +3 journals: cloud22+1, POS12+1, Display1+1. Exact38 hashes and all45 partition lists are in the embedded F5, each path listed once in the final partition.

Migration tool owner is MIGRATION_TOOLING_OWNED with separate cloud/POS/Display owning boundaries. Manifests/configs and installed drizzle-kit0.31.10 / drizzle-orm0.43.1 source were read. Source digests, function locations, native semantics, conditional write and exit0 traps are in F1/F2. Source inspection is not native execution.

Native capability: drizzle-kit check with explicit dialect/out, plus native readMigrationFiles consumer. Neither is blindly trusted as a complete metadata check. Native check may bootstrap missing meta; unsupported version can exit0. Proposed wrapper requires safe preflight, faithful isolated read-only input, full completion contract and unchanged source; no writable repo execution/config import. All native-required failures remain fail-closed. No native check, generation/update/migrate or database suite ran this turn.

Existing checks: architecture migration-baseline SQL check; Pointage migration ledger/hash/no-op/upgrade integration suite; Formalités Q1 scoped migrated-schema/ledger assertion; POS DB schema tests. These are not substitutes for full snapshot/journal validation. Display test surface not found. No existing test is relabelled PASS, and the scoped Formalités count21 is not applied to current cloud22.

### Contract, partition and safety assessment

Live metadata: GENERATED_EXTERNAL_OR_DERIVED / TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA; Prettier OUT, manual formatting forbidden; authorized migration tooling only. Mandatory live-metadata-v1 uses native → repository check → bounded gap order. F3 identifies exact gaps G1 inventory/existence, G2 ambiguous JSON/unsafe references, G3 journal shape/order, G4 links/identity graph, G5 native completion and G6 reviewed authority. It does not reproduce UUID/timestamps, implement SQL semantics or substitute structural PASS for mandatory native evidence.

Live journals follow TOOL_OWNED_APPEND_OR_TOOL_UPDATE. Historical3 follow HISTORICAL_HASH_BOUND exact-byte/reference preservation and new corrective record only. Wrong-class assignment fails in either direction.

State model: REVIEWED_CURRENT → AUTHORIZED_TOOL_MUTATION → TOOL_GENERATED_STATE_AWAITING_REVIEW → REVIEWED_CURRENT_NEW_IDENTITY. Legitimate output is not automatically tampering, but remains overall FAIL until explicit exact identity review and all checks PASS. Mixed/unexplained edits fail separately. No hash auto-refresh.

Final45: GENERATED_BINDING_MIGRATION41 (live38 + fixture2 + lock1), HISTORICAL_PRESERVATION_REGISTRATION3, MUTABLE_FORMAT_MIGRATION1. Sum45; POLICY_DECISION_REQUIRED0. This is a final Design treatment, not mutation authorization or existing adapter PASS. V-FIX/V-LOCK reproduction and V-HIST contracts remain mandatory.

Coverage: one primary class per supported tracked path, subclass required for generated; complete mutable or alternate obligations plus owner/normative constraints. Ignore routing cannot remove a path. Exact ignore expansion, source identity and version pair checked; new/unknown/duplicate/stale/class-mismatched paths, skipped/unavailable validator all fail.

F6 supplies attack/failure → detection/code → recovery/review for new ignored files, broadened rules, deleted classification, unauthorized reclassification/hash edits, fake review identity, skipped native checks, mixed/manual metadata, rename, live/historical confusion, partial relationships, stale identity and version mismatch. Recovery is no-auto-repair FAIL_CLOSED; approved forward/rollback work belongs to separate owner authorization.

Full Sensitive Design reassessment: 17/17 design dimensions PASS, enumerated F7. Remaining authority questions for BND-01: NONE. Generated8 evidence, exact renderer/native lock serialization, active-owner coordination, portable native isolation/tool supply, implementation negative tests, ignore alignment and coherent67 migration remain explicit execution prerequisites. Failure to meet them blocks implementation acceptance/activation; Design PASS does not waive them or claim current full-format PASS.

### Actual validation and preserved hold

Commands executed after the Design append:

- `openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive`: exit0, valid.
- `pnpm docs:check`: exit0, passed36 current documents.
- `pnpm architecture:check`: exit0, runtime imports, URLs, client boundaries and migration baselines valid.
- `pnpm exec prettier --check openspec/changes/repository-format-policy-and-baseline-remediation/design.md`: exit0, PASS.

A scoped source search included nonexistent apps/yuta-display/test and emitted a path diagnostic; the Display manifest has no test script. This is a discovery limitation, not test failure or proof of coverage. No files were created to satisfy it.

Final two-file scoped Prettier: exit0 PASS. Initial packet assembly matched a repeated fence anchor rather than EOF; scoped Prettier returned exit1 and the exact-prefix check detected it. The packet was corrected using apply_patch to preserve the original complete bytes as prefix and append the current section at EOF. No Prettier --write was run; the initial failure is not relabelled PASS.

Scoped git diff --check: exit0; because both files are untracked, direct raw PRE/POST and trailing-whitespace checks supplement Git output. Final exact suffix equality and original Design/packet prefix checks are required; zero trailing-whitespace findings. Fresh repository comparison: exactly Design and this packet changed, zero added/removed paths, HEAD unchanged; all other 2,631 existing Git-listed files unchanged. Baseline67 and ignored45 match reviewed hashes. Proposal, Analysis, Gate1, amended Specs and amended Gate2 remain unchanged. Historical content is not reformatted.

No global formatting remediation, recursive typecheck, runtime tests/builds, metadata generation, native CLI execution, parent6.1 rerun or production action. Only the specifically requested documentary checks run; implementation VERIFY/QA not claimed.

Tasks/TIC/Implementation Plan: NOT_CREATED. Apply: NOT_RUN.
Parent ui-ux-pro-max-integration:19/23; task6.1 FAIL/UNCHECKED;6.2–6.4 BLOCKED; receipt VERIFIED.
Production: NOT_AUTHORIZED.
Next authority: Control Tower review of exact Design POST and this packet POST; no Tasks automatically.
STOP.

### Exact Design resolution suffix

<!-- prettier-ignore -->
````markdown

## BND-01 Resolution — Approved amended Gate 2

Ngày: 2026-09-13. Mode: SENSITIVE_DESIGN_RESOLUTION_ONLY.
BND_01_RESULT: RESOLVED_IN_DESIGN.
SENSITIVE_DESIGN_RESULT: PASS — assessment của Design, không implementation PASS hoặc approval Gate 2b.

Phần này là current resolution, supersedes riêng các nhận định BND-META/NEEDS_DECISION và pending live38 trong Context, Blocking Review Questions, S3/S4/S7/S8; các phần đó được giữ nguyên làm lịch sử. D1–D12 tiếp tục áp dụng với refinements tường minh dưới đây. Không rewrite historical preimages hoặc kết quả trước đây.

Original Gate 2: APPROVED_HISTORICALLY. Amended Gate 2: APPROVED theo explicit current-user Control Tower instruction; amended Specs SHA `11a24180f8620f688a9a718127ec040d09e7b7e279a3a7a92f6d588de89be394`, amended Gate-2 packet SHA `a1ee9d991790b66116d768c2778dd32fedd89fe4ebfc09e3770cf0ccc885cf3e`. Current requirements: 13 / 77 scenarios, gồm R4L. Không nói original approval bao phủ amended bytes.

### F1 — Exact set and migration authority

Current tracked-only Prettier file-info scan độc lập ignore, sau đó đối chiếu ignored status, khớp đúng45 unique paths/raw hashes trong S6/Appendix B. Metadata subset đúng38: cloud22 snapshots +1 journal, POS12 snapshots +1 journal, Display1 snapshot +1 journal; tổng35 snapshots và3 journals. Đọc current directories xác nhận snapshot/journal version7, journal lengths22/12/1. Đây là inventory/shape observations, không chứng minh native validator PASS.

MIGRATION_TOOL_OWNER: MIGRATION_TOOLING_OWNED với owner boundaries riêng: packages/db-cloud; packages/db-pos (Site Agent runtime); apps/yuta-display standalone. Root/scoped AGENTS và docs/architecture/DATABASE_BOUNDARIES.md tiếp tục cấm cross-boundary persistence và edit deployed migration.

MIGRATION_TOOL_PACKAGE_OR_SOURCE: current manifests khai drizzle-kit ^0.31.1, resolved local drizzle-kit0.31.10; drizzle-orm0.43.1 consumer. Drizzle configs chọn postgresql, output ./drizzle, cloud/POS schema ./src/schema/index.ts, Display ./src/db/schema/index.ts. Không load config trong validation vì config đọc .env và database credentials.

Inspected installed sources (local evidence, không thay pinned dependency closure review):

- drizzle-kit bin.cjs SHA `44f5420e63c88e13e750f5233878b054e262c3223bd94eabf6ac05b2ae77abd7`: prepareOutFolder/validateWithReport (8127/8155), prepareCheckParams (15277), checkHandler (91716), check command (92286), generation writer và drop path.
- drizzle-orm migrator.cjs SHA `04b480fbd0db6b82e2b0511e017a7c56ea4fb8a9cd372972e8f69d76c29edf00`: exported readMigrationFiles parses journal, reads tagged SQL, returns SQL-derived hashes, breakpoints và journal.when. Không database connection hoặc metadata write trong function này.

LIVE_SNAPSHOT_SEMANTICS: native PostgreSQL snapshot schema/version7, IDs/prevId và schema shape thuộc Drizzle; IDs sinh nondeterministic. Không suy ra current DB state từ JSON snapshot. LIVE_JOURNAL_SEMANTICS: tool-written entries idx/version/when/tag/breakpoints; generation append, tool drop/update có thể đổi set. Native consumer thực thi theo journal ordering và SQL references, không hash raw journal whitespace hoặc dùng snapshots để execute SQL. TOOL_OWNED_APPEND_OR_TOOL_UPDATE thay cho S4 candidate prefix-only assumption; deployed SQL protection vẫn độc lập và không bị giảm.

### F2 — Native capabilities, limits and read-only execution design

Native command surface đã tồn tại: `drizzle-kit check --dialect postgresql --out drizzle` với cwd đúng owning package. Đây là command candidate, NOT_RUN trong lượt này; không thêm package script. Explicit dialect/out tránh config import theo prepareCheckParams. Không dùng npx/dlx, không install hoặc upgrade.

Source cho thấy check kiểm native snapshot schema/latest version và duplicate prevId collision. Nó không kiểm toàn bộ journal semantics, snapshot identity reachability hoặc approval identity. prepareOutFolder có thể mkdir/write journal nếu meta directory thiếu. validateWithReport còn có unsupported-version branch exit0 trước completion. Do đó native exit0 đơn lẻ KHÔNG là PASS.

Adapter proposed `live-metadata-v1` chạy native check trên faithful isolated read-only mirror của exact approved metadata + referenced SQL, không trên writable repository hoặc database. Preflight source path safety, meta/journal/file existence, exact inventory và byte snapshot xảy ra TRƯỚC tạo mirror/chạy child. Missing input FAIL, không để tool bootstrap replacement. Child process dùng reviewed local executable/dependency closure, explicit cwd/dialect/out, sanitized environment không DB credentials, không repo config; source tree không có write capability. Implementation phải chứng minh filesystem isolation và no-write guard trên supported local/CI hosts; nếu chưa đảm bảo, NATIVE_VALIDATION_UNAVAILABLE và không chạy child. Mirror bytes/identities phải khớp source PRE, và source POST còn khớp; concurrent drift làm FAIL.

Native success yêu cầu exit0, complete non-truncated captured stdout/stderr, expected terminal success marker từ pinned check handler, không unsupported/nonlatest/malformed/collision diagnostic và output contract đúng pinned adapter. Unknown diagnostic/changed marker/version/timeout/signal/partial output FAIL. Không strip error rồi coi PASS. Native schema check không bị chép lại: wrapper chỉ chặn unsupported version, missing completion và unsafe execution gaps.

Native readMigrationFiles là read-only consumer capability bổ sung sau safe-tag/path preflight; nó đọc cùng mirror, xác nhận references resolve và cung cấp native SQL digest/when/breakpoint projection. Không gọi migrate(), driver hoặc schema evaluator. Chỉ compare native projection với reviewed relationship evidence; không tự viết SQL parser hoặc diễn giải SQL operations.

Existing repository validation: `pnpm architecture:check` qua scripts/check-import-boundaries.mjs/checkMigrationBaselines kiểm SQL0000 tables, runtime-family restrictions và database UUID defaults; mandatory bounded reuse trong aggregate, không coi nó là full snapshot/journal validator.

Existing tests đã đọc: packages/db-cloud/test/pointage-raw-clocking-migration.integration.test.ts kiểm persisted ledger hashes/when, no-op rerun và upgrade; formalites-legal-template-repository.integration.test.ts Q1 kiểm migrated schema và DB journal count21 ở approved test scope. Các suites này dùng disposable DB/migrate và có scope-specific assumptions; KHÔNG gọi trong routine no-DB metadata validation hoặc lượt Design, không dùng old count21 để reject current cloud22. POS schema.integration.test.ts là DB behavioral test, không metadata contract đầy đủ. Display không có test directory/package test script được tìm thấy; không invent native/repository coverage.

Mutating commands NOT_ALLOWED_THIS_TURN và không được validator gọi: db:generate / drizzle-kit generate, up, drop, migrate, push, pull/introspection output, seed, hoặc package config execution. Không run generation để khôi phục validation failure. Native checks/tests ở trên được SOURCE_INSPECTED, không báo EXECUTED_PASS.

### F3 — Mandatory adapter and exact gap closure

Live38: primary GENERATED_EXTERNAL_OR_DERIVED; subclass TOOL_OWNED_NONDETERMINISTIC_LIVE_METADATA; authority MIGRATION_TOOLING_OWNED; Prettier OUT; manual formatting FORBIDDEN; mutation AUTHORIZED_MIGRATION_TOOLING_ONLY. Bổ sung required subclass discriminator cho generated entries và closed live-metadata-v1 validator ID vào D1/D3. Reproducible entries tiếp tục generated-repro-v1; không optional chọn validator nhẹ hơn. Registry derives minimum obligations từ subclass, không tin validators array. Representation/validator revision phải được review đồng bộ; old pair không hiểu subclass mới trả POLICY_VERSION_MISMATCH. Không implementation file được tạo ở đây.

Mandatory sequence per root: safe inventory/authority preflight → native snapshot validation → native migration reader + repository checks → bounded uncovered-gap checks → exact identity/review transition verification → source POST integrity → aggregate. Metadata native execution batched3 roots/run, không38 subprocesses. Không network/DB, no persistent PASS cache.

Gap checks được giới hạn:

- G1 inventory/existence: native helper tự bootstrap hoặc enumerates existing files, không biết reviewed set. Bind sorted exact38 path/raw hashes và root-specific reviewed snapshot/journal/SQL relationship inventory; missing/new/renamed path FAIL. Referenced SQL identities được lấy từ reviewed migration-owned evidence khi implementation, không đưa SQL vào formatting mutation scope.
- G2 input safety/ambiguity: strict JSON duplicate-key rejection và path-safe tag/reference strings trước native reader; native JSON.parse không phát hiện duplicate keys, reader nối tag thành path. Reject traversal/alias/reparse/escape theo D2. Không schema-domain fork.
- G3 journal shape/order: native reader tin entries. Bounded fields/primitive types theo writer/reader version7; idx/tag unique, stored order và identity mapping match reviewed native relationship. Không generate timestamp hoặc yêu cầu entropy deterministic. Tool-supported legitimate update cần reviewed new mapping, không ép immutable prefix cho live journals.
- G4 relationships: native check phát hiện sibling prevId collisions nhưng chưa chứng minh ID uniqueness, parent tồn tại/cycle, ordered journal/snapshot/SQL linkage. Bounded reference graph kiểm unique IDs, parent resolve tới reviewed genesis sentinel hoặc known earlier snapshot, không dangling/cycle, và exact reviewed link map. Không ép một snapshot cho mọi arbitrary future custom SQL; supported tool variant phải có explicit reviewed relationship rule, unknown variant FAIL/NEEDS_REVIEW, không tự invent semantics. Không thêm application schema/business rules.
- G5 native completion: source-inspected exit0 unsupported branch và possible bootstrap được chặn theo F2. Skipped/unavailable/unknown result → NATIVE_VALIDATION_UNAVAILABLE hoặc NATIVE_VALIDATION_FAILED, không structural fallback.
- G6 authority/identity: native tool không biết human approvals. Raw PRE/current identities, tool/owner/source/contract revisions và independent approved units/diffs theo D1/D5; mismatch giữ unchanged expected baseline và exact failure attribution. Tool success không tự cấp reviewed identity.

R4L.1–R4L.15 mapping: success F2/F3; parse F2/G2; ordering G3; references G4/native reader; inventory G1; native failure G5; stale authority G6; awaiting/reviewed transition F4; manual drift G6/F4; journal updates G3/F4; historical/wrong-class F5; partial state F6; uncovered gap G1–G6 không resolved trong implementation → VALIDATION_COVERAGE_GAP. Không exact UUID/timestamp/entropy reproduction; raw identity preservation là approval binding, không reproduction claim.

### F4 — Reviewed identity transition

REVIEWED_CURRENT: exact reviewed path/bytes/tool/owner/relationship identity. All applicable checks PASS mới được aggregate PASS.

AUTHORIZED_TOOL_MUTATION: external owner approval bind exact preimage/root/allowed tooling operation/tool identity/scope. Đây không phải action do formatter validator thực hiện. Unchanged bytes vẫn validate như trước; changed bytes không automatically accepted.

TOOL_GENERATED_STATE_AWAITING_REVIEW: require independent bounded execution evidence (operation, actual tool/source identity, preimage, complete exit/result, exact postimage inventory/diff, owner approval ref). Evidence match chứng minh attribution theo trusted workflow, không cryptographic proof chống actor sửa toàn bộ evidence. Legitimate matched tool state báo METADATA_IDENTITY_AWAITING_REVIEW và overall FAIL, KHÔNG tự báo tampering. Missing/mixed/unexplained bytes báo METADATA_MUTATION_UNEXPLAINED.

REVIEWED_CURRENT_NEW_IDENTITY: owner explicit review exact tool-generated postimage/inventory/link map và new policy binding, giữ old approval/history. Chỉ sau native/alternate/current-source checks PASS mới accept new identity. No automatic hash update, approval manufacture hoặc old-approval reuse. No raw-byte inspection có thể chứng minh hoàn toàn không có manual edit nếu attacker kiểm soát source/evidence; D10 trusted review boundary giữ nguyên.

### F5 — Live and historical separation; final exact45

Historical3 giữ HISTORICAL_HASH_BOUND, V-HIST/D5 exact-byte/reference preservation, original pre-Apply identity, correction approved new record/revision only. Không compare historical copy với latest live journal hoặc gọi native current-schema check lên historical copy. Live38 không được relabel historical để khỏi native validation. Admission provenance + exact path + owner/role quyết định; wrong-class assignment trả ARTIFACT_CLASS_MISMATCH cả hai chiều. Shared drizzle/meta ignore pattern không tạo class.

Final partition (disjoint, đúng45): GENERATED_BINDING_MIGRATION41 = live38 + fixture2 + lock1; HISTORICAL_PRESERVATION_REGISTRATION3; MUTABLE_FORMAT_MIGRATION1. POLICY_DECISION_REQUIRED0, NO_MIGRATION0, CLASSIFICATION_REGISTRATION_ONLY0, NORMATIVE_OWNER_REVIEW0. 38 + 3 + 3 + 1 =45. Frozen67 không mở rộng hoặc rebaseline; future mutations vẫn cần separate authorization.

Exact live38 paths/hashes — GENERATED_BINDING_MIGRATION / live-metadata-v1:

- `apps/yuta-display/drizzle/meta/0000_snapshot.json` — SHA-256 `615206f464a7a0ab96144af48d2fa7d494658bff9fb3695df63a9d118a65a2f7`.
- `apps/yuta-display/drizzle/meta/_journal.json` — SHA-256 `2c0e6208cf91a524f96bdd40de959ca9756e47de0f28367db28464d96d84fc9a`.
- `packages/db-cloud/drizzle/meta/0000_snapshot.json` — SHA-256 `75086e8b7a0eb17174f765aec9537e71bcb0e774ef05ed7e73ae8a4a7e12e49e`.
- `packages/db-cloud/drizzle/meta/0001_snapshot.json` — SHA-256 `f2fa84d91362dbec21f7f8f85ee3c03b1f6d751739da93c3374af6ceade68076`.
- `packages/db-cloud/drizzle/meta/0002_snapshot.json` — SHA-256 `5b047f116e96d7dfb64c9072c6d26157c96791d0ef058e2ec59061b216d75f34`.
- `packages/db-cloud/drizzle/meta/0003_snapshot.json` — SHA-256 `9468f2723702308be1b23b0c80160c069b3a46975f9a1fd031b26f36e7153701`.
- `packages/db-cloud/drizzle/meta/0004_snapshot.json` — SHA-256 `57fd3427fc9aec97dafd77d8b643efd611c8c12a65bf64f8cd39a30e8cdb99ad`.
- `packages/db-cloud/drizzle/meta/0005_snapshot.json` — SHA-256 `7109ff799c71fde11b6f525e828b11d57b2731598779948f4c2bebf5bc2ecb8c`.
- `packages/db-cloud/drizzle/meta/0006_snapshot.json` — SHA-256 `f729248590dcc711e05a46e3ad756b4b789affd485131799bc069d15537fb936`.
- `packages/db-cloud/drizzle/meta/0007_snapshot.json` — SHA-256 `9be05c6ec7d1c2c68f6731289fff95efa1ef5e7a6309745ac10593cdef2e245e`.
- `packages/db-cloud/drizzle/meta/0008_snapshot.json` — SHA-256 `2e742120524620e7389731b83da36719bec8e107b4d1841c8e8afeb1d26c95a0`.
- `packages/db-cloud/drizzle/meta/0009_snapshot.json` — SHA-256 `fb6099d284bff9976010c5ca50a58f71a7d9188978206baee0f4cacdc33eb082`.
- `packages/db-cloud/drizzle/meta/0010_snapshot.json` — SHA-256 `3d18a0e5349007bf5cdd741c0f742db112075da5a743e014b7539482842cdd2f`.
- `packages/db-cloud/drizzle/meta/0011_snapshot.json` — SHA-256 `e997a937c036eef36efff3708c7f01691a77bca0d7982b987b18a759c71be5b4`.
- `packages/db-cloud/drizzle/meta/0012_snapshot.json` — SHA-256 `78bfbd520781589d5509d1f28ebba3249e28adfb2932756eff33821328e19e7c`.
- `packages/db-cloud/drizzle/meta/0013_snapshot.json` — SHA-256 `b50aaa51aa9bd97c5fa36e3ea5027982cca20b345fa2d74f555bc294778a23d8`.
- `packages/db-cloud/drizzle/meta/0014_snapshot.json` — SHA-256 `2a353328c9b76c27350fa5374b8b4cdfb55e745b453930b40cda2321f4728d00`.
- `packages/db-cloud/drizzle/meta/0015_snapshot.json` — SHA-256 `b4ad465af34ff105074fe72e26260863c10cff38725562ac0242127b8c2ade8f`.
- `packages/db-cloud/drizzle/meta/0016_snapshot.json` — SHA-256 `28e3c65cb32594869a517fe8ac769580c1d46517942e91a25a9285c30f5a5537`.
- `packages/db-cloud/drizzle/meta/0017_snapshot.json` — SHA-256 `617681b23ddea95f13cfc5d82fac6e3649499515d546d5ee10ff67a8324f9ea6`.
- `packages/db-cloud/drizzle/meta/0018_snapshot.json` — SHA-256 `07ede7f42b4f1f744e700d5603b6dbfd69d867aefc86d498295251628035e0ee`.
- `packages/db-cloud/drizzle/meta/0019_snapshot.json` — SHA-256 `3ab5d679d0802a3ba6bb3faf25f3cbfda10d282064eb202485a8029ab4f7cb49`.
- `packages/db-cloud/drizzle/meta/0020_snapshot.json` — SHA-256 `b3dd7afa4aa1a4e8a590aeda90b667b292b4a93f43e1df7e917c1a81705cfac8`.
- `packages/db-cloud/drizzle/meta/0021_snapshot.json` — SHA-256 `71052147af479bfb5f480f0981859a7af7235ff21a0be69a427a6faaeb06f4bf`.
- `packages/db-cloud/drizzle/meta/_journal.json` — SHA-256 `897139ed88030e38adfffa55ba5f1bc4d4773b6bf8f1aac619f17653834907b0`.
- `packages/db-pos/drizzle/meta/0000_snapshot.json` — SHA-256 `fab0469ccef07393ac933136b5a8b79e9150dfd28575a895639788253b1c78f0`.
- `packages/db-pos/drizzle/meta/0001_snapshot.json` — SHA-256 `afa5d1997e4b73cf22646a32bff74943772820b656f3ce1c07f04d1290d13544`.
- `packages/db-pos/drizzle/meta/0002_snapshot.json` — SHA-256 `e0e2d6d24a31f1241857378177de0bedb379e69102114e2bf80bd23b343ddbf7`.
- `packages/db-pos/drizzle/meta/0003_snapshot.json` — SHA-256 `5b8e299967b1e31a972ac421d8dfa9fa5d2ef04dae9e4a32a3acfdd5f3fff30c`.
- `packages/db-pos/drizzle/meta/0004_snapshot.json` — SHA-256 `85d09c2bd7c524153fed44d24324702e37885e05581f7e8e2fac64f1e76a453a`.
- `packages/db-pos/drizzle/meta/0005_snapshot.json` — SHA-256 `5dce87aa6dae9a0872e17316618383736b9a8dc8b6a153130175ecd338bfd076`.
- `packages/db-pos/drizzle/meta/0006_snapshot.json` — SHA-256 `88fa58f223992ea6d1c9a7aecf8776c912605a3ff187fcd6525e38d36a1ad4f8`.
- `packages/db-pos/drizzle/meta/0007_snapshot.json` — SHA-256 `613b60ad45d1f799b67b2a208e8e4dcfcc4771023073a5ea05c2b29c9b18e756`.
- `packages/db-pos/drizzle/meta/0008_snapshot.json` — SHA-256 `8c046cecf15d8658c5c56026e32e68b346a7c4a2ded4438e2dadd205a667b424`.
- `packages/db-pos/drizzle/meta/0009_snapshot.json` — SHA-256 `57d5e61a2f2ce648505b4a193afb081d47d0f7cdd50e35cfeb38d0c78cece142`.
- `packages/db-pos/drizzle/meta/0010_snapshot.json` — SHA-256 `87309581f3f640ef2564156b0b426ec6af4e57311e0a7a79807e45435a03fcf9`.
- `packages/db-pos/drizzle/meta/0011_snapshot.json` — SHA-256 `04d0f97e814cc160d0a2bf18581c49c5e0ee9db6d80287e7d992235f6e9fe1c6`.
- `packages/db-pos/drizzle/meta/_journal.json` — SHA-256 `f718caff7909e3116626e1525b4b5af0bc6caf0df28f6ffaadb6cdf349fea1a9`.

Exact fixture2 + lock1 — GENERATED_BINDING_MIGRATION / V-FIX hoặc V-LOCK theo S4, reproducible-generated contract giữ nguyên:

- `apps/backoffice/test/fixtures/personnel-contract-evaluation/v1/manifest.json` — SHA-256 `8e43f64cb32fae3776636e8d74661fecb88d2f137847fe7e67c368a6624274b2`.
- `apps/backoffice/test/fixtures/personnel-contract-evaluation/v2/manifest.json` — SHA-256 `e76e0cfe39cafedcf25564e6dae079fadfc709fd8179da5000f7b7a4ff2879f0`.
- `pnpm-lock.yaml` — SHA-256 `1ccc65b174137c8e4a15aa655f4c32e7e4fa736d55982ec7f41c3c85db733275`.

Exact historical3 — HISTORICAL_PRESERVATION_REGISTRATION / V-HIST:

- `docs/reviews/restaurant-knowledge-customer-experience/pre-apply-baseline/packages/db-cloud/drizzle/meta/_journal.json` — SHA-256 `f4f314b6c4e551641ac505015832219ec3660966fda67f8e79429702b03da2fc`.
- `docs/reviews/restaurant-knowledge-team-culture/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json` — SHA-256 `be4d18a6478c5c637c45df08d2b4188380340a5ae19e6264fb61523ec4d71052`.
- `docs/reviews/restaurant-knowledge-validated-knowledge/pre-apply-baseline/files/packages/db-cloud/drizzle/meta/_journal.json` — SHA-256 `eda4a2bf75d48b6cb69a39ec13b84412a96ce239f6b0717ea39cc0cc1118a3f4`.

Exact mutable1 — MUTABLE_FORMAT_MIGRATION / mandatory Prettier + owner review:

- `apps/yuta-pos/public/sw.js` — SHA-256 `f15be18c9207417c6d76fd363ffdef4f9898efb8cdbca99951707bdb661861be`.

### F6 — Coverage, recovery and bypass resistance

Invariant refinement D2/D3/S5: each supported tracked artifact has exactly one primary class and complete mandatory obligation set. Generated subclass is mandatory. Mutable-check set includes MUTABLE_FORMATTED plus active/normative artifacts whose approved disposition still requires formatting; these latter primary classes do not lose their owner/normative obligations. Non-mutable set has mandatory alternates. Sets disjoint, union complete; exclusions never subtract from universe. This expresses the requested A/B validation split without reclassifying active/normative primary classes. Every result binds same bytes/revision and must be available, complete and current.

.prettierignore là routing only, không authority. Current sw.js mismatch must be reconciled by separately approved routing migration before activation; mandatory direct Prettier API checks cannot hide it. Raw ignore identity và exact expanded tracked membership are reviewed; broad rule expansion/new matching file FAIL even if other paths valid. No global formatter-write.

Failure/recovery matrix (attack or failure → detection/code → review path):

- Add ignored path / broaden rule → independent Git/parser + exact ignore expansion, UNCLASSIFIED / IGNORE_SCOPE_DRIFT → tooling owner reviews exact admission/rule diff; no auto-admit.
- Delete classification → coverage cardinality, UNCLASSIFIED → restore reviewed policy only through authorized correction.
- Reclassify mutable failure as generated → independent owner/subclass provenance, ARTIFACT_CLASS_MISMATCH → owning authority review; formatter failure not admission.
- Fake reviewed identity / edit hash without authority → immutable unit/preimage/postimage/diff binding, APPROVAL_BINDING_MISMATCH → trusted human review; no self-authentication claim.
- Skip native check or unavailable output → required registry/completion, NATIVE_VALIDATION_UNAVAILABLE → restore reviewed tool/isolation/adapter, fresh authorized validation; no fallback PASS.
- Native diagnostic failure including unsupported version → result contract, NATIVE_VALIDATION_FAILED → migration owner investigates; do not auto-run up/generate.
- Tool-owned class on manually changed or mixed bytes → exact execution/postimage attribution mismatch, METADATA_MUTATION_UNEXPLAINED → preserve diff, separate owner review.
- Rename to evade → old expected absent + new unmatched, ARTIFACT_MISSING / UNCLASSIFIED → reviewed path transition only.
- Live/historical confusion → exact provenance/root/role, ARTIFACT_CLASS_MISMATCH → correct admission through review, no bytes rewritten.
- Partial generation, journal-only change without expected snapshot link, or snapshot-only change without expected journal link → inventory/graph/native relationship checks, METADATA_RELATIONSHIP_INVALID → keep incomplete state FAIL, no auto-repair; owner chooses separately authorized tooling recovery.
- Legitimate migration with stale accepted identity → F4 matched evidence, METADATA_IDENTITY_AWAITING_REVIEW → exact new identity review, not tampering or silent baseline.
- Policy/validator/classification version mismatch → D1 closed version pair, POLICY_VERSION_MISMATCH → review coherent bundle; no previous-validator fallback.
- Stale owner/identity or concurrent mutation → OWNER_BINDING_STALE / CLASSIFICATION_STALE / CONCURRENT_DRIFT → stop and preserve evidence; fresh authorized baseline needed.

Every recovery is FAIL_CLOSED by default. No DB work, generator, migration writer, deletion, repair or rebaseline inside validation. Exact approved rollback/forward correction belongs to owner workflow; deployed migration rules remain intact.

### F7 — Full Sensitive Design reassessment

Assessment nghĩa là coherent bounded design contract, không current implemented validators PASS.

1. Complete classification: PASS — D1/D2/F5 exact classes/subclasses, unknown fail.
2. Fail-closed: PASS — R3/R10, required-result registry, no skipped PASS.
3. Exact path safety: PASS — D2 + safe tag preflight and isolated native reads.
4. Ignore bypass resistance: PASS — F6 independent inventory and bound expansion.
5. Mutable validation: PASS — D3 direct API, sw.js retained in mutable obligation set.
6. Reproducible-generated: PASS — D4/S4 R4 exact evidence mandatory, no relaxation for generated OpenSpec9.
7. Live metadata: PASS — F2/F3 native-first, bounded gaps, entropy not reproduced.
8. Historical preservation: PASS — D5/F5 originals and reference identities.
9. Archive preservation: PASS — D6 exact admitted records, no directory exemption.
10. Active-owner handling: PASS — D7 WAIT_FOR_OWNER and exact coordinated revision.
11. Normative validation: PASS — D8 exact diff/approval/conservative equivalence.
12. Migration67: PASS — Appendix A frozen, stop-on-drift and no scope growth.
13. Ignored45: PASS — F5 final41/3/1 with mandatory validators; no undecided path.
14. Stale state: PASS — version/tool/owner/identity bound and F4 transition.
15. Recovery: PASS — F6 no auto-repair/rebaseline.
16. Auditability: PASS — D9 + subclass/root/native completion/gap IDs/mutation-state/approval refs; raw child result distinct from aggregate, logical ordering deterministic.
17. Operational practicality: PASS as design — three native batches, safe mirror reuse within run, no DB/network/generation, no persistent PASS cache; timing/isolation/portable tool closure require actual implementation proof, not claimed measured.

Remaining BND-01 authority questions: NONE. Known execution prerequisites remain: generated8 unexplained full-pipeline bytes, V-FIX renderer and V-LOCK native serialization evidence, active-owner approvals, actual adapter/isolation and negative tests, matching offline CI tool supply, coherent reviewed ignore-policy alignment and all67 migration outcomes. These are fail-closed implementation/migration acceptance conditions, not fabricated PASS or authority to execute. If implementation cannot meet a contract, return review; no downgrade.

BND_01_RESULT: RESOLVED_IN_DESIGN.
SENSITIVE_DESIGN_RESULT: PASS.
Gate 2b: AWAITING_CONTROL_TOWER_REVIEW, NOT self-approved.
Tasks/TIC/Implementation Plan NOT_CREATED. Apply NOT_RUN.
Parent19/23; task6.1 FAIL/UNCHECKED; tasks6.2–6.4 BLOCKED; receipt VERIFIED.
Production NOT_AUTHORIZED. STOP.
````

## Current V2 version-contract amendment review

Review status: AWAITING_HUMAN_REVIEW.
Original Gate 2b: APPROVED_HISTORICALLY.
Amended Design: AWAITING_GATE_2B_REVIEW.
Approval source for amendment preparation only: explicit current-user Control
Tower instruction, BOUNDED_DESIGN_VERSION_AMENDMENT_ONLY.
Schema: yuta-spec-driven. Sensitive change: YES.
Historical packet sections above remain historical, including their earlier
planning/readiness statements. They do not approve current amended bytes.

### Exact review binding

- Design PRE: 9c9886d9c4f671c7c9f7b312c28d9533feb7683e4d74d198e2b8befdc8696728
- Design POST: 0639468e09ae6b8afafee002368544df583428e100024f07e8dd922c604e4db1
- This packet PRE: 5dd825d0ee6b8b15265d8ae158e76c0377568807aa546bbabf5bd4d9da422e90
- This packet POST: reported externally to avoid self-reference.

Reviewed amendment is the complete final section
V2 bounded version-contract amendment — current candidate in
openspec/changes/repository-format-policy-and-baseline-remediation/design.md.
The raw POST digest above binds exact content, not merely this summary.
Only its current-version notice and that final amendment were added to Design;
historical D1–D12, appendices and decisions were not rewritten.

### Decision and representation review

V1 (1,1) remains historical and strict; V2-only fields stay invalid in V1.
Current V2 is (2,2). Current validator reports
LEGACY_POLICY_VERSION_REQUIRES_MIGRATION for (1,1),
POLICY_VERSION_PAIR_MISMATCH for (1,2)/(2,1), and
POLICY_VERSION_MISMATCH for missing/malformed/future versions.
No fallback, defaulting, migration or rebaseline is automatic.

V2 retains six classes and adds orthogonal domainAdmissions and ignoreMembership.
Domain units bind exact path, owner, type/reason evidence, raw expected identity,
tool/config identity and independently observed approval with policy revision.
No parser-null, ignore rule or approved:true shortcut is authority.
Parser-supported/expected in-domain paths cannot silently become OUT.

Ignore units bind literal source path/hash, bound Prettier expansion algorithm
and version, tool/config identity, unique exact expanded tracked paths, canonical
membership hash and independent approval. Canonical membership set ordering is
explicit; whole original policy identity still preserves original array order.
Recompute from actual semantics, not curated expected paths. Same source with
changed membership fails IGNORE_SCOPE_DRIFT; source/config/tool staleness fails
IGNORE_BINDING_STALE. Ignore routing rules and sw.js blocker remain unchanged.

Migration requires reviewed V1 identity, separate mutation authorization, V2
candidate, schema/evidence validation, canonical identity, Control Tower review
and reviewed V2 identity. Missing evidence blocks migration. No real data created.

### Sensitive bypass reassessment

| Attempt                      | Required rejection / assessment                   |
| ---------------------------- | ------------------------------------------------- |
| Relabel V1, omit V2 evidence | Strict required fields; POLICY_INVALID            |
| Fake approval                | External exact unit/digest/body/revision checks   |
| Reuse V1 digest              | Version-sensitive original JSON identity mismatch |
| Mixed pair                   | POLICY_VERSION_PAIR_MISMATCH                      |
| Fallback to V1               | Forbidden; legacy is never current PASS           |
| Omit or stale membership     | POLICY_INVALID / IGNORE_SCOPE_DRIFT               |
| Parser-null/ignore exemption | UNRESOLVED; no class/admission inferred           |
| Concurrent source mutation   | CONCURRENT_DRIFT, no acceptance or repair         |

SENSITIVE_DESIGN_RESULT: PASS (design assessment only).
SPECS_CHANGE_REQUIRED: NO; R1/R3/R9/R10/R11/R12 and Specs non-goals allow
representation/version details in Design. No normative behavior expansion.
Remaining bounded design questions: NONE. Actual Phase 2 implementation,
authority extraction, tests and later Phase 3/4 prerequisites are not proved by
this assessment. Human Gate 2b approval is still required.

### Validation and protected state

Exact preimages were checked before editing: tasks.md, check.mjs, check.test.mjs,
approved Proposal/Analysis/Specs/Gates, historical Design and packet, baseline67,
ignored45 and parent. Final command results and two-path-only POST integrity are
returned externally after writing this packet:

- openspec validate repository-format-policy-and-baseline-remediation --strict --no-interactive
- pnpm docs:check
- pnpm architecture:check
- scoped Prettier and git diff --check on Design and this packet

No implementation tests/typegen/typecheck claimed this design-only turn.
No source, Tasks, Specs, Gate 1/2, canonical Knowledge, package/lock or parent
edits authorized or performed. Original approval does not approve amended bytes.

Tasks remain 4/29. Phase 2 BLOCKED pending amended Gate-2b review and separate
continuation authorization. Phase 3+ NOT_AUTHORIZED.
Parent19/23, Task6.1 FAIL/UNCHECKED; no rerun.
Production NOT_AUTHORIZED. STOP at amended Gate 2b.

## V-FIX deterministic renderer amendment — current Gate 2b review

Review status: AWAITING_HUMAN_REVIEW.
V-FIX deterministic-renderer amendment: AWAITING_GATE_2B_REVIEW.
Original relevant Gate 2b approvals: APPROVED_HISTORICALLY.
Current user instruction authorizes Design/review edits only, not implementation.
Current Tasks 9/29 overrides historical progress summaries for this checkpoint;
no historical results or hashes below are rewritten.

Design PRE SHA-256: 0639468e09ae6b8afafee002368544df583428e100024f07e8dd922c604e4db1.
Design POST SHA-256: 3a2931f8d96f53908d27011db6995519f015192ed0502eab45bf6e21570ebbc1.
Sensitive packet PRE SHA-256: 1de1c8379e87086912c97463a7ce7aa2a116389722343a3091477e40a7d8d55a.
Packet POST is reported externally to avoid a self-hash.

Raw hashes use Node crypto SHA-256 over fs.readFileSync bytes. The fresh inventory
of 2636 tracked/unignored files matched the preceding checkpoint before editing.

| Protected artifact                                                                                                     | Unchanged SHA-256                                                |
| ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| openspec/changes/repository-format-policy-and-baseline-remediation/analysis.md                                         | 7507e4ec267f64b27eea5df25feabdb74813a0e3c7d8563a26978f595f639ff9 |
| openspec/changes/repository-format-policy-and-baseline-remediation/proposal.md                                         | 4382979e9a50b687f4da580630c4582cf7c1791454ca1e6b4c52f1416dcf0ba0 |
| openspec/changes/repository-format-policy-and-baseline-remediation/specs/repository/artifact-format-validation/spec.md | 11a24180f8620f688a9a718127ec040d09e7b7e279a3a7a92f6d588de89be394 |
| openspec/changes/repository-format-policy-and-baseline-remediation/tasks.md                                            | 6f4a177f546cac2594edb54b33cd3573cadcef645d77042a3b84a97cf767ee01 |

SPECS_CHANGE_REQUIRED: NO (R4/R4.1–R4.7; no host fallback requirement).
RUNTIME_ARCHITECTURE_DECISION_REQUIRED: R1 and R2 are compared, neither
provisioning model has accepted repository renderer authority. Codex internal
runtime is rejected as canonical authority, retained only as discovery evidence.
CANONICAL_FONT_AUTHORITY: NEEDS_REVIEW.
HISTORICAL_OUTPUT_COMPATIBILITY: NEEDS_REPRODUCTION_EVIDENCE.
SENSITIVE_DESIGN_RESULT: BLOCKED_NEEDS_REVIEW.

The exact amendment text follows. It defines explicit font/closure preflight,
zero-write reproduction gate, nondeterminism controls and failure/recovery while
leaving topology, exact artifacts and font selection to human review. Approval
of historical Gate 2b bytes does not approve this amended Design.

#### V-FIX deterministic renderer authority amendment

Status: AWAITING_GATE_2B_REVIEW.
Original relevant Gate 2b approvals: APPROVED_HISTORICALLY.
This section supersedes only incomplete V-FIX renderer selection assumptions,
not prior historical evidence, other adapters, Specs or Tasks.
Current Tasks: 9/29; Task 3.2 BLOCKED/UNCHECKED.

#### Specs consistency and exact gap

SPECS_CHANGE_REQUIRED: NO. R4 and R4.1–R4.7 require reviewed generator identity,
exact output bytes/inventory, and separate review for pipeline changes. They
do not prescribe Python locations, dependency ranges or host font fallback.
R3 requires complete alternate validation; R9 controls reviewed migration.
RAW_BYTE_EXACT_PDF_REPRODUCTION remains mandatory.

E-FIX (original Design line 404) describes existing ranges
Pillow>=10,<13 and reportlab>=4,<5 and host Arial/DejaVu selection. It is
implementation evidence, not permission to use any matching installation.
V-FIX (original line 435) already requires exact Python/Pillow/ReportLab/font
identities and isolated comparison, but omits environment provisioning authority,
platform qualification, explicit font selection and complete dependency closure.
The original unresolved-question closure near line 767 cannot establish those
missing execution bindings. No clause expressly authorizes arbitrary host Python;
the fixture README's bare python command is legacy generation documentation.
Ranges, first-existing fonts and import-only closures cannot guarantee exact PDF
bytes. The current Codex 3.12.14/Pillow 12.3.0/ReportLab 4.4.9 discovery remains
a candidate observation only, never canonical validation authority.

#### Runtime architecture alternatives

Repository evidence: apps/backoffice/scripts/requirements-contract-evaluation.txt
contains ranges, not a lock; fixture README documents ordinary Python invocation.
.github/workflows/ci.yml provisions Node/pnpm on ubuntu-latest, no renderer Python.
Docker Compose is used for isolated development databases; POS/Display have
application Dockerfiles. Neither proves an approved Python renderer image.
No repository-owned deterministic Python environment was found in the inspected
tooling/CI closure. These are support limits, not permission to reuse app images.

| Option                                        | Repository support / files required                                                                                                                                          | Pinning                                                                                                                                                       | Windows / Linux / CI                                                                                                       | Reproduction, rollback, cost and risk                                                                                                                                                                      |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 repository-managed venv                    | Python generation exists; isolated provisioning does not. Future owned bootstrap, exact dependency lock and environment binding plus ignored disposable venv would be needed | Exact CPython distribution/build and artifact digest, exact wheels/transitives/native dependencies and lock SHA; venv alone does not pin its base interpreter | Separate Windows/Linux qualified distributions; CI provisioning must be added through later approval                       | Low infrastructure cost, but distinct native stacks require cross-platform equality evidence. Remove only exact owned environment after verification; preserve outputs. Host base-Python leakage is a risk |
| R2 renderer image                             | Docker tooling exists for other scopes, no renderer image. Future dedicated Dockerfile/build inputs, digest binding and bounded invocation would be needed                   | Platform-specific immutable image digest, base/Python/dependency/font/source closure; no floating tags or automatic pulls during validation                   | Linux execution model; Windows requires reviewed Linux-container support. CI must use the same approved architecture/image | Stronger userspace alignment, not proof against CPU/kernel/native-code variance. Higher image maintenance cost; rollback to separately approved digest, never rewrite outputs                              |
| R3 existing deterministic tooling environment | NONE established for YUTA renderer. Codex bundle and parent UI advisory Python are separate authorities                                                                      | Discovery versions do not approve artifact acquisition or runtime substitution                                                                                | Internal Codex path is not a repository/CI contract                                                                        | No valid canonical choice currently; cannot borrow unrelated acceptance or implicitly install into user Python                                                                                             |

RUNTIME_ARCHITECTURE_DECISION_REQUIRED.
Preferred runtime architecture: NONE SELECTED. R1 and R2 need explicit provisioning,
supported-platform and ownership decisions; existing Docker support alone is
insufficient to promote R2. The mandatory architecture property is
REPOSITORY_OWNED_ISOLATED_RENDERER_ENVIRONMENT. No global/user Python or Codex
internal absolute path may resolve canonical authority. No new environment,
dependency file, image, CI step or command is created by this amendment.

For either accepted topology, the subsequent exact reviewed binding must contain
Python implementation/full version/build/ABI/executable identity, OS/architecture,
Pillow and ReportLab exact versions AND artifact/installed source identities,
all transitive Python modules and output-sensitive native libraries (including
FreeType, JPEG and compression implementations), dependency-specification raw SHA,
renderer source closure, font closure and approved acquisition/provenance evidence.
Use a sorted path/raw-hash inventory and existing canonical identity rules for
structured bindings. Package version equality and import-only closure are not
sufficient. Include fixed invocation, immutable input mounts/paths and environment
allowlist. No network/provisioning during routine validation. Unknown platform,
missing material dependency or unavailable approved environment FAILS CLOSED.

#### Local font candidate discovery

Bounded read-only inventory: repository sources, installed node_modules/.agents
font assets, and the previously identified ReportLab fonts directory.
No tracked TTF/OTF/WOFF font candidate was found in the ordinary source inventory.
Installed inventory includes Noto Sans web subsets, Next bundled Geist and
Playwright Codicon. Icon fonts are not corpus text candidates; WOFF subsets are
not assumed directly usable by the existing Pillow TTF loader.
No font below is selected by the current renderer. Current renderer still uses
host Arial/DejaVu for scan text and ReportLab built-in Helvetica metrics for
digital text. No font was copied, installed or converted.

Path roots below are exact local discovery roots, NOT canonical runtime paths:

- N: node_modules/.pnpm/@fontsource+noto-sans@5.2.8/node_modules/@fontsource/noto-sans
- G: node*modules/.pnpm/next@16.2.9*@playwright+tes_18b0c35d24aaa82ae035b4f8c20bfe54/node_modules/next/dist/compiled/@vercel/og
- V: C:/Users/Tam/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/Lib/site-packages/reportlab/fonts

| Candidate / exact relative asset                                  | SHA-256                                                          | Source / license evidence / suitability                                                                                                            |
| ----------------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Noto Sans regular Latin: N/files/noto-sans-latin-400-normal.woff2 | 0d352d8a993d3f79d860e44d74ee3e132649253f2af24caad088c3aed6ec08c8 | Backoffice exact dependency 5.2.8; N/LICENSE contains OFL 1.1 text. Web subset, full required glyph coverage and Pillow compatibility unproven     |
| Geist regular: G/Geist-Regular.ttf                                | bde046ddd9f20be35b0bd56cc79eb752b967fb6661a3fe76cb067bb09f871d76 | Next bundled asset; G/LICENSE is MPL 2.0 package text, not sufficient exact font attribution. Glyph coverage and redistribution linkage unresolved |
| Bitstream Vera regular: V/Vera.ttf                                | c4c45690b345435b2cba52ecabe275f05e49b389b39fe68ad03afbb551288d3d | ReportLab distribution; V/bitstream-vera-license.txt explicitly names Vera and includes notices; corpus coverage unproven                          |
| Bitstream Vera bold: V/VeraBd.ttf                                 | cc037385e4d55bfde89b13e03091ee93bf40c0c52ddd391ff031ab276f13b8e9 | Same distribution/evidence; bold not a substitute for reviewed regular scan face                                                                   |
| Bitstream Vera bold italic: V/VeraBI.ttf                          | fca0d4eeac1ced7e75e1b2274c869a351d2d83b5ed1f61d249e7bcc477c33ebe | Same distribution/evidence; exact style metadata still requires reviewed binding                                                                   |
| Bitstream Vera italic: V/VeraIt.ttf                               | 2adc684d518f45232c4ad1f56522f5a82a6904c31940373e1b7030beee20fb3a | Same distribution/evidence; exact style metadata still requires reviewed binding                                                                   |
| ReportLab test font: V/hb-test.ttf                                | 4df8840ec8382efa2c06bda01e31e1a5a975cd46e13f7c0b0be696a8542f1ba0 | Test asset, no corpus suitability or exact license attribution established; not recommended                                                        |

Names/styles above identify package candidates, not completed glyph qualification.
A read-only fontTools metadata probe failed with ModuleNotFoundError (exit 1);
nothing was installed and no glyph coverage PASS is claimed. Exact rendered
string repertoire, cmap coverage, loader/style verification and output evidence
remain required. File existence in one installation does not establish CI
availability; N/G are tied to package versions, V to discovery tooling only.
License observations describe local evidence, not legal clearance. Preserve
exact font-specific notices and obtain reviewed acquisition/distribution binding
before adding any input. A package-wide license cannot silently license every
embedded font. No upstream/provenance or redistribution approval is inferred.

#### Font alternatives and explicit selection contract

| Option                            | Cross-host raw-byte implications                                                                      | Ownership / license / CI                                                                                                             | Design disposition                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| F1 existing dependency font       | Possible only with exact raw asset plus complete renderer/platform equality evidence; not proven here | Noto/Vera have local notice evidence but no accepted renderer binding; CI must provision exact bytes                                 | Requires reviewed selection/loader contract; font choice unresolved            |
| F2 explicitly approved font input | Enables explicit identity, not automatic historical equality                                          | Repository custodian owns exact source/artifact digest and notice linkage; separately authorized provisioning, no implicit vendoring | Preferred authority direction if F1 cannot be qualified; exact font unresolved |
| F3 one-host Arial                 | Does not establish cross-host canonical reproduction                                                  | OS-owned; no redistribution/CI provisioning evidence established                                                                     | Rejected as canonical recommendation; historical observation only              |
| F4 Arial/DejaVu fallback          | Host-dependent, can silently select different bytes/metrics                                           | No fixed input closure                                                                                                               | Rejected for canonical validation                                              |

CANONICAL_FONT_AUTHORITY: NEEDS_REVIEW; no exact font is approved here.
All options changing existing selection require reviewed renderer implementation;
this amendment supplies that fail-closed design, not permission to apply.

Proposed canonicalFont is a strict closed object: logicalId, artifactSourceRef,
artifactSha256, relativeAssetPath, sha256, faceIndex, expectedFamily,
expectedStyle, expectedWeight, registrationId and licenseEvidenceRef. No default
path or font discovery. Resolve only under the approved read-only renderer input
root with existing literal path/reparse/containment controls; reject unknown
fields and unreviewed injected assets. Check raw bytes and face/style metadata
before loading; missing, wrong hash/style, unloadable font or unsupported glyph
fails. Never retry through another font or host font directory.

The scan loader uses that explicit face at the existing 20/28/34 sizes in fixed
call order. Digital Helvetica/Helvetica-Bold/Helvetica-Oblique remain separate
ReportLab metric identities in the closure; do not silently replace them with
the scan font. Any future digital TTF registration requires an explicit separate
style-to-asset map, fixed registration order and review, not synthetic style
fallback. Canonical validation must not invoke legacy find_font fallback.

#### Historical identity and reproduction gate

HISTORICAL_OUTPUT_COMPATIBILITY: NEEDS_REPRODUCTION_EVIDENCE.
Retain current 122 path/raw identities as historical reviewed outputs; do not
assume any new font produces their bytes. R4 continues to reject mismatch.
If authorized isolated reproduction differs, report exact path/expected/actual
SHA and attributable cause; preserve originals and STOP. An approved deviation
is not reproduction PASS. A separate owner-approved generator/output migration
must define old/new closure, exact diff and regenerated answer/PDF semantics,
reviewed visual checks and new identities before any repository output write.
If migration is not approved, V-FIX stays blocked. Never hand-patch PDFs,
normalize them for comparison, or overwrite old approval hashes.

Before completing Task 3.2, obtain a separately reviewed closure binding:
environment + Python + Pillow + ReportLab + transitives/native libraries + font;
generator source closure; all 59 corpus inputs; environment controls below;
all 122 expected outputs; and actual zero-repository-write exact reproduction.
Keep v2's 58 copied v1 inputs explicit, not evidence that their original raster
font was recreated. Run process-cold and repeated checks on each accepted
execution-platform binding. Enforce missing/extra output detection and existing
corpus schema assertions. No generator or reproduction is authorized this turn.

#### Output-sensitive controls

These proposed fixed controls require a reviewed pipeline implementation and
compatibility evidence; they do not reinterpret historical bytes.

| Variable                 | Bound value / normalization                                                                                                | Failure behavior                                                                       |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Locale                   | Canonical process locale C; explicit UTF-8 IO independent of host locale                                                   | Reject unsupported/unset effective binding                                             |
| Timezone                 | UTC, no host date input                                                                                                    | Reject effective mismatch; do not inherit host timezone                                |
| Encoding                 | UTF-8, no BOM; explicit LF for generated JSON, ensure_ascii=True, indent=2, one final LF                                   | Compare raw bytes; legacy CRLF mismatch requires review, never normalize expected file |
| cwd / source paths       | Owned scratch logical root, source-relative layout identical to reviewed invocation; repo inputs read-only                 | Reject escapes, links/reparse substitution, unexpected imports                         |
| Temp paths               | Unique owned scratch root outside repository, deterministic relative image names, no absolute temp path in output metadata | Any path-sensitive byte drift fails; never delete broad temp roots                     |
| Timestamp / PDF metadata | ReportLab invariant=1; fixed title per fixture and fixed author from source; no wall clock/mtime metadata                  | Reject nondeterministic fields or changed source; no post-render stripping             |
| Randomness               | random.Random fixture-id:page-number seed, fixed call order; PYTHONHASHSEED=0; no entropy source                           | Reject unbound randomness or output drift                                              |
| Compression              | PDF pageCompression=1; JPEG quality 48/88, optimize=False, progressive=False; exact native codec bindings                  | Version/native drift fails before rendering; byte differences fail afterward           |
| Fonts                    | Exact approved face/style/hash, sizes/order and digital metrics map; no fallback                                           | Missing/substituted/injected/unloadable/glyph gap fails                                |
| Filesystem ordering      | Sorted exact input/output inventory, no directory iteration as output authority                                            | Missing/extra/duplicate path fails                                                     |
| Platform                 | Exact reviewed OS/architecture/Python ABI/native closure; separate binding per qualified platform                          | Unknown host/platform fails; Windows and Linux equality not inferred                   |
| Ambient process          | Disable user-site/PYTHONPATH injection and bytecode writes; offline execution; allowlisted non-secret environment          | Unreviewed module/search-path/env substitution fails                                   |

#### Sensitive review and recovery

Environment substitution, wrong Python/build, version-only dependency matches,
stale dependency locks/native libraries and font substitution are preflight
failures. Hash verification must occur before code/font load and bind immutable
read-only inputs through execution; recheck afterward to detect concurrent drift.
No approval via self-reported version strings, caller-selected paths, injected
environment or legacy fallback. Bound paths alone are not a hostile-host sandbox:
OS/administrator and chosen isolation engine remain explicit trusted dependencies.

Timestamp/randomness/platform byte drift fails exact output comparison.
Historical/current identity confusion fails separate reviewed binding checks.
Import-observed local hashes are not full supply-chain provenance. Missing
license/provenance, glyph coverage, full environment closure or platform
qualification blocks acceptance rather than downgrading the validator.

Recovery: no install, repair, baseline refresh or output replacement in validation.
Stop with exact failing identity and preserve historical corpus/evidence. Any
cleanup must target only verified owned scratch state; unknown concurrent state
is preserved. Reprovisioning or output migration needs separate authorization,
new exact binding and re-review; old Gate 2b approval never covers new bytes.

SENSITIVE_DESIGN_RESULT: BLOCKED_NEEDS_REVIEW.
Remaining decisions: R1 versus R2 topology and supported execution platforms;
exact Python/dependency/native artifact bindings and provisioning custody;
exact font, notices and glyph coverage; authorized reproduction/migration route.
These are explicit blockers, not deferred implementation discretion.
Amendment: AWAITING_GATE_2B_REVIEW. No Tasks/TIC semantics changed.
Task 3.2 remains BLOCKED/UNCHECKED; Tasks 9/29. Tasks 3.3–3.10 UNCHECKED;
Phase 4+ NOT_AUTHORIZED. Parent19/23, Task6.1 FAIL/UNCHECKED; no rerun.
Production NOT_AUTHORIZED.

### Validation and boundary

Required commands: pnpm exec openspec validate
repository-format-policy-and-baseline-remediation --strict --no-interactive;
pnpm docs:check; pnpm architecture:check; scoped Prettier and git diff --check
for Design and this packet. Actual results: strict OpenSpec exit 0 (valid),
docs:check exit 0 (36 current documents), architecture:check exit 0, scoped
Prettier exit 0 and scoped git diff --check exit 0. Both delivery files are
pre-existing untracked files, so Git diff alone does not prove their scope;
the independent full path/raw-hash inventory is the scoped change check.
No tests, typecheck, build, generator, reproduction or install is claimed by this
Design-only checkpoint. The read-only fontTools probe exited 1 (module missing);
this does not establish font coverage. No repair/install was attempted.

Final path/hash comparison must show only Design and this packet changed.
Specs, Tasks, check.mjs, check.test.mjs, package/lock, baseline67, ignored45,
Task-3.1 output set and parent remain protected. No source/font bytes are edited.
Task 3.2 stays UNCHECKED; 3.3–3.10 UNCHECKED; Phase 4+ NOT_AUTHORIZED.
Parent19/23; Task6.1 FAIL/UNCHECKED. Production NOT_AUTHORIZED.

REPOSITORY_FORMAT_POLICY_V_FIX_RENDERER_DESIGN_CHECKPOINT:
AWAITING_CONTROL_TOWER_REVIEW.

## Concrete V-FIX container and Vera — current Gate 2b packet

Review status: AWAITING_HUMAN_REVIEW.
Current concrete container/Vera amendment: AWAITING_GATE_2B_REVIEW.
Prior Gate 2b: APPROVED_HISTORICALLY.
Previous deterministic-renderer amendment: BLOCKED_NEEDS_REVIEW HISTORICALLY.
Current user approved runtime/font directions FOR DESIGN only; acquisition,
image build, implementation and reproduction remain unauthorized.

Design PRE: 3a2931f8d96f53908d27011db6995519f015192ed0502eab45bf6e21570ebbc1.
Design POST: b473dfdf1bd2f3dc4b4ceb462b3e828a6e0d23efcc4f5c70dc13cb06b801cc3e.
Sensitive packet PRE: 65d252d01df2982f44d8312977c8750d88ea37a64cdede1ae55d47916e90982c.
Packet POST reported externally to avoid self-reference.
Raw SHA-256 computed with Node crypto over fs.readFileSync bytes.

Tasks protected SHA:
0ced1bd65234d100bcbb1f10144cdc92bbc5328a46a4d03a8fca9936c6518fbc.
The fresh 2636-file inventory matched the prior reviewed state before editing.
Specs consistency: NO change required by R3/R4/R9; no host model is mandated.
Original planning and review observations below/above remain history.

### Exact current amendment content

### Concrete V-FIX container and ReportLab Vera amendment

Current concrete amendment: AWAITING_GATE_2B_REVIEW.
Prior relevant Gate 2b approvals: APPROVED_HISTORICALLY.
Previous deterministic-renderer amendment: BLOCKED_NEEDS_REVIEW HISTORICALLY.
This section resolves that amendment's runtime/font selection questions only.
Earlier evidence/statuses remain historical; no earlier approval approves these
new bytes. Specs, Tasks and other adapters are unchanged.

#### Contract and selected platform

SPECS_CHANGE_REQUIRED: NO. R4/R4.1–R4.7 require reviewed exact generation,
inventory and fail-closed drift without prescribing host fallback or a runtime.
R3/R9 preserve mandatory validation and reviewed mutation. This amendment
retains RAW_BYTE_EXACT_PDF_REPRODUCTION and grants no artifact acquisition.

Canonical V-FIX is a repository-owned CONTAINERIZED_RENDERER tooling capability,
not an app/service and not the Codex runtime. Prohibit global/user/host Python,
host site-packages, host font discovery and floating image tags. Windows is a
launcher host for the same Linux container platform, not a second native renderer.

One canonical execution platform: linux/amd64, Linux userspace fixed by the
single reviewed base-image platform-manifest digest. Distribution/release,
libc/native package set and kernel/CPU compatibility constraints are
REQUIRED_BEFORE_SETUP in that same reviewed binding; no alternative-platform
fallback. Unsupported or unqualified host execution is a failure, not permission
to use an arm64 image, emulation or native Windows renderer.
A platform change requires new reviewed closure and reproduction evidence.

| Binding                     | Concrete Design selection / pending artifact                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Target OS / architecture    | Linux container / amd64 only                                                                                  |
| Exact userspace/base        | REQUIRED_BEFORE_SETUP: distribution/release, immutable platform-specific base digest and provenance           |
| Python                      | REQUIRED_BEFORE_SETUP: full CPython version/build, ABI, executable and distribution identities; no Codex path |
| Pillow                      | REQUIRED_BEFORE_SETUP: exact version, wheel digest, installed/native closure; no ranges                       |
| ReportLab expected version  | 4.4.9; satisfies existing >=4,<5 and matches inspected candidate                                              |
| Approved ReportLab artifact | PENDING_ACQUISITION_VERIFICATION; exact wheel/hash/membership required                                        |
| OS/native dependencies      | REQUIRED_BEFORE_SETUP: exact package/artifact/library set including output-sensitive FreeType/JPEG/zlib       |
| Build context               | REQUIRED_BEFORE_SETUP: exact allowlisted context path/type/raw hashes, build recipe and tooling identity      |
| Final image                 | REQUIRED_BEFORE_REPRODUCTION: separately reviewed immutable image/platform digest                             |

No missing value is a wildcard or acceptable null. The current installation's
4.4.9 version/RECORD is evidence for Design, not canonical supply authority.
The current broad requirements file is not the future renderer lock.

#### Exact font role and digital boundary

FONT_SEMANTIC_AUTHORITY: APPROVED_FOR_DESIGN.
SUPPLY_ACQUISITION_ARTIFACT_AUTHORITY: PENDING.

Canonical scan font role is scan-roman only:
ReportLab fonts/Vera.ttf, internal BitstreamVeraSans-Roman / Bitstream Vera Sans,
Roman regular weight 400, TrueType face index 0, 65932 bytes.
Expected raw SHA-256:
c4c45690b345435b2cba52ecabe275f05e49b389b39fe68ad03afbb551288d3d.
These expected bytes must also be proven members of the approved supply artifact.

Provision only through the exact approved ReportLab distribution inside the
image. Do not copy fonts from Codex or OS directories. Resolve the member under
the verified package root, verify raw hash/size/internal name/style/weight/face
before use, and load it explicitly at 20/28/34 points. Register the logical role
once in the renderer-owned map; no OS font registration or auto-search.
Hash/face/weight/load/substitution failure FAILS CLOSED. Synthetic styles and
fallback are forbidden.

VeraBd.ttf, VeraIt.ttf and VeraBI.ttf were inspected, but are NOT canonical
render-role members: bold/oblique comparisons were coverage evidence only;
bold italic has no render site. Their incidental presence in a pinned package
does not permit selecting them. Package inventory binding remains independent
of the smaller approved render-role map.

Digital output retains exact ReportLab Helvetica, Helvetica-Bold and
Helvetica-Oblique metric behavior, source identities and encoding mappings.
Do not register Vera under those names or replace digital fonts. Bind the
ReportLab metric/encoding source members in the final installed closure.
The minimum change is scan font selection only, not global typography.

#### Repertoire and license authority

RENDERED_REPERTOIRE_SHA256:
94d6992b2a1965bab3800b7800993d832364b25cff1ccf3dbbb09021b3018d51.
Reviewed evidence: 740 draw requests, 286 unique strings, 62 codepoints,
61 visible, SPACE only, zero controls. Scan Roman needs 59 codepoints;
digital Roman/Bold/Oblique need 55/58/21. Complete Vera comparisons do not
broaden approved roles. Evidence remains in unchanged Tasks at SHA-256
0ced1bd65234d100bcbb1f10144cdc92bbc5328a46a4d03a8fca9936c6518fbc.

Any generator, corpus or render-graph change must rederive and compare this
identity. Different repertoire makes FONT_COVERAGE_APPROVAL_STALE and fails
until new exact coverage is reviewed. Same repertoire does not waive changed
source/runtime approval; graph changes still require their own integrity review.

Required license member: reportlab/fonts/bitstream-vera-license.txt,
5954 bytes; raw SHA-256:
3361d054759a2fc686a2c058be82deaf9c2e6fe549be9004d7935a6c1736315d.
Verify membership and raw identity before build/load; preserve required notices
in the final image/tooling distribution. No stripping or font modification;
respect the license's modification/name restrictions. No blanket legal clearance
or permission for an unreviewed artifact follows from this license observation.

#### Mandatory acquisition and build gates

STOP RENDERER_SUPPLY_CLOSURE_NOT_APPROVED before setup/build if any required
supply binding or explicit acquisition/setup authorization is absent.

Separately reviewed supply closure must prove ReportLab wheel source/name/version,
artifact cryptographic digest, exact font and license membership/size/raw hashes,
dependency lock raw identity and approval reference. Inspect archive members
safely: reject traversal, ambiguous/duplicate paths, links or mismatched member
types. No use of package self-report alone as authenticity proof.
Current Codex-installed RECORD membership is PARTIAL linkage to the original
artifact and cannot satisfy this gate. The same approval obligation applies to
base image, Python, Pillow, transitive wheels and native packages.

Build closure joins approved supply with exact platform, OS/native packages,
Python build, Pillow/ReportLab artifacts and installed inventory, font/license,
renderer entrypoint/source, generator source, 59-input corpus closure, repertoire
and environment controls. Include recipe, builder identity/options, no unbound
network resolution, and final image platform-specific digest. Review that final
image identity before accepting reproduction; a matching recipe is not proof
of a matching image or reproducible external-registry build.

Known source/input/output expectations remain:
generator raw SHA 6ddbd29046cbff645bd546e472f04cac010d7e6d53c84ed9a67f0ca04201bff2;
59-input closure 35e3ff1fd1cef6d6f336b155d5b6bec7bee679ea6e12666e838f6cc78c46b9d5;
122-output closure a075ef0e47cfa288a93316c99d28bb1b74bab6362e081ded4b18e17a62f40560.
Do not reuse these hashes for changed membership or bytes.

#### Isolation and nondeterminism

Runtime network OFF. Any acquisition network access belongs to a separately
authorized prebuild phase, not rendering. Nonprivileged container, no host Docker
socket/devices/font directories/Python/site-packages/credentials mounted.
Read-only root filesystem and repository/input mounts; only explicit owned
scratch output/temp writable. Drop unnecessary capabilities and deny privilege
escalation; bound resource/time usage. Validate literal mounts, resolved
containment and native identity before execution, then compare repository
path/hash snapshot afterward. Unexpected write or escape FAILS even if PDFs match.
Container/host administrator and kernel remain trusted; no hostile-host guarantee.

| Material input           | Bound value / normalization                                                                                         | Verification and failure                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Locale/timezone          | C locale, UTC; explicit UTF-8 IO                                                                                    | Probe effective settings before execution; mismatch FAIL                                 |
| Encoding/manifests       | UTF-8, no BOM, LF, ensure_ascii=True, indent=2, single final LF                                                     | Raw comparison; no normalization of reviewed expected bytes                              |
| cwd/paths                | Fixed container work layout /work; source /input; output /work/output; temp /work/tmp, backed only by owned scratch | Reject path aliases/escapes and absolute host path leakage; no actual-repo mutating main |
| Time/PDF metadata        | invariant=1; source-defined title/author; no wallclock or source mtime input                                        | Bind metadata logic; compare raw PDFs, never strip differing metadata                    |
| Randomness               | Source fixture-id:page-number seeds/call order; PYTHONHASHSEED=0                                                    | Unbound entropy or changed calls FAIL; repeated equality required                        |
| Compression              | PDF pageCompression=1; JPEG 48/88, optimize=False, progressive=False                                                | Bind codecs/native libraries and options; raw mismatch FAIL                              |
| Fonts/registration       | Only explicit scan-roman Vera; fixed loading order/sizes; existing digital metrics                                  | Verify exact member/face/style and metric closure; fallback/substitution FAIL            |
| Object/input order       | Source fixture/page/line order, exact wrap behavior, sorted inventory                                               | Bind renderer and Python textwrap source; missing/extra/order drift FAIL                 |
| Platform/native behavior | Exact reviewed linux/amd64 userspace/image and native closure                                                       | Unknown architecture/emulation/library/runtime drift FAIL                                |
| Ambient dependencies     | Isolated interpreter, user-site/PYTHONPATH disabled, no bytecode writes, allowlisted environment                    | Unexpected module/root/environment injection FAIL                                        |

These are future implementation requirements, not executed controls. LF selection
does not approve changing historical CRLF bytes. Any necessary generator wrapper
or explicit font injection must be separately authorized and source-bound;
no runtime monkeypatch supplied by callers or arbitrary hook policy.

#### Exact 122-output reproduction and cold/warm evidence

Require separate experiment authorization after supply and final image review.
Mount the reviewed 59 inputs read-only, use exact source/renderer closure,
produce v1's 60 PDFs, v2's two changed PDFs and 58 copied inputs, plus two
manifests into scratch only. Never count copied inputs as fresh font rendering.
Compare every path and raw byte to the current reviewed 122 outputs, then run
required schema/corpus assertions. Missing/extra/partial output FAILS.

Distinguish (1) reviewed image build identity, (2) fresh process/container render,
and (3) warm/repeated render using the same approved binding and clean output
scope. All must agree with expected output identities, not merely each other.
Any warm-state influence fails. Do not claim clean-install, image reproducible
build or external registry reproducibility without separate actual evidence.

HISTORICAL_OUTPUT_COMPATIBILITY_EXPECTATION: LIKELY_DIFFERENT.
If any historical raw output differs, Task 3.2 MUST NOT PASS:
HISTORICAL_OUTPUT_MISMATCH: CONTROL_TOWER_REVIEW_REQUIRED.
Report expected/actual hash and classification (missing/extra, manifest/newline,
PDF metadata/order/path, glyph/layout/raster/codec, unexplained).
Stable repeated NEW bytes do not satisfy historical exactness or establish
the required renderer reproducibility claim. Preserve old corpus and approvals.
No expected-hash update, identity relaxation or auto-rebaseline. Depending on
cause, separately reviewed Specs/Design/migration may be needed; not authorized here.

#### Recovery and Sensitive Design assessment

| Threat / failure                                             | Required response                                                                                        |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Wrong/malicious dependency, package drift                    | Supply identity/member checks fail before build; no install/retry from another source                    |
| Floating base tag, wrong architecture or base drift          | Reject; only approved platform digest can execute                                                        |
| Host filesystem/font/Python leakage                          | Mount/environment allowlist rejects; no fallback to local tooling                                        |
| Font substitution, wrong face or missing font                | Hash/metadata/load rejection; no alternative face or host search                                         |
| Missing/changed license member                               | Block provisioning/build acceptance; no notice stripping                                                 |
| Image/runtime/native digest drift                            | Reject before execution; restore only separately reviewed immutable binding                              |
| Stale repertoire                                             | Coverage approval stale; stop for reviewed derivation/coverage                                           |
| Timestamp/randomness/PDF nondeterminism                      | Cold/warm and historical raw checks FAIL; preserve evidence                                              |
| Scratch escape or repository write                           | Fail entire experiment and preserve unexpected state for review                                          |
| Partial generation                                           | Incomplete inventory FAIL; no partial completion                                                         |
| Historical/current identity confusion or mismatch laundering | Separate old/new identities; no baseline updates; Control Tower review                                   |
| Cleanup failure                                              | Report exact owned residual resource; experiment closure incomplete, no broad deletion or hidden success |

Rollback never rewrites inputs/outputs: stop the candidate, retain evidence,
and return to last reviewed image/input identities only when explicitly allowed.
No destructive replacement of unknown concurrent state. Cleanup may target only
verified owned scratch/container/image resources; failed cleanup is reported and
requires bounded recovery, not deletion of shared images/volumes.

SENSITIVE_DESIGN_RESULT: PASS — design controls assessment only.
Runtime/font selection is resolved FOR DESIGN; remaining blockers are explicit
pre-setup supply/image approval, separate implementation authorization and actual
reproduction/compatibility evidence. None is claimed satisfied by this PASS.
No self-approval of Gate 2b; current amendment AWAITING_GATE_2B_REVIEW.
Task 3.2 BLOCKED/UNCHECKED; Tasks 9/29; 3.3–3.10 UNCHECKED.
Phase 4+ NOT_AUTHORIZED; Parent19/23, Task6.1 FAIL/UNCHECKED; no rerun.
Production NOT_AUTHORIZED.

### Review disposition and verification

SENSITIVE_DESIGN_RESULT: PASS (design assessment only).
Recommend human review of this exact amended Design. This is not approval.
Setup blocked until RENDERER_SUPPLY_CLOSURE_NOT_APPROVED is resolved by a
separate exact supply review, final image identity review and experiment authority.
No existing Codex installation is promoted to approved supply.

Required validation: strict OpenSpec change validation, docs:check,
architecture:check, scoped Prettier and scoped git diff --check.
Actual results: pnpm exec openspec validate
repository-format-policy-and-baseline-remediation --strict --no-interactive
exit 0 (valid); pnpm docs:check exit 0 (36 documents); pnpm architecture:check
exit 0; scoped Prettier exit 0; scoped git diff --check exit 0.
No runtime tests/typecheck/build/reproduction claimed for this documentary change.
Full path/hash comparison, not Git diff alone, verifies only Design and this
packet changed: both files were pre-existing untracked artifacts.
All Specs/Tasks/check.mjs/check.test.mjs/package/lock/baseline67/ignored45/
Task-3.1 outputs/parent stay unchanged. No canonical Knowledge edits.

REPOSITORY_FORMAT_POLICY_V_FIX_CONCRETE_RENDERER_DESIGN_CHECKPOINT:
AWAITING_CONTROL_TOWER_REVIEW.
Tasks 9/29; Task 3.2 BLOCKED/UNCHECKED; 3.3–3.10 UNCHECKED.
Phase 4+ NOT_AUTHORIZED. Parent19/23; task6.1 FAIL/UNCHECKED.
Production NOT_AUTHORIZED.
