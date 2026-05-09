# Solo Founder OS · Claude Code Operating Manual

> Drop this file at `~/.claude/CLAUDE.md` — Claude Code auto-loads it every session.
> **Edit the placeholders below** to make it yours · then forget about it.

---

## 1 · You (the operator) · CUSTOMIZE THIS

- **Role**: solo founder / indie hacker / freelancer / consultant
- **Coding level**: have basics · use Claude Code as force multiplier · architecture decisions need tradeoffs explained · don't blindly write
- **Workspace**: Claude Code (deep terminal tasks) + Cursor (in-IDE quick edits)
- **Company stage**: pre-revenue / early revenue / scaling — pick one
- **Communication**: Chinese-leaning / English / mixed — pick yours
- **Code conventions**: comments in [language] · variables in English

## 2 · Resources & boundaries · CUSTOMIZE THIS

- Runway: ___ months
- Customer channels: [your existing reachable audience]
- Legal entity: [individual / sole proprietor / LLC / etc.]
- API budget: $___ / month max

## 3 · Collaboration rules (don't change · these are battle-tested)

1. **Understand before doing**: vague request → ask 1-2 sharp questions · don't guess
2. **Brevity over flourish**: no over-engineering · no decorative comments · no irrelevant error handling / compatibility layers
3. **Spell out tradeoffs**: tech proposals must call out main tradeoff (time / cost / maintainability)
4. **Cost-aware**: routine = Haiku · main task = Sonnet · strategy = Opus
5. **Major decisions**: architecture · tech debt · client commitments → log to `docs/decisions/YYYYMMDD-<slug>.md`
6. **Don't suggest revenue plays unsolicited** · but when asked · be direct (no hedging)

## 4 · Task routing (who does what)

### Product line
| Task | Tool |
|---|---|
| Long session feature (>1h) · scripts · terminal | Claude Code main thread |
| In-IDE CSS / small fn / autocomplete | Cursor |
| Idea evaluation (build or skip) | skill: `idea-eval` |
| Feature / product implementation plan | `@planner` |
| Code review (pre-merge / pre-release) | `@code-reviewer` |
| Pre-release full audit | skill: `ship-checklist` |
| Batch content production | skill: `content-blitz` |

### Sales / revenue line
| Task | Tool |
|---|---|
| Discovery call script + lead scoring | skill: `lead-intake` |
| Interview → client proposal | skill: `proposal-gen` |
| Standard contract / SOW | template `docs/templates/SOW.md` |
| Post-delivery → 5 reusable content pieces | skill: `case-study-gen` |
| Pipeline status / follow-up cadence | `docs/pipeline.md` |
| Customer inquiries · post-sales · feedback | `@customer-support` |
| Outbound content | `@marketing` |

### Infra
- `docs/system-memory.md` — brand voice / pricing tiers / lead weights / founder background · all skills auto-read
- `docs/handbook.md` — agent / skill triggers + walkthroughs
- `scripts/lib/` — reusable libs

### Session management commands
| Command | When to use | When NOT |
|---|---|---|
| `/save-session` | **Real handoffs**: project delivery / machine switch / >1 day pause / handing off to someone | Every-2-hour habit · "almost done" · "context might be full" anxiety |
| `/resume-session` | New session after ≥1 day gap · need full picture rebuild | Few-hour pause (SessionStart hook is enough) |
| `/learn` | Repeated correction / non-obvious confirmation / assumption overturned | Every conversation · 1-3 entries enough |

**Rule**: Before `/save-session` ask **"Will I look at this memo in 3 months?"** Yes → save · No → skip.

## 5 · Multi-Claude collaboration discipline (if running parallel sessions)

⚠️ **Core fact**: Multiple sessions in parallel · they **can't see each other's chat** · only files.

### Mandatory startup scan (30 seconds)

In order:
1. `CLAUDE.md` (this file · auto-loaded)
2. `docs/contracts/*.md` — **cross-module interface contracts** · what you can / can't change
3. `docs/sessions/` latest 1-2 memos — what other sessions are doing
4. SessionStart hook board (auto)

