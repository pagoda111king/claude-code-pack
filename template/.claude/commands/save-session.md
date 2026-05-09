---
description: Compress a session into a memo for **true handoff** (project delivery, machine swap, long break, handover to others). **Do not** use frequently for "peace of mind" — 4.7 + auto-memory already covers you. Decision rule: would you still look up this memo in 3 months? Yes → write it; No → skip.
---

# /save-session

**4.7 era positioning**: only write a memo during **true handoff** · not after every work node.

**When to use**:
- ✅ Project delivered · leave a marker for yourself 3 months from now
- ✅ Switching machines / cities / gap ≥ 1 day
- ✅ Major decision point · want an explicit checkpoint
- ✅ Handing off to a co-founder or contractor

**When not to use**:
- ❌ Habitual save every 2 hours (auto-memory handles this)
- ❌ "Almost done" but you can keep going (keep working)
- ❌ "Context might be full" (nearly impossible with 4.7 1M)
- ❌ Anxiety about losing work (auto-memory + source-of-truth docs cover you)

**Decision mantra**: **"Would I still look up this memo in 3 months?"** · Yes → write it · No → skip

---

Produce a concise session memo, saved to `docs/sessions/YYYY-MM-DD-HHmm-<slug>.md`, and update `docs/sessions/INDEX.md`.

## Execution flow

### 1. Review this session, distill 5 dimensions

- **Topic**: one sentence describing what was done
- **Completed**: concrete outputs (new files / changed files / decisions), bullet points, ≤1 line each
- **Decisions**: strategic / architectural / design choices + rationale (no implementation details)
- **Open issues**: undecided, to discuss, next steps
- **Next startup needs**: which files / docs / context to load first

**Principles**:
- Don't copy conversation verbatim, distill
- Don't record every tool call, record what affects future decisions
- Write "none" instead of inventing when incomplete

### 2. Generate slug

Extract 2-4 keywords from the topic, join with hyphens, all lowercase English or pinyin:
- ✅ `ecc-policy-flywheel-v2`
- ✅ `dashboard-step5-foundation`
- ❌ `completed-some-things` (too vague)
- ❌ `random-work` (too vague)

### 3. Write memo file

Path: `docs/sessions/YYYY-MM-DD-HHmm-<slug>.md`

(HHmm is 24-hour 4-digit, e.g. `2345`)

Template:

```markdown
---
date: YYYY-MM-DD
time: "HH:mm"
session_id: YYYY-MM-DD-HHmm-<slug>
topic: <one-sentence topic>
status: completed | paused | blocked
tags: [feature, refactor, strategy, ...]
---

# <one-line title>

## Topic
2-4 sentences.

## Completed
- ...
- ...

## Decisions
- **<decision name>**: <choice> · rationale: <why>
- ...

## Open issues
- ... (write "none" if none)

## Next startup needs
- Read `<file path>`
- Continue from `<open issue N>`
- Or: `/resume-session` will auto-load this document
```

### 4. Update `docs/sessions/INDEX.md`

Insert a line at the top of INDEX:

```markdown
- [YYYY-MM-DD HH:mm · <topic>](YYYY-MM-DD-HHmm-<slug>.md) — <status> · tags
```

Newest always on top.

### 5. Report back to user

Output:
- Storage path (absolute path for easy opening)
- Memo content preview (first 20 lines)
- Next `/resume-session` will auto-find this memo

## Anti-patterns (don't do)

- ❌ Log every tool call (noise)
- ❌ Write filler like "this session was productive"
- ❌ Invent content to fill all 5 dimensions
- ❌ Save to `~/.claude/session-data/` (should be inside project at `docs/sessions/`, git-trackable)