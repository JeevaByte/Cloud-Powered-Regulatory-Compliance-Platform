import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';

export function normalizePagination(
  page?: number,
  pageSize?: number,
): { page: number; pageSize: number; offset: number } {
  const normalizedPage = Math.max(1, page ?? 1);
  const normalizedPageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(1, pageSize ?? DEFAULT_PAGE_SIZE),
  );
  return {
    page: normalizedPage,
    pageSize: normalizedPageSize,
    offset: (normalizedPage - 1) * normalizedPageSize,
  };
}
