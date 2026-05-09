---
name: idea-eval
description: 6-dimension scoring for product ideas. Use when founder wants to launch a new product/tool. ≥22 = golden idea, 15-21 = workable, <15 = skip. Avoid burning runway on unvalidated ideas.
version: "1.0"
lastUpdated: "2026-04-24"

inspiredBy:
  - source: "lead-scorer's 6-dim weighted model"
    note: "Port the quantitative thinking from customer screening to idea evaluation"
  - source: "Operating Framework's 'is-it-worth-doing' upfront gate"
    note: "the methodology source insists: hard-judge worth before starting any product"
  - source: "YC's MVP mindset"
    note: "Validate assumptions before polishing implementation"

designPrinciples:
  - "Quantify 6 dimensions (market / moat / distribution / cash flow / execution difficulty / strategic fit) — avoid vibes-based judgment"
  - "Hard threshold tiers: ≥22 golden / 15-21 workable / <15 skip — no fence-sitting"
  - "Run before burning runway, not as post-mortem"

usedBy:
  - planner

dependencies:
  - path: "docs/strategy.md"
    why: "Strategic-fit dimension reference"
  - path: "docs/ideas/"
    why: "Accumulated history to avoid duplicate evaluation"
---

# Idea Evaluation · 6-Dim Scoring

## When to use

- Founder says "I have an idea for X"
- Multiple candidate ideas need ranking
- Already started but having second thoughts (cold-start sanity check)

## 6-dim scoring (1-5 each, max 30)

| Dimension | 5 pts | 3 pts | 1 pt |
|---|---|---|---|
| **Pain urgency** | Target users bleed/rage daily over this | Occasional inconvenience | Won't notice if absent |
| **Willingness to pay** | Already paying for an inferior alternative | Will pay but price-sensitive | Free-only |
| **Deliverability** | You + Claude Code ship MVP in 2-4 weeks | 4-8 weeks + minor learning | Needs hardware / ML / regulatory approval |
| **Differentiation** | Unique angle / you have insider insight | Same as existing solutions | Red ocean and commoditized |
| **Reusability** | Can become SaaS / long-term compounding | Templatable, sells N times | One-off custom job |
| **Channel fit** | Can find 10 target users next week | Existing channels need warm-up | Total stranger group |

## Process

### Step 1 · Ask 5 questions

Make founder (or self) answer:

1. Who is the **target user**? Specific: occupation, scale, location, age
2. How do they **solve it today**? (Excel? Outsourcing? Manual? Some tool?)
3. How much **money / time** do they spend on the current solution?
4. Why **now**? (timing rationale)
5. If a v1 ships in 2 weeks, **who is the first paying customer**? A specific person.

**Can't answer Q5 = automatic 1 pt on Channel fit**, skip the rest.

### Step 2 · Score

Score each dimension using the 1-5 rubric.

### Step 3 · Output evaluation report

```markdown
# Idea Eval: [name]

## Summary
[one sentence]

## Target user profile
- Occupation:
- Scale:
- Geography:
- Current solution:
- Pain trigger frequency:

## 6-dim scores

| Dimension | Score | Rationale |
|---|---|---|
| Pain urgency | X/5 | ... |
| Willingness to pay | X/5 | ... |
| Deliverability | X/5 | ... |
| Differentiation | X/5 | ... |
| Reusability | X/5 | ... |
| Channel fit | X/5 | ... |
| **Total** | **X/30** |  |

## Verdict
**Decision**: 🟢 Golden (≥22) / 🟡 Workable (15-21) / 🔴 Skip (<15)

## Biggest uncertainty
[What's the single most critical assumption? How to validate in 1 week at lowest cost?]

## If go: recommended path
- MVP scope: cut down to only ___ features
- Target launch: within 2 weeks
- First user acquisition: ___
- Success metric: ___ trial users, ___ paying users within 2 weeks of launch
- Kill metric: no paying user within ___ → cut

## If no go: recommendation
- Lighter validation: ___ (e.g., landing page for sign-ups, fake-door button)
- Or: which other idea to merge with?
```

### Step 4 · Write to file

Save evaluation to `products/<idea-slug>/EVAL.md` (auto-create directory).

If founder evaluates multiple ideas at once, append a comparison row to `docs/ideas/scorecard.md`:

```markdown
| Idea | Total | Verdict | Eval Date |
|---|---|---|---|
| ... | 22 | 🟢 | 2026-04-23 |
| ... | 16 | 🟡 | 2026-04-23 |
```

## Common mistakes (founders self-scoring)

1. **Urgency over-rated**: You think it's important ≠ target users do. Ask "did anyone reach out about this last week?"
2. **Willingness over-rated**: Saying "I'd pay" ≠ actually paying. Need evidence of "currently paying for similar solution."
3. **Deliverability under-rated**: Many AI apps look simple but need 1-2 months of prompt engineering iteration.
4. **Differentiation narcissism**: You think "I'd do it better" — users may not perceive the difference.
5. **Channel fit most ignored**: No channel = even the best idea is 6-12 months of cold start.

## Reverse validation (bonus)

If founder provides the following **evidence**, one dimension can gain +1 (max 5):

- Willingness to pay: someone already put down a deposit / explicitly said "I'd buy when ready" / already paying for similar
- Urgency: someone reached out last week / public community is complaining
- Channel fit: existing list of 10+ contacts reachable within 1 week
