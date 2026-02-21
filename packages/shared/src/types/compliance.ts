export enum ComplianceFramework {
  SOC2 = 'SOC2',
  ISO27001 = 'ISO27001',
  GDPR = 'GDPR',
  HIPAA = 'HIPAA',
  PCI_DSS = 'PCI_DSS',
}

export enum ControlStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  IMPLEMENTED = 'IMPLEMENTED',
  NEEDS_REVIEW = 'NEEDS_REVIEW',
}

export enum EvidenceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplianceControl {
  id: string;
  organizationId: string;
  framework: ComplianceFramework;
  controlId: string;
  title: string;
  description: string;
  status: ControlStatus;
  ownerId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Evidence {
  id: string;
  controlId: string;
  title: string;
  description?: string;
  fileUrl?: string;
  status: EvidenceStatus;
  reviewedById?: string;
  reviewedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
