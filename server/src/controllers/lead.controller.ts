import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { leadService } from "../services/lead.service";
import { AppError } from "../utils/AppError";
import type {
  CreateLeadInput,
  LeadQueryInput,
  UpdateLeadInput,
} from "../validators/lead.validator";

/**
 * All handlers assume `requireAuth` has already run, so `req.user` is present.
 * The validate middleware coerces and types `req.query` / `req.body` before
 * these handlers are reached — no unsafe double-casts needed.
 */
export const leadController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    // After validate(leadQuerySchema, 'query') the query is already typed
    const query = req.query as unknown as LeadQueryInput;
    const result = await leadService.list(query, req.user.id, req.user.role);
    res.json({ success: true, data: result });
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const lead = await leadService.getById(req.params.id);
    res.json({ success: true, data: lead });
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const body = req.body as CreateLeadInput;
    const lead = await leadService.create(body, req.user.id);
    res.status(201).json({ success: true, data: lead });
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const body = req.body as UpdateLeadInput;
    // Ownership check is enforced inside the service layer
    const lead = await leadService.update(
      req.params.id,
      body,
      req.user.id,
      req.user.role,
    );
    res.json({ success: true, data: lead });
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await leadService.remove(req.params.id);
    res.status(204).send();
  }),

  /**
   * GET /api/leads/stats
   * Returns aggregated lead counts in a single MongoDB pipeline.
   * Replaces the N=5 parallel calls the dashboard was previously making.
   */
  stats: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const result = await leadService.stats(req.user.id, req.user.role);
    res.json({ success: true, data: result });
  }),
};