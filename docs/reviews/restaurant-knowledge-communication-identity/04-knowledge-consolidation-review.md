# Knowledge Consolidation Review

Change: `restaurant-knowledge-communication-identity`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-02T21:15:40.1405849+02:00`

Apply status: `COMPLETED`

Completed: `2026-09-02T21:15:40.1405849+02:00`

Workflow status: `DONE`

`RELEASE_FOLLOW_UP: NOT_REQUIRED`

Classification: `UPDATE_REQUIRED`

Archive:
`openspec/changes/archive/2026-09-02-restaurant-knowledge-communication-identity`

## Why reconciliation is required

The archived, normative Communication Identity specification and the current
page implementation establish a fifth implemented Restaurant Knowledge slice.
The current high-level knowledge sources still enumerate only four implemented
slices or describe communication identity as future/unimplemented. Those
statements now conflict with the completed change.

Completed-change evidence:

- normative spec:
  `openspec/specs/restaurant-knowledge/communication-identity/spec.md`,
  SHA-256
  `156e0e05aa4a3b72145ffad5c3dc38ae5a73213a1744d679777850ace4cd7323`;
- archived delta spec SHA-256:
  `a6b0d54a741ad8ac17c668c0fe3f8f8b8927fc9e7e1747e760e91b1131db408f`;
- approved Gate 3 packet SHA-256:
  `2403370d2ea805c3351492e70683d43a1dbe43981366052bef547425da6bcef4`;
- Gate 3 implementation diff SHA-256:
  `d8fb9be29b2e072768db75d37fc92b545deca9d7702677fc3099ebb51708adb4`;
- Gate 3 migration diff SHA-256:
  `3ae21ff7313ac21222d969e3e71345edb8e54874ca69a75e51b8d97ddfeddd15`;
- the implementation-facing page pack already records the implemented
  Communication Identity behavior.

## Proposed target files and current-byte hashes

| Current target file | SHA-256 |
| --- | --- |
| `docs/PRODUCT_KNOWLEDGE.md` | `c5181ff077e91b35ceccbbf5ed6d8080b1a0baa8c1cede641c44567edbb8c155` |
| `docs/MODULE_REGISTRY.md` | `362f95b451f134b272cf6c35231f00bab7bbc9ea880a4d1fd856bdb2a98b38aa` |
| `docs/features/establishment/README.md` | `c2d573d66a99bf7c14de9ced9606257631940c3ec441b260c37ee088e7f0c8ae` |
| `docs/features/establishment/general-information/README.md` | `8d4beef46c67f4d4f05c2bd19e9e184d69524ad075d825ca2769cfc464666974` |

## Authority classification

Every proposed edit is post-archive as-built reconciliation against the
approved normative Communication Identity spec and current implementation
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
and four implemented Restaurant Knowledge slices: Concept/Histoire,
Cuisine/savoir-faire, Expérience client and Équipe & culture. Page composition
does not assign a shared data owner or permission boundary. Restaurant
Knowledge is their canonical owner, Organization is the tenancy/access
envelope, and dedicated READ/MANAGE authorization remains independent from
Establishment Profile. Remaining knowledge families and integrations must not
be inferred from the existing route.
NEW
The general-information page composes the implemented Establishment Profile
and five implemented Restaurant Knowledge slices: Concept/Histoire,
Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de
communication. Page composition does not assign a shared data owner or
permission boundary. Restaurant Knowledge is their canonical owner,
Organization is the tenancy/access envelope, and dedicated READ/MANAGE
authorization remains independent from Establishment Profile. Remaining
knowledge families and integrations must not be inferred from the existing
route.

FILE docs/MODULE_REGISTRY.md
OLD
Implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture slices plus future communication identity and validated restaurant knowledge
NEW
Implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication slices plus future validated restaurant knowledge
OLD
composed [`ConceptHistoryForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>), [`CuisineKnowHowForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx>), [`CustomerExperienceForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx>) and [`TeamCultureForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx>)
NEW
composed [`ConceptHistoryForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>), [`CuisineKnowHowForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx>), [`CustomerExperienceForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx>), [`TeamCultureForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx>) and [`CommunicationIdentityForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/communication-identity-form.tsx>)
OLD
Restaurant Knowledge — dedicated establishment-scoped tables/repository operations for all four implemented slices
NEW
Restaurant Knowledge — dedicated establishment-scoped tables/repository operations for all five implemented slices
OLD
`OK` for Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture; other Restaurant Knowledge families and excluded integrations remain unimplemented
NEW
`OK` for Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication; other Restaurant Knowledge families and excluded integrations remain unimplemented

FILE docs/features/establishment/README.md
OLD
Restaurant Knowledge is approved by ADR-007. Its bounded `Concept & histoire`,
`Cuisine & savoir-faire`, `Expérience client` and `Équipe & culture` content
slices and initial authorization are implemented through
NEW
Restaurant Knowledge is approved by ADR-007. Its bounded `Concept & histoire`,
`Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture` and `Identité
de communication` content slices and initial authorization are implemented
through
OLD
Agent, Display, Marketing/social or external-provider relationship.

