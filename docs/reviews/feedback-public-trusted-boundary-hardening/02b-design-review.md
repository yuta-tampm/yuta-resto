Change: feedback-public-trusted-boundary-hardening

Gate: 2b — Sensitive Technical Design

Review status: AWAITING_HUMAN_REVIEW

Created: 2026-09-05

Schema: yuta-spec-driven

Analysis conclusion: READY_FOR_SPECS

Sensitive change: YES — public trusted boundary, security, runtime, and cross-module ownership

Design readiness: BLOCKED_BEFORE_APPLY

## Review lineage and approval boundary

[Gate 1](01-analysis-review.md) remains approved with exact packet SHA-256 545aa08084bc8607d723761ebc4eed3ff3b1534fe8d955fd8afd68cd558f438c. Proposal and Analysis hashes remain unchanged.

[Gate 2](02-specs-review.md) records the explicit current-user approval and has exact packet SHA-256 e8a2f9da00347007fb0c6c60e3f4553f80c169a92df94808c32898b5ffb158e9. The approved delta Spec remains SHA-256 f42e82be1b20031f7d48b5b48a59137f3d33e0b56bd3b5fb03a22c102c6c631c.

This turn is Design-only. No Tasks, implementation, schema, contract, runtime configuration, deployment, sync, or archive action is authorized or created.

## Design outcome

The Design selects two smallest enforcement points:

1. packages/db-cloud/src/tenant-adapters.ts must include verifiedAt in the existing domain eligibility calculation. No schema, migration, writer workflow, packages/tenant, or transport-contract change is justified.
2. apps/feedback-web must own request-time production salt validation. Salt existence and minimum 32-character length are checked independently of client-address presence, before persistence can occur.

The third required decision cannot be made safely. The repository does not establish the exact production client-IP provenance or proxy/origin topology. The current conventional x-forwarded-for / x-real-ip fallback is not accepted as evidence. Consequently the Design is explicitly BLOCKED_BEFORE_APPLY.

## Sensitive security assessment

| Concern                     | Design assessment                                                                                                                                                                                           |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public tenant authorization | Domain lookup can authorize only active + verified domain rows with active organization and establishment. Route slug remains a cross-check, never tenant proof.                                            |
| Enforcement ownership       | Verification evidence stays in @yuta/db-cloud; portable normalization/context stays in @yuta/tenant; app configuration and request identity stay in apps/feedback-web.                                      |
| Schema/data migration       | None. An invalid active + unverified row may remain stored but cannot authorize public access.                                                                                                              |
| Production secret           | Required salt is validated server-side before conditional IP logic; it is neither returned nor logged.                                                                                                      |
| Client identity             | Non-null production identity remains mandatory, but exact source is unresolved and cannot be selected by convention.                                                                                        |
| Raw IP/privacy              | Raw IP, forwarding chain, and request headers must not enter feedback persistence, thrown error payloads, logs, or new telemetry. Only the salted one-way hash crosses the rate-limit/persistence boundary. |
| Public error behavior       | Configuration/identity failures use a generic public failure and do not disclose the reason.                                                                                                                |
| Denial evidence             | Tests must prove unverified/inactive/malformed hostname denial, missing/short salt denial, missing/untrusted identity denial, no persistence on denial, and no raw-IP logging.                              |
| External providers          | Google/Facebook/Instagram connectors and external review integration remain out of scope.                                                                                                                   |
| Environment/readiness       | Repository implementation is not deployment evidence. No lifecycle or production-readiness promotion occurs.                                                                                                |

## Trusted client-IP provenance evidence review

Repository evidence establishes only the intended Vercel project/root/service-domain model. It does not establish whether public tenant requests go directly to Vercel, whether another CDN/proxy precedes it, whether Vercel Trusted Proxy is enabled, which provider-specific header is authoritative, or how alternate/direct origin access is controlled.

