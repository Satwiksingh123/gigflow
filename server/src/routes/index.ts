import { Router } from "express";
import authRoutes from "./auth.routes";
import leadRoutes from "./lead.routes";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));
router.use("/auth", authRoutes);
router.use("/leads", leadRoutes);

export default router;