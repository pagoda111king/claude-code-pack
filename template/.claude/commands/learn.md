---
description: Extract 1-3 reusable meta-lessons from the current session (rules / anti-patterns / methodology / skill seeds) and write them to docs/learnings/ or directly update CLAUDE.md / system-memory.md. Core validator tool.
---

# /learn

This is not about recording **what was done** (that's `/save-session`'s job), but distilling **what should / shouldn't be done** — turning patterns, preferences, anti-patterns, and repeatable workflows exposed in this session into future guidance.

## Difference from save-session

| /save-session | /learn |
|---|---|
| Records work log | Records meta-lesson |
| Specific tasks / files / outputs | Rules / patterns / methodology |
| Continue next time | Avoid repeating / reuse |
| Scenario: ending a session | Scenario: encountering surprises or repeated corrections |

## Execution Flow

### 1. Scan the current session for candidate lessons

Review the conversation and flag these signals:
- User **corrected you** ("don't do that", "you missed X", "it should be the opposite") → anti-pattern candidate
- User **confirmed a non-obvious choice** ("yes, that judgment is right", "go with what you said") → rule candidate
- You found a **reusable workflow** (done 2-3 times, same flow each time) → skill candidate
- A **design tradeoff** was explicitly discussed and decided → decision principle candidate
- An **assumption was invalidated** (e.g., Operating Framework 4.6 era assumption no longer holds) → cognition update candidate

### 2. Filter down to 1-3 truly worth preserving

**Filter criteria**:
- ✅ Will be encountered in other tasks → worth recording
- ✅ You'll still need it 3 months from now → worth recording
- ❌ Only applies to this specific task → don't record (that's save-session's job)
- ❌ Generic like "write good code" → don't record (platitude)

Each lesson must be specific enough to **immediately guide action**.

### 3. Decide where to persist (by type)

**Default: all learnings go into `docs/learnings/candidates/` queue first** (tentative layer). Promoted to main layer after weekly `/learn-review` audit.

| Lesson Type | Persistence Location | Why |
|---|---|---|
| Cross-task collaboration preference ("user likes X communication style") | Your auto-memory (`~/.claude/projects/.../memory/`) | Auto-loaded across sessions · bypasses candidates |
| Hard rule ("must run X before release") · **high confidence and user confirmed in person** | `CLAUDE.md` collaboration conventions | Force-loaded every session · bypasses candidates |
| Strategy / pricing / weighting · **high confidence and user confirmed in person** | `docs/system-memory.md` | Auto-read by all skills · bypasses candidates |
| **Default · anti-pattern / methodology / skill-seed / cognition-update** | `docs/learnings/candidates/YYYY-MM-DD-<topic>.md` | Awaiting /learn-review audit · confidence not confirmed |
| Clearly high confidence and doesn't conflict with existing learnings | Suggest user promote directly after running /learn-review · don't skip candidates | Maintain process consistency |

**Rules**:
- Only auto-memory and "user-confirmed rules" can bypass candidates
- Everything else goes into candidates/ first, waiting for /learn-review
- This prevents "hot-headed learnings from permanently polluting the main layer"

### 4. Write / Update

**If persisting to learnings/candidates/** (default path): Create `docs/learnings/candidates/YYYY-MM-DD-<topic-slug>.md`:

```markdown
---
date: YYYY-MM-DD
topic: <topic>
type: anti-pattern | rule | methodology | skill-seed | cognition-update
status: candidate  # candidate → after /learn-review may become active / superseded / rejected
confidence: low | medium | high  # your confidence in this learning
---

# <Title>

## Trigger Scenario
When this situation occurs.

## Lesson
What to do / not do. One paragraph, no more than 5 lines.

## Evidence
Which moment in this session triggered this distillation (1-2 sentences).

## Action Items
- [ ] Add to CLAUDE.md?
- [ ] Turn into a skill?
- [ ] Update docs/system-memory.md?
- [ ] Local record only

## Promotion Clues
- Overlap with existing learnings: <list existing learnings or "none">
- Occurrence count: <first seen this session / seen N times before>
- Cross-session: <yes / no>
```

**If persisting to CLAUDE.md / system-memory.md / auto-memory**: Edit directly, but **first tell the user "I'm about to write X to Y, is that correct?"** — cross-session persistent changes require confirmation.

### 5. Candidates don't go into the main INDEX · leave for /learn-review

Candidate files **do not** go into `docs/learnings/INDEX.md` (that's the verified main layer index). Candidates are sorted by date within their own directory.

**Exception**: If writing directly to the `docs/learnings/*.md` main layer (user-promoted high-confidence rule), sync one line to INDEX:
```markdown
- [YYYY-MM-DD · <topic>](YYYY-MM-DD-<topic-slug>.md) — type · status
```

### 6. Report to founder

```
💡 N lessons distilled from this session:

1. [type] <Title>
   → Persisted to <location>
   → Next time effect: <specific change>

2. ...

Should I also add lesson N to CLAUDE.md? (affects cross-session behavior)
```

## Anti-patterns

- ❌ Forcing 3 lessons (1 or 0 is fine if that's all there is)
- ❌ Including save-session content (specific task outputs are not lessons)
- ❌ Modifying CLAUDE.md without asking the user (cross-session impact requires confirmation)
- ❌ Writing "be careful" or "be thorough" — non-actionable instructions (not verifiable)

## Example

**Trigger scenario**: User says "Operating Framework's `.cursor/.kiro` is just syntax compatibility, not real multi-model complementarity."

**Distillation**:
```
type: cognition-update
topic: Multi-model = router + MCP, not config translation
Lesson: When seeing a cross-tool config sync project, don't default to assuming it's "multi-model complementarity."
Ask: Is there a router that decides task→model routing? Is there an MCP connecting to real external models?
No → it only solves syntax compatibility.
```
Persisted to `docs/learnings/2026-04-24-multi-model-architecture.md`, may also be worth adding to CLAUDE.md prohibitions.