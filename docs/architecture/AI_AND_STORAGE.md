# AI and File Storage Architecture

Status: Current

Visibility: Engineering

Owner: YUTA engineering; business domains retain their own authorization and data ownership

Last reviewed: 2026-10-03

## Scope, agreement and authority

This is the durable repository entry point for the AI and Storage direction
consolidated in the current-user architecture discussion on 2026-10-03. The user
authorized Slice 1 implementation planning, then explicitly requested preserving
the whole agreed AI/Storage knowledge so another Codex chat can discover and
continue it without this conversation.

Architecture direction is agreed. Slice 1 now has a bounded server implementation
with offline synthetic verification; its active change retains final review and
delivery evidence. Storage implementation is a separate future slice. Agreement on
technical direction grants no real-data, provider, production or deployment
authorization. The discussion's external critique documents are provenance and
advice, not vendor/legal evidence or independent approval sources.

Use the [Authority Model](../AUTHORITY_MODEL.md). Existing accepted runtime,
tenancy, database and exposure decisions remain controlling. This document
preserves the agreed direction and deferred decisions; it does not introduce an
accepted ADR that changes those boundaries, promote a lifecycle value, or make
an unsynced change spec normative. A future boundary-changing implementation
still requires its owning decision and accepted ADR.

The [Slice 1 change](../../openspec/changes/ai-synthetic-contract-foundation/proposal.md)
owns its exact requirement baseline; its Specs/Design/Tasks own the bounded
planning details. Do not duplicate or silently extend that baseline here. Do not
reopen the converged architecture without a demonstrated material repository or
authority conflict; record such a conflict and resolve it before dependent work.

## Core separation

```text
Business domain: authorization + trusted scope + purpose + data classification
  |
  +-> Versioned YUTA AI capability
  |     -> eligibility -> eligible set -> selection
  |     -> deployment -> provider adapter -> AI provider
  |     -> validated result -> domain / Human review and apply
  |
  +-> Domain file service -> domain-owned metadata -> server-side locator
        -> storage port -> adapter -> canonical YUTA storage
```

The business domain owns permission, resource scope, purpose, classification,
business schemas/semantics and final validation/apply. AI consumes and enforces
that context; it does not infer permission or classification from payloads.
Browser-supplied tenant/role/purpose/classification/provider values confer no
authority. Provider results remain untrusted until boundary and domain validation.

Canonical files and provider-temporary processing objects are separate assets.
An authorized, minimized canonical source can be processed by an eligible AI
deployment; the resulting proposals return to the owning domain. AI is not a
file owner or a shortcut around Human review.

## AI contracts, policy and replaceability

- Features depend on a typed YUTA capability, not a provider/model selector.
  A capability literal determines its input and result at compile time. Runtime
  schema validation remains necessary. An API such as
  `execute(capability: string, input: unknown): unknown` is not the agreed design.
- Capability version identifies the business contract: fields, semantics,
  validation and observable guarantees. Changing only model, prompt or deployment
  does not automatically increment it. A changed business contract does.
- Prompt, dataset/evaluator, adapter/deployment/model and policy have independent
  identities and versions/hashes. Do not use capability @1 as a proxy for prompt
  v4, configuration revision or a qualification date.
- Eligibility determines which deployments are permitted for the exact capability,
  purpose, data class, modality, governance and mandatory technical/evaluation
  requirements. Selection chooses only within that eligible set. Cost, latency
  or quality optimization cannot add permission or expand the set.
- Initial selection is deterministic static mapping over versioned server-side
  configuration. Empty eligibility or missing/ineligible mapping fails closed
  before invocation. No registry database, dynamic router or model marketplace
  is needed for Slice 1.
- Model identity, provider identity and actual deployment/processing location are
  different concepts. Model or brand names do not establish EU processing,
  retention, DPA, training policy or approval for a data class.
- Portability is dependency inversion, not proof that models produce equivalent
  quality. A provider/model change can require adapter-specific prompts,
  evaluation and qualification while the feature contract stays unchanged.
