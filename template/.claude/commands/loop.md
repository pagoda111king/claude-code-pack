---
description: Execute autonomous loop scenarios · Scan public platforms for intelligence · Produce CSV + Markdown for manual selection · Supports list / status / specific scenario invocation
version: "0.1"
lastUpdated: "2026-04-24"
---

# /loop

Executes autonomous tasks defined under `scripts/loops/scenarios/`. Primarily used for semi-automated work like lead generation, monitoring, and daily reports.

## Usage

- `/loop` · Equivalent to `/loop list` · Lists all available scenarios
- `/loop list` · Lists scenarios
- `/loop status` · Shows output summary for the last 7 days
- `/loop <scenario-name>` · Runs a scenario (e.g., `/loop keyword-monitor`)
- `/loop <name> --dry-run` · Preview without writing output (saves cost)

## Execution Flow

### Case 1 · `/loop` or `/loop list`

Lists `scripts/loops/scenarios/*.md`:

```
Available loops:

📡 keyword-monitor
   Daily scan of public platforms for niche industry user pain point discussions
   Frequency: daily · Estimated cost < $2 · Runtime < 10 min
   Last run: 2026-04-25 · Produced 17 candidates (4 strong)

(Future) 📊 daily-digest
(Future) 📈 pipeline-health
(Future) 💰 cost-watchdog

Run one: /loop <name>
```

### Case 2 · `/loop status`

Scans `docs/loops/output/` for the last 7 days:

```
📊 Loops status for last 7 days

| Date | Loop | Strong | Medium | Weak | Status |
|---|---|---|---|---|---|
| 04-25 | keyword-monitor | 4 | 8 | 5 | ✅ Followed up 3 this week |
| 04-24 | keyword-monitor | 0 | 0 | 0 | ⚠️ Keywords need adjustment |
| 04-23 | keyword-monitor | 3 | 6 | 4 | ✅ Followed up 1 |

Weekly summary:
- Total strong: 7 · Followed up: 4
- Conversion rate: 57% (good)
- 0-day occurred 1 time · Monitor
```

### Case 3 · `/loop <scenario-name>`

Execution flow:

#### 3.1 Pre-check
- Read `scripts/loops/scenarios/<name>.md` · Error if not found
- Check frontmatter `max_runtime_minutes` / `max_cost_usd` as hard stop conditions
- Confirm not already run today (check if `docs/loops/output/<today>-<name>.*` exists)
- If already run, ask "Overwrite?" · Default no

#### 3.2 Execute per scenario definition
Use the full scenario file content as prompt · Execute Steps 1-7 as defined.

**4.7 Most Important Tip**:
- Parallel WebSearch multiple keywords in a single session (1M context fits)
- No multi-turn conversation · Produce results in one pass

#### 3.3 Dual-format output

**CSV** (machine-readable):
Path: `docs/loops/output/YYYY-MM-DD-<scenario>.csv`
Format matches scenario definition.

**Markdown** (human-readable):
Path: `docs/loops/output/YYYY-MM-DD-<scenario>.md`
Generated per scenario output template · Grouped by signal strength.

#### 3.4 Summary report to user

```
✅ /loop keyword-monitor complete

⏱  Duration: 7 min 23s
💰 Estimated cost: $1.84

📊 Results:
  - 🔴 Strong: 4 (must follow up this week)
  - 🟡 Medium: 8 (observable)
  - 🔘 Weak: 5 (archive)
  - ❌ Filtered: 3 (already contacted / ads)

📁 Output:
  - docs/loops/output/2026-04-25-keyword-monitor.csv
  - docs/loops/output/2026-04-25-keyword-monitor.md

🎯 Highest priority (suggest action today):
  1. Zhang @ Xiaohongshu · "Processing 200 customer complaints daily is overwhelming" · 43 likes · 2 people in comments agree
  2. Li @ Zhihu · "Shopee banned, looking for tool recommendations" · 12 answers · specific budget hints
  3. ...

⏭ Suggested next steps:
  - Run /comment-engage to generate 2-3 draft replies
  - Add highest priority to "Leads" stage in docs/pipeline.md

Next run: Tomorrow 08:00 (or SessionStart will remind)
```

#### 3.5 Failure handling

- **WebSearch fails**: Output "Data fetch failed today · Network or API issue" · Don't write output file (avoid 0-record pollution)
- **Timeout**: Hard stop at max_runtime_minutes · Keep data collected so far
- **Cost overrun**: Hard stop at max_cost_usd · Alert

### Case 4 · `/loop <name> --dry-run`

- No output written
- Only preview "What would happen if this ran"
- Used for tuning scenario definitions · Testing keywords

## Anti-patterns

- ❌ Running the same scenario ≥3 times per day (wastes tokens · data won't change that fast)
- ❌ Using /loop for tasks that should be manual (e.g., proposal writing)
- ❌ Running without reviewing output (sliced data unused = waste)
- ❌ Modifying scenario without bumping version (loop-first principle 7)

## FAQ

**Q: What's the difference between /loop and /eval?**
A:
- `/eval <skill>` · Validates skill quality (conformance + rubric)
- `/loop <scenario>` · Executes an autonomous task and produces actual output

**Q: Can I add new scenarios?**
A: Yes · Add a new `.md` in `scripts/loops/scenarios/` following the keyword-monitor structure. Must include:
- Frontmatter (name / version / frequency / max_runtime / max_cost)
- Task objective / input / Steps 1-7 / output format / anti-patterns / boundaries

**Q: Can I automate with cron?**
A: Possible but not recommended (Solo Founder). Suggested approach:
1. Early stage: Manual `/loop <name>` · Once daily
2. After 2 weeks stable: Consider `crontab -e` automation
3. Pair with SessionStart hook to show "Run today?"

## Future Extensions (Tier 2)

- `daily-digest` scenario · Summarize yesterday's all loops / sessions / new edits
- `pipeline-health` scenario · Scan docs/pipeline.md for stalled customers
- `cost-watchdog` scenario · Budget overrun alerts
- `/loop chain <name1,name2>` · Chain invocation (A's output as B's input)
- Dashboard `/loops` widget · Real-time health display for all loops

## References

- Essence: `docs/ecc-absorption/essence/12-autonomous-loops.md`
- Scenarios: `scripts/loops/scenarios/`
- Output: `docs/loops/output/`
- Principle 7: Tool-Oriented Atomic Design