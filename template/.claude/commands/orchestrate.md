---
description: Multi-agent collaboration orchestration. Schedules multiple subagents for parallel, sequential, or conditional execution on complex tasks. Facade for 4.7 native parallel capability. Not needed for simple tasks. Use when architecture, review, testing, security, and documentation dimensions are involved.
version: "0.1"
lastUpdated: "2026-04-25"
---

# /orchestrate

**Multi-agent collaboration orchestrator**. Schedules multiple subagents for cross-dimensional work within a single session. Leverages 4.7 parallel Task capability to produce multiple independent expert perspectives at once.

## Usage

- `/orchestrate <task description>` — automatically selects appropriate agents and runs them in parallel
- `/orchestrate --agents <list> <task>` — specify agent list
- `/orchestrate --sequential <task>` — run sequentially (when results have dependencies)
- `/orchestrate --review <path>` — run a full-dimensional review on code or product

## When to Use

**Good fit**:
- ✅ Full-dimensional review before shipping a new feature (frontend + backend + security + testing + docs simultaneously)
- ✅ Architecture decisions needing multiple perspectives (architect + security + test engineer each give input)
- ✅ Quality scan before client delivery (multiple agents cross-scan independently)

**Not a fit**:
- ❌ Modifying a function or fixing a bug (Claude Code main conversation is enough)
- ❌ Writing a single line of docs (call @doc-writer directly)
- ❌ Pure planning tasks (/plan is sufficient — /orchestrate is for multi-dimensional parallel work)

## Preset Orchestration Modes

### Mode 1 · Full Review (pre-release full scan)

```
/orchestrate --review <product-path>

→ Spawns 5 subagents in parallel:
   1. @code-reviewer    · general code quality
   2. @frontend-expert   · UX / a11y / responsive
   3. @backend-expert    · API / DB / integration
   4. @security-reviewer · OWASP / secrets / compliance
   5. @test-engineer     · test coverage / contracts
→ Merges 5 reports into products/<slug>/REVIEWS/YYYY-MM-DD/
→ Produces unified view: CRITICAL/HIGH items · cross-agent consensus · conflicting opinions
```

### Mode 2 · Architecture Decision

```
/orchestrate <architecture decision question>

→ Spawns 3 subagents in parallel:
   1. @architect       · primary view · 2-3 candidates + tradeoffs
   2. @security-reviewer · evaluate candidates from security dimension
   3. @backend-expert    · evaluate candidates from implementation complexity
→ Merged view: final recommendation · objections / support from different dimensions
```

### Mode 3 · Feature Delivery

```
/orchestrate --delivery <feature-name>

→ Spawns subagents sequentially (due to dependencies):
   Step 1: @planner       → plan.md
   Step 2: @architect     → architecture.md
   Step 3: Claude Code    → implementation
   Step 4: @test-engineer → tests.md
   Step 5: @code-reviewer + @security-reviewer (parallel) → review reports
   Step 6: @doc-writer    → README / API docs
→ Output: products/<slug>/ complete delivery package
```

### Mode 4 · Custom

```
/orchestrate --agents planner,frontend-expert,test-engineer <specific problem>
```

## Execution Flow

### Step 1 · Parse Task

- Read command arguments
- If `--agents` not specified, auto-detect based on task keywords (code review → reviewers · architecture → architect + security)
- Default strategy: **parallel when possible**, sequential only when dependency chain exists

### Step 2 · Dispatch Task Calls

Each agent gets an independent Task call, dispatched in parallel:

```
Task → @frontend-expert  "Review frontend of products/xxx/"
Task → @backend-expert   "Review backend of products/xxx/"
Task → @security-reviewer "Security scan products/xxx/"
...
```

**Key**: Each Task has independent context — no shared context to avoid cross-contamination.

### Step 3 · Collect + Synthesize

Wait for all Tasks to return, then synthesize a unified report:

```markdown
# Orchestrate Report · <task> · YYYY-MM-DD

## Agents Involved
- @frontend-expert  · 7min · ✅
- @backend-expert   · 8min · ✅
- @security-reviewer · 5min · ✅
- @test-engineer    · 6min · ⚠️ coverage report incomplete
- @code-reviewer    · 9min · ✅

## Cross-Agent Consensus (mentioned by at least 2 agents)
- 🔴 N+1 query · `src/api/orders.ts:45` · flagged by @backend-expert + @test-engineer
- 🔴 Hardcoded secret · `.env.example:8` · flagged by @security-reviewer + @code-reviewer
- 🟠 Missing a11y · `components/modal.tsx` · flagged by @frontend-expert + @test-engineer

## Single-Agent Opinions (reference)
### @frontend-expert exclusive
- LCP > 3s · initial load too heavy
### @backend-expert exclusive
- Missing DB index · users.email

## Conflicting Opinions (needs decision)
- @architect recommends Postgres · @backend-expert recommends SQLite (MVP stage)
  → Decision: SQLite for MVP · migrate to Postgres at 1000 DAU

## Priority Synthesis
- 🔴 Blocker: 2 (N+1 · secret)
- 🟠 High: 5
- 🟡 Medium: 8
- 🟢 Low: 12

## Next Steps
- Fix 🔴 items then rerun /orchestrate --review
- Assign 🟠 items to next week tickets
```

### Step 4 · Persist

Output to: `products/<slug>/REVIEWS/YYYY-MM-DD/orchestrate-<mode>.md` + individual agent reports.

### Step 5 · Summary to User

Short summary (no full report dump):
```
✅ /orchestrate --review complete

👥 Participants: 5 agents in parallel · total wall time 9 min (would be 35 min sequential)
📊 Findings: 🔴 2 Blocker · 🟠 5 High · 🟡 8 Medium · 🟢 12 Low
💰 Cost: ~$4 (5 subagent sessions)

📁 Full report: products/xxx/REVIEWS/2026-04-25/

🎯 Top priority (must fix):
  1. N+1 query · `src/api/orders.ts:45`
  2. Hardcoded secret · `.env.example:8`

Want me to have Claude Code fix these 2 blockers?
```

## Cost vs Time Tradeoffs

| Mode | Agent Count | Parallel Time | Sequential Time | Estimated Cost |
|---|---|---|---|---|
| Full Review | 5 | ~10 min | ~35 min | $4-6 |
| Architecture | 3 | ~7 min | ~20 min | $3-5 |
| Feature Delivery | 6 | N/A (has dependencies) | ~60-90 min | $8-12 |
| Custom (2 agent) | 2 | ~6 min | ~12 min | $2-3 |

**4.7 advantage**: Parallel saves 60-70% time — 1M context allows running multiple subagents simultaneously.

## Anti-patterns

- ❌ Using /orchestrate for simple tasks ("review one line of code" doesn't need 5 agents — use Claude Code directly)
- ❌ Giving each agent the same prompt (should differentiate questions based on agent specialization)
- ❌ Not synthesizing reports — just dumping 5 raw outputs (user needs a consolidated view)
- ❌ Ignoring conflicting opinions (disagreement between agents is itself a valuable signal)

## Collaboration with Other Commands

- `/plan` produces a plan → `/orchestrate --delivery` executes it
- `/orchestrate --review` finds issues → `/eval` validates skill quality → Claude Code fixes
- `/orchestrate` can call `/cost` to monitor orchestration cost

## When Not to Use Me

- Small changes / single-dimension problems — call the relevant agent directly
- Fully linear workflows that can't be parallelized — use Claude Code main conversation
- "What should I do today" — use @planner or /today-focus (future)