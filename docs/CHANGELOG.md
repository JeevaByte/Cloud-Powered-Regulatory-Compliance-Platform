# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
