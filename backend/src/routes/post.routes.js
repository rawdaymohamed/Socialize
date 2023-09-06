import { Router } from "express";
import { hasAuthorization, requireSigin } from "../controllers/auth.controller";
import { create } from "../controllers/post.controller";
import { userByID } from "../controllers/user.controller";

const router = Router();
router.param("userId", userByID);
router
  .route("/api/users/:userId/posts", requireSigin, hasAuthorization)
  .post(create);
export default router;
