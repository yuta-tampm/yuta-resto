# Knowledge Consolidation Review

Change: `restaurant-knowledge-validated-knowledge`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-03T09:50:11.0882559+02:00`

Apply status: `COMPLETED`

Completed: `2026-09-03T09:54:56.3504437+02:00`

Workflow status: `DONE`

`RELEASE_FOLLOW_UP: NOT_REQUIRED`

Classification: `UPDATE_REQUIRED`

Archive:
`openspec/changes/archive/2026-09-03-restaurant-knowledge-validated-knowledge`

## Why reconciliation is required

The archived, normative Validated Knowledge specification and the current page
implementation establish an implemented establishment-scoped collection of
manually accepted Restaurant Knowledge statements. The current high-level
knowledge sources still describe validated restaurant knowledge as future or
unimplemented and omit its current repository evidence. Those statements now
conflict with the completed change.

Completed-change evidence:

- normative spec:
  `openspec/specs/restaurant-knowledge/validated-knowledge/spec.md`, SHA-256
  `203d674ad3f0afc1b4462b5584ca597412e09bf0a2c40f9b7937d736d7a73a70`;
- archived delta spec SHA-256:
  `9fd953a0a931593137dcc3f2d7c420906e087fa395251e17fe7bfd7328e7445c`;
- completed Gate 3 packet SHA-256:
  `37e77fc7d4bbab66e5440312ba4012c879018a7f461df2a716bfc466c25875b1`;
- Gate 3 implementation diff SHA-256:
  `34f6a657202216d3e8e5bfcc20167b64dfe8581604f7c3d37b095bbe76b0840a`;
- Gate 3 migration diff SHA-256:
  `f0e58c0d65c20a79f11b059bbe9038528002ab1a4ec01547654570a20f34ab4e`;
- the implementation-facing page pack already records the implemented
  Validated Knowledge behavior.

## Proposed target files and current-byte hashes

| Current target file | SHA-256 |
| --- | --- |
| `docs/PRODUCT_KNOWLEDGE.md` | `d4d6beca182ef261bb679b3daa97da99bd5cada3136d621dcc8cf054c87e7f28` |
| `docs/MODULE_REGISTRY.md` | `8c9fb6d4e6a0d1e90ff8e73e5f01240309dc7614e606ddef9f364d8c4e44b83f` |
| `docs/features/establishment/README.md` | `1a167e83c3263b6a9a4ab5a86f6a49c581bdf6e1a1e5f0a342a1553f58fb8c1e` |
| `docs/features/establishment/general-information/README.md` | `7fca76f70d4c844f9836ab34be17cbc5396353858cf9d8a11ec9a2bbc91eeb80` |

## Authority classification

Every proposed edit is post-archive as-built reconciliation against the
approved normative Validated Knowledge spec and current implementation
evidence. It creates no Product Decision, permission, role, owner, durable
boundary, API, provider relationship, lifecycle promotion, environment claim
or readiness claim. Restaurant Knowledge remains canonical owner;
Organization remains the tenancy/access envelope; Environment remains
`NOT_ENABLED` and Production Readiness remains `NOT_ASSESSED`.

The edits touch Product Knowledge and the Module Registry but do not change a
cross-module or durable authority decision. If human review interprets any
replacement as such a change, route that replacement to Control Tower instead
of applying it.

## Exact proposed replacement payload

Apply the following sequential exact-match replacements only. Each `OLD` value
must match exactly once in the target's current bytes. Payload encoding is
UTF-8 with LF line endings. The payload hash covers only the bytes between the
`BEGIN EXACT PAYLOAD` and `END EXACT PAYLOAD` marker lines, including the final
LF before the end marker.

<!-- BEGIN EXACT PAYLOAD -->
```text
FILE docs/PRODUCT_KNOWLEDGE.md
OLD
The general-information page composes the implemented Establishment Profile
and five implemented Restaurant Knowledge slices: Concept/Histoire,
Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de
communication. Page composition does not assign a shared data owner or
permission boundary. Restaurant Knowledge is their canonical owner,
Organization is the tenancy/access envelope, and dedicated READ/MANAGE
authorization remains independent from Establishment Profile. Remaining
knowledge families and integrations must not be inferred from the existing
route.
NEW
The general-information page composes the implemented Establishment Profile,
five implemented Restaurant Knowledge descriptive slices—Concept/Histoire,
Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de
communication—and the implemented `Connaissances validées` item collection.
Page composition does not assign a shared data owner or permission boundary.
Restaurant Knowledge is their canonical owner, Organization is the
tenancy/access envelope, and dedicated READ/MANAGE authorization remains
independent from Establishment Profile. Remaining knowledge families and
integrations must not be inferred from the existing route.

