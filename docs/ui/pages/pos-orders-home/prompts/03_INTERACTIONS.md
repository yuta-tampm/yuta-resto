# Phase 03 — POS Orders Home Interactions

Run only after explicit Phase 3 approval.

Implement and test only repository-backed interactions: view navigation preserving `q`, GET search, Home/new-order/kitchen/management links, detail/payment links by current status, collapsed header actions, mobile FAB, safe retry, keyboard focus, and touch behavior.

Draft still navigates to detail for send flow; it must not send from Home. Paid/cancelled remain detail-only. Do not add filter drawers, overflow menus, cancel/send/serve/reopen/print/customer actions, new statuses, staff login, polling/realtime, or offline writes. Preserve service/database/Internet/printer distinctions and do not make health retry mutate operational state.
