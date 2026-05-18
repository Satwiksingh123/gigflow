import { Router } from "express";
import { leadController } from "../controllers/lead.controller";
import { requireAuth, requireRole } from "../middleware/auth";
import { validate } from "../middleware/validate";
import {
  createLeadSchema,
  leadQuerySchema,
  updateLeadSchema,
} from "../validators/lead.validator";

const router = Router();

// All lead routes require authentication
router.use(requireAuth);

// GET /api/leads/stats — must be registered BEFORE /:id to avoid conflict
router.get("/stats", leadController.stats);

router.get("/", validate(leadQuerySchema, "query"), leadController.list);
router.get("/:id", leadController.getById);
router.post("/", validate(createLeadSchema), leadController.create);
router.patch("/:id", validate(updateLeadSchema), leadController.update);
// Only admins can delete leads — enforced at both route and service layers
router.delete("/:id", requireRole("admin"), leadController.remove);

export default router;