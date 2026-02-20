# Data Model
# Cloud-Powered Regulatory Compliance Platform

**Version:** 0.1.0  
**Date:** 2025-01-01

---

## 1. Entity Relationship Overview

```
Organization ──< User
Organization ──< ComplianceFramework
ComplianceFramework ──< Control
Control ──< Evidence
Control ──< AuditLog
Evidence ──< AuditLog
User ──< AuditLog (actor)
Organization ──< Report
```

---

## 2. Core Entities

### 2.1 Organization

Represents a customer tenant. All data is scoped to an organization.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `name` | VARCHAR(255) | Display name (e.g., "Acme Corp") |
| `slug` | VARCHAR(100) UNIQUE | URL-safe identifier (e.g., "acme-corp") |
| `plan` | ENUM | `FREE`, `STARTER`, `PROFESSIONAL`, `ENTERPRISE` |
| `createdAt` | TIMESTAMPTZ | Record creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |
| `deletedAt` | TIMESTAMPTZ (nullable) | Soft delete timestamp |

### 2.2 User

A person with access to one or more organizations.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `organizationId` | UUID (FK) | Owning organization |
| `email` | VARCHAR(255) UNIQUE | Login email address |
| `name` | VARCHAR(255) | Display name |
| `role` | ENUM | `OWNER`, `ADMIN`, `EDITOR`, `REVIEWER`, `VIEWER`, `AUDITOR` |
| `passwordHash` | VARCHAR (nullable) | Bcrypt hash; null if SSO-only |
| `mfaEnabled` | BOOLEAN | Whether MFA is enforced |
| `lastLoginAt` | TIMESTAMPTZ (nullable) | Last successful login |
| `createdAt` | TIMESTAMPTZ | Record creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |
| `deletedAt` | TIMESTAMPTZ (nullable) | Soft delete timestamp |

### 2.3 ComplianceFramework

A regulatory or security framework (SOC 2, ISO 27001, etc.) configured for an organization.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `organizationId` | UUID (FK) | Owning organization |
| `frameworkKey` | ENUM | `SOC2`, `ISO27001`, `GDPR`, `HIPAA`, `PCI_DSS` |
| `version` | VARCHAR(50) | Framework version (e.g., "2022", "v4.0") |
| `name` | VARCHAR(255) | Display name |
| `isActive` | BOOLEAN | Whether framework is actively tracked |
| `scopeDescription` | TEXT (nullable) | Description of in-scope systems/services |
| `createdAt` | TIMESTAMPTZ | Record creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |

### 2.4 Control

An individual compliance control requirement.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `organizationId` | UUID (FK) | Owning organization |
| `frameworkId` | UUID (FK) | Associated ComplianceFramework |
| `controlId` | VARCHAR(50) | Framework-specific ID (e.g., "CC6.1", "A.8.1") |
| `title` | VARCHAR(500) | Short control title |
| `description` | TEXT | Full control description |
| `controlType` | ENUM | `PREVENTIVE`, `DETECTIVE`, `CORRECTIVE`, `COMPENSATING` |
| `status` | ENUM | `NOT_STARTED`, `IN_PROGRESS`, `IMPLEMENTED`, `NEEDS_REVIEW` |
| `ownerId` | UUID (FK, nullable) | Assigned User |
| `dueDate` | DATE (nullable) | Target implementation date |
| `metadata` | JSONB (nullable) | Flexible extra fields (tags, custom attributes) |
| `createdAt` | TIMESTAMPTZ | Record creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |

### 2.5 Evidence

A piece of evidence linked to one or more controls.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `controlId` | UUID (FK) | Associated Control |
| `organizationId` | UUID (FK) | Owning organization (denormalized for query performance) |
| `title` | VARCHAR(500) | Evidence title |
| `description` | TEXT (nullable) | Detailed description |
| `evidenceType` | ENUM | `DOCUMENT`, `SCREENSHOT`, `LOG_EXPORT`, `AUTOMATED_CHECK`, `POLICY` |
| `fileKey` | VARCHAR(1000, nullable) | S3 object key |
| `fileUrl` | VARCHAR(2000, nullable) | Pre-signed or public URL |
| `mimeType` | VARCHAR(100, nullable) | File MIME type |
| `fileSizeBytes` | BIGINT (nullable) | File size |
| `status` | ENUM | `PENDING`, `APPROVED`, `REJECTED`, `EXPIRED` |
| `submittedById` | UUID (FK) | User who submitted evidence |
| `reviewedById` | UUID (FK, nullable) | User who reviewed evidence |
| `reviewedAt` | TIMESTAMPTZ (nullable) | When review occurred |
| `reviewNotes` | TEXT (nullable) | Reviewer notes |
| `expiresAt` | TIMESTAMPTZ (nullable) | Evidence expiry date |
| `isAutomated` | BOOLEAN | True if collected by automated integration |
| `createdAt` | TIMESTAMPTZ | Record creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |

### 2.6 AuditLog

Immutable record of every change in the system.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `organizationId` | UUID (FK) | Owning organization |
| `actorId` | UUID (FK, nullable) | User who performed the action |
| `action` | ENUM | `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOGOUT`, `EXPORT` |
| `resourceType` | VARCHAR(100) | Entity name (e.g., "Control", "Evidence") |
| `resourceId` | UUID (nullable) | Affected entity ID |
| `previousValue` | JSONB (nullable) | State before change |
| `newValue` | JSONB (nullable) | State after change |
| `ipAddress` | INET (nullable) | Client IP address |
| `userAgent` | VARCHAR(500, nullable) | Client user agent |
| `createdAt` | TIMESTAMPTZ | Immutable timestamp |

### 2.7 Report

A generated compliance report artifact.

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | Auto-generated identifier |
| `organizationId` | UUID (FK) | Owning organization |
| `frameworkId` | UUID (FK, nullable) | Scoped framework (null = all frameworks) |
| `generatedById` | UUID (FK) | User who triggered generation |
| `reportType` | ENUM | `GAP_ANALYSIS`, `EVIDENCE_SUMMARY`, `AUDIT_PACKAGE`, `EXECUTIVE` |
| `status` | ENUM | `QUEUED`, `GENERATING`, `COMPLETE`, `FAILED` |
| `periodStart` | DATE (nullable) | Audit period start |
| `periodEnd` | DATE (nullable) | Audit period end |
| `fileKey` | VARCHAR(1000, nullable) | S3 key for generated PDF/ZIP |
| `metadata` | JSONB (nullable) | Report configuration and summary stats |
| `createdAt` | TIMESTAMPTZ | Record creation timestamp |
| `updatedAt` | TIMESTAMPTZ | Last update timestamp |

---

## 3. Indexes

Key database indexes for performance:

- `controls(organization_id, framework_id, status)` — Control list filtering
- `evidence(control_id, status)` — Evidence by control and status
- `evidence(organization_id, expires_at)` — Expiry tracking
- `audit_logs(organization_id, created_at DESC)` — Audit log pagination
- `audit_logs(resource_type, resource_id)` — Resource history lookup
- `users(organization_id, email)` — User lookup
