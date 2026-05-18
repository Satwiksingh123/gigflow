import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export function notFound(_req: Request, _res: Response, next: NextFunction): void {
  next(new AppError("Route not found", 404));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
    return;
  }

  const message = err instanceof Error ? err.message : "Internal server error";
  // eslint-disable-next-line no-console
  console.error("[error]", err);
  res.status(500).json({ success: false, message });
}