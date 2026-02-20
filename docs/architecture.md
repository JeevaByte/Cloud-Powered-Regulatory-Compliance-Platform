# Architecture Document

# Cloud-Powered Regulatory Compliance Platform

**Version:** 0.1.0  
**Date:** 2025-01-01  
**Status:** Living Document

---

## 1. System Overview

The platform follows a cloud-native, multi-tier architecture deployed on AWS. It consists of a
Next.js frontend served via CloudFront, a NestJS REST API running on ECS Fargate, PostgreSQL on
RDS for relational data, and S3 for evidence file storage.

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           Internet                                  │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   AWS CloudFront CDN  │
                    │  (Static assets + Web)│
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │  Application Load     │
                    │  Balancer (ALB)       │
                    └─────┬──────────┬──────┘
                          │          │
             ┌────────────▼──┐  ┌───▼────────────┐
             │  ECS Fargate  │  │  ECS Fargate   │
             │  Web Service  │  │  API Service   │
             │  (Next.js)    │  │  (NestJS)      │
             │  Port 3000    │  │  Port 3001     │
             └───────────────┘  └───┬────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
         ┌──────────▼──┐  ┌────────▼──────┐  ┌────▼────────────┐
         │  RDS         │  │  S3 Bucket    │  │  Secrets        │
         │  PostgreSQL  │  │  (Evidence +  │  │  Manager        │
         │  16          │  │   Reports)    │  │  (JWT, DB creds)│
         └─────────────┘  └───────────────┘  └─────────────────┘
```

### 1.2 Local Development Architecture

```
┌─────────────────────────────────────────────────────┐
│                Docker Compose Network               │
│                                                     │
│  ┌──────────┐    ┌──────────┐    ┌──────────────┐  │
│  │  Web     │    │  API     │    │  PostgreSQL  │  │
│  │ :3000    │───▶│ :3001    │───▶│  :5432       │  │
│  │ Next.js  │    │ NestJS   │    │  (postgres16)│  │
│  └──────────┘    └────┬─────┘    └──────────────┘  │
│                       │                             │
│                  ┌────▼─────┐                       │
│                  │  MinIO   │                       │
│                  │ :9000    │                       │
│                  │ (S3 API) │                       │
│                  └──────────┘                       │
└─────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend

| Technology     | Version           | Purpose                                     |
| -------------- | ----------------- | ------------------------------------------- |
| **Next.js**    | 14.x (App Router) | React framework, SSR/SSG, server components |
| **React**      | 18.x              | UI component library                        |
| **TypeScript** | 5.x               | Type safety                                 |

### 2.2 Backend API

| Technology           | Version | Purpose                                                      |
| -------------------- | ------- | ------------------------------------------------------------ |
| **NestJS**           | 11.x    | Structured Node.js framework, DI, modules                    |
| **Fastify**          | 5.x     | High-performance HTTP adapter (via @nestjs/platform-fastify) |
| **@nestjs/swagger**  | 11.x    | OpenAPI documentation generation                             |
| **nestjs-pino**      | 4.x     | Structured JSON logging                                      |
| **@nestjs/terminus** | 11.x    | Health check endpoints                                       |
| **TypeScript**       | 5.x     | Type safety                                                  |

### 2.3 Database

| Technology            | Version | Purpose                     |
| --------------------- | ------- | --------------------------- |
| **PostgreSQL**        | 16      | Primary relational database |
| **TypeORM** (Phase 1) | 0.3.x   | ORM, migrations             |
| **pg**                | 8.x     | PostgreSQL client           |

### 2.4 Infrastructure & Cloud (AWS)

| Service             | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| **ECS Fargate**     | Serverless container runtime for API and Web              |
| **RDS PostgreSQL**  | Managed relational database with automated backups        |
| **S3**              | Evidence file storage, reports, static assets             |
| **Secrets Manager** | Secure storage of credentials and secrets                 |
| **CloudFront**      | CDN for web application and static assets                 |
| **ALB**             | Application Load Balancer for routing and SSL termination |
| **ECR**             | Private Docker container registry                         |
| **CloudWatch**      | Logs, metrics, alarms                                     |
| **EventBridge**     | Scheduled tasks (evidence polling, report generation)     |
| **SES**             | Transactional email (Phase 2)                             |

### 2.5 Developer Tooling

| Tool                        | Purpose                                              |
| --------------------------- | ---------------------------------------------------- |
| **pnpm**                    | Fast, disk-efficient package manager with workspaces |
| **Terraform**               | Infrastructure as Code                               |
| **Docker / Docker Compose** | Containerization and local dev                       |
| **GitHub Actions**          | CI/CD pipeline                                       |
| **Husky + lint-staged**     | Git hooks for pre-commit quality checks              |
| **ESLint + Prettier**       | Linting and code formatting                          |

---

## 3. Monorepo Structure

