# ADR 0002 — Phase 0 Production Addons

**Date:** 2025-01-01
**Status:** Accepted
**Deciders:** Platform Team

---

## Context

With the Phase 0 monorepo scaffold in place (ADR 0001), the next step is to harden the API with
production-readiness primitives that every SaaS backend needs before any business logic is written.
These addons lay the foundation for Phase 1 features (user auth, RBAC, CRUD) while keeping the
Phase 0 surface area minimal.

---

## Decisions

### 1. Rate Limiting — `@nestjs/throttler`

**Decision:** Add `ThrottlerModule` globally, default 100 requests per 60 seconds per IP.

**Rationale:**

- Compliance platform APIs are public-facing; without rate limiting, a single bad actor can
  exhaust API capacity and disrupt other tenants.
- `@nestjs/throttler` integrates natively with NestJS DI and supports async configuration
  via `ConfigService`, so limits are tunable at runtime via `THROTTLE_TTL` and `THROTTLE_LIMIT`
  env vars without a redeploy.
- Applied as a global `APP_GUARD` so every future controller is protected by default;
  individual endpoints can opt out with `@SkipThrottle()`.

**Alternatives considered:**

- NGINX / ALB rate limiting at the infrastructure layer — effective but not visible to the
  application and not portable across local dev / CI / cloud.

---

### 2. Input Validation — `class-validator` + `class-transformer` + `ValidationPipe`

**Decision:** Register a global `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`,
and `transform: true`.

**Rationale:**

- Compliance data (evidence uploads, control updates) is security-sensitive; silently accepting
  unexpected fields is a data integrity and injection risk.
- `whitelist: true` strips extra fields before they reach business logic.
- `forbidNonWhitelisted: true` returns a 400 when unknown properties are sent, making the API
  self-documenting about its contracts.
- `transform: true` + `enableImplicitConversion: true` auto-coerces query string strings to
  typed primitives (numbers, booleans), reducing boilerplate in every controller.
- Setting this up in Phase 0 means all Phase 1 DTOs automatically benefit.

**Alternatives considered:**

- Manual validation in each controller — doesn't scale, easy to forget.
- Zod — valid alternative but requires more wiring with NestJS pipes and doesn't integrate with
  Swagger decorators as cleanly as `class-validator`.

---

### 3. CORS — `app.enableCors()`

**Decision:** Enable CORS in the NestJS Fastify adapter, with the origin configurable via
`CORS_ORIGIN` environment variable (defaults to same-origin only in production).

**Rationale:**

- The Next.js web app (port 3000) needs to make browser-side fetch calls to the API (port 3001)
  during local development.
- Keeping `CORS_ORIGIN` as an env var means no code change is needed when the frontend domain
  changes between environments.
- `credentials: true` is required for future cookie-based session support.

---

### 4. Graceful Shutdown — `app.enableShutdownHooks()`

**Decision:** Call `app.enableShutdownHooks()` in `main.ts`.

**Rationale:**

- ECS Fargate (our production runtime) sends SIGTERM before killing a container; without
  shutdown hooks, in-flight requests are aborted mid-processing.
- NestJS shutdown hooks drain active connections and call `onModuleDestroy()` lifecycle hooks,
  giving services a chance to flush logs and close DB connections cleanly.
- Zero runtime cost; the entire change is one function call.

---

### 5. `calculateCompliancePercentage` utility in `packages/shared`

**Decision:** Add a domain-specific utility function in `packages/shared/src/utils/compliance.ts`
that computes a `ComplianceSummary` (counts per `ControlStatus` + integer percentage) from an
array of `ControlStatus` values.

**Rationale:**

- Compliance percentage is the single most visible metric on any compliance dashboard.
- Centralising the calculation in `@compliance/shared` ensures the API (reporting endpoints)
  and the web (dashboard display) use identical rounding logic.
- Fully tested in isolation — no database or HTTP dependencies.

---

## Consequences

- Every API endpoint is now rate-limited by default (100 req/min per IP). Endpoints that need
  higher limits (e.g., internal health checks called by the load balancer) should use
  `@SkipThrottle()`.
- All Phase 1 DTOs must use `class-validator` decorators to pass the global `ValidationPipe`.
- `CORS_ORIGIN`, `THROTTLE_TTL`, and `THROTTLE_LIMIT` must be documented in all `.env.example`
  files and set in ECS task definitions.
