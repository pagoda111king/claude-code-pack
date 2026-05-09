---
description: Plan new features / new products / new refactoring · Integrates @planner + idea-eval front gate + ship-checklist back check · Produces complete executable plan
version: "0.1"
lastUpdated: "2026-04-25"
---

# /plan

A **composite tool** that takes you from "I want to build X" to "executable phased plan" · Not just calling @planner · but integrating front-end evaluation + planning + release checklist into a complete pipeline.

## Usage

- `/plan <feature/product name or requirement description>` · runs the full pipeline
- `/plan --skip-eval <description>` · skips idea-eval (already scored)
- `/plan --light <description>` · lightweight version · only calls @planner without front/back checks

## Full Pipeline (default mode)

```
User input: "I want to build X"
      ↓
Step 1 · idea-eval skill · 6-dimension scoring
      ↓
  ≥22 Gold → proceed to Step 2
  15-21 Doable → warn · ask if user wants to continue
  <15 Skip → reject planning · suggest lighter validation (landing page / 5-user interviews)
      ↓
Step 2 · @planner subagent · phased breakdown
      ↓
Step 3 · ship-checklist skill · pre-flight release risk check (identify blockers early)
      ↓
Output complete plan.md to products/<slug>/PLAN.md
```

## Execution Flow

### Step 1 · idea-eval front gate

Call idea-eval skill (if `<description>` does not contain `--skip-eval`):
- Score across 6 dimensions defined by the skill (problem urgency / willingness to pay / deliverability / uniqueness / reusability / channel fit)
- Output scoring report + verdict

**Verdict branches**:
- 🟢 Gold (≥22) → proceed to Step 2
- 🟡 Doable (15-21) → output evaluation + ask user "still want to plan?"
  - User says "yes" → proceed to Step 2
  - User says "no" → stop · suggest lighter validation
- 🔴 Skip (<15) → no planning · output evaluation report + 3 alternative suggestions

### Step 2 · @planner planning

Task a @planner subagent (Opus · cross-domain synthesis):

Prompt construction:
```
Based on this idea-eval result (or user-provided requirement description), produce an executable phased implementation plan.

[paste idea-eval output · or raw user input]

Requirements:
- 3 upfront questions (worth doing / MVP boundary / can ship a version in 2 weeks)
- 3 Phases
- Each Phase: estimated time + affected files + risks
- Explicit "won't do" list
- Concrete next action items
```

### Step 3 · ship-checklist back-end risk scan

Read @planner output · run ship-checklist skill's **pre-flight mode**:
- Identify ship risk items involved in the plan (e.g. "needs payment integration" → items 16-19 payment-related)
- Mark items that "must re-run ship-checklist in Phase 3"
- Output pre-flight reminders

### Step 4 · Synthesis + write to disk

Synthesize outputs from all 3 steps into one file:

`products/<slug>/PLAN.md`

Structure:
```markdown
# Implementation Plan: <feature/product name>

## Front-end Evaluation (idea-eval)
[6-dimension score + verdict]

## Phased Implementation (@planner)
[complete plan]

## Release Pre-flight Reminders (ship-checklist)
- Risk items involved: ...
- Must verify in Phase 3: ...

## Metadata
- Evaluation date: YYYY-MM-DD
- Decision status: approved / pending / rejected
```

### Step 5 · Summary to user

```
✅ /plan <name> complete

📊 Evaluation results:
  - idea-eval: 28/30 🟢 Gold
  - Estimated effort: Phase 1 16h · Phase 2 20h · Phase 3 8h = 44h
  - Estimated cost: Claude ≈ $50-80 · SaaS (Supabase/Vercel) ≈ $0 first month

📁 Output: products/<slug>/PLAN.md

🎯 Next steps:
  1. Review PLAN.md · confirm phases are OK
  2. Once confirmed · ask @architect for architecture (complex projects) or have Claude Code run Phase 1 directly
  3. After Phase 1 completes · run /eval to verify + /code-review to audit + run ship-checklist

Questions? Ask @planner directly or edit PLAN.md.
```

## Usage Examples

### Example 1 · New product idea (full pipeline)

```
/plan I want to build a niche industry customer complaint auto-reply SaaS
```

Execution:
1. idea-eval scores · assume 27/30 🟢 Gold
2. @planner breaks into Phases (Phase 1 Shopee webhook · Phase 2 Amazon + AI reply · Phase 3 monitoring)
3. ship-checklist warns "Phase 2 involves payment integration · needs PCI compliance pre-study"
4. Write to products/cross-border-reply/PLAN.md

### Example 2 · Already evaluated · planning only (skip eval)

```
/plan --skip-eval refactor solo-dashboard data layer
```

Directly Step 2 (@planner) + Step 3 (ship-checklist).

### Example 3 · Lightweight · @planner only

```
/plan --light add an auto-migration logic for "watching" stage to pipeline.md
```

Directly @planner · no eval · no ship-checklist.

## Anti-patterns

- ❌ Bypassing idea-eval to plan directly (unvalidated ideas waste runway)
- ❌ Using /plan for every small bug / minor change (sledgehammer to crack a nut · use @planner --light or direct Claude Code)
- ❌ Not writing to disk · planning only in session (lost on next session)

## Collaboration with Other Commands

- `/plan` + `/eval` · completes the full dev loop (plan → implement → verify)
- `/plan` can be preceded by `/cost` to check budget
- `/plan` can be followed by `/orchestrate` to coordinate multi-agent execution

## When Not to Use Me

- "How do I change this code" · ask Claude Code directly · no need for heavy process
- "Should I take this client" · handled by @lead-intake
- "Write a README" · handled by @doc-writer

## References

- @planner subagent: `.claude/agents/planner.md`
- idea-eval skill: `.claude/skills/idea-eval/SKILL.md`
- ship-checklist skill: `.claude/skills/ship-checklist/SKILL.md`
- Principle 1 (Agent-First) · Principle 2 (Eval-First)