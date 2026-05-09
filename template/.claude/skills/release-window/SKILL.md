---
name: release-window
description: Release window planning · Solo Founder edition production-scheduling. Combines local holidays, niche industry peak/off seasons, and personal energy cycles to recommend optimal launch and major version release timing for each product. Use when a founder asks "when to ship", "which week to schedule", or "is now a good time to release".
version: "1.0"
lastUpdated: "2026-04-25"

inspiredBy:
  - source: "Operating Framework production-scheduling"
    note: "Enterprise release calendar / freeze window → Solo Founder edition"
  - source: "Amazon / TEMU / Shein seller peak season cadence"
    note: "Q4 Black Friday / January Chinese New Year account freeze period"

designPrinciples:
  - "Launch timing = customer energy ∩ founder energy ∩ platform stability window"
  - "Freeze matters more than launch · no core code changes 2 weeks before peak season"
  - "Holidays are not opportunity windows · they are low-response windows (no one responds to incidents)"

usedBy:
  - planner
  - ship-checklist

dependencies:
  - path: "docs/release-calendar.md"
    why: "Single global calendar shared across all products"
  - path: "customers/"
    why: "Customer peak/off seasons = who is using · when they use"

---

# Release Window Planner

## When to Trigger

Founder says:
- "When should I ship product X"
- "Is now a good time to release"
- "Can I ship next week"

Or dashboard pipeline Stage 7 triggers.

## Output

`docs/release-calendar.md` (global · shared across all products), structure:

```yaml
---
type: release-calendar
year: 2026
updatedAt: 2026-04-25
freezeWindows:
  - name: "Q4 Black Friday pre-freeze"
    start: 2026-10-15
    end: 2026-12-01
    reason: "Niche industry customers under peak pressure · no code changes"
  - name: "Chinese New Year account freeze freeze"
    start: 2027-01-15
    end: 2027-02-15
    reason: "Amazon / TEMU mass account suspensions · customers in emergency mode · no code changes"
recommendedWindows:
  - name: "Q1 build-up"
    start: 2026-02-15
    end: 2026-03-31
    why: "Customer off-season · founder energy high · platform stable"
  - name: "Early Q2"
    start: 2026-04-01
    end: 2026-05-15
    why: "Customers preparing Q2 inventory · real demand for tools"
holidays:
  - { date: 2026-05-01, name: "Labor Day", days: 5, response: "low" }
  - { date: 2026-10-01, name: "National Day", days: 7, response: "none" }
  - { date: 2026-12-25, name: "Christmas", days: 1, response: "overseas low" }
  - { date: 2027-02-09, name: "Chinese New Year", days: 7, response: "none" }
personalEnergyCycle:
  - { period: "Mon-Wed", level: "high", note: "deep work" }
  - { period: "Thu-Fri", level: "medium", note: "review / customer" }
  - { period: "Sat-Sun", level: "low", note: "no releases" }
---

# Release Calendar 2026

## Current Recommended Window

[Based on today's date · show shippable version numbers for next 30 days + red marks for blocked days]

## Per-Product Launch Recommendations

### <product slug>
- Current stage: <plan / build / soft-launch / ...>
- Recommended window: <specific dates · reason>
- Not recommended window: <specific dates · reason>
- Actions during freeze: critical bug fixes only · support existing pilots · no new releases

## Holiday Response Matrix

| Holiday | Founder Response | Cross-Border Customer Response | Action |
|---|---|---|---|
| Chinese New Year | low | none (account freeze period) | Freeze 14 days before |
| National Day | medium | peak (procurement wave) | Ship before · fix only during |
| Pre-Black Friday (10/15-12/1) | low (customers stressed · can't interrupt) | peak (no appetite for new tools) | Strict freeze |
```

## Core Decision Logic

Before shipping any version, ask 5 questions:
1. Is customer currently in peak or off-season? Peak → defer to next off-season
2. How many days until the nearest freeze window? < 14 days → defer
3. Founder energy level this week? Low → defer (can't respond to bugs)
4. Are pilot customers actively using? Yes → ship Tuesday/Wednesday (lowest risk window)
5. Is it a domestic holiday? Yes → ship 1-2 days after (avoid mid-holiday incidents)

**Ship only if all 5 are green** · any red = defer.

## Solo Founder Specific Constraints

- **No releases on Friday or weekends** · no one to back you up if something breaks
- **No releases during domestic holidays** (even if customers are overseas · you're offline too)
- **No new features during customer peak season** (even good features · customers are too busy to learn)
- **Tuesday/Wednesday 14:00 is the golden window** (high energy + 4 days of observability)

## Collaboration with Other Skills

- @planner: after generating plan.md, call this skill to annotate which Phase falls in which window
- ship-checklist: call this skill before running to verify current window compliance
- If an emergency release is needed during a freeze window, founder must explicitly approve and log in decisions/

## Prohibited

- ❌ Shipping new features during a freeze window (emergency bug fixes excepted)
- ❌ Treating "I have free time" as a valid window (must consider customer and platform)
- ❌ Missing holidays in customer's country (US Thanksgiving / Christmas / Black Friday)