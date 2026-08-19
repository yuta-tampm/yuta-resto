# Codex Prompt — Phase 4: Local Data and Receipt Integration

Begin only after explicit approval of the schema/resource, contracts,
permissions, validation, concurrency, audit, and receipt compatibility choices.
Implement the smallest real vertical slice through:

```text
apps/yuta-pos -> apps/site-agent -> packages/db-pos -> local PostgreSQL
```

Add guarded tests at each boundary. Initial receipt creation must read the local
profile inside the authoritative receipt snapshot transaction and store the
optional normalized name. Retry/reprint must copy the source payload unchanged.
The production renderer and read-only preview must omit the name line when
absent and must not invent legal/fiscal content or a fallback.

Run a new migration only against a disposable guarded database. Never connect
QA to operational data, cloud persistence, or browser-owned database code.