- A controlled fallback can be considered later only with explicit policy and
  eligibility for the exact fallback deployment. Slice 1 implements neither
  fallback nor shadow. A failure must not silently send data to another provider.
- Shadow evaluation is a separate processing purpose and requires its own
  authorization, minimization and eligible deployment. Pseudonymization is not
  proof of anonymization. Discarding the candidate result does not authorize
  transmitting real HR or other restricted data.

Start inside `apps/backoffice/src/server/ai/` with the existing Personnel
consumer. Extract a shared package or service only when actual second-consumer
requirements justify it and accepted runtime/data boundaries remain intact.
There is no approved new AI consumer in Reviews, Content, Restaurant Knowledge,
POS or Display from this architecture discussion alone.

## Evaluation and observations

Retain reproducible evaluation identities: capability contract version,
dataset/version/hash, prompt/version/hash, evaluator/version, adapter and exact
deployment/model, policy version and run context. Assess quality by relevant
field/source correctness, schema compliance, abstention and wrong high-confidence
answers, alongside latency, failures, usage and cost. Cost comparisons need a
dated rate-card version. A single generic AI score does not establish suitability.

Slice 1 reuses current synthetic adapters, prompt and evaluation evidence. Its
acceptance uses deterministic/mocked execution and fake provider responses;
no live benchmark or paid provider request is required. A future live model
experiment needs a separately bounded request and its required approvals.

Minimum execution observations identify capability, deployment and policy
versions, bounded outcome/denial codes, latency and usage when available. Do not
log source bytes, prompts/responses/excerpts, secrets, paths/object keys or
employee/document/tenant identifiers. Best-effort observation must not change
the result or swallow mandatory domain audit/review failures. No external
logging service or new persistence is part of Slice 1.

## Storage identity, quarantine and lifecycle

The authorized access chain is actor -> trusted tenant context -> business
resource authorization -> domain metadata -> server-side locator -> storage.
Metadata belongs to the owning domain repository. Storage keys, URLs, prefixes,
checksums and provider file IDs are not business identity or permission.

Preserve the existing Personnel quarantine port:

```text
putQuarantinedObject
readQuarantinedObject
promoteVerifiedObject
openAvailableObject
removeObject
```

Replacing it with generic put/get operations must not erase the security
boundary. Successful upload or physical object existence does not mean the file
is available. Validation/scanning precedes promotion. A scanner outage/failure
does not grant availability; rejection is a separate outcome with cleanup.

The agreed conceptual availability lifecycle is:

```text
QUARANTINED -> AVAILABLE -> DELETING -> DELETED
```

These are design semantics for future extraction/provider work, not four
already implemented database states. Retention and legal hold are independent
policy dimensions; `RETAINED` is not a required availability state. Failed
physical deletion remains pending/`DELETING`, not successful deletion.

Deletion distinguishes immediate logical access revocation, canonical object
cleanup, derived artifacts, provider-temporary data, metadata/tombstone policy
and backup expiry. A future `DELETED` assertion must define its application
scope; it must not promise that every byte in all backups disappeared instantly.
Exact retention/hold/tombstone and backup-expiry rules require later domain and
operational decisions, not assumptions in an adapter.

## Access and provider-temporary objects

Private storage is the default. Authorize before issuing a signed URL. After
issuance it is delegated bearer access governed by signature and expiry;
revoking membership does not necessarily invalidate an outstanding URL
immediately. Server-proxied access remains valuable for sensitive HR documents
when authorization must be rechecked for each access. Do not switch all
downloads to signed URLs as an automatic storage refactor.

An AI provider Files API, when required later, is a temporary processing facility
with a separate cleanup/retention obligation. Its file ID must never replace the
canonical YUTA locator. Provider change must not require migrating canonical
documents. Direct request input also does not prove zero retention; contractual
and endpoint-specific evidence remains required.

Do not create a generic files database or relocate every file automatically.
Preserve domain-specific identity and ownership. In particular, Formalités'
canonical textual legal-template `bytea` source and immutable version binding
are a deliberate current exception; they are not an implicit migration target
for object storage. Cloud, POS and Display retain separate persistence,
credentials, failure domains and runtime owners.

