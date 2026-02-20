# Roadmap

# Cloud-Powered Regulatory Compliance Platform

**Last Updated:** 2025-01-01  
**Status:** Active

---

## Overview

The platform follows a phased delivery model designed to provide immediate value (manual compliance
tracking) while progressively adding automation, intelligence, and integrations. Each phase builds
on the previous one and is scoped to a single quarter.

---

## Phase 0 — Foundation & Scaffold (Q1 2025)

**Goal:** Establish a production-grade monorepo foundation with full CI/CD, infrastructure skeleton,
and basic operational endpoints.

**Status:** ✅ In Progress

### Milestones

| #    | Milestone                                                | Status  |
| ---- | -------------------------------------------------------- | ------- |
| 0.1  | Monorepo scaffold (pnpm workspaces)                      | ✅ Done |
| 0.2  | NestJS + Fastify API with `/healthz` and `/readyz`       | ✅ Done |
| 0.3  | Next.js 14 web app with health badge                     | ✅ Done |
| 0.4  | Shared TypeScript types/utils package                    | ✅ Done |
| 0.5  | Terraform skeleton (RDS, S3, Secrets Manager, ECS)       | ✅ Done |
| 0.6  | Docker Compose local dev environment                     | ✅ Done |
| 0.7  | GitHub Actions CI (lint, typecheck, test, build, Trivy)  | ✅ Done |
| 0.8  | Husky + lint-staged pre-commit hooks                     | ✅ Done |
| 0.9  | Core documentation (PRD, architecture, data model, ADRs) | ✅ Done |
| 0.10 | OpenAPI/Swagger documentation endpoint                   | ✅ Done |

**Definition of Done:** Any developer can clone the repo and run `docker compose up` to get a
fully running local environment. All CI checks pass on main branch.

---

## Phase 1 — Core Compliance Tracking (Q2 2025)

**Goal:** Enable manual compliance tracking — organizations can manage frameworks, controls, and
upload evidence through a usable web interface.

**Status:** 🔜 Planned

### Milestones

| #    | Milestone                                                               |
| ---- | ----------------------------------------------------------------------- |
| 1.1  | PostgreSQL schema with TypeORM + migrations                             |
| 1.2  | Organization CRUD and multi-tenancy enforcement                         |
| 1.3  | User authentication (register, login, JWT, refresh tokens)              |
| 1.4  | RBAC guards and role management                                         |
| 1.5  | Compliance framework seed data (SOC 2, ISO 27001, GDPR, HIPAA, PCI DSS) |
| 1.6  | Controls API (CRUD, status transitions, owner assignment)               |
| 1.7  | Evidence upload API (S3 integration, MIME validation, size limits)      |
| 1.8  | Evidence review workflow (submit → approve/reject)                      |
| 1.9  | Audit log service (automatic on all mutations)                          |
| 1.10 | Next.js: Login, dashboard, frameworks list                              |
| 1.11 | Next.js: Controls list with filtering and status updates                |
| 1.12 | Next.js: Evidence manager with upload and review                        |
| 1.13 | Email notifications (evidence review, due date reminders) via SES       |
| 1.14 | Terraform: Deploy to dev environment on AWS                             |
| 1.15 | E2E tests (Playwright) for critical user journeys                       |

**Key Metrics:**

- Organizations can track 100% of SOC 2 CC criteria manually
- Evidence upload supports files up to 50MB
- All API endpoints covered by integration tests (>80% coverage)

---

## Phase 2 — Cloud Automation (Q3 2025)

**Goal:** Reduce manual evidence collection burden by automatically ingesting compliance signals
from AWS services.

**Status:** 🔜 Planned

### Milestones

| #    | Milestone                                                |
| ---- | -------------------------------------------------------- |
| 2.1  | AWS integration configuration UI and API                 |
| 2.2  | AWS Config Rules integration (automated control checks)  |
| 2.3  | AWS CloudTrail ingestion (access control evidence)       |
| 2.4  | AWS IAM Access Analyzer findings import                  |
| 2.5  | AWS Security Hub findings → control mappings             |
| 2.6  | Webhook receiver for CI/CD pipeline evidence             |
| 2.7  | EventBridge scheduled evidence collection (hourly/daily) |
| 2.8  | SCIM 2.0 user provisioning                               |
| 2.9  | SSO: SAML 2.0 / OIDC integration                         |
| 2.10 | API keys for programmatic access                         |
| 2.11 | Bulk evidence import via ZIP                             |
| 2.12 | Notification center (in-app + email digest)              |

**Key Metrics:**

- 40% of SOC 2 controls have automated evidence collection
- Alert latency for new Security Hub findings: < 15 minutes
- Zero manual steps for CloudTrail evidence collection

---

## Phase 3 — Advanced Analytics & AI (Q4 2025)

**Goal:** Provide intelligent insights, automated gap analysis, and audit-ready reporting.

**Status:** 🔜 Planned

### Milestones

| #    | Milestone                                                        |
| ---- | ---------------------------------------------------------------- |
| 3.1  | Compliance score trending charts (weekly/monthly snapshots)      |
| 3.2  | Gap analysis report: controls missing evidence or failing checks |
| 3.3  | Executive dashboard with multi-framework rollup                  |
| 3.4  | Audit package export: PDF/ZIP scoped to period and framework     |
| 3.5  | AI-powered gap recommendations (AWS Bedrock / OpenAI)            |
| 3.6  | AI control description enrichment                                |
| 3.7  | Custom report templates                                          |
| 3.8  | SOC 2 Type II certification for the platform                     |
| 3.9  | Read replicas and query optimization for analytics               |
| 3.10 | Public status page for platform uptime                           |

**Key Metrics:**

- Audit package generation time: < 2 minutes for 200 controls
- AI gap analysis accuracy: > 85% precision on known gaps
- Platform achieves SOC 2 Type II report

---

## Phase 4 — Multi-Cloud & Marketplace (2026)

**Goal:** Expand beyond AWS to Azure and GCP, and list on cloud marketplaces for easier procurement.

**Status:** 🔮 Future

### Milestones

| #    | Milestone                                            |
| ---- | ---------------------------------------------------- |
| 4.1  | Azure Policy integration                             |
| 4.2  | Microsoft Defender for Cloud findings import         |
| 4.3  | GCP Security Command Center integration              |
| 4.4  | AWS Marketplace listing (SaaS contract)              |
| 4.5  | Azure Marketplace listing                            |
| 4.6  | Multi-region deployment (EU data residency)          |
| 4.7  | Partner/MSSP portal with sub-organization management |
| 4.8  | Custom compliance framework builder                  |
| 4.9  | Vendor risk management module                        |
| 4.10 | HIPAA BAA workflow and healthcare-specific dashboard |

---

## Dependencies & Risks

| Risk                                                | Mitigation                                                      |
| --------------------------------------------------- | --------------------------------------------------------------- |
| AWS API rate limits for Config/CloudTrail ingestion | Implement exponential backoff and request batching              |
| AI model accuracy for gap recommendations           | Human-in-the-loop review; show confidence scores                |
| SOC 2 Type II audit timeline                        | Engage auditor in Q3 2025; start evidence collection at Phase 0 |
| Data residency requirements (EU customers)          | Multi-region Terraform from Phase 3                             |
| pnpm workspace hoisting edge cases                  | Pin all dependency versions; test on clean install              |
