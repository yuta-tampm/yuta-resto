## RAM1–RAM8 — REAL repository anchor and projection mapping amendment

DA4_REPOSITORY_ANCHOR_MAPPING_DESIGN_STATUS: AWAITING_GATE_2B_REVIEW.
SPECS_CHANGE_REQUIRED: NO. R3/R10 retain mandatory fail-closed validation;
R11 retains deterministic logical evidence and secret safety. Specs Non-goals
leave representation and topology to Design. This refines DA1/DA4/GTA2/LCN3,
not graph semantics, source admission, helper policy or implementation approval.
Earlier approval/status text remains historical. No current authority is issued.

### RAM1 — Preserved DA4 obligations and resolved ambiguity

DA4 retains exactly its 26 named fields, exact canonical PRE/POST equality,
independent validation of BOTH observations against the SAME fixed policy,
material HEAD/raw index/source/config/manifest/admission/runtime bindings,
containment and exact sorted source inventory. Dynamic PID/timing/trace/Job
evidence is separately validated, never equated with stable-state authority.
Bounded bracketing is not atomic snapshot protection or proof against every
transient change-and-revert. LC2 unbound/reparse/overlap failures remain mandatory.

Previously undefined: what ownership means, what repositoryAnchorIdentity hashes,
and how a secret-free consumer projection relates to the original worktree.
The existing producer repositoryAnchor object has only root, gitDir, commonDir,
indexPath, configs. It is HOST_LOCATOR_OBSERVATION, not approved logical identity.
Its schema and raw evidence remain unchanged; do not insert new fields into it.

### RAM2 — Three layers and exact ownership meaning

1. Host observation: root/gitDir/commonDir/indexPath are stable observations
   within a capture bracket, checked against separately approved host binding.
   They remain provenance locators, NOT portable graph-semantic identities.
   configs retain exact existing raw-byte identities; PID/timing/temp evidence
   paths remain dynamic/audit-only. Do not demote config or index byte drift.
2. Logical ownership: independently reviewed repositoryKey identifies one
   repository authority, not a pathname, remote URL, current HEAD, content hash
   or consumer assertion. Assign it through human review, not capture output.
   Ownership means the approved repository/worktree/Git/index relation plus
   separately approved tracked/source state. It does NOT mean OS account/ACL,
   GitHub account ownership or cryptographic repository-origin proof.
3. Mapping: independently approved logical anchor maps to one consumer target
   /input containing an exact authoritative-file projection. It is not the
   original host directory and never contains the omitted local-config bytes.

V1 supports ONLY STANDALONE_WORKTREE: root and .git must be physical directories;
gitDir and commonDir must both resolve exactly to root/.git; indexPath must be
root/.git/index, a regular single-link file. Verify each path component, exact
case/containment, no reparse/symlink/alias and no environment redirection. These
equalities are an explicit bounded layout rule, not a general Git assumption.
Linked worktrees, .git pointer files, alternate Git/common/index locations,
bare repositories and unsupported layouts FAIL GIT_LAYOUT_REVIEW_REQUIRED.
No linked-worktree support is inferred from this repository's general tooling.

The trusted host verifies layout with the pinned producer/Git contract, checks
raw index/HEAD/records and source closure against independent DA1 stable authority,
then binds that validated evidence to the approved anchor. Matching pathname,
remote URL or repositoryKey alone never proves correct repository ownership.
Native filesystem identifiers may detect alias/race within a bracket; they are
not portable identity fields and confer no authority. Missing safety proof fails.

### RAM3 — Closed authority schemas and noncircular approval

All objects below are closed: missing/unknown fields and unsupported versions
FAIL. SHA identities are lowercase 64-hex, computed using VL5 canonical JSON
(ordinal UTF-16 keys, ordered arrays, compact UTF-8, no BOM/final newline).
No actual artifact or current identity value is created in this amendment.

Logical anchor descriptor has exactly schemaVersion, scopeKind, repositoryKey,
repositoryOwnershipPolicyIdentity. Values: V_LOCK_REAL_REPOSITORY_ANCHOR_V1,
REAL_REPOSITORY, independently assigned lowercase UUID repositoryKey, and the
SHA of the reviewed ownership policy. repositoryAnchorIdentity is SHA-256 of
this descriptor's canonical bytes. The policy is exactly this RAM2 standalone
layout/ownership contract supplied as a separately reviewed immutable policy
document; its exact bytes/hash must accompany future approval. No remote lookup,
OS ownership or linked-layout fallback is part of that policy.

Anchor mapping descriptor has exactly schemaVersion, scopeKind,
repositoryAnchorIdentity, repositoryOwnershipPolicyIdentity, consumerMountTarget,
deliveryMode, readOnly, mappingPolicyIdentity, consumerContractIdentity,
approvalReference. Values: V_LOCK_REAL_REPOSITORY_ANCHOR_MAPPING_V1,
REAL_REPOSITORY, approved anchor digest and matching ownership policy digest,
/input, EXACT_AUTHORITATIVE_FILE_PROJECTION, true, SHA of reviewed RAM4/RAM5
mapping policy, SHA of reviewed guarded-consumer contract, and reference below.
No host locator, HEAD, index hash, target packet hash, aggregate hash, runtime
event hash or secret content is placed in this descriptor. No future hash cycle.

approvalReference is exactly {path, sha256}; path is an exact safe relative path
in the independently supplied read-only authority bundle, not graph input or
caller-controlled root. Its external approval record contains exactly
schemaVersion, decision, scopeKind, mappingBodySha256, repositoryAnchorIdentity;
values V_LOCK_REAL_REPOSITORY_ANCHOR_MAPPING_APPROVAL_V1, APPROVED,
REAL_REPOSITORY, canonical mapping-body SHA excluding approvalReference, and
the same anchor digest. The outer trusted review channel must independently
approve that record's exact SHA; file presence or an embedded APPROVED string
does not grant authority. Final mapping identity hashes the complete descriptor.
No actual record is authored or approved here.

Separate host-binding descriptor has exactly schemaVersion, scopeKind,
repositoryAnchorIdentity, hostIdentity, root, gitDir, commonDir, indexPath;
values V_LOCK_REAL_REPOSITORY_HOST_BINDING_V1, REAL_REPOSITORY, same anchor,
independently reviewed opaque host identifier and exact native absolute locators.
Its exact SHA is approved externally with the intended host/use; no self-approval
field. It is deployment/capture authority, NOT graph input or logical anchor.
One approved host binding per invocation; no searching roots for matching bytes.
An unapproved second host/root cannot inherit the first binding.

### RAM4 — Mapping and delivery ownership

Mapping descriptor owns anchor association, consumer target /input, projection
mode and mandatory read-only requirement. Existing delivery contract owns the
complete mount allowlist, read-only authority/provenance/observation/candidate
mounts, writable owned scratch, network none, forbidden store/socket mounts,
process limits and external isolation. It must agree with mapping; disagreement
fails, neither overrides the other. Do not duplicate a conflicting mount policy.

Host constructs an owned projection from validated tracked/admitted source and
graph input inventory only, after LC/LCN classification and raw identity checks.
No full-tree copy or original-repository bind; no .git content, install-managed
store/node_modules or excluded local-config bytes are delivered as source.
Every omission needs its existing classification; no additional exclusion arises
from this mapping. A graph input requiring forbidden content blocks for review.
Each delivered relative path/type/length/hash must equal approved source/input
evidence; missing/extra/duplicate/alias/reparse members fail. Projection is not
permitted to refresh or normalize source bytes.

Bind exactly one source projection at /input, read-only. The host verifies actual
container configuration before start: exact source/destination allowlist, no
writable alias or second repository mapping, no traversal/substitution, socket,
store, devices or network. Check native physical alias/ancestor relations, not
string equality alone. Scratch is disjoint from all protected paths. Temp
projection locators may vary between invocations; ownership and inventory checks
must independently pass. They cannot redirect the original repository binding.

Consumer receives mapping, independent approvals/policies, DA1 packets/aggregate,
host-binding validation evidence and exact projected inventory as separate
read-only non-secret inputs. It verifies approvals, scopes, hashes, identity
relations, /input and delivered inventory; parent/leaf path checks prohibit
consumer-side symlink escape. The trusted outer launcher attests actual mount
configuration with correlated launch evidence; consumer JSON cannot prove kernel
read-only/no-alias properties by itself. Missing external enforcement evidence
blocks validation; consumer output never creates mapping authority.

### RAM5 — DA1/GTA/producer/consumer and stable-state binding

Keep DA1's exact 18 top-level fields. REAL scope is a closed object with exactly
kind, target, packageName, consumerRoot, repositoryAnchorIdentity,
graphScopeIdentity; kind REAL_REPOSITORY, exact target/package, /input, approved
RAM3 anchor and GTA2 graph-scope digest. No synthetic fixture-definition fallback.
GTA2 graph-scope descriptor binds final anchorMappingIdentity and the reviewed
mapping/ownership/consumer contract identities plus LCN policy inventory. It
does not contain target/aggregate hashes or resolved graph SHA. DA1 and aggregate
must agree with that independently approved descriptor and logical anchor.

receiveFixed resolves independently approved mapping, host binding and graph
scope BEFORE accepting actual provenance. Rehash all supplied policies/schemas;
reject missing/unknown fields, wrong scope/anchor/consumer, stale approval and
actual-output-as-expected. A caller-supplied digest alone does not prove review.
No new DA1 field or future PID/timing/evidence SHA is needed.

Producer observations are first validated against host binding and RAM2 layout,
then against approved DA1 HEAD/index/tracked/source state. In REAL DA4 projection,
repositoryAnchorIdentity is the RAM3 logical descriptor digest, NOT a hash of
producer locator object. scopeIdentity is SHA of canonical
{scope, anchorMappingIdentity, hostBindingIdentity}; hostBindingIdentity remains
material to this execution comparison but is excluded from VL4 graph semantics.
The other 24 DA4 fields retain their existing meanings; index/config raw identity
checks are not weakened. Source/graph/LCN/target binding validation remains
mandatory through graphScopeIdentity and existing closure obligations.

PRE and POST each validate the same independent anchor/mapping/host/fixed
authorities and dynamic policies; compare all 26 DA4 fields exactly. Original
host root/Git/index locator change within a bracket fails. Moving a checkout
requires separately reviewed new host binding and any affected fixed-state
binding, but need not change logical anchor/mapping or VL4 graph identity when
all graph-semantic inputs are unchanged. PID/timing/evidence/scratch locator
differences alone are not material; wrong ownership or delivery still fails.

### RAM6 — Approval dependency order

REAL_AUTHORITY_DEPENDENCY_ORDER:

1. Approve this Design/schema through Gate 2b; separately authorize implementation.
2. Implement and test with independently authored controlled REAL fixture anchors;
   review exact candidate and run separately authorized full regression as required.
3. Authorized read-only actual host observation and candidate anchor/host-binding/
   mapping preparation; no actual smoke or expected-from-consumer construction.
4. Control Tower independently approves exact logical anchor, policies, host
   binding and mapping. Approval authenticates intended repository use, not Git
   remote or clone-origin ownership inferred from bytes.
5. Prepare per-target fixed/stable candidates and graph-input scope against that
   approved mapping; independent exact per-target and graph-scope approval.
6. Prepare aggregate candidate; independently approve exact aggregate and its
   relations. All REAL fixed/stable bindings must now be established and current.
7. Obtain explicit actual REAL smoke authorization and execute with PRE/POST;
   only afterward proceed toward separately authorized resolved graph computation.

Mapping has no target hash dependency and is approved before per-target capture;
targets require no successful actual smoke to be reviewed. Thus there is no
target-approval/smoke cycle. Read-only observation is not a guarded REAL smoke.
Design/schema approval never approves actual repository values. Controlled REAL
fixtures cannot become YUTA authority; synthetic scope remains separate.
ACTUAL_REAL_SMOKE: DEFERRED_BY_AUTHORITY_SEQUENCE until approved
REAL_REPOSITORY_ANCHOR_MAPPING_IDENTITY AND all DA3/DA5 fixed/stable authorities
exist, applicable regressions pass, and separate execution authorization exists.

### RAM7 — Fail-closed categories and future fixture obligations

| Condition                                                     | Code                                |
| ------------------------------------------------------------- | ----------------------------------- |
| Missing/unapproved/stale anchor or mapping authority          | REPOSITORY_ANCHOR_AUTHORITY_MISSING |
| Wrong logical repository or approved source-state association | REPOSITORY_ANCHOR_MISMATCH          |
| Wrong root/Git/common-dir relation                            | REPOSITORY_OWNERSHIP_MISMATCH       |
| Wrong index relation                                          | INDEX_OWNERSHIP_MISMATCH            |
| Unsupported linked/bare/alternate layout                      | GIT_LAYOUT_REVIEW_REQUIRED          |
| Mapping/consumer target/contract mismatch                     | HOST_CONSUMER_MAPPING_MISMATCH      |
| Repository mount writable                                     | CONSUMER_MOUNT_NOT_READ_ONLY        |
| Alternate writable physical alias                             | UNAPPROVED_WRITABLE_ALIAS           |
| Synthetic/REAL/foreign scope mismatch                         | ANCHOR_SCOPE_MISMATCH               |
| Observation or consumer output promoted to authority          | SELF_BOUND_REPOSITORY_ANCHOR        |
| Missing/unknown schema fields                                 | REPOSITORY_ANCHOR_SCHEMA_MISMATCH   |
| Host binding changes within run                               | REPOSITORY_HOST_BINDING_DRIFT       |
| Stable approved identity changes                              | STABLE_STATE_DRIFT                  |