FILE docs/MODULE_REGISTRY.md
OLD
Implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication slices plus future validated restaurant knowledge
NEW
Implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication descriptive slices plus the Connaissances validées item collection
OLD
composed [`ConceptHistoryForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>), [`CuisineKnowHowForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx>), [`CustomerExperienceForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx>), [`TeamCultureForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx>) and [`CommunicationIdentityForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx>)
NEW
composed [`ConceptHistoryForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>), [`CuisineKnowHowForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx>), [`CustomerExperienceForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx>), [`TeamCultureForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx>), [`CommunicationIdentityForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx>) and [`ValidatedKnowledgeSection`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/validated-knowledge-section.tsx>)
OLD
Restaurant Knowledge — dedicated establishment-scoped tables/repository operations for all five implemented slices
NEW
Restaurant Knowledge — dedicated establishment-scoped tables/repository operations for all five descriptive slices and the validated-item collection
OLD
`OK` for Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication; other Restaurant Knowledge families and excluded integrations remain unimplemented
NEW
`OK` for Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture, Identité de communication and Connaissances validées; other Restaurant Knowledge families and excluded integrations remain unimplemented

FILE docs/features/establishment/README.md
OLD
Restaurant Knowledge is approved by ADR-007. Its bounded `Concept & histoire`,
`Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture` and `Identité
de communication` content slices and initial authorization are implemented
through
NEW
Restaurant Knowledge is approved by ADR-007. Its bounded `Concept & histoire`,
`Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture` and `Identité
de communication` descriptive slices, its `Connaissances validées` item
collection and initial authorization are implemented through
OLD
relationship.

Media upload/storage, image processing,
NEW
relationship.

Restaurant Knowledge also canonically owns the current validated knowledge
items accepted manually by authorized restaurant humans. The establishment-
scoped collection supports zero, one or multiple independent statements,
item-scoped create/edit/physical remove, explicit save and no autosave. Saved
statements require at least one non-whitespace character while preserving
accepted text exactly. It creates no provenance/history, AI/inference,
automatic validation, downstream consumer, publishing, operational-module,
local-runtime or provider relationship.

