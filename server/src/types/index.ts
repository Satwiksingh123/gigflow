export type UserRole = "admin" | "sales";

// Single source of truth for enums — validators derive from these
export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Lost"] as const;
export const LEAD_SOURCES = ["Website", "Instagram", "Referral"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface JwtPayload {
  sub: string;
  role: UserRole;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
}