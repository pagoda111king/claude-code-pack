---
name: case-study-gen
description: Automatically repurpose completed client projects (or any work with content value) into 5 content types: anonymized case study + WeChat moments + Xiaohongshu + WeChat blog + Twitter/LinkedIn. This is the core of the methodology source flywheel—every delivery fuels acquisition.
version: "1.0"
lastUpdated: "2026-04-24"

inspiredBy:
  - source: "everything-claude-code · feedback flywheel"
    note: "Core insight of the methodology source: every delivery is the content source for the next round of acquisition"
  - source: "Content atomization"
    note: "One piece of work produces multiple formats, not one format at a time"

designPrinciples:
  - "Every delivery must generate a case study (including failures and abandoned projects)"
  - "Anonymize first: default to producing both an anonymized version and an internal version"
  - "Produce for 5 platforms simultaneously: WeChat moments / Xiaohongshu / WeChat blog / X / anonymized case study doc"

usedBy:
  - marketing

dependencies:
  - path: "docs/system-memory.md"
    why: "Brand voice + disallowed terms"
  - path: "customers/<client>/"
    why: "Delivery content source"
---

# Case Study Generator (Content Flywheel)

## When to Use

- Within 1 week of client project delivery (while memory is fresh)
- Even if the client doesn't allow public sharing, generate an anonymized internal version (for your own review)
- Also generate for abandoned projects (failure cases have learning/content value too)

## the methodology source Flywheel Logic

```
  1 project delivered
     ↓ case-study-gen
  1 full case study + 5 platform posts
     ↓ @marketing review → founder approval
  Distribute to WeChat moments / Xiaohongshu / WeChat blog / X / LinkedIn
     ↓
  Generates 2-5 new leads
     ↓ lead-intake
  1-2 enter proposals
     ↓ proposal-gen
  0-1 signed
     ↓ @planner + delivery
  Back to step 1
```

**Key**: Without this step, every delivery is just one-off labor. With this step, the acquisition cost for the N+1th deal approaches zero.

## Inputs

Required:
- Project PLAN.md (what was done)
- Project SHIP.md (what was delivered)
- 3 numbers from the founder: **quantifiable user benefits** (time saved, revenue increased, cost reduced)
- 1 sentence from the founder: **the moment the client was most surprised / impressed**

Optional:
- Direct client quotes (with permission to publish)
- Before/after comparison images or screenshots
- Anonymization level: public / anonymized / internal only

## Output 6 Files

### 1. Full Case Study (Main File)

Write to `products/case-studies/<project-slug>.md`:

```markdown
# <Project Title: Strong Keyword + Result Number>

Example: "Your City Niche Industry Users: Cut Ad ROAS Monitoring from 2 Hours/Day to 15 Minutes with an AI Dashboard"

## Client Background
- Industry / Size (anonymized)
- Triggering event

## Problem
<1 paragraph, quote client's own words, max 150 characters>

## Solution
<3 core features, each with 1 sentence explaining "why this approach">
<1 architecture diagram or product screenshot>

## Delivery Process (Optional)
- Timeline: X weeks from kickoff to launch
- Key decisions: <1-2 technical or product trade-offs>

## Results
- Number 1: <quantified benefit>
- Number 2: <quantified benefit>
- Number 3: <quantified benefit>
- Client feedback: <1 sentence quote, in quotation marks>

## 5 Takeaways You Can Reuse
<List 5 insights valuable to others>

## About the Author
<Personal bio in brand voice + contact info>
```

### 2. WeChat Moments Version (Under 200 Characters)

Write to `products/case-studies/<project-slug>/wechat-moments.md`:

```
[Hook: a counterintuitive fact or a number]

[Scene: 1-2 sentences on who the client is and what they were struggling with]

[Result: quantifiable change after completion]

[Method: one sentence on the approach or tool used]

[CTA: If you're also dealing with X, feel free to chat]

[Image suggestion: before/after screenshot or number PPT card]
```

### 3. Xiaohongshu Version (300-500 Characters + Emoji Rhythm)

Write to `products/case-studies/<project-slug>/xiaohongshu.md`:

```
[Title: Number + Emotion, e.g., "💥 Save 2 Hours a Day: The AI Ad Dashboard Cross-Border Sellers Are Using"]

[First 3 lines must grab attention]
🔥 
⚠️
💡

[Body uses bullet points + emoji, no long paragraphs]
→ Pain point
→ Method
→ Result

[5-8 hashtags]
#NicheIndustry #AITools #DTC #ChatGPT #DeepSeek
```

### 4. WeChat Blog Version (800-1500 Characters, In-Depth)

Write to `products/case-studies/<project-slug>/wechat-blog.md`:

Title + intro + 3-section structure:
- Problem and background
- Solution design (with screenshots / architecture diagrams)
- Results and reflection

Bottom: "I'm <name>, doing <positioning> in your city" + WeChat blog follow CTA + contact info.

### 5. Twitter Thread Version (English, 5-7 Tweets)

Write to `products/case-studies/<project-slug>/twitter.md`:

```
1/ Hook (one sentence + number)

2/ Context (who was the client, what was the pain)

3/ Approach (high-level solution, one screenshot)

4/ Result (3 numbers)

5/ The one non-obvious insight

6/ If you're building X for Y, happy to chat — DMs open

7/ (optional) What's next — teaser for the next case study
```

### 6. LinkedIn Version (English, Deeper)

Write to `products/case-studies/<project-slug>/linkedin.md`:

500-800 characters, more formal. Structure:
- A counterintuitive opening
- Client story
- Your role / approach
- Results
- Takeaway for people in similar roles
- CTA: "If you're a Shopify merchant facing X, DM me"

## Automation Flow

1. **Read inputs**: PLAN.md, SHIP.md, founder's 3 numbers + 1 moment
2. **Read brand voice**: `docs/brand-voice.md`
3. **Generate 6 files**: Place under `products/case-studies/<project-slug>/`
4. **Checklist**:
   - [ ] All 6 versions share the same core facts, but tone matches each platform
   - [ ] Each version has quantifiable numbers
   - [ ] No unauthorized client information leaked
   - [ ] WeChat moments / Xiaohongshu / WeChat blog have clear CTA
   - [ ] Twitter / LinkedIn use natural English (not translated from Chinese)
5. **Output summary**: Show the founder which version to post first and when (include posting cadence suggestions)

## Posting Cadence Suggestions (Default)

- **Day 0** (first day after delivery): WeChat moments + Xiaohongshu
- **Day 3**: WeChat blog long-form + LinkedIn
- **Day 7**: Twitter thread
- **Day 14**: If response is good, secondary distribution in meetups / communities

## Anonymization Rules

- Company name → Industry + size (e.g., "your city 80-person niche industry company")
- Person name → Job title (e.g., "Operations Director")
- Specific product category → Parent category (e.g., "3C accessories" → "consumer electronics")
- Numbers → Keep magnitude, blur precision (e.g., "annual revenue 30 million" → "annual revenue tens of millions")
- **Client-authorized public**: Can keep real info, but have the client review it first before posting

## Prohibited

- Exaggerating results ("reduced by 90%" when it's actually "reduced by 60%")
- Treating in-progress projects as delivered case studies
- Posting sensitive data / screenshots without anonymization
- Posting all 6 versions on the same day (looks robotic, counterproductive)