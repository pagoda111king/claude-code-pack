---
description: Check cumulative cost estimate for current session / today / this month for Claude Code. Uses scripts/cost/session-estimate.js to scan local session files. No API key required.
version: "0.1"
lastUpdated: "2026-04-24"
---

# /cost

Shows local usage cost estimates for Claude Code. Helps founders decide **"is this session worth it"**.

## Usage

- `/cost` — current session cumulative (default)
- `/cost today` — all sessions today cumulative
- `/cost month` — all sessions this month cumulative
- `/cost all` — run all three scopes for comparison
- `/cost json` — output machine-readable JSON (for Dashboard)

## Execution Flow

### Step 1 · Run Script

Run `node scripts/cost/session-estimate.js` with the corresponding scope:

```bash
# Current session
node scripts/cost/session-estimate.js

# Today cumulative
node scripts/cost/session-estimate.js --today

# This month
node scripts/cost/session-estimate.js --month
```

### Step 2 · Interpret + Advise

Output format:

```
💰 Current session: $X.XX  (≈¥Y.Y)
   tokens: in N · out M · cache K
   messages: X · sessions: Y
   by model:
     opus:   $N ($M msgs)
     sonnet: $N ($M msgs)
     haiku:  $N ($M msgs)
```

Provide **different advice** based on the amount:

- **Single session > $50** ⚠️: Consider if Opus is overused. Switch small tasks to Sonnet.
- **Single session > $200** 🚨: Is the task worth this cost? Split into smaller sessions next time.
- **Single session < $5** ✅: Healthy efficiency.
- **Monthly cumulative > $1000** 🔔: Compare against monthly revenue. Is ROI positive?

### Step 3 · Relative Unit Conversion

Beyond absolute dollar amounts, give a sense of **"is it worth it"**:

```
$481.95 = 7 hours of outsourced development (at $65/h)
$481.95 = production cost for 15-20 digital avatar scripts
$481.95 = 5% of one client project's monthly maintenance fee
```

Give founders **something to compare against** — don't just show dollar figures in isolation.

### Step 4 · Write History

Optional. Append results to `docs/cost-history.md` each time /cost is run:

```markdown
| Date Time | scope | Amount USD | Amount CNY | Messages | Primary Model |
|---|---|---|---|---|---|
| 2026-04-24 23:45 | session | $481.95 | ¥3470 | 725 | opus |
```

This enables **cost trend tracking** — identify if costs are creeping up over time.

## Anti-Patterns

- ❌ Using Haiku exclusively to save costs (complex tasks fail, hidden costs are higher)
- ❌ Panicking at large amounts (look at ROI, not absolute value)
- ❌ Skipping /cost and pretending there's no cost (self-deception)

## Comparison with Operating Framework

Operating Framework's `cost-aware-llm-pipeline` requires embedding token counters in code plus an external monitoring stack. Our 4.7 approach:

- Read-only access to Claude Code's existing session jsonl files (non-invasive)
- Run `/cost` within a session to see results (in-session)
- No API key required, no additional infrastructure

## Toolchain

| Dependency | Role |
|---|---|
| `scripts/cost/session-estimate.js` | Core estimation library. Reusable by hooks, commands, and dashboard. |
| SessionStart hook | Optional extension. Appends cost line each time a session starts. |
| Dashboard cost widget | Tier 2. Graphical trend visualization. |

## References

- Tool A implementation: `scripts/cost/session-estimate.js`
- Essence: `docs/ecc-absorption/essence/` — 11-cost-awareness.md (to be created)
- Principle 7: Tool-Oriented Atomic Design (each tool independently versioned)