Media upload/storage, image processing,
OLD
Partially implemented capability: Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication support independent optional values, manual input/view/edit, valid empty state, one explicit save per slice, and no autosave; other knowledge families remain unimplemented.
NEW
Partially implemented capability: five descriptive slices support independent optional values, manual input/view/edit, valid empty state, one explicit save per slice and no autosave; Connaissances validées supports zero, one or multiple independent manually accepted statements with item-scoped explicit create/edit/remove and no autosave; other knowledge families remain unimplemented.
OLD
Restaurant Knowledge canonically owns all five slices and their establishment-scoped persistence/domain boundaries; Organization is the tenancy/access envelope. Identity / Access owns permission integration.
NEW
Restaurant Knowledge canonically owns all five descriptive slices, the validated-item collection and their establishment-scoped persistence/domain boundaries; Organization is the tenancy/access envelope. Identity / Access owns permission integration.
OLD
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication slices; all other knowledge families and excluded integrations remain unimplemented
NEW
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture, Identité de communication and Connaissances validées capabilities; all other knowledge families and excluded integrations remain unimplemented
OLD
Dedicated `restaurant_knowledge_concept_history`, `restaurant_knowledge_cuisine_know_how`, `restaurant_knowledge_customer_experience`, `restaurant_knowledge_team_culture` and `restaurant_knowledge_communication_identity` tables plus Restaurant Knowledge repository operations in `packages/db-cloud`; page-local Backoffice server actions with no shared/API transport contract
NEW
Dedicated `restaurant_knowledge_concept_history`, `restaurant_knowledge_cuisine_know_how`, `restaurant_knowledge_customer_experience`, `restaurant_knowledge_team_culture`, `restaurant_knowledge_communication_identity` and `restaurant_knowledge_validated_items` tables plus Restaurant Knowledge repository operations in `packages/db-cloud`; page-local Backoffice server actions with no shared/API transport contract
OLD
Canonical owner of Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication. Organization is the tenancy/access envelope; Establishment Profile is not the data owner. Other knowledge families remain unimplemented.
NEW
Canonical owner of Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture, Identité de communication and the current validated-item collection. Organization is the tenancy/access envelope; Establishment Profile is not the data owner. Other knowledge families remain unimplemented.
OLD
- Restaurant Knowledge owns the implemented persistence/domain boundaries for
  Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and
  Identité de communication through dedicated cloud tables and repository
  operations. No shared API contract, Product content validation,
  provider, cross-runtime storage or other knowledge-family implementation is
  approved. Its READ/MANAGE matrix is implemented independently
  of Establishment Profile permissions. Company/legal data,
  automatic cross-module inference, detailed history/provenance, Marketing or
  social-content consumption, and social-profile link ownership remain outside
  its initial approved scope or `NEEDS REVIEW`.
NEW
- Restaurant Knowledge owns the implemented persistence/domain boundaries for
  Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture,
  Identité de communication and the validated-item collection through dedicated
  cloud tables and repository operations. Validated statements have only the
  approved non-whitespace content rule and preserve accepted text exactly. No
  shared API contract, provider, cross-runtime storage or other knowledge-family
  implementation is approved. Its READ/MANAGE matrix is implemented
  independently of Establishment Profile permissions. Company/legal data,
  automatic cross-module inference, detailed history/provenance, Marketing or
  social-content consumption, and social-profile link ownership remain outside
  its initial approved scope or `NEEDS REVIEW`.
OLD
10. Treat Restaurant Knowledge as the canonical owner of Concept/Histoire,
    Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de
    communication and their persistence/domain boundaries. Keep them
    semantically
    establishment-scoped with Organization as the tenancy/access envelope;
    never move them into Establishment Profile or infer access from profile
    code.
NEW
10. Treat Restaurant Knowledge as the canonical owner of Concept/Histoire,
    Cuisine/savoir-faire, Expérience client, Équipe & culture, Identité de
    communication, the current validated-item collection and their
    persistence/domain boundaries. Keep them semantically establishment-scoped
    with Organization as the tenancy/access envelope; never move them into
    Establishment Profile or infer access from profile code.
OLD
Normative Restaurant Knowledge specifications exist under `openspec/specs/`
for the accepted authorization, Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture and Identité de communication capabilities.
This home retains broader Product Knowledge context and ownership boundaries.
Sync and archive do not promote Environment, Production Readiness or any other
lifecycle dimension.
NEW
Normative Restaurant Knowledge specifications exist under `openspec/specs/`
for the accepted authorization, Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture, Identité de communication and Validated
Knowledge capabilities. This home retains broader Product Knowledge context
and ownership boundaries. Sync and archive do not promote Environment,
Production Readiness or any other lifecycle dimension.

