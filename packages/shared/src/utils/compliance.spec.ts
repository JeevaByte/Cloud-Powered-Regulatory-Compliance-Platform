import { ControlStatus } from '../types/compliance';
import { calculateCompliancePercentage } from './compliance';

describe('calculateCompliancePercentage', () => {
  it('returns zero summary for an empty array', () => {
    const result = calculateCompliancePercentage([]);
    expect(result).toEqual({
      implemented: 0,
      inProgress: 0,
      notStarted: 0,
      needsReview: 0,
      total: 0,
      percentage: 0,
    });
  });

  it('returns 100% when all controls are IMPLEMENTED', () => {
    const result = calculateCompliancePercentage([
      ControlStatus.IMPLEMENTED,
      ControlStatus.IMPLEMENTED,
    ]);
    expect(result.percentage).toBe(100);
    expect(result.implemented).toBe(2);
    expect(result.total).toBe(2);
  });

  it('returns 0% when no controls are IMPLEMENTED', () => {
    const result = calculateCompliancePercentage([
      ControlStatus.NOT_STARTED,
      ControlStatus.IN_PROGRESS,
    ]);
    expect(result.percentage).toBe(0);
    expect(result.notStarted).toBe(1);
    expect(result.inProgress).toBe(1);
  });

  it('rounds percentage to nearest integer', () => {
    // 1 out of 3 = 33.33% → rounds to 33
    const result = calculateCompliancePercentage([
      ControlStatus.IMPLEMENTED,
      ControlStatus.NOT_STARTED,
      ControlStatus.IN_PROGRESS,
    ]);
    expect(result.percentage).toBe(33);
    expect(result.implemented).toBe(1);
    expect(result.total).toBe(3);
  });

  it('correctly counts NEEDS_REVIEW statuses', () => {
    const result = calculateCompliancePercentage([
      ControlStatus.IMPLEMENTED,
      ControlStatus.NEEDS_REVIEW,
      ControlStatus.NEEDS_REVIEW,
    ]);
    expect(result.needsReview).toBe(2);
    expect(result.percentage).toBe(33);
  });

  it('handles all four statuses together', () => {
    const statuses = [
      ControlStatus.IMPLEMENTED,
      ControlStatus.IMPLEMENTED,
      ControlStatus.IN_PROGRESS,
      ControlStatus.NOT_STARTED,
      ControlStatus.NEEDS_REVIEW,
    ];
    const result = calculateCompliancePercentage(statuses);
    expect(result.implemented).toBe(2);
    expect(result.inProgress).toBe(1);
    expect(result.notStarted).toBe(1);
    expect(result.needsReview).toBe(1);
    expect(result.total).toBe(5);
    expect(result.percentage).toBe(40);
  });
});
