# ADR 0001: Monorepo Structure and Technology Stack

**Date:** 2025-01-01  
**Status:** Accepted  
**Deciders:** Engineering Team

## Context

We need to establish the foundational architecture for the Cloud-Powered Regulatory Compliance Platform. Key decisions include repository structure, language/runtime, framework choices, and cloud provider.

## Decision

### Repository Structure: Monorepo with pnpm workspaces
- Single repository containing `apps/web`, `apps/api`, `packages/shared`, `infra/terraform`
- pnpm workspaces for efficient dependency management and linking

**Rationale:** A monorepo simplifies cross-package refactoring, ensures consistency across packages, and simplifies CI/CD at Phase 0 scale.

### Language: TypeScript across all JS/TS packages
All application code uses TypeScript for type safety and better developer experience.

### API: NestJS with Fastify adapter
NestJS provides a structured, opinionated framework with built-in support for OpenAPI, dependency injection, and modularity. Fastify adapter provides better performance than the default Express adapter.

### Frontend: Next.js 14 (App Router)
Next.js provides SSR/SSG capabilities, a file-based routing system, and React Server Components, reducing client-side JavaScript.

### Database: PostgreSQL (AWS RDS in production, Docker in dev)
PostgreSQL is battle-tested for compliance use cases that need ACID transactions, JSONB for flexible data, and strong audit trail support.

### Object Storage: S3-compatible (MinIO in dev, AWS S3 in prod)
Evidence files and reports require durable, scalable object storage. MinIO enables local development without cloud costs.

### Infrastructure: Terraform on AWS
Terraform provides reproducible infrastructure-as-code. AWS was chosen for its compliance certifications (FedRAMP, SOC 2, HIPAA) relevant to our target customers.

### Package Manager: pnpm
pnpm is significantly faster than npm and yarn, has strict dependency resolution preventing phantom dependencies, and has first-class workspace support.

## Consequences

- Positive: Consistent tooling, shared types reduce duplication, easier atomic changes across apps
- Negative: Initial setup complexity higher than single-app repos; team must learn monorepo patterns
- Risk: pnpm workspace hoisting edge cases; mitigated by pinning package versions

## Alternatives Considered

- **Polyrepo**: Rejected due to overhead of managing multiple repos, CI pipelines, and cross-repo type sharing
- **Yarn Workspaces/Turborepo**: Valid alternative; pnpm chosen for stricter dependency isolation
- **Express/Fastify standalone**: Rejected in favor of NestJS for structure as app grows
- **Vercel/Next.js API routes**: Insufficient for complex compliance logic requiring background jobs, webhooks
