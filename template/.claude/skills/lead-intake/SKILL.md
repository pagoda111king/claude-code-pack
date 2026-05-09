---
name: lead-intake
description: Lead discovery call script + qualification scoring. Use before or after a founder talks to a potential lead. Output: structured interview notes + 6-dimension customer score + proposal stage decision.
version: "1.1"
lastUpdated: "2026-04-24"

inspiredBy:
  - source: "the methodology source's discovery-call script"
    note: "Three-phase flow design: pre-call, during-call, post-call"
  - source: "lead-scorer 6-dimension weight model"
    note: "Urgency / Budget / Decision authority / Fit / Reachability / Reusability"

designPrinciples:
  - "Output question list before call, follow it during call, produce structured notes after call"
  - "Hard decision: 🟢 ≥22 enter proposal / 🟡 15-21 watch / 🔴 <15 politely decline"
  - "Notes must be saved to customers/<customer>/ not just in conversation"

usedBy:
  - customer-support
  - proposal-gen

dependencies:
  - path: "docs/system-memory.md"
    why: "Weight parameters + customer profiles"
  - path: "scripts/lib/lead-scorer.js"
    why: "Only implementation of 6-dimension scoring"
  - path: "customers/"
    why: "Output destination"
---

# Discovery Call & Customer Qualification

## When to Use

- **Pre-call**: Generate question list for this interview
- **During call**: (open on screen) Follow along
- **Post-call**: Drop notes to me, generate structured interview record + score + next-step decision

## Core 10 Discovery Questions (30-minute version)

Ask in this order, **do not skip or reorder**:

### Icebreaker (3 minutes)
0. "First, let me understand what you're working on—what does a typical day look like for you?"
   - Listen for: company size, role, industry, daily focus

### Problem (8 minutes)
1. **"[Topic question] How much time did you spend on this last week / how many interruptions did you have?"**
   - Listen for: urgency
2. **"When was the last time this issue frustrated you the most / what was the specific scenario?"**
   - Listen for: concrete scenario, not abstract pain point
3. **"How are you solving this problem now?"**
   - Listen for: alternative solutions (Excel / outsourcing / some SaaS / manual work)

### Willingness to Pay (5 minutes)
4. **"To solve this problem, roughly how much money or manpower have you spent in the past year?"**
   - Listen for: already paid > willing to pay > verbally willing
5. **"If this problem were solved tomorrow, what would it mean for your company? Can you quantify it?"**
   - Listen for: ROI baseline

### Decision Chain (5 minutes)
6. **"If I built a v1 within two weeks, would you be the sole decision-maker on whether to use it?"**
   - Listen for: decision speed
7. **"The last time your company did a similar outsourcing / tool purchase, how long did the process take?"**
   - Listen for: organizational maturity and procurement process

### Budget & Timing (5 minutes)
8. **"What kind of budget do you have for this type of tool? Or how much do you think this problem is worth?"**
   - Listen for: within our pricing range (30k-300k)
9. **"Why solve this now? You've had this problem before, right?"**
   - Listen for: catalyst

### Next Steps (4 minutes)
10. **"If I put together a concrete proposal based on what we discussed and send it to you, what do you think the next step should be?"**
    - Listen for: **strength level** of real intent (reference table):

    **⭐ Strong signal** (→ likely to sign · send proposal within 48h):
    - "When can I see the proposal?"
    - "Send me the SOW"
    - "Just tell me the price / when to sign"
    - "Can you send it before next week?"

    **🟡 Medium signal** (→ add to watch list · monthly ping):
    - "You can send some materials / an overview first"
    - "Let me discuss with my partner"
    - "Interested, let me digest it first"
    - "Let me have an internal meeting first"

    **🔴 Weak signal** (→ unlikely to advance · polite exit):
    - "Send me a quote so I can compare"
    - "We'll look at a few more options"
    - "Thanks, just getting informed"
    - "Got it, I'll reach out if needed"

    **Rule**: Q10 signal strength **can override the total score decision independently**. If 6-dimension score ≥22 (🟢 threshold) but Q10 is weak signal, downgrade to 🟡 watch; if Q10 is strong signal but score is 15-21, consider exceptional upgrade to 🟢 quick test (send proposal within 48h to gauge reaction).

## 6-Dimension Customer Score (based on opportunity map scoring method)

| Dimension | Score 1-5 based on signals heard |
|---|---|
| **Urgency** | Specificity of Q1 + Q2 |
| **Ability to Pay** | Q4 + Q8 |
| **Decision Speed** | Q6 + Q7 |
| **Fit** | Can you solve with Claude Code + existing skills in 2-4 weeks |
| **Reusability** | Would this need appear in other sellers / businesses |
| **Reachability** | How many more of these customers exist, how many can you contact next week |

## Post-Interview Output (standard format)

```markdown
# Discovery Call: <Customer Name> | <Company> | <Date>

## Basic Info
- Industry / Size:
- Role / Decision Authority:
- Location:
- Referral Source:

## Interview Record (10 Questions)
**Q0 Icebreaker**: <Summary>
**Q1 Urgency**: <Summary>
...
**Q10 Next Steps Intent**: <Summary>

## Key Signals (quote customer verbatim)
- Quote: "We manually export data 3 times a week, takes 5 hours" → High urgency
- Quote: "We tried twice before with others and it didn't work" → Past failure, high trust cost
- Quote: "Budget isn't an issue" → ⚠️ Often a smokescreen, keep probing

## 6-Dimension Score

| Dimension | Score | Basis |
|---|---|---|
| Urgency | X/5 | ... |
| Ability to Pay | X/5 | ... |
| Decision Speed | X/5 | ... |
| Fit | X/5 | ... |
| Reusability | X/5 | ... |
| Reachability | X/5 | ... |
| **Total** | **X/30** |  |

## Decision
🟢 Enter proposal stage (≥22) / 🟡 Watch list (15-21) / 🔴 Politely decline (<15)

## Next Steps
- If 🟢: Send proposal within 48h (call `skills/proposal-gen`)
- If 🟡: Add to "watch" column in `docs/pipeline.md`, ping monthly
- If 🔴: Send a polite "not a good fit for now" email, keep relationship

## Archive Location
Write to `clients/<Customer Name>/discovery-<Date>.md`
Append one line to `docs/pipeline.md` in the corresponding stage
```

## Common Pitfalls (watch for these in 30 minutes)

1. **Customer says "it's not urgent" ≠ actually not urgent**. Probe: "What if it's not solved for six months?" Listen to their reaction.
2. **Customer says "budget isn't an issue"** = smokescreen. Keep probing: "What's your typical procurement process?"
3. **Customer asks "what can you do" too early** = you've lost control. Counter: "What specific problem do you most want to solve?"
4. **"Let me discuss with my team"** = 70% won't advance. Immediately propose: "Let me send you a simple one-pager to take back to them?" Get a committed next step.
5. **Call exceeds 40 minutes** = you're talking too much. 30 minutes structured questions, 5 minutes summary and commitment, 5 minutes next steps, then end.

## Prohibited

- **Never quote a price** during the call (unless they ask proactively AND your 6-dimension score ≥22)
- **Never commit to a timeline** during the call (saying "I can deliver v1 in 2 weeks" is a major mistake—go back and scope it first)
- **Interview ≠ sales pitch**. Ask 3x more than you talk. The more you talk, the lower their willingness to pay.