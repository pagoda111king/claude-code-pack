---
name: soft-launch
description: Pilot customer tracking · Solo Founder edition of canary-watch. Used to track feedback and make GO/NO-GO decisions after delivering the product to the first 1-3 pilot customers. Triggered when the founder says "product delivered / launched / given to a customer."
version: "1.0"
lastUpdated: "2026-04-25"

inspiredBy:
  - source: "Operating Framework canary-watch"
    note: "Enterprise multi-region traffic canary → Solo Founder single-customer pilot tracking"
  - source: "YC retention monitoring"
    note: "First 7 days of activity determine everything"

designPrinciples:
  - "AI classifies candidate feedback + human decides in 5 seconds · not fully automated"
  - "GO/NO-GO criteria must be set before pilot starts · not chosen after the fact"
  - "Failed pilots still produce case studies (anonymized + lessons) · feeds the flywheel"

usedBy:
  - case-study-gen
  - planner

dependencies:
  - path: "customers/"
    why: "One folder per customer · pilot-tracking.md lives there"
  - path: "docs/ideas/<slug>/eval.md"
    why: "Cross-reference original evaluation's target user persona"
---

# Soft-Launch Monitor · Pilot Customer Tracking

## When to Trigger

Founder says:
- "Product delivered to customer X"
- "Y started using our tool"
- "How's the first week of pilot going"

Or dashboard pipeline Stage 6 triggers.

## Inputs

- `customers/<name>/` (customer folder)
- `docs/ideas/<slug>/` (product pipeline artifacts · for cross-referencing original assumptions)
- Founder's verbal supplement: specific customer feedback (WeChat screenshots / emails / call transcripts)

## Output

`customers/<name>/pilot-tracking.md`, structured as follows:

```yaml
---
stage: pilot
customer: <name>
product: <slug>
startDate: 2026-04-25
deadline: 2026-05-09     # default 14-day pilot cycle
status: monitoring        # monitoring / GO / NO-GO / extended
goNoGoCheckpoints:
  - day7: pending
  - day14: pending
exitCriteria:
  GO:
    - "Customer uses product 5 consecutive workdays"
    - "At least 1 proactive positive feedback"
    - "Verbal renewal intent confirmed"
  NO_GO:
    - "Zero active logins in first week"
    - "Explicitly says 'not a fit' or 'too complex'"
    - "Data / privacy incident occurs"
---

# Pilot Tracking · <customer> · <product>

## Feedback Log

### Day 1-3
- 2026-04-25 · Customer first login + used feature X · Feedback: ...

### Day 4-7
- 2026-04-28 · ...

## Current GO/NO-GO Assessment

[Fill in at day 7 / day 14 checkpoint]

## Risks & Mitigations

- Risk 1: ...
- Mitigation: ...
```

## Core Rules

1. **Default pilot period is 14 days** · exceeding without clear renewal = implicit NO-GO
2. **GO/NO-GO criteria are locked in on day 0** · not adjusted mid-course
3. **Every feedback entry includes date + source** (WeChat / email / call) · no memory-based recall
4. **Day 7 is a mandatory checkpoint** · if criteria aren't met, proactively schedule a 1-on-1 with the customer
5. **NO-GO still produces a case study** (anonymized internal version) · honest failure builds trust

## Collaboration with Other Skills

- Before evaluation, use `idea-eval` existing 6-dimension scores · cross-reference with actual feedback ("assumed pain points vs real customer pain points")
- After pilot ends, use `case-study-gen` to feed this back into 6-platform content (regardless of GO or NO-GO)
- After multiple pilots complete, use `eval-refine` to adjust the idea-eval rubric

## Solo Founder Specific Constraints

- **No more than 3 concurrent pilots** · attention gets diluted · none succeed
- **Customer pays before pilot** · free pilot customers don't actually use the product · feedback is invalid
- **Fixed 1-hour weekly proactive check-in** · don't wait passively for feedback

## Prohibited

- ❌ Adding new features mid-pilot (breaks the baseline)
- ❌ Automated DMs / automated follow-ups (violates TOS · destroys trust)
- ❌ Treating vague feedback as a GO signal ("it's okay" / "pretty good" = implicit NO-GO)