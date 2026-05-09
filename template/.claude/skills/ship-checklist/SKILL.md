---
name: ship-checklist
description: Pre-launch checklist. Use before shipping a product or feature to external users. Solo Founder edition (not enterprise), trimmed to under 20 items to prevent real blockers that could sink you.
version: "1.0"
lastUpdated: "2026-04-24"

inspiredBy:
  - source: "the methodology source's solo-version ship list"
    note: "Not a simplified enterprise checklist, but redesigned from scratch: only items that can actually cause a crash"
  - source: "Claude Code official /security-review"
    note: "Security items kept at top priority"

designPrinciples:
  - "≤20 items: more than that and nobody reads it"
  - "Solo Founder context: skip enterprise items (multi-env, review gate, approval chain)"
  - "Aim for not crashing, not perfection: real blockers first, nice-to-haves later"

usedBy:
  - planner
  - code-reviewer

dependencies: []
---

# Pre-Launch Checklist · Solo Founder Edition

## When to Use

- Product MVP ready for first user trials
- Before a major feature release
- Anything that goes in front of customers

## How to Use

Claude runs through each item and outputs ✅/⚠️/❌ + one line of evidence. Final verdict: **GO / NO-GO**.

---

## Code & Security (7 items)

1. ⬜ **code-reviewer ran**, no CRITICAL/HIGH unresolved or tracked
2. ⬜ **No hardcoded secrets**: grepped for `api_key|password|token|secret`, no leaks
3. ⬜ **Dependency scan**: `npm audit` / `pip audit` shows no high/critical vulnerabilities
4. ⬜ **.env not in git**: `.env` in `.gitignore`, with `.env.example` template
5. ⬜ **Errors don't leak internals**: production error messages contain no stack/SQL/path details
6. ⬜ **Production DB backup**: at least one automated backup mechanism
7. ⬜ **HTTPS**: all external interfaces enforce TLS

## Functionality & UX (5 items)

8. ⬜ **Core happy path manually tested 3 times**: once per different browser/device
9. ⬜ **3 edge case tests**: empty input / oversized input / disconnect-reconnect
10. ⬜ **Loading/Error states**: every async operation has UI fallback, no frozen white screen
11. ⬜ **Mobile usable**: if not a desktop tool, run through on iPhone
12. ⬜ **Destructive actions have confirmation**: delete/charge/send must require second confirmation

## Data & Compliance (3 items)

13. ⬜ **Privacy policy + Terms of Service**: required if collecting user data (open-source templates OK)
14. ⬜ **ICP filing** (if deployed in China + public-facing): unregistered sites get pulled
15. ⬜ **User data export/delete flow**: meets basic data rights expectations

## Payments (if charging, 4 items)

16. ⬜ **Payment full test**: success / failure / cancel / duplicate submission each tested once
17. ⬜ **Refund/cancel path**: user can self-serve or has a clear channel
18. ⬜ **Invoice/receipt**: both business and individual options available
19. ⬜ **Webhook idempotency**: Stripe/WeChat Pay callbacks won't double-credit

## Operations & Marketing (4 items)

20. ⬜ **Error monitoring**: at least Sentry or self-hosted logging + alerting
21. ⬜ **Uptime monitoring**: UptimeRobot / BetterStack or similar
22. ⬜ **Customer support channel**: at least one of WeChat blog / email / WeChat group, and email must be reachable
23. ⬜ **Launch materials**: landing page + demo GIF/video + social feed copy + WeChat blog post (can summon @marketing)

---

## Exemptions (explicitly skippable)

If the product is a **pure internal tool / single-client custom build**:

- Can skip: 13, 14, 21 (case-by-case)
- Cannot skip: 1-6, 8-12, 16-19 (if payments involved)

If it's a **free open-source tool**:

- Can skip: 13, 14, 16-19
- Cannot skip: 1-12, 20, 22, 23

**Skipping requires a written reason**, not default skip.

---

## Output Format

```markdown
# Pre-Launch Check: [Product/Feature Name]
Date: YYYY-MM-DD

## Item-by-Item Check

### Code & Security
1. code-reviewer ran —— ✅ Last run 2026-04-25, no CRITICAL, HIGH fixed
2. No hardcoded secrets —— ✅ Grepped, only .env.example has placeholders
3. Dependency scan —— ⚠️ 1 medium vulnerability (lodash), doesn't affect main flow, fix next release
4. ...

### Functionality & UX
8. Core happy path —— ❌ Only tested on Chrome, Safari not tested
...

## Status Summary

| Category | Total | ✅ | ⚠️ | ❌ | Skipped |
|---|---|---|---|---|---|
| Code & Security | 7 | 6 | 1 | 0 | 0 |
| ...

## Verdict

⚠️ **NO-GO · 2 issues to fix**:
1. #8 Safari not tested —— estimated 30 min
2. #20 Error monitoring not configured —— estimated 1 hour

Re-run this checklist after fixes. ETA: tonight.
```

## GO Criteria

- All CRITICAL items (1, 2, 4, 12, 16, 17) must be ✅
- No more than 3 ❌ on other items, each with a clear "why it's OK to ship first" reason
- Every ⚠️ has a ticket / next-release plan

## Don'ts

- Don't fake ✅ to hit a deadline (your code-reviewer sub-agent will catch it)
- Don't replace items with "I'll fix it later" — either write a ticket or give an explicit skip reason
- Don't let perfectionism block shipping — Solo Founders win through iteration, not first-version perfection