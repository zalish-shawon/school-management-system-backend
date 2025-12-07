import express from "express";
import { protect, authorize } from "../../middlewares/auth";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./user.controller";

const router = express.Router();

router.use(protect);
router.use(authorize("admin"));

router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;