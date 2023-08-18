import { Router } from "express";
import { login, logout } from "../controllers/auth.controller";
const router = Router();
router.route("/auth/login").post(login);
router.route("/auth/logout").get(logout);
export default router;
