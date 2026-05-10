---
date: 2026-04-19
time: "23:42"
session_id: 2026-04-19-2342-saas-onboarding-v2
topic: saas-app onboarding flow v2 split + frontend/backend contract bump
status: completed
tags: [feature, contract, multi-claude]
---

# saas-app · onboarding flow v2 split

## Topic
Split single-step `/onboarding/complete` into 3-step flow (start → verify-email → profile-complete) to reduce drop-off after seeing landing-page friction. Both frontend and backend Claude sessions worked in parallel today via the contract pattern.

## Completed
- ✅ Backend session: implemented 3 new endpoints in `services/api/src/routes/onboarding.ts` · all 24 unit tests pass
- ✅ Frontend session: rebuilt `apps/web/app/onboarding/` with 3-step state machine · LocalStorage persistence for partial state
- ✅ Updated `docs/contracts/onboarding-api.md` to v2.0 · BREAKING change marked
- ✅ Verified rate limiting (5/min per IP) works · tested with curl loop
- ✅ Migration script ran on staging · 0 failures · existing in-flight sessions auto-completed

## Decisions
- **Decision**: keep email verification step (vs skip-and-trust) · Reason: 14% of last-month signups had typoed emails · welcome email bouncing
- **Decision**: 24h session TTL (vs 7-day) · Reason: forces decisive completion · drops aren't recoverable anyway
- **Decision**: rate limit at 5/min per IP not per email · Reason: easier to implement · captures 90% of abuse pattern · revisit if real abuse seen

## Open issues
- ⚠️ Frontend animation between steps feels janky on mobile Safari · works fine Chrome/Firefox · not blocking but UX degraded
- ⚠️ No analytics events fired yet (PostHog setup deferred) · we'll deploy blind for first 48h then add events
- ⚠️ The `referrerId` validation is currently client-side only · backend treats it as opaque string · revisit when we add referral payouts

## Next startup needs
- Read `docs/contracts/onboarding-api.md` (v2.0)
- Read `apps/web/app/onboarding/state-machine.ts` to understand step transitions
- If working on analytics: PostHog account already created · keys in `.env.example` · needs DSN
- If working on mobile Safari fix: reproduce on iPhone 13 sim · likely `transform-gpu` workaround needed

## Lessons learned (worth `/learn` candidates)
- Multi-Claude contract pattern saved ~3h of integration debugging (vs me trying to coordinate verbally between sessions)
- `git diff docs/contracts/` after each session is the cheapest sanity check
- Rate limit testing with curl loop should be a `ship-checklist` item (currently isn't)

---

## Multi-Claude collaboration notes for next time

Both sessions started at 9am · ran in parallel until 11:30. Coordination via:
1. Read shared contract first (both did this)
2. Each session's first commit referenced contract version (both did this)
3. Wrote 2 short memos to `docs/sessions/` mid-day to sync state (only frontend session did this · backend missed the discipline)

**Improvement for next time**: bake "write 1-line session memo before any cross-module commit" into ship-checklist. Currently relies on operator memory.
