---
description: Scan docs/learnings/candidates/ · give promote / merge / skip / reject recommendation for each · batch execute after manual sign-off. Run once during Sunday weekly review.
---

# /learn-review

Candidate learning auditor. Upgrades tentative learnings from the `candidates/` queue to the main `docs/learnings/` layer (confirmed), or merges, defers, or rejects them.

## When to Use

- **Weekly Sunday review** (recommended)
- When `candidates/` exceeds 5 entries
- Triggered by SessionStart hook: "N candidates pending"

## Execution Flow

### Step 1 · Scan candidates/

Read all `*.md` files under `docs/learnings/candidates/` (exclude `README.md`).

Group by the following dimensions:
- **type** (anti-pattern / rule / methodology / skill-seed / cognition-update)
- **date** (older first · longer backlog means higher decision priority)
- **topic overlap** (topic slug or content similarity → candidate for merge)

### Step 2 · Run 5-Question Diagnosis on Each Candidate

For each candidate file:

1. **Topic Overlap**:
   - grep the `topic` field in frontmatter of main layer `docs/learnings/*.md`
   - Does it have ≥50% text overlap with the candidate's topic?
   - If yes → **candidate for merge**

2. **Conflict with Existing Rules**:
   - Read CLAUDE.md collaboration conventions / prohibitions
   - Read docs/system-memory.md for weights / pricing / brand
   - Is there a conflict?
   - If yes → **candidate for reject** (or strong flag · let founder decide conflict resolution)

3. **Repeated Occurrence (cross-session)**:
   - Scan `docs/learnings/rejected/*.md` and other candidates
   - Has the same topic appeared ≥2 times?
   - If yes → **candidate for strong promote** (sufficient evidence chain)

4. **Atomic Quality**:
   - Is the experience specific enough (1 trigger + 1 action + 1 domain)?
   - If too vague ("be cautious" / "think more") → **candidate for reject**

5. **Action-ability**:
   - Is the "Action Recommendations" section concrete (immediately actionable)?
   - If "we'll see later" / "might need" → **candidate for skip** (wait for trigger condition)

### Step 3 · Output Review Table

```markdown
# Learn Review · YYYY-MM-DD

Scanned candidates/: N entries pending review

## Recommended Actions Summary

| # | Candidate | Type | Recommended Action | Reason |
|---|---|---|---|---|
| 1 | 2026-04-25-xxx | skill-seed | **PROMOTE** | atomic quality good · action concrete · no conflicts |
| 2 | 2026-04-27-yyy | methodology | **MERGE** | 70% topic overlap with 2026-04-24-eval-rubric-calibration |
| 3 | 2026-05-02-zzz | rule | **REJECT** | conflicts with CLAUDE.md collaboration convention #3 |
| 4 | 2026-05-05-aaa | anti-pattern | **SKIP** | specific to this context · revisit in 1 week |
| 5 | 2026-05-08-bbb | cognition-update | **PROMOTE** | inverse of rejected 2026-04-28 · sufficient evidence |

## Per-Entry Analysis

### 1. 2026-04-25-xxx · PROMOTE
- **Original topic**: ...
- **Atomic quality**: ✅ Specific (...)
- **Overlap with existing**: None
- **Evidence**: ...
- **Promotion actions**:
  - Move from candidates/ to docs/learnings/
  - Add one line to docs/learnings/INDEX.md
  - If type=rule · ask user whether to upgrade to CLAUDE.md

### 2. 2026-04-27-yyy · MERGE
- **Merge target**: docs/learnings/2026-04-24-eval-rubric-calibration.md
- **Merge method**: Append this candidate's "Evidence" section to existing learning · update lastUpdated
- **Then move candidate to rejected/ (with reason: "merged into X")**

... (per entry)

## Suggested Rubric Changes (meta)

If review reveals that `/learn` repeatedly generates low-quality candidates of the same type (e.g., 3 consecutive "be cautious" platitudes), it means `/learn`'s rubric needs tightening.
```

### Step 4 · Wait for User Confirmation · Batch Execute

**Do not automatically execute moves / merges.**

First print the review table · let the founder review it · respond with "Agreed" / "Do everything except #3" / "Rerun with different recommendations" etc.

After confirmation, execute in batch per step 5.

### Step 5 · Execute Actions

For each confirmed action:

**PROMOTE**:
1. `git mv docs/learnings/candidates/<file>.md docs/learnings/<file>.md` (or Write directly)
2. Update frontmatter: `status: candidate → active`
3. Update `docs/learnings/INDEX.md` to add entry (by date + type, dual position)
4. If type=rule · ask "Upgrade to CLAUDE.md collaboration convention?"

**MERGE**:
1. Read target main layer learning
2. Append candidate's "Evidence" / supplementary examples
3. Update target frontmatter `lastUpdated` + append "Merged from <candidate-slug>" to changelog
4. Move original candidate to `rejected/` · with reason: "merged into <target>"

**SKIP**:
1. Leave as-is · stay in candidates/
2. Re-evaluate next week with /learn-review
3. If skipped ≥3 consecutive weeks · auto-downgrade to reject

**REJECT**:
1. `git mv docs/learnings/candidates/<file>.md docs/learnings/rejected/<file>.md`
2. Add `status: rejected` + `rejectDate` + `rejectReason` + `rejectBy` to frontmatter
3. Append "Reject Notes" section at end of file

### Step 6 · Summary to User

```
✅ /learn-review complete

Processed: N candidates
  → PROMOTE: X (moved to main layer)
  → MERGE: Y (merged into docs/learnings/xxx)
  → SKIP: Z (revisit next week)
  → REJECT: W (moved to rejected/)

New main layer entries: <list PROMOTE topics>

Next suggestions:
- If candidates consistently hit 5+ per week, consider tightening /learn's "should generate 1-3 entries" constraint (too many may dilute quality)
- If no PROMOTE for 3 consecutive weeks, /learn's rubric is too loose or candidates aren't challenging enough
```

---

## Anti-Patterns

- ❌ **Promote all candidates at once** (dilutes main layer signal)
- ❌ **Reject everything** (indicates /learn itself has issues · fix /learn, not candidates)
- ❌ **Auto-execute** (this involves long-term memory · must have manual confirmation)
- ❌ **Forget to update main INDEX after review** (main layer entries must be in INDEX)

---

## Comparison with Operating Framework

| Capability | Operating Framework continuous-learning-v2 | Our v4.7 |
|---|---|---|
| **Automation**: observe → capture → distill | PreToolUse hook + JSONL + background Haiku agent | `/learn` manual (with Stop hook reminder) |
| **Confidence**: 0.3-0.9 | Continuous numeric | Three tiers (candidate / active / rejected) |
| **Promotion**: project → global | "2 independent project observations" | `/learn-review` weekly manual review |
| **Rejection mechanism** | instincts superseded | rejected/ directory retains records |

Our version is **lighter** but **requires discipline** (run /learn-review weekly) · Operating Framework version is more automated but has a heavier maintenance stack. Solo Founder balance leans toward our approach.

---

## References

- candidates/ design: `docs/learnings/candidates/README.md`
- rejected/ design: `docs/learnings/rejected/README.md`
- /learn command: `.claude/commands/learn.md`
- Essence: `docs/ecc-absorption/essence/10-continuous-learning.md`