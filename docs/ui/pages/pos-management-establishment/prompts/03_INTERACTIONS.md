# Codex Prompt — Phase 3: Approved Interactions

Implement only explicitly approved edit rights, validation, dirty-state,
pending/success, clear/rename confirmation, conflict, outage, retry, and
session-expiry behavior. Preserve submitted input on recoverable failures and
derive authorization from the server-validated local management session.

Do not invent last-write-wins or optimistic-lock behavior. Do not add audit
history, extra fields, cloud data, or receipt behavior without its dedicated approval.
