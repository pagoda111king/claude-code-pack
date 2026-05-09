---
name: content-blitz
description: 4.7 Native One-Shot: From delivery case/theme to 30-day content calendar + multi-platform drafts + digital human scripts in a single 1M context session. Low-conscientiousness friendly. Used to feed the acquisition layer after delivery.
version: "1.0"
lastUpdated: "2026-04-24"

inspiredBy:
  - source: "Claude 4.7 · 1M context feature"
    note: "Leverage 1M context to complete atomic workflows in one session, replacing the multi-step chain from the 4.5 era"
  - source: "Operating Framework content-engine pattern (the methodology source)"
    note: "Multi-platform content derived from a single case, but rebuilt as a 4.7 single-session version"

designPrinciples:
  - "Atomic workflow first: produce 30 days in one go, avoid state sync costs across sessions"
  - "Platform-specific: Xiaohongshu / WeChat blog / X / digital human scripts each have their own section, no template reuse"
  - "Low-conscientiousness friendly: batch output without relying on weekly maintenance"

usedBy:
  - marketing

dependencies:
  - path: "docs/system-memory.md"
    why: "Brand voice + pricing tiers + founder background"
  - path: "customers/<customer>/case.md"
    why: "Content source (optional, use theme instead when no customer)"
---

# Content Blitz · Atomic Content Workflow

## Why This Skill Exists

The Operating Framework's `content-engine` was designed for the 4.6 era—requiring multi-turn conversations (write prompt → generate → review → refine). With **Claude 4.7 + 1M context**, the entire flow can **complete in a single session**. This is especially friendly for low-conscientiousness founders: no weekly maintenance rhythm needed, batch generate 30 days of inventory in one shot.

## When to Use

- A project just delivered, need to feed back into the acquisition layer
- Need to batch produce a week/month of content
- Have an inspiration burst and want to "dump everything in your head into content at once"

**Do not use**: without a brand voice file (build the voice section in `docs/system-memory.md` first).

## Input Checklist (must be complete)

1. **Content source** (at least one):
   - A delivered project → read `products/<project>/` directory
   - A theme / insight / story → founder pastes it in
   - A long-form article → read file path

2. **Brand voice**: voice snippet from `docs/system-memory.md`

3. **Target platforms** (all selected by default, can trim):
   - Xiaohongshu (digital human short video script + copy)
   - WeChat moments
   - WeChat blog (optional)
   - Video account (optional)

4. **Target cadence**:
   - 15 days / 30 days / 60 days

## Output (all produced in one session)

### A. Master file: `products/<project>/content-pack.md`
Contains all versions + publishing calendar.

### B. Publishing calendar table

| Date | Platform | Title | Content Type | Draft Link |
|---|---|---|---|---|
| Day 1 | Xiaohongshu | ... | Digital human 30s | #section 1 |
| Day 2 | Moments | ... | Text | #section 2 |
| ... | ... | ... | ... | ... |

### C. Individual drafts (each = one section)

For each date and piece:
- **Title** (platform-native)
- **Body** (brand voice compliant)
- **Digital human script** (if video): includes shot cues + lines + image suggestions
- **Hashtags** (Xiaohongshu: 5-8 required)
- **CTA**: direct to WeChat / WeChat blog

## Content Structure Principles

### 70-20-10 Mix

For 30 days = 30 pieces:
- **70% technical value** (21 pieces): niche SaaS tools, AI applications, specific operations
- **20% case stories** (6 pieces): anonymized delivery stories, measurable results
- **10% personal** (3 pieces): city life, learning notes, tool comparisons

### Viral Templates (for Xiaohongshu)

Generate using these structures by default, cycle through them:
- **Counterintuitive hook + numerical evidence**: e.g., "The dashboard I spent 3 hours on—the seller said after 1 week they no longer needed an ad team"
- **VS comparison**: traditional method vs AI method, side-by-side
- **Before/After**: specific before/after changes + data
- **Tutorial**: step-by-step with demo GIF / screenshots
- **Pitfall guide**: N traps I fell into

### Digital Human Script Format

```
[Shot 1 · 0-5 sec] Person center frame + hook subtitle
Lines: "Today I'll tell you..."
Image suggestion: <specific>

[Shot 2 · 5-15 sec] Problem scenario
Lines: "If you are..."
Image suggestion: <specific>

[Shot 3 · 15-25 sec] Solution demonstration
Lines: "Here's what I did..."
Image suggestion: <demo screenshot / data>

[Shot 4 · 25-30 sec] CTA
Lines: "DM me on my homepage to chat"
Image suggestion: <WeChat QR code / homepage guide>
```

## Quality Checklist (run after generation)

- [ ] All content passes brand voice check (no "empower the ecosystem" fluff)
- [ ] At least 1 **specific number** (time, amount, percentage) every 5 pieces
- [ ] Every CTA points to the same destination (WeChat / DM)
- [ ] No real customer names or unauthorized data leaked
- [ ] Xiaohongshu hashtags are all relevant (no unrelated trending tags stacked)
- [ ] Digital human script lines read naturally (can be delivered within 30 seconds)

## Execution Flow

```
Input: project path OR theme + days + platform list
   ↓
Read: voice section from docs/system-memory.md
Read: input source (project products directory / user pasted text)
   ↓
One-shot generate: publishing calendar + all drafts (all 30 pieces)
   ↓
Self-check: run quality checklist
   ↓
Write: products/<project>/content-pack.md
   ↓
Output: founder receives full content pack + one recommendation (which to post first, why)
```

## Limitations / When Not to Use

- Not suitable for **real-time data** content (trend tracking, holiday tie-ins)—that needs a separate run
- Not suitable for **serious knowledge products** (course scripts)—precision requirements too high
- Not suitable for companies with **existing content teams**—multi-person review workflow conflicts with this

## Cost Note

One run of 30 pieces: Opus approximately ¥20-40 (includes 1M context loading and output).
Batch production vs piecemeal 3 pieces at a time: **cost is similar, but your mental load is 10x lower**. This is the best value investment in the 4.7 era.

## Prohibitions

- Do not run without a brand voice file (refuse execution directly, require building it first)
- Do not automate publishing (generate drafts only, you handle publishing)
- Do not mix content across projects (case A's story is not reused for project B)