import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";
import { AppError } from "../utils/AppError";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json({ success: true, data: result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body as LoginInput);
    res.json({ success: true, data: result });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);
    const user = await authService.me(req.user.id);
    res.json({ success: true, data: user });
  }),
};