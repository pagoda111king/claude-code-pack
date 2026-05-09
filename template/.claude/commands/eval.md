---
description: Run evaluation suite for skills/agents (v0.2 adds agent mode) · 4.7 native in-session runner · No API key required · pass@1 metric · Results written to tests/{skills|agents}/results/
---

# /eval

4.7 native evaluation harness · completes the full "load cases → simulate → grade by rubric → produce report" pipeline within the current session.

**v0.2 (2026-04-25)** · adds agent mode (previously only supported skill).

## Usage

### Skill Mode (v0.1)
- `/eval <skill-name>` · run a single skill (e.g., `/eval idea-eval`)
- `/eval all-skills` · run all `tests/skills/*.yaml` (previously `all` · renamed in v0.2 for disambiguation)

### Agent Mode (v0.2 new)
- `/eval @<agent-name>` · run a single agent (e.g., `/eval @frontend-expert`)
- `/eval all-agents` · run all `tests/agents/*.yaml`

### General
- `/eval` · list all runnable targets (skills + agents)

## Differences · skill vs agent eval

| Dimension | skill eval | agent eval |
|---|---|---|
| YAML location | `tests/skills/<name>.yaml` | `tests/agents/<name>.yaml` |
| Schema | `input` structured | `scenario` natural language + `pre_state` |
| Mode field | none | present (before/during/after) · different rubric per mode |
| Expectations | classification / score | mode_invoked / tools_used / output_sections |
| Reference | `tests/skills/README.md` | `tests/agents/README.md` |

## Execution Flow

### Step 1 · Parse Arguments

- No arguments → error · list all `.yaml` files under `tests/skills/`
- `all` → run all skills sequentially
- Specific slug → look up `tests/skills/<slug>.yaml` · error if not found

### Step 2 · For Each Target (skill or agent)

**2a · Read Data**:
- **Skill**: `tests/skills/<slug>.yaml` + `.claude/skills/<slug>/SKILL.md`
- **Agent**: `tests/agents/<slug>.yaml` + `.claude/agents/<slug>.md` + `docs/ecc-absorption/essence/agents/<slug>.md`
- Must read essence (principle 8 reinforced in v1.2) · cannot run eval without essence (must create essence first)

**2b · For Each Case, Run "Simulate + Self-Grade"**:

```
FOR EACH case IN cases:
  1. Run internally "as skill executor":
     - Use SKILL.md as system prompt
     - Use case.input as user input
     - Generate the output the skill should produce

  2. Switch to "as grader":
     - Read case.rubric (must_have / must_not / should_have)
     - Check each item against step 1 output
     - Check against case.expect (classification / score_range / other)
     - Each must_have item: PASS / FAIL + one-line reason
     - Each must_not item: if triggered → FAIL
     - Each should_have item: PASS / FAIL (doesn't affect final verdict, counts toward quality score)

  3. Verdict for case:
     - All must_have PASS + no must_not triggered + expect matches → PASS
     - Any must_have FAIL or must_not triggered or expect mismatch → FAIL
```

**Key anti-bias techniques** (prevent self-grading from being too lenient):
- When generating output in Step 1, **do not look at rubric** (act as if you don't know the test points)
- When grading in Step 2, quote rubric verbatim · use "counterfactual questions" for self-reflection:
  - "If this output were wrong, where would it most likely be wrong?"
  - "If someone else reviewed this output, what issues would they find?"
- For cases with explicit `expect.classification`, **give verdict independently first · then compare to expect** (don't look at expect beforehand to avoid anchoring)

**2c · Aggregate Data for This Skill**:
- `total_cases` / `passed` / `pass@1 = passed/total`
- Group by tag (golden / edge / regression) and report separately

### Step 3 · Write Report

Path: `tests/skills/results/YYYY-MM-DD-<slug>.md`

If already run today, append HHmm suffix: `YYYY-MM-DD-HHmm-<slug>.md`

Template:

```markdown
---
date: YYYY-MM-DD
time: "HH:mm"
skill: <slug>
skill_version: <version from SKILL.md>
run_duration_minutes: N
---

# Eval Report · <skill>

## Summary

- **Pass Rate (pass@1)**: X/Y = Z%
- **Golden**: a/b
- **Edge**: c/d
- **Regression**: e/f

## Per-Case Details

### ✅ PASS · <case-id> · <case-name>

**Input** (omitted, see yaml)

**My Output** (simulated skill run):
<full output>

**Rubric Assessment**:

Must Have:
- ✅ "<checkpoint 1>" · reason
- ✅ "<checkpoint 2>" · reason
...

Must Not:
- ✅ Not triggered "<forbidden item 1>"

Should Have:
- ✅ "<bonus item 1>" · reason
- ❌ "<bonus item 2>" · missing but doesn't affect PASS

Expect Comparison:
- classification: 🟢 vs expect 🟢 ✅
- score_range: 26 vs [22,28] ✅

### ❌ FAIL · <case-id> · <case-name>

(same structure, mark which item FAIL)

## Issues Found

(summarize real problems exposed by this eval · suggested improvements)

- Issue 1 · X not handled in edge case
- Issue 2 · suggest adding Y to SKILL.md

## Next Steps

- [ ] Modify SKILL.md ___
- [ ] Add new regression case to lock in ___
- [ ] Record findings in docs/learnings/
```

### Step 4 · Update YAML `last_run` Field

Update frontmatter in `tests/skills/<slug>.yaml`:
- `last_run: YYYY-MM-DD`
- `last_pass_rate: 0.75` (decimal)

### Step 5 · Notify Founder

Output 3 sections:

```
✅ /eval <skill> complete

📊 Pass Rate: 3/4 = 75%  (pass@1)
  - Golden: 2/2 ✅
  - Edge: 1/2 ⚠️

📁 Report: tests/skills/results/2026-04-24-<skill>.md

🔍 1 real issue found:
  - In edge case, skill didn't follow "rule for unanswered question 5" from SKILL.md
    Suggest editing .claude/skills/<slug>/SKILL.md to strengthen the example in block L61

Want me to fix it now? Or review the full report first?
```

## Anti-Patterns (Don't Do)

- ❌ "Peeking" at rubric or expect when generating output (over-fitting)
- ❌ Passing all cases to "make the numbers look good" (cargo-cult · honesty matters more)
- ❌ Not reporting real skill issues (the value of eval is exposing problems)
- ❌ Running all in one session explosion · if many skills, remind founder to batch

## Key Constraints

- **/eval must be honest**: biggest risk of self-grading is "giving myself high scores." When unsure, **prefer FAIL and manually verify**
- **Every /eval may expose skill improvements** · this is good, not bad
- **Must write eval before creating a new skill** (Eval-First principle) · no merge without YAML

## 4.7 Optimizations

- Original Operating Framework requires API key + external script · we complete in-session
- Original runs all skills serially · we can parallelize in one session (1M context fits)
- Single run 3-5 min/skill · Original takes 10-30 min/skill

## References

- Essence: `docs/ecc-absorption/essence/9-evaluation-harness.md`
- Schema: `tests/skills/README.md`
- Principle: `docs/ecc-absorption/principles.md` Principle 2 · Eval-First