# Pilot 01 — Establishment Contact Copy Specs Report

## 1. Capability path

The delta spec was created for the existing Product capability at:

`establishment-profile`

Change artifact:

`openspec/changes/establishment-copy-primary-contact-to-public/specs/establishment-profile/spec.md`

This is the first proposed OpenSpec capability path for Establishment Profile. No separate button-specific or Restaurant Knowledge capability was introduced.

## 2. Requirements created

The delta uses `## ADDED Requirements` and defines four observable behavior contracts:

1. Conditional copying from primary contact to public contact.
2. Draft-only behavior with explicit save and existing validation preserved.
3. No ongoing synchronization and independent public-contact editing.
4. Preservation of existing permission, tenant authorization, visibility, ownership, and capability boundaries.

The requirements contain no React, component, hook, API, test-framework, layout, icon, or database implementation choices.

## 3. Scenarios covered

The spec covers:

1. Both primary phone and email are non-empty.
2. Primary phone is empty or null while primary email is non-empty.
3. Primary phone is non-empty while primary email is empty or null.
4. Both primary source fields are empty or null.
5. An existing non-empty public value is overwritten only when its corresponding source is non-empty.
6. Copy changes the form draft but does not persist without explicit save.
7. Existing profile validation still applies during save.
8. A later primary-contact change does not automatically update its public counterpart.
9. Public contact remains independently editable after copy.
10. A read-only user cannot trigger draft-mutating copy behavior.
11. Visibility flags and out-of-scope domain data remain unchanged.
12. Save after copy still uses the existing trusted tenant scope and server authorization.

## 4. Validation result

Command executed:

```text
openspec validate establishment-copy-primary-contact-to-public --strict
```

Result: **PASS** — `Change 'establishment-copy-primary-contact-to-public' is valid`.

## 5. Remaining ambiguity or blocker

None at requirement level. The reviewed empty/null rule is explicit: an empty or null primary source preserves the corresponding existing public draft value.

Detailed control presentation and implementation structure remain future design concerns; they do not block the behavioral contract. No lifecycle value is changed by this spec artifact.

## 6. Recommendation

`READY_FOR_DESIGN`

Proceed only after review and approval of this delta spec. No `design.md` or `tasks.md` has been created in this step.

Status: PROPOSED FOR REVIEW
