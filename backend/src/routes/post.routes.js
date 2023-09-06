import { Router } from "express";
import { hasAuthorization, requireSigin } from "../controllers/auth.controller";
import {
  create,
  getPostPhoto,
  getRecommended,
  postById,
  read,
  readPostsByUser,
  remove,
  update,
} from "../controllers/post.controller";
import { userByID } from "../controllers/user.controller";

const router = Router();
router.param("userId", userByID);
router.param("postId", postById);
router
  .route("/api/users/:userId/posts")
  .post(requireSigin, hasAuthorization, create)
  .get(requireSigin, readPostsByUser);
router
  .route("/api/users/:userId/posts/recommended")
  .get(requireSigin, hasAuthorization, getRecommended);
router
  .route("/api/users/:userId/posts/:postId")
  .get(requireSigin, read)
  .put(requireSigin, hasAuthorization, update)
  .delete(requireSigin, hasAuthorization, remove);
router
  .route("/api/users/:userId/posts/:postId/photo")
  .get(requireSigin, getPostPhoto);
export default router;
