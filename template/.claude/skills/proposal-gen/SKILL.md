---
name: proposal-gen
description: Generate client proposals from discovery call notes. Use after lead-intake verdict is 🟢. Outputs a branded, price-free proposal for the client (pricing sent separately in a follow-up email).
version: "1.0"
lastUpdated: "2026-04-24"

inspiredBy:
  - source: "the methodology source's proposal template"
    note: "Proposal structure: problem → solution → path → timeline → next steps"
  - source: "'Proposal/Quote Separation' negotiation strategy"
    note: "Align on scope first, then discuss price. Reduces negotiation friction."

designPrinciples:
  - "Hard gate: must have lead-intake 🟢 verdict. No bypassing the interview to write a proposal."
  - "Scope only, no pricing: send quote separately in a follow-up email to leave room for negotiation."
  - "24-hour cadence: send within 48 hours of the call. The longer you wait, the colder the lead."

usedBy:
  - marketing

dependencies:
  - path: "docs/system-memory.md"
    why: "Brand voice + pricing tiers (internal use)"
  - path: "docs/templates/SOW.md"
    why: "SOW template for the contracting phase"
  - path: "customers/<client>/intake.md"
    why: "Interview notes as input for the proposal"
---

# Proposal Generator

## When to Use

- `skills/lead-intake` outputs a verdict of 🟢 (≥22 points)
- Must be sent to the client within 48 hours
- Never write a proposal without conducting an interview first (that's bidding, not consulting)

## Inputs

- `clients/<client-name>/discovery-<date>.md` (interview notes)
- `docs/brand-voice.md` (if it exists; otherwise use the default fallback voice)
- Relevant case studies: `products/case-studies/*.md` (if used)

## the methodology source Proposal Philosophy

1. **Start with their pain, not your features**
2. **Evidence > promises**: use specific client quotes, numbers, screenshots
3. **No pricing in the proposal**: the proposal converges scope; the follow-up email discusses money separately
4. **Length < 1500 words**: B2B decision-makers won't read long documents
5. **Give a clear "next step"**: don't make the client figure out what to do next

## Standard Structure (8 Sections)

```markdown
# <Project Name> · Proposal
To: <Client Name / Company>
From: <You> · <Date>

---

## 1. The Problem I Heard (Use Client's Own Words)

You mentioned on <date>:

> "<Quote 1 · specific scenario>"

> "<Quote 2 · urgency>"

My understanding is: **<one-sentence problem summary>**. If this is off, please let me know in your reply.

## 2. Why Solve It Now

Based on the <trigger event> you mentioned, if this problem continues,
**you're losing roughly X hours / Y dollars per week** (estimated from the data you provided).

## 3. My Proposed Solution

A <product type: tool / dashboard / automated workflow / SaaS> that specifically:
- **Core Feature 1**: <what it does, which pain point it addresses>
- **Core Feature 2**: ...
- **Core Feature 3**: ...

**What's out of scope** (to prevent scope creep):
- Not doing <out-of-scope A>
- Not doing <out-of-scope B>

## 4. Delivery Timeline

| Phase | Deliverable | Timeline |
|---|---|---|
| Phase 1 · Core Working | <specific feature> | Weeks 1-2 |
| Phase 2 · Full Experience | <specific feature> | Weeks 3-4 |
| Phase 3 · Launch & Wrap | Monitoring / Docs / Training | Week 5 |

Weekly sync every Friday. A 30-minute demo after each phase.

## 5. Why Me

<1-2 paragraphs, referencing brand voice for personal introduction>

- Relevant experience: <1-2 items, ideally with links or verifiable results>
- Technical leverage: primarily use Claude Code for AI-native development, delivering at roughly 3-5x the speed of traditional outsourcing
- <Optional: one client testimonial from a delivered case study>

## 6. What I Need From You

- At project kickoff: <one 1-hour alignment meeting>
- Weekly: <30-minute weekly sync>
- Data / API access: <specific resources you need to provide. Must be explicit to avoid later disputes>

## 7. Next Steps

If this direction feels right, I suggest we:

1. **This week**: schedule a 30-minute call to finalize scope (I'll bring a draft)
2. **By Monday**: send you the SOW (including pricing, payment schedule, IP ownership)
3. **Upon SOW confirmation + 30% deposit**: kick off

If the direction is off, please say so. I can revise.

---

Attachments:
- <Optional: one-page relevant case study>
- <Optional: one-page technical architecture diagram>

<Your signature · WeChat / Email>
```

## Generation Process

1. Read interview notes: `clients/<client-name>/discovery-<date>.md`
2. Read brand voice: `docs/brand-voice.md` (if it doesn't exist, prompt the founder to create it first)
3. Read 1-2 relevant case studies: `products/case-studies/*.md`
4. Generate using the 8-section structure above
5. **Checklist**:
   - [ ] Quoted ≥2 client statements
   - [ ] "Out of scope" is explicitly stated
   - [ ] Each of the three phases has a deliverable
   - [ ] **No pricing numbers**
   - [ ] Total word count < 1500
   - [ ] Next steps are concrete (with time anchors)
6. Output to `clients/<client-name>/proposal-v1-<date>.md`
7. Simultaneously generate a follow-up email (separate file `clients/<client-name>/proposal-quote-v1-<date>.md`), containing pricing + payment schedule + optional add-ons

## Pricing (Follow-up Email)

Two tiers plus one optional add-on:

```markdown
Addendum: On Pricing

Based on the delivery scope, here are my rates:

**Standard Plan**: <price> CNY
- Includes: Phase 1 + Phase 2 + Phase 3
- Payment: 30% deposit to start / 50% upon Phase 2 completion / 20% after acceptance
- Delivery timeline: 5 weeks

**Lite Plan** (if budget is tight): <price × 0.6> CNY
- Includes: Phase 1 + Phase 2 (excluding monitoring/training)
- Payment: 50% deposit / 50% upon acceptance
- Delivery timeline: 4 weeks

**Optional Add-on** (6-month maintenance): <monthly price> CNY/month
- Includes bug fixes, minor feature iterations, one 30-minute consultation per month

Let me know your rough budget range, and we'll settle on the best plan.
```

## Common Pitfalls

1. **Don't offer 5 price tiers**: too many options = decision paralysis. Two tiers plus one optional add-on, max.
2. **Don't send a 10-page PPT on the first contact**: a 1500-word Word doc or markdown is best. A PPT signals you're trying to look like a big company.
3. **Don't skip the "out of scope" section**: skipping it guarantees scope creep later.
4. **Don't promise uncertain timelines**: before writing "5 weeks," break it down with a planner yourself.

## Prohibited

- Sending the same template with just the client name swapped (the methodology source philosophy: brand voice makes it obvious if it's copied)
- Using buzzwords like "empower," "ecosystem," "closed loop" in the proposal
- Writing a proposal without conducting an interview