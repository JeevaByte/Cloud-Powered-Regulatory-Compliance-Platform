import { ControlStatus } from '../types/compliance';

export interface ComplianceSummary {
  implemented: number;
  inProgress: number;
  notStarted: number;
  needsReview: number;
  total: number;
  percentage: number;
}

/**
 * Calculates the compliance percentage and a summary breakdown for a set of control statuses.
 *
 * Only controls with status IMPLEMENTED count toward the percentage.
 * Returns 0 when there are no controls.
 */
export function calculateCompliancePercentage(statuses: ControlStatus[]): ComplianceSummary {
  if (statuses.length === 0) {
    return {
      implemented: 0,
      inProgress: 0,
      notStarted: 0,
      needsReview: 0,
      total: 0,
      percentage: 0,
    };
  }

  const counts = {
    [ControlStatus.IMPLEMENTED]: 0,
    [ControlStatus.IN_PROGRESS]: 0,
    [ControlStatus.NOT_STARTED]: 0,
    [ControlStatus.NEEDS_REVIEW]: 0,
  };

  for (const status of statuses) {
    if (status in counts) {
      counts[status] += 1;
    }
  }

  const percentage = Math.round((counts[ControlStatus.IMPLEMENTED] / statuses.length) * 100);

  return {
    implemented: counts[ControlStatus.IMPLEMENTED],
    inProgress: counts[ControlStatus.IN_PROGRESS],
    notStarted: counts[ControlStatus.NOT_STARTED],
    needsReview: counts[ControlStatus.NEEDS_REVIEW],
    total: statuses.length,
    percentage,
  };
}
