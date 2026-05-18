import { z } from "zod";
import { LEAD_STATUSES, LEAD_SOURCES } from "../types";

// Derive Zod enums directly from the authoritative const arrays in types/index.ts.
// This ensures validators stay in sync with the type system automatically.
const statusEnum = z.enum(LEAD_STATUSES);
const sourceEnum = z.enum(LEAD_SOURCES);

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email(),
  status: statusEnum.optional(),
  source: sourceEnum,
  notes: z.string().trim().max(500).optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

export const leadQuerySchema = z.object({
  status: statusEnum.optional(),
  source: sourceEnum.optional(),
  search: z.string().trim().max(120).optional(),
  sort: z.enum(["latest", "oldest"]).default("latest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type LeadQueryInput = z.infer<typeof leadQuerySchema>;