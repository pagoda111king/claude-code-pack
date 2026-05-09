---
description: Use when reconnecting across a long gap (opening a new Claude Code session and ≥ 1 day since last work). Not needed for short gaps or continuous work — the SessionStart hook status board already shows what you need.
---

# /resume-session

**4.7 era positioning**: Use when reconnecting across a **long gap** · not for short continuous sessions.

**Should use**:
- ✅ Opening a new Claude Code session and ≥ 1 day since last work
- ✅ Returning to a project after switching machines or cities
- ✅ Picking up a session memo left by someone else

**Should not use**:
- ❌ Resuming after a few hours break (SessionStart status board already shows what you need)
- ❌ Immediately running /resume-session right after /save-session (redundant)
- ❌ Just wanting a "quick look" — read docs/INDEX.md or docs/sessions/INDEX.md directly

---

Read the latest session memo, reload context, and ask the founder where to continue.

## Execution Flow

### 1. Locate target memo

- If no argument provided → read first line of `docs/sessions/INDEX.md` (latest)
- If user specifies a date or slug (e.g. `/resume-session 2026-04-24` or `/resume-session ecc-policy`) → match in INDEX
- If INDEX is empty or not found → tell the user and list all files under `docs/sessions/` for them to choose

### 2. Read memo file

Read the full content. Focus on:
- `status` field (completed / paused / blocked)
- Files listed in the "Next startup needs" section
- Open items in the "Open questions" section

### 3. Preload context

For each file listed in "Next startup needs", **concurrently** Read all listed files. Skip if a file doesn't exist.

### 4. Report to founder

Output 3 sections:

**A · What was done last time**
Reference the memo's "Completed" section as a bullet list.

**B · Open questions at the time**
Reference the memo's "Open questions" section.

**C · Suggested where to continue**
Based on the memo and preloaded files, give 2-3 concrete starting points. For example:
- "Continue Dashboard Step 6 (customer pipeline Kanban) — Step 5 V2 was already completed"
- "Answer open question #2: routing skill selection"
- "Other"

Wait for the user to choose.

## Interaction Template

```
📂 Loading session: docs/sessions/2026-04-24-2345-ecc-policy-flywheel-v2.md
⏸ Last status: paused
📎 Loaded 3 context files

──────────────────────────────────────────
Last session (2026-04-24 23:45)
- Completed Operating Framework study notes v2.0 (absorbed/pending/skipped/diff mechanism)
- Added Operating Framework reference library policy + 4.7 refactoring 5 questions to CLAUDE.md
- Completed flywheel widget refactoring (Step 5 V2)

Open questions
1. Among Tier 1's 7 items, should hooks or MCP be done first?
2. Which Operating Framework content source for the knowledge card battle (Step 7)?

Where to continue (suggested):
a. Start Tier 1 · session persistence + /learn (lightest starting point)
b. Answer open question #1 (decide hooks vs MCP priority)
c. Continue Dashboard Step 6 (customer pipeline Kanban)
```

## Anti-patterns

- ❌ Reading the memo but not loading files listed under "Next startup needs" → missing context
- ❌ Starting work directly without asking the user where to continue → may diverge from their intent
- ❌ Dumping the entire memo to the user → poor experience when they just opened a long document