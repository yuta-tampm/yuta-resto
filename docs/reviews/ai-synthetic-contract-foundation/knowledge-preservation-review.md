# AI and Storage Knowledge Preservation Review

Visibility: Engineering

Review status: APPROVED

Approval source: USER_DELEGATION_WITH_INDEPENDENT_REVIEW

Mode selection source: Actual current-user 2026-10-03 intake answer, Codex alone (`CODEX_ONLY`), retained for this bounded knowledge-preservation follow-up

Independent reviewer: `/root/ai_storage_knowledge_review`, fresh context (`fork_turns: none`), read-only

Independent review evidence: APPROVED, no remaining findings; exact candidate hashes and retained patch identity verified; fresh-reader findings below

Approval recorded by: Codex workflow

Approved: 2026-10-03T13:18:28Z

## Sourced request and delegation

Actual current-user request on 2026-10-03:

> toàn bộ kiến thức của phần AI và Storage đã thống nhất, đã lưu lại chưa? đảm bảo khi rồi chat codex này thì codex vẫn biết rõ và tiếp tục task khác dc

This is a documentation and handoff follow-up to the existing AI/Storage task.
The user selected `CODEX_ONLY` and `COMMIT_AFTER_TASK: YES` in the actual
2026-10-03 intake answers. These choices persist for this task. An unrelated new
task must select its own choices. The user request authorizes preserving the
agreed knowledge and a small local memory discovery pointer; it does not grant
runtime Apply, provider effects, real-data use, sync/archive or deployment.

Impact classification: CROSS_MODULE knowledge routing; no executable runtime,
database, tenancy or accepted exposure boundary is changed.

## Exact candidate and retained comparison

Review only the following four documentation targets. This record is review
evidence, not a second architecture home or a Gate 3 packet.

Baseline commit: `da1b89208d4a3e4beaaeb5cbd8b8683e187c3c14`.
The new architecture home did not exist in that baseline. The retained patch
below is the exact proposed change against that commit, including the new file.
SHA-256 values identify whole working-file bytes after scoped formatting.
Earlier approved planning/review files remain outside this candidate.

| Target                                | SHA-256                                                            |
| ------------------------------------- | ------------------------------------------------------------------ |
| `docs/architecture/AI_AND_STORAGE.md` | `bfd04a457e18e82a78a2db213945286aa31d4c38d2f86e73eef62561f0e68de1` |
| `docs/README.md`                      | `553b2f9d4be650860d02ceb7cfdf06b2c332d947d928f86a8285e5112aedc61a` |
| `docs/architecture/OVERVIEW.md`       | `2df071374bb6e882c0ce76c92b042a08467b81fb0f9c4dd24af1f623511b0466` |
| `docs/PRODUCT_KNOWLEDGE.md`           | `6f48098de579f294124d9e0328e66a5ed08188d062f109a1fdd66ea7decb52aa` |

## Canonical sources and review criteria

Read root instructions, docs/README.md, docs/CURRENT_STATE.md,
docs/PRODUCT_KNOWLEDGE.md, docs/AUTHORITY_MODEL.md, documentation policy,
architecture/runtime/database boundaries, Personnel Home, provider eligibility
history and production-readiness register. Use the exact Slice 1 artifacts and
three planning review packets under ai-synthetic-contract-foundation for its
bounded baseline. User-supplied critique attachments are provenance/proposals,
not runtime commands or vendor approval.

Independent reviewer must start with fresh context and return APPROVED,
CHANGES_REQUESTED or BLOCKED with exact path/hash identities. Verify:

1. Repository routing lets a reader locate the single full AI/Storage home.
2. Typed business capability and its version are independent of prompt/model;
   domain owns purpose/classification, eligibility precedes selection, and
   optimization cannot grant permission.
3. Domain metadata, quarantine/promotion, access, deletion and canonical versus
   provider-temporary storage semantics are preserved without inventing current
   database states or a migration of Formalités' immutable textual source.
4. Qualification is scoped, evidence-based and reviewable; outstanding provider,
   real-data and production decisions are explicit and existing registers remain
   authoritative.