Vercel's [request-header contract](https://vercel.com/docs/headers/request-headers) describes direct-platform behavior, while its [reverse-proxy guidance](https://vercel.com/docs/security/reverse-proxy) and [proxy-on-top guidance](https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment) show that the visible client address and trusted source change when another proxy is placed in front. These provider documents therefore identify the decision inputs; they do not prove this deployment's inputs.

Dated read-only environment observation on 2026-09-05:

- Resolve-DnsName feedback.yutapro.fr -Server 1.1.1.1 -Type A returned DNS name does not exist.
- The system resolver returned the same NXDOMAIN result.
- No root or apps/feedback-web .vercel project metadata is present.
- No Vercel CLI/runtime project configuration or dated request-header capture is available in this checkout.

The DNS observation does not prove the intended future tenant-domain topology. It confirms only that repository text cannot be promoted into current runtime evidence.

## Non-deferrable blocker

The following evidence is required before revising and approving Design D3:

1. actual production request path for the landing and tenant domains, including every CDN/reverse proxy before Vercel;
2. applicable Vercel project/team Trusted Proxy setting, or explicit evidence that no proxy is in front;
3. DNS/origin mapping plus the control preventing alternate/direct origin bypass;
4. dated controlled runtime evidence of the platform-owned client-address source, using synthetic or redacted values rather than a real customer IP;
5. one exact trusted source with documented overwrite/spoofing guarantees.

After evidence is supplied, Design D3 and this packet must be revised and rehashed. Tasks remain prohibited until the revised Sensitive Design receives explicit approval.

## Cross-module impact conclusion

| Boundary                            | Outcome                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| apps/feedback-web                   | Affected: production security config, future trusted identity binding, failure/log discipline, focused tests.      |
| packages/db-cloud                   | Affected: existing domain adapter only; no schema/migration.                                                       |
| packages/tenant                     | Preserved: portable contract and ownership unchanged; coverage only if an approved scenario is not already tested. |
| packages/contracts                  | Not affected.                                                                                                      |
| Backoffice/domain workflow          | Not affected.                                                                                                      |
| Feedback payload/persistence schema | Not affected except existing hash receives only a valid hash in production.                                        |
| Deployment                          | Evidence requirement only; no configuration or topology change authorized.                                         |
| Social/external providers           | Not affected.                                                                                                      |

## Migration and rollback review

No database or contract migration, backfill, data rewrite, or domain workflow is designed. No deployment may proceed while provenance is unresolved.

For a later approved code rollout, invalid production configuration or missing trusted identity must keep submissions unavailable. Returning to the current silent bypass is not an acceptable steady-state rollback; traffic must remain fail closed until configuration/topology is corrected or a previously reviewed fail-closed version is restored.

## Requirement-to-Design review

| Approved requirement                               | Design decision | Review state         |
| -------------------------------------------------- | --------------- | -------------------- |
| Verified public tenant boundary                    | D1, D5          | Coherent and bounded |
| Production-required abuse-protection configuration | D2, D4, D5      | Coherent and bounded |
| Trusted production client identity                 | D3, D4, D5      | BLOCKED_BEFORE_APPLY |

## Reviewed integrity

Command: PowerShell Get-FileHash -LiteralPath <path> -Algorithm SHA256; exact file bytes, lowercase hexadecimal, sorted path inventory.

| Path                                                                                                       | SHA-256                                                          |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| docs/reviews/feedback-public-trusted-boundary-hardening/01-analysis-review.md                              | 545aa08084bc8607d723761ebc4eed3ff3b1534fe8d955fd8afd68cd558f438c |
| docs/reviews/feedback-public-trusted-boundary-hardening/02-specs-review.md                                 | e8a2f9da00347007fb0c6c60e3f4553f80c169a92df94808c32898b5ffb158e9 |
| openspec/changes/feedback-public-trusted-boundary-hardening/analysis.md                                    | 3d41d7ad9664a3468d6956fccec4a486a779e87b7debad2d63776d2a2573c2ba |
| openspec/changes/feedback-public-trusted-boundary-hardening/design.md                                      | 6a7eb14a75f96585451bbf45f7d9da9e46f1992728c8606c6cccdb6d0ec3968b |
| openspec/changes/feedback-public-trusted-boundary-hardening/proposal.md                                    | 89d08d9ddf5ea11af8c7eb5b6530c27e4b359167150bc45641d5750d8c42b9c1 |
| openspec/changes/feedback-public-trusted-boundary-hardening/specs/public-feedback/trusted-boundary/spec.md | f42e82be1b20031f7d48b5b48a59137f3d33e0b56bd3b5fb03a22c102c6c631c |