Media upload/storage, image processing,
NEW
Agent, Display, Marketing/social or external-provider relationship.

Restaurant Knowledge also canonically owns `Ton & style de communication`,
`Façon de s’adresser aux clients` and `Éléments de langage & choses à éviter`.
These three independently optional descriptive establishment values support a
valid all-empty state, manual view/edit, one explicit whole-slice save and no
autosave. Their dedicated cloud persistence creates no Establishment Profile,
Marketing/Content, Reviews/Reputation, AI, Social/public publishing, external-
provider, CRM/customer, legal/compliance/moderation, POS, Site Agent or Display
relationship.

Media upload/storage, image processing,
OLD
Partially implemented capability: Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture support independent optional values, manual input/view/edit, valid empty state, one explicit save per slice, and no autosave; other knowledge families remain unimplemented.
NEW
Partially implemented capability: Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication support independent optional values, manual input/view/edit, valid empty state, one explicit save per slice, and no autosave; other knowledge families remain unimplemented.
OLD
Restaurant Knowledge canonically owns all four slices and their establishment-scoped persistence/domain boundaries
NEW
Restaurant Knowledge canonically owns all five slices and their establishment-scoped persistence/domain boundaries
OLD
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture slices; all other knowledge families and excluded integrations remain unimplemented
NEW
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication slices; all other knowledge families and excluded integrations remain unimplemented
OLD
Dedicated `restaurant_knowledge_concept_history`, `restaurant_knowledge_cuisine_know_how`, `restaurant_knowledge_customer_experience` and `restaurant_knowledge_team_culture` tables plus Restaurant Knowledge repository operations in `packages/db-cloud`
NEW
Dedicated `restaurant_knowledge_concept_history`, `restaurant_knowledge_cuisine_know_how`, `restaurant_knowledge_customer_experience`, `restaurant_knowledge_team_culture` and `restaurant_knowledge_communication_identity` tables plus Restaurant Knowledge repository operations in `packages/db-cloud`
OLD
Canonical owner of Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture.
NEW
Canonical owner of Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication.
OLD
Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture
  through dedicated cloud tables and repository operations.
NEW
Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and
  Identité de communication through dedicated cloud tables and repository
  operations.
OLD
Treat Restaurant Knowledge as the canonical owner of Concept/Histoire,
    Cuisine/savoir-faire, Expérience client and Équipe & culture and their
    persistence/domain boundaries. Keep them semantically
NEW
Treat Restaurant Knowledge as the canonical owner of Concept/Histoire,
    Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de
    communication and their persistence/domain boundaries. Keep them
    semantically
OLD
Normative Restaurant Knowledge specifications exist under `openspec/specs/`
for the accepted authorization, Concept/Histoire, Cuisine/savoir-faire,
Expérience client and Équipe & culture capabilities. This home retains broader
Product Knowledge context and ownership boundaries. Sync and archive do not
promote Environment, Production Readiness or any other lifecycle dimension.
NEW
Normative Restaurant Knowledge specifications exist under `openspec/specs/`
for the accepted authorization, Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture and Identité de communication capabilities.
This home retains broader Product Knowledge context and ownership boundaries.
Sync and archive do not promote Environment, Production Readiness or any other
lifecycle dimension.

FILE docs/features/establishment/general-information/README.md
OLD
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire`, `Expérience client` and `Équipe & culture`
slices are implemented in the repository; the other knowledge families remain
unimplemented.
NEW
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire`, `Expérience client`, `Équipe & culture`
and `Identité de communication` slices are implemented in the repository; the
other knowledge families remain unimplemented.
OLD
values form a fourth independent slice and create no employee-specific state,
training/onboarding status or operational-module/provider relationship.

### Approved initial Concept & histoire behavior
NEW
values form a fourth independent slice and create no employee-specific state,
training/onboarding status or operational-module/provider relationship.

Restaurant Knowledge is also the canonical owner of `Ton & style de
communication`, `Façon de s’adresser aux clients` and `Éléments de langage &
choses à éviter`, together with their persistence/domain boundary. These
establishment-level descriptive values form a fifth independent slice and
create no Profile, Marketing/Content, Reviews/Reputation, AI, Social/public,
provider, CRM/customer, legal/compliance/moderation or cross-runtime
relationship.

### Approved initial Concept & histoire behavior
OLD
### Ownership invariant
NEW
### Approved initial Identité de communication behavior

- view and manually edit `Ton & style de communication`;
- view and manually edit `Façon de s’adresser aux clients`;
- view and manually edit `Éléments de langage & choses à éviter`; and
- explicitly save the complete `Identité de communication` slice once.

The three descriptive values are independent and optional. Their all-empty
state is valid and changes remain browser-local until the explicit save. The
implementation uses the dedicated
`restaurant_knowledge_communication_identity` cloud table and whole-slice
Restaurant Knowledge repository operations under trusted organization and
establishment scope. It adds no Product validation, taxonomy, customer state,
AI/provider, publishing, moderation/legal, operational-module or cross-runtime
relationship.

