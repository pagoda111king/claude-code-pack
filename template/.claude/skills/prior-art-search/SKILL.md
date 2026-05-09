---
name: prior-art-search
description: Before writing code / breaking down requirements, exhaustively search the web for "has someone already built something similar." Run immediately after idea-eval passes (even with a low score — finding an existing solution is the fastest path). Output to docs/ideas/<slug>/prior-art.md with 5-10 candidate projects, overlap percentage, gap analysis, and recommended path (use-as-is / fork / borrow / build-fresh).
version: "1.0"
lastUpdated: "2026-04-26"
model: opus
tools: WebSearch, WebFetch, Read, Write

inspiredBy:
  - source: "the methodology source Operating Framework `code-explorer` / `codebase-onboarding`"
    note: "Operating Framework focuses on in-code exploration; we extend to the external world"
  - source: "academic prior art search"
    note: "Mandatory before patent filing; equally mandatory for software startups"
  - source: "User quote (2026-04-26)"
    note: "There are too many creative geniuses in the world. They may have already built similar products. GitHub names aren't always prominent. Tools recommended by big names aren't necessarily popular."

designPrinciples:
  - "Exhaustive search — not just direct keywords. Use 5-8 angles (scenario / tech stack / X for Y pattern / Chinese communities / big-name recommendations)"
  - "Finding isn't the end. Must analyze each candidate's overlap + gap + recommended usage"
  - "Conclusion must be actionable: choose 1 of 4 — use-as-is / fork-modify / borrow-pattern / build-fresh"

usedBy:
  - planner

dependencies:
  - path: "docs/ideas/<slug>/eval.md"
    why: "Read idea description + target users. Use as seed for search keywords."
---

# Prior-Art Search · Exhaustive Similar Projects

## When to Trigger

- After idea-eval runs (regardless of 🟢🟡🔴 — finding an existing solution = zero-effort delivery)
- Founder says "has someone already built this idea"
- Dashboard pipeline Stage 2 triggers

## Input

- `docs/ideas/<slug>/eval.md` (idea summary + user persona + pain points)

## Search Strategy · 8 Angles (must search at least once per angle)

| # | Angle | Example (for "AI tracking globe") |
|---|---|---|
| 1 | **Direct keywords** | `AI tracker globe visualization github` |
| 2 | **Scenario description** | `tool to track what AI researchers are working on` |
| 3 | **Target user perspective** | `indie hacker AI news daily digest dashboard` |
| 4 | **Core action + domain** | `aggregate Twitter RSS GitHub trending AI` |
| 5 | **Big-name recommendations / lists** | `awesome AI news tools / "X recommends" AI tracker` |
| 6 | **Chinese communities** | `Jike / Xiaohongshu / V2EX / Zhihu AI info aggregation tool recommendations` |
| 7 | **Specific people / organizations** | `Karpathy tweets aggregator / Anthropic news feed` |
| 8 | **Alternatives / workflows** | `RSS reader AI / Twitter list curation / newsletter aggregator` |

**At least 5 WebSearch calls** — fewer means you're cutting corners.

## Evaluate Each Candidate

For every project found (GitHub / product / open-source library / service), output:

| Field | Content |
|---|---|
| **Name + URL** | Link |
| **Stars / users** | Real data (fetch the homepage) |
| **Summary** | One-liner |
| **Overlap** | 0-100% — "how much of what you want does it do" |
| **Gap** | What you want but it doesn't have |
| **Status** | Actively maintained / semi-abandoned / dead |
| **Source** | Direct search / big-name recommendation / community / awesome list |
| **Recommended usage** | A use-as-is / B fork-modify / C borrow-pattern / D build-fresh |

## Output File

`docs/ideas/<slug>/prior-art.md`:

