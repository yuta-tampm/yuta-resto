# Horaires & services Product Knowledge

Status: Current canonical knowledge for the bounded scope; Human-exception authority cutover complete

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-30

Route: `/etablissement/horaires-services`

Application: `apps/backoffice`

## 1. Scope and authority

This entry point preserves reconciled Horaires & services knowledge, including
the restaurant-information purpose and public-channel propagation objective.
Its location under Establishment is a discovery choice, not a transfer of
semantic, data, permission, runtime, or provider ownership. The existing route
administers **Booking-owned** service periods and exceptions. A separate public
opening-hours/service model and publication owner remain undecided.

Read the [Authority Model](../../../AUTHORITY_MODEL.md) by question type and
the [Lifecycle Model](../../../LIFECYCLE_STATUS_MODEL.md) by bounded capability.
[ADR-006](../../../decisions/ADR-006-cloud-establishment-profile-context.md)
keeps Booking schedules outside Establishment Profile;
[ADR-007](../../../decisions/ADR-007-composed-general-information-and-restaurant-knowledge.md)
keeps Profile and Restaurant Knowledge separate. Their
[Establishment](../README.md) and [General Information](../general-information/README.md)
homes are unchanged. [Booking knowledge](../../public-booking/README.md),
[Booking Status](../../public-booking/STATUS.md), and the
[Hours page pack](../../../ui/pages/hours-services/README.md) retain their
question-specific roles. This home defines no new normative behavior.

No Horaires-specific normative main spec or approved publication change was
identified. Active changes and archived tasks are provenance, not approval.
The existing Establishment profile spec does not assign it Booking ownership.
The page-pack plan and unchecked checklist are not completion or Browser QA.

