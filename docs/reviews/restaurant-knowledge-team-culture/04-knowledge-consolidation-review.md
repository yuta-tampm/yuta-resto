# Knowledge Consolidation Review

Change: `restaurant-knowledge-team-culture`

Review status: `APPROVED`

Approval source: explicit current-user instruction

Approval recorded by: Codex workflow

Approved: `2026-09-02T16:20:55.3353462+02:00`

Approved payload SHA-256:
`3b4f08c1c8b05793e42ff53b2b2e2381f7f938de26abe25e34ee21e1e91e1fc9`

Approved replacement count: `23`

Classification: `UPDATE_REQUIRED`

Archive:
`openspec/changes/archive/2026-09-02-restaurant-knowledge-team-culture`

## Why reconciliation is required

The archived, normative Team Culture specification and the implemented page
pack establish a fourth implemented Restaurant Knowledge slice. The current
high-level knowledge sources still describe Restaurant Knowledge as
not-started, describe team/culture as future, or enumerate only three
implemented slices. These statements now conflict with the completed change.

Completed-change evidence:

- normative spec:
  `openspec/specs/restaurant-knowledge/team-culture/spec.md`, SHA-256
  `e4af63e50baed2262a18868fd8072ea050d494ce168cc1d0860322651f4d3166`;
- archived delta spec SHA-256:
  `0e7aa521a264b03cde23eefab5034d2b69019537809dd5a34f9b2b584d5b4d44`;
- Gate 3 implementation diff SHA-256:
  `bbf72495533f176e0f2454ce2de2e581882b053f9427d4431a31ffa53319766b`;
- Gate 3 migration diff SHA-256:
  `55e752347d9b1eb0aa2bb0fd46f6e68a0240164a5f3b274e218f66491e36122f`;
- page-pack evidence already records the implemented Team Culture behavior.

## Proposed target files and current-byte hashes

| Current target file | SHA-256 |
| --- | --- |
| `docs/PRODUCT_KNOWLEDGE.md` | `3ffbdd76b75b91f6afa5b1dec9d49d742de97cb4d71b12ded39bd5fdd1baffc3` |
| `docs/MODULE_REGISTRY.md` | `81505f5a9c10e2cccce5f0e7a199bd88e17496e25f976ef8527574395d90fde0` |
| `docs/features/establishment/README.md` | `f80f53bd393a297f856750f6f1723912b571e63f205a4fb3e018bce8b7c5c365` |
| `docs/features/establishment/general-information/README.md` | `251e93e445c24305f995cb2564f2ea0c65472277a2644270646ca8259ea67ce1` |

## Authority classification

Every proposed edit is a post-archive as-built reconciliation against the
approved normative Team Culture spec and current implementation evidence. It
does not create a Product Decision, permission, role, owner, durable boundary,
API, provider relationship, lifecycle promotion, environment claim or
readiness claim. Restaurant Knowledge remains canonical owner; Organization
remains the tenancy/access envelope; Environment remains `NOT_ENABLED` and
Production Readiness remains `NOT_ASSESSED`.

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
and the approved but not-started Restaurant Knowledge capability. Page
composition does not assign a shared data owner or permission boundary.
Restaurant Knowledge data ownership, operation-level permissions, and initial
data shape/behavior remain `NEEDS REVIEW`; do not infer implementation from the
existing route.
NEW
The general-information page composes the implemented Establishment Profile
and four implemented Restaurant Knowledge slices: Concept/Histoire,
Cuisine/savoir-faire, Expérience client and Équipe & culture. Page composition
does not assign a shared data owner or permission boundary. Restaurant
Knowledge is their canonical owner, Organization is the tenancy/access
envelope, and dedicated READ/MANAGE authorization remains independent from
Establishment Profile. Remaining knowledge families and integrations must not
be inferred from the existing route.

FILE docs/MODULE_REGISTRY.md
OLD
Implemented Concept/Histoire, Cuisine/savoir-faire and Expérience client slices plus future team/culture, communication identity, and validated restaurant knowledge
NEW
Implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture slices plus future communication identity and validated restaurant knowledge
OLD
composed [`ConceptHistoryForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>), [`CuisineKnowHowForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx>) and [`CustomerExperienceForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx>)
NEW
composed [`ConceptHistoryForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/concept-history-form.tsx>), [`CuisineKnowHowForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/cuisine-know-how-form.tsx>), [`CustomerExperienceForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/customer-experience-form.tsx>) and [`TeamCultureForm`](<../apps/backoffice/src/app/(authenticated)/etablissement/informations-generales/_components/team-culture-form.tsx>)
OLD
Restaurant Knowledge — dedicated establishment-scoped tables/repository operations for all three implemented slices
NEW
Restaurant Knowledge — dedicated establishment-scoped tables/repository operations for all four implemented slices
OLD
`OK` for Concept/Histoire, Cuisine/savoir-faire and Expérience client; other Restaurant Knowledge families and excluded integrations remain unimplemented
NEW
`OK` for Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture; other Restaurant Knowledge families and excluded integrations remain unimplemented