FILE docs/features/establishment/general-information/README.md
OLD
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture`
and `Identité de communication` slices are implemented in the repository; the
other knowledge families remain unimplemented.
NEW
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture`
and `Identité de communication` descriptive slices and its `Connaissances
validées` item collection are implemented in the repository; the other
knowledge families remain unimplemented.
OLD
relationship.

### Approved initial Concept & histoire behavior
NEW
relationship.

Restaurant Knowledge is also the canonical owner of current validated
knowledge items manually accepted by authorized restaurant humans, together
with their persistence/domain boundary. These independently understandable
statements form an establishment-scoped collection and create no canonical
ownership, provenance/history, automation, publishing, consumer, module,
runtime or provider relationship outside Restaurant Knowledge.

### Approved initial Concept & histoire behavior
OLD
### Ownership invariant
NEW
### Approved initial Connaissances validées behavior

- list/view zero, one or multiple current validated statements;
- manually create a pending statement and explicitly save that item;
- manually edit an existing item and explicitly save that item; and
- mark one item for removal, undo locally or explicitly save its physical
  removal without replacing the whole list.

Each saved statement must contain at least one non-whitespace character.
Accepted surrounding whitespace is preserved exactly; blank create/edit fails
server-side validation and blank edit never means remove. Pending create,
edit, removal and failed save remain non-canonical, and no interaction
autosaves. The implementation uses the dedicated
`restaurant_knowledge_validated_items` cloud table, item-scoped Restaurant
Knowledge repository operations and server-generated technical identity under
trusted organization and establishment scope. It adds no provenance/history,
semantic duplicate detection, taxonomy, ordering, AI/provider, downstream
consumer, publishing, operational-module or cross-runtime relationship.

### Ownership invariant
OLD
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication slices; validated-knowledge workflows and every excluded integration remain unimplemented
NEW
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture, Identité de communication and Connaissances validées capabilities; other knowledge families and every excluded integration remain unimplemented
OLD
- detailed fields, schema, requiredness, enums, limits, or validation rules.
NEW
- additional validated-statement fields, requiredness, enums, length or
  formatting limits, or validation rules beyond at least one non-whitespace
  character.
OLD
Cloud, restaurant-local POS, and Display persistence remain separate under
ADR-003. Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture and Identité de communication
persistence/domain boundaries in `packages/db-cloud`;
their dedicated tables and repository operations are not part of Establishment
Profile. No API, provider, shared contract, local-runtime adapter,
history/provenance model, operational-module relationship or cross-runtime
synchronization exists for these slices.
NEW
Cloud, restaurant-local POS, and Display persistence remain separate under
ADR-003. Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture, Identité de communication and validated-
item persistence/domain boundaries in `packages/db-cloud`; their dedicated
tables and repository operations are not part of Establishment Profile. No API,
provider, shared contract, local-runtime adapter, history/provenance model,
operational-module relationship or cross-runtime synchronization exists for
these capabilities.
OLD
The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire, Expérience client, Équipe & culture and Identité de
communication ownership, semantic scope, optionality, empty state, manual
view/edit, explicit-save and no-autosave behavior. The
separate authorization capability resolves the initial READ/MANAGE permission
mapping.

The bounded implementation selects its dedicated cloud table, repository and
page-local server action without changing canonical ownership, tenant scope or
approved behavior. Product content validation, shared/API transport, history,
providers and other knowledge families remain outside this slice.
NEW
The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire, Expérience client, Équipe & culture and Identité de
communication descriptive-slice behavior and the item-scoped Connaissances
validées list/create/edit/remove behavior. The separate authorization
capability resolves the initial READ/MANAGE permission mapping.

