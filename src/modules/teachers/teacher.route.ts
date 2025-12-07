import express from "express";
import { protect, authorize } from "../../middlewares/auth";
import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  softDeleteTeacher,
  assignClass,
  assignSubject,
} from "./teacher.controller";

const router = express.Router();

router.use(protect);

router.post("/addTeacher", authorize("admin"), createTeacher);
router.get("/allTeachers", authorize("admin", "staff"), getTeachers);
router.get("/:id", authorize("admin", "staff"), getTeacher);
router.put("/:id", authorize("admin"), updateTeacher);
router.delete("/:id", authorize("admin"), softDeleteTeacher);

router.put("/:id/assign-class", authorize("admin"), assignClass);
router.put("/:id/assign-subject", authorize("admin"), assignSubject);

export default router;