Repository provenance at Design start: HEAD 07d9d6d88e07f6a819c7894ef2e35f79d1eb32fa. Unrelated dirty work remains outside this change and was not modified.

## Design validation

| Check                                                                   | Exact result                                        |
| ----------------------------------------------------------------------- | --------------------------------------------------- |
| `openspec validate feedback-public-trusted-boundary-hardening --strict` | Exit 0; change is valid.                            |
| `pnpm exec prettier --check` for Design, Gate 2, and this packet        | Exit 0; all selected files match Prettier style.    |
| `pnpm docs:check`                                                       | Exit 0; 36 current documents consistent.            |
| `pnpm architecture:check`                                               | Exit 0.                                             |
| `pnpm -r --if-present typecheck`                                        | Exit 0; all invoked workspace typechecks completed. |

Raw OpenSpec status reports Design done and Tasks ready because the artifact graph dependencies exist. YUTA operational readiness remains `BLOCKED_BEFORE_APPLY` because D3 is a non-deferrable Sensitive Design decision. No Tasks file exists.

## Exact Design

```
## Context

Direct Customer Feedback is an independent public runtime owned by
`apps/feedback-web`. Its production authorization boundary starts with a request
hostname resolved through `@yuta/tenant` and the `@yuta/db-cloud` domain adapter;
its submission path then derives a salted client identity for the existing
database-backed rate limit.

The approved Specs require both boundaries to fail closed. Repository evidence
is sufficient to choose small enforcement points for domain verification and
production salt validation. It is not sufficient to select the production
client-IP source: the repository identifies Vercel as the intended host but does
not establish whether tenant traffic reaches Vercel directly or through another
proxy/CDN, which project-level Trusted Proxy settings apply, or which source is
protected from client spoofing.

This is a security-sensitive `CROSS_MODULE` design. It affects
`apps/feedback-web` and `packages/db-cloud`; it deliberately preserves the
portable `packages/tenant` contract and the current cloud schema. No Tasks or
Apply work is authorized by this document.

Authorities and evidence:

- approved [Proposal](proposal.md), [Analysis](analysis.md), and
  [delta Spec](specs/public-feedback/trusted-boundary/spec.md);
- [root instructions](../../../AGENTS.md),
  [feedback-web instructions](../../../apps/feedback-web/AGENTS.md),
  [tenant instructions](../../../packages/tenant/AGENTS.md), and
  [db-cloud instructions](../../../packages/db-cloud/AGENTS.md);
- [Tenancy architecture](../../../docs/architecture/TENANCY.md),
  [Database boundaries](../../../docs/architecture/DATABASE_BOUNDARIES.md),
  [Deployment authority](../../../docs/operations/DEPLOYMENT.md),
  [Production readiness](../../../docs/operations/PRODUCTION_READINESS.md),
  [Reputation Product Knowledge](../../../docs/features/reputation/README.md),
  and [ADR-004](../../../docs/decisions/ADR-004-independent-public-feedback-application.md);
- current [submission route](../../../apps/feedback-web/src/app/api/public/feedback/%5BtenantSlug%5D/route.ts),
  [public feedback resolver](../../../apps/feedback-web/src/server/resolve-public-feedback.ts),
  [domain adapter](../../../packages/db-cloud/src/tenant-adapters.ts),
  [tenancy schema](../../../packages/db-cloud/src/schema/tenancy.ts), and
  [reputation schema](../../../packages/db-cloud/src/schema/reputation.ts);
- Vercel's current
  [request-header contract](https://vercel.com/docs/headers/request-headers),
  [reverse-proxy guidance](https://vercel.com/docs/security/reverse-proxy), and
  [proxy-on-top guidance](https://vercel.com/kb/guide/can-i-use-a-proxy-on-top-of-my-vercel-deployment),
  used only to identify the missing deployment fact, not to infer this
  environment's topology.

## Goals / Non-Goals

**Goals**

- Enforce active plus verified domain eligibility at the smallest server-side
  persistence adapter that owns the required evidence.
- Validate the production salt contract before submission processing can depend
  on client-address presence.
- Bind production rate-limit identity to exactly one evidenced trusted source,
  with no conventional-header fallback.
- Keep raw client IP out of persistence and out of new or modified
  logging/telemetry paths.
- Define focused denial and success evidence for the approved requirements.

**Non-Goals**

- No schema migration, tenant-domain management or verification workflow,
  shared transport contract, or centralized environment framework unless later
  evidence invalidates the selected small enforcement points.
- No rate-limit atomicity, idempotency, duplicate handling, body-limit, contact
  PII, retention/deletion, settings, UI/accessibility, external URL, QR,
  analytics, social connector, or composite tenant ownership work.
- No deployment, production-readiness promotion, or invented proxy topology.
- No raw-IP persistence, request-header dump, or new telemetry sink.

## Decisions

### D1 — Enforce verification in the cloud domain lookup adapter

`packages/db-cloud/src/tenant-adapters.ts` is the smallest correct enforcement
point because it owns access to `tenant_domains.verified_at` and already combines
domain, organization, and establishment status into the record consumed by the
portable tenant resolver.

`createDomainLookup(...).findActiveByHostname(...)` will read `verifiedAt` and
will classify the result as active only when all four conditions hold:

1. `tenant_domains.status = 'active'`;
2. `tenant_domains.verified_at IS NOT NULL`;
3. the owning organization is active;
4. the owning establishment is active.

An absent row or any failed condition cannot produce an active
`DomainTenantRecord`; therefore `resolvePublicTenant` cannot create trusted
public context. Existing hostname normalization, exact hostname comparison,
immutable context construction, and the application-level slug cross-check stay
unchanged.

The selected design does not add `verifiedAt` to `DomainTenantRecord` and does
not change `packages/tenant`, `packages/contracts`, schema, migrations, or the
seed. The seed remains evidence for its own write path only. A future domain
management workflow must preserve the same invariant but is outside this
change.

**Alternatives rejected:** a schema check constraint or new write workflow is
broader than necessary and would not be justified by the only tracked writer;
checking in `apps/feedback-web` would leak persistence detail across ownership;
changing the portable tenant record would create a shared contract change with
no current need.

### D2 — Use an app-owned production security configuration boundary

`apps/feedback-web` will own a small server-only security helper for public
feedback submission. It will validate configuration independently of request
headers and expose typed success/failure without returning secret values.

At the beginning of the production `POST` path, before body persistence or any
conditional client-address branch, the helper will require
`PUBLIC_FEEDBACK_IP_HASH_SALT` to exist and contain at least 32 characters. A
missing or short value produces a generic public `500` failure and no feedback
write. Non-production may retain the explicitly named local-development salt so
local feedback development remains possible; that behavior cannot execute when
`NODE_ENV === 'production'`.

The validated salt remains server-only and is passed directly to the one-way
SHA-256 identity derivation. It is never logged, returned, persisted, or exposed
to a browser bundle. Validation stays in the runtime request boundary rather
than a new repository-wide environment framework because `feedback-web` has no
existing app-owned startup validator and this secret is used only by this
submission path.

The repository metadata type may remain nullable for non-production callers;
the production route itself must provide a non-null hash before rate-limit read
or feedback persistence. No database column or repository signature change is
required by this design.

**Alternatives rejected:** preserving the current conditional validation allows
missing client identity to bypass mandatory configuration; build-time-only
validation does not prove runtime secret availability; a centralized env
framework or shared contract is not justified by this single server-only value.

### D3 — Production client-IP source is unresolved and cannot be inferred

**Design status: `BLOCKED_BEFORE_APPLY`.**

The current route takes the first `x-forwarded-for` value and falls back to
`x-real-ip`. That implementation is not accepted as the future trusted contract.
Vercel documents that it overwrites these headers for direct platform requests,
but also documents that a proxy in front changes which address Vercel observes
and can require an explicit Trusted Proxy/provider-specific arrangement. The
repository does not prove which case applies to tenant hostnames.

The intended deployment document names a separate Vercel project and
`feedback.yutapro.fr`, but it does not record direct-versus-proxied traffic,
project/team Trusted Proxy configuration, direct-origin protection, or the
authoritative header. On 2026-09-05, independent lookups through the local DNS
resolver and `1.1.1.1` returned `NXDOMAIN` for `feedback.yutapro.fr`; this is a
dated environment observation, not proof of a production routing contract.

Apply remains blocked until the Sensitive Design review has all of the
following concrete evidence:

1. the actual production path for the landing domain and tenant domains,
   including whether any CDN/reverse proxy precedes Vercel;
2. the applicable Vercel project/team Trusted Proxy setting or explicit evidence
   that no proxy sits in front;
3. DNS/origin mapping and the control that prevents an alternate/direct origin
   path from bypassing the chosen source contract;
4. a dated, controlled runtime request observation showing which platform-owned
   source supplies the client address, with values redacted or synthetic so no
   real customer IP enters the evidence;
5. one exact selected source and its overwrite/spoofing guarantee.

After this evidence exists, Design D3 and the Sensitive Design packet must be
revised, rehashed, and approved before Tasks. The revised design must select one
source, reject missing/malformed values, and never fall back to another
client-IP-like header. It must also define the accepted address syntax and any
proxy-chain position from the proven contract rather than convention.

**Alternatives rejected now:** selecting `x-forwarded-for`, `x-real-ip`, or
`x-vercel-forwarded-for` from documentation alone; trusting a configurable
arbitrary header name without provenance; hashing `unknown`; sharing an
anonymous bucket; or deferring the decision to implementation/operations.

### D4 — Fail closed without raw-IP leakage

When D3 is resolved, the app-owned helper will return only a validated salted
hash or a typed error code. Raw address values, the complete forwarding chain,
request headers, and salt must not be placed in thrown error messages,
structured error fields, logs, or telemetry.

The public response remains the existing generic failure shape; it does not
reveal whether configuration or identity establishment failed. Any route logging
touched by this change may record a stable category such as
`PUBLIC_FEEDBACK_SECURITY_CONFIGURATION_INVALID` or
`PUBLIC_FEEDBACK_TRUSTED_CLIENT_IDENTITY_UNAVAILABLE`, but not the error object
when that object could carry request-derived values. No new telemetry is added.

Only the salted SHA-256 value may cross into
`countRecentPublicSubmissions(...)` and `createPublicFeedback(...)`. Current
`submission_ip_hash` persistence remains; raw IP is not added to schema,
repository input, audit events, or feedback payloads.

### D5 — Focused verification at each owning boundary

The later approved implementation must add only tests needed for these
invariants:

- `packages/db-cloud`: active plus verified domain succeeds; active plus
  unverified, pending/disabled domain, inactive organization, and inactive
  establishment cannot return an active record. Prefer a focused adapter test;
  guarded disposable-database evidence is required if mocks cannot prove the
  selected Drizzle predicate.
- `packages/tenant`: preserve existing hostname normalization, exact match,
  unknown host, and slug-independent authorization behavior; add malformed URL
  or hostname denial only where current coverage does not already prove the
  approved scenario.
- `apps/feedback-web`: production missing salt, short salt, missing trusted
  client source, malformed/untrusted source, and unapproved fallback header all
  fail before persistence; a valid salt plus the future evidenced source yields
  only a hash; security failures do not log raw headers/address/salt.
- route/repository spies must prove no rate-limit lookup or feedback insert on
  configuration/identity denial. Existing unrelated feedback submission cases
  are not expanded.

The feedback app may adopt the repository's existing Vitest tool as an app-local
development test dependency if that is the smallest way to own these focused
tests. This is reuse of the current test framework, not a new application
framework. Exact test files and commands belong to Tasks only after D3 is
resolved and the Sensitive Design is approved.

## Requirement-to-Design Coverage

| Approved requirement                               | Design coverage | Status                                          |
| -------------------------------------------------- | --------------- | ----------------------------------------------- |
| Verified public tenant boundary                    | D1, D5          | `DESIGNED`                                      |
| Production-required abuse-protection configuration | D2, D4, D5      | `DESIGNED`                                      |
| Trusted production client identity                 | D3, D4, D5      | `BLOCKED_BEFORE_APPLY` pending exact provenance |

## Cross-Module Impact Check

| Boundary                     | Decision                                                                                                                                  |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/feedback-web`          | Own production configuration, future trusted source binding, hash derivation, generic failure behavior, and no-raw-IP logging discipline. |
| `packages/db-cloud`          | Own the `verifiedAt` eligibility check in the domain adapter and focused persistence-adapter evidence; no schema/migration.               |
| `packages/tenant`            | Preserve current portable normalization/resolution contract; tests only if an uncovered denial scenario requires it.                      |
| `packages/contracts`         | No change. Existing public failure shape remains sufficient.                                                                              |
| Backoffice/domain management | No change. No new writer or verification workflow.                                                                                        |
| Deployment                   | Evidence provider only; no topology or setting change is designed or authorized.                                                          |
| Feedback persistence         | Existing hash column only; no raw IP and no data migration.                                                                               |
| External providers           | No Google/Facebook/Instagram connector or external review integration change.                                                             |

