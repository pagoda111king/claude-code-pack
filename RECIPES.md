# Solo Founder OS · Recipes

Five real workflows, stitched from agents · skills · commands · hooks. These are the sequences I actually run — not theoretical examples.

Each recipe is **what fires when**, not **how to use Claude Code**. Assume you've installed the pack.

---

## Recipe 1 · New product idea → ship-or-skip in 7 days

**Trigger**: "I have an idea for X — should I build it?"
**Time**: 1-2 hours of evaluation · 1 week of MVP if green

### Sequence
1. **Day 0 · Score the idea** — `/eval` fires `idea-eval` skill · 6-dim score (pain urgency · willingness-to-pay · deliverability · differentiation · reusability · channel fit)
   - ≥ 22 → green · 15-21 → yellow → think harder · < 15 → 🛑 skip
2. **Day 0 · Search prior art** — invoke `prior-art-search` skill · find ≥ 1k-star repos solving same problem
   - Found one? → fork-and-extend · skipped reinventing
   - Nothing? → caution: market may be dead
3. **Day 1 · Plan the smallest slice** — `/plan` fires `@planner` · outputs phased plan with validation gates
4. **Day 1-5 · Build MVP** — main thread implements · `@code-reviewer` before any merge
5. **Day 6 · Ship-readiness audit** — `ship-checklist` skill · catches what you forgot
6. **Day 7 · Soft launch to 5 real users** — `soft-launch` skill · script + tracker

### Pitfalls
- Skipping `/eval` because you're "sure" → 80% of skipped evals come back as red ideas
- Skipping `prior-art-search` → reinvent the wheel for 3 weeks
- `@planner` output too granular · ignore it · build a real spike first

---

## Recipe 2 · Discovery call → signed contract

**Trigger**: Cold outreach reply, friend referral, inbound DM
**Time**: 60 min call → 24h proposal → 1-3 days close

### Sequence
1. **Pre-call · Run discovery script** — `lead-intake` skill · structured 8-question script · scores lead 1-10 by urgency · budget · authority · fit
2. **Post-call · Validate the lead** — `@validator` agent · cold reads the call notes · flags "did the customer actually say they'd pay $X" vs "you assumed"
3. **Day 1 · Generate proposal** — `proposal-gen` skill · turns interview notes into SOW + pricing draft · uses `docs/templates/SOW.md` template
4. **Day 1-2 · Founder review** — read proposal · check claims you didn't make · adjust pricing
5. **Day 3+ · Send + follow-up** — pipeline tracked in `docs/pipeline.md` · markdown CRM

### Pitfalls
- Skipping `@validator` → proposals based on misremembered call details · 40% close → 10% close
- `proposal-gen` over-promising → review every line · cut anything you can't deliver in commit period
- No `docs/pipeline.md` follow-up tracking → leads die in inbox

---

## Recipe 3 · Project delivery → 5 reusable content pieces

**Trigger**: Just delivered a paid project · client paid · you're tired
**Time**: 2 hours of structured extraction (not on the same day · sleep first)

### Sequence
1. **Run ship-checklist on the delivery** — confirms tests pass, docs current, post-mortem done
2. **Generate case study skeleton** — `case-study-gen` skill · turns project artifacts (problem statement · architecture decisions · measured outcome) into structured case study
3. **Pull 5 content angles** — same skill outputs:
   - Twitter thread (technical lessons)
   - LinkedIn post (business outcome framing)
   - Blog post draft (long-form for SEO)
   - Case study PDF (for sales deck)
   - Internal `docs/learnings/<slug>.md` (for future-you)
4. **Brand voice pass** — `@marketing` agent · rewrites in your voice · using `docs/system-memory.md` brand guide
5. **Schedule release** — `release-window` skill · picks low-risk publish times · `content-blitz` skill batches across platforms

### Pitfalls
- Doing this same-day-as-delivery → exhausted founder → bad content
- Skipping brand voice pass → AI-generated tone leaks into your channels
- Publishing all 5 same day → looks like spam · spread over 2 weeks

---

## Recipe 4 · Customer bug report → patched & released

**Trigger**: User emails / WeChats with "X is broken"
**Time**: Same-day for critical · 2-3 days for non-critical

### Sequence
1. **Triage the inbound** — `@customer-support` agent · classifies (bug · feature request · misuse · spam) · drafts acknowledgment reply
2. **Reproduce locally** — main thread · cite the customer's environment from the message
3. **Write the fix** — main thread codes · narrow scope · don't refactor unrelated stuff (this is a bug fix not a redesign)
4. **Pre-merge review** — `@code-reviewer` · catches regressions · checks tests cover the bug
5. **Security check if user-facing** — `@security-reviewer` · only if fix touches auth · payment · data export
6. **Pre-release audit** — `ship-checklist` · CHANGELOG entry · version bump · rollback plan
7. **Pick a window** — `release-window` · avoid Friday afternoon · Asia-EU overlap if global users
8. **Ship & notify** — release · email customer · close ticket

### Pitfalls
- Skipping `@code-reviewer` because "it's just one line" → one-line bugs ship the most regressions
- Refactoring during a bug fix → scope explodes · ship slips · customer waits
- Friday afternoon release with no rollback plan → weekend on call

---

## Recipe 5 · Multi-Claude collaboration without collisions

**Trigger**: Running 2-3 Claude Code sessions in parallel (e.g., one builds frontend, one builds backend)
**Time**: Continuous discipline · 0 setup once you internalize the pattern

### Sequence
1. **Before splitting work** — define cross-module interfaces in `docs/contracts/<slug>.md`
   - What does the API endpoint look like (request schema · response schema · error codes)?
   - What can frontend session change · what's locked?
   - Same for backend
2. **Each session reads contracts on startup** — SessionStart hook displays contract count · CLAUDE.md mandates 30-second contract scan before editing cross-module files
3. **Cross-session communication = files** — never assume "the other Claude knows" · the only shared channel is files
   - Contract changes → bump version · update `lastUpdated` · 1-line memo in `docs/sessions/`
   - Started a dev server → note port + ownership in session memo
4. **Heuristic before any change**:
   > "Will another Claude pause for 1 second seeing this change?" · Yes → leave a contract / memo · No → just do it
5. **Real handoff between sessions** — `/save-session` (only if 3-month-future-you would re-read it) → `/resume-session` next time

### Pitfalls
- Two sessions edit the same file out of sync → one overwrites the other · lost work
- "Quick fix" without checking contracts → breaks the other session's assumed schema
- Over-using `/save-session` (every 2 hours) → noise · the contract pattern + auto-memory already cover most of this

---

## How these compound

The recipes share infrastructure:
- `docs/system-memory.md` — read by every skill · brand voice · pricing tiers · founder background
- `docs/pipeline.md` — markdown CRM · written to by `lead-intake` · `proposal-gen` · read by `@customer-support`
- `docs/sessions/` — handoff memos for multi-Claude · also for future-you
- `docs/contracts/` — cross-module interface specs
- `docs/learnings/` — methodology / rules / anti-patterns captured via `/learn`

Each recipe writes to one of these. After 6 months, your `docs/` directory becomes the operational memory of your 1-person company. That's the whole point — it's an OS, not a toolkit.

---

## When NOT to use these recipes

- 🛑 You're a 50-person team with shared infra · these recipes assume solo ownership of every file
- 🛑 You're learning Claude Code for the first time · run plain Claude Code for a week first · then come back · the recipes will make sense
- 🛑 You're hunting for a magic bullet · these are workflows · not silver bullets · still requires you to think