Reconciliation and the [Human-exception authority cutover](#human-exception-authority-cutover)
are complete for the exact bounded scope in this home. Repository knowledge is
canonical, and its Horaires & services Page Chat is `LEGACY EVIDENCE ONLY`.
The Human accepted repository sufficiency as `PASS`; strict fresh-agent execution
remains `BLOCKED_BY_ENVIRONMENT`, and no formal fresh-agent PASS is recorded.
Adjacent completed migration records retain their existing authority.

### Source identity and counting

The complete 991-line `HORAIRES_SERVICES_LEGACY_KNOWLEDGE_EXTRACT.md` was read
before classification. Its first heading is
`# HORAIRES & SERVICES — LEGACY KNOWLEDGE EXTRACT`; its final extraction controls
record read-only extraction, no created contracts/decisions, no external
research, no conflict resolution, no authority retirement, and readiness for
reconciliation. SHA-256:
`c6d941b6e8b30d1865c9581a4b91dd358b3966c6425c386e36db2d508565fbd3`.
The mission supplied this expected hash, and the actual artifact matched it
exactly. The earlier statement that no expected hash was supplied was incorrect.
The extract is legacy evidence, not a canonical specification or a file to copy
into the repository.

The initial reconciliation disposition register counts grouped entries, not sentences or raw
questions: 4 Human items (`H1`–`H4`), 17 proposals (`P1`–`P17`), 6 implementation
evidence groups (`I1`–`I6`), 20 open decision packets (`HS-01`–`HS-20`), and 1
source conflict (`C1`): 48 entries. Dispositions are `CONFIRMED: 2`,
`IMPLEMENTED: 6`, `DECIDED_NOT_IMPLEMENTED: 2`, `PROPOSED: 17`, `UNRESOLVED: 20`,
`CONFLICT: 1`, `OBSOLETE: 0`. Packets reference claims; this is not a count of
48 independent capabilities. Legacy long-term directions: **0**; legacy
obsolete Product claims: **0**; legacy ambiguities: **1**; external historical
provider references: **6**.

These initial counts preserve reconciliation provenance. Following the bounded
C1 remediation, `C1_DISPOSITION: RESOLVED_AS_OBSOLETE_OR_STALE_SOURCE` and
`GENUINE_CONFLICTS_REMAINING: 0`. One stale documentation statement was corrected;
this is not a new obsolete legacy Product claim. The 20 HS packets remain open.

## 2. Four reconciled Human-current directions

| Item | Preserved direction                                                                                                                                | Repository reconciliation and disposition                                                                                                                                                                                                                |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1   | Restaurant information/configuration here excludes money and transaction management.                                                               | `CONFIRMED`. Consistent with the Hours Product Scope and cloud/local runtime boundaries. This bounded exclusion does not redefine all Backoffice capabilities.                                                                                           |
| H2   | Fit most restaurants with relatively simple database/business logic; avoid unnecessarily deep operations.                                          | `CONFIRMED` as qualitative Product/architecture direction. Current Booking administration is a bounded existing slice; neither its schema nor P2/P7 defines the final public-hours model. No numerical complexity threshold is approved.                 |
| H3   | Changing hours should avoid manually updating each relevant public presence: restaurant website, Google listing, Facebook, Tripadvisor, and “...”. | `DECIDED_NOT_IMPLEMENTED` for the propagation outcome. Current mutations save Booking records and revalidate a Backoffice page; no schedule publication/provider write exists. Examples and “...” do not approve a provider roster or universal support. |
| H4   | Propagation should be `efficace, sûr, vite` (effective, safe, fast).                                                                               | `DECIDED_NOT_IMPLEMENTED` for propagation qualities. No end-to-end propagation, safety acceptance or latency target is implemented/qualified. Existing server guards are implementation evidence, not a provider/security conclusion.                    |

`CURRENT_V1_STATUS: UNRESOLVED` for the full bounded Horaires & services
capability. Preserve four high-level decisions without approving a detailed
schedule, service, exception, schema, workflow or integration.

The Human wording “quản lý 1 phần thông tin (menu) của nhà hàng” has one
unresolved ambiguity: literal restaurant menu, an information example,
mistaken wording, or Backoffice navigation menu. `HS-01` retains all four
interpretations. Do not resolve it into Carte & menus ownership or silently
replace the wording. Differences among unapproved Assistant proposals are not
Human-level Product conflicts.

## 3. Current implementation and capability states

| Evidence group | Current repository evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Limits                                                                                                                                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| I1             | [Route](<../../../../apps/backoffice/src/app/(authenticated)/etablissement/horaires-services/page.tsx>), [weekly component](<../../../../apps/backoffice/src/app/(authenticated)/etablissement/horaires-services/_components/weekly-schedule-section.tsx>), [period actions](<../../../../apps/backoffice/src/app/(authenticated)/etablissement/booking-service-period-actions.ts>), [exception actions](<../../../../apps/backoffice/src/app/(authenticated)/etablissement/booking-exception-actions.ts>): integrated persisted reads, seven-day display, explicit create/delete, pending/validation/result feedback and delete confirmation. | No period/exception update-in-place or whole-week save. Period creation forces `enabled: true`; `sortOrder` is schema state, not an editable input. The actions' authentication return path still names Informations générales; it does not transfer ownership. |
| I2             | [Reservation contracts](../../../../packages/contracts/src/reservations/index.ts), [Booking schema](../../../../packages/db-cloud/src/schema/booking.ts), [Booking repository](../../../../packages/db-cloud/src/booking-repository.ts): scoped periods/exceptions, validation, and persistence.                                                                                                                                                                                                                                                                                                                                               | These are executable Booking shapes. No separate public-hours tables, service taxonomy, schedule version, or publication schema was identified. No schema was changed.                                                                                          |
| I3             | [Session guard](../../../../apps/backoffice/src/server/auth/session.ts), [permission policy](../../../../apps/backoffice/src/server/auth/permissions.ts), [Tenancy](../../../architecture/TENANCY.md), [navigation](../../../../apps/backoffice/src/components/backoffice/backoffice-navigation.ts).                                                                                                                                                                                                                                                                                                                                           | Authenticated active membership, active establishment, `booking.enabled`, `booking.read`, then `booking.settings.manage`; OWNER/MANAGER only for management. Navigation is separately filtered and is not authorization.                                        |
| I4             | [Pure Booking availability](../../../../packages/booking/src/index.ts) and [public repository](../../../../packages/db-cloud/src/booking-repository.ts) consume scoped enabled periods and date exceptions.                                                                                                                                                                                                                                                                                                                                                                                                                                    | Booking slots apply horizon, notice, party/capacity constraints. Slots are not restaurant opening periods. This is existing Booking behavior, not a new public-hours contract.                                                                                  |
| I5             | [Today loader](<../../../../apps/backoffice/src/app/(authenticated)/aujourdhui/today-data.ts>), [Today model](<../../../../apps/backoffice/src/app/(authenticated)/aujourdhui/today-view-model.ts>), [Today home](../../today/README.md), [ADR-005](../../../decisions/ADR-005-today-operational-steering.md).                                                                                                                                                                                                                                                                                                                                 | Today reads enabled local-weekday Booking periods, applies dated closures/modified hours and presents context; source ownership stays Booking. No write-back or new universal operational-service model.                                                        |
| I6             | [Reputation home](../../reputation/README.md), [Google client](../../../../apps/backoffice/src/server/reputation/google-business-profile-client.ts), OAuth routes and connector storage.                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Existing Reputation account/location OAuth foundation is implemented. Location `readMask` is `name,title,storeCode,storefrontAddress,metadata`; no hours import/update/publication call exists. It is not a Horaires integration or V1 approval.                |

### Independent lifecycle and review axes

| Bounded capability                                             | Product decision                                                        | Implementation                                                                                  | Environment                                       | Production readiness / authorization                                              | Owner and external review                                                                                                                                                             |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing Booking schedule administration                       | Approved existing bounded Booking scope; broader Horaires V1 unresolved | `IMPLEMENTED` create/delete and read slice                                                      | `UNVERIFIED` for a named deployed environment     | `BLOCKED` by Booking/global cloud gates; no production authorization granted here | Booking; `apps/backoffice`; `packages/db-cloud`. No provider dependency for the bounded local cloud CRUD itself. Global legal/privacy/security/operations review remains open.        |
| Distinct public opening-hours / operational service definition | Four high-level directions; exact model `UNRESOLVED`                    | `NOT_STARTED` as a separately modeled capability; existing Booking UI is not its implementation | `NOT_ENABLED` for that absent separate capability | `NOT_ASSESSED`; no production authorization                                       | Canonical semantic/data/runtime owners and operations undecided; `HS-01`–`HS-07`.                                                                                                     |
| Public-channel hours propagation                               | H3/H4 approved outcomes; exact V1/provider workflow unresolved          | `NOT_STARTED`                                                                                   | `NOT_ENABLED`                                     | `NOT_ASSESSED`; no production authorization                                       | Source/publication owner, actors, permissions and organization/establishment scopes unresolved; current provider/legal/privacy/security/operations review required (`HS-13`–`HS-20`). |

Legal compliance, provider capability, privacy and security qualification are
`UNVERIFIED`/not established for the proposed models and integrations.
Repository security invariants and code controls are recorded separately.
No current legal, privacy, security, provider or deployment conclusion is made.
Use [Production Readiness](../../../operations/PRODUCTION_READINESS.md),
`BOOK-01`, the Booking acceptance register and global cloud gates; a local test,
page pack, OAuth foundation or knowledge migration cannot close those gates.

## 4. Schedule, service and exception concepts

| Concept                          | Current meaning/evidence                                                                                                                                                                   | Unresolved boundary and coding non-inference                                                                                                                                                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Restaurant public opening hours  | H3 names hours for public presence; a distinct canonical model is absent.                                                                                                                  | Not automatically equal to reservable times or the Backoffice preview. Public exposure/source/projection/write-back remain open.                                                                                                                      |
| Booking service period           | Scoped UUID; weekday `0..6`, free-text name, local start/end, positive capacity, enabled flag, sort order, creation/update timestamps. Multiple same-day records are technically possible. | Existing Booking record, not approval of P2 for opening hours. No enum from meal labels; no physical room/table capacity inference.                                                                                                                   |
| Establishment service mode       | Profile has its own supported modes: `DINE_IN`, `TAKEAWAY`, `RESERVATION`, `DELIVERY`, `CLICK_AND_COLLECT`, `PRIVATE_EVENTS`, `CATERING`.                                                  | [Profile contract](../../../../packages/contracts/src/establishment-profile/index.ts) owns this descriptive shape. A mode is not a meal/service identity, open interval, bookable slot, enabled channel or integration.                               |
| Operational service              | Current Today context projects Booking periods.                                                                                                                                            | No universal service aggregate, Planning shift, Personnel assignment, Pointage session or POS business date is created.                                                                                                                               |
| Weekly opening period            | P2/P3 propose `0..n` intervals and three fields.                                                                                                                                           | Unapproved separate opening-hours model; no new executable shape.                                                                                                                                                                                     |
| Booking exception                | Local date; kind; optional scoped period UUID; optional time range, capacity override and reason; timestamps.                                                                              | Existing enum only: `CLOSED_ALL_DAY`, `CLOSED_SERVICE`, `MODIFIED_HOURS`, `BLOCKED_SLOT`. No `OPEN_EXCEPTIONALLY`; no general date-range/holiday/season model.                                                                                        |
| Public opening/closure exception | P6 proposes closure, exceptional opening, custom hours and multiple exception periods.                                                                                                     | Existing Booking exceptions do not approve P6/P7 or publication semantics.                                                                                                                                                                            |
| Public preview                   | [View model](<../../../../apps/backoffice/src/app/(authenticated)/etablissement/booking-schedule-view-model.ts>) renders seven weekdays from enabled persisted Booking periods.            | Backoffice display only, no external publication. It does not incorporate exceptions. The route's today summary also uses ordinary weekday periods and shows the next exception separately. Do not infer an exception-aware public “open now” result. |
| Published external hours         | H3/H4 outcome; P10–P17 mechanisms unapproved.                                                                                                                                              | Intent, saved source, sent request, provider acknowledgment and verified external publication are different facts; no canonical status enum or state machine is created.                                                                              |

### Current recurrence, date, time and exception behavior

Booking has weekly weekday periods and single-date exceptions; no effective
versions, seasons, recurrence beyond weekdays or holiday feed was identified.
Empty/enabled-period displays derive `Fermé`; there is no persisted closed-day
switch. The contract and database require end after start: overnight periods
are unsupported. The route uses establishment timezone/locale, with
`Europe/Paris`/`fr-FR` fallback when the loaded establishment is missing; it does
not edit timezone. Dates remain local calendar strings.

Existing pure Booking conversion uses Temporal with `disambiguation: 'reject'`
for invalid/ambiguous local times. Availability applies all-day closure first,
service closure next, the first relevant modified-hours record, blocked slots,
notice and per-slot remaining capacity. It deduplicates results by time; do not
infer summed overlapping capacity or an approved exception-priority policy.
Cross-midnight attribution, operational rollover, DST policy for a new hours
model, overlaps, conflict ordering, effective dating and business date remain
`HS-04`–`HS-06`. Existing tests do not qualify all those future policies.

### Ownership, actors and trusted scope

Booking reads and deletes include both `organizationId` and `establishmentId`;
creation gets both from trusted context. Period-reference exception creation
checks the parent in the same scope. Browser period/exception IDs and form
fields are untrusted boundary input validated by Zod and scoped repository
queries. Organization is the access envelope, not evidence of a reusable
organization-wide public schedule. OWNER/MANAGER may manage existing Booking
settings; STAFF Booking read does not grant this page's management access.
Profile/RK permissions cannot substitute for Booking permissions. Public
Booking resolves its own documented server-side public identifier/configuration.
No new public-hour publisher grant, service actor or support bypass exists.

### History and deletion

Period/exception timestamps are not schedule versions or immutable audit.
Current actions create/delete; deleting a period cascades its linked exceptions
through the existing FK. No schedule change log, publication history, archive,
restore, retention duration or legal evidentiary guarantee was identified.
Booking reservation lifecycle/audit history belongs to Reservations and does
not prove audited schedule administration. `HS-18` remains open.

## 5. Cross-capability boundaries

| Scope                                                                                | Established relationship                                                                                             | Preserved limits / review                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Establishment / General Information / RK                                             | Profile supplies context; Booking owns schedule administration. ADR-006/007 and migrated homes remain authoritative. | No copied profile/RK facts, ownership or permission transfer; RK-01–08 remain open.                                                                                                                                   |
| Reservations / settings                                                              | Existing periods/exceptions feed Booking availability; global rules live at `/reservations/parametres`.              | Opening hours differ from reservable hours. No new projection/version/refresh/write-back; RES-01–22, especially RES-14/15/17, are preserved. No per-service last-arrival field was found.                             |
| Today                                                                                | Existing entitled/readable source projection; ADR-005 aggregation only.                                              | No source mutation, new alert/notification, universal service or write-back; TODAY-01–17 remain open.                                                                                                                 |
| Planning / Pointage / Personnel / tasks / Formalités                                 | Separately owned capabilities; no Horaires integration identified.                                                   | Operational service ≠ Planning shift ≠ raw attendance/session. No staffing forecast, payroll, shift planning or Personnel copy. PLAN-01–14, SAL-01–11, TJD-01–15, FORM-01–08 and Pointage authority remain unchanged. |
| Salle & tables                                                                       | Navigation and Booking-related capacity exist separately.                                                            | Physical capacity, booking period capacity and actual occupancy differ. No table assignment/projection or Rooms/Tables Product migration.                                                                             |
| Carte / POS / Production / Stock                                                     | Independent cloud menu intent and local runtime boundaries.                                                          | No saleable-menu, order, kitchen, production, inventory, movement, supplier, recipe, delivery or channel availability inferred from hours. CM-01–18, FT-01–19, INV-01–18, MDS-01–18 and FOU-01–18 remain unchanged.   |
| Website / Site Agent / Display                                                       | [Public Website](../../public-website/README.md) is YUTA marketing; public Booking is independent under ADR-002.     | No restaurant-hosting/data-consumer contract, Website schedule publication, Site Agent/POS sync, kiosk/borne or Display integration. P13 remains unapproved.                                                          |
| Providers / Avis / Satisfaction                                                      | Existing Reputation Google foundation is a distinct owner.                                                           | No review import/reply behavior authorizes hours publication; outbound links and source labels are not connectors. Avis/Satisfaction authority stays unchanged.                                                       |
| Ressources internes / Compliance / Marketing / Notifications / Identity / Paramètres | Source-specific homes retain their scopes.                                                                           | RI-01–20 and VC-01–23 remain open. No legal opening-hours conclusion, content requirement, notification worker or additional Page Chat migration.                                                                     |

## 6. Seventeen preserved proposal families

All rows remain `PROPOSED_NOT_APPROVED` as legacy proposals. Similar existing
Booking behavior is independently supported by current authority; it does not
approve the proposal's broader public-hours payload. No separate later
authority was found approving a full P1–P17 family. In particular, the current
global-rules route supports part of P9, but not its absent per-service
last-arrival field or claimed earlier-spec history.

| ID  | Exact proposal payload preserved in English, with original labels/identifiers                                                                          | Reconciliation / destination                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| P1  | `Horaires habituels`; seven day rows; open/closed state; one or multiple `créneaux` each day.                                                          | Existing seven-day Booking display overlaps this UI idea; no separate public-hours/day-state approval. HS-04/19.                         |
| P2  | `0..n` opening periods per day instead of fixed `lunchOpeningTime` / `dinnerOpeningTime`.                                                              | Multiple Booking rows exist independently; opening-hours cardinality remains unapproved. HS-04.                                          |
| P3  | `OpeningPeriod` concept containing `dayOfWeek`, `startTime`, `endTime`.                                                                                | Not an approved field/schema definition; current Booking includes distinct additional semantics. HS-02/04.                               |
| P4  | Services proposed: `Déjeuner`, `Dîner`, `Petit-déjeuner`, `Brunch`, `Service continu`, `Sur place`, `À emporter`.                                      | Not a canonical enum or service identity; Profile modes and Booking free-text names remain separate. HS-03.                              |
| P5  | Hours = when the restaurant opens; services = descriptive establishment metadata; avoid strong relational coupling.                                    | Generalized relationship unapproved; existing separate Profile/Booking owners retained. HS-02/03.                                        |
| P6  | `fermeture exceptionnelle`, `ouverture exceptionnelle`, custom hours, one or multiple exception periods.                                               | Existing Booking kinds do not approve a public exceptional-opening model. HS-05.                                                         |
| P7  | Conceptual `establishment_opening_periods`, `establishment_schedule_exceptions`, `establishment_schedule_exception_periods`, optional service storage. | Names are proposal provenance only; no such new tables/fields are created. HS-02/04/05.                                                  |
| P8  | One explicit `Enregistrer les modifications` instead of complex autosave.                                                                              | Current item-scoped explicit create/delete is not a whole-schedule save. HS-19.                                                          |
| P9  | Booking window, `dernière arrivée`, `durée` should belong to `Paramètres de réservation`, not Horaires.                                                | Global Booking rules are separately owned/routed; no per-service last arrival and no verified prior-spec/superseding decision. HS-08.    |
| P10 | YUTA keeps canonical hours; external channels receive projections/copies.                                                                              | No approved public-hours source or provider authority reconciliation policy. HS-02/15.                                                   |
| P11 | Save YUTA DB first; emit event; async worker; provider calls; retries after errors; synchronization status.                                            | No schedule event/outbox/worker/provider runtime. Booking email intents are unrelated. HS-15/16/17.                                      |
| P12 | Distinguish saved in YUTA, sent to provider, acknowledged/published by provider.                                                                       | Preserve the distinction without approving an executable state machine or combining acknowledgment with verified publication. HS-16.     |
| P13 | A YUTA-owned restaurant website reads canonical hours directly instead of duplicate sync.                                                              | YUTA marketing and Booking runtimes do not approve this restaurant-website consumer. HS-13.                                              |
| P14 | Google/Facebook OAuth; minimal permissions; no user passwords; encrypted tokens.                                                                       | Reputation's existing Google controls are not a Horaires OAuth/provider design. Privacy/security unverified for this proposal. HS-14/20. |
| P15 | Direct strategic Google/Meta integrations; a listings provider for Tripadvisor/Apple/Bing/Waze/other networks.                                         | No hybrid strategy, aggregator or provider roster approved. HS-14.                                                                       |
| P16 | Synchronization machinery may belong to a transversal capability rather than entirely inside Horaires & services.                                      | `PROPOSED_NOT_APPROVED`; exact provenance below. No capability or owner approved/created. HS-17 remains `UNRESOLVED`.                    |
| P17 | Synchronization labels: `À jour`, `Synchronisation…`, `En attente`, `Erreur`, `Non connecté`.                                                          | Not a canonical status enum and not current UI evidence. HS-16/19.                                                                       |

### P16 — Presence / Listings Sync as transversal capability

Classification: `PROPOSED_NOT_APPROVED`; historical Assistant proposal only.

Exact Vietnamese provenance:

> Không đặt toàn bộ synchronization machinery trong `Horaires & services`; tạo một transversal `Presence / Listings Sync` capability.

Faithful English recovery:

> Synchronization machinery may belong to a transversal capability rather than entirely inside Horaires & services.

The proposal allows a possible shared or partial allocation; it does not
mandate one. “Do not place the entire machinery inside Horaires” does not mean
“place the entire machinery outside Horaires”. No categorical all-out allocation
or exclusion of every Horaires-specific synchronization concern is proposed.
The historical phrase “tạo một transversal capability” remains Assistant
proposal content, not approved Product direction or a requirement to implement it.

No transversal capability is approved or created. No semantic, data, runtime,
package/service or provider owner/boundary, provider strategy, publication
initiation, OAuth/token policy, retry/idempotency, acknowledgment,
reconciliation, provider status or readiness is selected. `HS-17` remains
`UNRESOLVED`.

### Six historical external references

Google Business Profile API; Meta Graph API / Facebook Page; Tripadvisor
business/content tooling; Uberall; Yext; Partoo are all `LEGACY_REFERENCE_ONLY`.
No current API availability, provider coverage, pricing, limits, eligibility,
terms or security suitability is qualified. Google account/location discovery
does not establish schedule support. No external research was performed.
H3's examples and P15's Apple/Bing/Waze examples retain their separate provenance.
Reassess providers only within a separately authorized implementation/review.

## 7. Open Human-decision packets

All 20 packets remain `UNRESOLVED`; recording them does not resolve adjacent
packets or create behavior. For every packet, current legal/privacy/security
qualification is unverified for affected new behavior; provider capability is
unverified where relevant and not an implementation dependency for a pure
internal documentation question. External provider/privacy/security/operations
review is required before affected integrations or release. These are evidence
limits, not compliance conclusions. Authority abbreviations: **H/P** Human
Product; **A/D** architecture/data; **L/P/S** current qualified legal/privacy/
security; **Pr/O** provider/operations; **UX/QA** design/accessibility/QA.

The packet rows preserve the reconciliation-time text unchanged. HS-19 retains
its original C1 wording as provenance; use the current C1 disposition below for
the corrected source statement. Its broader UI/save/preview/QA questions remain
unresolved. This documentation correction resolves no HS packet.

| ID    | Exact decision question and affected concepts/sources                                                                                                                                                         | Current evidence and why open                                                                                                            | Coding-agent non-inference and required authority                                                                                                                                                                    |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| HS-01 | What is the exact public-hours/service/publication V1, and what does the Human `(menu)` wording mean? H1–H4, Carte and Horaires.                                                                              | Four directions are high-level; all four menu interpretations remain viable.                                                             | Do not assign Carte ownership, broaden V1 or silently correct wording. H/P; A/D for resulting boundary.                                                                                                              |
| HS-02 | Who canonically owns public hours, service definitions and exceptions, and are their records establishment-owned, organization-owned or reusable? Profile/RK/Booking/P3/P7/P10.                               | Booking's current ownership and organization+establishment scope are resolved; a separate model's owners/scope are not.                  | Do not transfer Booking data, copy facts or infer shared organization schedules. H/P and owning modules, A/D, L/P/S for new scope.                                                                                   |
| HS-03 | What identifies a service, and how do meal labels, service modes and operational-service identity relate? P4/P5, Profile, Booking, Today.                                                                     | Booking free-text names and Profile modes exist; no universal service identity/taxonomy.                                                 | Do not create an enum or reuse mode/period IDs as universal identity. H/P, domain/A/D, restaurant operations.                                                                                                        |
| HS-04 | What recurring public-hours model, closed-day/default state, cardinality, overlap and effective-date rules are approved? P1/P2/P3/P7.                                                                         | Weekly Booking periods exist, but no public-hour recurrence/version model.                                                               | Do not approve `0..n`, fixed lunch/dinner, persisted day switches, seasons or overlap policy from implementation. H/P, A/D, operations.                                                                              |
| HS-05 | Which public exceptions, exceptional openings, ranges/periods, precedence and recurrence/holiday rules belong in V1? P6/P7 and Booking exceptions.                                                            | Four Booking kinds and first-match modified-hours behavior exist; public exception policy absent.                                        | Do not create `OPEN_EXCEPTIONALLY`, date-range schema, holiday feed or a general precedence contract. H/P, A/D, Pr/O and L/P/S where sources/regulation apply.                                                       |
| HS-06 | Which timezone, DST ambiguity, overnight attribution, business-date and rollover rules apply to the new hours/service model? Booking, Today, Planning/Pointage/POS.                                           | Existing Booking rejects overnight/invalid local conversion; current local weekday display does not decide new operational semantics.    | Do not adopt POS service day, infer cross-midnight support or universal DST policy. H/P, A/D, restaurant operations, UX/QA.                                                                                          |
| HS-07 | Who may read/edit public hours/exceptions/publish, with which roles, public exposure, service/support actors and cross-establishment denial? Identity/Access/Booking.                                         | Existing Booking management is OWNER/MANAGER, scoped and entitled. New operations have no grants.                                        | Do not inherit Profile/RK/Reputation grants or trust browser scope/navigation. H/P, A/D/security, privacy, operations.                                                                                               |
| HS-08 | How do public opening hours relate to reservable periods/settings and any shared projection, version, refresh or write-back? Reservations, RES-14/17, P9.                                                     | Existing Booking administration is separately owned; full public-hours contract absent.                                                  | Do not reinterpret opening time as a bookable slot, add per-service last arrival, or resolve RES packets. Both H/P owners and A/D; provider review if exposed.                                                       |
| HS-09 | What further Today presentation, freshness, exceptions and operational-service semantics may consume public hours? ADR-005, TODAY packets, P1/P6.                                                             | Existing Today read of Booking is implemented; broader service/overnight/capacity policy remains open.                                   | Do not create a new Today source, write-back, alert or projection contract. Both H/P owners, A/D, UX/QA, operations.                                                                                                 |
| HS-10 | Is a future Horaires relationship to Planning, Pointage, Personnel or tasks desired, and what source contracts would be allowed? PLAN/SAL/TJD/FORM and Pointage.                                              | No such Horaires integration; protected scopes own their own records.                                                                    | Do not equate service/shift/session, infer staffing forecasts/payroll or duplicate Personnel. Respective H/P owners, A/D, L/P/S, operations.                                                                         |
| HS-11 | Is there any approved room/table projection or capacity relationship for hours/services? Salle & tables and Booking.                                                                                          | Booking period capacity exists independently of fixture room/table UI.                                                                   | Do not equate physical/bookable capacity or occupancy, or migrate Salle Product Truth. Respective H/P owners, A/D, restaurant operations.                                                                            |
| HS-12 | Is hours-driven menu/POS/Production/channel availability wanted, with which separate owner and boundaries? Carte, local products, Stock, Display and delivery channels.                                       | No integration identified; cloud and local data boundaries remain separate.                                                              | Do not enable items/orders/kitchen/channels or derive operational readiness from hours. Respective H/P owners, runtime/A/D, Pr/O, L/P/S where affected.                                                              |
| HS-13 | Which restaurant website/public presentation should consume hours, with what ownership, exposure, cache/freshness and direct-versus-copy contract? H3/P13, Public Website/Booking.                            | `apps/web` is YUTA marketing; current Backoffice preview is not publication.                                                             | Do not approve restaurant hosting, direct canonical reads, schema exposure or Website/Site Agent scope. H/P website/source owners, A/D, privacy/security, Pr/O.                                                      |
| HS-14 | Which public channels are in exact V1, what does “...” mean, and is direct or aggregator integration approved for each? H3/P14/P15 and six references.                                                        | Examples only; no hours provider selected/qualified. Reputation foundation is distinct.                                                  | Do not approve Google/Meta/Tripadvisor/Apple/Bing/Waze or a listings vendor from references. H/P, provider, A/D, current L/P/S and Pr/O.                                                                             |
| HS-15 | Which source wins and who initiates publication: explicit user action, automatic save, provider-origin changes or manual reconciliation? H3/P10/P11.                                                          | Current save revalidates Backoffice only; no publication intent contract.                                                                | Do not make YUTA/provider canonical, auto-publish or create reverse sync/write-back. H/P source/publication owners, A/D, provider, L/P/S, operations.                                                                |
| HS-16 | What acknowledgment/published-state proof, mapping/versioning, latency acceptance, retry/idempotency/concurrency, stale/error and reconciliation rules are approved? H4/P11/P12/P17.                          | No schedule request, worker, provider acknowledgment or published-state evidence.                                                        | Do not collapse saved/sent/acknowledged/published, invent SLA/enum or reuse Booking email outbox. H/P, A/D, provider, security/privacy, Pr/O, UX/QA.                                                                 |
| HS-17 | Does transversal Presence / Listings Sync exist as approved direction, and what is its owner/runtime/data boundary? P16.                                                                                      | Assistant proposal only; no dedicated capability.                                                                                        | Do not create a package/service or attach all providers to Horaires/Reputation. H/P, runtime/A/D, provider/security/operations.                                                                                      |
| HS-18 | What schedule/publication version, audit, retention, delete/archive/restore and evidentiary policy is approved? Booking records/P11/P12.                                                                      | Timestamps and delete/cascade exist; no schedule history/version/audit workflow.                                                         | Do not infer immutable audit, retention periods, legal evidence or restore from reservation history. H/P, A/D, current L/P/S, operations.                                                                            |
| HS-19 | Which page-pack statement governs period-edit location, and what UI/save/preview/accessibility/Browser QA acceptance is approved? C1, P1/P8/P17.                                                              | PRODUCT_SCOPE says General Information; README/UI_SPEC/checklist and code say Horaires. No completed Horaires-specific Browser QA found. | Record the conflict; do not fix sources, move UI, approve whole-week save or claim screenshots/checklists passed. H/P, UI owner/UX/QA; engineering for separately authorized correction.                             |
| HS-20 | What current provider eligibility, OAuth/credential policy, legal/privacy/security qualification, runtime/monitoring/recovery and named-environment/release evidence is required? H3/H4/P14, readiness gates. | No hours-provider/environment acceptance; Booking/global gates remain open.                                                              | Do not reuse Reputation credentials/grants as authorization, claim compliance, enable production or resolve other migration packets. H/P, current qualified L/P/S, provider, security, operations/release authority. |

### C1 — Resolved stale source; ownership unchanged

Disposition: `RESOLVED_AS_OBSOLETE_OR_STALE_SOURCE` (2026-09-30).
Genuine current authority conflicts remaining in this bounded scope: **0**.

The pre-remediation [Hours PRODUCT_SCOPE](../../../ui/pages/hours-services/PRODUCT_SCOPE.md)
said: “This route reads the current periods for summaries, exception selection,
and the persisted public preview. Their create/delete UI belongs to the general
information page.” That sentence concerned the same Booking-owned weekly
records, not a separate public-establishment-hours record. Its surrounding
scope names Booking administration, `booking.settings.manage`, capacity and
Booking exceptions. Current General Information PRODUCT_SCOPE does not approve
a public-hours source: it explicitly excludes opening-hours management.

| Participating source                                                                                            | Exact relevant statement / source role                                                                                                                                                                                                     | Chronology and current disposition                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hours PRODUCT_SCOPE, Weekly service periods                                                                     | “Their create/delete UI belongs to the general information page.” Page-specific Product/UI scope for Booking records.                                                                                                                      | Introduced by `e028cfdb9` on 2026-08-07 at 10:46:58 +02:00; left behind during the later split. This location sentence is stale and is corrected in place; the quote here is historical provenance only.                              |
| [General Information README](../../../ui/pages/establishment-general-information/README.md)                     | “Weekly service periods are managed independently under `/etablissement/horaires-services`.” Current page-specific responsibility.                                                                                                         | Added by `a78906639` on 2026-08-07 at 20:53:45 +02:00, replacing its prior General Information schedule section. Current package last-updated metadata: 2026-09-02. This later statement supersedes the stale edit-location sentence. |
| [Hours README](../../../ui/pages/hours-services/README.md)                                                      | “displays and edits weekly service periods”; “creates and deletes weekly service periods through the current booking administration actions”. UI delivery/current integrated-page scope.                                                   | Updated in the same later `a78906639` split; package metadata 2026-08-08. Current Booking administration surface.                                                                                                                     |
| [Hours UI_SPEC](../../../ui/pages/hours-services/UI_SPEC.md#weekly-schedule-ownership)                          | “This route is the only Backoffice editor for the persisted seven-day service schedule.” Specific UI delivery scope; the next sentence preserves create/delete.                                                                            | Added by `a78906639`; metadata 2026-08-07. Current, and more specific to editor placement than a residual paragraph.                                                                                                                  |
| [Hours checklist](../../../ui/pages/hours-services/ACCEPTANCE_CHECKLIST.md)                                     | “The editable seven-day weekly schedule appears only on this route.” UI acceptance target, not completed QA.                                                                                                                               | Replaced the prior non-duplication target in `a78906639`. Current target; no QA completion is inferred.                                                                                                                               |
| [General Information PRODUCT_SCOPE](../../../ui/pages/establishment-general-information/PRODUCT_SCOPE.md)       | “is a composed Establishment Profile and Restaurant Knowledge page”; “opening-hours management” is out of scope. Page-specific Product responsibility.                                                                                     | Exclusion present since `e028cfdb9`; current composition updated after ADR-007 and subsequent RK slices. It claims neither shared public hours nor Booking-period editing.                                                            |
| [Establishment canonical home](../README.md)                                                                    | “Weekly booking service periods and dated booking exceptions are persisted and mutated by Booking administration, even though their current route is under `/etablissement/horaires-services`.” Current bounded Product/ownership context. | Wording in `dff49c129` on 2026-08-29; current home approval metadata 2026-08-30. Confirms the split while preserving Booking ownership.                                                                                               |
| [General Information canonical home](../general-information/README.md) / ADR-007                                | “It brings together bounded capabilities without making the page a single data owner”; composition is Profile plus RK. Accepted Product composition and canonical context.                                                                 | Approved 2026-08-30; current migrated scope. No schedule-owner or public-hours-model assignment.                                                                                                                                      |
| [Reservations home](../../public-booking/README.md) / [Product reference](../../public-booking/PRODUCT_SPEC.md) | “Reservations owns booking eligibility, service periods, exceptions, capacity, booking policy, and reservation records.” The broader Product reference states it does not define exact current routes.                                     | Current home updated 2026-09-29; Product reference 2026-08-28. Current semantic/persistence authority and broader intent retain separate roles.                                                                                       |

Apply the Authority Model by question: ADR-006/007 and current canonical owners
control durable ownership/composition; the later, specific page sources control
the established editor location; current route/components prove implementation;
contracts/schema/repositories prove executable Booking shape. Git chronology
only demonstrates how the old sentence survived the documentation split. Code
does not supersede Product authority, and no route label assigns an owner.

Accordingly, correct only the stale edit-location paragraph. Public opening
hours, operational restaurant service, Booking period, exception, reservable
slot, page composition, UI location, semantic/persistence owner and consumer
projection remain distinct. There is no separate implemented public-hours
source, and no projection or write-back was created. HS-01–HS-20, all proposals,
protected migration authorities and readiness limits remain unchanged. The
source correction does not decide HS-19's remaining UI or QA questions.

## 8. Evidence, validation limits and authority cutover

Repository evidence paths:

- [Hours view-model tests](../../../../apps/backoffice/test/hours-services-view-model.test.ts): weekday ordering, time/duration labels, closest upcoming exception and persisted weekday filtering.
- [Booking administration model tests](../../../../apps/backoffice/test/booking-administration-model.test.ts): exception field visibility and local-date display.
- [Navigation tests](../../../../apps/backoffice/test/backoffice-navigation.test.ts) and [Today tests](../../../../apps/backoffice/test/today-view-model.test.ts): route discovery and separate Today model behavior.
- [Booking domain tests](../../../../packages/booking/test/booking.test.ts): bounded timezone conversion, per-slot capacity and lifecycle rules; not exhaustive DST/overnight qualification.
- [Contract tests](../../../../packages/contracts/test/contracts.test.ts): existing exception validation and separate Profile modes.
- [Guarded Booking repository tests](../../../../packages/db-cloud/test/booking-repository.integration.test.ts): cross-establishment/organization parent rejection and scoped delete preservation. The suite requires an explicitly permitted disposable database; it was inspected, not executed by this mission.
- [Hours acceptance checklist](../../../ui/pages/hours-services/ACCEPTANCE_CHECKLIST.md): unchecked design/verification targets; no completed Horaires Browser QA or runtime/provider acceptance is claimed.

The repository-only discovery path is docs index -> Product Knowledge
-> Module Registry -> this bounded home -> Establishment/Booking ADRs and
sources -> page pack/contracts/schema/repository/route/auth/tests -> Website/
Reputation foundations -> Current State -> Production Readiness.

### Human-exception authority cutover

On 2026-09-30, the Human provided this explicit Control Tower exception decision:

> Tôi chấp nhận repository-sufficiency evidence của Horaires & services:
> 0 material knowledge gaps, 0 genuine conflicts và repository-only recovery PASS.
>
> Tôi phân loại strict fresh-agent session isolation là BLOCKED_BY_ENVIRONMENT
> do môi trường tự động truy cập memory index trước khi agent có thể tuân thủ prompt.
>
> Không cần rerun fresh-agent acceptance thêm lần nữa.
>
> Tôi autorise authority cutover cho bounded scope Horaires & services,
> với điều kiện không thay đổi Product decisions, HS-01–HS-20, P1–P17,
> Booking ownership, C1 disposition, implementation, readiness hoặc adjacent authorities.

The Human accepts repository-only knowledge recovery and sufficiency for the
exact bounded scope in this home. Accepted pre-cutover home SHA-256:
`c738fb402e7e71150c80b25202399c98e2d0c30b97776cc148cee96073a21e25`.

```text
REPOSITORY_KNOWLEDGE_SUFFICIENCY: PASS
MATERIAL_KNOWLEDGE_GAPS: 0
GENUINE_CONFLICTS: 0
STRICT_FRESH_AGENT_EXECUTION_STATUS: BLOCKED_BY_ENVIRONMENT
FORMAL_FRESH_AGENT_PASS_RECORDED: NO
ADDITIONAL_FRESH_AGENT_RERUN_REQUIRED: NO
HUMAN_EXCEPTION_GATE: APPROVED
AUTHORITY_CUTOVER_DATE: 2026-09-30
HORAIRES_SERVICES_REPOSITORY_CANONICAL: YES
HORAIRES_SERVICES_PAGE_CHAT_ROLE: LEGACY_EVIDENCE_ONLY
HORAIRES_SERVICES_MIGRATION_COMPLETE: YES
```

Strict isolation was blocked because the environment automatically accessed the
memory index before the agent could establish compliance with the repository-only
prompt. The isolation breach remains recorded. Discarded results do not convert
that session into a formal PASS, and its formal artifact is not rewritten.
This environment limitation is separate from repository knowledge sufficiency.
No fresh-agent rerun was performed or is required for this cutover.

The exception applies only to this scope's knowledge-authority transition;
the ordinary fresh-agent migration gate remains the default elsewhere.
Repository knowledge is now canonical for the exact reconciled Horaires &
services scope described in this home. Its Page Chat is `LEGACY EVIDENCE ONLY`
for that scope; historical/forensic lookup remains permitted and previous Human
decisions remain valid. Other Page Chats and adjacent authorities are unchanged.

Control Tower retains shaping, genuine-conflict resolution, Human Decision
routing, cross-module reasoning and governance coordination. Coding Agent
handles repository discovery, analysis, and separately authorized implementation
and verification.

This transition changes knowledge authority only. H1–H4, zero confirmed legacy
long-term directions, P1–P17 including exact P16 provenance, the menu ambiguity,
six legacy provider references, HS-01–HS-20 and C1 remain unchanged. Booking
ownership, General Information and Reservations authority, implementation,
authorization, tenancy, environment, readiness and production state are preserved.
No Product, legal, privacy, security, provider, environment or production gate is
waived. This cutover creates no model, contract, integration, projection or
write-back and authorizes no Product/OpenSpec work, another migration, commit,
push, merge or deployment.
