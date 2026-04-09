export interface PaginationInput {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  startIndex: number;
  endIndex: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}