The bounded implementation selects dedicated cloud tables, repository
operations and page-local server actions without changing canonical ownership,
tenant scope or approved behavior. Validated statements add only the approved
non-whitespace rule while preserving accepted text exactly. Shared/API
transport, expanded validation, history/provenance, providers and other
knowledge families remain outside these capabilities.
OLD
The bounded Concept & histoire, Cuisine & savoir-faire, Expérience client,
Équipe & culture and Identité de communication slices are implemented as
Restaurant Knowledge, not as enhancements of Establishment Profile. Repository
implementation does not prove environment
enablement or production readiness. This documentation does not authorize any
excluded knowledge family, consumer or integration.
NEW
The bounded Concept & histoire, Cuisine & savoir-faire, Expérience client,
Équipe & culture and Identité de communication descriptive slices and the
Connaissances validées item collection are implemented as Restaurant Knowledge,
not as enhancements of Establishment Profile. Repository implementation does
not prove environment enablement or production readiness. This documentation
does not authorize any excluded knowledge family, consumer or integration.
```
<!-- END EXACT PAYLOAD -->

Exact proposed-diff bytes SHA-256:
`94142527cadd932f38c8c4d772d329431272737c633c36e1d50e463083707368`

Replacement count: `23`

## Guardrails for the later approved apply

- Recheck the complete target path set and every current-byte hash above.
- Recheck the exact payload hash and `23`-replacement cardinality.
- Require every `OLD` block to match exactly once before mutation.
- Apply only the replacements in the approved payload.
- Run `pnpm docs:check`, `pnpm architecture:check` and any repository-required
  Knowledge Consolidation validator that actually exists.
- Do not modify main specs, archived artifacts, implementation, migrations or
  lifecycle values.
- Do not deploy or infer environment/readiness evidence.

## Approved apply result

The exact reviewed payload was applied sequentially without reinterpretation,
rewriting, normalization or broad formatting. All `23/23` replacements were
applied to exactly the four approved targets.

| Applied target | Pre-apply SHA-256 | Post-apply SHA-256 |
| --- | --- | --- |
| `docs/PRODUCT_KNOWLEDGE.md` | `d4d6beca182ef261bb679b3daa97da99bd5cada3136d621dcc8cf054c87e7f28` | `631063d324129b13d973a6a8b2cf691d67c14b83a1608d6281c371e57e7d053a` |
| `docs/MODULE_REGISTRY.md` | `8c9fb6d4e6a0d1e90ff8e73e5f01240309dc7614e606ddef9f364d8c4e44b83f` | `2d80bb2fd9e5f425f337f29a3e0e240a17ccc56ed0c81cf121a421f5b506b853` |
| `docs/features/establishment/README.md` | `1a167e83c3263b6a9a4ab5a86f6a49c581bdf6e1a1e5f0a342a1553f58fb8c1e` | `3faa9733f0422b39c1959758beb2e06ee2371810680eb89099e83da3b11da815` |
| `docs/features/establishment/general-information/README.md` | `7fca76f70d4c844f9836ab34be17cbc5396353858cf9d8a11ec9a2bbc91eeb80` | `2cd26adfe88321fb22d69d18d79f472faa0da49b9f1f7bcea2e212faf43cad62` |

Verification evidence:

- exact proposed-diff payload SHA-256: `MATCH`
  (`94142527cadd932f38c8c4d772d329431272737c633c36e1d50e463083707368`);
- replacement cardinality: `23/23`;
- restricted four-path diff SHA-256:
  `60716b8482a68fa4f1817d924f02caad280678a8cfd3da5b3d55d460d4a53115`;
- restricted diff sections and target set: `PASS (4/4)`;
- forward reconstruction against current bytes: `PASS`;
- reverse reconstruction against all four recorded pre-apply hashes: `PASS`;
- unrelated dirty/untracked files: `PASS (80/80 byte-identical)`;
- `pnpm docs:check`: `PASS` (36 current documents);
- `pnpm architecture:check`: `PASS`;
- dedicated repository Knowledge Consolidation validator: `NOT_PRESENT`;
- no normative spec, archived change artifact, implementation, test, schema,
  migration, permission, ownership, tenancy, lifecycle or readiness value was
  modified;
- no commit, push, deploy, Environment enablement or Production Readiness
  promotion was performed.