```
/
├── apps/
│   ├── api/                    # NestJS + Fastify backend API
│   │   ├── src/
│   │   │   ├── main.ts         # Application entry point
│   │   │   ├── app.module.ts   # Root module
│   │   │   └── health/         # Health check module
│   │   ├── Dockerfile
│   │   ├── nest-cli.json
│   │   └── package.json
│   └── web/                    # Next.js 15 frontend
│       ├── src/
│       │   ├── app/            # App Router pages and layouts
│       │   └── components/     # Shared React components
│       ├── Dockerfile
│       ├── next.config.js
│       └── package.json
├── packages/
│   └── shared/                 # Shared TypeScript types, constants, utils
│       ├── src/
│       │   ├── types/          # TypeScript interfaces and enums
│       │   ├── constants/      # Shared constants
│       │   └── utils/          # Pure utility functions
│       └── package.json
├── infra/
│   └── terraform/              # Terraform IaC
│       ├── modules/
│       │   ├── rds/            # RDS PostgreSQL module
│       │   ├── s3/             # S3 buckets module
│       │   ├── secrets/        # Secrets Manager module
│       │   └── ecs/            # ECS Fargate module
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── docs/                       # Project documentation
├── docker-compose.yml          # Local development environment
└── package.json                # Root workspace package
```

---

## 4. Key Architectural Decisions

See `/docs/adr/` for full Architecture Decision Records.

### 4.1 NestJS + Fastify over Express

NestJS provides opinionated structure (modules, controllers, services, DI) that scales well as the
application grows. Fastify adapter offers ~2x throughput improvement over Express for high-volume
evidence ingestion endpoints.

### 4.2 App Router (Next.js 15) with Server Components

React Server Components reduce client-side JavaScript bundle size. Server-side data fetching
simplifies the dashboard pages that aggregate compliance data from multiple API endpoints.

### 4.3 PostgreSQL over NoSQL

Compliance data has strong relational structure (controls → evidence → organizations). ACID
transactions are required for audit trail integrity. PostgreSQL's JSONB column type handles
flexible metadata without sacrificing query performance.

### 4.4 Terraform Modules

Each AWS service is encapsulated in a reusable Terraform module, enabling environment-specific
instantiation (dev/staging/prod) with different sizing parameters.

---

## 5. Data Flow

### 5.1 Evidence Upload Flow

```
Browser → POST /api/evidence (multipart)
  → API validates auth token (JWT middleware)
  → API validates file type and size
  → API uploads to S3 (presigned PUT or server-side upload)
  → API stores metadata in PostgreSQL (evidence table)
  → API returns evidence record with S3 URL
  → Audit log entry created
```

### 5.2 Compliance Check Flow (Phase 2)

```
EventBridge schedule → Lambda/ECS task
  → Query AWS Config API for rule evaluations
  → Map Config rule results to internal controls
  → Create evidence records automatically (status: PENDING)
  → Notify control owner if check fails
  → Update control compliance score
```

### 5.3 Report Generation Flow

```
User triggers report → POST /api/reports
  → API queues report job (SQS/EventBridge)
  → Worker compiles control + evidence data
  → Worker generates PDF (Puppeteer/LaTeX)
  → Worker uploads PDF to S3
  → User notified via email/in-app
  → Report record saved in DB with S3 URL
```

---

## 6. Security Architecture

### 6.1 Authentication & Authorization

- **Authentication**: JWT access tokens (15min TTL) + refresh tokens (7d TTL) stored in httpOnly cookies
- **Authorization**: RBAC enforced at NestJS guard level using custom `@Roles()` decorator
- **SSO**: SAML 2.0 / OIDC via a future identity provider integration (Okta, Azure AD)
- **API Keys**: Long-lived API keys for service-to-service and CLI integrations (Phase 2)

### 6.2 Data Protection

- **In Transit**: TLS 1.2+ enforced at ALB and CloudFront; internal ECS traffic over HTTPS
- **At Rest**: RDS storage encrypted with AWS KMS; S3 buckets use SSE-AES256
- **Secrets**: No secrets in environment variables or code; all via AWS Secrets Manager
- **PII Handling**: Logs redact `authorization` headers and sensitive fields via pino redact config

### 6.3 Network Security

- API and web services run in private VPC subnets; only ALB is internet-facing
- RDS in dedicated private subnet group with no public access
- Security groups follow least-privilege principle
- S3 bucket public access blocked at account level

### 6.4 Audit Trail

Every mutating API operation writes an `AuditLog` record containing:

- `userId`, `organizationId`, `action` (CREATE/UPDATE/DELETE)
- `resourceType`, `resourceId`
- `previousValue` (JSON snapshot), `newValue` (JSON snapshot)
- `ipAddress`, `userAgent`, `timestamp`

Audit logs are append-only (no UPDATE or DELETE permissions granted) and replicated to S3 for
long-term retention.

---

## 7. Scalability Considerations

- **API**: Stateless NestJS containers scale horizontally via ECS Service Auto Scaling based on CPU/memory
- **Database**: Read replicas for reporting queries; connection pooling via PgBouncer sidecar
- **File Storage**: S3 scales infinitely; lifecycle rules archive evidence older than 1 year to S3 Glacier
- **CDN**: CloudFront caches Next.js static assets and ISR pages globally
