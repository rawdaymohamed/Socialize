import { Router } from "express";
import { hasAuthorization, requireSigin } from "../controllers/auth.controller";
import { create, postById, read } from "../controllers/post.controller";
import { userByID } from "../controllers/user.controller";

const router = Router();
router.param("userId", userByID);
router.param("postId", postById);
router
  .route("/api/users/:userId/posts")
  .post(requireSigin, hasAuthorization, create);
router.route("/api/users/:userId/posts/:postId").get(requireSigin, read);
export default router;