## Risks / Trade-offs

- **Production submissions unavailable under incomplete configuration:** this is
  the approved fail-closed behavior. A generic failure is safer than silently
  accepting feedback without the promised abuse boundary.
- **Read-boundary enforcement does not repair invalid stored rows:** an active
  unverified row remains stored but cannot authorize public access. Repair or
  domain lifecycle management is outside scope.
- **No schema backstop for future writers:** the adapter protects the public
  runtime now. Any future writer must define and test activation semantics under
  its own approved change.
- **Header behavior can drift with deployment topology:** this is why D3 cannot
  be implemented from repository/provider documentation alone. The eventual
  contract must be reviewed again when proxy topology changes.
- **Request-time validation repeats work:** the cost is negligible for one
  string check and proves runtime availability. A later app-wide validated env
  bootstrap may centralize it only under a separate justified change.
- **Security diagnostics are intentionally sparse:** operators receive stable
  categories without secret or client-address values; deeper investigation must
  use controlled, privacy-safe deployment evidence.

## Migration Plan

No database migration, backfill, data rewrite, shared contract migration, or
domain-management rollout is designed.

No deployment may proceed while D3 is unresolved. After provenance evidence is
accepted and the revised Sensitive Design is approved, the expected change is a
code-only rollout with production configuration preflight and focused denial
smoke tests before accepting traffic. Raw IP must not be captured for preflight
or smoke evidence.

If a later deployment exposes invalid configuration or unavailable trusted
identity, the endpoint must remain fail closed. Rolling back to the current
silent-bypass behavior is not an acceptable steady-state recovery; traffic
should remain disabled or use the last reviewed fail-closed implementation
until configuration/topology is corrected. This document authorizes no
deployment action.

## Open Questions

There are no deferrable implementation questions. The exact production
client-IP provenance is a non-deferrable security blocker recorded in D3, not a
post-implementation TODO.

```

## Recommendation and human review decision

Recommendation: BLOCKED_BEFORE_APPLY.

Do not approve Tasks or Apply from this packet. Supply the concrete deployment/runtime evidence listed above; then regenerate the exact D3 decision and Sensitive Design packet for approval.