FILE docs/features/establishment/README.md
OLD
Restaurant Knowledge is approved by ADR-007. Its bounded `Concept & histoire`
and `Cuisine & savoir-faire` content slices and initial authorization are
implemented through
NEW
Restaurant Knowledge is approved by ADR-007. Its bounded `Concept & histoire`,
`Cuisine & savoir-faire`, `Expérience client` and `Équipe & culture` content
slices and initial authorization are implemented through
OLD
provider.

Media upload/storage, image processing,
NEW
provider.

Restaurant Knowledge also canonically owns `Valeurs & état d’esprit`, `Façon
de travailler ensemble` and `Transmission & intégration`. These three
independently optional descriptive establishment values support a valid
all-empty state, manual view/edit, one explicit whole-slice save and no
autosave. Their dedicated cloud persistence creates no Personnel, Planning,
Pointage, Today, Tâches du jour, Formalités, onboarding/training, POS, Site
Agent, Display, Marketing/social or external-provider relationship.

Media upload/storage, image processing,
OLD
Partially implemented capability: Concept/Histoire, Cuisine/savoir-faire and Expérience client support independent optional values, manual input/view/edit, valid empty state, one explicit save per slice, and no autosave; other knowledge families remain unimplemented.
NEW
Partially implemented capability: Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture support independent optional values, manual input/view/edit, valid empty state, one explicit save per slice, and no autosave; other knowledge families remain unimplemented.
OLD
Restaurant Knowledge canonically owns all three slices and their establishment-scoped persistence/domain boundaries
NEW
Restaurant Knowledge canonically owns all four slices and their establishment-scoped persistence/domain boundaries
OLD
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire and Expérience client slices; all other knowledge families and excluded integrations remain unimplemented
NEW
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture slices; all other knowledge families and excluded integrations remain unimplemented
OLD
Dedicated `restaurant_knowledge_concept_history`, `restaurant_knowledge_cuisine_know_how` and `restaurant_knowledge_customer_experience` tables plus Restaurant Knowledge repository operations in `packages/db-cloud`
NEW
Dedicated `restaurant_knowledge_concept_history`, `restaurant_knowledge_cuisine_know_how`, `restaurant_knowledge_customer_experience` and `restaurant_knowledge_team_culture` tables plus Restaurant Knowledge repository operations in `packages/db-cloud`
OLD
Canonical owner of Concept/Histoire, Cuisine/savoir-faire and Expérience client.
NEW
Canonical owner of Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture.
OLD
Concept/Histoire and Cuisine/savoir-faire through dedicated cloud tables and
  repository operations
NEW
Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture
  through dedicated cloud tables and repository operations
OLD
Treat Restaurant Knowledge as the canonical owner of Concept/Histoire and
    Cuisine/savoir-faire and their persistence/domain boundaries.
NEW
Treat Restaurant Knowledge as the canonical owner of Concept/Histoire,
    Cuisine/savoir-faire, Expérience client and Équipe & culture and their
    persistence/domain boundaries.
OLD
11. OpenSpec is not currently normative for Establishment.
NEW
11. Treat synced Restaurant Knowledge main specs as normative only inside their
    accepted bounded capabilities; they do not promote lifecycle state.
OLD
Normative Restaurant Knowledge specifications exist under `openspec/specs/`
for the accepted authorization and Concept/Histoire capabilities. This home
retains broader Product Knowledge context and ownership boundaries. The
bounded Cuisine/savoir-faire change follows the same accepted product,
architecture and security boundaries while remaining a separate slice. Its
delta specification is not normative until final human approval, sync and
archive; repository implementation alone does not change that status.
NEW
Normative Restaurant Knowledge specifications exist under `openspec/specs/`
for the accepted authorization, Concept/Histoire, Cuisine/savoir-faire,
Expérience client and Équipe & culture capabilities. This home retains broader
Product Knowledge context and ownership boundaries. Sync and archive do not
promote Environment, Production Readiness or any other lifecycle dimension.