5. Slice 1 planning complete is distinct from implementation complete, Storage
   remains a separate slice, later/not-now exclusions survive, and the next
   bounded authority step is recoverable without the old conversation.
6. No new Product/provider/legal/readiness authority, blanket new-task choices,
   implementation QA, Page Chat authority cutover, normative spec promotion or
   hidden approval is inferred from this bounded retrievability review.

The reviewer should report what a fresh reader can recover about those six
areas. This is evidence of bounded knowledge discovery, not runtime QA or a
repository-wide migration PASS. No automatic inheritance of a chat's full
context is promised; future readers must read the retained sources and recheck
current checkout/implementation evidence.

## Validation

| Check                                                                                        | Result                                                                                     |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `pnpm docs:check`                                                                            | PASS; 36 current documents checked by the repository checker                               |
| `pnpm architecture:check`                                                                    | PASS; imports, URLs, client boundaries and migration baselines                             |
| `pnpm -r --if-present typecheck`                                                             | PASS; 15 workspace projects                                                                |
| Scoped `pnpm exec prettier --check` on the four targets and this record                      | PASS                                                                                       |
| Local Markdown target-link resolution for the four documents                                 | PASS                                                                                       |
| Task-scoped `git diff --check`                                                               | PASS                                                                                       |
| `pnpm format:check`                                                                          | FAIL; 149 files outside this candidate; format preservation itself passed (67 exact paths) |
| Earlier planning delivery byte comparison against `f5aaba21128ca50239c3501f83940215c3069421` | PASS; all nine planning/review files unchanged; 13 tasks unchecked, zero checked           |

The global formatting failure is retained, not waived or called a global PASS.
Examples include `.claude/settings.json`, `docs/CURRENT_STATE.md`, reputation
delivery files and archived Claude tooling artifacts. No unrelated formatter
write was performed. The scoped candidate formatting check passes separately.

Runtime tests (`pnpm test:cloud`, `pnpm test:local`), builds (`pnpm build:cloud`),
provider requests, live evaluation and Browser QA were not run: this follow-up
changes only knowledge and routing. They are not evidence claims for Slice 1
implementation, which remains unstarted. No runtime/schema/API, environment,
provider, sync, archive or deployment command was executed.

## Independent decision and fresh-reader evidence

The reviewer returned an actual `APPROVED` verdict with no remaining findings.
The four candidate identities above were rechecked before this decision was
recorded. Reviewed input-record SHA-256, before recording the verdict:
`e6fcc19afae4e2d7da04963a3c60b17cbe94f2ad39116dba3bfb42bac0a7dd3e`.
This bookkeeping update records the verdict; it changes none of the four
reviewed knowledge targets or the retained candidate patch.

The fresh reviewer recovered the following from repository entry points and
owning sources, then checked against the three user-supplied critiques:

- Typed capability versions describe business semantics; prompt, model,
  deployment, policy and evaluation remain independent identities.
- Domain authority/classification precedes eligibility and selection; selection
  cannot enlarge permission, and upload attestation is not content proof.
- Domain metadata, quarantine/scanning/promotion, access/deletion/backup
  semantics, canonical versus provider-temporary objects and the Formalités
  immutable textual-source exception are recoverable.
- Scoped qualification, expiry/material-change review, remaining provider and
  operational decisions, and existing readiness authority are recoverable.
- Five completed planning artifacts, thirteen unchecked implementation tasks,
  separate Storage work and the need for a bounded instruction before Apply are
  recoverable. All nine earlier planning/review files remain byte-identical to
  the planning delivery.
- Three repository entry points route to one stable architecture home; same-task
  choices persist, while different tasks select their own. A new chat reads
  those sources and refreshes checkout/evidence instead of assuming inherited
  conversation context.

An evidence serialization defect was corrected before approval: Markdown
formatting removed spaces on sixteen blank unified-diff context lines. The
JSON representation below preserves those spaces. The reviewer independently
verified patch SHA-256
`178dec0b96b2359364ca5e4b08106e51e1030c8cd2b328c281bf53bbc8b8f13c`
and reconstructed all four exact UTF-8/LF candidate byte identities against the
recorded base without normalization. Validation results were inspected, not
rerun by the reviewer. The global formatting failure remains unwaived.

