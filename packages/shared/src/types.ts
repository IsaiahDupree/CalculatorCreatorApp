// Common types shared across the application

export type ApiResponse<T = any> = {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export type PaginationParams = {
  page?: number;
  limit?: number;
  offset?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type SortOrder = 'asc' | 'desc';

export type SortParams = {
  field: string;
  order: SortOrder;
};

export type FilterParams = {
  category?: string;
  tags?: string[];
  status?: string;
  creatorId?: string;
  search?: string;
};




