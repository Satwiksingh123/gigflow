import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { verifyToken } from "../utils/jwt";
import type { UserRole } from "../types";

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Unauthorized", 401));
  }
  try {
    const payload = verifyToken(header.slice(7));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    if (!roles.includes(req.user.role)) return next(new AppError("Forbidden", 403));
    next();
  };
}