```yaml
---
stage: prior-art
slug: <slug>
aiVersion: 1
generatedAt: 2026-04-26
generatedBy: prior-art-search@1.0
candidates: 8                 # total found
exactMatch: false             # is there one that's basically what you want
recommendedPath: "fork-modify" # use-as-is / fork-modify / borrow-pattern / build-fresh
overallVerdict: "🟡 Existing similar solution exists. Forking is 5-10x faster than building from scratch."
sources:
  - github
  - hackernews
  - twitter
  - jike
  - awesome-list
userEdits: {}
---

# Similar Projects Research · <slug>

## Overall Assessment

[1-3 paragraphs: whether a similar solution was found, recommended path, rationale]

## Candidates (sorted by overlap descending)

### 1. <Project Name> · <Overlap X%>

- **URL**: [link]
- **Stars / Status**: 12.3k · actively maintained
- **Summary**: ...
- **Overlap**: [what it does that you want]
- **Gap**: [what it doesn't do that you want]
- **Source**: direct search / [big-name recommendation link]
- **Recommendation**: A use-as-is · just add 1 small filter
- **Cost**: 0 lines of code vs 8 weeks to build

### 2. ...

## Integration Recommendations

[If fork-modify path: give specific modification steps + time estimate]
[If use-as-is path: give registration/deployment steps]
[If build-fresh path: explain why none of the 8 candidates suffice and what unique value justifies building from scratch]

## Decision Criteria for 4 Paths

| Path | Trigger | Action |
|---|---|---|
| **A. Use-as-is** | Overlap ≥ 90% · actively maintained · acceptable license | Register / subscribe / install · trial for 7 days · revisit if insufficient |
| **B. Fork-modify** | Overlap 60-89% · open source · moderate maintenance | Clone · get it running · modify 1-2 key gaps · estimate 1-3 days |
| **C. Borrow-pattern** | Overlap 30-59% · idea is right but implementation is too far off | Read source code to learn architecture · reuse architectural decisions when building |
| **D. Build-fresh** | Overlap < 30% or all candidates are dead / closed-source and unmodifiable | Only then enter requirements phase |

## Solo Founder Principles

- **Finding = winning**: Not embarrassing — it saves 8 weeks of runway
- **Always search before building**: 90% of "I have a new idea" has already been built somewhere in the world
- **Big-name recommendations matter**: Their tools may not have many stars, but quality has been vetted by them

## Prohibited

- ❌ Cutting corners with only 1-2 searches (must use ≥5 angles)
- ❌ Giving "recommendations" without specific URLs (not verifiable)
- ❌ Labeling all candidates as "< 30% overlap" to force build-fresh (this is founder optimism bias — stay neutral)
- ❌ Missing Chinese communities (Jike / Xiaohongshu / V2EX / Zhihu) — Chinese circles have many undervalued tools

## Collaboration with Other Tools

- Input comes from `idea-eval`
- Output feeds into `requirements` (if fork-modify path, requirements only list the gaps)
- Works with `validator`: validator will ask "why not use X" — this step answers that and avoids review

## 4 Recommended Path Decision Criteria

| Path | Trigger | Action |
|---|---|---|
| **A. Use-as-is** | Overlap ≥ 90% · actively maintained · acceptable license | Register / subscribe / install · trial for 7 days · revisit if insufficient |
| **B. Fork-modify** | Overlap 60-89% · open source · moderate maintenance | Clone · get it running · modify 1-2 key gaps · estimate 1-3 days |
| **C. Borrow-pattern** | Overlap 30-59% · idea is right but implementation is too far off | Read source code to learn architecture · reuse architectural decisions when building |
| **D. Build-fresh** | Overlap < 30% or all candidates are dead / closed-source and unmodifiable | Only then enter requirements phase |

## Solo Founder Principles

- **Finding = winning**: Not embarrassing — it saves 8 weeks of runway
- **Always search before building**: 90% of "I have a new idea" has already been built somewhere in the world
- **Big-name recommendations matter**: Their tools may not have many stars, but quality has been vetted by them

## Prohibited

- ❌ Cutting corners with only 1-2 searches (must use ≥5 angles)
- ❌ Giving "recommendations" without specific URLs (not verifiable)
- ❌ Labeling all candidates as "< 30% overlap" to force build-fresh (this is founder optimism bias — stay neutral)
- ❌ Missing Chinese communities (Jike / Xiaohongshu / V2EX / Zhihu) — Chinese circles have many undervalued tools

## Collaboration with Other Tools

- Input comes from `idea-eval`
- Output feeds into `requirements` (if fork-modify path, requirements only list the gaps)
- Works with `validator`: validator will ask "why not use X" — this step answers that and avoids review