### Before changing files

| Situation | Required action |
|---|---|
| Editing "looks cross-module" file | `grep -l "<filename>" docs/contracts/` for contracts |
| Has contract | Read · obey · don't exceed "may change" list |
| No contract but **change affects others** | Draft new contract `docs/contracts/<slug>.md` first |
| Modified existing contract | Bump version · update `lastUpdated` · 1-line memo in `docs/sessions/` |

### Anti-patterns (banned)
- ❌ Modify cross-module file without checking contracts/
- ❌ "May change" list doesn't include your target · you extend it anyway
- ❌ Multiple sessions modify same file out of sync
- ❌ Started a dev server · didn't note it in session memo

**Rule of thumb**: "Will another Claude pause for 1 second seeing my change?" Yes → leave contract / memo · No → just do it.

## 6 · Directory map (semantic)

```
.claude/                — Claude Code config (this pack)
customers/              — One folder per customer
products/               — One folder per self-built product
docs/
  ├── strategy.md       — Top-level direction
  ├── decisions/        — Major decisions log
  ├── learnings/        — Methodology / rules / anti-patterns
  ├── sessions/         — /save-session memos (real handoffs only)
  ├── contracts/        — Cross-module interface specs
  ├── knowledge/        — raw / wiki / deck three-layer model
  └── pipeline.md       — Sales pipeline (markdown CRM)
scripts/
  ├── hooks/            — Claude Code hooks (this pack)
  └── lib/              — Reusable libs
```

## 7 · OSS-First product methodology (battle-tested)

For any new product / direction:

1. **Search GitHub** for ≥1k-star projects in same domain — list 5-10 candidates
2. **Run 1-2** with real data · 3 real cases minimum · log startup time / data source stability / output quality
3. **Position your value layer**: what to use as-is / what to modify / what they can't do but customer needs
4. **Fork + extend in outer layer** · don't fork-and-rewrite · don't reinvent the wheel
5. **Loop**: weekly customer demo → tweak outer layer → vendor upgrade = free upgrade

**Heuristic**: "Is there a ≥1k-star same-domain repo?"
- Yes → fork + extend · stand on giants
- No → caution (market may have died · or wrong direction) · think hard before building

## 8 · API cost discipline (must)

⚠️ **All paid APIs must have explicit founder approval before real call** · API quota is scarce.

Pattern: **dry-run shows cost estimate + full prompt → founder reviews → explicit `--approve` flag → real call**.

| Tool | Path | Usage |
|---|---|---|
| `gen-image` · image gen | `scripts/gen-image.js` | Default preview · `--approve` to run · log `.gen-image-log.jsonl` |

When agents / skills call paid APIs:
1. Run preview mode (no API call · only estimate)
2. **Paste preview to chat** for founder
3. Wait for explicit "approve" / "yes" / "go"
4. Only then add `--approve` and re-run

**Banned**: silently presetting `--approve` · "should be fine" hand-wave · hiding real cost behind defaults.

## 9 · State file decay discipline (anti AI-reads-stale-info)

⚠️ **Before creating any "state" semantic file** · classify into 4 types (decision / rolling-state / cache / snapshot) · see `docs/state-file-policy.md`.

**Rolling-state mandatory**:
1. Frontmatter must have `staleAfterDays` + `nextReviewBy` + `ai_read_hint`
2. AI reading expired rolling-state must **proactively warn founder** · don't pretend it's current
3. No TTL = invisible landmine · stale info → bad decisions

## 10 · Banned actions

- Don't write API keys / secrets / customer privacy into any git-tracked file
- Without explicit approval · don't execute: `rm -rf` · `git push --force` · prod DB changes · external email / social posting
- Estimate paid API cost before calling · tell founder
- Never `--no-verify` / `--no-gpg-sign` unless explicitly asked

---

## Version

- v1.0 · {YOUR DATE} · forked from Solo Founder OS · customized
- Edit version line each major change so future-you can diff

---

**This file replaces a 100-page company handbook for a 1-person company. It auto-loads every Claude Code session — no need to re-explain how you operate.**
