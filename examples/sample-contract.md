---
title: Frontend ↔ Backend API Contract · saas-app
type: contract
version: 2.1
lastUpdated: 2026-04-19
owner: founder
status: stable
sessionsTouching: [frontend-session, backend-session]
---

# Contract · `/api/onboarding/*` endpoints

Cross-module interface between `apps/web/` (Next.js · frontend Claude session) and `services/api/` (Hono · backend Claude session).

**Purpose of this file**: when frontend and backend Claude sessions run in parallel, neither sees the other's chat. This contract is the single source of truth — any deviation from below requires updating this file FIRST.

---

## Endpoints

### `POST /api/onboarding/start`

**Request**:
```typescript
{
  email: string;          // valid email format
  source: "landing" | "referral" | "direct";
  referrerId?: string;    // required iff source === "referral"
}
```

**Response (201)**:
```typescript
{
  sessionId: string;       // UUID
  expiresAt: string;       // ISO 8601 · session valid 24h
  nextStep: "verify-email" | "complete-profile";
}
```

**Errors**:
- `400` · invalid email format · returns `{ error: "INVALID_EMAIL" }`
- `409` · email already registered · returns `{ error: "EMAIL_EXISTS", redirectTo: "/login" }`
- `429` · rate limited (5/min per IP) · returns `{ error: "RATE_LIMITED", retryAfter: number }`

---

### `POST /api/onboarding/verify-email`

**Request**:
```typescript
{
  sessionId: string;
  code: string;            // 6-digit numeric
}
```

**Response (200)**:
```typescript
{
  status: "verified" | "code_invalid" | "expired";
  nextStep: "complete-profile" | "retry-code";
}
```

---

### `GET /api/onboarding/state/:sessionId`

**Response (200)**:
```typescript
{
  sessionId: string;
  step: "started" | "verified" | "profile-complete" | "completed";
  email: string;
  startedAt: string;
  expiresAt: string;
}
```

**Errors**:
- `404` · session not found OR expired

---

## Behavioral guarantees

1. **Idempotency**: `POST /start` with same email returns existing sessionId if active session exists (no 409 unless completed onboarding)
2. **Code attempts**: `verify-email` allows 5 wrong codes before requiring new session
3. **Session TTL**: 24h hard expiry — frontend must handle 404 on `/state/:id`

---

## What frontend session can change without consulting backend session

✅ Loading states · error message wording · animation timing
✅ Form validation hints (client-side · backend re-validates regardless)
✅ Routing between onboarding screens
✅ Adding new optional client-side fields (must NOT send to backend until contract updated)

## What requires updating this contract first

🛑 Adding required fields to any request body
🛑 Changing response field names or types
🛑 Adding new endpoints
🛑 Changing error code semantics
🛑 Changing rate limit thresholds

---

## Change log

- v2.1 · 2026-04-19 · added `referrerId` field (referral attribution feature)
- v2.0 · 2026-03-15 · BREAKING · split `/onboarding/complete` into 3-step flow (start → verify → profile)
- v1.0 · 2026-02-08 · initial contract

## Anti-patterns logged from real incidents

- **2026-03-12 collision**: frontend Claude added `phoneNumber` to request body without updating contract → backend silently dropped it → 4h debugging by founder. Fix: contract gate now mandatory.
- **2026-04-19 race**: both sessions modified contract simultaneously without bumping `lastUpdated` → conflicting versions deployed. Fix: any contract change → bump `lastUpdated` AND leave 1-line memo in `docs/sessions/` same hour.
