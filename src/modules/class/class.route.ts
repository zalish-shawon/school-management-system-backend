import express from "express";
import { protect, authorize } from "../../middlewares/auth";
import {
  createClass,
  getClasses,
  getClass,
  updateClass,
  assignClassTeacher,
  refreshStudentCount,
} from "./class.controller";
import {
  createSection,
  updateSection,
  getSections,
} from "./section.controller";

const router = express.Router();
router.use(protect);

// Class
router.post("/addClass", authorize("admin"), createClass);
router.get("/allClasses", authorize("admin","staff"), getClasses);
router.get("/:id", authorize("admin","staff"), getClass);
router.put("/:id", authorize("admin"), updateClass);
router.put("/:id/assign-teacher", authorize("admin"), assignClassTeacher);
router.put("/:id/refresh-student-count", authorize("admin"), refreshStudentCount);

// Section
router.post("/addSection", authorize("admin"), createSection);
router.get("/sections/list", authorize("admin","staff"), getSections);
router.put("/sections/:id", authorize("admin"), updateSection);

export default router;