## Provider qualification and remaining decisions

Qualification is scoped to provider + service + endpoint + actual deployment /
configuration + capability + purpose + data class + modality. It is not a
blanket `provider: APPROVED` flag. Applicable evidence includes processing
locations, DPA/subprocessors/transfers, retention/training/abuse-monitoring
exceptions, access, deletion, encryption, incident and exit arrangements,
accountable review and technical/evaluation constraints.

The concept includes evidence references, reviewed-at and review-due/validity
semantics. Real-data eligibility fails closed when review is overdue or a
material service/configuration/contract change has not been reviewed. No cron
or automatic monitoring is needed in V1; that omission leaves a manual
operational monitoring responsibility, not permanent approval.

Use the existing [readiness register](../operations/PRODUCTION_READINESS.md):
`VEND-01`/`VEND-02`, `AI-01`–`AI-04`, `HR-STORE-01` and `HR-SCAN-01`, with the
appropriate owning reviewers. Do not introduce a competing approval register.
Actual contracts, account/project identifiers, signed reviews and sensitive
evidence remain in a controlled private vault. Git contains allowed
non-confidential conclusions and opaque evidence references, not private URLs,
vault paths, credentials or personal documents.

AI and Storage qualification may proceed in parallel as governance prerequisites.
Neither is an ordinary implementation checkbox or an outcome of a synthetic
technical test. Provider selection remains undecided; existing OpenAI synthetic
integration is not production-provider selection. Mistral, Scaleway, OVH,
Cloudflare, OpenAI or another candidate has not won through this discussion.

Later Human/qualified-owner decisions still include exact provider/service /
configuration and evidence; real-data purpose/classes and processing controls;
production storage/scanner/access/retention/backup/exit operations; and bounded
real-data/production activation. These do not block offline Slice 1 planning.

## Delivery sequence and exclusions

| Stage   | Agreed direction                                                                                           | Execution status                                             |
| ------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| 1       | Typed capability/configuration/policy and minimum observations for existing synthetic Personnel extraction | Server implementation; offline synthetic evidence            |
| 2       | Broader reproducible evaluation/observations only when justified                                           | Separate future scope; reuse current evidence first          |
| 3       | Preserve and extract the storage port/quarantine boundary for an actual storage slice                      | Architecture agreed; implementation not started              |
| 4A / 4B | AI and Storage provider qualification, potentially in parallel                                             | Separate governance/evidence work; no provider selected      |
| 5       | Qualified canonical-storage adapter and operations                                                         | Future independently bounded implementation                  |
| 6       | AI adapter change if the existing adapter is not the qualified target                                      | Future qualified/evaluated implementation                    |
| 7       | First explicitly approved real-data capability                                                             | Remains prohibited until all applicable decisions/gates pass |
| 8       | Second provider when a real need justifies it                                                              | Deferred                                                     |

Later candidates include approved fallback, shadow evaluation, dynamic routing,
direct browser object-storage upload, broader file metadata and qualification
monitoring/cost optimization. They are not included in the current foundation.
Do not build a separate AI gateway/microservice, registry DB/admin model selector,
generic AI platform/files database, autonomous compliance engine, new queue
infrastructure or speculative shared package now.

## Exact Slice 1 and continuing in another chat

Slice 1 is `personnel.contract.extract_fields@1` in Backoffice server, using
existing Personnel request/review contracts, synthetic domain context,
eligibility, static selection, versioned deployment configuration, the existing
adapter and minimal sanitized observations. Preserve current Luna/v4,
deterministic default, development-only guards, authorization before bytes and
provider effects, exact document/employee versions, source guards, rate limit,
timeout, audit, review expiry and bounded Human apply. Upload attestation checks
approved source controls; it does not prove fictional or anonymized content.

Real/unknown classification and non-development execution are denied. No
Storage, new provider/model/prompt/key/dependency/schema/UI, fallback/shadow,
live API acceptance, real-data or production operation is part of Slice 1.