### Ownership invariant
OLD
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture slices; communication identity, validated-knowledge workflows and every excluded integration remain unimplemented
NEW
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client, Équipe & culture and Identité de communication slices; validated-knowledge workflows and every excluded integration remain unimplemented
OLD
Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire,
Expérience client and Équipe & culture persistence/domain boundaries in
`packages/db-cloud`;
NEW
Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire,
Expérience client, Équipe & culture and Identité de communication
persistence/domain boundaries in `packages/db-cloud`;
OLD
The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire, Expérience client and Équipe & culture ownership, semantic
scope, optionality, empty state, manual view/edit, explicit-save and no-autosave
behavior. The
NEW
The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire, Expérience client, Équipe & culture and Identité de
communication ownership, semantic scope, optionality, empty state, manual
view/edit, explicit-save and no-autosave behavior. The
OLD
The bounded Concept & histoire, Cuisine & savoir-faire, Expérience client and
Équipe & culture slices are implemented as Restaurant Knowledge, not as
enhancements of Establishment Profile. Repository implementation does not prove environment
NEW
The bounded Concept & histoire, Cuisine & savoir-faire, Expérience client,
Équipe & culture and Identité de communication slices are implemented as
Restaurant Knowledge, not as enhancements of Establishment Profile. Repository
implementation does not prove environment
```
<!-- END EXACT PAYLOAD -->

Exact proposed-diff bytes SHA-256:
`7399268472d499f74c954695d806fcf6ff89e8ee412ca0324ceee4bb042369ee`

Replacement count: `22`

## Guardrails for the later approved apply

- Recheck the complete target path set and every current-byte hash above.
- Recheck the exact payload hash and `22`-replacement cardinality.
- Require every `OLD` block to match exactly once before mutation.
- Apply only the replacements in the approved payload.
- Run `pnpm docs:check`, `pnpm architecture:check` and any repository-required
  Knowledge Consolidation validator that actually exists.
- Do not modify main specs, archived artifacts, implementation, migrations or
  lifecycle values.
- Do not deploy or infer environment/readiness evidence.

## Approved apply result

The exact reviewed payload was applied sequentially without reinterpretation,
rewriting or formatting. All `22/22` replacements were applied to exactly the
four approved targets.

| Applied target | Pre-apply SHA-256 | Post-apply SHA-256 |
| --- | --- | --- |
| `docs/PRODUCT_KNOWLEDGE.md` | `c5181ff077e91b35ceccbbf5ed6d8080b1a0baa8c1cede641c44567edbb8c155` | `d4d6beca182ef261bb679b3daa97da99bd5cada3136d621dcc8cf054c87e7f28` |
| `docs/MODULE_REGISTRY.md` | `362f95b451f134b272cf6c35231f00bab7bbc9ea880a4d1fd856bdb2a98b38aa` | `8c9fb6d4e6a0d1e90ff8e73e5f01240309dc7614e606ddef9f364d8c4e44b83f` |
| `docs/features/establishment/README.md` | `c2d573d66a99bf7c14de9ced9606257631940c3ec441b260c37ee088e7f0c8ae` | `1a167e83c3263b6a9a4ab5a86f6a49c581bdf6e1a1e5f0a342a1553f58fb8c1e` |
| `docs/features/establishment/general-information/README.md` | `8d4beef46c67f4d4f05c2bd19e9e184d69524ad075d825ca2769cfc464666974` | `7fca76f70d4c844f9836ab34be17cbc5396353858cf9d8a11ec9a2bbc91eeb80` |

Verification evidence:

- exact proposed-diff payload SHA-256: `MATCH`
  (`7399268472d499f74c954695d806fcf6ff89e8ee412ca0324ceee4bb042369ee`);
- replacement cardinality: `22/22`;
- restricted four-path diff SHA-256:
  `50b8e518a92e4a458a2a1e8f9c9bc5311ae802a47be2840b33d67d1f339a37a3`;
- restricted diff sections: `4/4`;
- forward reconstruction against current bytes: `PASS`;
- reverse reconstruction against all four recorded pre-apply hashes: `PASS`;
- unrelated dirty-file manifest: `199/199` byte-identical, SHA-256
  `49755512092a7adb72a311e1290fad9c3b674a762d8c415f3f0b09beb74fd58d`;
- `pnpm docs:check`: `PASS` (36 current documents);
- `pnpm architecture:check`: `PASS`;
- no separate repository Knowledge Consolidation validator exists;
- targeted Prettier check: `docs/PRODUCT_KNOWLEDGE.md` passes; the other
  three approved targets retain the same pre-existing formatting warnings as
  their exact pre-apply bytes. No formatting mutation was authorized or made.

No normative spec, archived artifact, implementation, test, schema, migration,
permission, ownership, lifecycle/readiness value or document outside the
approved target and completion-record paths changed. No commit, push or deploy
was performed.
