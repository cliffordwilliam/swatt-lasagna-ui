export type PaginationMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type PaginationQuery<
  Filters extends Record<string, unknown>,
  SortField extends string,
> = {
  mode?: "and" | "or";
  page?: number;
  pageSize?: number;
  sortOrder?: "asc" | "desc";
  sortField?: SortField;
} & Filters;