This decision is bounded documentation acceptance and knowledge retrievability.
It grants no Page Chat authority cutover, runtime QA, Gate 3, normative promotion,
readiness/legal/provider approval, sync/archive or future Apply authority.

## Retained exact proposed diff

The patch is evidence for this candidate only. Current architecture knowledge
lives at docs/architecture/AI_AND_STORAGE.md. The JSON line array preserves
blank-context spaces through Markdown formatting. Reconstruct the exact patch
with unifiedDiffLines.join("\n") + "\n" and verify patchSha256 before comparing
against the recorded base; it includes all four candidate files.

````json
{
  "baseCommit": "da1b89208d4a3e4beaaeb5cbd8b8683e187c3c14",
  "encoding": "UTF-8",
  "newline": "LF",
  "finalNewline": true,
  "patchSha256": "178dec0b96b2359364ca5e4b08106e51e1030c8cd2b328c281bf53bbc8b8f13c",
  "unifiedDiffLines": [
    "diff --git a/docs/PRODUCT_KNOWLEDGE.md b/docs/PRODUCT_KNOWLEDGE.md",
    "index cad7598e..fe6cf9e1 100644",
    "--- a/docs/PRODUCT_KNOWLEDGE.md",
    "+++ b/docs/PRODUCT_KNOWLEDGE.md",
    "@@ -6,7 +6,7 @@ Visibility: Engineering",
    " ",
    " Owner: YUTA product and engineering",
    " ",
    "-Last reviewed: 2026-09-30",
    "+Last reviewed: 2026-10-03",
    " ",
    " ## Purpose",
    " ",
    "@@ -53,6 +53,12 @@ Do not treat every document under `docs/` as equal authority:",
    " - `docs/tasks/` contains task instructions or work history and is **not** a",
    "   default Product Knowledge source of truth.",
    " ",
    "+For shared AI/file-storage questions, read",
    "+[AI and Storage architecture](architecture/AI_AND_STORAGE.md) for the consolidated",
    "+direction, outstanding provider/data decisions and bounded fresh-chat handoff.",
    "+It separates agreed direction from implementation and operational approval;",
    "+capability-specific Product Knowledge and normative specs retain their own roles.",
    "+",
    " ### `openspec/specs/`",
    " ",
    " This location owns normalized, approved **precise observable behavioral",
    "diff --git a/docs/README.md b/docs/README.md",
    "index 018ff04f..e99016bc 100644",
    "--- a/docs/README.md",
    "+++ b/docs/README.md",
    "@@ -6,7 +6,7 @@ Visibility: Engineering",
    " ",
    " Owner: YUTA engineering",
    " ",
    "-Last updated: 2026-10-02",
    "+Last updated: 2026-10-03",
    " ",
    " ## Finding the right authority",
    " ",
    "@@ -72,6 +72,9 @@ sensitive details never belong in the repository.",
    " ### Architecture",
    " ",
    " - [`architecture/OVERVIEW.md`](architecture/OVERVIEW.md)",
    "+- [`architecture/AI_AND_STORAGE.md`](architecture/AI_AND_STORAGE.md) — agreed AI/Storage",
    "+  direction, deferred decisions and fresh-chat continuation; Slice 1 planning complete,",
    "+  runtime implementation and Storage still pending.",
    " - [`architecture/DATABASE_BOUNDARIES.md`](architecture/DATABASE_BOUNDARIES.md)",
    " - [`architecture/TENANCY.md`](architecture/TENANCY.md)",
    " - [`architecture/AUTHENTICATION.md`](architecture/AUTHENTICATION.md)",
    "diff --git a/docs/architecture/OVERVIEW.md b/docs/architecture/OVERVIEW.md",
    "index 6cc7bd68..ab51f5ce 100644",
    "--- a/docs/architecture/OVERVIEW.md",
    "+++ b/docs/architecture/OVERVIEW.md",
    "@@ -6,7 +6,7 @@ Visibility: Engineering",
    " ",
    " Owner: YUTA engineering",
    " ",
    "-Last updated: 2026-08-05",
    "+Last updated: 2026-10-03",
    " ",
    " YUTA combines cloud SaaS applications with local restaurant products. These",
    " runtime families share contracts, pure logic, and UI components, but they do",
    "@@ -37,6 +37,15 @@ Formalités template operations. It creates neither a general Platform Admin",
    " product nor tenant authority, template persistence/lifecycle, or production",
    " enablement.",
    " ",
    "+## AI and file storage direction",
    "+",
    "+The [AI and Storage architecture](AI_AND_STORAGE.md) is the shared knowledge",
    "+entry point for the agreed capability/policy, canonical-file and provider",
    "+qualification direction. It distinguishes current implementation, the bounded",
    "+synthetic Personnel plan, deferred Storage/provider work and the instructions",
    "+for continuing in a fresh chat. It changes no runtime/database ownership or",
    "+production readiness.",
    "+",
    " ## Public-product visibility",
    " ",
    " Architecture documentation may describe every maintained runtime family.",
    "diff --git a/docs/architecture/AI_AND_STORAGE.md b/docs/architecture/AI_AND_STORAGE.md",
    "new file mode 100644",
    "--- /dev/null",
    "+++ b/docs/architecture/AI_AND_STORAGE.md",
    "@@ -0,0 +1,310 @@",
    "+# AI and File Storage Architecture",
    "+",
    "+Status: Current",
    "+",
    "+Visibility: Engineering",
    "+",
    "+Owner: YUTA engineering; business domains retain their own authorization and data ownership",
    "+",
    "+Last reviewed: 2026-10-03",
    "+",
    "+## Scope, agreement and authority",
    "+",
    "+This is the durable repository entry point for the AI and Storage direction",
    "+consolidated in the current-user architecture discussion on 2026-10-03. The user",
    "+authorized Slice 1 implementation planning, then explicitly requested preserving",
    "+the whole agreed AI/Storage knowledge so another Codex chat can discover and",
    "+continue it without this conversation.",
    "+",
    "+Architecture direction is agreed. Slice 1 planning is complete; its implementation",
    "+has not started. Storage implementation is a separate future slice. Agreement on",
    "+technical direction grants no real-data, provider, production or deployment",
    "+authorization. The discussion's external critique documents are provenance and",
    "+advice, not vendor/legal evidence or independent approval sources.",
    "+",
    "+Use the [Authority Model](../AUTHORITY_MODEL.md). Existing accepted runtime,",
    "+tenancy, database and exposure decisions remain controlling. This document",
    "+preserves the agreed direction and deferred decisions; it does not introduce an",
    "+accepted ADR that changes those boundaries, promote a lifecycle value, or make",
    "+an unsynced change spec normative. A future boundary-changing implementation",
    "+still requires its owning decision and accepted ADR.",
    "+",
    "+The [Slice 1 change](../../openspec/changes/ai-synthetic-contract-foundation/proposal.md)",
    "+owns its exact requirement baseline; its Specs/Design/Tasks own the bounded",
    "+planning details. Do not duplicate or silently extend that baseline here. Do not",
    "+reopen the converged architecture without a demonstrated material repository or",
    "+authority conflict; record such a conflict and resolve it before dependent work.",
    "+",
    "+## Core separation",
    "+",
    "+```text",
    "+Business domain: authorization + trusted scope + purpose + data classification",
    "+  |",
    "+  +-> Versioned YUTA AI capability",
    "+  |     -> eligibility -> eligible set -> selection",
    "+  |     -> deployment -> provider adapter -> AI provider",
    "+  |     -> validated result -> domain / Human review and apply",
    "+  |",
    "+  +-> Domain file service -> domain-owned metadata -> server-side locator",
    "+        -> storage port -> adapter -> canonical YUTA storage",
    "+```",
    "+",
    "+The business domain owns permission, resource scope, purpose, classification,",
    "+business schemas/semantics and final validation/apply. AI consumes and enforces",
    "+that context; it does not infer permission or classification from payloads.",
    "+Browser-supplied tenant/role/purpose/classification/provider values confer no",
    "+authority. Provider results remain untrusted until boundary and domain validation.",
    "+",
    "+Canonical files and provider-temporary processing objects are separate assets.",
    "+An authorized, minimized canonical source can be processed by an eligible AI",
    "+deployment; the resulting proposals return to the owning domain. AI is not a",
    "+file owner or a shortcut around Human review.",
    "+",
    "+## AI contracts, policy and replaceability",
    "+",
    "+- Features depend on a typed YUTA capability, not a provider/model selector.",
    "+  A capability literal determines its input and result at compile time. Runtime",
    "+  schema validation remains necessary. An API such as",
    "+  `execute(capability: string, input: unknown): unknown` is not the agreed design.",
    "+- Capability version identifies the business contract: fields, semantics,",
    "+  validation and observable guarantees. Changing only model, prompt or deployment",
    "+  does not automatically increment it. A changed business contract does.",
    "+- Prompt, dataset/evaluator, adapter/deployment/model and policy have independent",
    "+  identities and versions/hashes. Do not use capability @1 as a proxy for prompt",
    "+  v4, configuration revision or a qualification date.",
    "+- Eligibility determines which deployments are permitted for the exact capability,",
    "+  purpose, data class, modality, governance and mandatory technical/evaluation",
    "+  requirements. Selection chooses only within that eligible set. Cost, latency",
    "+  or quality optimization cannot add permission or expand the set.",
    "+- Initial selection is deterministic static mapping over versioned server-side",
    "+  configuration. Empty eligibility or missing/ineligible mapping fails closed",
    "+  before invocation. No registry database, dynamic router or model marketplace",
    "+  is needed for Slice 1.",
    "+- Model identity, provider identity and actual deployment/processing location are",
    "+  different concepts. Model or brand names do not establish EU processing,",
    "+  retention, DPA, training policy or approval for a data class.",
    "+- Portability is dependency inversion, not proof that models produce equivalent",
    "+  quality. A provider/model change can require adapter-specific prompts,",
    "+  evaluation and qualification while the feature contract stays unchanged.",
    "+- A controlled fallback can be considered later only with explicit policy and",
    "+  eligibility for the exact fallback deployment. Slice 1 implements neither",
    "+  fallback nor shadow. A failure must not silently send data to another provider.",
    "+- Shadow evaluation is a separate processing purpose and requires its own",
    "+  authorization, minimization and eligible deployment. Pseudonymization is not",
    "+  proof of anonymization. Discarding the candidate result does not authorize",
    "+  transmitting real HR or other restricted data.",
    "+",
    "+Start inside `apps/backoffice/src/server/ai/` with the existing Personnel",
    "+consumer. Extract a shared package or service only when actual second-consumer",
    "+requirements justify it and accepted runtime/data boundaries remain intact.",
    "+There is no approved new AI consumer in Reviews, Content, Restaurant Knowledge,",
    "+POS or Display from this architecture discussion alone.",
    "+",
    "+## Evaluation and observations",
    "+",
    "+Retain reproducible evaluation identities: capability contract version,",
    "+dataset/version/hash, prompt/version/hash, evaluator/version, adapter and exact",
    "+deployment/model, policy version and run context. Assess quality by relevant",
    "+field/source correctness, schema compliance, abstention and wrong high-confidence",
    "+answers, alongside latency, failures, usage and cost. Cost comparisons need a",
    "+dated rate-card version. A single generic AI score does not establish suitability.",
    "+",
    "+Slice 1 reuses current synthetic adapters, prompt and evaluation evidence. Its",
    "+acceptance uses deterministic/mocked execution and fake provider responses;",
    "+no live benchmark or paid provider request is required. A future live model",
    "+experiment needs a separately bounded request and its required approvals.",
    "+",
    "+Minimum execution observations identify capability, deployment and policy",
    "+versions, bounded outcome/denial codes, latency and usage when available. Do not",
    "+log source bytes, prompts/responses/excerpts, secrets, paths/object keys or",
    "+employee/document/tenant identifiers. Best-effort observation must not change",
    "+the result or swallow mandatory domain audit/review failures. No external",
    "+logging service or new persistence is part of Slice 1.",
    "+",
    "+## Storage identity, quarantine and lifecycle",
    "+",
    "+The authorized access chain is actor -> trusted tenant context -> business",
    "+resource authorization -> domain metadata -> server-side locator -> storage.",
    "+Metadata belongs to the owning domain repository. Storage keys, URLs, prefixes,",
    "+checksums and provider file IDs are not business identity or permission.",
    "+",
    "+Preserve the existing Personnel quarantine port:",
    "+",
    "+```text",
    "+putQuarantinedObject",
    "+readQuarantinedObject",
    "+promoteVerifiedObject",
    "+openAvailableObject",
    "+removeObject",
    "+```",
    "+",
    "+Replacing it with generic put/get operations must not erase the security",
    "+boundary. Successful upload or physical object existence does not mean the file",
    "+is available. Validation/scanning precedes promotion. A scanner outage/failure",
    "+does not grant availability; rejection is a separate outcome with cleanup.",
    "+",
    "+The agreed conceptual availability lifecycle is:",
    "+",
    "+```text",
    "+QUARANTINED -> AVAILABLE -> DELETING -> DELETED",
    "+```",
    "+",
    "+These are design semantics for future extraction/provider work, not four",
    "+already implemented database states. Retention and legal hold are independent",
    "+policy dimensions; `RETAINED` is not a required availability state. Failed",
    "+physical deletion remains pending/`DELETING`, not successful deletion.",
    "+",
    "+Deletion distinguishes immediate logical access revocation, canonical object",
    "+cleanup, derived artifacts, provider-temporary data, metadata/tombstone policy",
    "+and backup expiry. A future `DELETED` assertion must define its application",
    "+scope; it must not promise that every byte in all backups disappeared instantly.",
    "+Exact retention/hold/tombstone and backup-expiry rules require later domain and",
    "+operational decisions, not assumptions in an adapter.",
    "+",
    "+## Access and provider-temporary objects",
    "+",
    "+Private storage is the default. Authorize before issuing a signed URL. After",
    "+issuance it is delegated bearer access governed by signature and expiry;",
    "+revoking membership does not necessarily invalidate an outstanding URL",
    "+immediately. Server-proxied access remains valuable for sensitive HR documents",
    "+when authorization must be rechecked for each access. Do not switch all",
    "+downloads to signed URLs as an automatic storage refactor.",
    "+",
    "+An AI provider Files API, when required later, is a temporary processing facility",
    "+with a separate cleanup/retention obligation. Its file ID must never replace the",
    "+canonical YUTA locator. Provider change must not require migrating canonical",
    "+documents. Direct request input also does not prove zero retention; contractual",
    "+and endpoint-specific evidence remains required.",
    "+",
    "+Do not create a generic files database or relocate every file automatically.",
    "+Preserve domain-specific identity and ownership. In particular, Formalités'",
    "+canonical textual legal-template `bytea` source and immutable version binding",
    "+are a deliberate current exception; they are not an implicit migration target",
    "+for object storage. Cloud, POS and Display retain separate persistence,",
    "+credentials, failure domains and runtime owners.",
    "+",
    "+## Provider qualification and remaining decisions",
    "+",
    "+Qualification is scoped to provider + service + endpoint + actual deployment /",
    "+configuration + capability + purpose + data class + modality. It is not a",
    "+blanket `provider: APPROVED` flag. Applicable evidence includes processing",
    "+locations, DPA/subprocessors/transfers, retention/training/abuse-monitoring",
    "+exceptions, access, deletion, encryption, incident and exit arrangements,",
    "+accountable review and technical/evaluation constraints.",
    "+",
    "+The concept includes evidence references, reviewed-at and review-due/validity",
    "+semantics. Real-data eligibility fails closed when review is overdue or a",
    "+material service/configuration/contract change has not been reviewed. No cron",
    "+or automatic monitoring is needed in V1; that omission leaves a manual",
    "+operational monitoring responsibility, not permanent approval.",
    "+",
    "+Use the existing [readiness register](../operations/PRODUCTION_READINESS.md):",
    "+`VEND-01`/`VEND-02`, `AI-01`–`AI-04`, `HR-STORE-01` and `HR-SCAN-01`, with the",
    "+appropriate owning reviewers. Do not introduce a competing approval register.",
    "+Actual contracts, account/project identifiers, signed reviews and sensitive",
    "+evidence remain in a controlled private vault. Git contains allowed",
    "+non-confidential conclusions and opaque evidence references, not private URLs,",
    "+vault paths, credentials or personal documents.",
    "+",
    "+AI and Storage qualification may proceed in parallel as governance prerequisites.",
    "+Neither is an ordinary implementation checkbox or an outcome of a synthetic",
    "+technical test. Provider selection remains undecided; existing OpenAI synthetic",
    "+integration is not production-provider selection. Mistral, Scaleway, OVH,",
    "+Cloudflare, OpenAI or another candidate has not won through this discussion.",
    "+",
    "+Later Human/qualified-owner decisions still include exact provider/service /",
    "+configuration and evidence; real-data purpose/classes and processing controls;",
    "+production storage/scanner/access/retention/backup/exit operations; and bounded",
    "+real-data/production activation. These do not block offline Slice 1 planning.",
    "+",
    "+## Delivery sequence and exclusions",
    "+",
    "+| Stage   | Agreed direction                                                                                           | Execution status                                             |",
    "+| ------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |",
    "+| 1       | Typed capability/configuration/policy and minimum observations for existing synthetic Personnel extraction | Planning complete; implementation not started                |",
    "+| 2       | Broader reproducible evaluation/observations only when justified                                           | Separate future scope; reuse current evidence first          |",
    "+| 3       | Preserve and extract the storage port/quarantine boundary for an actual storage slice                      | Architecture agreed; implementation not started              |",
    "+| 4A / 4B | AI and Storage provider qualification, potentially in parallel                                             | Separate governance/evidence work; no provider selected      |",
    "+| 5       | Qualified canonical-storage adapter and operations                                                         | Future independently bounded implementation                  |",
    "+| 6       | AI adapter change if the existing adapter is not the qualified target                                      | Future qualified/evaluated implementation                    |",
    "+| 7       | First explicitly approved real-data capability                                                             | Remains prohibited until all applicable decisions/gates pass |",
    "+| 8       | Second provider when a real need justifies it                                                              | Deferred                                                     |",
    "+",
    "+Later candidates include approved fallback, shadow evaluation, dynamic routing,",
    "+direct browser object-storage upload, broader file metadata and qualification",
    "+monitoring/cost optimization. They are not included in the current foundation.",
    "+Do not build a separate AI gateway/microservice, registry DB/admin model selector,",
    "+generic AI platform/files database, autonomous compliance engine, new queue",
    "+infrastructure or speculative shared package now.",
    "+",
    "+## Exact Slice 1 and continuing in another chat",
    "+",
    "+Slice 1 is `personnel.contract.extract_fields@1` in Backoffice server, using",
    "+existing Personnel request/review contracts, synthetic domain context,",
    "+eligibility, static selection, versioned deployment configuration, the existing",
    "+adapter and minimal sanitized observations. Preserve current Luna/v4,",
    "+deterministic default, development-only guards, authorization before bytes and",
    "+provider effects, exact document/employee versions, source guards, rate limit,",
    "+timeout, audit, review expiry and bounded Human apply. Upload attestation checks",
    "+approved source controls; it does not prove fictional or anonymized content.",
    "+",
    "+Real/unknown classification and non-development execution are denied. No",
    "+Storage, new provider/model/prompt/key/dependency/schema/UI, fallback/shadow,",
    "+live API acceptance, real-data or production operation is part of Slice 1.",
    "+",
    "+Planning delivery commit: `f5aaba21128ca50239c3501f83940215c3069421`.",
    "+Five artifacts and thirteen unchecked implementation tasks are retained in",
    "+`openspec/changes/ai-synthetic-contract-foundation/`. Exact",
    "+[Gate 1](../reviews/ai-synthetic-contract-foundation/01-analysis-review.md),",
    "+[Gate 2](../reviews/ai-synthetic-contract-foundation/02-specs-review.md) and",
    "+[Sensitive Design](../reviews/ai-synthetic-contract-foundation/02b-design-review.md)",
    "+packets record delegated independent approval of planning only. No Apply,",
    "+implementation VERIFY/QA, Gate 3, sync or archive has occurred for this change.",
    "+Raw OpenSpec planning-complete status does not establish implementation completion.",
    "+",
    "+For a fresh chat with this repository:",
    "+",
    "+1. Read root/scoped instructions, `docs/README.md`, current-state routing and",
    "+   this document; then the owning feature/runtime/operations sources below.",
    "+2. For the same Slice 1 task, read its Proposal/Analysis/Specs/Design/Tasks and",
    "+   all earlier review packets. Recheck exact path/hash sets and current",
    "+   `openspec status --change ai-synthetic-contract-foundation --json`.",
    "+3. Preserve historical approvals and confirm current branch/HEAD/index/dirty",
    "+   paths and implementation source drift. Prior checkout snapshots are dated",
    "+   evidence, not permission to reset or overwrite other work.",
    "+4. The same task retains `CODEX_ONLY` and `COMMIT_AFTER_TASK: YES`, selected by",
    "+   the actual current user on 2026-10-03. The user's later knowledge-preservation",
    "+   request authorizes this documentation follow-up, not runtime Apply. Continue",
    "+   implementation only on a separately bounded current-user instruction.",
    "+5. A different task selects its own collaboration/commit choices under root",
    "+   instructions. Storage/qualification/other consumers need their own discovery",
    "+   and bounded request; agreement here does not auto-create a change or approve",
    "+   provider effects, sync/archive, real data or deployment.",
    "+",
    "+This file is the stable source for the shared direction. Keep task progress in",
    "+the existing Tasks/review records, specific behavior in approved normative main",
    "+specs when promoted, and actual readiness in its register. Update the relevant",
    "+source when decisions or evidence change instead of adding a second architecture",
    "+home or depending on old chat memory.",
    "+",
    "+## Repository evidence and routing",
    "+",
    "+- [Runtime architecture](OVERVIEW.md), [database separation](DATABASE_BOUNDARIES.md),",
    "+  [tenancy](TENANCY.md), [ADR-003](../decisions/ADR-003-database-ownership-boundaries.md),",
    "+  [ADR-009 exposure](../decisions/ADR-009-release-a-customer-exposure.md).",
    "+- [Personnel Home](../features/personnel/README.md),",
    "+  [provider eligibility/evaluation history](../operations/OPENAI_PROVIDER_ELIGIBILITY.md),",
    "+  [readiness](../operations/PRODUCTION_READINESS.md).",
    "+- [Extraction service](../../apps/backoffice/src/server/personnel-contract-extraction/service.ts),",
    "+  [runtime](../../apps/backoffice/src/server/personnel-contract-extraction/runtime.ts),",
    "+  [raw provider adapter](../../apps/backoffice/src/server/personnel-contract-extraction/openai-adapter.ts),",
    "+  [stored synthetic guards](../../apps/backoffice/src/server/personnel-contract-extraction/stored-synthetic-document.ts),",
    "+  [Personnel contracts](../../packages/contracts/src/personnel/index.ts).",
    "+- [Current Personnel storage/scanner port](../../apps/backoffice/src/server/personnel-documents/runtime.ts),",
    "+  [authorized private download route](../../apps/backoffice/src/app/api/personnel/documents/%5BemployeeId%5D/%5BdocumentId%5D/route.ts),",
    "+  [Formalités source schema](../../packages/db-cloud/src/schema/formalites-legal-templates.ts),",
    "+  [exact-version repository](../../packages/db-cloud/src/formalites-legal-template-repository.ts).",
    "+",
    "+These sources distinguish existing implementation from the future architectural",
    "+direction. Actual deployed environment, provider contracts and production",
    "+qualification require dated evidence beyond this repository record."
  ]
}
````
