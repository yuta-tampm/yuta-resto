@AGENTS.md

# Claude Code startup

`AGENTS.md` (imported above) and the documents it routes to are canonical.
This file adds only Claude-specific startup notes; it does not restate or
replace repository governance.

1. Read `docs/README.md` and `docs/CURRENT_STATE.md`, then the nearest nested
   `AGENTS.md` and the owning current documentation for the task.
2. For delegated work, follow the handoff under
   [Claude Code implementation delegation](docs/YUTA_AUTOMATED_CHANGE_WORKFLOW.md#claude-code-implementation-delegation):
   inherited mode and commit choice, exact write allowlist, protected paths,
   authorized commands and QA rights. Return evidence to Codex; Claude output
   is never a gate approval.
3. Read a needed skill directly from its exact
   `.agents/skills/<skill-name>/SKILL.md`. Direct reading does not register a
   slash command, invoke the skill or grant tool rights; do not map `$skill`
   markers to `/skill` commands.

## Caveats

- Preserve the exact bytes of protected files, including `.agents/` skills,
  OpenSpec artifacts, review records and the paths bound by
  `scripts/check-format-preservation.mjs`. Do not normalize line endings.
- Search tools match line by line by default; use an explicit multiline search
  when a pattern spans lines, and do not treat a missing match as proof.
- Permission rules in `.claude/settings.json`, the
  `yuta-readonly-reviewer` agent and the guard hook added by
  `scripts/claude-task.mjs` are Claude runtime controls, not an OS sandbox.
  Authorized commands may still write caches, generated output or other
  effects of their own. Runner usage is in
  [Development Workflow](docs/DEVELOPMENT_WORKFLOW.md#claude-task-runner).
- Codex keeps Bridge, federation, app-server evidence, lifecycle finish and
  commit execution. Record evidence under its actual executor.
- Never read, copy or print private real environment files (`.env`,
  `.env.local`, `.env.*.local`, `.env.production` and similar) or credentials.
  Direct tool reads of all `.env.*` names are blocked conservatively, including
  public templates. Codex can supply a tracked public `.env.example` through a
  hash-bound approved-reference snapshot in the handoff; use that supplied
  content rather than relaxing the deny rules. Ignored
  local env files may be prepared only through exact commands that a task
  handoff explicitly authorizes, with their recorded effects; a handoff whose
  env field is `NONE` grants no env rights.
- Never change login, billing or API-key configuration.
