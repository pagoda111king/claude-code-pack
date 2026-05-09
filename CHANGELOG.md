# Changelog

All notable changes documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org).

---

## [1.0.0] - 2026-05-09

Initial public release. Distilled from 6 months of running a 1-person company with Claude Code as the daily driver.

**Pack contents:**
- 11 specialized agents (architect, planner, code-reviewer, security-reviewer, test-engineer, frontend-expert, backend-expert, doc-writer, customer-support, marketing, validator)
- 10 auto-invokable workflow skills (idea-eval, lead-intake, proposal-gen, case-study-gen, prior-art-search, eval-refine, ship-checklist, release-window, soft-launch, content-blitz)
- 10 slash commands (/plan, /eval, /save-session, /resume-session, /learn, /learn-review, /orchestrate, /loop, /skill-create, /cost)
- 4 production hooks (session-start state board, pre-bash safety check, pre-compact reminder, stop-learning reminder)
- Universal CLAUDE.md operating-manual template
- Sanitized — zero customer info, business secrets, API keys

**Documentation:**
- README.md — overview + install + pricing
- docs/INSTALL.md — 60-second install + advanced setup
- LICENSE — MIT for code · CC-BY-NC for docs/agents/skills
- CONTRIBUTING.md — issues / PRs / license clarity

---

## Roadmap

Honest roadmap — committed only to what I'd genuinely ship.

### v1.1 (target: 2026 Q3)
- 4 additional skills based on early-buyer feedback
- 30 use-case walkthroughs (which agent to fire when, with real examples)
- Plugin marketplace manifest (`/plugin install` one-liner instead of `cp -r`)

### v1.2 (target: 2026 Q4)
- Per-stack CLAUDE.md overlays (Next.js / Rails / Django / FastAPI)
- Integration recipes (Stripe webhooks · Resend mail · Supabase auth)

### Considering (no committed date)
- Bilingual (Chinese-English) — gauging Chinese-market demand first
- Per-stack agent variants — depends on v1.2 reception

---

## Update policy

- Buyers get free updates for 12 months from purchase date
- Patch versions are pushed to existing buyers automatically
- Major version notifications via email
