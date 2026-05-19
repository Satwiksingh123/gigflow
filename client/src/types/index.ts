export type UserRole = "admin" | "sales";

// Single source of truth for enum values — mirrors server/src/types/index.ts
export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Lost",
] as const;
export const LEAD_SOURCES = ["Website", "Instagram", "Referral"] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type LeadSource = (typeof LEAD_SOURCES)[number];

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/** Standard envelope wrapping every API response */
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message?: string;
  details?: unknown;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadQuery {
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: "latest" | "oldest";
  page?: number;
  limit?: number;
}

/** Response shape from GET /api/leads/stats */
export interface LeadStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
}