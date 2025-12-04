export interface PageInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: PageInfo;
}

export interface TimeRangeParams {
  from?: string;
  to?: string;
  range?: string;
}
