# 🛡️ Cloud-Powered Regulatory Compliance Platform

> Streamline your compliance journey with automated control mapping, evidence collection, and real-time compliance dashboards.

[![CI](https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Architecture

```
                        ┌─────────────────────────┐
  Clients ──────────────▶   AWS CloudFront / ALB  │
  (Browser / API)       └────────┬────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
           ┌────────▼────────┐      ┌─────────▼───────┐
           │  Web (Next.js)  │      │  API (NestJS)   │
           │  ECS Fargate    │      │  ECS Fargate    │
           │  Port 3000      │      │  Port 3001      │
           └─────────────────┘      └────────┬────────┘
                                             │
                              ┌──────────────┼──────────────┐
                              │              │              │
                    ┌─────────▼──┐  ┌────────▼───┐  ┌──────▼──────────┐
                    │ RDS        │  │ S3 / MinIO │  │ Secrets Manager │
                    │ PostgreSQL │  │ (Evidence) │  │ (JWT, DB creds) │
                    └────────────┘  └────────────┘  └─────────────────┘
```

---

## Tech Stack

| Layer                | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js 15 (App Router), React 18, TypeScript |
| **Backend API**      | NestJS 11, Fastify 5, TypeScript              |
| **Database**         | PostgreSQL 16 (RDS in prod, Docker in dev)    |
| **Object Storage**   | AWS S3 (MinIO in dev)                         |
| **Infrastructure**   | Terraform, AWS ECS Fargate, ALB, CloudFront   |
| **Secrets**          | AWS Secrets Manager                           |
| **Monorepo**         | pnpm workspaces                               |
| **CI/CD**            | GitHub Actions                                |
| **Containerization** | Docker, Docker Compose                        |

---

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.11.1 (use `.nvmrc` with `nvm use`)
- [pnpm](https://pnpm.io/) >= 9.0.0 (`npm install -g pnpm`)
- [Docker](https://www.docker.com/) + Docker Compose (for local dev)
- [Terraform](https://www.terraform.io/) >= 1.9 (for infrastructure)

---

## Local Development — One-Command Start

```bash
# Clone the repository
git clone https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform.git
cd Cloud-Powered-Regulatory-Compliance-Platform

# Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Start all services
docker compose up --build
```

### Services

| Service           | URL                        | Description                                                             |
| ----------------- | -------------------------- | ----------------------------------------------------------------------- |
| **Web App**       | http://localhost:3000      | Next.js frontend                                                        |
| **API**           | http://localhost:3001      | NestJS REST API                                                         |
| **Swagger Docs**  | http://localhost:3001/docs | OpenAPI documentation                                                   |
| **MinIO Console** | http://localhost:9001      | S3-compatible object storage UI (user: `minioadmin` / pw: `minioadmin`) |
| **PostgreSQL**    | localhost:5432             | Database (user: `postgres` / pw: `postgres`)                            |

### Health Checks

```bash
curl http://localhost:3001/healthz   # Liveness probe
curl http://localhost:3001/readyz    # Readiness probe
```

---

## Development Scripts

```bash
# Install all workspace dependencies
pnpm install

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Format all files
pnpm format

# Check formatting
pnpm format:check

# TypeScript type checking
pnpm typecheck

# Run all tests
pnpm test
```

---

## Project Structure

```
/
├── apps/
│   ├── api/                    # NestJS + Fastify backend
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   └── health/         # /healthz and /readyz endpoints
│   │   ├── Dockerfile
│   │   └── package.json        # @compliance/api
│   └── web/                    # Next.js 15 frontend
│       ├── src/
│       │   ├── app/            # App Router (layout, pages)
│       │   └── components/     # React components
│       ├── Dockerfile
│       └── package.json        # @compliance/web
├── packages/
│   └── shared/                 # Shared TypeScript types, constants, utils
│       ├── src/
│       │   ├── types/          # ComplianceFramework, Control, Evidence types
│       │   ├── constants/      # Framework labels, pagination defaults
│       │   └── utils/          # pagination, validation helpers
│       └── package.json        # @compliance/shared
├── infra/
│   └── terraform/              # AWS infrastructure (Phase 0 skeleton)
│       ├── modules/
│       │   ├── rds/            # PostgreSQL RDS
│       │   ├── s3/             # Evidence storage bucket
│       │   ├── secrets/        # Secrets Manager
│       │   └── ecs/            # ECS Fargate cluster + task definitions
│       ├── main.tf
│       ├── variables.tf
│       └── outputs.tf
├── docs/                       # Project documentation
├── docker-compose.yml          # Local development stack
├── pnpm-workspace.yaml
└── package.json                # Root workspace
```

---

## Documentation

| Document                                             | Description                         |
| ---------------------------------------------------- | ----------------------------------- |
| [PRD](docs/PRD.md)                                   | Product Requirements Document       |
| [Architecture](docs/architecture.md)                 | System architecture and tech stack  |
| [Data Model](docs/data-model.md)                     | Database entities and relationships |
| [Roadmap](docs/roadmap.md)                           | Phase-by-phase delivery plan        |
| [Changelog](docs/CHANGELOG.md)                       | Version history                     |
| [ADR 0001](docs/adr/0001-monorepo-and-tech-stack.md) | Monorepo & tech stack decision      |
| [ADR 0002](docs/adr/0002-phase-0-addons.md)          | Phase 0 production addons           |
| [Terraform README](infra/terraform/README.md)        | Infrastructure setup guide          |

---

## Supported Compliance Frameworks

| Framework          | Status  |
| ------------------ | ------- |
| SOC 2 Type II      | Phase 1 |
| ISO/IEC 27001:2022 | Phase 1 |
| GDPR               | Phase 1 |
| HIPAA              | Phase 1 |
| PCI DSS v4.0       | Phase 1 |

---

## CI/CD

GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and pull request to `main` and `develop`:

1. **Lint & Typecheck** — ESLint, Prettier check, TypeScript `tsc --noEmit`
2. **Unit Tests** — Jest across all packages
3. **Build** — `pnpm -r build` (depends on lint + test passing)
4. **Docker Build** — Multi-stage Docker builds for API and Web images
5. **Security Scan** — Trivy filesystem scan + `pnpm audit` (non-blocking)

---

## Security

- All data encrypted in transit (TLS 1.2+) and at rest (AES-256)
- Secrets managed exclusively via AWS Secrets Manager (never in environment variables or code)
- S3 buckets have public access fully blocked
- RBAC enforced at the API layer for every endpoint
- Full immutable audit trail for all data mutations
- Penetration testing conducted annually
- Pre-commit hooks enforce linting before every commit

**Do not commit** `.env` files or any credentials. Use `.env.example` as a template.

---

## Contributing

See **[CONTRIBUTING.md](CONTRIBUTING.md)** for the full guide, including:

- How to fork, clone, and set up the repo
- How to create a branch, commit, and **push your code**
- Branch naming and commit message conventions
- How to open a pull request
- What the CI pipeline checks

Quick start:

```bash
git checkout -b feat/my-feature    # branch off develop
# … make changes …
pnpm lint && pnpm typecheck && pnpm test   # must all pass
git add . && git commit -m "feat: my change"
git push origin feat/my-feature    # push to your fork
# then open a PR against develop on GitHub
```

---

## License

MIT © [JeevaByte](https://github.com/JeevaByte)
