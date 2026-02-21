# Contributing to the Cloud-Powered Regulatory Compliance Platform

Thank you for your interest in contributing! This guide walks you through **exactly how to push code** into this repository — from your first clone to a merged pull request.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1 — Fork the Repository](#step-1--fork-the-repository)
3. [Step 2 — Clone Your Fork](#step-2--clone-your-fork)
4. [Step 3 — Set Up Local Development](#step-3--set-up-local-development)
5. [Step 4 — Create a Feature Branch](#step-4--create-a-feature-branch)
6. [Step 5 — Make Your Changes](#step-5--make-your-changes)
7. [Step 6 — Run Checks Locally](#step-6--run-checks-locally)
8. [Step 7 — Commit Your Changes](#step-7--commit-your-changes)
9. [Step 8 — Push to Your Fork](#step-8--push-to-your-fork)
10. [Step 9 — Open a Pull Request](#step-9--open-a-pull-request)
11. [Branch Naming Convention](#branch-naming-convention)
12. [Commit Message Convention](#commit-message-convention)
13. [What Happens After You Push](#what-happens-after-you-push)

---

## Prerequisites

Make sure you have all of these installed before you start:

| Tool               | Version            | Install                                             |
| ------------------ | ------------------ | --------------------------------------------------- |
| **Git**            | Any recent version | https://git-scm.com/downloads                       |
| **Node.js**        | >= 20.11.1         | https://nodejs.org or `nvm use` (repo has `.nvmrc`) |
| **pnpm**           | >= 9.0.0           | `npm install -g pnpm`                               |
| **Docker**         | >= 24              | https://www.docker.com/get-started                  |
| **GitHub account** | —                  | https://github.com                                  |

---

## Step 1 — Fork the Repository

A **fork** creates your own copy of the repo under your GitHub account.

1. Go to https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform
2. Click the **Fork** button (top-right corner).
3. Choose your personal account as the owner. Click **Create fork**.

> **Note:** Direct pushes to `main` and `develop` are protected. All changes must go through a
> pull request from a fork (or a feature branch).

---

## Step 2 — Clone Your Fork

```bash
# Replace <your-username> with your actual GitHub username
git clone https://github.com/<your-username>/Cloud-Powered-Regulatory-Compliance-Platform.git
cd Cloud-Powered-Regulatory-Compliance-Platform
```

Add the **upstream** remote so you can pull in future changes from the original repo:

```bash
git remote add upstream https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform.git
git remote -v
# origin   https://github.com/<your-username>/Cloud-Powered-Regulatory-Compliance-Platform.git (fetch)
# upstream https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform.git (fetch)
```

---

## Step 3 — Set Up Local Development

```bash
# 1. Use the pinned Node.js version
nvm use          # reads .nvmrc (Node 20.11.1)

# 2. Install all workspace dependencies
pnpm install

# 3. Copy environment files
cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Start all services (Postgres, MinIO, API, Web)
docker compose up --build
```

After `docker compose up`:

| Service       | URL                        |
| ------------- | -------------------------- |
| Web app       | http://localhost:3000      |
| API           | http://localhost:3001      |
| Swagger docs  | http://localhost:3001/docs |
| MinIO console | http://localhost:9001      |

---

## Step 4 — Create a Feature Branch

**Always branch off `develop`**, never off `main`.

```bash
# Make sure your local develop is up to date
git fetch upstream
git checkout develop
git merge upstream/develop

# Create your feature branch
git checkout -b feat/my-feature-name
```

See [Branch Naming Convention](#branch-naming-convention) for naming rules.

---

## Step 5 — Make Your Changes

Edit source files as needed. Keep changes focused on a single concern per branch — this makes
reviews faster and rebasing easier.

Key directories:

```
apps/api/src/        ← NestJS backend source
apps/web/src/        ← Next.js frontend source
packages/shared/src/ ← Shared types and utilities (re-exported to both apps)
infra/terraform/     ← AWS infrastructure skeleton
docs/                ← Documentation
```

---

## Step 6 — Run Checks Locally

**Run all of these before pushing.** The CI pipeline runs exactly the same checks and will fail
if any of them fail.

```bash
# Lint all packages (auto-fixes fixable issues)
pnpm lint

# Check formatting
pnpm format:check

# Auto-fix formatting
pnpm format

# TypeScript type checking (also builds shared declarations)
pnpm typecheck

# Run all unit tests
pnpm test

# Build all packages
pnpm build
```

All five commands must pass with **zero errors** before you open a pull request.

---

## Step 7 — Commit Your Changes

This project follows the **Conventional Commits** specification.

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "feat(api): add organisations CRUD endpoints"
```

The pre-commit hook (Husky + lint-staged) will automatically:

- Run `eslint --fix` on staged `.ts`/`.tsx` files
- Run `prettier --write` on staged files

If the hook fails, fix the reported issues and re-run `git commit`.

See [Commit Message Convention](#commit-message-convention) for full rules.

---

## Step 8 — Push to Your Fork

```bash
# Push your branch to your fork on GitHub
git push origin feat/my-feature-name
```

If this is your first push for this branch, Git will print a URL to create a pull request —
you can use that directly or follow Step 9.

---

## Step 9 — Open a Pull Request

1. Go to your fork on GitHub:
   `https://github.com/<your-username>/Cloud-Powered-Regulatory-Compliance-Platform`
2. GitHub will show a banner: **"Compare & pull request"** — click it.
3. Set the **base repository** to `JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform`
   and the **base branch** to `develop`.
4. Fill in the PR template:
   - **Title**: follow the commit convention (e.g., `feat(api): add organisations CRUD`)
   - **Description**: what changed, why, and how to test it
   - **Checklist**: confirm all checks pass
5. Click **Create pull request**.

The CI pipeline (`ci.yml`) will run automatically: lint → typecheck → tests → build →
Docker build → Trivy security scan. All jobs must be green before the PR can be merged.

> **Note for first-time contributors and bots:** GitHub requires a repository maintainer to
> approve the first CI run for a new contributor. If you see the CI status as
> "Waiting for approval" or `action_required`, the repository owner needs to visit
> `https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform/actions`
> and click **"Approve and run"** on the blocked workflow run. The workflow can also be
> triggered manually at any time from the Actions tab using **"Run workflow"**.

---

## Branch Naming Convention

| Prefix      | When to use                            | Example                           |
| ----------- | -------------------------------------- | --------------------------------- |
| `feat/`     | New feature                            | `feat/user-authentication`        |
| `fix/`      | Bug fix                                | `fix/health-check-timeout`        |
| `chore/`    | Maintenance, deps, tooling             | `chore/upgrade-nestjs-12`         |
| `docs/`     | Documentation only                     | `docs/api-usage-examples`         |
| `refactor/` | Code restructure (no behaviour change) | `refactor/extract-auth-guard`     |
| `test/`     | Adding or fixing tests                 | `test/compliance-util-edge-cases` |
| `ci/`       | CI/CD workflow changes                 | `ci/add-integration-test-job`     |

---

## Commit Message Convention

Format: `<type>(<scope>): <short description>`

```
feat(api): add rate limiting to all endpoints
fix(web): handle offline API gracefully in health badge
chore(deps): upgrade next to 15.5.12
docs(contributing): add push workflow guide
refactor(shared): rename ControlStatus enum values
test(shared): add edge cases for calculateCompliancePercentage
```

**Types:** `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`

**Scopes:** `api`, `web`, `shared`, `infra`, `ci`, `docs` (or omit for root-level changes)

- Use **present tense**: "add feature" not "added feature"
- Keep the description under **72 characters**
- Reference issues with `Closes #123` or `Fixes #456` at the end of the commit body

---

## What Happens After You Push

```
Your push
    │
    ▼
GitHub CI Pipeline (.github/workflows/ci.yml)
    ├── Lint & Typecheck  ──────────────── pnpm lint + pnpm format:check + pnpm typecheck
    ├── Unit Tests  ────────────────────── pnpm test (all packages)
    ├── Build  ─────────────────────────── pnpm -r build (depends on lint + test)
    ├── Docker Build  ──────────────────── builds API + Web images (depends on lint)
    └── Security Scan (non-blocking)  ──── Trivy filesystem scan + pnpm audit
          │
          ▼
     All green?
          │
    ┌─────┴──────┐
    │  Request   │
    │ code review│
    └─────┬──────┘
          │
    Approved + green CI
          │
          ▼
    Merged into develop
```

> **Tip:** If CI is red on your PR, click the failing job to read the logs. The most common
> issues are lint errors (run `pnpm lint && pnpm format`) or a missing `pnpm typecheck` pass
> (ensure `packages/shared` was built first — `pnpm typecheck` does this automatically).
>
> If CI shows `action_required` with no jobs running, a repository maintainer needs to approve
> the workflow run in the GitHub Actions tab. The CI can also be triggered manually via
> **Actions → CI → Run workflow**.

---

## Keeping Your Fork Up to Date

Before starting new work, always sync with upstream:

```bash
git fetch upstream
git checkout develop
git merge upstream/develop
git push origin develop        # keep your fork's develop current too
```

---

## Questions?

Open an issue at https://github.com/JeevaByte/Cloud-Powered-Regulatory-Compliance-Platform/issues
or start a GitHub Discussion.