Retain more specific LC/LCN/GTA/DA parser, containment, inventory, helper and
runtime errors; no generic mapping PASS may mask them. Unknown input fails.
Future tests must cover every row plus valid standalone mapping, linked-layout
denial, correct repo at wrong mount, second root/repository reuse, missing
external enforcement, source-projection mismatch, secret-free copy/read guards,
host relocation with independently approved binding (same logical identity),
unapproved relocation, distinct valid dynamic observations and stable drift.
Tests are obligations, not executed evidence in this amendment.

### RAM8 — Preserved checkpoint

Current partial harness 89e981088e5448a08330318acf93ed78dd7ac4fbb00370938eb729b174c19ad9
and inventory 0067e06f030e6c336293ff1aee05d16457585a5096622df26c9576c48cb50c67
remain unchanged. 212 correct / 0 incorrect / 0 skipped applies only to executed
suites; missing suites are not PASS. No implementation gap becomes IMPLEMENTED.
Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29; 3.4–3.10 and Phase 4+ NOT_AUTHORIZED.
Parent 19/23; parent Task 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.

## LCN1–LCN5 — Exact-path local-config non-authority amendment

SECRET_LOCAL_CONFIG_DISPOSITION_DESIGN_STATUS: AWAITING_GATE_2B_REVIEW.
SPECS_CHANGE_REQUIRED: NO. R1/R3/R10 retain classification and mandatory
validation; R11 forbids secret disclosure. Specs do not require non-material
machine-local configuration bytes to become source authority. This adds
content-free alternate disposition validation, not an ignored-file exemption.
LCN refines LC2 and GTA4 only as stated; DA1's 18 fields remain unchanged.
Earlier approval/status/evidence sections remain historical.

### LCN1 — Meaning and closed record

Mechanism: EXPLICIT_EXACT_PATH_LOCAL_CONFIG_NON_AUTHORITY_DISPOSITION.
Disposition kind: SECRET_OR_LOCAL_CONFIG_NON_AUTHORITY.
Closed record schema has exactly schemaVersion, repositoryRelativePath,
dispositionKind, reasonClass, expectedFileKind, existenceRequired,
materialityClass and approvalReference.

Values: schemaVersion = vlock-local-config-disposition-v1;
dispositionKind = SECRET_OR_LOCAL_CONFIG_NON_AUTHORITY;
reasonClass = RUNTIME_DEVELOPMENT_LOCAL_CONFIGURATION;
expectedFileKind = REGULAR_FILE; existenceRequired = true;
materialityClass = NON_MATERIAL_TO_APPROVED_GRAPH_AND_SOURCE.
repositoryRelativePath is one canonical, exact-case repository-relative path;
no absolute path, traversal, ambiguous normalization, glob or wildcard.
approvalReference is a closed object with path and sha256 referencing a separate
Control Tower approval record. Its SHA identifies non-secret approval bytes,
NEVER the local-config bytes. The approval must bind the exact disposition
fields, repository/target scope and non-materiality basis. No circular self-hash:
approval can embed the record body excluding approvalReference; the final record
references the external approval. Record existence/hash alone does not grant
human approval. Missing, stale or wrong-scope approval fails closed.

Canonicalize the non-secret record using VL5 ordinal UTF-16 keys, compact UTF-8,
no BOM/newline. Unknown/missing fields fail. No secret values, raw secret SHA,
PID/timing, host absolute locators, file size, mtime or machine-secret metadata
enter disposition identity. Metadata size may be diagnostic only, not authority.
No authorization to read source from this path, mutate, stage or delete it.