FILE docs/features/establishment/general-information/README.md
OLD
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire` and `Expérience client` slices are
implemented in the repository; the other knowledge families remain
unimplemented.
NEW
Restaurant Knowledge is approved Product Intent. Its bounded `Concept &
histoire`, `Cuisine & savoir-faire`, `Expérience client` and `Équipe & culture`
slices are implemented in the repository; the other knowledge families remain
unimplemented.
OLD
values form a third independent slice; they are not operational/customer data
and establish no dependency or consumer relationship with another module.
NEW
values form a third independent slice; they are not operational/customer data
and establish no dependency or consumer relationship with another module.

Restaurant Knowledge is also the canonical owner of `Valeurs & état d’esprit`,
`Façon de travailler ensemble` and `Transmission & intégration`, together with
their persistence/domain boundary. These establishment-level descriptive
values form a fourth independent slice and create no employee-specific state,
training/onboarding status or operational-module/provider relationship.
OLD
### Ownership invariant
NEW
### Approved initial Équipe & culture behavior

- view and manually edit `Valeurs & état d’esprit`;
- view and manually edit `Façon de travailler ensemble`;
- view and manually edit `Transmission & intégration`; and
- explicitly save the complete `Équipe & culture` slice once.

The three descriptive values are independent and optional. Their all-empty
state is valid and changes remain browser-local until the explicit save. The
implementation uses the dedicated `restaurant_knowledge_team_culture` cloud
table and whole-slice Restaurant Knowledge repository operations under trusted
organization and establishment scope. It adds no Product validation, taxonomy,
employee state, workflow, operational-module or provider relationship.

### Ownership invariant
OLD
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire and Expérience client slices; Equipe/culture, communication identity, validated-knowledge workflows and every excluded integration remain unimplemented
NEW
`OK` for the implemented Concept/Histoire, Cuisine/savoir-faire, Expérience client and Équipe & culture slices; communication identity, validated-knowledge workflows and every excluded integration remain unimplemented
OLD
Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire
and Expérience client persistence/domain boundaries in `packages/db-cloud`;
NEW
Restaurant Knowledge owns the Concept/Histoire, Cuisine/savoir-faire,
Expérience client and Équipe & culture persistence/domain boundaries in
`packages/db-cloud`;
OLD
The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire and Expérience client ownership, semantic scope, optionality,
empty state, manual view/edit, explicit-save and no-autosave behavior.
NEW
The approved Product decisions resolve the bounded Concept & histoire, Cuisine
& savoir-faire, Expérience client and Équipe & culture ownership, semantic
scope, optionality, empty state, manual view/edit, explicit-save and no-autosave
behavior.
OLD
The bounded Concept & histoire, Cuisine & savoir-faire and Expérience client
slices are implemented as Restaurant Knowledge, not as enhancements of
Establishment Profile.
NEW
The bounded Concept & histoire, Cuisine & savoir-faire, Expérience client and
Équipe & culture slices are implemented as Restaurant Knowledge, not as
enhancements of Establishment Profile.
```
<!-- END EXACT PAYLOAD -->

Exact proposed-diff bytes SHA-256:
`3b4f08c1c8b05793e42ff53b2b2e2381f7f938de26abe25e34ee21e1e91e1fc9`

## Guardrails for the later approved apply

- Recheck the complete target path set and every current-byte hash above.
- Recheck the exact payload hash.
- Apply only the replacements in the approved payload.
- Run `pnpm docs:check` and review the resulting documentation diff.
- Do not modify main specs, implementation, migrations or lifecycle values.
- Do not deploy or infer environment/readiness evidence.

## Apply completion

Apply status: `COMPLETED`

Completed: `2026-09-02T16:35:55.5626062+02:00`

Applied replacement count: `23/23`

Applied targets and hashes:

| Target | Pre-apply SHA-256 | Post-apply SHA-256 |
| --- | --- | --- |
| `docs/PRODUCT_KNOWLEDGE.md` | `3ffbdd76b75b91f6afa5b1dec9d49d742de97cb4d71b12ded39bd5fdd1baffc3` | `c5181ff077e91b35ceccbbf5ed6d8080b1a0baa8c1cede641c44567edbb8c155` |
| `docs/MODULE_REGISTRY.md` | `81505f5a9c10e2cccce5f0e7a199bd88e17496e25f976ef8527574395d90fde0` | `362f95b451f134b272cf6c35231f00bab7bbc9ea880a4d1fd856bdb2a98b38aa` |
| `docs/features/establishment/README.md` | `f80f53bd393a297f856750f6f1723912b571e63f205a4fb3e018bce8b7c5c365` | `c2d573d66a99bf7c14de9ced9606257631940c3ec441b260c37ee088e7f0c8ae` |
| `docs/features/establishment/general-information/README.md` | `251e93e445c24305f995cb2564f2ea0c65472277a2644270646ca8259ea67ce1` | `8d4beef46c67f4d4f05c2bd19e9e184d69524ad075d825ca2769cfc464666974` |

Validation:

- exact payload SHA-256 match: `PASS`;
- reverse/apply integrity against all four approved pre-hashes: `PASS`;
- exact target set and 23-replacement cardinality: `PASS`;
- `pnpm docs:check`: `PASS` — 36 current documents;
- `pnpm architecture:check`: `PASS`;
- repository-specific additional Knowledge Consolidation validator: `NONE`;
- targeted `pnpm exec prettier --check` was read-only and reported existing
  style differences in three targets; `--write` was intentionally not run
  because it would modify bytes outside the approved payload;
- unrelated dirty-file manifest: `PASS` — 155 paths, SHA-256
  `2f11412fccd4363dc90ef3a2b22de8cc58bb252a57da435fa12e2761f1663cf7`
  before and after;
- HEAD remained `01e6ca74186f5cda389f5ca8c0700274b29d18d0`.

No normative spec, archived artifact, implementation, test, schema, migration,
permission, ownership, lifecycle, environment/readiness or cross-module
document was modified by this apply. No additional `NEEDS REVIEW`, conflict or
cross-module issue appeared.

Knowledge consolidation: `COMPLETED`

RELEASE_FOLLOW_UP: `NOT_REQUIRED`

Workflow status: `DONE`
