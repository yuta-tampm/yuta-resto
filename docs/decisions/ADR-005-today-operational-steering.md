# ADR-005: Define Today as the restaurant operational steering surface

Status: Accepted

Date: 2026-08-26

Decision owners: YUTA

Decision type: Product

Product Decision: APPROVED

## Context

Restaurant teams need a bounded view of the situations that require attention
now without turning a dashboard into another operational system or source of
truth. The implemented Today route already aggregates a limited set of
establishment-scoped information, while several additional operational
information families remain future work.

## Decision

Today (`Aujourd'hui`) is the restaurant's central operational steering page.
Its purpose is to reduce operational mental load by surfacing only information
that requires someone to prepare, do, decide, correct, verify, or anticipate
something.

Today is an aggregation and decision-support surface. It must not replace source
modules, become a second source of truth, duplicate canonical records merely
for dashboard purposes, bypass source-module permissions, or silently take
ownership of source-module mutations.

### Role context

The approved intent is contextual by role:

- the team executes the current service;
- the manager supervises service execution and operational blockers;
- the restaurant owner sees items that require a decision, intervention,
  correction, or follow-up.

This intent does not establish that separate role-specific dashboards are
implemented.

### Approved information families

Today is approved to surface relevant operational information from these source
families:

1. Reservations: reservations by service, covers or groups, table implications
   where applicable, relevant special requests, and operational consequences
   for the service.
2. Tâches du jour and checklists: tasks relevant to the employee, post, or
   service, including pending or blocked operational work.
3. Service handover: relevant information passed from a previous service or
   team.
4. Pointage: actionable attendance or time-tracking anomalies, without general
   Personnel duplication.
5. Stock and Inventaire: inventories that need to be performed, insufficient
   stock, and other actionable stock situations.
6. Fournisseurs and purchasing: purchase needs, orders or deliveries requiring
   attention, and relevant supply timing or issues.
7. Reputation and customer feedback: reviews or comments requiring a response
   or operational attention.
8. Internal operational knowledge: relevant announcements or procedures when
   they require awareness or action.
9. Compliance: applicable and actionable compliance items or alerts.

These categories are approved Product Intent. They do not state that every
source capability or Today integration is implemented.

### Attention principles

Today should surface the current relevant situation rather than an unfiltered
succession of events. Where the owning module supports it, Today should avoid
duplicate alerts for the same unresolved situation.

The conceptual distinction between a task, anomaly, alert or information item,
and action is approved Product Intent. Detailed state machines, persistence,
deduplication behavior, and source-specific workflows require future approved
OpenSpec specifications or module-specific specifications.

### Ownership

Every surfaced item remains owned by its source module. Reservation facts
remain owned by Reservations; Pointage anomalies by Pointage; employee identity
by Personnel; task records by Tâches du jour; inventory facts by Stock or
Inventaire; supplier and order facts by Fournisseurs; reviews by Reputation;
and compliance facts by Compliance. Today may aggregate and present these
facts, but it does not become their canonical data owner.

### Planning and Personnel boundaries

This decision does not approve a direct Planning-to-Today integration. Such an
integration requires separate authoritative approval.

This decision does not approve direct Personnel data aggregation into Today.
Personnel may be indirectly relevant through approved source capabilities such
as Pointage or Tâches du jour, but Today must not become an employee identity
source.

## Alternatives considered

- Make Today an operational record system: rejected because it would duplicate
  source ownership and create competing truths.
- Present an unfiltered event feed: rejected because it increases mental load
  and does not represent the current actionable situation.
- Approve direct Planning or Personnel aggregation as part of this decision:
  rejected because neither boundary is established by the approved intent.

## Consequences

### Positive

- Today has an explicit product boundary for current and future work.
- Source ownership, authorization, and mutation boundaries remain intact.
- Future specifications can define behavior for each approved information
  family without treating the category approval as implementation evidence.

### Negative

- Each future source capability and integration still requires its own
  implementation, evidence, and detailed behavioral specification.
- Today cannot fill source-module gaps with dashboard-owned records or state.

## Follow-up

Define source-specific behavior, states, permissions, and integration contracts
in future approved module specifications or normative OpenSpec specifications.
Do not infer implementation or production readiness from this decision.

## Supersedes

None.

## Superseded by

None.