Only the current candidate path packages/db-cloud/.env.local is proposed.
Patterns _.env.local, **/.env.local, packages/db-cloud/** and .env_ are invalid.
Another package's same basename requires a separate explicit reviewed record.

### LCN2 — Content-free verification and invalidation

Before any content-open/hash/copy operation, resolve classification by exact
path. Verify containment and exact case, lstat each parent and leaf, reject
symlinks/reparse points, unsupported type and hardlink aliases. Existence is
required for this record. Do not follow links or use realpath to excuse them.
Inspect non-secret repository references and approved loader/graph contracts,
not local-config bytes. Ignored YES/NO is informational, not a prerequisite or
proof. A non-ignored exact path needs the same explicit approval.

Bind the reviewed materiality-evidence inventory of non-secret manifests,
loader code, graph/discovery/consumer source and settings contracts by exact
path/hash in the external approval. Recheck those bindings; changes block until
review, even without a detected new loader. Search absence alone is insufficient
when an unknown loader or execution route can influence graph inputs.

Dependence on dependency resolution, lock generation, workspace/importer/project
identity, catalog/override/patch semantics, local resolution, effective settings
or source identity fails LOCAL_CONFIG_DISPOSITION_MATERIALITY_CONFLICT.
Unresolved proof requiring secret access stops
SECRET_CONTENT_DEPENDENCY_REVIEW_REQUIRED. Never invent secret hashing/redaction.

Other fail-closed codes: LOCAL_CONFIG_DISPOSITION_NOT_APPROVED,
LOCAL_CONFIG_DISPOSITION_SCHEMA_INVALID, LOCAL_CONFIG_DISPOSITION_PATH_MISMATCH,
LOCAL_CONFIG_DISPOSITION_METADATA_MISMATCH and LOCAL_CONFIG_DISPOSITION_DRIFT.
Keep AUTHORITATIVE_REPARSE and existing detailed source failures.

### LCN3 — Closure and policy binding

Deterministic classification first rejects unsafe/ambiguous paths and conflicting
claims. Tracked source or explicitly admitted authoritative input cannot overlap
a non-authority disposition; report materiality conflict, never drop that source.
Then classify TRACKED_AUTHORITATIVE_SOURCE and EXPLICITLY_ADMITTED_LOCAL_INPUT;
retain existing INSTALL_MANAGED_NON_AUTHORITY rules and overlap checks.
Only an exact valid externally approved record permits
EXPLICIT_EXACT_PATH_LOCAL_CONFIG_NON_AUTHORITY. Every other non-install member
remains UNBOUND_SOURCE_MEMBER. No directory-prefix/basename/extension inheritance.
Ignore status alone never provides a branch to acceptance.

Disposition metadata is a mandatory policy/evidence input, not an LC4 member,
DA1 source member, explicit admitted source input or graph raw-content input.
Bind an exact disposition-record inventory plus approvals/materiality references
through the existing independently reviewed graphScopeIdentity descriptor
(GTA2), outside the seven-field VL4 resolved-graph projection. Per-target
orchestration must validate the applicable inventory before creating/accepting
its candidate and carry that policy binding into aggregate evidence; no new DA1
field, unbound caller exclusion list or optional alternate check.
Target source bytes still require exact LC4 completeness after valid
classification. The config contributes no raw bytes or raw SHA to target closure.

Do not pass local-config bytes to the Linux consumer via full-tree copy/mount.
Future delivery must separate metadata-only host inspection from authoritative
file delivery, bind omitted exact paths through the approved policy and verify
the delivered source inventory. If the existing delivery cannot enforce this,
block for bounded delivery review; read-only mounting alone does not prevent
secret reads. No implementation/delivery change is authorized in this amendment.

### LCN4 — PRE/POST and current candidate

PRE/POST require the same approved record inventory, approvals, materiality
evidence bindings, exact path/existence/type classification and policy identity.
Revalidate metadata without reading contents; material changes fail
LOCAL_CONFIG_DISPOSITION_DRIFT. Secret content/size/mtime equality is not required
for explicitly non-authoritative bytes. This is bounded bracketing, not an
atomic snapshot guarantee.

Current intended candidate: packages/db-cloud/.env.local;
SECRET_OR_LOCAL_CONFIG_NON_AUTHORITY; runtime/development local configuration;
non-material under inspected graph/source contract; ignore status not authority.
Secret contents NOT_READ / NOT_EMITTED / NOT_HASHED.
Status: CANDIDATE_AWAITING_CONTROL_TOWER_APPROVAL.
No approvalReference is fabricated here. Control Tower classification acceptance
does not itself approve the new implementation mechanism or exact record use.

### LCN5 — Future proof and stop

Future tests must prove: exact approved path accepted; other-package basename,
\*.env.local, packages/db-cloud/\*\*, missing approval and unknown schema rejected;
ignored unknown/neighbor source remains UNBOUND_SOURCE_MEMBER; non-ignored exact
path requires approval; wrong kind, missing path, reparse/hardlink, materiality
conflict, stale evidence and PRE/POST policy drift fail. Instrument content-read,
hash, copy and logging paths to prove no secret read/emission/raw-hash authority;
verify Linux delivery cannot expose the excluded secret. No assertion-only
zero counter replaces execution evidence.

FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES.
Historical 94+live PASS remains valid only for its reviewed implementation.
Real discovery BLOCKED; Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29.
3.4–3.10 and Phase 4+ NOT_AUTHORIZED; parent 19/23 and 6.1 FAIL / UNCHECKED.
Graph SHA NOT_COMPUTED. Pointage integration NOT_RUN:
DISPOSABLE_ENVIRONMENT_NOT_AVAILABLE. Production NOT_AUTHORIZED.

## GTA1–GTA7 — Per-target graph authority-set amendment

Previous dynamic-observation amendment: APPROVED_HISTORICALLY.
Current REAL_REPOSITORY target-authority-set amendment: AWAITING_GATE_2B_REVIEW.
Task-3.3 TIC amendment: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO. R3/R10 require complete fail-closed validation and
R11 deterministic evidence; neither prescribes authority packaging. Specs
Non-goals explicitly leave representation/topology to Design. This section
refines DA1, LC1 and VL4 without changing DA1's exact 18 top-level fields.
Prior review/status text below remains historical evidence.

### GTA1 — Input types and required-target discovery

Selected model: PER_TARGET_AUTHORITY_SET. Each directory has one exact DA1
authority; the separate V_LOCK_GRAPH_TARGET_AUTHORITY_SET_V1 aggregates bindings,
not permissions. No repository-wide authority replaces per-target authority.

| Input type                  | Authority                                                                      |
| --------------------------- | ------------------------------------------------------------------------------ |
| WORKSPACE_DIRECTORY_TARGET  | Exact per-target DA1 and LC1–LC4 current-byte closure                          |
| LINK_DIRECTORY_TARGET       | Exact per-target DA1 after approved importer-relative resolution               |
| FILE_DIRECTORY_TARGET       | Exact per-target DA1 only for supported directory semantics                    |
| LOCAL_TARBALL               | Graph input closure: exact raw length/hash and native integrity                |
| PATCH_FILE                  | Graph input closure: exact raw length/hash plus native patch identity/settings |
| PROJECT / IMPORTER MANIFEST | Graph input closure: exact manifest path, bytes and importer identity          |
| WORKSPACE CONFIG            | Graph input closure: exact declarative config bytes and native interpretation  |
| EFFECTIVE SETTINGS          | Graph input closure: complete VL2 values and source bindings                   |

REQUIRED_GRAPH_TARGET_SET_MODEL: read-only discovery from the reviewed raw lock,
independent selected workspace/project inventory and inert manifests using the
approved native file/link/workspace semantics. Account for every applicable local
directory reference, including references in the complete graph, without host
platform filtering. A workspace inventory identifies candidates, not authority
to expand all package directories. A project manifest alone does not require its
whole directory closure unless approved graph semantics require that target.
No registry resolution, install, scripts, store lookup or invented targets.
Unsupported or ambiguous resolution blocks; it cannot silently drop a target.

Resolve paths relative to their owning importer under existing containment and
case/alias rules. Record all source relations to each exact target; repeated
relations to the same target are collected, not separate target authorities.
Discovery produces candidate membership only. Tracking, discovery or existence
never approves bytes. Relation/source records must be independently cross-checked
against the graph inputs, not copied from the supplied authority set.

### GTA2 — Closed aggregate schema and identity

Proposed schemaVersion is exactly V_LOCK_GRAPH_TARGET_AUTHORITY_SET_V1.
The closed aggregate contains exactly schemaVersion, scopeKind,
repositoryAnchorIdentity, graphScopeIdentity and targetAuthorities.
scopeKind is exactly REAL_REPOSITORY or OWNED_SYNTHETIC_REPOSITORY.
Missing/unknown fields, unknown scope, malformed identities and noncanonical
encoding fail closed. No wildcard, default, inheritance or future event hashes.

Each targetAuthorities entry contains exactly targetRelativePath,
packageIdentity, targetType, fixedAuthoritySchemaVersion, fixedAuthoritySha256,
scopeKind and requiredRelations. fixedAuthoritySchemaVersion is exactly
vlock-fixed-expectation-v2. targetType is one of the three directory types in
GTA1. packageIdentity is exactly name/version from the bound manifest, or explicit
null only for an independently admitted non-package directory under LC4.
scopeKind must equal both aggregate and referenced DA1 scope.

requiredRelations is a nonempty array of closed records: sourcePath,
sourceSha256, sourcePointer and relationType. sourcePath identifies the exact
repository-relative lock/manifest/config source; sourcePointer is an exact JSON
Pointer into its approved parsed representation; relationType is the applicable
GTA1 directory type. Raw source SHA binds the pointer to reviewed input bytes.
Every actual required relation must occur exactly once. If multiple supported
relation types resolve to one target, targetType uses the fixed classification
precedence WORKSPACE_DIRECTORY_TARGET, LINK_DIRECTORY_TARGET,
FILE_DIRECTORY_TARGET; all relation types still receive their native checks.
This representational precedence grants no additional authority.

repositoryAnchorIdentity is the DA4 repositoryAnchorIdentity digest, including
approved worktree/Git/index ownership and read-only mapping. All referenced
packets must bind the same anchor and actual repository mapping.
graphScopeIdentity references an independently reviewed graph-input scope
descriptor binding raw lock, exact project selection, manifests, workspace
configuration, effective settings and admitted raw inputs plus discovery
contract identity. It is NOT a resolved graph SHA. That descriptor must not
contain this aggregate's hash or the future resolved graph hash; no hash cycle.
Per-target source closures remain separately bound by the packets.

Conceptual GRAPH_TARGET_AUTHORITY_SET_SHA256 = SHA-256 of canonical aggregate
bytes. Every SHA is lowercase 64-hex. Use VL5 recursive ordinal UTF-16 object-key
ordering, target entries sorted by exact targetRelativePath, compact UTF-8,
no BOM/final newline and no Unicode/path normalization. Relations sort by
sourcePath, sourcePointer, relationType, then sourceSha256 using ordinal UTF-16.
Reject duplicate targets/relations, aliases and ambiguous duplicate package
identity at different paths; do not deduplicate malformed authority input.
No secondary target ordering rescues a duplicate path. Compute no current
repository aggregate or authority-set SHA in this documentary turn.

### GTA3 — Completeness, isolation and failures

Before graph computation, independently discovered
REQUIRED_LOCAL_DIRECTORY_TARGET_SET must exactly equal APPROVED_TARGET_AUTHORITY_SET,
including package/type/scope and all required relations, not only path count.
Read each referenced packet, validate exact DA1 schema and bytes against its
approved hash and independent approval, then validate its exact target and
LC closure. A digest or an aggregate reference does not prove approval or PASS.

| Failure                                           | Code                                    |
| ------------------------------------------------- | --------------------------------------- |
| Missing required authority                        | GRAPH_TARGET_AUTHORITY_MISSING          |
| Extra authority                                   | GRAPH_TARGET_AUTHORITY_EXTRA            |
| Duplicate target/authority/relation               | GRAPH_TARGET_AUTHORITY_DUPLICATE        |
| Wrong target path                                 | GRAPH_TARGET_PATH_MISMATCH              |
| Wrong package identity                            | GRAPH_TARGET_PACKAGE_MISMATCH           |
| Wrong directory type/relation                     | GRAPH_TARGET_TYPE_MISMATCH              |
| Missing/extra/source-mismatched relation          | GRAPH_TARGET_RELATION_MISMATCH          |
| Wrong or malformed schema                         | GRAPH_TARGET_AUTHORITY_SCHEMA_MISMATCH  |
| Packet bytes differ from approved SHA             | GRAPH_TARGET_AUTHORITY_SHA_MISMATCH     |
| Synthetic/real or packet/aggregate scope mismatch | GRAPH_TARGET_SCOPE_MISMATCH             |
| Foreign repository/worktree anchor                | GRAPH_TARGET_ANCHOR_MISMATCH            |
| Unapproved/stale aggregate or graph input scope   | GRAPH_TARGET_AUTHORITY_SET_NOT_APPROVED |
| Path/package alias ambiguity                      | GRAPH_TARGET_ALIAS_AMBIGUITY            |
| Material PRE/POST set drift                       | GRAPH_TARGET_SET_DRIFT                  |

All are blocking failures; retain lower-level DA/LC/native causes.
packages/auth authority cannot authorize packages/contracts. Parent-directory
or repository-root authority never authorizes another target implicitly.
A referenced descendant requires its own exact packet even if bytes overlap
a parent's closure. No prefix matching, wildcard package, inherited scope,
synthetic fallback or automatic rebaseline. The aggregate cannot hide
UNBOUND_SOURCE_MEMBER or convert an invalid per-target result into PASS.
Unresolved Pointage/untracked members retain current LC2 treatment without
admission, removal, exclusion or disposition by this amendment.

### GTA4 — Separate graph-wide input closure

Keep root package.json, workspace configuration, project/importer manifests,
catalogs, overrides and all complete effective settings in the VL4/VL5 graph
input closure with exact raw source identities and approved native interpretation.
Do not copy graph-wide inputs into every DA1 packet; a target's own manifest
remains its required LC4 member, cross-checked against the graph-wide copy.
Shared paths must have the same approved byte identity wherever referenced.

Patch/tarball/other separately admitted raw inputs retain their own role,
owner/approval, exact path/length/raw hash and applicable native identities.
They are not forced into directory packets and cannot be omitted because
target-set equality passes. Graph input completeness and directory-set equality
are conjunctive obligations. Unsupported or secret-dependent inputs block under
existing policy rather than exposing raw secrets or inventing admissions.

### GTA5 — Approval lifecycle and drift

Required order: read-only required-target discovery -> per-target candidate
capture -> independent review/approval as required -> approved target packets
-> deterministic aggregate candidate -> independent Control Tower approval of
exact APPROVED_GRAPH_TARGET_AUTHORITY_SET_SHA256 -> graph candidate computation.
Before approval the aggregate is CANDIDATE_AWAITING_CONTROL_TOWER_APPROVAL.
All packets existing or passing individually is insufficient. The external
approval binds exact aggregate bytes, graph scope and intended repository use;
it is not embedded self-approval and authorizes no later real V-LOCK.

PRE/POST independently rediscover and compare required inventory, paths,
package identities, relation/type bindings, packet hashes, repository anchor,
graphScopeIdentity and aggregate canonical bytes. Revalidate all graph-wide
inputs and each DA4 stable projection. Any material difference fails
GRAPH_TARGET_SET_DRIFT (retain more specific source/policy failures).
DA2/DA3 dynamic evidence remains separately validated at PRE and POST against
the same fixed policy, never required to have identical PID/timing hashes.
Bounded bracketing is not an atomic snapshot guarantee.

### GTA6 — Future implementation and revalidation

Future separately authorized sequence:

1. Implement REAL_REPOSITORY branch.
2. Discover required targets read-only.
3. Prepare per-target candidates.
4. Obtain Control Tower approval of target material as required.
5. Build aggregate candidate.
6. Obtain exact aggregate SHA approval.
7. Run required synthetic/regression revalidation.
8. Restart graph computation from PRECHECK.
9. Compute candidate resolved graph SHA.
10. Obtain independent graph review.
11. Only later, separately authorized real V-LOCK.

FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES.
Existing 94/94 synthetic PASS and live producer PASS remain evidence for their
then-reviewed candidate, not future implementation bytes. Producer, guard,
collector, runner and native writer stay unchanged in this documentary turn.
No fsync stub, repository source mutation or runtime permission follows.

### GTA7 — Checkpoint

Design assessment is not Gate 2b approval. Current amendment:
AWAITING_GATE_2B_REVIEW; TIC: AWAITING_CONTROL_TOWER_REVIEW.
Graph candidate BLOCKED; Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29.
Tasks 3.4–3.10 and Phase 4+ NOT_AUTHORIZED; parent 19/23,
parent Task 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.
No real authority packets, aggregate value, graph SHA or implementation created.

## DA1–DA7 — Stable authority and dynamic observation amendment

Previous tracked-inventory/provenance authority: APPROVED_HISTORICALLY.
Current amendment: AWAITING_GATE_2B_REVIEW. TIC: AWAITING_CONTROL_TOWER_REVIEW.
This section supersedes only whole-observation expected-hash equality and
whole-envelope PRE/POST equality for future implementation. Earlier text and
execution records remain historical, not contradictory new approval.
SPECS_CHANGE_REQUIRED: NO. R11 requires deterministic logical evidence, not
pre-approval of future process-event bytes; R3/R10 fail-closed obligations remain.

### DA1 — Fixed expectation authority schema

Proposed closed schema `vlock-fixed-expectation-v2` has exactly: schemaVersion,
producerIdentitySha256, gitExecutableSha256, gitVersion,
gitAdapterIdentitySha256, configAllowlistSha256,
helperObservationPolicySha256, helperAdmissionPolicySha256,
runtimeClosurePolicySha256, trace2ParserIdentitySha256,
strictJsonParserIdentitySha256, jobLauncherIdentitySha256,
consumerIdentitySha256, observationSchemaVersion, stableStateSchemaVersion,
deliveryContractSha256, scope, approvedState. Unknown/missing fields fail closed.
SHA fields are lowercase 64-hex SHA-256. Versions are exact supported identifiers,
not ranges. All referenced policy documents must be supplied and rehashed; a
digest without its validated policy is insufficient. Canonical encoding uses
ordinal UTF-16 sorted object keys, ordered arrays, compact UTF-8, no BOM/newline.

scope is a closed tagged union: REAL_REPOSITORY binds exact approved repository,
worktree and host-to-read-only-mount mapping plus target relative path/package;
OWNED_SYNTHETIC_REPOSITORY binds reviewed fixture-definition SHA, target relative
path/package and owned-root/delivery rules. No cross-scope fallback. Host native
locators are provenance/mapping, never portable semantic source identity.
approvedState is an exact repository-state binding for REAL_REPOSITORY, or a
reviewed deterministic fixture-state definition for OWNED_SYNTHETIC_REPOSITORY;
neither contains future process events. Synthetic generated root locators must
be independently validated against ownership/mapping rules, not self-approved.

Observation policy binds exact ten-command argv/config model, complete capture,
Job lifecycle rules and parser identities. Admission policy binds exact Git
path/bytes/hash/version and conhost path/bytes/hash/version, multiplicity one,
SAME_EXCLUSIVE_INVOCATION_JOB and ONLY_NON_ROOT_PROCESS_IN_GIT_JOB. It grants no
immediate OS-parent assertion. Unexpected, network and shell helpers are DENY.
Job launcher identity binds C# and entrypoint bytes, including no post-create
assignment fallback. Runtime policy enumerates exact required runtime binaries,
libraries and source identities; filename/version alone never admits a binary.

### DA2 — Per-run observations and identity separation

Closed observation schema `vlock-run-observation-v2` contains schemaVersion,
fixedAuthoritySha256, phase (PRE or POST), commandObservations,
runtimeObservations and artifactInventory. Each command observation binds exact
command ID/argv, process IDs, Job accounting/membership/lifecycle records,
observed executable identities, raw stdout/stderr/Trace2 identities and complete
capture/exit result under the policy-defined exact existing record shapes.
Runtime observations bind actual required-file identities. Artifact inventory
binds exact owned temporary paths, lengths and raw hashes. Duplicate/missing
commands or artifacts, unknown shapes and incomplete observations fail closed.
Opaque handle values, if recorded, are diagnostic only, never portable identity
or authority. No raw credentials/config secrets are included.

PID, timing, Trace2 events, Job accounting values, temporary names and event
sequence hashes are PER_RUN_OBSERVATION_EVIDENCE. They need not equal future
pre-known hashes. HELPER_OBSERVATION_POLICY_SHA256 identifies stable rules;
HELPER_OBSERVATION_EVIDENCE_SHA256 identifies a particular observation. Likewise
runtime policy versus runtime observation, parser policy versus Trace2 bytes,
and Job lifecycle policy versus Job evidence are separate identities.

### DA3 — Validate observations, never self-authorize

Resolve independently approved fixed authority first. Validate actual identities,
command completeness, conhost multiplicity/relation, Job-at-creation, membership
before resume, no post-create assignment, complete observed process counts and
active=0 at end. Reject unexpected/network/shell helpers. Parse raw Trace2 with
the exact parser, correlate invocation/PID/argv/exit and require full lifecycle.
Trace2 is supplementary; Job observations establish process lifecycle. Validate
runtime identity and delivery ownership/read-only enforcement independently.
Missing or unobservable required evidence fails; counters alone are not proof.

Only policy-valid observations become accepted evidence. Raw bytes may be hashed
at capture for integrity, including failed evidence; that never constitutes
acceptance. Forbidden: actual SHA X becomes expected SHA X and thereby PASS.
Required: independently bound policy -> actual validation -> result -> retained
evidence identity. No digest-only replacement of behavioral observation checks.

### DA4 — Exact stable-state projection

V_LOCK_STABLE_STATE_PROJECTION, schema `vlock-stable-state-v2`, contains exactly:
schemaVersion, fixedAuthoritySha256, repositoryAnchorIdentity, worktreeIdentity,
headIdentity, indexIdentity, trackedInventorySha256, trackedMemberCount,
producerIdentitySha256, gitExecutableSha256, gitAdapterIdentitySha256,
configAllowlistSha256, configClosureSha256, helperObservationPolicySha256,
helperAdmissionPolicySha256, runtimeClosurePolicySha256,
actualRuntimeClosureSha256, deliveryContractSha256, consumerIdentitySha256,
observationSchemaVersion, sourceMembersSha256, admittedInputsSha256,
packageManifestSha256, localSourceClosureSha256 and scopeIdentity.

Repository anchor binds root/Git/common-dir/index ownership and mapping.
indexIdentity retains exact raw index bytes/length/hash; HEAD remains material.
worktree/sourceMembers bind exact sorted relative paths, regular-file type,
current byte lengths/hashes, containment and admission inventory. Manifest,
explicit input, source closure, config bytes and actual required runtime bytes
remain stable. node_modules remains excluded only under existing LC2 rules;
unbound files, reparse/aliases and authoritative overlap remain failures.

PRE and POST projections must match canonical bytes exactly. No auto-rebaseline.
PRE and POST observations must EACH validate against the SAME fixed policy.
PID/timing difference alone is not state drift. Invalid dynamic evidence still
fails even when projections match. New raw index/source/config/runtime bytes
are not classified dynamic to obtain PASS. This remains bounded bracketing,
not atomic snapshot or protection against every transient change-and-revert.

### DA5 — Synthetic, repository and historical authority

Synthetic fixed authority comes from reviewed candidate/fixture bytes before
execution, never observedExpected(actual). Deterministic fixture content and
membership expectations are independently defined. Dynamic OS/process metadata
is verified by policy; owned-root mapping is validated separately. Actual host
producer PRE/POST, real Job/helper path, read-only actual and separate authority
delivery, and guarded consumer/source closure remain mandatory. No Git runs
inside the guarded Linux workload. No repository graph authority is generated.

Real repository use requires independently approved stable state and policy;
dynamic validated observations cannot broaden approved repository or scope.
Historical packet bbb358026e55f6ef2407a2a0a491530be534a0b957caa397fb450f13c09d4c12
is APPROVED_HISTORICALLY and SUPERSEDED_FOR_NEW_LIVE_GATE_CONTRACT, not silently
upgraded to v2. Historical packages/auth validation remains PASS under its then
approved contract. Historical full synthetic inventory failure remains FAIL.

### DA6 — Evidence and failures

Closed execution evidence includes schemaVersion, fixedAuthoritySha256,
helperObservationPolicySha256, helperObservationEvidenceSha256,
Trace2EvidenceSha256, JobObservationEvidenceSha256,
runtimeObservationEvidenceSha256, stablePreProjectionSha256,
stablePostProjectionSha256, preObservationValidation,
postObservationValidation, validationResult and failureCodes. Observation
identities are ordered PRE/POST pairs; exact referenced artifacts are retained.
Logical result/projection is deterministic; raw per-run evidence is not claimed
byte-identical across runs. No circular approval or embedded self-hash.

Reuse SELF_BOUND_EXPECTATION_NOT_AUTHORIZED, UNEXPECTED_GIT_HELPER_PROCESS,
TRACE_INCOMPLETE and existing strict parser errors. Proposed v2 codes:
FIXED_AUTHORITY_MISMATCH (policy/schema/scope binding),
DYNAMIC_OBSERVATION_POLICY_MISMATCH (invalid observation),
HELPER_IDENTITY_MISMATCH, HELPER_MULTIPLICITY_MISMATCH, JOB_RELATION_MISMATCH,
NETWORK_HELPER_DETECTED, SHELL_INTERMEDIARY_DETECTED and STABLE_STATE_DRIFT.
Keep original detailed causes; do not rewrite historical error codes. Every
missing, malformed, skipped or unresolved mandatory check prevents PASS.

### DA7 — Gate and implementation boundary

Future full PASS requires 94/94 logical cases, zero incorrect/skipped, AND a
mandatory live integration PASS with all producer/delivery/observation/source
and write-isolation assertions. Narrow approved faults remain separately bound
prerequisites. T4 6/6 evidence remains
c59abff96c8f871d7685da148229b1e554d0b20dc70e57f55bfb26009506c675.
FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES.
No code, candidate, collector, guard, runner or comparison changes here.
Task 3.3 BLOCKED / UNCHECKED; Tasks 10/29; 3.4–3.10 and Phase 4+ NOT_AUTHORIZED;
parent 19/23, 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.

## V-LOCK tracked-inventory provenance amendment

Previous local-source-closure amendment: APPROVED_HISTORICALLY. Current
tracked-inventory provenance amendment: AWAITING_GATE_2B_REVIEW. Task-3.3 TIC
producer amendment: AWAITING_CONTROL_TOWER_REVIEW. SPECS_CHANGE_REQUIRED: NO.
Control Tower approved this documentary architecture, not producer execution,
implementation, a Git executable release, inventory or graph identity.

### GI1 — Producer ownership and trust

Adopt HOST_SIDE_READ_ONLY_GIT_OUTPUT_ADAPTER with a
VERSION_BOUND_FAIL_CLOSED_GIT_OUTPUT_ADAPTER. EXISTING_TRACKED_INVENTORY_PRODUCER:
PARTIAL: scripts/format-policy/check.mjs inventoryRepository() demonstrates
tracked-path discovery and current-worktree byte reads but lacks the required
stage/flag/provenance envelope. Reuse its path-safety/current-byte principles;
do not accept its existing output as sufficient V-LOCK authority.

Owner is V-LOCK outer orchestration, using a separate host-side helper. Proposed
future scratch member is git-inventory-producer.mjs; if later durable placement
is authorized, proposed path is scripts/format-policy/git-inventory-producer.mjs.
Neither file is created/authorized for implementation here. Collector, runner
and guard remain unchanged in this documentary amendment. Any later integration
changes need an exact reviewed path/identity boundary.

Producer may discover repository/worktree/Git-dir anchors, read index metadata
and status/flags, emit scratch evidence, and repeat PRE/POST capture. It must not
add/checkout/reset/update, intentionally refresh/write index, run hooks, fetch,
contact remotes, invoke package managers or write repository artifacts. Guarded
workload never runs Git/child processes and retains network/registry denial and
no pnpm-store use. No binary Git-index parser is introduced.

### GI2 — Tool and environment identity

Bind Git version and exact executable locator/raw SHA-256, actual executable
behind any launcher and required runtime dependencies, producer/parser script
hashes, host runtime identity, exact argv contract and sanitized environment.
Version string alone is insufficient. A discovered executable is a candidate,
not acceptance. Missing executable/dependency identity blocks future execution.

Invoke absolute executable directly with argv, never shell interpolation or
alias lookup. Environment is an allowlist: fixed locale LC_ALL/LANG=C, TZ=UTC,
GIT_OPTIONAL_LOCKS=0, GIT_TERMINAL_PROMPT=0, GIT_CONFIG_NOSYSTEM=1 and an approved
empty global-config source; neutralize inherited GIT_CONFIG_COUNT/PARAMETERS,
GIT_DIR/WORK_TREE/INDEX_FILE/OBJECT_DIRECTORY/ALTERNATE_OBJECT_DIRECTORIES,
GIT_EXTERNAL_DIFF, GIT_SSH/SSH_COMMAND and other unreviewed GIT variables.
Bind required OS/runtime loader variables instead of inheriting arbitrary PATH.
No interactive prompts, pager, color, external diff/textconv or network operation.

Review and bind repository/common/worktree config closure before commands that
inspect files: reject unknown material effects, unsafe include/includeIf chains,
external filter drivers/fsmonitor/hooks, sparse/split-index or alternate object
layouts without separate authority. Never print secret config values. Explicit
command overrides are additional controls, not proof that malicious local
configuration is harmless. Config inspection is read-only and fail-closed;
unresolved configuration provenance prevents producer execution.

### GI3 — Bounded command and parser contract

Each metadata invocation uses the same reviewed absolute executable and prefix:
`--no-pager --no-optional-locks --literal-pathspecs -c color.ui=false
-c core.fsmonitor=false -c core.untrackedCache=false -C <approved-root>`.
Prefix tokens are argv elements, not a shell command. Empty approved hooks path
and environment/config isolation from GI2 are required. No Git alias is called.
The command-contract identity binds these exact operations:

- `--version` separately identifies the executable.
- `rev-parse --show-toplevel`, `rev-parse --absolute-git-dir`,
  `rev-parse --path-format=absolute --git-common-dir`, and
  `rev-parse --path-format=absolute --git-path index` discover anchor/layout.
- `rev-parse --show-object-format` and `rev-parse --verify HEAD` bind object
  format/HEAD. Unsupported format, absent HEAD or ambiguous layout fails closed.
- `ls-files --cached --stage --full-name -z` emits membership/mode/object/stage.
- `ls-files --cached -v --full-name -z` independently exposes tracking tags.
- `ls-files --cached --stage --debug --full-name -z` supplies version-bound
  index flag evidence; never describe --debug as cross-version stable.

No default status is used. Worktree status is derived from index records and
guarded physical member/type/byte checks, not a clean-worktree requirement.
Optional ignored classification uses `check-ignore --no-index -z --stdin` on
the exact NUL-delimited non-install paths discovered by the guarded traversal;
exit 0/1 means matches/no matches, other exit/partial output blocks. Bind input
path inventory and raw output identity. This is supplemental only; omit it
explicitly as null when not collected. No broad ignored/install-tree scan.

Parse path-bearing records from raw bytes using NUL delimiters and fatal UTF-8
decoding with byte roundtrip. Stage record grammar is mode, one space, full
object ID of declared format, one space, stage, TAB, exact path, NUL. Never split
paths by whitespace/newlines or normalize Unicode. Existing unsafe/control-path
policy still rejects decoded unsafe names after safe framing. Duplicate/stage
and case collisions block; no deduplication that discards evidence.

Debug output is a separately reviewed exact-version grammar, not human output
accepted heuristically. Require one debug metadata block per matching stage
record, known ctime/mtime/dev/ino/uid/gid/size/flags labels and numeric grammar,
exact boundaries/counts and no trailing records. Pin actual grammar and flag
bit meanings to the accepted executable with positive/malformed/unknown-state
fixtures before implementation acceptance. Accept only explicitly reviewed
normal flags; detect intent-to-add from flags, never infer it solely from object
ID. Nonzero/unknown flags without exact supported interpretation block. No
fallback parser and no best-effort whitespace/record repair. Stat timestamps
in raw debug evidence are capture metadata, not canonical membership fields.

### GI4 — Inventory and index-state contract

Canonical tracked record has exactly repositoryRelativePath, mode, stage,
objectId, trackedState and flags. mode is the exact six-digit Git mode string;
stage is integer; objectId is index evidence only. Accepted trackedState is
TRACKED_REGULAR; flags explicitly records intentToAdd, assumeUnchanged and
skipWorktree as false plus reviewed rawFlags. Only reviewed normal stage-0
regular modes 100644/100755 are supported. Modified tracked worktree bytes are
supported subject to current-byte approval, never replaced by Git object bytes.

Missing/deleted file, type mismatch, unmerged/multiple stages, intent-to-add,
assume-unchanged, skip-worktree, tracked symlink, unsupported flags/mode/grammar
or duplicate/case/path collisions FAIL CLOSED. Gitlink/submodule or unresolved
nested repository requires separate authority and blocks this bounded model.
Cross-check the three index outputs; contradictory tags/flags/records block.

Canonical inventory is a records array sorted by ordinal UTF-16 exact relative
path, with recursively sorted object keys per VL5, compact UTF-8 JSON, no BOM or
final newline. TRACKED_INVENTORY_SHA256 is SHA-256 of these future canonical
bytes, not computed/approved here. No timestamps in canonical records.

Bind BOTH raw index bytes/length/SHA-256 at Git-discovered location and canonical
staged inventory identity. Do not parse index binary content. Discover and bind
worktree root, Git dir and common dir including linked-worktree relationships;
never assume repository/.git/index. Unknown external Git-dir mapping, linked
worktree ownership, split/sparse index or absent index blocks until reviewed.
Host native locators stay in provenance, not the portable directory descriptor.
Repository identity includes a separately approved host-to-read-only-mount map;
HEAD alone cannot distinguish another checkout of the same commit.

### GI5 — Evidence envelope and consumer verification

Identity-bearing envelope schema is vlock-tracked-inventory-evidence-v1, with
exact fields schemaVersion, producerIdentity, gitIdentity, adapterIdentity,
commandContractSha256, environmentContractSha256, repositoryAnchor, head,
indexIdentity, trackedInventorySha256, trackedMemberCount, stateSummary and
supplementalEvidence. Nested identity records bind the fields required by
GI2/GI4; raw command evidence references bind argv, stdout/stderr byte hashes,
byte lengths, exit and complete-capture status. stateSummary enumerates all
unsupported/conflict counts, required zero. supplementalEvidence is explicit
null or bound input/output/ignore-policy evidence. Timestamp may appear only in
separate human metadata, never identity-bearing core. Unknown fields block.

Before hashing source, graph workload verifies supported envelope/record schema,
separately approved producer/Git/adapter/command identities, external approved
envelope digest, repository/worktree/mount anchor, index/state binding, inventory
SHA/count, complete capture, containment, duplicate/case checks, supported
modes/stages/flags and target membership. Immutable/read-only mounting prevents
in-run file mutation; hashes alone do not authenticate a producer. The trusted
outer orchestration supplies the independently approved binding, not a digest
inside the same untrusted envelope. No raw caller path list or self-approval.
The child verifies bound evidence, not a claim that it independently ran Git.

Git determines membership/index state; guarded filesystem reads determine exact
CURRENT WORKTREE BYTES under LC3/LC4. Verify file/parent type and identity before
and after reading and rehash/reinventory before acceptance. No Git blob fallback.
Combined discovery compares physical target contents against bound tracked
records, explicitly admitted inputs and LC2 install exclusions. Every remaining
non-install member is UNBOUND_SOURCE_MEMBER. Supplemental ignored evidence
cannot exclude it; GENERATED_REQUIRED, SECRET_OR_LOCAL_CONFIG and OTHER_IGNORED
retain LC2 review rules. Never expose secret raw bytes as incidental evidence.

### GI6 — PRE/POST acceptance and lifecycle

Sequence: host PRE capture → canonical inventory/envelope identity → read-only
input delivery → child evidence verification → current-byte hashing and unbound
member discovery → candidate directory identity → host POST capture → compare
all required state → accept only stable evidence. Within capture, bracket Git
queries with index/config/anchor checks as well. Recheck HEAD, raw index,
canonical membership, required config/producer identities and guarded
member/type/byte inventories. Difference yields
REPOSITORY_STATE_DRIFT_DURING_CAPTURE; incomplete POST cannot yield PASS.
Do not introduce repository locks/writes. This is bounded drift detection, NOT
an atomic filesystem snapshot guarantee; transient change-and-revert cannot be
claimed impossible. Stronger concurrency guarantees need separate authority.

Producer approval, adapter grammar/fixtures, candidate execution authorization,
fresh full synthetic revalidation and independent graph/input approval remain
separate prerequisites. FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION:
YES, because tracked-member input authority and graph closure discovery change.
No producer implementation, graph SHA, synthetic/native writer or real V-LOCK
execution here. Pointage untracked diagnostics remain unresolved. Task 3.3
BLOCKED / UNCHECKED; Tasks 10/29; 3.4–3.10 UNCHECKED / NOT_AUTHORIZED; Phase 4+
NOT_AUTHORIZED; parent 19/23, 6.1 FAIL / UNCHECKED; Production NOT_AUTHORIZED.

## V-LOCK local-source member closure amendment

Mode: APPROVED_LOCAL_SOURCE_CLOSURE_DESIGN_AMENDMENT. Control Tower approved
documentary adoption only. Previous V-LOCK Design: APPROVED_HISTORICALLY.
Current local-source-closure amendment: AWAITING_GATE_2B_REVIEW.
Task-3.3 TIC amendment: AWAITING_CONTROL_TOWER_REVIEW. SPECS_CHANGE_REQUIRED: NO.
This section refines the meaning of the complete directory member manifest in
VL4; it supersedes physical-tree traversal for local directory identity only.
It does not approve implementation, a graph identity, or any historical rebind.

### LC1 — Authority and selection

REPOSITORY_OWNED_LOCAL_SOURCE_CLOSURE is the selected model, not recursive
PHYSICAL_DIRECTORY_CONTENT. Bind the repository-relative target, authoritative
package/workspace manifest and package identity, deterministic repository-owned
member inventory, current approved worktree bytes and explicitly admitted local
inputs required by the approved graph semantics. No execution of manifests.

Repository ownership authority is partial but sufficient for this bounded
refinement: docs/AUTHORITY_MODEL.md distinguishes tracked implementation from
installed remnants; root .gitignore identifies node_modules as ignored install
material; docs/DEVELOPMENT_WORKFLOW.md separately governs required generated
Next types. Ignore status is not admission or a universal exclusion policy.

The primary member set is the exact Git tracked-path inventory beneath the
target, plus separately authorized required local inputs. Git determines path
membership, not accepted content. Hash CURRENT APPROVED WORKTREE BYTES, never
substitute HEAD/index blob content for modified working files. Staged and
unstaged differences are recorded as distinct context; neither staging nor
tracking grants content approval. Bind inventory and current bytes to separate
reviewed input approval; additions/removals or changed bytes require review.

Explicit inputs require exact path, role, owner/approval and byte identity;
discovering a dependency does not self-admit its source. Required inputs outside
the target remain explicit repository-relative closure members under containment
rules, not ambient lookup. Missing declarations or unsupported semantics block.

### LC2 — Install, untracked and ignored material

The node_modules subtree of a local target is INSTALL_MANAGED_NON_AUTHORITY.
Do not recursively traverse it or hash its physical children. Symlinks only
beneath that excluded subtree do not themselves fail source closure. Never
consult pnpm store bytes or layout. A nested node_modules subtree is treated
only as this exact install class, not a general name-pattern exemption: first
check authoritative inventory and required-input declarations for overlap.
Any tracked or explicitly admitted authoritative member inside an excluded
install region BLOCKS; it must not disappear from identity. Moving source into
node_modules or declaring local source/import/entry inputs there is an authority
conflict, not permission to exclude required source. Existing frozen dependency
edges still receive native graph checks; this is not an installed-module audit.

Every untracked non-install member under an applicable target is
UNBOUND_SOURCE_MEMBER and FAILS CLOSED until explicit admission/disposition.
Do not auto-include, auto-ignore, delete or reclassify it. Discovery must account
for ignored as well as visible untracked members without following links.

Ignore rules alone never exclude a member. INSTALL_MANAGED needs the explicit
class above. GENERATED_REQUIRED needs separate admission and identity when
graph/runtime semantics require it. SECRET_OR_LOCAL_CONFIG is not read or bound
as raw secret evidence merely because present; semantic dependence blocks for
separately reviewed safe identity handling. OTHER_IGNORED, including caches not
covered by an approved exclusion class, stays unresolved and blocks. Tracked
generated/ignored members remain authoritative until a reviewed disposition;
generated status neither drops their bytes nor authorizes regeneration.

### LC3 — Path and ownership safety

Authoritative members and traversed parent components must not be symlinks or
reparse points, whether their target is inside or outside the repository. Do not
follow arbitrary links. Preserve containment, exact case, hardlink/physical
alias rejection and canonical relative-path checks. Excluded install children
are not traversed; exclusion must not mask an authoritative ancestor or overlap.

Fail closed on missing/deleted tracked members, unexpected type, unmerged index,
index/worktree path collision, case/path ambiguity, unsupported ownership state,
submodules/gitlinks or nested repositories with unresolved ownership. Git blobs
do not reconstruct missing files. Bind fresh inventory and bytes before/after
validation; concurrent drift invalidates the run. No auto-rebaseline. Identical
approved source bytes/inventory produce the same identity across platforms;
line-ending differences remain byte differences, not normalized equivalence.

### LC4 — Deterministic directory descriptor and target types

The directory descriptor has exactly targetPath, packageManifestPath,
packageIdentity and members. targetPath and packageManifestPath are canonical
repository-relative paths; packageIdentity binds exact manifest name/version
when applicable (explicit null only for a separately admitted non-package
directory). The manifest is itself a required member. members is an array of
records with exactly path, type, bytes and sha256: repository-relative path,
type file, raw byte length and SHA-256 of current authoritative worktree bytes.
Unsupported member types fail. Physical empty directories and install layout
do not enter this source-member descriptor; required directory structure is
derived from admitted file paths, not an ambient directory walk.

Sort member records by ordinal UTF-16 repository-relative path; reject duplicates
and aliases. Sort descriptor object keys recursively by VL5 ordering. Emit
compact deterministic UTF-8 JSON with no BOM/final newline and SHA-256 the exact
descriptor bytes. Do not include timestamps, host absolute paths or store layout.
In VL4 localReferences, directory nativeIdentity is this descriptor, rawSha256
is its canonical SHA-256 and bytes is the sum of its file-member raw lengths.
This refines directory nativeIdentity without changing the seven top-level
projection fields. Explicit-input roles/approvals belong to the independently
reviewed input envelope, never a recursive self-approval hash.

Workspace package, link directory and supported file directory targets use this
source closure after their scheme-specific resolution, containment and native
matching. workspace selectors are not filesystem paths. Unsupported file target
semantics block. Local tarballs retain exact raw bytes/size/SHA plus native
integrity requirements; do not expand them for directory identity. Patch files
retain exact raw-byte identity plus native patch hash/settings requirements.

### LC5 — Diagnostic truth and remaining gates

Prior read-only discovery observed packages/auth (@yuta/auth) with 18 tracked
members: AGENTS.md, package.json, tsconfig.json, nine src files and six test
files. Its node_modules/typescript is an install-managed symlink outside this
source closure. This observation is not a validated or approved graph identity.
Eight workspace dependency targets were inspected: auth, booking, contracts,
core, db-cloud, db-pos, tenant and ui; all eight had node_modules and no tracked
filesystem symlink was observed. Preserve unresolved untracked observations:

- packages/contracts/src/pointage/index.ts
- packages/contracts/test/pointage.test.ts
- packages/db-cloud/test/pointage-cross-domain-auth.integration.test.ts

These remain potential UNBOUND_SOURCE_MEMBER blockers in applicable closures;
this amendment gives no Pointage admission/disposition. Previous restart remains
BLOCKED, classified WORKSPACE_DIRECTORY_MEMBER_CLOSURE_UNDEFINED, not an invalid
dependency, escape or native pnpm failure. No closure/graph SHA was produced.
FULL_SYNTHETIC_REVALIDATION_REQUIRED_AFTER_IMPLEMENTATION: YES, because future
graph.mjs directory-identity semantics change. Implementation and fresh synthetic
execution need separate authorization, followed by graph restart from precheck
and independent graph/input approval. Install state alone must not alter source
identity. Historical failures remain unchanged; Task 3.3 remains BLOCKED /
UNCHECKED, Tasks 10/29, 3.4–3.10 UNCHECKED / NOT_AUTHORIZED, Phase 4+
NOT_AUTHORIZED, parent 19/23, parent 6.1 FAIL / UNCHECKED, Production NOT_AUTHORIZED.

## V-LOCK native-first frozen graph and isolation amendment

Previous V-LOCK Design: APPROVED_HISTORICALLY. Current V-LOCK amendment:
AWAITING_GATE_2B_REVIEW. Task-3.3 TIC: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO. R4 requires genuine approved reproduction and R10
requires all applicable checks; neither prescribes native-only graph checking.
This section refines V-LOCK/TC3-1 only. It does not borrow R4L authority, change
Specs, activate implementation, approve a runtime or establish a graph baseline.
Earlier V-FIX/GS decisions and historical evidence remain unchanged.

### VL1 — Native authority and complete coverage

Control Tower authorizes the native-first model for this amendment: layer 1
uses sufficient native predicates; layer 2 covers only the explicitly listed
uncovered structural/reference invariants. Both layers are mandatory. Native
failure cannot be overridden by a gap PASS. No registry, fresh resolution,
replacement graph, install, scripts, mutation or reference repair is allowed.
Unsupported native semantics or a new reference kind fails closed for review.

Bounded local native source: pnpm 11.8.0 whole bundle SHA-256
387f6756132d9e556275635ddfbd419a782b0f1369ffb093709f7e21ea1d45b6;
package manifest SHA-256
b3144ca9688dfdd1f6bf81826855b9dffe199d46465c9e27dc72aabcbc104367.
No synthetic minimal-source closure is required. This is not full upstream
provenance. H3 composite
b3c14029e68af88634e81c46aec36bb7efb5bd441cf1ad0ebcd6b116d90f7c48
is REVIEWED_CANDIDATE / NOT_APPROVED. Its historical smoke remains FAIL:
Node Permission Model denied fsync. No source mutation or historical relabeling.

### VL2 — Importer contract

Authority for each row is this V-LOCK amendment plus the named reviewed native
surface, not R4L. FULL means sufficient for the named narrow obligation only.
All input paths are reviewed workspace-relative identities; no ambient config.
Every row is registry-free. Native optional/link precedence is retained.

| Invariant                                                             | Native coverage and surface                                   | Gap check                                                                                                   | Required inputs                                                                                                                                                                                                                               | Failure                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Exact importer/project inventory                                      | PARTIAL: allProjectsAreUpToDate visits supplied projects      | REQUIRED: equality of independent workspace project inventory and importer keys, no missing/extra/duplicate | Reviewed workspace selection, every selected manifest, lock importers                                                                                                                                                                         | IMPORTER_INVENTORY_DRIFT         |
| Specifier equality; dependencies/devDependencies/optionalDependencies | FULL: satisfiesPackageManifest through allProjectsAreUpToDate | NOT_REQUIRED for native comparison; VL3 still verifies resolved targets                                     | Complete manifests/importers; autoInstallPeers/excludeLinksFromLockfile                                                                                                                                                                       | MANIFEST_SPECIFIER_DRIFT         |
| Workspace and link consistency                                        | PARTIAL: linkedPackagesAreUpToDate                            | REQUIRED: every link targets exact admitted local member; prohibit escape/reparse and unexpected membership | Workspace package map, manifests, lock graph, local reference evidence                                                                                                                                                                        | LOCAL_REFERENCE_DRIFT            |
| Catalog consistency                                                   | FULL: allCatalogsAreUpToDate                                  | NOT_REQUIRED for native catalog comparison                                                                  | Reviewed catalogs and lock catalog snapshots                                                                                                                                                                                                  | NATIVE_FROZEN_CONSISTENCY_FAILED |
| Local tarball freshness                                               | PARTIAL: localTarballDepsAreUpToDate                          | REQUIRED: exact admitted path/raw hash/size, no missing or fetched substitute                               | Local tarball bytes and native lock integrity data                                                                                                                                                                                            | LOCAL_REFERENCE_DRIFT            |
| Settings and overrides                                                | FULL: getOutdatedLockfileSetting for its supported fields     | NOT_REQUIRED for native comparison; complete input binding required                                         | Effective reviewed catalogs, overrides, packageExtensionsChecksum, ignoredOptionalDependencies, patchedDependencies, autoInstallPeers, dedupePeers, excludeLinksFromLockfile, peersSuffixMaxLength, pnpmfileChecksum, injectWorkspacePackages | NATIVE_FROZEN_CONSISTENCY_FAILED |
| Patch bindings                                                        | PARTIAL: native settings checks hash map, not all local bytes | REQUIRED: exact patch key/path/bytes and native hash relation; unsupported hashing mode fails               | Reviewed patch files, native-compatible hash evidence, lock patch map                                                                                                                                                                         | PATCH_REFERENCE_DRIFT            |

No pnpmfile/hook/config JavaScript is executed to obtain effective settings.
Required settings not derivable from approved declarative evidence block the
check. File/link/tarball inputs outside the reviewed local closure block it.
Absent reference families are explicitly empty, not silently skipped checks.

### VL3 — Resolved-graph contract

| Invariant                                 | Native coverage                                                                   | Bounded gap obligation and representation                                                                                                                                      | Failure                                        |
| ----------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------- |
| Every package/snapshot referenced exists  | PARTIAL: native conversion is not comprehensive validation                        | Check original native parsed packages/snapshots before conversion can lose distinctions; all required targets must exist                                                       | MISSING_GRAPH_MEMBER                           |
| No dangling dependency or importer target | PARTIAL: native refToRelative/dependency-path helpers decode supported references | Traverse all dependency/dev/optional importer edges and dependency/optional snapshot edges; bind peer-context identifiers without stripping them; local edges use VL2 evidence | DANGLING_GRAPH_REFERENCE                       |
| Package/snapshot identity consistency     | PARTIAL: convertToLockfileObject and native dependency-path decoding              | Exact supported snapshot-to-package relationship; contradictory resolution/name/version mappings fail, never repair                                                            | GRAPH_PROJECTION_MALFORMED                     |
| Exact inventory; no unexpected members    | NONE for approved inventory equality                                              | Compare complete importer/package/snapshot/local-reference key sets with separately approved projection; retain optional/platform members, do not prune to host                | MISSING_GRAPH_MEMBER / UNEXPECTED_GRAPH_MEMBER |
| Exact lockfile version                    | PARTIAL: \_read checks compatibility                                              | Require exact reviewed version value/type in addition to native compatibility PASS                                                                                             | LOCKFILE_VERSION_MISMATCH                      |
| Patch/file/link/workspace references      | PARTIAL: native helpers and VL2 predicates                                        | All applicable references map to approved immutable local evidence, no ambient files/store lookup                                                                              | PATCH_REFERENCE_DRIFT / LOCAL_REFERENCE_DRIFT  |
| Approved semantic projection              | NONE                                                                              | Canonical VL4/VL5 projection equals independently approved identity and input binding                                                                                          | RESOLVED_GRAPH_IDENTITY_MISMATCH               |

All VL3 checks are registry-free. Native decoding establishes reference syntax;
gap traversal checks existence/equality only, never selects a new dependency
version. Cycles supported by the native graph are traversed with visited sets,
not automatically rejected. Peer declarations are retained as declarations;
they are not invented installed edges. Unknown protocols or coverage gaps fail
VALIDATION_COVERAGE_GAP rather than silently passing. Native graph hashing or
installation graph-building alone is not sufficient coverage.

### VL4 — V_LOCK_RESOLVED_GRAPH_PROJECTION_SCHEMA

Closed top-level object, schema discriminator `vlock-resolved-graph-v1`:

- `schema`: exact discriminator above.
- `parsedLock`: lossless encoding of the complete native parsed file object
  before converter mutation, including all settings, importers, packages,
  snapshots, resolutions, integrity values, peers and optional/platform metadata.
- `nativeGraph`: lossless encoding of the complete native converted object from
  an independent copy; no dependency-field allowlist or host filtering.
- `projects`: object keyed by exact importer ID; each value has exactly
  `manifestPath` and `manifest` (complete parsed manifest, lossless encoded).
- `workspace`: complete reviewed declarative workspace object, lossless encoded.
- `effectiveSettings`: lossless encoded complete VL2 effective-settings record;
  every named field represented, including explicit native absence.
- `localReferences`: object keyed by normalized workspace-relative path; each
  value has exactly `kind`, `bytes`, `rawSha256`, `nativeIdentity`. Kind is
  `patch`, `file`, `link`, `workspace` or `tarball`. Files bind exact bytes;
  directory references bind an approved complete relative member manifest as
  nativeIdentity, never a host absolute path or mutable store location.

Lossless encoding is a tagged tree: null `["null"]`, undefined
`["undefined"]`, boolean `["boolean", value]`, string `["string", value]`,
finite number `["number", value]`, negative zero `["negative-zero"]`, array
`["array", [encoded elements]]`, object `["object", {key: encoded value}]`.
Reject holes, cycles, non-plain objects, dates, functions, symbols, bigint,
non-finite numbers, unpaired UTF-16 surrogates and ambiguous duplicate parsed
keys. Preserve undefined from native conversion instead of silently omitting it.
This is serialization of native values, not replacement parsing/resolution.

Include every native field, including previously unknown fields; if its type
or semantics cannot be checked by the reviewed coverage contract, block for
review. Exclude incidental execution timestamps, stdout, source-code objects,
host absolute paths, registry-fetched metadata and freshly resolved versions.
An excluded execution field is never removed from a dependency record to make
it pass: a forbidden value in graph/input data blocks projection. Reviewed
manifest scripts remain inert strings. Registry URLs already in lock data are
retained as inert resolution identity, never fetched.

### VL5 — Canonicalization and distinct identities

V_LOCK_RESOLVED_GRAPH_CANONICALIZATION: recursively sort object keys using
ordinal UTF-16 code-unit comparison, not locale collation; preserve every native
array order and every tagged-tree tuple order. Inventories are object maps,
not discovery-ordered arrays. Path keys use reviewed relative forward-slash
form; reject absolute paths, traversal, ambiguous normalization, case collision
or aliases rather than silently collapsing them. No Unicode normalization,
whitespace trimming, array sorting or native value coercion.
Emit object members directly in the specified sorted order, including numeric
property names; do not let JavaScript integer-key enumeration reorder them.
Serialize with ECMAScript JSON number/string encoding, compact UTF-8 JSON,
no BOM and no final newline; SHA-256 over those bytes. Reject malformed values
before serialization. Equivalent key insertion order must produce identical
bytes; changed array order or dependency data remains observable.

RAW_LOCKFILE_SHA256 protects exact raw bytes, currently
6b5e098cc08ebff859d5c7f968451e073a7a8434f0a210783c57e206637075c5.
RESOLVED_GRAPH_SHA256 protects the VL4 semantic projection, not raw formatting.
They are distinct and both mandatory. Neither PASS masks the other's FAIL.
Graph input approval separately binds raw lock, all manifest/workspace/config
source hashes, complete local reference inventory/hashes, pnpm source identity
and projection algorithm identity. This envelope is not recursively included
in its own graph hash. No graph SHA is computed or approved in this amendment.

Lifecycle: approved raw lock and input closure → fail-closed native parse →
reviewed projection algorithm → canonical bytes → candidate graph SHA →
independent review → explicit approved graph/input binding → V-LOCK execution.
First observation is CANDIDATE_AWAITING_CONTROL_TOWER_APPROVAL, never approval.
Missing/stale approval blocks real execution; no auto-rebaseline. The input
closure must be rechecked before/after projection and later verification.

### VL6 — Failure and aggregation model

VL2/VL3 codes are failure conditions, not alternatives to native evidence.
GRAPH_PROJECTION_MALFORMED includes invalid encoding, duplicate keys, forbidden
values and unsupported shape; RESOLVED_GRAPH_IDENTITY_MISMATCH includes stale
approved projection/input bindings. Missing independent approval reports
GRAPH_IDENTITY_NOT_APPROVED. Native failure reports its exact native reason plus
NATIVE_FROZEN_CONSISTENCY_FAILED where no more specific code applies.
Missing/skipped/partial/timeout evidence cannot PASS. Preserve existing generic
orchestration/result schemas and raw artifact sha256 semantics; detailed graph
evidence does not replace the raw artifact identity. All applicable native,
gap, raw-roundtrip, isolation and integrity checks are conjunctive.

### VL7 — External isolation and runtime review

Prefer external OS/container isolation: owned scratch writable; repository absent
or mounted read-only; source lock read-only; network hard-disabled externally;
no installer, CLI startup, scripts, registry or store fetch; no mutable pnpm
store dependency. Native open/write/fsync/rename/cleanup operate normally inside
scratch. No fsync/atomic-writer stub or native patch. Node Permission Model is
not required if external isolation independently provides all these guarantees.
No shell/subprocess escape, privileged container, host socket or writable host
mount. Use read-only root, non-root user, dropped capabilities and no-new-privileges
where container isolation is selected. Bound each child to 30 seconds, cap raw
stdout/stderr at 1 MiB each, terminate owned process/container on timeout, and
fail rather than accept truncated output. Capture write paths including atomic
temporary files and descriptor writes, completed fsync/rename, cleanup, denied
attempts, raw stdout/stderr, exit and independent PRE/POST source integrity.
Unobservable required events block proof; a zero initialized counter is not proof.

Linux runtime/image authority is PENDING. Before use, review exact image/index,
linux/amd64 platform-manifest and config digests, Node version/executable SHA,
material runtime/library identities, pnpm bundle/manifest hashes, command/env,
scratch/repository mount definitions, network mode and process-control policy.
Local tag/version is insufficient; node:24.17.0-bookworm is NOT_APPROVED here.
Windows Node approval is not inherited by Linux. H3 review binds extraction tool
and its parser dependency, exact source ranges, zero raw-range mismatches,
output inventory/hashes and CLI/install unreachability. Changed extraction or
runtime is a new candidate; no manual extracted-source edits.

### VL8 — Synthetic gate, real execution and scope

After separately approved runtime/harness setup, synthetic-only gate requires
native parse, normal writer/fsync, native reread and graph comparison PASS;
malformed/conflicted/incompatible inputs fail closed using existing native \_read
options, never autofix. Native importer checks and VL2/VL3 positive graph cases
must PASS; missing/dangling/unexpected members, importer/specifier/settings/version,
patch/local-reference and approved-identity mismatches must fail closed.
Network/registry/store attempts and repository/unexpected writes must each be
observably zero. Historical failed smoke remains FAIL. A synthetic PASS is not
real lock acceptance or approval of candidate graph bytes.

Future order: exact runtime review → synthetic gate → separately authorized
candidate projection from current reviewed lock/inputs → Control Tower graph
identity approval → separately authorized real scratch-copy native roundtrip →
exact raw equality AND approved graph/native/gap consistency → negatives and
final protected integrity. No real roundtrip without APPROVED_RESOLVED_GRAPH_IDENTITY.
Task 3.3 remains BLOCKED / UNCHECKED. Future implementation stays in check.mjs,
check.test.mjs and Tasks evidence only; no durable harness file is currently
required or authorized. Scratch proof stays outside repository. Any later extra
path requires exact proposal/TIC approval before creation. No graph computation,
runtime approval, implementation or execution is authorized by this amendment.

## Generation-scoped orchestration amendment — pending review

Previous Model-B Gate 2: APPROVED_HISTORICALLY.
Previous Model-B Gate 2b: APPROVED_HISTORICALLY.
Current generation-scoped orchestration Design amendment: AWAITING_GATE_2B_REVIEW.
Current Task/TIC amendment: AWAITING_CONTROL_TOWER_REVIEW.
SPECS_CHANGE_REQUIRED: NO. R4/R5 separate identities; R10 requires all applicable
obligations and explicitly leaves topology/representation to Design.

This candidate refines MB4/TC3-MB7 only. Existing artifact classifications,
per-artifact schema, domain admission, Phase1/2/3.1 and historical evidence stay
unchanged. No implementation or new artifact authority is activated by this text.

### GS1 — Two observed universes

Artifact lane is keyed by exact repository path and its single approved
classification. Existing requiredValidators and generic results remain unchanged:
path, validator, version, sha256, result, failureCode. sha256 always means the
observed repository artifact raw hash. Existing extra-result rejection remains.

Generation lane is keyed by generation-obligation identity, not repository path.
It observes isolated current-generation output bytes and evidence. A logical path
may occur in both universes without a second repository classification. Neither
lane consumes, changes or overwrites the other's path ownership or byte identity.

### GS2 — Obligation body and approval envelope

Use a strict separate generation obligation body with exactly these fields:
validator (closed registry id), version (positive safe integer), owner (exact
reviewed owner string), domain (exact approved scope string),
generationIdentitySha256, outputSetSha256 (lowercase SHA-256),
reproductionMode (literal COLD_AND_REPEATED).
Canonical identity is SHA-256 of D2 canonical JSON: recursively sorted object
keys, array order per contract, compact UTF-8, no BOM/final newline. Reject
duplicates/unknown fields before hashing. Do not include approval in its own body.

The separate envelope contains body, obligationSha256 and approvalRef using the
existing repository path/unit-locator/digest reference convention. Resolve the
approval independently; it must explicitly approve that exact obligation digest.
Generation/output approval alone is not permission to omit obligation approval.
No unavailable locator or digest is fabricated during this amendment.

Current V-FIX body:

- validator: vfix-current-generation-v1; version: 1.
- owner: Backoffice Personnel extraction/evaluation corpus owner.
- domain: V-FIX current corpus reproduction.
- generationIdentitySha256: 134bfd72045dc037b9ceb064679b6ec6f8150b52447077bc1d0fbeff3f91f7c8.
- outputSetSha256: 52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a.
- reproductionMode: COLD_AND_REPEATED.

This is an exact proposed obligation, not a changed generation/output identity.
Historical equality is not its PASS condition; historical comparison is separate.

### GS3 — Closed routing and required-obligation coverage

Add a separate source-owned generation registry in existing check.mjs; never
add this id to the artifact validator enum. The V-FIX obligation is mandatory
whenever the exact approved V-FIX historical admission is in the applicable
policy universe. The required set is derived from reviewed source-owned bindings,
not from result presence or a caller-provided optional list. An omitted required
envelope fails GENERATION_OBLIGATION_MISSING. Unknown/unapproved envelopes fail
closed; duplicate envelope identities fail GENERATION_RESULT_MALFORMED with
duplicate-obligation detail. An unrelated policy universe has an explicitly empty
required generation set, preserving existing non-V-FIX Phase1/2/3.1 behavior.

Keep envelope data/evidence separate from existing policy/result schemas.
Implementation in K may load the reviewed bounded unit from Tasks using a unique
marker and digest; no new registry file, module or free-form executable command.
The marker/approval binding must be reviewed before activation, not inferred from
a heading or self-asserted APPROVED field. Existing admission applicability
checks still run first. No caller-controlled flag may suppress the generation lane.

### GS4 — Separate generation result and evidence

Strict generation result fields:
obligationSha256, validator, version, result (PASS or FAIL), failureCode,
observedGenerationIdentitySha256, observedOutputSetSha256,
reproductionEvidenceSha256, reproductionEvidenceStatus (COMPLETE, PARTIAL,
MISSING or SKIPPED). Identity fields may be null only for a failing result when
not observable; PASS requires exact approved values, COMPLETE evidence and null
failureCode. FAIL requires a nonempty deterministic failureCode.
No path or generic sha256 field is added to this result type.

Detailed evidence is outside this result. Its canonical digest binds exact
obligation/generation/output identities, both cold/repeated runs, execution
identity checks, raw stdout/stderr digests, actual exit, complete parsed terminal
result, independently read output inventory/type/hash/size/origin/manifest checks,
pre/post protected identities, timeout/completion state and legacy classification.
A digest string or self-reported COMPLETE alone is not proof: aggregation resolves
the evidence and verifies its digest, applicability and completion assertions.
Do not fabricate renderer-emitted fields; adapter observations are attributed
separately. No retained PASS substitutes for required actual cold/repeated runs.

### GS5 — Conjunctive aggregation and diagnostics

Final policy PASS = artifact lane PASS AND generation lane PASS.
Preserve artifact rows and their existing extra-result rules. Add a separate
generation audit collection, keyed by obligationSha256; final aggregate and exit
incorporate both. The standalone artifact coverage result must not be presented
as final policy success when generation obligations apply.

For every required generation obligation, require exactly one matching result,
matching validator/version and generation/output identities, resolved complete
reproduction evidence and PASS. Zero required obligations is valid only when
source-owned applicability explicitly establishes that empty set; extra generation
results still fail. Never accept duplicate, unknown, skipped or partial results.

| Failure code                       | Deterministic condition                                              |
| ---------------------------------- | -------------------------------------------------------------------- |
| GENERATION_OBLIGATION_MISSING      | Required envelope missing or required approval unavailable           |
| GENERATION_RESULT_MISSING          | No result for required obligation                                    |
| GENERATION_RESULT_EXTRA            | Unknown/unrequired result identity                                   |
| GENERATION_RESULT_DUPLICATE        | More than one result for a required identity                         |
| GENERATION_IDENTITY_MISMATCH       | Observed generation identity differs                                 |
| GENERATION_OUTPUT_SET_MISMATCH     | Observed current output-set identity differs                         |
| GENERATION_REPRODUCTION_NOT_PROVEN | Evidence digest/semantics invalid or cold/repeated equality unproven |
| GENERATION_RESULT_MALFORMED        | Invalid shape, validator/version, inconsistent result or envelope    |
| GENERATION_TIMEOUT                 | Supervised generation exceeded bound or was terminated               |
| GENERATION_PARTIAL_RESULT          | Partial capture/inventory/evidence                                   |
| GENERATION_VALIDATION_SKIPPED      | Required generation execution skipped                                |

Retain existing MB5 detailed CURRENT\_\* dependency/output failures in evidence;
do not rename them merely to duplicate diagnostics. Deterministic audit ordering
is obligation identity then failure code; keep all causes, no diagnostic
suppression. Timeout/exception/unknown exit fail even when historical lane PASS.

### GS6 — Legacy renderer exit interpretation

Renderer bytes remain unchanged. Approved wrapper run() prints its full terminal
result only after preflight, render and post-input invariant checks; exceptions
emit status/code and exit2. Exit0 means legacy historical comparison PASS, not
automatic Model-B PASS. Exit1 is conditionally classified
LEGACY_HISTORICAL_COMPARISON_FAIL only when supervised execution of the exact
approved image and pre/post identity verification, complete raw capture and exact
structured terminal result establish all of:
expectedCount/generatedCount 122, empty missing/extra, status FAIL,
exactMatchCount 91, mismatchCount 31, exact current outputSetSha256,
122 unique complete rows and independently verified actual current bytes.
Verify the exact known mismatched member set, 30 v1 scan PDFs plus one derived
v1 manifest, against retained reviewed evidence; a matching count alone is unsafe.

Bind approved generation identity in adapter evidence, not an invented renderer
field. Inspect raw result shape/rows and reject malformed/duplicate/unknown
fields, unexpected diagnostic errors, runtime/preflight failure or incomplete
stdout. No ambiguous prose parsing. Other nonzero exits fail. Exact legacy
classification retains historical FAIL and only permits independent current
verification to continue; it is never generic success or historical admission.

Negative tests must vary each premise: exit1 with preflight/code error,121
outputs,extra output,wrong output digest,wrong generation identity,malformed
JSON,unknown counts,wrong mismatch members,runtime exception or absent historical
evidence all fail closed. Cold/repeated current identity must match separately.

### GS7 — Review bindings and historical truth

This authorized amendment changes Design/Sensitive raw bytes. Existing approval
unit and admission evidence bind their prior full-file digests. Preserve those
records and hashes; do not auto-rebaseline them. Before future implementation,
Control Tower must review the amended bytes and explicitly reconcile affected
full-file approval references in the existing Tasks evidence. The current
amendment does not silently make stale raw bindings valid.

Historical Task3.2 FAIL;91/122;30 PDFs+1 derived manifest;runtime/font UNKNOWN;
reconstruction UNRESOLVED;originating approval UNRECOVERED remain historical.
Tasks9/29;Task3.2 UNCHECKED;3.3–3.10/Phase4+ NOT_AUTHORIZED;
parent19/23;parent6.1 FAIL/UNCHECKED;Production NOT_AUTHORIZED.

## Model B contract amendment — pending human review

Previous Specs / Gate 2: APPROVED_HISTORICALLY.
Previous Gate 2b: APPROVED_HISTORICALLY.
Current Model-B Specs amendment: AWAITING_GATE_2_REVIEW.
Current Model-B Design/Sensitive amendment: AWAITING_GATE_2B_REVIEW.

Control Tower approved the direction and documentary amendment only. This section
is the current candidate; previous approvals do not approve these new bytes.
After explicit Gate 2/2b approval, it supersedes only the historical/current
reproduction coupling in V-FIX at original D/S4, B01/B02 dispositions, Historical
identity and reproduction gate, concrete renderer reproduction gate and TC3-1/3.2.
Previous text remains historical authority/evidence, not an alternative fallback.
R4 for other generated artifacts, R4L, generic V2 contracts and all other validators
remain unchanged. No implementation, policy registration or generated admission
is authorized here.

### MB1 — Separate artifact sets and historical admission

HISTORICAL_OUTPUT_SET is exactly the existing 122 reviewed paths/raw hashes in
the Tasks corpus table. Its unchanged closure is
a075ef0e47cfa288a93316c99d28bb1b74bab6362e081ded4b18e17a62f40560.
Serialization remains the existing slash-relative path to raw SHA-256 object,
keys code-unit sorted, compact JSON, UTF-8 without BOM/final newline.
Do not redefine its membership or change its serialization.

All 122 are historical preservation targets, including both existing manifests
and v2's 58 copied historical PDFs. Version-directory names do not classify
authority. Backoffice Personnel extraction/evaluation corpus owner is the reviewed
owner; historical role is retained corpus/answer and reproduction-reference evidence.
The explicit Control Tower Model B direction supplies the bounded historical
classification direction, not an implementation-time blanket admission.
Activation still requires reviewed exact-path admission and reference bindings,
including originating review/unit locators and their approved digests. Missing
or unresolved admission/reference evidence fails closed; no invented locator.

CURRENT_CANONICAL_OUTPUT_SET is a separate approved generation identity, not
a replacement directory or permission to overwrite any historical path. Logical
v1/v2 paths in scratch are scoped by generation identity. A later storage/path
decision requires review before repository output writes. Copies must be labeled
COPIED_HISTORICAL_INPUT; fresh renders FRESH_RENDERED_OUTPUT; manifests DERIVED_MANIFEST.
Current reproduction of a copied input proves copying from that bound input,
not historical raster reconstruction.

### MB2 — Current generation identity

A proposed strict identity record binds the following fields. It is separate
evidence, not an expansion of the generic per-artifact result schema. Reject
unknown/duplicate fields and unresolved required values; use existing D2
canonical structured-unit serialization and separate raw-byte hashes. Approval
references live outside the unit they hash to avoid self-reference.

| Binding                            | Required content / reviewed evidence available                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| rendererSourceClosure              | Exact four tooling path/raw identities; closure must be captured and reviewed, not inferred from a label                                             |
| generatorSourceClosure             | 088e372d9ac8f4dc4031e026095af0684461ff1d06eb1e582b3e111af758aaed                                                                                     |
| corpusInputClosure                 | Exact 59 inputs; 35e3ff1fd1cef6d6f336b155d5b6bec7bee679ea6e12666e838f6cc78c46b9d5                                                                    |
| platform and container             | linux/amd64; exact built index/platform manifest/config and recipe/context identity from retained experiment, independently revalidated before reuse |
| baseImageDigest                    | sha256:9c47360a2a0355e2da18516d0b1c2126ec22c195d2185e97347c9d98398c5bef                                                                              |
| python                             | 3.12.14 plus exact executable/libpython and native/transitive closure, not version string alone                                                      |
| pillow and reportlab               | Exact pinned wheel/raw digests in unchanged environment.json and requirements.lock; native dependency identities included                            |
| fontAuthority                      | ReportLab Vera, exact member/face/style/hash and reviewed license member; no host fallback                                                           |
| fontSha256                         | c4c45690b345435b2cba52ecabe275f05e49b389b39fe68ad03afbb551288d3d                                                                                     |
| licenseIdentity                    | Exact license member and SHA 3361d054759a2fc686a2c058be82deaf9c2e6fe549be9004d7935a6c1736315d                                                        |
| repertoireSha256                   | 94d6992b2a1965bab3800b7800993d832364b25cff1ccf3dbbb09021b3018d51                                                                                     |
| supplyClosureSha256                | 792ec71e06951cc94fa317c9753530b778c727d75df457f184215a8b0bb6e9d3                                                                                     |
| environmentControls                | Existing UTC/locale/UTF-8/random seed, PDF invariant metadata, JPEG/compression, font selection and isolation controls; all exact values bound       |
| outputInventory                    | Exact logical paths, roles, types and lengths; missing/extra output rejected                                                                         |
| expectedCurrentOutputHashes        | Full raw-byte map, separately reviewed approval; NOT_APPROVED / required before admission                                                            |
| review and reproduction references | Independent output-review approval plus complete cold/repeated evidence bound to the same identity                                                   |

The exact repertoire SHA is
94d6992b2a1965bab3800b7800993d832364b25cff1ccf3dbbb09021b3018d51.
No actual machine identity is created or approved by this model.
Do not populate an unavailable aggregate by reconstructing an assumed convention.

The prior stable candidate set digest
52e6383b45c89c09b84d52c11c51c57cec1f0856cea2ee637cd2d1366693326a
is EVIDENCE_ONLY. Its recorded path/type/hash/length row-array convention is
different from the historical path/hash-map convention; do not compare the
two digests as if they used the same serialization.

### MB3 — Admission lifecycle and manifests

Required sequence: renderer identity approved → controlled generation →
candidate current output set captured → independent review → explicit output
identity approval → cold/repeated reproducibility proven → generated admission valid.
Independent review covers exact inventory, source/input lineage, manifest/answer
semantics, copied versus rendered roles and applicable visual corpus review.
A stable experiment or a reviewer accepting the direction skips none of these steps.

Historical v1 manifest remains exact-byte preserved with its existing PDF hashes;
the existing v2 manifest is also preserved. A current manifest belongs only to
its separately approved current generation identity and never replaces either.
No semantic equivalence, matching filename or historical approval authorizes new bytes.

### MB4 — Two fail-closed validators

Historical validator reads exact paths/raw hashes, owner, role, admission references
and historical closure. It checks all 122 identities and reference integrity,
without invoking the renderer. Original-runtime reconstruction is not required
merely for preservation. An explicit separate reconstruction requirement, if
introduced by review, remains a separate obligation.

Current reproducible-generated validator requires an approved current generation
identity, validates source/input/runtime/supply/font/repertoire controls first,
then performs isolated cold and repeated reproduction against the approved current
inventory and exact raw output identities. Current PASS means its own approved
generation reproduced; it makes no historical-compatibility claim.
Both branches are mandatory for V-FIX closure, with explicit artifact routing.
No implicit downgrade, automatic admission, fallback or rebaseline is permitted.

Keep existing generic result fields and PASS/FAIL aggregation; report diagnostic
codes in existing failureCode/evidence channels. Do not shoehorn a historical
digest into reproducedSha256 or report copied historical bytes as fresh rendering.
Any required representation incompatibility must return for bounded review before
implementation. Missing authority and partial checks cannot produce aggregate PASS.

### MB5 — Deterministic failure diagnostics

Evaluate admission first, then dependency bindings, then output inventory/bytes,
then reproduction evidence. Emit all applicable failures in stage/code/path
code-unit order; if the existing result permits only one code, use the first
and retain the remainder in evidence. Never execute generation after failed
authority/dependency checks.

| Code                                | Condition                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------- |
| HISTORICAL_ADMISSION_INVALID        | Missing/invalid explicit classification, owner, role or closure admission |
| HISTORICAL_ARTIFACT_MISSING         | Exact approved path absent, including an unauthorized move                |
| HISTORICAL_HASH_DRIFT               | Raw bytes/hash differs; never normalize before comparison                 |
| HISTORICAL_REFERENCE_DRIFT          | Reviewed reference/approval locator or digest differs                     |
| CURRENT_GENERATION_IDENTITY_MISSING | Missing, invalid or unapproved current identity/output approval           |
| CURRENT_SOURCE_DRIFT                | Generator or renderer source binding differs                              |
| CURRENT_INPUT_DRIFT                 | Corpus/input inventory or bytes differs                                   |
| CURRENT_RUNTIME_DRIFT               | Platform/container/Python/native/environment controls differ              |
| CURRENT_SUPPLY_DRIFT                | Supply/dependency artifact closure differs                                |
| CURRENT_FONT_DRIFT                  | Font authority/member/face/license/hash differs                           |
| CURRENT_REPERTOIRE_DRIFT            | Repertoire binding differs                                                |
| CURRENT_OUTPUT_MISSING              | Approved current output path absent                                       |
| CURRENT_OUTPUT_EXTRA                | Output outside approved current inventory                                 |
| CURRENT_OUTPUT_DRIFT                | Output raw hash/type/length differs from approved current identity        |
| CURRENT_REPRODUCTION_NOT_PROVEN     | Missing/incomplete cold/repeated proof or unequal runs                    |

These bounded uppercase diagnostic reasons follow existing failureCode conventions;
they do not introduce a generic waiver or a new generic schema version.

### MB6 — Historical truth and future acceptance

Original Task 3.2 result FAIL; exact matches 91/122; mismatches 30 v1 scan PDFs
plus one derived v1 manifest. Historical reconstruction UNRESOLVED;
historical font/runtime UNKNOWN; Arial investigation INSUFFICIENT_AUTHORITY;
DejaVu recovery NO_REVIEWABLE_HISTORICAL_FONT_CANDIDATE.
Failed reconstruction attempts and prior FAIL/BLOCKED/UNKNOWN remain unchanged.
Model B cannot retroactively turn those records into PASS.

Future Task 3.2 requires both implemented validators, approved current generation
and output identities, actual cold/repeated current reproduction, all negative
drift tests, exact historical preservation/reference checks, generic orchestration
integration, no automatic rebaseline and preserved historical evidence.
Prior two-run stability is insufficient to establish these conditions.

Tasks 9/29; Task 3.2 FAIL / UNCHECKED. No implementation, renderer run, Task 3.3,
Phase 4, parent 6.1, output writes or production is authorized by this amendment.

## Context

Current version-contract candidate: see the final V2 bounded amendment. Earlier
V1 text remains historical; it is not the current V2 representation definition.
Amended Design: AWAITING_GATE_2B_REVIEW. No implementation authorization.

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

## V2 bounded version-contract amendment — current candidate

Original Gate 2b: APPROVED_HISTORICALLY.
Amended Design: AWAITING_GATE_2B_REVIEW.
Authorization: explicit current-user Control Tower version-contract amendment.
This section supersedes only the current-version interpretation of D1/D2/D12
and the missing domain/ignore representation. Earlier text and identities are
historical evidence, not approval of these new bytes. All other decisions,
six classes, alternate obligations, ownership and mutation limits remain.
Implementation and Tasks intentionally remain at their reviewed preimages
until separate authorization after amended Gate 2b. This is not Apply.

### V2.1 — Version dispatch and immutable V1

Historical V1 remains exactly schemaVersion 1 / validatorContractVersion 1.
Its strict schema continues to reject domainAdmissions, ignoreMembership and
every other V2-only field. No widening, defaults or in-memory upgrade of V1.

Current candidate is schemaVersion 2 / validatorContractVersion 2, both required
integer literals. policyRevision remains a positive safe integer, not a schema
version substitute. Version dispatch examines original parsed JSON before
semantic validation, without coercion.

| Input pair                                   | Current V2 validator behavior                                |
| -------------------------------------------- | ------------------------------------------------------------ |
| (2,2)                                        | Strict V2 validation and all mandatory evidence checks       |
| (1,1)                                        | LEGACY_POLICY_VERSION_REQUIRES_MIGRATION; never current PASS |
| (1,2) or (2,1)                               | POLICY_VERSION_PAIR_MISMATCH                                 |
| Missing, malformed or unknown future version | POLICY_VERSION_MISMATCH                                      |

A legacy diagnostic does not certify a V1 document as historically valid.
Dedicated historical V1 validation, if inspected, retains its original strict
rules. No fallback to V1 after V2 failure. No automatic version migration.

### V2.2 — Exact representation

V2 keeps every D1 required field, replacing the two version literals with 2,
and requires two additional fields: domainAdmissions (array, explicitly empty
when none) and ignoreMembership (object). Unknown keys and duplicate JSON keys
are invalid at every defined object boundary. Existing tool bindings, entry
authority, preservation/migration identities and six class semantics remain.
Adapter IDs/versions do not change automatically with the envelope version.

Out-of-domain is orthogonal to artifact classification, never a seventh class.
A domain admission has exactly:

- path: safe exact repository-relative path under D2; brackets are literal,
  no pattern matching, path normalization or Unicode normalization.
- owner: existing owner object with id and authority reference.
- typeEvidence: object with kind (UNSUPPORTED_TEXT or BINARY), reason (bounded
  nonempty text), evidenceRef (existing path/unit/sha256 reference).
- expectedSha256: exact current raw artifact SHA-256, required for both kinds.
- approvalRef: existing path/unit/sha256 reference to independent approval.

Domain admissions have unique case-safe paths. No path may occur in both
entries and domainAdmissions. Matching supported parser, missing/error input,
expected classified/preserved/baseline membership or conflicting admission
prevents OUT_OF_DOMAIN. A formerly in-domain member cannot disappear through
domain admission; any such transition needs separately reviewed removal and
preservation resolution. No such migration is authorized here.

The type evidence unit has exactly schemaVersion 2, validatorContractVersion 2,
path, expectedSha256, kind, reason, formatterSha256 and configSha256.
Its values must match the admission and current bound tools/config. This is
reviewed type evidence, not an extension heuristic or binary detector asserting
authority. Native bytes must still match expectedSha256. An inference exception
is ERROR, not evidence of unsupported type.

The independent domain approval unit has exactly decision APPROVED,
schemaVersion 2, validatorContractVersion 2, policyRevision and
domainAdmissionSha256. The latter hashes the original admission representation
excluding only approvalRef. Resolve owner authority using the existing
ownerId/CURRENT convention. Require exactly one externally observed unit per
reference and exact canonical digest agreement. policyRevision binds approval
to this policy revision. Policy-level approval continues to bind the entire
original V2 body excluding only its own approvalRef. This prevents dropping,
replacing or adding admissions under an old approval.

Approval references are not self-declared authority. Evidence must be obtained
from independently reviewable repository units under the existing workflow
trust boundary; caller-provided approval booleans are never sufficient.
No cryptographic proof of human identity or protection against replacement of
validator plus all authority sources is claimed.

Universe decisions are IN_FORMATTING_UNIVERSE, OUTSIDE_FORMAT_DOMAIN or
UNRESOLVED/ERROR. Parser-supported and expected in-domain members are IN.
Parser-null without complete valid domain admission is UNRESOLVED and fails.
Valid admitted unsupported type with matching bytes/tools may be OUT.
Ignored status never affects this decision. No real admissions are created.

### V2.3 — Ignore source and exact expanded membership

ignoreMembership has exactly:

- sourcePath: literal .prettierignore.
- sourceSha256: raw source SHA, equal to toolBindings.ignoreSha256.
- expansionAlgorithm: literal prettier-tracked-file-info-v1.
- expansionVersion: integer 1.
- formatterSha256 and configSha256: equal to current tool bindings.
- paths: unique exact case-safe repository-relative tracked paths.
- membershipSha256: canonical digest of the membership payload below.
- approvalRef: independent existing path/unit/sha256 reference.

The algorithm uses the bound local Prettier file-info ignore semantics on
independently enumerated tracked regular paths, explicit ignorePath and no
implicit .gitignore/config loading. Intersect actual ignored results with
IN_FORMATTING_UNIVERSE or unresolved/error tracked members; approved OUT members
are still accounted in domain audit, never silently hidden. Missing expected
members and inference errors fail the run. No handwritten list determines the
actual expansion. Reviewed paths are only the expected comparison set.

For membership identity, validate original path strings and reject duplicates
or case aliases first, then code-unit sort the paths as a designated set.
Hash the original raw fields sourcePath, sourceSha256, expansionAlgorithm,
expansionVersion, formatterSha256, configSha256 and sorted paths using the
corrected canonicalizer. This explicit set projection is lossless after
uniqueness validation; it is not hashing a Zod-stripped model. Ordering alone
does not change membership identity. The whole policy representation still
binds its exact original array order through policy-level canonical identity.

The independent approval unit has exactly decision APPROVED, schemaVersion 2,
validatorContractVersion 2, policyRevision and ignoreMembershipSha256.
ignoreMembershipSha256 hashes the original binding excluding approvalRef
(including its membershipSha256); thus whole-policy and unit approvals both
bind expected membership. No self-approval flag or automatic admission.

Same source SHA with changed actual membership yields IGNORE_SCOPE_DRIFT.
Changed source/tool/config or inconsistent source identities yield
IGNORE_BINDING_STALE. Missing/extra/duplicate paths, wrong digest or stale
approval fail; missing fields are POLICY_INVALID. Recompute actual expansion
for each run, with PRE/POST source/inventory binding; no persistent PASS cache.

This does not relax S5/F5: ignored mutable or unclassified in-domain members
still cause IGNORE_POLICY_MISMATCH under the approved routing contract, and
mutable direct checks must still execute and retain their result. Domain
admission alone can resolve OUT; ignore membership cannot. Current ignored
mutable sw.js is not silently grandfathered. Actual alignment remains later
reviewed migration, not this amendment.

### V2.4 — Identity, migration and recovery

Reviewed identities include both version fields naturally in original parsed
JSON. Preserve prototype-safe own-property canonicalization, code-unit key
ordering, array order except the explicitly defined membership set projection,
and raw-file SHA distinct from structured-unit SHA. Semantic Zod validation
runs separately. Shared semantic values do not make V1 and V2 identities equal.

Migration is a separately authorized reviewed transition:

V1 reviewed identity -> migration authorization -> V2 candidate representation
-> strict V2 schema validation -> V2 authority/evidence validation -> canonical
identity calculation -> Control Tower review -> V2 reviewed identity.

Evidence-unit digests needed to check bindings may be computed during validation;
the final reviewed candidate identity is recorded only after the checks.
Missing independent type/admission/membership evidence leaves migration BLOCKED.
Schema validity alone is not approval. No fabrication, silent defaults,
auto-migration, auto-rebaseline or source repair. No real policy file is created
by this Design. Future production-data mutation requires its own authorization.

| Failure/bypass                                       | Detection and fail-closed behavior                                       |
| ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Relabel V1 as V2, omit new fields                    | Strict V2 required fields; POLICY_INVALID                                |
| Inject fake/self approval                            | Independent unit cardinality, digest and bound body/revision checks fail |
| Reuse V1 identity                                    | Version participates in identity; approval digest mismatch fails         |
| Mixed version pair                                   | POLICY_VERSION_PAIR_MISMATCH                                             |
| V1 in current run                                    | LEGACY_POLICY_VERSION_REQUIRES_MIGRATION                                 |
| Unknown version or fallback attempt                  | POLICY_VERSION_MISMATCH; no fallback                                     |
| Missing type evidence or parser-null shortcut        | UNRESOLVED / UNCLASSIFIED, never OUT                                     |
| Partial V2 or missing membership data                | POLICY_INVALID; never default empty                                      |
| Same ignore bytes but new matching tracked path      | IGNORE_SCOPE_DRIFT                                                       |
| Stale V2 approval                                    | AUTHORITY_UNIT_DRIFT or CLASSIFICATION_STALE                             |
| Candidate exists without review                      | Authority validation fails; candidate stays pending                      |
| Concurrent policy/evidence/source/inventory mutation | CONCURRENT_DRIFT; discard run acceptance, no repair                      |

### V2.5 — Sensitive review and specification consistency

SPECS_CHANGE_REQUIRED: NO. R1 completeness/admission, R3/R10 mandatory
validation, R9 reviewed transition, R11 deterministic evidence and R12 parent
hold already require these behaviors and do not fix implementation version
numbers. No Spec, class, runtime, ownership or Product change is introduced.

SENSITIVE_DESIGN_RESULT: PASS as a design assessment, not human approval or
implementation verification. Authority-sensitive exclusion and ignore bypasses
are explicitly bound; six classes and no-exemption rules remain. D2 path safety,
D9 safe audit, D10 limited trust guarantee, D11 execution bounds and D12 reviewed
recovery still apply. Full implementation tests, external evidence extraction,
final current-state verification and Phase 3/4 operational prerequisites remain
unproven and must not be inferred from this assessment.

Unresolved design questions for this bounded amendment: NONE.
Original Gate 2b: APPROVED_HISTORICALLY.
Amended Design: AWAITING_GATE_2B_REVIEW.
Tasks remain 4/29. Phase 2 BLOCKED pending amended Gate-2b review and separate
continuation authority. Parent19/23, task6.1 FAIL/UNCHECKED.
Production NOT_AUTHORIZED. STOP.

## V-FIX deterministic renderer authority amendment

Status: AWAITING_GATE_2B_REVIEW.
Original relevant Gate 2b approvals: APPROVED_HISTORICALLY.
This section supersedes only incomplete V-FIX renderer selection assumptions,
not prior historical evidence, other adapters, Specs or Tasks.
Current Tasks: 9/29; Task 3.2 BLOCKED/UNCHECKED.

### Specs consistency and exact gap

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

### Runtime architecture alternatives

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

### Local font candidate discovery

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

### Font alternatives and explicit selection contract

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

### Historical identity and reproduction gate

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

### Output-sensitive controls

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

### Sensitive review and recovery

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

## Concrete V-FIX container and ReportLab Vera amendment

Current concrete amendment: AWAITING_GATE_2B_REVIEW.
Prior relevant Gate 2b approvals: APPROVED_HISTORICALLY.
Previous deterministic-renderer amendment: BLOCKED_NEEDS_REVIEW HISTORICALLY.
This section resolves that amendment's runtime/font selection questions only.
Earlier evidence/statuses remain historical; no earlier approval approves these
new bytes. Specs, Tasks and other adapters are unchanged.

### Contract and selected platform

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

### Exact font role and digital boundary

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

### Repertoire and license authority

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

### Mandatory acquisition and build gates

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

### Isolation and nondeterminism

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

### Exact 122-output reproduction and cold/warm evidence

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

### Recovery and Sensitive Design assessment

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
