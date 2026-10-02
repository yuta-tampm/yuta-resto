# Codex Prompt — Phase 4: Approved Production Vertical Slice

Run only after one slice's data dictionary, domain, authorization, privacy,
audit, retention, contracts, schema/migration, and tests are approved.

```text
approved flow -> domain rule -> reviewed schema/migration when required
-> establishment-scoped repository/authorization -> Zod contract
-> security/domain tests -> integrated UI/states -> fixture removal
```

Use trusted organization and establishment scope; deny ID-only lookup, wrong
tenant, suspended/stale membership, and missing authorization. Never reuse POS
staff or users/memberships as employees. Stop before any unapproved field,
permission, entitlement, API/schema/storage/audit/retention or adjacent feature.
Run exact affected checks and stop.
