# Solo Founder OS · Claude Code Configuration Pack

> **The Claude Code config a real solo founder uses every day to run a 1-person company.**
>
> 11 agents · 10 skills · 10 commands · 4 hooks · 6 months of real workflow.
> Drop into `~/.claude/` · ready in 60 seconds.

![License](https://img.shields.io/badge/license-MIT%20%2B%20CC--BY--NC-blue)
![Agents](https://img.shields.io/badge/agents-11-blueviolet)
![Skills](https://img.shields.io/badge/skills-10-success)
![Commands](https://img.shields.io/badge/commands-10-yellow)
![Hooks](https://img.shields.io/badge/hooks-4-orange)
![Claude Code](https://img.shields.io/badge/Claude%20Code-ready-D9A56D)

---

## What you get

A complete **operating system for solo founders using Claude Code**. Not another `awesome-claude-code` link list — a working configuration that's been refining itself for 6 months while running real revenue products.

### 11 Specialized Agents
| Agent | What it does |
|---|---|
| `architect` | Tech stack decisions · data flow · API contracts · no code |
| `planner` | Idea → executable phased plan with validation gates |
| `code-reviewer` | Security · quality · performance check before merge |
| `security-reviewer` | Pre-deploy security audit |
| `test-engineer` | Test plan + coverage gap analysis |
| `frontend-expert` | UI / UX / Tailwind / Next.js specialist |
| `backend-expert` | API / DB / queue / observability |
| `doc-writer` | README / changelog / customer docs |
| `customer-support` | Triage messages · draft replies |
| `marketing` | Content · SEO · case studies · proposals |
| `validator` | Cross-check claims · catch hallucinations |

### 10 Workflow Skills
| Skill | When to use |
|---|---|
| `idea-eval` | New product idea? Score on 6 dims · 22+ = green light |
| `lead-intake` | Discovery call → score the lead 1-10 |
| `proposal-gen` | Lead → SOW + pricing draft |
| `case-study-gen` | Delivered project → 5 reusable content pieces |
| `prior-art-search` | Before building · OSS-First search same problem |
| `eval-refine` | Output not good enough? Eval-driven iteration |
| `ship-checklist` | Pre-release safety net · what could break |
| `release-window` | When NOT to ship (high-risk windows) |
| `soft-launch` | Test with 5 real users before public |
| `content-blitz` | One topic → 5 platforms in 2 hours |

### 10 Slash Commands
| Command | Purpose |
|---|---|
| `/plan` | Spawn planner · output executable plan |
| `/eval` | Score idea on 6 dims |
| `/save-session` | Save handoff memo (real handoffs only) |
| `/resume-session` | Reload last session context |
| `/learn` | Capture method/rule/anti-pattern |
| `/learn-review` | Review learning candidates |
| `/orchestrate` | Multi-agent task coordination |
| `/loop` | Auto-iterate task with self-pacing |
| `/skill-create` | Create new reusable skill |
| `/cost` | Today's API spend snapshot |

### 4 Production Hooks
| Hook | Triggers when | Does |
|---|---|---|
| `session-start.js` | Session opens | Display state board (date · last session · pipeline · assets · cost) |
| `pre-bash-safety-check.js` | Bash tool runs | Block `rm -rf /` · warn `git push --force` |
| `pre-compact-reminder.js` | Context auto-compact | Suggest /save-session if real handoff |
| `stop-learning-reminder.js` | Session ends | Conditional /save-session + /learn ping |

> 📖 **See how these pieces stitch into real workflows →** [RECIPES.md](RECIPES.md)
>
> 5 actual sequences I run: idea-to-ship in 7 days · discovery-call to signed contract · delivery to 5 reusable content pieces · bug-report to release · multi-Claude without collisions.

---

## Why this exists

After 6 months of running a 1-person company with Claude Code, I built up:
- Patterns that **avoided** wasting weeks on bad ideas
- Patterns that **kept me alive** when API costs spiked
- Patterns that **caught** hallucinated facts before they shipped to clients
- A real operating rhythm where Claude does 80% of the routine work

Most `awesome-claude-code` lists give you 50 tools to evaluate. **This gives you the working set** — what's actually battle-tested in real revenue work.

---

## What's NOT in here (deliberately)

- ❌ Toy agents that look impressive but don't get used
- ❌ "Universal" templates that don't fit any real workflow
- ❌ My private business strategy / customer list / pricing
- ❌ Specific to one stack (works with any stack you choose)

Everything personal has been stripped. Everything that ships is what I actually use.

---

## What makes this different

Most Claude Code configs are *collections of agents*. This pack ships 4 disciplines that don't exist elsewhere — built from real production pain:

### 1 · Sensitive-word scanning before every release
The pack itself ships with `scripts/sanitize.sh` patterns that strip private business terms. If you fork it for your own stack, the pattern is reusable: never push code that mentions a customer or unreleased product by mistake.

### 2 · Multi-Claude collaboration contracts
When two Claude sessions work in parallel, they can't see each other's chat — only files. The CLAUDE.md template ships a `docs/contracts/` discipline: cross-module interface specs that prevent two sessions from overwriting each other's work. Battle-tested after a real collision.

### 3 · API cost approval gates
Any agent calling a paid API must show a dry-run cost estimate first, wait for explicit `--approve`, then execute. Stops the "$200 spent in one bug-hunting session" failure mode. The discipline is encoded in CLAUDE.md and enforced by `pre-bash-safety-check.js`.

### 4 · State file decay rules (`staleAfterDays`)
Any "current state" file (pipeline status, asset board) carries a TTL. When Claude reads an expired state file, it actively warns the founder instead of pretending the data is fresh. Prevents AI from giving decisions based on a 3-month-old snapshot.

These four are the reason the pack feels different on day 7 than day 1 — they compound.

---

## Install (60 seconds)

```bash
# 1. Download
git clone https://github.com/pagoda111king/claude-code-pack.git
cd claude-code-pack

# 2. Backup your existing .claude (if any)
cp -r ~/.claude ~/.claude.bak.$(date +%s) 2>/dev/null || true

# 3. Install
cp -r template/.claude/* ~/.claude/

# 4. Customize CLAUDE.md (this is your operating manual · read it once)
$EDITOR ~/.claude/CLAUDE.md

# 5. Test it
# Open Claude Code · type "/cost" → if you see today's spend · you're live
```

See [INSTALL.md](docs/INSTALL.md) for advanced setup (per-project overlays · custom hooks · CI integration).

---

## Pricing (optional · OSS content is free)

**The full pack is open source under the licenses below.** You can read it, fork it, use it in your own work — no payment needed.

The paid tiers are for people who want a relationship, not just files:

| Tier | Price | What's actually different |
|---|---|---|
| **Starter** | $39 | Same files as the public repo · packaged zip + email when v1.1 ships |
| **Pro** ⭐ | $79 | + 30 use-case walkthroughs (when to fire which agent · real examples) + private channel for Q&A |
| **Founder** | $199 | + 1-hour 1:1 setup call · I customize CLAUDE.md for your specific stack and workflow |

> **Why $79?** Roughly 1 hour of senior dev billable time. This pack distills 40-60 hours of trial-and-error figuring out how to make Claude Code feel like a co-founder instead of a fancy autocomplete.

If you just want the config — `git clone` and you're done. If you want my time → paid tier.

---

## License

MIT for the code · CC-BY-NC for the docs/skills/agents (no resale of derivative works).

You can:
- ✅ Use in your own projects
- ✅ Modify for your team's needs
- ✅ Share modifications with your team

You can't:
- ❌ Resell as a competing product
- ❌ Strip attribution and republish

---

## FAQ

**Q: Will this work with Cursor / Aider / Continue?**
A: It's designed for Claude Code. The agent definitions and hooks use Claude Code-specific schemas. Skills and CLAUDE.md patterns transfer broadly.

**Q: I'm not a "solo founder" — does this still help?**
A: Yes if you're a solo dev / indie hacker / consultant / freelancer. Anyone running their own workflow. Less useful if you're inside a 50-person team with shared infra.

**Q: How often is it updated?**
A: Real updates as I learn things. Buyers get free updates for 12 months.

**Q: Refund policy?**
A: 14 days · no questions · email founder@example.com.

---

## About the author

Built by **[pagoda111king](https://github.com/pagoda111king)** — solo founder running a 1-person company, shipping real revenue products with Claude Code as the daily driver. This pack is what 6 months of that work compressed into a config bundle.

If something here saved you a week, that's the whole point.
