/**
 * Common API Types representing the Standard Envelope responses defined in L2 / Backend APIs
 */

/**
 * Standard API Response Envelope
 */
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * Standard Paginated Response for list endpoints
 */
export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

/**
 * Root details that will be inherited by Entity typings
 */
export interface BaseEntity {
  id: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
