import { Router } from "express";
import {
  create,
  list,
  read,
  update,
  userByID,
} from "../controllers/user.controller";
import { hasAuthorization, requireSigin } from "../controllers/auth.controller";
const router = Router();
router.param("userId", userByID);
router.route("/api/users").post(create).get(list);
router
  .route("/api/users/:userId")
  .get(requireSigin, read)
  .put(requireSigin, hasAuthorization, update);
export default router;
