import { Router } from "express";
import { create } from "../controllers/user.controller";
const router = Router();
router.route("/api/users").post(create);
export default router;
