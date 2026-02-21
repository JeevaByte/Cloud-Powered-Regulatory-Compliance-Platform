import { normalizePagination } from './pagination';

describe('normalizePagination', () => {
  it('returns defaults when no args provided', () => {
    const result = normalizePagination();
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
    expect(result.offset).toBe(0);
  });

  it('calculates offset correctly', () => {
    const result = normalizePagination(3, 10);
    expect(result.page).toBe(3);
    expect(result.pageSize).toBe(10);
    expect(result.offset).toBe(20);
  });

  it('clamps pageSize to MAX_PAGE_SIZE', () => {
    const result = normalizePagination(1, 999);
    expect(result.pageSize).toBe(100);
  });

  it('clamps page to minimum 1', () => {
    const result = normalizePagination(0, 10);
    expect(result.page).toBe(1);
  });
});
