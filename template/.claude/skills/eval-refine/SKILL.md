---
name: eval-refine
description: Eval rubric refinement engine · Solo Founder edition harness-optimizer. Scans all historical eval results (idea-eval / skill eval / agent eval), identifies dimensions where rubrics are too loose or too strict, and drafts adjustment PR drafts to candidates/. Use when founder says "the evaluation feels off" or "5/6 all 100% PASS — is something wrong?"
version: "1.0"
lastUpdated: "2026-04-25"

inspiredBy:
  - source: "Operating Framework harness-optimizer"
    note: "Enterprise-scale eval optimization → Solo Founder weekly review"
  - source: "lead-intake v1.0 → v1.1 improvement experience"
    note: "Q10 signal strength comparison table was exposed by case 4 actually FAILing"
  - source: "skill eval 5/6 first run 100% PASS lesson"
    note: "rubric too loose ≠ skill perfect"

designPrinciples:
  - "100% PASS = rubric too loose signal · not cause for celebration"
  - "rubric changes must retest past cases · prevent overfitting"
  - "improvements must be atomic (1 trigger + 1 action + 1 domain + confidence)"

usedBy:
  - learn-review

dependencies:
  - path: "docs/ideas/*/eval.md"
    why: "idea-eval historical scores"
  - path: "tests/{skills,agents}/results/"
    why: "skill / agent eval historical results"
  - path: "docs/learnings/candidates/"
    why: "improvement PR landing zone"
---

# Eval Rubric Refiner · Evaluation Standard Tuning

## When to Trigger

Founder says:
- "5/6 skills all 100% PASS · is something wrong?"
- "I feel this idea scored 22 but it's not worth that much"
- "Post-launch customer feedback doesn't match the eval"
- Every Sunday during /learn-review run

Or dashboard pipeline Stage 8 triggers.

## Input

- `docs/ideas/*/eval.md` (idea-eval historical 6-dimension scores)
- `tests/{skills,agents}/results/*.md` (skill / agent eval historical pass rate)
- Actual feedback data (pilot-tracking.md / customer replies / sales conversion)

## Output

`docs/learnings/candidates/<YYYY-MM-DD>-rubric-refine.md`, structured as follows:

```yaml
---
type: rubric-refine
generatedAt: 2026-04-25
generatedBy: eval-refine@1.0
scope:
  - idea-eval
  - skill:lead-intake
  - skill:idea-eval
analyzedRecords: 14
candidatePatches: 3
status: candidate            # candidate / approved / rejected
---

# Rubric Adjustment Candidates · 2026-04-25

## Candidate 1 · idea-eval "Ability to Pay" dimension too loose

**Evidence**:
- 14 ideas · 12 scored ≥4 on this dimension · but only 3 actually generated revenue within 1 year
- Inference: scores didn't distinguish "can pay" from "will pay"

**Suggested Change**:
- Modify prompt to add: "Evaluate not just **ability to pay**, but **probability of paying this year** · ≥4 requires evidence of 'already spending on similar products'"
- Add to rubric should_have: "Interview Q3 must confirm 'what tools are you currently using' with specific numbers"

**Impact**: Re-evaluate all 14 ideas · estimated 4 will drop from 4 to 3 · total score change ≤ 4 points

**Atomic Check**:
- trigger: idea-eval runs "ability to pay" dimension
- action: add should_have check · add prompt wording
- domain: skills/idea-eval
- confidence: 0.7 (based on real 14 data points)

---

## Candidate 2 · skill eval all 100% PASS

**Evidence**:
- 5/6 skills first run 100% · only lead-intake at 75%
- Real problem exposed by lead-intake (Q10 signal strength) drove v1.1 upgrade
- Inference: the other 5 skills' rubric should_have is too broad

**Suggested Change**:
For each 100% skill, add 1-2 picky should_have checks in yaml. Example:
- proposal-gen add: "Quotation section must show 3 tiers (basic/standard/flagship)"
- content-blitz add: "30 pieces of content must maintain brand voice consistency · sample 5 must 100% pass brand-voice check"

**Impact**: Retest 5 skills · estimated 2-3 will land in 75-90% range (healthy signal)

**Atomic Check**:
- trigger: any skill eval pass rate = 100% for ≥2 consecutive runs
- action: add picky should_have (not new features · stricter checks)
- domain: tests/skills/*.yaml
- confidence: 0.85 (based on real 5/6 lesson)

---

## Candidate 3 · ...
```

## Core Rules

1. **Every candidate must have an "Evidence" section** · no real data, don't propose
2. **Every change must have an "Impact" estimate** · re-evaluation cost / score change range
3. **Every candidate must pass the atomic 4-field check** · not atomic, don't accept
4. **confidence < 0.5 → reject immediately** (insufficient data)
5. **Same dimension changed 2 weeks in a row = red flag** · likely overfitting · pause for 1 week

## Decision Flow

```
Scan historical eval → find anomaly patterns → draft candidate
   ↓
Candidate goes into docs/learnings/candidates/
   ↓
/learn-review weekly review · founder decides promote / skip / reject
   ↓
promote → update corresponding SKILL.md / agent.md / yaml
   ↓
Retest affected cases · verify change is effective
```

## Solo Founder Specific Constraints

- **Promote at most 1-2 per week** · more leads to overfitting
- **Every change must be retested** · no retest = changed to "look pickier"
- **Keep pre-change rubric in git history** · allows rollback

## Collaboration with Other Skills

- /eval runs automatically trigger this skill (hook trigger)
- /learn-review calls this skill first on Sunday to collect candidates
- After promote, update corresponding skill / agent using skill-create tool

## Prohibited

- ❌ "I think" changes without evidence (must have real case support)
- ❌ Changing rubric without retesting (self-deception)
- ❌ Changing ≥3 rubrics at once (too many variables · can't attribute)