import type {
  PaginatedResult,
  PaginationInput,
  PaginationMeta
} from "../domain/pagination.js";

function normalizePositiveInteger(value: number | undefined, fallback: number) {
  if (!value || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.floor(value));
}

export function createPaginationMeta(
  totalItems: number,
  input: PaginationInput = {}
): PaginationMeta {
  const page = normalizePositiveInteger(input.page, 1);
  const pageSize = normalizePositiveInteger(input.pageSize, 10);
  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / pageSize);
  const safePage = Math.min(page, totalPages);
  const startIndex = totalItems === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = totalItems === 0
    ? 0
    : Math.min(startIndex + pageSize, totalItems);

  return {
    page: safePage,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: safePage > 1,
    hasNextPage: safePage < totalPages,
    startIndex,
    endIndex
  };
}

export function paginateItems<T>(
  items: T[],
  input: PaginationInput = {}
): PaginatedResult<T> {
  const meta = createPaginationMeta(items.length, input);

  return {
    items: items.slice(meta.startIndex, meta.endIndex),
    meta
  };
}