Planning delivery commit: `f5aaba21128ca50239c3501f83940215c3069421`.
Five planning artifacts and the implementation task/evidence record are retained in
`openspec/changes/ai-synthetic-contract-foundation/`. Exact
[Gate 1](../reviews/ai-synthetic-contract-foundation/01-analysis-review.md),
[Gate 2](../reviews/ai-synthetic-contract-foundation/02-specs-review.md) and
[Sensitive Design](../reviews/ai-synthetic-contract-foundation/02b-design-review.md)
packets retain delegated independent approval of planning only. The current user
separately authorized Slice 1 Apply/tests/documentation/VERIFY/non-browser QA and
local commit → push → PR → checks → merge on 2026-10-03. Current implementation
progress and exact review/QA/check outcomes live in the
[Tasks record](../../openspec/changes/ai-synthetic-contract-foundation/tasks.md);
planning approval and raw CLI readiness do not establish completion. Sync/archive
remain separately unauthorized. No real-data/provider/production activation is
included.

For a fresh chat with this repository:

1. Read root/scoped instructions, `docs/README.md`, current-state routing and
   this document; then the owning feature/runtime/operations sources below.
2. For the same Slice 1 task, read its Proposal/Analysis/Specs/Design/Tasks and
   all earlier review packets. Recheck exact path/hash sets and current
   `openspec status --change ai-synthetic-contract-foundation --json`.
3. Preserve historical approvals and confirm current branch/HEAD/index/dirty
   paths and implementation source drift. Prior checkout snapshots are dated
   evidence, not permission to reset or overwrite other work.
4. The same task retains `CODEX_ONLY` and `COMMIT_AFTER_TASK: YES`, selected by
   the actual current user on 2026-10-03. The user's later knowledge-preservation
   request authorized documentation only. A subsequent current-user request
   explicitly authorized Slice 1 Apply and bounded GitHub delivery; consult the
   current Tasks/review evidence and exact checkout binding before continuing.
   That authorization still excludes sync/archive, deployment and broader scope.
5. A different task selects its own collaboration/commit choices under root
   instructions. Storage/qualification/other consumers need their own discovery
   and bounded request; agreement here does not auto-create a change or approve
   provider effects, sync/archive, real data or deployment.

This file is the stable source for the shared direction. Keep task progress in
the existing Tasks/review records, specific behavior in approved normative main
specs when promoted, and actual readiness in its register. Update the relevant
source when decisions or evidence change instead of adding a second architecture
home or depending on old chat memory.

## Repository evidence and routing

- [Runtime architecture](OVERVIEW.md), [database separation](DATABASE_BOUNDARIES.md),
  [tenancy](TENANCY.md), [ADR-003](../decisions/ADR-003-database-ownership-boundaries.md),
  [ADR-009 exposure](../decisions/ADR-009-release-a-customer-exposure.md).
- [Personnel Home](../features/personnel/README.md),
  [provider eligibility/evaluation history](../operations/OPENAI_PROVIDER_ELIGIBILITY.md),
  [readiness](../operations/PRODUCTION_READINESS.md).
- [Extraction service](../../apps/backoffice/src/server/personnel-contract-extraction/service.ts),
  [runtime](../../apps/backoffice/src/server/personnel-contract-extraction/runtime.ts),
  [raw provider adapter](../../apps/backoffice/src/server/personnel-contract-extraction/openai-adapter.ts),
  [stored synthetic guards](../../apps/backoffice/src/server/personnel-contract-extraction/stored-synthetic-document.ts),
  [Personnel contracts](../../packages/contracts/src/personnel/index.ts).
- [Current Personnel storage/scanner port](../../apps/backoffice/src/server/personnel-documents/runtime.ts),
  [authorized private download route](../../apps/backoffice/src/app/api/personnel/documents/%5BemployeeId%5D/%5BdocumentId%5D/route.ts),
  [Formalités source schema](../../packages/db-cloud/src/schema/formalites-legal-templates.ts),
  [exact-version repository](../../packages/db-cloud/src/formalites-legal-template-repository.ts).

These sources distinguish existing implementation from the future architectural
direction. Actual deployed environment, provider contracts and production
qualification require dated evidence beyond this repository record.
