# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Security

- Upgraded `next` from 14.2.13 to 15.5.12 to fix multiple CVEs: DoS via Server Components
  (GHSA-gp8f-8m3g-qvj9, GHSA-7m27-7ghc-44w9), authorization bypass in middleware
  (GHSA-f82v-jwr5-mffw, GHSA-3h52-269p-cp9r), and HTTP request deserialization DoS
  (GHSA-pjrj-h4fg-6gm4)
- Upgraded NestJS from 10.x to 11.x and `fastify` from 4.x to 5.7.4 to fix
  Content-Type header tab-character body-validation bypass (GHSA-mg4w-6jr5-9r68)

## [0.1.0] - 2025-01-01

### Added

- Initial monorepo scaffold with pnpm workspaces
- NestJS API with Fastify adapter, `/healthz` and `/readyz` endpoints, OpenAPI/Swagger, pino logging
- Next.js web application with home page and API health indicator
- Shared types/utilities package
- Terraform infrastructure skeleton (RDS, S3, Secrets Manager, ECS Fargate)
- Docker Compose local development environment (Postgres, MinIO, API, Web)
- GitHub Actions CI workflow (lint, typecheck, test, build, Docker build, Trivy scan)
- Husky + lint-staged git hooks
- ESLint + Prettier configuration
- Core documentation: PRD, architecture, data model, roadmap, ADRs

[0.1.0]: https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform/releases/tag/v0.1.0
