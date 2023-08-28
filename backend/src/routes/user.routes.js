import { Router } from "express";
import {
  addFollower,
  addFollowing,
  create,
  defaultPhoto,
  list,
  photo,
  read,
  remove,
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
  .put(requireSigin, hasAuthorization, update)
  .delete(requireSigin, hasAuthorization, remove);
router.route("/api/users/:userId/photo").get(photo, defaultPhoto);
router
  .route("/api/follow/:followId/users/:userId")
  .put(requireSigin, hasAuthorization, addFollowing, addFollower);
export default router;
