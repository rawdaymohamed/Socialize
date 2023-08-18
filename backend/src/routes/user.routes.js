import { Router } from "express";
import { create, list, read, userByID } from "../controllers/user.controller";
import { requireSigin } from "../controllers/auth.controller";
const router = Router();
router.param("userId", userByID);
router.route("/api/users").post(create).get(list);
router.route("/api/users/:userId").get(requireSigin, read);
export default router;
