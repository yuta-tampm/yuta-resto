# YUTA UI Delivery Workflow Modes

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-08-12

## Purpose

YUTA uses two delivery workflow modes depending on whether the requested
capability already exists. Both modes remain governed by
`DESIGN_TO_CODE_WORKFLOW.md`, repository and application instructions, current
architecture, and the page-pack lifecycle.

The selected mode changes how product discovery, visual design, domain design,
and implementation are sequenced. It does not change runtime, authorization,
tenancy, persistence, or security authority.

## Mode A — Existing Capability UI Renewal

Short name: `EXISTING_CAPABILITY_RENEWAL`

Working principle: **reality-first UI renewal**.

Use this mode when the target already has meaningful implemented behavior,
such as persisted data, loaders, mutations, validation, authorization,
transactions, polling, offline behavior, provider integration, or device
ownership.

The objective is to improve the information architecture, component structure,
interactions, responsive behavior, and visual presentation without replacing
or silently redesigning the working domain.

```text
implemented capability and real data
-> repository and behavior inventory
-> authenticated/current-state baseline
-> design proposal constrained by reality
-> approved UI renewal
-> in-place implementation
-> regression and visual QA
-> as-built synchronization
```

Rules:

- classify the target as `EXISTING_PAGE` or another existing target type;
- preserve real authorization, scope, data, contracts, mutations, validation,
  transactions, polling, offline, provider, and device behavior;
- use current data and states for the baseline;
- do not replace an integrated page with fixtures;
- keep authoritative business logic in its existing domain or service owner;
- stop for approval if the design requires a new field, enum, permission,
  contract, API, schema, provider, or runtime behavior;
- implement the smallest coherent in-place change and protect it with existing
  and updated tests.

The POS `/management/printing` pilot is the reference example for this mode.

## Mode B — New Capability Discovery and Delivery

Short name: `NEW_CAPABILITY_DISCOVERY`

Working principle: **design-first discovery, domain-gated delivery**.

Use this mode when the route is absent or only a truthful placeholder and the
repository does not yet contain the business domain, persistence, contracts,
mutations, or authorization required for the requested capability.

The objective is to use product flows and UI prototypes to make the intended
jobs, information, actions, states, and boundaries understandable before
committing to a database model. A prototype is discovery evidence, not proof
that the capability is implemented.

```text
product problem and boundary discovery
-> UI/flow prototype with typed fixtures
-> interaction and state mapping
-> data dictionary and domain proposal
-> authorization, ownership, retention, and security approval
-> contracts and persistence design
-> vertical-slice implementation on real data
-> functional, security, and visual QA
-> fixture removal and as-built synchronization
```

Rules:

- classify the target as `NEW_PAGE` or another new target type even when a
  placeholder route already exists;
- first establish the user, job to be done, application/runtime, domain
  boundaries, sensitive-data constraints, and non-goals;
- permit typed fixtures for an explicitly labelled design prototype;
- design required loading, empty, error, forbidden, validation, conflict,
  pending, success, and recovery states;
- derive an interaction map and data dictionary from the approved prototype;
- distinguish stored values, derived values, transient UI state, and
  integration-owned values;
- do not convert prototype view types directly into database tables;
- approve data ownership, tenant scope, authorization, audit, retention,
  privacy, contracts, and migrations before implementing real mutations;
- deliver the capability as tested vertical slices rather than building the
  entire backend or the entire UI in isolation;
- replace prototype fixtures with real integration before claiming the target
  is implemented.

For a vertical slice, complete one useful behavior end to end:

```text
approved user flow
-> domain rule
-> schema and migration when required
-> repository and tenant-scoped authorization
-> transport contract and validation
-> tests
-> integrated UI and truthful states
```

## Selection rule

Choose the mode from repository evidence, not from the age of the route or the
presence of a visual mockup.

| Repository state                              | Workflow mode                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Real data and behavior already exist          | Existing Capability UI Renewal                                                                    |
| Route exists only as a planned placeholder    | New Capability Discovery and Delivery                                                             |
| No route and no domain exist                  | New Capability Discovery and Delivery                                                             |
| Some domain exists but the target flow is new | Start with New Capability Discovery and Delivery, then reuse the proven domain in vertical slices |
| Status is ambiguous                           | Keep classification `UNKNOWN` and complete read-only repository analysis before selecting a mode  |

## Shared non-negotiable gates

Both modes require:

- repository and application authority before visual references;
- explicit product scope and non-goals;
- trusted authorization and runtime/data ownership;
- approved design before implementation-ready status;
- no invented capability presented as implemented;
- functional and regression QA before final visual sign-off;
- responsive, accessibility, and state QA;
- truthful delivery evidence and as-built documentation.

## Practical distinction

```text
Existing capability:
understand the implemented system -> redesign its UI safely

New capability:
prototype the intended experience -> understand and approve the domain
-> build real vertical slices
```

Design may lead discovery for a new capability. Repository architecture,
approved product decisions, domain rules, authorization, and persistence still
lead production implementation.

## Change-control requirement

This document is part of the canonical UI workflow and must not become a stale
summary.

Any change to one or more of the following requires reviewing and, when
affected, updating this document in the same change:

- lifecycle steps or phase order;
- target or page classification;
- the distinction between existing and new capabilities;
- fixture and prototype rules;
- product, design, domain, data, authorization, or implementation approval
  gates;
- vertical-slice delivery rules;
- functional, security, visual, device, or as-built completion gates;
- page-pack lifecycle, templates, prompts, tooling, or daily checklist behavior.

The reverse also applies: a change to either workflow mode must be reconciled
with `DESIGN_TO_CODE_WORKFLOW.md`, `PAGE_PACK_PROTOCOL.md`, page templates,
phase prompts, `UI_WORKFLOW_DELIVERY_CHECKLIST.md`, and UI-pack tooling when
those artifacts are affected.

Documentation review must answer explicitly:

```text
Does this change alter how an existing capability is renewed?
Does this change alter how a new capability is discovered or delivered?
Do the canonical lifecycle, templates, prompts, checklist, and tooling still
describe and enforce the same process?
```

A workflow change is incomplete while these answers reveal an unresolved
drift. Do not create a parallel `v2`, `new`, or `latest` workflow document;
update the current sources in place and rely on Git history.
