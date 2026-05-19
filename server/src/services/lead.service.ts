import type { FilterQuery, SortOrder } from "mongoose";
import { Lead, type ILead } from "../models/Lead";
import { AppError } from "../utils/AppError";
import type { PaginatedResult, UserRole, LeadStatus, LeadStats } from "../types";
import { LEAD_STATUSES as STATUS_ARRAY } from "../types";
import type {
  CreateLeadInput,
  LeadQueryInput,
  UpdateLeadInput,
} from "../validators/lead.validator";

/** Build the MongoDB filter from parsed query params */
function buildFilter(
  query: LeadQueryInput,
  userId: string,
  role: UserRole,
): FilterQuery<ILead> {
  const filter: FilterQuery<ILead> = {};

  // Sales reps can only see leads they own; admins see everything
  if (role !== "admin") {
    filter.owner = userId;
  }

  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;

  if (query.search) {
    // Escape regex special characters to prevent ReDoS
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
}

export const leadService = {
  /**
   * List leads with filtering, sorting, and cursor-based pagination.
   * Scopes results to the requesting user's own leads unless they are an admin.
   */
  async list(
    query: LeadQueryInput,
    userId: string,
    role: UserRole,
  ): Promise<PaginatedResult<ILead>> {
    const filter = buildFilter(query, userId, role);
    const sort: Record<string, SortOrder> = {
      createdAt: query.sort === "oldest" ? 1 : -1,
    };
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      Lead.find(filter).sort(sort).skip(skip).limit(query.limit),
      Lead.countDocuments(filter),
    ]);

    return {
      items,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    };
  },

  /**
   * Get a single lead by ID.
   * No ownership check here — the route-level RBAC controls access;
   * fine-grained ownership enforced in update/delete.
   */
  async getById(id: string): Promise<ILead> {
    const lead = await Lead.findById(id);
    if (!lead) throw new AppError("Lead not found", 404);
    return lead;
  },

  /**
   * Create a new lead owned by the requesting user.
   */
  async create(input: CreateLeadInput, ownerId: string): Promise<ILead> {
    const lead = await Lead.create({ ...input, owner: ownerId });
    return lead;
  },

  /**
   * Update a lead. Sales reps can only update leads they own.
   * Admins may update any lead.
   */
  async update(
    id: string,
    input: UpdateLeadInput,
    userId: string,
    role: UserRole,
  ): Promise<ILead> {
    const existing = await Lead.findById(id);
    if (!existing) throw new AppError("Lead not found", 404);

    // Ownership guard: sales reps cannot edit other users' leads
    if (role !== "admin" && existing.owner.toString() !== userId) {
      throw new AppError("Forbidden: you do not own this lead", 403);
    }

    const updated = await Lead.findByIdAndUpdate(id, input, {
      new: true,
      runValidators: true,
    });
    if (!updated) throw new AppError("Lead not found", 404);
    return updated;
  },

  /**
   * Delete a lead. Only admins can call this (enforced at route level too).
   */
  async remove(id: string): Promise<void> {
    const result = await Lead.findByIdAndDelete(id);
    if (!result) throw new AppError("Lead not found", 404);
  },

  /**
   * Aggregate lead counts by status using a single MongoDB $group pipeline.
   * Used by the dashboard to avoid N+1 API calls.
   * Admins see global stats; sales reps see only their own pipeline.
   */
  async stats(userId: string, role: UserRole): Promise<LeadStats> {
    const matchStage =
      role === "admin" ? {} : { owner: userId };

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ];

    const results = await Lead.aggregate<{ _id: LeadStatus; count: number }>(
      pipeline,
    );

    // Build the full status map with 0 defaults so the shape is always consistent
    const byStatus = STATUS_ARRAY.reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<LeadStatus, number>,
    );

    let total = 0;
    for (const row of results) {
      byStatus[row._id] = row.count;
      total += row.count;
    }

    return { total, byStatus };
  },
};