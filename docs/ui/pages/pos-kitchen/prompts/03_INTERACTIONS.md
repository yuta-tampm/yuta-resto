# Codex Prompt — Phase 3: POS Kitchen Approved Interactions

Implement only interactions explicitly approved after design review. Preserve
the current transition matrix and the separate allergy-before-ready rule.
Keep site-agent authoritative and treat the selected staff cookie as
attribution, not management authorization.

If pending/error/success feedback is approved, prevent repeated activation,
distinguish stale `INVALID_ITEM_STATUS` from other failure, refresh to current
persisted truth, and keep operator recovery visible. Do not add bulk actions,
cancellation/restore, optimistic status ownership, new polling/realtime,
operation IDs, locks, or transaction changes in this UI phase. Test keyboard,
touch, focus, disabled, pending, conflict, error, success, and recovery, then
stop before Phase 4.
