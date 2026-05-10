# 20260315 · Use Supabase over Firebase for saas-app

**Date**: 2026-03-15
**Decider**: founder (with @architect input)
**Status**: ACCEPTED · in production since 2026-03-22

---

## Context

Building saas-app · single-tenant per customer · auth + Postgres + RLS + edge functions needed. 2-3 month build · 1-person company. Scale ceiling = 50 paying customers in 12 months.

Two real options on the table:
1. **Supabase** (managed Postgres + auth + storage + functions)
2. **Firebase** (managed Firestore + auth + storage + functions)

Both fit the constraint "managed first" from CLAUDE.md.

---

## Decision

**Chose Supabase.**

---

## Reasoning

### What I optimized for

| Factor | Weight | Why |
|---|---|---|
| Solo founder time-to-MVP | 40% | I'm 1 person · weeks matter |
| Egress / migration cost if I outgrow | 25% | I've seen Firebase $$$ horror stories |
| SQL fluency vs NoSQL learning curve | 20% | I have 5y SQL · 0 Firestore experience |
| Audit / compliance posture | 10% | future-proof for B2B |
| Community / ecosystem | 5% | both fine |

### How they scored

| Factor | Supabase | Firebase |
|---|---|---|
| Time-to-MVP | ★★★★ (Postgres + RLS = 1 day learning) | ★★★ (Firestore conceptual model = 3 day learning) |
| Egress cost | ★★★★★ (it's just Postgres · pg_dump anytime) | ★★ (Firestore export complex · vendor lock-in real) |
| SQL fluency | ★★★★★ (native fit) | ★★ (NoSQL is a re-learn) |
| Audit | ★★★★ (Postgres logs straightforward) | ★★★★ (Firebase has good audit) |
| Community | ★★★★ | ★★★★★ (older · more SO answers) |
| **Total** | **4.4** | **3.0** |

---

## Tradeoffs accepted

🛑 **Supabase realtime not as battle-tested as Firestore realtime** — for chat-style features, Firestore wins. Mitigation: I'm not building chat-style features. If I ever do, evaluate Supabase realtime vs separate WebSocket service.

🛑 **Supabase auth covers fewer providers** (no native Apple Sign-In on iOS as of 2026-Q1) — fine, my customers use email + Google.

🛑 **Less mobile SDK polish** than Firebase — fine, I'm web-first for at least 12 months.

---

## What would change this decision

- If I needed to onboard 1000+ customers in 6 months → Firebase battle-tested at scale beats Supabase risk profile
- If I needed real-time chat as a core feature → Firestore wins
- If Apple Sign-In becomes a buyer requirement before Supabase ships native support → reconsider auth layer (could use Clerk on top of Supabase)

---

## Migration plan (if needed in the future)

Hopefully never. But:
1. Supabase → self-hosted Postgres: trivial (`pg_dump` · restore on managed Postgres elsewhere)
2. Supabase → Neon / RDS: 1 day work · auth layer migration is the real cost (~3-5 days)
3. Critical: avoid PostgreSQL-specific features that Supabase wraps (RLS is fine · `pg_cron` is fine · their auth schema is the lock-in)

---

## Validation after 6 weeks

✅ Time-to-MVP: 7 weeks vs estimated 8-10 · ahead
✅ No production incidents related to Supabase outages
✅ RLS policies cover all multi-tenancy isolation needs
⚠️ Hit 1 edge case where Supabase storage signed URLs expire faster than docs say (cost me 2h debugging) · documented in `docs/learnings/`
