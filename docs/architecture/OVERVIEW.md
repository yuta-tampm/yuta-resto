# YUTA Architecture Overview

Status: Current

Visibility: Engineering

Owner: YUTA engineering

Last updated: 2026-10-03

YUTA combines cloud SaaS applications with local restaurant products. These
runtime families share contracts, pure logic, and UI components, but they do
not share operational databases.

```text
Public visitors --> web / booking-web / feedback-web --> db-cloud (server only)
Restaurant users --> backoffice -------> db-cloud (server only)
POS terminals ----> yuta-pos ----------> site-agent --> db-pos
Display browser --> yuta-display ------> app-owned display database
```

Applications own framework boundaries and user flows. Database packages own
persistence. `tenant` owns trusted cloud scope and guards, `auth` owns portable
authentication primitives, `contracts` owns boundary schemas, `core` and
`booking` own pure domain logic, and `ui` owns reusable presentation primitives.

Server code may resolve identity and tenant context, enforce authorization,
query persistence, call providers, and access secrets. Client code may render
trusted results, collect input, and call approved server boundaries; it must not
import database packages, drivers, server environment modules, or secrets.

Platform-wide YUTA administration belongs in the future `apps/platform-admin`,
never in the restaurant back-office.
The application remains unimplemented. The shared auth package now contains
only a bounded, non-runtime authority foundation for five explicit GLOBAL YUTA
Formalités template operations. It creates neither a general Platform Admin
product nor tenant authority, template persistence/lifecycle, or production
enablement.

## AI and file storage direction

The [AI and Storage architecture](AI_AND_STORAGE.md) is the shared knowledge
entry point for the agreed capability/policy, canonical-file and provider
qualification direction. It distinguishes current implementation, the bounded
synthetic Personnel implementation, deferred Storage/provider work and the instructions
for continuing in a fresh chat. It changes no runtime/database ownership or
production readiness.

Backoffice's app-local `src/server/ai/` owns a single typed synthetic Personnel
capability, versioned configuration/policy, eligibility followed by static
selection, an adapter deadline and minimized terminal observations. Personnel
owns source authorization/classification, PDF preparation and result semantics;
server composition injects the existing deterministic/OpenAI/stored adapters
and domain validator. AI has no tenant repository, persistence, storage or
canonical domain mutation. Real/unknown data and non-development execution
remain denied; Luna/v4 and source/review/apply guards remain bounded synthetic
behavior. No shared AI package or provider qualification follows.

## Public-product visibility

Architecture documentation may describe every maintained runtime family.
Public YUTA product communication describes only approved cloud/public-service
capabilities. Local operational products remain engineering-owned without
becoming public-service claims.

Create an ADR before changing application ownership, dependency direction,
database ownership, tenant/authentication semantics, public compatibility, or
deployment topology.
