---
description: Extract new skills from sessions/recurring patterns · Metaprogramming tool · Upgrade path from learning candidates based on Continuous Learning
version: "0.1"
lastUpdated: "2026-04-25"
---

# /skill-create

**Metaprogramming tool** · Upgrade path from "I've done this manually 3 times" to "this should be a skill". Works with `/learn-review` to promote learning candidates into reusable workflows.

## When to Use

**Triggers** (any one qualifies):
- You notice yourself giving Claude the same type of instruction ≥3 times (e.g., "organize customer feedback into X format")
- A learning candidate with `type: skill-seed` gets promoted to skill via `/learn-review`
- After finishing a client project, you realize the workflow is reusable for the next client

**Not suitable for**:
- One-off tasks (won't repeat) · don't create skills "just in case"
- Vague "some kind of style" · if it's not specific enough, it can't be skill-ified
- Pure knowledge ("best practices for XXX") · that's docs, not a skill

## Usage

- `/skill-create <name> <one-line description>` · Create skill from scratch
- `/skill-create --from-candidate <candidate-slug>` · Upgrade from learning candidate
- `/skill-create --from-session` · Extract recurring patterns from current session

## Execution Flow

### Step 1 · Validate This Is Really a Skill

Run through the **Skill Qualification 5 Questions**:

1. **Repeatability**: Has this actually repeated ≥3 times? (Ask the founder) · If not, reject creation
2. **Describability**: Can you state "when to trigger + what to do + what it produces" in one sentence?
3. **Verifiability**: How do you know the skill ran correctly? (Is there a rubric?)
4. **Atomicity**: Can it run standalone, or does it depend on 2-3 other tools? (Complex dependencies → split into multiple skills)
5. **Boundaries**: Can you clearly state what it does NOT do?

All 5 pass → proceed to Step 2. Any fail → clarify first, then create.

### Step 2 · Gather Material

Based on source:

**Method A · --from-session**:
- Review current session
- Find recurring patterns of "founder input X → Claude does Y → produces Z"
- At least 3 concrete examples (input/output pairs)

**Method B · --from-candidate**:
- Read `docs/learnings/candidates/<slug>.md`
- Convert learning "experience" into skill's when-to-use and action
- Convert "evidence" into skill's examples

**Method C · From scratch**:
- Ask founder: typical input / expected output / what not to do / 4 details
- Collect 3 sample input/output pairs

### Step 3 · Generate Draft Following SKILL.md Schema

**Required structure** (per `docs/agent-skill-schema.md` + conventions from existing 6 skills):

```markdown
---
name: <slug>
description: <one sentence · when to use · what it produces>
version: "0.1"
lastUpdated: YYYY-MM-DD

inspiredBy:
  - source: "<source>"
    note: "<what was borrowed>"

designPrinciples:
  - "<1-3 atomic principles>"

usedBy: []  # filled by /learn-review or manually

dependencies:
  - path: "<key file>"
    why: "<why it's needed>"
---

# <Skill Title>

## When to Use
- <trigger condition 1>
- <trigger condition 2>

## Input (Required / Optional)
- Required: <>
- Optional: <>

## Processing Flow
### Step 1 · ...
### Step 2 · ...

## Output Format
```
<model output structure>
```

## Anti-Patterns · Don't Do
- ❌ ...

## Prohibited
- ...
```

### Step 4 · Write Eval Cases (Required)

Per Principle 2 (Eval-First) · **no merge without eval**:

Create `tests/skills/<slug>.yaml`:

```yaml
---
skill: <slug>
skill_version: "0.1"
last_run: null
last_pass_rate: null
total_cases: 3
---

cases:
  - id: "golden-1"
    name: "Typical Input"
    input: |
      <real example 1 input>
    rubric:
      must_have: [...]
      must_not: [...]
      should_have: [...]
    expect:
      <specific expectation>

  - id: "golden-2"
    ...

  - id: "edge-1"
    name: "Edge Case"
    ...
```

At least 3 cases · 2 golden + 1 edge.

### Step 5 · Update Asset Traceability

- **Dashboard flywheel-config.ts** · Add new skill to the `built` list of its corresponding layer
- **Relevant agent equips**: If an agent needs this skill, update agent frontmatter

### Step 6 · Run First Eval (Required)

```
/eval <slug>
```

**Rules**:
- pass rate < 75% · do not merge · fix skill first
- pass rate 100% · warn "rubric may be too lenient" · add 1-2 picky should_have items

### Step 7 · Commit + Report

```
✅ /skill-create <slug> complete

📁 Files created:
  - .claude/skills/<slug>/SKILL.md
  - tests/skills/<slug>.yaml

📝 First eval: pass@1 = N/N = X%

🔗 Relationships:
  - equipped by: @<agent-name> (if applicable)
  - depends on: <key dependency file>
  - added to flywheel layer: <layer-id>

🎯 Next steps:
  - Use 2-3 times in practice · verify real fit (distinguish from cargo-cult)
  - If awkward to use · iterate to v0.2 within 1 week
  - If never used · run /skill-review after 1 month to decide deprecation
```

## Anti-Patterns

- ❌ Skipping the "5 qualification questions" (creates skill graveyard)
- ❌ Skipping eval (unverified skill = waste)
- ❌ Creating 3 skills at once (quality dilutes · one at a time)
- ❌ Directly copying Operating Framework skills (violates reference library policy + 4.7 refactoring 5 questions)
- ❌ Overly generic names ("helper" / "utils") · new skills must be specific

## References

- SKILL schema: `docs/agent-skill-schema.md`
- Eval schema: `tests/skills/README.md`
- Principle 1 (Agent-First · check existing coverage) · Principle 2 (Eval-First) · Principle 7 (Tool-Oriented · independent versioning)
- Learning upgrade path: `docs/learnings/candidates/` → `/learn-review` → `/skill-create`

## Collaboration with Other Commands

- `/learn` → candidate · `/learn-review` judges skill-seed · `/skill-create --from-candidate`
- `/skill-create` → new skill · `/eval` runs rubric · formal use after passing
- `/orchestrate` may call new skill · so record equipped-by

## Solo Founder Skill Health Metrics

- **Total skills < 15**: too many → review which are never used
- **First eval pass ≥ 75%**: merge baseline
- **Average monthly usage ≥ 2 times**: below this indicates design problem
- **Delete 1-2 per quarter**: archive unhealthy ones to `deprecated/`