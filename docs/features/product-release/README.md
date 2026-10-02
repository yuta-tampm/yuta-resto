# YUTA Product Release

Status: Current

Visibility: Engineering

Owner: YUTA product and engineering

Last updated: 2026-09-24

## Purpose and current release

YUTA Product Version is the global semantic version of the YUTA Product
Release. It is independent of individual application and package versions.
Product Maturity Stage describes the product as a whole; it does not report the
readiness of each capability.

The current approved release is shown here for human reference:

| Release metadata       | Current value   |
| ---------------------- | --------------- |
| Product                | `YUTA`          |
| Maturity stage         | `ALPHA`         |
| Canonical public label | `Alpha`         |
| Product Version        | `0.1.0-alpha.1` |
| Release name           | `Foundation`    |

Its full public representation is `YUTA Alpha · v0.1.0-alpha.1`. The single
authoritative current-release record for runtime consumers is
[`CURRENT_YUTA_PRODUCT_RELEASE`](../../../packages/core/src/product-release.ts)
in `packages/core/src/product-release.ts`. This document is not a runtime
configuration or a second source of current-release values.

## Product Version and package versions

`package.json.version` is package/workspace metadata, independent of YUTA
Product Version. Changing the Product Version does not automatically require a
package-version change. A package version does not determine Product Maturity
Stage. Do not synchronize package versions merely to match a Product Release.

The canonical Product Version has either of these forms:

```text
MAJOR.MINOR.PATCH
MAJOR.MINOR.PATCH-PRERELEASE
```

The numeric components are nonnegative integers without leading zeroes, except
`0` itself. A prerelease suffix contains nonempty dot-separated identifiers;
fully numeric identifiers also have no leading zeroes. The canonical value has
no leading `v` and this foundation does not accept build metadata (`+...`).
The `v` in a rendered label is presentation text. Prerelease text does not
determine or automatically change Product Maturity Stage.

## Canonical maturity stages

| Stage                  | Public label |
| ---------------------- | ------------ |
| `PROTOTYPE`            | Prototype    |
| `ALPHA`                | Alpha        |
| `PRIVATE_BETA`         | Private Beta |
| `PUBLIC_BETA`          | Public Beta  |
| `RELEASE_CANDIDATE`    | RC           |
| `GENERAL_AVAILABILITY` | Stable       |

These are the six approved stages and their only canonical public labels.
Changing this mapping requires a separately approved change.

## Release name and consumers

Release name is human-readable metadata. The current name is `Foundation`.
It does not control authorization, routing, feature availability, capability
lifecycle, tenant behavior, or deployment.

The implemented direct consumers are:

- Public Web: its existing marketing footer derives the full representation
  from the Core record.
- Authenticated Backoffice: its existing `AppFooter` derives the compact
  `Alpha · v0.1.0-alpha.1` representation from the same Core record.

Booking Web, Feedback Web, POS, and Display are follow-up compatibility
consumers, not implemented Product Version surfaces in this foundation. Site
Agent and reserved Platform Admin are outside its implementation scope.

## Manual release update

1. Obtain a separate Product decision approving the next release metadata and
   any stage change. Do not infer a stage from the version suffix or a
   capability's status.
2. Update only `CURRENT_YUTA_PRODUCT_RELEASE` in
   `packages/core/src/product-release.ts` with the approved product, stage,
   version, and release name. Change the canonical stage mapping only through
   its own approved change.
3. Run relevant Core tests and typecheck, consumer tests/typechecks/builds, and
   architecture checks for the affected code.
4. Complete the required technical review and real Web/Backoffice Browser QA
   for the exact candidate before claiming that presentation is verified.
5. Release or deploy only under the separate authority in
   [Deployment](../../operations/DEPLOYMENT.md) and
   [Production Readiness](../../operations/PRODUCTION_READINESS.md).

This foundation has no release CLI, automatic version bump, runtime provider,
or deployment automation.

## Lifecycle, readiness, and deployment boundaries

Product Release and Product Maturity are independent of capability lifecycle
and readiness. `YUTA Alpha · v0.1.0-alpha.1` does not establish that every
capability is `IMPLEMENTED`, `READY`, `PRODUCTION_ENABLED`, or externally
`READY`. A capability becoming production-ready does not automatically move
YUTA from Alpha to Beta.

Product Release metadata itself authorizes no deployment, production release,
production enablement, or tenant rollout. The existing operations documents
remain authoritative for those decisions and procedures.

## Illustrative future releases

The examples below illustrate the versioning mechanism only. They do not
authorize any future release, stage promotion, capability readiness, or
deployment.

| Example Product Version | Illustrative presentation           |
| ----------------------- | ----------------------------------- |
| `0.1.0-alpha.1`         | YUTA Alpha — Foundation             |
| `0.2.0-beta.1`          | YUTA Private Beta — Reputation Core |
| `0.3.0-beta.1`          | YUTA Private Beta — Direct Feedback |
| `0.9.0-rc.1`            | YUTA RC                             |
| `1.0.0`                 | YUTA Stable                         |

The current approved release remains `YUTA Alpha — Foundation /
0.1.0-alpha.1` until a separate Product decision changes it.
